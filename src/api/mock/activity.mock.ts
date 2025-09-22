import type { Activity, ActivityListParams, CreateActivityReq, UpdateActivityReq } from '@/types/activity'
import type { StatusType } from '@/types/api'
import { defineMock } from 'vite-plugin-mock-dev-server'
import { createPaginationResponse, errorResponse, generateId, randomDelay, successResponse } from './shared/utils'

/**
 * 活动模块 Mock 接口
 * 基于 Java110Context + uni.request 架构向 Alova + TypeScript + Mock 的现代化迁移
 */

// 活动类型配置 - 现代化数据驱动设计
const ACTIVITY_TYPES = [
  { name: '社区健身活动', emoji: '🏃‍♀️', category: 'health' },
  { name: '亲子互动游戏', emoji: '👨‍👩‍👧‍👦', category: 'family' },
  { name: '文艺表演晚会', emoji: '🎭', category: 'culture' },
  { name: '环保宣传活动', emoji: '🌱', category: 'environment' },
  { name: '安全知识讲座', emoji: '🛡️', category: 'safety' },
  { name: '邻里交流会', emoji: '🤝', category: 'social' },
  { name: '传统节日庆祝', emoji: '🎊', category: 'festival' },
  { name: '志愿服务活动', emoji: '❤️', category: 'volunteer' },
] as const

// 活动内容模板生成
function generateActivityContent(activityType: typeof ACTIVITY_TYPES[number], id: string): string {
  const templates = {
    health: '专业健身教练现场指导，多种运动项目自由选择，健康体检和咨询服务',
    family: '亲子趣味运动会，手工制作体验课，故事分享时间，家庭才艺展示',
    culture: '居民原创歌曲演唱，传统戏曲表演，现代舞蹈展示，诗歌朗诵会',
    environment: '垃圾分类知识讲座，环保手工制作，绿色生活体验，环保知识竞赛',
    safety: '消防安全演练，急救知识培训，社区安全巡查，防诈骗宣传',
    social: '邻里茶话会，社区座谈会，居民联谊活动，社区文化交流',
    festival: '传统节日庆祝，民俗文化体验，节日美食分享，传统游戏活动',
    volunteer: '社区清洁活动，爱心义卖活动，志愿服务培训，公益活动组织',
  }

  const activity = templates[activityType.category] || '丰富多彩的社区活动'

  return `
    <h2 style="text-align: center; color: #2196F3;">${activityType.emoji} ${activityType.name} ${activityType.emoji}</h2>
    <p>亲爱的业主朋友们：</p>
    <p>我们即将举办精彩的<strong>${activityType.name}</strong>！</p>

    <h3>🎯 活动亮点</h3>
    <p>${activity}</p>

    <img src="https://picsum.photos/600/300?random=${activityType.category}${id}" alt="${activityType.name}图片" style="width: 100%; margin: 15px 0; border-radius: 8px;" />

    <h3>🎟️ 参与方式</h3>
    <p>请在活动开始前30分钟到达现场签到，我们为您准备了丰富的活动内容。</p>

    <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196F3;">
      <p><strong>温馨提示：</strong></p>
      <ul>
        <li>请准时参加活动</li>
        <li>活动现场提供茶水</li>
        <li>注意个人财物安全</li>
        <li>活动结束后请配合清理现场</li>
      </ul>
    </div>

    <p style="text-align: center;">
      <strong>联系人：</strong>物业管理处<br>
      <strong>联系电话：</strong>400-888-9999
    </p>

    <p style="text-align: center; color: #2196F3; font-size: 18px; margin-top: 20px;">
      ${activityType.emoji} 期待您的参与！${activityType.emoji}
    </p>
  `
}

// 智能组织者名称生成
function generateOrganizerName(): string {
  const organizers = [
    '物业管理处',
    '业主委员会',
    '社区文化中心',
    '居民活动组',
    '志愿者协会',
    '党支部',
    '青年联谊会',
    '老年活动中心',
  ]
  return organizers[Math.floor(Math.random() * organizers.length)]
}

