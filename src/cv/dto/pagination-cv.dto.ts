import { IsInt, Min } from 'class-validator';
import {Type} from "class-transformer";

export class PaginationDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number;
}