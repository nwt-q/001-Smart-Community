<!--
  活动操作按钮组件
  包含点赞、收藏、分享、报名等功能按钮
-->
<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  /** 活动ID */
  activityId: string
  /** 是否已点赞 */
  isLiked?: boolean
  /** 是否已收藏 */
  isCollected?: boolean
  /** 是否已报名 */
  isRegistered?: boolean
  /** 点赞数量 */
  likeCount?: number
  /** 收藏数量 */
  collectCount?: number
  /** 报名数量 */
  registerCount?: number
  /** 活动状态 */
  status?: string
  /** 是否显示报名按钮 */
  showRegisterButton?: boolean
}

interface Emits {
  (e: 'like', isLiked: boolean): void
  (e: 'collect', isCollected: boolean): void
  (e: 'register', isRegistered: boolean): void
  (e: 'share'): void
}

const props = withDefaults(defineProps<Props>(), {
  isLiked: false,
  isCollected: false,
  isRegistered: false,
  likeCount: 0,
  collectCount: 0,
  registerCount: 0,
  status: 'UPCOMING',
  showRegisterButton: true,
})

const emit = defineEmits<Emits>()

/** 响应式数据 */
const isLikedLocal = ref<boolean>(props.isLiked)
const isCollectedLocal = ref<boolean>(props.isCollected)
const isRegisteredLocal = ref<boolean>(props.isRegistered)
const isLiking = ref<boolean>(false)
const isCollecting = ref<boolean>(false)
const isRegistering = ref<boolean>(false)

/** 计算属性 */
const formattedLikeCount = computed(() => {
  return props.likeCount >= 1000 ? `${(props.likeCount / 1000).toFixed(1)}k` : props.likeCount.toString()
})

const formattedCollectCount = computed(() => {
  return props.collectCount >= 1000 ? `${(props.collectCount / 1000).toFixed(1)}k` : props.collectCount.toString()
})

const formattedRegisterCount = computed(() => {
  return props.registerCount >= 1000 ? `${(props.registerCount / 1000).toFixed(1)}k` : props.registerCount.toString()
})

const canRegister = computed(() => {
  return props.status !== 'COMPLETED' && props.status !== 'CANCELLED' && props.showRegisterButton
})

const registerButtonText = computed(() => {
  if (isRegisteredLocal.value)
    return '取消报名'
  if (props.status === 'ONGOING')
    return '立即报名'
  if (props.status === 'UPCOMING')
    return '预约报名'
  return '已结束'
})

const registerButtonClass = computed(() => {
  if (isRegisteredLocal.value)
    return 'bg-gray-500 text-white'
  if (props.status === 'ONGOING')
    return 'bg-green-500 text-white'
  if (props.status === 'UPCOMING')
    return 'bg-blue-500 text-white'
  return 'bg-gray-300 text-gray-500 cursor-not-allowed'
})

/** 方法 */
async function handleLike() {
  if (isLiking.value)
    return

  isLiking.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    isLikedLocal.value = !isLikedLocal.value
    emit('like', isLikedLocal.value)

    uni.showToast({
      title: isLikedLocal.value ? '点赞成功' : '取消点赞',
      icon: 'success',
      duration: 1500,
    })
  }
  catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none',
      duration: 1500,
    })
  }
  finally {
    isLiking.value = false
  }
}

async function handleCollect() {
  if (isCollecting.value)
    return

  isCollecting.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    isCollectedLocal.value = !isCollectedLocal.value
    emit('collect', isCollectedLocal.value)

    uni.showToast({
      title: isCollectedLocal.value ? '收藏成功' : '取消收藏',
      icon: 'success',
      duration: 1500,
    })
  }
  catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none',
      duration: 1500,
    })
  }
  finally {
    isCollecting.value = false
  }
}

