// 🔴 遵循新规范：必须导入拆分后的业务类型
import type { Activity, ActivityListParams, ActivityListResponse, CreateActivityReq, UpdateActivityReq } from '@/types/activity'
// 🔴 遵循新规范：必须从 shared/mockData.ts 导入数据生成函数
import { generateMockActivityList } from './shared/mockData'
import { defineUniAppMock, errorResponse, generateId, randomDelay, successResponse } from './shared/utils'

/**
 * 🆕 活动模块 Mock 接口 - 完全遵循新Mock数据存储规范
 *
 * ✅ 单文件完整性原则：数据库对象 + 接口定义
 * ✅ 数据生成导入规则：从 shared/mockData.ts 导入
 * ✅ 业务类型强制使用：使用 @/types/activity 中的类型
 * ✅ URL前缀规范：移除 /api 前缀，使用 /app 路径
 *
 * 基于原 Java110Context 请求格式的现代化迁移
 */

// 🔴 遵循新规范：特色活动详情数据（展示原Java110Context的复杂数据结构）
const featuredActivity: Activity = {
  activitiesId: 'ACT_001',
  title: '社区春节联欢会',
  userName: '物业管理处',
  startTime: '2024-02-10T19:00:00.000Z',
  endTime: '2024-02-10T21:30:00.000Z',
  context: `
    <h2 style="text-align: center; color: #ff6b6b;">🎊 社区春节联欢会 🎊</h2>
    <p>新春佳节即将到来，为了增进邻里感情，营造和谐温馨的社区氛围，我们特别举办<strong>2024年春节联欢会</strong>！</p>

    <h3>🎯 活动亮点</h3>
    <ul>
      <li>🎵 精彩的文艺表演（歌舞、相声、小品等）</li>
      <li>🎁 丰富的抽奖活动，奖品价值丰厚</li>
      <li>🍜 传统年味小食品尝</li>
      <li>🎨 亲子手工制作体验</li>
      <li>📸 专业摄影师现场拍摄，留下美好回忆</li>
    </ul>

    <img src="https://picsum.photos/600/400?random=spring" alt="春节联欢会现场布置" style="width: 100%; margin: 15px 0; border-radius: 8px;" />

    <h3>⏰ 活动详情</h3>
    <p><strong>时间：</strong>2024年2月10日（正月初一）晚上7:00-9:30</p>
    <p><strong>地点：</strong>社区文化活动中心</p>
    <p><strong>参与对象：</strong>全体业主及家属</p>

    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">
      <p><strong>温馨提示：</strong></p>
      <ul>
        <li>建议穿着喜庆的红色服装</li>
        <li>活动现场有茶水提供</li>
        <li>请家长看好自己的孩子，注意安全</li>
        <li>活动结束后请配合清理现场</li>
      </ul>
    </div>

    <p style="text-align: center; color: #ff6b6b; font-size: 18px; margin-top: 20px;">
      🧧 让我们一起迎接新年，共度美好时光！🧧
    </p>
  `,
  headerImg: 'spring_festival_header.jpg',
  src: 'https://picsum.photos/800/500?random=festival',
  communityId: 'COMM_001',
  createTime: '2024-01-15T10:30:00.000Z',
  updateTime: '2024-01-20T14:20:00.000Z',
  status: '1',
  viewCount: 245,
  likeCount: 38,
  readCount: 245, // 与 viewCount 保持一致
  collectCount: 12, // 收藏数
}

