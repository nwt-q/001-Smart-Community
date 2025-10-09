import type { Activity, ActivityListParams, ActivityListResponse, ActivityStatus, CreateActivityReq, UpdateActivityReq } from '@/types/activity'
import { defineUniAppMock, errorResponse, generateId, mockLog, randomDelay, successResponse } from './shared/utils'

/**
 * 活动模块 Mock 接口 - 完全自包含架构
 * 数据库对象 + 接口定义 + 数据生成器全部集成在此文件中
 */

// ==================== 活动数据生成器 ====================

/** 活动类型配置 */
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

/** 组织者名称生成 */
const ORGANIZERS = [
  '物业管理处',
  '业主委员会',
  '社区文化中心',
  '居民活动组',
  '志愿者协会',
  '党支部',
  '青年联谊会',
  '老年活动中心',
]

/** 生成活动标题 */
function generateActivityTitle(activityType: typeof ACTIVITY_TYPES[number], index: number): string {
  const titleTemplates = {
    health: ['春季健身操培训班', '社区太极拳晨练', '健康体检义诊活动', '亲子瑜伽体验课', '老年人健康讲座'],
    family: ['亲子手工制作坊', '家庭趣味运动会', '少儿绘画比赛', '母亲节感恩活动', '家庭才艺展示'],
    culture: ['诗歌朗诵分享会', '书法展览开幕式', '传统文化知识竞赛', '社区合唱团招募', '文艺汇演筹备会'],
    environment: ['垃圾分类知识讲座', '绿色出行倡导活动', '社区植树护绿', '环保手工艺制作', '节能减排宣传'],
    safety: ['消防安全演练', '防诈骗知识宣传', '急救技能培训', '居家安全检查', '交通安全教育'],
    social: ['邻里见面交流会', '新业主欢迎会', '中秋佳节联谊', '社区议事协商', '志愿者表彰大会'],
    festival: ['春节联欢晚会', '端午节包粽子', '中秋赏月活动', '国庆文艺演出', '元宵节猜灯谜'],
    volunteer: ['爱心助老服务', '社区清洁志愿', '图书整理活动', '关爱儿童公益', '扶贫帮困行动'],
  }

  const templates = titleTemplates[activityType.category]
  const baseTitle = templates[Math.floor(Math.random() * templates.length)]

  const suffixes = [`（第${index}期）`, '', '- 报名中', '（限额招募）', '']
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]

  return `${baseTitle}${suffix}`
}

