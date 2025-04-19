// src/application/ports/auth.port.ts
import { LoginDto, RefreshTokenDto, RegisterDto, TokenDto } from '../dtos/auth.dto';

export interface AuthServicePort {
  login(dto: LoginDto): Promise<TokenDto>;
  validateUser(userName: string, password: string): Promise<any>;
  register(dto: RegisterDto): Promise<TokenDto>;
  refreshToken(dto: RefreshTokenDto): Promise<TokenDto>;
  revokeRefreshToken(token: string): Promise<boolean>;
}