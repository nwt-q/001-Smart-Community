<script setup lang="ts">
import type { Unit } from '@/types/selector'
import { onLoad, ref } from 'vue'
import { getUnitList } from '@/api/unit'
import { useSelectorStore } from '@/stores/useSelectorStore'

definePage({
  name: 'select-unit',
  style: {
    navigationBarTitleText: '选择单元',
  },
})

const route = useRoute()
const selectorStore = useSelectorStore()

// 从路由参数获取楼栋ID
const floorId = ref<string>(route.query.floorId as string)

// 搜索关键词
const searchValue = ref('')

// 当前页码
const currentPage = ref(1)

// 每页条数
const pageSize = ref(50)

// 单元列表
const unitList = ref<Unit[]>([])

// 加载状态
const loading = ref(false)

// 是否还有更多数据
const hasMore = ref(true)

// 搜索
function handleSearch() {
  currentPage.value = 1
  unitList.value = []
  loadUnitList()
}

// 加载单元列表
async function loadUnitList() {
  if (loading.value || !hasMore.value)
    return

  loading.value = true
  try {
    const { data } = await getUnitList({
      communityId: 'COMM_001', // 实际应从登录信息获取
      floorId: floorId.value,
      page: currentPage.value,
      row: pageSize.value,
      unitNum: searchValue.value || undefined,
    })

    if (data?.records) {
      if (currentPage.value === 1) {
        unitList.value = data.records
      }
      else {
        unitList.value = [...unitList.value, ...data.records]
      }

      hasMore.value = unitList.value.length < data.total
    }
  }
  finally {
    loading.value = false
  }
}

// 选择单元
function handleSelectUnit(unit: Unit) {
  selectorStore.selectUnit(unit)
  uni.navigateBack()
}

// 上拉加载更多
function handleLoadMore() {
  if (!hasMore.value)
    return
  currentPage.value++
  loadUnitList()
}

// 页面加载时获取数据
onLoad(() => {
  if (!floorId.value) {
    uni.showToast({
      title: '缺少楼栋ID参数',
      icon: 'none',
    })
    return
  }
  loadUnitList()
})
</script>

<template>
  <!--
    选择单元页面
    功能：选择单元，支持搜索和分页加载

    访问地址: http://localhost:9000/#/pages-sub/selector/select-unit?floorId=F_COMM_001_001
  -->

  <view class="h-screen flex flex-col bg-gray-50">
    <!-- 搜索栏 -->
    <view class="bg-white p-4">
      <wd-search v-model="searchValue" placeholder="搜索单元编号" @search="handleSearch" />
    </view>

    <!-- 列表 -->
    <scroll-view scroll-y class="flex-1" @scrolltolower="handleLoadMore">
      <wd-cell-group>
        <wd-cell
          v-for="unit in unitList"
          :key="unit.unitId"
          :title="`${unit.unitNum}单元`"
          is-link
          @click="handleSelectUnit(unit)"
        >
          <template #icon>
            <wd-icon name="grid" custom-class="i-carbon-grid mr-2 text-green-500" />
          </template>
        </wd-cell>
      </wd-cell-group>

      <!-- 加载状态 -->
      <view v-if="loading" class="p-4 text-center text-sm text-gray-500">
        加载中...
      </view>

      <!-- 没有更多数据 -->
      <view v-if="!hasMore && unitList.length > 0" class="p-4 text-center text-sm text-gray-500">
        已经到底了
      </view>
    </scroll-view>

    <!-- 空状态 -->
    <view v-if="!loading && unitList.length === 0" class="flex flex-1 items-center justify-center">
      <wd-status-tip image="search" tip="暂无单元数据" />
    </view>
  </view>
</template>