/** 生成活动内容 */
function generateActivityContent(activityType: typeof ACTIVITY_TYPES[number], id: string): string {
  const detailedTemplates = {
    health: {
      highlights: ['专业健身教练现场指导', '免费体能测试与健康评估', '多种运动项目体验', '健康饮食知识讲座', '运动装备免费试用'],
      schedule: ['09:00-10:00 热身运动与体能测试', '10:00-11:00 有氧运动体验', '11:00-12:00 力量训练指导', '14:00-15:00 瑜伽放松课程', '15:00-16:00 健康咨询与答疑'],
      benefits: '通过专业的健身指导，帮助业主建立正确的运动习惯，提升身体素质，增强免疫力。',
    },
    family: {
      highlights: ['亲子互动游戏大赛', '手工艺品制作坊', '家庭才艺展示舞台', '儿童安全知识课堂', '亲子摄影留念'],
      schedule: ['09:30-10:30 亲子破冰游戏', '10:30-11:30 创意手工制作', '11:30-12:00 才艺展示时间', '14:00-15:00 安全知识互动', '15:00-16:00 合影留念'],
      benefits: '增进亲子关系，为家庭成员创造共同回忆，让孩子在游戏中学习成长。',
    },
    culture: {
      highlights: ['居民原创节目展演', '传统文化体验活动', '书法绘画现场教学', '文学作品朗诵会', '文化知识竞赛'],
      schedule: ['19:00-19:30 开场表演', '19:30-20:30 居民才艺展示', '20:30-21:00 传统文化体验', '21:00-21:30 文艺互动环节'],
      benefits: '传承优秀传统文化，丰富居民精神文化生活，促进文化交流与传承。',
    },
    environment: {
      highlights: ['垃圾分类实操训练', '环保手工艺品制作', '绿色生活方式分享', '环保知识有奖竞答', '环保承诺签名活动'],
      schedule: ['09:00-10:00 环保知识讲座', '10:00-11:00 垃圾分类实操', '11:00-12:00 环保手工制作', '14:00-15:00 绿色生活分享', '15:00-16:00 环保承诺活动'],
      benefits: '提高环保意识，推广绿色生活理念，共同建设美丽社区环境。',
    },
    safety: {
      highlights: ['消防逃生演练', '急救技能培训', '居家安全检查', '防诈骗知识宣传', '安全设备体验'],
      schedule: ['09:00-10:00 消防安全讲座', '10:00-11:00 逃生演练实操', '11:00-12:00 急救技能培训', '14:00-15:00 防诈骗宣传', '15:00-16:00 安全设备展示'],
      benefits: '增强安全防范意识，提高应急处理能力，保障居民生命财产安全。',
    },
    social: {
      highlights: ['邻里见面交流会', '社区文化座谈', '居民建议征集', '联谊活动组织', '社区服务介绍'],
      schedule: ['14:00-15:00 邻里自我介绍', '15:00-16:00 社区文化交流', '16:00-17:00 建议征集座谈', '17:00-18:00 联谊活动安排'],
      benefits: '加强邻里沟通，营造和谐社区氛围，建立良好的邻里关系。',
    },
    festival: {
      highlights: ['传统节日庆典', '民俗文化展示', '节日美食品鉴', '传统游戏体验', '节日祝福传递'],
      schedule: ['10:00-11:00 节日历史讲解', '11:00-12:00 民俗表演欣赏', '14:00-15:00 美食制作体验', '15:00-16:00 传统游戏互动', '16:00-17:00 祝福传递活动'],
      benefits: '传承节日文化，增进文化认同，让传统节日更有意义和温度。',
    },
    volunteer: {
      highlights: ['志愿服务项目介绍', '公益活动组织培训', '社区服务实践', '爱心物品募集', '志愿者表彰活动'],
      schedule: ['09:00-10:00 志愿服务介绍', '10:00-11:00 服务技能培训', '11:00-12:00 实践活动安排', '14:00-15:00 爱心募集活动', '15:00-16:00 志愿者表彰'],
      benefits: '弘扬志愿服务精神，构建互帮互助的社区文化，传递正能量。',
    },
  }

  const template = detailedTemplates[activityType.category]
  const randomHighlights = template.highlights.slice(0, Math.floor(Math.random() * 3) + 3)
  const scheduleItems = template.schedule.slice(0, Math.floor(Math.random() * 3) + 3)

  return `
    <h2 style="text-align: center; color: #2196F3; margin-bottom: 20px;">${activityType.emoji} ${activityType.name} ${activityType.emoji}</h2>

    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 15px 0;">
      <p style="font-size: 16px; line-height: 1.6; margin: 0;">
        <strong>亲爱的业主朋友们：</strong><br>
        我们诚挚邀请您参加即将举办的<strong>${activityType.name}</strong>！${template.benefits}
      </p>
    </div>

    <h3 style="color: #ff6b35; margin-top: 25px;">🎯 活动亮点</h3>
    <ul style="line-height: 1.8; padding-left: 20px;">
      ${randomHighlights.map(highlight => `<li style="margin-bottom: 8px;">${highlight}</li>`).join('')}
    </ul>

    <img src="https://picsum.photos/600/350?random=${activityType.category}${id}" alt="${activityType.name}精彩瞬间" style="width: 100%; margin: 20px 0; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />

    <h3 style="color: #28a745; margin-top: 25px;">📅 活动安排</h3>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
      ${scheduleItems.map((item, index) => `
        <p style="margin: 8px 0; display: flex; align-items: center;">
          <span style="background: #28a745; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 10px; flex-shrink: 0;">${index + 1}</span>
          <span>${item}</span>
        </p>
      `).join('')}
    </div>

    <h3 style="color: #6f42c1; margin-top: 25px;">🎟️ 参与方式</h3>
    <div style="background: #e7f3ff; padding: 18px; border-radius: 8px; border: 1px solid #2196F3;">
      <p style="margin-bottom: 15px; font-size: 16px;">请在活动开始前 <strong>30分钟</strong> 到达现场签到，我们为每位参与者准备了：</p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>精美参与纪念品一份</li>
        <li>活动期间免费茶水和点心</li>
        <li>专业摄影师现场拍摄服务</li>
        <li>活动结束后电子相册赠送</li>
      </ul>
    </div>

    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <p style="margin-bottom: 10px;"><strong>📢 温馨提示：</strong></p>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
        <li>请准时参加，避免错过精彩环节</li>
        <li>建议穿着舒适的运动装或休闲装</li>
        <li>现场提供茶水，也可自备水杯</li>
        <li>请保管好个人财物，贵重物品请随身携带</li>
        <li>活动结束后请配合清理现场，共同维护环境</li>
      </ul>
    </div>

    <div style="text-align: center; background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); padding: 20px; border-radius: 12px; margin-top: 25px;">
      <p style="font-size: 18px; font-weight: bold; color: #d63384; margin: 0;">
        ${activityType.emoji} 美好时光，期待与您相遇！${activityType.emoji}
      </p>
      <p style="font-size: 14px; color: #6c757d; margin: 10px 0 0 0;">
        让我们一起创造温馨和谐的社区生活
      </p>
    </div>
  `
}

