import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @Column('text')
  @Expose()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Expose()
  price: number;

  @Column('int', { default: 0 })
  @Expose()
  stock: number;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;
}
