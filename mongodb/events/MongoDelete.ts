import { DeleteResult } from "mongodb";
import { MongoCommand } from "../MongoTypes";

const command: MongoCommand<DeleteResult | boolean> = {
    async execute(col, command, options) {
        const { client, db, collection } = col;
        return new Promise((res, err) => {
            if (command !== 'delete')
                return false;

            const database = client.db(db.databaseName).collection(collection);
            if (options.many) {
                database.deleteMany(options.doc, options.deleteOpt,
                    (e, cur) => {
                        e ? err(e) : res(cur);
                    })
            } else {
                database.deleteOne(options.doc, options.deleteOpt,
                    (e, cur) => {
                        e ? err(e) : res(cur);
                    })
            }
        })
    },
}

export { command };
