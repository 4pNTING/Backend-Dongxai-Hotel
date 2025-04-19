// src/infrastructure/security/strategies/local.strategy.ts
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../../application/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userName', 
      passwordField: 'password',
    });
  }

  async validate(userName: string, password: string): Promise<any> {
    this.logger.debug(`Attempting to validate user: ${userName}`);
    
    try {
      const user = await this.authService.validateUser(userName, password);
      if (!user) {
        this.logger.warn(`Invalid credentials for user: ${userName}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      
      this.logger.debug(`User ${userName} successfully validated`);
      return user;
    } catch (error) {
      this.logger.error(`Authentication error: ${error.message}`, error.stack);
      throw error;
    }
  }
}