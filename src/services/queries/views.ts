import { client } from '$services/redis';
import { itemKey, itemsByViewsKey, itemsViewsKey } from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {
	const isViewUniq = await client.pfAdd(itemsViewsKey(itemId), userId);

	if(!isViewUniq) return null; // view already counted for this user

	return await Promise.all([
		client.hIncrBy(itemKey(itemId), 'views',1),
		client.zIncrBy(itemsByViewsKey(), 1, itemId)
	])
};
