import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSweetalert2 from 'vue-sweetalert2'
import mixins from './mixins'

// 레이아웃
import defaultLayout from './Layouts/defaultLayout.vue'
import emptyLayout from './Layouts/emptyLayout.vue'
import adminLayout from './Layouts/adminLayout.vue'

// 메인 페이지
import MainPage from './views/MainPage.vue'

// 로그인 페이지
import login from './views/login.vue'

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

window.Kakao.init('d40e0d148a2c546987b5286344a10dae')

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
app.mount('#app')
