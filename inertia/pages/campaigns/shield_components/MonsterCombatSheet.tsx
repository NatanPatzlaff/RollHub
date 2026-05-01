import { useState } from 'react'
import axios from 'axios'
import { 
  Shield, 
  Move, 
  Zap, 
  Swords, 
  Brain, 
  Ghost,
  Target,
  Skull,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react'
import { Card, CardBody, Progress, Button, Chip, Switch } from '@heroui/react'
interface MonsterCombatSheetProps {
  participant: any
  dddiceRef?: any
  campaign?: any
}

export default function MonsterCombatSheet({ participant, dddiceRef, campaign }: MonsterCombatSheetProps) {
  console.log('[DEBUG] MonsterCombatSheet recebeu dddiceRef:', dddiceRef)
  
  // Extrai dados: prioriza roomMonster (instância) > monster (template)
  const monsterData = participant.roomMonster || participant.monster || {}
  const hpPercent = (participant.hpCurrent / participant.hpMax) * 100

  // Controle de visibilidade
  const [isPublicRoll, setIsPublicRoll] = useState(false)

  // Estados para rolagens inline
  const [rollResults, setRollResults] = useState<Record<string, number>>({})
  // Estado para resultados combinados de ataque+dano (ataques de arma)
  const [weaponRollResults, setWeaponRollResults] = useState<Record<string, { attack: number; damage: number; atkDice: number[]; dmgDice: number[]; isCritical: boolean } | null>>({})

  const handleRoll = async (expression: string, key: string, label: string, attrVal?: number) => {
    const cleanExpression = expression.replace(/\s+/g, '').toLowerCase()
    const match = cleanExpression.match(/(\d+)d(\d+)([+-]\d+)?/)

    if (!match) {
      console.error('[ERRO] Expressão inválida:', expression)
      return
    }

    let count = parseInt(match[1])
    const sides = parseInt(match[2])
    const mod = match[3] ? parseInt(match[3]) : 0

    // Regra Atributo 0: rola 2d20 e pega o pior
    if (attrVal === 0 && sides === 20) {
      count = 2
    }

    let rawTotal = 0
    let diceValues: number[] = []

    // Tentativa com dddice
    if (dddiceRef?.current) {
      const diceToRoll = Array.from({ length: count }).map(() => ({
        type: `d${sides}`,
        theme: 'dddice-standard'
      }))

      try {
        const result = await dddiceRef.current.roll(diceToRoll, {
          label: `${monsterData.name || participant.name}: ${label}`,
          whisper: isPublicRoll ? undefined : ['gm']
        }, { room: campaign?.dddiceRoomSlug })

        const values = result?.data?.values || result?.values || []
        diceValues = values.map((v: any) => v.value)

        if (sides === 20) {
          // Perícias/testes de d20: pega o MAIOR (ou MENOR se attrVal === 0)
          const d20s = values.filter((v: any) => v.type === 'd20' || v.type === 'vtt_d20').map((v: any) => v.value)
          if (attrVal === 0) {
            rawTotal = d20s.length >= 2 ? Math.min(...d20s) : (d20s[0] || 0)
          } else {
            rawTotal = d20s.length > 0 ? Math.max(...d20s) : 0
          }
        } else {
          // Dados de dano: soma todos
          rawTotal = result?.data?.total_value || result?.total_value || 0
        }
      } catch (error) {
        console.error('[ERRO] Falha no dddice, usando fallback...', error)
      }
    }

    // Fallback: Math.random() se dddice falhar ou não estiver disponível
    if (rawTotal === 0) {
      let rollResultsArr = []
      for (let i = 0; i < count; i++) {
        rollResultsArr.push(Math.floor(Math.random() * sides) + 1)
      }
      diceValues = rollResultsArr
      
      if (sides === 20) {
        // Perícias/testes de d20: pega o MAIOR (ou MENOR se attrVal === 0)
        if (attrVal === 0) {
          rawTotal = Math.min(...rollResultsArr)
        } else {
          rawTotal = Math.max(...rollResultsArr)
        }
      } else {
        // Dados de dano: soma todos
        rawTotal = rollResultsArr.reduce((a, b) => a + b, 0)
      }
    }

    const finalResult = rawTotal + mod

    // Atualiza estado local para feedback imediato
    setRollResults(prev => ({ ...prev, [key]: finalResult }))

    try {
      const rollData = {
        action: label,
        playerName: monsterData.name || participant.name,
        roll_expression: expression,
        result: finalResult,
        is_gm: true,
        is_secret: !isPublicRoll,
        diceValues: JSON.stringify(diceValues),
        characterId: null
      }

      const apiResponse = await axios.post(`/api/campaigns/${campaign?.id}/rolls`, rollData)
      
      // Mantém sincronia com o painel de histórico do Shield
      window.dispatchEvent(new CustomEvent('secret-roll-added', { detail: apiResponse.data }))
    } catch (error) {
      console.error('[ERRO] Falha ao salvar a rolagem na API', error)
    }
  }

  /** Rola ataque + dano juntos (como os players) e salva ambas as rolagens consecutivamente */
  const handleWeaponRoll = async (action: any, key: string) => {
    const atkDice = action.dice || 1
    const atkBonus = action.bonus || 0

    // Parse dano
    const dmgMatch = (action.damage || '').replace(/\s+/g, '').match(/(\d+)d(\d+)([+-]\d+)?/i)
    const dmgCount = dmgMatch ? parseInt(dmgMatch[1]) : 1
    const dmgSides = dmgMatch ? parseInt(dmgMatch[2]) : 6
    const dmgMod = dmgMatch && dmgMatch[3] ? parseInt(dmgMatch[3]) : 0

    let atkValues: number[] = []
    let dmgValues: number[] = []

    // Rolar dados
    for (let i = 0; i < atkDice; i++) {
      atkValues.push(Math.floor(Math.random() * 20) + 1)
    }
    for (let i = 0; i < dmgCount; i++) {
      dmgValues.push(Math.floor(Math.random() * dmgSides) + 1)
    }

    const bestAtk = Math.max(...atkValues)
    const atkTotal = bestAtk + atkBonus
    const dmgTotal = dmgValues.reduce((a, b) => a + b, 0) + dmgMod

    // Detectar crítico (natural 20 no melhor dado)
    const isCritical = bestAtk >= (action.critical || 20)

    // Atualiza estado para feedback visual imediato
    setWeaponRollResults(prev => ({
      ...prev,
      [key]: { attack: atkTotal, damage: dmgTotal, atkDice: atkValues, dmgDice: dmgValues, isCritical }
    }))

    const monsterName = monsterData.name || participant.name
    const atkExpr = `${atkDice}d20${atkBonus > 0 ? `+${atkBonus}` : (atkBonus < 0 ? atkBonus : '')}`

    try {
      // Salvar ataque
      await axios.post(`/api/campaigns/${campaign?.id}/rolls`, {
        action: `${action.name} (Ataque)`,
        playerName: monsterName,
        roll_expression: atkExpr,
        result: atkTotal,
        is_gm: true,
        is_secret: !isPublicRoll,
        is_critical: isCritical,
        diceValues: JSON.stringify(atkValues),
        characterId: null
      })

      // Salvar dano (consecutivo — será agrupado no histórico)
      await axios.post(`/api/campaigns/${campaign?.id}/rolls`, {
        action: `${action.name} (Dano)`,
        playerName: monsterName,
        roll_expression: action.damage,
        result: dmgTotal,
        is_gm: true,
        is_secret: !isPublicRoll,
        is_critical: isCritical,
        diceValues: JSON.stringify(dmgValues),
        characterId: null
      })

      window.dispatchEvent(new CustomEvent('secret-roll-added'))
    } catch (error) {
      console.error('[ERRO] Falha ao salvar rolagem de arma na API', error)
    }
  }

  const attributes = [
    { label: 'AGI', value: monsterData.agi || 0, color: 'text-emerald-400' },
    { label: 'FOR', value: monsterData.str || 0, color: 'text-red-400' },
    { label: 'INT', value: monsterData.int || 0, color: 'text-purple-400' },
    { label: 'PRE', value: monsterData.pre || 0, color: 'text-cyan-400' },
    { label: 'VIG', value: monsterData.vig || 0, color: 'text-rose-400' },
  ]

  const skills = [
    { name: 'Percepção', value: monsterData.perceptionBonus || 0, attr: 'PRE' },
    { name: 'Iniciativa', value: monsterData.initiativeBonus || 0, attr: 'AGI' },
    { name: 'Fortitude', value: monsterData.fortitudeBonus || 0, attr: 'VIG' },
    { name: 'Reflexos', value: monsterData.reflexBonus || 0, attr: 'AGI' },
    { name: 'Vontade', value: monsterData.willBonus || 0, attr: 'PRE' },
  ]

  const resistances = monsterData.resistances?.byType || {}
  const hasResistances = Object.entries(resistances).some(([_, val]) => Number(val) > 0)

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Card 1: Identificação e Status */}
      <Card className="bg-[#18181B] border-[#27272A] shadow-none">
        <CardBody className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Ghost size={20} className="text-red-500" />
                {monsterData.name || participant.name}
              </h2>
              <div className="flex gap-2 mt-1">
                <Chip size="sm" variant="flat" className="bg-zinc-800 text-zinc-400 border-zinc-700">{monsterData.type || 'Criatura'}</Chip>
                <Chip size="sm" variant="flat" className="bg-zinc-800 text-zinc-400 border-zinc-700">{monsterData.size || 'Médio'}</Chip>
                {monsterData.element && (
                  <Chip size="sm" variant="flat" className="bg-zinc-800 text-amber-500/20 text-amber-500 border-amber-500/20">{monsterData.element}</Chip>
                )}
                <Chip size="sm" className="bg-orange-500/10 text-orange-400 font-black">VD {monsterData.vd || 0}</Chip>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 bg-[#09090B] px-3 py-1.5 rounded-lg border border-[#27272A]">
                {isPublicRoll ? <Eye size={14} className="text-blue-400" /> : <EyeOff size={14} className="text-zinc-500" />}
                <span className={`text-[10px] font-bold uppercase tracking-tight ${isPublicRoll ? 'text-blue-400' : 'text-zinc-500'}`}>
                  {isPublicRoll ? 'Público' : 'Secreto'}
                </span>
                <Switch 
                  size="sm"
                  isSelected={isPublicRoll}
                  onValueChange={setIsPublicRoll}
                  color="primary"
                />
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest">NEX IMUNE</div>
                <div className="text-lg font-black text-white">{monsterData.nexImmune || 0}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A] flex flex-col items-center justify-center">
              <Shield size={16} className="text-blue-400 mb-1" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Defesa</span>
              <span className="text-lg font-black text-white">{monsterData.defense || 0}</span>
            </div>
            <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A] flex flex-col items-center justify-center">
              <Move size={16} className="text-emerald-400 mb-1" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Desloc.</span>
              <span className="text-lg font-black text-white">{monsterData.movement || 9}m</span>
            </div>
            <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A] flex flex-col items-center justify-center">
              <Skull size={16} className="text-red-400 mb-1" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase">RD Flat</span>
              <span className="text-lg font-black text-white">{monsterData.resistances?.flatRD || 0}</span>
            </div>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-[#A1A1AA] uppercase tracking-wider">PONTOS DE VIDA</span>
              <span className="text-zinc-100">{participant.hpCurrent} / {participant.hpMax}</span>
            </div>
            <Progress 
              aria-label="Barra de Vida do Monstro"
              value={hpPercent} 
              color="danger" 
              size="sm" 
              className="h-2"
            />
          </div>

          <div className="flex justify-between px-2 py-2 bg-[#09090B] rounded-xl border border-[#27272A]">
            {attributes.map(attr => (
              <div key={attr.label} className="flex flex-col items-center px-2">
                <span className={`text-[10px] font-black ${attr.color}`}>{attr.label}</span>
                <span className="text-sm font-black text-white">{attr.value}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Card 2: Perícias e Resistências */}
      <Card className="bg-[#18181B] border-[#27272A] shadow-none">
        <CardBody className="p-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Target size={14} className="text-emerald-500" /> Perícias
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {skills.map(skill => {
              const attrVal = monsterData[skill.attr.toLowerCase()] || 0
              const rollExpr = `${attrVal}d20${skill.value > 0 ? `+${skill.value}` : ''}`
              const key = `skill-${skill.name}`
              
              return (
                <div key={skill.name} className="flex flex-col gap-1 p-2 bg-[#09090B] rounded-lg border border-[#27272A]">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-300">{skill.name}</span>
                    <span className="text-[10px] text-zinc-500 font-black">{rollExpr}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="flat" 
                    className={`h-7 text-[10px] font-bold ${rollResults[key] ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/10 text-emerald-400'}`}
                    onPress={() => handleRoll(rollExpr, key, skill.name, attrVal)}
                  >
                    {rollResults[key] ? `🎯 ${rollResults[key]}` : 'Rolar'}
                  </Button>
                </div>
              )
            })}
          </div>

          {(monsterData.immunities || monsterData.vulnerabilities || hasResistances) && (
            <>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldAlert size={14} className="text-amber-500" /> Resistências
              </h3>
              <div className="space-y-3">
                {monsterData.immunities && (
                  <div>
                    <span className="text-[10px] font-black text-emerald-400 uppercase block mb-1">Imunidades</span>
                    <p className="text-xs text-zinc-300">{monsterData.immunities}</p>
                  </div>
                )}
                {monsterData.vulnerabilities && (
                  <div>
                    <span className="text-[10px] font-black text-red-400 uppercase block mb-1">Vulnerabilidades</span>
                    <p className="text-xs text-zinc-300">{monsterData.vulnerabilities}</p>
                  </div>
                )}
                {hasResistances && (
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(resistances).map(([type, val]) => {
                      if (Number(val) <= 0) return null
                      return (
                        <div key={type} className="bg-[#09090B] p-2 rounded-lg border border-[#27272A] text-center">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase block truncate">{type}</span>
                          <span className="text-xs font-black text-amber-500">RD {String(val)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Card 3: Ações de Combate */}
      <Card className="bg-[#18181B] border-[#27272A] shadow-none">
        <CardBody className="p-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Swords size={14} className="text-red-500" /> Ações
          </h3>
          
          <div className="space-y-4">
            {monsterData.attacks?.map((action: any, i: number) => {
              const testExpr = `${action.dice || 1}d20${action.bonus > 0 ? `+${action.bonus}` : (action.bonus < 0 ? action.bonus : '')}`
              const weaponResult = weaponRollResults[`action-${i}`]
              
              return (
              <div key={i} className="p-3 bg-[#09090B] rounded-xl border border-[#27272A] space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-zinc-100">{action.name}</h4>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">{action.damageType || 'Ataque'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {action.attackCount && action.attackCount > 1 && (
                      <Chip size="sm" variant="flat" className="bg-red-500/10 text-red-500 font-black">X{action.attackCount}</Chip>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[9px] text-zinc-500 font-black uppercase">
                  <span>Teste: {testExpr}</span>
                  <span>•</span>
                  <span>Dano: {action.damage}</span>
                </div>

                <Button 
                  size="sm" 
                  variant="flat" 
                  fullWidth
                  className={`h-9 text-[11px] font-bold ${
                    weaponResult
                      ? weaponResult.isCritical 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}
                  onPress={() => handleWeaponRoll(action, `action-${i}`)}
                >
                  {weaponResult ? '⚔ Rolar Novamente' : '⚔ Rolar Ataque'}
                </Button>

                {/* Resultado combinado inline */}
                {weaponResult && (
                  <div className="space-y-1.5">
                    {weaponResult.isCritical && (
                      <div className="text-center text-yellow-400 text-[10px] font-black uppercase animate-pulse tracking-wider">
                        💥 CRÍTICO!
                      </div>
                    )}
                    <div className="flex items-stretch gap-2">
                      <div className={`flex-1 rounded-lg px-2.5 py-2 ${
                        weaponResult.isCritical
                          ? 'bg-yellow-950/40 border border-yellow-500/40'
                          : 'bg-[#18181B] border border-[#27272A]'
                      }`}>
                        <div className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider mb-0.5">
                          Ataque · {testExpr}
                        </div>
                        <div className={`text-2xl font-black leading-none ${
                          weaponResult.isCritical ? 'text-yellow-400' : 'text-amber-400'
                        }`}>
                          {weaponResult.attack}
                        </div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">
                          ({weaponResult.atkDice.join(', ')})
                        </div>
                      </div>
                      <div className={`flex-1 rounded-lg px-2.5 py-2 ${
                        weaponResult.isCritical
                          ? 'bg-red-950/50 border border-red-500/40'
                          : 'bg-[#18181B] border border-red-900/30'
                      }`}>
                        <div className="text-[9px] uppercase font-bold text-red-900/80 tracking-wider mb-0.5">
                          Dano · {action.damage}
                        </div>
                        <div className={`text-2xl font-black leading-none ${
                          weaponResult.isCritical ? 'text-red-300' : 'text-red-400'
                        }`}>
                          {weaponResult.damage}
                        </div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">
                          [{weaponResult.dmgDice.join(', ')}]
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )})}

            {(() => {
              // Separar habilidades que possuem expressões de rolagem (ação) das passivas
              const diceRegex = /(\d+)d(\d+)([+-]\d+)?/gi
              const rollableAbilities: any[] = []
              const passiveAbilities: any[] = []

              ;(monsterData.abilities || []).forEach((ability: any) => {
                if (!ability.description) {
                  passiveAbilities.push(ability)
                  return
                }

                // Procura por expressões de dados na descrição
                const matches = [...ability.description.matchAll(diceRegex)]
                if (matches.length > 0) {
                  // Extrai expressões de teste (d20) e dano (outros dados)
                  const testMatch = matches.find((m: any) => m[2] === '20')
                  const damageMatch = matches.find((m: any) => m[2] !== '20')
                  rollableAbilities.push({
                    ...ability,
                    testExpr: testMatch ? testMatch[0] : null,
                    damageExpr: damageMatch ? damageMatch[0] : null,
                  })
                } else {
                  passiveAbilities.push(ability)
                }
              })

              return (
                <>
                  {/* Habilidades com rolagem — renderizadas como ações */}
                  {rollableAbilities.map((ability: any, i: number) => {
                    const abilityIdx = (monsterData.attacks?.length || 0) + i
                    const abilityKey = `ability-${abilityIdx}`
                    const hasBoth = ability.testExpr && ability.damageExpr
                    const weaponResult = hasBoth ? weaponRollResults[abilityKey] : null

                    return (
                      <div key={`rollable-${i}`} className="p-3 bg-[#09090B] rounded-xl border border-[#27272A] space-y-3">
                        <div>
                          <h4 className="font-bold text-zinc-100">{ability.name}</h4>
                          <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">{ability.description}</p>
                        </div>

                        {hasBoth ? (
                          <>
                            <div className="flex items-center gap-3 text-[9px] text-zinc-500 font-black uppercase">
                              <span>Teste: {ability.testExpr}</span>
                              <span>•</span>
                              <span>Dano: {ability.damageExpr}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="flat"
                              fullWidth
                              className={`h-9 text-[11px] font-bold ${
                                weaponResult
                                  ? weaponResult.isCritical
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-amber-500/10 text-amber-400'
                              }`}
                              onPress={() => {
                                // Tratar como ataque de arma: construir objeto compatível
                                const fakeAction = {
                                  name: ability.name,
                                  dice: parseInt(ability.testExpr.match(/(\d+)d20/)?.[1] || '1'),
                                  bonus: parseInt(ability.testExpr.match(/d20([+-]\d+)/)?.[1] || '0'),
                                  damage: ability.damageExpr,
                                  critical: 20,
                                }
                                handleWeaponRoll(fakeAction, abilityKey)
                              }}
                            >
                              {weaponResult ? '⚔ Rolar Novamente' : '⚔ Rolar Ataque'}
                            </Button>

                            {weaponResult && (
                              <div className="space-y-1.5">
                                {weaponResult.isCritical && (
                                  <div className="text-center text-yellow-400 text-[10px] font-black uppercase animate-pulse tracking-wider">
                                    💥 CRÍTICO!
                                  </div>
                                )}
                                <div className="flex items-stretch gap-2">
                                  <div className={`flex-1 rounded-lg px-2.5 py-2 ${
                                    weaponResult.isCritical
                                      ? 'bg-yellow-950/40 border border-yellow-500/40'
                                      : 'bg-[#18181B] border border-[#27272A]'
                                  }`}>
                                    <div className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider mb-0.5">
                                      Teste · {ability.testExpr}
                                    </div>
                                    <div className={`text-2xl font-black leading-none ${
                                      weaponResult.isCritical ? 'text-yellow-400' : 'text-amber-400'
                                    }`}>
                                      {weaponResult.attack}
                                    </div>
                                    <div className="text-[10px] text-zinc-600 mt-0.5">
                                      ({weaponResult.atkDice.join(', ')})
                                    </div>
                                  </div>
                                  <div className={`flex-1 rounded-lg px-2.5 py-2 ${
                                    weaponResult.isCritical
                                      ? 'bg-red-950/50 border border-red-500/40'
                                      : 'bg-[#18181B] border border-red-900/30'
                                  }`}>
                                    <div className="text-[9px] uppercase font-bold text-red-900/80 tracking-wider mb-0.5">
                                      Dano · {ability.damageExpr}
                                    </div>
                                    <div className={`text-2xl font-black leading-none ${
                                      weaponResult.isCritical ? 'text-red-300' : 'text-red-400'
                                    }`}>
                                      {weaponResult.damage}
                                    </div>
                                    <div className="text-[10px] text-zinc-600 mt-0.5">
                                      [{weaponResult.dmgDice.join(', ')}]
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          /* Apenas teste OU apenas dano — botão individual */
                          <div>
                            {ability.testExpr && (
                              <Button
                                size="sm"
                                variant="flat"
                                fullWidth
                                className="h-8 bg-blue-500/10 text-blue-400 text-[10px] font-bold"
                                onPress={() => handleRoll(ability.testExpr, `ability-test-${abilityIdx}`, `${ability.name} (Teste)`)}
                              >
                                {rollResults[`ability-test-${abilityIdx}`] ? `🎯 ${rollResults[`ability-test-${abilityIdx}`]}` : `Rolar Teste (${ability.testExpr})`}
                              </Button>
                            )}
                            {ability.damageExpr && (
                              <Button
                                size="sm"
                                variant="flat"
                                fullWidth
                                className="h-8 bg-red-500/10 text-red-400 text-[10px] font-bold mt-1"
                                onPress={() => handleRoll(ability.damageExpr, `ability-dmg-${abilityIdx}`, `${ability.name} (Dano)`)}
                              >
                                {rollResults[`ability-dmg-${abilityIdx}`] ? `💥 ${rollResults[`ability-dmg-${abilityIdx}`]}` : `Rolar Dano (${ability.damageExpr})`}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Habilidades passivas (sem rolagem) */}
                  {passiveAbilities.length > 0 && (
                    <div className="pt-2 space-y-3">
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} className="text-yellow-500" /> Habilidades
                      </h3>
                      {passiveAbilities.map((ability: any, i: number) => (
                        <div key={i} className="text-xs">
                          <strong className="text-zinc-100 block mb-1">{ability.name}</strong>
                          <p className="text-zinc-400 leading-relaxed">{ability.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )
            })()}

            {monsterData.disturbingPresenceDt > 0 && (
              <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                 <div className="flex items-center gap-2 mb-1">
                    <Brain size={14} className="text-purple-400" />
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Presença Perturbadora</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400">DT {monsterData.disturbingPresenceDt} • Dano {monsterData.disturbingPresenceDamage}</span>
                 </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
