<!--
  注册页
  功能：模拟注册后跳转登录

  访问地址: http://localhost:9000/#/pages/login/register

  旧代码：未找到（待补充）
-->

<script lang="ts" setup>
import { LOGIN_PAGE } from '@/router/config'

definePage({
  style: {
    navigationBarTitleText: '注册',
  },
})

function doRegister() {
  uni.showToast({
    title: '注册成功',
  })
  /** 注册成功后跳转到登录页 */
  uni.navigateTo({
    url: LOGIN_PAGE,
  })
}
</script>

<template>
  <view class="login">
    <view class="text-center">
      注册页
    </view>
    <button class="mt-4 w-40 text-center" @click="doRegister">
      点击模拟注册
    </button>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
