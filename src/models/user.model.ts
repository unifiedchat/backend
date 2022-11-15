import { SHARED } from "@shared";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
	comment: "User Model",
})
export class UserModel extends Model {
	@Column({
		allowNull: false,
		comment: "User ID",
		type: DataType.STRING,
		unique: true,
		primaryKey: true,
	})
	id: string;

	@Column({
		allowNull: false,
		comment: "User username",
		type: DataType.STRING,
		unique: true,
		validate: {
			isAlphanumeric: true,
			len: [3, 32],
		},
	})
	username: string;

	@Column({
		allowNull: false,
		comment: "User mail",
		type: DataType.STRING,
		unique: true,
		validate: {
			isEmail: true,
		},
	})
	mail: string;

	@Column({
		allowNull: false,
		comment: "User permissions",
		type: DataType.INTEGER,
		defaultValue: SHARED.Permissions.get("user"),
	})
	permissions: number;

	@Column({
		allowNull: false,
		comment: "User password hash",
		type: DataType.STRING,
		unique: true,
	})
	password: string;

	@Column({
		allowNull: false,
		comment: "User access token",
		type: DataType.STRING,
		unique: true,
	})
	access_token: string;
}
