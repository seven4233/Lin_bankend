import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { userProviders } from 'src/user/user.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers: [AdminController],
  providers: [AdminService, ...userProviders]
})
export class AdminModule {}
