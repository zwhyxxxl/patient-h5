// import type{ Route } from 'vue-router';
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index.vue')
  },
  //tabBar
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/article',
        component: () => import('@/views/article/index.vue'),
        meta: { title: '健康百科' }
      },
      {
        path: '/notify',
        component: () => import('@/views/notify/index.vue'),
        meta: { title: '消息通知' }
      },
      {
        path: '/user',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/user/patient',
    component: () => import('@/views/user/patientPage.vue'),
    meta: { title: '家庭档案' }
  },
  {
    path: '/consult/fast',
    component: () => import('@/views/consult/ConsultFast.vue'),
    meta: { title: '极速问诊' }
  },
  {
    path: '/consult/dep',
    component: () => import('@/views/consult/ConsultDep.vue'),
    meta: { title: '选择科室' }
  },
  {
    path: '/consult/illness',
    component: () => import('@/views/consult/ConsultIllness.vue'),
    meta: { title: '病情描述' }
  },
  {
    path: '/consult/pay',
    component: () => import('@/views/consult/ConsultPay.vue'),
    meta: { title: '问诊支付' }
  },
  {
    path: '/room',
    component: () => import('@/views/room/index.vue'),
    meta: { title: '问诊室' }
    // beforeEnter(to:Route) {
    //   if (to.query.payResult === 'false') return '/user/consult'
    // }
  },
  {
    path: '/user/consult',
    component: () => import('@/views/user/consultPage.vue'),
    meta: { title: '问诊记录' }
  },
  {
    path: '/user/consult/:id',
    component: () => import('@/views/user/consultDetail.vue'),
    meta: { title: '问诊详情' }
  },
  {
    path: '/medicine/pay',
    component: () => import('@/views/medicine/OrderPay.vue'),
    meta: { title: '药品支付' }
  },
  {
    path: '/order/pay/result',
    component: () => import('@/views/medicine/OrderPayResult.vue'),
    meta: { title: '药品支付结果' }
  },
  {
    path: '/order/:id',
    component: () => import('@/views/medicine/OrderDetail.vue'),
    meta: { title: '药品订单详情' }
  },
  {
    path: '/order/logistics/:id',
    component: () => import('@/views/medicine/OrderLogistics.vue'),
    meta: { title: '物流详情' }
  }
]
export default routes