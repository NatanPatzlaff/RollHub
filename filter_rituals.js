import fs from 'fs';

const rituals = JSON.parse(fs.readFileSync('rituais_dump.json', 'utf8'));

// Regex to detect direct damage:
// it must handle formats like: "causa 2d8+2 pontos de dano", "sofrem 10d6 de dano", "2d8+2 pontos de dano"
const damageRegex = /(causa|sofrem|sofre)\s+.*?\d+d\d+([+-]\d+)?\s*(pontos de\s*)?dano|dano\s+(de\s+)?\d+d\d+([+-]\d+)?|\d+d\d+([+-]\d+)?\s*(pontos de\s*)?dano/i;

const noDamageRituals = rituals.filter(r => {
  const fullText = [r.description, r.discente, r.verdadeiro].filter(Boolean).join(' ');
  return !damageRegex.test(fullText);
});

// Group by element and circle
const grouped = {};
for (const r of noDamageRituals) {
  if (!grouped[r.element]) grouped[r.element] = {};
  if (!grouped[r.element][r.circle]) grouped[r.element][r.circle] = [];
  grouped[r.element][r.circle].push(r);
}

// Generate Markdown
let md = `# Levantamento: Rituais Sem Dano Direto\n\n`;
md += `Abaixo estão listados os rituais que **não causam dano direto** (como rolagens de dano) baseados na sua descrição. Isso inclui rituais de utilidade, buffs, debuffs, cura e controle.\n\n`;

const elements = Object.keys(grouped).sort();
for (const el of elements) {
  md += `## Elemento: ${el}\n\n`;
  const circles = Object.keys(grouped[el]).map(Number).sort();
  for (const c of circles) {
    md += `### ${c}º Círculo\n`;
    grouped[el][c].sort((a, b) => a.name.localeCompare(b.name));
    for (const r of grouped[el][c]) {
      md += `- **${r.name}**\n`;
    }
    md += `\n`;
  }
}

fs.writeFileSync('rituais_sem_dano.md', md);
console.log('Gerado rituais_sem_dano.md com ' + noDamageRituals.length + ' rituais.');
