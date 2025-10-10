<!--
  物业申请模块示例页面
  演示如何在Vue3中使用useRequest和Alova进行API调用
-->
<script setup lang="ts">
import type {
  ApplicationRecordListParams,
  CheckUpdateRequest,
  DictQueryParams,
  FeeDetailParams,
  FeeDiscountParams,
  PropertyApplicationDetailParams,
  PropertyApplicationListParams,
  SaveApplicationRecordRequest,
} from '@/types/property-application'
import { useRequest } from 'alova/client'
import { onMounted, ref } from 'vue'
import {
  getApplicationRecordList,
  getFeeDetailList,
  getFeeDiscountList,
  getPropertyApplicationDetail,
  getPropertyApplicationList,
  queryDictInfo,
  saveApplicationRecord,
  submitCheckUpdate,
} from '@/api/property-application'

// 页面数据
const currentCommunityId = ref('COMM_001')
const selectedApplication = ref<any>(null)
const showDetail = ref(false)

// 示例1: 获取物业申请列表
const {
  loading: listLoading,
  data: applicationList,
  send: loadApplicationList,
  onSuccess: onListSuccess,
  onError: onListError,
} = useRequest(
  (params: PropertyApplicationListParams) => getPropertyApplicationList(params),
  {
    immediate: false, // 🔴 强制要求: 不自动执行
  },
)

// 列表加载成功回调
onListSuccess((result) => {
  console.log('✅ 申请列表加载成功:', result)
  // 这里可以处理成功逻辑，比如显示提示信息
})

// 列表加载失败回调
onListError((error) => {
  console.error('❌ 申请列表加载失败:', error)
  // 这里可以处理错误逻辑，比如显示错误提示
})

// 示例2: 获取申请详情
const {
  loading: detailLoading,
  data: applicationDetail,
  send: loadApplicationDetail,
  onSuccess: onDetailSuccess,
  onError: onDetailError,
} = useRequest(
  (params: PropertyApplicationDetailParams) => getPropertyApplicationDetail(params),
  {
    immediate: false, // 🔴 强制要求: 不自动执行
  },
)

// 详情加载成功回调
onDetailSuccess((result) => {
  console.log('✅ 申请详情加载成功:', result)
  selectedApplication.value = result.data[0]
  showDetail.value = true
})

// 详情加载失败回调
onDetailError((error) => {
  console.error('❌ 申请详情加载失败:', error)
})

// 示例3: 提交验房操作
const {
  loading: checkLoading,
  send: submitCheck,
  onSuccess: onCheckSuccess,
  onError: onCheckError,
} = useRequest(
  (data: CheckUpdateRequest) => submitCheckUpdate(data),
  {
    immediate: false, // 🔴 强制要求: 不自动执行
  },
)

// 验房提交成功回调
onCheckSuccess(() => {
  console.log('✅ 验房提交成功')
  // 刷新列表
  loadApplicationList({
    page: 1,
    row: 10,
    communityId: currentCommunityId.value,
  })
})

// 验房提交失败回调
onCheckError((error) => {
  console.error('❌ 验房提交失败:', error)
})

// 示例4: 获取字典信息
const {
  data: dictData,
  send: loadDictData,
} = useRequest(
  (params: DictQueryParams) => queryDictInfo(params),
  {
    immediate: false, // 🔴 强制要求: 不自动执行
  },
)

// 示例5: 获取费用折扣列表
const {
  data: feeDiscountList,
  send: loadFeeDiscountList,
} = useRequest(
  (params: FeeDiscountParams) => getFeeDiscountList(params),
  {
    immediate: false, // 🔴 强制要求: 不自动执行
  },
)

// 示例6: 获取费用详情
const {
  data: feeDetailList,
  send: loadFeeDetailList,
} = useRequest(
  (params: FeeDetailParams) => getFeeDetailList(params),
  {
    immediate: false, // 🔴 强制要求: 不自动执行
  },
)

// 示例7: 获取跟踪记录
const {
  data: recordList,
  send: loadRecordList,
} = useRequest(
  (params: ApplicationRecordListParams) => getApplicationRecordList(params),
  {
    immediate: false, // 🔴 强制要求: 不自动执行
  },
)

