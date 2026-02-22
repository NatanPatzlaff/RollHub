import mysql from 'mysql2/promise'

async function main() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'escudo do mestre'
  })

  // Atualizar classe Especialista (id=3)
  await conn.query(`
    UPDATE classes SET 
      base_hp = 16,
      hp_per_level = 3,
      hp_attribute = 'vigor',
      base_pe = 3,
      pe_per_level = 3,
      pe_attribute = 'presence',
      base_sanity = 16,
      sanity_per_level = 4,
      proficiencies = '["Armas simples", "Proteções leves"]',
      trained_skills_rules = '{"description": "Uma quantidade de perícias à sua escolha igual a 7 + Intelecto"}'
    WHERE id = 3
  `)

  console.log('Classe Especialista atualizada!')

  // Deletar progressões antigas do Especialista
  await conn.query('DELETE FROM class_progressions WHERE class_id = 3')
  console.log('Progressões antigas deletadas')

  // Inserir novas progressões do Especialista
  const progressions = [
    [3, 5, 'Eclético, Perito', 'Eclético permite usar qualquer perícia sem penalidade. Perito (2 PE, +1d6)', 'ABILITY'],
    [3, 10, 'Habilidade de Trilha', 'Habilidade especial da trilha escolhida', 'TRAIL_ABILITY'],
    [3, 15, 'Poder de Especialista', 'Poder especial da classe Especialista', 'CLASS_POWER'],
    [3, 20, 'Aumento de Atributo', 'Você pode aumentar um atributo em +1 (limite 5).', 'ATTRIBUTE_BUFF'],
    [3, 25, 'Perito', 'Perito (3 PE, +1d8)', 'ABILITY'],
    [3, 30, 'Poder de Especialista', 'Poder especial da classe Especialista', 'CLASS_POWER'],
    [3, 35, 'Grau de Treinamento', 'Aumenta o grau de treinamento em uma perícia', 'SKILL_TRAINING'],
    [3, 40, 'Engenhosidade (veterano), Habilidade de Trilha', 'Engenhosidade permite rerollar testes de perícia. Habilidade especial da trilha', 'TRAIL_ABILITY'],
    [3, 45, 'Poder de Especialista', 'Poder especial da classe Especialista', 'CLASS_POWER'],
    [3, 50, 'Aumento de Atributo, Versatilidade', 'Você pode aumentar um atributo em +1 (limite 5). Versatilidade permite trocar poderes', 'ATTRIBUTE_BUFF'],
    [3, 55, 'Perito', 'Perito (4 PE, +1d10)', 'ABILITY'],
    [3, 60, 'Poder de Especialista', 'Poder especial da classe Especialista', 'CLASS_POWER'],
    [3, 65, 'Habilidade de Trilha', 'Habilidade especial da trilha escolhida', 'TRAIL_ABILITY'],
    [3, 70, 'Grau de Treinamento', 'Aumenta o grau de treinamento em uma perícia', 'SKILL_TRAINING'],
    [3, 75, 'Engenhosidade (expert), Poder de Especialista', 'Engenhosidade (expert) e poder de especialista', 'CLASS_POWER'],
    [3, 80, 'Aumento de Atributo', 'Você pode aumentar um atributo em +1 (limite 5).', 'ATTRIBUTE_BUFF'],
    [3, 85, 'Perito', 'Perito (5 PE, +1d12)', 'ABILITY'],
    [3, 90, 'Poder de Especialista', 'Poder especial da classe Especialista', 'CLASS_POWER'],
    [3, 95, 'Aumento de Atributo', 'Você pode aumentar um atributo em +1 (limite 5).', 'ATTRIBUTE_BUFF'],
    [3, 99, 'Habilidade de Trilha', 'Habilidade especial da trilha escolhida', 'TRAIL_ABILITY']
  ]

  for (const p of progressions) {
    await conn.query(
      'INSERT INTO class_progressions (class_id, nex, title, description, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      p
    )
  }

  console.log('20 progressões do Especialista inseridas!')
  
  // Verificar resultado
  const [rows] = await conn.query('SELECT name, base_hp, hp_per_level, base_pe, pe_per_level, base_sanity, sanity_per_level FROM classes WHERE id = 3')
  console.log('Dados da classe:', rows)
  
  const [progs] = await conn.query('SELECT nex, title FROM class_progressions WHERE class_id = 3 ORDER BY nex')
  console.log('Progressões inseridas:', progs)
  
  await conn.end()
}

main().catch(console.error)
