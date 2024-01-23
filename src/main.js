import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSweetalert2 from 'vue-sweetalert2'

// 레이아웃
import defaultLayout from './Layouts/defaultLayout.vue'
import emptyLayout from './Layouts/emptyLayout.vue'

// 메인 페이지
import MainPage from './views/MainPage.vue'

// 로그인 페이지
import login from './views/login.vue'

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
        path: '/',
        name: 'login',
        component: login,
      }
    ]
  }
]

// window.Kakao.init('앱 키')

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.use(store)
app.use(vuetify)
app.use(VueSweetalert2)
app.mount('#app')
