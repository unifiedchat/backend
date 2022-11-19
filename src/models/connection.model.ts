import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
	comment: "Connection Model",
})
export class ConnectionModel extends Model {
	@Column({
		allowNull: false,
		comment: "Connection ID",
		type: DataType.STRING,
		unique: true,
		primaryKey: true,
	})
	id: string;

	@Column({
		allowNull: false,
		comment: "User ID",
		type: DataType.STRING,
	})
	user_id: string;

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
	})
	display_name: string;

	@Column({
		allowNull: false,
		comment: "Channel Publish Date",
		type: DataType.DATE,
	})
	published_at: string;

	@Column({
		allowNull: true,
		comment: "Channel Thumbnail",
		type: DataType.STRING,
	})
	medium_thumbnail: string;

	@Column({
		allowNull: false,
		comment: "Token expiration date",
		type: DataType.INTEGER,
	})
	expires_in: number;

	@Column({
		allowNull: false,
		comment: "Connection access token",
		type: DataType.STRING,
	})
	access_token: string;
}
