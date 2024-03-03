export class SalesByDayOfWeekModel {
    items: SalesByDayOfWeekItems[]
    returnedTotal: number
    total: number
  }
  
  export class SalesByDayOfWeekItems {
    dayOfWeek: string
    value: number
    qty: number
    qtyItems: number
  }
  