// 示例8: 保存跟踪记录
const {
  loading: saveRecordLoading,
  send: saveRecord,
  onSuccess: onSaveRecordSuccess,
  onError: onSaveRecordError,
} = useRequest(
  (data: SaveApplicationRecordRequest) => saveApplicationRecord(data),
  {
    immediate: false, // 🔴 强制要求: 不自动执行
  },
)

// 保存记录成功回调
onSaveRecordSuccess(() => {
  console.log('✅ 跟踪记录保存成功')
})

// 保存记录失败回调
onSaveRecordError((error) => {
  console.error('❌ 跟踪记录保存失败:', error)
})

// 页面方法

/**
 * 加载申请列表
 */
function handleLoadList() {
  loadApplicationList({
    page: 1,
    row: 10,
    communityId: currentCommunityId.value,
    roomName: '',
    state: '',
  })
}

/**
 * 查看申请详情
 */
function handleViewDetail(item: any) {
  loadApplicationDetail({
    page: 1,
    row: 1,
    communityId: item.communityId,
    ardId: item.ardId,
  })
}

/**
 * 提交验房
 */
function handleSubmitCheck() {
  if (!selectedApplication.value)
    return

  const checkData: CheckUpdateRequest = {
    ardId: selectedApplication.value.ardId,
    communityId: selectedApplication.value.communityId,
    startTime: selectedApplication.value.startTime,
    endTime: selectedApplication.value.endTime,
    createRemark: selectedApplication.value.createRemark,
    state: '2', // 验房通过
    checkRemark: '验房通过，房屋状况良好',
    photos: ['PHOTO_001', 'PHOTO_002'],
  }

  submitCheck(checkData)
}

/**
 * 加载字典数据
 */
function handleLoadDict() {
  loadDictData({
    name: 'apply_room_discount',
    type: 'state',
  })
}

/**
 * 加载费用折扣
 */
function handleLoadFeeDiscount() {
  loadFeeDiscountList({
    page: 1,
    row: 100,
    discountType: '3003',
    communityId: currentCommunityId.value,
  })
}

/**
 * 加载费用详情
 */
function handleLoadFeeDetail() {
  if (!selectedApplication.value)
    return

  loadFeeDetailList({
    page: 1,
    row: 50,
    communityId: selectedApplication.value.communityId,
    feeId: selectedApplication.value.feeId,
  })
}

/**
 * 加载跟踪记录
 */
function handleLoadRecord() {
  if (!selectedApplication.value)
    return

  loadRecordList({
    page: 1,
    row: 10,
    communityId: selectedApplication.value.communityId,
    ardId: selectedApplication.value.ardId,
    roomId: selectedApplication.value.roomId,
    roomName: selectedApplication.value.roomName,
  })
}

/**
 * 保存跟踪记录
 */
function handleSaveRecord() {
  if (!selectedApplication.value)
    return

  const recordData: SaveApplicationRecordRequest = {
    applicationId: selectedApplication.value.ardId,
    roomId: selectedApplication.value.roomId,
    roomName: selectedApplication.value.roomName,
    state: selectedApplication.value.state,
    stateName: selectedApplication.value.stateName,
    photos: ['PHOTO_003'],
    videoName: '',
    remark: '新增跟踪记录',
    detailType: '1001',
    communityId: selectedApplication.value.communityId,
    examineRemark: '',
    isTrue: 'false',
  }

  saveRecord(recordData)
}

// 生命周期
onMounted(() => {
  // 页面加载时自动加载数据
  handleLoadList()
  handleLoadDict()
})
</script>

