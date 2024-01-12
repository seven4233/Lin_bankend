import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, ParseIntPipe } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  //  获取题库列表
  @Get('/bank')
  getQuestionBankList() {
    return this.questionService.getBankList()
  }

  // 获取分类信息
  @Get(":id/sort")
  sortInfo(@Req() req, @Param('id', ParseIntPipe) bankId) {
    const userId = req.currentUser?.id
    return this.questionService.getSortInfo(userId, bankId)
  }


  // 获取单选题
  @Get(":id/single")
  singleList(@Req() req, @Param("id", ParseIntPipe) bankId) {
    const userId = req.currentUser?.id
    return this.questionService.getSingleList(userId, bankId)
  }

  // 获取多选题
  @Get(":id/multiple")
  mulList(@Req() req, @Param("id", ParseIntPipe) bankId) {
    const userId = req.currentUser?.id
    return this.questionService.getMulList(userId, bankId)
  }
  // 获取判断题
  @Get(":id/judge")
  judgeList(@Req() req, @Param("id", ParseIntPipe) bankId) {

    const userId = req.currentUser?.id
    return this.questionService.getJudgeList(userId, bankId)
  }


  // 添加已完成题目
  @Post('/finish')
  addFinishedQuestion(@Body() body, @Req() req) {
    const { id: userId } = req.currentUser
    return this.questionService.insertFinishedQuestion(body, userId)
  }

  // 浏览加yi
  @Get("/fever")
  feverAddOne(@Query() query){
    console.log(query)
    const bankId = query?.bankId
    return this.questionService.addFever(+bankId);
  }


}
