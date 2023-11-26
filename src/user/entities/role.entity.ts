import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import * as Faker from 'faker-zh-cn';
  
  @Entity()
  export class Role {
    @PrimaryGeneratedColumn()
    id: number;
  
    // 角色名
    @Column()
    name: string;
  
    // 角色值
    @Column()
    value: string;

    //状态
    @Column({default: 1 })
    status: number

    //备注
    @Column({default:'暂无'})
    remark: string

    @CreateDateColumn()
    createTime: Date;

  }
  