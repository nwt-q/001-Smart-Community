<!--
  房屋申请记录详情页
  功能：显示房屋申请记录的详细信息，支持删除操作

  访问地址: http://localhost:9000/#/pages-sub/property/apply-room-record-detail
  建议携带参数: ?apply=JSON.stringify(recordInfo)
-->
<script setup lang="ts">
import type { ApplicationRecord, ApplicationRecordDetail } from '@/types/property-application'
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { deleteApplicationRecord, getApplicationRecordDetailList } from '@/api/property-application'
import { buildRecordFromParams } from '@/hooks/property/use-property-apply-room'

definePage({
  style: {
    navigationBarTitleText: '记录详情',
  },
})

const recordInfo = ref<ApplicationRecord & { communityId?: string, roomName?: string }>({} as ApplicationRecord & { communityId?: string, roomName?: string })
const recordList = ref<ApplicationRecordDetail[]>([])
const imgRecordList = ref<ApplicationRecordDetail[]>([])
const videoRecordList = ref<ApplicationRecordDetail[]>([])
const commonBaseUrl = ref<string>('')

/** 加载记录详情 - 使用 useRequest */
const {
  send: loadRecordDetailRequest,
  onSuccess: onRecordDetailSuccess,
  onError: onRecordDetailError,
} = useRequest(
  () => getApplicationRecordDetailList({
    page: 1,
    row: 10,
    communityId: recordInfo.value.communityId || '',
    ardrId: recordInfo.value.ardrId,
    roomName: recordInfo.value.roomName || '',
  }),
  {
    immediate: false,
  },
)

onRecordDetailSuccess((res) => {
  recordList.value = res
  res.forEach((item: ApplicationRecordDetail) => {
    if (item.relTypeCd === '19000') {
      imgRecordList.value.push(item)
    }
    else if (item.relTypeCd === '21000') {
      videoRecordList.value.push(item)
    }
  })
})

onRecordDetailError((error) => {
  console.error('加载记录详情失败', error)
  uni.showToast({
    title: '加载记录详情失败',
    icon: 'none',
  })
})

/** 预览图片 */
function preview(e: { target: { dataset: { index: number } } }) {
  const index = e.target.dataset.index
  const urls: string[] = []
  imgRecordList.value.forEach((item: ApplicationRecordDetail) => {
    urls.push(item.url)
  })
  uni.previewImage({
    current: index,
    urls,
  })
}

/** 删除记录 - 使用 useRequest */
const {
  send: deleteRecordRequest,
  onSuccess: onDeleteSuccess,
  onError: onDeleteError,
} = useRequest(
  () => deleteApplicationRecord({
    ardrId: recordInfo.value.ardrId,
    communityId: recordInfo.value.communityId || '',
  }),
  {
    immediate: false,
  },
)

onDeleteSuccess(() => {
  uni.showToast({
    title: '删除成功',
  })
  setTimeout(() => {
    uni.navigateBack({
      delta: 1,
    })
  }, 1000)
})

onDeleteError((error) => {
  uni.showToast({
    title: '删除失败',
    icon: 'none',
  })
  console.error('删除记录失败', error)
})

/** 删除记录 */
function deleteRecord() {
  uni.showModal({
    title: '提示',
    content: '是否确认删除？',
    success: (res) => {
      if (res.confirm) {
        deleteRecordRequest()
      }
    },
  })
}

onLoad((options: {
  ardrId?: string
  applicationId?: string
  roomId?: string
  roomName?: string
  communityId?: string
  state?: string
  stateName?: string
}) => {
  // TODO: 请优化这段逻辑 缺少字段时就弹框报错 并且精简代码写法 别太冗长
  if (options.ardrId && options.applicationId && options.roomId && options.roomName && options.communityId && options.state && options.stateName) {
    recordInfo.value = buildRecordFromParams({
      ardrId: options.ardrId,
      applicationId: options.applicationId,
      roomId: options.roomId,
      roomName: options.roomName,
      communityId: options.communityId,
      state: options.state,
      stateName: options.stateName,
    }) as ApplicationRecord & { communityId: string }
    commonBaseUrl.value = ''
    loadRecordDetailRequest()
  }
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
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-deletefill text-green" />
          <text class="text-grey">操作</text>
        </view>
        <view class="action">
          <text class="cu-btn bg-red" @click="deleteRecord">删除</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-time text-green" />
          <text class="text-grey">申请房间</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">{{ recordInfo.roomName }}</text>
        </view>
      </view>
      <view class="cu-item">
        <view class="content">
          <text class="cuIcon-footprint text-green" />
          <text class="text-grey">跟踪备注</text>
        </view>
        <view class="action">
          <text class="text-grey text-sm">
            {{ recordList.length > 0 ? recordList[0].remark : '' }}
          </text>
        </view>
      </view>
      <view v-if="imgRecordList.length > 0">
        <view class="text-grey">
          图片
        </view>
        <view class="cu-item">
          <view class="col-4 grid-square grid text-center">
            <view
              v-for="(item, index) in imgRecordList"
              :key="index"
              class=""
            >
              <image
                mode="widthFix"
                :data-url="item.url"
                :data-index="index"
                :src="item.url"
                @tap="preview"
              />
            </view>
          </view>
        </view>
      </view>
      <view v-if="videoRecordList.length > 0">
        <view class="text-grey">
          视频
        </view>
        <view v-for="(item, index) in videoRecordList" :key="index">
          <video
            class="record-video"
            object-fit="contain"
            :src="commonBaseUrl + item.url"
            controls
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
uni-video {
  width: 100%;
}
</style>
