<!--
  房屋申请记录处理页
  功能：处理房屋申请记录，添加处理意见和违规信息

  访问地址: http://localhost:9000/#/pages-sub/property/apply-room-record-handle
  建议携带参数: ?apply=JSON.stringify(applyRoomInfo)
-->
<script setup lang="ts">
import type { PropertyApplication } from '@/types/property-application'
import { onLoad } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { saveApplicationRecord } from '@/api/property-application'
import { buildApplyFromParams } from '@/hooks/property/use-property-apply-room'

definePage({
  style: {
    navigationBarTitleText: '记录处理',
  },
})

const applyRoomInfo = ref<PropertyApplication>({} as PropertyApplication)
const imgList = ref<any[]>([])
const photos = ref<string[]>([])
const videoName = ref<string>('')
const tempFilePath = ref<string>('')
const content = ref<string>('')
const communityId = ref<string>('')
const violations = ref<Array<{ name: string, value?: string }>>([
  {
    name: '请选择是否违规',
  },
  {
    name: '是',
    value: 'true',
  },
  {
    name: '否',
    value: 'false',
  },
])
const violationIndex = ref(0)
const violation = ref<string>('')
const uploadImage = ref({
  maxPhotoNum: 4,
  imgTitle: '图片上传',
  canEdit: true,
})

function sendImagesData(e: Array<{ fileId: string }>) {
  photos.value = []
  if (e.length > 0) {
    e.forEach((img: { fileId: string }) => {
      photos.value.push(img.fileId)
    })
  }
}

function violationChange(e: { detail: { value: number } }) {
  violationIndex.value = e.detail.value
  if (violationIndex.value === 0) {
    violation.value = ''
    return
  }
  const selected = violations.value[violationIndex.value]
  violation.value = selected.value || ''
}

/** 保存申请记录 - 使用 useRequest */
const {
  loading: saveRecordLoading,
  send: saveRecordRequest,
  onSuccess: onSaveSuccess,
  onError: onSaveError,
} = useRequest(
  (params: any) => saveApplicationRecord(params),
  {
    immediate: false,
  },
)

onSaveSuccess(() => {
  uni.showToast({
    title: '保存成功',
  })
  setTimeout(() => {
    uni.navigateBack({
      delta: 1,
    })
  }, 1000)
})

onSaveError((error) => {
  uni.showToast({
    title: '保存失败',
    icon: 'none',
  })
  console.error('保存记录失败', error)
})

/** 提交跟踪记录 */
function dispatchRecord() {
  const params = {
    applicationId: applyRoomInfo.value.ardId,
    roomId: applyRoomInfo.value.roomId,
    roomName: applyRoomInfo.value.roomName,
    state: applyRoomInfo.value.state,
    stateName: applyRoomInfo.value.stateName,
    photos: photos.value,
    remark: content.value,
    communityId: communityId.value,
    isTrue: violation.value,
  }

  let msg = ''
  if (params.remark === '') {
    msg = '请填写处理意见'
  }
  else if (params.isTrue === '') {
    msg = '请选择是否违规'
  }

  if (msg !== '') {
    uni.showToast({
      title: msg,
      icon: 'none',
    })
    return
  }

  saveRecordRequest(params)
}

onLoad((options: {
  ardId?: string
  communityId?: string
  roomId?: string
  roomName?: string
  state?: string
  stateName?: string
}) => {
  if (options.ardId && options.communityId && options.roomId && options.roomName && options.state && options.stateName) {
    applyRoomInfo.value = buildApplyFromParams({
      ardId: options.ardId,
      communityId: options.communityId,
      roomId: options.roomId,
      roomName: options.roomName,
      state: options.state,
      stateName: options.stateName,
    }) as PropertyApplication
    communityId.value = options.communityId
  }
})
</script>

<template>
  <view>
    <view class="cu-form-group margin-top">
      <textarea
        v-model="content"
        placeholder="请输入处理意见"
      />
    </view>
    <view class="cu-form-group margin-top">
      <picker
        :value="violationIndex"
        :range="violations"
        range-key="name"
        @change="violationChange"
      >
        <view>{{ violations[violationIndex].name }}</view>
      </picker>
    </view>

    <view class="block__title">
      相关图片
    </view>
    <upload-image-async
      ref="vcUploadRef"
      :community-id="communityId"
      :max-photo-num="uploadImage.maxPhotoNum"
      :can-edit="uploadImage.canEdit"
      :title="uploadImage.imgTitle"
      @send-images-data="sendImagesData"
    />

    <view class="flex-direction margin-top flex">
      <button
        class="cu-btn margin-tb-sm lg bg-green"
        @click="dispatchRecord"
      >
        提交
      </button>
    </view>
  </view>
</template>

<style scoped>
.block__title {
  margin: 0;
  font-weight: 400;
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 40rpx 30rpx 20rpx;
}
</style>
