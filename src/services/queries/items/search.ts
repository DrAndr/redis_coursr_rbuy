import isEmpty from 'lodash/isEmpty';
import { client } from '$services/redis';
import { itemsIndexKey } from '../../../../seeds/seed-keys';
import map from 'lodash/map';
import { deserialize } from '$services/queries/items/deserialize';

export const searchItems = async (term: string, size: number = 5) => {
	const trimmed = term
		.replaceAll(/[^a-zA-Z0-9]/g, '')
		.trim()
		.split(' ')
		.map((word) => (word ? `%${word}%` : ''))
		.join(' ');

	// Looks at cleaned and make sure it is valid
	if (isEmpty(trimmed)) {
		return [];
	}

	const query = `(@name:(${trimmed}) => { $weight: 5.0 }) | (@description:(${trimmed})) `

	// Use the client to do an actual search
	const results = await client.ft.search(itemsIndexKey(), query, {
		LIMIT: {
			from: 0,
			size
		}
	});

	console.log('search results', results);

	// Deserialize and return the search result
	return map(results.documents, ({ id, value }) => deserialize(id, value));
};
