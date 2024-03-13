export interface MarginByProductsModel {
    items: MarginByProductsItems[]
    returnedTotal: number
    total: number
  }
  
  export interface MarginByProductsItems {
    productId: number
    productName: string
    value: number
    qty: number
    qtyItems: number
    margin: number
  }
  