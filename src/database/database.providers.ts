import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USERNAME } from 'src/config';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        username:DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
        database: DATABASE_NAME,
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        logging: false,
        synchronize: true,
      });

      return dataSource.initialize();
    }, 
  }, 
];