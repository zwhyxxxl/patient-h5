<script setup lang="ts">
import ConsultItem from './ConsultItem.vue'
import { ConsultType } from '@/enums'
import { getConsultOrderList } from '@/services/consult'
import type { ConsultOrderListParams, ConsultOrderItem } from '@/types/consult'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps<{ type: ConsultType }>()
const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
const loading = ref(false)
const finished = ref(false)
const list = ref<ConsultOrderItem[]>([])
const onLoad = async () => {
  const res = await getConsultOrderList(params.value)
  list.value.push(...res.data.rows)
  if (params.value.current < res.data.pageTotal) {
    params.value.current++
  } else {
    finished.value = true
  }
  loading.value = false
  // console.log(list.value)
}
const onDelete = (id: String) => {
  list.value = list.value.filter((item) => item.id !== id)
  if (!list.value.length) onLoad()
}
const gotoDetail = (item: ConsultOrderItem) => {
  router.push(`/user/consult/${item.id}`)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item
        @on-delete="onDelete"
        v-for="item in list"
        :key="item.id"
        :item="item"
        @click="gotoDetail(item)"
      ></consult-item>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
