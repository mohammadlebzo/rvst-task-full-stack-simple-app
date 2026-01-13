import { Controller, Get, Post, Body, Param, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 422, description: 'Insufficient stock' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with product details and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Paginated list of orders', type: [OrderResponseDto] })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.ordersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID with product details' })
  @ApiParam({ name: 'id', description: 'Order UUID' })
  @ApiResponse({ status: 200, description: 'Order found', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
