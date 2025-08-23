import { client } from '$services/redis';
import { itemKey, usersLikesKey } from '$services/keys';
import isEmpty from 'lodash/isEmpty';
import { getItems } from '$services/queries/items';

export const userLikesItem = async (itemId: string, userId: string) => {
	return await client.sIsMember(usersLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
	const likedItemsIds = await client.sMembers(usersLikesKey(userId));

	if(!isEmpty(likedItemsIds))
		return await getItems(likedItemsIds)


	return null;
};

export const likeItem = async (itemId: string, userId: string) => {
	const result = await client.sAdd(usersLikesKey(userId), itemId);
	if(result) await client.hIncrBy(itemKey(itemId), 'likes', 1);

	return result;
};

export const unlikeItem = async (itemId: string, userId: string) => {
	const result = await client.sRem(usersLikesKey(userId), itemId);
	if (result) await client.hIncrBy(itemKey(itemId), 'likes', -1);

	return result;
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	const intersectedIds = await client.sInter([usersLikesKey(userOneId), usersLikesKey(userTwoId)]);

	return await getItems(intersectedIds);
};
