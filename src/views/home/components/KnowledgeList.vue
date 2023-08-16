<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import type { KnowledgeType, KnowledgeList, KnowledgeParams } from '@/types/consult'
import { getKnowledgePage } from '@/services/consult'
const props = defineProps<{
  type: KnowledgeType
}>()
const loading = ref(false)
const finished = ref(false)
const list = ref<KnowledgeList>([])
const parmas = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
const onLoad = async () => {
  const res = await getKnowledgePage(parmas.value)
  // console.log(res)
  list.value.push(...res.data.rows)
  if (res.data.pageTotal <= parmas.value.current) {
    finished.value = true
  } else {
    parmas.value.current++
  }
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
