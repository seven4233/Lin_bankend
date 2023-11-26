import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm'; 
  
  @Entity()
  export class UserLevel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;
  
    @Column()
    levelId: number;

    @CreateDateColumn()
    createTime: Date;
  }
  