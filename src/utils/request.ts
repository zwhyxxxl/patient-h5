import axios, { AxiosError, type Method } from 'axios'
import { useUserStore } from '@/stores/index'
import { showToast } from 'vant'
import router from '@/router'
const store = useUserStore()
const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL: baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    if (store.user?.token && config.headers) {
      config.headers['Authorization'] = `Bearer ${store.user?.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    if (res.data?.code !== 10000) {
      showToast(res.data?.message || '业务失败')
      return Promise.reject(res.data)
    }
    // TODO 4. 摘取核心响应数据
    return res.data
  },
  (err) => {
    // console.log(err)

    // TODO 5. 处理401错误
    if (err.response?.status === 401) {
      // 删除用户信息
      store.delUser()
      // 跳转登录，带上接口失效所在页面的地址，登录完成后回跳使用
      router.push({
        path: '/login',
        query: { returnUrl: router.currentRoute.value.fullPath }
      })
    }
    return Promise.reject(err)
  }
)

// 这个需要替换axsio.request默认的响应成功后的结果类型
// 之前是：传 { name: string } 然后res是   res = { data: { name: string } }
// 但现在：在响应拦截器中返回了 res.data  也就是将来响应成功后的结果，和上面的类型一致吗？
// 所以要：request<数据类型，数据类型>() 这样才指定了 res.data 的类型
// 但是呢：后台返回的数据结构相同，所以可以抽取相同的类型

// 4. 请求工具函数
type Data<T> = {
  code: number
  message: string
  data: T
}

const request = <T>(url: string, method: Method = 'GET', submitData?: object) => {
  // 参数：地址，请求方式，提交的数据
  // 返回：promise
  return instance.request<any, Data<T>>({
    url,
    method,
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData
  })
}

export { baseURL, instance, request }
