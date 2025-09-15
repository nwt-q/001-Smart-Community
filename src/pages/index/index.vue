<script lang="ts" setup>
defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})
</script>

<template>
  <view class="home-contant">
    <view class="title-head">
      <view>
        <!-- 图片 -->
        <img class="title-ico" src="/static/image/index/i_complaint.png" draggable="false">
        <view>投诉待办</view>
      </view>

      <view>
        <!-- 图片 -->
        <img class="title-ico" src="/static/image/index/i_repair.png" draggable="false">
        <view>报修待办</view>
      </view>
      <view>
        <!-- 图片 -->
        <img class="title-ico" src="/static/image/index/i_inspection.png" draggable="false">
        <view>巡检打卡</view>
      </view>
      <view>
        <!-- 图片 -->
        <img class="title-ico" src="/static/image/index/i_machine.png" draggable="false">
        <view>设备保养</view>
      </view>
    </view>

    <!-- 工作待办 -->
    <view class="work-todo">
      <view class="work-todo-title">
        工作待办
      </view>

      <view class="work-item">
        <view class="work-item-content">
          <!-- 图片 -->
          <img class="work-ico" src="/static/image/index_apply_audit.png" draggable="false">
          <view>采购待办</view>
        </view>

        <view class="work-item-content">
          <!-- 图片 -->
          <img class="work-ico" src="/static/image/index_itemout_audit.png" draggable="false">
          <view>领用待办</view>
        </view>

        <view class="work-item-content">
          <!-- 图片 -->
          <img class="work-ico" src="/static/image/index_allocation.png" draggable="false">
          <view>调拨待办</view>
        </view>

        <view class="work-item-content">
          <!-- 图片 -->
          <img class="work-ico" src="/static/image/index_complaint.png" draggable="false">
          <view>物品放行</view>
        </view>

        <view class="work-item-content">
          <!-- 图片 -->
          <img class="work-ico" src="/static/image/index_repair.png" draggable="false">
          <view>访客待办</view>
        </view>
      </view>
    </view>

    <!-- 工作单 -->
    <view class="work-todo">
      <view class="work-todo-title">
        工作单
      </view>

      <view class="work-item">
        <view class="work-item-content">
          <!-- 图片 -->
          <view class="work-font">
            发
          </view>
          <view>工作单</view>
        </view>

        <view class="work-item-content">
          <!-- 图片 -->
          <view class="work-font">
            办
          </view>
          <view>工作单</view>
        </view>

        <view class="work-item-content">
          <!-- 图片 -->
          <view class="work-font">
            抄
          </view>
          <view>抄送</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped ts="scss">
.home-contant {
  height: 100vh;
  width: 100vw;
  background-color: #f1f1f1;
}
.title-head {
  background-color: #368bff;
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  gap: 50px;
  color: #fff;
  font-size: 12px;
}
.title-ico {
  height: 45px;
  width: 45px;
}

.work-todo {
  height: auto;
  margin-top: 20px;
  background-color: #fff;
  flex-direction: column;
  display: flex;
}

.work-todo-title {
  font-weight: 500;
  padding: 10px;
  border-bottom: 1px solid #f1f1f1;
}

.work-item {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
}

.work-ico {
  width: 45px;
  height: 45px;
}

.work-item-content {
  padding: 20px;
  border: 1px solid #f1f1f1;
}

.work-font {
  font-size: 30px;
  color: #378cfe;
}
</style>