/** 核心活动数据生成器 */
function createMockActivity(id: string): Activity {
  const activityType = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)]
  const now = Date.now()
  const randomDays = Math.floor(Math.random() * 30)
  const startOffset = Math.random() * 14 * 24 * 60 * 60 * 1000
  const duration = (Math.random() * 3 + 1) * 60 * 60 * 1000

  /** 生成活动状态：根据开始时间判断活动状态 */
  const statusRand = Math.random()
  let status: ActivityStatus
  if (statusRand < 0.25) {
    status = 'UPCOMING' // 即将开始
  }
  else if (statusRand < 0.5) {
    status = 'ONGOING' // 进行中
  }
  else if (statusRand < 0.85) {
    status = 'COMPLETED' // 已结束
  }
  else {
    status = 'CANCELLED' // 已取消
  }

  const baseViewCount = Math.floor(Math.random() * 1000 + 50)
  const numericId = Number.parseInt(id) || Math.floor(Math.random() * 999) + 1

  return {
    activitiesId: `ACT_${id}`,
    title: generateActivityTitle(activityType, numericId),
    userName: ORGANIZERS[Math.floor(Math.random() * ORGANIZERS.length)],
    startTime: new Date(now + startOffset).toISOString(),
    endTime: new Date(now + startOffset + duration).toISOString(),
    context: generateActivityContent(activityType, id),
    headerImg: `${activityType.category}_header_${id}.jpg`,
    src: `https://picsum.photos/800/400?random=${activityType.category}${id}`,
    communityId: 'COMM_001',
    createTime: new Date(now - randomDays * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date().toISOString(),
    status,
    viewCount: baseViewCount,
    likeCount: Math.floor(baseViewCount * 0.2 + Math.random() * 50),
    readCount: baseViewCount,
    collectCount: Math.floor(baseViewCount * 0.05 + Math.random() * 10),
  }
}

// ==================== 活动数据库对象 ====================