// 🔴 遵循新规范：Mock数据库对象 - 必须包含完整的数据库操作
const mockActivityDatabase = {
  // 🔴 使用从 shared/mockData.ts 导入的数据生成函数
  activities: [featuredActivity, ...generateMockActivityList(25)] as Activity[], // 明确类型注解

  // 🔴 数据库操作：获取活动详情 - 明确返回类型
  getActivityById(activitiesId: string): Activity | undefined {
    return this.activities.find(activity => activity.activitiesId === activitiesId)
  },

  // 🔴 数据库操作：获取活动列表 - 匹配原Java110Context的查询逻辑
  getActivityList(params: {
    page: number
    row: number
    communityId: string
    keyword?: string
    status?: string
  }): ActivityListResponse {
    let filteredActivities = [...this.activities]

    // 社区ID筛选 - 严格匹配原始参数格式
    if (params.communityId) {
      filteredActivities = filteredActivities.filter(
        activity => activity.communityId === params.communityId,
      )
    }

    // 状态筛选 - 只显示已发布的活动（默认行为）
    if (params.status) {
      filteredActivities = filteredActivities.filter(activity => activity.status === params.status)
    }

    // 关键词筛选（标题、内容、组织者）
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredActivities = filteredActivities.filter(activity =>
        activity.title.toLowerCase().includes(keyword)
        || activity.context.toLowerCase().includes(keyword)
        || activity.userName.toLowerCase().includes(keyword),
      )
    }

    // 🔴 重要：按创建时间倒序排序，匹配原Java110Context行为
    filteredActivities.sort((a, b) =>
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime(),
    )

    // 分页处理 - 与原接口格式保持一致
    const total = filteredActivities.length
    const start = (params.page - 1) * params.row
    const end = start + params.row
    const activitiess = filteredActivities.slice(start, end)

    // 🔴 重要：保持与原Java110Context相同的响应格式
    return {
      activitiess, // 注意：原接口使用 'activitiess' 而不是 'activities'
      total,
      page: params.page,
      row: params.row,
    }
  },

  // 增加浏览量
  increaseView(activitiesId: string): boolean {
    const activity = this.getActivityById(activitiesId)
    if (activity) {
      activity.viewCount = (activity.viewCount || 0) + 1
      activity.updateTime = new Date().toISOString()
      return true
    }
    return false
  },

  // 增加点赞量
  increaseLike(activitiesId: string): boolean {
    const activity = this.getActivityById(activitiesId)
    if (activity) {
      activity.likeCount = (activity.likeCount || 0) + 1
      activity.updateTime = new Date().toISOString()
      return true
    }
    return false
  },

  // 添加活动
  addActivity(activity: Activity): boolean {
    try {
      this.activities.unshift(activity)
      return true
    }
    catch {
      return false
    }
  },

  // 删除活动
  removeActivity(activitiesId: string): boolean {
    const index = this.activities.findIndex(
      activity => activity.activitiesId === activitiesId,
    )
    if (index !== -1) {
      this.activities.splice(index, 1)
      return true
    }
    return false
  },
}

