/* ============================================================
   DND (Dungeon and dragons) — v7
   + Multi-slot saves: new class = NEW slot, nothing overwritten
   + Saves list overlay (resume any expedition)
   + Speed button 1x/3x/5x (auto-play + hold-walk + FX)
   + Only "Erase data" can delete anything
   ============================================================ */

function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
let random = mulberry32((Date.now() % 2147483647) >>> 0);
function randInt(a,b){return a+Math.floor(random()*(b-a+1));}

const WIDTH=27, HEIGHT=13, MAX_FLOOR=100, MAX_TURNS=9999;
const CELL=24, BOARD_PAD=12;
const STAT_POINTS_PER_LEVEL=3;
const SAVE_KEY="dnd_meteor_crypt_save_v1";

function die(n){return Math.floor(random()*n)+1;}
function rollDice(n,s){let t=0;for(let i=0;i<n;i++)t+=die(s);return t;}
function abilityMod(s){return Math.floor((s-10)/2);}

const CLASSES=[
 {name:"Fighter",maxhp:18,ac:15,str:16,dex:12,con:15,int:8,abilityName:"Second Wind",abilityMax:1,primary:"str",weapon:{name:"Longsword",die:8,dice:1,bonus:0}},
 {name:"Rogue",maxhp:14,ac:14,str:10,dex:17,con:13,int:10,abilityName:"Sneak Strike",abilityMax:1,primary:"dex",weapon:{name:"Shortsword",die:6,dice:1,bonus:0}},
 {name:"Wizard",maxhp:11,ac:12,str:8,dex:14,con:12,int:17,abilityName:"Firebolt",abilityMax:3,primary:"int",weapon:{name:"Oak Staff",die:6,dice:1,bonus:0}}
];

const ENEMY_TYPES={
 goblin:{glyph:"g",name:"Goblin",hp:6,ac:12,attack:3,dice:1,damageDie:4,damageMod:1,xp:25,gold:3,sight:8},
 skeleton:{glyph:"s",name:"Skeleton",hp:9,ac:13,attack:4,dice:1,damageDie:6,damageMod:2,xp:40,gold:5,sight:8},
 orc:{glyph:"o",name:"Orc",hp:13,ac:13,attack:5,dice:1,damageDie:8,damageMod:3,xp:70,gold:8,sight:8},
 wraith:{glyph:"w",name:"Wraith",hp:16,ac:15,attack:7,dice:1,damageDie:8,damageMod:4,xp:110,gold:12,sight:8},
 ogre:{glyph:"G",name:"Ogre",hp:24,ac:14,attack:8,dice:1,damageDie:10,damageMod:6,xp:160,gold:16,sight:8},
 drake:{glyph:"r",name:"Drake",hp:30,ac:17,attack:10,dice:1,damageDie:12,damageMod:7,xp:240,gold:22,sight:8},
 demon:{glyph:"&",name:"Demon",hp:40,ac:18,attack:12,dice:2,damageDie:8,damageMod:8,xp:380,gold:30,sight:8},
 deathKnight:{glyph:"K",name:"Death Knight",hp:55,ac:20,attack:14,dice:2,damageDie:10,damageMod:9,xp:550,gold:40,sight:8},
 dragon:{glyph:"D",name:"Red Dragon",hp:35,ac:15,attack:7,dice:1,damageDie:8,damageMod:4,xp:500,gold:100,sight:99,elite:true},
 tiamat:{glyph:"T",name:"Tiamat, Dragon Queen",hp:250,ac:20,attack:16,dice:2,damageDie:10,damageMod:12,xp:5000,gold:1500,sight:99,final:true},
 sapphireWeapon:{glyph:"W",name:"Sapphire Weapon",hp:70,ac:16,attack:9,dice:1,damageDie:10,damageMod:6,xp:900,gold:150,sight:99,secret:true},
 diamondWeapon:{glyph:"V",name:"Diamond Weapon",hp:120,ac:17,attack:11,dice:1,damageDie:12,damageMod:8,xp:1500,gold:250,sight:99,secret:true},
 ultimaWeapon:{glyph:"U",name:"Ultima Weapon",hp:200,ac:18,attack:14,dice:2,damageDie:8,damageMod:10,xp:2500,gold:400,sight:99,secret:true},
 rubyWeapon:{glyph:"R",name:"Ruby Weapon",hp:300,ac:20,attack:17,dice:2,damageDie:10,damageMod:12,xp:4000,gold:600,sight:99,secret:true},
 emeraldWeapon:{glyph:"E",name:"Emerald Weapon",hp:500,ac:22,attack:20,dice:2,damageDie:12,damageMod:14,xp:6666,gold:1000,sight:99,secret:true}
};

const RELICS={
 sapphireWeapon:{key:"sapphire",name:"Sapphire Ring",desc:"+2 AC",apply:p=>{p.ac+=2;}},
 diamondWeapon:{key:"diamond",name:"Diamond Aegis",desc:"-1 damage taken",apply:()=>{}},
 ultimaWeapon:{key:"ultima",name:"Ultima Core",desc:"+3 attack & damage",apply:()=>{}},
 rubyWeapon:{key:"ruby",name:"Ruby Heart",desc:"+2 all attributes",apply:p=>{p.str+=2;p.dex+=2;p.con+=2;p.int+=2;p.maxhp+=4;p.hp=Math.min(p.maxhp,p.hp+4);}},
 emeraldWeapon:{key:"emerald",name:"Emerald Harp",desc:"Regen 2 HP/turn, +1 ability use",apply:p=>{p.abilityMax+=1;p.abilityUses+=1;}}
};

const SHOP_WEAPONS=[
 {name:"Steel Sword",die:8,dice:1,bonus:1,cost:30,tier:1},
 {name:"Silver Blade",die:10,dice:1,bonus:2,cost:60,tier:2},
 {name:"Flame Tongue",die:10,dice:1,bonus:3,cost:100,tier:3},
 {name:"Dragonbane",die:12,dice:1,bonus:4,cost:160,tier:4},
 {name:"Rune Blade",die:12,dice:1,bonus:6,cost:240,tier:5},
 {name:"Chaos Blade",die:8,dice:2,bonus:7,cost:340,tier:6},
 {name:"Apocalypse",die:10,dice:2,bonus:8,cost:500,tier:7},
 {name:"Masamune",die:12,dice:2,bonus:10,cost:800,tier:8}
];

let player=null,map=[],enemies=[],items=[],stairs=null,merchant=null,portal=null;
let logMessages=[],turn=0,state="title",endReason="";
let autoMode=false,autoTimer=null,shopOpen=false,statOpen=false,savesOpen=false,fxQueue=[];
let meta={bestScore:0,deepestFloor:0,wins:0,runs:0};
let activeSlot=null;
let speedMult=1;
const SPEEDS=[1,3,5];

