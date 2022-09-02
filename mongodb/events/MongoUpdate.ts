import { MongoCommand } from "../MongoTypes";

const command: MongoCommand<any> = {
    async execute(col, command, options) {
        const { client, db, collection } = col;
        return new Promise((res, err) => {
            if (command !== 'update')
                return false;

            const database = client.db(db.databaseName).collection(collection);
            if (options.many) {
                database.updateMany(options.doc, options.updateDoc, options.updateOpt,
                    (e, cur) => {
                        e ? err(e) : res(cur);
                    })
            } else {
                database.updateOne(options.doc, options.updateDoc, options.updateOpt,
                    (e, cur) => {
                        e ? err(e) : res(cur);
                    })
            }
        })
    },
}

export { command };
