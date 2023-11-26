import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import * as fs from 'fs'
import *  as path from 'path'
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { APP_PORT } from './config';

async function bootstrap() {

  // https config
  // const httpsOptions:HttpsOptions = {
  //   key: fs.readFileSync(
  //     path.join(__dirname, '../secrets/iccmsm.com.key')
  //   ),
  //   cert: fs.readFileSync(
  //     path.join(__dirname, '../secrets/iccmsm.com_bundle.crt')
  //   )
  // }
  // const app = await NestFactory.create(AppModule, {httpsOptions});
 
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters( new HttpExceptionFilter())
  app.enableCors()

  await app.listen(APP_PORT);
  // console.log("app start at " +process.env.APP_PORT)
}
bootstrap();