const boardEl=document.getElementById("board"),boardWrap=document.getElementById("boardWrap"),
fxLayer=document.getElementById("fxLayer"),logEl=document.getElementById("log"),hudEl=document.getElementById("hud"),
hpFill=document.getElementById("hpFill"),classOverlay=document.getElementById("classOverlay"),
endOverlay=document.getElementById("endOverlay"),shopOverlay=document.getElementById("shopOverlay"),
shopList=document.getElementById("shopList"),shopGold=document.getElementById("shopGold"),
statOverlay=document.getElementById("statOverlay"),statList=document.getElementById("statList"),
statPts=document.getElementById("statPts"),autoButton=document.getElementById("autoButton"),
speedButton=document.getElementById("speedButton"),
eraseButton=document.getElementById("eraseButton"),continueButton=document.getElementById("continueButton"),
retryButton=document.getElementById("retryButton"),metaLine=document.getElementById("metaLine"),
savesOverlay=document.getElementById("savesOverlay"),savesList=document.getElementById("savesList");

// ============================================================
// SAVE SYSTEM — multi-slot. Only Erase deletes anything.
// Shape: { meta, slots: { id: runData } }   (legacy {meta,run} auto-migrates)
// ============================================================
function loadSave(){
 try{
  const raw=localStorage.getItem(SAVE_KEY);
  if(!raw)return null;
  const d=JSON.parse(raw);
  if(!d.slots){ // migrate old single-run format
   d.slots={};
   if(d.run)d.slots["legacy"]=Object.assign({created:0,status:"alive"},d.run);
   delete d.run;
  }
  return d;
 }catch(e){return null;}
}
function persist(mode){
 try{
  const data=loadSave()||{meta:meta,slots:{}};
  data.meta=meta;
  if(activeSlot){
   const prev=data.slots[activeSlot];
   if(mode==="run"&&state==="play"&&player){
    data.slots[activeSlot]={player:player,map:map,enemies:enemies,items:items,stairs:stairs,
     merchant:merchant,portal:portal,turn:turn,logMessages:logMessages,
     created:prev?prev.created:Date.now(),status:"alive"};
   }else if(prev&&mode==="fallen"){prev.status="fallen";data.slots[activeSlot]=prev;}
   else if(prev&&mode==="victorious"){prev.status="victorious";data.slots[activeSlot]=prev;}
  }
  localStorage.setItem(SAVE_KEY,JSON.stringify(data));
 }catch(e){}
}
function slotCount(){const d=loadSave();return d?Object.keys(d.slots||{}).length:0;}

function openSaves(){savesOpen=true;renderSaves();savesOverlay.classList.remove("hidden");}
function closeSaves(){savesOpen=false;savesOverlay.classList.add("hidden");}
function renderSaves(){
 const data=loadSave();
 const slots=(data&&data.slots)||{};
 const ids=Object.keys(slots).sort((a,b)=>(slots[b].created||0)-(slots[a].created||0));
 savesList.innerHTML=ids.map((id,i)=>{
  const r=slots[id],p=r.player;
  if(!p)return"";
  const tag=r.status==="victorious"?"★ victorious":(r.status==="fallen"?"† fallen":"▶ alive");
  return '<button class="shop-item" data-slot="'+id+'"><span>'+(i+1)+") Floor "+p.floor+" · "+p.className+
   " Lv"+p.level+" · HP "+p.hp+"/"+p.maxhp+" · Turn "+(r.turn||0)+"</span>"+
   '<span class="si-cost">'+tag+"</span></button>";
 }).join("")||'<p class="hint">No saves yet.</p>';
}
function continueRun(id){
 const data=loadSave();
 const r=data&&data.slots&&data.slots[id];
 if(!r||!r.player)return;
 if(data.meta)meta=data.meta;
 activeSlot=id;
 player=r.player;map=r.map||[];enemies=r.enemies||[];items=r.items||[];
 stairs=r.stairs||null;merchant=r.merchant||null;portal=r.portal||null;
 turn=r.turn||0;logMessages=r.logMessages||[];
 state="play";
 closeShop();closeStats();closeSaves();clearHold();
 classOverlay.classList.add("hidden");endOverlay.classList.add("hidden");hudEl.classList.remove("hidden");
 addLog(r.status==="fallen"?"You rise again at your last remembered moment.":"You resume your delve.","heal");
 persist("run");
 render();
}
function updateTitleInfo(){
 metaLine.textContent="Best "+meta.bestScore+" · Deepest floor "+meta.deepestFloor+" · Wins "+meta.wins+" · Runs "+meta.runs;
 const n=slotCount();
 if(n>0&&state!=="play"){
  continueButton.classList.remove("hidden");
  continueButton.textContent="⏩ Continue / Saves ("+n+")";
 }else{
  continueButton.classList.add("hidden");
 }
}

function addLog(msg,cls){logMessages.push({msg,cls:cls||"info"});if(logMessages.length>6)logMessages.shift();}

function inBounds(x,y){return x>=1&&x<=WIDTH&&y>=1&&y<=HEIGHT;}
function isWalkable(x,y){return inBounds(x,y)&&map[y]&&map[y][x]!=="#";}
function enemyAt(x,y){return enemies.find(e=>e.x===x&&e.y===y)||null;}
function itemAt(x,y){return items.find(i=>i.x===x&&i.y===y)||null;}
function occupied(x,y){
 if(player&&player.x===x&&player.y===y)return true;
 if(merchant&&merchant.x===x&&merchant.y===y)return true;
 if(portal&&portal.x===x&&portal.y===y)return true;
 return enemyAt(x,y)!==null;
}
function dist(ax,ay,bx,by){return Math.abs(ax-bx)+Math.abs(ay-by);}
const DIRS=[[0,-1],[0,1],[-1,0],[1,0]];

function findFirstStep(sx,sy,tx,ty){
 if(sx===tx&&sy===ty)return[0,0];
 if(!inBounds(tx,ty))return null;
 const visited=[];for(let y=0;y<=HEIGHT;y++)visited.push(new Array(WIDTH+1).fill(false));
 visited[sy][sx]=true;
 const queue=[];let head=0;
 for(const dir of DIRS){const nx=sx+dir[0],ny=sy+dir[1];
  if(inBounds(nx,ny)&&isWalkable(nx,ny)){
   if(nx===tx&&ny===ty)return[dir[0],dir[1]];
   if(!visited[ny][nx]){queue.push({x:nx,y:ny,fdx:dir[0],fdy:dir[1]});visited[ny][nx]=true;}
  }}
 while(head<queue.length){const cur=queue[head++];
  for(const dir of DIRS){const nx=cur.x+dir[0],ny=cur.y+dir[1];
   if(inBounds(nx,ny)&&isWalkable(nx,ny)&&!visited[ny][nx]){
    if(nx===tx&&ny===ty)return[cur.fdx,cur.fdy];
    queue.push({x:nx,y:ny,fdx:cur.fdx,fdy:cur.fdy});visited[ny][nx]=true;
   }}}
 return null;
}

