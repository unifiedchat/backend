import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
	comment: "Connection Model",
})
export class ConnectionModel extends Model {
	@Column({
		allowNull: false,
		comment: "User ID",
		type: DataType.STRING,
		unique: true,
		primaryKey: true,
	})
	user: string;

	@Column({
		allowNull: false,
		comment: "Platform",
		type: DataType.ENUM,
		unique: false,
		values: ["youtube"],
	})
	platform: string;

	@Column({
		allowNull: false,
		comment: "Channel Name",
		type: DataType.STRING,
		unique: false,
	})
	display_name: string;

	@Column({
		allowNull: false,
		comment: "Channel Publish Date",
		type: DataType.DATE,
		unique: false,
	})
	published_at: string;

	@Column({
		allowNull: true,
		comment: "Channel Thumbnail",
		type: DataType.STRING,
		unique: false,
	})
	medium_thumbnail: string;

	@Column({
		allowNull: false,
		comment: "Token expiration date",
		type: DataType.INTEGER,
		unique: false,
	})
	expires_in: number;

	@Column({
		allowNull: false,
		comment: "Connection access token",
		type: DataType.STRING,
		unique: false,
	})
	access_token: string;
}
