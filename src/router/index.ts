import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
//前置路由守卫
// 访问权限控制
//白名单
const wihteList = ['/login']
router.beforeEach((to) => {
  NProgress.start()
  // 用户仓库
  const store = useUserStore()
  // 不需要登录的页面，白名单
  // 如果没有登录且不在白名单内，去登录
  if (!store.user?.token && !wihteList.includes(to.path)) return '/login'
  // 否则不做任何处理
})
router.afterEach((to) => {
  document.title = `在线问诊-${to.meta.title || ''}`
  NProgress.done()
})
export default router
