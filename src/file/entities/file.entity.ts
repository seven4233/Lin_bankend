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

    //文件地址
    @Column({ nullable: true })
    url: string;

    //上传用户id
    @Column()
    userId: number;

    //文件分类
    @Column({nullable: true})
    sort: string;

    //备注
    @Column({ default: '暂无' })
    remark: string;

    @CreateDateColumn()
    createTime: Date;
}
