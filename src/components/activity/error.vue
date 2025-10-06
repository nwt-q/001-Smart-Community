<!--
  活动详情页错误处理组件
  提供优雅的错误状态显示和重试功能
-->
<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  /** 是否显示错误状态 */
  showError: boolean
  /** 错误类型 */
  errorType?: 'network' | 'not-found' | 'permission' | 'server' | 'unknown'
  /** 错误信息 */
  errorMessage?: string
  /** 是否可以重试 */
  canRetry?: boolean
  /** 重试次数 */
  retryCount?: number
  /** 最大重试次数 */
  maxRetryCount?: number
}

interface Emits {
  (e: 'retry'): void
  (e: 'refresh'): void
  (e: 'back'): void
}

const props = withDefaults(defineProps<Props>(), {
  errorType: 'unknown',
  errorMessage: '',
  canRetry: true,
  retryCount: 0,
  maxRetryCount: 3,
})

const emit = defineEmits<Emits>()

/** 响应式数据 */
const isRetrying = ref<boolean>(false)
const retryCountdown = ref<number>(0)

/** 计算属性 */
const errorConfig = computed(() => {
  const configs = {
    'network': {
      icon: 'wifi-off',
      title: '网络连接失败',
      description: '请检查您的网络连接，确保网络畅通后重试',
      color: 'orange',
      customClass: 'i-carbon-wifi-off',
    },
    'not-found': {
      icon: 'search',
      title: '活动不存在',
      description: '抱歉，您查找的活动可能已被删除或不存在',
      color: 'gray',
      customClass: 'i-carbon-search',
    },
    'permission': {
      icon: 'lock',
      title: '访问受限',
      description: '您没有权限查看此活动内容',
      color: 'red',
      customClass: 'i-carbon-lock',
    },
    'server': {
      icon: 'warning',
      title: '服务器错误',
      description: '服务器暂时无法响应，请稍后重试',
      color: 'red',
      customClass: 'i-carbon-warning-alt',
    },
    'unknown': {
      icon: 'error',
      title: '发生错误',
      description: '发生了未知错误，请稍后重试',
      color: 'gray',
      customClass: 'i-carbon-error',
    },
  }
  return configs[props.errorType] || configs.unknown
})

const canRetryAction = computed(() => {
  return props.canRetry && props.retryCount < props.maxRetryCount && !isRetrying.value
})

const retryButtonText = computed(() => {
  if (isRetrying.value)
    return '重试中...'
  if (retryCountdown.value > 0)
    return `${retryCountdown.value}s 后重试`
  return props.retryCount > 0 ? `重新加载 (${props.retryCount}/${props.maxRetryCount})` : '重新加载'
})

const retryButtonClass = computed(() => {
  if (!canRetryAction.value)
    return 'bg-gray-300 text-gray-500 cursor-not-allowed'
  return `bg-${errorConfig.value.color}-500 text-white`
})

/** 方法 */
async function handleRetry() {
  if (!canRetryAction.value)
    return

  isRetrying.value = true

  try {
    // 模拟重试延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('retry')
  }
  finally {
    isRetrying.value = false
  }
}

function handleRefresh() {
  emit('refresh')
}

function handleBack() {
  emit('back')
}

function handleContactSupport() {
  uni.showActionSheet({
    itemList: ['在线客服', '电话客服', '意见反馈'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          // 在线客服
          uni.showToast({
            title: '正在连接客服...',
            icon: 'loading',
            duration: 1500,
          })
          break
        case 1:
          // 电话客服
          uni.makePhoneCall({
            phoneNumber: '400-123-4567',
          })
          break
        case 2:
          // 意见反馈
          uni.showToast({
            title: '跳转反馈页面',
            icon: 'none',
            duration: 1500,
          })
          break
      }
    },
  })
}

