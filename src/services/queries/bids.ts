import type { CreateBidAttrs, Bid } from '$services/types';
import { bidHistoryKey, itemKey, itemsByPriceKey } from '$services/keys';
import { getItem } from '$services/queries/items';
import { client } from '$services/redis';
import { DateTime } from 'luxon';
import map from 'lodash/map';

export const createBid = async (attrs: CreateBidAttrs) => {
	// Run isolated connection for conduct transaction
	return await client.executeIsolated(async (isolatedClient)=>{
		const item = await getItem(attrs.itemId);

		if (!item) {
			throw new Error("Item does not exist");
		}
		if (item.price >= attrs.amount) {
			throw new Error("Bid to low");
		}
		if (item.endingAt.diff(DateTime.now()).toMillis() <= 0) {
			throw new Error("Item closed to bidding");
		}

		const data = serializeHistory(attrs.amount, attrs.createdAt.toMillis());

		return isolatedClient.multi() // start multiplication requests
			.rPush(bidHistoryKey(attrs.itemId), data) // update bid history
			.hSet(itemKey(item.id),{// update item price with new bid amount
				bids: item.bids + 1, // how many times bid has been changed
				price: attrs.amount, // new price according to new bid
				highestBidUserId: attrs.userId // the ID of the user who last made a new bet
			})
			.zAdd(itemsByPriceKey(), { // add data to the table for define costly items
				value: item.id,
				score: attrs.amount
			})
			.exec() // execute multiple requests
	})


};

export const getBidHistory = async (
	itemId: string,
	offset: number = 0,
	count: number = 10
): Promise<Bid[]> => {
	const from: number = -1 * offset - count;
	const to: number = -1 - offset;
	const bidHistory: string[] = await client.lRange(bidHistoryKey(itemId), from, to);

	return bidHistory ? map(bidHistory, (item: string): Bid => deserializeHistory(item)) : [];
};

const serializeHistory = (amount: number, createdAt: number): string => {
	return `${amount}:${createdAt}`;
};

const deserializeHistory = (story: string): Bid => {
	const values: string[] = story.split(':');

	return {
		amount: parseFloat(values[0]),
		createdAt: DateTime.fromMillis(parseInt(values[1]))
	};
};
