import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ example: 'Laptop', description: 'Product name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'High-performance laptop', description: 'Product description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99, description: 'Product price', minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @ApiProperty({ example: 10, description: 'Stock quantity', minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;
}
