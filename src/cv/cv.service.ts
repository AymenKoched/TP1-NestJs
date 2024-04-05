import { Injectable , NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvEntity } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import {SearchCriteriaDto} from "./dto/search-criteria.dto";


@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CvEntity)
    private readonly cvRepo : Repository<CvEntity>
  ) {}

  async findAll():Promise<CvEntity[]> {
    return this.cvRepo.find();
  }

  async findOneById(id: string) :Promise<CvEntity> {
    const cv= await this.cvRepo.findOneBy({id});
    if (!cv){
      throw new NotFoundException(`le cv d'id ${id} n'existe pas` );
    }
    return cv;
  }

  async findAllWithPagination(page: number, limit: number): Promise<{ data: CvEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.cvRepo.findAndCount({
      skip,
      take: limit,
    });
    return { data, total };
  }

  async searchCriteria(searchQuery: SearchCriteriaDto) {
    const { query, age } = searchQuery;
    const queryBuilder = this.cvRepo
      .createQueryBuilder('cv')
      .where('cv.name LIKE :query OR cv.firstname LIKE :query OR cv.job LIKE :query', { query: `%${query}%` })
      .andWhere('cv.age = :age', { age })
      .getRawMany();

    return queryBuilder;
  }

  async create(newCv: CreateCvDto): Promise<CvEntity> {
    return await this.cvRepo.save(newCv);
  }

  async updateById(id: string, updatedCv:UpdateCvDto): Promise<CvEntity> {
    const oldCv = await this.findOneById(id);

    const  newCv = await this.cvRepo.preload({id,...updatedCv,});
    return this.cvRepo.save(newCv);
  }
 
  async softRemoveById(id: string) :Promise<CvEntity> {
    const cvToDelete=await this.findOneById(id);
    return await this.cvRepo.softRemove(cvToDelete);
  }

  async restoreById (id: number) {
    const cvs = await this.cvRepo.query(`
      SELECT *
      FROM cv
      WHERE cv.id = ${id}
    `);
    if (cvs.length === 0) throw new NotFoundException();
    return await this.cvRepo.restore(id);
  }
}
