import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react'
import { Filter, Plus, Save, Dices } from 'lucide-react'

/** Lista completa de perícias do sistema Ordem Paranormal */
const ALL_SKILLS: { name: string; attr: string }[] = [
  { name: 'Acrobacia', attr: 'AGI' },
  { name: 'Adestramento', attr: 'PRE' },
  { name: 'Artes', attr: 'PRE' },
  { name: 'Atletismo', attr: 'FOR' },
  { name: 'Atualidades', attr: 'INT' },
  { name: 'Ciências', attr: 'INT' },
  { name: 'Crime', attr: 'AGI' },
  { name: 'Diplomacia', attr: 'PRE' },
  { name: 'Enganação', attr: 'PRE' },
  { name: 'Fortitude', attr: 'VIG' },
  { name: 'Furtividade', attr: 'AGI' },
  { name: 'Iniciativa', attr: 'AGI' },
  { name: 'Intimidação', attr: 'PRE' },
  { name: 'Intuição', attr: 'PRE' },
  { name: 'Investigação', attr: 'INT' },
  { name: 'Luta', attr: 'FOR' },
  { name: 'Medicina', attr: 'INT' },
  { name: 'Ocultismo', attr: 'INT' },
  { name: 'Percepção', attr: 'PRE' },
  { name: 'Pilotagem', attr: 'AGI' },
  { name: 'Pontaria', attr: 'AGI' },
  { name: 'Profissão', attr: 'INT' },
  { name: 'Reflexos', attr: 'AGI' },
  { name: 'Religião', attr: 'PRE' },
  { name: 'Sobrevivência', attr: 'INT' },
  { name: 'Tática', attr: 'INT' },
  { name: 'Tecnologia', attr: 'INT' },
  { name: 'Vontade', attr: 'PRE' },
]

/** Props do componente SkillsCard */
export interface SkillsCardProps {
  trainedSkills: string[]
  veteranSkills: string[]
  skillFilter: string
  isLearningSkills: boolean
  isSavingSkills: boolean
  showSkillInfo: boolean
  availableSkillsToChoose: number
  totalVeteranSkillsAllowed: number
  originSkillsFromOrigin: string[]
  classMandatorySkills: string[]
  classSkillPools: Array<{ name: string; skills: string[]; required: number }>
  characterNex: number
  attrMap: Record<string, number>
  characterSkills: any[]
  onFilterChange: (filter: string) => void
  onToggleLearning: () => void
  onSaveSkills: () => void
  onToggleSkill: (skillName: string) => void
  onSkillContextMenu: (skillName: string, e: React.MouseEvent) => void
  onRollSkill: (skill: string, attrVal: number, trainingBonus: number, label: string) => void
  onToggleShowSkillInfo: () => void
}

/**
 * Card de perícias — exibe a grade de perícias com treinamento,
 * filtro por atributo, e permite rolar/treinar perícias.
 */
