<!--
  添加维修记录
  功能：新增维修工单，支持选择楼栋/单元/房屋

  访问地址: http://localhost:9000/#/pages-sub/repair/add-order
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/repair/add-order?communityId=COMM_001
-->

<script setup lang="ts">
import type { CreateRepairReq, RepairObjType } from '@/types/repair'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { createRepairOrder, getRepairSettings } from '@/api/repair'
import { TypedRouter } from '@/router'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '添加维修记录',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 位置类型选项 */
const repairScopes = [
  { id: '001' as RepairObjType, name: '小区' },
  { id: '002' as RepairObjType, name: '楼栋' },
  { id: '003' as RepairObjType, name: '单元' },
  { id: '004' as RepairObjType, name: '房屋' },
]

/** 选中的位置类型 */
const selectedScopeIndex = ref(0)
const repairObjType = computed(() => repairScopes[selectedScopeIndex.value].id)
const publicArea = computed(() => repairObjType.value === '004' ? 'F' : 'T')

/** 楼栋信息 */
const floorNum = ref('')
const floorId = ref('')

/** 单元信息 */
const unitNum = ref('')
const unitId = ref('')

/** 房屋信息 */
const roomNum = ref('')
const roomId = ref('')

/** 报修类型列表 */
const repairTypes = ref<Array<{
  repairType: string
  repairTypeName: string
  payFeeFlag: 'T' | 'F'
  priceScope?: string
}>>([])
const selectedRepairTypeIndex = ref(0)
const selectedRepairType = computed(() => repairTypes.value[selectedRepairTypeIndex.value])
const priceScope = computed(() => {
  if (selectedRepairType.value?.payFeeFlag === 'T') {
    return selectedRepairType.value.priceScope || ''
  }
  return ''
})

/** 报修人信息 */
const repairName = ref('')
const tel = ref('')

/** 预约时间 */
const appointmentDate = ref('')
const appointmentTime = ref('')
const showDatePicker = ref(false)
const showTimePicker = ref(false)

/** 报修内容 */
const context = ref('')

/** 图片列表 */
const photos = ref<string[]>([])

/** 加载报修类型 */
const { send: loadRepairTypes } = useRequest(
  () =>
    getRepairSettings({
      communityId: communityInfo.communityId,
      publicArea: publicArea.value,
      page: 1,
      row: 50,
    }),
)
  .onSuccess((result) => {
    repairTypes.value = result.data
    if (result.data.length > 0) {
      selectedRepairTypeIndex.value = 0
    }
  })
  .onError((error) => {
    console.error('加载报修类型失败:', error)
  })

/** 页面加载 */
onLoad(() => {
  // 加载报修类型
  loadRepairTypes()
})

/** 页面显示（从楼栋/单元/房屋选择页返回） */
onShow(() => {
  // 从缓存读取选择的楼栋/单元/房屋
  const selectFloor = uni.getStorageSync('_selectFloor')
  if (selectFloor) {
    floorNum.value = `${selectFloor.floorNum}栋`
    floorId.value = selectFloor.floorId
  }

  const selectUnit = uni.getStorageSync('_selectUnit')
  if (selectUnit) {
    unitNum.value = `${selectUnit.unitNum}单元`
    unitId.value = selectUnit.unitId
  }

  const selectRoom = uni.getStorageSync('_selectRoom')
  if (selectRoom) {
    roomNum.value = `${selectRoom.roomNum}室`
    roomId.value = selectRoom.roomId
  }
})

/** 页面卸载 */
onUnload(() => {
  // 清理缓存
  uni.removeStorageSync('_selectFloor')
  uni.removeStorageSync('_selectUnit')
  uni.removeStorageSync('_selectRoom')
})

/** 位置类型改变 */
function handleScopeChange({ value }: { value: number }) {
  selectedScopeIndex.value = value
  // 重新加载报修类型
  loadRepairTypes()
  // 清空位置信息
  clearLocationInfo()
}

/** 清空位置信息 */
function clearLocationInfo() {
  floorNum.value = ''
  floorId.value = ''
  unitNum.value = ''
  unitId.value = ''
  roomNum.value = ''
  roomId.value = ''
}

/** 选择楼栋 */
function handleChooseFloor() {
  // 清空所有位置信息
  uni.removeStorageSync('_selectFloor')
  uni.removeStorageSync('_selectUnit')
  uni.removeStorageSync('_selectRoom')
  clearLocationInfo()

  // TODO: 跳转到楼栋选择页面（暂时提示）
  uni.showToast({
    title: '楼栋选择页面待实现',
    icon: 'none',
  })
}

/** 选择单元 */
function handleChooseUnit() {
  if (!floorId.value) {
    uni.showToast({
      title: '请先选择楼栋',
      icon: 'none',
    })
    return
  }

  uni.removeStorageSync('_selectUnit')
  uni.removeStorageSync('_selectRoom')
  unitNum.value = ''
  unitId.value = ''
  roomNum.value = ''
  roomId.value = ''

  // TODO: 跳转到单元选择页面（暂时提示）
  uni.showToast({
    title: '单元选择页面待实现',
    icon: 'none',
  })
}

