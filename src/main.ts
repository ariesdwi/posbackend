import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors();

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('POS Backend API')
    .setDescription(
      `Point of Sale System REST API Documentation
      
**Authentication:**
1. Use the /auth/login endpoint to get your JWT token
2. Click the "Authorize" button (🔒) at the top right
3. Enter: Bearer <your_token>
4. All protected endpoints will now work!

**Default Credentials:**
- Admin: admin@pos.com / admin123
- Kasir: kasir@pos.com / kasir123

**Response Format:**
All responses follow a standard format:
- Success: { success: true, statusCode, message, data, timestamp }
- Error: { success: false, statusCode, message, error, timestamp }`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management (Admin only)')
    .addTag('Categories', 'Product category management')
    .addTag('Menu/Products', 'Product/menu management')
    .addTag('Transactions', 'Sales transactions')
    .addTag('Reports', 'Sales reports and analytics')
    .addTag('Receipts', 'Receipt generation for WhatsApp and thermal printers')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 POS Backend API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api\n`);
}
bootstrap();
