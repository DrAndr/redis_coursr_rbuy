import type { CreateUserAttrs } from '$services/types';
import { v4 as uuid } from 'uuid';
import { userKey, usernamesUniqueKey } from '$services/keys';
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


};

export const getUserById = async (id: string):Promise<ISerializeData> => {
	const user = await client.hGetAll(userKey(id));
	return deSerializeCreateUser(parseInt(id), user);
};

export const createUser = async (attrs: CreateUserAttrs):Promise<string|number> => {
	const uid = uuid();

	const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username); // check is username unique
	if (exists) {
		throw new Error('Username is taken');
	}

	await client.hSet(userKey(uid), serializeCreateUser(attrs) as ISerializeData); //add user
	await client.sAdd(usernamesUniqueKey(), attrs.username); // add username to the stack

	return uid;
};



