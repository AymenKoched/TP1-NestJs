import { Injectable , NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillEntity } from  './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillService {
constructor(@InjectRepository(SkillEntity)
  private skillRepository : Repository<SkillEntity> ){}
  
  async create(newSkill: CreateSkillDto):Promise<SkillEntity> {
    return await this.skillRepository.save(newSkill);;
  }

  async findAll():Promise<SkillEntity[]> {
    return this.skillRepository.find();
  }
  
  async findOne(id: string) :Promise<SkillEntity> {
    const skill=await this.skillRepository.findOne({where: {id}});
    if (!skill){
      throw new NotFoundException(`le skill d'id ${id} n'existe pas` );
   }
   return skill;
  }
  async update(id: string, updatedskill:UpdateSkillDto): Promise<SkillEntity> {
    const  newSkill = await this.skillRepository.preload({id,...updatedskill,});
    if (newSkill) {
      return this.skillRepository.save(newSkill);
    } else {
      throw new NotFoundException('skill innexistant');
    }
}
 
  async remove(id: string) {
    const skillToDelete=await this.skillRepository.findOne({where:{id}});
    if(!skillToDelete){
        throw new NotFoundException("Le skill d'id ${id} n'existe pas");
    }

        return await this.skillRepository.remove(skillToDelete);
}
}