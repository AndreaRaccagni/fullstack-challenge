import { CreateProduct, Product } from '../../../domain/products/product';
import { ProductRepositoryPort } from '../../../ports/product-repository.port';

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  execute(input: CreateProduct): Promise<Product> {
    return this.productRepository.create(input);
  }
}
