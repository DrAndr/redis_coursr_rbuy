import { client } from '$services/redis';
// import { itemKey, itemsByViewsKey, itemsViewsKey } from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {

	// LUA script that defined at src/services/redis/client.ts
	return await client.incrementViews(itemId, userId);

	/**
	 * Old approach:
	 * A potential problem is that with a large number of
	 * views between receiving and updating requests,
	 * there may be additional requests/views that will not be counted.
	 */
	// const isViewUniq = await client.pfAdd(itemsViewsKey(itemId), userId);
	//
	// if(!isViewUniq) return null; // view already counted for this user
	//
	// return await Promise.all([
	// 	client.hIncrBy(itemKey(itemId), 'views',1),
	// 	client.zIncrBy(itemsByViewsKey(), 1, itemId)
	// ]);
};

// LUA script preparing:
// Keys I need to access KEYS:
//    1) itemsViewsKey
//    2) itemKey
//    3) itemsByViewsKey
// Arguments ARGV:
//    1) itemId
//    2) userId