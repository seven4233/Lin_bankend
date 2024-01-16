import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, TableColumn } from "typeorm";


@Entity()
export class UserFavor {

    @PrimaryGeneratedColumn()
    id: number;

    // 用户id
    @Column()
    user_id: number;

    // 题库id
    @Column()
    bank_id: number;

    // 题序
    @Column()
    question_num: string

    // 题目分类
    @Column()
    question_sort: string

    // 创建时间
    @CreateDateColumn()
    createdAt: Date

}