async function handleRegister() {
  if (isRegistering.value || !canRegister.value)
    return

  isRegistering.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))

    isRegisteredLocal.value = !isRegisteredLocal.value
    emit('register', isRegisteredLocal.value)

    if (isRegisteredLocal.value) {
      // 显示报名成功弹窗
      uni.showModal({
        title: '报名成功',
        content: '您已成功报名本次活动，请准时参加。',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#3b82f6',
      })
    }
    else {
      uni.showToast({
        title: '已取消报名',
        icon: 'success',
        duration: 1500,
      })
    }
  }
  catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none',
      duration: 1500,
    })
  }
  finally {
    isRegistering.value = false
  }
}

function handleShare() {
  emit('share')

  // 原生分享功能
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    href: '',
    title: '精彩活动分享',
    summary: '我发现了一个很不错的活动，推荐给你！',
    success: () => {
      uni.showToast({
        title: '分享成功',
        icon: 'success',
        duration: 1500,
      })
    },
    fail: () => {
      // 分享失败，显示其他分享选项
      uni.showActionSheet({
        itemList: ['复制链接', '保存图片'],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 复制链接
            uni.setClipboardData({
              data: `活动详情链接：${props.activityId}`,
              success: () => {
                uni.showToast({
                  title: '链接已复制',
                  icon: 'success',
                  duration: 1500,
                })
              },
            })
          }
          else if (res.tapIndex === 1) {
            uni.showToast({
              title: '功能开发中',
              icon: 'none',
              duration: 1500,
            })
          }
        },
      })
    },
  })
}

function handleContact() {
  uni.makePhoneCall({
    phoneNumber: '400-123-4567',
    fail: () => {
      uni.showToast({
        title: '拨打失败',
        icon: 'none',
        duration: 1500,
      })
    },
  })
}
</script>

