export class SalesByStatusModel {
    items: SalesByStatusItems[]
    returnedTotal: number
    total: number
  }
  
  export class SalesByStatusItems {
    status: string
    value: number
    qty: number
    qtyItems: number
  }
  