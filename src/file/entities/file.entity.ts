import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;
    // 文件名
    @Column()
    name: string;
    // 文件大小
    @Column()
    size: number;

    // 文件下载数
    @Column({ default: 0 })
    download: number;

    //文件类型
    @Column({ nullable: true })
    type: string;

    //上传用户id
    @Column()
    userId: number;

    //备注
    @Column({ default: '暂无' })
    remark: string;

    @CreateDateColumn()
    createTime: Date;
}
