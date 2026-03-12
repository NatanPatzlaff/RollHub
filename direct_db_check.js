import Database from 'better-sqlite3';
const db = new Database('database.sqlite');

try {
    const campaigns = db.prepare('SELECT id, name, dddice_room_slug FROM campaigns').all();
    console.log('Campaigns:', JSON.stringify(campaigns, null, 2));

    const characters = db.prepare('SELECT id, name FROM characters LIMIT 5').all();
    console.log('Characters:', JSON.stringify(characters, null, 2));

    const members = db.prepare('SELECT * FROM campaign_members').all();
    console.log('Campaign Members:', JSON.stringify(members, null, 2));
} catch (e) {
    console.error('Error:', e.message);
} finally {
    db.close();
}
