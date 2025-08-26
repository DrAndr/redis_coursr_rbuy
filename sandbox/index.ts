import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	console.log('Running sandbox...');

	// const resultHSet = await client.hSet('car', {
	// 	color: "red",
	// 	year: 1950,
	// 	// engine: JSON.stringify({ cylinders: 8 }), // [Object, Object]
	// 	// owner: null, // error cant read null as a string
	// 	// service: undefined // error cant read undefined as a string
	// });
	// console.log('resultHSet', resultHSet);

	const resultGet = await client.hKeys('*');

	// if(Object.keys(resultGet).length === 0){
	// 	console.log('Car not found.');
	// 	return;
	// }
	//
	console.log('run GET', resultGet);
};
run();
