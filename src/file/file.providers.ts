import { DataSource } from "typeorm";
import {File} from './entities/file.entity'

export const fileProviders = [
    {
        provide:'FILE',
        useFactory:(dataSource:DataSource)=> dataSource.getRepository(File),
        inject:["DATA_SOURCE"]
    },

]