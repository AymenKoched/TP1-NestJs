import { Controller , Post , Get , Patch , Delete , Body , Param} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { CvEntity } from './entities/cv.entity';
import { UpdateCvDto } from './dto/update-cv.dto';
@Controller('cv')
export class CvController {
constructor(private readonly cvService: CvService){}



// add new cv
@Post()
async create(
    @Body() CreateCvDto : CreateCvDto 
) : Promise<CvEntity> 
{
        return await this.cvService.create(CreateCvDto);
}


// get all cv entities

@Get()
async findAll() : Promise<CvEntity[]> {
    return this.cvService.findAll();
}

// get a cv with an id 

@Get(':id')
async findById(@Param('id') id: string) : Promise<CvEntity> {
    return this.cvService.findOne(id);
}

// modify a cv 

@Patch(':id') 
async update(@Param('id') id: string,
@Body() updateCvDto : UpdateCvDto ) : Promise<CvEntity>
{
    return this.cvService.update(id,updateCvDto);
}
//delete a cv
@Delete(':id')
  async remove(@Param('id') id: string):Promise<CvEntity> {
    return await this.cvService.remove(id);
  }



}