function createPlayer(ci){
 const c=CLASSES[ci-1];
 player={classIndex:ci,className:c.name,level:1,xp:0,xpNext:60,
  hp:c.maxhp,maxhp:c.maxhp,ac:c.ac,str:c.str,dex:c.dex,con:c.con,int:c.int,
  gold:10,potions:2,abilityName:c.abilityName,abilityUses:c.abilityMax,abilityMax:c.abilityMax,
  primary:c.primary,weapon:{name:c.weapon.name,die:c.weapon.die,dice:c.weapon.dice,bonus:c.weapon.bonus,enhance:0,tier:0},
  trainHp:0,trainAc:0,trainFocus:0,statPoints:0,autoCycle:0,secretKills:0,
  relics:{},dragonSlainLastFloor:false,
  defending:false,x:2,y:2,floor:1,kills:0};
}
function primaryMod(){
 if(player.primary==="str")return abilityMod(player.str);
 if(player.primary==="dex")return abilityMod(player.dex);
 return abilityMod(player.int);
}
function proficiency(){return 2+Math.floor((player.level-1)/4);}
function weaponBonus(){return player.weapon.bonus+player.weapon.enhance;}
function attackBonus(){return primaryMod()+proficiency()+weaponBonus()+(player.relics.ultima?3:0);}

function floorScale(f){
 return{hp:1+Math.min(f-1,90)*0.05,atk:Math.floor((f-1)/5),ac:Math.floor((f-1)/8),
  dmg:Math.floor((f-1)/6),xp:1+(f-1)*0.05,gold:1+(f-1)*0.05};
}

function spawnEnemy(kind,x,y){
 const t=ENEMY_TYPES[kind];
 const fixed=t.secret||t.final||t.elite;
 const s=floorScale(player.floor);
 enemies.push({kind,glyph:t.glyph,name:t.name,
  hp:fixed?t.hp:Math.round(t.hp*s.hp),maxhp:fixed?t.hp:Math.round(t.hp*s.hp),
  ac:t.ac+(fixed?0:s.ac),attack:t.attack+(fixed?0:s.atk),
  dice:t.dice,damageDie:t.damageDie,damageMod:t.damageMod+(fixed?0:s.dmg),
  xp:fixed?t.xp:Math.round(t.xp*s.xp),gold:fixed?t.gold:Math.round(t.gold*s.gold),
  secret:t.secret,final:t.final,elite:t.elite,sight:t.sight,x,y});
}

function randomEnemyKind(floor){
 const pool=[["goblin",10],["skeleton",10]];
 if(floor>=8)pool.push(["orc",8]);
 if(floor>=18)pool.push(["wraith",8]);
 if(floor>=28)pool.push(["ogre",7]);
 if(floor>=40)pool.push(["drake",6]);
 if(floor>=45)pool.push(["dragon",2]);
 if(floor>=55)pool.push(["demon",5]);
 if(floor>=70)pool.push(["deathKnight",4]);
 let total=0;for(const p of pool)total+=p[1];
 let roll=random()*total;
 for(const p of pool){roll-=p[1];if(roll<=0)return p[0];}
 return "goblin";
}

function secretWeaponForFloor(f){
 if(f<10)return null;
 if(f<30)return "sapphireWeapon";
 if(f<50)return "diamondWeapon";
 if(f<70)return "ultimaWeapon";
 if(f<90)return "rubyWeapon";
 return "emeraldWeapon";
}

function findFree(minD){
 minD=minD||0;
 for(let a=1;a<=600;a++){const x=randInt(2,WIDTH-1),y=randInt(2,HEIGHT-1);
  if(map[y][x]==="."&&!occupied(x,y)&&!itemAt(x,y))
   if(minD<=0||dist(x,y,player.x,player.y)>=minD)return[x,y];}
 for(let y=2;y<=HEIGHT-1;y++)for(let x=2;x<=WIDTH-1;x++)
  if(map[y][x]==="."&&!occupied(x,y)&&!itemAt(x,y))
   if(minD<=0||dist(x,y,player.x,player.y)>=minD)return[x,y];
 return[2,2];
}
function nearestEnemy(maxD){let b=null,bd=null;for(const e of enemies){const d=dist(player.x,player.y,e.x,e.y);if(d<=maxD&&(bd===null||d<bd)){b=e;bd=d;}}return[b,bd];}
function adjacentEnemy(){return enemies.find(e=>dist(player.x,player.y,e.x,e.y)===1)||null;}
function removeEnemy(e){const i=enemies.indexOf(e);if(i!==-1)enemies.splice(i,1);}

// ---------- Stats menu ----------
function spendStatPoint(stat,quiet){
 if(!player||player.statPoints<=0)return false;
 const oldDex=abilityMod(player.dex);
 player[stat]+=1;player.statPoints-=1;
 if(stat==="con"){player.maxhp+=2;player.hp=Math.min(player.maxhp,player.hp+2);}
 if(stat==="dex"){if(Math.floor(abilityMod(player.dex)/2)>Math.floor(oldDex/2))player.ac+=1;}
 if(!quiet)addLog(stat.toUpperCase()+" rises to "+player[stat]+"!","level");
 persist("run");
 return true;
}
function autoSpend(){
 if(!player||player.statPoints<=0)return;
 player.autoCycle=(player.autoCycle||0)+1;
 const c=player.autoCycle;
 let stat=player.primary;
 if(c%4===0)stat="con";else if(c%6===0)stat="dex";
 spendStatPoint(stat,true);
}
function openStats(){statOpen=true;renderStats();statOverlay.classList.remove("hidden");}
function closeStats(){statOpen=false;statOverlay.classList.add("hidden");}
function renderStats(){
 statPts.textContent="Stat points: "+player.statPoints+"  ·  "+player.className+" Lv"+player.level;
 const rows=[["str","STR — class power (Fighter)"],["dex","DEX — Rogue power, +1 AC per +2 mod"],["con","CON — +2 Max HP per point"],["int","INT — Wizard power"]];
 statList.innerHTML=rows.map((r,i)=>{
  const v=player[r[0]];
  return '<button class="shop-item" data-stat="'+r[0]+'" '+(player.statPoints<=0?"disabled":"")+
   '><span>'+(i+1)+") "+r[1]+' → '+v+" (mod "+(abilityMod(v)>=0?"+":"")+abilityMod(v)+")</span>"+
   '<span class="si-cost">+1</span></button>';
 }).join("");
}

// ---------- XP / kills / relics ----------
function gainXP(amount){
 player.xp+=amount;
 while(player.xp>=player.xpNext){
  player.xp-=player.xpNext;player.level++;
  player.xpNext=Math.floor(player.xpNext*1.35);
  const hpGain=2+Math.max(0,abilityMod(player.con));
  player.maxhp+=hpGain;player.hp=Math.min(player.maxhp,player.hp+hpGain);
  if(player.level%2===0)player.ac+=1;
  player.abilityUses=player.abilityMax;
  player.statPoints+=STAT_POINTS_PER_LEVEL;
  addLog("Level "+player.level+"! +"+STAT_POINTS_PER_LEVEL+" stat points (press C).","level");
  fx({kind:"level"});
 }
}
function grantRelic(kind){
 const d=RELICS[kind];
 if(!d||player.relics[d.key])return;
 player.relics[d.key]=true;
 d.apply(player);
 addLog("RELIC OBTAINED: "+d.name+" ("+d.desc+")!","level");
 fx({kind:"level"});
}
function awardKill(enemy){
 player.kills++;player.gold+=enemy.gold;
 addLog(enemy.name+" is defeated! +"+enemy.xp+" XP, +"+enemy.gold+" gold.","death");
 gainXP(enemy.xp);
 if(random()<0.20)items.push({x:enemy.x,y:enemy.y,glyph:"!",type:"potion"});
 if(enemy.kind==="dragon"){
  player.dragonSlainLastFloor=true;
  addLog("The dragon's death cry echoes through the depths...","death");
 }
 if(enemy.secret){
  player.secretKills++;player.statPoints+=2;
  addLog("SECRET BOSS DEFEATED! +2 stat points.","level");
  grantRelic(enemy.kind);
 }
 fx({kind:"enemyDeath",x:enemy.x,y:enemy.y});
 removeEnemy(enemy);
 if(enemy.final){state="win";endReason="You have slain Tiamat, the Dragon Queen! (For now... the true Weapons still slumber.)";fx({kind:"level"});}
}

