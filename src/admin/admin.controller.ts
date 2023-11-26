import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 更新账号信息
  @Post('/update')
  updateAccount(@Body() body) {
    return this.adminService.updateAccount(body);
  }

  // 创建账号信息
  @Post('/create')
  createAccount(@Body() body) {
    return this.adminService.createAccount(body);
  }

  // 更新角色信息
  @Put('/role')
  updateRole(@Body() body) {
    return this.adminService.updateRole(body);
  }

  // 创建角色信息
  @Post('/role')
  createRole(@Body() body) {
    return this.adminService.createRole(body);
  }

  //获取所有角色列表
  @Get('role')
  roleList() {
    return this.adminService.queryRoleList();
  }
  //获取角色列表分页
  @Get('getRoleListByPage')
  getRoleListByPage(@Query() query) {
    return this.adminService.getRoleListByPage(query);
  }

  //修改角色状态
  @Post('setRoleStatus')
  setRoleStatus(@Body() body) {
    return this.adminService.setRoleStatus(body);
  }


}
