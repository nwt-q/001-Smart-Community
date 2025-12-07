<!--
  添加维修记录
  功能：新增维修工单，支持选择楼栋/单元/房屋

  访问地址: http://localhost:9000/#/pages-sub/repair/add-order
  建议携带参数: ?communityId=COMM_001

  完整示例: http://localhost:9000/#/pages-sub/repair/add-order?communityId=COMM_001
-->

<script setup lang="ts">
import type { FormRules } from 'wot-design-uni/components/wd-form/types'
import type { UploadBeforeUpload, UploadFile } from 'wot-design-uni/components/wd-upload/types'
import type { CreateRepairReq, RepairObjType } from '@/types/repair'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import dayjs from 'dayjs'
import { computed, reactive, ref } from 'vue'
import { createRepairOrder, getRepairSettings } from '@/api/repair'
import { useGlobalLoading } from '@/hooks/useGlobalLoading'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { TypedRouter } from '@/router'
import { useSelectorStore } from '@/stores/useSelectorStore'
import { getCurrentCommunity } from '@/utils/user'

definePage({
  style: {
    navigationBarTitleText: '添加维修记录',
    enablePullDownRefresh: false,
  },
})

/** 小区信息 */
const communityInfo = getCurrentCommunity()

/** 选择器状态管理 */
const selectorStore = useSelectorStore()

/** 全局 Toast */
const toast = useGlobalToast()

/** 全局 Loading */
const loading = useGlobalLoading()

/** 表单引用 */
const formRef = ref()

/** 表单标签统一宽度 */
const LABEL_WIDTH = '80px'

/** 表单数据模型 */
const model = reactive({
  /** 位置类型 */
  scopeId: '001' as string,
  /** 维修标题 */
  repairTitle: '',
  /** 楼栋ID */
  floorId: '',
  /** 楼栋名称 */
  floorNum: '',
  /** 单元ID */
  unitId: '',
  /** 单元名称 */
  unitNum: '',
  /** 房屋ID */
  roomId: '',
  /** 房屋名称 */
  roomNum: '',
  /** 报修类型 */
  repairType: '',
  /** 报修人 */
  repairName: '',
  /** 手机号 */
  tel: '',
  /** 预约日期 */
  appointmentDate: '' as number | '',
  /** 预约时间 */
  appointmentTime: '',
  /** 报修内容 */
  context: '',
  /** 图片列表 */
  photos: [] as UploadFile[],
})

/** 位置类型选项 */
const repairScopes = [
  { id: '001' as RepairObjType, name: '小区' },
  { id: '002' as RepairObjType, name: '楼栋' },
  { id: '003' as RepairObjType, name: '单元' },
  { id: '004' as RepairObjType, name: '房屋' },
]

/** 报修对象类型 */
const repairObjType = computed(() => model.scopeId as RepairObjType)

/** 是否公共区域 */
const publicArea = computed(() => repairObjType.value === '004' ? 'F' : 'T')

/** 报修类型列表 */
const repairTypes = ref<Array<{
  repairType: string
  repairTypeName: string
  payFeeFlag: 'T' | 'F'
  priceScope?: string
}>>([])

/** 选中的报修类型详情 */
const selectedRepairType = computed(() =>
  repairTypes.value.find(item => item.repairType === model.repairType),
)

/** 收费标准 */
const priceScope = computed(() => {
  if (selectedRepairType.value?.payFeeFlag === 'T') {
    return selectedRepairType.value.priceScope || ''
  }
  return ''
})

