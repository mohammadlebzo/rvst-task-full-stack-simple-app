import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'abc123', description: 'Product ID from Product Service' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity to order', minimum: 1 })
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