<template>
  <view class="property-application-example">
    <view class="header">
      <text class="title">物业申请示例页面</text>
    </view>

    <!-- 操作按钮区域 -->
    <view class="actions">
      <button :disabled="listLoading" @click="handleLoadList">
        {{ listLoading ? '加载中...' : '加载物业申请列表' }}
      </button>
      <button @click="handleLoadDict">
        加载字典数据
      </button>
      <button @click="handleLoadFeeDiscount">
        加载费用折扣
      </button>
      <button :disabled="!selectedApplication" @click="handleLoadFeeDetail">
        加载费用详情
      </button>
      <button :disabled="!selectedApplication" @click="handleLoadRecord">
        加载跟踪记录
      </button>
    </view>

    <!-- 申请列表 -->
    <view class="list-section">
      <text class="section-title">申请列表</text>
      <view v-if="listLoading" class="loading">
        加载中...
      </view>
      <view v-else-if="applicationList?.data?.length" class="list">
        <view
          v-for="item in applicationList.data"
          :key="item.ardId"
          class="list-item"
          @click="handleViewDetail(item)"
        >
          <text class="item-title">{{ item.roomName }} - {{ item.stateName }}</text>
          <text class="item-desc">{{ item.createUserName }} - {{ item.createUserTel }}</text>
        </view>
      </view>
      <view v-else class="empty">
        暂无数据
      </view>
    </view>

    <!-- 申请详情 -->
    <view v-if="showDetail && selectedApplication" class="detail-section">
      <text class="section-title">申请详情</text>
      <view class="detail-content">
        <text>申请ID: {{ selectedApplication.ardId }}</text>
        <text>房间名称: {{ selectedApplication.roomName }}</text>
        <text>申请人: {{ selectedApplication.createUserName }}</text>
        <text>联系电话: {{ selectedApplication.createUserTel }}</text>
        <text>申请备注: {{ selectedApplication.createRemark }}</text>
        <text>当前状态: {{ selectedApplication.stateName }}</text>
      </view>

      <!-- 详情操作按钮 -->
      <view class="detail-actions">
        <button
          v-if="selectedApplication.state === '1'"
          :disabled="checkLoading"
          @click="handleSubmitCheck"
        >
          {{ checkLoading ? '提交中...' : '提交验房' }}
        </button>
        <button :disabled="saveRecordLoading" @click="handleSaveRecord">
          {{ saveRecordLoading ? '保存中...' : '添加跟踪记录' }}
        </button>
      </view>
    </view>

    <!-- 字典数据 -->
    <view v-if="dictData?.length" class="dict-section">
      <text class="section-title">字典数据</text>
      <view class="dict-list">
        <text v-for="item in dictData" :key="item.statusCd" class="dict-item">
          {{ item.name }} ({{ item.statusCd }})
        </text>
      </view>
    </view>

    <!-- 费用折扣 -->
    <view v-if="feeDiscountList?.length" class="discount-section">
      <text class="section-title">费用折扣</text>
      <view class="discount-list">
        <text v-for="item in feeDiscountList" :key="item.discountId" class="discount-item">
          {{ item.discountName }} - ¥{{ item.discountAmount }}
        </text>
      </view>
    </view>

    <!-- 费用详情 -->
    <view v-if="feeDetailList?.feeDetails?.length" class="fee-section">
      <text class="section-title">费用详情</text>
      <view class="fee-list">
        <text v-for="item in feeDetailList.feeDetails" :key="item.detailId" class="fee-item">
          {{ item.feeName }} - ¥{{ item.receivedAmount }}
        </text>
      </view>
    </view>

    <!-- 跟踪记录 -->
    <view v-if="recordList?.data?.length" class="record-section">
      <text class="section-title">跟踪记录</text>
      <view class="record-list">
        <text v-for="item in recordList.data" :key="item.ardrId" class="record-item">
          {{ item.createUserName }} - {{ item.remark }} ({{ item.createTime }})
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.property-application-example {
  padding: 20rpx;
}

.header {
  text-align: center;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.actions button {
  padding: 20rpx 30rpx;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.actions button:disabled {
  background-color: #ccc;
}

.list-section,
.detail-section,
.dict-section,
.discount-section,
.fee-section,
.record-section {
  margin-bottom: 40rpx;
  padding: 30rpx;
  background-color: #f8f8f8;
  border-radius: 15rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.loading {
  text-align: center;
  color: #666;
  padding: 40rpx;
}

.empty {
  text-align: center;
  color: #999;
  padding: 40rpx;
}

.list-item {
  padding: 20rpx;
  background-color: white;
  border-radius: 10rpx;
  margin-bottom: 15rpx;
}

.item-title {
  font-size: 30rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.item-desc {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.detail-content {
  margin-bottom: 20rpx;
}

.detail-content text {
  display: block;
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #333;
}

.detail-actions {
  display: flex;
  gap: 20rpx;
}

.detail-actions button {
  flex: 1;
  padding: 20rpx;
  background-color: #34c759;
  color: white;
  border: none;
  border-radius: 10rpx;
  font-size: 28rpx;
}

.dict-item,
.discount-item,
.fee-item,
.record-item {
  display: block;
  padding: 15rpx;
  background-color: white;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #333;
}
</style>
