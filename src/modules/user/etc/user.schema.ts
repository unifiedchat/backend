import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleType } from '@enums/role.enum';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  versionKey: false,
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
})
export class User extends Document {
  @Prop({ required: true, unique: true, min: 4, max: 20 })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: RoleType })
  role: RoleType;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
