import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  VERSION: string;
  ORIGINS: string[];
  SECRET: string;
  MONGO_URL: string;
}

const CONFIG: Config = {
  VERSION: process.env.VERSION || '1.0.0',
  ORIGINS: process.env.ORIGINS ? process.env.ORIGINS.split(',') : [],
  SECRET: process.env.SECRET,
  MONGO_URL: process.env.MONGO_URL,
};

export default CONFIG;
