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
  Object.assign(manager,{_deviceLayoutProfile:'fire_hd',eachLayoutCard:fn=>fn(card),render:()=>{},normalizedProfiles:()=>({fire_hd:{width:1920,height:1080},iphone:{width:402,height:874},desktop:{width:1920,height:1080}})});
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

test('interactive pushing permits previously positioned cards but respects layout locks and groups',()=>{
  const g=fixture().manager;
  assert.equal(g.canAutomaticallyMoveBlocker({position:{manualPosition:true}},true),true);
  assert.equal(g.canAutomaticallyMoveBlocker({position:{manualPosition:true}}),false);
  assert.equal(g.canAutomaticallyMoveBlocker({position:{editorLocked:true}},true),true);
  assert.equal(g.canAutomaticallyMoveBlocker({groupId:'g'},true),false);
  assert.equal(g.canAutomaticallyMoveBlocker({position:{manualSize:true}},true),true);
});

const resourceStart=source.indexOf('  async ensureGenericCustomResource(');
const resourceEnd=source.indexOf('  mountThermPreview(',resourceStart);
assert.ok(resourceStart>=0&&resourceEnd>resourceStart);
function resourceFixture(failAll=false){
  let registered=false;
  const attempts=[];
  const ResourceManager=vm.runInNewContext('(class ResourceManager {\n'+source.slice(resourceStart,resourceEnd)+'\n})',{customElements:{get:()=>registered}});
  const manager=new ResourceManager();
  Object.assign(manager,{_hass:{callWS:async()=>[{url:'/local/test-first.js'},{url:'/local/test-second.js'}]},resourceTags:()=>({}),manualResources:()=>({}),readResources:()=>({}),validResourceUrl:url=>typeof url==='string'&&url.startsWith('/local/'),t:(de,en)=>en,loadCustomResourceModule:async url=>{attempts.push(url);if(failAll||url.includes('first'))throw Error('offline');registered=true;}});
  return {manager,attempts};
}
test('custom resource discovery continues after a failed candidate',async()=>{
  const {manager,attempts}=resourceFixture();
  assert.equal(await manager.ensureGenericCustomResource('test-card'),true);
  assert.deepEqual(attempts,['/local/test-first.js','/local/test-second.js']);
});
test('custom resource discovery reports failed candidates',async()=>{
  const {manager,attempts}=resourceFixture(true);
  await assert.rejects(manager.ensureGenericCustomResource('test-card'),/test-first.*test-second/);
  assert.equal(attempts.length,2);
});

const transferStart=source.indexOf('  transferCard(');
const transferEnd=source.indexOf('  openCardTransferDialog(',transferStart);
assert.ok(transferStart>=0&&transferEnd>transferStart);
const TransferManager=vm.runInNewContext('(class TransferManager {\n'+source.slice(transferStart,transferEnd)+'\n})');
function transferFixture(){
  const manager=new TransferManager();
  Object.assign(manager,{uid:()=> 'copy-id',t:(de,en)=>en});
  const card={id:'original',title:'Test',groupId:'g',custom_config:{type:'custom:test-card',entities:[{entity:'sensor.test'}]},position:{x:8,y:12,w:100,h:80},deviceLayouts:{iphone:{x:4,y:6,w:90,h:70}}};
  return {manager,card,from:{cards:[card]},to:{cards:[]}};
}
test('copy preserves configuration and profile geometry without sharing objects',()=>{
  const {manager,card,from,to}=transferFixture();
  const copy=manager.transferCard(from,to,card,'copy');
  assert.equal(copy.id,'copy-id');
  assert.equal(copy.groupId,undefined);
  assert.equal(card.groupId,'g');
  assert.deepEqual(rect(copy.custom_config),card.custom_config);
  assert.deepEqual(rect(copy.deviceLayouts),card.deviceLayouts);
  copy.deviceLayouts.iphone.x=99;
  assert.equal(card.deviceLayouts.iphone.x,4);
  assert.equal(from.cards.length,1);
  assert.equal(to.cards[0],copy);
});
test('move retains identity and geometry and removes room group',()=>{
  const {manager,card,from,to}=transferFixture();
  const before=rect(card.position);
  assert.equal(manager.transferCard(from,to,card,'move'),card);
  assert.equal(from.cards.length,0);
  assert.equal(to.cards[0],card);
  assert.equal(card.groupId,undefined);
  assert.deepEqual(card.position,before);
});
test('invalid transfers leave both rooms unchanged',()=>{
  const {manager,card,from,to}=transferFixture();
  assert.equal(manager.transferCard(from,to,{id:'missing'},'move'),null);
  assert.equal(manager.transferCard(from,from,card,'move'),null);
  assert.equal(manager.transferCard(from,to,card,'invalid'),null);
  assert.equal(from.cards[0],card);
  assert.equal(to.cards.length,0);
  assert.equal(card.groupId,'g');
});
test('same-room copy retains original and adds independent card',()=>{
  const {manager,card,from}=transferFixture();
  const copy=manager.transferCard(from,from,card,'copy');
  assert.equal(from.cards.length,2);
  assert.equal(from.cards[0],card);
  assert.equal(from.cards[1],copy);
});

