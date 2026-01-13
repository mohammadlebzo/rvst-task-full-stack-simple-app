import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        service: { type: 'string', example: 'order-service' },
        version: { type: 'string', example: '1.0.0' },
        uptime: { type: 'number', example: 12345.67 },
        timestamp: { type: 'string', example: '2026-01-14T00:00:00.000Z' },
        database: { 
          type: 'object',
          properties: {
            connected: { type: 'boolean', example: true }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async healthCheck() {
    return this.appService.getHealthStatus();
  }
}
