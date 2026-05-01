import fs from 'fs'
import path from 'path'

// Função para extrair nome e perícias do markdown
function parseMarkdown(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const monsters = new Map<string, any>()
  
  let currentMonster = null

  for (let line of lines) {
    if (line.startsWith('### ')) {
      currentMonster = line.replace('### ', '').trim()
      monsters.set(currentMonster, {})
    } else if (currentMonster) {
      if (line.includes('**Sentidos:**')) {
        monsters.get(currentMonster).sentidos = line
      } else if (line.includes('**Defesa:**')) {
        monsters.get(currentMonster).defesaLine = line
      } else if (line.includes('**Atributos:**')) {
        monsters.get(currentMonster).atributos = line
      } else if (line.includes('**Perícias:**')) {
        monsters.get(currentMonster).periciasLine = line
      }
    }
  }
  return monsters
}

const mdData = parseMarkdown('./ordem dividido/Criaturas.md')

// Exibir o de Aberração de Carne
console.log("Aberração de Carne no MD:")
console.log(mdData.get('Aberração de Carne'))

