import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillEntity } from './entities/skill.entity';
import {CvEntity} from "../cv/entities/cv.entity";

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService){}

  @Get()
  async findAll():Promise<SkillEntity[]> {
    return this.skillService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string):Promise<SkillEntity> {
    return this.skillService.findOneById(id);
  }


  @Post()
  async create(@Body() createSkillDto: CreateSkillDto):Promise<SkillEntity> {
    return this.skillService.create(createSkillDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto
  ): Promise<SkillEntity> {
    return this.skillService.updateById(id, updateSkillDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string
  ):Promise<SkillEntity> {
    return this.skillService.softRemoveById(id);
  }

  @Get('restore/:id')
  async restoreCv(
    @Param('id') id: number,
  ) {
    return this.skillService.restoreById(id);
  }
}