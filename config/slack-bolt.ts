import { App } from '@slack/bolt';
import config from 'config';
// Initializes your app with your bot token and signing secret
export const app = new App({
	token: config.get('SLACK_BOT_TOKEN'),
	signingSecret: config.get('SLACK_SIGNING_SECRET'),
	socketMode: true,
	appToken: config.get('SLACK_APP_TOKEN'),
	port: config.get('BOLT_APP_PORT') || 3000,
});
export const setupSlackApp = async function () {
	await app.start();
	// Start your app
	console.log('⚡️ Bolt app is running!');
};
