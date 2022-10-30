import { Document, model, Schema, Types } from 'mongoose';
import { IRecord, TRecord } from './Record';

export type TUser = {
	userId: string;
	createdAt: Date;
	updatedAt: Date;
	records: IRecord &
		{
			_id: Types.ObjectId;
		}[];
};

export interface IUser extends TUser, Document {}

const userSchema: Schema = new Schema<IUser>(
	{
		userId: {
			type: String,
			required: true,
			unique: true,
		},
		records: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Record',
			},
		],
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	}
);

const User = model<IUser>('User', userSchema);

export default User;
