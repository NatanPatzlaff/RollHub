/**
 * Checks whether a character meets the prerequisite for using a ritual's
 * Discente or Verdadeiro upgrade.
 *
 * Known "Requer" patterns (from Rituais.md):
 *   Requer 2º círculo.
 *   Requer 3º círculo e afinidade.
 *   Requer 4º círculo e afinidade com Morte.
 *   Requer afinidade.
 *   Requer afinidade com Conhecimento.
 *   (no "Requer" text = no prerequisite)
 *
 * @param upgradeText     The full discente or verdadeiro string
 * @param ritualElement   The ritual's element (e.g. "ENERGIA")
 * @param circuloMaximo   The character's current maximum circle (1–4)
 * @param characterAffinity  The character's chosen affinity, or null/undefined
 */
export function canUseRitualUpgrade(
  upgradeText: string,
  ritualElement: string,
  circuloMaximo: number,
  characterAffinity: string | null | undefined
): boolean {
  const reqMatch = upgradeText.match(/Requer\s+(.+?)\./i)
  if (!reqMatch) return true

  const reqStr = reqMatch[1]

  // Parse optional circle requirement
  const circleMatch = reqStr.match(/(\d+)[º°o]\s+c[íi]rculo/i)
  const minCircle = circleMatch ? parseInt(circleMatch[1], 10) : 0

  // Parse optional affinity requirement (with optional specific element)
  const affinityMatch = reqStr.match(/afinidade(?:\s+com\s+([A-Za-z\u00C0-\u017E]+))?/i)
  const needsAffinity = !!affinityMatch
  const specificElement = affinityMatch?.[1]?.toUpperCase() ?? null

  if (minCircle > 0 && circuloMaximo < minCircle) return false

  if (needsAffinity) {
    if (!characterAffinity) return false
    const target = specificElement ?? ritualElement.toUpperCase()
    if (characterAffinity.toUpperCase() !== target) return false
  }

  return true
}

/**
 * Derives the character's maximum ritual circle from their NEX value.
 *
 * Ocultistas unlock circles at NEX 5/25/55/85%.
 * Especialistas and Combatentes unlock at NEX 0/45/75% — circle 4 is inaccessible.
 */
export function circuloMaximoFromNex(nex: number, isOcultista: boolean = false): number {
  if (isOcultista) {
    if (nex >= 85) return 4
    if (nex >= 55) return 3
    if (nex >= 25) return 2
    return 1
  } else {
    // Especialistas / Combatentes: circle 4 never unlocked
    if (nex >= 75) return 3
    if (nex >= 45) return 2
    return 1
  }
}
