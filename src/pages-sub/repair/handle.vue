<!--
  处理维修工单
  功能：处理维修工单，支持派单/转单/退单/办结

  访问地址: http://localhost:9000/#/pages-sub/repair/handle
  建议携带参数: ?action=DISPATCH&repairId=REP_001&repairType=水电维修

  完整示例: http://localhost:9000/#/pages-sub/repair/handle?action=DISPATCH&repairId=REP_001&repairType=水电维修&repairObjType=001
-->

<script setup lang="ts">
import type { DispatchAction, MaintenanceType, PaymentType, RepairObjType, RepairResource, RepairStaff } from '@/types/repair'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import { dispatchRepair, finishRepair, getRepairPayTypes, getRepairStaffs } from '@/api/repair'
import { TypedRouter } from '@/router'
import { getCurrentCommunity, getUserInfo } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '处理工单',
    enablePullDownRefresh: false,
  },
})

/** 页面参数 */
const action = ref<DispatchAction>('DISPATCH')
const repairId = ref('')
const repairType = ref('')
const repairObjType = ref<RepairObjType>('001')
const repairChannel = ref('')
const publicArea = ref('')
const preStaffId = ref('')
const preStaffName = ref('')

/** 用户信息 */
const userInfo = getUserInfo()
const communityInfo = getCurrentCommunity()

/** 维修师傅选择 */
const staffOptions = ref<RepairStaff[]>([])
const selectedStaffIndex = ref(0)
const selectedStaff = computed(() => staffOptions.value[selectedStaffIndex.value])

/** 是否用料/维修类型 */
const feeOptions = ref<Array<{ id: MaintenanceType | '', name: string }>>([
  { id: '', name: '请选择' },
])
const selectedFeeIndex = ref(0)
const feeFlag = computed(() => feeOptions.value[selectedFeeIndex.value]?.id || '')

/** 商品列表 */
const resourceList = ref<RepairResource[]>([])
const totalAmount = ref(0)

/** 支付方式 */
const payTypeOptions = ref<Array<{ statusCd: PaymentType | '', name: string }>>([
  { statusCd: '', name: '请选择' },
])
const selectedPayTypeIndex = ref(0)
const payType = computed(() => payTypeOptions.value[selectedPayTypeIndex.value]?.statusCd || '')

/** 处理意见 */
const content = ref('')

/** 图片上传 */
const beforePhotos = ref<string[]>([])
const afterPhotos = ref<string[]>([])

