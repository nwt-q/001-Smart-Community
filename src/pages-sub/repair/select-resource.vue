<!--
  选择维修物资
  功能：选择维修所需的物品/资源，支持标准商品和自定义商品

  访问地址: http://localhost:9000/#/pages-sub/repair/select-resource
  建议携带参数: ?feeFlag=1001

  完整示例: http://localhost:9000/#/pages-sub/repair/select-resource?feeFlag=1001
-->

<script setup lang="ts">
import type { RepairResource } from '@/types/repair'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, ref } from 'vue'
import { getRepairResources, getRepairResourceTypes } from '@/api/repair'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '选择物品',
    enablePullDownRefresh: false,
  },
})

interface ResourceType {
  rstId: string
  name: string
  parentId?: string
}

/** 页面参数 */
const feeFlag = ref('')

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 是否自定义 */
const isCustom = ref(false)

/** 商品类型（一级分类） */
const parentTypeOptions = ref<ResourceType[]>([{ rstId: '', name: '请选择商品类型' }])
const selectedParentTypeIndex = ref(0)
const parentRstId = computed(() => parentTypeOptions.value[selectedParentTypeIndex.value]?.rstId || '')

/** 商品子类型（二级分类） */
const sonTypeOptions = ref<ResourceType[]>([{ rstId: '', name: '请选择商品类型' }])
const selectedSonTypeIndex = ref(0)
const rstId = computed(() => sonTypeOptions.value[selectedSonTypeIndex.value]?.rstId || '')

/** 商品列表 */
const resourceOptions = ref<RepairResource[]>([])
const selectedResourceIndex = ref(0)
const selectedResource = computed(() => resourceOptions.value[selectedResourceIndex.value] || {})

/** 自定义商品名 */
const customGoodsName = ref('')

/** 价格 */
const price = ref<number>(0)
const priceDisabled = ref(false)

/** 数量 */
const quantity = ref(1)

/** 加载商品类型（一级分类） */
const { send: loadParentTypes } = useRequest(
  () =>
    getRepairResourceTypes({
      communityId: communityInfo.communityId,
      parentId: '0',
    }),
  { immediate: true },
)
  .onSuccess((result) => {
    parentTypeOptions.value = [
      { rstId: '', name: '请选择商品类型' },
      ...result,
      { rstId: 'custom', name: '自定义' },
    ]
  })
  .onError((error) => {
    console.error('加载商品类型失败:', error)
  })

