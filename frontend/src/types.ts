export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  stock?: number;
}

export interface ProductFilters {
  activeOnly: boolean;
  category: string;
  maxPrice: string;
}
