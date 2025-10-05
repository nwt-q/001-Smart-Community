<!--
  快速访问地址 请不要删除
  /pages/activity/index?currentCommunityId=COMM_001
-->

<script setup lang="ts">
import type { Activity, ActivityListParams, ActivityListResponse } from '@/types/activity'
import { onLoad, onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { getActivityList, increaseActivityView } from '@/api/activity'
import { TypedRouter } from '@/router'

/** 页面配置 */
definePage({
  name: 'Activities',
  style: {
    navigationBarTitleText: '社区活动',
    navigationBarBackgroundColor: '#368CFE',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'light',
    onReachBottomDistance: 50,
  },
})

/** 接口参数类型 */
interface PageOptions {
  currentCommunityId: string
}

/** 响应式数据状态 */
const currentCommunityId = ref<string>('')
const activities = ref<Activity[]>([])
const currentPage = ref<number>(1)
const pageSize = ref<number>(15)
const hasMore = ref<boolean>(true)
const isLoadingMore = ref<boolean>(false)
const error = ref<string>('')

/** API请求管理 - 优化请求参数 */
const {
  loading,
  data: activitiesResponse,
  send: fetchActivities,
  onSuccess,
  onError,
} = useRequest(
  (params: ActivityListParams) => getActivityList(params),
  {
    immediate: false,
  },
)

/** 计算属性 */
const isEmpty = computed(() => !loading.value && activities.value.length === 0)
const showLoadMore = computed(() => hasMore.value && !loading.value)

/** 请求成功处理 */
onSuccess((event) => {
  const response = event.data as ActivityListResponse
  if (response?.activitiess) {
    processActivitiesData(response.activitiess, response)
  }
})

/** 请求错误处理 */
onError((event) => {
  const err = event.error
  console.error('获取活动列表失败:', err)
  error.value = err?.message || '网络异常，请稍后重试'
  showErrorToast('加载失败，请稍后重试')
})

/** 工具函数 */
/**
 * 格式化时间显示
 */
function formatTime(timeString: string): string {
  if (!timeString)
    return ''
  return dayjs(timeString).format('YYYY-MM-DD HH:mm')
}

/**
 * 格式化数字显示（如浏览量、点赞数）
 */
function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

/**
 * 处理图片路径 - 优化以匹配Mock接口的图片处理逻辑
 */
function getImageUrl(headerImg: string): string {
  if (!headerImg)
    return ''
  /** 检查是否为完整URL（Mock接口返回的图片） */
  if (headerImg.startsWith('http')) {
    return headerImg
  }
  /** 🔴 兼容原Java110Context的文件路径格式 */
  return `/api/file?fileId=${headerImg}&communityId=${currentCommunityId.value}&time=${Date.now()}`
}

/**
 * 显示错误提示
 */
function showErrorToast(message: string) {
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000,
  })
}

/**
 * 清理HTML标签并截断文本，用于活动内容预览
 */
function stripHtmlAndTruncate(html: string, maxLength: number = 80): string {
  if (!html)
    return ''

  /** 移除所有HTML标签 */
  let text = html.replace(/<[^>]*>/g, '')

  /** 清理多余的空白字符 */
  text = text.replace(/\s+/g, ' ').trim()

  /** 截断文本并添加省略号 */
  if (text.length > maxLength) {
    text = `${text.substring(0, maxLength).trim()}...`
  }

  return text
}

/**
 * 处理活动数据 - 完全匹配原Java110Context的数据处理逻辑
 */
