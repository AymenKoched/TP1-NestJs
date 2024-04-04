import { Injectable , NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvEntity } from './entities/cv.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';


@Injectable()
export class CvService {
constructor(@InjectRepository(CvEntity)
    private cvRepo : Repository<CvEntity> 
) {}
async create(newCv: CreateCvDto) {
    return await this.cvRepo.save(newCv);;
  }

  async findAll():Promise<CvEntity[]> {
    return this.cvRepo.find();
  }
  
  async findOne(id: string) :Promise<CvEntity> {
    const cv=await this.cvRepo.findOne({where: {id}});
    if (!cv){
      throw new NotFoundException(`le cv d'id ${id} n'existe pas` );
   }
   return cv;
  }
  async update(id: string, updatedcv:UpdateCvDto): Promise<CvEntity> {
    const  newCv = await this.cvRepo.preload({id,...updatedcv,});
    if (newCv) {
      return this.cvRepo.save(newCv);
    } else {
      throw new NotFoundException('cv innexistant');
    }
}
 
  async remove(id: string) :Promise<CvEntity> {
    const cvToDelete=await this.cvRepo.findOne({where:{id}});
        if(!cvToDelete){
            throw new NotFoundException("Le cv d'id ${id} n'existe pas");
        }
    
            return await this.cvRepo.remove(cvToDelete);
    }
  }
