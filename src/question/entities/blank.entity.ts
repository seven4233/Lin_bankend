import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";

@Entity()
export class Blank {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bank_id: number;
    // 题号
    @Column()
    question_num: string;

    // 分类
    @Column()
    type: string;

    // 题目
    @Column({type: "varchar", length: 2048})
    name: string;

    // 题目来源
    @Column({type: "varchar", length: 2048})
    source: string;

    // 题目来源
    @Column({type: "varchar", length: 255})
    source_dic: string;

    // 答案
    @Column({type: "varchar", length: 2048})
    answer: string;

    // 难度
    @Column()
    level: string;

}
