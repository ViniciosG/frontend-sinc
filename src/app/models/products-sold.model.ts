export class ProductsSoldModel {
    items: ProductsSoldItems[]
    returnedTotal: number
    total: number
  }
  
  export class ProductsSoldItems {
    productId: number
    productName: string
    value: number
    avarangePerSale: number
    qty: number
    qtyItems: number
  }
  