import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

console.log('Populating short descriptions...');

// Get all rituals
const rituals = db.prepare('SELECT id, description FROM rituals WHERE description IS NOT NULL').all();

let updated = 0;

for (const ritual of rituals) {
    let shortDesc = ritual.description;

    // A simple heuristic: take the first sentence (up to the first period).
    // If the first sentence is too long or there is no period, just truncate at 150 chars.
    const firstPeriodIndex = shortDesc.indexOf('.');

    if (firstPeriodIndex !== -1 && firstPeriodIndex < 200) {
        shortDesc = shortDesc.substring(0, firstPeriodIndex + 1);
    } else {
        shortDesc = shortDesc.length > 150 ? shortDesc.substring(0, 147) + '...' : shortDesc;
    }

    // Further cleanup if it spans multiple lines unnecessarily
    shortDesc = shortDesc.split('\n')[0].trim();

    // Update
    const stmt = db.prepare('UPDATE rituals SET short_description = ? WHERE id = ?');
    stmt.run(shortDesc, ritual.id);
    updated++;
}

console.log(`Updated ${updated} rituals with short descriptions.`);
db.close();
