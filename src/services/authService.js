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
    checkUserExists = async (username, email) => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT id FROM "Usuarios" WHERE username = $1 OR email = $2`;
            const result = await client.query(sql, [username, email]);
            await client.end();
            return result.rowCount > 0;
        } catch (error) {
            console.error("Error en checkUserExists:", error);
            throw error; 
        }
    }
    createUser = async (userData) => {
        const client = new Client(config);
        const { username, fullname, email, password, pfp, bio } = userData; 
        try {
            await client.connect();
            const sql = `
                INSERT INTO "Usuarios" (username, fullname, email, password, pfp, bio)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, username, email; 
            `;
            const values = [username, fullname, email, password, pfp, bio];
            const result = await client.query(sql, values);
            await client.end();
            return result.rows[0];
        } catch (error) {
            console.error("Error en createUser:", error);
            throw error;
        }
    }
}