test('mobile initialization uses configured base dimensions and rejects unknown profiles',()=>{
  const card={position:{x:200,y:100,w:400,h:200}};
  const manager=new ProfileManager();
  Object.assign(manager,{eachLayoutCard:fn=>fn(card),render:()=>{},normalizedProfiles:()=>({fire_hd:{width:1000,height:500},iphone:{width:402,height:874}})});
  manager.switchDeviceLayoutProfile('unknown');
  assert.equal(card.deviceLayouts,undefined);
  manager.switchDeviceLayoutProfile('iphone');
  assert.equal(card.position.x,80);
  assert.equal(card.position.y,175);
  assert.equal(card.position.w,161);
  assert.equal(card.position.h,350);
});
const libraryStart=source.indexOf('  libraryCardData(');
const libraryEnd=source.indexOf('  async saveCardToLibrary(',libraryStart);
const LibraryManager=vm.runInNewContext('(class LibraryManager {\n'+source.slice(libraryStart,libraryEnd)+'\n})');
test('library templates preserve nested configuration but detach placement and identity',()=>{
  const card={id:'a',groupId:'g',position:{x:2},deviceLayouts:{iphone:{x:4}},custom_config:{type:'custom:test-card',entities:[{entity:'sensor.test',name:'Original'}]}};
  const template=new LibraryManager().libraryCardData(card);
  for(const key of ['id','groupId','position','deviceLayouts'])assert.equal(template[key],undefined);
  assert.deepEqual(rect(template.custom_config),card.custom_config);
  template.custom_config.entities[0].name='Changed';
  assert.equal(card.custom_config.entities[0].name,'Original');
});

const navStart=source.indexOf('  presentationFor(');
const navEnd=source.indexOf('  presentationDialog(',navStart);
const NavManager=vm.runInNewContext('(class NavManager {\n'+source.slice(navStart,navEnd)+'\n})');
test('navigation preserves routes and falls back from whitespace labels',()=>{
  const manager=new NavManager();
  Object.assign(manager,{backgroundFor:()=>({}),tabRoute:t=>t.id,t:(de,en)=>en});
  const tabs=[{id:'a',name:'Living',navigationLabel:'   '},{id:'b',name:'Kitchen',navigationLabel:' Cooking '}];
  const result=manager.presentationFor({tabs,canvas:{presentation:{navigation:'bar',navigationPosition:'bottom'}}},tabs[1],new Map([['a','living'],['b','kitchen']]));
  assert.equal(result.tabs[0].label,'Living');
  assert.equal(result.tabs[1].label,'Cooking');
  assert.equal(result.path,'kitchen');
  assert.equal(result.navigationPosition,'bottom');
});
const canvasSource=readFileSync(new URL('../custom_components/rotapfel_dashboard_manager/frontend/rotapfel-canvas-card.js',import.meta.url),'utf8');
test('published navigation uses path fallback for blank labels',()=>{
  const start=canvasSource.indexOf('function renderRotapfelNavigation(');
  const end=canvasSource.indexOf('class RotapfelCanvasCard',start);
  const node=()=>({dataset:{},children:[],toggleAttribute(){},setAttribute(){},append(child){this.children.push(child)},get childElementCount(){return this.children.length}});
  const render=vm.runInNewContext('('+canvasSource.slice(start,end).trim()+')',{URL,location:{href:'https://example.test/dashboard/a'},document:{createElement:node},styleRotapfelTabs:()=>{}});
  const nav=render({kiosk:true,navigation:'bar',navigationPosition:'right',path:'a',tabs:[{path:'a',label:'  '},{path:'b',label:'Kitchen'}]},{preview:true});
  assert.equal(nav.dataset.position,'right');
  assert.equal(nav.children[0].textContent,'a');
  assert.equal(nav.children[1].textContent,'Kitchen');
});

