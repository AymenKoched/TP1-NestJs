import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateSkillDto {
    @IsOptional()
    @IsString()
    designation:string;
}