import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CategoriesService } from '../categories/categories.service';
import { BusinessesService } from '../businesses/businesses.service';

@ApiTags('Public Menu')
@Controller('public/menu')
export class PublicMenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly categoriesService: CategoriesService,
    private readonly businessesService: BusinessesService,
  ) {}

  @Get(':businessId')
  @ApiOperation({ summary: 'Get business information (Public)' })
  @ApiResponse({
    status: 200,
    description: 'Business information retrieved successfully',
  })
  getBusinessInfo(@Param('businessId') businessId: string) {
    return this.businessesService.findOnePublic(businessId);
  }

  @Get(':businessId/categories')
  @ApiOperation({ summary: 'Get all categories for a business (Public)' })
  findAllCategories(@Param('businessId') businessId: string) {
    return this.categoriesService.findAll(businessId);
  }

  @Get(':businessId/products')
  @ApiOperation({ summary: 'Get all products for a business (Public)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllProducts(
    @Param('businessId') businessId: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.menuService.findAll(businessId, categoryId, search);
  }
}
