import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';
import { UserQuestion } from './entities/user_question.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as qiniu from 'qiniu';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user_role.entity';
import { client, createMobileParams } from 'src/utils/useMobile';
import { generateSMSCode, getRandomName } from 'src/utils/useRandom';
import { Level } from './entities/level.entity';
import { UserLevel } from './entities/user_level.entity';
import randomName from 'src/utils/name';
import { Notify } from './entities/notify.entity';

let code: string;
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private user: Repository<User& {role:string,roleOrder:number}>  ,
    @Inject('USER_QUESTION_REPOSITORY') private uq: Repository<UserQuestion>,
    @Inject('ROLE_REPOSITORY') private role: Repository<Role>,
    @Inject('USER_ROLE_REPOSITORY') private ur: Repository<UserRole>,
    @Inject('LEVEL_REPOSITORY') private level: Repository<Level>,
    @Inject('USER_LEVEL_REPOSITORY') private ul: Repository<UserLevel>,
    @Inject('NOTIFY_REPOSITORY') private notify: Repository<Notify>,
  ) {}

  /**
   * 获取用户列表
   * @returns
   */
  async queryList(query: any) {
    console.log(query);
    const { account = '', nickname = '' } = query;

    // 根据权限大小排序
    let accountList = await this.user.find({
      where: { account: Like(`%${account}%`), nickname: Like(`%${nickname}%`) },
    });

    for (let i = 0; i < accountList.length; i++) {
      const ur = await this.ur.findOne({
        where: { userId: accountList[i].id },
      });
      const role = await this.role.findOne({ where: { id: ur?.roleId } });
      accountList[i].role = role.value;
      accountList[i].roleOrder = role.id
    }
    accountList.sort((a,b)=>{
      return a.roleOrder-b.roleOrder
    })
    return accountList;
  }
  /**
   * 获取用户详情
   */
  async queryDetail(id:number){
    const user =  await this.user.findOne({where:{id}})
    return user
  }

  /**
   * 获取rank列表
   */
  async queryRankList(){
    let rankList = await this.user.find({
      order: {  doneCount: 'DESC' },
    });
    for(let i = 0; i < rankList.length; i++){
      // 找到levelId
      const ul =   await this.ul.findOne({where:{userId: rankList[i].id}})
      // 找到level信息
      const levelInfo = await this.level.findOne({where:{id: ul?.levelId}});

      (rankList[i] as any).levelInfo = levelInfo
    }
    return rankList

  }

  /**
   * 判断用户是否存在
   */
  async accountExist(body: any, userId: number) {
    console.log(body, userId);

    const { accountInfo, isUpdate } = body;
    const currentUser = await this.user.findOne({
      where: { id: accountInfo.id },
    });
    const user = await this.user.findOne({
      where: { account: accountInfo.account },
    });

    if (isUpdate) {
      if (currentUser.account !== accountInfo.account && user) {
        return { code: -1, message: '账号已存在' };
      }
      return { code: 0, message: '该账号可以注册' };
    } else {
      if (user) {
        return { code: -1, message: '账号已存在' };
      }
    }

    return { code: 0, message: '该账号可以注册' };
  }

  /**
   * 获取用户信息
   */
  async queryUserInfo(userId: number) {
    
    const user = await this.user.findOne({ where: { id: userId } });
    const userRole = await this.ur.find({ where: { userId: userId } });

    const roleIds = userRole.map((item) => item?.roleId);
    const roles = [];
    if (userRole.length) {
      for (let i = 0; i < roleIds.length; i++) {
        const res = await this.role.findOne({ where: { id: roleIds[i] } });
        roles.push(res);
      }
    }

    return { ...user, roles };
  }
  /**
   * 登录
   * @param account
   * @param password
   * @returns
   */
  async login(account, password) {
    // 校验

    // 判断是否存在
    let user = await this.user.findOne({ where: { account, password } });
    if (!user) {
      throw new HttpException('账号或密码错误', HttpStatus.BAD_REQUEST);
      // { message: '账号或密码错误!', code:-1 };
    }
    const payload = {
      id: user.id,
      account: user.account,
    };

    // 获取已做题总数
    const totalDone = await this.uq.count({ where: { user_id: user.id } });
    const safetyUser = {
      ...user,
      password: '',
      totalDone,
    };
    //   生成token
    const token = jwt.sign(payload, 'linfeng', { expiresIn: '7 days' });

    return { message: '登录成功~', code: 0, result: safetyUser, token };
  }

  /**
   * 获取验证码
   */
  async getSmsCode(mobile: string, mode: 'login' | 'register' | 'reset') {
    code = generateSMSCode();
    const params = createMobileParams(mobile, code, mode);
    let res = await client.SendSms(params);
    console.log(res);
    return { message: '验证码发送成功', code: 0 };
  }

  /**
   * 手机号登录
   */
  async loginByMobile(mobile: string, sms: string) {
  
    if (sms !== code) {
      throw new HttpException('请输入正确的验证码', HttpStatus.BAD_REQUEST)
    }
    const exist = await this.user.findOne({ where: { phone: mobile } });
    if (!exist) {
      // 处理新建用户的逻辑
      const newUserObj = {
        phone: mobile,
        account: mobile,
        nickname: randomName.getNickName(),
      };
      const newUser = await this.user.save(newUserObj);
      // 添加ur
      let urObj = { userId: newUser.id, roleId: 2 }; //4-管理员
      // 添加ul
      let ulObj = {userId: newUser.id, levelId: 1}
      await this.ur.save(urObj);
      await this.ul.save(ulObj);
      const payload = {
        id: newUser.id,
        account: newUser.account,
      };
      const token = jwt.sign(payload, 'linfeng', { expiresIn: '7 days' });
      const totalDone = await this.uq.count({ where: { user_id: newUser.id } });
      const safetyUser = { 
        ...newUser,
        password: '',
        totalDone,
      };
      return {
        message: '登录成功',
        code: 0,
        result: safetyUser,
        token,
      };
    }
    const payload = {
      id: exist.id,
      account: exist.account,
    };
    const token = jwt.sign(payload, 'linfeng', { expiresIn: '7 days' });
    const totalDone = await this.uq.count({ where: { user_id: exist.id } });
    const safetyUser = {
      ...exist,
      password: '',
      totalDone,
    };
    return {
      message: '登录成功',
      code: 0,
      result: safetyUser,
      token,
    };
  }

  /**
   * 注册
   */
  async register(
    account: string,
    password: string,
    confirmPassword: string,
    sms: string,
    mobile: string,
  ) {
    // 参数校验
    if (account.length < 4 || account.length > 12) {
      return {
        message: '账号长度在4-12',
        code: -1,
      };
    }
    if (password.length < 4 || password.length > 12) {
      return {
        message: '密码长度在4-12',
        code: 1,
      };
    }

    if (password !== confirmPassword) {
      return {
        message: '两次输入密码不一致',
        code: -1,
      };
    }

    // 判断是否已被注册
    const user = await this.user.findOne({ where: { account } });
    const phone = await this.user.findOne({ where: { phone: mobile } });
    if (user) {
      return {
        message: '账号已被注册',
        code: 1,
      };
    }
    if (phone) {
      return {
        message: '手机号已被注册',
        code: -1,
      };
    }
    if (sms !== code) {
      return {
        message: '验证码不正确',
        code: -1,
      };
    }
    // 添加
    console.log(account);
    const saveUser = {
      account,
      password,
      phone: mobile,
      nickname: randomName.getNickName(),
    };
    let newUser = await this.user.save(saveUser);
    // 添加用户角色
    const urObj = { userId: newUser.id, roleId: 2 }; //4->管理员
    await this.ur.save(urObj);

    // 添加level
    const levelObj = { userId: newUser.id, levelId: 1 }; 
    await this.ul.save(levelObj);
    // ok
    return {
      message: '注册成功~',
      code: 0,
      result: newUser,
    };
  }

  /**
   * 更新用户信息
   */
  async updateUserinfo(userInfo: UpdateUserDto, userId: number) {
    let userToUpdate = await this.user.findOne({ where: { id: userId } });
    // 获取已做题总数
    let res = await this.user.save({ ...userToUpdate, ...userInfo });

    
    const totalDone = await this.uq.count({ where: { user_id: userId } });
    return {
      message: '更新用户信息成功~',
      code: 0,
      result: { ...res, totalDone },
    };
  }

  /**
   * 更新头像
   */
  async updateAvatar(file: any, userId: number) {
    // getToken
    const mac = new qiniu.auth.digest.Mac(process.env.AK, process.env.SK);
    const putPolicy = new qiniu.rs.PutPolicy({ scope: process.env.scope });
    const uploadToken = putPolicy.uploadToken(mac);

    
    //upload
    const formUploader = new qiniu.form_up.FormUploader(
      new qiniu.conf.Config({ zone: qiniu.zone.Zone_z1 }),
    );

    let avatarInfo: any = await new Promise((resolve, reject) => {
      formUploader.put(
        uploadToken,
        `${Date.now()}-${file.originalname}`,
        file.buffer,
        new qiniu.form_up.PutExtra(),
        function (err, body, result) {

          if (err) {
            return { code: -1, message: err.message };
          }
          if (result.statusCode === 200) {
            resolve({
              url: new URL(body.key, 'https://cdn.huashui666.com/').href,
            });
          }
        },
      );
    });
    

    //update
    let userToUpdate = await this.user.findOne({ where: { id: userId } });
    userToUpdate.avatar = avatarInfo.url;

    let res = await this.user.save(userToUpdate);
    return { message: '头像上传成功!', code: 0, result: res };
  }

  /**
   * 更新密码
   */
  async updatePass(body: any, userId: number) {
    const { passwordOld = '', passwordNew = '' } = body;
    const userToUpdate = await this.user.findOne({ where: { id: userId } });
    if (passwordNew.length > 18 || passwordNew.length < 6) {
      return { message: '密码长度为6-18', code: 1 };
    }
    if (passwordOld !== userToUpdate.password) {
      return { message: '原密码错误', code: 1 };
    }

    if (passwordNew === userToUpdate.password) {
      return { message: '新密码不能与旧密码一致', code: 1 };
    }

    userToUpdate.password = passwordNew;
    await this.user.save(userToUpdate);
    console.log(body);
    return { message: '修改密码成功!', code: 0 };
  }

  /**
   * 设置密码
   */
  async setPass(password: string, userId: number) {
    if (password.length > 18 || password.length < 6) {
      return { message: '密码长度为6-18', code: -1 };
    }
    const userToUpdate = await this.user.findOne({ where: { id: userId } });
    userToUpdate.password = password;
    await this.user.save(userToUpdate);
    return { message: '密码设置成功!', code: 0 };
  }
  /**
   * 重置密码
   */
  async resetPass(mobile: string, sms: string, account: string) {
    const isAccountExist = await this.user.findOne({ where: { account } });
    if (!isAccountExist) {
      return { message: '账号不存在', code: -1 };
    }
    const userToUpdate = await this.user.findOne({ where: { phone: mobile } });
    if (!userToUpdate) {
      return { message: '该用户未绑定手机号', code: -1 };
    }
    if (code !== sms) {
      return { message: '请输入正确的验证码', code: -1 };
    }

    userToUpdate.password = '123abc';
    await this.user.save(userToUpdate);

    return { message: '密码重置成功!', code: 0 };
  }

  //获取通知公告
  async getNotifyList(){
    const res = await this.notify.find()
    return {message:'获取通知列表成功', code:0 , result: res}
  }
}
