---
title: Vue3 笔记：透传 Attributes
published: 2025-08-22
image: "./vue.png"
category: Vue
tags: [Vue, 学习笔记]
---

在 Vue 组件开发中，属性传递是核心场景之一。props 适用于明确声明的属性，但当需要灵活传递未声明的属性或事件、封装第三方组件时，**透传 Attributes** 成为更高效的解决方案。

## 一、什么是透传 Attributes？

官方定义：**透传 Attributes 指传递给组件但未被声明为 props 或 emits 的 attribute 或 v-on 事件监听器**，最常见的包括 `class`、`style`、`id` 以及自定义事件等。

在 Vue3 中，透传 Attributes 会被收集到组件实例的 `$attrs` 中，可通过 `useAttrs()`（script setup）或 `this.$attrs`（选项式 API）访问。

### 访问 $attrs 的两种方式

1. script setup 中：useAttrs ()

    ```javascript
    import { useAttrs } from 'vue';
    const attrs = useAttrs();
    ```

2. 选项式 API 中：this.$attrs

    ```javascript
    export default {
      mounted() {
        console.log(this.$attrs); // 直接通过实例访问
      }
    };
    ```

官方明确指出，`$attrs` **不是响应式对象**（出于性能优化考虑）。虽然它会随着父组件传递的属性变化而更新（始终反映最新状态），但无法通过 `watch` 或 `watchEffect` 直接监听其变化。

例如，以下代码无法触发监听逻辑：

```javascript
import { useAttrs, watch } from 'vue';
const attrs = useAttrs();

// 无效：无法监听 $attrs 的变化
watch(attrs, (newVal) => {
  console.log('attrs 变化了', newVal);
});
```

若需要在 `$attrs` 变化时执行副作用，官方推荐两种方案：

1. **使用 props**：将需要响应的属性通过 `defineProps` 声明（props 是响应式的）；

2. 使用 `onUpdated` 钩子：在组件更新时（`$attrs`已同步最新值）执行逻辑：

   ```javascript
   import { useAttrs, onUpdated } from 'vue';
   const attrs = useAttrs();
   
   onUpdated(() => {
     // 每次更新时获取最新的 attrs
     console.log('最新的 attrs', attrs);
   });
   ```

## 二、透传 Attributes 的基础特性

### 1. 自动收集未声明属性

父组件传递的属性中，未被子组件通过 `defineProps` 声明的部分，会自动归入 `$attrs`：

```html
<!-- 父组件 Parent.vue -->
<template>
  <Child id="user-card" class="card" title="用户信息" />
</template>

<!-- 子组件 Child.vue -->
<template>
  <div>{{ title }}</div>
</template>
<script setup>
import { useAttrs, onMounted } from 'vue';

// 仅声明 title 为 props
const props = defineProps(['title']);
// 获取透传的剩余属性
const attrs = useAttrs();

onMounted(() => {
  console.log(attrs); // { id: 'user-card', class: 'card' }
});
</script>
```

### 2. 自动绑定到根元素

默认情况下，子组件的 **根元素会自动绑定 `$attrs`**。上述示例中，Child 组件的根元素 `<div>` 会被渲染为：

```html
<div id="user-card" class="card">用户信息</div>
```

这一特性在封装基础组件时尤为实用，无需手动转发属性。

### 3. class 与 style 的特殊处理

`class`和`style`是特殊的透传Attributes：当子组件根元素已有自身的`class`和`style`时，会与透传的`class`和`style`自动合并，而非覆盖：

```html
<!-- 子组件 Child.vue -->
<template>
  <!-- 根元素自身有 class -->
  <div class="base">用户信息</div>
</template>

<!-- 父组件传递 class="card" 后，渲染结果： -->
<div class="base card">用户信息</div>
```

## 三、控制透传行为：inheritAttrs 选项

默认情况下，`$attrs` 会自动绑定到根元素。若需自定义绑定目标（如非根元素），可通过 `defineOptions` 设置 `inheritAttrs: false` 禁用自动绑定，再手动绑定 `$attrs`。

