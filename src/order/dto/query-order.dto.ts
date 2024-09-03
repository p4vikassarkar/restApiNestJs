import { Type } from "class-transformer";
import { IsOptional, IsDate, IsString, IsEnum } from "class-validator";
import { Status } from "./create-order.dto";

export class QueryDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date) // Converts the incoming query string to a Date
    startDate?: Date;
  
    @IsOptional()
    @IsDate()
    @Type(() => Date) // Converts the incoming query string to a Date
    endDate?: Date;
  
    @IsOptional()
    @IsString()
    customerId?: string;
  
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
  }