// ---------- Combat ----------
function playerAttack(target,advantage,extraDie){
 const roll1=die(20);let attackRoll=roll1;
 if(advantage)attackRoll=Math.max(roll1,die(20));
 if(attackRoll===1){addLog("You fumble the attack!","miss");fx({kind:"miss",x:target.x,y:target.y});return;}
 const total=attackRoll+attackBonus();const crit=attackRoll===20;
 if(crit||total>=target.ac){
  let dmg=rollDice(player.weapon.dice||1,player.weapon.die)+weaponBonus()+primaryMod()+(player.relics.ultima?3:0);
  if(extraDie)dmg+=rollDice(1,extraDie);
  if(crit)dmg+=rollDice(player.weapon.dice||1,player.weapon.die);
  if(dmg<1)dmg=1;
  target.hp-=dmg;
  addLog("You "+(crit?"CRIT":"hit")+" "+target.name+" for "+dmg+" damage.",crit?"crit":"hit");
  fx({kind:"enemyHit",x:target.x,y:target.y,amount:dmg,crit});
  if(target.hp<=0)awardKill(target);
 }else{addLog("You miss the "+target.name+".","miss");fx({kind:"miss",x:target.x,y:target.y});}
}
function useAbility(targetOverride){
 if(player.abilityUses<=0){addLog("No ability uses remain.");return false;}
 if(player.classIndex===1){player.abilityUses--;const heal=rollDice(1,10)+player.level;player.hp=Math.min(player.maxhp,player.hp+heal);addLog("Second Wind restores "+heal+" HP.","heal");fx({kind:"heal",amount:heal});return true;}
 if(player.classIndex===2){const t=adjacentEnemy();if(!t){addLog("Sneak Strike requires an adjacent enemy.");return false;}player.abilityUses--;playerAttack(t,true,6);return true;}
 if(player.classIndex===3){
  const t=targetOverride||nearestEnemy(8)[0];
  if(!t){addLog("Firebolt needs a target within 8 tiles.");return false;}
  player.abilityUses--;const roll=die(20);
  if(roll===1){addLog("Your Firebolt fizzles!","miss");fx({kind:"spell",x:t.x,y:t.y,hit:false});return true;}
  const total=roll+abilityMod(player.int)+proficiency();const crit=roll===20;
  if(crit||total>=t.ac){let dmg=rollDice(1,10)+abilityMod(player.int);if(crit)dmg+=rollDice(1,10);if(dmg<1)dmg=1;
   t.hp-=dmg;addLog("Firebolt scorches "+t.name+" for "+dmg+" damage.",crit?"crit":"hit");
   fx({kind:"spell",x:t.x,y:t.y,amount:dmg,crit,hit:true});if(t.hp<=0)awardKill(t);
  }else{addLog("Firebolt misses the "+t.name+".","miss");fx({kind:"spell",x:t.x,y:t.y,hit:false});}
  return true;}
 return false;
}

// ---------- Map gen ----------
function generateMap(floor){
 const dragonEcho=player.dragonSlainLastFloor;
 player.dragonSlainLastFloor=false;

 let okMap=false;
 for(let attempt=1;attempt<=80;attempt++){
  enemies=[];items=[];stairs=null;merchant=null;portal=null;map=[];
  for(let y=1;y<=HEIGHT;y++){map[y]=[];for(let x=1;x<=WIDTH;x++)map[y][x]=(x===1||y===1||x===WIDTH||y===HEIGHT)?"#":(random()<0.12?"#":".");}
  let px=2,py=HEIGHT-2;
  for(let i=1;i<=500;i++){const x=randInt(2,WIDTH-1),y=randInt(2,HEIGHT-1);if(map[y][x]==="."){px=x;py=y;break;}}
  player.x=px;player.y=py;

  if(floor<MAX_FLOOR){const[sx,sy]=findFree(10);map[sy][sx]="+";stairs={x:sx,y:sy};}
  const[mx,my]=findFree(6);merchant={x:mx,y:my};

  const wk=secretWeaponForFloor(floor);
  if(wk){
    let chance=0.03;
    if(player.gold>=300)chance+=0.02;
    if(dragonEcho)chance=1;
    if(random()<chance){const[x,y]=findFree(6);portal={x,y,kind:wk};}
  }

  const enemyCount=Math.min(4+Math.floor(floor/5),9);
  for(let i=1;i<=enemyCount;i++){const[x,y]=findFree(5);spawnEnemy(randomEnemyKind(floor),x,y);}
  if(floor===MAX_FLOOR){const[x,y]=findFree(8);spawnEnemy("tiamat",x,y);}

  for(let i=1;i<=2;i++){const[x,y]=findFree(0);items.push({x,y,glyph:"!",type:"potion"});}
  for(let i=1;i<=3;i++){const[x,y]=findFree(0);items.push({x,y,glyph:"$",type:"gold",amount:randInt(3,8)});}

  if(floor<MAX_FLOOR){if(stairs&&findFirstStep(player.x,player.y,stairs.x,stairs.y)){okMap=true;break;}}
  else{const fin=enemies.find(e=>e.final);if(fin&&findFirstStep(player.x,player.y,fin.x,fin.y)){okMap=true;break;}}
 }
 if(!okMap){
  map=[];for(let y=1;y<=HEIGHT;y++){map[y]=[];for(let x=1;x<=WIDTH;x++)map[y][x]=(x===1||y===1||x===WIDTH||y===HEIGHT)?"#":".";}
  player.x=2;player.y=HEIGHT-2;enemies=[];items=[];stairs=null;merchant=null;portal=null;
  if(floor<MAX_FLOOR){stairs={x:WIDTH-2,y:2};map[stairs.y][stairs.x]="+";}
  merchant={x:6,y:HEIGHT-3};
  spawnEnemy(randomEnemyKind(floor),WIDTH-4,HEIGHT-3);
  spawnEnemy(randomEnemyKind(floor),WIDTH-3,4);
  if(floor===MAX_FLOOR)spawnEnemy("tiamat",WIDTH-3,3);
  items.push({x:4,y:4,glyph:"!",type:"potion"});
  items.push({x:5,y:4,glyph:"$",type:"gold",amount:5});
 }
 meta.deepestFloor=Math.max(meta.deepestFloor,floor);
 if(floor===MAX_FLOOR)addLog("Floor 100: TIAMAT, the Dragon Queen, coils in the dark.");
 else addLog("Floor "+floor+": stairs (+), merchant (M)."+(portal?" A terrible presence hums (?).":""));
}

