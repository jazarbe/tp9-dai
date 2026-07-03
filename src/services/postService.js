import config from '../config/db.js';
import pkg from 'pg';
import LogHelper from '../helpers/logHelper.js'; 

const { Client } = pkg;

export default class PostService {
    getAllPosts = async () => {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `
                SELECT 
                    p.id, 
                    p.user_id, 
                    p.url_image, 
                    p.description, 
                    p.likes, 
                    p."creation:date",
                    u.username,
                    u.pfp AS user_pfp
                FROM "Publicaciones" p
                JOIN "Usuarios" u ON p.user_id = u.id
                ORDER BY p."creation:date" DESC;
            `;
            
            const result = await client.query(sql);
            await client.end();
            
            return result.rows;
        } catch (error) {
            LogHelper.logError(error);
            throw error;
        }
    }
    createPost = async (postData) => {
        const client = new Client(config);
        const { url_image, description, userId } = postData;
        try {
            await client.connect();
            
            const sql = `
                INSERT INTO "Publicaciones" (url_image, description, likes, "creation:date", user_id)
                VALUES ($1, $2, 0, NOW(), $3)
                RETURNING id, url_image, description, likes, "creation:date", user_id;
            `;
            
            const values = [url_image, description, userId];
            const result = await client.query(sql, values);
            await client.end();
            
            return result.rows[0];
        } catch (error) {
            LogHelper.logError(error);
            throw error;
        }
    }
}