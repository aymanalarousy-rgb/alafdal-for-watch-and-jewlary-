export type ProductCategory = 
  | 'watches-men' 
  | 'watches-women';

export type ProductCondition = 'brand-new' | 'like-new' | 'collector-grade';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number; // in Libyan Dinar (LYD)
  originalPrice?: number;
  quantity: number;
  images: string[];
  condition: ProductCondition;
  movement?: string; // e.g. "أوتوماتيك سويسري معتمد COSC"
  caseMaterial?: string; // e.g. "ذهب أصفر 18 قيراط"
  dialColor?: string;
  boxAndPapers: boolean;
  warrantyYears: number;
  year?: string;
  description: string;
  featured: boolean;
  createdAt: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  notes?: string;
  productId: string;
  productName: string;
  productBrand: string;
  productImage: string;
  price: number;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  courierCompany?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export type Currency = 'LYD';
