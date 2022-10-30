import User from '../models/User';

export const createNewUser = async (userId: string) => {
	const user = await User.create({ userId });
	return user;
};

export const getUser = async (userId: string) => {
	const user = await User.findOne({ userId });
	if (!user) {
		return createNewUser(userId);
	}
	return user;
};

export const userNameRegEx = /\<@([^\|]+)\|([^\>]+)\>/g;
export const getUserIdsFromCommandText = (str: string) => {
	const mentionsArr = str
		.match(userNameRegEx)
		?.map((match) => match.split('@')[1].split('|')[0]);
	const mentions = [...new Set(mentionsArr)];
	return mentions;
};
