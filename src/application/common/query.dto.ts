// src/application/common/query.dto.ts
import { IsArray, IsEnum, IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type QueryGetType = 'one' | 'many';

export class QueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  take?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: OrderBy, default: OrderBy.ASC })
  @IsOptional()
  @IsEnum(OrderBy)
  order?: OrderBy = OrderBy.ASC;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orderByField?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  select?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relations?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  filter?: Record<string, any>;

  @ApiProperty({
    required: false,
    enum: ['one', 'many'],
    default: 'many'
  })
  @IsOptional()
  @IsEnum(['one', 'many'] as const)
  getType?: QueryGetType = 'many';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  orderBy?: Record<string, 'ASC' | 'DESC'>;
}