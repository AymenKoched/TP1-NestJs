import {Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { CvEntity } from './entities/cv.entity';
import { UpdateCvDto } from './dto/update-cv.dto';
import {SearchCriteriaDto} from "./dto/search-criteria.dto";
import {PaginationDto} from "./dto/pagination-cv.dto";

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService){}

  @Get()
  async findAll() : Promise<CvEntity[]> {
    return this.cvService.findAll();
  }

  @Get('pagination')
  async findAllPagination(
    @Query() paginationParams: PaginationDto,
  ) :  Promise<{ data: CvEntity[]; total: number }> {
    const { page, limit } = paginationParams;
    const { data, total } = await this.cvService.findAllWithPagination(page, limit);
    return { data, total };
  }


  @Get(':id')
  async findById(@Param('id') id: string) : Promise<CvEntity> {
    return this.cvService.findOneById(id);
  }

  @Get('criteria')
  async findByCriteria(@Query() searchQuery: SearchCriteriaDto) : Promise<CvEntity[]> {
    return this.cvService.searchCriteria(searchQuery);
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
