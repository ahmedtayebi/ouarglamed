const { Client } = require('pg');

const run = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log("Connected successfully!");
        const res = await client.query('SELECT NOW()');
        console.log(res.rows);
    } catch (err) {
        console.error("Connection error", err.stack);
    } finally {
        await client.end();
    }
}
run();
