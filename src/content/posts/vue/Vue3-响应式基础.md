---
title: 'Vue3 笔记：响应式基础'
published: 2025-08-16
image: "./vue.png"
category: Vue
tags: [Vue, 学习笔记]
---

最近翻 Vue3 文档，重新过了一遍响应式的基础内容。之前用的时候总有些细节记不清，比如 ref 和 reactive 到底该怎么选、为什么有时候改了数据页面不更，这次特意整理了笔记（过程中也借助了大模型辅助梳理逻辑、补充细节😉），主要是给自己后续查着方便，内容以复习要点为主，可能有理解不到位的地方，先记下来慢慢修正。

官方文档：[响应式基础 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)

## 一. 声明响应式状态

### 1. 组合式 API：ref()

定义：ref() 接收参数，并将其包裹在一个带有 .value 属性的 ref 对象中返回：

```js
import { ref } from 'vue'
const count = ref(0)
count.value++ // 修改值
```

- 模板使用：无需 .value，自动解包；可直接在事件监听器中修改（如@click="count++"）。
- 优势：支持所有数据类型（原始值、对象等），可传递给函数并保持响应性。
- 简化语法：在`<script setup>`中，顶层声明的ref和方法可直接在模板使用，无需手动暴露。

> 注意：在 JavaScript 中需要 .value 来访问和修改 ref 的值。

### 2. 组合式 API：reactive()

定义：reactive()接收对象 / 数组等，返回其响应式代理（Proxy），直接通过属性访问 / 修改。

```js
import { reactive } from 'vue'
const state = reactive({ count: 0 })
state.count++ // 修改值
```

特性：代理与原始对象不等价（reactive(raw) !== raw），同一原始对象多次调用reactive()返回同一代理。

## 二. 核心特性

### 1. 深层响应式

默认行为：ref()和reactive()均默认实现深层响应性，嵌套对象 / 数组的修改会被追踪。

```js
const obj = ref({ nested: { count: 0 } })
obj.value.nested.count++ // 触发响应式更新
```

浅层响应性：可通过shallowRef（仅.value访问被追踪）或shallowReactive（仅顶层属性响应式）关闭深层响应性，优化性能。

### 2. DOM 更新时机

异步更新：Vue 会在“next tick”更新周期中缓冲所有状态的修改，以确保不管你进行了多少次状态修改，每个组件都只会被更新一次。
等待更新：需在 DOM 更新后执行代码时，使用nextTick()：

```js
async function increment() {
  count.value++
  await nextTick() // 此时DOM已更新
}
```

## 三. reactive() 的局限性

reactive() API 有一些局限性：

- 有限的值类型：它只能用于对象类型 (对象、数组和如 Map、Set 这样的集合类型)。它不能持有如 string、number 或 boolean 这样的原始类型。

- 不能替换整个对象：由于 Vue 的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地“替换”响应式对象，因为这样的话与第一个引用的响应性连接将丢失。

- 对解构操作不友好：解构属性为本地变量或传递给函数时，响应性连接断开。

> Vue官方建议：优先使用ref()作为响应式状态声明的主要 API。

## 四. ref 解包细节

作为 reactive 对象的属性：自动解包，行为类似普通属性。

```js
const count = ref(0)
const state = reactive({ count })
console.log(state.count) // 0（自动解包）
state.count = 1
console.log(count.value) // 1
```

数组 / 集合中：不会自动解包，需显式使用.value。

```js
const books = reactive([ref('Vue Guide')])
console.log(books[0].value) // 需显式.value
```

模板中：仅顶级属性自动解包，嵌套属性需解构为顶级属性才能解包。

```js
const object = { id: ref(1) }
const { id } = object // 解构为顶级属性
```

模板中`{{ id + 1 }}`生效（解包），而`{{ object.id + 1 }}`不生效（未解包）。

如果 ref 是文本插值的最终计算值 (即 `{{ }}` 标签)，会自动解包。该特性仅仅是文本插值的一个便利特性，等价于 `{{ object.id.value }}`。

## 五、关键问题

### 为什么 ref 需要 .value 访问？

因为在标准的 JavaScript 中，检测普通变量的访问和修改是行不通的。但可以通过 getter 和 setter 方法来拦截对象属性的 get 和 set 操作。

而 ref 的设计思路是：用一个对象包裹原始值，这个对象只暴露一个 `.value` 属性。通过为 `.value` 定义 getter 和 setter，Vue 就能在你访问 `xxx.value` 时追踪依赖（收集谁在用这个值），在你修改 `xxx.value = ...` 时触发更新（通知用到这个值的地方重新渲染）。

简单说，`.value` 是 Vue 为了让原始类型也能具备响应式，而 “绕的一小步”—— 通过对象属性的拦截能力，间接实现对原始值的追踪。

### ref()和reactive()的核心区别是什么？