function processActivitiesData(newActivities: Activity[], response: ActivityListResponse) {
  const processedActivities = newActivities.map((item: Activity) => ({
    ...item,
    /** 🔴 重要：图片URL处理逻辑匹配原Java110Context */
    src: item.src || getImageUrl(item.headerImg || ''), /** 优先使用Mock接口提供的src */
    /** 🔴 数据格式兼容性处理 - 保持与原系统一致 */
    readCount: item.readCount || item.viewCount || 0, /** readCount优先，向后兼容viewCount */
    likeCount: item.likeCount || 0,
    collectCount: item.collectCount || 0, /** 收藏功能 */
    /** 时间格式化处理 */
    formattedStartTime: formatTime(item.startTime),
    formattedCreateTime: formatTime(item.createTime),
    formattedEndTime: item.endTime ? formatTime(item.endTime) : '',
  }))

  /** 🔴 分页数据处理逻辑 */
  if (currentPage.value === 1) {
    activities.value = processedActivities
  }
  else {
    activities.value.push(...processedActivities)
  }

  /** 🔴 分页状态更新 - 基于实际返回的数据量判断是否还有更多 */
  hasMore.value = processedActivities.length >= pageSize.value
  error.value = ''

  /** 输出处理结果用于调试 */
  console.log('🎯 Activities processed:', {
    total: response.total,
    currentPage: currentPage.value,
    newItems: processedActivities.length,
    totalItems: activities.value.length,
    hasMore: hasMore.value,
  })
}

/**
 * 加载活动列表（支持分页）
 */
async function loadActivities(page: number = 1, showLoading: boolean = true) {
  if (!currentCommunityId.value) {
    showErrorToast('社区ID不能为空')
    return
  }

  try {
    /** 设置加载状态 */
    if (page > 1) {
      isLoadingMore.value = true
    }

    const params: ActivityListParams = {
      page,
      row: pageSize.value,
      communityId: currentCommunityId.value,
      status: '1', /** 只获取已发布的活动 */
    }

    await fetchActivities(params)
    currentPage.value = page
  }
  catch (err: any) {
    console.error('加载活动失败:', err)
    /** 错误已在 onError 中处理 */
  }
  finally {
    if (page > 1) {
      isLoadingMore.value = false
    }
  }
}

/**
 * 刷新活动列表
 */
async function refreshActivities() {
  currentPage.value = 1
  hasMore.value = true
  await loadActivities(1)
}

/**
 * 加载更多活动
 */
async function loadMoreActivities() {
  if (hasMore.value && !loading.value && !isLoadingMore.value) {
    await loadActivities(currentPage.value + 1, false)
  }
}

/**
 * 跳转到活动详情并增加浏览量
 */
async function navigateToDetail(item: Activity) {
  try {
    /** 异步增加浏览量，不阻塞跳转 */
    increaseActivityView(item.activitiesId).catch((err) => {
      console.warn('增加浏览量失败:', err)
    })

    /** 立即跳转到详情页 */
    await TypedRouter.toActivityDetail(item.activitiesId, currentCommunityId.value)

    /** 乐观更新本地浏览量 */
    const index = activities.value.findIndex(activity => activity.activitiesId === item.activitiesId)
    if (index !== -1) {
      activities.value[index].readCount += 1
      activities.value[index].viewCount += 1
    }
  }
  catch (err) {
    console.error('跳转详情页失败:', err)
    showErrorToast('跳转失败，请重试')
  }
}

/** 监听社区ID变化，自动刷新数据 */
watch(
  () => currentCommunityId.value,
  (newCommunityId) => {
    if (newCommunityId) {
      refreshActivities()
    }
  },
  { immediate: false },
)

/** 生命周期钩子 */
onLoad((options: PageOptions) => {
  console.log('Activities页面加载，参数:', options)

  if (!options.currentCommunityId) {
    showErrorToast('社区参数缺失')
    return
  }

  currentCommunityId.value = options.currentCommunityId
  /** 首次加载数据 */
  loadActivities(1)
})

/** 页面显示时刷新数据（从详情页返回时） */
onShow(() => {
  /** 如果已有数据，则静默刷新 */
  if (activities.value.length > 0) {
    refreshActivities()
  }
})

/** 下拉刷新 */
onPullDownRefresh(async () => {
  try {
    await refreshActivities()
  }
  finally {
    uni.stopPullDownRefresh()
  }
})

/** 上拉加载更多 */
onReachBottom(() => {
  loadMoreActivities()
})
</script>

