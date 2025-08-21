import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	console.log('Running sandbox...');

	const resultHSet = await client.hSet('car', {
		color: "red",
		year: 1950
	});
	console.log('resultHSet', resultHSet);

	const resultGet = await client.hGetAll('car');
	console.log('run GET', resultGet);
};
run();
