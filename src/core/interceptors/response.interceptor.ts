import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // ตรวจสอบว่าเป็น error response หรือไม่
        if (data && typeof data === 'object' && ('statusCode' in data || 'error' in data)) {
          return data;
        }
        
        // สำหรับ success response
        return {
          data,
          success: true,
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url
        };
      }),
    );
  }
}