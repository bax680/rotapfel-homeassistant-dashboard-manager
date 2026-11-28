// Regression tests against the actual manager methods, without a browser.
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const source = readFileSync(new URL('../custom_components/rotapfel_dashboard_manager/frontend/rotapfel-manager.js', import.meta.url), 'utf8');
const start = source.indexOf('  cardPositions(');
const end = source.indexOf('  applyCardPlacement(', start);
assert.ok(start >= 0 && end > start, 'Geometry methods must be available');
const Geometry = vm.runInNewContext('(class Geometry {\n' + source.slice(start,end) + '\n})');
function fixture(cards=[], gap=0, width=400, height=300) {
  const room={id:'room',cards};
  const tab={id:'tab',rooms:[room]};
  const cv={width,height,gap,columns:12};
  const manager=new Geometry();
  Object.assign(manager,{layout:[tab],effectiveCanvas:()=>cv,design:()=>({width:1,height:80}),externalVariant:()=>null,idealCardDimensions:()=>({w:100,h:80})});
  return {manager,room,tab,cv,plan:(target=null,size=null)=>manager.planCardPlacement(room,{},size,target)};
}
const rect=p=>JSON.parse(JSON.stringify(p));
test('automatic insertion keeps minimum 8px even when canvas gap is zero',()=>{
  assert.deepEqual(rect(fixture().plan().position),{x:8,y:8,w:100,h:80});
});
test('larger configured insertion gap is respected',()=>{
  assert.deepEqual(rect(fixture([],16).plan().position),{x:16,y:16,w:100,h:80});
});
test('existing manually touching cards retain zero gap',()=>{
  const f=fixture([{position:{x:0,y:0,w:100,h:80}},{position:{x:100,y:0,w:100,h:80}}]);
  const p=f.manager.cardPositions(f.tab,f.cv);
  assert.equal(p[0].x+p[0].w,p[1].x);
});
test('insertion below existing card leaves 8px',()=>{
  const f=fixture([{position:{x:8,y:8,w:100,h:80}}]);
  assert.equal(f.plan().position.y,96);
  assert.equal(f.plan({x:116,y:8}).position.x,116);
  assert.equal(f.plan({x:115,y:8}),null);
});
test('insertion respects canvas edges',()=>{
  const f=fixture();
  assert.equal(f.plan({x:0,y:8}),null);
  assert.ok(f.plan({x:292,y:212}));
  assert.equal(f.plan({x:293,y:212}),null);
});
test('locked full canvas cannot be rearranged',()=>{
  const card={position:{x:0,y:0,w:400,h:300,editorLocked:true}};
  const before=rect(card);
  assert.equal(fixture([card]).plan(),null);
  assert.deepEqual(card,before);
});
test('saved positions are clamped without modifying stored card',()=>{
  const card={position:{x:390,y:-5,w:100,h:80,manualSize:true}};
  const f=fixture([card]);
  const p=f.manager.cardPositions(f.tab,f.cv)[0];
  assert.equal(p.x,300);assert.equal(p.y,0);
  assert.equal(card.position.x,390);
});
test('placement is isolated to selected room',()=>{
  const f=fixture();
  f.tab.rooms.push({id:'other',cards:[{position:{x:0,y:0,w:400,h:300}}]});
  assert.equal(f.plan().position.x,8);
});

test('rectangle clearance permits touching edges at zero gap',()=>{
  const g=fixture().manager,a={x:0,y:0,w:100,h:80};
  assert.equal(g.rectanglesClear(a,{x:100,y:0,w:100,h:80}),true);
  assert.equal(g.rectanglesClear(a,{x:99,y:0,w:100,h:80}),false);
  assert.equal(g.rectanglesClear(a,{x:0,y:80,w:100,h:80}),true);
});
test('rectangle clearance is symmetric and respects requested gap',()=>{
  const g=fixture().manager,a={x:0,y:0,w:100,h:80},b={x:108,y:0,w:100,h:80};
  assert.equal(g.rectanglesClear(a,b,8),true);
  assert.equal(g.rectanglesClear(b,a,8),true);
  assert.equal(g.rectanglesClear(a,b,9),false);
});

test('overlap depth preserves one pixel technical tolerance',()=>{
  const g=fixture().manager,a={x:0,y:0,w:100,h:80};
  for(const x of [100,99])assert.equal(g.rectanglesOverlap(a,{x,y:0,w:100,h:80}),false);
  assert.equal(g.rectanglesOverlap(a,{x:98,y:0,w:100,h:80}),true);
  assert.equal(g.rectanglesOverlap(a,{x:98,y:79,w:100,h:80}),false);
  assert.equal(g.rectanglesOverlap(a,{x:99,y:0,w:100,h:80},0),true);
});

test('edge intersection preserves layer and alignment policies',()=>{
  const g=fixture().manager,a={x:0,y:0,w:100,h:80};
  assert.equal(g.rectanglesIntersect(a,{x:100,y:0,w:100,h:80}),false);
  assert.equal(g.rectanglesIntersect(a,{x:99,y:0,w:100,h:80}),true);
  assert.equal(g.rectanglesIntersect(a,{x:99,y:0,w:100,h:80},1),false);
  assert.equal(g.rectanglesIntersect(a,{x:98,y:0,w:100,h:80},1),true);
  const tiny={x:20,y:20,w:1,h:1};
  assert.equal(g.rectanglesIntersect(a,tiny,1),true);
  assert.equal(g.rectanglesOverlap(a,tiny,1),false);
});

