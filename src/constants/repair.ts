import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'

/** 维修状态配置（旧版 statusCd/name） */
export const REPAIR_STATUSES: ColumnItem[] = [
  { value: '10001', label: '待派单' },
  { value: '10002', label: '已派单' },
  { value: '10003', label: '处理中' },
  { value: '10004', label: '已完成' },
  { value: '10005', label: '已取消' },
]