// ---------- Actions ----------
function descendFloor(){
 player.floor++;player.abilityUses=player.abilityMax;
 const heal=rollDice(1,4);player.hp=Math.min(player.maxhp,player.hp+heal);
 addLog("You descend to floor "+player.floor+" (+"+heal+" HP).","heal");
 generateMap(player.floor);
}
function pickupItemAt(x,y){
 const item=itemAt(x,y);if(!item)return;
 if(item.type==="potion"){player.potions++;addLog("You pick up a healing potion (!).","heal");fx({kind:"itemFloat",text:"+potion"});}
 else{player.gold+=item.amount;addLog("You collect "+item.amount+" gold ($).","gold");fx({kind:"gold",amount:item.amount});}
 const i=items.indexOf(item);if(i!==-1)items.splice(i,1);
}
function triggerPortal(p){
 let bx=null,by=null;
 for(const d of DIRS){const nx=player.x+d[0],ny=player.y+d[1];
  if(isWalkable(nx,ny)&&!enemyAt(nx,ny)&&!(merchant&&merchant.x===nx&&merchant.y===ny)){bx=nx;by=ny;break;}}
 if(bx===null){const f=findFree(1);bx=f[0];by=f[1];}
 spawnEnemy(p.kind,bx,by);
 const e=enemyAt(bx,by);
 addLog("A SECRET WEAPON AWAKENS: "+e.name+"!","death");
 shake();fx({kind:"enemyDeath",x:bx,y:by});
}
function tryMove(dx,dy){
 const nx=player.x+dx,ny=player.y+dy;
 if(!isWalkable(nx,ny)){addLog("A wall blocks your path.");return false;}
 const target=enemyAt(nx,ny);
 if(target){playerAttack(target);return true;}
 player.x=nx;player.y=ny;
 pickupItemAt(nx,ny);
 if(stairs&&nx===stairs.x&&ny===stairs.y&&player.floor<MAX_FLOOR)descendFloor();
 if(portal&&nx===portal.x&&ny===portal.y){const p=portal;portal=null;triggerPortal(p);}
 if(merchant&&nx===merchant.x&&ny===merchant.y)openShop();
 return true;
}
function drinkPotion(){
 if(player.potions<=0){addLog("You have no potions.");return false;}
 player.potions--;
 const heal=rollDice(2,4)+Math.max(0,abilityMod(player.con));
 player.hp=Math.min(player.maxhp,player.hp+heal);
 addLog("You drink a potion and recover "+heal+" HP.","heal");
 fx({kind:"heal",amount:heal});
 return true;
}

// ---------- Shop ----------
function buildEntries(){
 const e=[];
 for(const w of SHOP_WEAPONS)if(w.tier>player.weapon.tier)e.push({id:"weapon"+w.tier,label:w.name+" ("+w.dice+"d"+w.die+"+"+w.bonus+")",cost:w.cost,apply:()=>{player.weapon={name:w.name,die:w.die,dice:w.dice,bonus:w.bonus,enhance:0,tier:w.tier};addLog("You equip the "+w.name+"!","shop");}});
 e.push({id:"potion",label:"Healing Potion",cost:15,apply:()=>{player.potions++;addLog("You buy a healing potion.","shop");}});
 if(player.weapon.enhance<3)e.push({id:"hone",label:"Hone Weapon +1",cost:25+player.weapon.enhance*20,apply:()=>{player.weapon.enhance++;addLog("Your weapon gleams: +"+player.weapon.enhance+".","shop");}});
 if(player.trainHp<3)e.push({id:"tough",label:"Toughness Training (+3 Max HP)",cost:25+player.trainHp*10,apply:()=>{player.trainHp++;player.maxhp+=3;player.hp+=3;addLog("You feel tougher (+3 max HP).","shop");}});
 if(player.trainAc<2)e.push({id:"plate",label:"Armor Plating (+1 AC)",cost:30+player.trainAc*15,apply:()=>{player.trainAc++;player.ac++;addLog("Your armor improves (+1 AC).","shop");}});
 if(player.trainFocus<1)e.push({id:"focus",label:"Focus Study (+1 Ability Use)",cost:40,apply:()=>{player.trainFocus++;player.abilityMax++;player.abilityUses++;addLog("Your focus deepens.","shop");}});
 return e;
}
function openShop(){shopOpen=true;clearHold();addLog("The merchant bows: \"Browse, hero...\"","shop");renderShop();shopOverlay.classList.remove("hidden");}
function closeShop(){shopOpen=false;shopOverlay.classList.add("hidden");}
function renderShop(){
 const es=buildEntries();
 shopGold.textContent="Your gold: "+player.gold;
 shopList.innerHTML=es.map((en,i)=>'<button class="shop-item" data-idx="'+i+'" '+(player.gold<en.cost?"disabled":"")+"><span>"+(i+1)+") "+escapeHtml(en.label)+"</span>"+'<span class="si-cost">'+en.cost+"g</span></button>").join("");
}
function tryBuyIndex(i){
 const es=buildEntries();const en=es[i];if(!en)return;
 if(player.gold<en.cost){addLog("Not enough gold.","miss");renderShop();return;}
 player.gold-=en.cost;en.apply();fx({kind:"goldSpend",amount:en.cost});renderShop();render();persist("run");
}
function tryBuyById(id){const es=buildEntries();const i=es.findIndex(x=>x.id===id);if(i!==-1&&player.gold>=es[i].cost)tryBuyIndex(i);}
function autoShop(){
 if(player.potions<2)tryBuyById("potion");
 const nw=SHOP_WEAPONS.find(w=>w.tier===player.weapon.tier+1);
 if(nw&&player.gold>=nw.cost+20)tryBuyById("weapon"+nw.tier);
 if(player.gold>=90&&player.weapon.enhance<3)tryBuyById("hone");
 closeShop();
}

// ---------- Commands ----------
function processCommand(cmd){
 if(!cmd)return false;
 cmd=cmd.toLowerCase().trim();if(cmd==="")return false;
 if(cmd==="w"||cmd==="k"||cmd==="8"||cmd==="n")return tryMove(0,-1);
 if(cmd==="s"||cmd==="j"||cmd==="2")return tryMove(0,1);
 if(cmd==="a"||cmd==="h"||cmd==="4")return tryMove(-1,0);
 if(cmd==="d"||cmd==="l"||cmd==="6"||cmd==="e")return tryMove(1,0);
 if(cmd==="."||cmd==="5"){addLog("You wait a moment.");return true;}
 if(cmd==="x"){player.defending=true;addLog("You raise your guard (+2 AC until next turn).");return true;}
 if(cmd==="q")return drinkPotion();
 if(cmd==="f")return useAbility();
 if(cmd==="b"){if(merchant&&player.x===merchant.x&&player.y===merchant.y){openShop();return true;}addLog("No merchant within reach.");return false;}
 if(cmd===">"){if(stairs&&player.x===stairs.x&&player.y===stairs.y&&player.floor<MAX_FLOOR){descendFloor();return true;}addLog("There is no usable stair here.");return false;}
 addLog("Unknown command: "+cmd);return false;
}

