<!--
  活动详情页骨架屏组件
  使用 wot-design-uni 的 wd-skeleton 组件
-->
<script setup lang="ts">
interface Props {
  /** 是否显示 */
  show: boolean
}

defineProps<Props>()
</script>

<template>
  <view v-if="show" class="min-h-screen bg-gray-50">
    <!-- 头部图片骨架 -->
    <view class="h-60 w-full">
      <wd-skeleton :row-num="1" row-height="240px" animation="flashed" />
    </view>

    <!-- 标题卡片骨架 -->
    <view class="relative z-20 mx-4 mb-4 rounded-2xl bg-white p-6 shadow-lg -mt-8">
      <!-- 标题 -->
      <wd-skeleton :row-num="1" row-width="80%" animation="flashed" />

      <!-- 作者信息 -->
      <view class="mt-4 border-t border-gray-100 pt-3">
        <view class="flex items-center py-2">
          <wd-skeleton avatar animation="flashed" />
          <view class="ml-3 flex-1">
            <wd-skeleton :row-num="2" :row-width="['60%', '40%']" animation="flashed" />
          </view>
        </view>
      </view>

      <!-- 时间信息 -->
      <view class="flex items-center py-2">
        <wd-skeleton avatar animation="flashed" />
        <view class="ml-3 flex-1">
          <wd-skeleton :row-num="2" :row-width="['60%', '40%']" animation="flashed" />
        </view>
      </view>
    </view>

    <!-- 内容卡片骨架 -->
    <view class="mx-4 mb-4 rounded-2xl bg-white p-6 shadow-sm">
      <view class="mb-4 flex items-center border-b border-gray-100 pb-3">
        <wd-skeleton :row-num="1" row-width="80%" animation="flashed" />
      </view>
      <wd-skeleton :row-num="5" :row-width="['100%', '60%', '80%', '100%', '60%']" animation="flashed" />
    </view>

    <!-- 操作按钮骨架 -->
    <view class="mx-4 mb-4">
      <wd-skeleton :row-num="1" row-height="48px" animation="flashed" />
    </view>
  </view>
</template>
