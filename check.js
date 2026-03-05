import mysql from 'mysql2/promise';

async function main() {
    try {
        const conn = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            database: 'escudo do mestre'
        });
        const [rows2] = await conn.execute('SELECT * FROM weapon_modifications WHERE name LIKE "%Dum%" OR name LIKE "%Explosiv%"');
        console.log('weapon_modifications specific:', rows2);

        // Also, list all modifications to see what we have
        const [allMods] = await conn.execute('SELECT id, name, type FROM weapon_modifications');
        console.log('all_modifications types:', allMods);

        process.exit();
    } catch (e) { console.error(e); process.exit(1); }
}
main();
