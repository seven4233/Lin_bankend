import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";

@Entity()
export class Multiple {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bank_id: number;
    // 题号
    @Column({nullable: true})
    question_num: string;

    // 分类
    @Column({nullable:true})
    type: string;

    // 题目
    @Column({type: "varchar", length: 2048, nullable:true})
    name: string;

    // 题目来源
    @Column({type: "varchar", length: 2048, nullable:true})
    source: string;

       // 题目来源
       @Column({type: "varchar", length: 255, nullable:true})
       source_dic: string;

    // 选项
    @Column({nullable: true})
    options: string;

    // 答案
    @Column({type: "varchar", length: 2048, nullable:true})
    answer: string;

    // 难度
    @Column({nullable: true})
    level: string;

}
