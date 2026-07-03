import config from '../config/db.js';
import pkg from 'pg';
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
                    p.image_url, 
                    p.description, 
                    p.likes, 
                    p.created_at,
                    u.username,
                    u.pfp AS user_pfp
                FROM "Posts" p
                JOIN "Usuarios" u ON p.user_id = u.id
                ORDER BY p.created_at DESC;
            `;
            
            const result = await client.query(sql);
            await client.end();
            
            return result.rows;
        } catch (error) {
            console.error("Error en PostService.getAllPosts:", error);
            throw error;
        }
    }
}