import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { CategoriesModule } from '../categories/categories.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { PublicMenuController } from './public-menu.controller';

@Module({
  imports: [PrismaModule, UploadModule, CategoriesModule, BusinessesModule],
  controllers: [MenuController, PublicMenuController],
  providers: [MenuService],
})
export class MenuModule {}
