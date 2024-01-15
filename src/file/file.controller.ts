import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Req,
  ParseFilePipe, Query
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {AuthMiddle} from "../middleware/auth.middleware";

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // 上传文件
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: any, @Req() req, ) {

    console.log(file)

    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const userId = req.currentUser?.id
    console.log(file)
    return this.fileService.create(file, userId);
  }

  // 获取文件列表
  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  // 搜索文件
  @Get('search')
  search(@Query("keyword") keyword:string) {
    console.log(keyword)
    return this.fileService.searchFile(keyword);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
