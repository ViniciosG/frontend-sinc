export class SalesByMonthModel {
    items: SalesByMonthItems[]
    returnedTotal: number
    total: number
  }
  
  export class SalesByMonthItems {
    month: string
    value: number
    qty: number
    qtyItems: number
  }
  