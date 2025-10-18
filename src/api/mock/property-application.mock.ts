/**
 * 空置房申请相关模拟接口
 * 包含完整的数据库对象、接口定义和内联数据
 */

import type {
  ApplicationRecord,
  ApplicationRecordDetail,
  ApplicationRecordDetailParams,
  ApplicationRecordListParams,
  ApplicationState,
  CheckUpdateRequest,
  DeleteApplicationRecordRequest,
  DictInfo,
  DictQueryParams,
  FeeDetail,
  FeeDetailParams,
  FeeDiscount,
  FeeDiscountParams,
  PropertyApplication,
  PropertyApplicationListParams,
  RelationTypeCd,
  ReviewUpdateRequest,
  SaveApplicationRecordRequest,
} from '@/types/property-application'

import { defineUniAppMock, delay, errorResponse, generateChineseName, generateId, generatePhoneNumber, generateTimeRange, mockLog, ResultEnumMap, successResponse } from './shared/utils'

/**
 * 空置房申请模拟数据库
 * 包含内联数据和完整的CRUD操作方法
 */
const mockApplyRoomDatabase = {
  /** 空置房申请数据 */
  applyRooms: [
    {
      ardId: 'ARD_001',
      applyType: '1001',
      applyTypeName: '空置房申请',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      communityId: 'COMM_001',
      createUserName: '张三',
      createUserTel: '13812345678',
      createRemark: '业主申请空置房，希望获得费用减免',
      checkRemark: '验房通过，房屋状况良好',
      reviewRemark: '审批通过，同意给予费用减免',
      startTime: '2024-01-15 00:00:00',
      endTime: '2024-03-15 23:59:59',
      feeId: 'FEE_001',
      state: '4' as ApplicationState,
      stateName: '审批通过',
      urls: ['https://picsum.photos/400/300?random=room1'],
      createTime: '2024-01-10T10:30:00Z',
      updateTime: '2024-01-20T14:20:00Z',
    },
    {
      ardId: 'ARD_002',
      applyType: '1001',
      applyTypeName: '空置房申请',
      roomId: 'ROOM_002',
      roomName: '2栋202B室',
      communityId: 'COMM_001',
      createUserName: '李四',
      createUserTel: '13823456789',
      createRemark: '房屋长期空置，申请减免物业费',
      checkRemark: '验房通过，房屋设施完好',
      reviewRemark: '审批通过，减免部分费用',
      startTime: '2024-02-01 00:00:00',
      endTime: '2024-04-01 23:59:59',
      feeId: 'FEE_002',
      state: '1' as ApplicationState,
      stateName: '待验房',
      urls: ['https://picsum.photos/400/300?random=room2'],
      createTime: '2024-01-25T09:15:00Z',
      updateTime: '2024-01-25T09:15:00Z',
    },
    {
      ardId: 'ARD_003',
      applyType: '1001',
      applyTypeName: '空置房申请',
      roomId: 'ROOM_003',
      roomName: '3栋303C室',
      communityId: 'COMM_001',
      createUserName: '王五',
      createUserTel: '13834567890',
      createRemark: '房屋装修期间空置，申请费用减免',
      checkRemark: '验房不通过，房屋存在损坏',
      reviewRemark: '',
      startTime: '2024-01-20 00:00:00',
      endTime: '2024-02-20 23:59:59',
      feeId: 'FEE_003',
      state: '3' as ApplicationState,
      stateName: '验房不通过',
      urls: ['https://picsum.photos/400/300?random=room3'],
      createTime: '2024-01-15T16:45:00Z',
      updateTime: '2024-01-18T11:30:00Z',
    },
    {
      ardId: 'ARD_004',
      applyType: '1001',
      applyTypeName: '空置房申请',
      roomId: 'ROOM_004',
      roomName: '4栋404D室',
      communityId: 'COMM_001',
      createUserName: '赵六',
      createUserTel: '13845678901',
      createRemark: '长期外出工作，房屋空置',
      checkRemark: '验房通过',
      reviewRemark: '',
      startTime: '2024-02-10 00:00:00',
      endTime: '2024-05-10 23:59:59',
      feeId: 'FEE_004',
      state: '2' as ApplicationState,
      stateName: '待审核',
      urls: ['https://picsum.photos/400/300?random=room4'],
      createTime: '2024-02-05T14:20:00Z',
      updateTime: '2024-02-08T10:15:00Z',
    },
  ] as PropertyApplication[],

  /** 跟踪记录数据 */
  records: [
    {
      ardrId: 'ARDR_001',
      applicationId: 'ARD_001',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      state: '4',
      stateName: '审批通过',
      remark: '完成最终审核，同意费用减免申请',
      createUserName: '管理员',
      createTime: '2024-01-20T14:20:00Z',
      communityId: 'COMM_001',
    },
    {
      ardrId: 'ARDR_002',
      applicationId: 'ARD_001',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      state: '1',
      stateName: '待验房',
      remark: '开始验房流程',
      createUserName: '验房员',
      createTime: '2024-01-18T10:30:00Z',
      communityId: 'COMM_001',
    },
  ] as ApplicationRecord[],

  /** 跟踪记录详情数据 */
  recordDetails: [
    {
      ardrId: 'ARDR_001',
      applicationId: 'ARD_001',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      relTypeCd: '19000' as RelationTypeCd,
      url: 'https://picsum.photos/400/300?random=record1',
      remark: '验房照片1',
      createTime: '2024-01-18T10:30:00Z',
    },
    {
      ardrId: 'ARDR_002',
      applicationId: 'ARD_001',
      roomId: 'ROOM_001',
      roomName: '1栋101A室',
      relTypeCd: '21000' as RelationTypeCd,
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      remark: '验房视频1',
      createTime: '2024-01-18T10:35:00Z',
    },
  ] as ApplicationRecordDetail[],

  /** 费用折扣数据 */
  feeDiscounts: [
    {
      discountId: 'DISCOUNT_001',
      discountName: '季度空置房优惠',
      discountType: '3003',
      discountAmount: 200,
      communityId: 'COMM_001',
    },
    {
      discountId: 'DISCOUNT_002',
      discountName: '半年空置房优惠',
      discountType: '3003',
      discountAmount: 500,
      communityId: 'COMM_001',
    },
    {
      discountId: 'DISCOUNT_003',
      discountName: '年度空置房优惠',
      discountType: '3003',
      discountAmount: 1200,
      communityId: 'COMM_001',
    },
  ] as FeeDiscount[],

  /** 费用详情数据 */
  feeDetails: [
    {
      detailId: 'DETAIL_001',
      feeName: '物业管理费',
      receivedAmount: 300,
      createTime: '2024-01-15T00:00:00Z',
      checked: false,
      feeId: 'FEE_001',
      roomId: 'ROOM_001',
      communityId: 'COMM_001',
    },
    {
      detailId: 'DETAIL_002',
      feeName: '垃圾处理费',
      receivedAmount: 50,
      createTime: '2024-01-15T00:00:00Z',
      checked: false,
      feeId: 'FEE_001',
      roomId: 'ROOM_001',
      communityId: 'COMM_001',
    },
    {
      detailId: 'DETAIL_003',
      feeName: '公共区域维护费',
      receivedAmount: 100,
      createTime: '2024-01-15T00:00:00Z',
      checked: false,
      feeId: 'FEE_001',
      roomId: 'ROOM_001',
      communityId: 'COMM_001',
    },
  ] as FeeDetail[],

  /** 生成模拟申请数据 */
  createMockApplyRoom(id: string): PropertyApplication {
    const states: ApplicationState[] = ['0', '1', '2', '3', '4', '5', '6']
    const stateNames = ['待提交', '待验房', '待审核', '验房不通过', '审批通过', '审批不通过', '已取消']
    const randomState = states[Math.floor(Math.random() * states.length)]
    const stateIndex = states.indexOf(randomState)

    return {
      ardId: `ARD_${id}`,
      applyType: '1001',
      applyTypeName: '空置房申请',
      roomId: `ROOM_${id}`,
      roomName: `${Math.floor(Math.random() * 20 + 1)}栋${Math.floor(Math.random() * 30 + 1)}${String.fromCharCode(65 + Math.floor(Math.random() * 8))}室`,
      communityId: 'COMM_001',
      createUserName: generateChineseName(),
      createUserTel: generatePhoneNumber(),
      createRemark: '业主申请空置房，希望获得费用减免',
      checkRemark: randomState === '3' ? '验房不通过，房屋存在损坏' : '验房通过，房屋状况良好',
      reviewRemark: randomState === '4' ? '审批通过，同意给予费用减免' : '',
      startTime: `${generateTimeRange(-30, 0).split('T')[0]} 00:00:00`,
      endTime: `${generateTimeRange(0, 90).split('T')[0]} 23:59:59`,
      feeId: `FEE_${id}`,
      state: randomState,
      stateName: stateNames[stateIndex],
      urls: [`https://picsum.photos/400/300?random=${id}`],
      createTime: generateTimeRange(-60, -1),
      updateTime: generateTimeRange(-30, 0),
    }
  },

  /** 生成模拟跟踪记录 */
  createMockRecord(id: string, applicationId: string): ApplicationRecord {
    const states = ['1', '2', '3', '4', '5', '6']
    const stateNames = ['待验房', '待审核', '验房不通过', '审批通过', '审批不通过', '已取消']
    const randomState = states[Math.floor(Math.random() * states.length)]
    const stateIndex = states.indexOf(randomState)

    return {
      ardrId: `ARDR_${id}`,
      applicationId,
      roomId: `ROOM_${id}`,
      roomName: `${Math.floor(Math.random() * 20 + 1)}栋${Math.floor(Math.random() * 30 + 1)}${String.fromCharCode(65 + Math.floor(Math.random() * 8))}室`,
      state: randomState,
      stateName: stateNames[stateIndex],
      remark: '处理记录详情',
      createUserName: generateChineseName(),
      createTime: generateTimeRange(-30, 0),
      communityId: 'COMM_001',
    }
  },

  /** 生成模拟记录详情 */
  createMockRecordDetail(id: string, ardrId: string): ApplicationRecordDetail {
    const relationTypes: RelationTypeCd[] = ['19000', '21000']
    const randomType = relationTypes[Math.floor(Math.random() * relationTypes.length)]

    return {
      ardrId,
      applicationId: `ARD_${id}`,
      roomId: `ROOM_${id}`,
      roomName: `${Math.floor(Math.random() * 20 + 1)}栋${Math.floor(Math.random() * 30 + 1)}${String.fromCharCode(65 + Math.floor(Math.random() * 8))}室`,
      relTypeCd: randomType,
      url: randomType === '19000'
        ? `https://picsum.photos/400/300?random=detail${id}`
        : 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      remark: randomType === '19000' ? '相关图片' : '相关视频',
      createTime: generateTimeRange(-30, 0),
    }
  },

  /** 初始化更多数据 */
  initMoreData() {
    if (this.applyRooms.length < 50) {
      const additionalData = Array.from({ length: 46 }, (_, index) =>
        this.createMockApplyRoom((index + 5).toString().padStart(3, '0')))
      this.applyRooms.push(...additionalData)
    }

    if (this.records.length < 100) {
      const additionalRecords = Array.from({ length: 98 }, (_, index) => {
        const applicationId = this.applyRooms[Math.floor(Math.random() * this.applyRooms.length)]?.ardId || 'ARD_001'
        return this.createMockRecord((index + 3).toString().padStart(3, '0'), applicationId)
      })
      this.records.push(...additionalRecords)
    }

    if (this.recordDetails.length < 200) {
      const additionalDetails = Array.from({ length: 198 }, (_, index) => {
        const ardrId = this.records[Math.floor(Math.random() * this.records.length)]?.ardrId || 'ARDR_001'
        const applicationId = this.records.find(r => r.ardrId === ardrId)?.applicationId || 'ARD_001'
        return this.createMockRecordDetail((index + 3).toString().padStart(3, '0'), ardrId)
      })
      this.recordDetails.push(...additionalDetails)
    }
  },

  /** 获取申请列表 */
  getApplyRoomList(params: PropertyApplicationListParams) {
    let filteredData = [...this.applyRooms]

    // 筛选条件
    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    if (params.roomName) {
      filteredData = filteredData.filter(item =>
        item.roomName.toLowerCase().includes(params.roomName!.toLowerCase()),
      )
    }

    if (params.state) {
      filteredData = filteredData.filter(item => item.state === params.state)
    }

    // 分页
    const total = filteredData.length
    const start = (params.page - 1) * params.row
    const end = start + params.row
    const list = filteredData.slice(start, end)

    return {
      list,
      total,
      page: params.page,
      pageSize: params.row,
      hasMore: end < total,
    }
  },

  /** 根据ID获取申请详情 */
  getApplyRoomById(ardId: string): PropertyApplication | undefined {
    return this.applyRooms.find(item => item.ardId === ardId)
  },

  /** 更新验房信息 */
  updateCheckInfo(data: CheckUpdateRequest): boolean {
    const applyRoom = this.getApplyRoomById(data.ardId)
    if (!applyRoom)
      return false

    applyRoom.state = data.state as ApplicationState
    applyRoom.stateName = data.state === '2' ? '验房通过' : '验房不通过'
    applyRoom.checkRemark = data.checkRemark
    applyRoom.startTime = data.startTime
    applyRoom.endTime = data.endTime
    applyRoom.updateTime = new Date().toISOString()

    // 更新图片URLs
    if (data.photos && data.photos.length > 0) {
      applyRoom.urls = data.photos.map(photoId => `https://picsum.photos/400/300?random=${photoId}`)
    }

    return true
  },

  /** 更新审核信息 */
  updateReviewInfo(data: ReviewUpdateRequest): boolean {
    const applyRoom = this.getApplyRoomById(data.ardId)
    if (!applyRoom)
      return false

    applyRoom.state = data.state as ApplicationState
    applyRoom.stateName = data.state === '4' ? '审批通过' : '审批不通过'
    applyRoom.reviewRemark = data.reviewRemark
    applyRoom.startTime = data.startTime
    applyRoom.endTime = data.endTime
    applyRoom.updateTime = new Date().toISOString()

    return true
  },

  /** 获取跟踪记录列表 */
  getRecordList(params: ApplicationRecordListParams) {
    let filteredData = [...this.records]

    // 筛选条件
    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    if (params.applicationId) {
      filteredData = filteredData.filter(item => item.applicationId === params.applicationId)
    }

    if (params.roomId) {
      filteredData = filteredData.filter(item => item.roomId === params.roomId)
    }

    if (params.roomName) {
      filteredData = filteredData.filter(item =>
        item.roomName.toLowerCase().includes(params.roomName!.toLowerCase()),
      )
    }

    // 分页
    const total = filteredData.length
    const start = (params.page - 1) * params.row
    const end = start + params.row
    const list = filteredData.slice(start, end)

    return {
      list,
      total,
      page: params.page,
      pageSize: params.row,
      hasMore: end < total,
    }
  },

  /** 获取跟踪记录详情 */
  getRecordDetailList(params: ApplicationRecordDetailParams): ApplicationRecordDetail[] {
    let filteredData = [...this.recordDetails]

    // 根据记录ID筛选
    if (params.ardrId) {
      filteredData = filteredData.filter(item => item.ardrId === params.ardrId)
    }

    // 根据小区ID筛选
    if (params.communityId) {
      const relatedRecords = this.records.filter(r => r.communityId === params.communityId)
      const relatedArdIds = relatedRecords.map(r => r.ardrId)
      filteredData = filteredData.filter(item => relatedArdIds.includes(item.ardrId))
    }

    return filteredData
  },

  /** 保存跟踪记录 */
  saveRecord(data: SaveApplicationRecordRequest): boolean {
    const newRecord: ApplicationRecord = {
      ardrId: generateId('ARDR'),
      applicationId: data.applicationId,
      roomId: data.roomId,
      roomName: data.roomName,
      state: data.state,
      stateName: data.stateName,
      remark: data.remark,
      createUserName: '当前用户',
      createTime: new Date().toISOString(),
      communityId: data.communityId,
    }

    this.records.unshift(newRecord)

    // 如果有照片，添加到记录详情
    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((photoId) => {
        const detail: ApplicationRecordDetail = {
          ardrId: newRecord.ardrId,
          applicationId: data.applicationId,
          roomId: data.roomId,
          roomName: data.roomName,
          relTypeCd: '19000',
          url: `https://picsum.photos/400/300?random=${photoId}`,
          remark: data.remark,
          createTime: new Date().toISOString(),
        }
        this.recordDetails.push(detail)
      })
    }

    return true
  },

  /** 删除跟踪记录 */
  deleteRecord(data: DeleteApplicationRecordRequest): boolean {
    const recordIndex = this.records.findIndex(item => item.ardrId === data.ardrId)
    if (recordIndex === -1)
      return false

    // 删除记录
    this.records.splice(recordIndex, 1)

    // 删除相关详情
    this.recordDetails = this.recordDetails.filter(item => item.ardrId !== data.ardrId)

    return true
  },

  /** 获取费用折扣列表 */
  getFeeDiscountList(params: FeeDiscountParams): FeeDiscount[] {
    let filteredData = [...this.feeDiscounts]

    if (params.discountType) {
      filteredData = filteredData.filter(item => item.discountType === params.discountType)
    }

    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    return filteredData
  },

  /** 获取费用详情列表 */
  getFeeDetailList(params: FeeDetailParams): { feeDetails: FeeDetail[] } {
    let filteredData = [...this.feeDetails]

    if (params.communityId) {
      filteredData = filteredData.filter(item => item.communityId === params.communityId)
    }

    if (params.feeId) {
      filteredData = filteredData.filter(item => item.feeId === params.feeId)
    }

    return {
      feeDetails: filteredData,
    }
  },
}

