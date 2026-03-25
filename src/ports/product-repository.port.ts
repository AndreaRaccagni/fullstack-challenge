import { CreateProduct, ListProductsCriteria, Product } from '../domain/products/product';

export const PRODUCT_REPOSITORY_PORT = Symbol('PRODUCT_REPOSITORY_PORT');

export interface ProductRepositoryPort {
  findAll(criteria: ListProductsCriteria): Promise<Product[]>;
  create(input: CreateProduct): Promise<Product>;
}
