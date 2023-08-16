<script setup lang="ts">
import { request } from '@/utils/request'
// import type { User } from '@/types/user'
// import { Button as VanButton } from 'vant'
import { useUserStore } from '@/stores'
import type { User } from '@/types/user'

// 测试，请求拦截器，是否携带token，响应拦截器401拦截到登录地址
const getUserInfo = async () => {
  const res = await request('/patient/myUser')
  console.log(res)
}

// 测试，响应拦截器，出现非10000的情况，和返回剥离后的数据
const store = useUserStore()
const login = async () => {
  const res = await request('/login/password', 'POST', {
    mobile: '13211112222',
    // 密码 abc123456 测试：出现非10000的情况
    password: 'abc12345'
  })
  // console.log('test' + res);
  store.setUser(res.data as User)
}
</script>

<template>
  <router-link to="/login">跳转</router-link>
  <van-button type="primary" @click="getUserInfo">获取个人信息</van-button>
  <van-button class="test" type="primary" @click="login">登录</van-button>
  <van-button type="primary">主要按钮</van-button>
  <van-cell-group>
    <van-cell title="单元格" value="内容" />
    <van-cell title="单元格" value="内容" label="描述信息" />
  </van-cell-group>
  <img src="@/icons/consult/alipay.svg" alt="" />
  <svg aria-hidden="true">
    <!-- #icon-文件夹名称-图片名称 -->
    <use href="#icon-login-eye-off" />
  </svg>
  <cp-icon name="login-eye-off"></cp-icon>
</template>

<style lang="scss" scoped>
$fontColor: red;

.test {
  color: $fontColor;
}
</style>
