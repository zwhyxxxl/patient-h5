import { createApp } from 'vue'
// import { createPinia } from 'pinia'
import pinia from './stores/index'
import App from './App.vue'
import router from './router'
import '@/styles/index.scss'
// 样式全局使用
// import 'vant/lib/index.css'

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'virtual:svg-icons-register'
const app = createApp(App)

// app.use(createPinia())
app.use(pinia)
app.use(router)

app.mount('#app')