// 现代化活动数据生成器
function createMockActivity(id: string): Activity {
  const activityType = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)] as typeof ACTIVITY_TYPES[number]
  const now = Date.now()
  const randomDays = Math.floor(Math.random() * 30) // 创建时间：过去30天内
  const startOffset = Math.random() * 14 * 24 * 60 * 60 * 1000 // 开始时间：未来14天内
  const duration = (Math.random() * 3 + 1) * 60 * 60 * 1000 // 活动时长：1-4小时

  const statusRand = Math.random()
  const status: StatusType = statusRand < 0.6 ? 'ACTIVE' : statusRand < 0.8 ? 'INACTIVE' : 'DRAFT'

  return {
    activitiesId: `ACT_${id}`,
    title: `${activityType.name} ${id}期`,
    userName: generateOrganizerName(),
    startTime: new Date(now + startOffset).toISOString(),
    endTime: new Date(now + startOffset + duration).toISOString(),
    context: generateActivityContent(activityType, id),
    headerImg: `${activityType.category}_header_${id}.jpg`,
    src: `https://picsum.photos/800/400?random=${activityType.category}${id}`,
    communityId: 'COMM_001',
    createTime: new Date(now - randomDays * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date().toISOString(),
    status,
    viewCount: Math.floor(Math.random() * 1000 + 50),
    likeCount: Math.floor(Math.random() * 200 + 10),
  }
}

// 特色活动详情展示
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
  status: 'ACTIVE',
  viewCount: 245,
  likeCount: 38,
}

// 模拟活动数据库
const mockActivityDatabase = {
  activities: [featuredActivity, ...Array.from({ length: 20 }, (_, index) =>
    createMockActivity((index + 2).toString().padStart(3, '0')))],

  // 获取活动详情
  getActivityById(activitiesId: string) {
    return this.activities.find(activity => activity.activitiesId === activitiesId)
  },

  // 获取活动列表（支持筛选和分页）
  getActivityList(params: {
    page: number
    row: number
    communityId: string
    keyword?: string
    status?: string
  }) {
    let filteredActivities = [...this.activities]

    // 社区ID筛选
    if (params.communityId) {
      filteredActivities = filteredActivities.filter(
        activity => activity.communityId === params.communityId,
      )
    }

    // 状态筛选
    if (params.status) {
      filteredActivities = filteredActivities.filter(activity => activity.status === params.status)
    }

    // 关键词筛选（标题和内容）
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredActivities = filteredActivities.filter(activity =>
        activity.title.toLowerCase().includes(keyword)
        || activity.context.toLowerCase().includes(keyword)
        || activity.userName.toLowerCase().includes(keyword),
      )
    }

    // 按创建时间倒序排序
    filteredActivities.sort((a, b) =>
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime(),
    )

    return createPaginationResponse(filteredActivities, params.page, params.row)
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

export default defineMock([
  // 获取活动列表/详情
  {
    url: '/api/app/activities.listActivitiess',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)

      const params = { ...query, ...body } as ActivityListParams

      try {
        // 如果有 activitiesId，返回单个活动详情
        if (params.activitiesId) {
          const activity = mockActivityDatabase.getActivityById(params.activitiesId)
          if (activity) {
            // 增加浏览量
            mockActivityDatabase.increaseView(params.activitiesId)
          }
          const result = {
            activitiess: activity ? [activity] : [],
          }
          console.log('🚀 Mock API: getActivityDetail', params, '→', result)
          return successResponse(result, '获取活动详情成功')
        }

        // 返回活动列表
        const result = mockActivityDatabase.getActivityList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
          communityId: params.communityId || 'COMM_001',
          keyword: params.keyword,
          status: params.status,
        })

        console.log('🚀 Mock API: getActivityList', params, '→', `${result.list.length} items`)
        return successResponse({
          activitiess: result.list,
          total: result.total,
          page: result.page,
          row: result.pageSize,
        }, '获取活动列表成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getActivityList', error)
        return errorResponse(error.message || '获取活动数据失败')
      }
    },
  },

  // 创建活动
  {
    url: '/api/app/activities.saveActivities',
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
          status: data.status || 'DRAFT',
          headerImg: data.headerImg,
          src: data.headerImg ? `/api/file?fileId=${data.headerImg}` : undefined,
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
    url: '/api/app/activities.updateActivities',
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
    url: '/api/app/activities.deleteActivities',
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
    url: '/api/app/activities.increaseView',
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
    url: '/api/app/activities.likeActivity',
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
    url: '/api/app/activities.updateStatus',
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

        const validStatuses = ['ACTIVE', 'INACTIVE', 'DRAFT']
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
