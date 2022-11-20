import { CONFIG } from "@config";
import { Snowlfake } from "generate-snowflake";
import { Perman } from "perman";

export type FlagTypes = "admin" | "user";

export const SHARED = {
	Snowflake: new Snowlfake(CONFIG.EPOCH),
	Permissions: new Perman<FlagTypes>(["admin", "user"]),
};

export enum ConnectionType {
	YOUTUBE,
}

export enum RedisPrefix {
	USERS = "users",
}
