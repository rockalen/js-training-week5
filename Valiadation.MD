---
tags: JavaScript 實戰班
---


# 第五週 驗證套件手冊

## 如何為單一表單(input) 進行驗證

VeeValiadation 分為兩個版本，一個版本是核心功能，並不包含預設的驗證功能，會建議同學直接載入包含驗證功能的 full 版本。

- 文件：[https://logaretm.github.io/vee-validate/overview.html#installation](https://logaretm.github.io/vee-validate/overview.html#installation)
- CDN: [https://cdnjs.com/libraries/vee-validate](https://cdnjs.com/libraries/vee-validate)

#### 步驟一

載入 vee-validate full 的版本（包含規則）。

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/vee-validate/3.3.0/vee-validate.full.min.js"></script>
```


#### 步驟二

註冊全域的表單驗證元件（ValidationProvider）

```
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
```


#### 步驟三

1. 建立 validation-provider 元件：
	1. rules 帶上驗證的規則，規則列表可[參考](https://logaretm.github.io/vee-validate/guide/rules.html#rules)。注意：規則之間不需要帶上空白鍵。
	2. v-slot 帶上預計回傳的回饋內容，常用的可參考下方範例，完整列表可[參考](https://logaretm.github.io/vee-validate/api/validation-provider.html#scoped-slot-props)
2. 建立 input 欄位內容
3. 將回饋帶至驗證（v-slot 的內容）
```
<validation-provider rules="required|email" v-slot="{ errors }">
  <!-- 輸入框 -->
  <label for="email">Email</label>
  <input id="email" type="email" name="email" v-model="email"
      class="form-control">
  <!-- 錯誤訊息 -->
  <span>{{ errors[0] }}</span>
</validation-provider>
```


> 備註：v-slot 稱為插槽（Vue 的元件語法之一），可以將驗證結果的回饋資料直接帶入於區塊中，相關概念可參考：
https://cn.vuejs.org/v2/guide/components-slots.html#%E4%BD%9C%E7%94%A8%E5%9F%9F%E6%8F%92%E6%A7%BD


#### 步驟四

加入樣式，JavaScript 加入 Bootstrap 樣式設定，可使用以下設定，或[參考官方文件](https://logaretm.github.io/vee-validate/guide/state.html#css-classes)。

```js
// Class 設定檔案
VeeValidate.configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  }
});
```

將 HTML 的部分進行更新
- v-slot 增加 `classes`
- input 增加 `:class="classes"`

```html
<validation-provider rules="required|email" v-slot="{ errors, classes }">
  <!-- 輸入框 -->
  <label for="email">Email</label>
  <input id="email" type="email" name="email" v-model="email"
    class="form-control" :class="classes">
  <!-- 錯誤訊息 -->
  <span class="invalid-feedback">{{ errors[0] }}</span>
</validation-provider>
```


#### 步驟五

增加多國語系的方法

- 參考文件：[https://logaretm.github.io/vee-validate/guide/localization.html#using-the-default-i18n](https://logaretm.github.io/vee-validate/guide/localization.html#using-the-default-i18n)
- 語系檔案：[https://github.com/logaretm/vee-validate/tree/master/locale](https://github.com/logaretm/vee-validate/tree/master/locale)

下載 `zh_TW.json`檔案，並修改成 ESModule 的形式匯出，格式可參考：

```js
export default {
  "code": "zh_TW",
  "messages": {
    "alpha": "{_field_} 須以英文組成",
    ...
  }
}
```

將多國語系匯入，並加入設定檔案。

```
// 匯入語系檔案
import zh_TW from './zh_TW.js';

// 加入至 VeeValidate 的設定檔案
VeeValidate.localize('tw', zh_TW);
```

範例（不包含多國語系）：https://codepen.io/Wcc723/pen/ExPdGpX?editors=1010

----

## 如何為完整表單進行驗證

#### 步驟一

載入 vee-validate full 的版本（包含規則）。

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/vee-validate/3.3.0/vee-validate.full.min.js"></script>
```


#### 步驟二

註冊全域的表單驗證元件（ValidationProvider、ValidationObserver）

```js
// 將 VeeValidate input 驗證工具載入 作為全域註冊
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);

// 將 VeeValidate 完整表單 驗證工具載入 作為全域註冊
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
```


#### 步驟三

建立 validation-observer 元件：v-slot 帶上預計回傳的回饋內容，常用的可參考下方範例，完整列表可[參考](https://logaretm.github.io/vee-validate/api/validation-provider.html#scoped-slot-props)

```js
<validation-observer v-slot="{ invalid }">
</validation-observer>
```

#### 步驟四

加入 <validation-provider>，方法可參考上篇的 「如何為單一表單(input) 進行驗證」

#### 步驟五

加入 `form` 標籤及 `button` 標籤：
- 表單送出改為使用 form submit 的方法
- 送出表單使用 submit 的方法，如果驗證未通過則 disabled 該按鈕


```html
<!-- validation-observer 驗證整體表單 -->
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
```

完整範例：https://codepen.io/Wcc723/pen/zYrmeYP?editors=1010

#### 使用 JS 觸發驗證

1. `v-slot` 加入 `handleSubmit`
2. 表單送出改為 `handleSubmit(自訂方法)`

```html
<validation-observer v-slot="{ handleSubmit }">
  <form @submit.prevent="handleSubmit(submitForm)">
    ...
    <button type="submit" class="btn btn-primary">送出表單</button>
  </form>
</validation-observer>
```


完整範例：https://codepen.io/Wcc723/pen/QWyZYjE?editors=1010