/** 加载维修师傅列表 */
const { send: loadStaffs } = useRequest(
  () =>
    getRepairStaffs({
      repairType: repairType.value,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    staffOptions.value = [
      { staffId: '', staffName: '请选择员工' },
      ...result,
    ]
  })
  .onError((error) => {
    console.error('加载师傅列表失败:', error)
  })

/** 加载支付方式 */
const { send: loadPayTypes } = useRequest(() => getRepairPayTypes(), { immediate: false })
  .onSuccess((result) => {
    payTypeOptions.value = [
      { statusCd: '', name: '请选择' },
      ...result.map(item => ({
        statusCd: item.statusCd as PaymentType,
        name: item.name || '',
      })),
    ]
  })
  .onError((error) => {
    console.error('加载支付方式失败:', error)
  })

/** 页面加载 */
onLoad((options) => {
  action.value = (options?.action as DispatchAction) || 'DISPATCH'
  repairId.value = (options?.repairId as string) || ''
  repairType.value = (options?.repairType as string) || ''
  repairObjType.value = (options?.repairObjType as RepairObjType) || '001'
  repairChannel.value = (options?.repairChannel as string) || ''
  publicArea.value = (options?.publicArea as string) || ''
  preStaffId.value = (options?.preStaffId as string) || ''
  preStaffName.value = (options?.preStaffName as string) || ''

  // 初始化是否用料选项
  if (repairObjType.value === '004') {
    // 公共区域
    feeOptions.value = [
      { id: '', name: '请选择' },
      { id: '1001', name: '有偿服务' },
      { id: '1002', name: '无偿服务' },
    ]
  }
  else {
    // 非公共区域
    feeOptions.value = [
      { id: '', name: '请选择' },
      { id: '1003', name: '需要用料' },
      { id: '1004', name: '无需用料' },
    ]
  }

  // 加载维修师傅列表（派单/转单时需要）
  if (action.value !== 'FINISH') {
    loadStaffs()
  }

  // 加载支付方式
  loadPayTypes()
})

/** 师傅选择改变 */
function handleStaffChange({ value }: { value: number }) {
  selectedStaffIndex.value = value
}

/** 是否用料改变 */
function handleFeeChange({ value }: { value: number }) {
  selectedFeeIndex.value = value
}

/** 支付方式改变 */
function handlePayTypeChange({ value }: { value: number }) {
  selectedPayTypeIndex.value = value
}

/** 打开选择商品页面 */
function handleSelectResource() {
  TypedRouter.toSelectResource(feeFlag.value)
}

/** 增加商品数量 */
function handleIncreaseQuantity(index: number) {
  resourceList.value[index].useNumber = (resourceList.value[index].useNumber || 0) + 1
  updateTotalAmount()
}

/** 减少商品数量 */
function handleDecreaseQuantity(index: number) {
  if ((resourceList.value[index].useNumber || 0) <= 1) {
    uni.showToast({
      title: '不能再减少啦',
      icon: 'none',
    })
    return
  }
  resourceList.value[index].useNumber = (resourceList.value[index].useNumber || 1) - 1
  updateTotalAmount()
}

/** 更新价格 */
function handlePriceChange(index: number, price: string) {
  resourceList.value[index].price = Number(price)
  updateTotalAmount()
}

/** 更新数量 */
function handleQuantityChange(index: number, quantity: string) {
  resourceList.value[index].useNumber = Number(quantity)
  updateTotalAmount()
}

/** 移除商品 */
function handleRemoveResource(index: number) {
  resourceList.value.splice(index, 1)
  updateTotalAmount()
}

/** 更新总价 */
function updateTotalAmount() {
  totalAmount.value = resourceList.value.reduce((sum, item) => {
    const num = item.useNumber || 0
    const price = item.price || 0
    return sum + num * price
  }, 0)
}

/** 维修前图片上传 */
function handleBeforePhotosChange(fileIds: string[]) {
  beforePhotos.value = fileIds
}

/** 维修后图片上传 */
function handleAfterPhotosChange(fileIds: string[]) {
  afterPhotos.value = fileIds
}

/** 提交派单/转单/退单 */
async function handleSubmitDispatch() {
  // 验证
  if (selectedStaffIndex.value === 0) {
    uni.showToast({
      title: '请选择维修师傅',
      icon: 'none',
    })
    return
  }

  if (!content.value.trim()) {
    uni.showToast({
      title: '请填写处理意见',
      icon: 'none',
    })
    return
  }

  try {
    uni.showLoading({ title: '提交中...' })

    await dispatchRepair({
      repairId: repairId.value,
      staffId: selectedStaff.value.staffId,
      staffName: selectedStaff.value.staffName || '',
      action: action.value,
      context: content.value,
      repairType: repairType.value,
      communityId: communityInfo.communityId,
      userId: userInfo.userId,
      userName: userInfo.userName,
    })

    uni.hideLoading()
    uni.showToast({
      title: '提交成功',
      icon: 'success',
    })

    setTimeout(() => {
      if (action.value === 'DISPATCH') {
        TypedRouter.toRepairList()
      }
      else {
        TypedRouter.toRepairDispatch()
      }
    }, 1500)
  }
  catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: (error as Error)?.message || '提交失败',
      icon: 'none',
    })
  }
}

