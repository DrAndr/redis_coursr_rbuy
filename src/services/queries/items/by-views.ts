import { client } from '$services/redis';
import { itemKey, itemsByViewsKey } from '$services/keys';
import { deserialize } from './deserialize';
import isEmpty from 'lodash/isEmpty';

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	let results: any = await client.sort(itemsByViewsKey(), {
		GET: [
			'#',
			`${itemKey('*')}->name`,
			`${itemKey('*')}->views`,
			`${itemKey('*')}->endingAt`,
			`${itemKey('*')}->imageUrl`,
			`${itemKey('*')}->price`
		],
		BY: 'nosort',
		DIRECTION: order,
		LIMIT: { offset, count }
	});

	if (!Array.isArray(results)) return;

	let items = [];
	while (!isEmpty(results)) {
		const [id, name, views, endingAt, imageUrl, price, ...rest] = results;
		const item = deserialize(String(id), { name, views, endingAt, imageUrl, price });
		items.push(item);
		results = rest;
	}

	return items;
};
