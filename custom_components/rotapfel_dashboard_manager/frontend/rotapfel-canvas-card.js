// Rotapfel Lovelace renderer — does not modify existing dashboards.
const rotapfelHex=(v,fallback)=>/^#[0-9a-f]{6}$/i.test(v||'')?v:fallback;
const rotapfelNumber=(v,lo,hi,def)=>{const n=Number(v);return Number.isFinite(n)?Math.min(hi,Math.max(lo,n)):def;};
const rotapfelEscape=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const rotapfelCardLanguage=(hass)=>{
  let override;
  if(hass?.user?.id){
    try{override=localStorage.getItem('rotapfel-language:'+hass.user.id);}catch{}
  }
  if(override==='en'||override==='de')return override;
  const profileLanguage = hass?.selectedLanguage;
  if (profileLanguage) return /^de(?:[-_]|$)/i.test(profileLanguage) ? 'de' : 'en';
  const country=String(hass?.config?.country||'').trim().toUpperCase();
  if(country)return ['DE','AT','CH'].includes(country)?'de':'en';
  return /^de(?:[-_]|$)/i.test(navigator.language)?'de':'en';
};
class RotapfelEntityCard extends HTMLElement {
  setConfig(config){
    if(!config||!config.entity)throw new Error(rotapfelCardLanguage(this._hass)==='de'?'Rotapfel-Entitätskarte benötigt entity':'Rotapfel entity card requires entity');
    this._config=structuredClone(config);
    if(!this.shadowRoot)this.attachShadow({mode:'open'});
    this._render();
  }
  set hass(hass){this._hass=hass;if(this._config)this._render();}
  getCardSize(){return 2;}
  _render(){
    const c=this._config,d=c.design||{},disp=c.display||{},entity=c.entity;
    const german=rotapfelCardLanguage(this._hass)==='de';
    const on=german?'Ein':'On',off=german?'Aus':'Off';
    const state=this._hass?.states?.[entity],domain=entity.split('.')[0],raw=state?.state??'unavailable';
    const unavailable=!state||['unavailable','unknown'].includes(raw);
    const deviceClass=state?.attributes?.device_class;
    let value=raw;
    if(['light','switch','input_boolean'].includes(domain))value=raw==='on'?on:raw==='off'?off:raw;
    else if(domain==='binary_sensor'&&['window','door','opening','garage_door'].includes(deviceClass))value=raw==='off'?(german?'Geschlossen':'Closed'):raw==='on'?(german?'Offen':'Open'):raw;
    else if(domain==='sensor'&&state?.attributes?.unit_of_measurement)value=raw+' '+state.attributes.unit_of_measurement;
    const icon={light:'💡',switch:'⏻',input_boolean:'⏻',binary_sensor:'▣',sensor:'◉',climate:'♨',cover:'▤'}[domain]||'◈';
    const bg=rotapfelHex(d.bg,'#e5e7eb'),fg=rotapfelHex(d.fg,'#202124'),accent=rotapfelHex(d.accent,'#009ac4');
    const opacity=rotapfelNumber(d.opacity,0,100,100)/100;
    const rgb=[1,3,5].map(i=>parseInt(bg.slice(i,i+2),16));
    const radius=rotapfelNumber(d.radius,0,48,12),border=rotapfelNumber(d.border_width,0,12,0);
    const borderColor=rotapfelHex(d.border_color,'#64748b');
    const shadow=d.shadow==='strong'?'0 12px 26px #0006':d.shadow==='soft'?'0 4px 12px #0003':'none';
    const fontSize=rotapfelNumber(d.font_size,10,32,14),align=['left','center','right'].includes(d.text_align)?d.text_align:'left';
    const toggle=['light','switch','input_boolean'].includes(domain)&&['on','off'].includes(raw);
    const name=disp.show_name!==false?`<strong>${rotapfelEscape(c.name||entity)}</strong>`:'';
    const id=disp.show_entity_id===true?`<small>${rotapfelEscape(entity)}</small>`:'';
    const root=this.shadowRoot;
    root.innerHTML=`<style>
      :host{display:block;width:100%;height:100%;box-sizing:border-box}
      .card{box-sizing:border-box;width:100%;height:100%;min-height:70px;display:flex;align-items:center;gap:12px;padding:14px;overflow:hidden;
        background:rgba(${rgb.join(',')},${opacity});color:${fg};border:${border}px solid ${borderColor};border-radius:${radius}px;
        box-shadow:${shadow};font-size:${fontSize}px;text-align:${align};font-family:var(--primary-font-family,Arial,sans-serif)}
      .icon{flex:none;font-size:1.5em}.content{min-width:0;flex:1;display:flex;flex-direction:column;gap:4px;overflow:hidden}
      strong,small,.state{overflow-wrap:anywhere}small{font-size:.75em;opacity:.8}.state{font-weight:600}
      button{border:0;border-radius:8px;background:${accent};color:white;padding:9px 12px;cursor:pointer;flex:none;font:inherit}
      button:disabled{opacity:.5;cursor:default}
    </style><div class="card"><span class="icon" aria-hidden="true">${icon}</span><div class="content">${name}${id}<span class="state">${rotapfelEscape(value)}</span></div>${toggle?`<button type="button" aria-label="${raw==='on'?(german?'Ausschalten':'Turn off'):(german?'Einschalten':'Turn on')}">${raw==='on'?on:off}</button>`:''}</div>`;
    const btn=root.querySelector('button');if(btn)btn.onclick=async()=>{
      if(!this._hass?.callService)return;
      btn.disabled=true;
      try{await this._hass.callService(domain,raw==='on'?'turn_off':'turn_on',{entity_id:entity});}
      catch(e){console.error('Rotapfel: Schalten fehlgeschlagen',e);btn.disabled=false;}
    };
  }
}
if(!customElements.get('rotapfel-entity-card'))customElements.define('rotapfel-entity-card',RotapfelEntityCard);