/** 提交办结 */
async function handleSubmitFinish() {
  // 验证
  if (selectedFeeIndex.value === 0) {
    uni.showToast({
      title: repairObjType.value === '004' ? '请选择维修类型' : '请选择是否用料',
      icon: 'none',
    })
    return
  }

  if ((feeFlag.value === '1001' || feeFlag.value === '1003') && resourceList.value.length === 0) {
    uni.showToast({
      title: '请选择商品',
      icon: 'none',
    })
    return
  }

  if (feeFlag.value === '1001' && selectedPayTypeIndex.value === 0) {
    uni.showToast({
      title: '请选择支付方式',
      icon: 'none',
    })
    return
  }

  if (!content.value.trim()) {
    uni.showToast({
      title: '请填写处理意见',
      icon: 'none',
    })
    return
  }

  try {
    uni.showLoading({ title: '处理中...' })

    await finishRepair({
      repairId: repairId.value,
      maintenanceType: feeFlag.value as MaintenanceType,
      context: content.value,
      repairType: repairType.value,
      communityId: communityInfo.communityId,
      userId: userInfo.userId,
      userName: userInfo.userName,
      choosedGoodsList: resourceList.value,
      totalPrice: totalAmount.value,
      payType: payType.value as PaymentType,
      beforePhotos: beforePhotos.value.map(photo => ({ photo })),
      afterPhotos: afterPhotos.value.map(photo => ({ photo })),
      publicArea: publicArea.value,
      repairChannel: repairChannel.value,
    })

    uni.hideLoading()
    uni.showToast({
      title: '办结成功',
      icon: 'success',
    })

    setTimeout(() => {
      TypedRouter.toRepairDispatch()
    }, 1500)
  }
  catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: (error as Error)?.message || '办结失败',
      icon: 'none',
    })
  }
}

/** 提交处理 */
function handleSubmit() {
  if (action.value === 'FINISH') {
    handleSubmitFinish()
  }
  else {
    handleSubmitDispatch()
  }
}

/** 页面标题 */
const pageTitle = computed(() => {
  switch (action.value) {
    case 'DISPATCH':
      return '派单'
    case 'TRANSFER':
      return '转单'
    case 'RETURN':
      return '退单'
    case 'FINISH':
      return '办结'
    default:
      return '处理工单'
  }
})
</script>

