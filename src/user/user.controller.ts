import { Body, Controller, Get, Header, Headers, Param, Post, Put, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {FileInterceptor} from '@nestjs/platform-express'
import * as qiniu from 'qiniu';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // 获取用户列表
  @Get()
  getUserList(@Query() query) {
    return this.userService.queryList(query);
  }
  // 获取用户详情
  @Get('detail')
  getDetail(@Query('id') userId){
    return this.userService.queryDetail(userId)
  }

   // 获取rank列表
   @Get('rank')
   getRankList(@Query() query) {
     return this.userService.queryRankList();
   }
 
  //用户是否存在
  @Post('accountExist')
  accountExist(@Body() body, @Req() req){
    const userId = req.currentUser?.id
    return this.userService.accountExist(body,userId)
  }

  // 登录接口
  @Post('login')
  login(@Body() body) {
    const { account, password } = body;
    return this.userService.login(account, password);
  }
  // 手机号登录
  @Post('login/mobile')
  loginByMobile(@Body() body) {
    const { mobile='', sms='' } = body;
    return this.userService.loginByMobile(mobile, sms);
  }
  //获取验证码的接口
  @Get('smsCode')
  getCode(@Query() query){
    const {mode, mobile} = query
    return this.userService.getSmsCode(mobile, mode )
  }

  // 获取用户信息
  @Get('getUserInfo')
  getUserInfo(@Req() req, @Headers() header){
    console.log(header);
    
    const userId = req.currentUser?.id
    console.log(userId);
    
    return this.userService.queryUserInfo(userId)
  }

  // 注册接口
  @Post('register')
  register(@Body() body) {
    const { account, password, confirmPassword, sms, mobile } = body;
    return this.userService.register(account, password, confirmPassword, sms, mobile);
  }

  //更新用户信息的接口
  @Put('update')
  update(@Body() userInfo: UpdateUserDto, @Req() req) {
    const userId = req.currentUser?.id;
    return this.userService.updateUserinfo(userInfo, userId);
  }

  // 更新头像的接口
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  avatar(@UploadedFile() file:any, @Req() req,) {

    const userId = req.currentUser?.id;
    return this.userService.updateAvatar(file, userId);
  }
  //获取七牛key
  @Get('key')
  getKey() {
    const AK = 'BnRxcSQzqCwIX7_slRuIGBpHqVYRhre_99e_ceu0';
    const SK = '62lho5oES_DaxkTUx11bxStRBp3kRL26KFFJvxlB';
    const scope = 'seven4233';

    const mac = new qiniu.auth.digest.Mac(AK, SK);
    const putPolicy = new qiniu.rs.PutPolicy({ scope });
    const uploadToken = putPolicy.uploadToken(mac);
    return { result: uploadToken };
  }

  //修改密码
  @Put('password')
  updatePass(@Body() body, @Req() req){
    const userId = req.currentUser?.id
    return this.userService.updatePass(body,userId)
  }

    //设置密码
    @Post('setPassword')
    setPassword(@Body('password') password, @Req() req){
      const userId = req.currentUser?.id
      return this.userService.setPass(password,userId)
    }
    //重置密码
    @Post('resetPassword')
    resetPass(@Body() body){
      const{account, mobile, sms} = body
      return this.userService.resetPass(mobile, sms, account)
    }

    // 获取通知信息
    @Get("notify")
    notify(){
      return this.userService.getNotifyList()
    }

}