/** 选择房屋 */
function handleChooseRoom() {
  if (!unitId.value) {
    uni.showToast({
      title: '请先选择单元',
      icon: 'none',
    })
    return
  }

  uni.removeStorageSync('_selectRoom')
  roomNum.value = ''
  roomId.value = ''

  // TODO: 跳转到房屋选择页面（暂时提示）
  uni.showToast({
    title: '房屋选择页面待实现',
    icon: 'none',
  })
}

/** 报修类型改变 */
function handleRepairTypeChange({ value }: { value: number }) {
  selectedRepairTypeIndex.value = value
}

/** 日期选择确认 */
function handleDateConfirm({ value }: { value: number }) {
  appointmentDate.value = dayjs(value).format('YYYY-MM-DD')
  showDatePicker.value = false
}

/** 时间选择确认 */
function handleTimeConfirm({ value }: { value: string }) {
  appointmentTime.value = value
  showTimePicker.value = false
}

/**
 * 表单验证
 * @returns 返回错误信息，如果验证通过则返回空字符串
 * @example
 * const error = validateForm()
 * if (error) showToast(error)
 */
function validateForm(): string {
  if (!selectedRepairType.value?.repairType) {
    return '请选择报修类型'
  }
  if (!repairName.value.trim()) {
    return '请填写报修人'
  }
  if (!tel.value.trim()) {
    return '请填写手机号'
  }
  // 简单的手机号验证
  if (!/^1[3-9]\d{9}$/.test(tel.value)) {
    return '手机号格式不正确'
  }
  if (!appointmentDate.value) {
    return '请选择预约日期'
  }
  if (!appointmentTime.value) {
    return '请选择预约时间'
  }
  if (!context.value.trim()) {
    return '请填写报修内容'
  }

  // 根据位置类型验证位置信息
  if (repairObjType.value === '002' && !floorId.value) {
    return '请选择楼栋'
  }
  if (repairObjType.value === '003' && (!floorId.value || !unitId.value)) {
    return '请选择完整的楼栋和单元'
  }
  if (repairObjType.value === '004' && (!floorId.value || !unitId.value || !roomId.value)) {
    return '请选择完整的楼栋、单元和房屋'
  }

  return ''
}

/** 图片上传前处理 */
function handleBeforeUpload(file: File) {
  // 检查文件大小
  if (file.size > 10 * 1024 * 1024) {
    uni.showToast({
      title: '图片大小不能超过10MB',
      icon: 'none',
    })
    return false
  }
  return true
}

/** 图片上传成功 */
function handleUploadSuccess(fileUrl: string) {
  // 这里应该是实际的上传接口返回的URL
  console.log('图片上传成功:', fileUrl)
}

/** 图片上传失败 */
function handleUploadFail(error: Error) {
  uni.showToast({
    title: '图片上传失败',
    icon: 'none',
  })
  console.error('图片上传失败:', error)
}

