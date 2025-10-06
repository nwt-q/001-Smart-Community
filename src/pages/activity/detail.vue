<!--
  快速访问地址 请不要删除
  /pages/activity/detail?activitiesId=ACT_018&currentCommunityId=COMM_001
-->

<script setup lang="ts">
import type { Activity } from '@/types/activity'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, nextTick, reactive, ref } from 'vue'
import { getActivityDetail, increaseActivityView } from '@/api/activity'

import ActivityActions from '@/components/activity/actions.vue'
import ActivityContent from '@/components/activity/content.vue'
import ActivityError from '@/components/activity/error.vue'
import ActivityHeroImage from '@/components/activity/hero-image.vue'
import ActivityInfo from '@/components/activity/info.vue'
import ActivitySkeleton from '@/components/activity/skeleton.vue'

/** 页面配置 */
definePage({
  style: {
    navigationBarTitleText: '活动详情',
    navigationBarBackgroundColor: '#368CFE',
    navigationBarTextStyle: 'white',
  },
})

/** 接口参数 */
interface PageOptions {
  activitiesId: string
  currentCommunityId: string
}

/** 响应式数据 */
const activitiesId = ref<string>('')
const currentCommunityId = ref<string>('')
const pageVisible = ref<boolean>(true)
const errorState = ref<{
  show: boolean
  type: 'network' | 'not-found' | 'permission' | 'server' | 'unknown'
  message: string
}>({
  show: false,
  type: 'unknown',
  message: '',
})
const retryCount = ref<number>(0)
const maxRetryCount = 3

// 活动数据
const activity = reactive<Partial<Activity>>({
  activitiesId: '',
  title: '',
  userName: '',
  startTime: '',
  endTime: '',
  context: '',
  headerImg: '',
  src: '',
  status: 'UPCOMING',
  viewCount: 0,
  likeCount: 0,
  collectCount: 0,
  readCount: 0,
})

// 交互状态
const isLiked = ref<boolean>(false)
const isCollected = ref<boolean>(false)
const isRegistered = ref<boolean>(false)
const isImageLoading = ref<boolean>(true)

const shareData = computed(() => ({
  title: activity.title || '精彩活动',
  path: `/pages/activity/detail?activitiesId=${activitiesId.value}&currentCommunityId=${currentCommunityId.value}`,
  imageUrl: activity.src || '',
}))

/** 请求管理 */
const {
  loading,
  data: activityData,
  send: refreshActivity,
  error: requestError,
} = useRequest(
  () => getActivityDetail({
    page: 1,
    row: 1,
    activitiesId: activitiesId.value,
    communityId: currentCommunityId.value,
  }),
  {
    immediate: false,
  },
)

/** 方法 */
async function loadActivities() {
  if (!activitiesId.value || !currentCommunityId.value) {
    showError('unknown', '缺少必要的参数')
    return
  }

  try {
    errorState.value.show = false
    const result = await refreshActivity()

    if (result?.activitiess?.length > 0) {
      const activityItem = result.activitiess[0]

      /** 处理图片路径 */
      activityItem.src = `/api/file?fileId=${activityItem.headerImg}&communityId=${currentCommunityId.value}&time=${Date.now()}`

      /** 更新活动数据 */
      Object.assign(activity, activityItem)

      // 增加浏览量
      await increaseViewCount()

      // 重置重试次数
      retryCount.value = 0
    }
    else {
      showError('not-found', '未找到相关活动')
    }
  }
  catch (error: any) {
    console.error('加载活动详情失败:', error)

    // 根据错误类型显示不同的错误信息
    const errorType = error.code === 'NETWORK_ERROR'
      ? 'network'
      : error.code === 'NOT_FOUND'
        ? 'not-found'
        : error.code === 'PERMISSION_DENIED'
          ? 'permission'
          : error.code === 'SERVER_ERROR' ? 'server' : 'unknown'

    showError(errorType, error.message || '加载失败，请稍后重试')
  }
}

async function increaseViewCount() {
  try {
    await increaseActivityView(activitiesId.value)
    activity.viewCount = (activity.viewCount || 0) + 1
  }
  catch (error) {
    console.warn('增加浏览量失败:', error)
  }
}

function showError(type: typeof errorState.value.type, message: string) {
  errorState.value = {
    show: true,
    type,
    message,
  }
}

