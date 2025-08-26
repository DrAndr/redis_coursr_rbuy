export type ICacheKey = string;

export const pageCacheKey = (rout: string): ICacheKey => `pagecache#${rout}`;
export const sessionKey = (sessionId: string): ICacheKey => `session#${sessionId}`;

// Items keys
export const itemKey = (sessionId: string): ICacheKey => `item#${sessionId}`;
export const itemsByViewsKey = () => 'items:views';
export const itemsByEndingAtKey = () => 'items:endingAt';

// Users keys
export const userKey = (userId: string): ICacheKey => `user#${userId}`;
export const usernamesUniqueKey = (): ICacheKey => 'usernames:unique';
export const usersLikesKey = (userId: string): ICacheKey => `users:likes#${userId}`;
export const usernamesKey = (): ICacheKey => 'usernames';