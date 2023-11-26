import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { questionProviders } from './question.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { userProviders } from 'src/user/user.providers';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [QuestionController],
  providers: [QuestionService, ...questionProviders, ...userProviders]
})
export class QuestionModule {}
