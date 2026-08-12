# Project-DND

**A browser-based, turn-based, D&D-inspired roguelike** — one hundred floors of dice-driven
danger, crowned by **Tiamat, the Dragon Queen**, and haunted by **secret Weapon super-bosses**
(an affectionate homage to *Final Fantasy VII*).

This project began life as a tiny Lua console arcade game called *Meteor Dodge*, was rebuilt
as a D&D-style dungeon crawler, and found its true form when it was **migrated to plain
HTML + CSS + JavaScript**. It is an **AI-driven open-source project**: every system, balance
table, and document in this repository was produced through iterative human–AI collaboration,
with the Lua → web migration as the project's turning point.

---

## What is this?

You are a delver of the **Meteor Crypt**, a hundred-floor dungeon born from a fallen star.
Descend, level up, allocate stat points, buy and hone weapons, and roll the d20 against
escalating horrors — goblins to death knights, drakes to demons.

- **3 classes** — Fighter / Rogue / Wizard, each with a signature ability.
- **True tabletop-style combat** — d20 attack rolls, AC, crits, fumbles, advantage, proficiency.
- **Character sheet** — every level grants stat points to spend on STR / DEX / CON / INT.
- **Economy** — a traveling merchant on every floor; 8 weapon tiers up to the *Masamune*;
  training upgrades (Max HP, AC, ability uses) and weapon honing.
- **Secret super-bosses** — the five Weapons (Sapphire → Diamond → Ultima → Ruby → Emerald)
  appear only through rare or conditional portals; each drops a unique **relic**.
- **Persistence** — auto-saves every turn; resume with *Continue*; only **Erase data** wipes.
- **Combat juice** — floating damage numbers, crit bursts, projectiles, screen shake,
  color-coded log.
- **Auto-Play demo** — a built-in AI (inherited from the Lua "no input" mode) that plays
  the whole game hands-free.

## How to play

| Key | Action |
|---|---|
| `WASD` / `HJKL` / Arrows | Move (bump an enemy to attack) |
| `F` | Class ability |
| `Q` | Drink potion |
| `X` | Defend (+2 AC until next turn) |
| `.` / `Space` | Wait |
| `B` | Shop (while standing on `M`) |
| `C` | Character sheet (spend stat points) |
| `1–9` | Buy / allocate in menus |
| `Esc` | Close menus |

**Goal:** reach floor 100 and slay Tiamat.
**Secret goal:** find the `?` portals… if they find you first.

## Run it

**OneCompiler:** create an HTML project, paste the three files from `src/` into the
`index.html`, `styles.css`, and `script.js` tabs, press **Run**.

**Locally:**

```bash
git clone <your-repo-url>
cd <your-repo>
# either open src/index.html directly, or serve it:
cd src && python -m http.server 8000   # → http://localhost:8000
```

## Repository layout

```text
/
├── README.md        # you are here
├── TIMELINE.md      # project progression (the Lua → web migration & beyond)
├── LORE.md          # the canon of the Meteor Crypt
└── src/
    ├── index.html   # structure, HUD, overlays
    ├── styles.css   # theme, board, combat FX
    └── script.js    # the entire game engine
```

## AI-driven development

This repository is an experiment in **AI-paired game development**. The project started as a
single-file Lua arcade sketch and grew, through conversational iteration, into a full
turn-based RPG. The human director set the vision, the constraints, and the corrections —
including the crucial one that restored the Weapons to their proper role as *secret* bosses
and renamed the project; the AI produced the code, the balance math, and the prose.

The pivotal chapter was the **migration from Lua to HTML/CSS/JS**: OneCompiler's Lua
environment offered only console output and no real input, so the entire engine was ported
with a strict rule — *logic first, I/O last*: every rule and table carried over 1:1, while
`print()` grids became a DOM board and STDIN lines became keyboard events. That migration
unlocked everything that followed. See `TIMELINE.md`.

## Contributing

Ideas welcome. Seeds already on the table:

- relic set bonuses
- elite affixes for deep floors (vampiric, reflecting…)
- rest shrines & camp events
- multiple save slots
- even rarer secret conditions ("full moon", "666 XP", "never harmed a merchant")