class RotapfelLabelCard extends HTMLElement {
  setConfig(config){
    const root=this.shadowRoot||this.attachShadow({mode:'open'});
    const d=config.design||{};
    const bg=rotapfelHex(d.bg,'#e5e7eb');
    const rgb=[1,3,5].map(i=>parseInt(bg.slice(i,i+2),16));
    root.innerHTML=`<style>
      :host{box-sizing:border-box;width:100%;height:100%;display:grid;place-items:center;padding:8px;overflow:hidden;
        background:rgba(${rgb.join(',')},${rotapfelNumber(d.opacity,0,100,0)/100});color:${rotapfelHex(d.fg,'#202124')};
        border:${rotapfelNumber(d.border_width,0,12,0)}px solid ${rotapfelHex(d.border_color,'#64748b')};
        border-radius:${rotapfelNumber(d.radius,0,48,12)}px;font-size:${rotapfelNumber(d.font_size,10,32,18)}px;font-weight:700}
      span{white-space:pre-wrap;overflow-wrap:anywhere;text-align:center;max-width:100%;max-height:100%}
      .vertical{writing-mode:vertical-rl;transform:rotate(180deg)}
    </style><span class="${config.vertical===true?'vertical':''}"></span>`;
    root.querySelector('span').textContent=String(config.text??'');
  }
  getCardSize(){return 1;}
}
if(!customElements.get('rotapfel-label-card'))customElements.define('rotapfel-label-card',RotapfelLabelCard);

