<!--
  房屋申请详情页
  功能：显示房屋申请详细信息，支持验房和审核操作

  访问地址: http://localhost:9000/#/pages-sub/property/apply-room-detail
  建议携带参数: ?ardId=xxx&communityId=xxx

-->
<script setup lang="ts">
import type { PropertyApplication } from '@/types/property-application'
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { extractApplyRecordParams } from '@/hooks/property/use-property-apply-room'
import { TypedRouter } from '@/router'

definePage({
  style: {
    navigationBarTitleText: '房屋申请详情',
  },
})

const applyRoomInfo = ref<PropertyApplication>({} as PropertyApplication)
const errorSwitch = ref(false)
const checkStateRange = ref([
  { state: 2, name: '验房通过' },
  { state: 3, name: '验房不通过' },
])
const reviewStateRange = ref([
  { state: 4, name: '审批通过' },
  { state: 5, name: '审批不通过' },
])
const checkState = ref<{ state: number, name: string } | {}>({})
const reviewState = ref<{ state: number, name: string } | {}>({})
const checkRemark = ref('')
const reviewRemark = ref('')
const discountTypeRange = ref([{ id: '3003', name: '优惠(需要申请)' }])
const discountType = ref<{ id: string, name: string } | {}>({})
const discountIdRange = ref<any[]>([])
const discountId = ref<any>({})
const returnWays = ref([
  { statCd: 1001, statName: '享受缴纳折扣' },
  { statCd: 1002, statName: '返还至余额账户' },
])
const returnWayIndex = ref(0)
const returnWay = ref<string>('')
const fees = ref<any[]>([])
const selectedFees = ref<string[]>([])
const maxPhotoNum = ref(4)
const sendImgList = ref<string[]>([])
const photos = ref<string[]>([])
const canEdit = ref(false)
const imgTitle = ref('图片材料')

const pickerDisabled = computed(() => {
  // TODO: 实现权限检查逻辑
  return false
})

function getBase64List(_data: string[]) {
  photos.value = _data
}

function listFeeDetail() {
  // TODO: 实现查询费用项缴费历史逻辑
  console.log('查询费用项缴费历史')
}

function checkboxChange(e: { detail: { value: string[] } }) {
  const values = e.detail.value
  selectedFees.value = values
  fees.value.forEach((item: any, index: number) => {
    if (values.includes(item.detailId)) {
      item.checked = true
    }
  })
}

function empty() {
  // 空方法
}

function onBlur() {
  uni.pageScrollTo({
    scrollTop: 0,
  })
}

function dateStartChange(e: { detail: { value: string } }) {
  applyRoomInfo.value.startTime = e.detail.value
}

function dateEndChange(e: { detail: { value: string } }) {
  applyRoomInfo.value.endTime = e.detail.value
}

function switchShowModel() {
  errorSwitch.value = !errorSwitch.value
}

function discountTypeRangeChange(e: { detail: { value: number } }) {
  // TODO: 实现折扣类型变更逻辑
  console.log('折扣类型变更')
}

function discountIdRangeChange(e: { detail: { value: number } }) {
  const index = e.detail.value
  discountId.value = discountIdRange.value[index]
}

function returnWaysChange(e: { detail: { value: number } }) {
  const index = e.detail.value
  returnWayIndex.value = index
  returnWay.value = returnWays.value[index].statCd.toString()
}

function checkStateRangeChange(e: { detail: { value: number } }) {
  const index = e.detail.value
  checkState.value = checkStateRange.value[index]
  checkRemark.value = (checkState.value as { state: number, name: string }).name
}

function reviewStateRangeChange(e: { detail: { value: number } }) {
  const index = e.detail.value
  reviewState.value = reviewStateRange.value[index]
  reviewRemark.value = (reviewState.value as { state: number, name: string }).name
}

function submit() {
  // TODO: 实现提交逻辑
  console.log('提交')
}

function goBack() {
  // #ifdef H5
  const canBack = true
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 })
    return
  }
  const a = (uni as any).$router.go(-1)
  if (a === undefined) {
    uni.reLaunch({
      url: '/pages-sub/property/apply-room',
    })
  }
  return
  // #endif
  uni.navigateBack({ delta: 1 })
}

/** 显示房屋申请跟踪记录 */
function showApplyRoomRecord() {
  const params = extractApplyRecordParams(applyRoomInfo.value)
  TypedRouter.toApplyRoomRecord(params)
}

onLoad((options: { ardId?: string }) => {
  // TODO: 实现页面加载逻辑
  console.log('页面加载', options)
})

onReady(() => {
  // 页面初次渲染完成
})

onShow(() => {
  // 页面显示
})
</script>