test('automatic and manual spacing policies remain independent',()=>{
  const g=fixture().manager;
  for(const value of [0,undefined,-4,4,'invalid'])assert.equal(g.insertionGap(value),8);
  assert.equal(g.insertionGap(12),12);
  assert.equal(g.manualDistributionGap(0),0);
  assert.equal(g.manualDistributionGap(-4),0);
  assert.equal(g.manualDistributionGap('12.4'),12);
  assert.equal(g.manualDistributionGap(250),200);
});

test('special pair spacing and collision tolerance remain independent',()=>{
  const g=fixture().manager;
  assert.equal(g.pairDistributionGap(),12);
  assert.equal(g.collisionTolerance(),1);
  assert.equal(g.insertionGap(0),8);
  assert.equal(g.manualDistributionGap(0),0);
});

test('frame sizing retains width reserve, minimum height and rounding',()=>{
  const g=fixture().manager;
  assert.equal(g.availableCardWidth(400),376);
  assert.equal(g.availableCardWidth(90),76);
  assert.equal(g.minimumFrameHeight(40),60);
  assert.equal(g.minimumFrameHeight(81),81);
  assert.equal(g.proportionalFrameHeight(215,430,280),140);
  assert.equal(g.proportionalFrameHeight(100,430,280),65);
  assert.equal(g.proportionalFrameHeight(20,430,280),60);
});

test('frame width minimum is independent of available width reserve',()=>{
  const g=fixture().manager;
  assert.equal(g.minimumFrameWidth(50),76);
  assert.equal(g.minimumFrameWidth(76),76);
  assert.equal(g.minimumFrameWidth(100),100);
  assert.equal(g.availableCardWidth(100),76);
  assert.equal(g.availableCardWidth(101),77);
});

test('automatic insertion respects position locks, groups and device layouts',()=>{
  const g=fixture().manager;
  assert.equal(g.canAutomaticallyMoveForInsertion({}),true);
  for(const card of [{position:{editorLocked:true}},{position:{manualPosition:true}},{groupId:'group'},{deviceLayouts:{phone:{x:10}}}])assert.equal(g.canAutomaticallyMoveForInsertion(card),false);
  assert.equal(g.canAutomaticallyMoveForInsertion({position:{manualSize:true}}),true);
});
test('automatic frame fitting respects size and layout locks',()=>{
  const g=fixture().manager;
  assert.equal(g.canAutomaticallyFitFrame({}),true);
  assert.equal(g.canAutomaticallyFitFrame({position:{manualSize:true}}),false);
  assert.equal(g.canAutomaticallyFitFrame({position:{manualSize:true}},true),true);
  assert.equal(g.canAutomaticallyFitFrame({position:{editorLocked:true}},true),false);
});

test('automatic collision blockers respect manual position and layout locks',()=>{
  const g=fixture().manager;
  for(const card of [{position:{editorLocked:true}},{position:{manualPosition:true}},{groupId:'g'}])assert.equal(g.canAutomaticallyMoveBlocker(card),false);
  assert.equal(g.canAutomaticallyMoveBlocker({position:{manualSize:true}}),true);
});
test('insertion fallback moves only unprotected cards without mutating the source',()=>{
  const card={position:{x:8,y:0,w:280,h:300}};
  const plan=fixture([card]).plan();
  assert.equal(plan.moves.length,1);
  assert.equal(plan.moves[0].x,116);
  assert.equal(card.position.x,8);
  for(const extra of [{position:{...card.position,manualPosition:true}},{position:{...card.position,editorLocked:true}},{groupId:'g'},{deviceLayouts:{iphone:{x:8}}}])assert.equal(fixture([{...card,...extra}]).plan(),null);
});

const profileStart=source.indexOf('  switchDeviceLayoutProfile(');
const profileEnd=source.indexOf('  canvasDialog(',profileStart);
assert.ok(profileStart>=0&&profileEnd>profileStart);
const ProfileManager=vm.runInNewContext('(class ProfileManager {\n'+source.slice(profileStart,profileEnd)+'\n})');
test('device profile switching preserves independent positions, sizes and locks',()=>{
  const original={x:120,y:100,w:300,h:200,manualSize:true,manualPosition:true,editorLocked:true};
  const card={position:{...original}};
  const manager=new ProfileManager();
  Object.assign(manager,{_deviceLayoutProfile:'fire_hd',eachLayoutCard:fn=>fn(card),render:()=>{}});
  manager.switchDeviceLayoutProfile('iphone');
  assert.equal(card.position.manualSize,true);
  assert.equal(card.position.manualPosition,true);
  assert.equal(card.position.editorLocked,true);
  card.position.x=20;
  const phone=rect(card.position);
  manager.switchDeviceLayoutProfile('fire_hd');
  assert.deepEqual(rect(card.position),original);
  card.position.x=150;
  manager.switchDeviceLayoutProfile('iphone');
  assert.deepEqual(rect(card.position),phone);
  assert.equal(card.deviceLayouts.fire_hd.x,150);
  assert.notEqual(card.position,card.deviceLayouts.iphone);
});
