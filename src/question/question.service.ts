import { Inject, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { In, Not, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Bank } from './entities/bank.entity';
import { UserQuestion } from 'src/user/entities/user_question.entity';
import { Single } from './entities/single.entity';
import { Multiple } from './entities/multiple.entity';
import { Blank } from './entities/blank.entity';
import { Judge } from './entities/judge.entity';
import { User } from 'src/user/entities/user.entity';
import { UserLevel } from 'src/user/entities/user_level.entity';
import {UserFavor} from "../user/entities/user_favor.entity";

@Injectable()
export class QuestionService {

  constructor(@Inject('QUESTION_REPOSITORY') private question: Repository<Question>,
    @Inject('BANK_REPOSITORY') private bank: Repository<Bank>,
    @Inject('SINGLE_REPOSITORY') private single: Repository<Single>,
    @Inject('MULTIPLE_REPOSITORY') private multiple: Repository<Multiple>,
    @Inject('BLANK_REPOSITORY') private blank: Repository<Blank>,
    @Inject('JUDGE_REPOSITORY') private judge: Repository<Judge>,
    @Inject('USER_REPOSITORY') private user: Repository<User>,
    @Inject('USER_LEVEL_REPOSITORY') private ul: Repository<UserLevel>,
    @Inject('USER_FAVOR_REPOSITORY') private uf: Repository<UserFavor>,
    @Inject('USER_QUESTION_REPOSITORY') private uq: Repository<UserQuestion>) { }

  // 获取题库列表
  async getBankList() {
    const res = await this.bank.find({
      // relations:['questions']
    })
    return res
  }

  /**
 * 获取分类信息
 */
  async getSortInfo(userId: number, bankId: number) {
    const singleCount = await this.single.countBy({ bank_id: bankId })
    const multipleCount = await this.multiple.countBy({ bank_id: bankId })
    const blankCount = await this.blank.countBy({ bank_id: bankId })
    const judgeCount = await this.judge.countBy({ bank_id: bankId })

    const singleDoneCount = await this.uq.countBy({ question_sort: "单选题", user_id: userId, bank_id: bankId })
    const multipleDoneCount = await this.uq.countBy({ question_sort: "多选题", user_id: userId, bank_id: bankId })
    const blankDoneCount = await this.uq.countBy({ question_sort: "填空题", user_id: userId, bank_id: bankId })
    const judgeDoneCount = await this.uq.countBy({ question_sort: "判断题", user_id: userId, bank_id: bankId })

    const bankInfo = await this.bank.findOneBy({ id: bankId })
    return {
      count: { singleCount, multipleCount, blankCount, judgeCount }, doneCount: {
        singleDoneCount,
        multipleDoneCount, blankDoneCount, judgeDoneCount
      }, bankInfo,
    }
  }


  /**
   * 获取单选题
   */
  async getSingleList(userId: number, bankId: number) {
    // 根据用户id找到已做的 (单选) 题
    const doneList = await this.uq.find({ where: { user_id: userId, bank_id: bankId, question_sort: '单选题' } })
    const doneArr = doneList?.map(item => {
      return item.question_num
    })

    // 寻找已收藏的 （单选）题
    const favoredList = await this.uf.find({where:{user_id:userId, question_sort:'单选题'}})
    const favoredArr = favoredList?.map(item=>{
      return item.question_num
    })
    const singleList = await this.single.find({
      take: 5,
      where: {
        question_num: Not(In(doneArr)),
        bank_id: bankId
      }
    })
    // 加工选项
    const newSingleList = singleList.map((item, index) => {
      let isFavored:boolean
      if(favoredArr.includes(item.question_num)){
        isFavored = true
      }else{
        isFavored = false
      }
      const newOptions = item.options.split('$').map((i: any, idx: number) => {
        const letter = 'ABCD'
        return {
          label: i,
          value: letter[idx],
          question_num: item.question_num,
          answer: item.answer,
          selected: false,
          question_index: index
        }
      })
      return {
        ...item,
        question_index: index,
        options: newOptions,
        isFavored
      }
    })

    const singleCount = await this.single.countBy({ bank_id: bankId })
    return { list: newSingleList, totalCount: singleCount, doneCount: doneList?.length }
  }
  /**
   * 获取多选题
   */
  async getMulList(userId: number, bankId: number) {
    // 根据用户id找到已做的 (单选) 题
    const doneList = await this.uq.find({ where: { user_id: userId, bank_id: bankId, question_sort: '多选题' } })
    const doneArr = doneList?.map(item => {
      return item.question_num
    })
    const mulList = await this.multiple.find({
      take: 5,
      where: {
        question_num: Not(In(doneArr)),
        bank_id: bankId
      }
    })
    // 加工选项
    const newMulList = mulList.map((item, index) => {

      const newOptions = item.options.split('$').map((i: any, idx: number) => {
        const letter = 'ABCDEFG'
        return {
          label: i,
          value: letter[idx],
          question_num: item.question_num,
          answer: item.answer,
          selected: false,
          question_index: index,
          your:''
        }
      })
      return {
        ...item,
        question_index: index,
        options: newOptions
      }
    })

    const mulCount = await this.multiple.countBy({ bank_id: bankId })
    return { list: newMulList, totalCount: mulCount, doneCount: doneList?.length }

  }
  /**
 * 获取判断题
 */
  async getJudgeList(userId: number, bankId: number) {
    // 根据用户id找到已做的 (判断) 题
    const doneList = await this.uq.find({ where: { user_id: userId, question_sort: '判断题', bank_id: bankId } })
    const doneArr = doneList.map(item => {
      return item.question_num
    })
    const judgeList = await this.judge.find({
      take: 5,
      where: {
        question_num: Not(In(doneArr)),
        bank_id: bankId
      }
    })

    // 加工选项
    const newJudgeList = judgeList.map((item, index) => {
      const newOptions = [
        {
          label: '对',
          value: "A",
          question_num: item.question_num,
          answer: item.answer,
          selected: false,
          question_index: index
        },
        {
          label: '错',
          value: "B",
          question_num: item.question_num,
          answer: item.answer,
          selected: false,
          question_index: index
        }
      ]

      return {
        ...item,
        question_index: index,
        options: newOptions
      }
    })

    const judgeCount = await this.judge.count()
    return { list: newJudgeList, totalCount: judgeCount, doneCount: doneList?.length }
  }


  // 插入已完成题目
  async insertFinishedQuestion(body: any, userId: number) {
    const { sort, bankId, correctList } = body
    console.log(sort);

    const doneArr = (correctList as any[]).map(item => {
      return {
        user_id: userId,
        bank_id: bankId,
        question_num: item.question_num,
        question_sort: sort
      }
    })

    for (let i = 0; i < doneArr.length; i++) {
      const res = await this.uq.save(doneArr[i])
    }

    const count = await this.uq.count({ where: { user_id: userId } })

    const { lv: targetLv, duan: targetDuan } = mapCountToLv(count)  //获取目标等级

    // 根据题数更新等级 （需要和前端统一
    let userToUpdate = await this.user.findOne({ where: { id: userId } })
    let ulToUpdate = await this.ul.findOne({ where: { userId: userId } })

    // 更新ul
    ulToUpdate.levelId = targetLv
    await this.ul.save(ulToUpdate)

    userToUpdate.doneCount = count
    await this.user.save(userToUpdate)
    return { code: 0, message: '提交成功!' }
  }

  //浏览加1
  async addFever(bankId: number){
      let bankToUpdate = await this.bank.findOne({where:{id: bankId}})

      bankToUpdate.fever += 1;
      await  this.bank.save(bankToUpdate)
      return {message:'浏览加一', code:0}
  }
}
// 20 , 50 , 100 , 180, 300, 480, 680, 999, 1400
const mapCountToLv = (count: number) => {
  let lv;
  let duan;
  switch (true) {
    case count < 300:
      lv = 1;
      break
    case count < 800:
      lv = 2;
      break
    case count < 1500:
      lv = 3;
      break
    case count < 2500:
      lv = 4;
      break
    case count < 4000:
      lv = 5;
      break
    case count < 9999:
      lv = 6;
      break

  }
  return { lv, duan }
}
