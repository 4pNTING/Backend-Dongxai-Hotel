// src/presentation/controllers/payment.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto, UpdatePaymentDto } from '../../application/dtos/payment.dto';
import { QueryDto } from '../../application/common/query.dto';
import { PaymentUseCase } from '../../application/use-cases/payment.use-case';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { METADATA_KEY } from '../../core/constants/metadata.constant';

@ApiTags(METADATA_KEY.API_TAG.PAYMENT)
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(
    private readonly paymentUseCase: PaymentUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Return all payments' })
  async findAll(@Query() query: QueryDto) {
    return this.paymentUseCase.query({ ...query, getType: 'many' });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by id' })
  @ApiResponse({ status: 200, description: 'Return the payment' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(@Param('id') id: string) {
    return this.paymentUseCase.query({ 
      filter: { id }, 
      getType: 'one' 
    });
  }

  // @Get('checkout/:checkoutId')
  // @ApiOperation({ summary: 'Get payments by checkout ID' })
  // @ApiResponse({ status: 200, description: 'Return payments for the checkout' })
  // async getPaymentsByCheckout(@Param('checkoutId') checkoutId: string) {
  //   return this.paymentUseCase.getPaymentsByCheckout(checkoutId);
  // }

  // @Get('checkout/:checkoutId/total')
  // @ApiOperation({ summary: 'Calculate total payment amount for a checkout' })
  // @ApiResponse({ status: 200, description: 'Return the total payment amount' })
  // async calculateTotal(@Param('checkoutId') checkoutId: string) {
  //   const total = await this.paymentUseCase.calculateTotal(checkoutId);
  //   return { total };
  // }

  @Post()
  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 201, description: 'The payment has been successfully created' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentUseCase.create(createPaymentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update payment' })
  @ApiResponse({ status: 200, description: 'The payment has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async update(@Param('id') id: number, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentUseCase.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({ status: 200, description: 'The payment has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.paymentUseCase.delete(id);
  }
}