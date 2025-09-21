import type { Activity, ActivityListResponse } from '@/types/activity'

/**
 * 活动模拟数据
 */

// 模拟活动数据生成器
export function createMockActivity(id: string): Activity {
  return {
    activitiesId: `ACT_${id}`,
    title: `社区活动 ${id}`,
    userName: `活动组织者${Math.floor(Math.random() * 10 + 1)}`,
    startTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    context: `
    <p>亲爱的业主朋友们：</p>
    <p>我们即将举办精彩的社区活动！活动详情如下：</p>
    <h3>活动亮点</h3>
    <ul>
      <li>丰富多彩的互动游戏</li>
      <li>精美的奖品等您来拿</li>
      <li>美味的茶点招待</li>
      <li>专业的摄影师现场拍摄</li>
    </ul>
    <h3>参与方式</h3>
    <p>请在活动开始前30分钟到达现场签到，我们为您准备了丰富的活动内容。</p>
    <p>期待您的参与！</p>
    <img src="https://picsum.photos/600/300?random=${id}" alt="活动图片" />
    <p><strong>联系人：</strong>物业管理处</p>
    <p><strong>联系电话：</strong>400-888-9999</p>
  `,
    headerImg: `header_${id}.jpg`,
    src: `https://picsum.photos/800/400?random=${id}`,
    endTime: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    communityId: 'COMM_001',
    createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date().toISOString(),
    status: ['ACTIVE', 'INACTIVE', 'DRAFT'][Math.floor(Math.random() * 3)] as any,
    viewCount: Math.floor(Math.random() * 1000),
    likeCount: Math.floor(Math.random() * 200),
  }
}

// 生成模拟活动列表
export function generateMockActivityList(count: number = 10): Activity[] {
  return Array.from({ length: count }, (_, index) =>
    createMockActivity((index + 1).toString().padStart(3, '0')))
}

// 特定的活动详情数据
export const mockActivityDetail: Activity = {
  activitiesId: 'ACT_001',
  title: '社区春节联欢会',
  userName: '物业管理处',
  startTime: '2024-02-10 19:00:00',
  endTime: '2024-02-10 21:30:00',
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
  createTime: '2024-01-15 10:30:00',
  updateTime: '2024-01-20 14:20:00',
  status: 'ACTIVE',
  viewCount: 245,
  likeCount: 38,
}

// 全局模拟数据存储
export const mockActivityDatabase = {
  activities: [mockActivityDetail, ...generateMockActivityList(20)],

  // 获取活动详情
  getActivityById(activitiesId: string): Activity | undefined {
    return this.activities.find(activity => activity.activitiesId === activitiesId)
  },

  // 获取活动列表
  getActivityList(params: {
    page: number
    row: number
    communityId: string
    keyword?: string
    status?: string
  }): ActivityListResponse {
    let filteredActivities = [...this.activities]

    // 状态筛选
    if (params.status) {
      filteredActivities = filteredActivities.filter(activity => activity.status === params.status)
    }

    // 关键词筛选
    if (params.keyword) {
      filteredActivities = filteredActivities.filter(activity =>
        activity.title.includes(params.keyword!)
        || activity.context.includes(params.keyword!),
      )
    }

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
      return true
    }
    return false
  },
}
