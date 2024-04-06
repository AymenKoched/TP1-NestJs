import { NestFactory } from "@nestjs/core";
import { SkillService } from "../skill/skill.service";
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
import { CvService } from "../cv/cv.service";
import {SeederModule} from "./seeder.module";

async function bootstrap() {
    const app= await NestFactory.createApplicationContext(SeederModule);
    const cvService = app.get(CvService);
    const userServices = app.get(UserService);
    const skillService = app.get(SkillService);
    const skills = [];
    for (let i = 0; i < 10; i++) {
        const skill = await skillService.create({designation: randSkill() });
        skills.push(skill);
    }
    for (let i = 0; i < 10; i++) {
        const user = await userServices.signIn({
            username: randUserName(),
            email: randEmail(),
            password: randPassword(),
            role: randRole(),
        });

        let skillIds = [];
        skills.slice(0,i).map((skill) => {
          skillIds.push(skill.id);
        })
        const cv = await cvService.create({
            name: randLastName(),
            firstname: randFirstName(),
            age: i + 18,
            path: randFilePath(),
            job: randJobTitle(),
            cin: randNumber(),
        },user, skillIds);
    }
    await app.close();
}
bootstrap();