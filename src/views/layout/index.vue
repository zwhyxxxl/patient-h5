<script setup lang="ts"></script>

<template>
  <div class="layout-page">
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item to="/home"
        >首页
        <template #icon="{ active }">
          <cp-icon :name="active ? 'home-index-active' : 'home-index-default'"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/article"
        >健康百科
        <template #icon="{ active }">
          <cp-icon :name="active ? 'home-article-active' : 'home-article-default'"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/notify"
        >消息中心
        <template #icon="{ active }">
          <cp-icon :name="active ? 'home-notice-active' : 'home-notice-default'"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/user"
        >我的
        <template #icon="{ active }">
          <cp-icon :name="active ? 'home-mine-active' : 'home-mine-default'"></cp-icon>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped></style>
