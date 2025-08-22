import type { Session } from '$services/types';
import { sessionKey } from '$services/keys';
import { client } from '$services/redis';

const deserializeSession = (id: string, session: Record<string, string | number>): Record<string, string | number> => {
	return {
		id,
		userId: session.userId,
		username: session.username,
	};
};

const serializeSession = (session: Session): Record<string, string | number> => {
	return{
		userId: session.userId,
		username: session.username,
	}
}

export const getSession = async (id: string) => {
	const session = await client.hGetAll(sessionKey(id));

	if (Object.keys(session).length === 0) return null;

	return deserializeSession(id, session);
};

export const saveSession = async (session: Session) => {
	const result = client.hSet(sessionKey(session.id), serializeSession(session));

	return result;
};
