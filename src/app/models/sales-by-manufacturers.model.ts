export class SalesByManufacturersModel {
    items: SalesByManufactureersItems[]
    returnedTotal: number
    total: number
  }
  
  export class SalesByManufactureersItems {
    manufacturerId: number
    manufacturerName: string
    value: number
    qty: number
    qtyItems: number
  }
  