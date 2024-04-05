import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { TimestampEntity } from 'src/generics/timestamp.entity/timestamp.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {SkillEntity} from "../../skill/entities/skill.entity";

@Entity('cv')
export class CvEntity extends TimestampEntity {

  @Column({
    length: 50
  })
  name: string;

  @Column({
    length: 50
  })
  firstname: string;

  @Column()
  age: number;

  @Column()
  cin: number;

  @Column()
  job: string;

  @Column({
    nullable: true
  })
  path: string;

  

  
  @ManyToOne(
    (type) => UserEntity,
    (user) => user.cvs,
    {
      cascade: ['insert', 'update'],
      nullable: true,
      eager: true,
    }
  )
  user: UserEntity;

  @ManyToMany(() => SkillEntity)
  @JoinTable()
  cvSkills: SkillEntity[]
}
