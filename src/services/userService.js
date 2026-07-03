import config from '../config/db.js';
import pkg from 'pg';
import LogHelper from '../helpers/logHelper.js';
const { Client } = pkg;

export default class UserService {
    getProfileWithPosts = async (userId) => {
        const client = new Client(config);
        try {
            await client.connect();
            
            const userSql = `SELECT id, username, fullname, email, pfp, bio FROM "Usuarios" WHERE id = $1`;
            const userResult = await client.query(userSql, [userId]);
            
            if (userResult.rows.length === 0) return null;
            const user = userResult.rows[0];

            const postsSql = `SELECT id, url_image, description, likes, "creation:date" FROM "Publicaciones" WHERE user_id = $1`;
            const postsResult = await client.query(postsSql, [userId]);

            await client.end();

            return {
                ...user,
                publications: postsResult.rows
            };
        } catch (error) {
            LogHelper.logError(error);
            throw error;
        }
    }

    updateProfile = async (userId, data) => {
        const client = new Client(config);
        const { fullname, bio, pfp } = data;
        try {
            await client.connect();
            const sql = `
                UPDATE "Usuarios" SET fullname = COALESCE($1, fullname), 
                    bio = COALESCE($2, bio), 
                    pfp = COALESCE($3, pfp)
                WHERE id = $4
                RETURNING id, username, fullname, email, pfp, bio;
            `;
            const result = await client.query(sql, [fullname, bio, pfp, userId]);
            await client.end();
            return result.rows[0];
        } catch (error) {
            LogHelper.logError(error);
            throw error;
        }
    }
}