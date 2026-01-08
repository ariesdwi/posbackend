"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useStaticAssets((0, path_1.join)(__dirname, '..', '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('POS Backend API')
        .setDescription(`Point of Sale System REST API Documentation
      
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
- Error: { success: false, statusCode, message, error, timestamp }`)
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Authentication', 'User authentication and authorization')
        .addTag('Users', 'User management (Admin only)')
        .addTag('Categories', 'Product category management')
        .addTag('Menu/Products', 'Product/menu management')
        .addTag('Transactions', 'Sales transactions')
        .addTag('Reports', 'Sales reports and analytics')
        .addTag('Receipts', 'Receipt generation for WhatsApp and thermal printers')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
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
//# sourceMappingURL=main.js.map