import * as tencentcloud  from 'tencentcloud-sdk-nodejs'

const smsClient = tencentcloud.sms.v20210111.Client
const client = new smsClient({
  credential:{
    secretId:'AKIDhIzYzEF3iGh3FKEwVyLf8OVREqeLqCNO',
    secretKey:'wiJkz2rRPCoOp591kPtCQhv42mPq6A5p'
  },
  region:"ap-beijing",
})

// 获取短信验证码的参数
function createMobileParams(mobile:string, sms:string,mode:'login'|'register'|'reset', expiresTime='5'){
    return {
      /* 短信应用ID: 短信SmsSdkAppId在 [短信控制台] 添加应用后生成的实际SmsSdkAppId，示例如1400006666 */
      SmsSdkAppId: "1400752242",
      /* 短信签名内容: 使用 UTF-8 编码，必须填写已审核通过的签名，签名信息可登录 [短信控制台] 查看 */
      SignName: "一切都将一去沓然个人网",
    
      /* 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
       * 示例如：+8613711112222， 其中前面有一个+号 ，86为国家码，13711112222为手机号，最多不要超过200个手机号*/
      PhoneNumberSet: [`+86${mobile}`],
      /* 模板 ID: 必须填写已审核通过的模板 ID。模板ID可登录 [短信控制台] 查看 */
      TemplateId: mode==='login'?'1912736':mode==='register'?'1612841':'1913091',
      /* 模板参数: 若无模板参数，则设置为空*/
      TemplateParamSet: [sms, expiresTime],
    }
  }

export  {client, createMobileParams}