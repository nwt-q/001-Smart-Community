import type { Activity, ActivityListResponse } from '@/types/activity'

/**
 * 通用模拟数据生成器
 * 统一管理各模块的 Mock 数据
 */

// ========== 活动模块数据 ==========

// 模拟活动数据生成器
export function createMockActivity(id: string): Activity {
  const now = Date.now()
  const randomDays = Math.floor(Math.random() * 30) // 随机0-30天
  const startOffset = Math.random() * 7 * 24 * 60 * 60 * 1000 // 随机7天内
  const duration = Math.random() * 4 * 60 * 60 * 1000 + 60 * 60 * 1000 // 1-5小时活动时长

  return {
    activitiesId: `ACT_${id}`,
    title: `社区活动 ${id}`,
    userName: `活动组织者${Math.floor(Math.random() * 10 + 1)}`,
    startTime: new Date(now + startOffset).toISOString(),
    endTime: new Date(now + startOffset + duration).toISOString(),
    context: generateActivityContent(id),
    headerImg: `header_${id}.jpg`,
    src: `https://picsum.photos/800/400?random=${id}`,
    communityId: 'COMM_001',
    createTime: new Date(now - randomDays * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date().toISOString(),
    status: ['ACTIVE', 'INACTIVE', 'DRAFT'][Math.floor(Math.random() * 3)] as any,
    viewCount: Math.floor(Math.random() * 1000),
    likeCount: Math.floor(Math.random() * 200),
  }
}

// 生成活动内容
function generateActivityContent(id: string): string {
  const activities = [
    '社区健身活动',
    '亲子互动游戏',
    '文艺表演晚会',
    '环保宣传活动',
    '安全知识讲座',
    '邻里交流会',
    '传统节日庆祝',
    '志愿服务活动',
  ]

  const activity = activities[Math.floor(Math.random() * activities.length)]

  return `
    <h2 style="text-align: center; color: #ff6b6b;">🎊 ${activity} 🎊</h2>

    <p>亲爱的业主朋友们：</p>

    <p>我们即将举办精彩的<strong>${activity}</strong>！活动详情如下：</p>

    <h3>🎯 活动亮点</h3>
    <ul>
      <li>🎵 丰富多彩的互动游戏</li>
      <li>🎁 精美的奖品等您来拿</li>
      <li>🍜 美味的茶点招待</li>
      <li>📸 专业的摄影师现场拍摄</li>
    </ul>

    <img src="https://picsum.photos/600/300?random=${id}" alt="活动图片" style="width: 100%; margin: 15px 0; border-radius: 8px;" />

    <h3>🎟️ 参与方式</h3>
    <p>请在活动开始前30分钟到达现场签到，我们为您准备了丰富的活动内容。</p>

    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">
      <p><strong>温馨提示：</strong></p>
      <ul>
        <li>请准时参加活动</li>
        <li>活动现场有茶水提供</li>
        <li>请注意安全，看护好随身物品</li>
        <li>活动结束后请配合清理现场</li>
      </ul>
    </div>

    <p style="text-align: center;">
      <strong>联系人：</strong>物业管理处<br>
      <strong>联系电话：</strong>400-888-9999
    </p>

    <p style="text-align: center; color: #ff6b6b; font-size: 18px; margin-top: 20px;">
      🎊 期待您的参与！🎊
    </p>
  `
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
  status: 'ACTIVE',
  viewCount: 245,
  likeCount: 38,
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

// 维修工单状态枚举
export const RepairStatus = {
  PENDING: 'PENDING', // 待处理
  ASSIGNED: 'ASSIGNED', // 已派工
  IN_PROGRESS: 'IN_PROGRESS', // 处理中
  COMPLETED: 'COMPLETED', // 已完成
  CANCELLED: 'CANCELLED', // 已取消
} as const

// 维修类型
export const RepairTypes = [
  '水电维修',
  '门窗维修',
  '空调维修',
  '电梯维修',
  '管道疏通',
  '墙面修补',
  '其他维修',
] as const

// 模拟维修工单数据
export function createMockRepair(id: string) {
  const types = RepairTypes
  const statuses = Object.values(RepairStatus)
  const now = Date.now()
  const randomDays = Math.floor(Math.random() * 30)

  return {
    repairId: `REP_${id}`,
    title: `${types[Math.floor(Math.random() * types.length)]}维修`,
    description: `业主报修：${types[Math.floor(Math.random() * types.length)]}出现问题，需要及时处理。`,
    ownerName: `业主${Math.floor(Math.random() * 100 + 1)}`,
    ownerPhone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    address: `${Math.floor(Math.random() * 20 + 1)}栋${Math.floor(Math.random() * 30 + 1)}${String.fromCharCode(65 + Math.floor(Math.random() * 8))}室`,
    repairType: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
    createTime: new Date(now - randomDays * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date().toISOString(),
    assignedWorker: Math.random() > 0.5 ? `维修工${Math.floor(Math.random() * 10 + 1)}` : null,
    estimatedCost: Math.floor(Math.random() * 500 + 50),
    actualCost: Math.random() > 0.5 ? Math.floor(Math.random() * 500 + 50) : null,
    images: [`https://picsum.photos/400/300?random=${id}`],
  }
}

// ========== 通讯录模块数据 ==========

// 部门类型
export const DepartmentTypes = [
  '物业管理处',
  '保安部',
  '清洁部',
  '维修部',
  '客服部',
  '财务部',
] as const

// 模拟通讯录数据
export function createMockContact(id: string) {
  const departments = DepartmentTypes
  const positions = ['主管', '专员', '助理', '经理']

  return {
    contactId: `CON_${id}`,
    name: `员工${id}`,
    position: positions[Math.floor(Math.random() * positions.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
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
  RepairStatus,
  RepairTypes,

  // 通讯录相关
  createMockContact,
  DepartmentTypes,
}
