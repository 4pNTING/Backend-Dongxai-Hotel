// src/presentation/controllers/customer.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto, UpdateCustomerDto } from '../../application/dtos/customer.dto';
import { QueryDto } from '../../application/common/query.dto';
import { CustomerUseCase } from '../../application/use-cases/customer.use-case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';

@ApiTags(METADATA_KEY.API_TAG.CUSTOMER)
@Controller('customers')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class CustomerController {
  constructor(
    private readonly customerUseCase: CustomerUseCase
  ) {}

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.customerUseCase.query({ ...query, getType: 'many' });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.customerUseCase.query({ 
      filter: { id }, 
      getType: 'one' 
    });
  }

  @Post('query')
async queryCustomers(@Body() query: QueryDto) {
  return this.customerUseCase.query(query);
}


  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerUseCase.create(createCustomerDto);
  }

  @Put(':id')
  async update(@Param('id',) id: number, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerUseCase.update(id, updateCustomerDto);
  }
  
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.customerUseCase.delete(id);
  }
}