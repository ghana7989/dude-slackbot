import { formatRelative } from 'date-fns';

export const formatDate = (unixTime: number) => {
	return formatRelative(new Date(unixTime), new Date());
};
