import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
const exampleEnvPath = path.resolve(process.cwd(), '.env.example');

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else if (fs.existsSync(exampleEnvPath)) {
    dotenv.config({ path: exampleEnvPath });
} else {
    throw new Error('No .env or .env.example file found. Please create one with the required database variables.');
}

const requiredVars = ['DB_NAME', 'DB_USER', 'DB_PASS'];
for (const name of requiredVars) {
    if (!process.env[name]) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
}

const config = {
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT || 5432)
}

export default config;