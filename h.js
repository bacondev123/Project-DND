// Dungeon & Dragon — Board-based D&D exploration with FFVII Weapons, skill trees, and dev balance tools

const SKILL_TREES = {
    warrior: {
        branches: [
            { name: 'Combat', skills: [
                { id: 'w_atk1', name: 'Weapon Mastery', icon: '⚔️', desc: '+1 Attack Roll per rank', maxRank: 3, cost: 1, effect: { attackBonus: 1 } },
                { id: 'w_atk2', name: 'Power Attack', icon: '🔨', desc: '+2 Damage Roll', maxRank: 1, cost: 2, requires: 'w_atk1:3', effect: { damageBonus: 2 } }
            ]},
            { name: 'Defense', skills: [
                { id: 'w_def1', name: 'Iron Skin', icon: '🛡️', desc: '+1 AC per rank', maxRank: 3, cost: 1, effect: { ac: 1 } },
                { id: 'w_def2', name: 'Juggernaut', icon: '💪', desc: '+15 Max HP', maxRank: 1, cost: 2, requires: 'w_def1:3', effect: { maxHp: 15 } }
            ]},
            { name: 'Rage', skills: [
                { id: 'w_rage1', name: 'Berserker Focus', icon: '🔥', desc: 'Special +20% per rank', maxRank: 3, cost: 1, effect: { specialMult: 0.2 } },
                { id: 'w_rage2', name: 'Unstoppable', icon: '⚡', desc: 'Critical threshold -1', maxRank: 1, cost: 3, requires: 'w_rage1:3', effect: { critThreshold: -1 } }
            ]}
        ]
    },
    mage: {
        branches: [
            { name: 'Arcane', skills: [
                { id: 'm_int1', name: 'Arcane Intellect', icon: '🔮', desc: '+1 Attack Roll per rank', maxRank: 3, cost: 1, effect: { attackBonus: 1 } },
                { id: 'm_int2', name: 'Archmage', icon: '🌟', desc: '+2 Damage Roll', maxRank: 1, cost: 2, requires: 'm_int1:3', effect: { damageBonus: 2 } }
            ]},
            { name: 'Elemental', skills: [
                { id: 'm_ele1', name: 'Elemental Mastery', icon: '🔥', desc: 'Critical threshold -1 per rank', maxRank: 3, cost: 1, effect: { critThreshold: -1 } },
                { id: 'm_ele2', name: 'Meteor Swarm', icon: '☄️', desc: 'Special +25%', maxRank: 1, cost: 2, requires: 'm_ele1:3', effect: { specialMult: 0.25 } }
            ]},
            { name: 'Protection', skills: [
                { id: 'm_shield1', name: 'Mana Shield', icon: '🛡️', desc: '+1 AC per rank', maxRank: 3, cost: 1, effect: { ac: 1 } },
                { id: 'm_shield2', name: 'Aether Ward', icon: '✨', desc: '+12 Max HP', maxRank: 1, cost: 2, requires: 'm_shield1:3', effect: { maxHp: 12 } }
            ]}
        ]
    },
    rogue: {
        branches: [
            { name: 'Assassin', skills: [
                { id: 'r_dag1', name: 'Poisoned Blade', icon: '🗡️', desc: '+1 Damage Roll per rank', maxRank: 3, cost: 1, effect: { damageBonus: 1 } },
                { id: 'r_dag2', name: 'Deathblow', icon: '💀', desc: '+2 Attack Roll', maxRank: 1, cost: 2, requires: 'r_dag1:3', effect: { attackBonus: 2 } }
            ]},
            { name: 'Shadow', skills: [
                { id: 'r_shadow1', name: 'Shadow Step', icon: '🌑', desc: 'Special steal +15% per rank', maxRank: 3, cost: 1, effect: { specialMult: 0.15 } },
                { id: 'r_shadow2', name: 'Phantom Strike', icon: '👤', desc: 'Special +20%', maxRank: 1, cost: 2, requires: 'r_shadow1:3', effect: { specialMult: 0.2 } }
            ]},
            { name: 'Evasion', skills: [
                { id: 'r_eva1', name: 'Swift Footwork', icon: '💨', desc: '+1 AC per rank', maxRank: 3, cost: 1, effect: { ac: 1 } },
                { id: 'r_eva2', name: 'Elusiveness', icon: '🌪️', desc: '+10 Max HP', maxRank: 1, cost: 2, requires: 'r_eva1:3', effect: { maxHp: 10 } }
            ]}
        ]
    },
    paladin: {
        branches: [
            { name: 'Holy', skills: [
                { id: 'p_holy1', name: 'Holy Light', icon: '✨', desc: 'Special heal +10% per rank', maxRank: 3, cost: 1, effect: { specialMult: 0.1 } },
                { id: 'p_holy2', name: 'Divine Wrath', icon: '⚡', desc: 'Special damage +20%', maxRank: 1, cost: 2, requires: 'p_holy1:3', effect: { specialMult: 0.2 } }
            ]},
            { name: 'Aegis', skills: [
                { id: 'p_aeg1', name: 'Bulwark', icon: '🛡️', desc: '+1 AC per rank', maxRank: 3, cost: 1, effect: { ac: 1 } },
                { id: 'p_aeg2', name: 'Fortress', icon: '🏰', desc: '+15 Max HP', maxRank: 1, cost: 2, requires: 'p_aeg1:3', effect: { maxHp: 15 } }
            ]},
            { name: 'Retribution', skills: [
                { id: 'p_ret1', name: 'Smite', icon: '🔨', desc: '+1 Attack Roll per rank', maxRank: 3, cost: 1, effect: { attackBonus: 1 } },
                { id: 'p_ret2', name: 'Crusader', icon: '⚔️', desc: '+2 Damage Roll', maxRank: 1, cost: 2, requires: 'p_ret1:3', effect: { damageBonus: 2 } }
            ]}
        ]
    }
};

const CLASSES = {
    warrior: { name: 'Warrior', hp: 30, sprite: '🛡️', special: 'Berserker Rage', specialDesc: 'Deal 2.5x weapon damage', weapon: 'longsword' },
    mage: { name: 'Mage', hp: 18, sprite: '🔮', special: 'Meteor', specialDesc: 'Deal 3.5x magic damage ignoring AC', weapon: 'dagger' },
    rogue: { name: 'Rogue', hp: 22, sprite: '🗡️', special: 'Shadow Strike', specialDesc: 'Deal 2.2x damage and steal gold', weapon: 'rapier' },
    paladin: { name: 'Paladin', hp: 26, sprite: '✨', special: 'Holy Judgment', specialDesc: 'Heal 50% HP and deal holy damage', weapon: 'mace' }
};

const WEAPON_TABLE = {
    fists: { name: 'Fists', dice: '1d4', attackBonus: 0, damageBonus: 0, value: 0 },
    dagger: { name: 'Dagger', dice: '1d6', attackBonus: 0, damageBonus: 0, value: 15 },
    shortsword: { name: 'Shortsword', dice: '1d8', attackBonus: 0, damageBonus: 0, value: 35 },
    longsword: { name: 'Longsword', dice: '1d10', attackBonus: 0, damageBonus: 0, value: 60 },
    greataxe: { name: 'Greataxe', dice: '1d12', attackBonus: 0, damageBonus: 0, value: 90 },
    greatsword: { name: 'Greatsword', dice: '2d6', attackBonus: 0, damageBonus: 0, value: 120 },
    rapier: { name: 'Rapier', dice: '1d8', attackBonus: 1, damageBonus: 0, value: 80 },
    mace: { name: 'Mace', dice: '1d8', attackBonus: 0, damageBonus: 2, value: 75 }
};

const MERCHANT_WARES = [
    { type: 'potion', name: 'Potion of Healing', heal: 20, price: 15, desc: 'Restores 20 HP' },
    { type: 'ac', name: 'Ring of Protection', bonus: 1, price: 80, desc: '+1 Armor Class' },
    { type: 'ac', name: 'Shield of Faith', bonus: 2, price: 160, desc: '+2 Armor Class' },
    { type: 'attack', name: 'Lucky Charm', bonus: 1, price: 90, desc: '+1 Attack Roll' },
    { type: 'attack', name: 'Eagle Eye Lens', bonus: 2, price: 180, desc: '+2 Attack Roll' },
    { type: 'damage', name: 'Bracers of Power', bonus: 2, price: 100, desc: '+2 Damage Roll' },
    { type: 'damage', name: 'Gauntlets of Ogre Strength', bonus: 4, price: 220, desc: '+4 Damage Roll' },
    { type: 'weapon', key: 'dagger', price: 20, desc: '1d6 damage' },
    { type: 'weapon', key: 'longsword', price: 70, desc: '1d10 damage' },
    { type: 'weapon', key: 'greatsword', price: 150, desc: '2d6 damage' }
];

const PERSONALITIES = [
    { likes: 'compliment', hint: 'The creature puffs up when praised.', label: 'Compliment', options: ['Compliment', 'Intimidate', 'Offer Gold', 'Reason', 'Back Away'] },
    { likes: 'intimidate', hint: 'The beast only respects dominance.', label: 'Intimidate', options: ['Compliment', 'Intimidate', 'Offer Gold', 'Reason', 'Back Away'] },
    { likes: 'bribe', hint: 'It eyes your gold pouch greedily.', label: 'Offer Gold', options: ['Compliment', 'Intimidate', 'Offer Gold', 'Reason', 'Back Away'] },
    { likes: 'reason', hint: 'It seems willing to talk.', label: 'Reason', options: ['Compliment', 'Intimidate', 'Offer Gold', 'Reason', 'Back Away'] },
    { likes: 'flee', hint: 'It looks ready to let you pass if you back away.', label: 'Back Away', options: ['Compliment', 'Intimidate', 'Offer Gold', 'Reason', 'Back Away'] }
];

class Game {
    constructor() {
        this.player = null;
        this.enemy = null;
        this.isInCombat = false;
        this.isGameOver = false;
        this.isRolling = false;
        this.isPlayerTurn = true;
        this.kills = 0;
        this.terrain = 1;
        this.maxTerrain = 20;
        this.weaponsDefeated = [];
        this.dragonLordDefeated = false;
        this.specialCooldown = 0;
        this.score = 0;

        this.board = null;
        this.movementPoints = 6;
        this.pendingClass = null;

        this.playerHpMultiplier = 1;
        this.playerAcMultiplier = 1;
        this.playerAtkMultiplier = 1;
        this.playerDmgMultiplier = 1;
        this.enemyHpMultiplier = 1;
        this.enemyAcMultiplier = 1;
        this.enemyAtkMultiplier = 1;
        this.enemyDmgMultiplier = 1;
        this.xpGoldMultiplier = 1;

        this.criticalThreshold = 19;
        this.restHealPercent = 0.25;
        this.expScale = 100;
        this.potionHealMultiplier = 1;

        this.currentDifficulty = 'normal';
        this.skillPoints = 0;

        this.enemyDefaults = {};
        this.weaponDefaults = [];
        this.enemies = this.initializeEnemies();
        this.weaponBosses = this.initializeWeaponBosses();

        this.devPanelOpen = false;

        this.init();
    }