<template>
  <view class="repair-handle-page">
    <!-- 维修师傅选择 (派单/转单/退单) -->
    <view v-if="action !== 'FINISH'" class="bg-white">
      <wd-cell-group border>
        <wd-cell title="维修师傅" center>
          <template v-if="action === 'RETURN'" #value>
            <text class="text-gray-400">{{ preStaffName }}</text>
          </template>
          <template v-else #value>
            <wd-picker
              v-model="selectedStaffIndex"
              :columns="staffOptions"
              label-key="staffName"
              value-key="staffId"
              @confirm="handleStaffChange"
            >
              <text class="text-blue-500">{{ staffOptions[selectedStaffIndex]?.staffName || '请选择' }}</text>
            </wd-picker>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 是否用料/维修类型 (办结) -->
    <view v-else class="bg-white">
      <wd-cell-group border>
        <wd-cell :title="repairObjType === '004' ? '维修类型' : '是否用料'" center>
          <template #value>
            <wd-picker
              v-model="selectedFeeIndex"
              :columns="feeOptions"
              label-key="name"
              value-key="id"
              @confirm="handleFeeChange"
            >
              <text class="text-blue-500">{{ feeOptions[selectedFeeIndex]?.name || '请选择' }}</text>
            </wd-picker>
          </template>
        </wd-cell>
      </wd-cell-group>

      <!-- 选择商品按钮 -->
      <view v-if="feeFlag === '1001' || feeFlag === '1003'" class="p-3">
        <wd-button block type="primary" @click="handleSelectResource">
          选择商品
        </wd-button>
      </view>

      <!-- 商品列表 -->
      <view v-if="(feeFlag === '1001' || feeFlag === '1003') && resourceList.length > 0" class="bg-white p-3">
        <view class="resource-table">
          <!-- 表头 -->
          <view class="table-header flex items-center gap-2 pb-2 text-sm font-bold">
            <view class="flex-1">
              商品
            </view>
            <view v-if="feeFlag === '1001'" class="w-20 text-center">
              价格
            </view>
            <view class="w-24 text-center">
              数量
            </view>
            <view class="w-16 text-center">
              操作
            </view>
          </view>

          <!-- 商品项 -->
          <view
            v-for="(item, index) in resourceList"
            :key="index"
            class="table-row border-t border-gray-100 py-2"
          >
            <view class="flex items-center gap-2">
              <!-- 商品名称 -->
              <view class="flex-1 text-sm">
                <text v-if="!item.isCustom">{{ item.resName }}({{ item.specName || '-' }})</text>
                <text v-else>{{ item.customGoodsName }}</text>
              </view>

              <!-- 价格 -->
              <view v-if="feeFlag === '1001'" class="w-20">
                <input
                  v-model="item.price"
                  type="digit"
                  class="h-8 w-full border border-gray-200 rounded px-2 text-center text-sm"
                  :disabled="!item.isCustom && item.outHighPrice === item.outLowPrice"
                  @input="handlePriceChange(index, $event.detail.value)"
                >
              </view>

              <!-- 数量 -->
              <view class="w-24 flex items-center justify-center gap-1">
                <text class="text-xl text-gray-600" @click="handleDecreaseQuantity(index)">-</text>
                <input
                  v-model="item.useNumber"
                  type="number"
                  class="h-8 w-12 border border-gray-200 rounded text-center text-sm"
                  @input="handleQuantityChange(index, $event.detail.value)"
                >
                <text class="text-xl text-gray-600" @click="handleIncreaseQuantity(index)">+</text>
              </view>

              <!-- 操作 -->
              <view class="w-16 text-center">
                <text class="text-sm text-red-500" @click="handleRemoveResource(index)">移除</text>
              </view>
            </view>

            <!-- 价格范围提示 -->
            <view
              v-if="feeFlag === '1001' && !item.isCustom && item.outHighPrice !== item.outLowPrice"
              class="mt-1 text-xs text-gray-500"
            >
              价格范围({{ item.outLowPrice }} - {{ item.outHighPrice }})
            </view>
          </view>
        </view>

        <!-- 总价 -->
        <view v-if="feeFlag === '1001'" class="mt-3 border-t border-gray-200 pt-3">
          <wd-cell title="总计" :value="`¥${totalAmount.toFixed(2)}`" />
        </view>
      </view>

      <!-- 支付方式 -->
      <view v-if="feeFlag === '1001'" class="bg-white">
        <wd-cell-group border>
          <wd-cell title="支付方式" center>
            <template #value>
              <wd-picker
                v-model="selectedPayTypeIndex"
                :columns="payTypeOptions"
                label-key="name"
                value-key="statusCd"
                @confirm="handlePayTypeChange"
              >
                <text class="text-blue-500">{{ payTypeOptions[selectedPayTypeIndex]?.name || '请选择' }}</text>
              </wd-picker>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>
    </view>

    <!-- 处理意见 -->
    <view class="mt-3 bg-white p-3">
      <view class="mb-2 text-sm font-bold">
        处理意见
      </view>
      <wd-textarea
        v-model="content"
        placeholder="请输入处理意见"
        :maxlength="500"
        show-word-limit
        :rows="4"
      />
    </view>

    <!-- 图片上传 (办结时) -->
    <view v-if="action === 'FINISH'" class="mt-3 space-y-3">
      <!-- 这里暂时使用占位，实际应使用 vc-upload-async 组件 -->
      <view class="bg-white p-3">
        <view class="mb-2 text-sm font-bold">
          维修前图片
        </view>
        <view class="text-sm text-gray-500">
          <text>（图片上传功能待集成 vc-upload-async 组件）</text>
        </view>
      </view>

      <view class="bg-white p-3">
        <view class="mb-2 text-sm font-bold">
          维修后图片
        </view>
        <view class="text-sm text-gray-500">
          <text>（图片上传功能待集成 vc-upload-async 组件）</text>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="p-3">
      <wd-button block type="success" size="large" @click="handleSubmit">
        {{ action === 'FINISH' ? '办结' : '提交' }}
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.repair-handle-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 12px;
}

.resource-table {
  .table-header {
    border-bottom: 2px solid #e5e7eb;
  }

  .table-row {
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
