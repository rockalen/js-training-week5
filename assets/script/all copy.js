// money，千分號轉換
Vue.filter('money', function(num) {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + parts.join('.');
});
new Vue({
    el: '#app',
    data: {
        // 202007改成模組內透過 isNew 來判斷 :class ，較為簡潔   
        // modalClass: {
        //     'rotate': false,
        //     'bg-primary': false,
        //     'bg-success': false,
        // },
        products: [],
        pagination:{},
        isLoading: false,
        tempProduct: {
            imageUrl: [],
            options: {},
        },
        isNew: true,
        status: {
            fileUploading: false,
        },
        user:{
            token: '',
            uuid: '1e46f421-bbae-4212-8539-55ea1c5329cf',
            apiPath: 'https://course-ec-api.hexschool.io/api/',
        },
        loadingBtn: '',
    },
    created() {
        // 取得使用者 token 
        this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 若 token 為空則跳回登入頁面
        if (this.user.token === '') {
            window.location = 'login.html';
        }
        // 紀錄預設共同驗證用 token 權限
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
        // 透過 getProducts() 函數取得遠端產品列表並刷新畫面
        this.getProducts();
    },
    methods: {
        // 取得產品列表函數
        getProducts(page = 1) {
            this.isLoading = true;
            // 1.設定遠端API位置
            const api = `${this.user.apiPath}${this.user.uuid}/admin/ec/products?page=${page}`;
            // 2.透過 axios.get 取得API回應資料
            axios.get(api).then((response) => {
                // 3.將回應資料存入產品列表資料並刷新頁面
                this.products = response.data.data;
                // 4.將遠端頁數回應資料存入產品頁數資料並給 pagination 元件做後續處理
                this.pagination = response.data.meta.pagination;
                // loading 效果清空
                this.loadingBtn = '';
                this.isLoading = false;
            }).catch((error)=>{
                console.log(error.message)
                this.isLoading = false;
                window.location = 'login.html';
            });
        },
       
        // 跳出新增、修改、刪除視窗函式
        openModal(act, item) {
            switch(act){
                case 'new':
                    // 使用 refs 觸發子元件清空
                    this.$refs.productModel.tempProduct = {
                    imageUrl: [],
                    options: {},//自行新增相關欄位亦一併清空
                  };
                    // 202007改成模組內透過 isNew 來判斷 :class ，較為簡潔   
                    // this.modalClass['bg-primary'] = true;
                    // this.modalClass['bg-success'] = false;                   
                    this.isNew = true;
                    $('#productModal').modal('show');
                    break;
                case 'edit':
                    // 202007改成模組內透過 isNew 來判斷 :class ，較為簡潔  
                    // this.modalClass['bg-primary'] = false;
                    // this.modalClass['bg-success'] = true;
                    // this.isLoading = true;
                    this.loadingBtn = this.tempProduct.id;
                    this.isNew = false;
                    
                    this.tempProduct = Object.assign({},item);
                    //this.tempProduct = JSON.parse(JSON.stringify(item));
                    // 使用 refs 觸發子元件getProduct方法
                    this.$refs.productModel.getProduct(this.tempProduct.id);
                    //console.log(this.tempProduct.id)
                    $('#productModal').modal('show');
                    this.loadingBtn = '';
                    // this.isLoading = false;
                    break;
                case 'delete':
                    this.tempProduct = JSON.parse(JSON.stringify(item));
                    $('#delProductModal').modal('show');
                    break;
                default:
                    break;
            }
        },
        // 設定產品啟用函式
        setProductEnabled(item) {    
            this.loadingBtn = item.id;       
            // 1.深層複製單筆產品資料至暫存 tempProduct
            this.tempProduct = JSON.parse(JSON.stringify(item));
            // 2.設定API位置
            const api = `${this.user.apiPath}${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`
            // 3.設定是否上架，如果已上架，設定為下架，反之設定為上架
            if (this.tempProduct.enabled){
                this.tempProduct.enabled = false;
            }else{
                this.tempProduct.enabled = true;
            }
            // 4.使用 axios.patch API 非同步更新遠端資料
            axios.patch(api,this.tempProduct).then(() => {
            // 5.更新完成後即刷新產品列表
                this.getProducts();              
            }).catch((error) =>{
                console.log(error);
            })

        },
        // 登出函式
        logout() {
            // 1.document.cookie 本地token及到期日清空
            document.cookie = `token=;expires=;path=/`;
            // 2.登入成功後轉產品列表頁
            window.location = 'login.html';
        },         
       
    },
});