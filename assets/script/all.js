import zh from './zh_TW.js';

// 自定義設定檔案，錯誤的 className
VeeValidate.configure({
    classes: {
      valid: 'is-valid',
      invalid: 'is-invalid',
    },
});
  
  // 載入自訂規則包
  VeeValidate.localize('tw', zh);
  
  // 將 VeeValidate input 驗證工具載入 作為全域註冊
  Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
  // 將 VeeValidate 完整表單 驗證工具載入 作為全域註冊
  Vue.component('ValidationObserver', VeeValidate.ValidationObserver);


// 掛載 Vue-Loading 套件
Vue.use(VueLoading);
// 全域註冊 VueLoading 並設定為 loading
Vue.component('loading', VueLoading);
// money，千分號轉換
Vue.filter('money', function(num) {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + parts.join('.');
});
new Vue({
    el: '#app',
    data: {
        products: [],
        tempProduct: {
            // num: 0,
            selectNum: 0,
        },        
        form: {
            name: '',
            email: '',
            tel: '',
            address: '',
            payment: '',
            message: '',
        },
        cart: {},
        cartTotal: 0,
        isLoading: false,
        user: {
            UUID: '1e46f421-bbae-4212-8539-55ea1c5329cf',
            API_PATH: 'https://course-ec-api.hexschool.io/api/',
        },
        status: {
            loadingBtn: '',
        },
    },
    created(){
        this.getProducts();
        this.getCart();
    },
    methods:{
        // 取得產品列表並渲染畫面
        getProducts(page = 1) {
            this.isLoading = true;
            const api = `${this.user.API_PATH}${this.user.UUID}/ec/products?page=${page}`;
            // console.log(api);
            axios.get(api).then((response) => {
                this.products = response.data.data; 
                this.isLoading = false;
            }).catch((err) =>{
                console.log(err);
            });
        },
        // 取得產品詳細資訊並開啟Modal
        getProduct(id) {
            // 設定按鈕disable,spinner效果
            this.status.loadingBtn = id;        
          
            const api = `${this.user.API_PATH}${this.user.UUID}/ec/product/${id}`;
            // axios非同步遠端取得資料
            axios.get(api).then((response) => {
                this.tempProduct = response.data.data;
              
                // 強制雙向綁定訂購數量     
                this.$set(this.tempProduct, 'selectNum', 0);
            
                // 判斷select 數量與該產品在購物車數量一致則selected
                if (this.cart.length) {
                    this.cart.forEach(itemCart => {
                        if (itemCart.product.id === this.tempProduct.id) {                            
                            this.$set(this.tempProduct, 'selectNum', itemCart.quantity);
                        }  
                    });                
               };
                // 開啟產品頁modal
                $('#productModal').modal('show');
                // 取回資料後取消按鈕disable,spinner效果
                this.status.loadingBtn = '';
            }).catch((err) => {
                console.log(err);
            });
        },
        // 詳細產品Modal內select改變數量後賦予selectNum
        changeSelected(event){
            this.$set(this.tempProduct, 'selectNum', event.target.value);            
        },
        // 取得購物車內產品列表
        getCart() { 
            this.isLoading = true;           
            // 每次價格要清空，總價才會對
            this.cartTotal = 0;
            const api = `${this.user.API_PATH}${this.user.UUID}/ec/shopping`;           
            axios.get(api).then((response) => {
                this.cart = response.data.data
                this.cart.forEach((item) => {
                    // 每個產品單價*數量的累加等於總價   
                    this.cartTotal += (item.product.price * item.quantity);
                });
                this.isLoading = false;
            });
        },
        // 增加產品到購物車
        addToCart(item, quantity = 1) {
            this.status.loadingBtn =  item.id;
            const api = `${this.user.API_PATH}${this.user.UUID}/ec/shopping`;
            const cart = {
                product: item.id,
                quantity,
            }
            axios.post(api, cart).then((response) => {
                this.getCart();
                this.status.loadingBtn = '';
                $('#productModal').modal('hide');
            }).catch((error) => {
                console.log(error.response.data.errors[0]);
                alert(error.response.data.errors[0]);
                this.status.loadingBtn = '';
                $('#productModal').modal('hide');
            }); 
        },
        // 購物車內產品數量計算
        quantityCalc(id, num) {
            // this.status.loadingBtn = id;
            this.isLoading = true;
            const api = `${this.user.API_PATH}${this.user.UUID}/ec/shopping`;
            const data = {
                product: id,
                quantity: num,
            }
            axios.patch(api, data).then(() => {
                this.isLoading = false;
                this.getCart();
                $('#productModal').modal('hide');
                // this.status.loadingBtn = '';
            }).catch((error) => {
                this.isLoading = false;
                // this.status.loadingBtn = '';
                 $('#productModal').modal('hide');
                 alert(error.response.data.errors[0]);
            });
        },
        // 移除購物車內單項產品
        delFromCart(id) {
            this.isLoading = true;
            const api = `${this.user.API_PATH}${this.user.UUID}/ec/shopping/${id}`;
            axios.delete(api).then(() => {
                this.isLoading = false;
                this.getCart();
            });
        },
        // 移除購物車所有內容
        removeCartAll() {
            this.isLoading = true;
            const api = `${this.user.API_PATH}${this.user.UUID}/ec/shopping/all/product`;
            axios.delete(api).then(() =>{
                this.isLoading = false;
                this.getCart();
            });
        },
        // 完成訂單
        successOrder() {
            this.isLoading = true;
            const api = `${this.user.API_PATH}${this.user.UUID}/ec/orders`;
            axios.post(api, this.form).then((response) =>{
                if (response.data.data.id){
                    // this.cartTotal = response.data.data.amount;
                    // console.log(this.cartTotal);
                    $('#successModal').modal('show');
                    this.isLoading = false;
                    this.getCart();
                };
            }).catch((error) =>{
                this.isLoading = false;
                console.log(error.response.data.message);
            });
        },
    },
})