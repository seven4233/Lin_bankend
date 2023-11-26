import { Inject, Injectable } from '@nestjs/common';
import { Role } from 'src/user/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/entities/user_role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @Inject('USER_REPOSITORY') private user: Repository<User>,
    @Inject('ROLE_REPOSITORY') private role: Repository<Role>,
    @Inject('USER_ROLE_REPOSITORY') private ur: Repository<UserRole>,
  ) {}

  async updateAccount(updateUser: any) {

    const {role='',id:userId} = updateUser //role=>admin  ur=>  user_id => value

    const tarRole = await this.role.findOne({where:{value: role}})
    
    const urToUpdate = await this.ur.findOne({where:{userId}})
    console.log(urToUpdate);
    
    urToUpdate.roleId = tarRole.id

    await this.ur.save(urToUpdate)
 
    let accountToUpdate = await this.user.findOne({
      where: { id: updateUser.id },
    });
    delete updateUser.id;
    await this.user.save({ ...accountToUpdate, ...updateUser });
    return { message: '账号更新成功', code: 0 };
  }

  async createAccount(createAccount: any) {
    const {role='',} = createAccount
    const {id: roleId} = await this.role.findOne({where:{value: role}})
    let newUser =  await this.user.save(createAccount);
    let urObj = {userId: newUser.id, roleId}

    await this.ur.save(urObj)
    return { message: '账号创建成功', code: 0 };
  }

  async updateRole(updateRole: any) {
    console.log(updateRole);
    
    let roleToUpdate = await this.role.findOne({
      where: { id: updateRole.id },
    });
    delete updateRole.id;
    await this.role.save({ ...roleToUpdate, ...updateRole });
    return { message: '角色更新成功', code: 0 };
  }

  async createRole(createRoleDto: any) {
    await this.role.save(createRoleDto);
    return { message: '角色创建成功', code: 0 };
  }

  async getRoleListByPage(query: any) {
    const { page = 1, pageSize = 10 } = query;
    const res = await this.role.find({
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    return { code: 0, message: 'ok', items: res };
  }

  async setRoleStatus(body: any) {
    const { id, status } = body;
    const roleToUpdate = await this.role.findOne({ where: { id } });
    roleToUpdate.status = status;
    await this.role.save(roleToUpdate);
    return { message: '修改角色状态成功', code: 0 };
  }

  /**
   * 获取角色列表(可用的)
   */
  async queryRoleList() {
    const roleList = await this.role.find({where:{status:1}});
    return roleList.map((role) => {
      return {
        roleName: role.name,
        roleValue: role.value,
      };
    });
  }
}