function handleRetry() {
  if (retryCount.value >= maxRetryCount) {
    uni.showToast({
      title: '已达到最大重试次数',
      icon: 'none',
      duration: 2000,
    })
    return
  }

  retryCount.value++
  loadActivities()
}

function handleRefresh() {
  retryCount.value = 0
  loadActivities()
}

function handleBack() {
  uni.navigateBack({
    delta: 1,
    fail: () => {
      uni.switchTab({
        url: '/pages/activity/index',
      })
    },
  })
}

function handleImageError() {
  console.log('图片加载失败')
  activity.src = ''
  isImageLoading.value = false
}

function handleImageLoad() {
  isImageLoading.value = false
}

/** 显示交互反馈 */
function showInteractionFeedback(type: 'like' | 'collect' | 'share' | 'register' | 'success' | 'error', text: string) {
  // 根据 wd-toast 的类型映射
  const toastType = type === 'error' ? 'error' : 'success'

  // 使用 wot-design-uni 的 toast 组件
  uni.showToast({
    title: text,
    icon: type === 'error' ? 'error' : 'success',
    duration: 1500,
  })
}

// 交互方法
async function handleLike(liked: boolean) {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    isLiked.value = liked
    activity.likeCount = liked
      ? (activity.likeCount || 0) + 1
      : Math.max((activity.likeCount || 0) - 1, 0)

    // 显示交互反馈
    showInteractionFeedback('like', liked ? '点赞成功' : '取消点赞')

    // 这里应该调用实际的点赞API
  }
  catch (error) {
    console.error('点赞操作失败:', error)
    showInteractionFeedback('error', '操作失败')
  }
}

async function handleCollect(collected: boolean) {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    isCollected.value = collected
    activity.collectCount = collected
      ? (activity.collectCount || 0) + 1
      : Math.max((activity.collectCount || 0) - 1, 0)

    // 显示交互反馈
    showInteractionFeedback('collect', collected ? '收藏成功' : '取消收藏')

    // 这里应该调用实际的收藏API
  }
  catch (error) {
    console.error('收藏操作失败:', error)
    showInteractionFeedback('error', '操作失败')
  }
}

async function handleRegister(registered: boolean) {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    isRegistered.value = registered

    // 显示交互反馈
    showInteractionFeedback('register', registered ? '报名成功' : '取消报名')

    // 这里应该调用实际的报名API
  }
  catch (error) {
    console.error('报名操作失败:', error)
    showInteractionFeedback('error', '操作失败')
  }
}

function handleShare() {
  uni.showActionSheet({
    itemList: ['分享给好友', '复制链接', '保存图片'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 触发分享
        uni.share({
          provider: 'weixin',
          scene: 'WXSceneSession',
          type: 0,
          href: '',
          title: shareData.value.title,
          summary: `我发现了一个很不错的活动：${activity.title}`,
          imageUrl: shareData.value.imageUrl,
          success: () => {
            showInteractionFeedback('share', '分享成功')
          },
          fail: () => {
            uni.showToast({
              title: '分享失败',
              icon: 'none',
              duration: 1500,
            })
          },
        })
      }
      else if (res.tapIndex === 1) {
        // 复制链接
        uni.setClipboardData({
          data: shareData.value.path,
          success: () => {
            showInteractionFeedback('success', '链接已复制')
          },
        })
      }
      else if (res.tapIndex === 2) {
        // 保存图片
        if (shareData.value.imageUrl) {
          uni.saveImageToPhotosAlbum({
            filePath: shareData.value.imageUrl,
            success: () => {
              showInteractionFeedback('success', '图片已保存')
            },
            fail: () => {
              uni.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 1500,
              })
            },
          })
        }
        else {
          uni.showToast({
            title: '暂无图片可保存',
            icon: 'none',
            duration: 1500,
          })
        }
      }
    },
  })
}

/** 生命周期 */
onLoad((options: PageOptions) => {
  activitiesId.value = options.activitiesId
  currentCommunityId.value = options.currentCommunityId

  // 延迟加载以提升用户体验
  nextTick(() => {
    loadActivities()
  })
})

onShareAppMessage(() => {
  return shareData.value
})

onPullDownRefresh(() => {
  handleRefresh()
  setTimeout(() => {
    uni.stopPullDownRefresh()
  }, 1000)
})
</script>

