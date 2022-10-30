import { Document, Model, model, Schema } from 'mongoose';

export type TRecord = {
	text: string;
	createdAt: Date;
	updatedAt: Date;
};

export interface IRecord extends TRecord, Document {}

const recordSchema: Schema = new Schema<IRecord, Model<IRecord>, IRecord>(
	{
		text: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	}
);

const Record = model<IRecord>('Record', recordSchema);

export default Record;
