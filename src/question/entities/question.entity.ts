import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";
import { Bank } from "./bank.entity";

type Option = { 
    label: string;
    value: string;
}
@Entity()
export class Question {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bank_id: number;
    // 题号
    @Column()
    question_num: string;

    // 分类
    @Column()
    sort: string;

    // 题目
    @Column({type: "varchar", length: 2048})
    title: string;

    // 题目来源
    @Column({type: "varchar", length: 2048})
    source: string;

    // 选项
    @Column()
    options: string;

    // 答案
    @Column({type: "varchar", length: 2048})
    answer: string;

}
