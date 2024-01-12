import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthMiddle } from './middleware/auth.middleware';
import { AdminModule } from './admin/admin.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [QuestionModule, DatabaseModule, UserModule, AdminModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(AuthMiddle)
      .exclude('/question/bank', '/user/login', '/user/register', '/user/login/mobile', '/user/smsCode', '/user',
      '/user/resetPassword', '/user/detail')
      .forRoutes('question', 'user')
  }
}