### 1. 绑定到非根元素

```html
<!-- 子组件 Child.vue -->
<template>
  <div class="wrapper">
    <!-- 手动将 $attrs 绑定到内部元素 -->
    <div class="content" v-bind="$attrs">
      {{ title }}
    </div>
  </div>
</template>
<script setup>
import { useAttrs, defineOptions } from 'vue';

// 禁用根元素自动绑定
defineOptions({ inheritAttrs: false });

const props = defineProps(['title']);
const attrs = useAttrs(); // 仍可访问 $attrs，仅禁用自动绑定
</script>
```

渲染结果：`id` 和 `class` 仅绑定到 `.content`，而非根元素 `.wrapper`。

### 2. 多根节点组件的强制手动绑定

Vue3 支持多根节点组件，但此时 **`$attrs` 不会自动绑定到任何节点**，必须手动指定绑定位置，否则会触发警告：

```html
<!-- 多根节点组件（正确示例） -->
<template>
  <div>节点1</div>
  <!-- 手动绑定 $attrs 到需要的节点 -->
  <div v-bind="$attrs">节点2（接收透传属性）</div>
</template>
<script setup>
// 若未手动绑定，会触发警告：
// [Vue warn]: Extraneous non-props attributes were passed but could not be inherited
</script>
```

## 四、嵌套组件的透传

当组件层级超过两层（如 Parent → Middle → Child）时，`$attrs` **不会自动传递给深层子组件**，需中间组件手动转发。

### 1. 未转发导致的属性丢失

```html
<!-- 三层结构：Parent → Middle → Child -->
<!-- Parent.vue 传递属性：id、class、title -->
<!-- Middle.vue（未转发 $attrs） -->
<template>
  <div>
    <h3>中间组件</h3>
    <Child /> <!-- 未绑定 $attrs，Child 无法接收属性 -->
  </div>
</template>
```

此时 Child 组件的 `$attrs` 为空，无法获取 Parent 传递的属性。

### 2. 手动转发的两种方式

#### （1）全量转发（推荐）

通过 `v-bind="$attrs"` 将中间组件的 `$attrs` 全部转发给子组件：

```html
<!-- Middle.vue（全量转发） -->
<template>
  <div>
    <h3>中间组件</h3>
    <Child v-bind="$attrs" /> <!-- 关键：转发所有透传属性 -->
  </div>
</template>
```

#### （2）选择性转发

如需过滤或加工属性，可从 `$attrs` 中提取指定属性转发：

```html
<!-- Middle.vue（选择性转发） -->
<template>
  <div>
    <h3>中间组件</h3>
    <Child 
      :title="attrs.title?.toUpperCase()" <!-- 加工后转发 -->
      :desc="attrs.desc" 
    />
  </div>
</template>
<script setup>
import { useAttrs } from 'vue';
const attrs = useAttrs();
</script>
```

### 3. 中间组件声明 props 后的透传规则

若中间组件通过 `defineProps` 声明了部分属性，这些属性会从 `$attrs` 中移除，转发时仅包含未声明的剩余属性：

```html
<!-- Middle.vue（声明了 title 为 props） -->
<script setup>
const props = defineProps(['title']); // title 被声明为 props
const attrs = useAttrs(); // attrs 仅包含未声明的 id、class、desc
</script>
```

此时 `v-bind="$attrs"` 仅转发 `id`、`class`、`desc`，若 Child 需要 `title`，需中间组件手动传递：`<Child :title="title" v-bind="$attrs" />`。

## 五、v-on 监听器继承

Vue3 中，`$attrs` 不仅包含属性，还包含父组件传递的 **v-on 事件监听器**（事件以 `onXxx` 形式存在，如 `@click` 对应 `attrs.onClick`）。转发 `$attrs` 时，事件会自动同步传递。

