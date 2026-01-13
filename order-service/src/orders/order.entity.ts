import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  productId: string;

  @Column('int')
  @Expose()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @Expose()
  totalPrice: number;

  @Column({ default: 'pending' })
  @Expose()
  status: 'pending' | 'completed' | 'cancelled';

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;
}
