<template>
  <div>
    <cp-nav-bar @click-right="clickRight" title="登录" right-text="登录"></cp-nav-bar>
  </div>
  <div class="login">
    <!-- 头部 -->
    <div class="login-head">
      <h3>密码登录</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>短信验证码登录</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form ref="form" autocomplete="off" @submit="login">
      <van-field
        placeholder="请输入手机号"
        v-model="mobile"
        name="mobile"
        :rules="mobileRules"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPass"
        placeholder="请输入密码"
        v-model="password"
        :rules="passwordRules"
        :type="isShowPass ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon
            @click="isShowPass = !isShowPass"
            :name="`login-eye-${isShowPass ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <van-field :rules="codeRules" v-else placeholder="短信验证码" v-model="code" @click="send">
        <template #button>
          <span :class="{ active: time > 0 }" class="btn-send">
            {{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}</span
          >
        </template>
      </van-field>

      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block native-type="submit" round type="primary">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { loginByPassword, sendMobileCode, loginByCode } from '@/services/user'
import { ref } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showToast } from 'vant'
import { useUserStore } from '@/stores'
import { showSuccessToast, type FormInstance } from 'vant'
import { useRouter } from 'vue-router'
const store = useUserStore()
const isPass = ref(true)
const mobile = ref('13211112222')
const password = ref('abc12345')
const isShowPass = ref(false)
const agree = ref(false)
const code = ref('')
const time = ref(0)
const clickRight = () => {
  // console.log('test')
}
const router = useRouter()
const login = async () => {
  if (!agree.value) return showToast('请勾选')
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByCode(mobile.value, code.value)

  store.setUser(res.data)
  router.push('/')
}
//发送验证码
let timeId: number
const form = ref<FormInstance>()
const send = async () => {
  if (time.value > 0) return
  await form.value?.validate('mobile')

  let res = await sendMobileCode(mobile.value, 'login')

  // console.log(res)
  showSuccessToast('验证码已发送')
  time.value = 60
  clearInterval(timeId)
  timeId = setInterval(() => {
    // console.log(time.value)

    time.value--
    if (time.value <= 0) clearInterval(timeId)
  }, 1000)
}
</script>

<style scoped lang="scss">
.login {
  padding-top: 46px;

  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
