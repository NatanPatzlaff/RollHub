/**
 * Script para preencher os campos type, pe_cost, range, cast_time, duration e target
 * nas origin_abilities, baseado na análise das descrições de cada habilidade.
 */
const sqlite3 = require('better-sqlite3')
const db = sqlite3('./database.sqlite')

const updates = [
  // id 1 - Saber é Poder: "gastar 2 PE para +5 em teste de INT"
  { id: 1, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 2 - Técnica Medicinal: "adiciona INT no total de PV curados"
  { id: 2, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 3 - Vislumbres do Passado: "1x/sessão, teste de INT (DT 10)"
  { id: 3, type: 'ativa', pe_cost: null, range: 'Pessoal', cast_time: 'Ação Livre', duration: 'Instantâneo', target: 'Você' },

  // id 4 - Magnum Opus: "1x/missão, +5 em Presença contra personagem que reconhece"
  { id: 4, type: 'ativa', pe_cost: null, range: 'Pessoal', cast_time: null, duration: 'Cena', target: '1 personagem' },

  // id 5 - 110%: "gastar 2 PE para +5 em teste de FOR/AGI"
  { id: 5, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 6 - Ingrediente Secreto: "ação de interlúdio para cozinhar prato especial"
  { id: 6, type: 'ativa', pe_cost: null, range: 'Pessoal', cast_time: 'Interlúdio', duration: 'Próxima cena', target: 'Grupo' },

  // id 7 - Investigação Científica: "1x/cena, ação livre, usar Ciências no lugar"
  { id: 7, type: 'ativa', pe_cost: null, range: 'Pessoal', cast_time: 'Ação Livre', duration: 'Instantâneo', target: 'Você' },

  // id 8 - O Crime Compensa: "no final da missão, escolha um item"
  { id: 8, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: 'Missão seguinte', target: null },

  // id 9 - Traços do Outro Lado: "poder paranormal extra, metade da SAN"
  { id: 9, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 10 - Calejado: "+1 PV por 5% NEX"
  { id: 10, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 11 - Destemido: "+5 em teste quando falha causa dano/condição"
  { id: 11, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 12 - Ferramentas Favoritas: "item conta como categoria abaixo"
  { id: 12, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 13 - Bagagem de Leitura: "1x/cena, 2 PE, treinado em perícia"
  { id: 13, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Cena', target: 'Você' },

  // id 14 - Processo Otimizado: "2 PE para +5 em teste estendido/revisão"
  { id: 14, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 15 - Fraternidade Gaudéria: "1x/rodada, 1 PE, troca de lugar com aliado adjacente"
  { id: 15, type: 'reação', pe_cost: '1 PE', range: 'Adjacente', cast_time: 'Reação', duration: 'Instantâneo', target: '1 aliado adjacente' },

  // id 16 - Mobilidade Acrobática: "+2 Defesa, +3m deslocamento"
  { id: 16, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 17 - Faro para Pistas: "1x/cena, 1 PE, +5 em teste de pistas"
  { id: 17, type: 'ativa', pe_cost: '1 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 18 - Fontes Confiáveis: "1x/sessão, 1 PE, rolar novamente ou info"
  { id: 18, type: 'ativa', pe_cost: '1 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 19 - Mão Pesada: "+2 dano corpo a corpo"
  { id: 19, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 20 - Patrocinador da Ordem: "limite de crédito +1"
  { id: 20, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 21 - Posição de Combate: "2 PE, ação de movimento adicional no 1º turno"
  { id: 21, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: 'Livre', duration: 'Turno', target: 'Você' },

  // id 22 - Para Bellum: "+2 dano com armas de fogo"
  { id: 22, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 23 - Ferramenta de Trabalho: "+1 ataque/dano/ameaça com arma escolhida"
  { id: 23, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 24 - Patrulha: "+2 em Defesa"
  { id: 24, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 25 - Aula de Campo: "1x/cena, ação padrão + 2 PE, +1 atributo de outro"
  { id: 25, type: 'ativa', pe_cost: '2 PE', range: 'Curto', cast_time: 'Ação Padrão', duration: 'Cena', target: '1 personagem' },

  // id 26 - Acalentar: "+5 em Religião para acalmar, cura SAN extra"
  { id: 26, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 27 - Antes Só: "+1 Defesa/perícias/PE se sem aliado em curto"
  { id: 27, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 28 - Espírito Cívico: "1 PE para +2 no bônus de ajuda"
  { id: 28, type: 'ativa', pe_cost: '1 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 29 - Eu Já Sabia: "resistência a dano mental = INT"
  { id: 29, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 30 - Motor de Busca: "2 PE, substituir teste por Tecnologia"
  { id: 30, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 31 - Desbravador: "2 PE para +5 em Adestr./Sobrevi. + sem penalidade terreno"
  { id: 31, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 32 - Impostor: "1x/cena, 2 PE, substituir teste por Enganação"
  { id: 32, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 33 - Dedicação: "+1 PE e limite +1"
  { id: 33, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 34 - Cicatrizes Psicológicas: "+1 SAN por 5% NEX"
  { id: 34, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 35 - Companheiro Animal: "animais, aliado com bônus progressivo"
  { id: 35, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 36 - Acostumado ao Extremo: "1 PE (+1/uso na cena), reduz dano em 5"
  { id: 36, type: 'reação', pe_cost: '1 PE (+1 por uso na cena)', range: 'Pessoal', cast_time: 'Reação', duration: 'Instantâneo', target: 'Você' },

  // id 37 - Fome do Outro Lado: "ação de interlúdio + ingrediente, prato especial"
  { id: 37, type: 'ativa', pe_cost: null, range: 'Pessoal', cast_time: 'Interlúdio', duration: 'Próxima cena', target: '1 prato' },

  // id 38 - Poder da Amizade: "+2 em testes de perícia se melhor amigo em médio"
  { id: 38, type: 'passiva', pe_cost: null, range: 'Médio', cast_time: null, duration: null, target: null },

  // id 39 - Não é Fantasia, é Cosplay!: "+2 em perícia com cosplay relevante"
  { id: 39, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 40 - Conexões: "10 min + 2 PE, substituir teste por Diplomacia"
  { id: 40, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: '10 minutos', duration: 'Cena', target: 'Você' },

  // id 41 - Manual do Sobrevivente: "2 PE para +5 em sobrevivência/resistência"
  { id: 41, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 42 - Mutação: "RD 2, +2 perícia, -2 Diplomacia"
  { id: 42, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 43 - Conhecimento Oculto: "Ocultismo para identificar, +2 contra criatura"
  { id: 43, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 44 - Através da Lente: "2 PE para +5 em Investigação/Percepção pela câmera"
  { id: 44, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 45 - Invenção Paranormal: "ação padrão, teste de Profissão DT 15"
  { id: 45, type: 'ativa', pe_cost: null, range: 'Variável', cast_time: 'Ação Padrão', duration: 'Variável', target: 'Variável' },

  // id 46 - A Culpa é das Estrelas: "1 PE, rolar 1d6, se acertar +2 em testes"
  { id: 46, type: 'ativa', pe_cost: '1 PE', range: 'Pessoal', cast_time: 'Livre', duration: 'Cena', target: 'Você' },

  // id 47 - Luto Habitual: "metade dano mental (passivo) + 2 PE para +5 Medicina"
  { id: 47, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 48 - Mapa Celeste: "2 PE para rolar Sobrevivência novamente"
  { id: 48, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 49 - Fôlego de Nadador: "+5 PV, prender respiração, natação normal"
  { id: 49, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 50 - Mãos no Volante: "2 PE para +5 em Pilotagem/resistência"
  { id: 50, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },

  // id 51 - O Inteligentão: "+1 dado na ação de interlúdio ler"
  { id: 51, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 52 - Terapia: "1x/rodada, 2 PE, substituir teste de resistência"
  { id: 52, type: 'reação', pe_cost: '2 PE', range: 'Curto', cast_time: 'Reação', duration: 'Instantâneo', target: 'Você ou 1 aliado' },

  // id 53 - Luta ou Fuga: "+2 Vontade, +2 PE temporários quando premonição aparece"
  { id: 53, type: 'passiva', pe_cost: null, range: null, cast_time: null, duration: null, target: null },

  // id 54 - Encontrar a Verdade: "2 PE para +5 em Investigação"
  { id: 54, type: 'ativa', pe_cost: '2 PE', range: 'Pessoal', cast_time: null, duration: 'Instantâneo', target: 'Você' },
]

const stmt = db.prepare(`
  UPDATE origin_abilities
  SET type = ?, pe_cost = ?, range = ?, cast_time = ?, duration = ?, target = ?,
      updated_at = datetime('now')
  WHERE id = ?
`)

const updateAll = db.transaction(() => {
  let count = 0
  for (const u of updates) {
    const info = stmt.run(u.type, u.pe_cost, u.range, u.cast_time, u.duration, u.target, u.id)
    if (info.changes > 0) count++
  }
  return count
})

const total = updateAll()
console.log(`✅ ${total} de ${updates.length} registros atualizados com sucesso.`)
db.close()
