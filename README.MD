# 第五週：插件

## HEX JS 第五週主線任務 - 表單驗證

- [github page連結](https://rockalen.github.io/js-training-week5/index.html)



## 本週三大重點：

- Vue Filter
- Vue 原型觀念與 $refs
- Vue 的插件


## Filter

Vue 除了 Component 以外，還有另外兩個[兄弟](https://cn.vuejs.org/v2/api/#选项-资源)：
- Component
- Directive: 稱為指令，像是 v-model, v-for 這類型都是，官方也允許開發者自訂指令
    - 可參考：https://cn.vuejs.org/v2/api/#Vue-directive
- Filter: 過濾器，概念源自於 Angular.js，可以在資料呈現前改變資料

呈現結果參考：
```
{{ message | filterA }}
```

## 原型概念

這段介紹的概念影響：
- Vue 的語法藏在哪邊
- 區域屬性與全域方法
- 套件裝在哪？

## refs

- 不需要透過 JS 直接選用畫面上的物件

## 外部插件

常見的套件載入方式：
1. 註冊為全域元件
2. 使用 use 加載為 Vue 的原型方法（或者直接使用 CDN 帶入函式）

元件介紹：
- Vue loading
- VeeValidate

表單觀念介紹：https://developers.google.com/web/fundamentals/design-and-ux/input/forms?hl=zh-tw

---
tags: JavaScript 實戰班
---
# Vue Filter
- filter用途:
轉換一些常用的格式，因為是常用的，所以一般放全域就可以了
例如:千分位逗號、時間格式等 (主要應用在單一值上面)
> [More info about filter](https://vuejs.org/v2/guide/filters.html)

```=vue
<template>
    <div>
        <!-- {{ 要帶入的變數 | filter名稱 }} -->
        {{ text | reverse }}
    </div>
</template>

<script>
Vue.filter(moda'名稱',function(參數){
 console.log(filter,參數)
 return 參數 
})
</script>
```


# Vue 原型觀念與 $refs
## 原型觀念
- 建立在原型內的方法或屬性，任何實作後的實體都會擁有原型的方法和屬性

- 第一層 Vue 的實體、元件 -> [屬性](https://vuejs.org/v2/api/#Instance-Properties)
    - 第二層 \_\_proto\_\_ （原型）-> 方法
    - https://vuejs.org/v2/api/#Instance-Methods-Data
    - https://vuejs.org/v2/api/#Instance-Methods-Events
    - https://vuejs.org/v2/api/#Instance-Methods-Lifecycle

![](https://i.imgur.com/jwak9vz.png)

## JS屬性與方法
```
 var person = {
 name:`小明`, //屬性
 callName: function(){ //方法
 }

```

## $refs
- 類似利用js取的DOM元素
- 在元件內是獨立的，名稱必須唯一(類似DOM的id)
```vue=
<template>
    <div ref="modal"></div>
</template>
<script>
<!-- 取得DOM元素 -->
this.$refs.modal
</script>
```
> 因為在元件內唯一名稱即可，所以限制不像DOM的id這麼嚴苛，同時也是使用$refs的優點。

# Vue 的插件
- [vue-loading-overlay](https://www.npmjs.com/package/vue-loading-overlay)
![](https://i.imgur.com/BQvhQjm.png)
```vue=
<template>
<script src="https://cdn.jsdelivr.net/npm/
vue-loading-overlay@3.3.2/dist/vue-loading.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vue-loading-overlay@3.3.2/dist/vue-loading.css"/>
</head>
<body>
<div id="app"></div>
</template>

<script>
// console.log(VueLoading);
// 全域註冊為元件的方式
Vue.component('loading', VueLoading);
// 作為藍圖屬性的方式
Vue.use(VueLoading)
</script>
```

- [vee-validate](https://logaretm.github.io/vee-validate/)

```html=
<script src="https://cdnjs.cloudflare.com/ajax/libs/vee-validate/3.3.0/vee-validate.full.min.js"></script>

<validation-observer v-slot="{ invalid }">
   <!-- 表單送出改為使用 form submit 的方法 -->
  <form @submit.prevent="submitForm">
    <validation-provider rules="required|email" class="form-group" tag="div" v-slot="{ errors, classes, passed }">
      ...
    </validation-provider>
    <!-- 送出表單使用 submit 的方法，如果驗證未通過則 disabled 該按鈕 -->
    <button type="submit" class="btn btn-primary" :disabled="invalid">送出表單</button>
  </form>
</validation-observer>

Vue.component('validationObserver',VeeValidate.observer)
```

[詳細可參考老師提供的手冊](https://hackmd.io/@hexschool/HJDbvkFqU/%2F9b7KBGvbSiOYWMmVMjAHSQ)
