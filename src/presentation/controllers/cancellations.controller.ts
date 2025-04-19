// src/application/controllers/cancellation.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCancellationDto, UpdateCancellationDto } from '../../application/dtos/cancellation.dto';
import { QueryDto } from '../../application/common/query.dto';
import { CancellationUseCase } from '../../application/use-cases/Cancellation-use.case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';

@ApiTags(METADATA_KEY.API_TAG.CANCELLATION)
@Controller('cancellations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CancellationController {
  constructor(private readonly cancellationUseCase: CancellationUseCase) {}

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.cancellationUseCase.query({ ...query, getType: 'many' });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.cancellationUseCase.query({ 
      filter: { id }, 
      getType: 'one' 
    });
  }

  @Post()
  async create(@Body() createCancellationDto: CreateCancellationDto) {
    return this.cancellationUseCase.create(createCancellationDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCancellationDto: UpdateCancellationDto) {
    return this.cancellationUseCase.update(id, updateCancellationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.cancellationUseCase.delete(id);
  }
}