<template>
  <view class="activity-actions-container mx-4 max-sm:mx-3">
    <!-- 主操作按钮区域 -->
    <view class="mb-4 flex gap-3">
      <!-- 报名按钮 -->
      <view
        v-if="canRegister"
        class="register-button flex-1"
      >
        <wd-button
          type="primary"
          size="large"
          :loading="isRegistering"
          :disabled="isRegistering || props.status === 'COMPLETED' || props.status === 'CANCELLED'"
          :class="registerButtonClass"
          round
          block
          @click="handleRegister"
        >
          <view class="flex items-center justify-center">
            <wd-icon
              :name="isRegisteredLocal ? 'close' : 'calendar'"
              size="18"
              :custom-class="`i-carbon-${isRegisteredLocal ? 'close' : 'calendar'} mr-2`"
            />
            <text class="font-medium tracking-[0.2rpx]">{{ registerButtonText }}</text>
          </view>
        </wd-button>
      </view>

      <!-- 联系客服按钮 -->
      <view v-if="!canRegister" class="contact-button flex-1">
        <wd-button
          type="primary"
          size="large"
          round
          block
          @click="handleContact"
        >
          <view class="flex items-center justify-center">
            <wd-icon name="phone" size="18" custom-class="i-carbon-phone mr-2" />
            <text class="font-medium tracking-[0.2rpx]">联系客服</text>
          </view>
        </wd-button>
      </view>
    </view>

    <!-- 次要操作按钮区域 -->
    <view
      class="flex items-center justify-around rounded-2xl bg-gray-50 py-4 transition-colors group-hover:bg-gray-100 max-sm:py-3"
      style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid rgba(0, 0, 0, 0.05);"
    >
      <!-- 点赞按钮 -->
      <view
        class="action-item flex flex-col cursor-pointer items-center rounded-xl p-2 transition-all duration-200 active:translate-y-0 hover:bg-gray-100 hover:-translate-y-0.5"
        :class="{ 'text-red-500 like-active': isLikedLocal, 'text-gray-600': !isLikedLocal }"
        @click="handleLike"
      >
        <view class="group relative">
          <wd-icon
            :name="isLikedLocal ? 'like-filled' : 'like'"
            size="24"
            :custom-class="`action-icon i-carbon-${isLikedLocal ? 'thumbs-up-filled' : 'thumbs-up'} transition-transform duration-200 group-hover:scale-110`"
          />
          <view v-if="isLiking" class="absolute inset-0 flex items-center justify-center">
            <wd-loading size="20" />
          </view>
        </view>
        <text class="mt-1 text-xs font-medium tracking-[0.1rpx]">{{ formattedLikeCount }}</text>
      </view>

      <!-- 收藏按钮 -->
      <view
        class="action-item flex flex-col cursor-pointer items-center rounded-xl p-2 transition-all duration-200 active:translate-y-0 hover:bg-gray-100 hover:-translate-y-0.5"
        :class="{ 'text-yellow-500 collect-active': isCollectedLocal, 'text-gray-600': !isCollectedLocal }"
        @click="handleCollect"
      >
        <view class="group relative">
          <wd-icon
            :name="isCollectedLocal ? 'star-filled' : 'star'"
            size="24"
            :custom-class="`action-icon i-carbon-${isCollectedLocal ? 'star-filled' : 'star'} transition-transform duration-200 group-hover:scale-110`"
          />
          <view v-if="isCollecting" class="absolute inset-0 flex items-center justify-center">
            <wd-loading size="20" />
          </view>
        </view>
        <text class="mt-1 text-xs font-medium tracking-[0.1rpx]">{{ formattedCollectCount }}</text>
      </view>

      <!-- 分享按钮 -->
      <view
        class="action-item flex flex-col cursor-pointer items-center rounded-xl p-2 text-gray-600 transition-all duration-200 active:translate-y-0 hover:bg-gray-100 hover:-translate-y-0.5"
        @click="handleShare"
      >
        <view class="group">
          <wd-icon
            name="share"
            size="24"
            custom-class="i-carbon-share transition-transform duration-200 group-hover:scale-110"
          />
        </view>
        <text class="mt-1 text-xs font-medium tracking-[0.1rpx]">分享</text>
      </view>

      <!-- 统计信息 -->
      <view
        v-if="canRegister && props.registerCount > 0"
        class="flex flex-col items-center p-2 text-gray-600"
      >
        <view class="group">
          <wd-icon
            name="group"
            size="24"
            custom-class="i-carbon-group-account transition-transform duration-200 group-hover:scale-110"
          />
        </view>
        <text class="mt-1 text-xs font-medium tracking-[0.1rpx]">{{ formattedRegisterCount }}人报名</text>
      </view>
    </view>

    <!-- 操作提示 -->
    <view
      class="mt-4 rounded-xl bg-blue-50 p-3 max-sm:p-2"
      style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12rpx;"
    >
      <view class="flex items-start">
        <wd-icon name="information" size="16" custom-class="i-carbon-information text-blue-500 mr-2 mt-0.5" />
        <text class="text-xs text-blue-700 leading-relaxed tracking-[0.1rpx]">
          报名成功后，我们将在活动开始前通过短信提醒您，请保持手机畅通。
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 滑入动画定义 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.activity-actions-container {
  animation: slideUp 0.6s ease-out 0.2s both;
}

/* 报名按钮样式 - 使用深度选择器 */
.register-button :deep(.wd-button) {
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
}

.register-button :deep(.wd-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.register-button :deep(.wd-button:active) {
  transform: translateY(0);
}

/* 联系客服按钮样式 - 使用深度选择器 */
.contact-button :deep(.wd-button) {
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4);
  transition: all 0.3s ease;
}

.contact-button :deep(.wd-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.5);
}

/* 点赞动画效果 */
.like-active .action-icon {
  animation: likeAnimation 0.6s ease-out;
}

@keyframes likeAnimation {
  0% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.3);
  }
  30% {
    transform: scale(0.9);
  }
  45% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 收藏动画效果 */
.collect-active .action-icon {
  animation: collectAnimation 0.6s ease-out;
}

@keyframes collectAnimation {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* 无障碍支持 - 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .activity-actions-container {
    animation: none;
  }

  .register-button :deep(.wd-button),
  .contact-button :deep(.wd-button) {
    transition: none;
  }

  .register-button :deep(.wd-button:hover),
  .contact-button :deep(.wd-button:hover) {
    transform: none;
  }

  .like-active .action-icon,
  .collect-active .action-icon {
    animation: none;
  }
}
</style>