    initializeEnemies() {
        const templates = {
            'Forest Edge': [
                { name: 'Giant Rat', hp: 10, ac: 10, atk: 2, dmg: '1d4', exp: 15, gold: 5, sprite: '🐀' },
                { name: 'Goblin', hp: 14, ac: 12, atk: 3, dmg: '1d6', exp: 25, gold: 10, sprite: '👺' },
                { name: 'Wolf', hp: 16, ac: 12, atk: 4, dmg: '1d6', exp: 30, gold: 8, sprite: '🐺' }
            ],
            'Dark Woods': [
                { name: 'Orc Raider', hp: 22, ac: 13, atk: 5, dmg: '1d8', exp: 45, gold: 18, sprite: '👹' },
                { name: 'Hobgoblin', hp: 26, ac: 14, atk: 4, dmg: '1d8', exp: 50, gold: 22, sprite: '🧌' },
                { name: 'Wraith', hp: 20, ac: 13, atk: 6, dmg: '1d6', exp: 55, gold: 25, sprite: '👻' }
            ],
            'Ancient Ruins': [
                { name: 'Skeleton', hp: 28, ac: 13, atk: 5, dmg: '1d8', exp: 60, gold: 30, sprite: '💀' },
                { name: 'Minotaur', hp: 40, ac: 14, atk: 6, dmg: '1d10', exp: 90, gold: 45, sprite: '🐂' },
                { name: 'Manticore', hp: 45, ac: 15, atk: 7, dmg: '1d10', exp: 110, gold: 55, sprite: '🦁' }
            ],
            'Volcanic Depths': [
                { name: 'Fire Elemental', hp: 50, ac: 15, atk: 8, dmg: '1d12', exp: 140, gold: 75, sprite: '🔥' },
                { name: 'Hell Hound', hp: 42, ac: 14, atk: 8, dmg: '1d10', exp: 120, gold: 60, sprite: '🐕‍🦺' },
                { name: 'Chimera', hp: 60, ac: 16, atk: 9, dmg: '2d6', exp: 180, gold: 90, sprite: '🐉' }
            ],
            'Dragon\'s Lair': [
                { name: 'Young Dragon', hp: 75, ac: 16, atk: 9, dmg: '2d6', exp: 200, gold: 120, sprite: '🐲' },
                { name: 'Dragon Lord', hp: 115, ac: 18, atk: 11, dmg: '2d8', exp: 450, gold: 300, sprite: '🐉' }
            ]
        };
        this.enemyDefaults = JSON.parse(JSON.stringify(templates));
        return templates;
    }

    initializeWeaponBosses() {
        const bosses = [
            { key: 'sapphire', name: '💧 Sapphire Weapon', title: 'AQUEOUS COLOSSUS', desc: 'A titanic crustacean of the deep. Its tsunami waves erode armor.', hp: 140, ac: 17, atk: 10, dmg: '2d8', exp: 600, gold: 600, mechanic: 'tide', color: '#4dabf7', sprite: '🦑' },
            { key: 'diamond', name: '💎 Diamond Weapon', title: 'INVINCIBLE FORTRESS', desc: 'A walking fortress of crystal. Its Diamond Flash retaliates against magic.', hp: 180, ac: 19, atk: 11, dmg: '2d8', exp: 800, gold: 800, mechanic: 'reflect', color: '#74c0fc', sprite: '🏰' },
            { key: 'ruby', name: '🔴 Ruby Weapon', title: 'DESERT TERROR', desc: 'The nightmare beneath the sands. It burrows and ignores defense.', hp: 200, ac: 18, atk: 12, dmg: '2d10', exp: 1000, gold: 1000, mechanic: 'burrow', color: '#ff6b6b', sprite: '🦂' },
            { key: 'emerald', name: '🟢 Emerald Weapon', title: 'ABYSSAL LEVIATHAN', desc: 'Lurking in the oceanic trench. Its Aire Tam Storm drains vitality.', hp: 240, ac: 18, atk: 12, dmg: '2d10', exp: 1200, gold: 1200, mechanic: 'storm', color: '#51cf66', sprite: '🐋' },
            { key: 'ultima', name: '⚫ Ultima Weapon', title: 'HARBINGER OF THE END', desc: 'The ultimate Weapon born from the planet. It casts Ultima when wounded.', hp: 320, ac: 20, atk: 14, dmg: '2d12', exp: 1800, gold: 1800, mechanic: 'ultima', color: '#da77f2', sprite: '👾' }
        ];
        this.weaponDefaults = JSON.parse(JSON.stringify(bosses));
        return bosses;
    }

    init() {
        this.bindEvents();
        this.spawnParticles();
        this.setButtonsState(true);
        this.populateCodex();
    }

    bindEvents() {
        const addClick = (id, handler) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', handler);
        };

        document.querySelectorAll('.class-card').forEach(card => {
            card.addEventListener('click', () => this.selectClassForStats(card.dataset.class));
        });

        document.querySelectorAll('.stat-select').forEach(sel => {
            sel.addEventListener('change', () => this.updateStatAllocation());
        });

