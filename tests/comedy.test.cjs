// Optional developer tests: node --test tests/comedy.test.cjs
// The real game logic runs in isolation; only DOM, storage and rendering are stubbed.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const source = readFileSync(join(__dirname, '../game.js'), 'utf8').split('function createRenderer(){')[0];
function game() {
  const element = () => ({ hidden: true, dataset: {}, classList: { toggle() {} },
    setAttribute() {}, focus() {}, replaceChildren() {}, append() {} });
  const context = vm.createContext({ document: { body: element(), getElementById: element,
    createElement: element }, localStorage: { getItem() { return null; }, setItem() {} } });
  const run = code => vm.runInContext(code, context);
  run(source);
  run(`renderer={rebuild(){}};sound=false;Arcade.start();
    Arcade.state.comedy.eligible=false;Arcade.state.enemies=[];Arcade.state.pickups=[];
    Arcade.state.spawnIn=999;Arcade.state.obstacleIn=999;Arcade.state.charlineIn=999;`);
  return { run, step(n) { run(`for(let i=0;i<${n};i++)Arcade.update(1/90);`); } };
}
test('three actual misses trigger a reaction; resolved shots do not accumulate', () => {
  const g = game();
  for (let i=0; i<3; i++) { g.run('Arcade.fire()'); g.step(255); }
  assert.equal(g.run('Arcade.state.comedy.line'), 'Je vais plutôt organiser un point.');
  assert.equal(g.run('Arcade.state.comedy.shots.length'), 0);
});
test('a projectile that hits an employee breaks the miss streak', () => {
  const g = game();
  g.run(`const s=Arcade.state;s.comedy.misses=2;
    s.enemies=[{kind:'hugo',type:'junior',floor:0,x:-6.8,y:surface(0,-6.8),lo:-10,hi:10,
    direction:1,speed:0,stun:0,cooldown:99,walk:0,rewarded:false}];Arcade.fire();`);
  g.step(40);
  assert.equal(g.run('s.comedy.misses'), 0);
  assert.equal(g.run('s.comedy.line'), '');
  assert.ok(g.run('s.enemies[0].stun') > 0);
});
test('a normal jump is not a fall; a long drop triggers the mobility line', () => {
  const g = game();
  g.run(`Arcade.press('jump',true)`); g.step(100); g.run(`Arcade.press('jump',false)`);
  assert.equal(g.run('Arcade.state.comedy.line'), '');
  g.run(`const p=Arcade.state.player;p.floor=0;p.y=2.55;p.fallPeak=2.55;p.vy=-1;p.grounded=false;`);
  g.step(65);
  assert.equal(g.run('Arcade.state.comedy.line'), 'Mobilité interne validée.');
});
test('the refusal scene waits for the player, runs in order and respects pause', () => {
  const g = game();
  g.run('Arcade.state.levelTime=5;Arcade.spawnBarrel()');
  assert.equal(g.run('Arcade.state.comedy.delivery'), 0);
  g.run(`const s=Arcade.state;s.barrels=[];s.player.floor=3;s.player.x=-7;
    s.player.y=surface(3,-7);s.player.invulnerable=100;`);
  g.step(1);
  assert.equal(g.run('deliveryScene(s.comedy.delivery).stage'), 'request');
  g.step(230);
  assert.equal(g.run('deliveryScene(s.comedy.delivery).stage'), 'refusal');
  const before=g.run('s.comedy.delivery');g.run('Arcade.pause()');g.step(300);
  assert.equal(g.run('s.comedy.delivery'), before);
  g.run('Arcade.pause()');g.step(270);
  assert.equal(g.run('deliveryScene(s.comedy.delivery).stage'), 'order');
  g.step(225);
  assert.equal(g.run('deliveryScene(s.comedy.delivery).stage'), 'delivery');
  g.step(400);
  assert.equal(g.run('s.comedy.delivery'), 0);
  g.step(90);assert.equal(g.run('s.comedy.delivery'), 0);
  g.run('Arcade.start()');assert.equal(g.run('Arcade.state.comedy.delivered'), false);
});
test('the miracle freezes combat and bonuses, respects pause, resumes and cannot repeat', () => {
  const g = game();
  g.run(`const s=Arcade.state;s.enemies=[{kind:'hugo',type:'junior',floor:0,x:-6.8,
    y:surface(0,-6.8),lo:-10,hi:10,direction:1,speed:1,stun:0,cooldown:2,walk:0}];
    s.comedy.eligible=true;s.comedy.miracleAt=0;s.coffee=5;Arcade.spawnBarrel();Arcade.fire();
    const snapshot=()=>JSON.stringify({time:s.time,player:s.player,barrels:s.barrels,
    papers:s.papers,coffee:s.coffee,enemies:s.enemies.map(({raise,...rest})=>rest)});
    const before=snapshot();`);
  g.step(60);
  assert.equal(g.run('snapshot()'), g.run('before'));
  assert.equal(g.run('s.enemies[0].raise'), 3);
  const remaining = g.run('s.comedy.miracle');
  g.run('Arcade.pause()'); g.step(120);
  assert.equal(g.run('s.comedy.miracle'), remaining);
  g.run('Arcade.pause()'); g.step(130);
  assert.equal(g.run('s.comedy.miracle'), 0);
  assert.ok(g.run('s.time') > 0);
  assert.equal(g.run('s.enemies[0].raise'), 3);
  g.run(`s.enemies=[];s.hostile=[];s.barrels=[];s.player.floor=4;s.player.x=s.princess.x;
    s.player.y=s.princess.y;s.player.grounded=true;s.player.invulnerable=100;`);
  g.step(290);
  assert.equal(g.run('Arcade.state.level'), 1);
  assert.equal(g.run('Arcade.state.comedy.miracleSeen'), true);
});
test('the miracle does not interrupt the boss or involve an offscreen distant employee', () => {
  const g = game();
  g.run(`const s=Arcade.state;s.comedy.eligible=true;s.comedy.miracleAt=0;
    s.enemies=[{kind:'hugo',type:'junior',floor:0,x:5,y:surface(0,5),lo:-10,hi:10,
    direction:1,speed:0,stun:0,cooldown:99,walk:0}];`);
  g.step(1); assert.equal(g.run('s.comedy.miracleSeen'), false);
  g.run('s.enemies[0].x=-6.8;s.boss.active=true');
  g.step(1); assert.equal(g.run('s.comedy.miracleSeen'), false);
});

