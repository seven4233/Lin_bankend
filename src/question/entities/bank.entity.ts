import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";


@Entity()
export class Bank {

    @PrimaryGeneratedColumn()
    id: number;

    // 年份
    @Column()
    year: string;

    // 名字
    @Column()
    name: string;
 
    //热度
    @Column({type: 'int', default: 0})
    fever: number;


  
      @CreateDateColumn()
      createdAt: Date

}
