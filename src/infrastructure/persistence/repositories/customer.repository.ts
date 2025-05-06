import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerModel } from '@core/domain/models/customer.model';
import { CreateCustomerDto, UpdateCustomerDto } from '@application/dtos/customer.dto';
import { QueryDto } from '@application/common/query.dto';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>
  ) {}

  async findAll(query?: QueryDto): Promise<CustomerModel[]> {
    const entities = await this.repository.find();
    return entities.map(this.mapToModel);
  }


  async findById(id: number): Promise<CustomerModel | null> {
    const entity = await this.repository.findOne({ where: {  CustomerId: id  } });
    return entity ? this.mapToModel(entity) : null;
  }

  async create(dto: CreateCustomerDto): Promise<CustomerModel> {
    const entity = this.repository.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const savedEntity = await this.repository.save(entity);
    return this.mapToModel(savedEntity);
  }

  // เพิ่มเมธอดนี้ในไฟล์ CustomerRepository
  async findByUsername(username: string, includePassword: boolean = false): Promise<CustomerModel | null> {
    const queryBuilder = this.repository
      .createQueryBuilder('customer')
      .where('customer.userName = :username', { username });
    
    if (includePassword) {
      queryBuilder.addSelect('customer.password');
    }
    
    const entity = await queryBuilder.getOne();
    return entity ? this.mapToModel(entity) : null;
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<CustomerModel> {
    await this.repository.update(id, {
      ...dto,
      updatedAt: new Date(),
    });
    
    const updatedEntity = await this.repository.findOne({ where: { CustomerId: id } });

    if (!updatedEntity) {
      throw new Error(`Customer with id ${id} not found`);
    }
    
    return this.mapToModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  private mapToModel(entity: CustomerEntity): CustomerModel {
    // แยกชื่อและนามสกุลจาก CustomerName
    const nameParts = entity.CustomerName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  
    const model = new CustomerModel();
    model.id = entity.CustomerId;
    model.CustomerId = entity.CustomerId;
    model.firstName = firstName;
    model.lastName = lastName;
    model.gender = entity.CustomerGender;
    model.phoneNumber = entity.CustomerTel.toString();
    model.address = entity.CustomerAddress;
    model.postcode = entity.CustomerPostcode;
    model.userName = entity.userName;
    model.password = entity.password;
    model.roleId = entity.roleId || 2; // ค่าเริ่มต้นเป็น 2 สำหรับ customer
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
  
    return model;
  }
  
}