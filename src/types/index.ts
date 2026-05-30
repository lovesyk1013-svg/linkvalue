export type UserRole = 'user' | 'admin'
export type ProductType = 'group_buy' | 'investment'
export type ProductStatus = 'active' | 'closed' | 'upcoming'
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Profile {
  id: string
  email: string
  name: string
  phone: string | null
  role: UserRole
  created_at: string
}

export interface Product {
  id: string
  title: string
  description: string
  category: string
  price: number
  original_price: number | null
  target_amount: number | null
  current_amount: number
  participant_count: number
  deadline: string | null
  image_url: string | null
  status: ProductStatus
  type: ProductType
  interest_rate: number | null
  duration_months: number | null
  account_bank: string | null
  account_number: string | null
  account_holder: string | null
  created_at: string
  created_by: string
}

export interface Order {
  id: string
  user_id: string
  product_id: string
  amount: number
  quantity: number | null
  status: OrderStatus
  memo: string | null
  created_at: string
  product?: Product
}
