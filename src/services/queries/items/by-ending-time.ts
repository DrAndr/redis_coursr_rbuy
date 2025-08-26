import { client } from '$services/redis';
import { itemKey, itemsByEndingAtKey } from '$services/keys';
import { deserialize } from '$services/queries/items/deserialize';

export const itemsByEndingTime = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	// get not expired items
	const ids = await client.zRange(itemsByEndingAtKey(), String(Date.now()), '+inf', {
		BY: 'SCORE',
		LIMIT: { offset, count }
	});

	const result = await Promise.all(ids.map((id) => client.hGetAll(itemKey(id))));

	return result.map((item, i) => deserialize(ids.at(i), item));
};
