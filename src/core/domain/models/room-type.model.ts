// src/core/domain/models/room-type.model.ts
export class RoomTypeModel {
    TypeId: number;
    TypeName: string;
  
    constructor(params?: Partial<RoomTypeModel>) {
      if (params) {
        Object.assign(this, params);
      }
    }
  }