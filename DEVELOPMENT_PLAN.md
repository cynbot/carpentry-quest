# Carpentry Quest - Development Plan

## Project Overview

**Purpose:** A personal, gamified carpentry learning app for one user (your partner)
**Focus:** Fast-paced, interactive training tools with visible progress
**Style:** Elden Ring-inspired skill tree, motorcycle aesthetic, red/charcoal/metallic colors
**Tech:** React + TypeScript + Tailwind, localStorage (no backend), PWA for mobile

## Core Principles

- ✅ **Fast interactions** - 2-5 minute sessions, instant feedback
- ✅ **Visible progress** - XP bars, skill unlocks, "ding!" moments
- ✅ **Interactive tools** - Hands-on practice, not reading walls of text
- ✅ **Build optimization feel** - Skill tree like Destiny 2 character customization
- ❌ **No social features** - Single player only
- ❌ **No complex backend** - Everything local, works offline

## Content Accuracy Strategy

### Source Hierarchy
1. **OSHA official docs** (for safety - zero tolerance for errors)
2. **Carpentry Curriculum document** (for skills/progression)
3. **NCCER standards** (for technical details)
4. **Union requirements** (for test prep)
5. **Claude's knowledge** (only for UI copy, NEVER for teaching content)

### Quality Control Process
1. Claude creates content structure with `[NEEDS REVIEW]` tags
2. You review in small batches
3. Claude marks reviewed content with ✅
4. Before launch: Final pass on ALL safety content
5. After launch: Partner feedback drives updates

### Collaboration Model

**Claude's Role:**
- Build all interactive systems and UI components
- Create data structures for content
- Make it fast, beautiful, responsive
- Generate placeholder/sample content marked `[NEEDS REVIEW]`

**Your Role:**
- Provide/verify accurate content
- Test everything
- Give feedback on engagement
- Final approval on all teaching material

## Development Phases

---

### Phase 1: Foundation + Quick Win Tools (Week 1)
**Goal:** Get something working and useful immediately

**Technical Setup:**
- React + TypeScript + Tailwind project
- Basic navigation and routing
- Design system (red/charcoal/metallic colors)
- localStorage utilities

**Standalone Tools to Build:**

1. **Fraction Converter**
   - Pure math calculator (decimal ↔ fraction)
   - Add/subtract/multiply/divide fractions
   - Visual representation with lumber pieces
   - Immediate value, no content review needed

2. **Cut-List Calculator**
   - Input: board length, desired cuts, saw kerf
   - Output: number of boards needed, waste calculation
   - Visual diagram of cuts
   - You verify math/kerf allowances

**Deliverables:**
- ✅ Working app with 2 functional calculators
- ✅ Installable PWA
- ✅ Works offline
- ✅ Red/motorcycle aesthetic

---

### Phase 2: Core Progression System (Week 2)
**Goal:** Build the skill tree and XP system

**Features:**
- Skill tree visualization (Elden Ring style)
- Character sheet / dashboard
- XP and leveling system
- Progress tracking (localStorage)
- Animation system (XP gains, skill unlocks)

**Content Collaboration:**
- Claude creates skill data structure
- You define: skill names, descriptions, prerequisites, XP requirements
- Claude integrates and makes it visual

**Deliverables:**
- ✅ Beautiful interactive skill tree
- ✅ Working XP system with animations
- ✅ Character progression dashboard
- ✅ Still has Phase 1 calculators

---

### Phase 3: Tape Measure Trainer (Week 3)
**Goal:** Build the killer interactive feature

**Features:**
- Interactive tape measure (SVG/Canvas)
- Touch/click interaction
- Timer and scoring
- Game modes: Tutorial, Speed Challenge, Accuracy Test
- Visual feedback (animations, sawdust particles)
- XP integration with skill tree

**Content Collaboration:**
- Claude generates measurement challenges based on patterns
- You verify difficulty progression
- Add real-world context hints
- Test and give feedback

**Deliverables:**
- ✅ Fully interactive tape measure
- ✅ Multiple game modes
- ✅ Fast and responsive feel
- ✅ Awards XP, unlocks skills

---

### Phase 4: More Standalone Tools (Week 4)
**Goal:** Build the reference section

**Tools to Build:**

1. **Tool Glossary**
   - Searchable list of carpentry tools
   - Photos/diagrams, descriptions, safety notes
   - Filter by category, bookmark favorites
   - Content: You provide tool list or we use standard references

2. **Safety Checklist**
   - Daily/task-based safety checklists
   - Checkboxes with localStorage saving
   - Content: From OSHA official docs (you source)

3. **Materials 101**
   - Reference guide: plywood grades, lumber types, fasteners
   - Searchable, filterable
   - Content: Industry standards (you verify)

**Deliverables:**
- ✅ Complete "Tools" reference section
- ✅ Functional safety checklists
- ✅ Materials reference guide
- ✅ All bookmarkable and searchable

---

### Phase 5: Math Mini-Games (Week 5)
**Goal:** Make math practice actually fun