// ---------- Enemies ----------
function enemyAttack(enemy){
 const roll=die(20);
 const targetAC=player.ac+(player.defending?2:0);
 const total=roll+enemy.attack;
 if(roll===1){addLog(enemy.name+" fumbles its attack.","miss");fx({kind:"playerMiss"});return;}
 if(roll===20||total>=targetAC){
  let dmg=rollDice(enemy.dice||1,enemy.damageDie)+enemy.damageMod;
  if(roll===20)dmg+=rollDice(enemy.dice||1,enemy.damageDie);
  if(player.relics.diamond)dmg=Math.max(1,dmg-1);
  if(dmg<1)dmg=1;
  player.hp-=dmg;
  addLog(enemy.name+" hits you for "+dmg+" damage.","hurt");
  fx({kind:"playerHit",amount:dmg});
  if(player.hp<=0){player.hp=0;state="gameover";endReason="You were slain by "+enemy.name+" on floor "+player.floor+".";}
 }else{addLog(enemy.name+" misses you.","miss");fx({kind:"playerMiss"});}
}
function enemyTurn(enemy){
 if(state!=="play")return;
 const d=dist(enemy.x,enemy.y,player.x,player.y);
 if(d>(enemy.sight||8))return;
 if(d===1){enemyAttack(enemy);return;}
 const step=findFirstStep(enemy.x,enemy.y,player.x,player.y);
 if(step&&(step[0]!==0||step[1]!==0)){
  const nx=enemy.x+step[0],ny=enemy.y+step[1];
  if(isWalkable(nx,ny)&&!enemyAt(nx,ny)&&!(nx===player.x&&ny===player.y)){enemy.x=nx;enemy.y=ny;}
 }
}
function enemiesAct(){for(const e of enemies){if(e.hp>0)enemyTurn(e);if(state!=="play")break;}}

// ---------- Auto AI ----------
function autoCommand(){
 if(player.hp<=Math.floor(player.maxhp*0.35)&&player.potions>0)return"q";
 const adj=adjacentEnemy();
 if(player.classIndex===1&&player.abilityUses>0&&player.hp<=Math.floor(player.maxhp*0.45))return"f";
 if(player.classIndex===2&&player.abilityUses>0&&adj)return"f";
 if(player.classIndex===3&&player.abilityUses>0){const[t,d]=nearestEnemy(8);if(t&&d>1)return"f";}
 if(adj){if(adj.x<player.x)return"h";if(adj.x>player.x)return"l";if(adj.y<player.y)return"k";if(adj.y>player.y)return"j";}
 let tx=null,ty=null;
 if(player.floor<MAX_FLOOR&&stairs){tx=stairs.x;ty=stairs.y;}
 else{const[t]=nearestEnemy(999);if(t){tx=t.x;ty=t.y;}}
 if(player.hp<Math.floor(player.maxhp*0.70)){
  let b=null,bd=null;
  for(const it of items)if(it.type==="potion"){const d=dist(player.x,player.y,it.x,it.y);if(bd===null||d<bd){b=it;bd=d;}}
  if(b&&bd<=6){tx=b.x;ty=b.y;}
 }
 if(tx!==null&&ty!==null){
  const step=findFirstStep(player.x,player.y,tx,ty);
  if(step){
   const nx=player.x+step[0],ny=player.y+step[1];
   if(!(portal&&nx===portal.x&&ny===portal.y)){
    if(step[0]===0&&step[1]===-1)return"k";
    if(step[0]===0&&step[1]===1)return"j";
    if(step[0]===-1&&step[1]===0)return"h";
    if(step[0]===1&&step[1]===0)return"l";
   }
  }
 }
 const choices=[];
 const md=[[0,-1,"k"],[0,1,"j"],[-1,0,"h"],[1,0,"l"]];
 for(const d of md){const nx=player.x+d[0],ny=player.y+d[1];
  if(isWalkable(nx,ny)&&!enemyAt(nx,ny)&&!(portal&&nx===portal.x&&ny===portal.y))choices.push(d[2]);}
 if(choices.length>0)return choices[Math.floor(random()*choices.length)];
 return".";
}

function finalScore(){
 let s=player.xp+player.gold+player.kills*10+(player.floor-1)*100+player.secretKills*1000;
 if(state==="win")s+=5000;
 return s;
}

// ============================================================
// WEB LAYER
// ============================================================
function escapeHtml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function classFor(ch){
 switch(ch){
  case"@":return"t-player";case"g":return"t-goblin";case"s":return"t-skeleton";case"o":return"t-orc";
  case"w":return"t-wraith";case"G":return"t-ogre";case"r":return"t-drake";case"&":return"t-demon";
  case"K":return"t-knight";case"D":return"t-dragon";case"T":return"t-tiamat";case"!":return"t-potion";
  case"$":return"t-gold";case"+":return"t-stairs";case"M":return"t-merchant";case"?":return"t-portal";
  case"W":return"t-sapphire";case"V":return"t-diamond";case"U":return"t-ultima";
  case"R":return"t-ruby";case"E":return"t-emerald";case"#":return"t-wall";default:return"t-floor";
 }
}
function fx(d){fxQueue.push(d);}
function cellPos(x,y){return{left:BOARD_PAD+(x-1)*CELL+CELL/2,top:BOARD_PAD+(y-1)*CELL+CELL/2};}
function floatText(x,y,text,cls){const el=document.createElement("div");el.className="float-text "+cls;el.textContent=text;const p=cellPos(x,y);el.style.left=p.left+"px";el.style.top=p.top+"px";fxLayer.appendChild(el);setTimeout(()=>el.remove(),1000);}
function flashCell(x,y,cls){const idx=(y-1)*WIDTH+(x-1);const c=boardEl.children[idx];if(!c)return;c.classList.add(cls);setTimeout(()=>c.classList.remove(cls),450);}
function shake(){boardWrap.classList.remove("shake");void boardWrap.offsetWidth;boardWrap.classList.add("shake");setTimeout(()=>boardWrap.classList.remove("shake"),350);}
function projectile(a1,b1,a2,b2){const a=cellPos(a1,b1),b=cellPos(a2,b2);const el=document.createElement("div");el.className="proj";el.style.left=a.left+"px";el.style.top=a.top+"px";el.style.setProperty("--tx",(b.left-a.left)+"px");el.style.setProperty("--ty",(b.top-a.top)+"px");fxLayer.appendChild(el);setTimeout(()=>el.remove(),300);}
function playFx(){
 for(const f of fxQueue){
  switch(f.kind){
   case"enemyHit":flashCell(f.x,f.y,"flash-hit");floatText(f.x,f.y,"-"+f.amount,f.crit?"float-crit":"float-dmg");if(f.crit)shake();break;
   case"enemyDeath":flashCell(f.x,f.y,"flash-death");floatText(f.x,f.y,"SLAIN","float-death");break;
   case"miss":floatText(f.x,f.y,"miss","float-miss");break;
   case"playerHit":flashCell(player.x,player.y,"flash-hurt");floatText(player.x,player.y,"-"+f.amount,"float-hurt");shake();break;
   case"playerMiss":floatText(player.x,player.y,"dodge","float-miss");break;
   case"heal":flashCell(player.x,player.y,"flash-heal");floatText(player.x,player.y,"+"+f.amount,"float-heal");break;
   case"gold":floatText(player.x,player.y,"+"+f.amount+"g","float-gold");break;
   case"goldSpend":floatText(player.x,player.y,"-"+f.amount+"g","float-gold");break;
   case"itemFloat":floatText(player.x,player.y,f.text,"float-heal");break;
   case"level":floatText(player.x,player.y,"LEVEL UP!","float-level");break;
   case"spell":projectile(player.x,player.y,f.x,f.y);setTimeout(()=>{flashCell(f.x,f.y,f.hit?"flash-hit":"flash-heal");floatText(f.x,f.y,f.hit?("-"+f.amount+(f.crit?"!":"")):"miss",f.hit?(f.crit?"float-crit":"float-dmg"):"float-miss");},220);break;
  }
 }
 fxQueue=[];
}

