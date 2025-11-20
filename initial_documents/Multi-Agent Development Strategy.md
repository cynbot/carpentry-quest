## **MULTI-AGENT DEVELOPMENT STRATEGY FOR CARPENTRY QUEST**

### **MANAGER AGENT ROLE**

**Your Primary Responsibilities:**
1. Maintain the central project repository and architecture
2. Define interfaces between modules (API contracts)
3. Review and integrate code from specialist agents
4. Ensure consistent styling and component libraries
5. Run tests and deployment
6. Track progress against the master plan

**Initial Setup Tasks for Manager:**
```bash
# Create monorepo structure
/carpentry-quest
  /packages
    /shared          # Shared types, utilities, components
    /frontend        # Main React app shell
    /tape-measure    # Measurement trainer module
    /math-module     # Math training system
    /skill-tree      # Progression system
    /safety          # OSHA and safety training
    /blueprints      # Blueprint reading module
  /backend
    /api            # Supabase functions
    /database       # Schema and migrations
```

**Manager's Configuration File to Share:**
```typescript
// packages/shared/src/types/index.ts
export interface ModuleInterface {
  id: string;
  name: string;
  route: string;
  entryComponent: React.FC;
  requiredLevel: number;
  xpReward: number;
}

export interface UserProgress {
  userId: string;
  currentXP: number;
  completedModules: string[];
  accuracyScores: Record<string, number>;
}

export interface DesignSystem {
  colors: {
    primary: '#C41E3A';
    charcoal: '#2C3E50';
    // ... etc
  };
  components: {
    Button: React.FC<ButtonProps>;
    Card: React.FC<CardProps>;
    ProgressBar: React.FC<ProgressProps>;
  };
}
```

---

### **AGENT 1: FRONTEND ARCHITECT**

**Mission:** Build the main app shell, authentication, and shared component library

**Deliverables:**
```
- React + TypeScript + Tailwind setup
- Routing system with lazy loading
- Authentication flow (Supabase)
- Shared component library:
  - XPProgressBar
  - SkillNode
  - AchievementBadge
  - NavigationMenu
  - DailyChallengeCard
- Dashboard layout
- PWA configuration
- State management (Zustand/Context)
```

**API Contract You Provide:**
```typescript
interface ModuleRegistry {
  registerModule(module: ModuleInterface): void;
  getModuleRoute(moduleId: string): string;
  updateProgress(moduleId: string, data: ProgressUpdate): void;
}
```

**Success Criteria:**
- Other agents can plug in their modules without touching your code
- Consistent look/feel across all modules
- Mobile responsive
- Offline capability

---

### **AGENT 2: TAPE MEASURE SPECIALIST**

**Mission:** Build the complete interactive tape measure training system

**Deliverables:**
```
- Standalone tape measure component
- 4 game modes:
  1. Tutorial mode
  2. Speed measurement
  3. Real world simulator
  4. Framing challenge
- Canvas/SVG tape measure renderer
- Measurement accuracy tracker
- Local storage for practice history
```

**Your Module Interface:**
```typescript
export const TapeMeasureModule: ModuleInterface = {
  id: 'tape-measure',
  name: 'Measurement Mastery',
  route: '/training/measure',
  entryComponent: TapeMeasureTrainer,
  requiredLevel: 0,
  xpReward: 50
}

// Emits events to parent:
onMeasurementComplete(accuracy: number, time: number)
onXPEarned(amount: number)
onAchievementUnlocked(achievementId: string)
```

**Focus on:**
- Pixel-perfect tape measure rendering
- Smooth animations
- Touch-friendly for mobile
- Accuracy tracking to 1/16"

---

### **AGENT 3: MATH MODULE SPECIALIST**

**Mission:** Build the complete carpentry math training system

**Deliverables:**
```
- Fraction calculator with visual lumber
- Pythagorean theorem trainer
- Board foot calculator
- Stair calculator
- Material estimation system
- Practice problem generator
- Progress tracking
```

**Your Module Interface:**
```typescript
export const MathModule: ModuleInterface = {
  id: 'carpenter-math',
  name: 'Construction Mathematics',
  route: '/training/math',
  entryComponent: MathTrainer,
  requiredLevel: 1,
  xpReward: 75
}
```

**Problem Database Structure:**
```typescript
interface MathProblem {
  id: string;
  type: 'fraction' | 'pythagorean' | 'conversion' | 'estimation';
  difficulty: 1-5;
  problem: string;
  answer: number | string;
  explanation: string;
  visualAid?: string; // SVG or image
}
```

---

### **AGENT 4: SKILL TREE & PROGRESSION**

**Mission:** Build the RPG-style skill tree and progression system

**Deliverables:**
```
- Visual skill tree (D3.js or React Flow)
- XP calculation system
- Achievement engine
- Daily challenge generator
- Leaderboards
- Progress analytics
- Portfolio generator
```

