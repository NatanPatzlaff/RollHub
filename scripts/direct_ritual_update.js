import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const mdPath = path.join(process.cwd(), 'Rituais.md');

const db = new Database(dbPath);

console.log('Reading Rituais.md...');
const content = fs.readFileSync(mdPath, 'utf-8');

// The file starts with an intro text. The first ritual block starts around line 3.
// Let's split by double newlines.
const blocks = content.split(/\n\s*\n/);

let updated = 0;
let notFound = 0;

for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 3) continue;

    // The first line should be the name if it's a ritual block
    // How to distinguish from intro? Intro has "Aqui estão as descrições..."
    if (lines[0].toLowerCase().includes("aqui estão")) continue;

    const name = lines[0];

    // We can skip the elements line (lines[1]) and the meta lines
    let descriptionLines = [];
    let discente = '';
    let verdadeiro = '';

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('Execução:') || line.startsWith('Alcance:') || line.startsWith('Alvo:') || line.startsWith('Duração:') || line.startsWith('Resistência:')) {
            continue;
        }

        if (line.startsWith('Discente')) {
            discente = line;
        } else if (line.startsWith('Verdadeiro')) {
            verdadeiro = line;
        } else {
            descriptionLines.push(line);
        }
    }

    const description = descriptionLines.join('\n');

    if (description) {
        // Try to update the DB
        const stmt = db.prepare('UPDATE rituals SET description = ?, discente = ?, verdadeiro = ? WHERE name LIKE ?');
        const result = stmt.run(description, discente || null, verdadeiro || null, name);

        if (result.changes > 0) {
            updated++;
        } else {
            notFound++;
            console.log(`Ritual not found in DB: ${name}`);
        }
    }
}

console.log(`\nUpdate complete: ${updated} rituals updated, ${notFound} not found.`);
db.close();
