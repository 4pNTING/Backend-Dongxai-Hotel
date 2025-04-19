// src/presentation/controllers/auth.controller.ts
import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto, TokenDto, RefreshTokenDto } from '../../application/dtos/auth.dto';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { METADATA_KEY } from '../../core/constants/metadata.constant';
import { Public } from '../../core/decorators/public.decorator';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';

@ApiTags(METADATA_KEY.API_TAG.AUTH)
@Controller('auth')
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return this.authUseCase.login(loginDto);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<TokenDto> {
    return this.authUseCase.register(registerDto);
  }
  
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenDto> {
    return this.authUseCase.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<boolean> {
    return this.authUseCase.revokeRefreshToken(refreshTokenDto.refreshToken);
  }
}