import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Activity } from 'src/modules/activities/entities/activity.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_LOG, DB_SYNC } from './environtment';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST ,
  port: Number(DB_PORT) ,
  username: DB_USER ,
  password: DB_PASS ,
  database: DB_NAME ,
  entities: [User, Activity],
  synchronize: DB_SYNC,
  logging: DB_LOG,
};
