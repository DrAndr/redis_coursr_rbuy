export type ICacheKey = string;

export const pageCacheKey = (rout: string): ICacheKey => `pagecache#${rout}`;
export const userKey = (userId: string): ICacheKey => `user#${userId}`;
export const sessionKey = (sessionId: string): ICacheKey => `session#${sessionId}`;
export const itemKey = (sessionId: string): ICacheKey => `item#${sessionId}`;
export const usernamesUniqueKey = (): ICacheKey => 'usernames:unique';
export const usersLikesKey = (userId: string): ICacheKey => `users:likes#${userId}`;