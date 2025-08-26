import { client } from '$services/redis';
import { itemKey, itemsByViewsKey } from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {
	return await Promise.all([
		client.hIncrBy(itemKey(itemId), 'views',1),
		client.zIncrBy(itemsByViewsKey(), 1, itemId)
	])
};
