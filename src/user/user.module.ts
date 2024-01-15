import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from './user.providers';
import {questionProviders} from "../question/question.providers";

@Module({
  imports:[DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders, ...questionProviders]
})
export class UserModule {}
