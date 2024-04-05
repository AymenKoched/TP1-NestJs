import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { SkillService } from "../skill/skill.service";
import { SkillEntity } from "../skill/entities/skill.entity";
import {
    randEmail, randFilePath,
    randFirstName,
    randJobTitle,
    randLastName, randNumber,
    randPassword,
    randSkill,
    randUserName
} from "@ngneat/falso";
import { UserService } from '../user/user.service';
import { CvEntity } from '../cv/entities/cv.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CvService } from "../cv/cv.service";

async function bootstrap() {
    const app= await NestFactory.createApplicationContext(AppModule);
    const cvService = app.get(CvService);
    const userServices = app.get(UserService);
    const skillService = app.get(SkillService);
    const skills = [];
    for (let i = 0; i < 10; i++) {
        const skill= new SkillEntity()
        skill.designation=randSkill();
        await skillService.create(skill);
        skills.push(skill);
    }
    for (let i = 0; i < 10; i++) {
        const user = new UserEntity()
        user.email=randEmail()
        user.username=randUserName()
        user.password=randPassword()
        const cv=new CvEntity()
        cv.firstname=randFirstName()
        cv.name=randLastName()
        cv.job=randJobTitle()
        cv.age=i+18
        cv.path=randFilePath()
        cv.cin=randNumber()
        cv.user=user
        cv.cvSkills=[
            skills[i],
        ]
        await userServices.signIn(user)
        await cvService.create(cv,userServices)
    }
    await app.close();
}
bootstrap();