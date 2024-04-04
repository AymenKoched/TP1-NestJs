import { Injectable , NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillEntity } from  './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>
  ){}
  
  async findAll():Promise<SkillEntity[]> {
    return this.skillRepository.find();
  }
  
  async findOneById(id: string) :Promise<SkillEntity> {
    const skill= await this.skillRepository.findOne({where: {id}});
    if (!skill){
      throw new NotFoundException(`le skill d'id ${id} n'existe pas` );
    }
    return skill;
  }

  async create(newSkill: CreateSkillDto):Promise<SkillEntity> {
    return await this.skillRepository.save(newSkill);
  }

  async updateById(id: string, updatedSkill:UpdateSkillDto): Promise<SkillEntity> {
    const oldSkill = await this.findOneById(id);

    const  newSkill = await this.skillRepository.preload({id,...updatedSkill,});
    return this.skillRepository.save(newSkill);
}
 
  async softRemoveById(id: string): Promise<SkillEntity> {
    const oldSkill = await this.findOneById(id);
    return await this.skillRepository.remove(oldSkill);
  }

  async restoreById (id: number) {
    const skills = await this.skillRepository.query(`
      SELECT *
      FROM skill
      WHERE skill.id = ${id}
    `);
    if (skills.length === 0) throw new NotFoundException();
    return await this.skillRepository.restore(id);
  }
}