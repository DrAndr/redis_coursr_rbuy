import type { Item } from '$services/types';
import { DateTime } from 'luxon';

export const deserialize = (id: string, item: { [key: string]: string }): Item => {


	return {
		...item,
		id,// string;
		createdAt:  DateTime.fromMillis(parseInt(item.createdAt)),//DateTime;
		endingAt:   DateTime.fromMillis(parseInt(item.endingAt)),//DateTime;
		views:  parseInt(item.views),//number;
		likes: parseInt(item.likes),// number;
		price: parseFloat(item.price),// number;
		bids: parseInt(item.bids),// number;
	} as Item;
};
