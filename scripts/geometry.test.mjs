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