① 支持类型：ref()支持所有数据类型（原始值、对象等），reactive()仅支持对象、数组等非原始类型；
② 访问方式：ref()需通过.value访问 / 修改值，reactive()直接通过属性访问；
③ 局限性：reactive()存在无法替换对象、解构丢失响应性等问题，ref()无这些限制；
④ 解包规则：ref()在模板中自动解包，作为响应式对象属性时也自动解包，而reactive()无类似解包逻辑。

### 为什么修改响应式状态后 DOM 没有立即更新？如何确保在 DOM 更新后执行代码？

Vue 会将所有状态修改缓冲到 “next tick” 更新周期中，确保每个组件只更新一次，提升性能。若需在 DOM 更新后执行代码，可使用nextTick()全局 API，它返回一个 Promise，在 DOM 更新完成后 resolve。示例：

```js
import { nextTick } from 'vue'
async function update() {
  count.value++
  await nextTick()
  // DOM已更新
}
```

### 在模板中使用ref时，为什么有时需要显式.value，有时不需要？

模板中ref的解包规则为：
① 顶级属性自动解包（无需.value），如`const count = ref(0)`在模板中`{{ count }}`生效；
② 嵌套属性（如`object.id`，其中id是ref）不会自动解包，需解构为顶级属性（`const { id } = object`）才能解包；
③ 若ref是文本插值的最终值（如`{{ object.id }}`），会自动解包（等价于`{{ object.id.value }}`）。因此，非顶级嵌套ref在模板中参与计算时需先解构，否则需显式处理。

### 浅层响应性的核心适用场景是什么？

**核心适用场景：数据 “大而不变” 或 “仅需整体替换”**
当数据满足以下特征时，用浅层响应性可以显著提升性能：

**处理 “大型不可变数据”（如后端返回的海量列表）**
**场景**：从后端获取的大型列表（如 1000 条以上数据），且业务中只需要展示、不需要修改其中的嵌套属性（仅可能整体替换列表）。
**问题**：如果用普通ref或reactive，Vue 会递归地将所有嵌套属性转为响应式（创建大量 Proxy），导致初始化时性能开销大。
**解决方案**：用shallowRef，只追踪.value的整体替换，不处理内部属性：

```js
import { shallowRef } from 'vue'
// 假设data是包含1000条数据的大型数组
const bigList = shallowRef(data) 

// ✅ 有效：整体替换时触发更新（符合业务需求）
bigList.value = newData 

// ❌ 无效：修改内部属性不会触发更新（但业务本就不需要修改）
bigList.value[0].name = '新名字' 
```

**管理 “纯展示性的复杂对象”（如配置项、图表数据）**
**场景**：页面中的配置对象（如表单布局配置、图表的 option），结构复杂但运行中不会修改嵌套属性，只会整体替换。
**问题**：深层响应性会对嵌套的每个对象 / 数组创建 Proxy，而这些 Proxy 完全用不上，属于浪费。
**解决方案**：用shallowReactive（对象）或shallowRef（整体替换）：

```js
import { shallowReactive } from 'vue'
// 复杂配置对象，仅用于展示，不修改内部属性
const chartOptions = shallowReactive({
  xAxis: { type: 'category' },
  series: [{ data: [1, 2, 3] }]
})

// ✅ 有效：修改顶层属性会触发更新（如果需要）
chartOptions.xAxis = { type: 'value' }

// ❌ 无效：修改嵌套属性不触发更新（业务不需要）
chartOptions.series[0].data.push(4) 
```

**手动控制更新时机（避免频繁触发）**
**场景**：需要批量修改数据，且希望 “修改完所有内容后再统一更新 DOM”，而不是每改一个属性就更新一次。
**问题**：普通响应式会在每次修改时触发更新，批量操作时可能导致多次无用渲染。
**解决方案**：用shallowRef配合triggerRef（手动触发更新）：

```js
import { shallowRef, triggerRef } from 'vue'
const formData = shallowRef({ name: '', age: 0 })

// 批量修改（不会触发更新）
formData.value.name = '张三'
formData.value.age = 20
// ...更多修改

// 手动触发一次更新（减少渲染次数）
triggerRef(formData) 
```

**不适用场景：警惕 “过度优化”**
浅层响应性的 “性能优化” 是有代价的 —— 丢失了深层追踪能力，因此以下场景绝对不能用：

- 数据需要修改嵌套属性（如用户信息对象{ user: { name: 'xxx' } }，需要修改name）；
- 数据结构简单（如仅包含 1-2 层的小对象），此时深层响应性的性能开销可忽略，没必要用浅层；
- 新手对响应式原理不熟悉，容易因 “修改不触发更新” 导致 bug。

> 浅层响应性是 “按需关闭深层追踪” 的优化手段，核心适用场景是：
> **数据结构复杂但仅需整体替换，或嵌套属性完全不需要修改。**
> 它的设计不是为了 “替代” 普通响应式，而是在特定场景下（如处理大型数据）减少不必要的性能消耗，属于 “进阶优化技巧”，需结合具体业务判断是否使用。
