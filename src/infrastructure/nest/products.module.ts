import { Module } from '@nestjs/common';

import { CreateProductUseCase } from '../../application/products/use-cases/create-product.use-case';
import { ListProductsUseCase } from '../../application/products/use-cases/list-products.use-case';
import { ProductsController } from '../../adapters/inbound/http/products/products.controller';
import { PostgresProductRepository } from '../../adapters/outbound/persistence/postgres/postgres-product.repository';
import { PRODUCT_REPOSITORY_PORT, ProductRepositoryPort } from '../../ports/product-repository.port';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [
    PostgresProductRepository,
    {
      provide: PRODUCT_REPOSITORY_PORT,
      useExisting: PostgresProductRepository,
    },
    {
      provide: ListProductsUseCase,
      useFactory: (productRepository: ProductRepositoryPort) =>
        new ListProductsUseCase(productRepository),
      inject: [PRODUCT_REPOSITORY_PORT],
    },
    {
      provide: CreateProductUseCase,
      useFactory: (productRepository: ProductRepositoryPort) =>
        new CreateProductUseCase(productRepository),
      inject: [PRODUCT_REPOSITORY_PORT],
    },
  ],
})
export class ProductsModule {}
