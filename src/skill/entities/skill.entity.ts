import {Column, Entity} from 'typeorm';
import {TimestampEntity} from "../../generics/timestamp.entity/timestamp.entity";

@Entity('skill')
export class SkillEntity extends TimestampEntity {

    @Column({
        length: 100,
    })
    designation: string;
}
