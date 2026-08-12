# TIMELINE — Project Progression

> The history of **DND (Dungeon and dragons)**: from a ~100-line Lua arcade sketch to a
> 100-floor web roguelike. This is an AI-driven project — every milestone below was a
> conversation: a human directive, an AI implementation, and sometimes a human correction.

## Phase 0 — *Meteor Dodge* (Lua, console)

The ancestor. A one-file Lua arcade game for OneCompiler: a 25×12 grid, a ship (`A`)
dodging falling meteors (`*`), a pre-scripted control string, 3 lives, 45 turns.
No real input, no rendering beyond `print()`. Its DNA survives everywhere: the grid,
the turn loop, the HUD line, the win/lose banner.

## Phase 1 — The D&D turn (still Lua)

**Directive:** *"turn this into a turn-based game inspired by D&D."*
The dodger became a crawler: classes (Fighter / Rogue / Wizard), d20 vs AC, crits and
fumbles, XP & leveling, potions, gold, 3 floors, a Red Dragon boss, BFS-pathfinding
enemy AI — and, because OneCompiler's Lua had no interactive stdin, an **auto-play AI**
that plays the game when no input exists.

## Phase 2 — The great migration: Lua → HTML / CSS / JS ⭐

The turning point. Lua on OneCompiler proved to be a dead end for a visual game:
console-only output, no keyboard, no animation. The project switched to an HTML project
(three tabs) and the whole engine was ported under one strict rule:
**"all logic remains identical."**

- `print()` grids → a DOM grid of styled cells
- STDIN lines → `keydown` events
- stdin class selection → overlay buttons
- auto-play output throttling (a console protection) → removed; the browser renders every turn

Only the I/O layer changed; every rule, table, and formula carried over 1:1.
This migration unlocked everything that follows.

## Phase 3 — Economy & juice

- **Shop:** a traveling merchant (`M`) on every floor; weapon tiers; potions; training
  upgrades (Max HP, AC, ability uses) and weapon honing.
- **Combat visuals:** floating damage numbers, CRIT bursts, hit/death/heal flashes,
  Firebolt projectiles, screen shake, color-coded combat log.

## Phase 4 — The long deep: 100 floors & the character sheet

- A **separate stat-allocation menu** (`C`): +3 stat points per level into STR/DEX/CON/INT.
- Floor cap raised from 3 to **100**, with depth-scaled enemies and new monster tiers
  (wraith, ogre, drake, demon, death knight).
- Shop extended to late-game gear, ending at the *Masamune*.

## Phase 5 — The Weapon correction (human directive)

The first attempt placed the FF7-inspired Weapons as fixed milestone bosses and crowned
Emerald the floor-100 final boss. **Rejected.** In FF7 lore the Weapons are *secret
super-bosses* — optional, rare, rewarding. The correction reshaped the design:

- `?` portals now spawn at **~3% per floor**, boosted by greed (≥300 gold) and
  **guaranteed by a dragon's death cry**.
- Tiers follow depth *and* lore order: Sapphire < Diamond < Ultima < Ruby < Emerald.
- Each drops a **relic** (Sapphire Ring, Diamond Aegis, Ultima Core, Ruby Heart, Emerald Harp).
- A new *temporary* main boss took floor 100: **Tiamat, Dragon Queen**.
- The human director renamed the project: **DND (Dungeon and dragons)**.

## Phase 6 — Persistence

Auto-save to `localStorage` every turn; a **Continue** button resumes a mid-run game after
reload; meta records (best score, deepest floor, wins, runs) persist across runs.
One hard rule from the director: *data resets only when an explicit **"Erase data"** button
is pressed* — implemented with a two-click confirm as the single wipe path in the codebase.

## What's next (open questions for contributors)

- relic set bonuses
- elite affixes beyond floor 70
- rest shrines, camp events, stranger secret conditions
- multiple save slots

---

*See `README.md` for how to play, and `LORE.md` for the canon these mechanics became.*
