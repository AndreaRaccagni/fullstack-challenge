import { Module } from '@nestjs/common';

import { ProductsModule } from './infrastructure/nest/products.module';

@Module({
  imports: [ProductsModule],
})
export class AppModule {}
