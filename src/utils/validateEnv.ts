import { cleanEnv, port, str, host, num } from "envalid";

export function validateEnv() {
    cleanEnv(process.env, {
        PORT: port(),
        JWT_SECRET: str(),
        DB_USER: str(),
        DB_PASSWORD: str(),
        DB_HOST: host(),
        DB_PORT: port(),
        DB_DATABASE: str(),
        REDIS_PORT: port(),
        REDIS_HOST: host(),
        REDIS_DB: num(),
        REDIS_PASSWORD: str()
    })
}