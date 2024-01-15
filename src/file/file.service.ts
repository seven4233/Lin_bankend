import {Inject, Injectable} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import {Repository, Like,} from "typeorm";
import {File} from './entities/file.entity'
import {User} from '../user/entities/user.entity'
import {cos} from "../utils/cos";
@Injectable()
export class FileService {
  constructor(@Inject("FILE") private file: Repository<File>,
  @Inject("USER_REPOSITORY") private user: Repository<User> ) {
  }

  async searchFile(keyword: string){
    let res = await this.file.find(
        {
          where: {
            name: Like(`%${keyword}%`)
          },
        }
    )

    for (let i = 0; i < res.length; i++){
      let userInfo = await this.user.findOne({where:{id:res[i].userId}});
       (res[i] as any ).user = userInfo
    }

    return {result: res,  code:0, message:'搜索结果'}
  }

  // 上传文件
  async create(file: any, userId: number) {
    let res:string = await new Promise((resolve, reject) => {
      cos.putObject({

        Bucket: 'hualin-1314589919', /* 必须 */
        Region: 'ap-beijing',    /* 必须 */
        Key: 'file/' + file?.originalname ,              /* 必须 */
        StorageClass: 'STANDARD',
        Body: file?.buffer, // 上传文件对象
        onProgress: function (progressData) {
          // console.log(JSON.stringify(parogressData));
        }
      }, function (err, data) {
        if(err){console.log(err);
        }
        resolve('https://'+ data?.Location)
      })
    })

    // 需要保存的文件信息
    const fileToSave = {
      name: file?.originalname,
      size: file?.size,
      type: file?.originalname.split('.')[1],
      url: res,
      userId: userId
    }

    await this.file.save(fileToSave)

    let url = res
    switch (fileToSave.type){
      case 'doc':
      case 'docx':
        url = 'https://hualin-1314589919.cos.ap-beijing.myqcloud.com/static/Word%20%281%29.png'
    }
    return {result: res , message:'上传文件成功', code: 0, url, status:'success', name:fileToSave.name}
  }

  // 获取文件列表
  async findAll() {
    const fileList = await this.file.find({order: {createTime:'desc'}});

    for (let i = 0; i < fileList.length; i++){
      let userInfo = await this.user.findOne({where:{id:fileList[i].userId}});
      (fileList[i] as any ).user = userInfo
    }
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