<template>
  <view class="activities-page">
    <!-- 顶部加载状态 -->
    <view v-if="loading && currentPage === 1" class="loading-container">
      <wd-loading size="24px" color="#368CFE" />
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 活动列表 -->
    <view v-if="activities.length > 0" class="activities-list">
      <view
        v-for="(item, index) in activities"
        :key="`${item.activitiesId}_${index}`"
        class="activity-card-wrapper"
        @click="navigateToDetail(item)"
      >
        <!-- 活动卡片 -->
        <view class="activity-card">
          <!-- 活动图片区域 -->
          <view class="image-container">
            <image
              :src="item.src"
              class="activity-image"
              mode="aspectFill"
            />

            <!-- 活动状态标签 -->
            <view class="status-tag-wrapper">
              <wd-tag
                v-if="dayjs().isAfter(dayjs(item.endTime))"
                type="primary"
                size="small"
                plain
                class="status-tag"
              >
                已结束
              </wd-tag>
              <wd-tag
                v-else-if="dayjs().isBefore(dayjs(item.startTime))"
                type="warning"
                size="small"
                plain
                class="status-tag"
              >
                未开始
              </wd-tag>
              <wd-tag
                v-else
                type="success"
                size="small"
                plain
                class="status-tag"
              >
                进行中
              </wd-tag>
            </view>

            <!-- 底部渐变遮罩和标题 -->
            <view class="title-overlay">
              <text class="activity-title line-clamp-2">{{ item.title }}</text>
            </view>
          </view>

          <!-- 活动信息区域 -->
          <view class="card-body">
            <view class="user-section">
              <!-- 发布者头像 -->
              <view class="user-avatar">
                <text class="avatar-text">{{ item.userName?.charAt(0) || 'A' }}</text>
              </view>

              <view class="user-content">
                <view class="user-info">
                  <text class="user-name">{{ item.userName || '管理员' }}</text>
                  <text class="create-time">{{ item.formattedCreateTime }}</text>
                </view>

                <!-- 活动内容预览 -->
                <view v-if="item.context" class="activity-context">
                  <text class="context-text line-clamp-2">{{ stripHtmlAndTruncate(item.context, 80) }}</text>
                </view>

                <!-- 活动时间信息 -->
                <view class="time-info-box">
                  <view class="time-label">
                    <text class="i-carbon-time time-icon" />
                    <text class="time-label-text">活动时间</text>
                  </view>
                  <text class="time-value">
                    {{ item.formattedStartTime }}
                    <text v-if="item.endTime" class="time-separator"> ~ {{ formatTime(item.endTime) }}</text>
                  </text>
                </view>

                <!-- 统计信息栏 -->
                <view class="stats-bar">
                  <!-- 统计数据 -->
                  <view class="stats-list">
                    <!-- 浏览量 -->
                    <view class="stat-item">
                      <text class="i-carbon-view stat-icon" />
                      <text class="stat-value">{{ formatNumber(item.readCount) }}</text>
                    </view>

                    <!-- 点赞数 -->
                    <view class="stat-item">
                      <text class="i-carbon-thumbs-up stat-icon" />
                      <text class="stat-value">{{ formatNumber(item.likeCount) }}</text>
                    </view>

                    <!-- 收藏数 -->
                    <view class="stat-item">
                      <text class="i-carbon-chat stat-icon" />
                      <text class="stat-value">{{ formatNumber(item.collectCount) }}</text>
                    </view>
                  </view>

                  <!-- 查看详情按钮 -->
                  <wd-button
                    type="primary"
                    size="small"
                    plain
                    round
                    class="detail-button"
                  >
                    查看详情
                  </wd-button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多状态 -->
    <view v-if="showLoadMore" class="load-more-container">
      <wd-loading v-if="isLoadingMore" size="20px" color="#368CFE" />
      <text v-if="isLoadingMore" class="load-more-text">加载更多...</text>
      <text v-else-if="!hasMore && activities.length > 0" class="no-more-text">没有更多了</text>
    </view>

    <!-- 空状态 -->
    <view v-if="isEmpty" class="empty-container">
      <wd-status-tip
        image="content"
        tip="暂无活动"
        :image-size="{ height: 120, width: 120 }"
      />
      <view class="empty-tip">
        <text class="empty-text">暂时没有社区活动</text>
        <text class="empty-sub-text">请稍后再来看看吧</text>
      </view>
    </view>

    <!-- 错误状态 -->
    <view v-if="error && isEmpty" class="error-container">
      <wd-status-tip
        image="network"
        tip="加载失败"
        :image-size="{ height: 120, width: 120 }"
      />
      <view class="error-tip">
        <text class="error-text">{{ error }}</text>
        <wd-button
          type="primary"
          size="small"
          plain
          round
          @click="refreshActivities"
        >
          重新加载
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped>
/** 页面容器 */
.activities-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20rpx;
}

