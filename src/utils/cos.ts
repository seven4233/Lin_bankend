import * as COS from 'cos-nodejs-sdk-v5'

export const cos = new COS({
    SecretId: 'AKIDZl2FHAztnX5ThhVIvNfmmx49CGP0jMsH', // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
    SecretKey: 'Ro3A6qMlzzmN6gEg0A81lppfNyY1LTND', // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
});
