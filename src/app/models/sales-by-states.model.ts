export class SalesByStatesModel {
    items: SalesByStatesItems[]
    returnedTotal: number
    total: number
  }
  
  export class SalesByStatesItems {
    uf: string
    state: string
    value: number
    qty: number
    qtyItems: number
  }
  