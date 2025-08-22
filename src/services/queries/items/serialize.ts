import type { CreateItemAttrs } from '$services/types';

export const serialize = (attrs: CreateItemAttrs) => {
	return {
		...attrs,
		createdAt: attrs?.createdAt.toMillis(), //DateTime;
		endingAt: attrs.endingAt.toMillis(), //DateTime;
	};
};