/** 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 0;
}

.loading-text {
  margin-left: 16rpx;
  font-size: 28rpx;
  color: #666;
}

/** 活动列表容器 */
.activities-list {
  width: 100%;
  padding: 0;
}

/** 活动卡片包装器 */
.activity-card-wrapper {
  margin: 24rpx 32rpx;
}

/** 活动卡片样式 */
.activity-card {
  background-color: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.activity-card:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
}

/** 图片容器 */
.image-container {
  position: relative;
  width: 100%;
  height: 360rpx;
  overflow: hidden;
}

.activity-image {
  width: 100%;
  height: 100%;
  display: block;
}

/** 状态标签定位 */
.status-tag-wrapper {
  position: absolute;
  right: 16rpx;
  top: 16rpx;
  z-index: 2;
}

.status-tag {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  backdrop-filter: blur(16rpx);
  -webkit-backdrop-filter: blur(16rpx);
}

/** 标题遮罩层 */
.title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
  z-index: 1;
}

.activity-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  line-height: 1.5;
}

/** 卡片内容区域 */
.card-body {
  padding: 24rpx 32rpx;
}

/** 用户区域 */
.user-section {
  display: flex;
  align-items: flex-start;
}

/** 用户头像 */
.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.avatar-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}

/** 用户内容区 */
.user-content {
  flex: 1;
  min-width: 0;
}

/** 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.user-name {
  color: #4b5563;
  font-size: 28rpx;
  font-weight: 500;
}

.create-time {
  color: #9ca3af;
  font-size: 24rpx;
  flex-shrink: 0;
  margin-left: 16rpx;
}

/** 活动内容预览 */
.activity-context {
  margin-top: 16rpx;
  margin-bottom: 24rpx;
}

.context-text {
  color: #4b5563;
  font-size: 28rpx;
  line-height: 1.6;
}

/** 时间信息框 */
.time-info-box {
  margin-bottom: 24rpx;
  padding: 24rpx;
  background-color: #f9fafb;
  border-radius: 16rpx;
}

.time-label {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.time-icon {
  font-size: 28rpx;
  color: #368cfe;
  margin-right: 8rpx;
}

.time-label-text {
  color: #6b7280;
  font-size: 24rpx;
}

.time-value {
  color: #374151;
  font-size: 28rpx;
  font-weight: 500;
}

.time-separator {
  color: #9ca3af;
}

/** 统计信息栏 */
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1rpx solid #f3f4f6;
  padding-top: 16rpx;
}

.stats-list {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #6b7280;
  font-size: 28rpx;
}

.stat-icon {
  font-size: 28rpx;
  color: #9ca3af;
}

.stat-value {
  color: #6b7280;
}

.detail-button {
  flex-shrink: 0;
}

/** 加载更多状态 */
.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32rpx 0;
}

.load-more-text {
  margin-left: 16rpx;
  font-size: 28rpx;
  color: #9ca3af;
}

.no-more-text {
  font-size: 28rpx;
  color: #d1d5db;
}

/** 空状态 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 0;
}

.empty-tip {
  margin-top: 32rpx;
  text-align: center;
}

.empty-text {
  display: block;
  margin-bottom: 16rpx;
  color: #9ca3af;
  font-size: 28rpx;
}

.empty-sub-text {
  display: block;
  color: #d1d5db;
  font-size: 24rpx;
}

/** 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 0;
}

.error-tip {
  margin-top: 32rpx;
  text-align: center;
}

.error-text {
  display: block;
  margin-bottom: 16rpx;
  color: #f87171;
  font-size: 28rpx;
}

/** 文本截断工具类 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
