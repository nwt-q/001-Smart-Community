<!--
  维修工单详情
  功能：显示维修工单详细信息，包括基本信息、图片和流转时间轴

  访问地址: http://localhost:9000/#/pages-sub/repair/order-detail
  建议携带参数: ?repairId=REP_001&storeId=STORE_001

  完整示例: http://localhost:9000/#/pages-sub/repair/order-detail?repairId=REP_001&storeId=STORE_001
-->

<script setup lang="ts">
import type { RepairOrder, RepairPhoto, RepairStaffRecord } from '@/types/repair'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getRepairDetail, getRepairStaffRecords } from '@/api/repair'
import { TypedRouter } from '@/router'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '维修工单详情',
    enablePullDownRefresh: false,
  },
})

/** 页面参数 */
const repairId = ref('')
const storeId = ref('')

/** 工单详情 */
const repairDetail = ref<RepairOrder>()

/** 工单流转记录 */
const staffRecords = ref<RepairStaffRecord[]>([])

/** 获取小区信息 */
const communityInfo = getCurrentCommunity()

/** 加载工单详情 */
const { loading: detailLoading, send: loadDetail } = useRequest(
  () =>
    getRepairDetail({
      repairId: repairId.value,
      storeId: storeId.value,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    if (result.ownerRepair) {
      repairDetail.value = result.ownerRepair
    }
  })
  .onError((error) => {
    console.error('加载工单详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  })

/** 加载工单流转记录 */
const { loading: recordsLoading, send: loadRecords } = useRequest(
  () =>
    getRepairStaffRecords({
      repairId: repairId.value,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    staffRecords.value = result.staffRecords || []
  })
  .onError((error) => {
    console.error('加载流转记录失败:', error)
  })

/** 页面加载 */
onLoad((options) => {
  repairId.value = (options?.repairId as string) || ''
  storeId.value = (options?.storeId as string) || ''

  if (repairId.value) {
    loadDetail()
    loadRecords()
  }
})

/** 预览图片 */
function handlePreviewImages(images: RepairPhoto[], index: number) {
  const urls = images.map(img => img.url || img.photo || '').filter(url => url)
  if (urls.length > 0) {
    uni.previewImage({
      current: index,
      urls,
    })
  }
}

/** 回复评价 */
function handleReplyAppraise(record: RepairStaffRecord) {
  TypedRouter.toReplyAppraise(record.ruId || '', repairId.value)
}

/** 格式化时间轴步骤 */
function formatStaffRecords() {
  return staffRecords.value.map((record, index) => ({
    title: `${record.startTime || ''} 到达 ${record.staffName} 工位`,
    status: index === 0 ? 'success' : 'process',
    description: record.context || '',
  }))
}
</script>

<template>
  <view class="repair-detail-page">
    <!-- 加载状态 -->
    <view v-if="detailLoading" class="flex items-center justify-center p-8">
      <wd-loading />
    </view>

    <!-- 工单详情 -->
    <view v-else-if="repairDetail" class="detail-content">
      <!-- 基本信息 -->
      <view class="mb-3 bg-white">
        <wd-cell-group border>
          <wd-cell title="报修ID" :value="repairDetail.repairId" />
          <wd-cell title="报修类型" :value="repairDetail.repairTypeName" />
          <wd-cell title="报修人" :value="repairDetail.repairName" />
          <wd-cell title="联系方式" :value="repairDetail.tel" />
          <wd-cell title="报修位置" :value="repairDetail.repairObjName" />
          <wd-cell title="预约时间" :value="repairDetail.appointmentTime" />
          <wd-cell title="状态" :value="repairDetail.stateName" />
          <wd-cell title="报修内容" :value="repairDetail.context" />
        </wd-cell-group>
      </view>

      <!-- 业主报修图片 -->
      <view
        v-if="repairDetail.repairPhotos && repairDetail.repairPhotos.length > 0"
        class="mb-3 bg-white p-3"
      >
        <view class="mb-2 flex items-center gap-2">
          <text class="text-sm text-gray-700 font-bold">业主报修图片</text>
        </view>
        <view class="image-grid grid grid-cols-4 gap-2">
          <wd-img
            v-for="(photo, index) in repairDetail.repairPhotos"
            :key="index"
            :src="photo.url || photo.photo"
            mode="aspectFill"
            class="aspect-square h-full w-full rounded"
            @click="handlePreviewImages(repairDetail.repairPhotos!, index)"
          />
        </view>
      </view>

      <!-- 维修前图片 -->
      <view
        v-if="repairDetail.beforePhotos && repairDetail.beforePhotos.length > 0"
        class="mb-3 bg-white p-3"
      >
        <view class="mb-2 flex items-center gap-2">
          <text class="text-sm text-gray-700 font-bold">维修前图片</text>
        </view>
        <view class="image-grid grid grid-cols-4 gap-2">
          <wd-img
            v-for="(photo, index) in repairDetail.beforePhotos"
            :key="index"
            :src="photo.url || photo.photo"
            mode="aspectFill"
            class="aspect-square h-full w-full rounded"
            @click="handlePreviewImages(repairDetail.beforePhotos!, index)"
          />
        </view>
      </view>

      <!-- 维修后图片 -->
      <view
        v-if="repairDetail.afterPhotos && repairDetail.afterPhotos.length > 0"
        class="mb-3 bg-white p-3"
      >
        <view class="mb-2 flex items-center gap-2">
          <text class="text-sm text-gray-700 font-bold">维修后图片</text>
        </view>
        <view class="image-grid grid grid-cols-4 gap-2">
          <wd-img
            v-for="(photo, index) in repairDetail.afterPhotos"
            :key="index"
            :src="photo.url || photo.photo"
            mode="aspectFill"
            class="aspect-square h-full w-full rounded"
            @click="handlePreviewImages(repairDetail.afterPhotos!, index)"
          />
        </view>
      </view>

      <!-- 工单流转时间轴 -->
      <view v-if="staffRecords.length > 0" class="bg-white p-3">
        <view class="mb-3 text-sm text-gray-700 font-bold">
          工单流转记录
        </view>

        <view class="timeline-container">
          <view
            v-for="(record, index) in staffRecords"
            :key="index"
            class="timeline-item mb-4"
            :class="{ 'last-item': index === staffRecords.length - 1 }"
          >
            <!-- 时间轴节点 -->
            <view class="timeline-node">
              <view class="node-dot bg-blue-500" />
              <view v-if="index !== staffRecords.length - 1" class="node-line" />
            </view>

            <!-- 时间轴内容 -->
            <view class="timeline-content flex-1">
              <!-- 标题 -->
              <view class="mb-1 text-sm font-medium">
                <text>{{ record.startTime }} 到达 {{ record.staffName }} 工位 - {{ record.stateName }}</text>
              </view>

              <!-- 处理意见 -->
              <view
                v-if="record.endTime || record.state === '10009'"
                class="mb-1 text-sm text-gray-600"
              >
                <text>处理意见：{{ record.context }}</text>
                <text v-if="record.payTypeName" class="ml-1 text-blue-500">
                  ({{ record.payTypeName }})
                </text>
              </view>

              <!-- 回复按钮 -->
              <view v-if="record.state === '10007'" class="mt-2">
                <wd-button size="small" type="success" @click="handleReplyAppraise(record)">
                  回复
                </wd-button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.repair-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.detail-content {
  padding: 12px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  .aspect-square {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 4px;
  }

  image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.timeline-container {
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 12px;
  position: relative;

  &.last-item {
    .node-line {
      display: none;
    }
  }
}

.timeline-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2px;

  .node-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #4299e1;
    z-index: 1;
  }

  .node-line {
    flex: 1;
    width: 2px;
    background-color: #e2e8f0;
    margin-top: 4px;
    min-height: 40px;
  }
}

.timeline-content {
  flex: 1;
  padding-bottom: 8px;
}
</style>
