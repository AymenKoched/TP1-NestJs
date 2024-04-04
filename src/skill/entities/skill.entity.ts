import {Column, Entity, JoinTable, ManyToMany} from 'typeorm';
import { CvEntity } from "../../cv/entities/cv.entity";
import { TimestampEntity } from 'src/generics/timestamp.entity/timestamp.entity';

@Entity('skill')
export class SkillEntity extends TimestampEntity {

    @Column({
        length: 100,
    })
    designation: string;
}