function startRetryCountdown() {
  if (props.retryCount >= props.maxRetryCount)
    return

  retryCountdown.value = 5
  const timer = setInterval(() => {
    retryCountdown.value--
    if (retryCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 显示错误时开始倒计时
if (props.showError && props.retryCount > 0) {
  startRetryCountdown()
}
</script>

<template>
  <view v-if="props.showError" class="min-h-screen bg-gray-50">
    <view
      class="flex items-center justify-center p-6 max-sm:mx-4"
      style="min-height: calc(100vh - 88px);"
    >
      <view class="max-w-sm w-full animate-fade-in-up text-center">
        <!-- 错误图标 -->
        <view class="mb-6">
          <view
            class="mx-auto h-24 w-24 flex items-center justify-center rounded-full animate-bounce-in max-sm:h-20 max-sm:w-20"
            :class="`bg-${errorConfig.color}-100`"
            style="box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);"
          >
            <wd-icon
              :name="errorConfig.icon"
              size="48"
              :custom-class="`${errorConfig.customClass} text-${errorConfig.color}-500`"
            />
          </view>
        </view>

        <!-- 错误信息 -->
        <view class="mb-8">
          <text class="mb-2 block text-xl text-gray-900 font-semibold tracking-[0.3rpx] max-sm:text-lg">
            {{ errorConfig.title }}
          </text>

          <text
            class="block text-sm text-gray-600 leading-relaxed tracking-[0.2rpx]"
            style="line-height: 1.6;"
          >
            {{ props.errorMessage || errorConfig.description }}
          </text>

          <!-- 重试次数提示 -->
          <view v-if="props.retryCount > 0" class="mt-4">
            <text class="text-xs text-gray-500">
              已重试 {{ props.retryCount }} 次，最多重试 {{ props.maxRetryCount }} 次
            </text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="space-y-3">
          <!-- 重试按钮 -->
          <wd-button
            v-if="canRetryAction"
            type="primary"
            size="large"
            :loading="isRetrying"
            :disabled="!canRetryAction"
            :class="retryButtonClass"
            round
            block
            @click="handleRetry"
          >
            {{ retryButtonText }}
          </wd-button>

          <!-- 刷新按钮 -->
          <wd-button
            v-if="!canRetryAction && props.canRetry"
            size="large"
            round
            block
            @click="handleRefresh"
          >
            <view class="flex items-center justify-center">
              <wd-icon name="refresh" size="18" custom-class="i-carbon-reset mr-2" />
              <text>刷新页面</text>
            </view>
          </wd-button>

          <!-- 联系客服按钮 -->
          <wd-button
            size="large"
            round
            block
            custom-class="bg-white text-gray-700 border border-gray-300 font-medium hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            @click="handleContactSupport"
          >
            <view class="flex items-center justify-center">
              <wd-icon name="support" size="18" custom-class="i-carbon-headset mr-2" />
              <text>联系客服</text>
            </view>
          </wd-button>

          <!-- 返回按钮 -->
          <wd-button
            size="large"
            round
            block
            custom-class="bg-white text-gray-600 font-medium hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            @click="handleBack"
          >
            <view class="flex items-center justify-center">
              <wd-icon name="arrow-left" size="18" custom-class="i-carbon-arrow-left mr-2" />
              <text>返回上页</text>
            </view>
          </wd-button>
        </view>

        <!-- 错误详情（开发模式显示） -->
        <view
          v-if="props.errorMessage" class="mt-6 rounded-lg p-3 text-xs text-gray-500 font-mono"
          style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 8rpx;"
        >
          {{ props.errorMessage }}
        </view>

        <!-- 帮助提示 -->
        <view
          class="mt-6 rounded-lg p-4 text-left"
          style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid rgba(59, 130, 246, 0.2);"
        >
          <view class="mb-3 last:mb-0">
            <view class="flex items-start">
              <wd-icon name="check" size="14" custom-class="i-carbon-checkmark text-green-500 mr-2 mt-0.5" />
              <text
                class="text-xs text-gray-600 tracking-[0.1rpx]"
                style="line-height: 1.5;"
              >
                检查网络连接是否正常
              </text>
            </view>
          </view>

          <view class="mb-3 last:mb-0">
            <view class="flex items-start">
              <wd-icon name="check" size="14" custom-class="i-carbon-checkmark text-green-500 mr-2 mt-0.5" />
              <text
                class="text-xs text-gray-600 tracking-[0.1rpx]"
                style="line-height: 1.5;"
              >
                尝试刷新页面或重新加载
              </text>
            </view>
          </view>

          <view class="mb-0">
            <view class="flex items-start">
              <wd-icon name="check" size="14" custom-class="i-carbon-checkmark text-green-500 mr-2 mt-0.5" />
              <text
                class="text-xs text-gray-600 tracking-[0.1rpx]"
                style="line-height: 1.5;"
              >
                如问题持续，请联系客服协助
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounceIn 0.8s ease-out;
}

/* 按钮颜色样式 */
.bg-orange-500 {
  background-color: #f97316;
}

.bg-red-500 {
  background-color: #ef4444;
}

.bg-gray-500 {
  background-color: #6b7280;
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-bounce-in {
    animation: none;
  }
}
</style>
