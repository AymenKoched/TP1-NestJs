import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvEntity } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import {SearchCriteriaDto} from "./dto/search-criteria.dto";
import {UserService} from "../user/user.service";
import {UserEntity} from "../user/entities/user.entity";
import {UserRoleEnum} from "../enums/user-role.enum";
import {SkillEntity} from "../skill/entities/skill.entity";


@Injectable()
export class CvService {
  constructor(
    @InjectRepository(CvEntity)
    private readonly cvRepo : Repository<CvEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepo: Repository<SkillEntity>,
    private readonly userService: UserService,
  ) {}

  async findAll(user: Partial<UserEntity>):Promise<CvEntity[]> {
    if(user.role === UserRoleEnum.ADMIN) return await this.cvRepo.find();
    else if (user.role === UserRoleEnum.USER)
      return await this.cvRepo.find({
        where: {user: {id: user.id }}
      });
  }

  async findOneById(id: string, user: Partial<UserEntity>) :Promise<CvEntity> {
    const cv= await this.cvRepo.findOneBy({id});
    if (!cv) throw new NotFoundException(`le cv d'id ${id} n'existe pas` );

    if(this.userService.isOwnerOrAdmin(cv, user)) return cv;
    else throw new UnauthorizedException();

  }

  async findAllWithPagination(page: number, limit: number )
    : Promise<{ data: CvEntity[]; total: number }>
  {
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

  async create(newCv: CreateCvDto, user, skillIds: string[]): Promise<CvEntity> {
    const cv = this.cvRepo.create(newCv);
    cv.user = user;
    const skills = [];
    if (Array.isArray(skillIds)) {
      await Promise.all(skillIds.map(async (id) => {
        const skill = await this.skillRepo.findOneBy({ id: id });
        skills.push(skill);
      }));
    }
    cv.cvSkills = skills;
    return await this.cvRepo.save(cv);
  }

  async updateById(id: string, updatedCv:UpdateCvDto, user: Partial<UserEntity>): Promise<CvEntity> {
    const oldCv = await this.findOneById(id, user);

    const  newCv = await this.cvRepo.preload({id,...updatedCv,});
    return this.cvRepo.save(newCv);
  }
 
  async softRemoveById(id: string,  user: Partial<UserEntity>) :Promise<CvEntity> {
    const cvToDelete=await this.findOneById(id, user);
    return await this.cvRepo.softRemove(cvToDelete);
  }

  async restoreById (id: number, user: Partial<UserEntity>) {
    const cvs = await this.cvRepo.query(`
      SELECT *
      FROM cv
      LEFT JOIN [user] ON cv.userId = [user].id
      WHERE cv.id = ${id}
    `);
    if (cvs.length === 0) throw new NotFoundException();

    if(user.role === UserRoleEnum.ADMIN || (cvs[0].userId === user.id)) return await this.cvRepo.restore(id);
    else throw new UnauthorizedException();
  }

  async updateFilePath(id: string, Filepath: string  ,user: Partial<UserEntity>){
    const cv = await this.findOneById(id, user);
    if (!cv) throw new NotFoundException(`le cv d'id ${id} n'existe pas`);
    cv.path = Filepath;
    console.log('File added/updated successfully !')
    await this.cvRepo.save(cv);
  }
}
