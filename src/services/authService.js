import config from '../config/db.js';
import pkg from 'pg'
const { Client, Pool } = pkg;

export default class AuthService {
    getByUsername = async (username) => {
        let returnArray = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT * FROM \"Usuarios\" WHERE username = $1`;
            const result = await client.query(sql, [username]);
            await client.end();
            returnArray = (result.rows && result.rows.length > 0) ? result.rows[0] : null;
        } catch (error) {
            LogHelper.logError(error);
        } return returnArray;
    }
}