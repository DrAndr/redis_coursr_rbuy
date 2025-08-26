import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { userKey, usernamesUniqueKey, usernamesKey } from '$services/keys';
import { client } from '$services/redis';

type ISerializeData = Record<string, string | number>;

const serializeCreateUser = (attrs: CreateUserAttrs):ISerializeData => {
	return {
		username: attrs.username,
		password: attrs.password,
	};
}
const deSerializeCreateUser = (id:number, userData:ISerializeData):ISerializeData => {
	return {
		id,
		username: userData.username,
		password: userData.password,
	};
}

export const getUserByUsername = async (username: string) => {
const result = await client.zScore(usernamesKey(),username);
if (!result) throw new Error('User does not exists');

const userId = result.toString(16);

return await getUserById(userId);
};

export const getUserById = async (id: string):Promise<ISerializeData> => {
	const user = await client.hGetAll(userKey(id));
	console.log('id',id,'user', user);
	return deSerializeCreateUser(parseInt(id), user);
};

export const createUser = async (attrs: CreateUserAttrs):Promise<string|number> => {
	const id = genId();

	const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username); // check is username unique
	if (exists) {
		throw new Error('Username is taken');
	}

	await client.hSet(userKey(id), serializeCreateUser(attrs) as ISerializeData); //add user
	await client.sAdd(usernamesUniqueKey(), attrs.username); // add username to the stack
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(id, 16)
	})

	return id;
};



