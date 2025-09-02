import { client } from '$services/redis/client';
import { itemsIndexKey } from '../../../seeds/seed-keys';
import { SchemaFieldTypes } from 'redis';

export const createIndexes = async () => {
	const indexes = await client.ft._list();
	const exists = indexes.find((index) => index === itemsIndexKey());

	if (exists) { // index should be created once
		return;
	}

	return client.ft.create(itemsIndexKey(), {
		name: {
			type: SchemaFieldTypes.TEXT
		},
		description: {
			type: SchemaFieldTypes.TEXT
		}
	});
};
