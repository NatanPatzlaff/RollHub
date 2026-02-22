# Skill Persistence Fix

## Problem
User-selected skills during the character learning phase weren't being saved to the database. When the page was refreshed, only origin-provided skills remained.

## Root Cause
The "Salvar Perícias" button only toggled the `isLearningSkills` state locally in React. There was no backend endpoint to persist skill selections to the database.

## Solution
Implemented a complete skill persistence system with three components:

### 1. Backend Endpoint
**File**: `app/controllers/characters_controller.ts`

Added `async updateSkills()` method that:
- Accepts `trainedSkills` and `veteranSkills` arrays from the frontend
- Identifies and preserves origin-provided skills (from character origin)
- Deletes all non-origin CharacterSkill records
- Creates new CharacterSkill records with proper training degrees:
  - **5** = Trained skill
  - **10** = Veteran skill
- Returns updated character with all preloaded relationships

**Key Logic**:
```typescript
// Preserve origin skills by tracking their IDs
const originSkillIds = new Set<number>()
for (const skillName of originSkillNames) {
    const skill = await Skill.findBy('name', skillName)
    if (skill) originskillIds.add(skill.id)
}

// Delete non-origin skills
const existingSkills = await CharacterSkill.query().where('characterId', character.id)
for (const existingSkill of existingSkills) {
    if (!originSkillIds.has(existingSkill.skillId)) {
        await existingSkill.delete()
    }
}

// Add selected skills with correct training degrees
const degree = veteranSkills?.includes(skillName) ? 10 : 5
```

### 2. API Route
**File**: `start/routes.ts`

Added authenticated PUT endpoint:
```typescript
router.put('/characters/:id/skills', [CharactersController, 'updateSkills'])
```

### 3. Frontend Integration
**File**: `inertia/pages/characters/show.tsx`

- Added `isSavingSkills` state to track save operation
- Added `saveSkills()` async function:
  ```typescript
  const saveSkills = async () => {
    setIsSavingSkills(true)
    router.put(`/characters/${character.id}/skills`, {
      trainedSkills,
      veteranSkills,
    }, {
      onSuccess: () => {
        setIsLearningSkills(false)
        setIsSavingSkills(false)
      },
      // error handling...
    })
  }
  ```

- Updated "Salvar Perícias" button:
  ```tsx
  <Button
    size="sm"
    color="success"
    isLoading={isSavingSkills}
    onPress={saveSkills}
  >
    <Save size={14} className="mr-1" />
    Salvar Perícias
  </Button>
  ```

## Testing
To verify the fix works:

1. Create or load a character
2. Click "Aprender Perícia" to enter learning mode
3. Select skills by clicking on them (they highlight when selected)
4. Click "Salvar Perícias"
5. Refresh the page (F5)
6. Verify the selected skills are still marked as trained

## Data Structure
- **trainedSkills**: Array of skill names with training degree 5
- **veteranSkills**: Array of skill names with training degree 10
- Origin-provided skills are automatically tracked and never deleted

## Compatibility
- Works with all character classes (Especialista, Ocultista, Combatente)
- Preserves class mandatory skills (e.g., Ocultismo + Vontade for Ocultista)
- Compatible with skill pools for Combatente
- Respects intellect-based skill limits
