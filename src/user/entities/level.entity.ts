import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'; 

@Entity()
export class Level {
  @PrimaryGeneratedColumn()
  id: number;
  // 段位名
  @Column({ default: '炼气期' })
  name: string;
  // 等级
  @Column({ default: 1 })
  level: number;

  //刷题数量
  @Column({ default: 0 })
  doneCount: number;

  //背景颜色
  @Column({ nullable: true })
  bgColor: string;

  //字体颜色
  @Column({ nullable: true, default:"#FFFFFF" })
  color: string;

  //备注
  @Column({ default: '暂无' })
  remark: string;

  @CreateDateColumn()
  createTime: Date;
}
