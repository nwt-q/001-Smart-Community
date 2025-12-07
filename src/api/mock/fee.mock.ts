/**
 * 费用相关模拟接口
 * 支持空置房申请模块的费用查询功能
 */

import type { FeeDetailParams, FeeDetailResponse } from '@/types/fee'
import { FEE_NAME_OPTIONS, FEE_PAY_METHOD_OPTIONS } from '../../constants/fee'
import { defineUniAppMock, delay, generateId, generateTimeRange, mockLog, successResponse } from './shared/utils'

/**
 * 费用模拟数据库
 * 专门为空置房申请模块提供费用相关数据支持
 */
const mockFeeDatabase = {
  /** 费用详情数据 */
  feeDetails: [
    {
      detailId: 'FEE_DETAIL_001',
      feeId: 'FEE_001',
      feeName: '物业管理费',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      ownerName: '张三',
      receivedAmount: 300,
      payTime: '2024-01-15T10:30:00Z',
      payMethod: '微信支付',
      payState: 'PAID',
      createTime: '2024-01-15T10:30:00Z',
    },
    {
      detailId: 'FEE_DETAIL_002',
      feeId: 'FEE_001',
      feeName: '垃圾处理费',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      ownerName: '张三',
      receivedAmount: 50,
      payTime: '2024-01-15T10:31:00Z',
      payMethod: '微信支付',
      payState: 'PAID',
      createTime: '2024-01-15T10:31:00Z',
    },
    {
      detailId: 'FEE_DETAIL_003',
      feeId: 'FEE_001',
      feeName: '公共区域维护费',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      ownerName: '张三',
      receivedAmount: 100,
      payTime: '2024-01-15T10:32:00Z',
      payMethod: '微信支付',
      payState: 'PAID',
      createTime: '2024-01-15T10:32:00Z',
    },
    {
      detailId: 'FEE_DETAIL_004',
      feeId: 'FEE_002',
      feeName: '物业管理费',
      roomId: 'ROOM_002',
      roomName: '2栋202B室',
      communityId: 'COMM_001',
      ownerName: '李四',
      receivedAmount: 320,
      payTime: '2024-02-01T14:20:00Z',
      payMethod: '支付宝',
      payState: 'PAID',
      createTime: '2024-02-01T14:20:00Z',
    },
    {
      detailId: 'FEE_DETAIL_005',
      feeId: 'FEE_002',
      feeName: '垃圾处理费',
      roomId: 'ROOM_002',
      roomName: '2栋202B室',
      communityId: 'COMM_001',
      ownerName: '李四',
      receivedAmount: 60,
      payTime: '2024-02-01T14:21:00Z',
      payMethod: '支付宝',
      payState: 'PAID',
      createTime: '2024-02-01T14:21:00Z',
    },
    {
      detailId: 'FEE_DETAIL_006',
      feeId: 'FEE_003',
      feeName: '物业管理费',
      roomId: 'ROOM_003',
      roomName: '3栋303C室',
      communityId: 'COMM_001',
      ownerName: '王五',
      receivedAmount: 280,
      payTime: '2024-01-20T09:15:00Z',
      payMethod: '现金',
      payState: 'PAID',
      createTime: '2024-01-20T09:15:00Z',
    },
  ],

  /** 生成模拟费用详情 */
  createMockFeeDetail(feeId: string, roomId: string, roomName: string, ownerName: string) {
    const feeNameItem = FEE_NAME_OPTIONS[Math.floor(Math.random() * FEE_NAME_OPTIONS.length)]
    const payMethodItem = FEE_PAY_METHOD_OPTIONS[Math.floor(Math.random() * FEE_PAY_METHOD_OPTIONS.length)]

    return {
      detailId: generateId('FEE_DETAIL'),
      feeId,
      feeName: feeNameItem.value as string,
      roomId,
      roomName,
      communityId: 'COMM_001',
      ownerName,
      receivedAmount: Math.floor(Math.random() * 500 + 50),
      payTime: generateTimeRange(-90, 0),
      payMethod: payMethodItem.value as string,
      payState: 'PAID',
      createTime: generateTimeRange(-90, 0),
    }
  },

  /** 初始化更多数据 */
  initMoreData() {
    if (this.feeDetails.length < 200) {
      const additionalData = Array.from({ length: 194 }, (_, index) => {
        const roomId = `ROOM_${(index % 10) + 1}`
        const roomName = `${(index % 20) + 1}栋${((index % 30) + 1).toString().padStart(2, '0')}${String.fromCharCode(65 + (index % 8))}室`
        const ownerName = `业主${(index % 50) + 1}`
        const feeId = `FEE_${(index % 10) + 1}`

        return this.createMockFeeDetail(feeId, roomId, roomName, ownerName)
      })
      this.feeDetails.push(...additionalData)
    }
  },

  /** 获取费用详情列表 */
  getFeeDetailList(params: FeeDetailParams): FeeDetailResponse {
    let filteredData = [...this.feeDetails]

    // 根据小区ID筛选
    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    // 根据费用ID筛选
    if (params.feeId) {
      filteredData = filteredData.filter(item => item.feeId === params.feeId)
    }

    // 分页处理
    const total = filteredData.length
    const start = (params.page - 1) * params.row
    const end = start + params.row
    const feeDetails = filteredData.slice(start, end)

    return {
      feeDetails,
    }
  },
}

// 初始化更多数据
mockFeeDatabase.initMoreData()

export default defineUniAppMock([
  // 查询费用详情
  {
    url: '/app/fee.queryFeeDetail',
    method: ['GET', 'POST'],
    delay: [300, 600],
    body: async ({ query, body }) => {
      await delay()

      const params = { ...query, ...body } as FeeDetailParams
      mockLog('queryFeeDetail', params)

      const result = mockFeeDatabase.getFeeDetailList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 50,
        communityId: params.communityId,
        feeId: params.feeId,
      })

      mockLog('queryFeeDetail result', `${result.feeDetails.length} items`)
      return successResponse(result, '查询费用详情成功')
    },
  },
])
