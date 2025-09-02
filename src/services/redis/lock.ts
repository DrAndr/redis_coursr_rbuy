import {randomBytes} from 'crypto';
import {client } from './client';


export const withLock = async (key: string, cb: () => any) => {
	//  initialize a few variables to control retry behaviour
	const retryDelayMS: number = 100;
	let retries: number = 20;

	// Generate a random value to store at the lock key
	const token = randomBytes(6).toString('hex');
	// Create the lock key
	const lockKey = `lock:${key}`;

	// Set up a while loop to implement the retry behaviour
	while(retries >=0){
		retries -= 1;
		// Try to do a SET NX operation
		const acquired = await client.set(lockKey, token, {NX: true})

		if(!acquired){
			// ELSE brief pause (retryDelayMS) and then retry again
			await pause(retryDelayMS);
			continue;
		}

		// IF the SET NX has been successful, then run the callback
		const result = await cb();
		// FINALLY unset the lock key
		await client.del(lockKey);

		return result;
	}







};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
