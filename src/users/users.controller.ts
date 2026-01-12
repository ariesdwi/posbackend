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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { User } from '../common/decorators/user.decorator';
import type { RequestUser } from '../common/decorators/user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Platform Admin Routes
  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all users across all businesses (Platform Admin only)',
    description: 'Retrieve all users from all businesses in the platform',
  })
  @ApiResponse({
    status: 200,
    description: 'All users retrieved successfully',
    schema: {
      example: [
        {
          id: 'user-id',
          email: 'user@example.com',
          name: 'User Name',
          role: 'BUSINESS_OWNER',
          isActive: true,
          businessId: 'business-id',
          business: {
            id: 'business-id',
            name: 'Business Name',
            phone: '081234567890',
          },
        },
      ],
    },
  })
  findAllGlobal() {
    return this.usersService.findAllGlobal();
  }

  @Get('admin/by-role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get users by role (Platform Admin only)',
    description: 'Filter users by their role across all businesses',
  })
  @ApiResponse({ status: 200, description: 'Users filtered by role' })
  findByRole(@Query('role') role: string) {
    return this.usersService.findAllByRole(role);
  }

  @Get('admin/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get any user by ID (Platform Admin only)',
    description: 'Get user details regardless of business',
  })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  findOneGlobal(@Param('id') id: string) {
    return this.usersService.findOneGlobal(id);
  }

  @Patch('admin/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update any user (Platform Admin only)',
    description: 'Update user details regardless of business',
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  updateGlobal(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateGlobal(id, updateUserDto);
  }

  @Delete('admin/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete any user (Platform Admin only)',
    description: 'Delete user regardless of business',
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  removeGlobal(@Param('id') id: string) {
    return this.usersService.removeGlobal(id);
  }

  @Post()
  @Roles(UserRole.BUSINESS_OWNER)
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto, @User() user: RequestUser) {
    return this.usersService.create(createUserDto, user.businessId);
  }

  @Get()
  @Roles(UserRole.BUSINESS_OWNER)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll(@User() user: RequestUser) {
    return this.usersService.findAll(user.businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  findOne(@Param('id') id: string, @User() user: RequestUser) {
    return this.usersService.findOne(id, user.businessId);
  }

  @Patch(':id')
  @Roles(UserRole.BUSINESS_OWNER)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: RequestUser,
  ) {
    return this.usersService.update(id, updateUserDto, user.businessId);
  }

  @Delete(':id')
  @Roles(UserRole.BUSINESS_OWNER)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(@Param('id') id: string, @User() user: RequestUser) {
    return this.usersService.remove(id, user.businessId);
  }
}
