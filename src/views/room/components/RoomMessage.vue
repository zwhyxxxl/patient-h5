<script setup lang="ts">
import type { Message, Prescription } from '@/types/room'
import { IllnessTime, MsgType, PrescriptionStatus } from '@/enums'
import { timeOptions, flagOptions } from '@/services/const'
import type { Image } from '@/types/consult'
import { showToast } from 'vant'
import { showImagePreview } from 'vant'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores'

import { getPrescriptionPic } from '@/services/consult'
import { useRouter } from 'vue-router'

import EvaluateCard from './EvaluateCard.vue'
const store = useUserStore()
const router = useRouter()
const formatTime = (time: string) => dayjs(time).format('HH:mm')
//接收聊天列表
defineProps<{
  list: Message[]
}>()
//定义格式化时间和是否就诊过的方法
const formatIllness = (val: IllnessTime) => {
  return timeOptions.find((item) => {
    return item.value === val
  })?.label
}
const formatFlag = (val: 0 | 1) => {
  return flagOptions.find((item) => item.value === val)?.label
}
const previewImg = (pictures?: Image[]) => {
  console.log(pictures)
  if (pictures && pictures.length) {
    showImagePreview(pictures.map((item) => item.url))
  } else {
    showToast('没有上传图片')
  }
}
const loadSuccess = () => {
  window.scrollTo(0, document.body.scrollHeight)
}
//查看原始处方
const showPrescription = async (id: string) => {
  const res = await getPrescriptionPic(id)
  showImagePreview([res.data.url])
}
//点击购买处方药品（跳转页面）
const goPay = (pre: Prescription) => {
  //1.处方失效
  if (pre.status === PrescriptionStatus.Invalid) {
    return showToast('处方失效')
  } else if (pre.status === PrescriptionStatus.NotPayment) {
    return router.push(`/medicine/pay?id=${pre.id}`)
  }
}
</script>

<template>
  <template v-for="{ msgType, msg, createTime, from, id, fromAvatar } in list" :key="id">
    <!-- 病情描述 -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom" v-if="msg.consultRecord">
        <p>
          {{ msg.consultRecord.patientInfo.name }}
          {{ msg.consultRecord.patientInfo.genderValue }}
          {{ msg.consultRecord.patientInfo.age }}岁
        </p>
        <p>
          <!-- 患病时间 -->
          {{ formatIllness(msg.consultRecord.illnessTime) }} |
          <!-- 是否就诊过 -->
          {{ formatFlag(msg.consultRecord.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="previewImg(msg.consultRecord?.pictures)"> 点击查看 </van-col>
      </van-row>
    </div>
    <!-- 温馨提示 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 通用通知 -->
    <div class="msg msg-tip" v-if="msgType === 31">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 我发的消息 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgText && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image :src="store.user?.avatar" />
    </div>

    <!-- 医生发的消息 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgText && store.user?.id !== from">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>
    <!-- 我发的图片消息 -->
    <div class="msg msg-to" v-if="msgType === MsgType.MsgImage && store.user?.id === from">
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image @load="loadSuccess" fit="contain" :src="msg.picture?.url" />
      </div>
      <van-image :src="store.user?.avatar" />
    </div>
    <!-- 医生发的图片消息 -->
    <div class="msg msg-from" v-if="msgType === MsgType.MsgImage && store.user?.id !== from">
      <van-image :src="fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image @load="loadSuccess" fit="contain" :src="msg.picture?.url" />
      </div>
    </div>

    <!-- 处方 -->
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content" v-if="msg.prescription">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p @click="showPrescription(msg.prescription?.id)">
              原始处方 <van-icon name="arrow"></van-icon>
            </p>
          </div>
          <p>
            {{ msg.prescription.name }}
            {{ msg.prescription.genderValue }}
            {{ msg.prescription.age }}岁
            {{ msg.prescription.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription.createTime }}</p>
        </div>
        <div class="body">
          <div class="body-item" v-for="med in msg.prescription.medicines" :key="med.id">
            <div class="durg">
              <p>{{ med.name }} {{ med.specs }}</p>
              <p>{{ med.usageDosag }}</p>
            </div>
            <div class="num">x{{ med.quantity }}</div>
          </div>
        </div>
        <div class="foot">
          <span @click="goPay(msg.prescription)">购买药品</span>
        </div>
      </div>
    </div>
    <!-- 通知-结束 -->
    <div class="msg msg-tip msg-tip-cancel" v-if="msgType === MsgType.NotifyCancel">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 评价卡片，后期实现 -->
    <div
      class="msg msg-comment"
      v-if="msgType === MsgType.CardEva || msgType === MsgType.CardEvaForm"
    >
      <evaluate-card :evaluateDoc="msg.evaluateDoc" />
    </div>
  </template>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