test('interactive displacement repeatedly permits locked individual cards without clearing flags',()=>{
  const g=fixture().manager;
  const card={position:{editorLocked:true,manualPosition:true,manualSize:true,x:0,w:100}};
  for(let i=0;i<3;i++){assert.equal(g.canAutomaticallyMoveBlocker(card,true),true);card.position.x+=100;}
  assert.equal(card.position.editorLocked,true);
  assert.equal(card.position.manualPosition,true);
  assert.equal(card.position.manualSize,true);
  assert.equal(g.canAutomaticallyMoveForInsertion(card),false);
  assert.equal(g.canArrangePosition(card),false);
  assert.equal(g.canArrangePosition(card,true),true);
});

test('direct tab destination is created without mutating empty tab before transfer',()=>{
  const manager=new TransferManager();manager.t=(de,en)=>en;manager.uid=()=> 'new';
  const tab={id:'empty',rooms:[]},card={id:'a',position:{x:20,y:30,w:100,h:80}},from={cards:[card]};
  const room=manager.transferDestination(tab,'empty-direct');
  assert.equal(tab.rooms.length,0);
  assert.equal(manager.transferDestination(tab,'invalid'),null);
  assert.equal(manager.transferCard(from,room,card,'move'),card);
  tab.rooms.push(room);
  assert.equal(tab.rooms[0].cards[0],card);
  assert.equal(manager.transferDestination(tab,'empty-direct'),room);
});
test('position update moves locked card repeatedly without resizing or clearing locks',()=>{
  const start=source.indexOf('const update=(c,q,manual=true,positionOnly=false)');
  const end=source.indexOf('// Apply a single atomic batch resize',start);
  const card={id:'a',position:{x:0,y:0,w:100,h:80,editorLocked:true,manualPosition:true,manualSize:true}};
  const positions=new Map([['a',{x:0,y:0,w:100,h:80}]]);
  const update=vm.runInNewContext('(function(){'+source.slice(start,end)+'return update;}).call(manager)',{manager:{minimumFrameHeight:v=>Math.max(60,v)},positions,isEditorLocked:c=>c.position.editorLocked,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),width:1000,overlay:{querySelectorAll:()=>[]},refreshCanvasHeight(){},fitPositionCards(){},active:null});
  for(const x of [100,200,300])update(card,{x,y:0,w:200,h:200},false,true);
  assert.deepEqual(rect(card.position),{x:300,y:0,w:100,h:80,editorLocked:true,manualPosition:true,manualSize:true});
});
test('automatic arrangement reserves locked cards unless override is enabled',()=>{
  const start=source.indexOf('const planAutoLayout=()=>');
  const end=source.indexOf('const applyAutoLayout=',start);
  const a={id:'a',position:{editorLocked:true}},b={id:'b',position:{}};
  const positions=new Map([['a',{x:12,y:12,w:100,h:80}],['b',{x:200,y:12,w:100,h:80}]]);
  const manager=fixture().manager;manager.cardKind=()=> 'test';
  for(const ignore of [false,true]){
    const plan=vm.runInNewContext('(function(){'+source.slice(start,end)+'return planAutoLayout();}).call(manager)',{manager,cards:[{c:a},{c:b}],positions,width:500,height:300,dynamicHeight:false,ignorePositionLocks:()=>ignore,overlay:{querySelector:()=>({value:'keep'})}});
    assert.ok(plan);assert.equal(plan.has('a'),ignore);assert.ok(plan.has('b'));
    assert.ok(manager.rectanglesClear(plan.get('a')||positions.get('a'),plan.get('b'),12));
  }
});
