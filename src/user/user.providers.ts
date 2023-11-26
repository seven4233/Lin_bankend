import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { UserQuestion } from "./entities/user_question.entity";
import { Role } from "./entities/role.entity";
import { UserRole } from "./entities/user_role.entity";
import { Level } from "./entities/level.entity";
import { UserLevel } from "./entities/user_level.entity";
import { Notify } from "./entities/notify.entity";

export const userProviders = [
    {
        provide:'USER_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(User),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'USER_QUESTION_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(UserQuestion),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'ROLE_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(Role),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'USER_ROLE_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(UserRole),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'LEVEL_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(Level),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'USER_LEVEL_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(UserLevel),
        inject:["DATA_SOURCE"]
    },
    {
        provide:'NOTIFY_REPOSITORY',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(Notify),
        inject:["DATA_SOURCE"]
    }
]