export default function SkillsCard({
  trainedSkills,
  veteranSkills,
  skillFilter,
  isLearningSkills,
  isSavingSkills,
  showSkillInfo,
  availableSkillsToChoose,
  totalVeteranSkillsAllowed,
  originSkillsFromOrigin,
  classMandatorySkills,
  classSkillPools,
  characterNex,
  attrMap,
  characterSkills,
  onFilterChange,
  onToggleLearning,
  onSaveSkills,
  onToggleSkill,
  onSkillContextMenu,
  onRollSkill,
  onToggleShowSkillInfo,
}: SkillsCardProps) {
  const originProvidedSkills = originSkillsFromOrigin.length

  /* Cálculo de perícias pagas e restantes */
  const allPoolSkills = classSkillPools.flatMap((p) => p.skills)
  const regularSkills = trainedSkills.filter(
    (skill) =>
      !originSkillsFromOrigin.includes(skill) &&
      !classMandatorySkills.includes(skill) &&
      !allPoolSkills.includes(skill)
  )
  const extraPoolSkills = classSkillPools.reduce((sum, pool) => {
    const count = trainedSkills.filter((s) => pool.skills.includes(s)).length
    return sum + Math.max(0, count - pool.required)
  }, 0)
  const paidCount = regularSkills.length + extraPoolSkills
  const remainingSkills = Math.max(0, availableSkillsToChoose - paidCount)

  const hasExtraInfo =
    originProvidedSkills > 0 || classMandatorySkills.length > 0 || classSkillPools.length > 0

  return (
    <Card className="bg-zinc-900 border border-zinc-800 shadow-none rounded-xl">
      <CardHeader className="flex flex-col items-start justify-between pb-2 border-b border-zinc-800/50 gap-2">
        <div className="flex w-full items-center justify-between">
          <div className="text-lg font-bold flex items-center gap-2 text-zinc-100">
            Perícias & Proficiências
          </div>
          <div className="flex gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  size="sm"
                  variant="bordered"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
                >
                  <Filter size={14} className="mr-1" />
                  {skillFilter === 'Todos' ? 'Filtrar' : skillFilter}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Filtrar Perícias"
                onAction={(key) => onFilterChange(key as string)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300"
              >
                <DropdownItem key="Todos">Todos os Atributos</DropdownItem>
                <DropdownItem key="FOR">Força (FOR)</DropdownItem>
                <DropdownItem key="AGI">Agilidade (AGI)</DropdownItem>
                <DropdownItem key="INT">Intelecto (INT)</DropdownItem>
                <DropdownItem key="VIG">Vigor (VIG)</DropdownItem>
                <DropdownItem key="PRE">Presença (PRE)</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            {isLearningSkills ? (
              <Button
                size="sm"
                color="success"
                className="font-bold text-white"
                isLoading={isSavingSkills}
                onPress={onSaveSkills}
              >
                <Save size={14} className="mr-1" />
                Salvar Perícias
              </Button>
            ) : (
              <Button size="sm" color="primary" className="font-bold" onPress={onToggleLearning}>
                <Plus size={14} className="mr-1" />
                Aprender Perícia
              </Button>
            )}
          </div>
        </div>

        {/* Banner informativo de perícias */}
        <div className="w-full h-[32px] relative">
          <div className="absolute inset-0">
            <div className="text-xs text-zinc-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-md w-full flex items-center justify-between h-full">
              <span>
                Você pode escolher <strong className="text-blue-400">{remainingSkills}</strong>{' '}
                {remainingSkills === 1 ? 'perícia' : 'perícias'} livremente
                {showSkillInfo && (
                  <>
                    {originProvidedSkills > 0 && (
                      <span className="text-zinc-500"> + {originProvidedSkills} da origem</span>
                    )}
                    {classMandatorySkills.length > 0 && (
                      <span className="text-amber-400">
                        {' '}
                        + {classMandatorySkills.join(', ')} (classe)
                      </span>
                    )}
                    {classSkillPools.length > 0 && (
                      <span className="text-cyan-400">
                        , escolha entre{' '}
                        {classSkillPools
                          .map((p) => p.skills.join(' ou '))
                          .join(' e escolha entre ')}
                      </span>
                    )}
                  </>
                )}
                .
                {characterNex >= 35 && (
                  <span className="ml-4 border-l border-blue-500/30 pl-4">
                    E{' '}
                    <strong className="text-purple-400">
                      {totalVeteranSkillsAllowed - veteranSkills.length}
                    </strong>{' '}
                    para Veterano (+10).
                  </span>
                )}
              </span>
              {hasExtraInfo && (
                <span
                  className="text-zinc-500 hover:text-zinc-300 cursor-pointer hidden md:inline transition-colors"
                  onClick={onToggleShowSkillInfo}
                >
                  {showSkillInfo ? 'Ocultar detalhes' : 'Ver detalhes'}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-4">
        <div className="grid grid-cols-7 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          {ALL_SKILLS.filter((skill) => skillFilter === 'Todos' || skill.attr === skillFilter).map(
            (skill, index) => {
              const isTrained = trainedSkills.includes(skill.name)
              const isVeteran = veteranSkills.includes(skill.name)
              const isFromOrigin = originSkillsFromOrigin.includes(skill.name)
              const isClassMandatory = classMandatorySkills.includes(skill.name)
              const isLocked = isFromOrigin || isClassMandatory
              const skillPool = classSkillPools.find((pool) => pool.skills.includes(skill.name))
              const isClassPool = !!skillPool

              /* Verifica se o pool já atingiu o mínimo */
              let isPoolComplete = false
              let isPoolExtra = false
              if (skillPool) {
                const poolSkillsChosen = trainedSkills.filter((s) => skillPool.skills.includes(s))
                isPoolComplete = poolSkillsChosen.length >= skillPool.required
                if (isTrained) {
                  const thisSkillIndex = poolSkillsChosen.indexOf(skill.name)
                  isPoolExtra = thisSkillIndex >= skillPool.required
                }
              }

              const showPoolHighlight = isClassPool && !isPoolComplete

              return (
                <Button
                  key={index}
                  variant="flat"
                  color={isVeteran ? 'secondary' : isTrained ? 'primary' : 'default'}
                  onPress={() => {
                    if (isLearningSkills && !isLocked) {
                      onToggleSkill(skill.name)
                    } else if (!isLearningSkills) {
                      const attrVal = Math.max(1, attrMap[skill.attr] ?? 1)
                      const degree =
                        characterSkills.find((cs: any) => cs.skill?.name === skill.name)
                          ?.trainingDegree ?? 0
                      const trainingBonus =
                        degree >= 15 ? 15 : degree >= 10 ? 10 : degree >= 5 ? 5 : 0
                      const label = `${skill.name} (${attrVal}d20${trainingBonus > 0 ? `+${trainingBonus}` : ''})`
                      onRollSkill(skill.name, attrVal, trainingBonus, label)
                    }
                  }}
                  onContextMenu={(e) => onSkillContextMenu(skill.name, e)}
                  className={`h-auto py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-all relative group ${
                    isLearningSkills && !isLocked
                      ? 'cursor-pointer hover:scale-105'
                      : isLocked && isTrained
                        ? 'cursor-not-allowed opacity-75'
                        : !isLearningSkills
                          ? 'cursor-pointer'
                          : ''
                  } ${
                    !isTrained
                      ? showPoolHighlight
                        ? 'bg-cyan-900/30 border border-cyan-700/50 text-cyan-400 hover:text-white hover:bg-cyan-900/50 hover:border-cyan-600'
                        : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-600'
                      : isVeteran
                        ? 'border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)] bg-purple-500/20 text-purple-100'
                        : isClassMandatory
                          ? 'border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)] bg-amber-500/10'
                          : isClassPool && !isPoolExtra
                            ? 'border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)] bg-cyan-500/10'
                            : 'border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  }`}
                  title={
                    isFromOrigin && isTrained
                      ? 'Perícia fornecida pela origem (não pode remover)'
                      : isClassMandatory && isTrained
                        ? 'Perícia obrigatória da classe (não pode remover)'
                        : showPoolHighlight
                          ? `Escolha obrigatória: ${skillPool?.name} (grátis)`
                          : isClassPool && isPoolExtra
                            ? 'Escolha extra (custa 1 ponto)'
                            : isTrained && !isLearningSkills
                              ? `Rolar ${skill.name}`
                              : ''
                  }
                >
                  {/* Ícone de dado no hover para perícias treinadas */}
                  {isTrained && !isLearningSkills && (
                    <Dices
                      size={14}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-70 transition-opacity text-amber-400"
                    />
                  )}
                  <span className="text-xs font-bold truncate w-full text-center">
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="opacity-70">{skill.attr}</span>
                    {isVeteran ? (
                      <span className="font-bold text-purple-400">+10</span>
                    ) : isTrained ? (
                      <span className="font-bold text-blue-400">+5</span>
                    ) : null}
                  </div>
                </Button>
              )
            }
          )}
        </div>
      </CardBody>
    </Card>
  )
}
