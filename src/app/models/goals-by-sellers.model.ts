export class GoalsBySellersModel {
    items: GoalsBySellersItems[]
    returnedTotal: number
    total: number
  }
  
  export class GoalsBySellersItems {
    sellerId: number
    sellerName: string
    value: number
    qty: number
    qtyItems: number
    goal: number
  }
  