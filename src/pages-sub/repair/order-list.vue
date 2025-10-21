<!--
  维修工单池
  功能：显示维修工单列表，支持搜索和筛选

  访问地址: http://localhost:9000/#/pages-sub/repair/order-list
  建议携带参数: ?status=PENDING&page=1&row=10

  完整示例: http://localhost:9000/#/pages-sub/repair/order-list?status=PENDING&page=1&row=10
-->

<script setup lang="ts">
import type { RepairOrder } from '@/types/repair'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getRepairOrderList } from '@/api/repair'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '维修工单池',
    enablePullDownRefresh: true,
  },
})

/** 列表数据 */
const repairList = ref<RepairOrder[]>([])
const total = ref(0)

/** 请求管理 - 加载维修工单列表 */
const {
  loading,
  send: loadList,
  onSuccess,
  onError,
} = useRequest(() => getRepairOrderList({ page: 1, row: 10 }), { immediate: false })

/** 成功回调 */
onSuccess((result) => {
  repairList.value = result.ownerRepairs || []
  total.value = result.total || 0
  console.log('✅ 加载成功:', result)
  uni.showToast({
    title: `加载成功，共 ${result.total} 条`,
    icon: 'success',
  })
})

/** 失败回调 */
onError((error) => {
  console.error('❌ 加载失败:', error)
  uni.showToast({
    title: '加载失败',
    icon: 'none',
  })
})

/** 加载数据 */
function handleLoad() {
  loadList()
}

/** 查看工单详情 - 使用列表中的第一个工单 */
function handleGoToDetail() {
  if (repairList.value.length > 0) {
    TypedRouter.toRepairDetail(repairList.value[0].repairId)
  }
  else {
    TypedRouter.toRepairDetail('REP_001', 'STORE_001')
  }
}

/** 派单 - 使用列表中的第一个工单 */
function handleDispatch() {
  const repairId = repairList.value.length > 0 ? repairList.value[0].repairId : 'REP_001'
  TypedRouter.toRepairHandle({
    action: 'DISPATCH',
    repairId,
    repairType: '水电维修',
  })
}

/** 结束订单 - 使用列表中的第一个工单 */
function handleEndOrder() {
  const repairId = repairList.value.length > 0 ? repairList.value[0].repairId : 'REP_001'
  TypedRouter.toEndRepair(repairId, 'COMM_001')
}
</script>

<template>
  <view class="repair-order-list-page p-4">
    <view class="mb-4 text-center">
      <text class="text-lg text-gray-600">维修工单池页面</text>
    </view>

    <!-- 接口测试区域 -->
    <view class="mb-4 rounded bg-blue-50 p-4">
      <view class="mb-2">
        <text class="text-sm font-bold">接口测试</text>
      </view>
      <button class="w-full" type="primary" :loading="loading" :disabled="loading" @click="handleLoad">
        {{ loading ? '加载中...' : '加载维修工单列表' }}
      </button>
      <view v-if="total > 0" class="mt-2 text-sm text-gray-600">
        <text>已加载 {{ repairList.length }} 条数据（共 {{ total }} 条）</text>
      </view>
    </view>

    <!-- 数据展示区域 -->
    <view v-if="repairList.length > 0" class="mb-4">
      <view class="mb-2">
        <text class="text-sm font-bold">工单列表</text>
      </view>
      <view
        v-for="item in repairList.slice(0, 5)"
        :key="item.repairId"
        class="mb-2 rounded bg-white p-3 shadow"
      >
        <view class="mb-1 flex justify-between">
          <text class="text-sm font-bold">{{ item.repairId }}</text>
          <text class="text-xs text-gray-500">{{ item.status }}</text>
        </view>
        <view class="mb-1 text-sm text-gray-700">
          <text>{{ item.title }}</text>
        </view>
        <view class="text-xs text-gray-500">
          <text>{{ item.ownerName }} · {{ item.address }}</text>
        </view>
      </view>
      <view v-if="repairList.length > 5" class="text-center text-sm text-gray-500">
        <text>仅显示前 5 条，共 {{ repairList.length }} 条</text>
      </view>
    </view>

    <!-- 临时测试按钮 - 模拟业务流程跳转 -->
    <view class="space-y-2">
      <button class="w-full" type="primary" @click="handleGoToDetail">
        查看工单详情
      </button>
      <button class="w-full" type="primary" @click="handleDispatch">
        派单处理
      </button>
      <button class="w-full" type="warn" @click="handleEndOrder">
        结束订单
      </button>
    </view>

    <view class="mt-4 text-center">
      <text class="text-sm text-gray-400">此页面用于显示维修工单列表，支持搜索和筛选功能</text>
    </view>
  </view>
</template>

<style scoped></style>
