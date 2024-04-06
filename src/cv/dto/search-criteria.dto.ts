import { IsOptional, IsString, IsNumber } from 'class-validator';
import {Type} from "class-transformer";

export class SearchCriteriaDto {
  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age: number;
}
