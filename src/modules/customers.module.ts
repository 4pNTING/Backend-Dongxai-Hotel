import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../infrastructure/persistence/entities/customer.entity';
import { CustomerRepository } from '../infrastructure/persistence/repositories/customer.repository';
import { CustomerService } from '../application/services/customers.service';
import { CustomerUseCase } from '../application/use-cases/customer.use-case';
import { CustomerController } from '../presentation/controllers/customers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity])
  ],
  controllers: [CustomerController],
  providers: [
    CustomerRepository,
    CustomerService,
    {
      provide: 'CustomerServicePort',
      useClass: CustomerService
    },
    CustomerUseCase
  ],
  exports: [
    CustomerService, 
    CustomerUseCase,
    CustomerRepository
  ],
})
export class CustomersModule {}