import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import * as Faker from 'faker-zh-cn';
  
  @Entity()
  export class Notify {
    @PrimaryGeneratedColumn()
    id: number;
  
    // 通知类型
    @Column()
    type: string;
  
    // 通知内容
    @Column()
    content: string;

    //备注
    @Column({default:'暂无'})
    remark: string

    @CreateDateColumn()
    createTime: Date;

  }
  