<template>
  <view>
    <view class="cu-list menu margin-top">
      <view class="cu-item arrow" @click="showApplyRoomRecord()">
        <view class="content">
          <text class="cuIcon-time text-green" />
          <text class="text-grey">空置房跟踪记录</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">查看</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-edit text-green" />
          <text class="text-grey">申请ID</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ applyRoomInfo.ardId }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-ticket text-green" />
          <text class="text-grey">申请类型</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ applyRoomInfo.applyTypeName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green" />
          <text class="text-grey">申请房间</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ applyRoomInfo.roomName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-profile text-green" />
          <text class="text-grey">申请人</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ applyRoomInfo.createUserName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-phone text-green" />
          <text class="text-grey">联系方式</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ applyRoomInfo.createUserTel }}</text>
        </view>
      </view>
      <view class="cu-item arrow">
        <view class="content">
          <text class="cuIcon-time text-green" />
          <text class="text-grey">开始时间</text>
        </view>
        <picker
          mode="date"
          :value="applyRoomInfo.startTime"
          start="2020-09-01"
          end="2050-09-01"
          :disabled="pickerDisabled"
          @change="dateStartChange"
        >
          <view class="picker">
            {{ applyRoomInfo.startTime }}
          </view>
        </picker>
      </view>
      <view class="cu-item arrow">
        <view class="content">
          <text class="cuIcon-time text-green" />
          <text class="text-grey">结束时间</text>
        </view>
        <picker
          mode="date"
          :value="applyRoomInfo.endTime"
          start="2020-09-01"
          end="2050-09-01"
          :disabled="pickerDisabled"
          @change="dateEndChange"
        >
          <view class="picker">
            {{ applyRoomInfo.endTime }}
          </view>
        </picker>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-footprint text-green" />
          <text class="text-grey">申请备注</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ applyRoomInfo.createRemark }}</text>
        </view>
      </view>
      <view v-if="Number(applyRoomInfo.state) > 1" class="cu-item">
        <view class="content">
          <text class="cuIcon-footprint text-green" />
          <text class="text-grey">验房备注</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ applyRoomInfo.checkRemark }}</text>
        </view>
      </view>
      <view v-if="Number(applyRoomInfo.state) > 3" class="cu-item">
        <view class="content">
          <text class="cuIcon-footprint text-green" />
          <text class="text-grey">审核备注</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ applyRoomInfo.reviewRemark }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green" />
          <text class="text-grey">当前状态</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ applyRoomInfo.stateName }}</text>
        </view>
      </view>

      <!-- 验房状态 -->
      <view v-if="Number(applyRoomInfo.state) === 1" class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green" />
          <text class="text-grey">验房状态</text>
        </view>
        <picker
          mode="selector"
          :value="(checkState as { state: number }).state"
          :range="checkStateRange"
          range-key="name"
          @change="checkStateRangeChange"
        >
          <view class="picker">
            {{ (checkState as { state: number; name: string }).name || "请选择" }}
          </view>
        </picker>
      </view>
      <view v-if="Number(applyRoomInfo.state) === 1" class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green" />
          <text class="text-grey">验房备注</text>
        </view>
        <input v-model="checkRemark" type="text" @blur="onBlur()">
      </view>

      <!-- 审批状态 -->
      <view v-if="Number(applyRoomInfo.state) === 2" class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green" />
          <text class="text-grey">审批状态</text>
        </view>
        <picker
          mode="selector"
          :value="(reviewState as { state: number }).state"
          :range="reviewStateRange"
          range-key="name"
          @change="reviewStateRangeChange"
        >
          <view class="picker">
            {{ (reviewState as { state: number; name: string }).name || "请选择" }}
          </view>
        </picker>
      </view>

      <view class="cu-item">
        <button
          v-if="Number(applyRoomInfo.state) === 1"
          class="btn-check"
          @click="submit"
        >
          验房
        </button>
        <button
          v-if="Number(applyRoomInfo.state) === 2"
          class="btn-check"
          @click="submit"
        >
          审核
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.btn-check {
  width: 50%;
  margin: 30rpx auto;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background-color: #00aa00;
  border-radius: 15rpx;
  color: #fff;
  font-size: 32rpx;
}

/* 弹出框 */
.pop-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pop-box {
  position: relative;
  width: 85%;
  max-height: 1000rpx;
  background-color: #fff;
  border-radius: 15rpx;
  padding-bottom: 85rpx;
}

.pop-title {
  padding: 30rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
}

.pop-bottom {
  width: 100%;
  position: absolute;
  bottom: 0;
}

.btn-box {
  width: 90%;
  margin: 0 auto;
  border-top: 1px solid #f6f6f8;
  display: flex;
}

.cancel,
.confirm {
  width: 50%;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 40rpx;
  font-weight: 400;
}

.cancel {
  color: #999999;
}

.confirm {
  color: #3488fe;
}

.checkbox-area {
  max-height: 160rpx;
  overflow-y: scroll;
}
</style>
