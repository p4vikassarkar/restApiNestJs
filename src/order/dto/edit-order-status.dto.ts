import {
    IsEnum,
    IsNotEmpty,
  } from 'class-validator';

  export enum Status {
    CREATED = "created",
    IN_PROGRESS = "in_progress",
    FULFILLED = "fulfilled",
    CANCELLED = "cancelled",
  }
    
  export class EditOrderStatusDto {
  
    @IsNotEmpty()
    @IsEnum(Status)
    readonly status: Status;
  
  }
  