export const rotapfelNavigationCss=`
      .rotapfel-navigation-layout{position:relative;min-width:0;isolation:isolate}
      .rotapfel-navigation-surface{width:100%;min-width:0;overflow:clip}
      .rotapfel-navigation-layout>.rotapfel-tabs{position:absolute;z-index:10001;top:0;left:0;width:max-content;max-width:100%;box-sizing:border-box;background:var(--card-background-color);border-radius:8px}
      .rotapfel-navigation-layout>.rotapfel-tabs[data-position="center"]{left:50%;transform:translateX(-50%)}
      .rotapfel-navigation-layout>.rotapfel-tabs[data-position="bottom"]{top:auto;bottom:0;left:50%;transform:translateX(-50%)}
      .rotapfel-navigation-layout>.rotapfel-tabs:is([data-position="left"],[data-position="right"]){max-width:35%;flex-direction:column;flex-wrap:nowrap;align-items:stretch}
      .rotapfel-navigation-layout>.rotapfel-tabs[data-position="right"]{left:auto;right:0}
      .rotapfel-tabs :is(a,span){overflow-wrap:anywhere}

      .rotapfel-tabs{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding-block:8px}
      .rotapfel-tabs :is(a,span),.rotapfel-menu{box-sizing:border-box;padding:8px 12px;color:var(--primary-text-color);text-decoration:none;font:inherit}
      .rotapfel-tabs[data-mode="manager"] :is(a,span),.rotapfel-menu{border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color)}
      .rotapfel-tabs[data-mode="bar"]{border-bottom:1px solid var(--divider-color);gap:0}
      .rotapfel-tabs[data-mode="bar"] :is(a,span)[aria-current]{border-bottom:3px solid var(--primary-color)}
      .rotapfel-tabs[data-mode="buttons"] :is(a,span){border:1px solid var(--divider-color);border-radius:14px;background:var(--card-background-color)}
      .rotapfel-tabs :is(a,span)[aria-current]{font-weight:bold;color:var(--primary-color)}
      .rotapfel-room-tabs{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:4px 0;margin:0 0 12px}
      .rotapfel-room-tabs .rotapfel-tab-item{display:inline-block;box-sizing:border-box;font:inherit;cursor:pointer;
        text-align:center;padding:9px 14px;border:1px solid var(--divider-color,#bbb);border-radius:8px;
        background:var(--card-background-color,#fff);color:var(--primary-text-color,#222)}
      .rotapfel-room-tabs .rotapfel-tab-item[aria-current]{background:var(--primary-color,#03a9f4);color:var(--text-primary-color,#fff)}
      .rotapfel-tabs .rotapfel-tab-item,.rotapfel-room-tabs .rotapfel-tab-item{
        font-size:var(--rotapfel-tab-font-size,inherit)
      }
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-padding] .rotapfel-tab-item{
        padding:var(--rotapfel-tab-padding) calc(1.5 * var(--rotapfel-tab-padding))
      }
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-style="underline"] .rotapfel-tab-item{
        border:0;border-bottom:3px solid transparent;border-radius:0;background:transparent;color:var(--primary-text-color,#222)
      }
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-style="underline"] .rotapfel-tab-item[aria-current]{
        border-bottom-color:var(--rotapfel-tab-active-color,var(--primary-color));color:var(--primary-color)
      }
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-style="pill"] .rotapfel-tab-item{
        border:1px solid var(--divider-color,#bbb);border-radius:999px;
        background:var(--card-background-color,#fff);color:var(--primary-text-color,#222)
      }
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-style="pill"] .rotapfel-tab-item[aria-current]{
        background:var(--primary-color,#03a9f4);color:var(--text-primary-color,#fff)
      }
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-style="plain"] .rotapfel-tab-item{
        border:0;border-radius:0;background:transparent;color:var(--primary-text-color,#222)
      }
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-style="plain"] .rotapfel-tab-item[aria-current]{
        color:var(--primary-color);font-weight:bold
      }
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-color] .rotapfel-tab-item:not([aria-current]){color:var(--rotapfel-tab-color)}
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-active-color] .rotapfel-tab-item[aria-current]{color:var(--rotapfel-tab-active-color)}
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-background] .rotapfel-tab-item:not([aria-current]){background:var(--rotapfel-tab-background)}
      :is(.rotapfel-tabs,.rotapfel-room-tabs)[data-tab-active-background] .rotapfel-tab-item[aria-current]{background:var(--rotapfel-tab-active-background)}
      .rotapfel-menu{cursor:pointer}
      .rotapfel-tabs[data-wide] .rotapfel-menu{display:none}
      .rotapfel-tabs[data-wide]:not(:has(a,span)){display:none}
`;