// 🔴 遵循新规范：Mock接口定义 - 使用defineUniAppMock
export default defineUniAppMock([
  // 🔴 核心接口：获取活动列表/详情 - 完全匹配原Java110Context行为
  {
    url: '/app/activities.listActivitiess', // 🔴 URL前缀规范：移除/api，直接使用业务路径
    method: ['GET', 'POST'],
    delay: [300, 800], // 模拟真实网络延迟
    body: async ({ query, body }) => {
      await randomDelay(300, 800)

      const params = { ...query, ...body } as ActivityListParams

      try {
        // 🔴 处理活动详情查询（当有activitiesId参数时）
        if (params.activitiesId) {
          const activity = mockActivityDatabase.getActivityById(params.activitiesId)
          if (activity) {
            // 自动增加浏览量，匹配原系统行为
            mockActivityDatabase.increaseView(params.activitiesId)
          }
          const result = {
            activitiess: activity ? [activity] : [], // 保持原始响应格式
          }
          console.log('🚀 Mock API: getActivityDetail', params, '→', result)
          return result // 直接返回数据，无需包装response
        }

        // 🔴 处理活动列表查询 - 严格匹配原Java110Context的参数处理
        const result = mockActivityDatabase.getActivityList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 15, // 原系统默认15条
          communityId: params.communityId || 'COMM_001',
          keyword: params.keyword,
          status: params.status || '1', // 默认只显示已发布的活动
        })

        console.log('🚀 Mock API: getActivityList', params, '→', `${result.activitiess.length} items`)
        // 🔴 重要：直接返回与原Java110Context相同的数据结构
        return result
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getActivityList', error)
        return errorResponse(error.message || '获取活动数据失败')
      }
    },
  },

  // 创建活动
  {
    url: '/app/activities.saveActivities',
    method: 'POST',
    delay: [500, 1200],
    body: async ({ body }) => {
      await randomDelay(500, 1200)

      const data = body as CreateActivityReq

      try {
        // 数据验证
        if (!data.title?.trim()) {
          return errorResponse('活动标题不能为空', '400')
        }
        if (!data.startTime) {
          return errorResponse('活动开始时间不能为空', '400')
        }
        if (!data.context?.trim()) {
          return errorResponse('活动内容不能为空', '400')
        }

        const newActivity: Activity = {
          activitiesId: generateId('ACT'),
          title: data.title,
          context: data.context,
          startTime: data.startTime,
          endTime: data.endTime || new Date(new Date(data.startTime).getTime() + 2 * 60 * 60 * 1000).toISOString(),
          userName: '物业管理处',
          communityId: data.communityId || 'COMM_001',
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          viewCount: 0,
          likeCount: 0,
          readCount: 0, // 初始浏览次数
          collectCount: 0, // 初始收藏次数
          status: data.status || '0',
          headerImg: data.headerImg,
          src: data.headerImg ? `/file?fileId=${data.headerImg}` : undefined,
        }

        mockActivityDatabase.addActivity(newActivity)
        console.log('🚀 Mock API: createActivity', data, '→', newActivity)
        return successResponse(newActivity, '创建活动成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: createActivity', error)
        return errorResponse(error.message || '创建活动失败')
      }
    },
  },

  // 更新活动
  {
    url: '/app/activities.updateActivities',
    method: 'POST',
    delay: [400, 900],
    body: async ({ body }) => {
      await randomDelay(400, 900)

      const data = body as UpdateActivityReq

      try {
        if (!data.activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const activity = mockActivityDatabase.getActivityById(data.activitiesId)
        if (!activity) {
          return errorResponse('活动不存在', '404')
        }

        // 更新活动数据
        Object.assign(activity, {
          ...data,
          updateTime: new Date().toISOString(),
        })

        console.log('🚀 Mock API: updateActivity', data, '→', activity)
        return successResponse(activity, '更新活动成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateActivity', error)
        return errorResponse(error.message || '更新活动失败')
      }
    },
  },

  // 删除活动
  {
    url: '/app/activities.deleteActivities',
    method: 'POST',
    delay: [200, 600],
    body: async ({ body }) => {
      await randomDelay(200, 600)

      const params = body as { activitiesId: string }

      try {
        if (!params.activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const success = mockActivityDatabase.removeActivity(params.activitiesId)
        if (!success) {
          return errorResponse('活动不存在', '404')
        }

        const result = { success: true }
        console.log('🚀 Mock API: deleteActivity', params, '→', result)
        return successResponse(result, '删除活动成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: deleteActivity', error)
        return errorResponse(error.message || '删除活动失败')
      }
    },
  },

  // 增加浏览量
  {
    url: '/app/activities.increaseView',
    method: 'POST',
    delay: [100, 300],
    body: async ({ body }) => {
      await randomDelay(100, 300)

      const data = body as { activitiesId: string }

      try {
        if (!data.activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const success = mockActivityDatabase.increaseView(data.activitiesId)
        if (!success) {
          return errorResponse('活动不存在', '404')
        }

        const result = { success: true }
        console.log('🚀 Mock API: increaseView', data, '→', result)
        return successResponse(result, '浏览量增加成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: increaseView', error)
        return errorResponse(error.message || '浏览量增加失败')
      }
    },
  },

  // 活动点赞
  {
    url: '/app/activities.likeActivity',
    method: 'POST',
    delay: [100, 300],
    body: async ({ body }) => {
      await randomDelay(100, 300)

      const data = body as { activitiesId: string }

      try {
        if (!data.activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const success = mockActivityDatabase.increaseLike(data.activitiesId)
        if (!success) {
          return errorResponse('活动不存在', '404')
        }

        const result = { success: true }
        console.log('🚀 Mock API: likeActivity', data, '→', result)
        return successResponse(result, '点赞成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: likeActivity', error)
        return errorResponse(error.message || '点赞失败')
      }
    },
  },

  // 活动状态管理
  {
    url: '/app/activities.updateStatus',
    method: 'POST',
    delay: [300, 700],
    body: async ({ body }) => {
      await randomDelay(300, 700)

      const data = body as { activitiesId: string, status: string }

      try {
        if (!data.activitiesId || !data.status) {
          return errorResponse('活动ID和状态不能为空', '400')
        }

        const activity = mockActivityDatabase.getActivityById(data.activitiesId)
        if (!activity) {
          return errorResponse('活动不存在', '404')
        }

        const validStatuses = ['0', '1'] // 0: 草稿/未发布, 1: 已发布
        if (!validStatuses.includes(data.status)) {
          return errorResponse('无效的活动状态', '400')
        }

        activity.status = data.status as any
        activity.updateTime = new Date().toISOString()

        console.log('🚀 Mock API: updateActivityStatus', data, '→', activity)
        return successResponse(activity, '活动状态更新成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateActivityStatus', error)
        return errorResponse(error.message || '活动状态更新失败')
      }
    },
  },
])
