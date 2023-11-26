import { DataSource } from "typeorm";
import { Question } from "./entities/question.entity";
import { Bank } from "./entities/bank.entity";
import { UserQuestion } from "src/user/entities/user_question.entity";
import { Single } from "./entities/single.entity";
import { Multiple } from "./entities/multiple.entity";
import { Blank } from "./entities/blank.entity";
import { Judge } from "./entities/judge.entity";

export const questionProviders = [
    {
        provide:'QUESTION_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(Question),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'SINGLE_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(Single),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'MULTIPLE_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(Multiple),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'BLANK_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(Blank),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'JUDGE_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(Judge),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'BANK_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(Bank),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'USER_QUESTION_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(UserQuestion),
        inject:["DATA_SOURCE"]
    }

]