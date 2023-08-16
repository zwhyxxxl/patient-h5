<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { onMounted, onUnmounted } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import type { Message, TimeMessages } from '@/types/room'
import { ref } from 'vue'
import { MsgType, OrderType } from '@/enums'
import { getConsultOrderDetail } from '@/services/consult'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { nextTick } from 'vue'
import { provide } from 'vue'
// ...

const store = useUserStore()
const route = useRoute()
/**
 *初始化创建ws长连接（打电话）
 *1.通过io函数传入后台ws链接地址和相关参数
 **/
const list = ref<Message[]>([])
let socket: Socket
onUnmounted(() => {
  socket.close()
})
onMounted(() => {
  // console.log(list)

  // 建立链接，创建 socket.io 实例
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })

  socket.on('connect', () => {
    // 建立连接成功
    console.log('connect')
  })

  socket.on('error', (event) => {
    // 错误异常消息
    console.log('error')
  })

  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  })

  //接受后端传递的聊天记录
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // console.log(data)
    // 准备转换常规消息列表
    const arr: Message[] = []
    data.forEach((item, i) => {
      //把发送消息的时间push进去
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    // 追加到聊天消息列表
    list.value.unshift(...arr)
    // console.log(list.value)
    // console.log(list.value)
  })
  // 接收消息 在onMounted注册
  socket.on('receiveChatMsg', (event) => {
    console.log(event)

    list.value.push(event)
    nextTick(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  })
  // 订单状态 在onMounted注册
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
    console.log('订单状态发生变化')
  })
})
//订单详情
const consult = ref<ConsultOrderItem>()
const getOrderDetail = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
  // console.log(consult.value)
} //获取订单详情
onMounted(() => {
  getOrderDetail()
})
const sendText = (text: string) => {
  // 发送信息需要  发送人  收消息人  消息类型  消息内容
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id, //接单的医生
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}
const sendImg = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id, //接单的医生
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}
provide('consult', consult)
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <!-- 问诊状态：未接诊，咨询中，问诊结束 -->
    <RoomStatus :status="consult?.status" :countdown="consult?.countdown"></RoomStatus>
    <!-- 问诊聊天列表 -->
    <RoomAction
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-text="sendText"
      @send-image="sendImg"
    ></RoomAction>
    <!-- 底部操作栏:发消息 -->
    <RoomMessage :list="list"></RoomMessage>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
