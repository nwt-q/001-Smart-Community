import type { Activity, ActivityListResponse } from '@/types/activity'
import type { PriorityType, StatusType } from '@/types/api'
import type { Contact, DepartmentType } from '@/types/contact'
import type { RepairOrder, RepairStatus, RepairType } from '@/types/repair'

/**
 * 通用模拟数据生成器
 * 统一管理各模块的 Mock 数据
 */

// ========== 活动模块数据 ==========

// 活动类型配置 - 与原Java110Context数据保持一致
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

// 🔴 遵循新规范：核心活动数据生成器 - 100%类型安全
export function createMockActivity(id: string): Activity {
  const activityType = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)]
  const now = Date.now()
  const randomDays = Math.floor(Math.random() * 30) // 创建时间：过去30天内
  const startOffset = Math.random() * 14 * 24 * 60 * 60 * 1000 // 开始时间：未来14天内
  const duration = (Math.random() * 3 + 1) * 60 * 60 * 1000 // 活动时长：1-4小时

  const statusRand = Math.random()
  const status: StatusType = statusRand < 0.8 ? '1' : '0' // 80% 已发布，20% 草稿

  const baseViewCount = Math.floor(Math.random() * 1000 + 50)

  return {
    activitiesId: `ACT_${id}`,
    title: `${activityType.name} ${id}期`,
    userName: generateOrganizerName(),
    startTime: new Date(now + startOffset).toISOString(),
    endTime: new Date(now + startOffset + duration).toISOString(),
    context: generateAdvancedActivityContent(activityType, id),
    headerImg: `${activityType.category}_header_${id}.jpg`,
    // 🔴 重要：匹配原Java110Context的图片URL格式
    src: `https://picsum.photos/800/400?random=${activityType.category}${id}`,
    communityId: 'COMM_001',
    createTime: new Date(now - randomDays * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date().toISOString(),
    status,
    viewCount: baseViewCount,
    likeCount: Math.floor(baseViewCount * 0.2 + Math.random() * 50), // 点赞数约为浏览量的20%
    readCount: baseViewCount, // 与 viewCount 保持一致，兼容原代码
    collectCount: Math.floor(baseViewCount * 0.05 + Math.random() * 10), // 收藏数约为浏览量的5%
  }
}

// 🔴 遵循新规范：高级活动内容生成器
function generateAdvancedActivityContent(activityType: typeof ACTIVITY_TYPES[number], id: string): string {
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

// 保持原有简化版本以兼容其他调用
function generateActivityContent(id: string): string {
  const activityType = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)]
  return generateAdvancedActivityContent(activityType, id)
}

// 生成模拟活动列表
export function generateMockActivityList(count: number = 20): Activity[] {
  return Array.from({ length: count }, (_, index) =>
    createMockActivity((index + 1).toString().padStart(3, '0')))
}

// 特定的活动详情数据（展示用）
export const mockActivityDetail: Activity = {
  activitiesId: 'ACT_001',
  title: '社区春节联欢会',
  userName: '物业管理处',
  startTime: '2024-02-10T19:00:00.000Z',
  endTime: '2024-02-10T21:30:00.000Z',
  context: `
    <h2 style="text-align: center; color: #ff6b6b;">🎊 社区春节联欢会 🎊</h2>

    <p>亲爱的业主朋友们：</p>

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

    <h3>🎟️ 参与方式</h3>
    <p>请在活动开始前30分钟到达现场签到，我们为每个家庭准备了精美的新年礼品。</p>

    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">
      <p><strong>温馨提示：</strong></p>
      <ul>
        <li>建议穿着喜庆的红色服装</li>
        <li>活动现场有茶水提供</li>
        <li>请家长看好自己的孩子，注意安全</li>
        <li>活动结束后请配合清理现场</li>
      </ul>
    </div>

    <p style="text-align: center;">
      <strong>联系人：</strong>李经理<br>
      <strong>联系电话：</strong>400-888-9999<br>
      <strong>微信群：</strong>扫描下方二维码加入活动群
    </p>

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
  readCount: 245,
  collectCount: 12,
}

// ========== 活动数据库模拟 ==========

// 全局模拟数据存储
export const mockActivityDatabase = {
  activities: [mockActivityDetail, ...generateMockActivityList(20)],

  // 获取活动详情
  getActivityById(activitiesId: string): Activity | undefined {
    return this.activities.find(activity => activity.activitiesId === activitiesId)
  },

  // 获取活动列表（支持筛选和分页）
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

// ========== 维修模块数据 ==========

// 维修类型
export const RepairTypes: RepairType[] = [
  '水电维修',
  '门窗维修',
  '空调维修',
  '电梯维修',
  '管道疏通',
  '墙面修补',
  '其他维修',
]

// 维修状态
export const RepairStatuses: RepairStatus[] = [
  'PENDING',
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]

// 模拟维修工单数据
export function createMockRepair(id: string): RepairOrder {
  const now = Date.now()
  const randomDays = Math.floor(Math.random() * 30)

  return {
    repairId: `REP_${id}`,
    title: `${RepairTypes[Math.floor(Math.random() * RepairTypes.length)]}维修`,
    description: `业主报修：${RepairTypes[Math.floor(Math.random() * RepairTypes.length)]}出现问题，需要及时处理。`,
    ownerName: `业主${Math.floor(Math.random() * 100 + 1)}`,
    ownerPhone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    address: `${Math.floor(Math.random() * 20 + 1)}栋${Math.floor(Math.random() * 30 + 1)}${String.fromCharCode(65 + Math.floor(Math.random() * 8))}室`,
    repairType: RepairTypes[Math.floor(Math.random() * RepairTypes.length)],
    status: RepairStatuses[Math.floor(Math.random() * RepairStatuses.length)],
    priority: (['HIGH', 'MEDIUM', 'LOW'] as PriorityType[])[Math.floor(Math.random() * 3)],
    createTime: new Date(now - randomDays * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date().toISOString(),
    assignedWorker: Math.random() > 0.5 ? `维修工${Math.floor(Math.random() * 10 + 1)}` : null,
    estimatedCost: Math.floor(Math.random() * 500 + 50),
    actualCost: Math.random() > 0.5 ? Math.floor(Math.random() * 500 + 50) : null,
    images: [`https://picsum.photos/400/300?random=${id}`],
    communityId: 'COMM_001',
  }
}

// ========== 通讯录模块数据 ==========

// 部门类型
export const DepartmentTypes: DepartmentType[] = [
  '物业管理处',
  '保安部',
  '清洁部',
  '维修部',
  '客服部',
  '财务部',
]

// 模拟通讯录数据
export function createMockContact(id: string): Contact {
  const positions = ['主管', '专员', '助理', '经理']

  return {
    contactId: `CON_${id}`,
    name: `员工${id}`,
    position: positions[Math.floor(Math.random() * positions.length)],
    department: DepartmentTypes[Math.floor(Math.random() * DepartmentTypes.length)],
    phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    email: `employee${id}@property.com`,
    workTime: '09:00-18:00',
    avatar: `https://picsum.photos/100/100?random=${id}`,
    description: '负责相关业务处理，为业主提供优质服务。',
    isOnline: Math.random() > 0.3,
  }
}

// 导出所有模拟数据生成器
export default {
  // 活动相关
  createMockActivity,
  generateMockActivityList,
  mockActivityDetail,
  mockActivityDatabase,

  // 维修相关
  createMockRepair,
  RepairStatuses,
  RepairTypes,

  // 通讯录相关
  createMockContact,
  DepartmentTypes,
}