function relicList(){
 const r=[];
 if(player.relics.sapphire)r.push("Sapphire Ring");
 if(player.relics.diamond)r.push("Diamond Aegis");
 if(player.relics.ultima)r.push("Ultima Core");
 if(player.relics.ruby)r.push("Ruby Heart");
 if(player.relics.emerald)r.push("Emerald Harp");
 return r.length?r.join(", "):"none";
}

function render(){
 if(player){
  document.getElementById("hudFloor").textContent="Floor "+player.floor+"/"+MAX_FLOOR;
  document.getElementById("hudTurn").textContent="Turn "+Math.min(turn+1,MAX_TURNS);
  document.getElementById("hudClass").textContent=player.className+" Lv"+player.level;
  document.getElementById("hudPts").textContent="Pts "+player.statPoints;
  hpFill.style.width=Math.max(0,Math.min(100,(player.hp/player.maxhp)*100))+"%";
  document.getElementById("hudHp").textContent="HP "+player.hp+"/"+player.maxhp;
  document.getElementById("hudAc").textContent="AC "+player.ac;
  document.getElementById("hudXp").textContent="XP "+player.xp+"/"+player.xpNext;
  document.getElementById("hudWeapon").textContent=player.weapon.name+(player.weapon.enhance>0?" +"+player.weapon.enhance:"")+" ("+player.weapon.dice+"d"+player.weapon.die+"+"+weaponBonus()+")";
  document.getElementById("hudStats").textContent="S"+player.str+" D"+player.dex+" C"+player.con+" I"+player.int;
  document.getElementById("hudGold").textContent="Gold "+player.gold;
  document.getElementById("hudPotions").textContent="Potions "+player.potions;
  document.getElementById("hudAbility").textContent=player.abilityName+" "+player.abilityUses+"/"+player.abilityMax;
  document.getElementById("hudKills").textContent="Kills "+player.kills;
  document.getElementById("hudRelics").textContent="Relics: "+relicList();
 }
 const grid=[];
 for(let y=1;y<=HEIGHT;y++){grid[y]=[];for(let x=1;x<=WIDTH;x++)grid[y][x]=(map[y]&&map[y][x])?map[y][x]:" ";}
 for(const it of items)if(inBounds(it.x,it.y))grid[it.y][it.x]=it.glyph;
 if(stairs)grid[stairs.y][stairs.x]="+";
 if(merchant&&inBounds(merchant.x,merchant.y))grid[merchant.y][merchant.x]="M";
 if(portal&&inBounds(portal.x,portal.y))grid[portal.y][portal.x]="?";
 for(const e of enemies)if(inBounds(e.x,e.y))grid[e.y][e.x]=e.glyph;
 if(player&&inBounds(player.x,player.y))grid[player.y][player.x]="@";
 let html="";
 for(let y=1;y<=HEIGHT;y++)for(let x=1;x<=WIDTH;x++){const ch=grid[y][x];html+='<span class="cell '+classFor(ch)+'">'+(ch===" "?"&nbsp;":escapeHtml(ch))+"</span>";}
 boardEl.innerHTML=html;
 logEl.innerHTML=logMessages.map(m=>'<li class="lg-'+m.cls+'">» '+escapeHtml(m.msg)+"</li>").join("");
}

// ---------- Turn driver ----------
function doPlayerTurn(cmdOrAction){
 if(state!=="play")return;
 player.defending=false;
 if(player.relics.emerald&&player.hp<player.maxhp)player.hp=Math.min(player.maxhp,player.hp+2);
 const consumed=(typeof cmdOrAction==="function")?cmdOrAction():processCommand(cmdOrAction);
 if(!consumed){addLog("That action did nothing.");render();return;}
 turn++;
 if(state!=="play"){finish();render();playFx();return;}
 enemiesAct();
 if(state==="play"&&turn>=MAX_TURNS){state="gameover";endReason="The dungeon collapses after "+turn+" turns.";}
 if(state!=="play"){finish();render();playFx();return;}
 render();playFx();persist("run");
}

function startGame(ci){
 closeShop();closeStats();closeSaves();clearHold();
 createPlayer(ci);turn=0;logMessages=[];endReason="";state="play";
 activeSlot=String(Date.now()); // NEW expedition = NEW slot; old slots untouched
 meta.runs+=1;meta.deepestFloor=Math.max(meta.deepestFloor,1);
 addLog("You enter the crypt as a level 1 "+player.className+".");
 generateMap(player.floor);
 classOverlay.classList.add("hidden");endOverlay.classList.add("hidden");hudEl.classList.remove("hidden");
 render();persist("run");
}
function finish(){
 stopAuto();clearHold();closeShop();closeStats();closeSaves();
 meta.bestScore=Math.max(meta.bestScore,finalScore());
 meta.deepestFloor=Math.max(meta.deepestFloor,player.floor);
 if(state==="win")meta.wins+=1;
 document.getElementById("endTitle").textContent=state==="win"?"VICTORY!":"GAME OVER";
 document.getElementById("endReason").textContent=endReason;
 document.getElementById("endScore").textContent="Final score: "+finalScore()+"  (Best: "+meta.bestScore+")";
 document.getElementById("endStats").textContent=player.className+" Lv"+player.level+" | Floor "+player.floor+"/"+MAX_FLOOR+" | Kills "+player.kills+" | Secrets "+player.secretKills+" | Gold "+player.gold+" | "+player.weapon.name+(player.weapon.enhance>0?" +"+player.weapon.enhance:"")+" | Relics: "+relicList();
 retryButton.classList.toggle("hidden",state!=="gameover");
 endOverlay.classList.remove("hidden");
 persist(state==="win"?"victorious":"fallen"); // snapshot preserved either way
}
function toTitle(){
 stopAuto();clearHold();closeShop();closeStats();closeSaves();
 state="title";player=null;
 endOverlay.classList.add("hidden");hudEl.classList.add("hidden");classOverlay.classList.remove("hidden");
 updateTitleInfo();
 render();
}

