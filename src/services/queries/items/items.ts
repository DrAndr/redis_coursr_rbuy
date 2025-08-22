import type { CreateItemAttrs, Item } from '$services/types';
import {v4 as uuid} from 'uuid';
import { serialize } from '$services/queries/items/serialize';
import { deserialize } from '$services/queries/items/deserialize';
import { client } from '$services/redis';
import { itemKey } from '$services/keys';

export const getItem = async (id: string):Promise<Item | null> => {
	const item = await client.hGetAll(itemKey(id));

	if(Object.keys(item).length === 0) return null;

	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {};

export const createItem = async (attrs: CreateItemAttrs) => {
	const itemId = uuid();
	const response = await client.hSet(itemKey(itemId), serialize(attrs));

	return itemId;
};

