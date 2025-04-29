// src/infrastructure/mappers/room.mapper.ts
import { RoomEntity } from '../persistence/entities/room.entity';
import { RoomModel } from '../../core/domain/models/room.model';
import { CreateRoomDto, UpdateRoomDto, RoomResponseDto } from '../../application/dtos/room.dto';

export class RoomMapper {
  /**
   * แปลง RoomEntity เป็น RoomModel
   */
  static toModel(entity: RoomEntity): RoomModel {
    if (!entity) return null;
    
    const model = new RoomModel();
    model.RoomId = entity.RoomId;
    model.TypeId = entity.TypeId;
    model.StatusId = entity.StatusId;
    model.RoomPrice = entity.RoomPrice;
    
    // Map related entities if available
    if (entity.roomType) {
      model.roomType = {
        TypeId: entity.roomType.TypeId,
        TypeName: entity.roomType.TypeName
      };
    }
    
    if (entity.roomStatus) {
      model.roomStatus = {
        StatusId: entity.roomStatus.StatusId,
        StatusName: entity.roomStatus.StatusName
      };
    }
    
    // Copy related entities if they exist
    if (entity.bookings) model.bookings = entity.bookings;
    if (entity.checkIns) model.checkIns = entity.checkIns;
    if (entity.checkOuts) model.checkOuts = entity.checkOuts;
    
    return model;
  }

  /**
   * แปลง RoomModel เป็น RoomResponseDto
   */
  static toResponseDto(model: RoomModel): RoomResponseDto {
    if (!model) return null;
    
    const responseDto = new RoomResponseDto();
    responseDto.RoomId = model.RoomId;
    responseDto.TypeId = model.TypeId;
    responseDto.StatusId = model.StatusId;
    responseDto.RoomPrice = model.RoomPrice;
    
    // Map related data if available
    if (model.roomType) {
      responseDto.roomType = {
        TypeId: model.roomType.TypeId,
        TypeName: model.roomType.TypeName
      };
    }
    
    if (model.roomStatus) {
      responseDto.roomStatus = {
        StatusId: model.roomStatus.StatusId,
        StatusName: model.roomStatus.StatusName
      };
    }
    
    return responseDto;
  }

  /**
   * แปลง CreateRoomDto เป็น RoomEntity
   */
  static toEntity(dto: CreateRoomDto): Partial<RoomEntity> {
    if (!dto) return null;
    
    return {
      TypeId: dto.TypeId,
      StatusId: dto.StatusId,
      RoomPrice: dto.RoomPrice
    };
  }

  /**
   * แปลงรายการของ RoomEntity เป็นรายการของ RoomModel
   */
  static toModelList(entities: RoomEntity[]): RoomModel[] {
    if (!entities) return [];
    return entities.map(entity => this.toModel(entity));
  }

  /**
   * แปลงรายการของ RoomModel เป็นรายการของ RoomResponseDto
   */
  static toResponseDtoList(models: RoomModel[]): RoomResponseDto[] {
    if (!models) return [];
    return models.map(model => this.toResponseDto(model));
  }

  /**
   * อัปเดต RoomEntity จากข้อมูล UpdateRoomDto
   */
  static updateEntity(entity: RoomEntity, dto: UpdateRoomDto): void {
    if (!entity || !dto) return;
    
    if (dto.TypeId !== undefined) entity.TypeId = dto.TypeId;
    if (dto.StatusId !== undefined) entity.StatusId = dto.StatusId;
    if (dto.RoomPrice !== undefined) entity.RoomPrice = dto.RoomPrice;
  }
}