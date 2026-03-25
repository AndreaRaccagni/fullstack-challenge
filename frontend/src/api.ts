import { Product, ProductFilters } from './types';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function fetchProducts(filters: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams();
  params.set('activeOnly', String(filters.activeOnly));

  if (filters.category.trim()) {
    params.set('category', filters.category.trim());
  }

  if (filters.maxPrice.trim()) {
    params.set('maxPrice', filters.maxPrice.trim());
  }

  const response = await fetch(`${apiBaseUrl}/products?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Could not load products.');
  }

  return response.json() as Promise<Product[]>;
}
