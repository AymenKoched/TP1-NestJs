import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateSkillDto {
    @IsString()
    @IsOptional()
    designation:string;
}