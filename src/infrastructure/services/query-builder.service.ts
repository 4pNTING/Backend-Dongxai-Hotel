// src/infrastructure/services/query-builder.service.ts
import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { QueryDto } from '../../application/common/query.dto';

@Injectable()
export class QueryBuilderService {
  
  /**
   * Apply basic query parameters to TypeORM QueryBuilder
   */
  applyBasicQuery<T>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryDto,
    entityAlias: string
  ): SelectQueryBuilder<T> {
    
    // Apply relations
    if (query.relations && query.relations.length > 0) {
      this.applyRelations(queryBuilder, query.relations, entityAlias);
    }
    
    // Apply basic filters
    if (query.filter) {
      this.applyBasicFilters(queryBuilder, query.filter, entityAlias);
    }
    
    // Apply search
    if (query.search) {
      this.applySearchFilter(queryBuilder, query.search, entityAlias);
    }
    
    // Apply sorting
    this.applyBasicSorting(queryBuilder, query, entityAlias);
    
    // Apply pagination
    this.applyBasicPagination(queryBuilder, query);
    
    return queryBuilder;
  }

  /**
   * Apply relations to query builder
   */
  private applyRelations<T>(
    queryBuilder: SelectQueryBuilder<T>,
    relations: string[],
    entityAlias: string
  ): void {
    const validRelations = this.getValidRelations();
    
    relations.forEach(relation => {
      try {
        if (relation.includes('.')) {
          // Handle nested relations like 'room.roomType'
          this.applyNestedRelation(queryBuilder, relation, entityAlias, validRelations);
        } else {
          // Handle simple relations like 'room', 'customer'
          if (validRelations.includes(relation)) {
            queryBuilder.leftJoinAndSelect(`${entityAlias}.${relation}`, relation);
            
            // Add common nested relations automatically
            this.addCommonNestedRelations(queryBuilder, relation);
          }
        }
      } catch (error) {
        console.warn(`Failed to join relation: ${relation}`, error.message);
        // Continue with other relations instead of failing
      }
    });
  }

  /**
   * Apply nested relation
   */
  private applyNestedRelation<T>(
    queryBuilder: SelectQueryBuilder<T>,
    relation: string,
    entityAlias: string,
    validRelations: string[]
  ): void {
    const parts = relation.split('.');
    const parentRelation = parts[0];
    const childRelation = parts[1];
    
    if (validRelations.includes(parentRelation)) {
      // First ensure parent relation is joined
      queryBuilder.leftJoinAndSelect(`${entityAlias}.${parentRelation}`, parentRelation);
      
      // Then join the child relation
      queryBuilder.leftJoinAndSelect(`${parentRelation}.${childRelation}`, `${parentRelation}_${childRelation}`);
    }
  }

  /**
   * Add common nested relations automatically
   */
  private addCommonNestedRelations<T>(
    queryBuilder: SelectQueryBuilder<T>,
    parentRelation: string
  ): void {
    const nestedRelationsMap = {
      'room': ['roomType', 'roomStatus'],
      'booking': ['BookingStatus'],
      'staff': ['role'],
      'customer': [], // No common nested relations for customer
    };

    const nestedRelations = nestedRelationsMap[parentRelation];
    if (nestedRelations) {
      nestedRelations.forEach(nested => {
        try {
          queryBuilder.leftJoinAndSelect(`${parentRelation}.${nested}`, `${parentRelation}_${nested}`);
        } catch (error) {
          // Silently continue if nested relation doesn't exist
          console.debug(`Nested relation ${parentRelation}.${nested} not found`);
        }
      });
    }
  }

  /**
   * Get valid relations based on common entity patterns
   */
  private getValidRelations(): string[] {
    return [
      'room', 'customer', 'staff', 'booking', 'checkIns', 'checkOuts', 
      'cancellations', 'payments', 'roomType', 'roomStatus', 'BookingStatus', 'role'
    ];
  }

  /**
   * Apply basic filters
   */
  private applyBasicFilters<T>(
    queryBuilder: SelectQueryBuilder<T>,
    filter: Record<string, any>,
    entityAlias: string
  ): void {
    Object.keys(filter).forEach((key, index) => {
      const value = filter[key];
      
      if (value !== null && value !== undefined) {
        const paramKey = `filter_${key}_${index}`;
        
        // Handle different filter types
        if (key.endsWith('_start') || key.endsWith('_end')) {
          // Date range filters
          const fieldName = key.replace(/_start|_end$/, '');
          const operator = key.endsWith('_start') ? '>=' : '<=';
          queryBuilder.andWhere(`${entityAlias}.${fieldName} ${operator} :${paramKey}`, {
            [paramKey]: value
          });
        } else if (Array.isArray(value)) {
          // Array filters (IN clause)
          queryBuilder.andWhere(`${entityAlias}.${key} IN (:...${paramKey})`, {
            [paramKey]: value
          });
        } else {
          // Simple equality filter
          queryBuilder.andWhere(`${entityAlias}.${key} = :${paramKey}`, {
            [paramKey]: value
          });
        }
      }
    });
  }

  /**
   * Apply search filter
   */
  private applySearchFilter<T>(
    queryBuilder: SelectQueryBuilder<T>,
    search: string,
    entityAlias: string
  ): void {
    const searchFields = this.getSearchableFields(entityAlias);
    
    if (searchFields.length > 0) {
      const searchConditions = searchFields.map(field => 
        `LOWER(${field}) LIKE LOWER(:searchTerm)`
      ).join(' OR ');
      
      queryBuilder.andWhere(`(${searchConditions})`, {
        searchTerm: `%${search}%`
      });
    }
  }

  /**
   * Get searchable fields based on entity alias
   */
  private getSearchableFields(entityAlias: string): string[] {
    const fieldMaps = {
      'booking': [
        `${entityAlias}.BookingId::text`,
        'COALESCE(customer.CustomerName, \'\')',
        'COALESCE(room.RoomNumber, \'\')'
      ],
      'checkIn': [
        `${entityAlias}.CheckInId::text`,
        'COALESCE(customer.CustomerName, \'\')',
        'COALESCE(room.RoomNumber, \'\')'
      ],
      'checkOut': [
        `${entityAlias}.CheckoutId::text`,
        'COALESCE(room.RoomNumber, \'\')'
      ],
      'payment': [
        `${entityAlias}.PaymentId::text`,
        `${entityAlias}.PaymentPrice::text`
      ]
    };

    return fieldMaps[entityAlias] || [`${entityAlias}.id::text`];
  }

  /**
   * Apply basic sorting
   */
  private applyBasicSorting<T>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryDto,
    entityAlias: string
  ): void {
    if (query.orderBy && typeof query.orderBy === 'object') {
      // Multiple field sorting
      Object.keys(query.orderBy).forEach(key => {
        const order = query.orderBy[key] || 'ASC';
        queryBuilder.addOrderBy(`${entityAlias}.${key}`, order);
      });
    } else if (query.orderByField) {
      // Single field sorting
      const order = query.order || 'ASC';
      queryBuilder.orderBy(`${entityAlias}.${query.orderByField}`, order);
    }
    // No default sorting - let the repository handle it
  }

  /**
   * Apply basic pagination
   */
  private applyBasicPagination<T>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryDto
  ): void {
    if (query.skip !== undefined && query.skip > 0) {
      queryBuilder.skip(query.skip);
    }
    
    if (query.take !== undefined && query.take > 0) {
      queryBuilder.take(Math.min(query.take, 1000)); // Limit max results
    }
  }

  /**
   * Create status query helper
   */
  createStatusQuery(statusId: number, relations: string[] = []): QueryDto {
    return {
      filter: { StatusId: statusId },
      relations: relations,
      getType: 'many'
    };
  }

  /**
   * Create query with relations helper
   */
  createQueryWithRelations(relations: string[], orderBy?: Record<string, 'ASC' | 'DESC'>): QueryDto {
    return {
      relations: relations,
      orderBy: orderBy,
      getType: 'many'
    };
  }

  /**
   * Merge multiple QueryDto objects
   */
  mergeFilters(baseQuery: QueryDto, customQuery: QueryDto): QueryDto {
    return {
      ...baseQuery,
      ...customQuery,
      filter: {
        ...baseQuery.filter,
        ...customQuery.filter
      },
      relations: [
        ...(baseQuery.relations || []),
        ...(customQuery.relations || [])
      ].filter((value, index, self) => self.indexOf(value) === index), // Remove duplicates
      orderBy: {
        ...baseQuery.orderBy,
        ...customQuery.orderBy
      }
    };
  }

  /**
   * Build date range filter
   */
  buildDateRangeFilter(
    startDate: Date | string,
    endDate: Date | string,
    fieldName: string = 'CreatedAt'
  ): Record<string, any> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set start to beginning of day
    start.setHours(0, 0, 0, 0);
    // Set end to end of day
    end.setHours(23, 59, 59, 999);
    
    return {
      [`${fieldName}_start`]: start,
      [`${fieldName}_end`]: end
    };
  }

  /**
   * Build status filter
   */
  buildStatusFilter(statusIds: number | number[]): Record<string, any> {
    if (Array.isArray(statusIds)) {
      return { StatusId: statusIds };
    }
    
    return { StatusId: statusIds };
  }

  /**
   * Build customer filter
   */
  buildCustomerFilter(customerId: number): Record<string, any> {
    return { CustomerId: customerId };
  }

  /**
   * Build room filter
   */
  buildRoomFilter(roomId: number): Record<string, any> {
    return { RoomId: roomId };
  }

  /**
   * Build staff filter
   */
  buildStaffFilter(staffId: number): Record<string, any> {
    return { StaffId: staffId };
  }

  /**
   * Validate and sanitize query
   */
  sanitizeQuery(query: QueryDto): QueryDto {
    return {
      ...query,
      take: query.take ? Math.min(Math.max(query.take, 1), 1000) : undefined,
      skip: query.skip ? Math.max(query.skip, 0) : undefined,
      relations: query.relations ? 
        query.relations.filter(rel => rel && typeof rel === 'string') : 
        undefined
    };
  }
}