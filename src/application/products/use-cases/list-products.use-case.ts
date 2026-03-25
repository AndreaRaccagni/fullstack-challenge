import { ListProductsCriteria, Product } from '../../../domain/products/product';
import { ProductRepositoryPort } from '../../../ports/product-repository.port';

export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  execute(criteria: ListProductsCriteria): Promise<Product[]> {
    return this.productRepository.findAll(criteria);
  }
}
