// src/application/use-cases/auth.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { LoginDto, RefreshTokenDto, RegisterDto, TokenDto } from '../dtos/auth.dto';
import { AuthServicePort } from '../ports/auth.port';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject('AuthServicePort')
    private readonly service: AuthServicePort
  ) {}

  async login(dto: LoginDto): Promise<TokenDto> {
    return this.service.login(dto);
  }

  async register(dto: RegisterDto): Promise<TokenDto> {
    return this.service.register(dto);
  }
  
  async refreshToken(dto: RefreshTokenDto): Promise<TokenDto> {
    return this.service.refreshToken(dto);
  }

  async revokeRefreshToken(token: string): Promise<boolean> {
    return this.service.revokeRefreshToken(token);
  }
}