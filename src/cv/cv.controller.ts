import {Controller, Post, Get, Patch, Delete, Body, Param} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { CvEntity } from './entities/cv.entity';
import { UpdateCvDto } from './dto/update-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService){}

  @Get()
  async findAll() : Promise<CvEntity[]> {
    return this.cvService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) : Promise<CvEntity> {
    return this.cvService.findOneById(id);
  }


  @Post()
  async create(
    @Body() CreateCvDto : CreateCvDto
  ) : Promise<CvEntity> {
    return this.cvService.create(CreateCvDto);
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCvDto : UpdateCvDto
  ) : Promise<CvEntity> {
      return this.cvService.updateById(id,updateCvDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string
  ):Promise<CvEntity> {
    return this.cvService.softRemoveById(id);
  }

  @Get('restore/:id')
  async restoreCv(
    @Param('id') id: number,
  ) {
    return this.cvService.restoreById(id);
  }
}
