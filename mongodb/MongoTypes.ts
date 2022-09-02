import { Db, DeleteOptions, MongoClient, MongoClientOptions, UpdateOptions } from "mongodb";

/**
 * Client stores information about a specific client, database and collection.
 * @example
 * ```javascript
 * const client = new Client('mongodb+srv://<username>:<password>@<cluster>.v7utudr.mongodb.net/?', 'MyDatabase.MyCollection');
 * ```
 */
export default class Client {
    constructor(uri: string, dbandcol: string, options?: MongoClientOptions) {
        const split_dbandcol = dbandcol.split('.');
        this._client = new MongoClient(uri, options);
        this._db = new Db(this.client, split_dbandcol[0]);
        this._collection = split_dbandcol[1];
    }

    private _client: MongoClient;
    private _db: Db;
    private _collection: string;
    public get collection(): string {
        return this._collection;
    }
    public set collection(v: string) {
        this._collection = v;
    }

    public get db(): Db {
        return this._db;
    }

    public set db(v: Db) {
        this._db = v;
    }

    public get client(): MongoClient {
        return this._client;
    }
    public set client(v: MongoClient) {
        this._client = v;
    }

}
/**
 * Type for the commands dedicated to the mongo database
 * @param execute - Handles a task for a single unique command.
 */
export interface MongoCommand<T> {
    /**
     * @param col - The client that will perform the operations on the collection.
     * @param cmd - The command that will be given to the function.
     * @param options - Required since the doc parameter must be specified for every command.
     * @returns A resolved promise with value true if the cmd parameter matches the unique command the function is assigned to, false if it doesn't.
     */
    execute: (col: Client, command: string, options: HandleOptions) => Promise<T>;
}

/**
 * Type for the options parameter inside MongoCommand
 */
export interface HandleOptions {
    doc: Record<undefined, any>[] | Record<undefined, any>,
    many?: boolean
    updateDoc?: Record<undefined, any>,
    updateOpt?: UpdateOptions,
    deleteOpt?: DeleteOptions
}
