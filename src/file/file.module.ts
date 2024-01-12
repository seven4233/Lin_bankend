import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import {DatabaseModule} from "../database/database.module";
import {fileProviders} from "./file.providers";

@Module({

  imports:[DatabaseModule],
  controllers: [FileController],
  providers: [FileService, ...fileProviders]
})
export class FileModule {}
