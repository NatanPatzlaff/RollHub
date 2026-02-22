# Testing Skill Persistence

## Test Case 1: Save Trained Skills
**Objective**: Verify that trained skills selected by the user are persisted to the database.

**Steps**:
1. Load or create a character (e.g., Especialista)
2. Click "Aprender Perícia" button to enter learning mode
3. Select 3-4 skills by clicking on them (they should highlight)
4. Click "Salvar Perícias" button (should show loading spinner)
5. Wait for save to complete
6. Refresh the page (F5)

**Expected Result**: The selected skills remain marked as trained (with training degree 5)

---

## Test Case 2: Save Veteran Skills
**Objective**: Verify that veteran skills are correctly saved with degree 10.

**Prerequisites**: Character with NEX >= 35 (needed to unlock veteran skills)

**Steps**:
1. Load a character with NEX >= 35
2. Click "Aprender Perícia" to enter learning mode
3. Select a skill by clicking it once (trained)
4. Click it again (should become veteran, if within limit)
5. Click "Salvar Perícias"
6. Refresh the page

**Expected Result**: The veteran skill displays with degree 10, veteran indicator shows

---

## Test Case 3: Preserve Origin Skills
**Objective**: Verify that origin-provided skills are never removed.

**Steps**:
1. Load a character with an origin that provides skills (e.g., Militar +1 com Luta)
2. Click "Aprender Perícia"
3. Unselect (remove) the origin-provided skill
4. Click "Salvar Perícias"
5. Refresh the page

**Expected Result**: The origin-provided skill is still there (cannot be removed by the user)

---

## Test Case 4: Mixed Trained and Veteran
**Objective**: Verify that multiple trained and veteran skills save correctly together.

**Steps**:
1. Load character with NEX >= 35
2. Enter learning mode
3. Select 2 trained skills (click once)
4. Select 1 veteran skill (click twice)
5. Click "Salvar Perícias"
6. Refresh the page

**Expected Result**: 
- 2 skills show as trained (degree 5)
- 1 skill shows as veteran (degree 10)
- All persist correctly

---

## Test Case 5: Clear All Skills (Except Origin)
**Objective**: Verify that all user-selected skills can be unselected and saved.

**Steps**:
1. Load character with selected skills
2. Enter learning mode
3. Unselect all non-origin skills
4. Click "Salvar Perícias"
5. Refresh the page

**Expected Result**: 
- Only origin-provided skills remain
- Character has no other trained skills
- Page refreshes properly

---

## Database Verification

After each test, verify the database by checking the `character_skills` table:

```sql
SELECT cs.*, s.name 
FROM character_skills cs
JOIN skills s ON cs.skill_id = s.id
WHERE cs.character_id = [CHARACTER_ID]
ORDER BY s.name;
```

**Expected columns**:
- `character_id`: The character's ID
- `skill_id`: The skill's ID
- `trainingDegree`: 5 for trained, 10 for veteran
- Skill name from joined skills table

---

## Error Cases

### Network Error
If the save fails due to network error:
- Button should show loading state until timeout
- On error, error message appears in console
- Learning mode stays active so user can try again

### Authorization Error
If user tries to modify another user's character:
- Backend should return 403/401
- Operation should fail silently (for security)
- Learning mode stays active

### Database Constraint Violation
If a skill doesn't exist:
- Endpoint validates against Skill database
- Invalid skills are skipped silently
- Valid skills are saved

---

## Performance Notes

- Each skill lookup queries the database (could be optimized with batch query)
- Deletion of non-origin skills is done individually (could batch delete)
- Return of full character after save ensures UI stays synchronized

Future optimization could use batch queries to reduce database hits.
