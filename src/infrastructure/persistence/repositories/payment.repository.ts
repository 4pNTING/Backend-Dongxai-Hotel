// src/infrastructure/persistence/repositories/payment.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentModel } from '../../../core/domain/models/payment.model';
import { QueryDto } from '../../../application/common/query.dto';
import { CreatePaymentDto, UpdatePaymentDto } from '../../../application/dtos/payment.dto';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async findAll(query: QueryDto): Promise<PaymentModel[]> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');
    
    // Apply select
    if (query.select && query.select.length > 0) {
      queryBuilder.select(query.select.map(field => `payment.${field}`));
    }
    
    // Apply relations
    if (query.relations && query.relations.length > 0) {
      query.relations.forEach(relation => {
        queryBuilder.leftJoinAndSelect(`payment.${relation}`, relation);
      });
    }
    
    // Apply filters
    if (query.filter) {
      Object.keys(query.filter).forEach(key => {
        queryBuilder.andWhere(`payment.${key} = :${key}`, { [key]: query.filter[key] });
      });
    }
    
    // Apply sorting
    if (query.orderBy) {
      Object.keys(query.orderBy).forEach(key => {
        queryBuilder.addOrderBy(`payment.${key}`, query.orderBy[key]);
      });
    } else if (query.orderByField) {
      queryBuilder.orderBy(`payment.${query.orderByField}`, query.order);
    } else {
      queryBuilder.orderBy('payment.PaymentDate', 'DESC');
    }
    
    // Apply pagination
    if (query.skip !== undefined) {
      queryBuilder.skip(query.skip);
    }
    
    if (query.take !== undefined) {
      queryBuilder.take(query.take);
    }
    
    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.mapToModel(entity));
  }

  async findById(id: number, relations: string[] = []): Promise<PaymentModel | null> {
    const entity = await this.paymentRepository.findOne({
      where: { PaymentId: id },
      relations: relations
    });
    
    if (!entity) {
      return null;
    }
    
    return this.mapToModel(entity);
  }

  async findByCheckoutId(checkoutId: number): Promise<PaymentModel[]> {
    const entities = await this.paymentRepository.find({
      where: { CheckoutId: checkoutId },
      relations: ['checkOut', 'staff']
    });
    
    return entities.map(entity => this.mapToModel(entity));
  }

  async create(data: CreatePaymentDto): Promise<PaymentModel> {
    const entity = this.paymentRepository.create({
      PaymentPrice: data.PaymentPrice,
      PaymentDate: data.PaymentDate || new Date(),
      StaffId: data.StaffId,
      CheckoutId: data.CheckoutId
    });
    
    const savedEntity = await this.paymentRepository.save(entity);
    return this.mapToModel(savedEntity);
  }

  async update(id: number, data: UpdatePaymentDto): Promise<PaymentModel> {
    const entity = await this.paymentRepository.findOne({
      where: { PaymentId: id }
    });
    
    if (!entity) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    
    // Map the DTO properties to entity properties
    if (data.PaymentPrice !== undefined) entity.PaymentPrice = data.PaymentPrice;
    if (data.PaymentDate) entity.PaymentDate = data.PaymentDate;
    if (data.StaffId) entity.StaffId = data.StaffId;
    // if (data.CheckoutId) entity.CheckoutId = data.CheckoutId;
    
    const updatedEntity = await this.paymentRepository.save(entity);
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.paymentRepository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: PaymentEntity): PaymentModel {
    const model = new PaymentModel();
    model.PaymentId = entity.PaymentId;
    model.PaymentPrice = entity.PaymentPrice;
    model.PaymentDate = entity.PaymentDate;
    model.StaffId = entity.StaffId;
    model.CheckoutId = entity.CheckoutId;
    
    // Add related entities if they exist
    if (entity.checkOut) model.checkOut = entity.checkOut;
    if (entity.staff) model.staff = entity.staff;
    
    return model;
  }
}