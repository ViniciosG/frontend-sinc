export class MarginBySubGroupsModel {
    items: MarginBySubGroupsItems[]
    returnedTotal: number
    total: number
  }
  
  export interface MarginBySubGroupsItems {
    subGroupId: number
    subGroupName: string
    value: number
    qty: number
    qtyItems: number
    margin: number
  }
  