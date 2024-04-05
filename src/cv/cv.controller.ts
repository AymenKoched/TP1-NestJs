import {Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { CvEntity } from './entities/cv.entity';
import { UpdateCvDto } from './dto/update-cv.dto';
import {SearchCriteriaDto} from "./dto/search-criteria.dto";
import {PaginationDto} from "./dto/pagination-cv.dto";
import {JwtAuthGuard} from "../user/guards/jwt-auth.guard";
import {User} from "../decorators/user/user.decorator";
import {UserEntity} from "../user/entities/user.entity";

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService){}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @User() user: Partial<UserEntity>,
  ) : Promise<CvEntity[]> {
    return this.cvService.findAll(user);
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
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param('id') id: string,
    @User() user: Partial<UserEntity>,
  ) : Promise<CvEntity> {
    return this.cvService.findOneById(id, user);
  }

  @Get('criteria')
  async findByCriteria(
    @Query() searchQuery: SearchCriteriaDto,
  ) : Promise<CvEntity[]> {
    return this.cvService.searchCriteria(searchQuery);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() CreateCvDto : CreateCvDto,
    @User() user: Partial<UserEntity>,
  ) : Promise<CvEntity> {
    return this.cvService.create(CreateCvDto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCvDto : UpdateCvDto,
  @User() user: Partial<UserEntity>,
  ) : Promise<CvEntity> {
      return this.cvService.updateById(id,updateCvDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @User() user: Partial<UserEntity>,
  ):Promise<CvEntity> {
    return this.cvService.softRemoveById(id, user);
  }

  @Get('restore/:id')
  @UseGuards(JwtAuthGuard)
  async restoreCv(
    @Param('id') id: number,
    @User() user: Partial<UserEntity>,
  ) {
    return this.cvService.restoreById(id, user);
  }
}
