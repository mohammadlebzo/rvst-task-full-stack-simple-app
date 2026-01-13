import { IsString, IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'High-performance laptop', description: 'Product description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 999.99, description: 'Product price', minimum: 0 })
  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiProperty({ example: 10, description: 'Stock quantity', minimum: 0, required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;
}
