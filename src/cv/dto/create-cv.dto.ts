import {IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";
import {Type} from "class-transformer";
import {SkillEntity} from "../../skill/entities/skill.entity";

export class CreateCvDto {
    @IsNotEmpty()
    @IsString()
    name:string;
   
    @IsNotEmpty()
    @IsString()
    firstname:string;

    @IsNotEmpty()
    @Type(() => Number )
    @IsNumber()
    @Min(15)
    @Max(65)
    age: number;
    
    @IsOptional()
    @IsString()
    path:string;
    
    @IsNotEmpty()
    @IsString()
    job:string;

    @IsNotEmpty()
    @Type(() => Number )
    @IsNumber()
    cin: number;
}