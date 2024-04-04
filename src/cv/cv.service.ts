import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvEntity } from './entities/cv.entity';


@Injectable()
export class CvService {
constructor(@InjectRepository(CvEntity)
    private cvRepo : Repository<CvEntity> 
) {}








}