// 初始化更多数据
mockApplyRoomDatabase.initMoreData()

export default defineUniAppMock([
  // 查询空置房申请列表/详情
  {
    url: '/app/applyRoomDiscount/queryApplyRoomDiscount',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await delay()

      const params = { ...query, ...body } as PropertyApplicationListParams & { ardId?: string }

      mockLog('queryApplyRoomDiscount', params)

      // 如果有ardId参数，返回单个申请详情
      if (params.ardId) {
        const applyRoom = mockApplyRoomDatabase.getApplyRoomById(params.ardId)
        if (!applyRoom) {
          mockLog('queryApplyRoomDiscount result', 'not found')
          return errorResponse('申请不存在', ResultEnumMap.NotFound)
        }

        const result = {
          list: [applyRoom],
          total: 1,
          page: params.page || 1,
          pageSize: params.row || 1,
          hasMore: false,
        }

        mockLog('queryApplyRoomDiscount result', applyRoom.ardId)
        return successResponse(result, '查询申请详情成功')
      }

      // 否则返回申请列表
      const result = mockApplyRoomDatabase.getApplyRoomList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: params.communityId || '',
        roomName: params.roomName,
        state: params.state,
      })

      mockLog('queryApplyRoomDiscount result', `${result.list.length} items`)
      return successResponse(result, '查询申请列表成功')
    },
  },

  // 提交验房操作
  {
    url: '/app/applyRoomDiscount/updateApplyRoomDiscount',
    method: 'POST',
    delay: 600,
    body: async ({ body }) => {
      await delay()

      const data = body as CheckUpdateRequest
      mockLog('updateApplyRoomDiscount', { ardId: data.ardId, state: data.state })

      const success = mockApplyRoomDatabase.updateCheckInfo(data)

      if (!success) {
        mockLog('updateApplyRoomDiscount result', 'failed - not found')
        return errorResponse('申请不存在', ResultEnumMap.NotFound)
      }

      mockLog('updateApplyRoomDiscount result', 'success')
      return successResponse(null, '验房更新成功')
    },
  },

  // 提交审核操作
  {
    url: '/app/applyRoomDiscount/updateReviewApplyRoomDiscount',
    method: 'POST',
    delay: 800,
    body: async ({ body }) => {
      await delay()

      const data = body as ReviewUpdateRequest
      mockLog('updateReviewApplyRoomDiscount', { ardId: data.ardId, state: data.state })

      const success = mockApplyRoomDatabase.updateReviewInfo(data)

      if (!success) {
        mockLog('updateReviewApplyRoomDiscount result', 'failed - not found')
        return errorResponse('申请不存在', ResultEnumMap.NotFound)
      }

      mockLog('updateReviewApplyRoomDiscount result', 'success')
      return successResponse(null, '审核更新成功')
    },
  },

  // 查询字典表信息
  {
    url: '/callComponent/core/list',
    method: ['GET', 'POST'],
    delay: 200,
    body: async ({ query, body }) => {
      await delay()

      const params = { ...query, ...body } as DictQueryParams
      mockLog('queryDictInfo', params)

      let dictData: DictInfo[] = []

      if (params.name === 'apply_room_discount' && params.type === 'state') {
        dictData = [
          { statusCd: '0', name: '待提交' },
          { statusCd: '1', name: '待验房' },
          { statusCd: '2', name: '待审核' },
          { statusCd: '3', name: '验房不通过' },
          { statusCd: '4', name: '审批通过' },
          { statusCd: '5', name: '审批不通过' },
          { statusCd: '6', name: '已取消' },
        ]
      }

      mockLog('queryDictInfo result', `${dictData.length} items`)
      return successResponse(dictData, '查询字典成功')
    },
  },

  // 查询费用折扣列表
  {
    url: '/app/feeDiscount/queryFeeDiscount',
    method: ['GET', 'POST'],
    delay: 300,
    body: async ({ query, body }) => {
      await delay()

      const params = { ...query, ...body } as FeeDiscountParams
      mockLog('queryFeeDiscount', params)

      const discounts = mockApplyRoomDatabase.getFeeDiscountList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 100,
        discountType: params.discountType,
        communityId: params.communityId,
      })

      mockLog('queryFeeDiscount result', `${discounts.length} items`)
      return successResponse(discounts, '查询费用折扣成功')
    },
  },

  // 查询费用详情
  {
    url: '/app/fee.queryFeeDetail',
    method: ['GET', 'POST'],
    delay: 400,
    body: async ({ query, body }) => {
      await delay()

      const params = { ...query, ...body } as FeeDetailParams
      mockLog('queryFeeDetail', params)

      const feeDetail = mockApplyRoomDatabase.getFeeDetailList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 50,
        communityId: params.communityId,
        feeId: params.feeId,
      })

      mockLog('queryFeeDetail result', `${feeDetail.feeDetails.length} items`)
      return successResponse(feeDetail, '查询费用详情成功')
    },
  },

  // 查询空置房跟踪记录列表
  {
    url: '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecord',
    method: ['GET', 'POST'],
    delay: [300, 600],
    body: async ({ query, body }) => {
      await delay()

      const params = { ...query, ...body } as ApplicationRecordListParams
      mockLog('queryApplyRoomDiscountRecord', params)

      const result = mockApplyRoomDatabase.getRecordList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: params.communityId || '',
        applicationId: params.applicationId,
        roomId: params.roomId,
        roomName: params.roomName,
      })

      mockLog('queryApplyRoomDiscountRecord result', `${result.list.length} items`)
      return successResponse(result, '查询跟踪记录列表成功')
    },
  },

  // 查询空置房跟踪记录详情
  {
    url: '/app/applyRoomDiscountRecord/queryApplyRoomDiscountRecordDetail',
    method: ['GET', 'POST'],
    delay: 300,
    body: async ({ query, body }) => {
      await delay()

      const params = { ...query, ...body } as ApplicationRecordDetailParams
      mockLog('queryApplyRoomDiscountRecordDetail', params)

      const details = mockApplyRoomDatabase.getRecordDetailList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: params.communityId,
        ardrId: params.ardrId,
        roomName: params.roomName,
      })

      mockLog('queryApplyRoomDiscountRecordDetail result', `${details.length} items`)
      return successResponse(details, '查询跟踪记录详情成功')
    },
  },

  // 保存空置房跟踪记录
  {
    url: '/app/applyRoomDiscountRecord/addApplyRoomDiscountRecord',
    method: 'POST',
    delay: 800,
    body: async ({ body }) => {
      await delay()

      const data = body as SaveApplicationRecordRequest
      mockLog('saveApplyRoomDiscountRecord', { applicationId: data.applicationId, remark: data.remark })

      const success = mockApplyRoomDatabase.saveRecord(data)

      if (!success) {
        mockLog('saveApplyRoomDiscountRecord result', 'failed')
        return errorResponse('保存失败', ResultEnumMap.InternalServerError)
      }

      mockLog('saveApplyRoomDiscountRecord result', 'success')
      return successResponse(null, '保存跟踪记录成功')
    },
  },

  // 删除空置房跟踪记录
  {
    url: '/app/applyRoomDiscountRecord/cutApplyRoomDiscountRecord',
    method: ['POST', 'DELETE'],
    delay: 400,
    body: async ({ query, body }) => {
      await delay()

      const params = { ...query, ...body } as DeleteApplicationRecordRequest
      mockLog('cutApplyRoomDiscountRecord', { ardrId: params.ardrId })

      const success = mockApplyRoomDatabase.deleteRecord(params)

      if (!success) {
        mockLog('cutApplyRoomDiscountRecord result', 'failed - not found')
        return errorResponse('记录不存在', ResultEnumMap.NotFound)
      }

      mockLog('cutApplyRoomDiscountRecord result', 'success')
      return successResponse(null, '删除跟踪记录成功')
    },
  },
])
