import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCvDto {
    @IsNotEmpty()
    @IsString()
    name:string;
   
    @IsNotEmpty()
    @IsString()
    firstname:string;
    
    @IsNotEmpty()
    @IsNumber()
    age:number;
    
    @IsOptional()
    @IsString()
    path:string;
    
    @IsNotEmpty()
    @IsString()
    job:string;
    
    @IsNotEmpty()
    @IsNumber()
    cin:number;
}