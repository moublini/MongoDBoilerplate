import { FindCursor, ObjectId } from "mongodb";
import { MongoCommand } from "../MongoTypes";

const command: MongoCommand<FindCursor | ObjectId | unknown> = {
    async execute(col, command, options) {
        const { client, db, collection } = col;
        return new Promise((res, err) => {
            if (command !== 'find') {
                return false;
            }
            const database = client.db(db.databaseName).collection(collection);
            if (options.many) {
                res(database.find(options.doc));
            } else {
                database.findOne(options.doc,
                    (e, cur) => {
                        e ? err(e) : res(cur);
                    })
            }
        })
    },
}

export { command };