        addClick('start-adventure', () => this.startGame());

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
        });

        addClick('close-inventory', () => document.getElementById('inventory-modal')?.classList.add('hidden'));
        addClick('how-to-play-btn', () => document.getElementById('how-to-play-modal')?.classList.remove('hidden'));
        addClick('close-how-to-play', () => document.getElementById('how-to-play-modal')?.classList.add('hidden'));
        addClick('enemy-codex-btn', () => document.getElementById('enemy-codex-modal')?.classList.remove('hidden'));
        addClick('close-enemy-codex', () => document.getElementById('enemy-codex-modal')?.classList.add('hidden'));

        document.querySelectorAll('.codex-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchCodexTab(tab.dataset.tab));
        });

        addClick('restart-btn', () => location.reload());
        addClick('play-again-btn', () => location.reload());

        document.addEventListener('keydown', (e) => this.handleKey(e));

        addClick('dev-apply', () => this.applyDevValues());
        addClick('dev-heal', () => this.devHeal());
        addClick('dev-kill', () => this.devKill());
        addClick('dev-crater', () => this.devUnlockCrater());
        addClick('dev-close', () => this.toggleDevPanel());

        document.querySelectorAll('.dev-btn.preset').forEach(btn => {
            btn.addEventListener('click', () => this.applyPreset(btn.dataset.preset));
        });

        document.querySelectorAll('.dev-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchDevTab(tab.dataset.tab));
        });

        const enemySearch = document.getElementById('dev-enemy-search');
        if (enemySearch) enemySearch.addEventListener('input', (e) => this.filterDevEnemies(e.target.value));

        const weaponSearch = document.getElementById('dev-weapon-search');
        if (weaponSearch) weaponSearch.addEventListener('input', (e) => this.filterDevWeapons(e.target.value));

        addClick('settings-btn', () => this.openSettings());
        addClick('close-settings', () => this.closeSettings());

        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.addEventListener('click', () => this.selectDifficulty(card.dataset.difficulty));
        });

        addClick('close-skill-tree', () => document.getElementById('skill-tree-modal')?.classList.add('hidden'));
        addClick('close-merchant', () => document.getElementById('merchant-modal')?.classList.add('hidden'));
        addClick('close-act', () => document.getElementById('act-modal')?.classList.add('hidden'));
        addClick('close-stats', () => document.getElementById('stats-modal')?.classList.add('hidden'));
    }

    selectClassForStats(className) {
        this.pendingClass = className;
        document.getElementById('class-selection-step')?.classList.add('hidden');
        document.getElementById('stat-allocation-step')?.classList.remove('hidden');
        document.querySelectorAll('.stat-select').forEach(s => s.value = '');
        this.updateStatAllocation();
        this.addLog(`You have chosen the path of the ${CLASSES[className]?.name || 'Hero'}! Allocate your stats.`, 'info');
    }

    updateStatAllocation() {
        const selects = document.querySelectorAll('.stat-select');
        const used = new Set();
        const allFilled = [];
        selects.forEach(s => { if (s.value) used.add(s.value); allFilled.push(!!s.value); });

        selects.forEach(s => {
            s.querySelectorAll('option').forEach(opt => {
                if (opt.value && opt.value !== s.value && used.has(opt.value)) {
                    opt.disabled = true;
                } else {
                    opt.disabled = false;
                }
            });
        });

        ['str', 'dex', 'con'].forEach(stat => {
            const el = document.querySelector(`.stat-select[data-stat="${stat}"]`);
            const val = el ? el.value : null;
            const mod = val ? this.calcModifier(parseInt(val, 10)) : null;
            const modDisplay = document.getElementById(`${stat}-mod`);
            if (modDisplay) modDisplay.textContent = mod !== null ? `Mod: ${mod >= 0 ? '+' : ''}${mod}` : 'Mod: —';
        });

        const startBtn = document.getElementById('start-adventure');
        if (startBtn) startBtn.disabled = !(allFilled.every(Boolean));
    }

    calcModifier(dice) {
        const val = parseInt(dice, 10);
        if (isNaN(val)) return 0;
        return Math.floor((val - 10) / 2);
    }

    startGame() {
        const cls = CLASSES[this.pendingClass] || CLASSES.warrior;
        const strDice = parseInt(document.querySelector('.stat-select[data-stat="str"]')?.value, 10) || 10;
        const dexDice = parseInt(document.querySelector('.stat-select[data-stat="dex"]')?.value, 10) || 10;
        const conDice = parseInt(document.querySelector('.stat-select[data-stat="con"]')?.value, 10) || 10;

        const baseHp = Math.max(1, Math.floor(cls.hp * this.playerHpMultiplier));
        const conMod = this.calcModifier(conDice);

        this.player = {
            name: cls.name,
            className: this.pendingClass,
            level: 1,
            exp: 0,
            expToLevel: Math.max(1, this.expScale),
            statPoints: 0,
            skillPoints: 1,
            stats: { str: strDice, dex: dexDice, con: conDice },
            baseHp: baseHp,
            maxHp: Math.max(1, baseHp + conMod),
            hp: Math.max(1, baseHp + conMod),
            baseAc: 10,
            acBonus: 0,
            attackBonus: 0,
            damageBonus: 0,
            gold: 15,
            inventory: [
                { name: 'Potion of Healing', type: 'potion', heal: 20, value: 15 }
            ],
            equipped: { weapon: WEAPON_TABLE[cls.weapon] || WEAPON_TABLE.fists },
            special: cls.special,
            specialDesc: cls.specialDesc,
            sprite: cls.sprite,
            unlockedSkills: {},
            skillEffects: { specialMult: 1, critThresholdMod: 0 },
            merchantWares: []
        };

        const charCreation = document.getElementById('character-creation');
        if (charCreation) {
            charCreation.classList.add('hidden');
            charCreation.style.display = 'none';
        }

        this.applyPreset('normal');
        this.addLog(`Your adventure begins! Survive ${this.maxTerrain} terrains and defeat the Weapons...`, 'info');
        this.addLog(`Special ability: ${this.player.special} — ${this.player.specialDesc}`, 'info');

        this.updateWeaponTracker();
        this.generateBoard();
        this.updateUI();
        this.setButtonsState(false);
    }

    generateBoard() {
        const size = 12 + Math.floor(Math.random() * 5);
        this.board = {
            width: size,
            height: size,
            tiles: Array(size).fill().map(() => Array(size).fill('empty')),
            enemies: [],
            items: [],
            merchant: null,
            exit: null
        };

        // Obstacles ~12%
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (Math.random() < 0.12) this.board.tiles[y][x] = 'obstacle';
            }
        }

        // Difficult terrain ~10%
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (this.board.tiles[y][x] === 'empty' && Math.random() < 0.10) {
                    this.board.tiles[y][x] = 'difficult';
                }
            }
        }

        // Player & Exit
        this.board.player = { x: 0, y: 0 };
        this.board.tiles[0][0] = 'empty';

        this.board.exit = { x: size - 1, y: size - 1 };
        this.board.tiles[size - 1][size - 1] = 'empty';

        this.ensurePath();

        // Check if a FFVII Weapon Boss should spawn
        let spawnedWeapon = false;
        if (this.dragonLordDefeated && this.weaponsDefeated.length < this.weaponBosses.length) {
            const nextWeapon = this.weaponBosses.find(w => !this.weaponsDefeated.includes(w.key));
            if (nextWeapon) {
                const pos = this.findEmptyTile();
                if (pos) {
                    this.board.enemies.push({
                        ...nextWeapon,
                        x: pos.x, y: pos.y,
                        maxHp: Math.max(1, Math.floor(nextWeapon.hp * this.enemyHpMultiplier)),
                        hp: Math.max(1, Math.floor(nextWeapon.hp * this.enemyHpMultiplier)),
                        ac: Math.max(1, Math.floor(nextWeapon.ac * this.enemyAcMultiplier)),
                        atk: Math.max(0, Math.floor(nextWeapon.atk * this.enemyAtkMultiplier)),
                        dmg: nextWeapon.dmg,
                        isWeapon: true,
                        personality: null
                    });
                    spawnedWeapon = true;
                }
            }
        }

        // Enemies based on terrain
        const enemyCount = spawnedWeapon ? 2 : 2 + Math.floor(this.terrain / 5) + Math.floor(Math.random() * 2);
        const areaKeys = Object.keys(this.enemies);
        const areaIndex = Math.min(Math.floor((this.terrain - 1) / 4), areaKeys.length - 1);
        const area = areaKeys[areaIndex];

        for (let i = 0; i < enemyCount; i++) {
            let templateList = this.enemies[area] || this.enemies['Forest Edge'];
            
            // On final terrain, guarantee Dragon Lord if not yet beaten
            if (this.terrain >= this.maxTerrain && !this.dragonLordDefeated) {
                templateList = templateList.filter(e => e.name === 'Dragon Lord');
                if (templateList.length === 0) templateList = this.enemies['Dragon\'s Lair'];
            }

            const template = templateList[Math.floor(Math.random() * templateList.length)];
            const pos = this.findEmptyTile();
            if (!pos) continue;

            const scale = 1 + ((this.terrain - 1) * 0.08);
            const enemy = {
                ...template,
                x: pos.x, y: pos.y,
                maxHp: Math.max(1, Math.floor(template.hp * scale * this.enemyHpMultiplier)),
                hp: Math.max(1, Math.floor(template.hp * scale * this.enemyHpMultiplier)),
                ac: Math.max(1, Math.floor(template.ac * this.enemyAcMultiplier)),
                atk: Math.max(0, Math.floor(template.atk * scale * this.enemyAtkMultiplier)),
                dmg: template.dmg,
                isWeapon: false,
                personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
            };
            this.board.enemies.push(enemy);
        }

        // Items
        const itemCount = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < itemCount; i++) {
            const pos = this.findEmptyTile();
            if (pos) {
                this.board.items.push({ x: pos.x, y: pos.y, type: 'potion', name: 'Potion of Healing', heal: 20 });
            }
        }

        // Merchant 30%
        if (Math.random() < 0.30) {
            const pos = this.findEmptyTile();
            if (pos) {
                this.board.merchant = { x: pos.x, y: pos.y, wares: this.generateMerchantWares() };
            }
        }

        this.movementPoints = 6;
        this.isPlayerTurn = true;
        this.isInCombat = false;
        this.enemy = null;

        document.getElementById('board-view')?.classList.remove('hidden');
        document.getElementById('scene-image')?.classList.add('hidden');
        this.renderBoard();
        this.updateBoardInfo();
        this.setButtonsState(false);
        this.updateScene();
    }

    ensurePath() {
        const path = this.findPath(this.board.player, this.board.exit);
        if (path.length === 0) {
            let cx = this.board.player.x, cy = this.board.player.y;
            while (cx < this.board.exit.x) { this.board.tiles[cy][cx] = 'empty'; cx++; }
            while (cy < this.board.exit.y) { this.board.tiles[cy][cx] = 'empty'; cy++; }
            this.board.tiles[cy][cx] = 'empty';
        }
    }

    findEmptyTile() {
        for (let attempts = 0; attempts < 150; attempts++) {
            const x = Math.floor(Math.random() * this.board.width);
            const y = Math.floor(Math.random() * this.board.height);
            if (this.isTileOccupied(x, y)) continue;
            if (x === this.board.player.x && y === this.board.player.y) continue;
            if (x === this.board.exit.x && y === this.board.exit.y) continue;
            return { x, y };
        }
        return null;
    }

    isTileOccupied(x, y) {
        if (!this.board || !this.board.tiles[y]) return true;
        if (this.board.tiles[y][x] === 'obstacle') return true;
        if (this.board.enemies.some(e => e.x === x && e.y === y)) return true;
        if (this.board.items.some(i => i.x === x && i.y === y)) return true;
        if (this.board.merchant && this.board.merchant.x === x && this.board.merchant.y === y) return true;
        return false;
    }

    generateMerchantWares() {
        const wares = [];
        wares.push(MERCHANT_WARES[0]);
        const pool = MERCHANT_WARES.slice(1);
        for (let i = 0; i < 9; i++) {
            wares.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return wares;
    }

    renderBoard() {
        const boardEl = document.getElementById('game-board');
        if (!boardEl || !this.board) return;

        boardEl.innerHTML = '';
        boardEl.style.gridTemplateColumns = `repeat(${this.board.width}, 1fr)`;

        const reachable = this.getReachableTiles(this.board.player.x, this.board.player.y, this.movementPoints);

        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x < this.board.width; x++) {
                const tile = document.createElement('div');
                tile.className = 'board-tile';
                tile.dataset.x = x;
                tile.dataset.y = y;

                const type = this.board.tiles[y][x];
                tile.classList.add(type);

                if (x === this.board.player.x && y === this.board.player.y) {
                    tile.classList.add('player');
                    tile.textContent = this.player?.sprite || '🛡️';
                } else if (this.board.enemies.some(e => e.x === x && e.y === y)) {
                    tile.classList.add('enemy');
                    const enemy = this.board.enemies.find(e => e.x === x && e.y === y);
                    tile.textContent = enemy?.sprite || '👹';
                } else if (this.board.items.some(i => i.x === x && i.y === y)) {
                    tile.classList.add('item');
                    tile.textContent = '🧪';
                } else if (this.board.merchant && this.board.merchant.x === x && this.board.merchant.y === y) {
                    tile.classList.add('merchant');
                    tile.textContent = '🏪';
                } else if (this.board.exit && x === this.board.exit.x && y === this.board.exit.y && this.board.enemies.length === 0) {
                    tile.classList.add('exit');
                    tile.textContent = '🌀';
                } else if (type === 'difficult') {
                    tile.innerHTML = '<span class="tile-cost">2</span>';
                }

                if (this.isPlayerTurn && !this.isInCombat && reachable.some(r => r.x === x && r.y === y) && !tile.classList.contains('player')) {
                    tile.classList.add('reachable');
                    tile.addEventListener('click', () => this.moveTo(x, y));
                }

                boardEl.appendChild(tile);
            }
        }
    }

    getReachableTiles(sx, sy, mp) {
        if (!this.board) return [];
        const reachable = [];
        const visited = new Map();
        visited.set(`${sx},${sy}`, 0);
        const queue = [{ x: sx, y: sy, cost: 0 }];
        let safetyCounter = 0;

        while (queue.length && safetyCounter++ < 500) {
            const curr = queue.shift();
            if (curr.cost > 0) reachable.push({ x: curr.x, y: curr.y, cost: curr.cost });

            const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
            for (const [dx, dy] of dirs) {
                const nx = curr.x + dx, ny = curr.y + dy;
                if (nx < 0 || ny < 0 || nx >= this.board.width || ny >= this.board.height) continue;
                if (this.board.tiles[ny][nx] === 'obstacle') continue;
                if (this.board.enemies.some(e => e.x === nx && e.y === ny)) continue;

                const moveCost = this.board.tiles[ny][nx] === 'difficult' ? 2 : 1;
                const newCost = curr.cost + moveCost;
                if (newCost > mp) continue;

                const key = `${nx},${ny}`;
                if (!visited.has(key) || visited.get(key) > newCost) {
                    visited.set(key, newCost);
                    queue.push({ x: nx, y: ny, cost: newCost });
                }
            }
        }
        return reachable;
    }

    findPath(start, end) {
        if (!this.board) return [];
        const queue = [[start]];
        const visited = new Set([`${start.x},${start.y}`]);
        let safetyCounter = 0;

        while (queue.length && safetyCounter++ < 500) {
            const path = queue.shift();
            const curr = path[path.length - 1];
            if (curr.x === end.x && curr.y === end.y) return path;

            const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
            for (const [dx, dy] of dirs) {
                const nx = curr.x + dx, ny = curr.y + dy;
                if (nx < 0 || ny < 0 || nx >= this.board.width || ny >= this.board.height) continue;
                if (this.board.tiles[ny][nx] === 'obstacle') continue;
                if (this.board.enemies.some(e => e.x === nx && e.y === ny) && !(nx === end.x && ny === end.y)) continue;

                const key = `${nx},${ny}`;
                if (visited.has(key)) continue;
                visited.add(key);
                queue.push([...path, { x: nx, y: ny }]);
            }
        }
        return [];
    }

    moveTo(x, y) {
        if (!this.isPlayerTurn || this.isInCombat || this.isGameOver || !this.board) return;

        const reachable = this.getReachableTiles(this.board.player.x, this.board.player.y, this.movementPoints);
        const target = reachable.find(r => r.x === x && r.y === y);
        if (!target) return;

        const path = this.findPath(this.board.player, { x, y });
        if (path.length < 2) return;

        let steps = 1;
        let cx = this.board.player.x, cy = this.board.player.y;
        while (steps < path.length && this.movementPoints > 0) {
            const next = path[steps];
            const cost = this.board.tiles[next.y][next.x] === 'difficult' ? 2 : 1;
            if (cost > this.movementPoints) break;

            cx = next.x;
            cy = next.y;
            this.movementPoints -= cost;
            steps++;
        }

        this.board.player.x = cx;
        this.board.player.y = cy;

        // Check if movement triggered terrain change (exit)
        const currentTerrain = this.terrain;
        this.checkTileInteractions();
        if (this.terrain !== currentTerrain || this.isGameOver || !this.board) {
            return; // Prevent execution against stale board state
        }

        // Check adjacent combat
        const adjacentEnemy = this.getAdjacentEnemy(this.board.player.x, this.board.player.y);
        if (adjacentEnemy && !this.isInCombat) {
            this.startBoardCombat(adjacentEnemy);
            return;
        }

        this.renderBoard();
        this.updateBoardInfo();
        this.updateUI();

        if (this.movementPoints <= 0) {
            this.endPlayerTurn();
        }
    }

    checkTileInteractions() {
        if (!this.board) return;
        const px = this.board.player.x, py = this.board.player.y;

        // Items
        const itemIndex = this.board.items.findIndex(i => i.x === px && i.y === py);
        if (itemIndex >= 0) {
            const item = this.board.items.splice(itemIndex, 1)[0];
            this.player.inventory.push({ ...item });
            this.addLog(`🧪 Picked up ${item.name}!`, 'loot');
        }

        // Merchant
        if (this.board.merchant && this.board.merchant.x === px && this.board.merchant.y === py) {
            this.openMerchant();
        }

        // Exit Portal
        if (this.board.exit && px === this.board.exit.x && py === this.board.exit.y && this.board.enemies.length === 0) {
            this.nextTerrain();
        }
    }

    getAdjacentEnemy(x, y) {
        if (!this.board) return null;
        const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
        for (const [dx, dy] of dirs) {
            const ex = x + dx, ey = y + dy;
            const enemy = this.board.enemies.find(e => e.x === ex && e.y === ey);
            if (enemy) return enemy;
        }
        return null;
    }

    startBoardCombat(enemyTemplate) {
        this.enemy = enemyTemplate;
        this.isPlayerTurn = true;
        this.startCombat(!!enemyTemplate.isWeapon);
    }

    endPlayerTurn() {
        if (this.isInCombat || this.isGameOver) return;
        this.isPlayerTurn = false;
        this.addLog('The enemy turn begins...', 'info');
        this.setButtonsState(true);
        setTimeout(() => this.enemyTurn(), 400);
    }

    // Async recursive walker to avoid sandbox false-positive infinite loop triggers
    async enemyTurn() {
        if (!this.board || this.isGameOver) {
            this.setButtonsState(false);
            return;
        }

        try {
            const enemies = [...this.board.enemies];

            const processEnemy = async (index) => {
                if (index >= enemies.length || this.isInCombat || this.isGameOver || !this.board) {
                    return;
                }

                const enemy = enemies[index];
                if (!this.board.enemies.includes(enemy)) {
                    return processEnemy(index + 1);
                }

                const dist = Math.abs(enemy.x - this.board.player.x) + Math.abs(enemy.y - this.board.player.y);
                if (dist <= 1) {
                    this.startBoardCombat(enemy);
                    return;
                }

                const next = this.getNextEnemyMove(enemy);
                if (next) {
                    enemy.x = next.x;
                    enemy.y = next.y;
                    this.renderBoard();
                    await this.sleep(120);

                    if (Math.abs(enemy.x - this.board.player.x) + Math.abs(enemy.y - this.board.player.y) <= 1) {
                        this.startBoardCombat(enemy);
                        return;
                    }
                }

                await processEnemy(index + 1);
            };

            await processEnemy(0);
        } catch (err) {
            console.error('Error during enemy turn:', err);
        } finally {
            if (!this.isInCombat && !this.isGameOver) {
                this.movementPoints = 6;
                this.isPlayerTurn = true;
                this.addLog('Your turn! Move up to 6 tiles.', 'info');
                this.renderBoard();
                this.updateBoardInfo();
                this.setButtonsState(false);
            }
        }
    }

    getNextEnemyMove(enemy) {
        const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
        let best = null;
        let bestDist = Infinity;

        for (const [dx, dy] of dirs) {
            const nx = enemy.x + dx, ny = enemy.y + dy;
            if (nx < 0 || ny < 0 || nx >= this.board.width || ny >= this.board.height) continue;
            if (this.board.tiles[ny][nx] === 'obstacle') continue;
            if (this.board.enemies.some(e => e !== enemy && e.x === nx && e.y === ny)) continue;

            const dist = Math.abs(nx - this.board.player.x) + Math.abs(ny - this.board.player.y);
            if (dist < bestDist) {
                bestDist = dist;
                best = { x: nx, y: ny };
            }
        }
        return best;
    }

    sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    nextTerrain() {
        this.terrain++;
        if (this.terrain > this.maxTerrain && !this.dragonLordDefeated) {
            this.terrain = this.maxTerrain;
        }
        if (this.terrain > this.maxTerrain && this.dragonLordDefeated && this.weaponsDefeated.length >= 5) {
            this.trueVictory();
            return;
        }
        this.addLog(`🗺️ You pass through the portal into Terrain ${this.terrain}...`, 'info');
        this.generateBoard();
        this.updateUI();
    }

    handleAction(action) {
        if (this.isGameOver || this.isRolling) return;

        switch (action) {
            case 'endturn': this.endPlayerTurn(); break;
            case 'attack': this.attack(); break;
            case 'defend': this.defend(); break;
            case 'act': this.openAct(); break;
            case 'rest': this.rest(); break;
            case 'inventory': this.showInventory(); break;
            case 'special': this.useSpecial(); break;
            case 'skills': this.openSkillTree(); break;
            case 'stats': this.openStats(); break;
        }

        this.updateUI();
    }

    setButtonsState(disabled) {
        document.querySelectorAll('.action-btn').forEach(btn => {
            const action = btn.dataset.action;
            if (this.isGameOver) { btn.disabled = true; return; }
            if (!this.player) { btn.disabled = true; return; }
            if (disabled || this.isRolling) { btn.disabled = true; return; }

            if (this.isInCombat) {
                btn.disabled = !['attack', 'defend', 'act', 'special', 'inventory', 'skills', 'stats'].includes(action);
            } else {
                if (['attack', 'defend', 'act'].includes(action)) {
                    btn.disabled = true;
                } else if (action === 'endturn') {
                    btn.disabled = !this.isPlayerTurn;
                } else {
                    btn.disabled = false;
                }
            }
        });
    }

    spawnParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 8 + 's';
            p.style.animationDuration = (6 + Math.random() * 6) + 's';
            container.appendChild(p);
        }
    }

    // D&D Combat System
    getPlayerAC() {
        if (!this.player) return 10;
        const dexMod = this.calcModifier(this.player.stats.dex);
        const conMod = this.calcModifier(this.player.stats.con);
        let ac = 10 + dexMod + conMod + (this.player.acBonus || 0);
        ac = Math.floor(ac * this.playerAcMultiplier);
        return Math.max(1, ac);
    }

    getPlayerAttackBonus() {
        if (!this.player) return 0;
        const strMod = this.calcModifier(this.player.stats.str);
        return strMod + this.player.level + (this.player.attackBonus || 0) + (this.player.equipped.weapon?.attackBonus || 0);
    }

    getPlayerDamageRoll() {
        if (!this.player) return 1;
        const strMod = this.calcModifier(this.player.stats.str);
        const weapon = this.player.equipped.weapon || WEAPON_TABLE.fists;
        const diceDmg = this.rollDiceString(weapon.dice);
        return Math.max(0, Math.floor((diceDmg + strMod + this.player.damageBonus + (weapon.damageBonus || 0)) * this.playerDmgMultiplier));
    }

    getEnemyAC(enemy) { return Math.max(1, Math.floor((enemy?.ac || 10) * this.enemyAcMultiplier)); }
    getEnemyAttackBonus(enemy) { return Math.floor((enemy?.atk || 0) * this.enemyAtkMultiplier); }

    getEnemyDamageRoll(enemy) {
        if (!enemy) return 0;
        const diceDmg = this.rollDiceString(enemy.dmg || '1d4');
        return Math.max(0, Math.floor(diceDmg * this.enemyDmgMultiplier));
    }

    rollDiceString(str) {
        if (typeof str === 'number') return Math.max(0, Math.floor(str));
        if (!str || typeof str !== 'string') return 0;
        if (!str.includes('d')) return parseInt(str, 10) || 0;
        const [countStr, sidesStr] = str.split('d');
        const count = parseInt(countStr, 10) || 1;
        const sides = parseInt(sidesStr, 10) || 4;
        let total = 0;
        for (let i = 0; i < count; i++) total += Math.floor(Math.random() * sides) + 1;
        return total;
    }

    startCombat(isWeapon) {
        this.isInCombat = true;
        this.isDefending = false;
        this.setButtonsState(false);

        document.getElementById('battle-arena')?.classList.remove('hidden');
        const hpWrap = document.getElementById('enemy-hp-wrapper');
        if (hpWrap) hpWrap.style.opacity = '1';

        const panel = document.getElementById('enemy-panel');
        if (panel) {
            panel.classList.remove('hidden');
            if (isWeapon) panel.classList.add('weapon');
            else panel.classList.remove('weapon');
        }

        const tierEl = document.getElementById('enemy-tier');
        if (tierEl) tierEl.textContent = isWeapon ? 'SECRET WEAPON' : 'ENEMY';
        
        const descEl = document.getElementById('enemy-desc');
        if (descEl) descEl.textContent = this.enemy?.desc || `A dangerous foe from Terrain ${this.terrain}.`;

        this.addLog(isWeapon ? `⚠️ ${this.enemy?.name} has awakened!` : `A ${this.enemy?.name} attacks!`, isWeapon ? 'weapon' : 'info');
        if (isWeapon) this.shakeScreen(0.7);

        this.updateEnemyUI();
        this.updateBattleArena();
        this.updateScene();
    }

    async attack() {
        if (!this.isInCombat || !this.enemy || this.isRolling) return;

        try {
            this.setButtonsState(true);

            const effectiveCrit = Math.max(1, Math.min(20, this.criticalThreshold + (this.player.skillEffects.critThresholdMod || 0)));
            const roll = await this.rollDice(20, 'Attack Roll');
            const attackTotal = roll + this.getPlayerAttackBonus();
            const enemyAC = this.getEnemyAC(this.enemy);
            const isCritical = roll >= effectiveCrit;

            await this.animateAttack('player');
            await this.animateHit('enemy');

            if (isCritical || attackTotal >= enemyAC) {
                let damage = this.getPlayerDamageRoll();
                if (isCritical) damage = Math.floor(damage * 1.5);
                if (this.isDefending) { damage = Math.floor(damage * 1.5); this.isDefending = false; }

                this.enemy.hp -= damage;
                this.showFloatingDamage(damage, 'enemy');
                this.shakeScreen(0.2);

                if (isCritical) {
                    this.addLog(`🎲 ${roll} + ${this.getPlayerAttackBonus()} = ${attackTotal}! 💥 CRITICAL for ${damage} damage!`, 'critical');
                } else {
                    this.addLog(`🎲 ${roll} + ${this.getPlayerAttackBonus()} = ${attackTotal} hits AC ${enemyAC}! ${damage} damage!`, 'damage');
                }
            } else {
                this.addLog(`🎲 ${roll} + ${this.getPlayerAttackBonus()} = ${attackTotal} misses AC ${enemyAC}!`, 'info');
            }

            this.updateEnemyUI();
            this.updateBattleArena();

            if (this.enemy.hp <= 0) {
                this.defeatEnemy();
                return;
            }

            await this.enemyAttack();
            this.tickCooldown();
        } catch (err) {
            console.error('Error during attack action:', err);
        } finally {
            this.setButtonsState(false);
            this.updateUI();
        }
    }

    async defend() {
        if (!this.isInCombat || !this.enemy || this.isRolling) return;
        try {
            this.isDefending = true;
            this.addLog('🛡️ You take a defensive stance! (Next attack +50%, incoming damage reduced)', 'info');
            this.setButtonsState(true);
            await this.enemyAttack();
            this.tickCooldown();
        } catch (err) {
            console.error('Error during defend action:', err);
        } finally {
            this.setButtonsState(false);
            this.updateUI();
        }
    }

    async enemyAttack() {
        if (!this.enemy || this.enemy.hp <= 0 || this.player.hp <= 0) return;

        const roll = await this.rollDice(20, `${this.enemy.name}'s Roll`);
        const attackTotal = roll + this.getEnemyAttackBonus(this.enemy);
        const playerAC = this.getPlayerAC();

        await this.animateAttack('enemy');
        await this.animateHit('player');

        if (attackTotal >= playerAC) {
            let damage = this.getEnemyDamageRoll(this.enemy);
            if (this.enemy.mechanic === 'burrow' && Math.random() < 0.3) {
                damage = Math.floor(damage * 1.3);
                this.addLog(`🔴 ${this.enemy.name} burrows beneath your guard!`, 'damage');
            }
            if (this.isDefending) {
                damage = Math.max(0, damage - Math.floor(playerAC / 2));
                this.addLog('Your defense reduces the blow!', 'info');
                this.isDefending = false;
            }

            this.player.hp -= damage;
            this.addLog(`${this.enemy.name} rolled ${roll} + ${this.getEnemyAttackBonus(this.enemy)} = ${attackTotal} and hits for ${damage} damage!`, 'damage');
            this.showFloatingDamage(damage, 'player');
        } else {
            this.addLog(`${this.enemy.name} rolled ${roll} + ${this.getEnemyAttackBonus(this.enemy)} = ${attackTotal} and misses!`, 'info');
        }

        this.applyWeaponMechanic();

        if (this.player.hp <= 0) {
            this.gameOver();
        }
        this.updateUI();
        this.updateBattleArena();
    }

    applyWeaponMechanic() {
        if (!this.enemy || !this.enemy.mechanic) return;
        const mechanic = this.enemy.mechanic;
        const name = this.enemy.name;

        switch (mechanic) {
            case 'tide':
                if (Math.random() < 0.3) {
                    const erosion = Math.max(1, Math.floor((this.player.acBonus || 1) * 0.5));
                    this.player.acBonus = Math.max(0, this.player.acBonus - erosion);
                    this.addLog(`🌊 ${name}'s Tide erodes your armor! AC reduced by ${erosion}!`, 'damage');
                }
                break;
            case 'reflect':
                if (Math.random() < 0.25) {
                    const reflect = Math.floor(this.getPlayerDamageRoll() * 0.3);
                    if (reflect > 0) {
                        this.player.hp -= reflect;
                        this.addLog(`💎 ${name}'s Diamond Flash reflects ${reflect} damage back at you!`, 'critical');
                    }
                }
                break;
            case 'storm':
                if (Math.random() < 0.25) {
                    const stormDmg = Math.floor(this.player.maxHp * 0.1);
                    this.player.hp -= stormDmg;
                    this.addLog(`🌪️ ${name} casts Aire Tam Storm! ${stormDmg} unblockable damage!`, 'critical');
                }
                break;
            case 'ultima':
                if (this.enemy.hp <= this.enemy.maxHp * 0.4 && !this.enemy.ultimaUsed) {
                    this.enemy.ultimaUsed = true;
                    const ultimaDmg = Math.floor(this.player.maxHp * 0.35);
                    this.player.hp -= ultimaDmg;
                    this.addLog(`⚫ ${name} casts ULTIMA! Catastrophic ${ultimaDmg} damage!`, 'critical');
                    this.shakeScreen(0.8);
                }
                break;
        }
    }

    tickCooldown() { if (this.specialCooldown > 0) this.specialCooldown--; }

    // ACT system
    openAct() {
        if (!this.isInCombat || !this.enemy) return;
        document.getElementById('act-modal')?.classList.remove('hidden');
        
        const hintEl = document.getElementById('act-hint');
        if (hintEl) {
            hintEl.textContent = this.enemy.personality?.hint || 
                (this.enemy.isWeapon ? 'The colossal Weapon radiates primordial fury! Words will not reach it.' : 'The enemy watches you carefully...');
        }

        const options = this.enemy.personality?.options || ['Compliment', 'Intimidate', 'Offer Gold', 'Reason', 'Back Away'];
        const container = document.getElementById('act-options');
        if (!container) return;
        container.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'act-option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => this.resolveAct(opt));
            container.appendChild(btn);
        });
    }

    async resolveAct(choice) {
        document.getElementById('act-modal')?.classList.add('hidden');
        if (!this.enemy) return;

        try {
            if (!this.enemy.personality) {
                this.addLog(`🎭 The ${this.enemy.name} cannot be reasoned with!`, 'info');
                this.setButtonsState(true);
                await this.enemyAttack();
                this.tickCooldown();
                return;
            }

            const label = this.enemy.personality.label?.toLowerCase() || '';
            const isMatch = label === choice.toLowerCase() || 
                (label === 'offer gold' && choice.toLowerCase() === 'bribe') ||
                (label === 'back away' && choice.toLowerCase() === 'flee');

            if (isMatch) {
                this.addLog(`🎭 You choose "${choice}" successfully! The ${this.enemy.name} lets you pass.`, 'info');
                this.gainRewards(this.enemy, 0.5);
                this.endCombat();
            } else {
                this.addLog(`🎭 The ${this.enemy.name} rejects "${choice}" and attacks!`, 'damage');
                this.setButtonsState(true);
                await this.enemyAttack();
                this.tickCooldown();
            }
        } catch (err) {
            console.error('Error resolving ACT choice:', err);
        } finally {
            this.setButtonsState(false);
            this.updateUI();
        }
    }

    // Special abilities
    async useSpecial() {
        if (this.specialCooldown > 0) {
            this.addLog(`${this.player.special} is on cooldown! (${this.specialCooldown} turns)`, 'info');
            return;
        }
        if (!this.isInCombat || !this.enemy || this.isRolling) {
            this.addLog('No target for your special ability.', 'info');
            return;
        }

        try {
            this.setButtonsState(true);
            this.specialCooldown = 4;

            switch (this.player.className) {
                case 'warrior': await this.warriorSpecial(); break;
                case 'mage': await this.mageSpecial(); break;
                case 'rogue': await this.rogueSpecial(); break;
                case 'paladin': await this.paladinSpecial(); break;
            }

            this.updateEnemyUI();
            this.updateBattleArena();
            this.updateUI();

            if (this.enemy && this.enemy.hp > 0 && this.player.hp > 0) {
                await this.enemyAttack();
            }
            this.tickCooldown();
        } catch (err) {
            console.error('Error during special ability:', err);
        } finally {
            this.setButtonsState(false);
        }
    }

    async warriorSpecial() {
        const roll = await this.rollDice(20, 'Rage Roll');
        const baseDmg = this.getPlayerDamageRoll();
        const damage = Math.floor((baseDmg * 2.5 + roll) * (this.player.skillEffects.specialMult || 1));
        this.enemy.hp -= damage;
        this.addLog(`🔥 BERSERKER RAGE! Rolled ${roll} and unleash ${damage} damage!`, 'critical');
        this.showFloatingDamage(damage, 'enemy');
        await this.animateAttack('player');
        await this.animateHit('enemy');
        this.shakeScreen(0.4);
        if (this.enemy.hp <= 0) this.defeatEnemy();
    }

    async mageSpecial() {
        const roll = await this.rollDice(20, 'Meteor Roll');
        const baseDmg = this.getPlayerDamageRoll();
        const damage = Math.floor((baseDmg * 3.5 + roll) * (this.player.skillEffects.specialMult || 1));
        this.enemy.hp -= damage;
        this.addLog(`☄️ METEOR! Arcane fire rains down for ${damage} damage!`, 'critical');
        this.showFloatingDamage(damage, 'enemy');
        await this.animateAttack('player');
        await this.animateHit('enemy');
        this.shakeScreen(0.5);
        if (this.enemy.hp <= 0) this.defeatEnemy();
    }

    async rogueSpecial() {
        const roll = await this.rollDice(20, 'Shadow Roll');
        const baseDmg = this.getPlayerDamageRoll();
        const damage = Math.floor((baseDmg * 2.2 + roll) * (this.player.skillEffects.specialMult || 1));
        const stolenGold = Math.floor((this.enemy.gold || 10) * (0.6 + ((this.player.skillEffects.specialMult || 1) - 1)));
        this.enemy.hp -= damage;
        this.player.gold += stolenGold;

        this.addLog(`🗡️ SHADOW STRIKE! Rolled ${roll}. ${damage} damage and ${stolenGold} gold stolen!`, 'gold');
        this.showFloatingDamage(damage, 'enemy');
        await this.animateAttack('player');
        await this.animateHit('enemy');
        if (this.enemy.hp <= 0) this.defeatEnemy();
    }

    async paladinSpecial() {
        const roll = await this.rollDice(20, 'Holy Roll');
        const healAmount = Math.floor(this.player.maxHp * (0.5 + ((this.player.skillEffects.specialMult || 1) - 1)));
        this.player.hp = Math.min(this.player.hp + healAmount, this.player.maxHp);
        const baseDmg = this.getPlayerDamageRoll();
        const holyDamage = Math.floor((baseDmg * 1.6 + roll) * (this.player.skillEffects.specialMult || 1));
        this.enemy.hp -= holyDamage;

        this.addLog(`✨ HOLY JUDGMENT! Heal ${healAmount} HP and smite for ${holyDamage} damage!`, 'heal');
        this.showFloatingDamage(holyDamage, 'enemy');
        this.showFloatingDamage(healAmount, 'heal');
        await this.animateAttack('player');
        await this.animateHit('enemy');
        if (this.enemy.hp <= 0) this.defeatEnemy();
    }

    // Rewards & progression
    defeatEnemy() {
        if (!this.enemy) return;

        if (this.enemy.name.includes('Dragon Lord') && !this.dragonLordDefeated) {
            this.dragonLordDefeated = true;
            this.addLog('🌑 The Dragon Lord falls! A crater opens — the ancient Weapons stir...', 'weapon');
            this.updateWeaponTracker();
        }

        this.gainRewards(this.enemy, 1);
        this.kills++;
        this.isInCombat = false;

        const panel = document.getElementById('enemy-panel');
        if (panel) {
            panel.classList.remove('weapon');
            panel.classList.add('hidden');
        }

        if (this.enemy.isWeapon) {
            if (!this.weaponsDefeated.includes(this.enemy.key)) {
                this.weaponsDefeated.push(this.enemy.key);
            }
            this.updateWeaponTracker();
            if (this.weaponsDefeated.length === 5) {
                setTimeout(() => this.trueVictory(), 800);
                this.enemy = null;
                return;
            }
        }

        if (this.board) {
            const idx = this.board.enemies.indexOf(this.enemy);
            if (idx >= 0) this.board.enemies.splice(idx, 1);
        }

        this.enemy = null;
        document.getElementById('battle-arena')?.classList.add('hidden');
        const hpWrap = document.getElementById('enemy-hp-wrapper');
        if (hpWrap) hpWrap.style.opacity = '0';

        if (this.board && this.board.enemies.length === 0) {
            this.addLog('✨ All enemies defeated! The exit portal glows.', 'info');
        }

        this.setButtonsState(false);
        this.updateScene();
        this.updateUI();
        this.updateBattleArena();
        if (this.board) this.renderBoard();
    }

    gainRewards(enemy, mult) {
        if (!enemy) return;
        const goldReward = Math.floor((enemy.gold || 0) * this.xpGoldMultiplier * mult);
        const expReward = Math.floor((enemy.exp || 0) * this.xpGoldMultiplier * mult);
        this.player.gold += goldReward;
        this.score += Math.floor((expReward + goldReward) * mult);
        this.addLog(`✨ ${enemy.name} defeated! +${expReward} EXP, +${goldReward} gold!`, 'gold');
        this.gainExp(expReward);
    }

    gainExp(amount) {
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) return;
        this.player.exp += amount;
        if (!this.player.expToLevel || this.player.expToLevel <= 0) {
            this.player.expToLevel = Math.max(1, this.expScale);
        }
        let safetyCounter = 0;
        while (this.player.exp >= this.player.expToLevel && safetyCounter++ < 50) {
            this.player.exp -= this.player.expToLevel;
            this.levelUp();
        }
    }

    levelUp() {
        this.player.level++;
        this.player.expToLevel = Math.max(1, Math.floor(this.player.expToLevel * 1.5));
        const conMod = this.calcModifier(this.player.stats.con);
        this.player.baseHp += Math.floor(6 * this.playerHpMultiplier);
        this.player.maxHp = Math.max(1, this.player.baseHp + conMod);
        this.player.hp = this.player.maxHp;
        this.player.statPoints += 2;
        this.skillPoints += 2;
        this.score += 200;
        this.addLog(`⬆️ LEVEL UP! You are now level ${this.player.level}! HP restored.`, 'heal');
        this.addLog(`📊 Gained 2 Stat Points. 🌟 Gained 2 Skill Points.`, 'info');
    }

    endCombat() {
        this.isInCombat = false;
        if (this.board && this.enemy) {
            const idx = this.board.enemies.indexOf(this.enemy);
            if (idx >= 0) this.board.enemies.splice(idx, 1);
        }
        this.enemy = null;
        document.getElementById('battle-arena')?.classList.add('hidden');
        const hpWrap = document.getElementById('enemy-hp-wrapper');
        if (hpWrap) hpWrap.style.opacity = '0';
        document.getElementById('enemy-panel')?.classList.add('hidden');
        this.setButtonsState(false);
        this.updateScene();
        this.updateUI();
        this.updateBattleArena();
        if (this.board) this.renderBoard();
    }

    rest() {
        if (this.isInCombat) {
            this.addLog('You cannot rest in combat!', 'info');
            return;
        }
        const healAmount = Math.floor(this.player.maxHp * this.restHealPercent);
        this.player.hp = Math.min(this.player.hp + healAmount, this.player.maxHp);
        this.addLog(`💤 You rest and recover ${healAmount} HP.`, 'heal');
        this.updateUI();
    }

    // Merchant
    openMerchant() {
        if (!this.board || !this.board.merchant) return;
        const list = document.getElementById('merchant-list');
        if (!list) return;
        list.innerHTML = '';
        this.board.merchant.wares.forEach((ware, idx) => {
            const div = document.createElement('div');
            div.className = 'merchant-item';
            div.innerHTML = `
                <span class="merchant-item-name">${ware.name}</span>
                <span class="merchant-item-desc">${ware.desc}</span>
                <span class="merchant-item-price">${ware.price} 🪙</span>
            `;
            const btn = document.createElement('button');
            btn.className = 'buy-btn';
            btn.textContent = 'Buy';
            btn.disabled = this.player.gold < ware.price;
            btn.addEventListener('click', () => this.buyFromMerchant(idx));
            div.appendChild(btn);
            list.appendChild(div);
        });
        document.getElementById('merchant-modal')?.classList.remove('hidden');
    }

    buyFromMerchant(idx) {
        const ware = this.board?.merchant?.wares[idx];
        if (!ware || this.player.gold < ware.price) return;

        this.player.gold -= ware.price;

        if (ware.type === 'potion') {
            this.player.inventory.push({ name: ware.name, type: 'potion', heal: ware.heal, value: ware.price });
        } else if (ware.type === 'ac') {
            this.player.acBonus += ware.bonus;
            this.addLog(`🛡️ Bought ${ware.name}! AC +${ware.bonus}`, 'loot');
        } else if (ware.type === 'attack') {
            this.player.attackBonus += ware.bonus;
            this.addLog(`🎯 Bought ${ware.name}! Attack Roll +${ware.bonus}`, 'loot');
        } else if (ware.type === 'damage') {
            this.player.damageBonus += ware.bonus;
            this.addLog(`⚔️ Bought ${ware.name}! Damage Roll +${ware.bonus}`, 'loot');
        } else if (ware.type === 'weapon') {
            this.player.equipped.weapon = WEAPON_TABLE[ware.key] || WEAPON_TABLE.fists;
            this.addLog(`⚔️ Bought ${this.player.equipped.weapon.name}!`, 'loot');
        }

        this.updateUI();
        this.openMerchant();
    }

    // Stats
    openStats() {
        document.getElementById('stats-modal')?.classList.remove('hidden');
        this.renderStats();
    }

    renderStats() {
        const statPointsEl = document.getElementById('available-stat-points');
        if (statPointsEl) statPointsEl.textContent = this.player.statPoints;
        const list = document.getElementById('stats-list');
        if (!list) return;
        list.innerHTML = '';
        const labels = { str: '💪 Strength', dex: '🏃 Dexterity', con: '❤️ Constitution' };
        Object.keys(labels).forEach(stat => {
            const row = document.createElement('div');
            row.className = 'stat-spend-row';
            const dice = this.player.stats[stat];
            const mod = this.calcModifier(dice);
            row.innerHTML = `<span>${labels[stat]}: ${dice} (Mod ${mod >= 0 ? '+' : ''}${mod})</span>`;
            const btn = document.createElement('button');
            btn.className = 'stat-spend-btn';
            btn.textContent = '+1 Dice';
            btn.disabled = this.player.statPoints < 1;
            btn.addEventListener('click', () => this.spendStatPoint(stat));
            row.appendChild(btn);
            list.appendChild(row);
        });
    }

    spendStatPoint(stat) {
        if (this.player.statPoints < 1) return;
        this.player.statPoints--;
        this.player.stats[stat]++;
        this.recalcStats();
        this.addLog(`📊 ${stat.toUpperCase()} increased to ${this.player.stats[stat]}!`, 'info');
        this.renderStats();
        this.updateUI();
    }

    recalcStats() {
        if (!this.player) return;
        const conMod = this.calcModifier(this.player.stats.con);
        this.player.maxHp = Math.max(1, this.player.baseHp + conMod);
        this.player.hp = Math.min(this.player.hp, this.player.maxHp);
    }

    // Skill tree
    openSkillTree() {
        if (!this.player) return;
        document.getElementById('skill-tree-modal')?.classList.remove('hidden');
        this.renderSkillTree();
    }

    renderSkillTree() {
        const container = document.getElementById('skill-tree-container');
        if (!container) return;
        container.innerHTML = '';

        const spEl = document.querySelector('#skill-points-display span') || document.getElementById('pc-skill-points');
        if (spEl) spEl.textContent = this.skillPoints;

        const tree = SKILL_TREES[this.player.className];
        if (!tree) return;

        tree.branches.forEach(branch => {
            const branchEl = document.createElement('div');
            branchEl.className = 'skill-branch';
            branchEl.innerHTML = `<h4>${branch.name}</h4>`;

            branch.skills.forEach(skill => {
                const currentRank = this.player.unlockedSkills[skill.id] || 0;
                const isMaxed = currentRank >= skill.maxRank;
                const hasRequirement = this.checkSkillRequirement(skill);
                const canAfford = this.skillPoints >= skill.cost;
                const isUnlocked = currentRank > 0;
                const isAvailable = hasRequirement && canAfford && !isMaxed;

                const node = document.createElement('div');
                node.className = 'skill-node';
                if (isMaxed) node.classList.add('maxed');
                else if (isUnlocked) node.classList.add('unlocked');
                else if (isAvailable) node.classList.add('available');
                else node.classList.add('locked');

                node.innerHTML = `
                    <div class="skill-icon">${skill.icon}</div>
                    <div class="skill-rank">${currentRank}/${skill.maxRank}</div>
                    <div class="skill-info"><strong>${skill.name}</strong>${skill.desc}</div>
                    <div class="skill-cost">Cost: ${skill.cost} SP</div>
                `;

                if (!this.isInCombat && isAvailable) {
                    node.addEventListener('click', () => this.buySkill(skill));
                }

                branchEl.appendChild(node);
            });

            container.appendChild(branchEl);
        });
    }

    checkSkillRequirement(skill) {
        if (!skill.requires) return true;
        const [reqId, reqRank] = skill.requires.split(':');
        return (this.player.unlockedSkills[reqId] || 0) >= parseInt(reqRank, 10);
    }

    buySkill(skill) {
        const currentRank = this.player.unlockedSkills[skill.id] || 0;
        if (currentRank >= skill.maxRank) return;
        if (this.skillPoints < skill.cost) return;
        if (this.isInCombat) { this.addLog('Cannot learn skills during combat!', 'info'); return; }

        this.skillPoints -= skill.cost;
        this.player.unlockedSkills[skill.id] = currentRank + 1;
        this.applySkillEffect(skill);

        this.addLog(`🌟 Learned ${skill.name} (${this.player.unlockedSkills[skill.id]}/${skill.maxRank})!`, 'info');
        this.updateUI();
        this.renderSkillTree();
    }

    applySkillEffect(skill) {
        const fx = skill.effect;
        if (!fx) return;
        if (fx.attackBonus) this.player.attackBonus += fx.attackBonus;
        if (fx.damageBonus) this.player.damageBonus += fx.damageBonus;
        if (fx.ac) this.player.acBonus += fx.ac;
        if (fx.maxHp) { this.player.baseHp += fx.maxHp; this.recalcStats(); }
        if (fx.specialMult) this.player.skillEffects.specialMult += fx.specialMult;
        if (fx.critThreshold) this.player.skillEffects.critThresholdMod += fx.critThreshold;
    }

    // Inventory
    showInventory() {
        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList) return;
        inventoryList.innerHTML = '';
        if (this.player.inventory.length === 0) {
            inventoryList.innerHTML = '<div>Your inventory is empty.</div>';
        } else {
            this.player.inventory.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.textContent = item.name;
                if (item.type === 'potion') {
                    itemDiv.classList.add('potion-item');
                    itemDiv.textContent += ' (Click to use)';
                    itemDiv.addEventListener('click', () => this.useItem(index));
                }
                inventoryList.appendChild(itemDiv);
            });
        }
        document.getElementById('inventory-modal')?.classList.remove('hidden');
    }

    useItem(index) {
        const item = this.player.inventory[index];
        if (!item || item.type !== 'potion') return;
        const heal = Math.floor(item.heal * this.potionHealMultiplier);
        this.player.hp = Math.min(this.player.hp + heal, this.player.maxHp);
        this.player.inventory.splice(index, 1);
        this.addLog(`🧪 Used ${item.name} and recovered ${heal} HP!`, 'heal');
        this.showFloatingDamage(heal, 'heal');
        this.showInventory();
        this.updateUI();
    }

    // Settings / Difficulty
    openSettings() {
        document.getElementById('settings-modal')?.classList.remove('hidden');
        this.updateDifficultySelection();
    }
    closeSettings() { document.getElementById('settings-modal')?.classList.add('hidden'); }
    updateDifficultySelection() {
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.difficulty === this.currentDifficulty);
        });
    }
    selectDifficulty(difficulty) {
        this.applyPreset(difficulty);
        this.updateDifficultySelection();
        setTimeout(() => this.closeSettings(), 250);
    }

    // Dev panel
    handleKey(e) { if (e.shiftKey && e.key.toLowerCase() === 'd') this.toggleDevPanel(); }
    toggleDevPanel() {
        if (!this.player) return;
        this.devPanelOpen = !this.devPanelOpen;
        const panel = document.getElementById('dev-panel');
        if (panel) {
            panel.classList.toggle('hidden', !this.devPanelOpen);
            if (this.devPanelOpen) {
                this.loadDevValues();
                this.renderDevEnemyConfig();
                this.renderDevWeaponConfig();
            }
        }
    }
    switchDevTab(tabName) {
        document.querySelectorAll('.dev-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
        document.getElementById('dev-tab-global')?.classList.toggle('hidden', tabName !== 'global');
        document.getElementById('dev-tab-areas')?.classList.toggle('hidden', tabName !== 'areas');
        document.getElementById('dev-tab-weapons')?.classList.toggle('hidden', tabName !== 'weapons');
    }

    setDevInputValue(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }

    loadDevValues() {
        this.setDevInputValue('dev-hp', this.player.maxHp);
        this.setDevInputValue('dev-ac', this.getPlayerAC());
        this.setDevInputValue('dev-atk', this.getPlayerAttackBonus());
        this.setDevInputValue('dev-dmg', this.player.damageBonus);
        this.setDevInputValue('dev-player-hp', this.playerHpMultiplier);
        this.setDevInputValue('dev-player-ac', this.playerAcMultiplier);
        this.setDevInputValue('dev-player-atk', this.playerAtkMultiplier);
        this.setDevInputValue('dev-player-dmg', this.playerDmgMultiplier);
        this.setDevInputValue('dev-enemy-hp', this.enemyHpMultiplier);
        this.setDevInputValue('dev-enemy-ac', this.enemyAcMultiplier);
        this.setDevInputValue('dev-enemy-atk', this.enemyAtkMultiplier);
        this.setDevInputValue('dev-enemy-dmg', this.enemyDmgMultiplier);
        this.setDevInputValue('dev-xp-gold', this.xpGoldMultiplier);
        this.setDevInputValue('dev-crit', this.criticalThreshold);
        this.setDevInputValue('dev-rest', this.restHealPercent);
        this.setDevInputValue('dev-exp-scale', this.expScale);
        this.setDevInputValue('dev-potion', this.potionHealMultiplier);
    }

    renderDevEnemyConfig() {
        const list = document.getElementById('dev-enemy-list');
        if (!list) return;
        list.innerHTML = '';
        Object.keys(this.enemies).forEach((area, aIdx) => {
            const areaDiv = document.createElement('div');
            areaDiv.className = 'dev-config-area';
            areaDiv.dataset.area = area;
            areaDiv.innerHTML = `<h5>${area}</h5>`;
            this.enemies[area].forEach((enemy, index) => {
                const row = document.createElement('div');
                row.className = 'dev-config-row';
                row.dataset.enemy = enemy.name.toLowerCase();
                row.innerHTML = `
                    <span>${enemy.sprite} ${enemy.name}</span>
                    <input type="number" id="dev-enemy-${aIdx}-${index}-hp" value="${enemy.hp}" min="1" title="HP">
                    <input type="number" id="dev-enemy-${aIdx}-${index}-ac" value="${enemy.ac}" min="1" title="AC">
                    <input type="number" id="dev-enemy-${aIdx}-${index}-atk" value="${enemy.atk}" min="0" title="ATK">
                `;
                areaDiv.appendChild(row);
            });
            list.appendChild(areaDiv);
        });
    }

    renderDevWeaponConfig() {
        const list = document.getElementById('dev-weapon-list');
        if (!list) return;
        list.innerHTML = '';
        this.weaponBosses.forEach((weapon, index) => {
            const row = document.createElement('div');
            row.className = 'dev-config-row weapon-row';
            row.dataset.weapon = weapon.name.toLowerCase();
            row.innerHTML = `
                <span>${weapon.sprite} ${weapon.name}</span>
                <input type="number" id="dev-weapon-${index}-hp" value="${weapon.hp}" min="1" title="HP">
                <input type="number" id="dev-weapon-${index}-ac" value="${weapon.ac}" min="1" title="AC">
                <input type="number" id="dev-weapon-${index}-atk" value="${weapon.atk}" min="0" title="ATK">
                <input type="number" id="dev-weapon-${index}-exp" value="${weapon.exp}" min="1" title="EXP">
            `;
            list.appendChild(row);
        });
    }

    filterDevEnemies(query) {
        const term = query.toLowerCase();
        document.querySelectorAll('.dev-config-area').forEach(area => {
            let hasVisible = false;
            area.querySelectorAll('.dev-config-row').forEach(row => {
                const match = row.dataset.enemy.includes(term);
                row.style.display = match ? 'grid' : 'none';
                if (match) hasVisible = true;
            });
            area.style.display = hasVisible ? 'block' : 'none';
        });
    }

    filterDevWeapons(query) {
        const term = query.toLowerCase();
        document.querySelectorAll('#dev-weapon-list .dev-config-row').forEach(row => {
            row.style.display = row.dataset.weapon.includes(term) ? 'grid' : 'none';
        });
    }

    applyDevValues() {
        const getDevNum = (id, defaultVal) => {
            const el = document.getElementById(id);
            const val = parseFloat(el?.value);
            return isNaN(val) ? defaultVal : val;
        };

        this.player.baseHp = Math.max(1, getDevNum('dev-hp', this.player.baseHp) - this.calcModifier(this.player.stats.con));
        this.recalcStats();
        this.player.acBonus = Math.max(0, getDevNum('dev-ac', 10) - 10 - this.calcModifier(this.player.stats.dex) - this.calcModifier(this.player.stats.con));
        this.player.attackBonus = getDevNum('dev-atk', 0) - this.calcModifier(this.player.stats.str) - this.player.level;
        this.player.damageBonus = getDevNum('dev-dmg', 0);

        this.playerHpMultiplier = getDevNum('dev-player-hp', 1);
        this.playerAcMultiplier = getDevNum('dev-player-ac', 1);
        this.playerAtkMultiplier = getDevNum('dev-player-atk', 1);
        this.playerDmgMultiplier = getDevNum('dev-player-dmg', 1);
        this.enemyHpMultiplier = getDevNum('dev-enemy-hp', 1);
        this.enemyAcMultiplier = getDevNum('dev-enemy-ac', 1);
        this.enemyAtkMultiplier = getDevNum('dev-enemy-atk', 1);
        this.enemyDmgMultiplier = getDevNum('dev-enemy-dmg', 1);
        this.xpGoldMultiplier = getDevNum('dev-xp-gold', 1);
        this.criticalThreshold = getDevNum('dev-crit', 19);
        this.restHealPercent = getDevNum('dev-rest', 0.25);
        this.expScale = getDevNum('dev-exp-scale', 100);
        this.potionHealMultiplier = getDevNum('dev-potion', 1);

        this.applyDevEnemyValues();
        this.applyDevWeaponValues();

        this.updateUI();
        this.updateEnemyUI();
        this.updateBattleArena();
        this.addLog('⚙️ Balance values applied.', 'info');
    }

    applyDevEnemyValues() {
        const areas = Object.keys(this.enemies);
        areas.forEach((area, aIdx) => {
            this.enemies[area].forEach((enemy, index) => {
                const hpIn = document.getElementById(`dev-enemy-${aIdx}-${index}-hp`);
                const acIn = document.getElementById(`dev-enemy-${aIdx}-${index}-ac`);
                const atkIn = document.getElementById(`dev-enemy-${aIdx}-${index}-atk`);
                if (hpIn) enemy.hp = Math.max(1, parseInt(hpIn.value, 10) || enemy.hp);
                if (acIn) enemy.ac = Math.max(1, parseInt(acIn.value, 10) || enemy.ac);
                if (atkIn) enemy.atk = Math.max(0, parseInt(atkIn.value, 10) || enemy.atk);
            });
        });
    }

    applyDevWeaponValues() {
        this.weaponBosses.forEach((weapon, index) => {
            const hpIn = document.getElementById(`dev-weapon-${index}-hp`);
            const acIn = document.getElementById(`dev-weapon-${index}-ac`);
            const atkIn = document.getElementById(`dev-weapon-${index}-atk`);
            const expIn = document.getElementById(`dev-weapon-${index}-exp`);
            if (hpIn) weapon.hp = Math.max(1, parseInt(hpIn.value, 10) || weapon.hp);
            if (acIn) weapon.ac = Math.max(1, parseInt(acIn.value, 10) || weapon.ac);
            if (atkIn) weapon.atk = Math.max(0, parseInt(atkIn.value, 10) || weapon.atk);
            if (expIn) weapon.exp = Math.max(1, parseInt(expIn.value, 10) || weapon.exp);
        });
    }

    applyPreset(preset) {
        const presets = {
            easy: { playerHpMultiplier: 1.3, playerAcMultiplier: 1.2, playerAtkMultiplier: 1.2, playerDmgMultiplier: 1.2, enemyHpMultiplier: 0.8, enemyAcMultiplier: 0.9, enemyAtkMultiplier: 0.7, enemyDmgMultiplier: 0.7, xpGoldMultiplier: 1.2, criticalThreshold: 18, restHealPercent: 0.35, expScale: 80, potionHealMultiplier: 1.3 },
            normal: { playerHpMultiplier: 1, playerAcMultiplier: 1, playerAtkMultiplier: 1, playerDmgMultiplier: 1, enemyHpMultiplier: 1, enemyAcMultiplier: 1, enemyAtkMultiplier: 1, enemyDmgMultiplier: 1, xpGoldMultiplier: 1, criticalThreshold: 19, restHealPercent: 0.25, expScale: 100, potionHealMultiplier: 1 },
            hard: { playerHpMultiplier: 0.85, playerAcMultiplier: 0.9, playerAtkMultiplier: 0.85, playerDmgMultiplier: 0.85, enemyHpMultiplier: 1.4, enemyAcMultiplier: 1.1, enemyAtkMultiplier: 1.3, enemyDmgMultiplier: 1.3, xpGoldMultiplier: 0.9, criticalThreshold: 20, restHealPercent: 0.18, expScale: 130, potionHealMultiplier: 0.85 },
            nightmare: { playerHpMultiplier: 0.7, playerAcMultiplier: 0.85, playerAtkMultiplier: 0.75, playerDmgMultiplier: 0.75, enemyHpMultiplier: 2, enemyAcMultiplier: 1.2, enemyAtkMultiplier: 1.7, enemyDmgMultiplier: 1.7, xpGoldMultiplier: 0.75, criticalThreshold: 20, restHealPercent: 0.12, expScale: 160, potionHealMultiplier: 0.7 }
        };

        const p = presets[preset];
        if (!p) return;
        this.currentDifficulty = preset;

        Object.keys(p).forEach(k => { if (this[k] !== undefined) this[k] = p[k]; });

        if (this.player) {
            this.player.expToLevel = Math.max(1, this.expScale);
            this.recalcStats();
            this.updateUI();
        }

        this.addLog(`🎚️ Difficulty set to ${preset.toUpperCase()}.`, 'info');
    }

    devHeal() { 
        if (!this.player) return;
        this.player.hp = this.player.maxHp; 
        this.updateUI(); 
        this.addLog('⚙️ Full heal applied.', 'heal'); 
    }
    
    devKill() { 
        if (!this.enemy || !this.isInCombat) return; 
        this.enemy.hp = 0; 
        this.addLog('⚙️ Enemy eliminated.', 'critical'); 
        this.defeatEnemy(); 
    }

    devUnlockCrater() {
        this.dragonLordDefeated = true;
        this.addLog('⚙️ The Crater unlocked. Weapons await.', 'weapon');
        this.updateWeaponTracker();
    }

    // UI
    updateUI() {
        if (!this.player) return;

        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setTxt('pc-class', this.player.name);
        setTxt('pc-level', this.player.level);
        setTxt('pc-terrain', Math.min(this.terrain, this.maxTerrain));
        setTxt('pc-difficulty', this.currentDifficulty.charAt(0).toUpperCase() + this.currentDifficulty.slice(1));
        setTxt('pc-skill-points', this.skillPoints);
        setTxt('pc-stat-points', this.player.statPoints);
        setTxt('pc-hp', Math.max(0, this.player.hp));
        setTxt('pc-max-hp', this.player.maxHp);
        setTxt('pc-ac', this.getPlayerAC());
        setTxt('pc-atk', `+${this.getPlayerAttackBonus()}`);

        const weapon = this.player.equipped?.weapon || WEAPON_TABLE.fists;
        const totalDmgBonus = this.calcModifier(this.player.stats.str) + (this.player.damageBonus || 0) + (weapon.damageBonus || 0);
        setTxt('pc-dmg', `${weapon.dice}+${totalDmgBonus}`);
        setTxt('pc-gold', this.player.gold);
        setTxt('pc-exp', this.player.exp);
        setTxt('pc-exp-max', this.player.expToLevel);

        const playerHpPct = this.player.maxHp > 0 ? (this.player.hp / this.player.maxHp) * 100 : 0;
        const playerFill = document.getElementById('player-hp-fill');
        if (playerFill) {
            playerFill.style.width = Math.max(0, Math.min(100, playerHpPct)) + '%';
            playerFill.classList.toggle('low', playerHpPct < 30);
        }

        const charHp = document.getElementById('pc-hp');
        if (charHp) {
            if (this.player.hp < this.player.maxHp * 0.25) {
                charHp.style.color = '#ff4444';
                charHp.style.animation = 'pulse-red 1s infinite';
            } else {
                charHp.style.color = '#e0d5c1';
                charHp.style.animation = 'none';
            }
        }
    }

    updateBoardInfo() {
        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        setTxt('board-terrain', this.terrain);
        setTxt('board-mp', this.movementPoints);
        setTxt('board-enemies', this.board ? this.board.enemies.length : 0);
    }

    updateEnemyUI() {
        const hpWrap = document.getElementById('enemy-hp-wrapper');
        if (!this.enemy) {
            if (hpWrap) hpWrap.style.opacity = '0';
            return;
        }
        if (hpWrap) hpWrap.style.opacity = '1';

        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setTxt('enemy-name', this.enemy.name);
        setTxt('enemy-hp-label', this.enemy.isWeapon ? 'SECRET WEAPON' : this.enemy.name);
        setTxt('enemy-current-hp', Math.max(0, this.enemy.hp));
        setTxt('enemy-max-hp', this.enemy.maxHp);
        setTxt('enemy-ac-val', this.getEnemyAC(this.enemy));
        setTxt('enemy-atk-val', `+${this.getEnemyAttackBonus(this.enemy)}`);

        const enemyHpPct = this.enemy.maxHp > 0 ? (this.enemy.hp / this.enemy.maxHp) * 100 : 0;
        const hpFill = document.getElementById('enemy-hp-fill');
        if (hpFill) hpFill.style.width = Math.max(0, Math.min(100, enemyHpPct)) + '%';
    }

    updateBattleArena() {
        const arena = document.getElementById('battle-arena');
        if (!arena) return;

        if (!this.enemy || !this.isInCombat) {
            arena.classList.add('hidden');
            return;
        }
        arena.classList.remove('hidden');

        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setTxt('arena-player-name', this.player?.name || 'Hero');
        setTxt('player-sprite', this.player?.sprite || '🛡️');
        setTxt('arena-player-status', this.isDefending ? 'Defending' : 'Ready');
        setTxt('arena-enemy-name', this.enemy.name);
        setTxt('enemy-sprite', this.enemy.sprite || '👹');
        setTxt('arena-enemy-status', this.enemy.isWeapon ? 'WEAPON' : 'Hostile');

        const pFill = document.getElementById('arena-player-hp');
        if (pFill && this.player) {
            const pPct = this.player.maxHp > 0 ? (this.player.hp / this.player.maxHp) * 100 : 0;
            pFill.style.width = Math.max(0, Math.min(100, pPct)) + '%';
        }

        const eFill = document.getElementById('arena-enemy-hp');
        if (eFill && this.enemy) {
            const ePct = this.enemy.maxHp > 0 ? (this.enemy.hp / this.enemy.maxHp) * 100 : 0;
            eFill.style.width = Math.max(0, Math.min(100, ePct)) + '%';
        }
    }

    updateScene() {
        const scenes = {
            1: { symbol: '🏰', name: 'Forest Edge', act: 'Act I' },
            5: { symbol: '🌲', name: 'Dark Woods', act: 'Act II' },
            9: { symbol: '🏛️', name: 'Ancient Ruins', act: 'Act III' },
            13: { symbol: '🌋', name: 'Volcanic Depths', act: 'Act IV' },
            17: { symbol: '🐉', name: 'Dragon\'s Lair', act: 'Finale' },
            20: { symbol: '☄️', name: 'The Threshold', act: 'Final' }
        };
        const tier = Object.keys(scenes).reverse().find(t => this.terrain >= parseInt(t, 10));
        const scene = scenes[tier] || scenes[1];

        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        if (this.enemy) {
            setTxt('scene-symbol', '⚔️');
            setTxt('scene-name', 'IN COMBAT');
            setTxt('area-badge', this.enemy.isWeapon ? 'SECRET BOSS' : scene.act);
        } else {
            setTxt('scene-symbol', scene.symbol);
            setTxt('scene-name', scene.name);
            setTxt('area-badge', scene.act);
        }
    }

    updateWeaponTracker() {
        const tracker = document.getElementById('weapon-tracker');
        if (tracker) tracker.classList.remove('hidden');
        const list = document.getElementById('weapon-list');
        if (!list) return;
        list.innerHTML = '';
        this.weaponBosses.forEach(w => {
            const token = document.createElement('div');
            token.className = 'weapon-token';
            token.textContent = w.name.split(' ')[1] || w.name;
            if (this.weaponsDefeated.includes(w.key)) token.classList.add('defeated');
            list.appendChild(token);
        });
    }

    populateCodex() {
        const areasPanel = document.getElementById('codex-areas');
        const weaponsPanel = document.getElementById('codex-weapons');
        if (areasPanel) {
            areasPanel.innerHTML = '';
            Object.keys(this.enemies).forEach(area => {
                const areaDiv = document.createElement('div');
                areaDiv.className = 'codex-area';
                areaDiv.innerHTML = `<h4>${area}</h4>`;
                this.enemies[area].forEach(e => {
                    const row = document.createElement('div');
                    row.className = 'codex-enemy';
                    row.innerHTML = `<span class="codex-enemy-name">${e.sprite} ${e.name}</span><span class="codex-enemy-stats">❤️ ${e.hp} &nbsp; 🛡️ ${e.ac} &nbsp; ⚔️ +${e.atk}</span>`;
                    areaDiv.appendChild(row);
                });
                areasPanel.appendChild(areaDiv);
            });
        }

        if (weaponsPanel) {
            weaponsPanel.innerHTML = '';
            this.weaponBosses.forEach(w => {
                const card = document.createElement('div');
                card.className = 'codex-weapon';
                card.innerHTML = `<h4>${w.sprite} ${w.name}</h4><p><strong>Title:</strong> ${w.title}</p><p><strong>Stats:</strong> ❤️ ${w.hp} &nbsp; 🛡️ ${w.ac} &nbsp; ⚔️ +${w.atk}</p><p class="mechanic"><strong>Mechanic:</strong> ${w.desc}</p>`;
                weaponsPanel.appendChild(card);
            });
        }
    }

    switchCodexTab(tabName) {
        document.querySelectorAll('.codex-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
        document.getElementById('codex-areas')?.classList.toggle('hidden', tabName !== 'areas');
        document.getElementById('codex-weapons')?.classList.toggle('hidden', tabName !== 'weapons');
    }

    addLog(message, type = 'info') {
        const logEntries = document.getElementById('log-entries');
        if (logEntries) {
            const entry = document.createElement('div');
            entry.className = `log-entry log-${type}`;
            entry.textContent = `> ${message}`;
            logEntries.appendChild(entry);
            logEntries.scrollTop = logEntries.scrollHeight;
        }

        if (type === 'critical' || type === 'weapon' || (type === 'info' && message.length < 90)) {
            const story = document.getElementById('story-text');
            if (story) {
                story.style.opacity = '0';
                setTimeout(() => { story.textContent = message; story.style.opacity = '1'; }, 150);
            }
        }
    }

    // Dice & effects
    async rollDice(sides = 20, label = 'Roll') {
        return new Promise(resolve => {
            this.isRolling = true;
            this.setButtonsState(true);
            const overlay = document.getElementById('dice-overlay');
            const diceEl = document.getElementById('dice');
            const labelEl = document.getElementById('dice-label');
            const resultEl = document.getElementById('dice-result');

            if (!overlay || !diceEl) {
                this.isRolling = false;
                resolve(Math.floor(Math.random() * sides) + 1);
                return;
            }

            overlay.classList.remove('hidden');
            if (labelEl) labelEl.textContent = label;
            if (resultEl) resultEl.textContent = 'Rolling...';
            diceEl.classList.add('rolling');

            let steps = 0;
            const interval = setInterval(() => {
                diceEl.textContent = Math.floor(Math.random() * sides) + 1;
                steps++;
                if (steps >= 14) {
                    clearInterval(interval);
                    const result = Math.floor(Math.random() * sides) + 1;
                    diceEl.textContent = result;
                    diceEl.classList.remove('rolling');
                    if (resultEl) resultEl.textContent = `Rolled ${result}!`;
                    setTimeout(() => {
                        overlay.classList.add('hidden');
                        this.isRolling = false;
                        resolve(result);
                    }, 500);
                }
            }, 60);
        });
    }

    async animateAttack(side) {
        return new Promise(resolve => {
            const el = document.getElementById(side === 'player' ? 'player-sprite' : 'enemy-sprite');
            if (!el) { resolve(); return; }
            el.classList.add(side === 'player' ? 'attack-left' : 'attack-right');
            setTimeout(() => this.createSlash(side === 'player' ? 'right' : 'left'), 150);
            setTimeout(() => {
                el.classList.remove(side === 'player' ? 'attack-left' : 'attack-right');
                resolve();
            }, 400);
        });
    }

    async animateHit(side) {
        return new Promise(resolve => {
            const el = document.getElementById(side === 'player' ? 'player-sprite' : 'enemy-sprite');
            if (!el) { resolve(); return; }
            el.classList.add('hit');
            setTimeout(() => { el.classList.remove('hit'); resolve(); }, 350);
        });
    }

    createSlash(side) {
        const layer = document.getElementById('slash-layer');
        if (!layer) return;
        const slash = document.createElement('div');
        slash.className = `slash-effect slash-${side}`;
        layer.appendChild(slash);
        setTimeout(() => slash.remove(), 400);
    }

    showFloatingDamage(amount, target) {
        const container = document.getElementById('floating-damage');
        if (!container) return;
        const el = document.createElement('div');
        el.className = 'float-number';
        el.textContent = amount;
        let color = '#ff6b6b';
        let leftPct = target === 'enemy' ? 65 : 35;
        if (target === 'heal') { color = '#51cf66'; leftPct = 35; }
        el.style.color = color;
        el.style.left = (leftPct + (Math.random() * 10 - 5)) + '%';
        el.style.top = (35 + Math.random() * 15) + '%';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    shakeScreen(intensity = 0.5) {
        const shaker = document.getElementById('screen-shake');
        if (!shaker) return;
        shaker.classList.remove('shake');
        void shaker.offsetWidth;
        shaker.style.animationDuration = (0.2 + intensity * 0.4) + 's';
        shaker.classList.add('shake');
        setTimeout(() => shaker.classList.remove('shake'), 500);
    }

    // Endings
    normalVictory() {
        if (this.dragonLordDefeated && this.weaponsDefeated.length >= 5) {
            this.trueVictory();
            return;
        }
        this.isGameOver = true;
        const titleEl = document.getElementById('victory-title');
        if (titleEl) titleEl.textContent = '🏆 Survivor! 🏆';
        const msgEl = document.getElementById('victory-message');
        if (msgEl) msgEl.textContent = `You survived ${this.maxTerrain} terrains! The Dragon Lord still awaits in The Crater...`;
        this.fillVictoryStats();
        document.getElementById('victory-modal')?.classList.remove('hidden');
        this.fireworks();
    }

    trueVictory() {
        this.isGameOver = true;
        const titleEl = document.getElementById('victory-title');
        if (titleEl) titleEl.textContent = '🌟 TRUE ADVENTURER 🌟';
        const msgEl = document.getElementById('victory-message');
        if (msgEl) msgEl.textContent = 'You have survived 20 terrains and sealed all five Weapons. Legends will sing of your name!';
        this.fillVictoryStats();
        document.getElementById('victory-modal')?.classList.remove('hidden');
        this.fireworks();
    }

    fillVictoryStats() {
        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        setTxt('victory-gold', this.player?.gold || 0);
        setTxt('victory-terrains', Math.min(this.terrain, this.maxTerrain));
        setTxt('victory-kills', this.kills);
        setTxt('victory-weapons', this.weaponsDefeated.length);
        setTxt('victory-score', this.score);
    }

    gameOver() {
        this.isGameOver = true;
        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        setTxt('final-gold', this.player?.gold || 0);
        setTxt('final-terrains', this.terrain);
        setTxt('final-kills', this.kills);
        setTxt('final-weapons', this.weaponsDefeated.length);
        setTxt('final-score', this.score);
        document.getElementById('game-over-modal')?.classList.remove('hidden');
        this.addLog('💀 You have fallen... The darkness claims you.', 'damage');
        this.setButtonsState(true);
    }

    fireworks() {
        const container = document.getElementById('particles');
        if (!container) return;
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const colors = ['#ffd43b', '#51cf66', '#4dabf7', '#ff6b6b', '#da77f2'];
                const p = document.createElement('div');
                p.className = 'particle';
                p.style.left = '50%';
                p.style.top = '50%';
                p.style.background = colors[Math.floor(Math.random() * colors.length)];
                p.style.width = '6px';
                p.style.height = '6px';
                p.style.transform = `translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px)`;
                p.style.transition = 'all 1.5s ease-out';
                container.appendChild(p);
                setTimeout(() => p.remove(), 1500);
            }, i * 60);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
