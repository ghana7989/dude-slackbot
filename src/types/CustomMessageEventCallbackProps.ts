import {
	AllMiddlewareArgs,
	KnownEventFromType,
	SlackEventMiddlewareArgs,
} from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';

interface ICustomSlackEventMiddlewareArgs
	extends SlackEventMiddlewareArgs<'message'> {
	message: KnownEventFromType<'message'> & {
		client_msg_id: string;
		type: string;
		text: string;
		user: string;
		ts: string;
		blocks: {
			type: string;
			block_id: string;
			elements: {
				type: string;
				elements: {
					type: string;
					text: string;
				}[];
			}[];
		}[];
		team: string;
		channel: string;
		event_ts: string;
		channel_type: string;
	};
}
export type CustomMessageEventCallbackProps = ICustomSlackEventMiddlewareArgs &
	AllMiddlewareArgs<StringIndexed>;
