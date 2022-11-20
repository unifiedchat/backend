import { CONFIG } from "@config";
import { createClient } from "redis";

export const pubClient = createClient({
	url: CONFIG.REDIS_URL,
});
export const subClient = pubClient.duplicate();

export async function set<T>(key: string, value: T): Promise<string> {
	const json = JSON.stringify(value);
	return pubClient.set(key, json);
}

export async function get<T>(key: string): Promise<T> {
	const value = await pubClient.get(key);
	return JSON.parse(value ?? "null");
}

export async function del(key: string): Promise<number> {
	const count = await pubClient.del(key);
	return count;
}

export async function list(prefix: string): Promise<string[]> {
	const list = await pubClient.keys(`${prefix}/*`);
	return list;
}