```html
<!-- 父组件传递事件 -->
<template>
  <Child @click="handleClick" @input="handleInput" />
</template>

<!-- 子组件接收并转发事件 -->
<template>
  <button v-bind="$attrs">点击我</button> <!-- 点击会触发父组件的 handleClick -->
</template>
<script setup>
import { useAttrs } from 'vue';
const attrs = useAttrs();
console.log(attrs); // { onClick: ƒ, onInput: ƒ }
</script>
```

> 与 Vue2 区别：Vue2 中事件需通过 `$listeners` 单独转发，Vue3 中事件统一归入 `$attrs`，简化了转发逻辑。

## 六、适用场景与不适用场景

### 适用场景

1. **封装第三方组件**
   无需声明第三方组件的所有属性，通过 `v-bind="$attrs"` 自动转发，减少代码冗余：

   ```html
   <!-- 封装 Element Plus 的 ElInput -->
   <template>
     <el-input v-bind="$attrs" v-model="modelValue" />
   </template>
   <script setup>
   const props = defineProps(['modelValue']);
   </script>
   ```

2. **多层级属性透传**
   超过 2 层的组件结构（如 Page→Card→Form→Input），用 `v-bind="$attrs"` 转发比每层声明 props 更高效。

3. **动态属性传递**
   接收不确定的动态属性（如后端配置的表单属性），`$attrs` 可作为灵活的容器。

### 不适用场景

1. **需要类型校验**
   `$attrs` 无类型校验，需严格校验时用 props：

   ```javascript
   // 推荐：用 props 做类型校验
   const props = defineProps({
     age: { type: Number, required: true }
   });
   ```

2. **需要默认值**
   `$attrs` 无法设置默认值，需默认值时用 props 的 `default` 选项。

3. **属性需加工处理**
   需修改属性值（如格式化）时，建议通过 props 接收后加工再传递。

## 七、常见问题与解决方案

### 1. 样式冲突（class/style 自动合并）

**问题**：透传的 `class`/`style` 与子组件根元素样式冲突。
**解决方案**：禁用自动绑定，手动控制绑定位置：

```html
<template>
  <div class="parent">
    <!-- 仅将非样式属性转发给子组件 -->
    <Child v-bind="filterAttrs" />
  </div>
</template>
<script setup>
import { useAttrs, computed, defineOptions } from 'vue';
defineOptions({ inheritAttrs: false }); // 禁用根元素自动绑定

const attrs = useAttrs();
// 过滤 class 和 style
const filterAttrs = computed(() => {
  const { class: _, style: __, ...rest } = attrs;
  return rest;
});
</script>
```

### 2. 中间组件声明的 props 无法传递到子组件

**问题**：中间组件声明的 props 不在 `$attrs` 中，导致子组件无法获取。
**解决方案**：中间组件手动传递已声明的 props：

```html
<!-- Middle.vue -->
<template>
  <Child v-bind="$attrs" :title="title" /> <!-- 手动传递 title -->
</template>
<script setup>
const props = defineProps(['title']); // title 被声明为 props
</script>
```

## 总结

透传 Attributes（`$attrs`）是 Vue3 组件通信的重要补充，核心价值在于**简化未声明属性 / 事件的传递**。关键知识点：

- `$attrs` 包含未被 props 声明的属性和事件，需通过 `useAttrs()` 或 `this.$attrs` 访问；
- 单根组件默认自动绑定 `$attrs` 到根元素，`inheritAttrs: false` 可禁用此行为；
- 多根组件必须手动绑定 `$attrs`，否则会触发警告；
- 嵌套组件需通过 `v-bind="$attrs"` 手动转发 `$attrs`；
- 适合封装第三方组件、多层透传和动态属性场景，不适合需要类型校验或默认值的场景。

通过合理使用 `$attrs`，可大幅提升组件的灵活性和开发效率。

> 官方文档完整参考：[透传 Attributes | Vue.js](https://cn.vuejs.org/guide/components/attrs.html)
