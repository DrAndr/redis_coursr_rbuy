import { createClient, defineScript } from 'redis';
import { itemKey, itemsByViewsKey, itemsViewsKey } from '$services/keys';


const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	// The "SCRIPT LOAD ..." implementation
	scripts: {
		// define script name and assign the script itself
		addOneAndStore: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT: `
				return redis.call('SET', KEYS[1], 1 + tonumber(ARGV[1]))
				`,
			transformArguments(key: string, value: number):string[] {
				return [key, value.toString()];
				// ['items:view', '55']  ==> to be transformed to ==> EVALSHA <ID> 1 'items:view' '55'
			},
			transformReply(reply: unknown): unknown { return reply; }
		}),
		incrementViews: defineScript({
			NUMBER_OF_KEYS: 3,
			SCRIPT: `
					local itemsViewsKey = KEYS[1]
					local itemKey = KEYS[2]
					local itemsByViewsKey = KEYS[3]
					local userId = ARGV[1]
					local itemId = ARGV[2]
					
					local inserted = redis.call('PFADD', itemsViewsKey, userId)
					
					if inserted == 1 then
						redis.call( 'HINCRBY', itemKey, 'views',1 )
						redis.call( 'ZINCRBY', 'itemsByViewsKey', 1, itemId )
					end
			`,
			transformArguments(itemId: string, userId: string):string[] {
				return [
					itemsViewsKey(itemId),  // items:views#asdf
					itemKey(itemId),        // item#asdf
					itemsByViewsKey(),      // items:views
					itemId,                 // asdf
					userId                  // u123
				];
				// EVALSHA <ID> 3 'items:views#asdf' 'item#asdf' 'items:views' 'asdf' 'u123'
			},
			transformReply():void { }
		})
	}
});

// The common test for the first implemented script:
// client.on('connect', async () => {
// 	await client.addOneAndStore('test:count', 5);
// 	const temp = await client.get('test:count');
// 	console.log('test the Lua scripting ', temp);
// })

client.on('error', (err) => console.error(err));
client.connect();

export { client };
