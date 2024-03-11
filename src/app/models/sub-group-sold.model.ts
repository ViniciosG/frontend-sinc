export class SubGroupSoldModel {
    items: SubGroupSoldItems[]
    returnedTotal: number
    total: number
  }
  
  export class SubGroupSoldItems {
    subGroupId: number
    subGroupName: string
    value: number
    qty: number
    qtyItems: number
  }
  