test('descending a ladder is not reported as a fall', () => {
  const g = game();
  g.run(`const s=Arcade.state,l=s.ladders[0];s.player.x=l.x;s.player.y=l.top;
    s.player.floor=1;s.player.grounded=true;s.player.fallPeak=l.top;Arcade.press('down',true);`);
  g.step(140);
  assert.equal(g.run('s.player.floor'), 0);
  assert.equal(g.run('s.comedy.line'), '');
});
test('stun captions vary on subsequent hits and stay stable during the same stun', () => {
  const g = game();
  g.run(`const s=Arcade.state,e={kind:'hugo',type:'junior',floor:0,x:-6.8,
    y:surface(0,-6.8),lo:-10,hi:10,direction:1,speed:0,stun:0,cooldown:99,walk:0,rewarded:false};s.enemies=[e];`);
  let previous;
  for (let i=0; i<6; i++) {
    g.run('e.stun=0;s.player.shootIn=0;Arcade.fire()');
    g.step(35);
    const caption = g.run('STUN_MESSAGES[e.stunLine]');
    assert.equal(typeof caption, 'string');
    assert.notEqual(caption, previous);
    g.step(20);
    assert.equal(g.run('STUN_MESSAGES[e.stunLine]'), caption);
    previous = caption;
  }
});
