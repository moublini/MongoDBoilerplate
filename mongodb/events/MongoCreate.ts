import { MongoCommand } from "../MongoTypes";

const command: MongoCommand<unknown | boolean> = {
    async execute(col, command, options) {
        const { client, db, collection } = col;
        return new Promise((res, err) => {
            if (command !== 'create')
                return false;

            const database = client.db(db.databaseName).collection(collection)
            if (options.many && Array.isArray(options.doc)) {
                database.insertMany(options.doc,
                    (e, cur) => {
                        e ? err(e) : res(cur);
                    })
            } else {
                database.insertOne(options.doc,
                    (e, cur) => {
                        e ? err(e) : res(cur);
                    })
            }
        })
    }
}
export { command };
