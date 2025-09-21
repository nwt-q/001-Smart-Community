import type { ActivityListParams, CreateActivityReq, UpdateActivityReq } from '@/types/activity'
import { registerMockHandler } from '@/http/mockAdapter'
import { mockActivityDatabase } from './activityData'

/**
 * 活动相关模拟接口处理器
 */

// 模拟请求延迟
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 注册活动相关模拟接口
export function registerActivityMockHandlers() {
  // 获取活动列表/详情
  registerMockHandler('/app/activities.listActivitiess', async (params: ActivityListParams) => {
    await delay(500)

    // 如果有 activitiesId，返回单个活动详情
    if (params.activitiesId) {
      const activity = mockActivityDatabase.getActivityById(params.activitiesId)
      const result = {
        activitiess: activity ? [activity] : [],
      }
      console.log('🚀 Mock API: getActivityDetail', params, '→', result)
      return result
    }

    // 否则返回活动列表
    const result = mockActivityDatabase.getActivityList({
      page: params.page || 1,
      row: params.row || 10,
      communityId: params.communityId,
      keyword: params.keyword,
      status: params.status,
    })

    console.log('🚀 Mock API: getActivityList', params, '→', `${result.activitiess.length} items`)
    return result
  })

  // 创建活动
  registerMockHandler('/app/activities.saveActivities', async (data: CreateActivityReq) => {
    await delay(800)

    const newId = `ACT_${Date.now()}`
    const newActivity = {
      activitiesId: newId,
      ...data,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
      src: data.headerImg ? `/api/file?fileId=${data.headerImg}` : undefined,
    }

    mockActivityDatabase.activities.unshift(newActivity)
    console.log('🚀 Mock API: createActivity', data, '→', newActivity)
    return newActivity
  })

  // 更新活动
  registerMockHandler('/app/activities.updateActivities', async (data: UpdateActivityReq) => {
    await delay(600)

    const activity = mockActivityDatabase.getActivityById(data.activitiesId)
    if (!activity) {
      throw new Error('活动不存在')
    }

    Object.assign(activity, {
      ...data,
      updateTime: new Date().toISOString(),
    })

    console.log('🚀 Mock API: updateActivity', data, '→', activity)
    return activity
  })

  // 删除活动
  registerMockHandler('/app/activities.deleteActivities', async (params: { activitiesId: string }) => {
    await delay(400)

    const index = mockActivityDatabase.activities.findIndex(
      activity => activity.activitiesId === params.activitiesId,
    )

    const success = index !== -1
    if (success) {
      mockActivityDatabase.activities.splice(index, 1)
    }

    const result = { success }
    console.log('🚀 Mock API: deleteActivity', params, '→', result)
    return result
  })

  // 增加浏览量
  registerMockHandler('/app/activities.increaseView', async (data: { activitiesId: string }) => {
    await delay(200)

    const success = mockActivityDatabase.increaseView(data.activitiesId)
    const result = { success }

    console.log('🚀 Mock API: increaseView', data, '→', result)
    return result
  })

  console.log('📝 Activity mock handlers registered successfully')
}

// 导出注册函数
export default registerActivityMockHandlers