// ---------- Hold-to-walk (speed-scaled) ----------
const MOVE_CMDS=["w","k","8","n","s","j","2","a","h","4","d","l","6","e"];
function isMoveCmd(c){return MOVE_CMDS.includes(c);}
let holdTimeout=null,holdInterval=null,heldCmd=null;
function clearHold(){
 if(holdTimeout){clearTimeout(holdTimeout);holdTimeout=null;}
 if(holdInterval){clearInterval(holdInterval);holdInterval=null;}
 heldCmd=null;
}
function beginHold(cmd){
 clearHold();
 heldCmd=cmd;
 holdTimeout=setTimeout(()=>{
  holdInterval=setInterval(()=>{
   if(state==="play"&&!shopOpen&&!statOpen&&!savesOpen&&!autoMode)doPlayerTurn(cmd);
   else clearHold();
  },150/speedMult);
 },300/speedMult);
}
window.addEventListener("blur",clearHold);

// ---------- Speed ----------
function applySpeed(){
 document.body.classList.toggle("sp3",speedMult===3);
 document.body.classList.toggle("sp5",speedMult===5);
 if(autoTimer){clearInterval(autoTimer);autoTimer=setInterval(autoTick,170/speedMult);}
 if(heldCmd){const c=heldCmd;beginHold(c);}
}
speedButton.addEventListener("click",()=>{
 speedMult=SPEEDS[(SPEEDS.indexOf(speedMult)+1)%SPEEDS.length];
 speedButton.textContent="⏩ "+speedMult+"x";
 applySpeed();
});

// ---------- Auto-play ----------
function autoTick(){
 if(state!=="play"){stopAuto();return;}
 if(shopOpen)autoShop();
 else{autoSpend();doPlayerTurn(autoCommand());}
}
function startAuto(){
 if(state==="title")startGame(1);
 clearHold();closeSaves();
 autoMode=true;autoButton.textContent=" Stop Auto-Play";
 autoTimer=setInterval(autoTick,170/speedMult);
}
function stopAuto(){if(autoTimer){clearInterval(autoTimer);autoTimer=null;}autoMode=false;autoButton.textContent="▶ Auto-Play Demo";}

function mapKeyToCommand(key){
 const k=key.toLowerCase();
 const al={arrowup:"w",arrowdown:"s",arrowleft:"a",arrowright:"d"," ":"."};
 if(al[k])return al[k];
 const v=["w","k","8","n","s","j","2","a","h","4","d","l","6","e",".","5","x","q","f","b",">"];
 return v.includes(k)?k:null;
}

// ---------- Mouse ----------
boardEl.addEventListener("click",(e)=>{
 const cellEl=e.target.closest(".cell");
 if(!cellEl||state!=="play"||shopOpen||statOpen||savesOpen||autoMode)return;
 const idx=Array.prototype.indexOf.call(boardEl.children,cellEl);
 if(idx<0)return;
 const x=idx%WIDTH+1,y=Math.floor(idx/WIDTH)+1;
 const d=dist(player.x,player.y,x,y);
 const enemy=enemyAt(x,y);
 if(enemy){
  if(d===1){doPlayerTurn(()=>{playerAttack(enemy);return true;});}
  else if(player.classIndex===3&&player.abilityUses>0&&d<=8){doPlayerTurn(()=>useAbility(enemy));}
  else{addLog("Too far to strike.","miss");render();}
  return;
 }
 if(d===1){const dx=x-player.x,dy=y-player.y;doPlayerTurn(()=>tryMove(dx,dy));}
});

document.addEventListener("keydown",(event)=>{
 if(event.repeat)return;
 const key=event.key.toLowerCase();

 if(savesOpen){
  event.preventDefault();
  if(key==="escape"||key==="enter")closeSaves();
  return;
 }
 if(shopOpen){
  event.preventDefault();
  if(key>="1"&&key<="9")tryBuyIndex(parseInt(key,10)-1);
  else if(key==="escape"||key==="enter"||key==="b"||key==="q"){closeShop();render();persist("run");}
  return;
 }
 if(statOpen){
  event.preventDefault();
  const stats=["str","dex","con","int"];
  if(key>="1"&&key<="4"){if(spendStatPoint(stats[parseInt(key,10)-1])){renderStats();render();}}
  else if(key==="escape"||key==="c"||key==="enter")closeStats();
  return;
 }
 if(state==="title"){if(key==="1"||key==="2"||key==="3")startGame(parseInt(key,10));return;}
 if(state!=="play"){if(key==="enter"||key===" "){event.preventDefault();toTitle();}return;}

 if(key==="c"){event.preventDefault();if(autoMode)stopAuto();openStats();return;}

 const cmd=mapKeyToCommand(key);
 if(cmd){
  event.preventDefault();
  if(autoMode)stopAuto();
  doPlayerTurn(cmd);
  if(isMoveCmd(cmd))beginHold(cmd);
 }
});
document.addEventListener("keyup",(event)=>{
 const cmd=mapKeyToCommand(event.key.toLowerCase());
 if(cmd&&cmd===heldCmd)clearHold();
});

document.querySelectorAll(".class-btn[data-class]").forEach(b=>b.addEventListener("click",()=>startGame(parseInt(b.dataset.class,10))));
continueButton.addEventListener("click",openSaves);
savesList.addEventListener("click",e=>{const b=e.target.closest(".shop-item");if(b&&b.dataset.slot)continueRun(b.dataset.slot);});
retryButton.addEventListener("click",()=>continueRun(activeSlot));
shopList.addEventListener("click",e=>{const b=e.target.closest(".shop-item");if(b&&!b.disabled)tryBuyIndex(parseInt(b.dataset.idx,10));});
statList.addEventListener("click",e=>{const b=e.target.closest(".shop-item");if(b&&!b.disabled&&spendStatPoint(b.dataset.stat)){renderStats();render();}});
document.getElementById("statButton").addEventListener("click",()=>{if(state==="play"&&!shopOpen){if(statOpen)closeStats();else{if(autoMode)stopAuto();openStats();}}});
autoButton.addEventListener("click",()=>(autoMode?stopAuto():startAuto()));
document.getElementById("restartButton").addEventListener("click",toTitle);
document.getElementById("playAgainButton").addEventListener("click",toTitle);

// ---------- Erase data: the ONLY wipe in the codebase ----------
let eraseArmed=false,eraseTimer=null;
eraseButton.addEventListener("click",()=>{
 if(!eraseArmed){
  eraseArmed=true;
  eraseButton.textContent="⚠ Confirm erase";
  eraseButton.classList.add("armed");
  eraseTimer=setTimeout(()=>{eraseArmed=false;eraseButton.textContent="🗑 Erase data";eraseButton.classList.remove("armed");},3000);
  return;
 }
 clearTimeout(eraseTimer);
 eraseArmed=false;eraseButton.textContent="🗑 Erase data";eraseButton.classList.remove("armed");
 try{localStorage.removeItem(SAVE_KEY);}catch(e){}
 meta={bestScore:0,deepestFloor:0,wins:0,runs:0};
 activeSlot=null;
 stopAuto();clearHold();closeShop();closeStats();closeSaves();
 state="title";player=null;
 endOverlay.classList.add("hidden");hudEl.classList.add("hidden");classOverlay.classList.remove("hidden");
 updateTitleInfo();render();
});

// ---------- Boot ----------
(function boot(){
 const saved=loadSave();
 if(saved&&saved.meta)meta=saved.meta;
 updateTitleInfo();
 render();
})();
