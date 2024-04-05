import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SearchCriteriaDto {
  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  age: number;
}
