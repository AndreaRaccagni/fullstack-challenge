import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListProductsQueryDto {
  @IsOptional()
  @IsBoolean()
  activeOnly?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;
}
