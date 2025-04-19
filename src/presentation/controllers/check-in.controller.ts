// src/application/controllers/check-in.controller.ts
import {Controller,Get, Post,Put,Delete,Body,Param,Query, HttpCode,HttpStatus} from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { CheckInService } from '../../application/services/check-in.service';
  import { CreateCheckInDto, UpdateCheckInDto } from '../../application/dtos/check-in.dto';
  import { QueryDto } from '../../application/common/query.dto';
  import { CheckInModel } from '../../core/domain/models/check-in.model';
  
  @ApiTags('Check Ins')
  @Controller('check-ins')
  export class CheckInController {
    constructor(private readonly checkInService: CheckInService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all check-ins' })
    @ApiResponse({ status: 200, description: 'List of check-ins' })
    async getAllCheckIns(@Query() query?: QueryDto): Promise<CheckInModel[]> {
      return this.checkInService.query(query) as Promise<CheckInModel[]>;
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific check-in by ID' })
    @ApiResponse({ status: 200, description: 'Check-in details' })
    @ApiResponse({ status: 404, description: 'Check-in not found' })
    async getCheckInById(@Param('id') id: number): Promise<CheckInModel> {
      const queryDto: QueryDto = { 
        getType: 'one', 
        filter: { id } 
      };
      return this.checkInService.query(queryDto) as Promise<CheckInModel>;
    }
  
    @Post()
    @ApiOperation({ summary: 'Create a new check-in' })
    @ApiResponse({ status: 201, description: 'Check-in created successfully' })
    @HttpCode(HttpStatus.CREATED)
    async createCheckIn(@Body() data: CreateCheckInDto): Promise<CheckInModel> {
      return this.checkInService.create(data);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update an existing check-in' })
    @ApiResponse({ status: 200, description: 'Check-in updated successfully' })
    @ApiResponse({ status: 404, description: 'Check-in not found' })
    async updateCheckIn(
      @Param('id') id: number, 
      @Body() data: UpdateCheckInDto
    ): Promise<boolean> {
      return this.checkInService.update(id, data);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a check-in' })
    @ApiResponse({ status: 200, description: 'Check-in deleted successfully' })
    @ApiResponse({ status: 404, description: 'Check-in not found' })
    @HttpCode(HttpStatus.OK)
    async deleteCheckIn(@Param('id') id: number): Promise<boolean> {
      return this.checkInService.delete(id);
    }
  }