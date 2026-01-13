import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
