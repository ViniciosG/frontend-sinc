export class NewCustomersPerSellersModel {
    items: NewCustomersPerSellersItems[]
    returnedTotal: number
    total: number
  }
  
  export class NewCustomersPerSellersItems {
    sellerId: number
    sellerName: string
    qty: number
    color: string
    index: number
  }
  