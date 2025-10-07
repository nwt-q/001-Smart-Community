<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import GlobalLoading from '@/components/global/loading/global-loading.vue'
import GlobalMessage from '@/components/global/message/global-message.vue'
import GlobalToast from '@/components/global/toast/global-toast.vue'
import { navigateToInterceptor } from '@/router/interceptor'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

onLaunch((options) => {
  console.log('App Launch', options)
})
onShow((options) => {
  console.log('App Show', options)
  // 处理直接进入页面路由的情况：如h5直接输入路由、微信小程序分享后进入等
  // https://github.com/unibest-tech/unibest/issues/192
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})
onHide(() => {
  console.log('App Hide')
})
</script>

<template>
  <!-- 全局反馈组件 -->
  <GlobalToast />
  <GlobalMessage />
  <GlobalLoading />
</template>

<style lang="scss">
swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
</style>