**Features:**
- Fraction practice game (fast-paced, visual)
- Pythagorean theorem trainer (3-4-5 rule, rafter calculations)
- Board foot calculator (with practice mode)
- Stair calculator (rise/run, code compliance)
- Quick challenge mode (random 2-min math sprint)
- XP/skill integration

**Content Collaboration:**
- Claude generates problems algorithmically where possible
- Pull formulas from Curriculum doc
- You verify accuracy
- Focus on union test requirements

**Deliverables:**
- ✅ 4 interactive math trainers
- ✅ Quick challenge mode
- ✅ Visual feedback and animations
- ✅ Skills unlock on skill tree

---

### Phase 6: Safety Content (Week 6)
**Goal:** OSHA prep, done RIGHT

**CRITICAL:** Content source is OSHA official docs ONLY

**Features:**
- Quiz/flashcard system for OSHA Focus Four
- "Spot the hazard" photo challenges
- PPE inspection guides
- Progress tracking for safety topics
- Links to official OSHA resources

**Content Collaboration:**
- You source OSHA Focus Four content
- You review EVERY safety fact
- Consider getting second opinion from construction professional
- Claude builds the interactive UI only

**Deliverables:**
- ✅ OSHA Focus Four modules
- ✅ PPE inspection guides
- ✅ Safety violation spotter game
- ✅ Links to official resources

---

### Phase 7: Polish & Mobile Optimization (Week 7)
**Goal:** Make it shine

**Features:**
- Performance optimization
- Animation polish
- Sound effects (toggle-able - hammer strikes, saw sounds)
- Touch interaction improvements
- PWA manifest and icons (red hammer logo)
- Offline functionality verification
- "Motorcycle Mode" unlock (speed-themed UI skin)

**Testing:**
- You test on partner's phone
- Feedback on confusing elements
- Verify fast/responsive feel

**Deliverables:**
- ✅ Polished, performant app
- ✅ Great mobile experience
- ✅ Offline-capable
- ✅ Sound effects and animations

---

## Standalone Resource Pages

All accessible from main navigation:

1. **Tool Glossary** - Searchable tool reference
2. **Safety Checklist** - Daily/task checklists
3. **Cut-List Calculator** - Board cutting optimizer
4. **Fraction Converter** - Decimal ↔ fraction calculator
5. **Materials 101** - Plywood, lumber, fastener reference

---

## Skill Tree Structure (Draft)

```
                [Safety Core]
                 (required)
                      |
        ┌─────────────┼─────────────┐
        |             |             |
  [Measurement]   [Framing]    [Materials]
        |             |             |
    [Math]       [Cutting]    [Blueprint]
```

**Build Paths** (like Destiny 2 subclasses):
- **Speed Demon**: Measurement + Math focus, faster timers, score multipliers
- **Precision**: Framing + Blueprint focus, accuracy bonuses
- **Foundation**: Balanced, unlocks everything slowly

You can experiment and optimize!

---

## Agent Usage Guidelines

### How Claude Code Agents Actually Work

**Reality:**
- Sequential execution (not parallel)
- Each agent completes and returns results
- Can spawn Task agents for specific features
- All agents work one at a time

**Example Usage:**
```
Task Agent → "Build the tape measure interactive component"
Task Agent → "Create the skill tree visualization with D3.js"
Task Agent → "Set up PWA configuration"
```

**What Agents DON'T Do:**
- ❌ Create teaching content autonomously
- ❌ Work in parallel like the Multi-Agent doc suggested
- ❌ Make content decisions without review

---

## Content Review Workflow

### For Each Feature:

1. **Claude builds feature** with placeholder content
2. **Claude creates content file** (e.g., `challenges.json`)
   ```json
   {
     "challenges": [
       {
         "id": 1,
         "difficulty": 1,
         "target": "3-1/2",
         "hint": "[NEEDS REVIEW]",
         "source": "Curriculum doc page X"
       }
     ]
   }
   ```
3. **You review** in small batches (not overwhelming)
4. **Claude updates** and marks reviewed with ✅
5. **Iterate** based on testing

### Safety Content - Extra Steps:

1. Source from OSHA docs only
2. Include links to original sources
3. You verify every word
4. Consider expert review
5. Never rely on Claude's knowledge alone

---

## Success Metrics

**What makes this successful:**
- Partner uses it 3-5 times per week
- Sessions are 5-15 minutes (fast-paced)
- They say it's "fun" not "homework"
- Visible skill improvement in real practice
- They feel confident for union entry exam

**What to track:**
- Accuracy improvement over time (tape measure, math)
- Skills unlocked
- Total practice hours
- Favorite features (use most often)

---

## Phase 1 Next Steps

**Immediate Actions:**
1. ✅ Save this plan (you're reading it!)
2. Set up React + TypeScript + Tailwind project
3. Create design system with color palette
4. Build Fraction Converter
5. Build Cut-List Calculator
6. Set up PWA for mobile installation

**First Milestone:** Working calculators on partner's phone this weekend!

---

## Notes & Decisions

*Use this section to track decisions made during development*

### Design Decisions:
-

### Content Decisions:
-

### Technical Decisions:
-

### Partner Feedback:
-

---

**Let's build something awesome! 🔨**
