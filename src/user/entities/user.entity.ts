import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as Faker from 'faker-zh-cn';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // 账号
  @Column()
  account: string;

  // 密码
  @Column({nullable:true})
  password: string;
  // 昵称
  @Column({nullable:true})
  nickname: string;

  //性别
  @Column({ type: 'tinyint', nullable: true,default:0 })
  gender: number;


  //刷题总数
  @Column({ default: 0 })
  doneCount: number;
  // 头像
  @Column({
    type: 'varchar',
    default:
      'https://cdn.huashui666.com/static/defaultAvatar/defaultAvatar.jpg',
  })
  avatar: string;
  // 电话
  @Column({ nullable: true })
  phone: string;
  // 签名
  @Column({ nullable: true })
  desc: string;
  // 邮箱
  @Column({ nullable: true })
  email: string;

  // 地址
  @Column({ nullable: true })
  address: string;
  // 个性签名
  @Column({ nullable: true })
  sign: string; // 地址
  @Column({ nullable: true })
  realName: string;
  // 权限
  @Column({ type: 'tinyint', default: 0 })
  access: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;
}
