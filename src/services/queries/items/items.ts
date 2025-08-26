import type { CreateItemAttrs, Item } from '$services/types';
import { serialize } from '$services/queries/items/serialize';
import { deserialize } from '$services/queries/items/deserialize';
import { client } from '$services/redis';
import { itemKey, itemsByEndingAtKey, itemsByViewsKey } from '$services/keys';
import isEmpty from 'lodash/isEmpty';
import { genId } from '$services/utils';

export const getItem = async (id: string): Promise<Item | null> => {
	const item = await client.hGetAll(itemKey(id));

	if (Object.keys(item).length === 0) return null;

	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	// const bandle = ids.map(id => client.hGetAll(itemKey(id)));
	// const items = await Promise.all(bandle);
	//
	// return items.map((item, i) => {
	// 	if(Object.keys(item).length === 0) {
	// 	  return null
	// 	};
	//
	// 	return deserialize(ids.at(i), item);
	// })

	return Promise.all(
		ids.map(async (id) => {
			const item = await client.hGetAll(itemKey(id));
			return isEmpty(item) ? null : deserialize(id, item);
		})
	);
};

export const createItem = async (attrs: CreateItemAttrs) => {
	const itemId = genId();

	await Promise.all([
		client.hSet(itemKey(itemId), serialize(attrs)),
		client.zAdd(itemsByViewsKey(), {
			value: itemId,
			score: 0 // initial views score
		}),
		client.zAdd(itemsByEndingAtKey(), {
			value: itemId,
			score: attrs.endingAt.toMillis()
		})
	])

	return itemId;
};
