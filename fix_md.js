const fs = require('fs');
let content = fs.readFileSync('ordem dividido/Criaturas.md', 'utf-8');

// The new creatures don't have the divider. Let's add the divider before every capitalized loose title. 
// A better way: replace lines starting with ' Elemento:' to have a separator before the previous line.
const lines = content.split('\n');
let newLines = [];
let insideNew = false;
for(let i=0; i<lines.length; i++) {
    let line = lines[i];
    
    // Remove leading dot and space
    if (line.trim().startsWith('.')) {
        line = line.trim().substring(1).trim();
    }
    
    if (line.includes('Elemento:')) {
        // The line before this is the title. The line before that should be the divider.
        if (newLines.length >= 2 && !newLines[newLines.length-2].includes('----')) {
            // Need to insert separator before name
            const name = newLines.pop();
            newLines.push('--------------------------------------------------------------------------------');
            newLines.push(name.trim());
        }
    }
    
    // Ignore the headers
    if (line.includes('⚡ CRIATURAS DE ENERGIA') || line.includes('👤 AMEAÇAS DA REALIDADE') || line.includes('CRIMINOSOS & MERCENÁRIOS') || line.includes('CULTISTAS') || line.includes('FORÇAS DA LEI') || line.includes('ANIMAIS E FERAS') || line.includes('(Observação: Humanos e')) {
        continue;
    }
    
    newLines.push(line);
}

fs.writeFileSync('ordem dividido/Criaturas.md', newLines.join('\n'));