/** 加载商品子类型（二级分类） */
const { send: loadSonTypes } = useRequest(
  (parentId: string) =>
    getRepairResourceTypes({
      communityId: communityInfo.communityId,
      parentId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    sonTypeOptions.value = [{ rstId: '', name: '请选择商品类型' }, ...result]
    selectedSonTypeIndex.value = 0
  })
  .onError((error) => {
    console.error('加载商品子类型失败:', error)
  })

/** 加载商品列表 */
const { send: loadResources } = useRequest(
  (typeId: string) =>
    getRepairResources({
      rstId: typeId,
      communityId: communityInfo.communityId,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    if (result.resources && result.resources.length > 0) {
      resourceOptions.value = result.resources
      selectedResourceIndex.value = 0
    }
    else {
      uni.showToast({
        title: '暂无商品',
        icon: 'none',
      })
      resourceOptions.value = []
      selectedResourceIndex.value = 0
    }
  })
  .onError((error) => {
    console.error('加载商品列表失败:', error)
  })

/** 页面加载 */
onLoad((options) => {
  feeFlag.value = (options?.feeFlag as string) || ''
})

/** 一级分类改变 */
function handleParentTypeChange({ value }: { value: number }) {
  selectedParentTypeIndex.value = value

  // 清空二级分类和商品
  sonTypeOptions.value = [{ rstId: '', name: '请选择商品类型' }]
  selectedSonTypeIndex.value = 0
  resourceOptions.value = []
  selectedResourceIndex.value = 0
  price.value = 0
  priceDisabled.value = false

  if (value === 0) {
    isCustom.value = false
    return
  }

  const selected = parentTypeOptions.value[value]
  if (selected.rstId === 'custom') {
    // 选择自定义
    isCustom.value = true
  }
  else {
    // 选择标准类型，加载二级分类
    isCustom.value = false
    loadSonTypes(selected.rstId)
  }
}

/** 二级分类改变 */
function handleSonTypeChange({ value }: { value: number }) {
  selectedSonTypeIndex.value = value

  // 清空商品
  resourceOptions.value = []
  selectedResourceIndex.value = 0
  price.value = 0
  priceDisabled.value = false

  if (value === 0)
    return

  const selected = sonTypeOptions.value[value]
  loadResources(selected.rstId)
}

/** 商品选择改变 */
function handleResourceChange({ value }: { value: number }) {
  selectedResourceIndex.value = value

  if (value === 0) {
    price.value = 0
    priceDisabled.value = false
    return
  }

  const selected = resourceOptions.value[value]
  // 如果价格固定，自动填充价格
  if (selected.outLowPrice === selected.outHighPrice) {
    price.value = selected.outLowPrice || 0
    priceDisabled.value = true
  }
  else {
    price.value = 0
    priceDisabled.value = false
  }
}

/** 数量减少 */
function handleDecreaseQuantity() {
  if (quantity.value <= 1) {
    uni.showToast({
      title: '不能再减少了',
      icon: 'none',
    })
    return
  }
  quantity.value--
}

/** 数量增加 */
function handleIncreaseQuantity() {
  quantity.value++
}

/** 确认选择 */
function handleConfirm() {
  // 验证
  let errorMsg = ''

  if (isCustom.value) {
    // 自定义商品
    if (!customGoodsName.value.trim()) {
      errorMsg = '请输入商品名'
    }
    else if (feeFlag.value === '1001' && !price.value) {
      errorMsg = '请输入有效金额'
    }
  }
  else {
    // 标准商品
    if (!rstId.value) {
      errorMsg = '请选择商品类型'
    }
    else if (!selectedResource.value.resId) {
      errorMsg = '请选择商品'
    }
    else if (quantity.value < 1) {
      errorMsg = '商品数量不能为零'
    }
    else if (feeFlag.value === '1001' && !price.value) {
      errorMsg = '请输入有效金额'
    }
  }

  if (errorMsg) {
    uni.showToast({
      title: errorMsg,
      icon: 'none',
    })
    return
  }

  // 构建选择的商品数据
  const chooseResource: RepairResource = {
    ...selectedResource.value,
    price: price.value,
    useNumber: quantity.value,
    isCustom: isCustom.value,
    customGoodsName: customGoodsName.value,
  }

  if (isCustom.value) {
    chooseResource.resName = customGoodsName.value
    chooseResource.resTypeName = '自定义'
  }

  // 通过 uni.$emit 传递数据（兼容旧项目方式）
  uni.$emit('getResourceInfo', JSON.stringify(chooseResource))

  // 返回上一页
  uni.navigateBack({
    delta: 1,
  })
}

/** 取消 */
function handleCancel() {
  uni.navigateBack({
    delta: 1,
  })
}
</script>

<template>
  <view class="select-resource-page">
    <!-- 商品类型（一级分类） -->
    <view class="bg-white">
      <wd-cell-group border>
        <wd-cell title="商品类型" center>
          <template #value>
            <wd-picker
              v-model="selectedParentTypeIndex"
              :columns="parentTypeOptions"
              label-key="name"
              value-key="rstId"
              @confirm="handleParentTypeChange"
            >
              <text class="text-blue-500">
                {{ parentTypeOptions[selectedParentTypeIndex]?.name || '请选择' }}
              </text>
            </wd-picker>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 自定义商品 -->
    <view v-if="isCustom" class="mt-3 bg-white">
      <wd-cell-group border>
        <wd-cell title="商品名" center>
          <template #value>
            <input
              v-model="customGoodsName"
              placeholder="请输入商品名"
              class="text-right"
            >
          </template>
        </wd-cell>
        <wd-cell v-if="feeFlag === '1001'" title="自定义价格" center>
          <template #value>
            <input
              v-model="price"
              type="digit"
              placeholder="请输入自定义价格"
              class="text-right"
            >
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 标准商品 -->
    <view v-else class="mt-3 bg-white">
      <wd-cell-group border>
        <!-- 二级分类 -->
        <wd-cell title="二级分类" center>
          <template #value>
            <wd-picker
              v-model="selectedSonTypeIndex"
              :columns="sonTypeOptions"
              label-key="name"
              value-key="rstId"
              @confirm="handleSonTypeChange"
            >
              <text class="text-blue-500">
                {{ sonTypeOptions[selectedSonTypeIndex]?.name || '请选择' }}
              </text>
            </wd-picker>
          </template>
        </wd-cell>

        <!-- 商品选择 -->
        <wd-cell v-if="rstId" title="商品" center>
          <template #value>
            <wd-picker
              v-model="selectedResourceIndex"
              :columns="resourceOptions"
              label-key="resName"
              value-key="resId"
              @confirm="handleResourceChange"
            >
              <text class="text-blue-500">
                {{ resourceOptions[selectedResourceIndex]?.resName || '请选择商品' }}
              </text>
            </wd-picker>
          </template>
        </wd-cell>

        <!-- 价格 -->
        <wd-cell v-if="selectedResourceIndex !== 0 && feeFlag === '1001'" title="单价" center>
          <template #value>
            <input
              v-model="price"
              type="digit"
              :disabled="priceDisabled"
              placeholder="请输入单价"
              class="text-right"
            >
          </template>
        </wd-cell>

        <!-- 价格范围提示 -->
        <view
          v-if="selectedResourceIndex !== 0 && feeFlag === '1001' && selectedResource.outLowPrice !== undefined"
          class="px-4 py-2 text-right text-sm text-gray-500"
        >
          <text v-if="selectedResource.outHighPrice === selectedResource.outLowPrice">
            价格: {{ selectedResource.outLowPrice }}
          </text>
          <text v-else>
            价格范围: {{ selectedResource.outLowPrice }} - {{ selectedResource.outHighPrice }}
          </text>
        </view>

        <!-- 规格 -->
        <wd-cell v-if="selectedResourceIndex !== 0" title="规格" center>
          <template #value>
            <text class="text-gray-400">{{ selectedResource.specName || '-' }}</text>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 数量 -->
    <view class="mt-3 bg-white">
      <wd-cell-group border>
        <wd-cell title="数量" center>
          <template #value>
            <view class="flex items-center gap-2">
              <wd-button size="small" @click="handleDecreaseQuantity">
                -
              </wd-button>
              <input
                v-model="quantity"
                type="number"
                disabled
                class="h-8 w-16 text-center"
              >
              <wd-button size="small" @click="handleIncreaseQuantity">
                +
              </wd-button>
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 操作按钮 -->
    <view class="mt-6 px-3 space-y-3">
      <wd-button block type="success" size="large" @click="handleConfirm">
        确定
      </wd-button>
      <wd-button block size="large" @click="handleCancel">
        取消
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.select-resource-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 12px;
}
</style>
