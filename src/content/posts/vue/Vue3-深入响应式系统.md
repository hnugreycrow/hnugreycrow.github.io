---
title: Vue3 笔记：深入响应式系统
published: 2025-08-18
image: "./vue.png"
category: 学习笔记
tags: [Vue]
---

## 什么是响应性

响应性是一种声明式处理变化的编程范式：当依赖数据变化时，依赖其计算的结果会自动更新。例如 Excel 中单元格通过公式关联，修改源单元格时目标单元格自动更新；而 JavaScript 默认不具备此特性，需通过特定机制实现。

官方文档：[深入响应式系统 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html#runtime-vs-compile-time-reactivity)

## Vue 中响应性的实现原理

Vue 通过拦截对象属性的读写操作，追踪依赖并在数据变化时触发更新，核心依赖**Proxy**（用于`reactive`）和**getter/setter**（用于`ref`）实现。

### 1. 响应式对象的创建

- **`reactive()`实现**：通过 Proxy 创建对象代理，拦截属性的`get`（读取）和`set`（修改）操作：

  ```js
  function reactive(obj) {
    return new Proxy(obj, {
      get(target, key) {
        track(target, key); // 追踪依赖
        return target[key];
      },
      set(target, key, value) {
        target[key] = value;
        trigger(target, key); // 触发更新
      },
    });
  }
  ```

- **`ref()`实现**：通过对象的`getter/setter`拦截`value`属性的读写（用于原始值或非对象值）：

  ```js
  function ref(value) {
    const refObject = {
      get value() {
        track(refObject, "value"); // 追踪依赖
        return value;
      },
      set value(newValue) {
        value = newValue;
        trigger(refObject, "value"); // 触发更新
      },
    };
    return refObject;
  }
  ```

### 2. 依赖追踪（`track(target, key)`）与更新触发（`trigger(target, key)`）的详细机制

在 Vue 的响应式系统中，`track()` 和 `trigger()` 是实现 “数据变化自动触发更新” 的核心函数。前者负责记录 “谁依赖了数据”，后者负责在数据变化时 “通知依赖者更新”，二者配合完成从数据追踪到副作用执行的闭环。

#### （1）依赖追踪：`track(target, key)` 的作用与实现细节

`track()` 的核心任务是：**当响应式数据的属性被读取时，记录当前正在运行的 “副作用”（effect），并将其与该属性关联起来**，以便后续数据变化时能精准触发这个副作用。

- **触发时机**：`track()` 会在响应式对象的属性被访问（即触发 `get` 拦截器）时调用。例如：
  - 访问 `reactive` 对象的属性（如 `obj.foo`）时，Proxy 的 `get` 方法会调用 `track(obj, 'foo')`。
  - 访问 `ref` 的 `value` 属性（如 `count.value`）时，`get value()` 会调用 `track(refObject, 'value')`。

- **核心逻辑**：

  ```js
  // 全局变量：当前正在运行的副作用（仅在副作用执行期间有效）
  let activeEffect;

  function track(target, key) {
    // 只有当存在活跃的副作用时才进行追踪
    if (activeEffect) {
      // 1. 查找目标对象 target 中 key 对应的副作用集合
      const effects = getSubscribersForProperty(target, key);
      // 2. 将当前活跃的副作用添加到该集合中
      effects.add(activeEffect);
    }
  }
  ```

- **依赖存储结构**：`WeakMap<target, Map<key, Set<effect>>>`
  `track()` 需要一个全局的数据结构来保存 “目标对象→属性→副作用集合” 的映射关系，具体结构为：
  - **外层：`WeakMap<target, Map>`**：键是响应式对象（`target`），值是一个 Map（存储该对象所有属性的副作用）。
  - **中层：`Map<key, Set<effect>>`**：键是对象的属性名（`key`），值是一个 Set（存储依赖该属性的所有副作用）。
  - **内层：`Set<effect>`**：存储依赖该属性的所有副作用函数（确保副作用不重复）。

  `getSubscribersForProperty(target, key)` 函数的作用就是根据这个结构查找或创建副作用集合：

  ```js
  // 伪代码：获取属性对应的副作用集合
  function getSubscribersForProperty(target, key) {
    // 1. 为目标对象创建一个 Map（若不存在）
    const targetMap = globalWeakMap.get(target) || new Map();
    if (!globalWeakMap.has(target)) {
      globalWeakMap.set(target, targetMap);
    }
    // 2. 为属性创建一个 Set（若不存在）
    const effectSet = targetMap.get(key) || new Set();
    if (!targetMap.has(key)) {
      targetMap.set(key, effectSet);
    }
    return effectSet;
  }
  ```

- **关键：`activeEffect` 的作用**：`activeEffect` 是一个全局变量，仅在副作用函数执行期间被赋值为当前副作用。这使得 `track()` 能精准识别 “谁正在依赖这个属性”，并将其加入依赖集合。

#### （2）更新触发：`trigger(target, key)` 的作用与实现细节

`trigger()` 的核心任务是：**当响应式数据的属性被修改时，找到该属性的所有依赖副作用，并执行这些副作用**，从而实现 “数据变化→自动更新”。

- **触发时机**：`trigger()` 会在响应式对象的属性被修改（即触发 `set` 拦截器）时调用。例如：
  - 修改 `reactive` 对象的属性（如 `obj.foo = 2`）时，Proxy 的 `set` 方法会调用 `trigger(obj, 'foo')`。
  - 修改 `ref` 的 `value` 属性（如 `count.value = 2`）时，`set value(newValue)` 会调用 `trigger(refObject, 'value')`。

- **核心逻辑**：

  ```js
  function trigger(target, key) {
    // 1. 查找目标对象 target 中 key 对应的副作用集合
    const effects = getSubscribersForProperty(target, key);
    // 2. 执行所有副作用（重新运行依赖该属性的代码）
    effects.forEach((effect) => effect());
  }
  ```

- **执行副作用的意义**：副作用函数通常包含依赖数据的计算或操作（如更新 DOM、计算属性值等）。当数据变化时，重新执行副作用能确保这些操作基于最新数据执行，从而保持视图或计算结果与数据的同步。例如，在组件渲染场景中，副作用函数是组件的渲染函数：当数据变化时，`trigger()` 会触发渲染函数重新执行，生成新的虚拟 DOM 并更新页面。

#### （3）`track()` 与 `trigger()` 的协同流程示例

以一个简单的响应式场景为例，完整流程如下：

1. **初始化响应式数据**：

   ```js
   const count = ref(0); // 创建 ref，内部通过 getter/setter 拦截 value 访问
   ```

2. **创建响应式副作用**：

   ```js
   watchEffect(() => {
     // 副作用函数：依赖 count.value，用于更新 DOM
     document.body.innerHTML = `Count: ${count.value}`;
   });
   ```

   - `watchEffect` 会包装副作用函数，执行前将其设为 `activeEffect`（`activeEffect = 当前副作用`）。
   - 执行副作用时，访问 `count.value` 触发 `get` 拦截器，调用 `track(count, 'value')`。
   - `track()` 发现 `activeEffect` 存在，将该副作用加入 `count` 的 `value` 属性对应的副作用集合中。

3. **修改数据触发更新**：

   ```js
   count.value = 1; // 修改 value，触发 set 拦截器
   ```

   - `set` 拦截器调用 `trigger(count, 'value')`。
   - `trigger()` 找到 `count.value` 对应的副作用集合，执行该副作用函数。
   - 副作用函数重新执行，基于最新的 `count.value` 更新 DOM，页面显示 `Count: 1`。

#### （4）关键特性与边界情况

- **精准触发**：`track()` 只追踪当前活跃的副作用，`trigger()` 只执行被追踪的副作用，确保更新仅影响真正依赖数据的部分，避免不必要的性能消耗。
- **去重处理**：使用 `Set` 存储副作用，避免同一副作用被重复添加，确保每次数据变化时副作用只执行一次。
- **嵌套副作用**：若副作用函数内部又创建了新的副作用（如组件嵌套场景），`activeEffect` 会动态更新为当前执行的副作用，确保依赖关系正确嵌套。

### 3. 响应式副作用

- 副作用：依赖响应式数据、并在数据变化时需重新执行的函数（如更新 DOM、计算结果等）。

- Vue 通过`watchEffect()`创建响应式副作用，其原理是包装副作用函数，执行前将自身设为 “活跃副作用”，使`track()`能识别并关联依赖：

  ```js
  function whenDepsChange(update) {
    const effect = () => {
      activeEffect = effect; // 标记当前活跃副作用
      update(); // 执行副作用（触发依赖追踪）
      activeEffect = null;
    };
    effect(); // 首次执行，建立依赖关系
  }
  ```

  示例：使用`watchEffect`自动更新计算结果：

  ```js
  const A0 = ref(0);
  const A1 = ref(1);
  watchEffect(() => {
    const A2 = A0.value + A1.value; // 追踪A0、A1
  });
  A0.value = 2; // 触发副作用，重新计算A2
  ```

### 4. 计算属性（`computed`）

内部基于响应式副作用实现：当依赖变化时，自动重新计算结果，且会缓存计算值（依赖未变时直接返回缓存）。

```js
const A2 = computed(() => A0.value + A1.value); // 依赖A0、A1，自动更新
```

## 核心逻辑总结

Vue 响应式系统通过 Proxy/getter 拦截属性读写，用`track()`记录依赖（副作用），用`trigger()`在数据变化时触发副作用重新执行，实现 “数据变化→自动更新” 的声明式效果。`reactive`用于对象，`ref`用于原始值，`watchEffect`和`computed`则是基于此机制的高层 API。通过`track()`和`trigger()`的配合，Vue 实现了 “数据驱动” 的核心特性：开发者只需关注数据变化，响应式系统会自动完成依赖追踪和更新触发，大幅简化了状态管理逻辑。
