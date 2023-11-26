import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, TableColumn } from "typeorm";


@Entity()
export class UserQuestion {

    @PrimaryGeneratedColumn()
    id: number;

    // 用户id
    @Column()
    user_id: number;

    // 题库id
    @Column()
    bank_id: number;

    @Column()
    question_num: string

    @Column()
    question_sort: string

    @CreateDateColumn()
    createdAt: Date

}
