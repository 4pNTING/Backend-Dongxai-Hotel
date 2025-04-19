import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { HttpExceptionFilter } from './core/constants/filters/http-exception.filter';
import { RequestLoggerInterceptor } from '@core/interceptors/request-logger.interceptor';
import { ResponseInterceptor } from '@core/interceptors/response.interceptor';

async function bootstrap() {
 const logger = new Logger('Bootstrap');
 const NODE_ENV = process.env.NODE_ENV || 'development';
 const APP_PORT = process.env.APP_PORT || 5000;

 const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'debug', 'log', 'verbose'], 
});

// เพิ่ม Global Interceptors
app.useGlobalInterceptors(
  new RequestLoggerInterceptor(),
  new ResponseInterceptor() // เพิ่ม ResponseInterceptor
);

 const reflector = app.get(Reflector);
//  app.useGlobalGuards(new JwtAuthGuard(reflector));
 app.useGlobalFilters(new HttpExceptionFilter());
 app.enableCors();
 app.setGlobalPrefix('/v1');

 app.useGlobalPipes(
   new ValidationPipe({
     transform: true,
     whitelist: true,
     forbidNonWhitelisted: true,
     exceptionFactory: (errors) => {
       const result = errors.map((error) => {
         if (error && error.constraints) {
           return {
             property: error.property,
             message: error.constraints[Object.keys(error.constraints)[0]]
           };
         } else {
           return {
             property: error.property,
             message: 'Invalid value'
           };
         }
       });
       return new UnprocessableEntityException(result);
     },
   })
 );

 try {
   await app.listen(APP_PORT);
   logger.log(`Application environment: ${NODE_ENV}`);
   logger.log(`Server is running on: ${await app.getUrl()}`);
 } catch (error) {
   logger.error(`Failed to start application: ${error.message}`, error.stack);
   process.exit(1);
 }
}

bootstrap();