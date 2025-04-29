import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './src/app.module'
async function bootstrap() {
  // สร้าง Logger
  const logger = new Logger('Bootstrap');

  // สร้าง Nest Application
  const app = await NestFactory.create(AppModule, {
    // การตั้งค่า Logger
    logger: ['error', 'warn', 'log', 'debug', 'verbose']
  });

  try {
    // CORS Configuration
    app.enableCors({
      origin: true, // หรือระบุ domain ที่ต้องการ
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });

    // Global Validation Pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // ลบ properties ที่ไม่ได้ประกาศใน DTO
        transform: true, // แปลง payload เป็น DTO
        forbidNonWhitelisted: false, // ปฏิเสธ request ที่มี properties ไม่ได้ประกาศ
        validationError: {
          target: false,
          value: false
        }
      })
    );

    // Swagger Configuration
    const config = new DocumentBuilder()
      .setTitle('Hotel Management API')
      .setDescription('Comprehensive Hotel Management System API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Employees', 'Employee Management')
      .addTag('Authentication', 'User Authentication')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    // Port Configuration
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');

    // Logging
    logger.log(`🚀 Application running on: ${await app.getUrl()}`);
    logger.log(`📗 Swagger Docs available at: ${await app.getUrl()}/api-docs`);
    logger.log(`🌐 Listening on port: ${port}`);

    // Optional: Log Registered Routes
    const server = app.getHttpServer();
    const router = server._router;
    
    logger.log('Registered Routes:');
    router.stack.forEach((r) => {
      if (r.route && r.route.path) {
        logger.log(`${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
      }
    });

    // Graceful Shutdown
    process.on('SIGTERM', async () => {
      logger.log('🔇 SIGTERM received, shutting down gracefully');
      await app.close();
      process.exit(0);
    });

  } catch (error) {
    logger.error('❌ Failed to start application', error);
    process.exit(1);
  }
}

// Global Error Handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

bootstrap();