/** 表单校验规则 */
const formRules: FormRules = {
  repairTitle: [
    { required: true, message: '请填写维修标题' },
  ],
  repairType: [
    { required: true, message: '请选择报修类型' },
  ],
  repairName: [
    { required: true, message: '请填写报修人' },
  ],
  tel: [
    { required: true, message: '请填写手机号' },
    { required: false, pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
  ],
  appointmentDate: [
    {
      required: true,
      message: '请选择预约日期',
      validator: (value) => {
        return value && typeof value === 'number' ? Promise.resolve() : Promise.reject(new Error('请选择预约日期'))
      },
    },
  ],
  appointmentTime: [
    { required: true, message: '请选择预约时间' },
  ],
  context: [
    { required: true, message: '请填写报修内容' },
  ],
}

/** 加载报修类型 */
const { send: loadRepairTypes } = useRequest(
  () =>
    getRepairSettings({
      communityId: communityInfo.communityId,
      publicArea: publicArea.value,
      page: 1,
      row: 50,
    }),
  { immediate: false },
)
  .onSuccess((result) => {
    repairTypes.value = result.data
    if (result.data.length > 0) {
      model.repairType = result.data[0].repairType
    }
  })
  .onError((error) => {
    console.error('加载报修类型失败:', error)
    toast.error('加载报修类型失败')
  })

/** 页面加载 */
onLoad(() => {
  loadRepairTypes()
})

/** 页面显示（从楼栋/单元/房屋选择页返回） */
onShow(() => {
  // 优先从 store 读取选择的楼栋/单元/房屋（新方式）
  if (selectorStore.selectedFloor) {
    model.floorNum = `${selectorStore.selectedFloor.floorNum}栋`
    model.floorId = selectorStore.selectedFloor.floorId
  }
  else {
    const selectFloor = uni.getStorageSync('_selectFloor')
    if (selectFloor) {
      model.floorNum = `${selectFloor.floorNum}栋`
      model.floorId = selectFloor.floorId
    }
  }

  if (selectorStore.selectedUnit) {
    model.unitNum = `${selectorStore.selectedUnit.unitNum}单元`
    model.unitId = selectorStore.selectedUnit.unitId
  }
  else {
    const selectUnit = uni.getStorageSync('_selectUnit')
    if (selectUnit) {
      model.unitNum = `${selectUnit.unitNum}单元`
      model.unitId = selectUnit.unitId
    }
  }

  if (selectorStore.selectedRoom) {
    model.roomNum = `${selectorStore.selectedRoom.roomNum}室`
    model.roomId = selectorStore.selectedRoom.roomId
  }
  else {
    const selectRoom = uni.getStorageSync('_selectRoom')
    if (selectRoom) {
      model.roomNum = `${selectRoom.roomNum}室`
      model.roomId = selectRoom.roomId
    }
  }
})

/** 页面卸载 */
onUnload(() => {
  uni.removeStorageSync('_selectFloor')
  uni.removeStorageSync('_selectUnit')
  uni.removeStorageSync('_selectRoom')
  selectorStore.clearSelection()
})

/** 位置类型改变 */
function handleScopeChange({ value }: { value: string }) {
  model.scopeId = value
  loadRepairTypes()
  clearLocationInfo()
  uni.removeStorageSync('_selectFloor')
  uni.removeStorageSync('_selectUnit')
  uni.removeStorageSync('_selectRoom')
  selectorStore.clearSelection()
}

/** 清空位置信息 */
function clearLocationInfo() {
  model.floorNum = ''
  model.floorId = ''
  model.unitNum = ''
  model.unitId = ''
  model.roomNum = ''
  model.roomId = ''
}

/** 选择楼栋 */
function handleChooseFloor() {
  uni.removeStorageSync('_selectFloor')
  uni.removeStorageSync('_selectUnit')
  uni.removeStorageSync('_selectRoom')
  selectorStore.clearSelection()
  clearLocationInfo()
  TypedRouter.toSelectFloor()
}

/** 选择单元 */
function handleChooseUnit() {
  if (!model.floorId) {
    toast.warning('请先选择楼栋')
    return
  }
  uni.removeStorageSync('_selectUnit')
  uni.removeStorageSync('_selectRoom')
  selectorStore.clearUnit()
  selectorStore.clearRoom()
  model.unitNum = ''
  model.unitId = ''
  model.roomNum = ''
  model.roomId = ''
  TypedRouter.toSelectUnit(model.floorId)
}

/** 选择房屋 */
function handleChooseRoom() {
  if (!model.unitId) {
    toast.warning('请先选择单元')
    return
  }
  uni.removeStorageSync('_selectRoom')
  selectorStore.clearRoom()
  model.roomNum = ''
  model.roomId = ''
  TypedRouter.toSelectRoom(model.floorId, model.unitId)
}

/** 图片上传前处理 */
const handleBeforeUpload: UploadBeforeUpload = ({ files, resolve }) => {
  const file = files[0]
  const maxSize = 10 * 1024 * 1024

  if (file.size && file.size > maxSize) {
    toast.warning('图片大小不能超过10MB')
    resolve(false)
    return
  }
  resolve(true)
}

/** 图片上传成功 */
function handleUploadSuccess(response: any) {
  console.log('图片上传成功:', response)
}

/** 图片上传失败 */
function handleUploadFail(error: any) {
  toast.error('图片上传失败')
  console.error('图片上传失败:', error)
}

/**
 * 位置信息校验
 * @returns 返回错误信息，如果验证通过则返回空字符串
 */
function validateLocation(): string {
  if (repairObjType.value === '002' && !model.floorId) {
    return '请选择楼栋'
  }
  if (repairObjType.value === '003' && (!model.floorId || !model.unitId)) {
    return '请选择完整的楼栋和单元'
  }
  if (repairObjType.value === '004' && (!model.floorId || !model.unitId || !model.roomId)) {
    return '请选择完整的楼栋、单元和房屋'
  }
  return ''
}

/** 提交维修工单 */
const { send: submitRepairOrder, onSuccess: onSubmitSuccess, onError: onSubmitError } = useRequest(
  (data: CreateRepairReq) => createRepairOrder(data),
  { immediate: false },
)

onSubmitSuccess(() => {
  loading.close()
  toast.success('提交成功')
  setTimeout(() => {
    TypedRouter.toRepairList()
  }, 1500)
})

onSubmitError((error) => {
  loading.close()
  toast.error(error.error || '提交失败')
})

/** 提交表单 */
async function handleSubmit() {
  // 位置信息校验（表单组件不支持动态校验）
  const locationError = validateLocation()
  if (locationError) {
    toast.warning(locationError)
    return
  }

  // 表单校验
  formRef.value
    .validate()
    .then(async ({ valid, errors }: { valid: boolean, errors: any[] }) => {
      if (!valid) {
        console.error('表单校验失败:', errors)
        return
      }

      loading.loading('提交中...')

      // 构建报修对象信息
      let repairObjId = ''
      let repairObjName = ''

      if (repairObjType.value === '001') {
        repairObjId = communityInfo.communityId
        repairObjName = communityInfo.communityName
      }
      else if (repairObjType.value === '002') {
        repairObjId = model.floorId
        repairObjName = model.floorNum
      }
      else if (repairObjType.value === '003') {
        repairObjId = model.unitId
        repairObjName = model.floorNum + model.unitNum
      }
      else {
        repairObjId = model.roomId
        repairObjName = model.floorNum + model.unitNum + model.roomNum
      }

      const requestData: CreateRepairReq = {
        repairTitle: model.repairTitle,
        repairName: model.repairName,
        repairType: selectedRepairType.value!.repairType,
        appointmentTime: `${model.appointmentDate ? dayjs(model.appointmentDate).format('YYYY-MM-DD') : ''} ${model.appointmentTime}:00`,
        tel: model.tel,
        context: model.context,
        communityId: communityInfo.communityId,
        repairObjType: repairObjType.value,
        repairObjId,
        repairObjName,
        repairChannel: 'STAFF',
        roomId: model.roomId || undefined,
      }

      await submitRepairOrder(requestData)
    })
    .catch((error: any) => {
      console.error('表单校验异常:', error)
    })
}
</script>

<template>
  <view class="add-order-page">
    <wd-form ref="formRef" :model="model" :rules="formRules">
      <!-- 房屋信息 -->
      <view class="section-title">
        房屋信息
      </view>
      <wd-cell-group border>
        <!-- 位置类型 -->
        <wd-picker
          v-model="model.scopeId"
          label="位置"
          :label-width="LABEL_WIDTH"
          :columns="repairScopes"
          label-key="name"
          value-key="id"
          @confirm="handleScopeChange"
        />

        <!-- 楼栋选择 -->
        <wd-cell
          v-if="repairObjType === '002' || repairObjType === '003' || repairObjType === '004'"
          title="楼栋"
          :title-width="LABEL_WIDTH"
          is-link
          center
          custom-value-class="cell-value-left"
          @click="handleChooseFloor"
        >
          <text :class="model.floorNum ? '' : 'text-gray-400'">
            {{ model.floorNum || '请选择楼栋' }}
          </text>
        </wd-cell>

        <!-- 单元选择 -->
        <wd-cell
          v-if="repairObjType === '003' || repairObjType === '004'"
          title="单元"
          :title-width="LABEL_WIDTH"
          is-link
          center
          custom-value-class="cell-value-left"
          @click="handleChooseUnit"
        >
          <text :class="model.unitNum ? '' : 'text-gray-400'">
            {{ model.unitNum || '请选择单元' }}
          </text>
        </wd-cell>

        <!-- 房屋选择 -->
        <wd-cell
          v-if="repairObjType === '004'"
          title="房屋信息"
          :title-width="LABEL_WIDTH"
          is-link
          center
          custom-value-class="cell-value-left"
          @click="handleChooseRoom"
        >
          <text :class="model.roomNum ? '' : 'text-gray-400'">
            {{ model.roomNum || '请选择房屋' }}
          </text>
        </wd-cell>
      </wd-cell-group>

      <!-- 报修信息 -->
      <view class="section-title">
        报修信息
      </view>
      <wd-cell-group border>
        <!-- 维修标题 -->
        <wd-input
          v-model="model.repairTitle"
          label="维修标题"
          :label-width="LABEL_WIDTH"
          prop="repairTitle"
          placeholder="请输入维修标题"
          clearable
          :rules="formRules.repairTitle"
        />

        <!-- 报修类型 -->
        <wd-picker
          v-model="model.repairType"
          label="报修类型"
          :label-width="LABEL_WIDTH"
          prop="repairType"
          :columns="repairTypes"
          label-key="repairTypeName"
          value-key="repairType"
          :rules="formRules.repairType"
        />

        <!-- 收费标准 -->
        <wd-cell
          v-if="priceScope"
          title="收费标准"
          :title-width="LABEL_WIDTH"
          :value="priceScope"
          center
        />

        <!-- 报修人 -->
        <wd-input
          v-model="model.repairName"
          label="报修人"
          :label-width="LABEL_WIDTH"
          prop="repairName"
          placeholder="请输入报修人"
          clearable
          :rules="formRules.repairName"
        />

        <!-- 手机号 -->
        <wd-input
          v-model="model.tel"
          label="手机号"
          :label-width="LABEL_WIDTH"
          prop="tel"
          placeholder="请输入手机号"
          type="digit"
          clearable
          :rules="formRules.tel"
        />

        <!-- 预约日期 -->
        <wd-datetime-picker
          v-model="model.appointmentDate"
          type="date"
          label="预约日期"
          :label-width="LABEL_WIDTH"
          prop="appointmentDate"
          :min-date="Date.now()"
          :rules="formRules.appointmentDate"
        />

        <!-- 预约时间 -->
        <wd-datetime-picker
          v-model="model.appointmentTime"
          type="time"
          label="预约时间"
          :label-width="LABEL_WIDTH"
          prop="appointmentTime"
          :rules="formRules.appointmentTime"
        />
      </wd-cell-group>

      <!-- 报修内容 -->
      <view class="section-title">
        报修内容
      </view>
      <wd-cell-group border>
        <wd-textarea
          v-model="model.context"
          label="报修内容"
          :label-width="LABEL_WIDTH"
          prop="context"
          placeholder="请输入报修内容"
          :maxlength="500"
          show-word-limit
          :rules="formRules.context"
        />
      </wd-cell-group>

      <!-- 相关图片 -->
      <view class="section-title">
        相关图片
      </view>
      <view class="bg-white p-3">
        <wd-upload
          v-model:file-list="model.photos"
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
    </wd-form>
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

/** wd-cell 值靠左对齐 */
:deep(.cell-value-left) {
  flex: 1;
  text-align: left !important;
}
</style>
