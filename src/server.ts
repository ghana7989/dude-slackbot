import connectDB from '../config/database';
import { app, setupSlackApp } from '../config/slack-bolt';
import { COMMANDS } from './command';
import { recordHandler } from './command/record.handler';
import Record from './models/Record';
import { formatDate } from './utils/date';
import { getUser, getUserIdsFromCommandText } from './utils/user';

const log = (obj: any) => {
	console.log('====================================');
	console.log(JSON.stringify(obj, null, 2));
	console.log('====================================');
};

// connect to database
connectDB();
// set up slack app
setupSlackApp();

app.command(COMMANDS.RECORD, async (payload) => recordHandler(payload));

app.command(COMMANDS.GET_RECORDS, async ({ command, ack, say }) => {
	if (!command.text) {
		const user = await getUser(command.user_id);
		const records = await Record.find({
			_id: { $in: user.records },
			createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
		});
		await ack();
		if (!records.length) {
			await say(`Nothing is recorded for this user`);
			return;
		}
		await say(`Here are your records:`);
		records.forEach(async (record) => {
			await say(
				`*${record.text}* -  ${formatDate(record.createdAt.getTime())}`
			);
		});
	} else {
		const mentions = getUserIdsFromCommandText(command.text);
		mentions.forEach(async (mention) => {
			await say(`
===============================================
    Here are the records of <@${mention}>: 
===============================================
      `);
			const user = await getUser(mention);
			const records = await Record.find({
				_id: { $in: user.records },
				createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
			});
			if (!records.length) {
				await say(`Nothing is recorded for this user`);
				return;
			}
			await ack();
			const saying = records.map((record) => {
				return `*${record.text}* -  ${formatDate(record.createdAt.getTime())}`;
			});

			saying.forEach(async (d) => {
				say(d);
			});
		});
	}
});
