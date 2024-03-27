export class SalesByCustumersModel {
    items: SalesByCustumersItems[]
    returnedTotal: number
    total: number
  }
  
  export class SalesByCustumersItems {
    personId: number
    personName: string
    value: number
    qty: number
    qtyItems: number
  }
  