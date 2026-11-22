// Rotapfel Lovelace renderer — does not modify existing dashboards.
const rotapfelHex=(v,fallback)=>/^#[0-9a-f]{6}$/i.test(v||'')?v:fallback;
const rotapfelNumber=(v,lo,hi,def)=>{const n=Number(v);return Number.isFinite(n)?Math.min(hi,Math.max(lo,n)):def;};
const rotapfelEscape=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
class RotapfelEntityCard extends HTMLElement {
  setConfig(config){
    if(!config||!config.entity)throw new Error('Rotapfel-Entitätskarte benötigt entity');
    this._config=structuredClone(config);
    if(!this.shadowRoot)this.attachShadow({mode:'open'});
    this._render();
  }
  set hass(hass){this._hass=hass;if(this._config)this._render();}
  getCardSize(){return 2;}
  _render(){
    const c=this._config,d=c.design||{},disp=c.display||{},entity=c.entity;
    const state=this._hass?.states?.[entity],domain=entity.split('.')[0],raw=state?.state??'unavailable';
    const unavailable=!state||['unavailable','unknown'].includes(raw);
    const deviceClass=state?.attributes?.device_class;
    let value=raw;
    if(['light','switch','input_boolean'].includes(domain))value=raw==='on'?'Ein':raw==='off'?'Aus':raw;
    else if(domain==='binary_sensor'&&['window','door','opening','garage_door'].includes(deviceClass))value=raw==='off'?'Geschlossen':raw==='on'?'Offen':raw;
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
    </style><div class="card"><span class="icon" aria-hidden="true">${icon}</span><div class="content">${name}${id}<span class="state">${rotapfelEscape(value)}</span></div>${toggle?`<button type="button" aria-label="${raw==='on'?'Ausschalten':'Einschalten'}">${raw==='on'?'Ein':'Aus'}</button>`:''}</div>`;
    const btn=root.querySelector('button');if(btn)btn.onclick=async()=>{
      if(!this._hass?.callService)return;
      btn.disabled=true;
      try{await this._hass.callService(domain,raw==='on'?'turn_off':'turn_on',{entity_id:entity});}
      catch(e){console.error('Rotapfel: Schalten fehlgeschlagen',e);btn.disabled=false;}
    };
  }
}
if(!customElements.get('rotapfel-entity-card'))customElements.define('rotapfel-entity-card',RotapfelEntityCard);

class RotapfelCanvasCard extends HTMLElement {
  setConfig(config){
    if(!config||!Array.isArray(config.elements))throw new Error('Rotapfel Canvas: elements erforderlich');
    this._config=structuredClone(config);
    const rooms=Array.isArray(this._config.rooms)?this._config.rooms:[];
    if(!rooms.some(r=>String(r.id)===String(this._activeRoomId)))this._activeRoomId=rooms[0]?.id??null;
    if(!this.shadowRoot)this.attachShadow({mode:'open'});
    this._render();
  }
  set hass(hass){this._hass=hass;for(const card of this._cards||[])card.hass=hass;}
  getCardSize(){return 8;}
  _render(){
    if(this._windowResizeHandler)window.removeEventListener('resize',this._windowResizeHandler);
    this._resizeObserver?.disconnect();
    this._cardFitObservers?.forEach(observer=>observer.disconnect());
    this._cardFitObservers=[];
    const root=this.shadowRoot;root.replaceChildren();
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
    const style=document.createElement('style');style.textContent=`:host{display:block;width:100%;min-width:0;overflow:visible!important}.viewport{width:100%;overflow-x:hidden;overflow-y:visible;position:relative;background:transparent!important}.canvas{position:relative;transform-origin:top left;background:transparent!important;background-image:none!important}.tile{position:absolute;box-sizing:border-box;overflow:hidden}.tile>*{width:100%;box-sizing:border-box}.tile>rotapfel-entity-card{height:100%}.external-fit{position:absolute;left:0;top:0;transform-origin:top left;overflow:visible}.external-fit>*{display:block;width:100%;box-sizing:border-box}`;
    root.append(style);
    const rooms=Array.isArray(this._config.rooms)?this._config.rooms:[];
    if(rooms.length>1){
      const nav=document.createElement('nav');nav.setAttribute('aria-label','Raumauswahl');
      nav.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px;padding:4px 0';
      for(const room of rooms){
        const button=document.createElement('button');button.type='button';button.textContent=room.name||'Raum';
        const active=String(room.id)===String(this._activeRoomId);
        button.setAttribute('aria-pressed',String(active));
        button.style.cssText='cursor:pointer;border-radius:8px;padding:9px 14px;font:inherit;border:1px solid var(--divider-color,#bbb);background:'+(active?'var(--primary-color,#03a9f4)':'var(--card-background-color,#fff)')+';color:'+(active?'var(--text-primary-color,#fff)':'var(--primary-text-color,#222)');
        button.onclick=()=>{if(String(this._activeRoomId)===String(room.id))return;this._activeRoomId=room.id;this._render();};
        nav.append(button);
      }
      root.append(nav);
    }
    const controls=document.createElement('div');controls.style.cssText='display:flex;align-items:center;justify-content:flex-end;gap:8px;margin:0 0 8px;font:12px var(--primary-font-family,Arial,sans-serif)';
    const profileLabel=document.createElement('span');profileLabel.textContent='Layout:';
    const profileSelect=document.createElement('select');profileSelect.setAttribute('aria-label','Geräteprofil');profileSelect.style.cssText='max-width:180px;padding:5px;border-radius:6px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);border:1px solid var(--divider-color,#bbb)';
    for(const [value,label] of [['auto','Automatisch'],...Object.entries(profiles).map(([key,p])=>[key,p.name||key])]){const o=document.createElement('option');o.value=value;o.textContent=label;profileSelect.append(o);}
    profileSelect.value=this._manualProfile||'auto';profileSelect.onchange=()=>{this._manualProfile=profileSelect.value==='auto'?null:profileSelect.value;fit();};
    controls.append(profileLabel,profileSelect);root.append(controls);
    this.style.background='transparent';this.style.backgroundImage='none';
    const viewport=document.createElement('div');viewport.className='viewport';
    const canvas=document.createElement('div');canvas.className='canvas';canvas.style.width=width+'px';canvas.style.height=height+'px';viewport.append(canvas);root.append(viewport);
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
      // Every device profile supports a vertically growing canvas.
      const effectiveHeight=profiles[profile]?.fixed===false||profile==='iphone'?Math.max(height,maxBottom+16):height;
      canvas.style.height=effectiveHeight+'px';
      const availableWidth=viewport.clientWidth||width;
      const scale=Math.min(1,availableWidth/width);
      canvas.style.transform=`scale(${scale})`;
      viewport.style.height=Math.ceil(effectiveHeight*scale)+'px';
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
      for(const item of this._config.elements.filter(item=>!rooms.length||item.room_id==null||String(item.room_id)===String(this._activeRoomId))){
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
          if(item.card?.type==='custom:rotapfel-entity-card'){
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
          const fallback=document.createElement('div');fallback.textContent='Karte nicht verfügbar: '+String(error);tile.append(fallback);
        }
        canvas.append(tile);
      }
    };
    renderCards();requestAnimationFrame(fit);
  }
  disconnectedCallback(){if(this._windowResizeHandler)window.removeEventListener('resize',this._windowResizeHandler);this._resizeObserver?.disconnect();this._cardFitObservers?.forEach(observer=>observer.disconnect());}
}
if(!customElements.get('rotapfel-canvas-card'))customElements.define('rotapfel-canvas-card',RotapfelCanvasCard);
