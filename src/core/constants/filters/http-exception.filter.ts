// src/infrastructure/filters/http-exception.filter.ts
import {  ExceptionFilter,  Catch,  ArgumentsHost, HttpException,  HttpStatus, Logger,} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const details =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'An unexpected error occurred' };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status}, Message: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      statusCode: status,
      message: message,
      details: details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

