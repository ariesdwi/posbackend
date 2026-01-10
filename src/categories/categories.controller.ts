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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { User } from '../common/decorators/user.decorator';
import type { RequestUser } from '../common/decorators/user.decorator';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create category (Admin only)' })
  create(@Body() createCategoryDto: CreateCategoryDto, @User() user: RequestUser) {
    return this.categoriesService.create(createCategoryDto, user.businessId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  findAll(@User() user: RequestUser) {
    return this.categoriesService.findAll(user.businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID with products' })
  findOne(@Param('id') id: string, @User() user: RequestUser) {
    return this.categoriesService.findOne(id, user.businessId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update category (Admin only)' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @User() user: RequestUser) {
    return this.categoriesService.update(id, updateCategoryDto, user.businessId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete category (Admin only)' })
  remove(@Param('id') id: string, @User() user: RequestUser) {
    return this.categoriesService.remove(id, user.businessId);
  }
}