const mockActivityDatabase = {
  /** 初始化数据 */
  activities: Array.from({ length: 30 }, (_, index) =>
    createMockActivity((index + 1).toString().padStart(3, '0'))) as Activity[],

  /** 获取活动详情 */
  getActivityById(activitiesId: string): Activity | undefined {
    return this.activities.find(activity => activity.activitiesId === activitiesId)
  },

  /** 获取活动列表（支持筛选和分页） */
  getActivityList(params: {
    page: number
    row: number
    communityId: string
    keyword?: string
    status?: string
  }): ActivityListResponse {
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

    // 关键词筛选
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

    // 分页处理
    const total = filteredActivities.length
    const start = (params.page - 1) * params.row
    const end = start + params.row
    const activitiess = filteredActivities.slice(start, end)

    return {
      activitiess,
      total,
      page: params.page,
      row: params.row,
    }
  },

  /** 增加浏览量 */
  increaseView(activitiesId: string): boolean {
    const activity = this.getActivityById(activitiesId)
    if (activity) {
      activity.viewCount = (activity.viewCount || 0) + 1
      activity.updateTime = new Date().toISOString()
      return true
    }
    return false
  },

  /** 增加点赞量 */
  increaseLike(activitiesId: string): boolean {
    const activity = this.getActivityById(activitiesId)
    if (activity) {
      activity.likeCount = (activity.likeCount || 0) + 1
      activity.updateTime = new Date().toISOString()
      return true
    }
    return false
  },

  /** 更新活动点赞状态 */
  updateLike(activitiesId: string, isLiked: boolean, likeCount: number): Activity | null {
    const activity = this.getActivityById(activitiesId)
    if (activity) {
      activity.likeCount = likeCount
      activity.updateTime = new Date().toISOString()
      return activity
    }
    return null
  },

  /** 更新活动收藏状态 */
  updateCollect(activitiesId: string, isCollected: boolean, collectCount: number): Activity | null {
    const activity = this.getActivityById(activitiesId)
    if (activity) {
      activity.collectCount = collectCount
      activity.updateTime = new Date().toISOString()
      return activity
    }
    return null
  },

  /** 添加活动 */
  addActivity(activity: Activity): boolean {
    try {
      this.activities.unshift(activity)
      return true
    }
    catch {
      return false
    }
  },

  /** 删除活动 */
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

// ==================== Mock 接口定义 ====================

export default defineUniAppMock([
  /** 获取活动列表/详情 */
  {
    url: '/app/activities.listActivitiess',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)

      const params = { ...query, ...body } as ActivityListParams

      try {
        // 处理活动详情查询
        if (params.activitiesId) {
          mockLog('getActivityDetail', params)

          const activity = mockActivityDatabase.getActivityById(params.activitiesId)
          if (activity) {
            mockActivityDatabase.increaseView(params.activitiesId)
          }
          const result = {
            activitiess: activity ? [activity] : [],
          }
          mockLog('getActivityDetail result', activity ? activity.title : 'not found')
          return successResponse(result, '获取活动详情成功')
        }

        // 参数验证
        const page = Math.max(1, Number(params.page) || 1)
        const row = Math.min(Math.max(1, Number(params.row) || 15), 100)
        const communityId = params.communityId?.trim()

        mockLog('getActivityList', { page, row, communityId, keyword: params.keyword, status: params.status })

        if (!communityId) {
          return errorResponse('社区ID不能为空', '400')
        }

        // 处理活动列表查询
        const result = mockActivityDatabase.getActivityList({
          page,
          row,
          communityId,
          keyword: params.keyword?.trim(),
          status: params.status || '1',
        })

        mockLog('getActivityList result', `${result.activitiess.length} items`)
        return successResponse(result, '获取活动列表成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getActivityList', error)
        return errorResponse(error.message || '获取活动数据失败')
      }
    },
  },

  /** 创建活动 */
  {
    url: '/app/activities.saveActivities',
    method: 'POST',
    delay: [500, 1200],
    body: async ({ body }) => {
      await randomDelay(500, 1200)

      const data = body as CreateActivityReq

      try {
        mockLog('createActivity', { title: data.title })

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
          readCount: 0,
          collectCount: 0,
          status: data.status || 'UPCOMING',
          headerImg: data.headerImg,
          src: data.headerImg ? `/file?fileId=${data.headerImg}` : undefined,
        }

        mockActivityDatabase.addActivity(newActivity)
        mockLog('createActivity result', newActivity.activitiesId)
        return successResponse(newActivity, '创建活动成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: createActivity', error)
        return errorResponse(error.message || '创建活动失败')
      }
    },
  },

  /** 更新活动 */
  {
    url: '/app/activities.updateActivities',
    method: 'POST',
    delay: [400, 900],
    body: async ({ body }) => {
      await randomDelay(400, 900)

      const data = body as UpdateActivityReq

      try {
        mockLog('updateActivity', { activitiesId: data.activitiesId })

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

        mockLog('updateActivity result', activity.title)
        return successResponse(activity, '更新活动成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateActivity', error)
        return errorResponse(error.message || '更新活动失败')
      }
    },
  },

  /** 删除活动 */
  {
    url: '/app/activities.deleteActivities',
    method: 'POST',
    delay: [200, 600],
    body: async ({ body }) => {
      await randomDelay(200, 600)

      const params = body as { activitiesId: string }

      try {
        mockLog('deleteActivity', params)

        if (!params.activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const success = mockActivityDatabase.removeActivity(params.activitiesId)
        if (!success) {
          return errorResponse('活动不存在', '404')
        }

        const result = { success: true }
        mockLog('deleteActivity result', 'success')
        return successResponse(result, '删除活动成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: deleteActivity', error)
        return errorResponse(error.message || '删除活动失败')
      }
    },
  },

  /** 增加浏览量 */
  {
    url: '/app/activities.increaseView',
    method: 'POST',
    delay: [100, 300],
    body: async ({ body }) => {
      await randomDelay(100, 300)

      const data = body as { activitiesId: string }

      try {
        mockLog('increaseView', data)

        if (!data.activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const success = mockActivityDatabase.increaseView(data.activitiesId)
        if (!success) {
          return errorResponse('活动不存在', '404')
        }

        const result = { success: true }
        mockLog('increaseView result', 'success')
        return successResponse(result, '浏览量增加成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: increaseView', error)
        return errorResponse(error.message || '浏览量增加失败')
      }
    },
  },

  /** 活动点赞 */
  {
    url: '/app/activities.likeActivity',
    method: 'POST',
    delay: [100, 300],
    body: async ({ body }) => {
      await randomDelay(100, 300)

      const data = body as { activitiesId: string }

      try {
        mockLog('likeActivity', data)

        if (!data.activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        const success = mockActivityDatabase.increaseLike(data.activitiesId)
        if (!success) {
          return errorResponse('活动不存在', '404')
        }

        const result = { success: true }
        mockLog('likeActivity result', 'success')
        return successResponse(result, '点赞成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: likeActivity', error)
        return errorResponse(error.message || '点赞失败')
      }
    },
  },

  /** 活动状态管理 */
  {
    url: '/app/activities.updateStatus',
    method: 'POST',
    delay: [300, 700],
    body: async ({ body }) => {
      await randomDelay(300, 700)

      const data = body as { activitiesId: string, status: ActivityStatus }

      try {
        mockLog('updateActivityStatus', data)

        if (!data.activitiesId || !data.status) {
          return errorResponse('活动ID和状态不能为空', '400')
        }

        const activity = mockActivityDatabase.getActivityById(data.activitiesId)
        if (!activity) {
          return errorResponse('活动不存在', '404')
        }

        const validStatuses: ActivityStatus[] = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']
        if (!validStatuses.includes(data.status)) {
          return errorResponse('无效的活动状态', '400')
        }

        activity.status = data.status
        activity.updateTime = new Date().toISOString()

        mockLog('updateActivityStatus result', { title: activity.title, status: activity.status })
        return successResponse(activity, '活动状态更新成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateActivityStatus', error)
        return errorResponse(error.message || '活动状态更新失败')
      }
    },
  },

  /** 更新活动点赞状态 */
  {
    url: '/app/activities.updateLike',
    method: 'POST',
    delay: [200, 400],
    body: async ({ body }) => {
      await randomDelay(200, 400)

      const data = body as { activitiesId: string, isLiked: boolean, likeCount: number }

      try {
        mockLog('updateLike', data)

        // 参数验证
        if (!data.activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        if (typeof data.isLiked !== 'boolean') {
          return errorResponse('点赞状态参数错误', '400')
        }

        if (typeof data.likeCount !== 'number' || data.likeCount < 0) {
          return errorResponse('点赞数量参数错误', '400')
        }

        // 更新点赞状态
        const updatedActivity = mockActivityDatabase.updateLike(data.activitiesId, data.isLiked, data.likeCount)

        if (!updatedActivity) {
          return errorResponse('活动不存在', '404')
        }

        const result = {
          activitiesId: updatedActivity.activitiesId,
          isLiked: data.isLiked,
          likeCount: updatedActivity.likeCount,
          updateTime: updatedActivity.updateTime,
        }

        mockLog('updateLike result', result)
        return successResponse(result, data.isLiked ? '点赞成功' : '取消点赞成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateLike', error)
        return errorResponse(error.message || '点赞状态更新失败')
      }
    },
  },

  /** 更新活动收藏状态 */
  {
    url: '/app/activities.updateCollect',
    method: 'POST',
    delay: [200, 400],
    body: async ({ body }) => {
      await randomDelay(200, 400)

      const data = body as { activitiesId: string, isCollected: boolean, collectCount: number }

      try {
        mockLog('updateCollect', data)

        // 参数验证
        if (!data.activitiesId) {
          return errorResponse('活动ID不能为空', '400')
        }

        if (typeof data.isCollected !== 'boolean') {
          return errorResponse('收藏状态参数错误', '400')
        }

        if (typeof data.collectCount !== 'number' || data.collectCount < 0) {
          return errorResponse('收藏数量参数错误', '400')
        }

        // 更新收藏状态
        const updatedActivity = mockActivityDatabase.updateCollect(data.activitiesId, data.isCollected, data.collectCount)

        if (!updatedActivity) {
          return errorResponse('活动不存在', '404')
        }

        const result = {
          activitiesId: updatedActivity.activitiesId,
          isCollected: data.isCollected,
          collectCount: updatedActivity.collectCount,
          updateTime: updatedActivity.updateTime,
        }

        mockLog('updateCollect result', result)
        return successResponse(result, data.isCollected ? '收藏成功' : '取消收藏成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateCollect', error)
        return errorResponse(error.message || '收藏状态更新失败')
      }
    },
  },
])
