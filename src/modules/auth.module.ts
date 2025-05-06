// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../application/services/auth.service';
import { AuthUseCase } from '../application/use-cases/auth.use-case';
import { AuthController } from '../presentation/controllers/auth.controller';
import { JwtStrategy } from '../infrastructure/config/jwt.strategy';
import { LocalStrategy } from '../infrastructure/security/strategies/local.strategy';
import { StaffModule } from './staff.module';
import { CustomersModule } from './customers.module'; // เพิ่มการ import CustomersModule
import { RefreshTokenEntity } from '../infrastructure/persistence/entities/refresh-token.entity';
import { RefreshTokenRepository } from '../infrastructure/persistence/repositories/refresh-token.repository';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'secretKey'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    StaffModule,
    CustomersModule, // เพิ่ม CustomersModule ที่นี่
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenRepository,
    {
      provide: 'AuthServicePort',
      useClass: AuthService
    },
    AuthUseCase,
    LocalStrategy,
    JwtStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}