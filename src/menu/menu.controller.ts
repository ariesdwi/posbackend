import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateStockDto,
} from './dto/product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { User } from '../common/decorators/user.decorator';
import type { RequestUser } from '../common/decorators/user.decorator';

@ApiTags('Menu/Products')
@Controller('menu')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  @ApiOperation({ summary: 'Create product (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
        price: { type: 'number' },
        stock: { type: 'integer' },
        categoryId: { type: 'string' },
        status: { type: 'string', enum: ['AVAILABLE', 'OUT_OF_STOCK'] },
        file: { type: 'string', format: 'binary', nullable: true },
        imageUrl: { type: 'string', nullable: true },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @User() user: RequestUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.menuService.create(createProductDto, user.businessId, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with optional filters' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @User() user: RequestUser,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.menuService.findAll(user.businessId, categoryId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string, @User() user: RequestUser) {
    return this.menuService.findOne(id, user.businessId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: true },
        description: { type: 'string', nullable: true },
        price: { type: 'number', nullable: true },
        stock: { type: 'integer', nullable: true },
        categoryId: { type: 'string', nullable: true },
        status: {
          type: 'string',
          enum: ['AVAILABLE', 'OUT_OF_STOCK'],
          nullable: true,
        },
        file: { type: 'string', format: 'binary', nullable: true },
        imageUrl: { type: 'string', nullable: true },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: RequestUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.menuService.update(id, updateProductDto, user.businessId, file);
  }

  @Patch(':id/stock')
  @UseGuards(RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  @ApiOperation({ summary: 'Update product stock (Admin only)' })
  updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
    @User() user: RequestUser,
  ) {
    return this.menuService.updateStock(id, updateStockDto, user.businessId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  remove(@Param('id') id: string, @User() user: RequestUser) {
    return this.menuService.remove(id, user.businessId);
  }
}
