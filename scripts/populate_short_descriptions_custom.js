import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const mdPath = path.join(process.cwd(), 'Rituais resumido.md');

const db = new Database(dbPath);

console.log('Reading Rituais resumido.md...');
const content = fs.readFileSync(mdPath, 'utf-8');

const lines = content.split('\n').map(l => l.trim());

let currentName = null;
let updated = 0;
let notFound = 0;

for (const line of lines) {
    // Try to match lines like "Alterar Destino (Energia 4)"
    // or "Amaldiçoar Arma (Conhecimento...)"
    if (line.match(/^(.+?)\s*\([^)]+\d+\)$/i) && !line.startsWith('Alcance')) {
        const match = line.match(/^(.+?)\s*\(/);
        if (match) {
            currentName = match[1].trim();
        }
    } else if (line.startsWith('Efeito Básico:')) {
        if (currentName) {
            const shortDesc = line.replace('Efeito Básico:', '').trim();

            const stmt = db.prepare('UPDATE rituals SET short_description = ? WHERE name LIKE ?');
            const result = stmt.run(shortDesc, `${currentName}%`);

            if (result.changes > 0) {
                updated++;
            } else {
                notFound++;
                console.log(`Ritual not found in DB: ${currentName}`);
            }
            currentName = null; // Reset until next name
        }
    }
}

console.log(`\nUpdate complete: ${updated} rituals updated, ${notFound} not found.`);
db.close();
