import {createConnection} from 'mysql2/promise';

export async function connect() {

    const connection = await createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'node_mysql_ts',
    });

    return connection;
}