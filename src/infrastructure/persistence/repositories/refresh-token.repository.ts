// src/infrastructure/persistence/repositories/refresh-token.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: Repository<RefreshTokenEntity>,
  ) {}

  async createRefreshToken(staffId: number, token: string, expiresIn: number): Promise<RefreshTokenEntity> {
    const refreshToken = new RefreshTokenEntity();
    refreshToken.staffId = staffId;
    refreshToken.token = token;
    refreshToken.expiresAt = new Date(Date.now() + expiresIn * 1000);
    
    return this.repository.save(refreshToken);
  }

  async findByToken(token: string): Promise<RefreshTokenEntity | null> {
    return this.repository.findOne({
      where: { token, isRevoked: false },
      relations: ['staff'],
    });
  }

  async revokeToken(id: number): Promise<void> {
    await this.repository.update(id, { isRevoked: true });
  }

  async revokeAllUserTokens(staffId: number): Promise<void> {
    await this.repository.update(
      { staffId, isRevoked: false },
      { isRevoked: true }
    );
  }

  async deleteExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.repository.delete({ 
      expiresAt: LessThan(now)
    });
  }
}