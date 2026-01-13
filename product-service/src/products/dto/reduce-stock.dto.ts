import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReduceStockDto {
  @ApiProperty({ example: 5, description: 'Quantity to reduce from stock', minimum: 1 })
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
}
