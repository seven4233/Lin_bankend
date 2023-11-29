import * as COS from 'cos-nodejs-sdk-v5'

export const cos = new COS({
    SecretId: 'AKIDkKvKWZVGrHVWKD1e8RPCl8IDzZw50g7M', // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
    SecretKey: '6xc4ILBoCMI1WnqnY5NQHwNaZMvJdkfL', // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
});
