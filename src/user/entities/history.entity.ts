import {
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class History {
    @PrimaryGeneratedColumn()
    id: number;

    // 关键词
    @Column()
    keyword: string;

    // 用户id
    @Column()
    userId: number;

    //备注
    @Column({default:'暂无'})
    remark: string

    @CreateDateColumn()
    createTime: Date;

    @DeleteDateColumn()
    deleteTime: Date

}
