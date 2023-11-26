import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;
  
    // 角色id
    @Column()
    roleId: number;
  
    // 用户id
    @Column()
    userId: number;

    //创建时间
    @CreateDateColumn()
    createdAt: Date

  }
  