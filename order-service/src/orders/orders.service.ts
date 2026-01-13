import { Injectable, NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

@Injectable()
export class OrdersService {
  private readonly productServiceUrl: string;

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private httpService: HttpService,
  ) {
    this.productServiceUrl = `${process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001'}/products`;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Step 1: Fetch product details from Product Service
    let product: Product;
    try {
      const response = await firstValueFrom(
        this.httpService.get<Product>(`${this.productServiceUrl}/${createOrderDto.productId}`)
      );
      product = response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Product with ID ${createOrderDto.productId} not found`);
      }
      throw new BadRequestException('Failed to fetch product details');
    }

    // Step 2: Validate stock availability
    if (product.stock < createOrderDto.quantity) {
      throw new UnprocessableEntityException(
        `Insufficient stock. Available: ${product.stock}, Requested: ${createOrderDto.quantity}`
      );
    }

    // Step 3: Calculate total price
    const totalPrice = product.price * createOrderDto.quantity;

    // Step 4: Create order
    const order = this.ordersRepository.create({
      productId: createOrderDto.productId,
      quantity: createOrderDto.quantity,
      totalPrice,
      status: 'pending',
    });
    const savedOrder = await this.ordersRepository.save(order);

    // Step 5: Reduce stock in Product Service
    try {
      await firstValueFrom(
        this.httpService.patch(
          `${this.productServiceUrl}/${createOrderDto.productId}/reduce-stock`,
          { quantity: createOrderDto.quantity }
        )
      );
    } catch (error) {
      // If stock reduction fails, we should rollback the order
      // For simplicity, we'll just log and mark as failed
      console.error('Failed to reduce stock:', error.message);
      savedOrder.status = 'cancelled';
      await this.ordersRepository.save(savedOrder);
      throw new BadRequestException('Failed to complete order - stock reduction failed');
    }

    // Mark order as completed
    savedOrder.status = 'completed';
    return this.ordersRepository.save(savedOrder);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: any[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await this.ordersRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    
    // Fetch product details for each order
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        try {
          const response = await firstValueFrom(
            this.httpService.get<Product>(`${this.productServiceUrl}/${order.productId}`)
          );
          return {
            ...order,
            product: response.data,
          };
        } catch (error) {
          // If product not found, return order without product details
          return {
            ...order,
            product: null,
          };
        }
      })
    );

    return {
      data: ordersWithProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<any> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Fetch product details
    try {
      const response = await firstValueFrom(
        this.httpService.get<Product>(`${this.productServiceUrl}/${order.productId}`)
      );
      return {
        ...order,
        product: response.data,
      };
    } catch (error) {
      // If product not found, return order without product details
      return {
        ...order,
        product: null,
      };
    }
  }
}
