import {Inject, Injectable} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import {Repository} from "typeorm";
import {File} from './entities/file.entity'
import {cos} from "../utils/cos";
@Injectable()
export class FileService {
  constructor(@Inject("FILE") private file: Repository<File> ) {
  }

  async create(file: any, userId: number, fileInfo: any) {
    let res:string = await new Promise((resolve, reject) => {
      cos.putObject({
        Bucket: 'hualin-1314589919', /* 必须 */
        Region: 'ap-beijing',    /* 必须 */
        Key: file?.originalname ,              /* 必须 */
        StorageClass: 'STANDARD',
        Body: file?.buffer, // 上传文件对象
        onProgress: function (progressData) {
          // console.log(JSON.stringify(progressData));
        }
      }, function (err, data) {
        if(err){console.log(err);
        }
        resolve('https://'+ data?.Location)
      })
    })

    // 需要保存的文件信息
    const fileToSave = {
      name: fileInfo?.name,
      size: file?.size,
      type: fileInfo?.type,
      url: res,
      userId: userId
    }

    await this.file.save(fileToSave)

    return {result: res , message:'上传文件成功', code: 0}
  }

  // 获取文件列表
  async findAll() {
    const fileList = await this.file.find({order: {createTime:'desc'}});
    return {result: fileList, message:'获取文件列表成功', code: 0}
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
