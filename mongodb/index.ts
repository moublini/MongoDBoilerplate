
import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import Client, { HandleOptions, MongoCommand } from './MongoTypes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads Files from a directory
 * @param dirPath - The directory path to read the files from.
 * @returns A Promise. if resolved it contains an array with commands, if not a string error;
 */
async function loadFiles(dirPath: string): Promise<MongoCommand<any>[]> {
    let cmdArray: MongoCommand<any>[] = [];
    const dir = fs.readdirSync(dirPath).filter(val => /^.*\.(ts|js)$/.test(val));
    return new Promise((res, err) => {
        dir.forEach(async (file) => {
            try {
                const filePath = `${dirPath}/${file}`;
                const { command } = await import(filePath);
                cmdArray.push(command);
                if (cmdArray.length === dir.length)
                    res(cmdArray);
            } catch (error) {
                err(error);
            }
        })
    })
}

let cmds: MongoCommand<any>[] = [];

const myClient = new Client(process.env.MONGOCLIENT_URL, process.env.DOC_LOCATION);
/**
 * Handles a request for modifying a collection in the mongodb database.
 * @param req - One of the given CRUD operation commands. 
 * @param args - The arguements to pass into the commands.
 * @returns a boolean if the operation succeded or a string message for an error.
 */
export default async function handleRequest(req: 'create' | 'find' | 'update' | 'delete', args: HandleOptions): Promise<unknown> {
    cmds = await loadFiles(path.resolve(__dirname, 'events'));
    return new Promise((res, err) => {
        const { client } = myClient;
        client.connect()
            .catch(error => err(error));

        //Loops thru every command available to execute the first one to match the req parameter.
        cmds.forEach(async (cmd) => {
            try {
                const result = await cmd.execute(myClient, req, args) || null;
                if (result)
                    res(result);
            } catch (error) {
                client.close()
                    .catch(error => err(error));
            }
        })
    })
};
