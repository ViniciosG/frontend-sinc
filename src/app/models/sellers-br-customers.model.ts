export interface SellersByCustomersModel {
    items: SellersByCustomersItems[]
    returnedTotal: number
    total: number
  }
  
  export interface SellersByCustomersItems {
    sellerId: number
    sellerName: string
    active: number
    inactive: number
    inactiveWithBudget: number
  }
  