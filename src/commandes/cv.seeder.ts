import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { SkillService } from "../skill/skill.service";
import { SkillEntity } from "../skill/entities/skill.entity";
import {
    randEmail, randFilePath,
    randFirstName,
    randJobTitle,
    randLastName, randNumber,
    randPassword, randRole,
    randSkill,
    randUserName
} from "@ngneat/falso";
import { UserService } from '../user/user.service';
import { CvEntity } from '../cv/entities/cv.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CvService } from "../cv/cv.service";
import {SignInUserDto} from "../user/dto/signin-user.dto";

async function bootstrap() {
    const app= await NestFactory.createApplicationContext(AppModule);
    const cvService = app.get(CvService);
    const userServices = app.get(UserService);
    const skillService = app.get(SkillService);
    const skills = [];
    // for (let i = 0; i < 10; i++) {
    //     const skill = await skillService.create({designation: randSkill() });
    //     skills.push(skill);
    // }
    for (let i = 0; i < 10; i++) {
        const user = await userServices.signIn({
            username: randUserName(),
            email: randEmail(),
            password: randPassword(),
            role: randRole(),
        });
        const cv = await cvService.create({
            name: randLastName(),
            firstname: randFirstName(),
            age: i + 18,
            path: randFilePath(),
            job: randJobTitle(),
            cin: randNumber(),
        },user);
    }
    await app.close();
}
bootstrap();