<template>
  <view class="activity-detail min-h-screen bg-gray-50">
    <!-- 错误状态显示 -->
    <ActivityError
      v-if="errorState.show"
      :show-error="errorState.show"
      :error-type="errorState.type"
      :error-message="errorState.message"
      :retry-count="retryCount"
      :max-retry-count="maxRetryCount"
      @retry="handleRetry"
      @refresh="handleRefresh"
      @back="handleBack"
    />

    <!-- 骨架屏显示 -->
    <ActivitySkeleton
      v-else-if="loading"
      :show="loading"
    />

    <!-- 主要内容显示 -->
    <view v-else-if="activity.title" class="content-wrapper relative mx-auto max-w-screen-xl px-4">
      <!-- 头部图片组件 -->
      <ActivityHeroImage
        :src="activity.src"
        :show-gradient="true"
        placeholder="暂无活动图片"
        @error="handleImageError"
        @load="handleImageLoad"
      />

      <!-- 活动信息组件 -->
      <view class="relative z-20 -mt-8">
        <ActivityInfo
          :title="activity.title"
          :author="activity.userName"
          :start-time="activity.startTime"
          :end-time="activity.endTime"
          :status="activity.status"
          :view-count="activity.viewCount"
          :like-count="activity.likeCount"
        />
      </view>

      <!-- 活动内容组件 -->
      <view class="relative z-10">
        <ActivityContent
          :content="activity.context"
          :show-expand-button="true"
          :max-height="400"
        />
      </view>

      <!-- 操作按钮组件 -->
      <ActivityActions
        :activity-id="activity.activitiesId"
        :is-liked="isLiked"
        :is-collected="isCollected"
        :is-registered="isRegistered"
        :like-count="activity.likeCount"
        :collect-count="activity.collectCount"
        :register-count="0"
        :status="activity.status"
        :show-register-button="true"
        @like="handleLike"
        @collect="handleCollect"
        @register="handleRegister"
        @share="handleShare"
      />

      <!-- 底部间距 -->
      <view class="bottom-spacing h-20" />
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state min-h-screen flex items-center justify-center px-8">
      <wd-status-tip
        image="content"
        tip="暂无活动信息"
        :image-size="{ height: 200, width: 200 }"
      />
    </view>
  </view>
</template>

<style scoped>
/* 页面容器样式 */
.activity-detail {
  background-color: #f9fafb;
  min-height: 100vh;
  scroll-behavior: smooth;
}

/* 内容包装器样式 */
.content-wrapper {
  position: relative;
  max-width: 750rpx;
  margin: 0 auto;
}

/* 底部间距样式 */
.bottom-spacing {
  height: 80rpx;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 32rpx;
}

/* 页面级动画 */
.activity-detail {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .content-wrapper {
    @apply px-3;
  }

  .bottom-spacing {
    @apply h-16;
  }
}

@media (max-width: 600rpx) {
  .content-wrapper {
    @apply px-2;
  }
}

/* 横屏适配 */
@media (orientation: landscape) and (max-height: 600rpx) {
  .content-wrapper {
    @apply px-4 py-2;
  }

  .bottom-spacing {
    @apply h-12;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .activity-detail {
    @apply bg-gray-900;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .activity-detail {
    @apply bg-white;
  }

  .content-wrapper {
    @apply border border-gray-800;
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .activity-detail {
    animation: none;
  }

  .content-wrapper {
    scroll-behavior: auto;
  }
}

/* 焦点可见性增强 */
.content-wrapper:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 打印样式 */
@media print {
  .activity-detail {
    @apply bg-white text-black;
  }

  .bottom-spacing {
    @apply hidden;
  }

  .content-wrapper {
    @apply px-0;
    max-width: none;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .content-wrapper {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  /* 增大触摸目标 */
  .bottom-spacing {
    @apply h-24;
  }
}

/* 小屏幕设备适配 */
@media (max-device-width: 375px) {
  .content-wrapper {
    @apply px-2;
  }
}

/* 大屏幕设备适配 */
@media (min-device-width: 1024px) {
  .content-wrapper {
    max-width: 600rpx;
    @apply mx-auto;
    box-shadow: 0 0 40rpx rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    margin-top: 32rpx;
    margin-bottom: 32rpx;
    overflow: hidden;
  }
}

/* 网络状态适配 */
@media (prefers-reduced-data) {
  .activity-detail {
    /* 减少动画和过渡效果以节省数据 */
    animation: none;
  }
}
</style>
