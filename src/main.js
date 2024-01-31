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
import mypageLayout from './Layouts/mypageLayout.vue'

// 메인 페이지
import MainPage from './views/MainPage.vue'

// 마이 페이지
import mypageMain from './mypage/mypageMain.vue'
import mypagemk from './mypage/mypagemk.vue'
import myStock from './mypage/myStock.vue'
import mypageAI from './mypage/mypageAI.vue'

// 로그인 페이지
import login from './views/login.vue'
import find from './views/find.vue'
import findPw from './views/findPw.vue'

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
        path: 'find',
        name: 'find',
        component: find,
      },
      {
        path: 'findPw',
        name: 'findPw',
        component: findPw,
      },
      {
        path: 'signup',
        name: 'signup',
        component: signup,
      },

    ]
  },
   {
    path: '/mypage/',
    name: 'mypage',
    component: mypageLayout,
    children: [
      {
        path: '',
        name: 'mypageMain',
        component: mypageMain,
      },
      {
        path: 'mypagemk',
        name: 'mypagemk',
        component: mypagemk,

      },
      {
        path:'myStock',
        name:'myStock',
        component:myStock,
      },
      {
        path:'ai',
        name:'mypageAI',
        component:mypageAI,
      },
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