const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const secrets_path = path.resolve(__dirname, "..", ".env");

if (!fs.existsSync(secrets_path)) {
	fs.writeFileSync(secrets_path, "");
}
const secrets_file = fs.readFileSync(secrets_path, "utf8");

const saved_secrets = dotenv.parse(secrets_file);

if (!saved_secrets.VAULT_TOKEN && process.env.VAULT_TOKEN)
	saved_secrets.VAULT_TOKEN = process.env.VAULT_TOKEN;

if (!saved_secrets.VAULT_URL && process.env.VAULT_URL)
	saved_secrets.VAULT_URL = process.env.VAULT_URL;

const token = saved_secrets.VAULT_TOKEN;
const url = saved_secrets.VAULT_URL;

if (!token) throw new Error("VAULT_TOKEN is not set");
if (!url) throw new Error("VAULT_URL is not set");

const args = process.argv.slice(2);

const command = args[0];

switch (command) {
	case "post":
		postSecrets();
		break;
	case "get":
		getSecrets();
}

async function postSecrets() {
	try {
		const secrets = Object.keys(saved_secrets)
			.filter((k) => !k.startsWith("VAULT_") || k === "PORT")
			.map((k) => ({
				key: k,
				value: saved_secrets[k],
			}));

		await axios.post(
			`${url}/v1/secrets`,
			{
				secrets,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		);

		console.log("secrets posted");
	} catch (e) {
		console.error(e);
	}
}

async function getSecrets() {
	try {
		const { data } = await axios.get(`${url}/v1/secrets`, {
			headers: {
				Authorization: token,
			},
		});

		for (const secret of data.data.filter(
			(k) => !k.startsWith("VAULT_") || k === "PORT",
		)) {
			saved_secrets[secret.key] = secret.value;
		}

		let str = "";
		for (const key of Object.keys(saved_secrets)) {
			const value = saved_secrets[key];
			str += `${key}=${value}\n`;
		}

		fs.writeFileSync(secrets_path, str);

		console.log("secrets set");
	} catch (e) {
		console.error(e);
	}
}
