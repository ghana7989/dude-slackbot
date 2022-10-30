import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import Record from '../models/Record';
import {
	getUserIdsFromCommandText,
	getUser,
	userNameRegEx,
} from '../utils/user';

export const recordHandler = async ({
	command,
	ack,
	say,
	client,
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>) => {
	return new Promise<void>(async (resolve, reject) => {
		const mentions = getUserIdsFromCommandText(command.text);
		const user = await getUser(command.user_id);
		const text = command.text.replace(userNameRegEx, '');
		const record = await Record.create({ text });
		user.records.push(record);
		await user.save();
		if (mentions.length > 0) {
			mentions.forEach(async (mention) => {
				client.chat.postMessage({
					channel: mention,
					blocks: [
						{
							type: 'section',
							text: {
								type: 'mrkdwn',
								text: `You were mentioned in a record by <@${command.user_id}>`,
							},
						},
						{
							type: 'divider',
						},
						{
							type: 'section',
							text: {
								type: 'mrkdwn',
								text: `*${text}*`,
							},
						},
						{
							type: 'divider',
						},
					],
					as_user: true,
				});
			});
		}
		await ack();
		client.chat.postEphemeral({
			channel: command.channel_id,
			user: command.user_id,
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `Recorded!`,
					},
				},
				{
					type: 'divider',
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `*${text}*`,
					},
				},
			],
		});
		// await say(`Recorded: ${text}`);
		resolve();
	});
};