export function normalizeRotapfelTabStyle(style={}){
  const normalized={};
  if(!style||typeof style!=='object')return normalized;
  if(['underline','pill','plain'].includes(style.variant))normalized.variant=style.variant;
  for(const field of ['color','activeColor','background','activeBackground']){
    if(typeof style[field]==='string'&&/^#[a-f0-9]{6}$/i.test(style[field]))normalized[field]=style[field];
  }
  for(const [field,min,max] of [['fontSize',10,36],['padding',4,24]]){
    if(Number.isInteger(style[field])&&style[field]>=min&&style[field]<=max)normalized[field]=style[field];
  }
  return normalized;
}

function styleRotapfelTabs(nav,style){
  const settings=normalizeRotapfelTabStyle(style);
  if(settings.variant)nav.dataset.tabStyle=settings.variant;
  for(const [field,name] of [['color','color'],['activeColor','active-color'],['background','background'],['activeBackground','active-background'],['fontSize','font-size'],['padding','padding']]){
    if(settings[field]===undefined)continue;
    nav.setAttribute('data-tab-'+name,'');
    nav.style.setProperty('--rotapfel-tab-'+name,typeof settings[field]==='number'?settings[field]+'px':settings[field]);
  }
}

export function renderRotapfelRoomTabs(rooms,activeRoom,settings,{german,onRoom}={}){
  if(settings?.showRoomTabs===false||rooms.length<2)return;
  const nav=document.createElement('nav');
  nav.className='rotapfel-room-tabs';
  nav.setAttribute('aria-label',german?'Raumauswahl':'Select room');
  styleRotapfelTabs(nav,settings?.roomTabStyle);
  for(const room of rooms){
    const item=document.createElement(onRoom?'button':'span');
    item.className='rotapfel-tab-item';
    item.textContent=room.name||(german?'Raum':'Room');
    if(String(room.id)===String(activeRoom))item.setAttribute('aria-current','true');
    if(onRoom){
      item.type='button';
      item.onclick=()=>onRoom(room.id);
    }
    nav.append(item);
  }
  return nav;
}

function roomRoutes(rooms){
  const used=new Set(),routes=new Map();
  for(const room of rooms){
    const base=String(room.name||'room').toLowerCase().normalize('NFKD')
      .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'room';
    let path=base;
    for(let suffix=2;used.has(path);suffix++)path=base+'-'+suffix;
    used.add(path);
    routes.set(room.id,path);
  }
  return routes;
}

export function renderRotapfelNavigation(cfg,{german,preview=false,wide=false,onMenu}={}){
  if(!cfg)return;
  const url=new URL(location.href);
  const kiosk=cfg.kiosk===true&&!url.searchParams.has('rotapfel_exit_kiosk');
  const nav=document.createElement('nav');
  nav.className='rotapfel-tabs';
  styleRotapfelTabs(nav,cfg.navigationStyle);
  nav.toggleAttribute('data-wide',wide);
  nav.dataset.mode=['manager','bar','buttons','none'].includes(cfg.navigation)?cfg.navigation:'manager';
  nav.dataset.position=nav.dataset.mode==='bar'
    ?(['center','top','bottom','left','right'].includes(cfg.navigationPosition)?cfg.navigationPosition:'center')
    :'top';
  nav.setAttribute('aria-label',german?'Dashboard-Tabs':'Dashboard tabs');
  if(!kiosk&&!cfg.shared){
    const menu=document.createElement('button');
    menu.className='rotapfel-menu';
    menu.type='button';
    menu.textContent='☰';
    menu.setAttribute('aria-label',german?'Home Assistant Menü öffnen':'Open Home Assistant menu');
    if(preview)menu.disabled=true;
    else menu.onclick=onMenu;
    nav.append(menu);
  }
  const tabs=Array.isArray(cfg.tabs)?cfg.tabs:[];
  if(nav.dataset.mode!=='none'){
    for(const tab of tabs){
      if(typeof tab?.path!=='string'||!/^[a-z0-9_-]+$/i.test(tab.path))continue;
      const link=document.createElement(preview?'span':'a');
      link.className='rotapfel-tab-item';
      const target=new URL(url);
      target.searchParams.delete('raum');
      if(cfg.shared&&cfg.sharedPath){
        target.pathname='/'+cfg.sharedPath+'/'+encodeURIComponent(tab.path);
        target.searchParams.delete('rotapfel_tab');
      }else if(cfg.shared)target.searchParams.set('rotapfel_tab',tab.path);
      else target.pathname='/'+url.pathname.split('/')[1]+'/'+encodeURIComponent(tab.path);
      if(!preview)link.href=target.pathname+target.search+target.hash;
      link.textContent=typeof tab.label==='string'&&tab.label.trim()?tab.label:tab.path;
      if(tab.path===cfg.path)link.setAttribute('aria-current','page');
      nav.append(link);
    }
  }
  if(nav.childElementCount)return nav;
}

class RotapfelCanvasCard extends HTMLElement {
  setConfig(config){
    if(!config||!Array.isArray(config.elements))throw new Error(rotapfelCardLanguage(this._hass)==='de'?'Rotapfel Canvas: elements erforderlich':'Rotapfel Canvas requires elements');
    this._config=structuredClone(config);
    const rooms=Array.isArray(this._config.rooms)?this._config.rooms:[];
    const roomPath=config.presentation?.roomPath||new URLSearchParams(location.search).get('raum');
    const routes=roomRoutes(rooms);
    const selected=rooms.find(room=>routes.get(room.id)===roomPath);
    this._activeRoomId=selected?.id??rooms[0]?.id??null;
    if(!this.shadowRoot)this.attachShadow({mode:'open'});
    this._render();
  }
  set hass(hass){
    const firstHass=!this._hass;
    this._hass=hass;
    if(firstHass&&this._backgroundLayer)this._setBackground(this._backgroundLayer,this._config?.presentation?.background);
    if(this._config&&this._language!==rotapfelCardLanguage(hass))this._render();
    for(const card of this._cards||[])card.hass=hass;
  }
  getCardSize(){return 8;}
  connectedCallback(){
    this._panelPath=location.pathname.split('/')[1];
    this._onRoute=()=>this._applyChrome();
    window.addEventListener('location-changed',this._onRoute);
    window.addEventListener('popstate',this._onRoute);
    if(this._config)this._render();
  }
  _applyChrome(){
    for(const style of this._chromeStyles||[])style.remove();
    this._chromeStyles=[];
    const settings=this._config?.presentation;
    if(!this.isConnected||!settings||location.pathname.split('/')[1]!==this._panelPath)return;
    const kiosk=settings.kiosk===true&&!new URLSearchParams(location.search).has('rotapfel_exit_kiosk');
    const inject=(root,css)=>{
      const style=document.createElement('style');
      style.textContent=css;
      root.append(style);
      this._chromeStyles.push(style);
    };
    for(let node=this;node;){
      const tree=node.getRootNode();
      const host=tree.host;
      if(!host)break;
      if(host.localName==='hui-root'){
        inject(tree,'.header{display:none!important} hui-view-container,hui-view-container.has-tab-bar{padding-top:var(--safe-area-inset-top,0px)!important}');
      }
      if(kiosk&&host.localName==='home-assistant-main'){
        const drawer=tree.querySelector('ha-drawer');
        inject(tree,'ha-sidebar{display:none!important} ha-drawer{--ha-sidebar-width:0px;--ha-top-app-bar-width:100%}');
        if(drawer?.shadowRoot)inject(drawer.shadowRoot,'.sidebar-shell,wa-drawer{display:none!important} .app-content{padding-inline-start:0!important}');
      }
      node=host;
    }
  }
  async _setBackground(layer,background){
    let path=background?.image;
    if(typeof path!=='string'||!path)return;
    try{
      if(path.startsWith('media-source://')){
        if(!this._hass)return;
        const resource=await this._hass.callWS({type:'media_source/resolve_media',media_content_id:path});
        path=resource.url;
      }else if(!/^\/(?:local\/|api\/image\/serve\/|rotapfel_dashboard_manager\/backgrounds\/)/.test(path))return;
      const url=new URL(path,location.origin);
      if(url.origin!==location.origin||!this.shadowRoot?.contains(layer))return;
      layer.style.backgroundImage='url('+JSON.stringify(url.href)+')';
    }catch(error){console.warn('Rotapfel: Background unavailable',error);}
  }
  _render(){
    if(this._windowResizeHandler)window.removeEventListener('resize',this._windowResizeHandler);
    this._resizeObserver?.disconnect();
    this._cardFitObservers?.forEach(observer=>observer.disconnect());
    this._cardFitObservers=[];
    const root=this.shadowRoot;root.replaceChildren();
    const language=this._language=rotapfelCardLanguage(this._hass);
    const german=language==='de';
    const baseWidth=rotapfelNumber(this._config.canvas_width,320,10000,1920),baseHeight=rotapfelNumber(this._config.canvas_height,240,10000,1080);
    const profiles=this._config.device_profiles||{fire_hd:{width:baseWidth,height:baseHeight},desktop:{width:baseWidth,height:baseHeight},iphone:{width:402,height:874}};
    const dimensions=key=>profiles[key]||profiles.fire_hd||{width:baseWidth,height:baseHeight};
    let width=baseWidth,height=baseHeight;
    const resolveProfile=()=>{
      if(this._manualProfile&&profiles[this._manualProfile])return this._manualProfile;
      const screen=window.innerWidth;
      const custom=Object.keys(profiles).filter(k=>k.startsWith('custom_'));
      const candidates=[...custom,'iphone','fire_hd','desktop'];
      return candidates.reduce((best,key)=>Math.abs((profiles[key]?.width||baseWidth)-screen)<Math.abs((profiles[best]?.width||baseWidth)-screen)?key:best,screen<=600?'iphone':screen>=1600?'desktop':'fire_hd');
    };
    const style=document.createElement('style');style.textContent=`:host{display:block;width:100%;min-width:0;overflow:visible!important}.viewport{width:100%;overflow-x:hidden;overflow-y:visible;position:relative}.canvas{position:relative;transform-origin:top left;background:transparent!important;background-image:none!important}.tile{position:absolute;box-sizing:border-box;overflow:hidden}.tile>*{width:100%;box-sizing:border-box}.tile>rotapfel-entity-card{height:100%}.external-fit{position:absolute;left:0;top:0;transform-origin:top left;overflow:visible}.external-fit>*{display:block;width:100%;box-sizing:border-box}`;
    root.append(style);
    style.textContent+=`
      ${rotapfelNavigationCss}
      .rotapfel-background{position:absolute;inset:0;pointer-events:none;z-index:-1}
      .viewport{isolation:isolate}
    `;
    const navigation=renderRotapfelNavigation(this._config.presentation,{
      german,wide:window.innerWidth>=870,
      onMenu:()=>this.dispatchEvent(new Event('hass-toggle-menu',{bubbles:true,composed:true}))
    });
    this._applyChrome();
    const rooms=Array.isArray(this._config.rooms)?this._config.rooms:[];
    const roomTabs=renderRotapfelRoomTabs(rooms,this._activeRoomId,this._config.presentation,{
      german,onRoom:id=>{
        if(String(this._activeRoomId)===String(id))return;
        const settings=this._config.presentation;
        const url=new URL(location.href);
        const path=roomRoutes(rooms).get(id);
        if(settings?.sharedPath){
          url.pathname='/'+settings.sharedPath+'/'+settings.path+'/'+path;
          url.searchParams.delete('rotapfel_tab');
          window.location.assign(url);
          return;
        }
        url.searchParams.set('raum',path);
        history.replaceState(history.state,'',url);
        this._activeRoomId=id;
        this._render();
      }
    });
    if(roomTabs)root.append(roomTabs);
    const controls=document.createElement('div');controls.style.cssText='display:flex;align-items:center;justify-content:flex-end;gap:8px;margin:0 0 8px;font:12px var(--primary-font-family,Arial,sans-serif)';
    const profileLabel=document.createElement('span');profileLabel.textContent='Layout:';
    const profileSelect=document.createElement('select');profileSelect.setAttribute('aria-label',german?'Geräteprofil':'Device profile');profileSelect.style.cssText='max-width:180px;padding:5px;border-radius:6px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);border:1px solid var(--divider-color,#bbb)';
    for(const [value,label] of [['auto',german?'Automatisch':'Automatic'],...Object.entries(profiles).map(([key,p])=>[key,p.name||key])]){const o=document.createElement('option');o.value=value;o.textContent=label;profileSelect.append(o);}
    profileSelect.value=this._manualProfile||'auto';profileSelect.onchange=()=>{this._manualProfile=profileSelect.value==='auto'?null:profileSelect.value;fit();};
    controls.append(profileLabel,profileSelect);
    this.style.background='transparent';this.style.backgroundImage='none';
    const viewport=document.createElement('div');viewport.className='viewport';
    viewport.append(controls);
    const navigationLayout=document.createElement('div');
    navigationLayout.className='rotapfel-navigation-layout';
    const surface=document.createElement('div');
    surface.className='rotapfel-navigation-surface';
    if(navigation)navigationLayout.append(navigation);
    navigationLayout.append(surface);
    const background=this._config.presentation?.background;
    this._backgroundLayer=null;
    if(background){
      const layer=document.createElement('div');
      layer.className='rotapfel-background';
      layer.style.backgroundPosition=['center','top','right','bottom','left'].includes(background.position)?background.position:'center';
      layer.style.backgroundSize=background.size==='stretch'?'100% 100%':['cover','contain','auto'].includes(background.size)?background.size:'cover';
      layer.style.backgroundRepeat=['repeat','repeat-x','repeat-y'].includes(background.repeat)?background.repeat:'no-repeat';
      layer.style.opacity=rotapfelNumber(background.opacity,0,100,100)/100;
      if(/^#[a-f0-9]{6}$/i.test(background.color||''))viewport.style.backgroundColor=background.color;
      viewport.append(layer);
      this._backgroundLayer=layer;
    }
    const canvas=document.createElement('div');canvas.className='canvas';canvas.style.width=width+'px';canvas.style.height=height+'px';surface.append(canvas);viewport.append(navigationLayout);root.append(viewport);
    if(this._backgroundLayer)this._setBackground(this._backgroundLayer,background);
    const fit=()=>{
      const profile=resolveProfile(),dims=dimensions(profile);
      width=rotapfelNumber(dims.width,320,10000,baseWidth);height=rotapfelNumber(dims.height,240,10000,baseHeight);
      canvas.style.width=width+'px';
      let maxBottom=0;
      for(const tile of canvas.querySelectorAll('.tile')){
        const item=tile._rotapfelItem;if(!item)continue;
        const p=item.device_layouts?.[profile]||item.device_layouts?.fire_hd||item;
        const x=rotapfelNumber(p.x,0,10000,0),y=rotapfelNumber(p.y,0,100000,0);
        const w=rotapfelNumber(p.w,0,10000,0),h=rotapfelNumber(p.h,0,100000,0);
        for(const [key,value] of Object.entries({left:x,top:y,width:w,height:h}))tile.style[key]=value+'px';
        tile.style.zIndex=String(rotapfelNumber(p.z,0,9999,0));
        maxBottom=Math.max(maxBottom,y+h);
      }
      navigation?.toggleAttribute('data-wide',width>=870);
      const sideNavigation=['left','right'].includes(navigation?.dataset.position);
      const scale=Math.min(1,(surface.clientWidth||width)/width);
      canvas.style.transform=`scale(${scale})`;
      const navigationHeight=roomTabs?roomTabs.offsetHeight+12:0;
      const usableHeight=Math.max(1,height-Math.ceil(navigationHeight/scale));
      const expandable=profiles[profile]?.fixed===false||profile==='iphone';
      const effectiveHeight=expandable||navigationHeight
        ?Math.max(usableHeight,maxBottom+(expandable?16:0)):usableHeight;
      canvas.style.height=effectiveHeight+'px';
      surface.style.height=Math.ceil(effectiveHeight*scale)+'px';
      this.style.minHeight='0';
      this.style.height='auto';
      viewport.style.overflowX='hidden';
      viewport.style.overflowY='visible';
      // No toolbar space in the live dashboard unless explicitly enabled for smartphones.
      controls.style.display=this._config.show_mobile_layout_selector===true&&profile==='iphone'?'flex':'none';
      controls.style.justifyContent=profile==='iphone'?'center':'flex-end';
      profileSelect.style.maxWidth=profile==='iphone'?'140px':'180px';
    };
    this._resizeObserver=new ResizeObserver(fit);this._resizeObserver.observe(viewport);
    this._windowResizeHandler=()=>fit();window.addEventListener('resize',this._windowResizeHandler);
    requestAnimationFrame(fit);
    this._cards=[];
    const renderCards=async()=>{
      let helpers;
      try{helpers=await window.loadCardHelpers();}
      catch(e){console.error('Rotapfel: Card Helpers nicht verfügbar',e);return;}
      if(viewport.parentNode!==root)return;
      for(const item of this._config.elements.filter(item=>this._config.presentation?.showRoomTabs===false||!rooms.length||item.room_id==null||String(item.room_id)===String(this._activeRoomId))){
        const tile=document.createElement('div');tile.className='tile';tile._rotapfelItem=item;tile.style.background='transparent';tile.style.zIndex=String(rotapfelNumber(item.z,0,9999,0));
        for(const [key,value] of Object.entries({left:item.x,top:item.y,width:item.w,height:item.h}))tile.style[key]=rotapfelNumber(value,0,10000,0)+'px';
        const d=item.design||{};
        // External cards retain their own backgrounds. Apply non-invasive wrapper effects only.
        if(item.card?.type!=='custom:rotapfel-entity-card'&&item.card?.type!=='custom:rotapfel-simple-thermcard'&&['wrapper','sync'].includes(d.external_mode||'original')){
          if(d.bg&&/^#[0-9a-f]{6}$/i.test(d.bg)){const rgb=[1,3,5].map(i=>parseInt(d.bg.slice(i,i+2),16));tile.style.backgroundColor=`rgba(${rgb.join(',')},${rotapfelNumber(d.opacity,0,100,100)/100})`;}
          if(d.radius!=null)tile.style.borderRadius=rotapfelNumber(d.radius,0,48,12)+'px';
          if(d.border_width)tile.style.border=rotapfelNumber(d.border_width,0,12,0)+'px solid '+rotapfelHex(d.border_color,'#64748b');
          if(d.shadow==='soft')tile.style.boxShadow='0 4px 12px #0003';
          if(d.shadow==='strong')tile.style.boxShadow='0 12px 26px #0006';
        }
        try{
          const card=helpers.createCardElement(item.card);
          if(this._hass)card.hass=this._hass;
          if(['custom:rotapfel-entity-card','custom:rotapfel-label-card'].includes(item.card?.type)){
            tile.append(card);
          }else if(item.card?.type==='custom:equinox-card'){
            // Keep native typography and aspect ratio. Fit tall Equinox content
            // uniformly inside the saved tile instead of clipping its bottom.
            const host=document.createElement('div');host.className='external-fit';
            host.style.width='430px';
            card.style.display='block';card.style.width='100%';card.style.maxWidth='100%';
            card.style.boxSizing='border-box';host.append(card);tile.append(host);
            let pending=false;
            const fitEquinox=()=>{
              pending=false;if(!host.isConnected)return;
              const naturalW=Math.max(1,parseFloat(host.style.width)||tile.clientWidth);
              const surface=card.shadowRoot?.querySelector('ha-card,.card,.container,.main,.wrapper');
              const naturalH=Math.max(1,surface?.offsetHeight||0,card.scrollHeight||0,card.offsetHeight||0);
              const factor=Math.min(1,tile.clientWidth/naturalW,tile.clientHeight/naturalH);
              host.style.transform=`scale(${factor})`;
            };
            const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(fitEquinox);}};
            const observer=new ResizeObserver(schedule);
            observer.observe(tile);observer.observe(card);
            this._cardFitObservers.push(observer);
            requestAnimationFrame(()=>requestAnimationFrame(fitEquinox));
          }else{
            // Mirror the manager's fixed-canvas preview: render the original
            // custom card at its natural dimensions, then fit it into the
            // SAVED tile. Do not change coordinates, card config or size.
            const kind=String(item.card?.type||'');
            const isEquinox=kind==='custom:equinox-card';
            const isCluster=kind==='custom:climate-cluster-card';
            const isTherm=kind==='custom:rotapfel-simple-thermcard';
            const intrinsicWidth=isCluster?850:isEquinox?430:isTherm?400:Math.max(200,rotapfelNumber(item.w,76,10000,400));
            const fitHost=document.createElement('div');fitHost.className='external-fit';
            fitHost.style.width=intrinsicWidth+'px';fitHost.append(card);tile.append(fitHost);
            const updateFit=()=>{
              if(!fitHost.isConnected)return;
              // A card's own responsive surface can have a different natural
              // height than its host; read both without transformed rects.
              let surface=null;
              if(isEquinox&&card.shadowRoot){
                surface=card.shadowRoot.querySelector('ha-card,.card,.container,.main,.wrapper');
              }
              const naturalHeight=isCluster?Math.max(180,card.scrollHeight||0,card.offsetHeight||0):isEquinox?
                Math.max(270,surface?.offsetHeight||0,card.scrollHeight||0):
                Math.max(80,card.scrollHeight||0,card.offsetHeight||0);
              const targetW=Math.max(1,tile.clientWidth),targetH=Math.max(1,tile.clientHeight);
              const savedScale=Number(item.therm_scale);
              const factor=isTherm&&Number.isFinite(savedScale)&&savedScale>0?Math.min(3,savedScale):Math.min(targetW/intrinsicWidth,targetH/Math.max(1,naturalHeight));
              if(isTherm&&card.shadowRoot){
                const painted=card.shadowRoot.querySelector('.hd')||[...card.shadowRoot.querySelectorAll('*')].find(n=>n.shadowRoot?.querySelector('.hd'))?.shadowRoot?.querySelector('.hd');
                if(painted&&painted.offsetWidth>0&&painted.offsetHeight>0){
                  const safeScale=Math.max(.01,Math.min(factor,(targetW-4)/painted.offsetWidth,(targetH-4)/painted.offsetHeight));
                  fitHost.style.transform=`scale(${safeScale})`;
                  const tileRect=tile.getBoundingClientRect(),paintedRect=painted.getBoundingClientRect();
                  const zoom=tile.offsetWidth>0?tileRect.width/tile.offsetWidth:1;
                  const dx=(tileRect.left+2*zoom-paintedRect.left)/Math.max(.01,zoom);
                  const dy=(tileRect.top+2*zoom-paintedRect.top)/Math.max(.01,zoom);
                  if(Number.isFinite(dx)&&Number.isFinite(dy)&&Math.abs(dx)<300&&Math.abs(dy)<300)
                    fitHost.style.transform=`translate(${dx}px,${dy}px) scale(${safeScale})`;
                  return;
                }
              }
              fitHost.style.transform=`scale(${Math.max(0.01,factor)})`;
            };
            const observer=new ResizeObserver(()=>requestAnimationFrame(updateFit));
            observer.observe(tile);observer.observe(card);
            this._cardFitObservers.push(observer);
            requestAnimationFrame(()=>requestAnimationFrame(updateFit));
          }
          this._cards.push(card);
        }catch(error){
          const fallback=document.createElement('div');fallback.textContent=(german?'Karte nicht verfügbar: ':'Card unavailable: ')+String(error);tile.append(fallback);
        }
        canvas.append(tile);
      }
    };
    renderCards();requestAnimationFrame(fit);
  }
  disconnectedCallback(){
    window.removeEventListener('location-changed',this._onRoute);
    window.removeEventListener('popstate',this._onRoute);
    for(const style of this._chromeStyles||[])style.remove();
    this._chromeStyles=[];
    if(this._windowResizeHandler)window.removeEventListener('resize',this._windowResizeHandler);this._resizeObserver?.disconnect();this._cardFitObservers?.forEach(observer=>observer.disconnect());}
}
if(!customElements.get('rotapfel-canvas-card'))customElements.define('rotapfel-canvas-card',RotapfelCanvasCard);
