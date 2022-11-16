import { config } from "dotenv";
import { cleanEnv, num, str } from "envalid";

config();

const env = cleanEnv(process.env, {
	NODE_ENV: str({ default: "development" }),
	PORT: num({ default: 3000 }),
	API_VERSION: str({ default: "v1" }),
	POSTGRES_HOST: str(),
	POSTGRES_PORT: num(),
	POSTGRES_USER: str(),
	POSTGRES_PASSWORD: str(),
	POSTGRES_DB_NAME: str(),
	GOOGLE_CLIENT_ID: str(),
	GOOGLE_CLIENT_SECRET: str(),
	GOOGLE_REDIRECT_URI: str(),
	SECRET: str(),
});

export const factory = () => {
	return {
		PORT: env.PORT,
		API_VERSION: env.API_VERSION,
		POSTGRES: {
			host: env.POSTGRES_HOST,
			port: env.POSTGRES_PORT,
			username: env.POSTGRES_USER,
			password: env.POSTGRES_PASSWORD,
			database: env.POSTGRES_DB_NAME,
		},
		GOOGLE: {
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			redirectURI: env.GOOGLE_REDIRECT_URI,
		},
		API_URLS: {
			youtube: "https://www.googleapis.com/youtube/v3/",
			twitch: "https://api.twitch.tv/helix",
		},
		SECRET: env.SECRET,
		EPOCH: new Date("2022-11-15T00:00:00Z").getTime(),
	};
};

export const CONFIG = factory();
