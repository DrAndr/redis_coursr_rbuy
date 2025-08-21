import { client } from '$services/redis';
import { pageCacheKey } from '$services/keys';

const cacheRouts = ['/about', '/privacy', '/auth/signin', '/auth/signup'];

export const getCachedPage = (route: string): Promise<string | null> => {
	if (cacheRouts.includes(route)) {
		return client.get(pageCacheKey(route));
	}
	return null;
};

export const setCachedPage = (route: string, page: string): Promise<string | null> => {
	if (cacheRouts.includes(route)) {
		return client.set(pageCacheKey(route), page, { EX: 2 }); // 2 seconds for testing
	}
	return null;
};