/** 提交维修工单 */
async function handleSubmit() {
  const errorMsg = validateForm()
  if (errorMsg) {
    uni.showToast({
      title: errorMsg,
      icon: 'none',
    })
    return
  }

  try {
    uni.showLoading({ title: '提交中...' })

    // 构建报修对象信息
    let repairObjId = ''
    let repairObjName = ''

    if (repairObjType.value === '001') {
      repairObjId = communityInfo.communityId
      repairObjName = communityInfo.communityName
    }
    else if (repairObjType.value === '002') {
      repairObjId = floorId.value
      repairObjName = floorNum.value
    }
    else if (repairObjType.value === '003') {
      repairObjId = unitId.value
      repairObjName = floorNum.value + unitNum.value
    }
    else {
      repairObjId = roomId.value
      repairObjName = floorNum.value + unitNum.value + roomNum.value
    }

    const requestData: CreateRepairReq = {
      repairName: repairName.value,
      repairType: selectedRepairType.value.repairType,
      appointmentTime: `${appointmentDate.value} ${appointmentTime.value}:00`,
      tel: tel.value,
      context: context.value,
      communityId: communityInfo.communityId,
      repairObjType: repairObjType.value,
      repairObjId,
      repairObjName,
      repairChannel: 'STAFF',
      roomId: roomId.value || undefined,
      photos: photos.value.length > 0 ? photos.value : undefined,
    }

    await createRepairOrder(requestData)

    uni.hideLoading()
    uni.showToast({
      title: '提交成功',
      icon: 'success',
    })

    setTimeout(() => {
      TypedRouter.toRepairList()
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
</script>

<template>
  <view class="add-order-page">
    <!-- 房屋信息 -->
    <view class="section-title">
      房屋信息
    </view>
    <view class="bg-white">
      <wd-cell-group border>
        <!-- 位置类型 -->
        <wd-cell title="位置" center>
          <template #value>
            <wd-picker
              v-model="selectedScopeIndex"
              :columns="repairScopes"
              label-key="name"
              value-key="id"
              @confirm="handleScopeChange"
            >
              <text class="text-blue-500">
                {{ repairScopes[selectedScopeIndex].name }}
              </text>
            </wd-picker>
          </template>
        </wd-cell>

        <!-- 楼栋选择 -->
        <wd-cell
          v-if="repairObjType === '002' || repairObjType === '003' || repairObjType === '004'"
          title="楼栋"
          is-link
          center
          @click="handleChooseFloor"
        >
          <template #value>
            <text :class="floorNum ? '' : 'text-gray-400'">
              {{ floorNum || '请选择楼栋' }}
            </text>
          </template>
        </wd-cell>

        <!-- 单元选择 -->
        <wd-cell
          v-if="repairObjType === '003' || repairObjType === '004'"
          title="单元"
          is-link
          center
          @click="handleChooseUnit"
        >
          <template #value>
            <text :class="unitNum ? '' : 'text-gray-400'">
              {{ unitNum || '请选择单元' }}
            </text>
          </template>
        </wd-cell>

        <!-- 房屋选择 -->
        <wd-cell
          v-if="repairObjType === '004'"
          title="房屋信息"
          is-link
          center
          @click="handleChooseRoom"
        >
          <template #value>
            <text :class="roomNum ? '' : 'text-gray-400'">
              {{ roomNum || '请选择房屋' }}
            </text>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 报修信息 -->
    <view class="section-title">
      报修信息
    </view>
    <view class="bg-white">
      <wd-cell-group border>
        <!-- 报修类型 -->
        <wd-cell title="报修类型" center>
          <template #value>
            <wd-picker
              v-model="selectedRepairTypeIndex"
              :columns="repairTypes"
              label-key="repairTypeName"
              value-key="repairType"
              @confirm="handleRepairTypeChange"
            >
              <text class="text-blue-500">
                {{ selectedRepairType?.repairTypeName || '请选择' }}
              </text>
            </wd-picker>
          </template>
        </wd-cell>

        <!-- 收费标准 -->
        <wd-cell v-if="priceScope" title="收费标准" center>
          <template #value>
            <text class="text-gray-600">{{ priceScope }}</text>
          </template>
        </wd-cell>

        <!-- 报修人 -->
        <wd-cell title="报修人" center>
          <template #value>
            <input
              v-model="repairName"
              placeholder="请输入报修人"
              class="text-right"
            >
          </template>
        </wd-cell>

        <!-- 手机号 -->
        <wd-cell title="手机号" center>
          <template #value>
            <input
              v-model="tel"
              type="number"
              placeholder="请输入手机号"
              class="text-right"
            >
          </template>
        </wd-cell>

        <!-- 预约日期 -->
        <wd-cell title="预约日期" center @click="showDatePicker = true">
          <template #value>
            <text :class="appointmentDate ? 'text-blue-500' : 'text-gray-400'">
              {{ appointmentDate || '请选择日期' }}
            </text>
          </template>
        </wd-cell>

        <!-- 预约时间 -->
        <wd-cell title="预约时间" center @click="showTimePicker = true">
          <template #value>
            <text :class="appointmentTime ? 'text-blue-500' : 'text-gray-400'">
              {{ appointmentTime || '请选择时间' }}
            </text>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 报修内容 -->
    <view class="mt-3 bg-white p-3">
      <view class="mb-2 text-sm font-bold">
        报修内容
      </view>
      <wd-textarea
        v-model="context"
        placeholder="请输入报修内容"
        :maxlength="500"
        show-word-limit
        :rows="6"
      />
    </view>

    <!-- 相关图片 -->
    <view class="section-title">
      相关图片
    </view>
    <view class="bg-white p-3">
      <wd-upload
        v-model="photos"
        :limit="9"
        :max-size="10 * 1024 * 1024"
        :before-upload="handleBeforeUpload"
        @success="handleUploadSuccess"
        @fail="handleUploadFail"
      />
    </view>

    <!-- 提交按钮 -->
    <view class="mt-6 px-3 pb-6">
      <wd-button
        block
        type="success"
        size="large"
        @click="handleSubmit"
      >
        提交
      </wd-button>
    </view>

    <!-- 日期选择器 -->
    <wd-datetime-picker
      v-model="showDatePicker"
      type="date"
      :min-date="Date.now()"
      @confirm="handleDateConfirm"
    />

    <!-- 时间选择器 -->
    <wd-datetime-picker
      v-model="showTimePicker"
      type="time"
      @confirm="handleTimeConfirm"
    />
  </view>
</template>

<style lang="scss" scoped>
.add-order-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.section-title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 20px 15px 10px;
}
</style>
