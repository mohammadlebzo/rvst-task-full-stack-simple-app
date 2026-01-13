import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  private startTime: number;

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    this.startTime = Date.now();
  }

  getHello(): string {
    return 'Product Service API';
  }

  async getHealthStatus() {
    const uptime = (Date.now() - this.startTime) / 1000; // in seconds
    
    // Check database connectivity
    let dbConnected = false;
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        dbConnected = true;
      }
    } catch (error) {
      dbConnected = false;
    }

    return {
      status: dbConnected ? 'healthy' : 'unhealthy',
      service: 'product-service',
      version: '1.0.0',
      uptime: parseFloat(uptime.toFixed(2)),
      timestamp: new Date().toISOString(),
      database: {
        connected: dbConnected,
      },
    };
  }
}
