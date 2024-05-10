import {Controller, Post, Get, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards, UseInterceptors} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { CvEntity } from './entities/cv.entity';
import { UpdateCvDto } from './dto/update-cv.dto';
import {SearchCriteriaDto} from "./dto/search-criteria.dto";
import {PaginationDto} from "./dto/pagination-cv.dto";
import {JwtAuthGuard} from "../user/guards/jwt-auth.guard";
import {User} from "../decorators/user/user.decorator";
import {UserEntity} from "../user/entities/user.entity";
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CV_EVENTS } from './cv-events.config';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService ,
    private eventEmitter: EventEmitter2
  ){}

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

  @Get('criteria')
  async findByCriteria(
    @Query() searchQuery: SearchCriteriaDto,
  ) : Promise<CvEntity[]> {
    return this.cvService.searchCriteria(searchQuery);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param('id') id: string,
    @User() user: Partial<UserEntity>,
  ) : Promise<CvEntity> {
    return this.cvService.findOneById(id, user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() CreateCvDto : CreateCvDto,
    @User() user: Partial<UserEntity>,
    @Query('skillIds') skillIds: string,
  ) : Promise<CvEntity> {
    const skillIdsArray = skillIds.split(',');
    const cv = await this.cvService.create(CreateCvDto, user, skillIdsArray);
    this.eventEmitter.emit(CV_EVENTS.add, { cv , user});
    return cv ; 
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCvDto : UpdateCvDto,
    @User() user: Partial<UserEntity>,
  )  {
      const cv = await this.cvService.updateById(id,updateCvDto, user);
      this.eventEmitter.emit(CV_EVENTS.update, {cv,user});
      return cv ;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @User() user: Partial<UserEntity>,
  ):Promise<CvEntity> {
    const cv = this.cvService.softRemoveById(id, user); ;
    this.eventEmitter.emit(CV_EVENTS.delete, {cv,user});
    return cv ;
  }

  @Get('restore/:id')
  @UseGuards(JwtAuthGuard)
  async restoreCv(
    @Param('id') id: number,
    @User() user: Partial<UserEntity>,
  ) {
    return this.cvService.restoreById(id, user);
  }
  @Post('upload/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/png'
        ) {
          cb(null, true);
        } else {
          cb(new Error('Only JPEG, JPG and PNG files are allowed'), false);
        }
      },
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file,
    @User() user: Partial<UserEntity>,
  ): Promise<string> {
    await this.cvService.updateFilePath(id, file.path , user);
    return file.path;
  }
}
