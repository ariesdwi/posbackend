import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Businesses')
@Controller('businesses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create new business (Platform Admin only)',
    description: 'Create a new business entity for a customer',
  })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessesService.create(createBusinessDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all businesses (Platform Admin only)',
    description: 'Retrieve list of all businesses in the platform',
  })
  @ApiResponse({
    status: 200,
    description: 'Businesses retrieved successfully',
    schema: {
      example: [
        {
          id: 'business-id',
          name: 'Kedai Kita',
          address: 'Jl. Contoh No. 123',
          phone: '081234567890',
          createdAt: '2026-01-11T12:00:00.000Z',
          updatedAt: '2026-01-11T12:00:00.000Z',
          _count: {
            users: 3,
            products: 98,
            categories: 16,
            transactions: 45,
          },
        },
      ],
    },
  })
  findAll() {
    return this.businessesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get business by ID (Platform Admin only)',
    description: 'Retrieve detailed information about a specific business',
  })
  @ApiResponse({
    status: 200,
    description: 'Business details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Business not found' })
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @Get(':id/stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get business statistics (Platform Admin only)',
    description: 'Retrieve comprehensive statistics for a business',
  })
  @ApiResponse({
    status: 200,
    description: 'Business statistics retrieved successfully',
    schema: {
      example: {
        business: {
          id: 'business-id',
          name: 'Kedai Kita',
          address: 'Jl. Contoh No. 123',
          phone: '081234567890',
        },
        stats: {
          users: 3,
          products: 98,
          categories: 16,
          transactions: 45,
          totalRevenue: 1500000,
        },
      },
    },
  })
  getStats(@Param('id') id: string) {
    return this.businessesService.getStats(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update business (Platform Admin only)',
    description: 'Update business information',
  })
  @ApiResponse({ status: 200, description: 'Business updated successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete business (Platform Admin only)',
    description:
      'Delete a business and all its related data (users, products, transactions)',
  })
  @ApiResponse({ status: 200, description: 'Business deleted successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  remove(@Param('id') id: string) {
    return this.businessesService.remove(id);
  }
}
