import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSweetalert2 from 'vue-sweetalert2'
import mixins from './mixins'
import VueApexCharts from 'vue3-apexcharts'

// 레이아웃
import defaultLayout from './Layouts/defaultLayout.vue'
import emptyLayout from './Layouts/emptyLayout.vue'
import adminLayout from './Layouts/adminLayout.vue'

// 메인 페이지
import MainPage from './views/MainPage.vue'
import stock from './views/stock.vue'

//MY종목
import myStock from './views/myStock.vue'

// 로그인 페이지
import login from './views/login.vue'
//회원가입
import signup from './views/signup.vue'

// 관리자 페이지
import admin from './admin/adminMain.vue'

const routes = [
  {
    path: '/',
    name: 'defaultLayout',
    component: defaultLayout,
    children: [
      {
        path: '/',
        name: 'MainPage',
        component: MainPage
      },
      {
        path: '/stock/:code',
        name: 'stock',
        component: stock
      }
    ]
  },
  {
    path: '/login/',
    name: 'login',
    component: emptyLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: login,
      },
      {
        path: 'signup',
        component: signup,
      },
      {
        path: '/mystock',
        name: 'mystock',
        component: myStock,
      }
    ]
  },
  {
    path: '/admin/',
    name: 'admin',
    component: adminLayout,
    children: [
      {
        path: '',
        name: 'admin',
        component: admin
      }
    ]
  }
]

window.Kakao.init(process.env.VUE_APP_KAKAO_API_KEY);

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.use(store)
app.use(vuetify)
app.use(VueSweetalert2)
app.mixin(mixins)
app.use(VueApexCharts)
app.mount('#app')
