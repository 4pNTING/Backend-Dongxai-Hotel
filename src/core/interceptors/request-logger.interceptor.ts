import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, headers } = req;
    
    // แสดงข้อมูลคำขอที่เข้ามา
    this.logger.debug(`⬇️ REQUEST: ${method} ${url}`);
    this.logger.debug(`📦 BODY: ${JSON.stringify(body)}`);
    this.logger.debug(`🔑 HEADERS: ${JSON.stringify(headers)}`);
    
    const now = Date.now();
    
    return next.handle().pipe(
      tap({
        next: (response) => {
          const responseTime = Date.now() - now;
          this.logger.debug(`⬆️ RESPONSE: ${method} ${url} - ${responseTime}ms`);
          this.logger.debug(`📋 DATA: ${JSON.stringify(response).substring(0, 300)}${JSON.stringify(response).length > 300 ? '...' : ''}`);
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          let errorLocation = '';
          
          // พยายามค้นหาตำแหน่งของข้อผิดพลาด
          if (error.stack) {
            const stackLines = error.stack.split('\n');
            // หาบรรทัดแรกที่อ้างอิงถึงโค้ดของคุณ (ไม่ใช่ไลบรารี)
            const projectStackLine = stackLines.find(line => 
              line.includes('/src/') && !line.includes('node_modules')
            );
            
            if (projectStackLine) {
              // แยกชื่อไฟล์และบรรทัด
              const match = projectStackLine.match(/\((.+):(\d+):(\d+)\)/) || 
                            projectStackLine.match(/at (.+):(\d+):(\d+)/);
              if (match) {
                const [_, filePath, line, column] = match;
                errorLocation = `📍 แก้ไขที่: ${filePath.split('/src/')[1]}:${line}`;
              }
            }
          }
          
          this.logger.error(`❌ ERROR: ${method} ${url} - ${responseTime}ms`);
          this.logger.error(`💣 MESSAGE: ${error.message}`);
          if (errorLocation) {
            this.logger.error(errorLocation);
          }
          this.logger.error(`🔍 STACK: ${error.stack}`);
        }
      }),
    );
  }
}