**Database Schema You Own:**
```sql
-- Skills and progression
CREATE TABLE skills (...);
CREATE TABLE user_skills (...);
CREATE TABLE achievements (...);
CREATE TABLE daily_challenges (...);
CREATE TABLE leaderboard (...);
```

**Events You Listen For:**
```typescript
// From other modules
onModuleComplete(moduleId, score, timeSpent)
onXPEarned(source, amount)
onAccuracyUpdate(skill, accuracy)
```

---

### **AGENT 5: SAFETY & OSHA MODULE**

**Mission:** Build the safety training and OSHA prep system

**Deliverables:**
```
- OSHA 10 content organized by topic
- Focus Four hazards trainer
- PPE inspection checklist
- Safety violation spotter (photo challenges)
- Quiz system with explanations
- Certificate generator
```

**Content Structure:**
```typescript
interface SafetyModule {
  topics: {
    falls: Lesson[];
    struckBy: Lesson[];
    caughtBetween: Lesson[];
    electrical: Lesson[];
  };
  quizzes: Quiz[];
  scenarios: SafetyScenario[];
}
```

---

### **AGENT 6: BLUEPRINT READING MODULE**

**Mission:** Build the blueprint interpretation training system

**Deliverables:**
```
- Interactive blueprint viewer
- Symbol library and flashcards
- Dimension reading exercises
- Plan/elevation/section tutorials
- Progress from residential to commercial plans
```

---

### **AGENT 7: BACKEND & DATABASE SPECIALIST**

**Mission:** Set up Supabase and all backend services

**Deliverables:**
```
- Complete database schema
- Row Level Security policies
- Edge functions for:
  - XP calculations
  - Leaderboard updates
  - Daily challenge generation
- Backup and migration strategy
- Real-time subscriptions for multiplayer features
```

---

## **COORDINATION PROTOCOL**

### **Week 1 Sprint Planning (Manager Runs This)**
```markdown
Day 1-2: Manager sets up monorepo, defines interfaces
Day 2: All agents get their assignments
Day 3-5: Parallel development
Day 6: Integration day
Day 7: Testing and bug fixes
```

### **Daily Sync Points**
Each agent commits to their branch with:
```bash
# Commit message format
[AGENT-2] feat: Add tape measure animation system
[AGENT-3] fix: Fraction calculator decimal conversion
[MANAGER] merge: Integrate math module with main app
```

### **Integration Checklist (Manager Uses)**
```markdown
Before merging any module:
[ ] Module follows design system colors/fonts
[ ] API contract is respected
[ ] Mobile responsive
[ ] Includes error handling
[ ] Has loading states
[ ] Emits progress events
[ ] Includes basic tests
[ ] Documentation in README
```

### **Resource Allocation Strategy**

**High Priority (Assign Best Agents):**
1. Tape Measure Trainer (Most unique/important feature)
2. Math Module (Core requirement for unions)
3. Skill Tree (Engagement driver)

**Medium Priority:**
4. Safety Module (Required but straightforward)
5. Frontend Shell (Important but conventional)

**Lower Priority (Can be simpler):**
6. Blueprint Module (Can start basic)
7. Backend (Can use Supabase templates)

### **Communication Between Agents**

Create a shared document with:
```markdown
## Component Library
- Button: [Agent 1] Ready ✅
- ProgressBar: [Agent 1] Ready ✅
- TapeMeasure: [Agent 2] In Progress 🚧

## API Endpoints
- /api/progress: [Agent 7] Ready ✅
- /api/achievements: [Agent 4] In Progress 🚧

## Blockers
- [Agent 2] Needs ProgressBar component from Agent 1
- [Agent 3] Waiting for database schema from Agent 7

## Integration Status
- [ ] Tape Measure ← → Main App
- [ ] Math Module ← → Progress System
- [ ] Safety Module ← → Achievements
```

### **Testing Strategy**

Each agent includes basic tests:
```typescript
// Each module includes
describe('ModuleName', () => {
  it('renders without crashing', () => {});
  it('emits XP events correctly', () => {});
  it('saves progress locally', () => {});
  it('handles errors gracefully', () => {});
});
```

Manager runs integration tests:
```typescript
describe('Full User Journey', () => {
  it('completes measurement challenge and earns XP', () => {});
  it('unlocks achievement and updates skill tree', () => {});
  it('syncs progress when reconnecting', () => {});
});
```

---

## **SAMPLE MANAGER COORDINATION MESSAGE**

"Team, here's our build plan:

**Agent 1**: Start with auth and component library. We need Button, Card, and ProgressBar by Day 3.

**Agent 2**: Begin tape measure renderer. Use placeholder UI until Agent 1's components are ready.

**Agent 3**: Set up problem generators. Can work independently until integration.

**Agent 4**: Design skill tree data structure. Share with Agent 7 for database.

**Agent 5**: Compile OSHA content into JSON. Can work fully independently.

**Agent 6**: Research blueprint symbols. Low priority for Week 1.

**Agent 7**: Database schema is URGENT. Everyone needs this by Day 2.

Check the shared doc for updates. Integration Friday at 2 PM."

