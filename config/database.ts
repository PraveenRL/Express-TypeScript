import { Pool } from "pg";
const redis = require('redis');

export function poolFunction() {

    const isProduction = process.env.NODE_ENV === 'production';

    const devPool = {
        user: `${process.env.DB_USER}`,
        host: `${process.env.DB_HOST}`,
        database: `${process.env.DB_DATABASE}`,
        password: `${process.env.DB_PASSWORD}`,
        port: parseInt(`${process.env.DB_PORT}`)
    }

    const devPoolString =
        `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

    let connectionPool = isProduction ? process.env.DATABASE_URL : devPoolString;

    return new Pool({
        connectionString: `postgres://postgres:SaansHealth0709!@3.219.32.149:5432/carefirst`
        // ssl: {
        //     rejectUnauthorized: false
        // }
    });

}

export function redisFunction() {
    const isProduction = process.env.NODE_ENV === 'production';

    const local = {
        port: `${process.env.REDIS_PORT}`,
        host: `${process.env.REDIS_HOST}`,
        db: `${process.env.REDIS_DB}`
    }

    const production = {
        port: `${process.env.REDIS_PORT}`,
        host: `${process.env.REDIS_HOST}`,
        db: `${process.env.REDIS_DB}`,
        password: `${process.env.REDIS_PASSWORD}`
    }

    let client = isProduction ? production : local;
    console.log(client);

    return redis.createClient(client);
}