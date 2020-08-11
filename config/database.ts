import { Pool } from "pg";
// const redis = require('redis');
import { createClient } from "redis";

export function poolFunction() {
    return new Pool({
        connectionString: `postgres://postgres:SaansHealth0709!@3.219.32.149:5432/carefirst`
    });
}

export function redisFunction() {

    let port = Number(process.env.REDIS_PORT);
    let client = {
        port: port,
        host: `${process.env.REDIS_HOST}`,
        options: {
            db: `${process.env.REDIS_DB}`,
            port: port,
            host: `${process.env.REDIS_HOST}`,
            password: `${process.env.REDIS_PASSWORD}`
        }
    }

    return createClient(client);

}