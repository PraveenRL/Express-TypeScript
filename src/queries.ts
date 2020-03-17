import { Pool } from 'pg';

export const pool = new Pool({
    user: "me",
    host: "localhost",
    database: "test",
    password: "password",
    port: 5432
})

export default {
    query(querytext, params) {
        return new Promise((resolve, reject) => {
            pool.query(querytext, params)
                .then((res) => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}