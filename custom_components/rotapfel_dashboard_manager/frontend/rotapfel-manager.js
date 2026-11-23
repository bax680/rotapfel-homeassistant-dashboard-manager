class RotapfelDashboardManager extends HTMLElement {
  set hass(v) { this._hass=v; if(!this._loaded){this._loaded=true;this.load();}else{this.refreshStates();} }
  connectedCallback(){this.refreshCustomCardCatalog();this.render();this.installMobileButtonTouchFix();window.rotapfelInstallSidebarLogo?.();this.collapseMobileSidebar();}
  // Alpha 13.7.105: iOS Safari sometimes fails to synthesize a click on
  // controls inside nested scrolling / fixed Home Assistant shadow panels.
  // Handle a stationary touch directly, while leaving scroll gestures native.
  // This is intentionally scoped to manager controls, not the dashboard cards.
  installMobileButtonTouchFix(){
    if(this._mobileButtonTouchFixInstalled||!this.shadowRoot)return;
    this._mobileButtonTouchFixInstalled=true;
    let start=null;
    const eligible=target=>{
      if(!window.matchMedia('(max-width: 767px)').matches)return null;
      const button=target?.closest?.('button');
      if(!button||button.disabled||button.closest('.position-tile,.canvas-preview,.external-card-slot'))return null;
      return button;
    };
    // Ignore a native iOS click immediately following our touch fallback.
    // Capture runs before the individual toggle handlers, preventing double toggles.
    let syntheticTouchClick=null;
    this.shadowRoot.addEventListener('click',ev=>{
      if(!syntheticTouchClick)return;
      const target=syntheticTouchClick.button;
      if(performance.now()-syntheticTouchClick.at>900){syntheticTouchClick=null;return;}
      if(ev.isTrusted&&(ev.target===target||target.contains(ev.target))){
        ev.preventDefault();ev.stopImmediatePropagation();syntheticTouchClick=null;
      }
    },true);
    this.shadowRoot.addEventListener('touchstart',ev=>{
      start=null;
      if(ev.touches.length!==1)return;
      const t=ev.touches[0];
      const button=eligible(ev.target)||this.mobileButtonAtPoint(t.clientX,t.clientY,ev.target);
      if(!button)return;
      start={button,x:t.clientX,y:t.clientY,moved:false};
    },{passive:true});
    this.shadowRoot.addEventListener('touchmove',ev=>{
      if(!start||!ev.touches.length)return;
      const t=ev.touches[0];
      if(Math.hypot(t.clientX-start.x,t.clientY-start.y)>12)start.moved=true;
    },{passive:true});
    this.shadowRoot.addEventListener('touchcancel',()=>{start=null;},{passive:true});
    this.shadowRoot.addEventListener('touchend',ev=>{
      const gesture=start;start=null;
      if(!gesture||gesture.moved||ev.changedTouches.length!==1)return;
      const t=ev.changedTouches[0];
      if(Math.hypot(t.clientX-gesture.x,t.clientY-gesture.y)>12)return;
      const button=gesture.button;
      if(!button.isConnected||button.disabled)return;
      const rect=button.getBoundingClientRect();
      if(t.clientX<rect.left-8||t.clientX>rect.right+8||t.clientY<rect.top-8||t.clientY>rect.bottom+8)return;
      // Prevent a second delayed synthetic click from iOS Safari.
      ev.preventDefault();
      syntheticTouchClick={button,at:performance.now()};
      button.click();
    },{passive:false});
  }
  // Resolve the actual rectangular hit area, including padding. Some iOS
  // WebKit shadow/scroll combinations report the text node's neighbour as target.
  mobileButtonAtPoint(x,y,target){
    if(target?.closest?.('input,select,textarea,a,summary,[contenteditable],.position-tile,.external-card-slot'))return null;
    const candidates=[...this.shadowRoot.querySelectorAll('button')].filter(button=>{
      if(button.disabled||button.closest('.position-tile,.canvas-preview,.external-card-slot'))return false;
      const css=getComputedStyle(button),r=button.getBoundingClientRect();
      return css.display!=='none'&&css.visibility!=='hidden'&&css.pointerEvents!=='none'&&r.width>0&&r.height>0&&x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
    });
    // Ambiguous overlapping buttons are not safe to activate.
    return candidates.length===1?candidates[0]:null;
  }
  collapseMobileSidebar(){
    if(!window.matchMedia('(max-width: 767px)').matches)return;
    // HA's mobile drawer may already be closed. Never toggle blindly on entry.
    try{
      const app=document.querySelector('home-assistant');
      const main=app?.shadowRoot?.querySelector('home-assistant-main');
      const drawer=main?.shadowRoot?.querySelector('ha-drawer, mwc-drawer');
      if(drawer?.open){if(typeof drawer.close==='function')drawer.close();else drawer.open=false;}
    }catch(_err){}
  }
  openHASidebar(){
    // Home Assistant listens to this composed event from custom panels.
    this.dispatchEvent(new Event('hass-toggle-menu',{bubbles:true,composed:true}));
  }
  disconnectedCallback(){this._previewResizeObserver?.disconnect();}
  esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  cardKind(c){
    if(c.type==='custom')return 'custom';
    if(c.type!=='entity'||!c.entity_id)return 'placeholder';
    if(['equinox','climate_cluster','rotapfel_simple_thermcard','rotapfel_climate'].includes(c.variant))return 'climate';
    const domain=c.entity_id.split('.')[0];
    if(domain==='light')return 'light';
    if(domain==='switch'||domain==='input_boolean')return 'switch';
    if(domain==='binary_sensor')return 'window';
    if(domain==='sensor')return 'sensor';
    if(domain==='climate')return 'climate';
    if(domain==='cover')return 'cover';
    return 'entity';
  }
  cardState(c){return this._hass?.states?.[c.entity_id];}
  stateLabel(c){
    const st=this.cardState(c);if(!st)return 'Entität nicht verfügbar';
    const kind=this.cardKind(c),v=st.state;
    if(kind==='window'){
      const cls=st.attributes?.device_class;
      if(['window','door','opening','garage_door'].includes(cls))return v==='off'?'Geschlossen':v==='on'?'Offen':v;
    }
    if(kind==='light'||kind==='switch')return v==='on'?'Ein':v==='off'?'Aus':v;
    return `${v}${st.attributes?.unit_of_measurement?' '+st.attributes.unit_of_measurement:''}`;
  }
  externalVariant(c){return ['equinox','climate_cluster','rotapfel_simple_thermcard'].includes(c.variant)?c.variant:null;}
  autoCardHeight(c){return this.externalVariant(c)?c.design?.auto_height!==false:false;}
  cardHeightLabel(c){return this.autoCardHeight(c)?'Automatisch':this.design(c).height+'px';}
  externalConfig(c){
    const base={entity:c.entity_id,name:c.title};
    if(c.variant==='equinox')return {type:'custom:equinox-card',...base,theme:'liquid_glow',display_mode:'compact',primary_display:'sensors',setpoint_selector:'slider',disable_name:false,show_fan_mode:false,show_swing_mode:false,hide_lock_button:true,additional_dashboards:'auto',state_icons_layout:'vertical',show_power_value:true,show_current_temperature:true,show_humidity:true,show_setpoint:true,show_hvac_mode:true,show_preset_mode:false,show_auto_start_stop:true,show_power_info:true,show_hvac_action:true,show_events:true,show_menu:true,border_glow_on_action:true,card_background_opacity:8,card_background_color:'light-blue',mode_customizations:{hvac:{sleep:{hidden:true}}},...c.external_options};
    if(c.variant==='climate_cluster')return {type:'custom:climate-cluster-card',...base,appearance:'glass-dark',glass_opacity:0.5,show_steppers:true,show_humidity:false,show_presets:true,modes:['heat','off'],fan_clover:false,show_fan:false,show_sound:false,show_led:false,show_swing:false,fan_style:'original',temperature_unit:'C',min_temp:7,max_temp:26,...c.external_options};
    if(c.variant==='rotapfel_simple_thermcard'){
      const {card_name,card_footprint,card_show_control,card_history,therm_background,therm_text,...options}=c.external_options||{};
      const card={...base,name:card_name||base.name};
      if(['compact','standard','featured'].includes(card_footprint))card.footprint=card_footprint;
      if(typeof card_show_control==='boolean')card.show_control=card_show_control;
      if(typeof card_history==='boolean')card.history=card_history;
      const rows=options.rows||[{cards:[card]}];
      return {...options,type:'custom:rotapfel-simple-thermcard',theme:options.theme||'light',rows};
    }
    return null;
  }
  static externalResources={equinox:'',climate_cluster:'',rotapfel_simple_thermcard:''};
  resourceNames(){return {equinox:'Equinox',climate_cluster:'Climate Cluster',rotapfel_simple_thermcard:'Rotapfel Simple ThermCard'};}
  resourceTags(){return {equinox:'equinox-card',climate_cluster:'climate-cluster-card',rotapfel_simple_thermcard:'rotapfel-simple-thermcard'};}
  resourcePatterns(){return {
    equinox:/(?:^|\/)(?:equinox|equinox-card)(?:\/|[.-])/i,
    climate_cluster:/(?:^|\/)(?:climate-cluster-card|climate-cluster)(?:\/|[.-])/i,
    rotapfel_simple_thermcard:/(?:^|\/)(?:rotapfel-simple-thermcard)(?:\/|[.-])/i
  };}
  validResourceUrl(url){
    if(typeof url!=='string')return false;
    // Local-only resources. Absolute URLs, data:, javascript: and protocol-relative paths are disallowed.
    return /^\/(?:local|hacsfiles|frontend_latest|rotapfel_dashboard_manager)\/[A-Za-z0-9_./?=&%+~-]+$/.test(url)&&!url.includes('..');
  }
  manualResources(){
    try{
      const data=JSON.parse(localStorage.getItem('rotapfel_resources_alpha13')||'{}');
      return Object.fromEntries(Object.entries(data||{}).filter(([key,value])=>key in this.resourceTags()&&(value===''||this.validResourceUrl(value))));
    }catch(_){return {};}
  }
  async discoverResources(force=false){
    if(!force&&this._haResources)return this._haResources;
    if(!force&&this._resourceDiscovery)return this._resourceDiscovery;
    if(!this._hass?.callWS)return {};
    this._resourceDiscovery=(async()=>{
      try{
        const response=await this._hass.callWS({type:'lovelace/resources'});
        const list=Array.isArray(response)?response:Array.isArray(response?.resources)?response.resources:[];
        const found={};const patterns=this.resourcePatterns();
        for(const item of list){
          const url=typeof item==='string'?item:item?.url;
          if(!this.validResourceUrl(url))continue;
          for(const [key,pattern] of Object.entries(patterns))if(pattern.test(url))found[key]=url;
        }
        this._haResources=found;this._resourceDiscoveryError='';
        return found;
      }catch(err){
        this._resourceDiscoveryError=String(err);
        return {};
      }finally{this._resourceDiscovery=null;}
    })();
    return this._resourceDiscovery;
  }
  readResources(){
    // Explicit browser overrides take priority. Empty manual fields use HA discovery.
    const manual=this.manualResources(),auto=this._haResources||{};
    return Object.fromEntries(Object.keys(this.resourceTags()).map(key=>[key,manual[key]||auto[key]||RotapfelDashboardManager.externalResources[key]||'']));
  }
  resourceStatus(){
    const auto=this._haResources||{},manual=this.manualResources(),values=this.readResources();
    return Object.entries(this.resourceTags()).map(([key,tag])=>({key,tag,
      registered:!!customElements.get(tag),url:values[key],
      source:manual[key]?'Manuell':auto[key]?'Home Assistant':'Nicht gefunden'}));
  }
  async resourceManager(){
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;background:#0009;z-index:9999;display:grid;place-items:center;padding:16px';
    const esc=x=>this.esc(x),labels=this.resourceNames();
    overlay.innerHTML=`<div style="background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);padding:22px;border-radius:14px;width:min(720px,96vw);max-height:90vh;overflow:auto"><h2>Custom-Card-Ressourcen</h2><p class="muted">Lese Home-Assistant-Ressourcen …</p></div>`;
    this.shadowRoot.appendChild(overlay);
    const draw=()=>{
      if(!overlay.isConnected)return;
      const values=this.readResources(),manual=this.manualResources(),status=this.resourceStatus();
      overlay.firstElementChild.innerHTML=`<h2>Custom-Card-Ressourcen</h2><p class="muted">Ressourcen aus Home Assistant werden automatisch erkannt. Ein manueller Pfad hat Vorrang. Ein leeres Feld nutzt die automatische Erkennung.</p>${status.map(({key,tag,registered,source})=>`<div style="padding:12px 0;border-bottom:1px solid #aaa5"><strong>${esc(labels[key])}</strong><span class="muted"> · ${esc(tag)} · ${registered?'Geladen':'Noch nicht geladen'} · ${esc(source)}</span><label>JavaScript-Ressource<input data-resource="${key}" value="${esc(manual[key]||'')}" placeholder="${esc(values[key]||'Automatisch erkennen')}"></label>${!manual[key]&&values[key]?`<p class="muted" style="overflow-wrap:anywhere">Erkannt: ${esc(values[key])}</p>`:''}</div>`).join('')}<p class="muted">Die automatische Erkennung erfolgt über die Home-Assistant-Ressourcenliste. Manuelle Überschreibungen gelten nur in diesem Browser.</p>${this._resourceDiscoveryError?`<p class="error">Ressourcenliste nicht abrufbar: ${esc(this._resourceDiscoveryError)}. Manuelle Eingabe bleibt möglich.</p>`:''}<div class="actions"><button id="resource-save">Speichern</button><button class="secondary" id="resource-refresh">Erneut suchen</button><button class="secondary" id="resource-close">Schließen</button></div><p id="resource-error" class="error"></p>`;
      overlay.querySelector('#resource-close').onclick=()=>overlay.remove();
      overlay.querySelector('#resource-refresh').onclick=async()=>{await this.discoverResources(true);draw();};
      overlay.querySelector('#resource-save').onclick=()=>{
        const next={};
        for(const field of overlay.querySelectorAll('[data-resource]')){
          const value=field.value.trim();
          if(value&&!this.validResourceUrl(value)){
            overlay.querySelector('#resource-error').textContent='Ungültiger lokaler Ressourcenpfad: '+value;return;
          }
          if(value)next[field.dataset.resource]=value;
        }
        try{localStorage.setItem('rotapfel_resources_alpha13',JSON.stringify(next));overlay.remove();this.render();}
        catch(err){overlay.querySelector('#resource-error').textContent='Speichern nicht möglich: '+String(err);}
      };
    };
    overlay.addEventListener('click',ev=>{if(ev.target===overlay)overlay.remove();});
    await this.discoverResources(true);draw();
  }
  async ensureExternalResource(c){
    const tag=this.externalConfig(c)?.type?.replace(/^custom:/,'');
    if(!tag)return false;
    if(customElements.get(tag))return true;
    await this.discoverResources();
    const url=this.readResources()[c.variant];
    if(!url)return false;
    // A single shared promise prevents multiple cards from injecting the same script.
    const cache=RotapfelDashboardManager._externalLoads ||= new Map();
    if(!cache.has(url)){
      cache.set(url,new Promise((resolve,reject)=>{
        const script=document.createElement('script');
        script.type='module';script.src=url;
        script.onload=()=>resolve();
        script.onerror=()=>reject(new Error('Ressource nicht erreichbar: '+url));
        document.head.appendChild(script);
      }));
    }
    try{await cache.get(url);}catch(err){cache.delete(url);throw err;}
    if(!customElements.get(tag)){
      await Promise.race([
        customElements.whenDefined(tag),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error(tag+' wurde nicht registriert')),8000))
      ]);
    }
    return !!customElements.get(tag);
  }
  async discoverCustomCardTypes(force=false){
    if(!force&&this._customCardCatalog?.length)return this._customCardCatalog;
    const types=new Set();
    const add=tag=>{
      tag=String(tag||'').trim().replace(/^custom:/,'').toLowerCase();
      if(/^[a-z][a-z0-9-]*-card$/.test(tag)||/^[a-z][a-z0-9-]*-entities$/.test(tag))
        types.add('custom:'+tag);
    };
    // Lovelace custom cards may register metadata in the global customCards
    // catalog, even when the browser cannot enumerate customElements.
    for(const item of (Array.isArray(window.customCards)?window.customCards:[])){
      add(item?.type);
      add(item?.name?.toLowerCase().replace(/\\s+/g,'-'));
    }
    if(typeof customElements.getNames==='function')
      for(const name of customElements.getNames())add(name);
    // Include card types already configured in this manager, even when their
    // resource is not loaded in the current browser session.
    for(const dashboard of (this.data?.dashboards||[]))
      for(const tab of (dashboard.tabs||[]))
        for(const room of (tab.rooms||[]))
          for(const card of (room.cards||[]))add(card.custom_config?.type);
    const families={
      mushroom:['entity','template','light','climate','cover','fan','person','title','chips','number','select','update','vacuum','alarm-control-panel','media-player','humidifier','lock'],
      button:['button-card'],mini:['mini-graph-card','mini-media-player'],apexcharts:['apexcharts-card'],
      'auto-entities':['auto-entities'],'stack-in-card':['stack-in-card'],
      'layout-card':['layout-card'],'weather-chart':['weather-chart-card']
    };
    try{
      const response=await this._hass.callWS({type:'lovelace/resources'});
      const resources=Array.isArray(response)?response:Array.isArray(response?.resources)?response.resources:[];
      for(const item of resources){
        const url=String(typeof item==='string'?item:item?.url||'').toLowerCase();
        if(!this.validResourceUrl(url))continue;
        for(const [family,names] of Object.entries(families))
          if(url.includes(family))for(const name of names)
            add(family==='mushroom'?'mushroom-'+name+'-card':name);
        // Many Marketplace/HACS resources use their card's element name as
        // the JS bundle filename. Infer only clear -card filenames.
        const filename=url.split('?')[0].split('/').pop()?.replace(/\\.(?:min\\.)?m?js$/,'');
        if(filename)add(filename);
      }
    }catch(err){console.warn('Rotapfel: Custom-Card-Katalog',err);}
    // Read-only Marketplace reconciliation. Marketplace lists installed
    // repositories, not individual custom-element tags; never treat a
    // repository name as a guaranteed usable card type.
    try{
      const repositories=await this._hass.callWS({type:'marketplace/repositories/list',categories:['plugin']});
      if(Array.isArray(repositories)){
        const installed=repositories.filter(item=>item?.installed===true);
        const resourcesResponse=await this._hass.callWS({type:'lovelace/resources'});
        const resourceList=Array.isArray(resourcesResponse)?resourcesResponse:Array.isArray(resourcesResponse?.resources)?resourcesResponse.resources:[];
        const resourceUrls=resourceList.map(item=>String(typeof item==='string'?item:item?.url||'').toLowerCase());
        this._marketplaceCardReport={
          installed:installed.length,
          matched:installed.filter(item=>{
            const candidates=[item.full_name?.split('/').pop(),item.name,item.file_name]
              .filter(Boolean).map(value=>String(value).toLowerCase().replace(/\\.(?:min\\.)?m?js$/,''));
            return candidates.some(value=>value.length>3&&resourceUrls.some(url=>url.includes(value)));
          }).length,
          repositories:installed.map(item=>({name:item.name||item.full_name||item.id,full_name:item.full_name,installed_version:item.installed_version}))
        };
      }
    }catch(err){
      // Non-admin users or older HA versions may not expose this endpoint.
      this._marketplaceCardReport=null;
      console.info('Rotapfel: Marketplace-Abgleich nicht verfügbar',err);
    }
    // Explicitly known integrated cards remain selectable.
    ['equinox-card','climate-cluster-card','rotapfel-simple-thermcard'].forEach(add);
    this._customCardCatalog=[...types].sort((a,b)=>a.localeCompare(b,'de'));
    return this._customCardCatalog;
  }
  refreshCustomCardCatalog(force=false){
    if(!this._hass)return Promise.resolve(this._customCardCatalog||[]);
    const now=Date.now();
    if(this._customCardCatalogPending)return this._customCardCatalogPending;
    if(!force&&this._customCardCatalogUpdatedAt&&now-this._customCardCatalogUpdatedAt<60000)
      return Promise.resolve(this._customCardCatalog||[]);
    this._customCardCatalogPending=this.discoverCustomCardTypes(true)
      .then(types=>{this._customCardCatalogUpdatedAt=Date.now();return types;})
      .catch(err=>{console.warn('Rotapfel: Automatischer Kartenabgleich',err);return this._customCardCatalog||[];})
      .finally(()=>{this._customCardCatalogPending=null;});
    return this._customCardCatalogPending;
  }
  async ensureGenericCustomResource(tag){
    if(customElements.get(tag))return true;
    if(!/^[a-z][a-z0-9-]*-[a-z0-9-]+$/.test(tag))throw Error('Ungültiger Custom-Card-Typ: '+tag);
    // Generic cards do not belong to the three built-in resource mappings.
    // Locate their registered Lovelace module by family (e.g. mushroom-*).
    const family=tag.split('-')[0].toLowerCase();
    let response;
    try{response=await this._hass.callWS({type:'lovelace/resources'});}
    catch(err){throw Error('Lovelace-Ressourcen konnten nicht gelesen werden: '+String(err));}
    const list=Array.isArray(response)?response:Array.isArray(response?.resources)?response.resources:[];
    const urls=list.map(item=>typeof item==='string'?item:item?.url)
      .filter(url=>this.validResourceUrl(url))
      .filter(url=>new RegExp('(?:^|[/_.-])'+family+'(?:[/_.-]|$)','i').test(url.split('?')[0]));
    if(!urls.length)throw Error('Keine Lovelace-Ressource für '+tag+' gefunden. Bitte unter Einstellungen → Dashboards → Ressourcen prüfen.');
    const cache=RotapfelDashboardManager._externalLoads ||= new Map();
    for(const url of urls){
      if(!cache.has(url)){
        cache.set(url,new Promise((resolve,reject)=>{
          const script=document.createElement('script');script.type='module';script.src=url;
          script.onload=resolve;script.onerror=()=>reject(new Error('Ressource nicht erreichbar: '+url));
          document.head.appendChild(script);
        }));
      }
      try{await cache.get(url);}catch(err){cache.delete(url);throw err;}
      if(customElements.get(tag))return true;
    }
    throw Error('Ressource geladen, aber '+tag+' wurde nicht registriert. Geprüfte Ressourcen: '+urls.join(', '));
  }
  mountThermPreview(box,card){
    if(!box||!card)return;
    const frame=document.createElement('div');
    frame.style.cssText='pointer-events:none;user-select:none;width:142.857%;transform:scale(.7);transform-origin:top left;overflow:visible;';
    frame.appendChild(card);
    box.replaceChildren(frame);
    box.style.overflow='hidden';
    const measure=()=>{
      if(!frame.isConnected)return;
      const roots=[card.shadowRoot].filter(Boolean);
      let height=Math.max(card.offsetHeight||0,card.scrollHeight||0);
      for(let i=0;i<roots.length&&i<16;i++){
        const root=roots[i];
        for(const el of root.querySelectorAll('.hd,.hd-c,.ha-surface')){
          height=Math.max(height,el.offsetHeight||0,el.scrollHeight||0);
        }
        for(const el of root.querySelectorAll('*'))if(el.shadowRoot)roots.push(el.shadowRoot);
      }
      if(height>0)box.style.height=Math.ceil(height*.7+12)+'px';
    };
    requestAnimationFrame(()=>requestAnimationFrame(measure));
    // Custom card contents can render asynchronously after hass is assigned.
    if(typeof ResizeObserver!=='undefined'){
      const observer=new ResizeObserver(measure);
      observer.observe(card);
      // Observe only the active card; disconnect the previous preview observer.
      if(box._thermPreviewObserver)box._thermPreviewObserver.disconnect();
      box._thermPreviewObserver=observer;
    }
  }
  applyThermColors(host,opts={}){
    if(!host)return;
    // The bundled ThermCard defines its palette inside its own shadow root.
    // Variables set only on the custom-element host lose to theme rules
    // applied to the inner .hd element. Override that actual surface.
    const bg=/^#[0-9a-fA-F]{6}$/.test(opts.therm_background||'')?opts.therm_background:null;
    const fg=/^#[0-9a-fA-F]{6}$/.test(opts.therm_text||'')?opts.therm_text:null;
    const css=(bg?'.hd,.hd-c{--card:'+bg+' !important;} .hd{background:'+bg+' !important;border-radius:24px !important;overflow:hidden !important;}':'')+
      (fg?'.hd,.hd-c{--ink:'+fg+' !important;--on-accent:'+fg+' !important;color:'+fg+' !important;} .hd-name,.hd-name .hd-open,.hd-open>span,.hd-pill,.hd-pill[aria-pressed=true],.hd-pill-w,.hd-pill-x,.hd-slot .hd-pill,.hd-slot .hd-pill *,.hd-slot [class*="slider"] *, .hd-slot [class*="track"] *{color:'+fg+' !important;}':'');
    const apply=()=>{
      const roots=[host.shadowRoot].filter(Boolean);
      for(let i=0;i<roots.length&&i<24;i++){
        const root=roots[i];
        let style=root.querySelector('style[data-rotapfel-therm-colors]');
        if(!style){style=document.createElement('style');style.dataset.rotapfelThermColors='1';root.appendChild(style);}
        style.textContent=css;
        for(const el of root.querySelectorAll('*'))if(el.shadowRoot)roots.push(el.shadowRoot);
      }
      return roots.length>0;
    };
    if(!apply()){
      let attempts=0;
      const retry=()=>{if(!host.isConnected||apply()||++attempts>=12)return;requestAnimationFrame(retry);};
      requestAnimationFrame(retry);
    }
  }
  async mountExternalCard(slot,c){
    if(slot.dataset.loading==='1'||slot.dataset.mounted==='1')return;
    slot.dataset.loading='1';
    const isCustom=c.type==='custom';
    const cfg=isCustom?c.custom_config:this.externalConfig(c),tag=cfg?.type?.replace(/^custom:/,'');
    try{
      if(isCustom){
        if(!cfg||typeof cfg.type!=='string'||!cfg.type.startsWith('custom:'))throw Error('Custom-Card-Konfiguration fehlt. Bitte Karte erneut konfigurieren.');
        if(!slot.isConnected||slot.dataset.externalCard!==c.id)return;
        // Match the published Lovelace renderer: instantiate the registered
        // custom element directly instead of the editor-only card helper.
        await this.ensureGenericCustomResource(tag);
        if(!slot.isConnected||slot.dataset.externalCard!==c.id)return;
        const el=document.createElement(tag);
        if(typeof el.setConfig!=='function')throw Error('setConfig fehlt bei '+tag);
        el.setConfig(structuredClone(cfg));
        if(el.localName==='hui-error-card'||el.localName==='hui-warning'){
          const message=el._error?.message||el.error?.message||el._config?.error||el._config?.message||'Home Assistant hat die Kartenkonfiguration abgelehnt.';
          const resourceHint=!customElements.get(tag)?' Der Kartentyp '+tag+' ist im Browser nicht registriert. Bitte die Mushroom-Ressource in Home Assistant prüfen.':'';
          throw Error(String(message)+resourceHint);
        }
        el.hass=this._hass;
        slot.replaceChildren(el);
        slot.dataset.mounted='1';
        if(slot.closest('.room-card-item'))requestAnimationFrame(()=>requestAnimationFrame(()=>this.fitRoomCardPreviews()));
        return;
      }
      if(!await this.ensureExternalResource(c)){
        slot.textContent=`${cfg.type} ist nicht geladen. Bitte HACS-Ressource prüfen.`;
        return;
      }
      if(!slot.isConnected||slot.dataset.externalCard!==c.id)return;
      const el=document.createElement(tag);
      if(typeof el.setConfig!=='function')throw Error('setConfig nicht verfügbar');
      el.setConfig(cfg);
      if(c.variant==='rotapfel_simple_thermcard')this.applyThermColors(el,c.external_options);
      el.hass=this._hass;
      slot.replaceChildren(el);
      slot.dataset.mounted='1';
      if(slot.closest('.room-card-item'))requestAnimationFrame(()=>requestAnimationFrame(()=>this.fitRoomCardPreviews()));
    }catch(err){
      if(slot.isConnected)slot.textContent=`Karte konnte nicht geladen werden: ${String(err)}`;
    }finally{delete slot.dataset.loading;}
  }
  mountExternalCards(){
    if(!this._hass||!this.layout)return;
    const cards=this.layout.flatMap(t=>(t.rooms||[]).flatMap(r=>r.cards||[]));
    for(const slot of this.shadowRoot.querySelectorAll('[data-external-card]')){
      const c=cards.find(x=>x.id===slot.dataset.externalCard);
      if(c)this.mountExternalCard(slot,c);
    }
  }
  // Room-list previews use their own proportional fit. Unlike the canvas,
  // their frame has no persisted dimensions and may grow with the scaled card.
  fitRoomCardPreviews(){
    const root=this.shadowRoot;
    if(!root)return;
    for(const item of root.querySelectorAll('.room-card-item')){
      const slot=item.querySelector('.external-card-slot');
      const host=slot?.firstElementChild;
      if(!slot||!host||slot.dataset.mounted!=='1')continue;
      const card=(this.layout||[]).flatMap(t=>(t.rooms||[]).flatMap(r=>r.cards||[])).find(c=>c.id===slot.dataset.externalCard);
      const kind=card&&(this.externalVariant(card)||(card.type==='custom'?'generic_custom':null));
      if(!kind)continue;
      const preview=item.querySelector('.external-card-preview');
      if(!preview)continue;
      const available=Math.max(100,preview.clientWidth-8);
      const surface=this.findExternalSurface(host);
      const nativeWidth=kind==='climate_cluster'?850:kind==='equinox'?430:400;
      const width=Math.max(100,nativeWidth);
      // Measure before transform; offset dimensions do not include scaling.
      const height=Math.max(kind==='climate_cluster'?400:kind==='equinox'?260:180,
        host.offsetHeight||0,host.scrollHeight||0,
        surface?.offsetHeight||0);
      const scale=Math.min(1,available/width,244/height);
      const fittedHeight=Math.max(35,Math.ceil(height*scale));
      slot.style.setProperty('position','relative','important');
      slot.style.setProperty('width',width+'px','important');
      slot.style.setProperty('min-width',width+'px','important');
      slot.style.setProperty('max-width','none','important');
      slot.style.setProperty('height',height+'px','important');
      slot.style.setProperty('max-height','none','important');
      slot.style.setProperty('overflow','visible','important');
      slot.style.transformOrigin='top left';
      slot.style.transform=`scale(${scale})`;
      preview.style.setProperty('height',fittedHeight+8+'px','important');
      preview.style.setProperty('max-height','none','important');
      preview.style.setProperty('overflow','hidden','important');
      slot.dataset.fitScale=String(scale);
    }
  }
  watchRoomCardPreviews(){
    this._roomCardObserver?.disconnect();
    const root=this.shadowRoot;
    const slots=[...(root?.querySelectorAll('.room-card-item .external-card-slot')||[])];
    if(!slots.length)return;
    let pending=false;
    const fit=()=>{
      if(pending)return;
      pending=true;
      requestAnimationFrame(()=>{pending=false;this.fitRoomCardPreviews();});
    };
    const observer=new ResizeObserver(fit);
    for(const slot of slots){
      observer.observe(slot.closest('.room-card-item'));
      if(slot.firstElementChild)observer.observe(slot.firstElementChild);
    }
    this._roomCardObserver=observer;
    requestAnimationFrame(()=>requestAnimationFrame(fit));
  }
  updateExternalCards(){
    for(const slot of this.shadowRoot?.querySelectorAll('[data-external-card]')||[]){
      const el=slot.firstElementChild;
      if(slot.dataset.mounted==='1'&&el&&this._hass)try{el.hass=this._hass;}catch(err){}
    }
  }
  configureThermostat(c,change){
    const overlay=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;background:#0009;z-index:9999;display:grid;place-items:center;padding:16px';
    const esc=x=>this.esc(x),opts=c.external_options||{};
    const fields=c.variant==='equinox'?[['temperature_entity','Temperatursensor'],['humidity_entity','Feuchtigkeitssensor'],['power_entity','Energiesensor'],['name','Anzeigename in der Karte']]:
      c.variant==='climate_cluster'?[['name','Anzeigename in der Karte']]:
      c.variant==='rotapfel_simple_thermcard'?[['card_name','Kurzer Anzeigename (z. B. Heizung)']]:[];
    const thermFields=c.variant==='rotapfel_simple_thermcard'?`<label>Darstellung<select data-opt="card_footprint"><option value="">Standard der Karte</option>${['compact','standard','featured'].map(v=>`<option value="${v}" ${opts.card_footprint===v?'selected':''}>${v==='compact'?'Kompakt':v==='standard'?'Standard':'Hervorgehoben'}</option>`).join('')}</select></label><label>Temperatursteuerung<select data-opt="card_show_control"><option value="">Standard der Karte</option><option value="true" ${opts.card_show_control===true?'selected':''}>Anzeigen</option><option value="false" ${opts.card_show_control===false?'selected':''}>Ausblenden</option></select></label><label>Verlauf<select data-opt="card_history"><option value="">Standard der Karte</option><option value="true" ${opts.card_history===true?'selected':''}>Aktivieren</option><option value="false" ${opts.card_history===false?'selected':''}>Deaktivieren</option></select></label><label>Uhrzeit anzeigen<select data-opt="show_time"><option value="">Standard der Karte</option>${["true","false"].map(v=>`<option value="${v}" ${String(opts.show_time)===v?"selected":""}>${v==="true"?"Ja":"Nein"}</option>`).join("")}</select></label><label>Reduzierte Darstellung<select data-opt="quiet"><option value="">Standard der Karte</option>${["true","false"].map(v=>`<option value="${v}" ${String(opts.quiet)===v?"selected":""}>${v==="true"?"Aktivieren":"Deaktivieren"}</option>`).join("")}</select></label>`:'';
    overlay.innerHTML=`<div style="background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);padding:22px;border-radius:14px;width:min(550px,96vw);max-height:90vh;overflow:auto"><h2>Thermostatkarte konfigurieren</h2><p>${esc(this.resourceNames()[c.variant]||c.variant)} · ${esc(c.entity_id)}</p>${fields.map(([k,label])=>`<label>${label}<input data-opt="${k}" value="${esc(opts[k]||'')}" placeholder="sensor...."></label>`).join('')}${thermFields}${c.variant==='rotapfel_simple_thermcard'?'<strong>Live-Vorschau (70 %)</strong><div id="thermo-live-preview" style="margin:12px 0;min-height:110px;overflow:hidden"></div>':''}<p class="muted">Die Originalkarte wird über ihre Home-Assistant-Ressource geladen. Bei Rotapfel Simple ThermCard wirkt der kurze Anzeigename auf neu angelegte Karten ohne eigene rows-Konfiguration.</p><div class="actions"><button id="thermo-save">Übernehmen</button><button class="secondary" id="thermo-cancel">Abbrechen</button></div></div>`;
    this.shadowRoot.appendChild(overlay);
    const readOptions=()=>{
      const next={...opts};
      for(const input of overlay.querySelectorAll('[data-opt]')){
        const value=input.value.trim();
        if(value)next[input.dataset.opt]=['card_show_control','card_history','show_time','quiet'].includes(input.dataset.opt)?value==='true':value;
        else delete next[input.dataset.opt];
      }
      return next;
    };
    const updateLive=()=>{
      if(c.variant!=='rotapfel_simple_thermcard')return;
      const box=overlay.querySelector('#thermo-live-preview');
      if(!box)return;
      const draft={...c,external_options:readOptions()};
      const config=this.externalConfig(draft),tag=config.type.replace(/^custom:/,'');
      if(!customElements.get(tag)){this.ensureExternalResource(c).then(()=>{if(overlay.isConnected)updateLive();});return;}
      try{
        const card=document.createElement(tag);
        card.setConfig(config);
        if(this._hass)card.hass=new Proxy(this._hass,{get(target,key){
          if(['callService','callApi','callWS'].includes(key))return ()=>Promise.reject(new Error('Vorschau: Steuerung deaktiviert'));
          const value=Reflect.get(target,key,target);
          return typeof value==='function'?value.bind(target):value;
        }});
        this.applyThermColors(card,draft.external_options);
        this.mountThermPreview(box,card);
      }catch(err){box.textContent='Vorschau nicht verfügbar: '+String(err);}
    };
    overlay.querySelectorAll('[data-opt]').forEach(input=>{input.addEventListener('input',updateLive);input.addEventListener('change',updateLive);});
    overlay.querySelector('#thermo-cancel').onclick=()=>overlay.remove();
    overlay.querySelector('#thermo-save').onclick=()=>{c.external_options=readOptions();overlay.remove();change();};
    updateLive();
  }
  climateLimits(c){
    const a=this.cardState(c)?.attributes||{};
    const n=(v,f)=>Number.isFinite(Number(v))?Number(v):f;
    return {min:n(a.min_temp,7),max:n(a.max_temp,35),step:Math.max(0.1,n(a.target_temp_step,0.5))};
  }
  climateMarkup(c,st){
    const e=v=>this.esc(v),a=st?.attributes||{},limits=this.climateLimits(c);
    const target=Number(a.temperature),hasTarget=a.temperature!=null&&Number.isFinite(target);
    const current=Number(a.current_temperature),hasCurrent=a.current_temperature!=null&&Number.isFinite(current);
    const mode=st?.state||'unavailable';
    const allowed=Array.isArray(a.hvac_modes)?a.hvac_modes:[];
    const operable=!!st&&!['unavailable','unknown'].includes(mode);
    return `<div class="climate-controls" data-climate-controls="${e(c.id)}">
      <div class="climate-values"><span>Ist: <b>${hasCurrent?e(current.toFixed(1))+' °C':'–'}</b></span><span>Soll: <b>${hasTarget?e(target.toFixed(1))+' °C':'–'}</b></span></div>
      <div class="climate-actions">
        <button type="button" class="climate-step" data-climate-step="-1" data-climate-id="${e(c.id)}" ${!operable||!hasTarget?'disabled':''} aria-label="Solltemperatur senken">−</button>
        <button type="button" class="climate-step" data-climate-step="1" data-climate-id="${e(c.id)}" ${!operable||!hasTarget?'disabled':''} aria-label="Solltemperatur erhöhen">+</button>
        ${['heat','off'].filter(m=>allowed.includes(m)).map(m=>`<button type="button" class="climate-mode ${mode===m?'active':''}" data-climate-mode="${m}" data-climate-id="${e(c.id)}" ${!operable?'disabled':''}>${m==='heat'?'Heizen':'Aus'}</button>`).join('')}
      </div></div>`;
  }
  bindClimateControls(){
    this.shadowRoot?.querySelectorAll('[data-climate-id]').forEach(b=>{
      if((b.closest('.rotapfel-position-overlay')&&!b.closest('.position-test-active'))||(b.closest('.canvas-preview')&&!this._roomTestMode))return;
      b.onclick=async ev=>{
        ev.preventDefault();ev.stopPropagation();
        if(b.disabled||b.dataset.busy)return;
        const c=this.layout?.flatMap(t=>(t.rooms||[]).flatMap(r=>r.cards||[])).find(c=>c.id===b.dataset.climateId);
        if(!c||this.cardKind(c)!=='climate'||!this._hass)return;
        const st=this.cardState(c);if(!st||['unknown','unavailable'].includes(st.state))return;
        let service,data;
        if(b.dataset.climateStep){
          const target=Number(st.attributes?.temperature);
          if(!Number.isFinite(target))return;
          const {min,max,step}=this.climateLimits(c);
          const value=Math.round(Math.max(min,Math.min(max,target+Number(b.dataset.climateStep)*step))*100)/100;
          if(value===target)return;
          service='set_temperature';data={entity_id:c.entity_id,temperature:value};
        }else{
          const mode=b.dataset.climateMode;
          if(!['heat','off'].includes(mode)||!st.attributes?.hvac_modes?.includes(mode))return;
          service='set_hvac_mode';data={entity_id:c.entity_id,hvac_mode:mode};
        }
        b.dataset.busy='1';b.disabled=true;
        try{await this._hass.callService('climate',service,data);}
        catch(err){this.error='Thermostatsteuerung fehlgeschlagen: '+String(err);alert(this.error);}
        finally{delete b.dataset.busy;b.disabled=false;}
      };
    });
  }
  design(c){const x=c.design||{};return {width:Math.min(4,Math.max(1,Number(x.width)||2)),height:Math.min(320,Math.max(76,Number(x.height)||110)),bg:/^#[0-9a-fA-F]{6}$/.test(x.bg||'')?x.bg:(this.theme==='dark'?'#293241':'#e5e7eb'),fg:/^#[0-9a-fA-F]{6}$/.test(x.fg||'')?x.fg:(this.theme==='dark'?'#f4f5f7':'#202124'),accent:/^#[0-9a-fA-F]{6}$/.test(x.accent||'')?x.accent:'#009ac4'};}
  cardVisualStyle(c){
    if(this.externalVariant(c)&&!['wrapper','sync'].includes(c.design?.external_mode||'original'))return '';
    const d=this.design(c),v=c.design||{},alpha=Math.max(0,Math.min(100,Number(v.opacity??100)))/100;
    const rgb=[1,3,5].map(i=>parseInt(d.bg.slice(i,i+2),16));
    const shadow=v.shadow==='strong'?'0 12px 26px #0006':v.shadow==='soft'?'0 4px 12px #0003':'none';
    const clamp=(n,a,b,def)=>Math.min(b,Math.max(a,Number.isFinite(Number(n))?Number(n):def));
    return `background-color:rgba(${rgb.join(',')},${alpha})!important;border:${clamp(v.border_width,0,12,0)}px solid ${/^#[0-9a-f]{6}$/i.test(v.border_color||'')?v.border_color:'#64748b'}!important;border-radius:${clamp(v.radius,0,48,12)}px!important;box-shadow:${shadow}!important;font-size:${clamp(v.font_size,10,32,14)}px;text-align:${['left','center','right'].includes(v.text_align)?v.text_align:'left'};`;
  }
  renderPreview(c){
    const e=s=>this.esc(s),kind=this.cardKind(c),st=this.cardState(c),state=st?.state||'unavailable';
    if(this.externalVariant(c)||c.type==='custom'){
      const design=this.design(c);
      return `<div class="nexus-preview external-card-preview ${this.autoCardHeight(c)?'auto-card-height':'manual-card-height'}" style="${this.cardVisualStyle(c)}--card-bg:${design.bg};--card-fg:${design.fg};min-height:${this.autoCardHeight(c)?160:design.height}px;--manual-height:${design.height}px" data-preview="${e(c.id)}" data-wrapper="${['wrapper','sync'].includes(c.design?.external_mode||'original')?'true':'false'}"><div class="external-card-slot" data-external-card="${e(c.id)}">Lade ${e(c.type==='custom'?(c.custom_config?.type||c.custom?.card_type||'Custom Card'):c.variant)} …</div></div>`;
    }
    const cls=kind==='window'&&['window','door','opening','garage_door'].includes(st?.attributes?.device_class)?(state==='off'?'closed':state==='on'?'open':'unknown'):(state==='on'?'on':state==='off'?'off':'unknown');
    const icon={light:'💡',switch:'⏻',window:'▣',sensor:'◉',climate:'♨',cover:'▤',placeholder:'▧',custom:'◇',entity:'◈'}[kind];
    const design=this.design(c);const showName=c.display?.show_name!==false;const showId=c.display?.show_entity_id===true;const toggle=['light','switch'].includes(kind)&&['on','off'].includes(state);
    return `<div class="nexus-preview ${e(kind)} ${e(cls)}" style="${this.cardVisualStyle(c)}--card-bg:${design.bg};--card-fg:${design.fg};--card-accent:${design.accent};min-height:${design.height}px" data-preview="${e(c.id)}"><div class="nexus-icon">${icon}</div><div class="nexus-details">${showName?`<strong>${e(c.title)}</strong>`:""}${showId?`<small>${e(c.entity_id||'Noch keine Entität')}</small>`:""}<span class="nexus-state" data-state="${e(c.id)}">${e(c.type==='custom'?'Custom Card – Import vorbereitet':this.stateLabel(c))}</span></div>${toggle?`<button class="nexus-toggle" data-toggle="${e(c.id)}" title="${state==='on'?'Ausschalten':'Einschalten'}">${state==='on'?'Ein':'Aus'}</button>`:''}${kind==='climate'?this.climateMarkup(c,st):''}</div>`;
  }
  refreshStates(){
    const root=this.shadowRoot;if(!root||!this.layout)return;
    for(const tab of this.layout)for(const room of (tab.rooms||[]))for(const c of (room.cards||[])){
      for(const el of root.querySelectorAll('[data-preview]')){
        if(el.dataset.preview!==c.id||this.externalVariant(c)||c.type==='custom')continue;
        const next=document.createElement('template');next.innerHTML=this.renderPreview(c);
        el.replaceWith(next.content.firstElementChild);
      }
    }
    this.bindToggles();this.bindClimateControls();this.updateExternalCards();
  }
  bindToggles(){
    this.shadowRoot?.querySelectorAll('[data-toggle]').forEach(b=>{if((b.closest('.rotapfel-position-overlay')&&!b.closest('.position-test-active'))||(b.closest('.canvas-preview')&&!this._roomTestMode))return;if(b.dataset.rotapfelToggleBound)return;b.dataset.rotapfelToggleBound='1';b.addEventListener('click',async(ev)=>{
      ev.preventDefault();ev.stopPropagation();
      if(b.dataset.busy==='1')return;
      b.dataset.busy='1';
      const c=this.layout?.flatMap(t=>(t.rooms||[]).flatMap(r=>r.cards||[])).find(c=>c.id===b.dataset.toggle);
      if(!c)return;
      const kind=this.cardKind(c),domain=c.entity_id.split('.')[0];
      if(!['light','switch'].includes(kind))return;
      b.disabled=true;
      try{await this._hass.callService(domain,'toggle',{entity_id:c.entity_id});}
      catch(err){this.error='Schalten fehlgeschlagen: '+String(err);this.render();}
      finally{b.disabled=false;delete b.dataset.busy;}
    });});
  }
  uid(){return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;}
  async api(action,data){return this._hass.callApi(data?'POST':'GET',`rotapfel_dashboard_manager/${action}`,data);}
  async load(){try{this.items=(await this.api('dashboards')).dashboards;this.error='';}catch(e){this.error=String(e);}this.render();this.refreshCustomCardCatalog();}
  async act(action,data){try{this.items=(await this.api(action,data)).dashboards;this.error='';return true;}catch(e){this.error=String(e);this.render();return false;}}
  migrateLegacyThermCards(tabs){
    let count=0;
    for(const tab of tabs||[])for(const room of tab.rooms||[])for(const card of room.cards||[]){
      if(card.variant!=='dashhaus_orb')continue;
      card.variant='rotapfel_simple_thermcard';
      // Preserve entity, title, design, position and all compatible external options.
      if(card.external_options?.type==='custom:dashhaus-orb')delete card.external_options.type;
      count++;
    }
    return count;
  }
  async persistMigration(count){
    if(!count)return;
    const ok=await this.act('save_layout',{id:this.editing,tabs:this.layout,theme:this.theme,canvas:this.canvas,deviceProfiles:this.deviceProfiles});
    if(ok){this.dirty=false;this._migrationMessage=`${count} bisherige ThermCard-Karte(n) automatisch umgewandelt und gespeichert.`;}
    else{this.dirty=true;this._migrationMessage='Umwandlung vorbereitet, aber Speichern fehlgeschlagen. Bitte „Layout speichern“ versuchen.';}
    this.render();
  }
  exportDashboard(d){
    // JSON is a YAML 1.2 subset and is accepted by Home Assistant's YAML loader.
    // Keep the exported document entirely independent from manager storage.
    const fallback={width:1920,height:1080,columns:12,gap:8};
    const warnings=[],views=[];
    for(const tab of d.tabs||[]){
      const canvas={...fallback,...(d.canvas||{}),...(tab.canvas||{})};
      const elements=[];
      for(const room of tab.rooms||[])for(const c of room.cards||[]){
        const pos=c.position||{};
        const design=this.design(c);
        const w=Math.max(1,Number(pos.w??pos.width??design.width*240)||240);
        const h=Math.max(1,Number(pos.h??pos.height??design.height)||110);
        const x=Math.max(0,Number(pos.x)||0),y=Math.max(0,Number(pos.y)||0);
        let card;
        if(this.externalVariant(c)){
          card=this.externalConfig(c);
        }else if(c.type==='custom'&&c.custom_config&&typeof c.custom_config==='object'){
          card=structuredClone(c.custom_config);
        }else if(c.type==='entity'&&c.entity_id){
          card={type:'custom:rotapfel-entity-card',entity:c.entity_id,name:c.title,design:structuredClone(c.design||{}),display:structuredClone(c.display||{})};
        }else{
          card={type:'markdown',content:c.title||'Platzhalter'};
        }
        if(!card||typeof card!=='object'||typeof card.type!=='string'){
          warnings.push('Karte '+c.title+' hat keine gültige Konfiguration.');
          continue;
        }
        const layouts={};
        for(const profile of Object.keys(this.normalizedProfiles(d.deviceProfiles,canvas))){
          const p=c.deviceLayouts?.[profile]||pos;
          layouts[profile]={x:Math.max(0,Number(p.x??x)||0),y:Math.max(0,Number(p.y??y)||0),w:Math.max(1,Number(p.w??w)||w),h:Math.max(1,Number(p.h??h)||h),z:Math.max(0,Math.round(Number(p.z??pos.z)||0))};
        }
        elements.push({room_id:room.id,x,y,w,h,z:Math.max(0,Math.round(Number(pos.z)||0)),device_layouts:layouts,card,design:c.design||{},display:c.display||{},therm_scale:this.externalVariant(c)==='rotapfel_simple_thermcard'&&Number(pos.thermScale)>0?Number(pos.thermScale):null});
      }
      const path=(tab.name||'tab').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'tab';
      views.push({title:tab.name||'Tab',path:path+'-'+String(tab.id||'').slice(0,6),type:'panel',cards:[{type:'custom:rotapfel-canvas-card',canvas_width:canvas.width,canvas_height:canvas.height,device_profiles:this.normalizedProfiles(d.deviceProfiles,canvas),show_mobile_layout_selector:canvas.show_mobile_layout_selector===true,rooms:(tab.rooms||[]).map(r=>({id:r.id,name:r.name})),elements}]});
    }
    return {yaml:{title:d.name,views},warnings};
  }
  async compareDashboardVersions(d,leftId,rightId){
    const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const errText=e=>String(e?.message||e?.body?.message||JSON.stringify(e)||e);
    try{
      const load=async id=>(await this._hass.callApi('GET','rotapfel_dashboard_manager/dashboard_version_snapshot?id='+encodeURIComponent(d.id)+'&version_id='+encodeURIComponent(id))).snapshot;
      const [a,b]=await Promise.all([load(leftId),load(rightId)]);
      const stable=v=>JSON.stringify(v===undefined?null:v);
      const collect=s=>{
        const tabs=new Map(),rooms=new Map(),cards=new Map();
        (s.tabs||[]).forEach((t,ti)=>{
          const tk=String(t.id||'tab_'+ti);tabs.set(tk,{name:t.name||'Tab',value:t});
          (t.rooms||[]).forEach((r,ri)=>{
            const rk=String(r.id||tk+'_room_'+ri);rooms.set(rk,{name:(t.name||'Tab')+' / '+(r.name||'Raum'),value:r});
            (r.cards||[]).forEach((c,ci)=>{const ck=String(c.id||rk+'_card_'+ci);cards.set(ck,{name:(c.name||c.title||c.card?.name||c.card?.type||'Karte')+' · '+(r.name||'Raum'),value:c});});
          });
        });
        (s.cards||[]).forEach((c,i)=>{const ck=String(c.id||'root_card_'+i);if(!cards.has(ck))cards.set(ck,{name:c.name||c.title||'Karte',value:c});});
        return {tabs,rooms,cards};
      };
      const A=collect(a),B=collect(b);
      const sections=[];
      for(const [label,key] of [['Tabs','tabs'],['Räume','rooms'],['Karten','cards']]){
        const before=A[key],after=B[key],added=[],removed=[],changed=[];
        for(const [id,item] of after){if(!before.has(id))added.push(item.name);else if(stable(before.get(id).value)!==stable(item.value))changed.push(item.name);}
        for(const [id,item] of before)if(!after.has(id))removed.push(item.name);
        sections.push({label,added,removed,changed});
      }
      const metadata=[];
      for(const [key,label] of [['name','Dashboardname'],['profile','Profil'],['theme','Design'],['canvas','Arbeitsfläche'],['deviceProfiles','Geräteprofile']]){
        if(stable(a[key])!==stable(b[key]))metadata.push(label);
      }
      const changedPositions=[];
      for(const [id,item] of B.cards){
        const old=A.cards.get(id);if(!old)continue;
        const before=old.value,after=item.value;
        if(stable(before.position)!==stable(after.position)||stable(before.deviceLayouts)!==stable(after.deviceLayouts))changedPositions.push(item.name);
      }
      // Detailed differences, grouped by device profile. Read-only; no snapshot mutation.
      const profiles={fire_hd:'Fire HD 10',desktop:'Desktop',iphone:'iPhone'};
      for(const snapshot of [a,b])for(const [key,p] of Object.entries(snapshot.deviceProfiles||{}))profiles[key]=p?.name||key;
      const pretty=v=>v===undefined?'—':v===null?'—':typeof v==='object'?JSON.stringify(v):String(v);
      const details=[];
      const compareFields=(out,label,oldValue,newValue,keys)=>{
        for(const [key,title] of keys){
          const before=oldValue?.[key],after=newValue?.[key];
          if(stable(before)!==stable(after))out.push({label:label+' · '+title,before:pretty(before),after:pretty(after)});
        }
      };
      const geometry=[['x','X'],['y','Y'],['w','Breite'],['h','Höhe']];
      for(const [id,item] of B.cards){
        const old=A.cards.get(id);if(!old)continue;
        const before=old.value,after=item.value,changes=[];
        compareFields(changes,'Aktive Position',before.position,after.position,geometry);
        const layoutKeys=new Set([...Object.keys(before.deviceLayouts||{}),...Object.keys(after.deviceLayouts||{})]);
        for(const key of layoutKeys){
          const label=profiles[key]||key;
          const prev=before.deviceLayouts?.[key],next=after.deviceLayouts?.[key];
          if(prev===undefined||next===undefined){
            if(stable(prev)!==stable(next))changes.push({label:label+' · Profil-Layout',before:prev===undefined?'Nicht vorhanden':'Vorhanden',after:next===undefined?'Nicht vorhanden':'Vorhanden'});
          }else compareFields(changes,label,prev,next,geometry);
        }
        const ignored=new Set(['id','position','deviceLayouts']);
        const settings=new Set([...Object.keys(before),...Object.keys(after)].filter(key=>!ignored.has(key)));
        for(const key of settings){
          if(stable(before[key])!==stable(after[key]))changes.push({label:'Konfiguration · '+key,before:pretty(before[key]),after:pretty(after[key])});
        }
        if(changes.length)details.push({name:item.name,changes});
      }
      const clip=v=>String(v).length>260?String(v).slice(0,257)+'…':String(v);
      const detailsHtml=details.length?details.map(card=>`<details style="margin:9px 0;border:1px solid #9995;border-radius:8px;padding:10px"><summary style="cursor:pointer;font-weight:600">${esc(card.name)} · ${card.changes.length} Änderungen</summary><div style="overflow-x:auto;margin-top:8px"><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="text-align:left;padding:7px;border-bottom:1px solid #9995">Eigenschaft</th><th style="text-align:left;padding:7px;border-bottom:1px solid #9995">Vorher</th><th style="text-align:left;padding:7px;border-bottom:1px solid #9995">Nachher</th></tr></thead><tbody>${card.changes.map(ch=>`<tr><td style="padding:7px;border-bottom:1px solid #9993">${esc(ch.label)}</td><td style="padding:7px;border-bottom:1px solid #9993;overflow-wrap:anywhere">${esc(clip(ch.before))}</td><td style="padding:7px;border-bottom:1px solid #9993;overflow-wrap:anywhere">${esc(clip(ch.after))}</td></tr>`).join('')}</tbody></table></div></details>`).join(''):'<p style="opacity:.7">Keine Änderungen an bestehenden Karten.</p>';
      const row=(name,items)=>`<div style="margin:7px 0"><strong>${esc(name)} (${items.length})</strong>${items.length?`<ul style="margin:5px 0 0;padding-left:20px">${items.slice(0,40).map(x=>`<li>${esc(x)}</li>`).join('')}${items.length>40?`<li>… weitere ${items.length-40}</li>`:''}</ul>`:'<span style="opacity:.7"> – keine</span>'}</div>`;
      this.shadowRoot.querySelector('#rotapfel-compare-dialog')?.remove();
      const dlg=document.createElement('dialog');dlg.id='rotapfel-compare-dialog';
      dlg.style.cssText='max-width:min(720px,95vw);width:100%;max-height:85vh;overflow:auto;border:1px solid #999;border-radius:14px;padding:22px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#222)';
      dlg.innerHTML=`<h3>Versionsvergleich · ${esc(d.name)}</h3><p>Vergleich von <strong>${esc(leftId==='current'?'Aktueller Stand':'Version A')}</strong> mit <strong>${esc(rightId==='current'?'Aktueller Stand':'Version B')}</strong>. Änderungen werden von links nach rechts angezeigt.</p>${row('Allgemeine Einstellungen geändert',metadata)}${sections.map(sec=>`<section style="border-top:1px solid #9995;padding:10px 0"><strong>${esc(sec.label)}</strong>${row('Hinzugefügt',sec.added)}${row('Entfernt',sec.removed)}${row('Verändert',sec.changed)}</section>`).join('')}${row('Karten mit geänderten Positionen/Profil-Layouts',changedPositions)}<section style="border-top:1px solid #9995;padding:10px 0"><strong>Detaillierte Kartenänderungen</strong><p style="font-size:12px;opacity:.75">Karten aufklappen, um Vorher-/Nachher-Werte je Geräteprofil zu sehen.</p>${detailsHtml}</section><p style="font-size:12px;opacity:.75">Der Vergleich verändert keine Konfiguration. „Verändert“ umfasst auch Änderungen an verschachtelten Einstellungen.</p><div style="text-align:right"><button id="rc-close" type="button">Schließen</button></div>`;
      this.shadowRoot.append(dlg);dlg.querySelector('#rc-close').onclick=()=>dlg.close();dlg.addEventListener('close',()=>dlg.remove(),{once:true});dlg.showModal();
    }catch(err){alert('Versionsvergleich fehlgeschlagen: '+errText(err));}
  }
  async manageDashboardHistory(d){
    const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const errorText=err=>String(err?.message||err?.body?.message||err?.error?.message||JSON.stringify(err)||err);
    let history=[];
    try{const response=await this._hass.callApi('GET','rotapfel_dashboard_manager/dashboard_history?id='+encodeURIComponent(d.id));history=response.history||[];}
    catch(err){alert('Versionen konnten nicht geladen werden: '+errorText(err));return;}
    this.shadowRoot.querySelector('#rotapfel-history-dialog')?.remove();
    const dialog=document.createElement('dialog');dialog.id='rotapfel-history-dialog';
    dialog.style.cssText='max-width:min(620px,94vw);width:100%;border:1px solid #999;border-radius:14px;padding:22px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#222)';
    const choices=[...history].sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
    dialog.innerHTML=`<h3>Versionen · ${esc(d.name)}</h3><p>Automatische Versionen: maximal 15. Manuelle Sicherungspunkte bleiben dauerhaft erhalten, bis du sie selbst löschst.</p>
      <label>Neuer manueller Sicherungspunkt<input id="rh-label" maxlength="80" placeholder="z. B. iPhone-Layout fertig" style="display:block;width:100%;box-sizing:border-box;padding:9px;margin-top:6px"></label>
      <button type="button" id="rh-create" style="margin:10px 0 18px">Sicherungspunkt erstellen</button>
      ${choices.length?`<label>Gespeicherte Version<select id="rotapfel-history-select" style="display:block;width:100%;padding:9px;margin-top:6px">${choices.map(v=>`<option value="${esc(v.id)}">${v.manual?'★ Manuell':'Automatisch'} · ${esc(new Date(v.timestamp).toLocaleString('de-DE'))} – ${esc(v.reason)}</option>`).join('')}</select></label><p style="font-size:12px">Wiederherstellen ändert nur die Manager-Konfiguration. Veröffentlichte Dashboards danach über „Veröffentlichung aktualisieren“ synchronisieren.</p>`:'<p>Noch keine Versionen vorhanden.</p>'}
      ${choices.length?`<fieldset style="border:1px solid #9996;border-radius:9px;margin-top:14px;padding:10px"><legend>Versionen vergleichen</legend><label>Version A<select id="rh-compare-a" style="display:block;width:100%;padding:8px"><option value="current">Aktueller Stand</option>${choices.map(v=>`<option value="${esc(v.id)}">${v.manual?'★ Manuell':'Automatisch'} · ${esc(new Date(v.timestamp).toLocaleString('de-DE'))} – ${esc(v.reason)}</option>`).join('')}</select></label><label style="display:block;margin-top:8px">Version B<select id="rh-compare-b" style="display:block;width:100%;padding:8px">${choices.map(v=>`<option value="${esc(v.id)}">${v.manual?'★ Manuell':'Automatisch'} · ${esc(new Date(v.timestamp).toLocaleString('de-DE'))} – ${esc(v.reason)}</option>`).join('')}<option value="current">Aktueller Stand</option></select></label><button id="rh-compare" type="button" class="secondary" style="margin-top:10px">Unterschiede anzeigen</button></fieldset>`:''}
      <div style="display:flex;justify-content:flex-end;flex-wrap:wrap;gap:8px;margin-top:16px"><button type="button" id="rh-close" class="secondary">Schließen</button>${choices.length?'<button type="button" id="rh-delete" class="secondary">Sicherungspunkt löschen</button><button type="button" id="rh-restore">Wiederherstellen</button>':''}</div>`;
    this.shadowRoot.append(dialog);
    dialog.querySelector('#rh-close').onclick=()=>dialog.close();
    dialog.addEventListener('close',()=>dialog.remove(),{once:true});
    const sel=dialog.querySelector('#rotapfel-history-select');
    const selected=()=>choices.find(v=>v.id===sel?.value);
    const refreshDelete=()=>{const btn=dialog.querySelector('#rh-delete');if(btn){btn.disabled=!selected()?.manual;btn.title=btn.disabled?'Nur manuelle Sicherungspunkte können gelöscht werden':'';}};
    sel?.addEventListener('change',refreshDelete);refreshDelete();
    dialog.querySelector('#rh-compare')?.addEventListener('click',()=>{
      const a=dialog.querySelector('#rh-compare-a').value,b=dialog.querySelector('#rh-compare-b').value;
      if(a===b){alert('Bitte zwei unterschiedliche Stände auswählen.');return;}
      this.compareDashboardVersions(d,a,b);
    });
    dialog.querySelector('#rh-create').onclick=async()=>{
      const label=dialog.querySelector('#rh-label').value.trim();
      if(!label){alert('Bitte einen Namen für den Sicherungspunkt eingeben.');return;}
      try{await this.api('create_manual_version',{id:d.id,label});dialog.close();await this.manageDashboardHistory(d);}
      catch(err){alert('Sicherungspunkt konnte nicht erstellt werden: '+errorText(err));}
    };
    dialog.querySelector('#rh-delete')?.addEventListener('click',async()=>{
      const v=selected();if(!v?.manual)return;
      if(!confirm('Manuellen Sicherungspunkt „'+v.reason+'“ endgültig löschen?'))return;
      try{await this.api('delete_manual_version',{id:d.id,version_id:v.id});dialog.close();await this.manageDashboardHistory(d);}
      catch(err){alert('Sicherungspunkt konnte nicht gelöscht werden: '+errorText(err));}
    });
    dialog.querySelector('#rh-restore')?.addEventListener('click',async()=>{
      const version_id=sel.value;
      if(!confirm('Die ausgewählte Version von „'+d.name+'“ wiederherstellen?\n\nDer aktuelle Stand wird zuvor automatisch gesichert. Eine Veröffentlichung bleibt unverändert, bis du sie aktualisierst.'))return;
      try{const result=await this.api('restore_version',{id:d.id,version_id});this.items=result.dashboards;dialog.close();this.render();alert('Version wiederhergestellt. Falls veröffentlicht, bitte die Veröffentlichung aktualisieren.');}
      catch(err){alert('Wiederherstellung fehlgeschlagen: '+errorText(err));}
    });
    dialog.showModal();
  }
  downloadDashboardBackup(d){
    // Native manager backup, not the Lovelace YAML export. Never include publication ownership.
    const backup={format:'rotapfel-dashboard-backup',schema_version:1,exported_at:new Date().toISOString(),
      dashboard:{name:d.name,profile:d.profile,theme:d.theme||'light',
        canvas:d.canvas||{mode:'responsive',width:1920,height:1080,columns:12,gap:8},
        deviceProfiles:d.deviceProfiles||{},tabs:d.tabs||[]}};
    const blob=new Blob([JSON.stringify(backup,null,2)+'\n'],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='rotapfel-backup-'+String(d.name||'dashboard').toLowerCase().replace(/[^a-z0-9äöüß-]+/gi,'-')+'.json';
    this.shadowRoot.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  async importDashboardBackup(file){
    if(!file)return;
    if(file.size>8*1024*1024){alert('Die JSON-Datei ist zu groß (maximal 8 MB).');return;}
    let payload,d;
    try{
      payload=JSON.parse(await file.text());d=payload?.dashboard;
      if(payload?.format!=='rotapfel-dashboard-backup'||payload.schema_version!==1||!d||typeof d!=='object'||Array.isArray(d))throw Error('Kein unterstütztes Rotapfel-Dashboard-Backup (Version 1).');
      if(typeof d.name!=='string'||!d.name.trim()||d.name.length>80||!['fire_hd','smartphone','tablet','desktop'].includes(d.profile))throw Error('Ungültiger Dashboard-Name oder Profiltyp.');
      if(!Array.isArray(d.tabs)||d.tabs.length>30||!d.canvas||typeof d.canvas!=='object'||!d.deviceProfiles||typeof d.deviceProfiles!=='object')throw Error('Ungültige Dashboard-Struktur.');
    }catch(err){alert('Import abgebrochen: '+String(err.message||err));return;}
    const name=(d.name+' (Import)').slice(0,80);
    if(!confirm('Dashboard „'+d.name+'“ als eigenständige Kopie „'+name+'“ importieren?\n\nBestehende Dashboards bleiben unverändert. Veröffentlichungen werden nicht übernommen.'))return;
    let newId=null;
    try{
      const existing=new Set((this.items||[]).map(x=>x.id));
      const created=await this.api('create',{name,profile:d.profile});
      const newDashboard=created.dashboards.find(x=>!existing.has(x.id));
      if(!newDashboard)throw Error('Neues Dashboard konnte nicht zugeordnet werden.');
      newId=newDashboard.id;
      const result=await this.api('save_layout',{id:newId,tabs:d.tabs,theme:d.theme||'light',canvas:d.canvas,deviceProfiles:d.deviceProfiles});
      this.items=result.dashboards;this.error='';this.render();
      alert('Dashboard „'+name+'“ wurde importiert. Bitte Entitäten und Custom-Card-Ressourcen prüfen, bevor du es veröffentlichst.');
    }catch(err){
      if(newId){try{await this.api('delete',{id:newId});}catch(_){/* Retain the failure message. */}}
      await this.load();
      alert('Import fehlgeschlagen; die angelegte Kopie wurde nach Möglichkeit entfernt.\n'+String(err.message||err));
    }
  }
  downloadExport(d){
    const {yaml,warnings}=this.exportDashboard(d);
    if(!yaml.views.length){alert('Dieses Dashboard enthält noch keine Tabs.');return;}
    const payload=JSON.stringify(yaml,null,2);
    const blob=new Blob([payload+'\n'],{type:'application/x-yaml;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='rotapfel-'+d.name.toLowerCase().replace(/[^a-z0-9äöüß-]+/gi,'-')+'.yaml';
    this.shadowRoot.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
    alert('Lovelace-YAML wurde heruntergeladen.\n\nErforderliche Ressource: /rotapfel_dashboard_manager/rotapfel-canvas-card.js (JavaScript-Modul).\n\nDer Export registriert noch kein Dashboard in der Seitenleiste.'+(warnings.length?'\n\nHinweise:\n'+warnings.join('\n'):''));
  }
  async deletePublishedDashboard(path){
    // Home Assistant requires dashboard_id for deletion; url_path is not accepted.
    const dashboards=await this._hass.callWS({type:'lovelace/dashboards/list'});
    const target=dashboards.find(x=>x.url_path===path);
    if(!target)return false;
    const dashboardId=target.id;
    if(dashboardId===undefined||dashboardId===null||dashboardId===''){
      throw Error('Dashboard-ID konnte nicht ermittelt werden. Veröffentlichung wurde nicht entfernt.');
    }
    await this._hass.callWS({type:'lovelace/dashboards/delete',dashboard_id:dashboardId});
    return true;
  }
  async deleteManagedDashboard(d){
    const path=d.publication?.url_path;
    const warning=path
      ? 'Das Dashboard wird vollständig gelöscht: zuerst seine Home-Assistant-Veröffentlichung, danach die Konfiguration im Rotapfel Manager.\n\nDiese Aktion kann nicht rückgängig gemacht werden. Zentral gespeicherte Layout-Vorlagen bleiben erhalten.'
      : 'Die gesamte Dashboard-Konfiguration wird dauerhaft gelöscht.\n\nDiese Aktion kann nicht rückgängig gemacht werden. Zentral gespeicherte Layout-Vorlagen bleiben erhalten.';
    if(!confirm('Dashboard „'+d.name+'“ endgültig löschen?\n\n'+warning))return;
    try{
      let removedPublication=false;
      if(path){
        const dashboards=await this._hass.callWS({type:'lovelace/dashboards/list'});
        const target=dashboards.find(x=>x.url_path===path);
        if(target){
          // Delete only the publication owned by this manager dashboard.
          const expected='rotapfel-'+d.id.replace(/[^a-z0-9]/gi,'').slice(0,20).toLowerCase();
          if(path!==expected)throw Error('Der Veröffentlichungspfad stimmt nicht mit der Dashboard-ID überein. Löschung abgebrochen.');
          removedPublication=await this.deletePublishedDashboard(path);
        }
      }
      // Never delete the manager configuration if removal of the HA publication failed.
      const result=await this.api('delete',{id:d.id});
      this.items=result.dashboards;
      this.render();
      if(removedPublication){
        // A full reload is the reliable fallback for HA sidebar route caching.
        window.location.reload();
      }else{
        alert('Dashboard „'+d.name+'“ endgültig gelöscht.');
      }
    }catch(err){
      await this.load();
      alert('Dashboard konnte nicht vollständig gelöscht werden:\n'+String(err?.message||err)+'\n\nBitte Veröffentlichungsstatus prüfen, bevor du es erneut versuchst.');
      console.error('Rotapfel dashboard deletion failed',err);
    }
  }
  async publicationAction(d,action){
    let stored=d.publication||null;
    const base='rotapfel-'+d.id.replace(/[^a-z0-9]/gi,'').slice(0,20).toLowerCase();
    // Legacy duplicates may carry their source dashboard's publication link.
    // Never touch that original publication; detach the stale link on the copy.
    if(stored?.url_path && stored.url_path!==base){
      if(action!=='publish'){
        alert('Diese Dashboard-Kopie besitzt eine veraltete Veröffentlichungsverknüpfung. Bitte zuerst „Veröffentlichen“ verwenden, nachdem die Kopie bereinigt wurde.');
        return;
      }
      try{
        const cleaned=await this.api('publication',{id:d.id,publication:null});
        this.items=cleaned.dashboards;
        stored=null;
      }catch(err){alert('Die alte Veröffentlichungsverknüpfung konnte nicht bereinigt werden: '+String(err?.message||err));return;}
    }
    const path=stored?.url_path||base;
    const {yaml,warnings}=this.exportDashboard(d);
    if(action!=='remove'&&!yaml.views.length){alert('Dashboard hat noch keine Tabs.');return;}
    const description=action==='publish'?'als neues Home-Assistant-Dashboard veröffentlichen':action==='update'?'im veröffentlichten Dashboard aktualisieren':'aus Home Assistant entfernen';
    if(!confirm('„'+d.name+'“ '+description+'?\n\nAndere Dashboards werden nicht verändert.'))return;
    try{
      if(action==='publish'){
        if(stored)throw Error('Bereits veröffentlicht. Bitte Aktualisieren verwenden.');
        // Check for a path collision before creating anything.
        const dashboards=await this._hass.callWS({type:'lovelace/dashboards/list'});
        if(dashboards.some(x=>x.url_path===path))throw Error('Dashboard-Pfad ist bereits vergeben: '+path);
        // The renderer must already be registered as a Lovelace module resource.
        const resources=await this._hass.callWS({type:'lovelace/resources'});
        if(!Array.isArray(resources)||!resources.some(x=>String(x.url||'').split('?')[0]==='/rotapfel_dashboard_manager/rotapfel-canvas-card.js')){
          throw Error('Bitte zuerst die JavaScript-Modul-Ressource /rotapfel_dashboard_manager/rotapfel-canvas-card.js unter Einstellungen → Dashboards → Ressourcen registrieren.');
        }
        await this._hass.callWS({type:'lovelace/dashboards/create',url_path:path,mode:'storage',title:d.name,icon:'mdi:view-dashboard',show_in_sidebar:true,require_admin:false});
        try{await this._hass.callWS({type:'lovelace/config/save',url_path:path,config:yaml});}
        catch(e){
          // Roll back only the newly created dashboard, never a pre-existing one.
          try{await this.deletePublishedDashboard(path);}catch(rollbackError){console.error('Rotapfel: rollback failed',rollbackError);}
          throw e;
        }
        const result=await this.api('publication',{id:d.id,publication:{url_path:path}});
        this.items=result.dashboards;
      }else{
        if(!stored)throw Error('Dieses Dashboard wurde noch nicht über Rotapfel veröffentlicht.');
        // Confirm the exact registered target before touching it.
        const dashboards=await this._hass.callWS({type:'lovelace/dashboards/list'});
        const targetDashboard=dashboards.find(x=>x.url_path===path);
        const exists=!!targetDashboard;
        if(action==='update'){
          if(!exists){
            if(!confirm('Das bisher veröffentlichte Dashboard wurde in Home Assistant gelöscht.\n\nSoll es unter demselben Pfad neu erstellt und mit dem aktuellen Layout veröffentlicht werden?'))return;
            const resources=await this._hass.callWS({type:'lovelace/resources'});
            if(!Array.isArray(resources)||!resources.some(x=>String(x.url||'').split('?')[0]==='/rotapfel_dashboard_manager/rotapfel-canvas-card.js')){
              throw Error('Die erforderliche Rotapfel-Canvas-Ressource ist nicht registriert.');
            }
            // Recheck immediately before creation to avoid overwriting another dashboard.
            const latest=await this._hass.callWS({type:'lovelace/dashboards/list'});
            if(latest.some(x=>x.url_path===path))throw Error('Der Dashboard-Pfad ist inzwischen wieder vergeben. Bitte erneut versuchen.');
            await this._hass.callWS({type:'lovelace/dashboards/create',url_path:path,mode:'storage',title:d.name,icon:'mdi:view-dashboard',show_in_sidebar:true,require_admin:false});
            try{await this._hass.callWS({type:'lovelace/config/save',url_path:path,config:yaml});}
            catch(e){
              try{await this.deletePublishedDashboard(path);}catch(rollbackError){console.error('Rotapfel: rollback failed',rollbackError);}
              throw e;
            }
          }else{
            // Saving Lovelace config does not rename the registered dashboard/sidebar entry.
            // Keep the publication path and ID stable; update metadata separately.
            await this._hass.callWS({type:'lovelace/config/save',url_path:path,config:yaml});
            if(targetDashboard.title!==d.name){
              if(targetDashboard.id===undefined||targetDashboard.id===null){
                throw Error('Dashboard wurde gespeichert, aber die Home-Assistant-Dashboard-ID für die Umbenennung fehlt.');
              }
              await this._hass.callWS({type:'lovelace/dashboards/update',dashboard_id:targetDashboard.id,title:d.name});
            }
          }
        }else if(action==='remove'){
          if(!exists){
            if(!confirm('Das Dashboard existiert in Home Assistant nicht mehr.\n\nNur die veraltete Veröffentlichungsverknüpfung im Rotapfel Manager entfernen?'))return;
            const result=await this.api('publication',{id:d.id,publication:null});
            this.items=result.dashboards;this.render();alert('Veraltete Veröffentlichungsverknüpfung entfernt.');return;
          }
          await this.deletePublishedDashboard(path);
          const result=await this.api('publication',{id:d.id,publication:null});
          this.items=result.dashboards;
        }
      }
      this.render();
      alert(action==='publish'?'Dashboard veröffentlicht.':action==='update'?'Dashboard aktualisiert.':'Veröffentlichung entfernt. Das Dashboard im Manager bleibt erhalten.');
      if(warnings.length&&action!=='remove')alert('Exporthinweise:\n'+warnings.join('\n'));
      if(action==='publish'||action==='remove'||action==='update')window.location.reload();
    }catch(err){
      // HA WebSocket failures can contain nested objects instead of an Error.message.
      const detail=typeof err==='string'?err:(typeof err?.message==='string'?err.message:JSON.stringify(err,(key,value)=>value instanceof Error?{message:value.message,name:value.name}:value,2));
      alert('Veröffentlichung fehlgeschlagen:\n'+(detail&&detail!=='{}'?detail:'Unbekannter Home-Assistant-WebSocket-Fehler')+'\n\nBitte Home-Assistant-Protokolle bzw. Browserkonsole prüfen.');
      console.error('Rotapfel publication failed',err);
    }
  }
  async closeLayoutEditor(){
    if(!this.dirty){this.editing=null;this.layout=null;this.render();return;}
    const root=this.shadowRoot;
    if(root.querySelector('#rotapfel-close-dialog'))return;
    const backdrop=document.createElement('div');
    backdrop.id='rotapfel-close-dialog';
    backdrop.setAttribute('role','presentation');
    backdrop.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box';
    backdrop.innerHTML=`<div role="dialog" aria-modal="true" aria-labelledby="rotapfel-close-title" style="background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);border-radius:16px;padding:24px;max-width:480px;width:100%;box-shadow:0 16px 48px #0005;box-sizing:border-box"><h2 id="rotapfel-close-title" style="margin:0 0 12px">Ungespeicherte Änderungen</h2><p style="margin:0 0 22px;line-height:1.5">Möchtest du die Änderungen speichern oder den Layout-Editor ohne Speichern verlassen?</p><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end"><button class="secondary" id="close-cancel">Abbrechen</button><button class="secondary" id="close-discard">OK – ohne Speichern beenden</button><button id="close-save">Speichern</button></div><p id="close-error" role="alert" style="display:none;color:var(--error-color,#b00020);margin-bottom:0"></p></div>`;
    root.appendChild(backdrop);
    const cancel=backdrop.querySelector('#close-cancel');
    const discard=backdrop.querySelector('#close-discard');
    const save=backdrop.querySelector('#close-save');
    const close=()=>backdrop.remove();
    cancel.onclick=close;
    discard.onclick=()=>{close();this.editing=null;this.layout=null;this.dirty=false;this.render();};
    save.onclick=async()=>{
      save.disabled=true;discard.disabled=true;cancel.disabled=true;save.textContent='Speichert …';
      try{
        const profile=this._deviceLayoutProfile||'fire_hd';
        this.eachLayoutCard(c=>{if(c.position){c.deviceLayouts=c.deviceLayouts||{};c.deviceLayouts[profile]=JSON.parse(JSON.stringify(c.position));}});
        const tabs=this.layout.map(t=>({...t,rooms:(t.rooms||[]).map(room=>({...room,cards:(room.cards||[]).map(c=>({...c,position:c.deviceLayouts?.fire_hd||c.position}))}))}));
        const response=await this.api('save_layout',{id:this.editing,tabs,theme:this.theme,canvas:this.canvas,deviceProfiles:this.deviceProfiles});
        this.items=response.dashboards;
        this.error='';this.dirty=false;this.editing=null;this.layout=null;
        close();this.render();
      }catch(err){
        const message=backdrop.querySelector('#close-error');
        message.textContent='Speichern fehlgeschlagen: '+(err?.body?.message||err?.body?.error||err?.message||(typeof err==='object'?JSON.stringify(err):String(err)));message.style.display='block';
        save.disabled=false;discard.disabled=false;cancel.disabled=false;save.textContent='Speichern';
      }
    };
    cancel.focus();
  }
  async saveLayout(){const profile=this._deviceLayoutProfile||'fire_hd';this.eachLayoutCard(c=>{if(c.position){c.deviceLayouts=c.deviceLayouts||{};c.deviceLayouts[profile]=JSON.parse(JSON.stringify(c.position));}});if(await this.act('save_layout',{id:this.editing,tabs:this.layout.map(t=>({...t,rooms:(t.rooms||[]).map(r=>({...r,cards:(r.cards||[]).map(c=>({...c,position:c.deviceLayouts?.fire_hd||c.position}))}))})),theme:this.theme,canvas:this.canvas,deviceProfiles:this.deviceProfiles})){this.dirty=false;this.render();}}
  render(){if(!this.isConnected)return;this._previewResizeObserver?.disconnect();if(!this.shadowRoot)this.attachShadow({mode:'open'});
    const e=s=>this.esc(s), d=this.items?.find(x=>x.id===this.editing);
    this.shadowRoot.innerHTML=`<style>
    :host{display:block;min-height:100%;background:var(--primary-background-color);color:var(--primary-text-color);font-family:Arial,sans-serif}
    main{max-width:1150px;margin:auto;padding:24px 18px}main.overview{max-width:none;margin:0;padding:24px 18px}h1{font-size:25px;margin:8px 0}h2{font-size:19px}h3{font-size:16px}
    .rotapfel-mobile-header{display:none;align-items:center;gap:12px;margin-bottom:12px;min-height:48px}
    .rotapfel-mobile-header button{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;font-size:25px;background:transparent;color:var(--primary-text-color,#222);border:1px solid var(--divider-color,#bbb)}
    @media(max-width:767px){.rotapfel-mobile-header{display:flex}main,main.overview{padding:10px 12px}.rotapfel-mobile-header strong{font-size:16px}}
    .top,.actions,.toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}.actions{justify-content:flex-start}
    button{cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:rgba(0,153,196,.18);border:0;border-radius:9px;padding:10px 14px;background:var(--primary-color,#168fc0);color:white;font-weight:600}
    button.secondary{background:var(--secondary-background-color,#ddd);color:var(--primary-text-color,#222)}button:disabled{opacity:.4;cursor:not-allowed}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,340px));justify-content:start;gap:14px;margin-top:22px}main.overview .top{display:block}main.overview .overview-controls{justify-content:flex-start;margin-top:14px}main.overview .grid{clear:both}
    article,.room,.card{border:1px solid var(--divider-color,#bbb);border-radius:13px;padding:16px;background:var(--card-background-color,#fff)}
    .room{margin-top:14px}.card{padding:12px;margin:9px 0;border-style:dashed}.muted{opacity:.7;font-size:13px}.error{color:var(--error-color,#c22)}
    .nexus-preview{box-sizing:border-box;background:var(--card-bg)!important;color:var(--card-fg)!important;display:flex;align-items:center;gap:14px;border-radius:16px;padding:16px;margin-top:12px;min-height:76px;background:var(--secondary-background-color,#e9edf1);border:1px solid var(--divider-color,#ddd)}
    .nexus-preview.on{background:color-mix(in srgb,var(--primary-color,#03a9f4) 15%,var(--card-background-color,#fff))}
    .nexus-preview.closed{background:#d4edd8;color:#173e24}.nexus-preview.open{background:#f8dfc9;color:#66340e}
    .nexus-icon{font-size:28px;min-width:36px;text-align:center}.nexus-details{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0}
    .nexus-details small{font-size:11px;opacity:.65;overflow-wrap:anywhere}.nexus-state{font-size:14px;font-weight:600}
    button.nexus-toggle{display:inline-flex;position:relative;z-index:2;align-items:center;justify-content:center;flex:0 0 auto;box-sizing:border-box;min-width:76px;min-height:48px;padding:12px 18px;touch-action:manipulation;pointer-events:auto;cursor:pointer;background:var(--card-accent,var(--primary-color,#0399ca))}
    button.nexus-toggle:focus-visible{outline:3px solid var(--primary-text-color,#222);outline-offset:3px}
    button.nexus-toggle:active:not(:disabled){filter:brightness(.85)}
    .nexus-preview .nexus-icon,.nexus-preview .nexus-details{pointer-events:none}
    .card.dragging{opacity:.4}.card.drag-over{outline:3px dashed var(--primary-color,#168fc0);outline-offset:2px}.nexus-preview{container-type:inline-size}.nexus-details strong{overflow-wrap:anywhere}@container(max-width:300px){.nexus-preview{gap:6px;padding:8px}.nexus-icon{font-size:19px;min-width:22px}.nexus-details strong{font-size:12px}.nexus-details small{font-size:10px}button.nexus-toggle{min-width:48px;padding:8px;min-height:44px}}
    .position-workspace{position:relative;box-sizing:border-box;border:2px solid #5a9cb8;background-color:#f6f8fa;background-image:linear-gradient(#dbe4ea 1px,transparent 1px),linear-gradient(90deg,#dbe4ea 1px,transparent 1px);background-size:40px 40px;overflow:hidden}.position-tile{position:absolute;box-sizing:border-box;cursor:grab;border:1px solid #7b9bac;border-radius:10px;box-shadow:0 2px 5px #0002;overflow:hidden;touch-action:none}.position-tile:active{cursor:grabbing}.position-tile .nexus-preview{margin:0;height:100%;min-height:0!important}.position-tile .nexus-details small{overflow-wrap:anywhere}.position-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0}.position-tools button{padding:7px 12px}.position-tile.selected{outline:3px solid #009ac4;outline-offset:1px}.canvas-scroll{overflow-x:auto;max-width:100%;padding:8px 0}.canvas-fixed{box-sizing:border-box;border:2px dashed var(--primary-color,#168fc0);padding:10px;min-height:100px}.canvas-meta{font-size:12px;opacity:.75;margin:10px 0}.cards-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:12px}.cards-grid>.card{min-width:0;margin:0;grid-column:span var(--span,2)}
    .canvas-preview.room-test-mode{background-image:none!important;border-color:transparent!important;background-color:transparent!important}.canvas-preview.room-test-mode .position-tile{border-color:transparent!important;box-shadow:none!important;cursor:default}.canvas-preview.room-test-mode .external-card-slot{pointer-events:auto!important}.room-test-toggle[aria-pressed="true"]{background:var(--primary-color,#0399ca)!important;color:white!important;outline:2px solid var(--primary-color,#0399ca)}
    .preview-zoom-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0 12px}.preview-zoom-controls select{width:auto;min-width:110px}.preview-zoom-controls .zoom-status{font-size:13px;opacity:.8}.preview-viewport{width:100%;min-width:0;overflow:hidden;position:relative}.preview-scaled{position:relative;transform-origin:top left;will-change:transform}.preview-scaled .canvas-preview{max-width:none}.preview-zoom-hint{font-size:12px;opacity:.7;margin-top:6px}
    .overview-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end}.brand{display:flex;align-items:center;gap:16px}.brand img{width:62px;height:62px;object-fit:cover;border-radius:50%}.canvas-preview{position:relative;box-sizing:border-box;background:#f6f8fa;background-image:linear-gradient(#dbe4ea 1px,transparent 1px),linear-gradient(90deg,#dbe4ea 1px,transparent 1px);border:2px solid #5a9cb8;overflow:hidden}.canvas-preview .position-tile{cursor:default;box-shadow:none}.canvas-preview .nexus-preview{margin:0;height:100%;min-height:0!important}.canvas-preview:not(.room-test-mode) .nexus-toggle{pointer-events:none}.edit-room-list{margin-top:20px}.edit-room-list>summary{cursor:pointer;font-weight:700;padding:10px;background:var(--secondary-background-color,#eee);border-radius:8px}main.theme-dark{background:#171c24;color:#f4f5f7;border-radius:14px}main.theme-dark article,main.theme-dark .room,main.theme-dark .card{background:#232b36;color:#f4f5f7;border-color:#455061}main.theme-dark button.secondary{background:#46515f;color:#fff}

    .room-preview-controls{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:8px 0 12px}
    .room-preview-picker{display:flex;align-items:center;gap:10px;font-weight:600}
    .room-preview-picker select{width:auto;min-width:190px;margin:0}
    .room-collapsible{padding:0!important;overflow:hidden}
    .room-disclosure::before{content:"▸";display:inline-block;font-size:17px;line-height:1;width:16px;color:var(--primary-color,#168fc0)}
    .room-collapsible[open]>.room-summary .room-disclosure::before{content:"▾"}
    .room-summary::-webkit-details-marker{display:none}
    .room-summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:14px;cursor:pointer;padding:14px 16px}
    .room-collapsible[open]>.room-summary{border-bottom:1px solid var(--divider-color,#bbb)}
    .room-collapsible>.toolbar,.room-collapsible>.room-editor{margin-left:14px;margin-right:14px}
    .room-collapsible>.room-editor{margin-bottom:14px}
    .room-editor{display:grid;grid-template-columns:minmax(0,2fr) minmax(270px,1fr);gap:16px;margin-top:14px;align-items:start}
    /* Alpha 13.7.105: einheitliche, kompakte Bedienbereiche im Layoutmanager */
    .layout-control-panel{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px;align-items:stretch}
    .layout-control-group{height:100%;min-width:0;border:1px solid var(--divider-color,#bbb);border-radius:12px;background:var(--card-background-color,#fff);padding:12px 14px;box-sizing:border-box}
    .layout-control-group>summary{cursor:pointer;list-style:none;font-weight:700;display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:30px}
    .layout-control-group>summary::-webkit-details-marker{display:none}
    .layout-control-group>summary::after{content:'▾';opacity:.65}
    .layout-control-group:not([open])>summary::after{content:'▸'}
    .layout-control-content{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:10px}
    .layout-control-content>label{display:flex;align-items:center;gap:8px;min-width:0;margin:0}
    .layout-control-content>label select{min-width:130px;max-width:100%}
    .layout-control-content>.muted{flex:1 1 100%;line-height:1.35}
    .layout-control-panel button,.layout-tab-actions button{box-sizing:border-box;min-height:42px;display:inline-flex;align-items:center;justify-content:center;text-align:center;line-height:1.2}
    .layout-tab-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px}
    .layout-tab-actions .layout-action-primary{margin-right:auto}
    .layout-tab-actions .layout-action-danger{background:var(--secondary-background-color,#ddd);color:var(--error-color,#b00020)}
    .layout-section-heading{margin:18px 0 8px}
    @media(max-width:800px){.layout-control-panel{grid-template-columns:1fr}.layout-control-content>button{flex:1 1 auto}.layout-tab-actions{width:100%}.layout-tab-actions button{flex:1 1 auto}}
    @media(min-width:801px){main:has(.layout-control-panel){max-width:1320px}.room-editor{grid-template-columns:minmax(0,1.65fr) minmax(340px,1fr)}}
    main.theme-dark .layout-control-group{background:#232b36;border-color:#455061}

    /* Alpha 13.7.105: konsistente Aktionsgruppen für Etagen und Räume */
    .layout-section-heading{align-items:flex-start;gap:14px;flex-wrap:wrap}
    .layout-tab-actions,.room-action-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;width:100%}
    .layout-action-set,.room-action-set{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;align-content:start;padding:12px;border:1px solid var(--divider-color,#bbb);border-radius:12px;background:var(--card-background-color,#fff);min-width:0;box-sizing:border-box}
    .layout-action-label{grid-column:1/-1;font-size:13px;font-weight:700;color:var(--secondary-text-color,#666);margin-bottom:2px}
    .layout-action-set button,.room-action-set button{width:100%;min-width:0;min-height:44px;box-sizing:border-box;white-space:normal;line-height:1.25;text-align:center;display:inline-flex;align-items:center;justify-content:center;padding:9px 10px}
    .layout-action-set #position-editor{grid-column:1/-1}
    .room-management{display:block!important;margin-top:12px;margin-bottom:8px}
    .room-management h3{margin:0 0 10px}
    .room-action-groups{width:100%}
    .room-action-set [data-room-action="add-type"]{grid-column:1/-1}
    .layout-action-set .layout-action-danger,.room-action-set .layout-action-danger{background:var(--secondary-background-color,#eee);color:var(--error-color,#b00020)}
    main.theme-dark .layout-action-set,main.theme-dark .room-action-set{background:#232b36;border-color:#455061}
    @media(max-width:800px){.layout-tab-actions,.room-action-groups{grid-template-columns:1fr}.layout-action-set,.room-action-set{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:400px){.layout-action-set,.room-action-set{padding:9px;gap:6px}.layout-action-set button,.room-action-set button{font-size:12px;padding:8px 5px}}


    .nexus-preview.climate{flex-wrap:wrap;align-content:center}
    .climate-controls{flex:1 1 100%;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:12px}
    .climate-values,.climate-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
    button.climate-step,button.climate-mode{font-size:12px;min-width:32px;min-height:32px;padding:5px 8px;background:var(--card-accent,#009ac4);color:white}
    button.climate-mode:not(.active){background:#e0e0e0;color:#111}
    button.climate-mode.active{outline:2px solid currentColor;outline-offset:-3px}
    .room-card-item .nexus-preview.climate{height:auto!important;min-height:118px!important}
    .canvas-preview:not(.room-test-mode) .climate-controls,.rotapfel-position-overlay .climate-controls{pointer-events:none}
    .external-card-preview{display:block;overflow:visible;height:auto!important;padding:8px;box-sizing:border-box}
    .external-card-preview:not([data-wrapper="true"]){background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important}
    .external-card-slot{display:block;width:100%;min-width:0;min-height:100px;color:var(--primary-text-color,#333)}
    .external-card-slot > *{display:block;width:100%;max-width:100%;box-sizing:border-box}
    .room-card-item:has(.external-card-preview){height:auto}
    .room-card-item .external-card-preview.manual-card-height{height:var(--manual-height)!important;overflow:auto!important}

    /* Alpha 13.5.15: auto height only for original external cards, never persisted as a new position */
    .room-card-item .external-card-preview{height:auto!important;min-height:0!important;overflow:visible!important}
    /* Alpha 13.5.15: canvas frames always use their saved geometry. */
    .canvas-preview .position-tile.auto-card-height{height:100%;overflow:hidden}
    .canvas-preview .position-tile .external-card-preview{height:100%!important;min-height:0!important;overflow:hidden!important;padding:0!important;position:relative!important}
    .canvas-preview:not(.room-test-mode) .position-tile .external-card-slot{pointer-events:none!important;overflow:visible!important;max-height:none!important}
    .canvas-preview .position-tile.auto-card-height{height:100%!important;overflow:hidden}
    .canvas-preview .position-tile.auto-card-height .external-card-preview{height:auto!important;min-height:0!important;overflow:visible}
    .canvas-preview .position-tile.auto-card-height .external-card-slot{height:auto;min-height:0}
    .room-card-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-content:start}
    .room-card-item{min-width:0;border:2px solid var(--divider-color,#ccc);border-radius:12px;padding:10px;background:var(--card-background-color,#fff);cursor:pointer}
    .room-card-item.selected{border-color:#009ac4;box-shadow:0 0 0 2px #009ac433}
    .room-card-head{display:flex;gap:8px;align-items:flex-start;font-size:13px;overflow-wrap:anywhere}
    /* Alpha 13.5.15: original cards get the full preview width, no extra horizontal inset */
    .room-card-item .external-card-preview{padding:4px!important;box-sizing:border-box;overflow:hidden!important;max-height:260px!important;height:auto!important;min-height:0!important;contain:paint}
    .room-card-item .external-card-slot{overflow:hidden!important;max-height:250px!important;min-height:0!important;contain:paint}
    .room-card-item .external-card-slot > *{max-width:100%!important;box-sizing:border-box}
    .room-card-item{overflow:hidden}
    .room-card-item .external-card-slot{width:100%;min-width:0;box-sizing:border-box}
    .room-card-item .room-card-head strong{overflow-wrap:anywhere;white-space:normal}
    .room-card-item:has(.external-card-preview) .room-card-meta{margin-top:5px}
    .room-card-head input{width:18px;height:18px;flex:0 0 auto;margin:0;accent-color:#009ac4}
    .room-card-item .nexus-preview{margin-top:8px;min-height:76px!important;height:88px!important;padding:9px;gap:7px}
    .room-card-item .nexus-icon{font-size:19px;min-width:24px}.room-card-item .nexus-details strong{font-size:12px}
    .room-card-item .nexus-toggle{min-width:46px;min-height:40px;padding:6px;font-size:12px}
    .room-card-meta{font-size:12px;opacity:.7;margin-top:8px}
    .room-editor-side{border:1px solid var(--divider-color,#bbb);border-radius:12px;padding:14px;min-width:0;position:sticky;top:10px;background:var(--card-background-color,#fff)}
    .room-editor-side h4{margin:0 0 10px}.room-editor-side .actions{gap:7px;margin-top:12px}.room-editor-side button{padding:9px 10px;font-size:12px}
    .room-editor-side .entity-label{overflow-wrap:anywhere;font-size:12px;opacity:.75}
    .room-editor-side .side-section{border-top:1px solid var(--divider-color,#ddd);padding-top:12px;margin-top:12px}
    /* Alpha 13.7.105: konsistente Kartenbearbeitung in logisch gegliederten Bereichen */
    .room-editor-side .side-section{padding:12px;border:1px solid var(--divider-color,#ddd);border-radius:10px;margin-top:10px;background:var(--secondary-background-color,#8881)}
    .room-editor-side .side-section>strong{display:block;font-size:13px;margin-bottom:10px}
    .room-editor-side .side-section .actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0}
    .room-editor-side .side-section button{box-sizing:border-box;min-height:44px;width:100%;white-space:normal;line-height:1.3;text-align:center;touch-action:manipulation;padding:10px 8px}
    .room-editor-side .side-section>button{width:100%}
    .room-editor-side .side-section .muted{font-size:12px;line-height:1.4}
    .room-editor-side .side-section-danger{border-color:var(--error-color,#c44);background:transparent}
    /* Alpha 13.7.105: deutlich erkennbare, kompakte Aktionsbuttons statt Text auf grauer Fläche. */
    .room-editor-side .side-section{padding:12px 12px 11px;background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#c9c9c9);margin-top:10px}
    .room-editor-side .side-section>strong{margin:0 0 9px;font-size:13px;line-height:1.3}
    .room-editor-side .side-section .actions{gap:7px;margin:0;align-items:stretch}
    .room-editor-side .side-section button.secondary{appearance:none;-webkit-appearance:none;display:flex;align-items:center;justify-content:center;min-height:43px;height:auto;margin:0;padding:8px 10px;border:1px solid var(--divider-color,#c4cbd1);border-radius:8px;background:var(--secondary-background-color,#e7eaed);color:var(--primary-text-color,#202124);font-size:12px;font-weight:600;line-height:1.25;box-shadow:0 1px 1px #0000000a;cursor:pointer}
    .room-editor-side .side-section button.secondary:not(:disabled):active{filter:brightness(.94)}
    .room-editor-side .side-section button.secondary:focus-visible{outline:2px solid var(--primary-color,#168fc0);outline-offset:2px}
    .room-editor-side .side-section button.secondary:disabled{opacity:.45}
    .room-editor-side .side-section>p.muted{margin:0 0 9px;line-height:1.4}
    .room-editor-side .side-section .actions+p.muted{margin:9px 0 0}
    .room-editor-side .side-section-danger{border-color:var(--error-color,#c44)}
    .room-editor-side .side-section-danger button.secondary{background:var(--secondary-background-color,#e7eaed);border-color:var(--error-color,#c44);color:var(--error-color,#b00020)}
    main.theme-dark .room-editor-side .side-section{background:#232b36;border-color:#455061}
    main.theme-dark .room-editor-side .side-section button.secondary{background:#46515f;border-color:#667383;color:#fff}
    main.theme-dark .room-editor-side .side-section-danger{border-color:var(--error-color,#e66)}
    @media(max-width:420px){.room-editor-side .side-section .actions{grid-template-columns:1fr 1fr}}

    .room-sort{width:auto;max-width:175px;margin:0}.room-sort-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 12px}
    @media(max-width:800px){.room-editor{grid-template-columns:1fr}.room-editor-side{position:static}.room-card-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:470px){.room-card-list{grid-template-columns:1fr}}
    .design-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}.design-tools button{font-size:12px}.theme-controls{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:12px;border:1px solid var(--divider-color,#ddd);border-radius:12px;margin-top:14px}.theme-controls select{width:auto;margin:0}
    @media(max-width:650px){.canvas-scroll:not(:has(.canvas-fixed)) .cards-grid{min-width:680px}.room{overflow-x:auto}.card .toolbar{align-items:flex-start}.card .actions{gap:4px}.card .actions button{padding:7px}}
    .dashboard-filters{display:flex;align-items:end;gap:12px;flex-wrap:wrap;margin:18px 0;padding:14px;border:1px solid var(--divider-color,#aaa);border-radius:12px}
    .dashboard-filters label{margin:0;flex:1 1 175px;font-size:13px}.dashboard-filters input,.dashboard-filters select{margin-top:5px}
    .dashboard-summary{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.dashboard-summary span{padding:8px 12px;border-radius:9px;background:var(--secondary-background-color,#e8edf0);font-size:13px}
    .dashboard-status{display:inline-block;margin:7px 0;padding:4px 9px;border-radius:8px;font-size:12px;font-weight:600;background:var(--secondary-background-color,#e8edf0);color:var(--primary-text-color,#222)}
    .dashboard-status.published{background:#d6f4e1;color:#175c35}.dashboard-status.repair{background:#fff0c9;color:#714b00}
    .dashboard-empty-filter{margin:18px 0;color:var(--secondary-text-color,#666)}
    .dashboard-view-switch{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding-bottom:2px}
    .dashboard-view-switch button{padding:9px 13px;font-size:13px}
    .dashboard-view-switch button[aria-pressed="true"]{outline:2px solid var(--primary-color,#009ac2);font-weight:700}
    #dashboard-list.dashboard-table{display:flex;flex-direction:column;gap:0;border:1px solid var(--divider-color,#aaa);border-radius:12px;overflow:hidden}
    #dashboard-list.dashboard-table article{display:grid;grid-template-columns:minmax(140px,2fr) minmax(115px,1fr) minmax(95px,1fr) minmax(260px,3fr);align-items:center;gap:12px;border:0;border-radius:0;border-bottom:1px solid var(--divider-color,#ddd);padding:12px;background:var(--card-background-color,#fff);min-width:0}
    #dashboard-list.dashboard-table article:last-child{border-bottom:0}
    #dashboard-list.dashboard-table article .dashboard-status{margin:0}
    #dashboard-list.dashboard-table article .muted{margin:0}
    #dashboard-list.dashboard-table article .actions{margin:0;gap:5px}
    #dashboard-list.dashboard-table article .actions button{padding:7px 9px;font-size:12px}
    #dashboard-list.dashboard-table article[hidden]{display:none}
    @media(max-width:950px){#dashboard-list.dashboard-table article{grid-template-columns:minmax(130px,1fr) minmax(105px,1fr)}#dashboard-list.dashboard-table article .actions{grid-column:1/-1}}
    @media(max-width:480px){#dashboard-list.dashboard-table article{grid-template-columns:1fr;gap:7px}#dashboard-list.dashboard-table article .actions{grid-column:1}}

    .tabs{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0}.tabs button.active{outline:2px solid var(--primary-text-color)}
    dialog{border:1px solid var(--divider-color);border-radius:14px;padding:24px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);min-width:min(330px,80vw)}
    label{display:block;margin:12px 0}
    input[type="color"]{appearance:none;-webkit-appearance:none;display:inline-block;width:66px;height:42px;padding:3px;border-radius:8px;cursor:pointer;vertical-align:middle;background:transparent!important;color:inherit}
    input[type="color"]::-webkit-color-swatch-wrapper{padding:0}
    input[type="color"]::-webkit-color-swatch{border:1px solid var(--divider-color,#999);border-radius:5px}
    .color-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
    .color-row .color-value{font:12px monospace;min-width:72px}
    input,select{display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:10px;border-radius:8px;background:var(--primary-background-color,#fff);color:var(--primary-text-color,#222);border:1px solid var(--divider-color,#aaa)}
    </style><div class="rotapfel-mobile-header"><button id="rotapfel-ha-menu" aria-label="Home Assistant Seitenleiste öffnen" title="Home Assistant Menü">☰</button><strong>Rotapfel Control Manager</strong></div><main class="${!d?'overview':''} ${d&&this.theme==='dark'?'theme-dark':''}"><div style="font-size:12px;opacity:.75;margin:0 0 12px" title="Frontend-Build der installierten Integration">Rotapfel Control Manager · Alpha 13.9.31 · Build 0.2.0a13931</div>${d?`<div class="top"><div><button class="secondary" id="back">← Übersicht</button><h1>${e(d.name)}</h1><div class="muted">Layout-Editor · V0.2 Alpha 13.9.31 · ${e(d.profile)} ${this.dirty?'· Ungespeicherte Änderungen':''}</div></div><button id="save-layout" ${this.dirty?'':'disabled'}>Layout speichern</button></div>
<div class="layout-control-panel">
        ${this._migrationMessage?`<p class="muted" role="status">${e(this._migrationMessage)}</p>`:""}<details class="layout-control-group" open><summary>01 · Design & Raster</summary><div class="layout-control-content"><button class="secondary" id="canvas-settings">Dashboard-Maße / Raster</button><strong>Designprofil</strong><select id="theme-select"><option value="light" ${this.theme==='light'?'selected':''}>Hell</option><option value="dark" ${this.theme==='dark'?'selected':''}>Dunkel</option></select><span class="muted">Kartendesign pro Dashboard · Farben und Maße pro Karte</span></div></details>
        <details class="layout-control-group" open><summary>02 · Geräteprofile & Vorlagen</summary><div class="layout-control-content"><strong>Geräteprofil</strong><select id="device-layout-profile" style="width:auto;min-width:180px"><option value="fire_hd" ${this._deviceLayoutProfile==='fire_hd'||!this._deviceLayoutProfile?'selected':''}>Fire HD 10 · 1920 × 1080</option><option value="desktop" ${this._deviceLayoutProfile==='desktop'?'selected':''}>Desktop · 1920 × 1080</option><option value="iphone" ${this._deviceLayoutProfile==='iphone'?'selected':''}>iPhone · 402 × 874</option>${Object.entries(this.deviceProfiles||{}).filter(([key])=>!['fire_hd','desktop','iphone'].includes(key)).map(([key,p])=>`<option value="${e(key)}" ${this._deviceLayoutProfile===key?'selected':''}>${e(p.name)} · ${p.width} × ${p.height}</option>`).join('')}</select><button class="secondary" id="manage-device-profiles">Profile verwalten</button><button class="secondary" id="manage-layout-templates">Layout-Vorlagen</button><label style="flex:1 1 100%;display:flex;align-items:center;gap:10px;padding:6px 0;cursor:pointer"><input type="checkbox" id="show-mobile-layout-selector" style="flex:none;width:18px;height:18px;margin:0" ${this.canvas?.show_mobile_layout_selector===true?'checked':''}><span>Manuelle Layout-Auswahl im Smartphone-Dashboard anzeigen</span></label><span id="device-profile-status" class="muted">Alpha 13.7.105: Positionen und Größen sind je Profil getrennt. Änderungen mit „Layout speichern“ sichern.</span></div></details>
    </div>
    <div class="toolbar" style="margin-top:18px"><h2>Tabs</h2><button id="add-tab">+ Tab</button></div>
    <div class="tabs">${(this.layout||[]).map(t=>`<button class="${t.id===this.tabId?'active':'secondary'}" data-tab="${e(t.id)}">${e(t.name)}</button>`).join('')}</div>
    ${this.layout?.length?this.renderTab():`<p class="muted">Noch keine Tabs. Lege den ersten Tab an.</p>`}`:
    `<div class="top"><div><div class="brand"><img src="/rotapfel_dashboard_manager/red-apple-logo.png" alt="RED APPLE Logo"><div><h1>Rotapfel Control Manager</h1><div class="muted">Dashboard-Verwaltung · Version 0.2 Alpha 13.9.31</div></div></div><div class="overview-controls"><span class="muted">Frontend 0.2.0a13931</span><button class="secondary" id="frontend-reload" title="Browseransicht aktualisieren (Frontend-Datei ohne HA-Neustart laden)">↻ Frontend neu laden</button><button class="secondary" id="resource-manager">Custom-Card-Ressourcen</button><button class="secondary" id="import-dashboard-backup">JSON importieren</button><input id="dashboard-backup-file" type="file" accept=".json,application/json" hidden><button id="create">+ Dashboard erstellen</button></div></div>
    <div class="dashboard-summary"><span>Gesamt: <strong>${(this.items||[]).length}</strong></span><span>Veröffentlicht: <strong>${(this.items||[]).filter(x=>x.publication&&x.publication.url_path===('rotapfel-'+x.id.replace(/[^a-z0-9]/gi,'').slice(0,20).toLowerCase())).length}</strong></span><span>Unveröffentlicht: <strong>${(this.items||[]).filter(x=>!x.publication).length}</strong></span><span>Prüfen: <strong>${(this.items||[]).filter(x=>x.publication&&x.publication.url_path!==('rotapfel-'+x.id.replace(/[^a-z0-9]/gi,'').slice(0,20).toLowerCase())).length}</strong></span></div>
    <div class="dashboard-filters"><label>Dashboard suchen<input id="dashboard-search" type="search" placeholder="Name oder Gerät" value="${e(this._dashboardSearch||'')}"></label><label>Veröffentlichung<select id="dashboard-filter"><option value="all">Alle Dashboards</option><option value="published">Veröffentlicht</option><option value="unpublished">Unveröffentlicht</option><option value="repair">Verknüpfung prüfen</option></select></label><label>Sortieren<select id="dashboard-sort"><option value="name">Name A–Z</option><option value="name-desc">Name Z–A</option><option value="status">Veröffentlichungsstatus</option></select></label><div class="dashboard-view-switch" role="group" aria-label="Ansicht wählen"><button type="button" class="secondary" id="dashboard-view-cards" aria-pressed="true">▦ Kacheln</button><button type="button" class="secondary" id="dashboard-view-table" aria-pressed="false">☷ Tabelle</button></div></div>
    <div class="grid" id="dashboard-list">${(this.items||[]).map(x=>`<article data-id="${e(x.id)}" data-name="${e((x.name||'')+' '+(x.profile||''))}" data-status="${!x.publication?'unpublished':x.publication.url_path===('rotapfel-'+x.id.replace(/[^a-z0-9]/gi,'').slice(0,20).toLowerCase())?'published':'repair'}"><strong>${e(x.name)}</strong><div><span class="dashboard-status ${!x.publication?'':x.publication.url_path===('rotapfel-'+x.id.replace(/[^a-z0-9]/gi,'').slice(0,20).toLowerCase())?'published':'repair'}">${!x.publication?'Nicht veröffentlicht':x.publication.url_path===('rotapfel-'+x.id.replace(/[^a-z0-9]/gi,'').slice(0,20).toLowerCase())?'Veröffentlicht':'Verknüpfung prüfen'}</span></div><p class="muted">${e(x.profile)} · ${e((x.tabs||[]).length)} Tabs</p><div class="actions"><button data-action="layout">Layout</button><button data-action="export" class="secondary">YAML exportieren</button><button data-action="backup" class="secondary">JSON sichern</button><button data-action="history" class="secondary">Versionen</button>${x.publication&&x.publication.url_path!==('rotapfel-'+x.id.replace(/[^a-z0-9]/gi,'').slice(0,20).toLowerCase())?`<button data-action="repair-publish">Kopie veröffentlichen</button>`:x.publication?`<button data-action="update">Veröffentlichung aktualisieren</button><button data-action="open" class="secondary">Öffnen</button><button data-action="remove" class="secondary">Veröffentlichung entfernen</button>`:`<button data-action="publish">Veröffentlichen</button>`}<button data-action="edit" class="secondary">Bearbeiten</button><button data-action="duplicate" class="secondary">Duplizieren</button><button data-action="delete" class="secondary">Dashboard endgültig löschen</button></div></article>`).join('')}</div>${this.items?.length===0?'<p class="muted">Noch keine Dashboards angelegt.</p>':''}<p id="dashboard-empty-filter" class="dashboard-empty-filter" hidden>Keine Dashboards entsprechen der Auswahl.</p>`}
    ${this.error?`<p class="error">${e(this.error)}</p>`:''}</main>
    <dialog><form method="dialog"><h2 id="dialog-title">Dashboard</h2><label>Name<input name="name" maxlength="80" required></label><label>Endgerät<select name="profile"><option value="fire_hd">Fire HD</option><option value="smartphone">Smartphone</option><option value="tablet">Tablet</option><option value="desktop">Desktop</option></select></label><div class="actions"><button type="button" id="save">Speichern</button><button type="submit" class="secondary">Abbrechen</button></div></form></dialog>`;
    const root=this.shadowRoot,dlg=root.querySelector('dialog');const open=x=>{this.editId=x?.id||null;root.querySelector('#dialog-title').textContent=x?'Dashboard bearbeiten':'Dashboard erstellen';root.querySelector('[name=name]').value=x?.name||'';root.querySelector('[name=profile]').value=x?.profile||'fire_hd';dlg.showModal();};
    const search=root.querySelector('#dashboard-search'),filter=root.querySelector('#dashboard-filter'),sort=root.querySelector('#dashboard-sort'),list=root.querySelector('#dashboard-list');
    if(list&&search&&filter&&sort){
      const viewCards=root.querySelector('#dashboard-view-cards'),viewTable=root.querySelector('#dashboard-view-table');
      let storedView='cards';
      try{storedView=localStorage.getItem('rotapfel_dashboard_overview_view')==='table'?'table':'cards';}catch(_e){}
      const setDashboardView=mode=>{
        const table=mode==='table';
        list.classList.toggle('dashboard-table',table);
        list.classList.toggle('grid',!table);
        viewCards?.setAttribute('aria-pressed',String(!table));
        viewTable?.setAttribute('aria-pressed',String(table));
        try{localStorage.setItem('rotapfel_dashboard_overview_view',table?'table':'cards');}catch(_e){}
      };
      viewCards?.addEventListener('click',()=>setDashboardView('cards'));
      viewTable?.addEventListener('click',()=>setDashboardView('table'));
      setDashboardView(storedView);
      filter.value=this._dashboardFilter||'all';sort.value=this._dashboardSort||'name';
      const updateDashboardList=()=>{
        this._dashboardSearch=search.value;this._dashboardFilter=filter.value;this._dashboardSort=sort.value;
        const cards=[...list.querySelectorAll('article[data-id]')];
        const q=search.value.trim().toLocaleLowerCase('de');
        cards.sort((a,b)=>sort.value==='status'?a.dataset.status.localeCompare(b.dataset.status,'de')||a.dataset.name.localeCompare(b.dataset.name,'de'):sort.value==='name-desc'?b.dataset.name.localeCompare(a.dataset.name,'de'):a.dataset.name.localeCompare(b.dataset.name,'de'));
        let visible=0;
        cards.forEach(card=>{list.append(card);const show=(!q||card.dataset.name.toLocaleLowerCase('de').includes(q))&&(filter.value==='all'||card.dataset.status===filter.value);card.hidden=!show;if(show)visible++;});
        const empty=root.querySelector('#dashboard-empty-filter');if(empty)empty.hidden=visible!==0||cards.length===0;
      };
      search.addEventListener('input',updateDashboardList);filter.addEventListener('change',updateDashboardList);sort.addEventListener('change',updateDashboardList);updateDashboardList();
    }
    root.querySelector('#rotapfel-ha-menu')?.addEventListener('click',()=>this.openHASidebar());
    root.querySelector('#frontend-reload')?.addEventListener('click',()=>window.location.reload());
    root.querySelector('#resource-manager')?.addEventListener('click',()=>this.resourceManager());
    root.querySelector('#import-dashboard-backup')?.addEventListener('click',()=>root.querySelector('#dashboard-backup-file')?.click());root.querySelector('#dashboard-backup-file')?.addEventListener('change',async ev=>{const file=ev.target.files?.[0];ev.target.value='';await this.importDashboardBackup(file);});
    root.querySelector('#create')?.addEventListener('click',()=>open());root.querySelector('#save').onclick=async()=>{const name=root.querySelector('[name=name]').value.trim(),profile=root.querySelector('[name=profile]').value;if(!name)return;dlg.close();await this.act(this.editId?'update':'create',{id:this.editId,name,profile});this.render();};
    root.querySelectorAll('[data-action]').forEach(b=>b.onclick=async()=>{const id=b.closest('article').dataset.id,x=this.items.find(y=>y.id===id),a=b.dataset.action;if(a==='history'){await this.manageDashboardHistory(x);}else if(a==='export'){this.downloadExport(x);}else if(a==='backup'){this.downloadDashboardBackup(x);}else if(['publish','update','remove','repair-publish'].includes(a)){await this.publicationAction(x,a==='repair-publish'?'publish':a);}else if(a==='open'){window.location.href='/'+x.publication.url_path+'/'+(x.tabs?.[0]?.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-');}else if(a==='layout'){this.editing=id;this._deviceLayoutProfile='fire_hd';this.layout=JSON.parse(JSON.stringify(x.tabs||[]));this.eachLayoutCard(c=>{if(c.deviceLayouts?.fire_hd)c.position=JSON.parse(JSON.stringify(c.deviceLayouts.fire_hd));});this.tabId=this.layout[0]?.id;this._roomTestMode=false;this.dirty=false;this.theme=x.theme||'light';this.canvas=JSON.parse(JSON.stringify(x.canvas||{mode:'responsive',width:1920,height:1080,columns:12,gap:8}));this.deviceProfiles=JSON.parse(JSON.stringify(x.deviceProfiles||{}));const migrated=this.migrateLegacyThermCards(this.layout);this.dirty=migrated>0;this._migrationMessage='';this.render();if(migrated)await this.persistMigration(migrated);}else if(a==='edit')open(x);else if(a==='delete'){await this.deleteManagedDashboard(x);}else if(a==='duplicate'){if(await this.act('duplicate',{id})){this.render();window.location.reload();}}});
    if(d){this.bindEditor();this.bindToggles();this.bindClimateControls();this.mountExternalCards();this.watchCanvasPreview();this.watchRoomCardPreviews();}
  }
  normalizedProfiles(profiles,canvas){
    const base=canvas||this.canvas||{width:1920,height:1080};
    return {fire_hd:{name:'Fire HD 10',width:Number(base.width)||1920,height:Number(base.height)||1080,fixed:true},desktop:{name:'Desktop',width:Number(base.width)||1920,height:Number(base.height)||1080,fixed:true},iphone:{name:'iPhone',width:402,height:874,fixed:false},...(profiles||{})};
  }
  async manageLayoutTemplates(){
    // Central Home Assistant Store. Import browser templates once, without overwriting server entries.
    const key='rotapfel_dashboard_layout_templates_v1';
    let templates=[];
    try {
      const response=await this.api('layout_templates');
      templates=Array.isArray(response.templates)?response.templates:[];
      const legacy=JSON.parse(localStorage.getItem(key)||'[]');
      if(Array.isArray(legacy)&&legacy.length){
        let changed=false;
        for(const t of legacy){if(t&&typeof t.name==='string'&&!templates.some(v=>v.name.toLowerCase()===t.name.toLowerCase())){templates.push(t);changed=true;}}
        if(changed){const saved=await this.api('save_layout_templates',{templates});templates=saved.templates;}
        localStorage.removeItem(key);
      }
    }catch(err){alert('Zentrale Layout-Vorlagen konnten nicht geladen werden: '+String(err));return;}
    const read=()=>templates;
    const persist=async next=>{const response=await this.api('save_layout_templates',{templates:next});templates=response.templates;};
    const dlg=document.createElement('dialog');
    dlg.style.cssText='padding:22px;border-radius:14px;border:1px solid #999;min-width:min(460px,90vw);max-width:90vw;background:var(--card-background-color,#fff);color:var(--primary-text-color,#222)';
    dlg.innerHTML=`<div style="display:grid;gap:12px"><h3 style="margin:0">Layout-Vorlagen</h3><p style="margin:0">Speichere die komplette Dashboard-Anordnung inklusive aller Tabs, Räume, Karten und Geräteprofile als wiederverwendbare Vorlage.</p><label>Vorlage auswählen<select id="lt-select" style="width:100%;padding:9px"></select></label><label>Vorlagenname<input id="lt-name" maxlength="80" placeholder="z. B. Wohnzimmer-Layout" style="width:100%;padding:9px;box-sizing:border-box"></label><p id="lt-status" style="margin:0;color:var(--secondary-text-color,#666)"></p><div style="display:flex;flex-wrap:wrap;gap:8px"><button type="button" id="lt-save">Aktuelles Layout speichern</button><button type="button" id="lt-load">Vorlage anwenden</button><button type="button" id="lt-delete">Vorlage löschen</button><button type="button" id="lt-close">Schließen</button></div><small>Vorlagen werden zentral in Home Assistant gespeichert und stehen auf allen Geräten zur Verfügung.</small></div>`;
    this.shadowRoot.append(dlg);
    const select=dlg.querySelector('#lt-select'),name=dlg.querySelector('#lt-name'),status=dlg.querySelector('#lt-status');
    const refresh=(preferred='')=>{const templates=read();select.replaceChildren(new Option('Vorlage auswählen …',''),...templates.map(t=>new Option(t.name,t.id)));if(preferred)select.value=preferred;};
    const current=()=>read().find(t=>t.id===select.value);
    dlg.querySelector('#lt-save').onclick=async()=>{
      const title=name.value.trim();if(!title){status.textContent='Bitte zuerst einen Vorlagennamen eingeben.';return;}
      const templates=[...read()],existing=templates.findIndex(t=>t.name.toLowerCase()===title.toLowerCase());
      if(existing>=0&&!confirm('Vorlage „'+title+'“ überschreiben?'))return;
      // Persist the current profile positions before snapshotting.
      const tabs=JSON.parse(JSON.stringify(this.layout||[]));
      const profile=this._deviceLayoutProfile||'fire_hd';
      for(const tab of tabs)for(const room of tab.rooms||[])for(const card of room.cards||[]){
        if(card.position){card.deviceLayouts=card.deviceLayouts||{};card.deviceLayouts[profile]=JSON.parse(JSON.stringify(card.position));}
      }
      const item={id:existing>=0?templates[existing].id:this.uid(),name:title,created:new Date().toISOString(),tabs,theme:this.theme,canvas:JSON.parse(JSON.stringify(this.canvas)),deviceProfiles:JSON.parse(JSON.stringify(this.deviceProfiles||{}))};
      if(existing>=0)templates[existing]=item;else templates.push(item);
      try{await persist(templates);refresh(item.id);status.textContent='Vorlage zentral in Home Assistant gespeichert.';}catch(err){status.textContent='Speichern fehlgeschlagen: '+err.message;}
    };
    dlg.querySelector('#lt-load').onclick=()=>{
      const item=current();if(!item){status.textContent='Bitte eine Vorlage auswählen.';return;}
      if(!confirm('Die Vorlage „'+item.name+'“ ersetzt das aktuelle Dashboard-Layout im Editor. Nicht gespeicherte Änderungen gehen verloren. Fortfahren?'))return;
      this.layout=JSON.parse(JSON.stringify(item.tabs));this.theme=item.theme||'light';this.canvas=JSON.parse(JSON.stringify(item.canvas));this.deviceProfiles=JSON.parse(JSON.stringify(item.deviceProfiles||{}));
      this._deviceLayoutProfile='fire_hd';this.eachLayoutCard(c=>{if(c.deviceLayouts?.fire_hd)c.position=JSON.parse(JSON.stringify(c.deviceLayouts.fire_hd));});
      this.tabId=this.layout[0]?.id;this.dirty=true;dlg.close();this.render();
    };
    dlg.querySelector('#lt-delete').onclick=async()=>{
      const item=current();if(!item){status.textContent='Bitte eine Vorlage auswählen.';return;}
      if(!confirm('Vorlage „'+item.name+'“ löschen?'))return;
      try{await persist(read().filter(t=>t.id!==item.id));refresh();status.textContent='Vorlage gelöscht.';}catch(err){status.textContent='Löschen fehlgeschlagen: '+err.message;}
    };
    select.onchange=()=>{name.value=current()?.name||'';};
    dlg.querySelector('#lt-close').onclick=()=>dlg.close();dlg.addEventListener('close',()=>dlg.remove(),{once:true});refresh();dlg.showModal();
  }
  manageDeviceProfiles(){
    const profiles=this.normalizedProfiles(this.deviceProfiles);
    const custom=Object.keys(profiles).filter(k=>!['fire_hd','desktop','iphone'].includes(k));
    const dlg=document.createElement('dialog');
    dlg.style.cssText='padding:24px;border-radius:14px;border:1px solid #999;min-width:min(480px,90vw);background:var(--card-background-color,#fff);color:var(--primary-text-color,#222)';
    dlg.innerHTML=`<form style="display:grid;gap:12px"><h3>Geräteprofile verwalten</h3>
      <label>Aktion<select name="action"><option value="1">Neues Profil</option><option value="2">Profil duplizieren</option><option value="3">Profil bearbeiten</option><option value="4">Profil löschen</option></select></label>
      <label id="profile-source-row">Profil auswählen<select name="source" style="display:block;width:100%;min-height:38px;padding:8px"></select></label>
      <div id="profile-fields" style="display:grid;gap:10px"><label>Name<input name="profileName" maxlength="60"></label>
      <label>Breite in CSS-px<input name="width" type="number" min="320" max="10000"></label>
      <label>Höhe in CSS-px<input name="height" type="number" min="240" max="10000"></label>
      <fieldset><legend>Höhenverhalten</legend><button type="button" data-mode="dynamic">Dynamisch</button> <button type="button" data-mode="fixed">Fix</button><p id="mode-description"></p></fieldset></div>
      <p id="profile-error" style="color:var(--error-color,#c33)"></p>
      <div style="display:flex;justify-content:flex-end;gap:8px"><button type="button" id="profile-cancel">Abbrechen</button><button type="submit" id="profile-submit">Übernehmen</button></div></form>`;
    this.shadowRoot.append(dlg);
    const form=dlg.querySelector('form'),action=form.elements.action,source=form.elements.source;
    let fixed=false;
    const showMode=()=>{dlg.querySelectorAll('[data-mode]').forEach(b=>{const selected=(b.dataset.mode==='fixed')===fixed;b.style.setProperty('background',selected?'var(--primary-color,#039fc7)':'#e5e7eb','important');b.style.setProperty('color',selected?'#fff':'#1f2937','important');b.style.setProperty('border',selected?'2px solid var(--primary-color,#039fc7)':'1px solid #9ca3af','important');b.style.setProperty('box-shadow',selected?'0 0 0 2px #039fc733':'none','important');b.style.outline='none';b.style.fontWeight=selected?'700':'500';b.setAttribute('aria-pressed',String(selected));});dlg.querySelector('#mode-description').textContent=fixed?'Feste Displayhöhe':'Dynamisch wachsende Höhe';};
    dlg.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{fixed=b.dataset.mode==='fixed';showMode();});
    const fill=()=>{const original=profiles[source.value]||profiles.fire_hd;form.elements.profileName.value=action.value==='1'?'Neues Gerät':action.value==='2'?original.name+' Kopie':original.name;form.elements.width.value=original.width;form.elements.height.value=original.height;fixed=!!original.fixed;showMode();};
    const update=()=>{const a=action.value,keys=a==='3'||a==='4'?custom:Object.keys(profiles);source.innerHTML=keys.map(k=>`<option value="${k}">${this.esc(profiles[k].name)} · ${profiles[k].width} × ${profiles[k].height}</option>`).join('');dlg.querySelector('#profile-source-row').style.display=a==='1'?'none':'';dlg.querySelector('#profile-fields').style.display=a==='4'?'none':'grid';dlg.querySelector('#profile-submit').disabled=!keys.length&&a!=='1';dlg.querySelector('#profile-error').textContent=!keys.length&&a!=='1'?'Keine eigenen Profile vorhanden. Bitte zuerst ein Profil erstellen oder duplizieren.':'';fill();};
    action.onchange=update;source.onchange=fill;
    dlg.querySelector('#profile-cancel').onclick=()=>dlg.close();dlg.addEventListener('close',()=>dlg.remove(),{once:true});
    form.onsubmit=ev=>{ev.preventDefault();const a=action.value,src=a==='1'?'fire_hd':source.value,original=profiles[src];if(!original)return;
      if(a==='4'){if(!confirm('Profil „'+original.name+'“ und seine Kartenpositionen löschen?'))return;this.eachLayoutCard(c=>{if(c.deviceLayouts)delete c.deviceLayouts[src];});delete profiles[src];if(this._deviceLayoutProfile===src)this.switchDeviceLayoutProfile('fire_hd');}
      else{const name=form.elements.profileName.value.trim(),width=Number(form.elements.width.value),height=Number(form.elements.height.value);if(!name||!Number.isInteger(width)||width<320||width>10000||!Number.isInteger(height)||height<240||height>10000){dlg.querySelector('#profile-error').textContent='Bitte gültige Profilmaße eingeben.';return;}
        const key=a==='3'?src:'custom_'+this.uid().replace(/[^a-z0-9]/gi,'').slice(0,12);profiles[key]={name:name.slice(0,60),width,height,fixed};
        if(a!=='3')this.eachLayoutCard(c=>{c.deviceLayouts=c.deviceLayouts||{};if(c.position)c.deviceLayouts[this._deviceLayoutProfile||'fire_hd']=JSON.parse(JSON.stringify(c.position));const base=c.deviceLayouts[src]||c.position;if(base){const q=JSON.parse(JSON.stringify(base)),factor=width/original.width;q.x=Math.max(0,Math.round((Number(q.x)||0)*factor));q.y=Math.max(0,Math.round((Number(q.y)||0)*height/original.height));q.w=Math.max(1,Math.min(width,Math.round((Number(q.w)||240)*factor)));q.h=Math.max(1,Math.round((Number(q.h)||110)*factor));q.x=Math.min(q.x,width-q.w);c.deviceLayouts[key]=q;}});
        if(a!=='3'){this._deviceLayoutProfile=key;this.eachLayoutCard(c=>{if(c.deviceLayouts?.[key])c.position=JSON.parse(JSON.stringify(c.deviceLayouts[key]));});}
      }
      for(const k of ['fire_hd','desktop','iphone'])delete profiles[k];this.deviceProfiles=profiles;this.dirty=true;dlg.close();this.render();
    };
    update();dlg.showModal();
  }
  effectiveCanvas(t){
    const base=t.canvas||this.canvas||{mode:'responsive',width:1920,height:1080,columns:12,gap:8};
    if(this.editing){const p=this.normalizedProfiles(this.deviceProfiles)[this._deviceLayoutProfile||'fire_hd'];if(p)return {...base,mode:'fixed',width:p.width,height:p.height};}
    return base;
  }
  eachLayoutCard(callback){for(const tab of this.layout||[])for(const room of tab.rooms||[])for(const card of room.cards||[])callback(card);}
  switchDeviceLayoutProfile(next){
    const previous=this._deviceLayoutProfile||'fire_hd';if(next===previous)return;
    this.eachLayoutCard(card=>{
      card.deviceLayouts=card.deviceLayouts||{};
      if(card.position)card.deviceLayouts[previous]=JSON.parse(JSON.stringify(card.position));
      if(!card.deviceLayouts[next]){
        const base=card.deviceLayouts.fire_hd||card.position||{};
        const q=JSON.parse(JSON.stringify(base));
        if(next==='iphone'){
          q.x=Math.max(0,Math.min(326,Math.round((Number(q.x)||0)*402/1920)));
          q.y=Math.max(0,Math.min(814,Math.round((Number(q.y)||0)*874/1080)));
          q.w=Math.max(76,Math.min(402,Math.round((Number(q.w)||300)*402/1920)));
          q.h=Math.max(60,Math.min(874,Math.round((Number(q.h)||200)*874/1080)));
          q.x=Math.min(q.x,402-q.w);q.y=Math.min(q.y,874-q.h);
        }
        if(next!=='iphone'&&next!=='fire_hd'&&next!=='desktop'){
          const p=this.normalizedProfiles(this.deviceProfiles)[next],baseP=this.normalizedProfiles(this.deviceProfiles).fire_hd;
          if(p){const factor=p.width/baseP.width;q.x=Math.max(0,Math.round((Number(q.x)||0)*factor));q.y=Math.max(0,Math.round((Number(q.y)||0)*factor));q.w=Math.max(1,Math.min(p.width,Math.round((Number(q.w)||240)*factor)));q.h=Math.max(1,Math.round((Number(q.h)||110)*factor));q.x=Math.min(q.x,p.width-q.w);}
        }
        card.deviceLayouts[next]=q;
      }
      card.position=JSON.parse(JSON.stringify(card.deviceLayouts[next]));
    });
    this._deviceLayoutProfile=next;this.dirty=true;this.render();
  }
  canvasDialog(tab=null){
    const current=tab?.canvas||this.canvas||{mode:'responsive',width:1920,height:1080,columns:12,gap:8};
    const overlay=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;background:#0009;z-index:9999;display:grid;place-items:center;padding:16px';
    const e=s=>this.esc(s);
    overlay.innerHTML=`<div style="background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);padding:22px;border-radius:14px;width:min(460px,95vw);max-height:90vh;overflow:auto"><h2>${tab?'Tab-Abmessungen':'Dashboard-Abmessungen'}</h2>${tab?`<label><input type="checkbox" id="inherit" style="width:auto;display:inline" ${!tab.canvas?'checked':''}> Dashboard-Einstellungen übernehmen</label>`:''}<label>Layoutmodus<select id="mode"><option value="responsive" ${current.mode==='responsive'?'selected':''}>Responsiv</option><option value="fixed" ${current.mode==='fixed'?'selected':''}>Feste Pixelgröße</option></select></label><label>Breite (CSS-Pixel)<input id="width" type="number" min="320" max="7680" value="${e(current.width)}"></label><label>Höhe (CSS-Pixel)<input id="height" type="number" min="240" max="4320" value="${e(current.height)}"></label><label>Rasterspalten<input id="columns" type="number" min="1" max="24" value="${e(current.columns)}"></label><label>Rasterabstand (Pixel)<input id="gap" type="number" min="0" max="64" value="${e(current.gap)}"></label><div class="actions"><button id="apply">Übernehmen</button><button class="secondary" id="cancel">Abbrechen</button></div><p class="muted">Bei fester Größe kann die Arbeitsfläche horizontal gescrollt werden. Die Maße sind CSS-Pixel, nicht zwingend physische Displaypixel.</p></div>`;
    this.shadowRoot.appendChild(overlay);
    overlay.querySelector('#cancel').onclick=()=>overlay.remove();
    overlay.querySelector('#apply').onclick=()=>{
      if(tab&&overlay.querySelector('#inherit').checked){delete tab.canvas;overlay.remove();this.dirty=true;this.render();return;}
      const val=id=>Number(overlay.querySelector('#'+id).value),v={mode:overlay.querySelector('#mode').value,width:val('width'),height:val('height'),columns:val('columns'),gap:val('gap')};
      if(!Number.isInteger(v.width)||v.width<320||v.width>7680||!Number.isInteger(v.height)||v.height<240||v.height>4320||!Number.isInteger(v.columns)||v.columns<1||v.columns>24||!Number.isInteger(v.gap)||v.gap<0||v.gap>64){alert('Bitte gültige Maße und Rasterwerte eingeben.');return;}
      if(tab)tab.canvas=v;else this.canvas=v;
      overlay.remove();this.dirty=true;this.render();
    };
  }
  cardPositions(tab,cv){
    const width=Math.max(320,Number(cv.width)||1920),height=Math.max(240,Number(cv.height)||1080);
    const rooms=tab.rooms||[];
    const activeRoom=rooms.find(r=>r.id===this._activeRoomByTab?.[tab.id])||rooms[0];
    const cards=(activeRoom?.cards||[]).map(c=>({c,room:activeRoom}));
    const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
    return cards.map(({c,room},i)=>{
      const w=clamp(Number(c.position?.w ?? Math.round(this.design(c).width*width/4)),76,width);
      const h=clamp(Number(c.position?.h ?? this.design(c).height),60,height);
      const x=clamp(Number(c.position?.x ?? ((i%3)*Math.min(400,Math.floor(width/3)))),0,width-w);
      const y=clamp(Number(c.position?.y ?? Math.floor(i/3)*160),0,height-h);
      return {c,room,x,y,w,h};
    });
  }
  placeNewCard(room,c){
    // Alpha 13.5: place only the NEW card; never move saved cards.
    const tab=this.layout?.find(t=>(t.rooms||[]).some(r=>r.id===room.id));
    if(!tab)return;
    const cv=this.effectiveCanvas(tab);
    const width=Math.max(320,Number(cv.width)||1920);
    const height=Math.max(240,Number(cv.height)||1080);
    const gap=Math.max(8,Number(cv.gap)||8);
    const kind=this.externalVariant(c);
    const w=Math.min(width-gap*2,kind==='climate_cluster'?900:kind==='equinox'?440:kind==='rotapfel_simple_thermcard'?450:c.type==='custom'?320:Math.max(180,Math.round(this.design(c).width*width/4)));
    const h=Math.min(height-gap*2,kind==='climate_cluster'?520:kind==='equinox'?280:kind==='rotapfel_simple_thermcard'?180:c.type==='custom'?80:Math.max(60,Number(this.design(c).height)||110));
    const other=this.cardPositions(tab,cv).filter(p=>p.c.id!==c.id);
    const occupied=other.map(p=>({
      x:p.x,y:p.y,w:p.w,
      h:Math.max(p.h,this.externalVariant(p.c)==='climate_cluster'?520:this.externalVariant(p.c)==='equinox'?360:this.externalVariant(p.c)==='rotapfel_simple_thermcard'?180:0)
    }));
    const free=(x,y)=>x>=gap&&y>=gap&&x+w<=width-gap&&y+h<=height-gap&&
      occupied.every(p=>x+w+gap<=p.x||p.x+p.w+gap<=x||y+h+gap<=p.y||p.y+p.h+gap<=y);
    // First try the established left-aligned position below the last card.
    const bottom=occupied.reduce((m,p)=>Math.max(m,p.y+p.h),0);
    const preferredY=occupied.length?bottom+gap:gap;
    if(free(gap,preferredY)){c.position={x:gap,y:preferredY,w,h};return;}
    // Scan candidate columns left-to-right; within each column, top-to-bottom.
    // Edges of existing cards are included to use irregular free spaces.
    const xs=new Set([gap]);
    for(const p of occupied)xs.add(Math.max(gap,Math.round(p.x+p.w+gap)));
    const step=Math.max(20,Math.round((width-2*gap)/Math.max(1,Number(cv.columns)||12)));
    for(let x=gap;x<=width-w-gap;x+=step)xs.add(x);
    const ys=new Set([gap]);
    for(const p of occupied)ys.add(Math.max(gap,Math.round(p.y+p.h+gap)));
    const sortedY=[...ys].sort((a,b)=>a-b);
    for(const x of [...xs].sort((a,b)=>a-b)){
      if(x+w>width-gap)continue;
      for(const y of sortedY){
        if(free(x,y)){c.position={x,y,w,h};return;}
      }
    }
    // Conservative atomic push when no free slot exists. Only move cards in
    // this room without locks, groups or device-specific layouts; never touch
    // other rooms or device profiles. Try right, left and down, then roll back.
    const own=other.filter(p=>room.cards.some(card=>card.id===p.c.id));
    const foreign=other.filter(p=>!room.cards.some(card=>card.id===p.c.id));
    const movable=own.length>0&&own.every(p=>p.c.position?.editorLocked!==true
      &&!p.c.groupId&&!Object.keys(p.c.deviceLayouts||{}).length);
    const intersects=(a,b)=>!(a.x+a.w+gap<=b.x||b.x+b.w+gap<=a.x||a.y+a.h+gap<=b.y||b.y+b.h+gap<=a.y);
    if(movable){
        for(const [dx,dy] of [[w+gap,0],[-(w+gap),0],[0,h+gap]]){
        const shifted=own.map(p=>({...p,x:p.x+dx,y:p.y+dy}));
        const candidate={x:gap,y:gap,w,h};
        const within=p=>p.x>=gap&&p.y>=gap&&p.x+p.w<=width-gap&&p.y+p.h<=height-gap;
        if(!shifted.every(within)||!within(candidate))continue;
        if(shifted.some(p=>foreign.some(f=>intersects(p,f)))||
           foreign.some(f=>intersects(candidate,f))||
           shifted.some(p=>intersects(candidate,p)))continue;
        for(const p of shifted){
          p.c.position={...(p.c.position||{}),x:p.x,y:p.y,w:p.w,h:p.h};
        }
        c.position={x:gap,y:gap,w,h};
        this._placementWarning='';
        return;
      }
      // No mutation occurs unless an entire candidate arrangement fits.
    }
    // Never silently overlap: leave the new card below the canvas and warn.
    c.position={x:gap,y:preferredY,w,h};
    this._placementWarning='Keine freie Position innerhalb der Dashboardfläche gefunden. Bitte eine Karte verschieben, verkleinern oder die Dashboardmaße erhöhen.';
  }
  // Fit the external content INSIDE the frame; never resize the frame based on
  // card measurements. Both editors therefore display identical saved bounds.
  fitCanvasCards(container){
    if(!container)return;
    for(const tile of container.querySelectorAll('.position-tile')){
      // The positioning frame is the fixed geometry; fitting its contents
      // must never alter saved width/height or bypass position/size locks.
      const slot=tile.querySelector('.external-card-slot');
      if(!slot){
        // Native previews are responsive and must fill the same frame without
        // letting their own minimum size expand the positioning rectangle.
        const preview=tile.querySelector('.nexus-preview');
        if(preview){
          preview.style.setProperty('box-sizing','border-box','important');
          preview.style.setProperty('max-width','100%','important');
          preview.style.setProperty('max-height','100%','important');
          preview.style.setProperty('overflow','hidden','important');
        }
        continue;
      }
      const id=slot.dataset.externalCard;
      const card=(this.layout||[]).flatMap(t=>(t.rooms||[]).flatMap(r=>r.cards||[])).find(c=>c.id===id);
      const kind=card&&(this.externalVariant(card)||(card.type==='custom'?'generic_custom':null));
      if(!kind)continue;
      const preview=tile.querySelector('.external-card-preview');
      if(preview){preview.style.setProperty('height','100%','important');preview.style.setProperty('min-height','0','important');preview.style.setProperty('overflow','hidden','important');preview.style.setProperty('padding','0','important');preview.style.position='relative';}
      const host=slot.firstElementChild;
      const surface=kind==='equinox'?this.findExternalSurface(host):null;
      // Equinox uses its own responsive shadow-DOM surface. Its actual
      // dimensions, not a guessed 430 x 310 box, define the scaling ratio.
      // The ThermCard must use the same unscaled staging width in both the
      // positioning editor and the room overview. Reading host.offsetWidth
      // here made the preview depend on the previous render / zoom.
      const intrinsicWidth=kind==='climate_cluster'?850:kind==='equinox'?430:
        kind==='rotapfel_simple_thermcard'?400:kind==='generic_custom'?Math.max(76,tile.clientWidth-2):Math.max(100,host?.offsetWidth||400);
      slot.style.position='absolute';slot.style.left='0';slot.style.top='0';
      slot.style.width=intrinsicWidth+'px';slot.style.minWidth=intrinsicWidth+'px';slot.style.maxWidth='none';
      slot.style.height='auto';slot.style.maxHeight='none';slot.style.overflow='visible';
      if(kind==='generic_custom'&&host){host.style.display='block';host.style.width='100%';host.style.maxWidth='100%';}
      slot.style.transformOrigin='0 0';slot.style.transform='none';
      let naturalHeight=kind==='climate_cluster'?0:kind==='equinox'?0:0;
      if(host){
        naturalHeight=Math.max(naturalHeight,host.offsetHeight||0,host.scrollHeight||0);
        if(host.shadowRoot&&kind!=='equinox'){
          for(const el of host.shadowRoot.querySelectorAll('ha-card,.card,.container,.main,.wrapper'))
            naturalHeight=Math.max(naturalHeight,el.scrollHeight||0,el.offsetHeight||0);
        }
      }
      if(kind==='equinox')naturalHeight=surface?.offsetHeight>40&&surface.offsetHeight<1000?surface.offsetHeight:220;
      if(kind==='climate_cluster')naturalHeight=Math.max(180,naturalHeight);
      if(kind==='rotapfel_simple_thermcard')naturalHeight=Math.max(80,naturalHeight);
      const width=Math.max(1,tile.clientWidth-2),height=Math.max(1,tile.clientHeight-2);
      // Preserve the card's aspect ratio. Independent X/Y scaling distorted
      // text, icons and gauges, especially in narrow phone layouts.
      const fittedScale=Math.max(0.03,Math.min(width/intrinsicWidth,height/Math.max(1,naturalHeight)));
      // Auto-fitting a ThermCard locks its visual scale independently of the
      // frame geometry. A manual resize clears this lock below.
      const savedScale=kind==='rotapfel_simple_thermcard'?Number(card.position?.thermScale):NaN;
      let uniformScale=Number.isFinite(savedScale)&&savedScale>0?Math.min(3,savedScale):fittedScale;
      if(kind==='rotapfel_simple_thermcard'&&host?.shadowRoot){
        const painted=host.shadowRoot.querySelector('.hd')||[...host.shadowRoot.querySelectorAll('*')].find(n=>n.shadowRoot?.querySelector('.hd'))?.shadowRoot?.querySelector('.hd');
        if(painted&&painted.offsetWidth>0&&painted.offsetHeight>0)
          uniformScale=Math.max(.01,Math.min(uniformScale,(width-4)/painted.offsetWidth,(height-4)/painted.offsetHeight));
      }
      slot.style.transform=`scale(${uniformScale})`;
      // Align the painted ThermCard's top-left corner with the positioning
      // tile, rather than aligning its staging host (which has inner insets).
      if(kind==='rotapfel_simple_thermcard'&&host?.shadowRoot){
        let painted=host.shadowRoot.querySelector('.hd');
        if(!painted){
          const nested=[...host.shadowRoot.querySelectorAll('*')].find(n=>n.shadowRoot?.querySelector('.hd'));
          painted=nested?.shadowRoot?.querySelector('.hd');
        }
        if(painted){
          const tileRect=tile.getBoundingClientRect();
          const cardRect=painted.getBoundingClientRect();
          // Translation is expressed in rendered pixels; scale stays intact.
          const outerZoom=tile.offsetWidth>0?tileRect.width/tile.offsetWidth:1;
          const dx=(tileRect.left+2*outerZoom-cardRect.left)/Math.max(.01,outerZoom);
          const dy=(tileRect.top+2*outerZoom-cardRect.top)/Math.max(.01,outerZoom);
          if(Number.isFinite(dx)&&Number.isFinite(dy)&&Math.abs(dx)<300&&Math.abs(dy)<300)
            slot.style.transform=`translate(${dx}px,${dy}px) scale(${uniformScale})`;
        }
      }
      slot.dataset.fitScale=String(uniformScale);
      slot.dataset.fitScaleY=String(uniformScale);
    }
  }
  watchCanvasPreview(){
    if(this._canvasCardObserver){this._canvasCardObserver.disconnect();this._canvasCardObserver=null;}
    const canvas=this.shadowRoot.querySelector('.canvas-preview');
    if(!canvas)return;
    const fit=()=>{if(canvas.isConnected)this.fitCanvasCards(canvas);};
    requestAnimationFrame(()=>requestAnimationFrame(fit));
    const observer=new ResizeObserver(()=>requestAnimationFrame(fit));
    canvas.querySelectorAll('.external-card-slot').forEach(slot=>{
      if(slot.firstElementChild)observer.observe(slot.firstElementChild);
    });
    this._canvasCardObserver=observer;
  }
  // Locate the rendered card even when the custom element uses nested shadow roots.
  findExternalSurface(host){
    if(!host)return null;
    const roots=[host.shadowRoot].filter(Boolean);
    let fallback=null;
    for(let i=0;i<roots.length;i++){
      const root=roots[i];
      const found=root.querySelector('ha-card');
      if(found&&found.offsetWidth>50&&found.offsetHeight>40)return found;
      fallback=fallback||found;
      for(const el of root.querySelectorAll('*'))if(el.shadowRoot)roots.push(el.shadowRoot);
    }
    return fallback;
  }
  externalCardSize(card,tile){
    const kind=this.externalVariant(card);
    if(!kind)return null;
    const slot=tile?.querySelector('.external-card-slot');
    const host=slot?.firstElementChild;
    const surface=this.findExternalSurface(host);
    const nativeWidth=kind==='climate_cluster'?850:kind==='equinox'?430:400;
    const fallbackHeight=kind==='climate_cluster'?540:kind==='equinox'?220:220;
    // Measure the actual painted .hd card, not the staging host or .hd-c
    // container. The latter may fill the oversized positioning frame.
    if(kind==='rotapfel_simple_thermcard'&&host){
      const roots=[host.shadowRoot].filter(Boolean);
      for(let i=0;i<roots.length&&i<20;i++){
        const root=roots[i];
        const painted=root.querySelector('.hd');
        if(painted&&painted.offsetWidth>50&&painted.offsetHeight>30){
          // The painted card may have overflow content below its CSS box.
          // Measure both the border box and its actual content, before
          // applying the already stored positioning scale.
          const rect=painted.getBoundingClientRect();
          const hostRect=host.getBoundingClientRect();
          const layoutScale=host.offsetWidth>0?hostRect.width/host.offsetWidth:1;
          const measuredW=layoutScale>0?rect.width/layoutScale:painted.offsetWidth;
          const measuredH=layoutScale>0?rect.height/layoutScale:painted.offsetHeight;
          const visualWidth=Math.max(painted.offsetWidth,painted.scrollWidth,measuredW);
          const visualHeight=Math.max(painted.offsetHeight,painted.scrollHeight,measuredH);
          return {nativeWidth:Math.ceil(visualWidth),nativeHeight:Math.ceil(visualHeight)};
        }
        for(const node of root.querySelectorAll('*'))if(node.shadowRoot)roots.push(node.shadowRoot);
      }
      return {nativeWidth:Math.max(80,host.offsetWidth||nativeWidth),
        nativeHeight:Math.max(60,host.offsetHeight||fallbackHeight)};
    }
    // offsetWidth/Height are untransformed CSS pixels, avoiding the double
    // scaling error from getBoundingClientRect() inside the zoomed preview.
    return {nativeWidth:kind==='equinox'?nativeWidth:(surface?.offsetWidth>50?surface.offsetWidth:nativeWidth),
      nativeHeight:surface?.offsetHeight>40&&surface.offsetHeight<1000?surface.offsetHeight:fallbackHeight};
  }
  // Standard dimensions: explicit card options first, then the card's own
  // declared defaults, then an isolated unscaled render. Never infer a
  // 'native' size from the already scaled positioning frame.
  async standardExternalSize(card){
    const cfg=this.externalConfig(card)||{};
    const numeric=(obj,keys)=>{for(const k of keys){
      const n=Number(obj?.[k]);if(Number.isFinite(n)&&n>0)return n;
    }return null;};
    const widthKeys=['width','card_width','default_width','min_width'];
    const heightKeys=['height','card_height','default_height','min_height'];
    let w=numeric(cfg,widthKeys),h=numeric(cfg,heightKeys);
    const tag=cfg.type?.replace(/^custom:/,'');
    if(!tag||!await this.ensureExternalResource(card))return null;
    const ctor=customElements.get(tag);
    const defaults=ctor?.defaultConfig||ctor?.defaults||ctor?.DEFAULT_CONFIG||{};
    w??=numeric(defaults,widthKeys);
    h??=numeric(defaults,heightKeys);
    if(w&&h)return {w,h,source:'configuration'};
    // Isolated card, outside any scaled preview. Responsive cards do not
    // expose a unique width; use a stable host width for their measurement.
    const probe=document.createElement('div');
    probe.style.cssText='position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;width:max-content;max-width:none;contain:layout style;z-index:-1';
    const host=document.createElement(tag);
    const probeWidth=w||(tag==='equinox-card'?430:430);
    host.style.cssText=`display:block;width:${probeWidth}px;max-width:none`;
    probe.append(host);this.shadowRoot.append(probe);
    try{
      if(typeof host.setConfig!=='function')return null;
      host.setConfig(cfg);host.hass=this._hass;
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const surface=this.findExternalSurface(host);
      const rect=surface||host;
      const mw=rect.offsetWidth,mh=rect.offsetHeight;
      if(!w&&mw>50)w=mw;
      if(!h&&mh>40)h=mh;
      return w&&h?{w,h,source:'rendered'}:null;
    }catch(err){return null;}
    finally{probe.remove();}
  }
  fittedFrameHeight(card,tile,w){
    const size=this.externalCardSize(card,tile);
    if(!size)return null;
    return Math.max(60,Math.round(w*size.nativeHeight/size.nativeWidth));
  }
  // Move cards only when necessary, preserving the current order and positions.
  // The frame fit must never silently introduce an overlap.
  autoFitExternalFrames(tab,overlay,positions,update,includeProtected=false,onlyCardId=null){
    const tiles=[...overlay.querySelectorAll('.position-tile[data-id]')];
    const all=(tab.rooms||[]).flatMap(r=>r.cards||[]);
    const width=Number(this.effectiveCanvas(tab).width)||1920;
    const height=Number(this.effectiveCanvas(tab).height)||1080;
    const gap=8;
    let count=0;
    for(const tile of tiles){
      const card=all.find(c=>c.id===tile.dataset.id);
      if(onlyCardId&&card?.id!==onlyCardId)continue;
      if(!card||!(this.externalVariant(card)||card.type==='custom')||card.position?.editorLocked===true||(!includeProtected&&card.position?.manualSize===true))continue;
      const old=positions.get(card.id);
      if(!old)continue;
      const generic=card.type==='custom';
      const slot=tile.querySelector('.external-card-slot');
      const host=slot?.firstElementChild;
      let genericHeight=0;
      if(generic&&host){
        const surface=host.shadowRoot?.querySelector('ha-card')||host;
        // The unscaled ha-card is the source of truth. The outer wrapper
        // can be stretched to the saved frame and must not be measured.
        genericHeight=Math.max(surface.offsetHeight||0,surface.scrollHeight||0);
      }
      const size=generic?{nativeWidth:old.w,nativeHeight:genericHeight}:this.externalCardSize(card,tile);
      if(!size||generic&&genericHeight<8)continue;
      const therm=this.externalVariant(card)==='rotapfel_simple_thermcard';
      // ThermCard: the button fits both axes to the measured visible card.
      // Other card types retain their established height-only behavior.
      const liveScale=Number(slot?.dataset.fitScale);
      const scale=Number.isFinite(liveScale)&&liveScale>0?liveScale:1;
      // Fit the frame to the *current visible size*, never to unscaled native
      // dimensions. Keep the scale stable after the frame has been resized.
      const desiredW=therm?Math.max(76,Math.min(width,Math.ceil(size.nativeWidth*scale)+8)):old.w;
      const desiredH=generic?Math.max(36,Math.ceil(genericHeight)+8):therm?Math.max(60,Math.ceil(size.nativeHeight*scale)+12):this.fittedFrameHeight(card,tile,old.w);
      const fittedH=this.normalizedProfiles(this.deviceProfiles)[this._deviceLayoutProfile||'fire_hd']?.fixed===false?desiredH:Math.min(height,desiredH);
      if(Math.abs(desiredW-old.w)>2||Math.abs(fittedH-old.h)>2){
        update(card,{...old,w:desiredW,h:fittedH},false);
        if(therm){
          card.position.thermScale=scale;
          // update() fits once before the lock is stored; fit again using it.
          this.fitCanvasCards(overlay);
        }
        if(includeProtected&&card.position?.manualSize===true)card.position.manualSize=true;
        count++;
      }
    }
    return count;
  }
  // Alpha 13.5.15: one shared frame generator for both canvas views.
  // The positioning editor adds only its resize grip; card content and
  // coordinate geometry use the same markup as the layout preview.
  renderCanvasTile(c,room,q,editing=false){
    const e=v=>this.esc(v),auto=false;
    const attrs=editing?`data-id="${e(c.id)}"`:`title="${e(room.name)} – ${e(c.title)}"`;
    const size=`height:${q.h}px;z-index:${Math.max(0,Math.round(Number(c.position?.z)||0))}`;
    return `<div class="position-tile ${auto?'auto-card-height':''}" ${attrs} style="left:${q.x}px;top:${q.y}px;width:${q.w}px;${size}">${this.renderPreview(c)}${editing?'<div class="position-drag-handle" title="Karte einzeln ziehen"></div><div class="position-resize-edge position-resize-right" data-resize-axis="x" title="Nur Breite ändern"></div><div class="position-resize-edge position-resize-bottom" data-resize-axis="y" title="Nur Höhe ändern"></div><div class="position-resize" data-resize-axis="xy" title="Breite und Höhe ändern"></div>':''}</div>`;
  }
  renderCanvasPreview(t,cv){
    if(cv.mode!=='fixed')return '';
    const e=s=>this.esc(s),width=Number(cv.width),height=Number(cv.height);
    const gap=Number(cv.gap)||0,cols=Number(cv.columns)||12,pitch=(width-(cols-1)*gap)/cols+gap;
    const rooms=t.rooms||[];
    const activeRoom=rooms.find(r=>r.id===this._activeRoomByTab?.[t.id])||rooms[0];
    const roomSelect=rooms.length?`<label class="room-preview-picker">Raum anzeigen<select id="active-room-preview">${rooms.map(r=>`<option value="${e(r.id)}" ${r.id===activeRoom?.id?'selected':''}>${e(r.name)}</option>`).join('')}</select></label>`:'';
    return `<div class="toolbar"><h3>Raumübersicht – ${e(activeRoom?.name||'Kein Raum')}</h3><span class="muted">${width} × ${height} CSS-px · nur aktiver Raum</span></div><div class="room-preview-controls">${roomSelect}<span class="muted">${this._roomTestMode?'Testmodus: Karten direkt bedienen. Änderungen an Geräten sind echt.':'Andere Räume bleiben gespeichert und können oben ausgewählt werden.'}</span></div><div class="preview-zoom-controls"><label for="preview-zoom">Ansicht</label><select id="preview-zoom"><option value="auto">Standard: max. 50 % (einpassen)</option>${[25,33,50,67,75,100].map(n=>`<option value="${n}">${n} %</option>`).join('')}</select><span class="zoom-status" id="preview-zoom-status"></span></div><div class="preview-viewport" id="preview-viewport" data-width="${width}" data-height="${height}"><div class="preview-scaled" id="preview-scaled" style="width:${width}px;height:${height}px"><div class="canvas-preview ${this._roomTestMode?'room-test-mode':''}" style="width:${width}px;height:${height}px;background-size:${pitch}px ${pitch}px">${this.cardPositions(t,cv).filter(({room})=>room.id===activeRoom?.id).map(({c,room,x,y,w,h})=>this.renderCanvasTile(c,room,{x,y,w,h})).join('')}</div></div></div><div class="preview-zoom-hint">Nur die Vorschau wird skaliert – X/Y-Positionen, Kartengrößen und gespeicherte Layoutdaten bleiben unverändert.</div>`;
  }
  bindPreviewZoom(){
    const root=this.shadowRoot,viewport=root.querySelector('#preview-viewport'),select=root.querySelector('#preview-zoom');
    if(!viewport||!select)return;
    const scaled=root.querySelector('#preview-scaled'),status=root.querySelector('#preview-zoom-status');
    const width=Number(viewport.dataset.width),height=Number(viewport.dataset.height);
    // The zoom is local to the editor, never included in save_layout.
    select.value=this._previewZoomMode||'auto';
    const apply=()=>{
      if(!viewport.isConnected)return;
      const available=viewport.clientWidth;
      if(!available)return;
      const mode=select.value;
      // Default preview: never exceed 50%, and shrink further to fit both axes.
      // Manual percentages remain available in the selector.
      const availableHeight=Math.max(160,window.innerHeight-viewport.getBoundingClientRect().top-24);
      const scale=mode==='auto'?Math.min(.5,available/width,availableHeight/height):Number(mode)/100;
      const displayWidth=Math.ceil(width*scale),displayHeight=Math.ceil(height*scale);
      scaled.style.transform=`scale(${scale})`;
      viewport.style.height=displayHeight+'px';
      viewport.style.overflowX=displayWidth>available?'auto':'hidden';
      // The transformed element keeps its original layout width; the scrollable spacer
      // provides the correct scroll extent without changing original card coordinates.
      scaled.style.marginBottom=-(height-displayHeight)+'px';
      status.textContent=`${Math.round(scale*100)} % · Vorschau ${displayWidth} × ${displayHeight} px`;
    };
    select.addEventListener('change',()=>{this._previewZoomMode=select.value;apply();});
    this._previewResizeObserver=new ResizeObserver(apply);
    this._previewResizeObserver.observe(viewport);
    apply();
  }
  renderTab(){const e=s=>this.esc(s),t=this.layout.find(x=>x.id===this.tabId);if(!t)return'';const selectedRoom=(t.rooms||[]).find(r=>r.id===this._activeRoomByTab?.[t.id])||t.rooms?.[0];const cv=this.effectiveCanvas(t),fixed=cv.mode==='fixed',cols=cv.columns||12;return `<div class="toolbar layout-section-heading"><h2>${e(t.name)} · Arbeitsbereich</h2><div class="layout-tab-actions" aria-label="Etagenaktionen"><div class="layout-action-set"><span class="layout-action-label">Arbeitsfläche</span><button class="layout-action-primary" id="position-editor">▦ Positionierungsfläche öffnen</button><button id="add-room">+ Raum</button><button class="secondary" id="tab-canvas">Tab-Maße / Raster</button></div><div class="layout-action-set"><span class="layout-action-label">Etage verwalten</span><button class="secondary" id="duplicate-tab">Tab duplizieren</button><button class="secondary" id="rename-tab">Tab umbenennen</button><button class="secondary layout-action-danger" id="remove-tab">Tab löschen</button></div></div></div>
    <div class="canvas-meta">${fixed?`Arbeitsfläche: ${cv.width} × ${cv.height} CSS-Pixel`:'Responsive Arbeitsfläche'} · ${cols} Rasterspalten · ${cv.gap}px Abstand ${t.canvas?'· Tab-Einstellungen':'· Dashboard-Einstellungen'}</div>
    ${this.renderCanvasPreview(t,cv)}
    <details class="edit-room-list" open><summary>Räume und Karten bearbeiten (separat von der Arbeitsfläche)</summary>
    ${(t.rooms||[]).map(r=>this.renderRoomEditor(r,r.id===selectedRoom?.id)).join('')}${!t.rooms?.length?'<p class="muted">Noch keine Räume in diesem Tab.</p>':''}</details>`;}
  renderRoomEditor(r,isActive=false){
    const e=s=>this.esc(s),cards=r.cards||[],sort=this._roomSort?.[r.id]||'position';
    const ordered=[...cards];if(sort==='az')ordered.sort((a,b)=>a.title.localeCompare(b.title,'de'));if(sort==='za')ordered.sort((a,b)=>b.title.localeCompare(a.title,'de'));
    const selectedId=this._selectedCards?.[r.id];const active=cards.find(c=>c.id===selectedId)||cards[0];
    const info=active?this.design(active):null;
    return `<details class="room room-collapsible" data-room="${e(r.id)}" ${isActive?'open':''}><summary class="room-summary"><span class="room-disclosure" aria-hidden="true"></span><strong>${e(r.name)}</strong><span class="muted">${cards.length} Karten · ${isActive?'Aktiver Raum':'Aufklappen zum Bearbeiten'}</span></summary><div class="toolbar room-management"><h3>${e(r.name)}</h3><div class="room-action-groups"><div class="room-action-set"><span class="layout-action-label">Karten hinzufügen</span><button data-room-action="add-type">+ Karte hinzufügen</button><button class="secondary" data-room-action="library">Aus Kartenbibliothek</button><button class="secondary" data-room-action="paste" ${this._cardClipboard?'':'disabled'}>Karte einfügen</button></div><div class="room-action-set"><span class="layout-action-label">Raum verwalten</span><button class="secondary" data-room-action="rename">Umbenennen</button><button class="secondary" data-room-action="duplicate">Raum duplizieren</button><button class="secondary" data-room-action="transfer">In anderen Tab…</button><button class="secondary layout-action-danger" data-room-action="remove">Löschen</button></div></div></div>
      <div class="room-editor"><div><div class="room-sort-bar"><strong>Vorhandene Karten (${cards.length})</strong><select class="room-sort" aria-label="Karten sortieren"><option value="position" ${sort==='position'?'selected':''}>Reihenfolge</option><option value="az" ${sort==='az'?'selected':''}>Name A–Z</option><option value="za" ${sort==='za'?'selected':''}>Name Z–A</option></select></div><div class="room-card-list">${ordered.map(c=>`<div class="room-card-item ${active?.id===c.id?'selected':''}" data-card="${e(c.id)}" title="${e(c.title)}" role="button" tabindex="0" aria-pressed="${active?.id===c.id}"><div class="room-card-head"><input type="checkbox" tabindex="-1" aria-label="Karte auswählen" ${active?.id===c.id?'checked':''}><span><strong>${e(c.title)}</strong><br><span class="muted">${e(this.cardKind(c))}</span></span></div>${this.renderPreview(c)}<div class="room-card-meta">${this.design(c).width}/4 Spalten · ${this.cardHeightLabel(c)}</div></div>`).join('')}</div>${!cards.length?'<p class="muted">Noch keine Karten. Füge oben eine Karte hinzu.</p>':''}</div>
      <aside class="room-editor-side">${active?`<h4>Ausgewählte Karte</h4><strong>${e(active.title)}</strong><p class="entity-label">${e(active.entity_id||'Platzhalterkarte')}</p><div class="side-section"><strong>01 · Karte verwalten</strong><div class="actions"><button class="secondary" data-side-action="rename">Umbenennen</button><button class="secondary" data-side-action="duplicate">Karte duplizieren</button><button class="secondary" data-side-action="save-library">In Kartenbibliothek speichern</button><button class="secondary" data-side-action="copy">Karte kopieren</button><button class="secondary" data-side-action="transfer">In anderen Raum/Tab…</button></div></div><div class="side-section"><strong>02 · Konfiguration & Design</strong><div class="actions">${active.type==='entity'?'<button class="secondary" data-side-action="entity">Entität ändern</button>':''}${active.type==='custom'?'<button class="secondary" data-side-action="custom">Custom Card konfigurieren</button>':''}${this.externalVariant(active)?'<button class="secondary" data-side-action="thermostat">Thermostat konfigurieren</button>':''}<button class="secondary" data-side-action="design">Design bearbeiten</button></div></div><div class="side-section"><strong>03 · Reihenfolge</strong><div class="actions"><button class="secondary" data-side-action="left" ${cards.indexOf(active)===0?'disabled':''}>← Zurück</button><button class="secondary" data-side-action="right" ${cards.indexOf(active)===cards.length-1?'disabled':''}>Weiter →</button></div><p class="muted">Die Listensortierung verändert nicht die Kartenreihenfolge.</p></div><div class="side-section"><strong>04 · Größe & Position</strong><p class="muted">${info.width}/4 Spalten · ${this.cardHeightLabel(active)}${active.position?` · X ${Math.round(active.position.x)} / Y ${Math.round(active.position.y)} px`:''}</p><button class="secondary" data-side-action="position">Positionierungsfläche öffnen</button></div><div class="side-section side-section-danger"><strong>05 · Karte entfernen</strong><button class="secondary layout-action-danger" data-side-action="remove">Karte entfernen</button></div>`:'<p class="muted">Wähle links eine Karte aus.</p>'}</aside></div></details>`;
  }

  openPositionEditor(tab){
    this.refreshCustomCardCatalog();
    const cv=this.effectiveCanvas(tab),width=Math.max(320,Number(cv.width)||1920),height=Math.max(240,Number(cv.height)||1080),dynamicHeight=this.normalizedProfiles(this.deviceProfiles)[this._deviceLayoutProfile||'fire_hd']?.fixed===false,gap=Math.max(0,Number(cv.gap)||0),cols=Math.max(1,Number(cv.columns)||12);
    if(cv.mode!=='fixed'){alert('Bitte zuerst unter Dashboard-Maße / Raster eine feste Pixelgröße wählen.');return;}
    const rooms=tab.rooms||[];
    const activeRoom=rooms.find(r=>r.id===this._activeRoomByTab?.[tab.id])||rooms[0];
    const cards=(activeRoom?.cards||[]).map(c=>({c,room:activeRoom}));
    const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
    const pitch=(width-(cols-1)*gap)/cols+gap;
    const snap=v=>Math.round(v/Math.max(1,Number(overlay?.querySelector('#snap-size')?.value)||10))*(Math.max(1,Number(overlay?.querySelector('#snap-size')?.value)||10));
    const initial=(c,i)=>{const w=clamp(Number(c.position?.w ?? Math.round(this.design(c).width*width/4)),76,width),h=Math.max(60,Number(c.position?.h ?? (this.externalVariant(c)==='equinox'?Math.round(w*280/430):this.design(c).height)));return {x:clamp(Number(c.position?.x ?? ((i%3)*Math.min(400,Math.floor(width/3)))),0,width-w),y:Math.max(0,Number(c.position?.y ?? (Math.floor(i/3)*160))),w,h};};
    const positions=new Map(cards.map(({c},i)=>[c.id,initial(c,i)]));
    const overlay=document.createElement('div');overlay.className='rotapfel-position-overlay';overlay.style.cssText='position:fixed;inset:0;z-index:9999;background:var(--primary-background-color,#fff);color:var(--primary-text-color,#222);display:flex;flex-direction:column;box-sizing:border-box';
    overlay.innerHTML=`<div class="position-tools" style="padding:10px 16px;margin:0;border-bottom:1px solid #9995"><strong>Positionierungsfläche · ${this.esc(tab.name)}</strong><label style="margin:0;display:flex;align-items:center;gap:6px">Raum <select id="position-room" style="width:auto;max-width:220px">${rooms.map(r=>`<option value="${this.esc(r.id)}" ${r.id===activeRoom?.id?'selected':''}>${this.esc(r.name)}</option>`).join('')}</select></label><span id="position-height-label">${width} × ${height} CSS-px</span><button id="position-test-toggle" type="button" class="secondary" aria-pressed="false">▶ Testen</button><button id="position-mobile-options" type="button" class="secondary" aria-expanded="false" aria-controls="position-options-panel">⚙ Kartenoptionen</button><button id="position-nav-toggle" type="button" class="secondary" aria-expanded="false">☰ Navigation</button><button id="position-touch-mode" type="button" class="secondary" aria-pressed="false">↕ Scrollen</button><button id="position-mobile-select" type="button" class="secondary" aria-pressed="false">☑ Karten auswählen</button><button id="position-mobile-select-all" type="button" class="secondary">Alle auswählen</button><span id="position-test-hint" class="muted" hidden>Live-Test: Bedienung steuert echte Home-Assistant-Geräte.</span><label style="margin:0"><input id="snap" type="checkbox" style="width:auto;display:inline"> Raster</label><label style="margin:0"><input id="magnet" type="checkbox" checked style="width:auto;display:inline"> Magnet</label><label style="margin:0;display:flex;align-items:center;gap:4px">Raster <select id="snap-size" style="width:auto"><option value="5">5 px</option><option value="10" selected>10 px</option><option value="20">20 px</option></select></label><label style="margin:0"><input id="snap-guides" type="checkbox" checked style="width:auto;display:inline"> Hilfslinien</label><span class="muted" title="Während des Ziehens Alt/Option gedrückt halten, um das Einrasten vorübergehend auszuschalten">Alt/Option = frei</span><button id="auto-fit-frames" class="secondary" title="Kartenrahmen auf tatsächliche Kartengröße anpassen">Rahmen automatisch anpassen</button><span class="muted" id="multi-count">0 Karten ausgewählt</span><button id="close" class="secondary" style="margin-left:auto">Zurück zum Layout-Editor</button></div><div class="position-editor-body"><div class="position-canvas-pane"><div class="position-workspace" style="width:${width}px;height:${height}px;background-size:${pitch}px ${pitch}px">${cards.map(({c,room})=>this.renderCanvasTile(c,room,positions.get(c.id),true)).join('')}</div></div><aside class="position-options-pane" id="position-options-panel"><h3 style="margin:0">Kartenoptionen</h3><div class="position-editor-actions"><button id="undo-position" class="secondary" disabled>↶ Rückgängig</button><button id="redo-position" class="secondary" disabled>↷ Wiederholen</button></div><details class="position-section"><summary>01 · Dashboardweite Entsperrung</summary><p class="muted">Entfernt Sperren in allen Tabs und Räumen, auch in den gespeicherten Geräteprofilen. Gruppen, Positionen und Kartengrößen bleiben unverändert.</p><p id="dashboard-lock-count" class="muted">Sperren werden ermittelt …</p><div class="align-grid"><button class="secondary" id="dashboard-unlock-position">Positionssperren aufheben</button><button class="secondary" id="dashboard-unlock-size">Größensperren aufheben</button><button class="secondary" id="dashboard-unlock-layout">Layoutsperren aufheben</button><button id="dashboard-unlock-all">Alle Kartensperren aufheben</button></div><p class="muted">Anschließend im Layout-Editor speichern. Die zentrale Entsperrung wirkt auf das gesamte Dashboard.</p></details><details class="position-section" open><summary>02 · Kartenauswahl & automatische Anordnung</summary><div class="position-global-buttons"><button class="secondary" id="select-all-cards">Alle Karten auswählen</button><button class="secondary" id="clear-multi">Auswahl aufheben</button><button class="secondary" id="unlock-all-position">Alle Positionssperren aufheben</button><button class="secondary" id="unlock-all-size">Alle Größensperren aufheben</button><p class="muted" id="align-hint">Mindestens zwei Karten auswählen; Verteilung über die Profilbreite möglich.</p></div><div class="position-auto-layout-subsection" style="border-top:1px solid #9995;margin-top:14px;padding-top:10px"><strong>Automatische Anordnung</strong><button type="button" class="secondary position-select-all-inline" data-select-all-inline="true">Alle Karten auswählen (vor Anordnung)</button><div class="auto-layout-tools" style="border-top:1px solid #9995;padding-top:12px;display:grid;gap:7px"><strong>Automatische Tab-Anordnung</strong><label style="display:flex;align-items:center;gap:8px">Anordnung innerhalb der Gruppen <select id="auto-group-direction" style="width:auto"><option value="keep">Bisherige Anordnung beibehalten</option><option value="horizontal">Horizontal (nebeneinander)</option><option value="vertical">Vertikal (untereinander)</option></select></label><label style="display:flex;align-items:center;gap:8px">Flächennutzung <select id="auto-space-mode" style="width:auto"><option value="compact">Enge Positionierung</option><option value="wide">Großflächig verteilen</option></select></label><span class="muted">Gruppen zuerst · 12 px Abstand · Einzelkarten anschließend nach Typ</span><button class="secondary" id="auto-layout-tab">Alle Karten automatisch anordnen</button><span class="muted">Wähle, ob Karten innerhalb einer Gruppe ihre bisherigen Abstände behalten oder horizontal/vertikal neu angeordnet werden. Gruppen haben Vorrang, Einzelkarten füllen freie Bereiche. Kartengrößen bleiben erhalten.</span></div></div></details><details class="position-section" open><summary>03 · Position, Größe & Schutz</summary><label>Karte<select id="selected">${cards.map(({c,room})=>`<option value="${this.esc(c.id)}">${this.esc(room.name)} – ${this.esc(c.title)}</option>`).join('')}</select></label>${[['x','X-Position'],['y','Y-Position'],['w','Breite'],['h','Höhe']].map(([k,label])=>`<label>${label} (px)<input type="number" id="pos-${k}" min="0" step="1"></label>`).join('')}<button id="apply-pos">Position übernehmen</button><button id="reset-native-size" class="secondary" type="button">Auf Standardgröße zurücksetzen</button><label title="Beim Ändern der Breite die Höhe proportional an die gemessene Custom Card anpassen"><input id="auto-height-on-width" type="checkbox" checked style="width:auto"> Höhe bei Breitenänderung automatisch anpassen (Custom Cards)</label><label><input id="protect-size" type="checkbox" style="width:auto"> Manuelle Größe schützen</label><label><input id="protect-position" type="checkbox" style="width:auto"> Manuelle Position schützen</label><label><input id="editor-lock" type="checkbox" style="width:auto"> 🔒 Karte gegen Layoutänderungen sperren</label><p class="muted">Karte ziehen; am rechten Rand Breite, am unteren Rand Höhe oder an der Ecke beide Maße ändern. Änderungen anschließend im Layout-Editor speichern.</p></details><details class="position-section" open><summary>04 · Ausrichten</summary><button type="button" class="secondary position-select-all-inline" data-select-all-inline="true">Alle Karten auswählen</button><p class="muted">Strg/Cmd + Klick: mehrere Karten auswählen. Umschalt + Klick: Bereich auswählen.</p><div class="align-tools"><strong>Ausrichten</strong><div class="align-grid"><button class="secondary" data-align="left">Links</button><button class="secondary" data-align="hcenter">Horizontal mittig</button><button class="secondary" data-align="right">Rechts</button><button class="secondary" data-align="top">Oben</button><button class="secondary" data-align="vcenter">Vertikal mittig</button><button class="secondary" data-align="bottom">Unten</button></div></div></details><details class="position-section"><summary>05 · Verteilen & Abstände</summary><button type="button" class="secondary position-select-all-inline" data-select-all-inline="true">Alle Karten auswählen</button><div class="align-tools"><strong>Verteilen / Abstände</strong><div class="align-grid"><button class="secondary" data-align="distribute-x">Horizontal verteilen</button><button class="secondary" data-align="distribute-y">Vertikal verteilen</button><button class="secondary" data-align="gap-x">Gleicher horizontaler Abstand</button><button class="secondary" data-align="gap-y">Gleicher vertikaler Abstand</button></div><label>Fester Abstand (px) <input id="fixed-card-gap" type="number" min="0" max="200" step="1" value="12" style="width:76px"></label><label>Ausrichtung <select id="fixed-gap-alignment" style="width:auto"><option value="start">Oben / Links</option><option value="center">Mittig</option><option value="end">Unten / Rechts</option></select></label><div class="align-grid"><button class="secondary" data-fixed-gap="x">Horizontal mit Abstand</button><button class="secondary" data-fixed-gap="y">Vertikal mit Abstand</button></div><label><input id="auto-push-cards" type="checkbox" checked style="width:auto;display:inline"> Nachbarkarten beim Verschieben automatisch weiterschieben</label><p class="muted">Automatisches Weiterschieben nur bei Einzelkarten; gesperrte Karten bleiben stehen.</p></div></details><details class="position-section"><summary>06 · Kartengröße & Skalierung</summary><button type="button" class="secondary position-select-all-inline" data-select-all-inline="true">Alle Karten auswählen</button><p class="muted">Mindestens zwei Karten mit Cmd/Strg auswählen. Referenz ist die zuletzt angeklickte Karte; gesperrte Karten bleiben unverändert.</p><div class="align-grid"><button class="secondary" data-bulk-size="width">Gleiche Breite</button><button class="secondary" data-bulk-size="height">Gleiche Höhe</button><button class="secondary" data-bulk-size="both">Gleiche Größe</button></div><label>Gemeinsam proportional skalieren (%)<input id="bulk-scale-percent" type="number" min="10" max="300" step="5" value="110"></label><button class="secondary" id="bulk-scale-apply">Auswahl skalieren</button><p class="muted" id="bulk-size-hint">Mindestens zwei Karten auswählen.</p><div class="align-tools"><strong>Ideale Kartengröße</strong><button type="button" class="secondary position-select-all-inline" data-select-all-inline="true">Alle Karten auswählen</button><p class="muted">Profilbreite nutzen und die Höhe auf den benötigten Karteninhalt begrenzen. Gesperrte Karten werden übersprungen. Keine automatische Neupositionierung.</p><div class="align-grid"><button class="secondary" id="ideal-size-selected">Ideale Größe – Auswahl</button><button class="secondary" id="ideal-size-all">Ideale Größe – alle Karten</button></div><p class="muted" id="ideal-size-result">Gilt nur für den aktuellen Raum und das aktive Geräteprofil.</p></div></details><details class="position-section"><summary>07 · Kartengruppen</summary><p class="muted">Mehrere Karten mit Strg/Cmd auswählen, gruppieren und anschließend durch Ziehen einer Gruppenkarte gemeinsam verschieben. Größen bleiben individuell.</p><div class="align-grid"><button class="secondary" id="group-cards">Auswahl gruppieren</button><button class="secondary" id="ungroup-cards">Gruppe auflösen</button><button class="secondary" id="ungroup-all-cards">Alle Gruppen auflösen</button></div><p class="muted" id="group-status">Keine Gruppe ausgewählt</p></details><details class="position-section"><summary>08 · Ebenenverwaltung</summary><p class="muted">Höhere Ebenen liegen vor niedrigeren. Änderungen gelten für die ausgewählte Karte und können rückgängig gemacht werden.</p><div class="align-grid"><button class="secondary" id="layer-back">Ganz nach hinten</button><button class="secondary" id="layer-down">Eine Ebene zurück</button><button class="secondary" id="layer-up">Eine Ebene vor</button><button class="secondary" id="layer-front">Ganz nach vorne</button></div></details></aside></div>`;
    const style=document.createElement('style');style.textContent='.rotapfel-position-overlay .position-tile{touch-action:none}.rotapfel-position-overlay .position-tile .external-card-preview{height:100%!important;min-height:0!important;overflow:hidden!important;padding:0!important;position:relative!important}.rotapfel-position-overlay .position-tile .external-card-slot{pointer-events:none!important;overflow:visible!important;max-height:none!important}.rotapfel-position-overlay .position-tile .external-card-slot>*{pointer-events:none!important}.rotapfel-position-overlay .position-tile .nexus-preview{height:100%;min-height:0!important;box-sizing:border-box}.rotapfel-position-overlay .position-drag-handle{position:absolute;top:0;left:0;right:28px;height:19px;z-index:6;cursor:grab;touch-action:none;background:transparent}.rotapfel-position-overlay .position-resize-edge{position:absolute;z-index:5;background:transparent}.rotapfel-position-overlay .position-resize-right{right:0;top:12%;height:76%;width:10px;cursor:ew-resize}.rotapfel-position-overlay .position-resize-bottom{bottom:0;left:12%;width:76%;height:10px;cursor:ns-resize}.rotapfel-position-overlay .position-resize{position:absolute;right:0;bottom:0;width:22px;height:22px;cursor:nwse-resize;background:linear-gradient(135deg,transparent 49%,#009ac4 50%);z-index:5}.rotapfel-position-overlay aside label{display:block;margin:12px 0}.rotapfel-position-overlay aside input,.rotapfel-position-overlay aside select{width:100%;box-sizing:border-box}.rotapfel-position-overlay .position-tile.selected{outline:3px solid #009ac4}.rotapfel-position-overlay .position-tile.multi-selected{outline:3px dashed #e9a100}.rotapfel-position-overlay .position-tile.reference-card{outline:4px solid #27ae60!important;outline-offset:2px}.rotapfel-position-overlay .position-tile.reference-card::after{content:"⊕ Referenz";position:absolute;top:4px;right:8px;background:#168c48;color:white;border-radius:5px;padding:2px 6px;font:700 12px sans-serif;z-index:20;pointer-events:none}.rotapfel-position-overlay .align-tools{display:grid;gap:9px;margin:12px 0;padding:10px 0;border-top:1px solid #9995;border-bottom:1px solid #9995}.rotapfel-position-overlay .align-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}.rotapfel-position-overlay .align-grid button{font-size:11px;padding:7px 4px;white-space:normal}.rotapfel-position-overlay .align-tools strong{font-size:12px}';style.textContent+='\n.rotapfel-position-overlay .position-editor-body{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);flex:1;min-height:0;overflow:hidden}.rotapfel-position-overlay .position-canvas-pane{min-width:0;min-height:0;overflow:auto;padding:12px;box-sizing:border-box;background:#8882;position:relative}.rotapfel-position-overlay .position-workspace{transform-origin:top left}.rotapfel-position-overlay .position-options-pane{min-width:0;min-height:0;overflow-y:auto;border-left:1px solid #9995;padding:18px 20px;box-sizing:border-box}.rotapfel-position-overlay .position-options-pane .align-grid{gap:9px}.rotapfel-position-overlay .position-options-pane .align-grid button{font-size:13px;padding:11px 9px;min-height:43px}.rotapfel-position-overlay .position-options-pane .align-tools{gap:14px}.rotapfel-position-overlay .position-options-pane .align-tools strong{font-size:14px}.rotapfel-position-overlay .position-options-pane button{white-space:normal}.rotapfel-position-overlay .position-options-pane input[type=checkbox]{width:auto}.rotapfel-position-overlay .position-tools{flex-shrink:0}@media(max-width:800px){.rotapfel-position-overlay .position-options-pane{padding:10px}.rotapfel-position-overlay .position-options-pane .align-grid{grid-template-columns:1fr}}';style.textContent+='\n.rotapfel-position-overlay .position-section{border:1px solid #9995;border-radius:9px;margin:12px 0;overflow:hidden;padding:0 12px 10px}.rotapfel-position-overlay .position-section:not([open]){padding-bottom:0}.rotapfel-position-overlay .position-section>summary{cursor:pointer;font-weight:700;font-size:14px;padding:13px 2px;user-select:none}.rotapfel-position-overlay .position-section>summary:hover{color:var(--primary-color,#009ac4)}.rotapfel-position-overlay .position-global-buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rotapfel-position-overlay .position-global-buttons button{min-height:42px}.rotapfel-position-overlay .position-editor-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.rotapfel-position-overlay .position-editor-actions button{min-height:40px}';style.textContent+=`
.rotapfel-position-overlay.position-test-active .climate-controls{pointer-events:auto!important}.rotapfel-position-overlay.position-test-active .position-workspace{background-image:none!important;background-color:transparent!important}.rotapfel-position-overlay.position-test-active .position-tile{outline:none!important;border-color:transparent!important;box-shadow:none!important;cursor:default!important}.rotapfel-position-overlay.position-test-active .position-resize,.rotapfel-position-overlay.position-test-active [data-resize-axis],.rotapfel-position-overlay.position-test-active .position-options-pane{display:none!important}.rotapfel-position-overlay.position-test-active .position-editor-body{grid-template-columns:minmax(0,1fr)}.rotapfel-position-overlay.position-test-active .position-tile .external-card-slot{pointer-events:auto!important}.rotapfel-position-overlay.position-test-active .position-tile .external-card-slot>*{pointer-events:auto!important}.rotapfel-position-overlay.position-test-active .position-drag-handle{display:none!important}.rotapfel-position-overlay.position-test-active .position-tile{touch-action:auto!important}.rotapfel-position-overlay.position-test-active .position-tile .external-card-preview{touch-action:auto!important}.rotapfel-position-overlay.position-test-active .position-tools #snap,.rotapfel-position-overlay.position-test-active .position-tools #snap-size,.rotapfel-position-overlay.position-test-active .position-tools #snap-guides{pointer-events:none}.rotapfel-position-overlay.position-test-active #position-test-toggle{background:var(--primary-color,#0399ca)!important;color:white!important}.rotapfel-position-overlay.position-test-active .position-canvas-pane{overflow:auto}
/* Alpha 13.7.105: mobile-first editor controls, without changing card geometry. */
.rotapfel-position-overlay #position-mobile-options{display:none}
.rotapfel-position-overlay .position-tools{gap:8px;align-items:center}
.rotapfel-position-overlay .position-tools button{min-height:40px}
@media(max-width:767px){
 .rotapfel-position-overlay .position-tools{padding:8px!important;gap:6px;max-height:34vh;overflow-y:auto;align-content:start}
 .rotapfel-position-overlay .position-tools>strong{flex:1 1 100%;font-size:14px}
 .rotapfel-position-overlay .position-tools #position-room{max-width:165px!important}
 .rotapfel-position-overlay .position-tools #position-height-label{font-size:11px;flex:1 1 auto}
 .rotapfel-position-overlay .position-tools #position-test-toggle,.rotapfel-position-overlay .position-tools #position-mobile-options{flex:1 1 120px}
 .rotapfel-position-overlay #position-mobile-options{display:inline-flex;justify-content:center;align-items:center}
 .rotapfel-position-overlay .position-editor-body{display:block;position:relative;flex:1;min-height:0;overflow:hidden}
 .rotapfel-position-overlay .position-canvas-pane{height:100%;width:100%;overflow:auto}
 .rotapfel-position-overlay .position-options-pane{display:none;position:absolute;z-index:15;left:0;right:0;bottom:0;top:auto;max-height:min(65vh,620px);overflow:auto;background:var(--card-background-color,#fff);border-top:2px solid var(--primary-color,#009ac4);box-shadow:0 -8px 24px #0004;padding:12px 14px 24px}
 .rotapfel-position-overlay.position-mobile-options-open:not(.position-test-active) .position-options-pane{display:block}
 .rotapfel-position-overlay.position-test-active #position-mobile-options{display:none}
 .rotapfel-position-overlay .position-options-pane .align-grid{grid-template-columns:1fr 1fr}
 .rotapfel-position-overlay .position-options-pane button{min-height:44px}
}

/* Alpha 13.7.105: unified touch targets and compact logical tool groups. */
.rotapfel-position-overlay{isolation:isolate}
.rotapfel-position-overlay .position-tools{position:relative;z-index:20;gap:8px;align-items:center}
.rotapfel-position-overlay .position-tools button,
.rotapfel-position-overlay .position-options-pane button,
.rotapfel-position-overlay .position-section>summary{
  box-sizing:border-box;position:relative;pointer-events:auto;touch-action:manipulation;
  -webkit-tap-highlight-color:rgba(0,153,196,.2);user-select:none;
}
.rotapfel-position-overlay .position-tools button,
.rotapfel-position-overlay .position-options-pane button{min-height:46px;min-width:44px;padding:10px 12px;font-size:13px;line-height:1.3;display:inline-flex;align-items:center;justify-content:center;text-align:center}
.rotapfel-position-overlay .position-options-pane .position-section>summary{min-height:48px;display:list-item;padding:14px 8px;line-height:1.35}
.rotapfel-position-overlay .position-options-pane{padding:12px 16px;overscroll-behavior:contain}
.rotapfel-position-overlay .position-editor-body{grid-template-columns:minmax(0,1.55fr) minmax(380px,1fr)}
.rotapfel-position-overlay .position-options-pane .align-grid,
.rotapfel-position-overlay .position-options-pane .position-global-buttons{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.rotapfel-position-overlay .position-section{margin:7px 0;padding:0 10px 8px}
.rotapfel-position-overlay .position-section:not([open]){padding-bottom:0}
.rotapfel-position-overlay .position-section p.muted{margin:7px 0;line-height:1.35}
.rotapfel-position-overlay .position-options-pane label{margin:8px 0}
.rotapfel-position-overlay .position-options-pane input:not([type=checkbox]),
.rotapfel-position-overlay .position-options-pane select{min-height:44px;touch-action:manipulation}
.rotapfel-position-overlay .position-editor-actions{margin:8px 0}
@media(max-width:1000px) and (min-width:768px){.rotapfel-position-overlay .position-editor-body{grid-template-columns:minmax(0,1fr) minmax(330px,1fr)}}
@media(max-width:767px){
 .rotapfel-position-overlay .position-tools{z-index:21;max-height:32vh;overflow-y:auto;overscroll-behavior:contain}
 .rotapfel-position-overlay .position-tools button{min-height:48px}
 .rotapfel-position-overlay .position-options-pane{z-index:20;max-height:min(70vh,660px);padding:10px 12px;box-shadow:0 -5px 24px #0003}
 .rotapfel-position-overlay .position-options-pane .align-grid,
 .rotapfel-position-overlay .position-options-pane .position-global-buttons{grid-template-columns:repeat(2,minmax(0,1fr))}
}

/* Alpha 13.7.105: keep mobile navigation above the canvas and always reachable. */
@media(max-width:767px){
 .rotapfel-position-overlay{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}
 .rotapfel-position-overlay .position-tools{
   position:relative!important;z-index:100!important;isolation:isolate;
   flex:0 0 auto!important;max-height:min(30dvh,230px)!important;
   overflow-y:auto!important;overflow-x:hidden!important;
   background:var(--primary-background-color,#fff)!important;
   box-shadow:0 3px 12px #0003;box-sizing:border-box;
   padding:8px 10px!important;align-content:flex-start;
 }
 .rotapfel-position-overlay .position-tools>strong{flex:1 1 50%!important;min-width:0}
 .rotapfel-position-overlay .position-tools #close{
   order:-1!important;flex:1 1 100%!important;margin:0!important;
   position:sticky!important;top:0!important;z-index:102!important;
   background:var(--primary-color,#168fc0)!important;color:white!important;
   min-height:48px!important;width:100%!important;
 }
 .rotapfel-position-overlay .position-editor-body{z-index:1!important;min-height:0!important;overflow:hidden!important}
 .rotapfel-position-overlay .position-canvas-pane{position:relative!important;z-index:0!important;overflow:auto!important;overscroll-behavior:contain}
 .rotapfel-position-overlay .position-workspace{isolation:isolate}
 .rotapfel-position-overlay .position-options-pane{z-index:30!important}
}

/* Alpha 13.7.98: safe-area navigation, fixed compact toolbar, scroll-first mobile canvas. */
.rotapfel-position-overlay #position-nav-toggle,.rotapfel-position-overlay #position-touch-mode{display:none}
@media(max-width:767px){
 .rotapfel-position-overlay{padding-top:env(safe-area-inset-top,0px)!important}
 .rotapfel-position-overlay .position-tools{
   position:relative!important;z-index:100!important;max-height:none!important;
   overflow:visible!important;flex:0 0 auto!important;box-shadow:0 3px 10px #0002;
   padding:8px 10px!important;gap:7px!important;align-content:center!important;
 }
 .rotapfel-position-overlay .position-tools>strong{flex:1 1 100%!important;order:-3}
 .rotapfel-position-overlay .position-tools #close{
   order:0!important;position:relative!important;top:auto!important;z-index:auto!important;
   flex:1 1 100%!important;width:auto!important;min-height:46px!important;
   margin:0!important;background:var(--primary-color,#168fc0)!important;color:#fff!important;
 }
 .rotapfel-position-overlay #position-nav-toggle,.rotapfel-position-overlay #position-touch-mode,.rotapfel-position-overlay #position-mobile-select,.rotapfel-position-overlay #position-mobile-select-all{display:inline-flex;flex:1 1 125px}
 .rotapfel-position-overlay #position-nav-toggle{order:-2}
 .rotapfel-position-overlay #position-touch-mode{order:-1}
 .rotapfel-position-overlay #position-mobile-select{order:-1}
 .rotapfel-position-overlay #position-mobile-select-all{order:-1}
 .rotapfel-position-overlay .position-tools> :not(strong):not(#position-nav-toggle):not(#position-touch-mode):not(#position-mobile-select):not(#position-mobile-select-all):not(#close){display:none!important}
 .rotapfel-position-overlay.position-nav-expanded .position-tools> :not(strong):not(#position-nav-toggle):not(#position-touch-mode):not(#position-mobile-select):not(#position-mobile-select-all):not(#close){display:flex!important}
 .rotapfel-position-overlay.position-nav-expanded .position-tools #position-test-hint[hidden]{display:none!important}
 .rotapfel-position-overlay .position-canvas-pane{overflow-y:auto!important;-webkit-overflow-scrolling:touch;touch-action:pan-y pan-x!important}
 .rotapfel-position-overlay:not(.position-touch-drag) .position-tile{touch-action:pan-y pan-x!important;cursor:default!important}
 .rotapfel-position-overlay:not(.position-touch-drag) .position-tile .position-drag-handle{touch-action:pan-y pan-x!important;pointer-events:none!important}
 .rotapfel-position-overlay:not(.position-touch-drag) .position-tile .position-resize,.rotapfel-position-overlay:not(.position-touch-drag) .position-tile .position-resize-edge{pointer-events:none!important}
 .rotapfel-position-overlay.position-touch-drag .position-tile{touch-action:none!important}
 .rotapfel-position-overlay #position-touch-mode[aria-pressed="true"]{background:var(--primary-color,#168fc0)!important;color:#fff!important}
 .rotapfel-position-overlay .position-options-pane{z-index:110!important}
}
/* Alpha 13.9.31: compact touch-first editor controls and readable mode feedback. */
.rotapfel-position-overlay #position-touch-hint{display:none}
@media(max-width:767px){
 .rotapfel-position-overlay .position-tools{padding:calc(8px + env(safe-area-inset-top,0px)) 10px 8px!important;gap:6px!important}
 .rotapfel-position-overlay .position-tools #position-nav-toggle,
 .rotapfel-position-overlay .position-tools #position-touch-mode,
 .rotapfel-position-overlay .position-tools #position-mobile-select,
 .rotapfel-position-overlay .position-tools #position-mobile-select-all{
   flex:1 1 calc(50% - 6px)!important;min-width:0!important;min-height:48px!important;
 }
 .rotapfel-position-overlay .position-options-pane{padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))!important}
 .rotapfel-position-overlay.position-touch-drag .position-tile .position-drag-handle{touch-action:none!important}
 .rotapfel-position-overlay .position-resize,
 .rotapfel-position-overlay .position-resize-edge{min-width:24px;min-height:24px;touch-action:none}
 .rotapfel-position-overlay #position-touch-hint{display:block;flex:1 1 100%;font-size:12px;line-height:1.35;padding:3px 6px;opacity:.9}
}
`;overlay.append(style);
    this.shadowRoot.append(overlay);
    const mobileOptionsButton=overlay.querySelector('#position-mobile-options');
    const setMobileOptions=open=>{
      overlay.classList.toggle('position-mobile-options-open',!!open);
      mobileOptionsButton?.setAttribute('aria-expanded',String(!!open));
      mobileOptionsButton.textContent=open?'✕ Optionen schließen':'⚙ Kartenoptionen';
    };
    mobileOptionsButton?.addEventListener('click',()=>setMobileOptions(!overlay.classList.contains('position-mobile-options-open')));
    const navButton=overlay.querySelector('#position-nav-toggle');
    navButton?.addEventListener('click',()=>{
      const expanded=overlay.classList.toggle('position-nav-expanded');
      navButton.setAttribute('aria-expanded',String(expanded));
      navButton.textContent=expanded?'✕ Navigation schließen':'☰ Navigation';
    });
    // Alpha 13.8.9: mobile drawer is independent of canvas drag/scroll mode.
    const mobileDrawer=document.createElement('div');
    mobileDrawer.className='position-mobile-drawer';
    mobileDrawer.setAttribute('aria-label','Werkzeuge und Kartenoptionen');
    const mobileDrawerBackdrop=document.createElement('div');
    mobileDrawerBackdrop.className='position-mobile-backdrop';
    overlay.append(mobileDrawerBackdrop,mobileDrawer);
    const mobileTools=overlay.querySelector('.position-tools');
    const mobileOptionsPane=overlay.querySelector('.position-options-pane');
    const originalOptionsParent=mobileOptionsPane.parentNode;
    const originalOptionsNext=mobileOptionsPane.nextSibling;
    const movedTools=[...mobileTools.children].filter(el=>!el.matches('strong,#position-nav-toggle'));
    const installMobileDrawer=()=>{
      if(window.matchMedia('(max-width:767px)').matches){
        movedTools.forEach(el=>mobileDrawer.appendChild(el));
        mobileDrawer.appendChild(mobileOptionsPane);
      }else{
        movedTools.forEach(el=>mobileTools.appendChild(el));
        originalOptionsParent.insertBefore(mobileOptionsPane,originalOptionsNext);
        overlay.classList.remove('position-nav-expanded');
      }
    };
    installMobileDrawer();
    window.addEventListener('resize',installMobileDrawer,{signal:(this._positionDrawerAbort=new AbortController()).signal});
    mobileDrawerBackdrop.addEventListener('click',()=>{
      overlay.classList.remove('position-nav-expanded');
      navButton?.setAttribute('aria-expanded','false');
      if(navButton)navButton.textContent='☰ Navigation';
    });
    // Allow native touch scrolling inside the drawer even while dragging cards.
    for(const eventName of ['touchstart','touchmove','pointerdown','pointermove']){
      mobileDrawer.addEventListener(eventName,ev=>ev.stopPropagation(),{passive:true});
    }
    const touchHint=document.createElement('span');
    touchHint.id='position-touch-hint';
    touchHint.setAttribute('role','status');
    touchHint.textContent='Scrollmodus: Fläche mit dem Finger verschieben.';
    overlay.querySelector('.position-tools')?.append(touchHint);
    const touchModeButton=overlay.querySelector('#position-touch-mode');
    touchModeButton?.addEventListener('click',()=>{
      const dragging=overlay.classList.toggle('position-touch-drag');
      touchModeButton.setAttribute('aria-pressed',String(dragging));
      touchModeButton.textContent=dragging?'✥ Verschieben aktiv':'↕ Scrollen';
      touchHint.textContent=dragging?'Verschiebemodus: Karten mit dem Finger ziehen. Zum Scrollen erneut umschalten.':'Scrollmodus: Fläche mit dem Finger verschieben. Zum Bearbeiten Verschieben aktivieren.';
    });
    style.textContent+=`
@media(max-width:767px){
 .rotapfel-position-overlay .position-tools{height:56px!important;min-height:56px!important;max-height:56px!important;overflow:hidden!important;display:flex!important;flex-wrap:nowrap!important;padding:6px 10px!important;align-items:center!important}
 .rotapfel-position-overlay .position-tools>strong{flex:1 1 auto!important;order:0!important;font-size:13px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .rotapfel-position-overlay .position-tools #position-nav-toggle{order:-1!important;flex:0 0 auto!important;min-height:42px!important}
 .rotapfel-position-overlay .position-mobile-backdrop{display:none;position:fixed;inset:0;z-index:120;background:#0007}
 .rotapfel-position-overlay.position-nav-expanded .position-mobile-backdrop{display:block}
 .rotapfel-position-overlay .position-mobile-drawer{position:fixed!important;left:0;top:env(safe-area-inset-top,0px);bottom:0;width:min(88vw,390px);z-index:121!important;display:flex!important;flex-direction:column;gap:9px;padding:16px 12px calc(20px + env(safe-area-inset-bottom,0px));box-sizing:border-box;background:var(--card-background-color,#fff);box-shadow:8px 0 24px #0004;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain;touch-action:pan-y!important;transform:translateX(-110%);visibility:hidden;transition:transform .2s ease,visibility .2s}
 .rotapfel-position-overlay.position-nav-expanded .position-mobile-drawer{transform:translateX(0);visibility:visible}
 .rotapfel-position-overlay .position-mobile-drawer>button{display:flex!important;min-height:44px;flex:0 0 auto;justify-content:center;touch-action:manipulation}
 .rotapfel-position-overlay .position-mobile-drawer>label{display:flex!important;align-items:center;gap:8px;flex:0 0 auto}
 .rotapfel-position-overlay .position-mobile-drawer>span{display:block!important}
 .rotapfel-position-overlay .position-mobile-drawer #position-mobile-options{display:none!important}
  /* Reparented controls must remain visible and scroll independently of card drag. */
  .rotapfel-position-overlay .position-mobile-drawer #position-touch-mode,
  .rotapfel-position-overlay .position-mobile-drawer #position-mobile-select,
  .rotapfel-position-overlay .position-mobile-drawer #position-mobile-select-all{display:flex!important;flex:0 0 auto!important}
  .rotapfel-position-overlay .position-mobile-drawer #close{position:static!important;order:0!important;width:100%!important;margin:0!important;background:var(--primary-color,#168fc0)!important;color:#fff!important}
  .rotapfel-position-overlay .position-mobile-drawer .position-section{max-width:100%;box-sizing:border-box}
  .rotapfel-position-overlay .position-select-all-inline{width:100%;margin:5px 0 10px;min-height:44px}
  .rotapfel-position-overlay .position-mobile-drawer .position-options-pane input,
  .rotapfel-position-overlay .position-mobile-drawer .position-options-pane select{max-width:100%}
  .rotapfel-position-overlay .position-mobile-drawer .position-options-pane .align-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  .rotapfel-position-overlay.position-nav-expanded .position-canvas-pane{pointer-events:none!important}
 .rotapfel-position-overlay .position-mobile-drawer .position-options-pane{display:block!important;position:static!important;flex:0 0 auto;max-height:none!important;overflow:visible!important;border:0!important;box-shadow:none!important;padding:12px 0!important;width:100%!important;background:transparent!important}
 .rotapfel-position-overlay .position-editor-body{display:block!important}
 .rotapfel-position-overlay .position-canvas-pane{height:100%!important}
}
@media(min-width:768px){.rotapfel-position-overlay .position-mobile-drawer,.rotapfel-position-overlay .position-mobile-backdrop{display:none!important}}
`;
    this.mountExternalCards();
    const canvasPane=overlay.querySelector('.position-canvas-pane');
    const heightLabel=overlay.querySelector('#position-height-label');
    const refreshCanvasHeight=()=>{
      const bottom=dynamicHeight?Math.max(height,...[...positions.values()].map(q=>q.y+q.h+24)):height;
      canvasWorkspace.style.height=Math.ceil(bottom)+'px';
      if(heightLabel)heightLabel.textContent=`${width} × ${Math.ceil(bottom)} CSS-px (${dynamicHeight?'Höhe dynamisch':'feste Displaygröße'})`;
    };
    const canvasWorkspace=overlay.querySelector('.position-workspace');
    const guideX=document.createElement('div'),guideY=document.createElement('div');
    guideX.className='rotapfel-snap-guide-x';guideY.className='rotapfel-snap-guide-y';
    for(const guide of [guideX,guideY]){guide.style.cssText='position:absolute;pointer-events:none;z-index:10001;display:none;background:#ff9800;box-shadow:0 0 2px #222';canvasWorkspace.append(guide);}
    guideX.style.width='1px';guideX.style.height='100%';guideX.style.top='0';
    guideY.style.height='1px';guideY.style.width='100%';guideY.style.left='0';
    const magnetBadge=document.createElement('div');
    magnetBadge.textContent='🧲';
    magnetBadge.title='Magnet hat die Kartenposition korrigiert';
    magnetBadge.style.cssText='position:absolute;z-index:10002;pointer-events:none;display:none;font-size:22px;line-height:1;padding:5px;background:#e8f5e9;border:2px solid #20a35b;border-radius:9px;box-shadow:0 2px 8px #0003';
    canvasWorkspace.append(magnetBadge);
    const hideGuides=()=>{guideX.style.display='none';guideY.style.display='none';magnetBadge.style.display='none';};
    const showMagnetFeedback=(raw,aligned,q,snapActive)=>{
      const xSnapped=snapActive&&(Math.abs(aligned.x-raw.x)>0.001||Math.abs(aligned.w-raw.w)>0.001);
      const ySnapped=snapActive&&(Math.abs(aligned.y-raw.y)>0.001||Math.abs(aligned.h-raw.h)>0.001);
      guideX.style.background=xSnapped?'#20a35b':'#ff9800';
      guideY.style.background=ySnapped?'#20a35b':'#ff9800';
      guideX.style.width=xSnapped?'3px':'1px';
      guideY.style.height=ySnapped?'3px':'1px';
      magnetBadge.style.display=xSnapped||ySnapped?'block':'none';
      if(xSnapped||ySnapped){
        magnetBadge.style.left=Math.min(width-45,Math.max(0,q.x+q.w-12))+'px';
        magnetBadge.style.top=Math.max(0,q.y-38)+'px';
      }
    };
    const magnetize=(c,q,axis,applySnap=false)=>{
      // Prefer exact adjacent edges over matching centers or distant edges.
      // Use the unrounded pointer coordinates; grid is only a fallback.
      const threshold=18/Math.max(0.5,workspaceScale||1);
      const peers=cards.filter(v=>v.c.id!==c.id&&(!c.groupId||v.c.groupId!==c.groupId)).map(v=>positions.get(v.c.id)).filter(Boolean);
      const overlap=(a,b,c,d)=>Math.min(b,d)-Math.max(a,c)>=-threshold;
      const choicesX=[],choicesY=[];
      const offer=(list,delta,line,priority)=>{if(Math.abs(delta)<=threshold)list.push({delta,line,priority});};
      for(const p of peers){
        if(axis==='move'){
          // Side-by-side: moving right edge to peer left, or left to peer right.
          if(overlap(q.y,q.y+q.h,p.y,p.y+p.h)){
            offer(choicesX,p.x-(q.x+q.w),p.x,0);
            offer(choicesX,p.x+p.w-q.x,p.x+p.w,0);
          }
          // Stacked cards: moving bottom to peer top, or top to peer bottom.
          if(overlap(q.x,q.x+q.w,p.x,p.x+p.w)){
            offer(choicesY,p.y-(q.y+q.h),p.y,0);
            offer(choicesY,p.y+p.h-q.y,p.y+p.h,0);
          }
          // Align corresponding edges and centers when near each other.
          for(const [delta,line] of [[p.x-q.x,p.x],[p.x+p.w-(q.x+q.w),p.x+p.w],[p.x+p.w/2-(q.x+q.w/2),p.x+p.w/2]])
            offer(choicesX,delta,line,1);
          for(const [delta,line] of [[p.y-q.y,p.y],[p.y+p.h-(q.y+q.h),p.y+p.h],[p.y+p.h/2-(q.y+q.h/2),p.y+p.h/2]])
            offer(choicesY,delta,line,1);
        }else{
          if(axis.includes('x')){
            offer(choicesX,p.x-(q.x+q.w),p.x,0);
            offer(choicesX,p.x+p.w-(q.x+q.w),p.x+p.w,1);
          }
          if(axis.includes('y')){
            offer(choicesY,p.y-(q.y+q.h),p.y,0);
            offer(choicesY,p.y+p.h-(q.y+q.h),p.y+p.h,1);
          }
        }
      }
      const pick=list=>list.sort((a,b)=>a.priority-b.priority||Math.abs(a.delta)-Math.abs(b.delta))[0]||null;
      const mx=pick(choicesX),my=pick(choicesY);
      if(applySnap){
        if(axis==='move'){if(mx)q.x+=mx.delta;if(my)q.y+=my.delta;}
        else{if(mx)q.w+=mx.delta;if(my)q.h+=my.delta;}
      }
      const show=overlay.querySelector('#snap-guides').checked;
      guideX.style.display=show&&mx?'block':'none';if(mx)guideX.style.left=mx.line+'px';
      guideY.style.display=show&&my?'block':'none';if(my)guideY.style.top=my.line+'px';
      return q;
    };
    let workspaceScale=1;
    const scaleWorkspace=()=>{
      if(!overlay.isConnected)return;
      const usableW=Math.max(1,canvasPane.clientWidth-24);
      workspaceScale=Math.min(usableW/width,1);
      canvasWorkspace.style.transform=`scale(${workspaceScale})`;
    };
    const testToggle=overlay.querySelector('#position-test-toggle');
    let positionTestActive=false;
    const setPositionTest=active=>{
      if(active)setMobileOptions(false);
      positionTestActive=active;
      overlay.classList.toggle('position-test-active',active);
      testToggle.textContent=active?'✎ Zurück zu Bearbeiten':'▶ Testen';
      testToggle.setAttribute('aria-pressed',String(active));
      overlay.querySelector('#position-test-hint').hidden=!active;
      hideGuides();
      overlay.querySelectorAll('.position-tile').forEach(tile=>{
        tile.style.touchAction=active?'auto':'none';
        tile.querySelectorAll('.external-card-slot').forEach(slot=>slot.style.pointerEvents=active?'auto':'');
      });
      // Keep the current in-memory positions and card instances; never re-render the editor.
      scaleWorkspace();
      this.bindToggles();this.bindClimateControls();
    };
    testToggle.onclick=()=>setPositionTest(!positionTestActive);
    refreshCanvasHeight();scaleWorkspace();
    const canvasResizeObserver=new ResizeObserver(()=>requestAnimationFrame(scaleWorkspace));
    canvasResizeObserver.observe(canvasPane);
    // Editor-only collision indicators: geometry is based on saved card frames,
    // not on the scaled custom-card DOM. Touching edges are not collisions.
    const refreshCollisions=()=>{
      const collided=new Set(), entries=cards.map(({c})=>({id:c.id,q:positions.get(c.id)})).filter(v=>v.q);
      for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
        const a=entries[i].q,b=entries[j].q;
        if(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>1&&
           Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>1){
          collided.add(entries[i].id);collided.add(entries[j].id);
        }
      }
      for(const tile of overlay.querySelectorAll('.position-tile[data-id]')){
        const hit=collided.has(tile.dataset.id);
        tile.style.setProperty('outline',hit?'3px solid #e53935':'','important');
        tile.style.setProperty('outline-offset',hit?'-3px':'','important');
        tile.title=hit?'Überlappung mit einer anderen Karte':'';
      }
    };
    const fitPositionCards=()=>{this.fitCanvasCards(overlay);refreshCollisions();};
    let fitQueued=false;
    const scheduleFit=()=>{if(fitQueued)return;fitQueued=true;requestAnimationFrame(()=>{fitQueued=false;if(overlay.isConnected)fitPositionCards();});};
    scheduleFit();
    requestAnimationFrame(()=>requestAnimationFrame(scheduleFit));
    const positionObserver=new ResizeObserver(scheduleFit);
    // Watch the frames as well as the cards: mouse resizing, numeric inputs,
    // initial layout and asynchronous card rendering all use one fit path.
    overlay.querySelectorAll('.position-tile').forEach(tile=>positionObserver.observe(tile));
    overlay.querySelectorAll('.position-tile .external-card-slot').forEach(slot=>{
      if(slot.firstElementChild)positionObserver.observe(slot.firstElementChild);
    });
    // Fit existing card frames after custom elements have completed their
    // initial render. Never move cards automatically on editor entry.
    let initialFrameFitDone=false;
    const fitOnOpen=()=>{
      if(initialFrameFitDone||!overlay.isConnected)return;
      const pending=[...overlay.querySelectorAll('.position-tile[data-id]')].some(tile=>{
        const card=cards.find(item=>item.c.id===tile.dataset.id)?.c;
        return card?.type==='custom'&&tile.querySelector('.external-card-slot')&&!tile.querySelector('.external-card-slot')?.firstElementChild;
      });
      if(pending)return;
      initialFrameFitDone=true;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        if(!overlay.isConnected)return;
        this.autoFitExternalFrames(tab,overlay,positions,update,true);
        scheduleFit();
      }));
    };
    scheduleFit();
    requestAnimationFrame(()=>requestAnimationFrame(fitOnOpen));
    const openingFitObserver=new MutationObserver(fitOnOpen);
    openingFitObserver.observe(overlay,{childList:true,subtree:true});
    setTimeout(()=>{fitOnOpen();openingFitObserver.disconnect();},2500);
    const editorEntryDirty=this.dirty;
    const capturePositions=()=>new Map(cards.map(({c})=>[c.id,{q:{...positions.get(c.id)},position:c.position?{...c.position}:null,groupId:c.groupId||null}]));
    const initialPositions=capturePositions();
    const tileFor=id=>[...overlay.querySelectorAll('.position-tile[data-id]')].find(el=>el.dataset.id===id);
    const isEditorLocked=c=>c?.position?.editorLocked===true;
    const layerOf=c=>Math.max(0,Math.min(9999,Math.round(Number(c.position?.z)||0)));
    const applyLayerStyle=c=>{const el=tileFor(c.id);if(el)el.style.zIndex=String(layerOf(c));};
    const undoHistory=[],redoHistory=[];
    const sameSnapshot=(a,b)=>JSON.stringify([...a])===JSON.stringify([...b]);
    const refreshHistory=()=>{
      overlay.querySelector('#undo-position').disabled=!undoHistory.length;
      overlay.querySelector('#redo-position').disabled=!redoHistory.length;
    };
    const rememberChange=()=>{
      const current=capturePositions(),last=undoHistory[undoHistory.length-1];
      if(last&&sameSnapshot(last,current))return;
      undoHistory.push(current);if(undoHistory.length>60)undoHistory.shift();
      redoHistory.length=0;refreshHistory();
    };
    let restoringHistory=false;
    const restorePositions=snapshot=>{
      restoringHistory=true;
      try{
        for(const {c} of cards){
          const v=snapshot.get(c.id);if(!v)continue;
          positions.set(c.id,{...v.q});
          if(v.position===null)delete c.position;else c.position={...v.position};if(v.groupId)c.groupId=v.groupId;else delete c.groupId;
          const el=[...overlay.querySelectorAll('.position-tile[data-id]')].find(x=>x.dataset.id===c.id);
          if(el){el.style.zIndex=String(layerOf(c));el.style.left=v.q.x+'px';el.style.top=v.q.y+'px';el.style.width=v.q.w+'px';el.style.height=v.q.h+'px';}
        }
        this.dirty=editorEntryDirty||!sameSnapshot(initialPositions,capturePositions());
        refreshCanvasHeight();fitPositionCards();if(active)choose(active.id);
      }finally{restoringHistory=false;}
    };
    overlay.querySelector('#undo-position').onclick=()=>{
      if(!undoHistory.length)return;
      redoHistory.push(capturePositions());restorePositions(undoHistory.pop());refreshHistory();
    };
    overlay.querySelector('#redo-position').onclick=()=>{
      if(!redoHistory.length)return;
      undoHistory.push(capturePositions());restorePositions(redoHistory.pop());refreshHistory();
    };
    const select=overlay.querySelector('#selected');let active=cards[0]?.c;
    const selectedIds=new Set();let selectionAnchor=null;let selectionOrder=[];
    const referenceCard=()=>{const chosen=selectionOrder.map(id=>cards.find(v=>v.c.id===id)?.c).filter(c=>c&&selectedIds.has(c.id));return chosen.find(isEditorLocked)||chosen[0]||null;};
    const groupMembers=id=>{const c=cards.find(v=>v.c.id===id)?.c;return c?.groupId?cards.filter(v=>v.c.groupId===c.groupId).map(v=>v.c):c?[c]:[];};
    const updateGroupControls=()=>{const members=cards.filter(v=>selectedIds.has(v.c.id)).map(v=>v.c);const current=active?.groupId;overlay.querySelector('#group-cards').disabled=members.length<2;overlay.querySelector('#ungroup-cards').disabled=!current;overlay.querySelector('#ungroup-all-cards').disabled=!cards.some(v=>v.c.groupId);overlay.querySelector('#group-status').textContent=current?`Gruppe: ${groupMembers(active.id).length} Karten · Ziehen bewegt alle gemeinsam`:'Keine Gruppe ausgewählt';};
    overlay.querySelector('#group-cards').onclick=()=>{const chosen=cards.filter(v=>selectedIds.has(v.c.id)).map(v=>v.c);if(chosen.length<2)return;rememberChange();const id=this.uid();for(const c of chosen)c.groupId=id;this.dirty=true;syncSelection();};
    overlay.querySelector('#ungroup-cards').onclick=()=>{if(!active?.groupId)return;rememberChange();for(const c of groupMembers(active.id))delete c.groupId;this.dirty=true;syncSelection();};
    overlay.querySelector('#ungroup-all-cards').onclick=()=>{const grouped=cards.filter(v=>v.c.groupId).map(v=>v.c);if(!grouped.length)return;if(!window.confirm(`Alle ${new Set(grouped.map(c=>c.groupId)).size} Kartengruppen im aktiven Raum auflösen? Die Karten bleiben unverändert.`))return;rememberChange();for(const c of grouped)delete c.groupId;this.dirty=true;syncSelection();};
    const syncSelection=()=>{overlay.querySelectorAll('.position-tile[data-id]').forEach(el=>{el.classList.toggle('selected',selectedIds.has(el.dataset.id)&&el.dataset.id===active?.id);el.classList.toggle('multi-selected',selectedIds.has(el.dataset.id)&&el.dataset.id!==active?.id);el.classList.toggle('reference-card',el.dataset.id===referenceCard()?.id);});overlay.querySelector('#multi-count').textContent=`${selectedIds.size} Karten ausgewählt`;updateGroupControls();const bulkEligible=cards.filter(({c})=>selectedIds.has(c.id)&&!isEditorLocked(c));const ref=referenceCard();const canResize=selectedIds.size>=2&&bulkEligible.some(({c})=>c.id!==ref?.id);overlay.querySelectorAll('[data-bulk-size]').forEach(b=>b.disabled=!canResize);overlay.querySelector('#bulk-scale-apply').disabled=!canResize;overlay.querySelector('#bulk-size-hint').textContent=ref?`Referenz: ${ref.title||ref.id}${isEditorLocked(ref)?' (gesperrt)':''} · ${bulkEligible.length} bearbeitbar`:'Zuerst Karten auswählen.';overlay.querySelectorAll('[data-align]').forEach(b=>{b.disabled=selectedIds.size<2;});};
    let mobileMultiSelect=false;
    const selectCard=(id,ev)=>{
      if(mobileMultiSelect&&ev&&!ev.ctrlKey&&!ev.metaKey&&!ev.shiftKey)ev={ctrlKey:true};const index=cards.findIndex(v=>v.c.id===id);if(index<0)return;if(ev&&(ev.ctrlKey||ev.metaKey)){if(selectedIds.has(id)){selectedIds.delete(id);selectionOrder=selectionOrder.filter(x=>x!==id);}else{selectedIds.add(id);selectionOrder.push(id);}selectionAnchor=id;}else if(ev?.shiftKey&&selectionAnchor){const from=cards.findIndex(v=>v.c.id===selectionAnchor);if(from>=0){for(let i=Math.min(from,index);i<=Math.max(from,index);i++){const cid=cards[i].c.id;if(!selectedIds.has(cid)){selectedIds.add(cid);selectionOrder.push(cid);}}}}else{selectedIds.clear();selectedIds.add(id);selectionOrder=[id];selectionAnchor=id;}select.value=id;choose(id);};
    const choose=id=>{active=cards.find(v=>v.c.id===id)?.c;syncSelection();if(active){const q=positions.get(id);for(const k of ['x','y','w','h'])overlay.querySelector('#pos-'+k).value=Math.round(q[k]);overlay.querySelector('#protect-size').checked=active.position?.manualSize===true;overlay.querySelector('#protect-position').checked=active.position?.manualPosition===true;overlay.querySelector('#editor-lock').checked=isEditorLocked(active);for(const field of ['x','y','w','h'])overlay.querySelector('#pos-'+field).disabled=isEditorLocked(active);overlay.querySelector('#protect-size').disabled=isEditorLocked(active);overlay.querySelector('#protect-position').disabled=isEditorLocked(active);}};
    // Normalize the entire stack to unique, consecutive layers after every action.
    // A single click is one atomic change, including for cards that originally
    // shared z=0 (where changing a numeric z alone may not change visible order).
    const layerPeers=()=>cards.map(({c},i)=>({c,i,z:layerOf(c)})).sort((a,b)=>a.z-b.z||a.i-b.i);
    const changeLayer=action=>{
      if(!active||isEditorLocked(active))return;
      const order=layerPeers().map(v=>v.c);
      const from=order.indexOf(active);
      if(from<0)return;
      // A visible layer step skips cards that do not intersect the selected
      // tile. Otherwise several clicks may change z-order without any visual
      // effect because unrelated cards occupy intermediate stack positions.
      const intersects=(a,b)=>{
        const p=positions.get(a.id),q=positions.get(b.id);
        return !!(p&&q&&p.x<q.x+q.w&&p.x+p.w>q.x&&p.y<q.y+q.h&&p.y+p.h>q.y);
      };
      let to;
      if(action==='front')to=order.length-1;
      else if(action==='back')to=0;
      else if(action==='up'){
        to=order.findIndex((c,i)=>i>from&&intersects(active,c));
        if(to<0)return;
      }else{
        to=-1;
        for(let i=from-1;i>=0;i--){if(intersects(active,order[i])){to=i;break;}}
        if(to<0)return;
      }
      if(to===from)return;
      rememberChange();
      order.splice(from,1);
      order.splice(to,0,active);
      order.forEach((c,i)=>{
        c.position={...(c.position||{}),z:i};
        applyLayerStyle(c);
      });
      this.dirty=true;
      choose(active.id);
    };
    for(const action of ['front','back','up','down'])
      overlay.querySelector('#layer-'+action).onclick=()=>changeLayer(action);
    // Keep the card's measured aspect ratio when its width changes. Do not
    // interfere with explicitly edited heights or with native HA cards.
    const heightForWidth=(c,old,w)=>{
      if(!this.externalVariant(c)||!overlay.querySelector('#auto-height-on-width')?.checked)return null;
      const tile=[...overlay.querySelectorAll('.position-tile[data-id]')].find(el=>el.dataset.id===c.id);
      const measured=this.externalCardSize(c,tile);
      const ratio=measured?.nativeWidth>0&&measured?.nativeHeight>0
        ?measured.nativeHeight/measured.nativeWidth:old.h/Math.max(1,old.w);
      if(!Number.isFinite(ratio)||ratio<=0)return null;
      return Math.max(60,Math.round(w*ratio));
    };
    const update=(c,q,manual=true)=>{if(isEditorLocked(c))return;const w=clamp(Math.round(q.w),76,width),h=Math.max(60,Math.round(q.h));const tile=[...overlay.querySelectorAll('.position-tile[data-id]')].find(el=>el.dataset.id===c.id);
      const finalH=h;
      const v={x:clamp(Math.round(q.x),0,width-w),y:Math.max(0,Math.round(q.y)),w,h:finalH};const prior=positions.get(c.id)||v;positions.set(c.id,v);const prev=c.position||{};c.position={...prev,...v,manualSize:manual&&(w!==prior.w||h!==prior.h)?true:prev.manualSize===true,manualPosition:manual&&(v.x!==prior.x||v.y!==prior.y)?true:prev.manualPosition===true};if(manual&&(w!==prior.w||h!==prior.h))delete c.position.thermScale;const el=[...overlay.querySelectorAll('.position-tile')].find(el=>el.dataset.id===c.id);if(el){el.style.left=v.x+'px';el.style.top=v.y+'px';el.style.width=w+'px';el.style.height=v.h+'px';}this.dirty=true;refreshCanvasHeight();fitPositionCards();if(active===c)choose(c.id);};
    // Apply a single atomic batch resize to selected, unlocked cards; update() handles
    // canvas boundaries, manual-size protection and visual refresh. One undo step.
    const bulkResize=(mode,percent=100)=>{
      const chosen=cards.filter(({c})=>selectedIds.has(c.id)&&!isEditorLocked(c));
      const reference=referenceCard();if(!reference||selectedIds.size<2||!chosen.some(({c})=>c.id!==reference.id))return;
      const ref=positions.get(reference.id);if(!ref)return;
      const proposals=chosen.filter(({c})=>c.id!==reference.id).map(({c})=>{
        const q=positions.get(c.id);if(!q)return null;
        const w=mode==='width'||mode==='both'?ref.w:mode==='scale'?Math.round(q.w*percent/100):q.w;
        const h=mode==='height'||mode==='both'?ref.h:mode==='scale'?Math.round(q.h*percent/100):q.h;
        return {c,q:{...q,w,h}};
      }).filter(Boolean);
      if(!proposals.some(({c,q})=>{const p=positions.get(c.id);return Math.min(width,Math.max(76,q.w))!==p.w||Math.min(height,Math.max(60,q.h))!==p.h;}))return;
      rememberChange();for(const {c,q} of proposals)update(c,q);
      syncSelection();
    };
    overlay.querySelectorAll('[data-bulk-size]').forEach(b=>b.onclick=()=>bulkResize(b.dataset.bulkSize));
    overlay.querySelector('#bulk-scale-apply').onclick=()=>{
      const percent=Number(overlay.querySelector('#bulk-scale-percent').value);
      if(!Number.isFinite(percent)||percent<10||percent>300){alert('Bitte einen Skalierungswert zwischen 10 und 300 % eingeben.');return;}
      bulkResize('scale',percent);
    };
    overlay.querySelector('#auto-fit-frames').onclick=()=>{
      const protectedCount=[...overlay.querySelectorAll('.position-tile[data-id]')].filter(tile=>{
        const card=cards.find(v=>v.c.id===tile.dataset.id)?.c;
        return card&&this.externalVariant(card)&&card.position?.manualSize===true&&!isEditorLocked(card);
      }).length;
      const includeProtected=protectedCount>0&&confirm(`${protectedCount} Karte(n) haben eine manuell geschützte Größe. Sollen diese Größen für diese einmalige automatische Anpassung ausdrücklich überschrieben werden? Die manuelle Größensperre bleibt anschließend bestehen.`);
      rememberChange();const count=this.autoFitExternalFrames(tab,overlay,positions,update,includeProtected);
      if(!count)alert('Keine anpassbaren Kartenrahmen gefunden oder die Abmessungen passen bereits. Gesperrte Karten und nicht freigegebene manuelle Größen bleiben unverändert.');
      else alert(`${count} Kartenrahmen angepasst. Bitte Ergebnis prüfen und erst danach im Layout-Editor speichern.`);
    };
    // Plan alignment atomically. Never change an unselected tile. Selected tiles may overlap each
    // other intentionally; new overlaps with unselected tiles are blocked.
    const applyAlignment=mode=>{
      const chosen=cards.filter(({c})=>selectedIds.has(c.id)&&!isEditorLocked(c)).map(({c})=>({c,q:{...positions.get(c.id)}}));
      const distribute=mode.startsWith('distribute')||mode.startsWith('gap');
      const refCard=referenceCard(),refRect=refCard&&positions.get(refCard.id);
      if(selectedIds.size<2||chosen.length<2){if(distribute)alert('Zum Verteilen mindestens zwei entsperrte Karten auswählen.');return;}
      if(!distribute&&(!refRect||!chosen.some(({c})=>c.id!==refCard.id)))return;
      // Explicit alignment is a manual user action and takes precedence over position protection.
      const left=refRect?.x,top=refRect?.y;
      const right=refRect?refRect.x+refRect.w:0,bottom=refRect?refRect.y+refRect.h:0;
      if(['left','right','hcenter','top','bottom','vcenter'].includes(mode)){
        chosen.filter(({c})=>c.id!==refCard.id).forEach(({q})=>{
          if(mode==='left')q.x=left;
          if(mode==='right')q.x=right-q.w;
          if(mode==='hcenter')q.x=(left+right-q.w)/2;
          if(mode==='top')q.y=top;
          if(mode==='bottom')q.y=bottom-q.h;
          if(mode==='vcenter')q.y=(top+bottom-q.h)/2;
        });
      }else if(mode.startsWith('distribute')||mode.startsWith('gap')){
        const horizontal=mode.endsWith('x'),axis=horizontal?'x':'y',size=horizontal?'w':'h';
        const ordered=[...chosen].sort((a,b)=>a.q[axis]-b.q[axis]);
        if(horizontal){
          // Spread over the ENTIRE profile width. Respect a 12 px outer margin.
          const margin=12,available=width-2*margin;
          const used=ordered.reduce((sum,v)=>sum+v.q.w,0);
          if(used>available){
            // Wrap into balanced rows without resizing cards. Keep a 12 px
            // minimum horizontal/vertical gap and distribute each row evenly.
            const spacing=12,rows=[];let row=[],rowWidth=0;
            for(const item of ordered){
              if(item.q.w>available){alert('Mindestens eine Karte ist breiter als die verfügbare Profilbreite. Bitte diese Karte verkleinern.');return;}
              if(row.length&&rowWidth+spacing+item.q.w>available){rows.push(row);row=[];rowWidth=0;}
              row.push(item);rowWidth+=item.q.w+(row.length>1?spacing:0);
            }
            if(row.length)rows.push(row);
            const rowHeights=rows.map(items=>Math.max(...items.map(v=>v.q.h)));
            const totalHeight=rowHeights.reduce((sum,h)=>sum+h,0)+spacing*(rows.length-1);
            const maxHeight=dynamicHeight?Math.max(height,...[...positions.values()].map(v=>v.y+v.h+24),totalHeight+24):height;
            if(totalHeight>maxHeight-2*margin){alert('Für den horizontalen Zeilenumbruch ist nicht genügend Höhe vorhanden. Bitte Karten verkleinern oder die Displayhöhe erhöhen.');return;}
            let y=margin;
            rows.forEach((items,i)=>{
              const sum=items.reduce((n,v)=>n+v.q.w,0);
              const rowGap=items.length>1?(available-sum)/(items.length-1):0;
              let x=items.length===1?margin+(available-sum)/2:margin;
              items.forEach(item=>{item.q.x=Math.round(x);item.q.y=Math.round(y);x+=item.q.w+rowGap;});
              y+=rowHeights[i]+spacing;
            });
          }else{
            const gap=(available-used)/(ordered.length-1);
            let cursor=margin;
            ordered.forEach(item=>{item.q.x=Math.round(cursor);cursor+=item.q.w+gap;});
          }
        }else if(ordered.length===2){
          // A pair has no intermediate card: place the second card directly
          // below the first, preserving its x position and a 12 px gap.
          // Search for a collision-free anchor instead of rejecting the first try.
          const gap=12,[a,b]=ordered;
          const blockH=a.q.h+gap+b.q.h;
          const dynamic=dynamicHeight;
          const lowest=Math.max(0,...cards.map(({c})=>{const r=positions.get(c.id);return r.y+r.h;}));
          const maxY=dynamic?Math.max(height,Math.ceil(lowest+blockH+24)):height;
          const others=cards.filter(({c})=>!selectedIds.has(c.id)).map(({c})=>positions.get(c.id));
          const intersects=(r,t)=>r.x<t.x+t.w-1&&r.x+r.w>t.x+1&&r.y<t.y+t.h-1&&r.y+r.h>t.y+1;
          const originalY=a.q.y;
          const candidates=[];
          for(let y=0;y+blockH<=maxY;y+=4)candidates.push(y);
          candidates.sort((x,y)=>Math.abs(x-originalY)-Math.abs(y-originalY));
          const found=candidates.find(y=>{
            const ra={...a.q,y},rb={...b.q,y:y+a.q.h+gap};
            return !others.some(t=>intersects(ra,t)||intersects(rb,t));
          });
          if(found===undefined){alert('Keine freie vertikale Position für die zwei Karten mit 12 px Abstand gefunden.');return;}
          a.q.y=found;b.q.y=found+a.q.h+gap;
        }else{
          // For three or more cards, distribute between the two outermost cards.
          const first=ordered[0],last=ordered[ordered.length-1];
          const total=ordered.reduce((sum,v)=>sum+v.q.h,0);
          const gap=(last.q.y+last.q.h-first.q.y-total)/(ordered.length-1);
          if(gap<0){alert('Zwischen den äußeren Karten ist nicht genügend Platz. Bitte die äußeren Karten weiter auseinanderziehen.');return;}
          let cursor=first.q.y+first.q.h+gap;
          ordered.slice(1,-1).forEach(item=>{item.q.y=Math.round(cursor);cursor+=item.q.h+gap;});
        }
      }
      const proposed=new Map(positions);
      chosen.forEach(({c,q})=>proposed.set(c.id,{...q,x:Math.round(q.x),y:Math.round(q.y)}));
      const rectangles=cards.map(({c})=>({id:c.id,...proposed.get(c.id)}));
      const before=cards.map(({c})=>({id:c.id,...positions.get(c.id)}));
      // Validate only cards affected by this operation. Unrelated existing
      // out-of-bounds geometry must not prevent an otherwise valid alignment.
      const outOfBounds=rectangles.some(r=>selectedIds.has(r.id)&&
        (r.x<0||r.y<0||r.x+r.w>width||(this.normalizedProfiles(this.deviceProfiles)[this._deviceLayoutProfile||'fire_hd']?.fixed&&r.y+r.h>height)));
      const overlaps=(a,b)=>a.x<b.x+b.w-1&&a.x+a.w>b.x+1&&a.y<b.y+b.h-1&&a.y+a.h>b.y+1;
      // Preserve pre-existing overlaps without introducing new ones. Only pairs
      // involving a moved card are relevant to an explicit alignment operation.
      const moved=new Set(chosen.filter(({c})=>{
        const a=positions.get(c.id),b=proposed.get(c.id);
        return a.x!==b.x||a.y!==b.y;
      }).map(({c})=>c.id));
      const oldById=new Map(before.map(r=>[r.id,r]));
      const collision=rectangles.some((a,i)=>rectangles.slice(i+1).some(b=>
        // Alignment is allowed to overlap cards within the selection.
        // Only newly introduced intersections with unselected cards block it.
        !(selectedIds.has(a.id)&&selectedIds.has(b.id))&&
        (moved.has(a.id)||moved.has(b.id))&&overlaps(a,b)&&
        !overlaps(oldById.get(a.id),oldById.get(b.id))));
      if(outOfBounds||collision){
        const issue=outOfBounds?'Mindestens eine ausgewählte Karte würde den Displayrahmen verlassen.':'Eine ausgewählte Karte würde eine nicht ausgewählte Karte überlagern.';
        alert('Ausrichtung nicht übernommen: '+issue+' Bestehende Überlagerungen bleiben unverändert.');
        return;
      }
      const didMove=chosen.some(({c})=>{const q=proposed.get(c.id),old=positions.get(c.id);return q.x!==old.x||q.y!==old.y;});
      if(!didMove&&distribute){alert('Keine Positionsänderung: Die Karten sind bereits gleichmäßig verteilt oder es gibt zwischen den äußeren Karten keinen zusätzlichen Spielraum.');return;}
      if(didMove)rememberChange();
      chosen.forEach(({c})=>{
        const q=proposed.get(c.id),old=positions.get(c.id);
        if(q.x!==old.x||q.y!==old.y)update(c,q);
      });
      syncSelection();
    };
    const fixedGap=()=>Math.max(0,Math.min(200,Math.round(Number(overlay.querySelector('#fixed-card-gap').value)||0)));
    const arrangeFixedGap=axis=>{
      const chosen=cards.filter(({c})=>selectedIds.has(c.id)&&!isEditorLocked(c)).map(({c})=>({c,q:{...positions.get(c.id)}}));
      if(chosen.length<2){alert('Bitte mindestens zwei entsperrte Karten auswählen.');return;}
      const horizontal=axis==='x',gap=fixedGap(),ordered=chosen.sort((a,b)=>a.q[axis]-b.q[axis]);
      const fixed=!!this.normalizedProfiles(this.deviceProfiles)[this._deviceLayoutProfile||'fire_hd']?.fixed;
      const overlaps=(a,b)=>Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>1;
      const originals=new Map([...positions].map(([id,q])=>[id,{...q}]));
      const movedIds=new Set(ordered.map(v=>v.c.id));
      const size=horizontal?'w':'h',cross=horizontal?'h':'w',otherAxis=horizontal?'y':'x';
      const rawSpan=ordered.reduce((n,v)=>n+v.q[size],0)+gap*(ordered.length-1);
      const lineLimit=horizontal?width:(fixed?height:Math.max(height,...[...originals.values()].map(q=>q.y+q.h)));
      const lines=[];let line=[],lineSpan=0;
      for(const item of ordered){
        if(item.q[size]>lineLimit){alert('Mindestens eine Karte ist größer als die verfügbare Displayachse.');return;}
        if(line.length&&lineSpan+gap+item.q[size]>lineLimit){lines.push(line);line=[];lineSpan=0;}
        lineSpan+=item.q[size]+(line.length?gap:0);line.push(item);
      }
      if(line.length)lines.push(line);
      const lineSizes=lines.map(items=>({span:items.reduce((n,v)=>n+v.q[size],0)+gap*(items.length-1),thickness:Math.max(...items.map(v=>v.q[cross]))}));
      const span=Math.max(...lineSizes.map(v=>v.span));
      const thickness=lineSizes.reduce((n,v)=>n+v.thickness,0)+gap*(lines.length-1);
      if((horizontal&&fixed&&thickness>height)||(!horizontal&&thickness>width)){
        alert('Auch mit automatischem Zeilen- bzw. Spaltenumbruch reicht die Displayfläche nicht aus.');return;
      }
      const originX=Math.min(...ordered.map(v=>v.q.x)),originY=Math.min(...ordered.map(v=>v.q.y));
      const candidate=(x,y)=>{
        const next=new Map([...originals].map(([id,q])=>[id,{...q}]));
        const alignment=overlay.querySelector('#fixed-gap-alignment').value;
        let crossCursor=horizontal?y:x;
        lines.forEach((items,i)=>{
          let cursor=horizontal?x:y;
          for(const {c} of items){
            const q=next.get(c.id);
            const offset=alignment==='center'?(lineSizes[i].thickness-q[cross])/2:alignment==='end'?lineSizes[i].thickness-q[cross]:0;
            if(horizontal){q.x=Math.round(cursor);q.y=Math.round(crossCursor+offset);}
            else{q.x=Math.round(crossCursor+offset);q.y=Math.round(cursor);}
            cursor+=q[size]+gap;
          }
          crossCursor+=lineSizes[i].thickness+gap;
        });
        return next;
      };
      const inside=q=>q.x>=0&&q.y>=0&&q.x+q.w<=width&&(!fixed||q.y+q.h<=height);
      const valid=next=>{
        if(ordered.some(({c})=>!inside(next.get(c.id))))return false;
        for(const {c} of cards){
          if(movedIds.has(c.id))continue;
          if(ordered.some(({c:v})=>overlaps(next.get(v.id),next.get(c.id))))return false;
        }
        return true;
      };
      const maxX=horizontal?width-span:width-thickness;
      const maxY=fixed?height-(horizontal?thickness:span):Math.max(height,...[...originals.values()].map(q=>q.y+q.h))+thickness+span+24;
      const clampOrigin=(v,max)=>Math.max(0,Math.min(Math.floor(max),Math.round(v)));
      const x0=clampOrigin(originX,maxX),y0=clampOrigin(originY,maxY);
      let solution=candidate(x0,y0);
      if(!valid(solution)){
        // First find the nearest collision-free location for the whole selection.
        // Search exact blocker edges as well as a modest regular grid.
        const xs=new Set([0,x0,Math.floor(maxX)]),ys=new Set([0,y0,Math.floor(maxY)]);
        for(const {c} of cards){
          if(movedIds.has(c.id))continue;
          const q=originals.get(c.id);
          for(const v of [q.x+q.w+gap,q.x-span-gap])if(v>=0&&v<=maxX)xs.add(Math.round(v));
          for(const v of [q.y+q.h+gap,q.y-(horizontal?thickness:span)-gap])if(v>=0&&v<=maxY)ys.add(Math.round(v));
        }
        for(let x=0;x<=maxX;x+=20)xs.add(x);
        for(let y=0;y<=maxY;y+=20)ys.add(y);
        const spots=[];
        for(const x of xs)for(const y of ys)spots.push({x,y,d:Math.abs(x-x0)+Math.abs(y-y0)});
        spots.sort((a,b)=>a.d-b.d);
        solution=null;
        for(const spot of spots){
          const next=candidate(spot.x,spot.y);
          if(valid(next)){solution=next;break;}
        }
      }
      if(!solution){
        // If no free location exists, push only movable blockers, in the
        // arrangement direction. Never modify locked or grouped cards.
        const next=candidate(x0,y0),queue=ordered.map(v=>v.c.id);
        const touched=new Set(queue);
        let possible=ordered.every(({c})=>inside(next.get(c.id)));
        while(queue.length&&possible){
          const id=queue.shift(),a=next.get(id);
          for(const {c} of cards){
            if(c.id===id||!overlaps(a,next.get(c.id)))continue;
            if(movedIds.has(c.id)||isEditorLocked(c)||c.groupId||touched.has(c.id)){possible=false;break;}
            const q=next.get(c.id);
            q[axis]=Math.round(a[axis]+a[size]+gap);
            if(!inside(q)){possible=false;break;}
            touched.add(c.id);queue.push(c.id);
          }
        }
        if(possible)solution=next;
      }
      if(!solution){
        alert('Keine kollisionsfreie Anordnung möglich. Gesperrte Karten und Displaygrenzen bleiben unverändert.');return;
      }
      const changes=cards.filter(({c})=>{const a=originals.get(c.id),b=solution.get(c.id);return a.x!==b.x||a.y!==b.y;});
      if(!changes.length)return;
      rememberChange();
      for(const {c} of changes)update(c,solution.get(c.id));
      syncSelection();
    };
    overlay.querySelectorAll('[data-fixed-gap]').forEach(b=>b.onclick=()=>arrangeFixedGap(b.dataset.fixedGap));
    overlay.querySelectorAll('[data-align]').forEach(b=>b.onclick=()=>applyAlignment(b.dataset.align));
    // Alpha 13.5.17: deterministic, size-aware shelf packing of every card.
    // The arrangement is atomic: if all rectangles do not fit, nothing is changed.
    // Existing position locks are deliberately ignored, but their flags are preserved.
    let autoLayoutUndo=null;
    const planAutoLayout=()=>{
      const spacing=12,margin=12,usable=width-2*margin;
      const all=cards.map(({c},i)=>({c,i,q:{...positions.get(c.id)}}));
      // A group is a rigid unit: preserve each member's relative position and size.
      const groups=new Map(),singles=[];
      for(const v of all){
        if(v.c.groupId){
          if(!groups.has(v.c.groupId))groups.set(v.c.groupId,[]);
          groups.get(v.c.groupId).push(v);
        }else singles.push(v);
      }
      const groupDirection=overlay.querySelector('#auto-group-direction').value;
      const spaceMode=overlay.querySelector('#auto-space-mode').value;
      const blocks=[...groups.values()].map(members=>{
        // Layout coordinates are local to the group block; no member size changes.
        const left=Math.min(...members.map(v=>v.q.x)),top=Math.min(...members.map(v=>v.q.y));
        let local=members.map(v=>({v,dx:v.q.x-left,dy:v.q.y-top}));
        if(groupDirection!=='keep'){
          const ordered=[...members].sort((a,b)=>a.i-b.i);
          let offset=0;
          local=ordered.map(v=>{
            const entry={v,dx:groupDirection==='horizontal'?offset:0,dy:groupDirection==='vertical'?offset:0};
            offset+=(groupDirection==='horizontal'?v.q.w:v.q.h)+spacing;
            return entry;
          });
        }
        const w=Math.max(...local.map(item=>item.dx+item.v.q.w));
        const h=Math.max(...local.map(item=>item.dy+item.v.q.h));
        return {members,w,h,left,top,local,group:true};
      }).sort((a,b)=>Math.min(...a.members.map(v=>v.i))-Math.min(...b.members.map(v=>v.i)));
      // Sort remaining single cards by their actual rendered card type.
      const cardType=v=>this.externalVariant(v.c)||this.cardKind(v.c)||v.c.type||'other';
      // The first single-card type should be the type already used by a group.
      // This makes the next card of that type continue immediately after its group.
      const groupTypes=[...new Set(blocks.flatMap(b=>b.members.map(cardType)))];
      const singleTypes=[...new Set(singles.map(cardType))];
      const typeOrder=[...groupTypes,...singleTypes.filter(t=>!groupTypes.includes(t))];
      const orderedSingles=[...singles].sort((a,b)=>typeOrder.indexOf(cardType(a))-typeOrder.indexOf(cardType(b))||a.i-b.i);
      if(blocks.some(b=>b.w>usable||(!dynamicHeight&&b.h>height-2*margin))||orderedSingles.some(v=>v.q.w>usable||(!dynamicHeight&&v.q.h>height-2*margin)))return null;
      const proposal=new Map(),occupied=[];
      const place=(block,x,y)=>{
        occupied.push({x,y,w:block.w,h:block.h,members:block.members});
        for(const item of block.local||block.members.map(v=>({v,dx:v.q.x-block.left,dy:v.q.y-block.top}))){
          const {v,dx,dy}=item;
          proposal.set(v.c.id,{...v.q,x:Math.round(x+dx),y:Math.round(y+dy)});
        }
      };
      // First reserve entire horizontal shelves for grouped blocks.
      let cursorX=margin,cursorY=margin,rowHeight=0;
      for(const block of blocks){
        if(cursorX>margin&&cursorX+block.w>width-margin){cursorX=margin;cursorY+=rowHeight+spacing;rowHeight=0;}
        if(!dynamicHeight&&cursorY+block.h>height-margin)return null;
        place(block,cursorX,cursorY);
        occupied[occupied.length-1].cardType=cardType(block.members[block.members.length-1]);
        cursorX+=block.w+spacing;rowHeight=Math.max(rowHeight,block.h);
      }
      // Then fit individual cards into remaining gaps, top-to-bottom and
      // left-to-right, preserving type order. Never move grouped blocks.
      const fits=(x,y,w,h)=>x>=margin&&y>=margin&&x+w<=width-margin&&(dynamicHeight||y+h<=height-margin)&&
        occupied.every(r=>x+w+spacing<=r.x||r.x+r.w+spacing<=x||y+h+spacing<=r.y||r.y+r.h+spacing<=y);
      for(const v of orderedSingles){
        const block={members:[v],w:v.q.w,h:v.q.h,left:v.q.x,top:v.q.y};
        const xs=new Set([margin]),ys=new Set([margin]);
        for(const r of occupied){xs.add(r.x+r.w+spacing);ys.add(r.y+r.h+spacing);}
        const candidates=[];
        for(const y of ys)for(const x of xs)if(fits(x,y,block.w,block.h))candidates.push({x,y});
        // Prefer a horizontal continuation of the most recently placed card
        // of the same type, before searching remaining free spaces.
        const previous=[...occupied].reverse().find(r=>r.cardType===cardType(v));
        const preferred=previous?{x:previous.x+previous.w+spacing,y:previous.y}:null;
        const preferredFits=preferred&&fits(preferred.x,preferred.y,block.w,block.h);
        candidates.sort((a,b)=>a.y-b.y||a.x-b.x);
        if(!candidates.length&&!preferredFits)return null;
        const spot=preferredFits?preferred:candidates[0];
        place(block,spot.x,spot.y);
        occupied[occupied.length-1].cardType=cardType(v);
      }
      if(spaceMode==='wide'&&occupied.length>1){
        // Expand gaps between independent blocks, never within a group.
        // An axis is expanded only if multiple distinct anchor coordinates exist.
        // Derive a safe expansion factor from EVERY block's right/bottom bound.
        const axisFactor=(axis,size,limit)=>{
          const origins=occupied.map(r=>r[axis]-margin);
          if(Math.max(...origins)<1)return 1;
          const safe=occupied.filter(r=>r[axis]>margin).map(r=>(limit-margin-r[size])/(r[axis]-margin));
          return Math.max(1,Math.min(...safe));
        };
        const fx=axisFactor('x','w',width-margin),fy=1; // Do not stretch vertically across an unbounded canvas.
        for(const block of occupied){
          const nx=Math.round(margin+(block.x-margin)*fx),ny=Math.round(margin+(block.y-margin)*fy);
          const dx=nx-block.x,dy=ny-block.y;
          for(const item of block.members||[]){
            const q=proposal.get(item.c.id);
            if(q)proposal.set(item.c.id,{...q,x:q.x+dx,y:q.y+dy});
          }
        }
      }
      return proposal;
    };
    const applyAutoLayout=(proposal)=>{
      cards.forEach(({c})=>{
        const q=proposal.get(c.id),old=positions.get(c.id);
        if(q&&(old.x!==q.x||old.y!==q.y)){const wasLocked=isEditorLocked(c);if(wasLocked)c.position={...c.position,editorLocked:false};update(c,q,false);if(wasLocked)c.position={...c.position,editorLocked:true};}
      });
      refreshCanvasHeight();syncSelection();
    };
    // Store editor preferences per dashboard in this browser, independently of layout data.
    const prefsKey='rotapfel-auto-layout:'+String(this.editing||'default');
    try{
      const prefs=JSON.parse(localStorage.getItem(prefsKey)||'{}');
      if(['keep','horizontal','vertical'].includes(prefs.group))overlay.querySelector('#auto-group-direction').value=prefs.group;
      if(['compact','wide'].includes(prefs.space))overlay.querySelector('#auto-space-mode').value=prefs.space;
    }catch(e){}
    const saveAutoPrefs=()=>{try{localStorage.setItem(prefsKey,JSON.stringify({group:overlay.querySelector('#auto-group-direction').value,space:overlay.querySelector('#auto-space-mode').value}));}catch(e){}};
    overlay.querySelector('#auto-group-direction').addEventListener('change',saveAutoPrefs);
    overlay.querySelector('#auto-space-mode').addEventListener('change',saveAutoPrefs);
    overlay.querySelector('#auto-layout-tab').onclick=()=>{
      if(!cards.length){alert('Keine Karten im aktuellen Tab vorhanden.');return;}
      const proposal=planAutoLayout();
      if(!proposal){alert(dynamicHeight?'Mindestens eine Karte oder Gruppe ist breiter als die verfügbare Profilbreite (inklusive 12 px Rand). Es wurde nichts verändert.':'Die Karten passen mit unveränderten Größen und mindestens 12 px Abstand nicht vollständig in die feste Displayfläche. Es wurde nichts verändert.');return;}
      const snapshot=new Map(cards.map(({c})=>[c.id,{position:c.position?{...c.position}:null,q:{...positions.get(c.id)}}]));
      const previousDirty=this.dirty;
      rememberChange();applyAutoLayout(proposal);
      // Let the browser paint the arrangement before asking for confirmation.
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        if(!confirm(`Automatische Tab-Anordnung übernehmen?\n\nFlächennutzung: ${overlay.querySelector('#auto-space-mode').value==='wide'?'Großflächig verteilen':'Enge Positionierung'}\nGruppen zuerst · Einzelkarten nach Typ · mindestens 12 px Abstand.\nPositionssperren bleiben gespeichert.\n\nAbbrechen stellt die vorherigen Positionen wieder her.`)){
          cards.forEach(({c})=>{
            const old=snapshot.get(c.id);if(!old)return;
            const wasLocked=isEditorLocked(c);
            if(wasLocked)c.position={...c.position,editorLocked:false};
            update(c,old.q,false);
            if(old.position===null)delete c.position;else c.position={...old.position};
          });
          this.dirty=previousDirty;undoHistory.pop();refreshHistory();
          if(active)choose(active.id);
        }else{
          autoLayoutUndo=snapshot;
          refreshHistory();
        }
      }));
    };
    const mobileSelectButton=overlay.querySelector('#position-mobile-select');
    mobileSelectButton?.addEventListener('click',()=>{
      mobileMultiSelect=!mobileMultiSelect;
      mobileSelectButton.setAttribute('aria-pressed',String(mobileMultiSelect));
      mobileSelectButton.textContent=mobileMultiSelect?'☑ Auswahl beenden':'☑ Karten auswählen';
    });
    overlay.querySelector('#position-mobile-select-all')?.addEventListener('click',()=>overlay.querySelector('#select-all-cards')?.click());
    overlay.querySelectorAll('[data-select-all-inline]').forEach(button=>button.addEventListener('click',()=>overlay.querySelector('#select-all-cards')?.click()));
    overlay.querySelector('#select-all-cards').onclick=()=>{cards.forEach(({c})=>{if(!selectedIds.has(c.id)){selectedIds.add(c.id);selectionOrder.push(c.id);}});syncSelection();};
    overlay.querySelector('#clear-multi').onclick=()=>{selectedIds.clear();selectionOrder=[];syncSelection();};
    const unlockAll=(key,label)=>{
      const count=cards.filter(({c})=>c.position?.[key]===true).length;
      if(!count){alert('Es sind keine '+label+' aktiv.');return;}
      if(!confirm(`${count} ${label} im aktuellen Tab aufheben? Positionen und Größen bleiben unverändert.`))return;
      rememberChange();cards.forEach(({c})=>{if(c.position?.[key]===true)c.position={...c.position,[key]:false};});
      this.dirty=true;if(active)choose(active.id);alert(`${count} ${label} aufgehoben. Bitte Layout speichern.`);
    };
    overlay.querySelector('#unlock-all-position').onclick=()=>unlockAll('manualPosition','Positionssperren');
    overlay.querySelector('#unlock-all-size').onclick=()=>unlockAll('manualSize','Größensperren');
    // Dashboard-wide unlock: include inactive rooms/tabs and every stored
    // device profile, not only the cards currently visible in this editor.
    const dashboardCards=()=>this.layout.flatMap(t=>(t.rooms||[]).flatMap(r=>r.cards||[]));
    const lockKeys=['manualPosition','manualSize','editorLocked'];
    const lockCounts=()=>{
      const result=Object.fromEntries(lockKeys.map(k=>[k,0]));
      for(const c of dashboardCards())for(const key of lockKeys){
        if(c.position?.[key]===true||Object.values(c.deviceLayouts||{}).some(p=>p?.[key]===true))result[key]++;
      }
      return result;
    };
    const refreshDashboardLocks=()=>{
      const n=lockCounts();
      overlay.querySelector('#dashboard-lock-count').textContent=`Aktive Sperren (Karten): ${n.manualPosition} Position · ${n.manualSize} Größe · ${n.editorLocked} Layout`;
    };
    const dashboardUnlock=keys=>{
      const n=lockCounts();const affected=keys.reduce((total,key)=>total+n[key],0);
      if(!affected){alert('Keine entsprechenden Sperren im Dashboard vorhanden.');return;}
      const labels=keys.map(k=>({manualPosition:'Positions',manualSize:'Größen',editorLocked:'Layout'}[k])).join(', ');
      if(!confirm(`${labels}-Sperren im gesamten Dashboard aufheben? Betroffen sind alle Tabs, Räume und Geräteprofile. Positionen, Größen und Gruppen bleiben unverändert. Änderungen anschließend speichern.`))return;
      // The local undo stack only covers the current room. Do not claim
      // dashboard-wide undo; preserve all layout values other than locks.
      rememberChange();
      for(const c of dashboardCards()){
        if(c.position)for(const key of keys)if(c.position[key]===true)c.position[key]=false;
        for(const p of Object.values(c.deviceLayouts||{}))if(p)for(const key of keys)if(p[key]===true)p[key]=false;
      }
      this.dirty=true;
      if(active)choose(active.id);
      refreshDashboardLocks();
      alert('Sperren aufgehoben. Bitte im Layout-Editor speichern.');
    };
    overlay.querySelector('#dashboard-unlock-position').onclick=()=>dashboardUnlock(['manualPosition']);
    overlay.querySelector('#dashboard-unlock-size').onclick=()=>dashboardUnlock(['manualSize']);
    overlay.querySelector('#dashboard-unlock-layout').onclick=()=>dashboardUnlock(['editorLocked']);
    overlay.querySelector('#dashboard-unlock-all').onclick=()=>dashboardUnlock(lockKeys);
    refreshDashboardLocks();

    select.onchange=()=>selectCard(select.value);
    overlay.querySelector('#protect-size').onchange=ev=>{if(!active||isEditorLocked(active)){choose(active?.id);return;}rememberChange();active.position={...(active.position||positions.get(active.id)),manualSize:ev.target.checked};this.dirty=true;};
    overlay.querySelector('#protect-position').onchange=ev=>{if(!active||isEditorLocked(active)){choose(active?.id);return;}rememberChange();active.position={...(active.position||positions.get(active.id)),manualPosition:ev.target.checked};this.dirty=true;};
    overlay.querySelector('#editor-lock').onchange=ev=>{if(!active)return;rememberChange();active.position={...(active.position||positions.get(active.id)),editorLocked:ev.target.checked};this.dirty=true;choose(active.id);};
    const idealSize=async all=>{
      const targets=cards.filter(({c})=>(all||selectedIds.has(c.id))&&!isEditorLocked(c));
      if(!targets.length){overlay.querySelector('#ideal-size-result').textContent='Keine entsperrten Karten ausgewählt.';return;}
      const buttons=['#ideal-size-selected','#ideal-size-all'].map(q=>overlay.querySelector(q));
      buttons.forEach(b=>b.disabled=true);
      const changes=[];let skipped=0;
      try{
        for(const {c} of targets){
          const old=positions.get(c.id);if(!old)continue;
          let natural=null;
          if(c.type==='custom'){
            // Generic Lovelace cards are responsive: preserve the current width,
            // measure the painted card at that width, then remove excess frame height.
            const tile=overlay.querySelector('.position-tile[data-id="'+c.id+'"]');
            const host=tile?.querySelector('.external-card-slot')?.firstElementChild;
            if(host){
              const surface=host.shadowRoot?.querySelector('ha-card')||host;
              const measured=Math.max(surface.scrollHeight||0,surface.offsetHeight||0,host.scrollHeight||0);
              if(measured>8){
                const scale=Number(tile.querySelector('.external-card-slot')?.dataset.fitScale)||1;
                natural={w:old.w,h:Math.ceil(measured*Math.min(1,scale))+4};
              }
            }
          }else if(this.externalVariant(c)){
            try{natural=await this.standardExternalSize(c);}catch(error){console.warn('Rotapfel: Größenmessung fehlgeschlagen',c.id,error);}
          }
          // The device width is the reference, not the old frame aspect ratio.
          // Native external cards are measured at their design width; their
          // height is scaled uniformly to prevent stretched typography.
          const kind=this.externalVariant(c);
          if(!natural?.w||!natural?.h){
            skipped++;
            if(kind==='equinox')natural={w:430,h:220};
            else if(kind==='climate_cluster')natural={w:850,h:460};
            else natural={w:Math.max(150,old.w),h:100};
          }
          const maxWidth=Math.max(76,width-24);
          const nativeW=Math.max(76,Number(natural.w)||old.w);
          const nativeH=Math.max(60,Number(natural.h)||old.h);
          const w=c.type==='custom'?old.w:Math.round(this.normalizedProfiles(this.deviceProfiles)[this._deviceLayoutProfile||'fire_hd']?.fixed===false?maxWidth:Math.min(maxWidth,nativeW));
          let h;
          if(kind||c.type==='custom'){
            // A uniform fit preserves the original aspect ratio and allows
            // a small breathing margin for fonts and late-rendered content.
            h=Math.ceil(nativeH*w/nativeW)+4;
            if(kind==='equinox')h=Math.max(100,Math.ceil(nativeH*w/nativeW)+4);
            // Measured content height takes precedence over old 540px fallback.
          }else{
            // Our own entity tiles use a responsive row. Their old frame
            // height is not a measurement of content height.
            const name=String(c.title||c.name||'');
            h=Math.max(86,Math.min(160,86+Math.floor(name.length/32)*22));
          }
          h=Math.max(70,Math.round(h));
          const q={...old,w,h,x:Math.max(0,Math.min(old.x,width-w)),y:old.y};
          if(q.w!==old.w||q.h!==old.h||q.x!==old.x||q.y!==old.y)changes.push({c,q});
        }
        if(!overlay.isConnected)return;
        if(changes.length){rememberChange();for(const {c,q} of changes)update(c,q);syncSelection();}
        overlay.querySelector('#ideal-size-result').textContent=`${changes.length} Karten angepasst · ${skipped} mit bestehender Größe als Messwert-Ersatz. Andere Geräteprofile bleiben unverändert.`;
      }finally{buttons.forEach(b=>b.disabled=false);}
    };
    overlay.querySelector('#ideal-size-selected').onclick=()=>idealSize(false);
    overlay.querySelector('#ideal-size-all').onclick=()=>idealSize(true);
    overlay.querySelector('#reset-native-size').onclick=async()=>{
      if(!active||isEditorLocked(active))return;
      const card=active;
      const before=positions.get(card.id);if(!before)return;
      const button=overlay.querySelector('#reset-native-size');
      button.disabled=true;
      try{
        const standard=await this.standardExternalSize(card);
        if(!standard){alert('Die Custom Card stellt keine zuverlässig ermittelbare Standardgröße bereit. Die Kartengröße bleibt unverändert.');return;}
        if(!overlay.isConnected)return;
        const w=Math.min(width,Math.max(76,Math.round(standard.w)));
        const h=Math.min(height,Math.max(60,Math.round(standard.h)));
        rememberChange();
        card.position={...(card.position||{}),manualSize:true};
        update(card,{x:before.x,y:before.y,w,h},false);
        card.position={...card.position,manualSize:true};
        overlay.querySelector('#protect-size').checked=true;
        choose(card.id);
      }finally{button.disabled=false;}
    };
    overlay.querySelector('#apply-pos').onclick=()=>{if(!active)return;const q={};for(const k of ['x','y','w','h'])q[k]=Number(overlay.querySelector('#pos-'+k).value);if(Object.values(q).some(v=>!Number.isFinite(v)))return;const old=positions.get(active.id);if(old&&q.w!==old.w&&q.h===old.h){const h=heightForWidth(active,old,q.w);if(h!==null)q.h=h;}rememberChange();update(active,q);};
    overlay.querySelectorAll('.position-tile').forEach(el=>{el.addEventListener('click',ev=>{if(mobileMultiSelect&&!positionTestActive&&!overlay.classList.contains('position-touch-drag')){ev.stopPropagation();selectCard(el.dataset.id,{ctrlKey:true});}});});
    overlay.querySelectorAll('.position-tile').forEach(el=>{let start=null;el.addEventListener('pointerdown',ev=>{if(positionTestActive||ev.target.closest('button'))return;if(ev.pointerType==='touch'&&window.matchMedia('(max-width:767px)').matches&&!overlay.classList.contains('position-touch-drag'))return;const c=cards.find(v=>v.c.id===el.dataset.id)?.c;if(!c)return;selectCard(c.id,ev);if(isEditorLocked(c)||(!ev.target.closest('[data-resize-axis]')&&groupMembers(c.id).some(isEditorLocked))){start=null;return;}start={px:ev.clientX,py:ev.clientY,q:{...positions.get(c.id)},c,historyCaptured:false,resizeAxis:ev.target.closest('[data-resize-axis]')?.dataset.resizeAxis||'',groupStart:new Map(groupMembers(c.id).map(member=>[member.id,{...positions.get(member.id)}])),pushBase:new Map([...positions].map(([id,v])=>[id,{...v}]))};el.setPointerCapture(ev.pointerId);ev.preventDefault();});el.addEventListener('pointermove',ev=>{if(!start)return;const dx=(ev.clientX-start.px)/workspaceScale,dy=(ev.clientY-start.py)/workspaceScale;if(Math.abs(dx)+Math.abs(dy)<4)return;if(!start.historyCaptured){rememberChange();start.historyCaptured=true;}let q={...start.q};if(start.resizeAxis){if(start.resizeAxis.includes('x'))q.w+=dx;if(start.resizeAxis.includes('y'))q.h+=dy;if(start.resizeAxis==='x'){const h=heightForWidth(start.c,start.q,q.w);if(h!==null)q.h=h;}}else{q.x+=dx;q.y+=dy;}const gridActive=overlay.querySelector('#snap').checked&&!ev.altKey;
        const magnetActive=overlay.querySelector('#magnet').checked&&!ev.altKey;
        // Apply grid first, then magnet alignment independently. The magnet
        // wins when a nearby card edge is within its acquisition threshold.
        const raw={...q};
        if(gridActive){
          if(start.resizeAxis){
            if(start.resizeAxis.includes('x'))q.w=snap(raw.w);
            if(start.resizeAxis.includes('y'))q.h=snap(raw.h);
          }else{q.x=snap(raw.x);q.y=snap(raw.y);}
        }
        const beforeMagnet={...q};
        // Magnetic edges are evaluated from the raw pointer position, so a
        // grid step cannot hide an edge that is actually within reach.
        const aligned=magnetize(start.c,{...raw},start.resizeAxis||'move',magnetActive);
        if(magnetActive){
          if(start.resizeAxis){
            if(start.resizeAxis.includes('x')&&aligned.w!==raw.w)q.w=aligned.w;
            if(start.resizeAxis.includes('y')&&aligned.h!==raw.h)q.h=aligned.h;
          }else{
            if(aligned.x!==raw.x)q.x=aligned.x;
            if(aligned.y!==raw.y)q.y=aligned.y;
          }
        }
        showMagnetFeedback(raw,aligned,q,magnetActive);
        // Optional push chain, calculated atomically. A locked card or canvas
        // boundary aborts the push, leaving the collision warning in place.
        if(!start.resizeAxis&&start.groupStart.size===1&&overlay.querySelector('#auto-push-cards').checked){
          const intended={...q,w:start.q.w,h:start.q.h};
          intended.x=clamp(Math.round(intended.x),0,width-intended.w);
          intended.y=Math.max(0,Math.round(intended.y));
          const fixed=!!this.normalizedProfiles(this.deviceProfiles)[this._deviceLayoutProfile||'fire_hd']?.fixed;
          const gap=fixedGap();
          const overlaps=(a,b)=>Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>1;
          const inside=v=>v.x>=0&&v.y>=0&&v.x+v.w<=width&&(!fixed||v.y+v.h<=height);
          // Recompute from the pointer-down layout on every move. This prevents
          // displaced cards from accumulating offsets or needing another drag.
          const base=start.pushBase||new Map([...positions].map(([id,v])=>[id,{...v}]));
          const next=new Map([...base].map(([id,v])=>[id,{...v}]));
          next.set(start.c.id,intended);
          const dx=intended.x-start.q.x,dy=intended.y-start.q.y;
          const preferred=Math.abs(dx)>=Math.abs(dy)?
            (dx<0?['left','right','down','up']:['right','left','down','up']):
            (dy<0?['up','down','right','left']:['down','up','right','left']);
          const candidates=(moving,blocker)=>{
            const list={
              left:{...blocker,x:moving.x-blocker.w-gap},
              right:{...blocker,x:moving.x+moving.w+gap},
              up:{...blocker,y:moving.y-blocker.h-gap},
              down:{...blocker,y:moving.y+moving.h+gap}
            };
            return preferred.map((dir,index)=>({q:list[dir],index,
              cost:Math.abs(list[dir].x-blocker.x)+Math.abs(list[dir].y-blocker.y)}))
              .filter(v=>inside(v.q)).sort((a,b)=>a.cost-b.cost||a.index-b.index);
          };
          const resolve=(layout,depth=0)=>{
            if(depth>cards.length*3)return null;
            // Only resolve intersections caused by this drag. Existing overlaps
            // between unrelated cards are intentional and must not block pushing.
            const activeIds=new Set([start.c.id]);
            for(const {c} of cards){
              if(c.id===start.c.id)continue;
              const original=base.get(c.id),now=layout.get(c.id);
              if(original.x!==now.x||original.y!==now.y)activeIds.add(c.id);
            }
            let pair=null;
            for(const {c} of cards){
              if(!activeIds.has(c.id))continue;
              for(const {c:other} of cards){
                if(c.id===other.id||!overlaps(layout.get(c.id),layout.get(other.id)))continue;
                if(c.id!==start.c.id&&other.id!==start.c.id&&overlaps(base.get(c.id),base.get(other.id)))continue;
                pair=[c,other];break;
              }
              if(pair)break;
            }
            if(!pair)return layout;
            const [a,b]=pair;
            // The dragged card is fixed. Only the obstructing card may move.
            const movable=[a,b].filter(c=>c.id!==start.c.id&&!isEditorLocked(c)&&!c.groupId);
            if(!movable.length)return null;
            for(const c of movable){
              const other=c.id===a.id?b:a;
              for(const choice of candidates(layout.get(other.id),layout.get(c.id))){
                const trial=new Map(layout);
                trial.set(c.id,choice.q);
                const signature=[...trial].map(([id,v])=>id+':'+v.x+','+v.y).join('|');
                if(visited.has(signature))continue;
                visited.add(signature);
                const solved=resolve(trial,depth+1);
                if(solved)return solved;
                if(visited.size>250)return null;
              }
            }
            return null;
          };
          const visited=new Set();
          const solved=resolve(next);
          if(solved){
            for(const {c:peer} of cards){
              if(peer.id===start.c.id)continue;
              const before=positions.get(peer.id),after=solved.get(peer.id);
              if(before.x!==after.x||before.y!==after.y)update(peer,after);
            }
          }
        }
        update(start.c,q);
        if(!start.resizeAxis&&start.groupStart.size>1){
          const moved=positions.get(start.c.id),deltaX=moved.x-start.q.x,deltaY=moved.y-start.q.y;
          // Constrain the shared displacement so every member remains on canvas.
          let minDx=-Infinity,maxDx=Infinity,minDy=-Infinity,maxDy=Infinity;
          for(const [id,original] of start.groupStart){minDx=Math.max(minDx,-original.x);maxDx=Math.min(maxDx,width-original.w-original.x);minDy=Math.max(minDy,-original.y);}
          const dx2=clamp(deltaX,minDx,maxDx),dy2=clamp(deltaY,minDy,maxDy);
          for(const [id,original] of start.groupStart){const member=cards.find(v=>v.c.id===id)?.c;if(member)update(member,{...original,x:original.x+dx2,y:original.y+dy2});}
        }
        });const finishResize=()=>{
          const finished=start;
          start=null;hideGuides();
          if(!finished?.resizeAxis||!finished.historyCaptured)return;
          // After the drag, measure the real card content once the browser has
          // completed layout. Do not resize other cards or alter the chosen width.
          requestAnimationFrame(()=>requestAnimationFrame(()=>{
            if(!overlay.isConnected)return;
            this.autoFitExternalFrames(tab,overlay,positions,update,true,finished.c.id);
            scheduleFit();
          }));
        };
        el.addEventListener('pointerup',finishResize);
        el.addEventListener('pointercancel',finishResize);});
    // Keyboard undo/redo is scoped to the open positioning editor. Never
    // intercept text-field undo, and remove the listener when the editor closes.
    const onPositionHistoryKey=ev=>{
      if(!overlay.isConnected){document.removeEventListener('keydown',onPositionHistoryKey,true);return;}
      if(!(ev.ctrlKey||ev.metaKey)||ev.altKey)return;
      const target=ev.target;
      if(target?.closest?.('input,textarea,select,[contenteditable], [role="textbox"]'))return;
      const key=ev.key.toLowerCase();
      const redo=(key==='z'&&ev.shiftKey)||(key==='y'&&!ev.shiftKey);
      const undo=key==='z'&&!ev.shiftKey;
      if(!redo&&!undo)return;
      ev.preventDefault();ev.stopPropagation();
      overlay.querySelector(redo?'#redo-position':'#undo-position')?.click();
    };
    document.addEventListener('keydown',onPositionHistoryKey,true);
    overlay.querySelector('#position-room').onchange=ev=>{
      const roomId=ev.target.value;
      this._activeRoomByTab={...(this._activeRoomByTab||{}),[tab.id]:roomId};
      overlay.querySelector('#close').click();
      this.openPositionEditor(tab);
    };
    overlay.querySelector('#close').onclick=()=>{this._positionDrawerAbort?.abort();this._positionDrawerAbort=null;document.removeEventListener('keydown',onPositionHistoryKey,true);positionObserver.disconnect();canvasResizeObserver.disconnect();overlay.remove();this.render();};choose(active?.id);
  }
  // Alpha 13.7.105: Kopien erhalten unabhängige IDs, Konfiguration und Profil-Layouts bleiben erhalten.
  cloneRoomForLayout(room){
    const copy=JSON.parse(JSON.stringify(room));
    copy.id=this.uid();
    copy.cards=(copy.cards||[]).map(card=>({...card,id:this.uid()}));
    return copy;
  }
  cloneTabForLayout(tab){
    const copy=JSON.parse(JSON.stringify(tab));
    copy.id=this.uid();
    copy.rooms=(tab.rooms||[]).map(room=>this.cloneRoomForLayout(room));
    return copy;
  }
  transferRoomDialog(sourceTab,room,change){
    const destinations=(this.layout||[]).filter(tab=>tab.id!==sourceTab.id);
    if(!destinations.length){alert('Bitte zuerst einen weiteren Tab anlegen.');return;}
    const dialog=document.createElement('dialog');
    dialog.style.cssText='border:1px solid #888;border-radius:14px;padding:22px;max-width:min(480px,92vw);width:100%;box-sizing:border-box;color:var(--primary-text-color,#222);background:var(--card-background-color,#fff)';
    dialog.innerHTML=`<form method="dialog" style="display:grid;gap:12px"><h3 style="margin:0">Raum kopieren oder verschieben</h3><p style="margin:0">${this.esc(room.name)} · ${this.esc(sourceTab.name)}</p><label>Aktion<select id="room-transfer-mode" style="width:100%;padding:9px"><option value="copy">Kopieren (Original behalten)</option><option value="move">Verschieben (Original entfernen)</option></select></label><label>Ziel-Tab<select id="room-transfer-target" style="width:100%;padding:9px">${destinations.map(tab=>`<option value="${this.esc(tab.id)}">${this.esc(tab.name)}</option>`).join('')}</select></label><p class="muted">Alle Karten, Einstellungen und Geräteprofil-Layouts werden übernommen. Kopien erhalten unabhängige IDs.</p><div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button type="button" class="secondary" id="room-transfer-cancel">Abbrechen</button><button type="submit" id="room-transfer-confirm">Kopieren</button></div></form>`;
    this.shadowRoot.append(dialog);
    dialog.querySelector('#room-transfer-cancel').onclick=()=>dialog.close();
    const mode=dialog.querySelector('#room-transfer-mode');
    mode.onchange=()=>dialog.querySelector('#room-transfer-confirm').textContent=mode.value==='move'?'Verschieben':'Kopieren';
    dialog.querySelector('form').onsubmit=ev=>{
      ev.preventDefault();
      const target=this.layout.find(tab=>tab.id===dialog.querySelector('#room-transfer-target').value);
      if(!target)return;
      target.rooms=target.rooms||[];
      const next=mode.value==='copy'?this.cloneRoomForLayout(room):room;
      if(mode.value==='move'){
        sourceTab.rooms=sourceTab.rooms.filter(r=>r.id!==room.id);
        if(this._activeRoomByTab?.[sourceTab.id]===room.id)this._activeRoomByTab[sourceTab.id]=sourceTab.rooms[0]?.id;
      }
      target.rooms.push(next);
      this._activeRoomByTab={...(this._activeRoomByTab||{}),[target.id]:next.id};
      this.tabId=target.id;
      dialog.close();change();
    };
    dialog.addEventListener('close',()=>dialog.remove(),{once:true});
    dialog.showModal();
  }
  bindEditor(){const root=this.shadowRoot,change=()=>{this.dirty=true;this.render();},ask=(title,value='')=>{const v=prompt(title,value);return v===null?null:v.trim().slice(0,80);};
    root.querySelector('#back').onclick=()=>this.closeLayoutEditor();
    root.querySelector('#save-layout').onclick=()=>this.saveLayout();

    root.querySelector('#canvas-settings').onclick=()=>this.canvasDialog();
    root.querySelector('#theme-select').onchange=ev=>{this.theme=ev.target.value;change();};
    root.querySelector('#device-layout-profile').onchange=ev=>this.switchDeviceLayoutProfile(ev.target.value);root.querySelector('#show-mobile-layout-selector').onchange=ev=>{this.canvas.show_mobile_layout_selector=ev.target.checked;change();};
    root.querySelector('#manage-device-profiles').onclick=()=>this.manageDeviceProfiles();root.querySelector('#manage-layout-templates').onclick=()=>this.manageLayoutTemplates();
    root.querySelector('#add-tab').onclick=()=>{const name=ask('Name des neuen Tabs');if(!name)return;const t={id:this.uid(),name,rooms:[]};this.layout.push(t);this.tabId=t.id;change();};
    root.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{this.tabId=b.dataset.tab;this.render();});
    const t=this.layout.find(x=>x.id===this.tabId);if(!t)return;
    root.querySelector('#tab-canvas').onclick=()=>this.canvasDialog(t);
    root.querySelector('#position-editor').onclick=()=>this.openPositionEditor(t);
    
    root.querySelector('#active-room-preview')?.addEventListener('change',ev=>{
      this._activeRoomByTab={...(this._activeRoomByTab||{}),[t.id]:ev.target.value};this.render();
    });
    root.querySelectorAll('.room-collapsible').forEach(section=>section.addEventListener('toggle',()=>{
      if(!section.open)return;
      const rid=section.dataset.room;
      this._activeRoomByTab={...(this._activeRoomByTab||{}),[t.id]:rid};
      // Switch preview without rebuilding the expanded editor or losing focus.
      const picker=root.querySelector('#active-room-preview');if(picker&&picker.value!==rid){picker.value=rid;this.render();}
    }));
    this.bindPreviewZoom();
    root.querySelector('#duplicate-tab').onclick=()=>{const copy=this.cloneTabForLayout(t);copy.name=t.name+' (Kopie)';this.layout.splice(this.layout.indexOf(t)+1,0,copy);this.tabId=copy.id;this._activeRoomByTab={...(this._activeRoomByTab||{}),[copy.id]:copy.rooms[0]?.id};change();};
    root.querySelector('#rename-tab').onclick=()=>{const name=ask('Tab umbenennen',t.name);if(name){t.name=name;change();}};
    root.querySelector('#remove-tab').onclick=()=>{if(!confirm(`Tab „${t.name}“ samt Räumen entfernen?`))return;this.layout=this.layout.filter(x=>x!==t);this.tabId=this.layout[0]?.id;change();};
    root.querySelector('#add-room').onclick=()=>{const name=ask('Name des Raums');if(name){const r={id:this.uid(),name,cards:[]};t.rooms.push(r);this._activeRoomByTab={...(this._activeRoomByTab||{}),[t.id]:r.id};change();}};
    root.querySelectorAll('[data-room-action]').forEach(b=>b.onclick=()=>{const r=t.rooms.find(x=>x.id===b.closest('[data-room]').dataset.room),a=b.dataset.roomAction;if(a==='rename'){const name=ask('Raum umbenennen',r.name);if(name){r.name=name;change();}}else if(a==='duplicate'){const copy=JSON.parse(JSON.stringify(r));copy.id=this.uid();copy.name=r.name+' (Kopie)';copy.cards=(copy.cards||[]).map(c=>{c.id=this.uid();return c;});t.rooms.splice(t.rooms.indexOf(r)+1,0,copy);this._activeRoomByTab={...(this._activeRoomByTab||{}),[t.id]:copy.id};change();}else if(a==='transfer'){this.transferRoomDialog(t,r,change);}else if(a==='remove'){if(confirm(`Raum „${r.name}“ entfernen?`)){t.rooms=t.rooms.filter(x=>x!==r);if(this._activeRoomByTab?.[t.id]===r.id)this._activeRoomByTab[t.id]=t.rooms[0]?.id;change();}}else if(a==='paste'){if(!this._cardClipboard)return;const c=JSON.parse(JSON.stringify(this._cardClipboard));c.id=this.uid();r.cards.push(c);this._selectedCards={...(this._selectedCards||{}),[r.id]:c.id};this._activeRoomByTab={...(this._activeRoomByTab||{}),[t.id]:r.id};change();}else if(a==='add-type'){this.openCardTypePicker(r,change);}else if(a==='library'){this.openCardLibrary(r,change);}});
    root.querySelectorAll('.room-sort').forEach(sel=>sel.onchange=()=>{const id=sel.closest('[data-room]').dataset.room;this._roomSort={...(this._roomSort||{}),[id]:sel.value};this.render();});
    root.querySelectorAll('.room-card-item').forEach(el=>{const choose=()=>{const rid=el.closest('[data-room]').dataset.room;this._selectedCards={...(this._selectedCards||{}),[rid]:el.dataset.card};this.render();};el.addEventListener('click',ev=>{if(ev.target.closest('[data-toggle]'))return;choose();});el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();choose();}});});
    root.querySelectorAll('[data-side-action]').forEach(b=>b.onclick=()=>{const room=b.closest('[data-room]'),r=t.rooms.find(x=>x.id===room.dataset.room),c=r.cards.find(x=>x.id===(this._selectedCards?.[r.id]||r.cards[0]?.id));if(!c)return;const a=b.dataset.sideAction;
      if(a==='design')this.editDesign(c,change);
      else if(a==='position')this.openPositionEditor(t);
      else if(a==='custom')this.configureCustomCard(c,change);
      else if(a==='thermostat')this.configureThermostat(c,change);
      else if(a==='rename'){const title=ask('Kartentitel',c.title);if(title){c.title=title;change();}}
      else if(a==='entity')this.pickEntity(c.entity_id,eid=>{c.entity_id=eid;change();});
      else if(a==='transfer'){this.openCardTransferDialog(t,r,c);}
      else if(a==='save-library'){this.saveCardToLibrary(c);}
      else if(a==='copy'){this._cardClipboard=JSON.parse(JSON.stringify(c));this.render();}
      else if(a==='duplicate'){const copy=JSON.parse(JSON.stringify(c));copy.id=this.uid();delete copy.groupId;copy.title=(c.title||'Karte')+' (Kopie)';delete copy.position;delete copy.deviceLayouts;this.placeNewCard(r,copy);r.cards.splice(r.cards.indexOf(c)+1,0,copy);this._selectedCards={...(this._selectedCards||{}),[r.id]:copy.id};change();}else if(a==='remove'){if(confirm(`Karte „${c.title}“ entfernen?`)){r.cards=r.cards.filter(x=>x!==c);this._selectedCards={...(this._selectedCards||{}),[r.id]:r.cards[0]?.id};change();}}
      else if(a==='left'||a==='right'){const i=r.cards.indexOf(c),j=i+(a==='left'?-1:1);if(j>=0&&j<r.cards.length){r.cards.splice(i,1);r.cards.splice(j,0,c);change();}}
    });
  }
  libraryCardData(card){
    const result=JSON.parse(JSON.stringify(card));
    delete result.id;
    delete result.groupId;
    delete result.position;
    delete result.deviceLayouts;
    return result;
  }
  async saveCardToLibrary(card){
    const name=window.prompt('Name für die Kartenvorlage',card.title||'Meine Karte');
    if(!name?.trim())return;
    try{
      const response=await this.api('card_library');
      const cards=Array.isArray(response.cards)?response.cards:[];
      if(cards.some(item=>item.name.toLowerCase()===name.trim().toLowerCase())){
        window.alert('Eine Vorlage mit diesem Namen existiert bereits. Bitte einen anderen Namen wählen.');
        return;
      }
      cards.push({id:this.uid(),name:name.trim(),card:this.libraryCardData(card)});
      await this.api('save_card_library',{cards});
      window.alert('Kartenvorlage gespeichert. Sie ist in allen Dashboards verfügbar.');
    }catch(err){window.alert('Kartenbibliothek konnte nicht gespeichert werden: '+String(err?.message||err));}
  }
  async openCardLibrary(room,change){
    let cards;
    try{cards=(await this.api('card_library')).cards||[];}
    catch(err){window.alert('Kartenbibliothek konnte nicht geladen werden: '+String(err?.message||err));return;}
    this.shadowRoot.querySelector('#rotapfel-card-library-dialog')?.remove();
    const dialog=document.createElement('dialog');
    dialog.id='rotapfel-card-library-dialog';
    dialog.style.cssText='width:min(840px,96vw);max-width:96vw;max-height:88vh;overflow:auto;border:1px solid var(--divider-color,#999);border-radius:14px;padding:20px;box-sizing:border-box;background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);box-shadow:0 12px 50px #0005';
    dialog.innerHTML='<h2 style="margin:0 0 10px">Rotapfel Kartenbibliothek</h2>'
      +'<p class="muted">Vorlagen durchsuchen, bearbeiten und in den aktuellen Raum einfügen. Bereits eingefügte Karten bleiben bei Änderungen an Vorlagen unverändert.</p>'
      +'<input id="rl-search" type="search" placeholder="Kartenname, Kartentyp oder Entität suchen …" style="width:100%;box-sizing:border-box;padding:10px;margin:8px 0 16px">'
      +'<div id="rl-list" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;max-height:55vh;overflow:auto"></div>'
      +'<div style="display:flex;justify-content:flex-end;margin-top:18px"><button type="button" id="rl-close" class="secondary">Schließen</button></div>';
    this.shadowRoot.append(dialog);
    dialog.addEventListener('close',()=>dialog.remove(),{once:true});
    dialog.querySelector('#rl-close').onclick=()=>dialog.close();
    const list=dialog.querySelector('#rl-list'),search=dialog.querySelector('#rl-search');
    const describe=card=>{
      const cfg=card.custom_config||{};
      const entity=cfg.entity||card.entity_id||cfg.entities?.[0]?.entity||cfg.entities?.[0]||'';
      const type=cfg.type||card.variant||card.type||'Karte';
      return {entity:String(entity),type:String(type)};
    };
    const persist=async(next)=>{
      await this.api('save_card_library',{cards:next});
      cards=next;
      draw();
    };
    const draw=()=>{
      const query=search.value.toLocaleLowerCase('de').trim();
      const visible=cards.map((item,index)=>({item,index,...describe(item.card)}))
        .filter(x=>[x.item.name,x.type,x.entity].some(value=>String(value).toLocaleLowerCase('de').includes(query)));
      list.innerHTML=visible.length?visible.map(x=>'<section data-rl-index="'+x.index+'" style="border:1px solid var(--divider-color,#9996);border-radius:12px;padding:14px;min-width:0;display:grid;gap:9px">'
        +'<strong style="overflow-wrap:anywhere">'+this.esc(x.item.name)+'</strong>'
        +'<div class="muted" style="font-size:12px;overflow-wrap:anywhere">'+this.esc(x.type)+'</div>'
        +'<div style="font-size:12px;overflow-wrap:anywhere">'+this.esc(x.entity||'Ohne direkte Entität')+'</div>'
        +'<div style="display:flex;gap:5px;flex-wrap:wrap"><button type="button" data-rl-action="insert">Einfügen</button><button type="button" class="secondary" data-rl-action="rename">Umbenennen</button><button type="button" class="secondary" data-rl-action="edit">Bearbeiten</button><button type="button" class="secondary" data-rl-action="delete">Löschen</button></div></section>').join('')
        :'<p class="muted">'+(cards.length?'Keine passenden Vorlagen.':'Noch keine Kartenvorlagen gespeichert.')+'</p>';
      list.querySelectorAll('[data-rl-action]').forEach(button=>button.onclick=async()=>{
        const index=Number(button.closest('[data-rl-index]').dataset.rlIndex);
        const item=cards[index];if(!item)return;
        const action=button.dataset.rlAction;
        if(action==='insert'){
          const card=JSON.parse(JSON.stringify(item.card));
          card.id=this.uid();delete card.groupId;delete card.position;delete card.deviceLayouts;
          this.placeNewCard(room,card);room.cards.push(card);
          this._selectedCards={...(this._selectedCards||{}),[room.id]:card.id};
          dialog.close();change();
        }else if(action==='rename'){
          const name=window.prompt('Neuer Name der Kartenvorlage',item.name);
          if(!name?.trim())return;
          if(cards.some((other,i)=>i!==index&&other.name.toLocaleLowerCase('de')===name.trim().toLocaleLowerCase('de'))){window.alert('Der Name ist bereits vergeben.');return;}
          const next=JSON.parse(JSON.stringify(cards));next[index].name=name.trim();
          try{await persist(next);}catch(err){window.alert('Umbenennen fehlgeschlagen: '+String(err));}
        }else if(action==='delete'){
          if(!window.confirm('Kartenvorlage „'+item.name+'“ wirklich löschen? Bereits eingefügte Karten bleiben bestehen.'))return;
          try{await persist(cards.filter((_entry,i)=>i!==index));}catch(err){window.alert('Löschen fehlgeschlagen: '+String(err));}
        }else if(action==='edit'){
          const draft=JSON.parse(JSON.stringify(item.card));
          dialog.close();
          const saveDraft=async()=>{
            const next=JSON.parse(JSON.stringify(cards));
            const position=next.findIndex(entry=>entry.id===item.id);
            if(position<0)return;
            next[position].card=this.libraryCardData(draft);
            try{await this.api('save_card_library',{cards:next});}
            catch(err){window.alert('Vorlage konnte nicht gespeichert werden: '+String(err));return;}
            this.openCardLibrary(room,change);
          };
          if(draft.type==='custom'||draft.custom_config)this.configureCustomCard(draft,saveDraft);
          else{
            const title=window.prompt('Kartentitel bearbeiten',draft.title||item.name);
            if(title===null){this.openCardLibrary(room,change);return;}
            draft.title=title.trim()||draft.title;
            saveDraft();
          }
        }
      });
    };
    search.addEventListener('input',draw);
    draw();dialog.showModal();
  }
  openCardTransferDialog(sourceTab,sourceRoom,sourceCard){
    const esc=v=>this.esc(String(v??''));
    const dialog=document.createElement('dialog');
    dialog.style.cssText='border:1px solid var(--divider-color,#999);border-radius:14px;padding:22px;width:min(500px,94vw);max-width:94vw;color:var(--primary-text-color,#222);background:var(--card-background-color,#fff);box-shadow:0 12px 50px #0005';
    dialog.innerHTML=`<form method="dialog" style="display:grid;gap:12px"><h3 style="margin:0">Karte verschieben oder kopieren</h3><p style="margin:0">${esc(sourceCard.title||'Karte')} · ${esc(sourceTab.name)} / ${esc(sourceRoom.name)}</p><label>Aktion<select id="transfer-mode" style="width:100%;padding:9px"><option value="copy">Kopieren (Original behalten)</option><option value="move">Verschieben (Original entfernen)</option></select></label><label>Ziel-Tab<select id="transfer-tab" style="width:100%;padding:9px"></select></label><label>Ziel-Raum<select id="transfer-room" style="width:100%;padding:9px"></select></label><p class="muted" style="margin:0">Kartenkonfiguration und Positionen sämtlicher Geräteprofile werden übernommen. Bei Überlagerungen kannst du die Karte anschließend im Positionierungseditor verschieben.</p><p id="transfer-error" style="color:var(--error-color,#c33);margin:0"></p><div style="display:flex;justify-content:flex-end;gap:8px"><button type="button" id="transfer-cancel" class="secondary">Abbrechen</button><button type="submit" id="transfer-apply">Kopieren</button></div></form>`;
    this.shadowRoot.append(dialog);
    const tabSelect=dialog.querySelector('#transfer-tab'),roomSelect=dialog.querySelector('#transfer-room'),mode=dialog.querySelector('#transfer-mode');
    tabSelect.innerHTML=(this.layout||[]).map(t=>`<option value="${esc(t.id)}" ${t.id===sourceTab.id?'selected':''}>${esc(t.name)}</option>`).join('');
    const updateRooms=()=>{const tab=this.layout.find(t=>t.id===tabSelect.value);roomSelect.innerHTML=(tab?.rooms||[]).map(r=>`<option value="${esc(r.id)}" ${r.id===sourceRoom.id?'selected':''}>${esc(r.name)}</option>`).join('');dialog.querySelector('#transfer-apply').disabled=!roomSelect.options.length;};
    tabSelect.onchange=updateRooms;mode.onchange=()=>dialog.querySelector('#transfer-apply').textContent=mode.value==='copy'?'Kopieren':'Verschieben';
    dialog.querySelector('#transfer-cancel').onclick=()=>dialog.close();
    dialog.addEventListener('close',()=>dialog.remove(),{once:true});
    dialog.querySelector('form').onsubmit=ev=>{
      ev.preventDefault();const targetTab=this.layout.find(t=>t.id===tabSelect.value),targetRoom=targetTab?.rooms?.find(r=>r.id===roomSelect.value);
      if(!targetRoom){dialog.querySelector('#transfer-error').textContent='Bitte einen Zielraum auswählen.';return;}
      if(mode.value==='move'&&targetRoom===sourceRoom){dialog.querySelector('#transfer-error').textContent='Die Karte befindet sich bereits in diesem Raum.';return;}
      const card=mode.value==='copy'?JSON.parse(JSON.stringify(sourceCard)):sourceCard;
      if(mode.value==='copy'){card.id=this.uid();delete card.groupId;card.title=(card.title||'Karte')+' (Kopie)';}
      if(mode.value==='move')sourceRoom.cards.splice(sourceRoom.cards.indexOf(sourceCard),1);
      targetRoom.cards=targetRoom.cards||[];targetRoom.cards.push(card);
      this._selectedCards={...(this._selectedCards||{}),[targetRoom.id]:card.id,[sourceRoom.id]:mode.value==='move'?sourceRoom.cards[0]?.id:this._selectedCards?.[sourceRoom.id]};
      this._activeRoomByTab={...(this._activeRoomByTab||{}),[targetTab.id]:targetRoom.id};
      this.tabId=targetTab.id;this.dirty=true;dialog.close();this.render();
    };
    updateRooms();dialog.showModal();
  }
  openCardTypePicker(room,change){
    const overlay=document.createElement('div');overlay.className='card-type-overlay';overlay.style.cssText='position:fixed;inset:0;background:#0009;z-index:9999;display:grid;place-items:center;padding:16px';
    const catalog=[
      ['nexus','Rotapfel – automatische Entitätskarte','Rotapfel','Erkennt den Entitätstyp automatisch.'],
      ['light','Rotapfel – Licht','Licht & Schalter','Für Licht-Entitäten.'],
      ['switch','Rotapfel – Schalter','Licht & Schalter','Für Schalter und input_boolean.'],
      ['sensor','Rotapfel – Sensor','Sensoren & Kontakte','Zeigt Sensorwerte an.'],
      ['window','Rotapfel – Fenster / Tür','Sensoren & Kontakte','Für binäre Fenster- und Türkontakte.'],
      ['equinox','Equinox – Original Custom Card','Heizung','Benötigt die Equinox-Ressource.'],
      ['climate_cluster','Climate Cluster – Original Custom Card','Heizung','Benötigt die Climate-Cluster-Ressource.'],
      ['rotapfel_simple_thermcard','Rotapfel Simple ThermCard','Heizung','Benötigt die ThermCard-Ressource.'],
      ['rotapfel_climate','Rotapfel Standard – Thermostatsteuerung','Heizung','Interne Thermostatkarte.'],
      ['placeholder','Freie Platzhalterkarte','Sonstige','Karte ohne Entität.'],
      ['custom','Eigene Custom Card','Sonstige','Eigener Custom-Card-Typ.']
    ];
    const favKey='rotapfel-card-favorites-v1';
    let favorites=[];try{const saved=JSON.parse(localStorage.getItem(favKey)||'[]');if(Array.isArray(saved))favorites=saved.filter(v=>catalog.some(x=>x[0]===v));}catch(_e){}
    const esc=v=>this.esc(v);
    overlay.innerHTML=`<div style="background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);padding:22px;border-radius:14px;width:min(640px,96vw);max-height:90vh;overflow:auto"><h2>Kartenbibliothek</h2><p class="muted">Vorhandene Kartentypen suchen, filtern und als Favoriten markieren.</p><label>Suche<input id="card-search" type="search" placeholder="Name oder Kartentyp" autocomplete="off"></label><label>Kategorie<select id="card-category"><option value="">Alle Kategorien</option><option value="Favoriten">★ Favoriten</option>${[...new Set(catalog.map(x=>x[2]))].map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label><div id="card-catalog" style="display:grid;gap:7px;max-height:42vh;overflow-y:auto;margin:12px 0"></div><p id="type-help" class="muted"></p><div class="actions"><button id="type-add">Karte hinzufügen</button><button class="secondary" id="type-cancel">Abbrechen</button></div></div>`;
    this.shadowRoot.appendChild(overlay);
    const search=overlay.querySelector('#card-search'),category=overlay.querySelector('#card-category'),list=overlay.querySelector('#card-catalog'),help=overlay.querySelector('#type-help');
    let selected=catalog[0][0];
    const draw=()=>{
      const q=search.value.toLocaleLowerCase('de').trim(),cat=category.value;
      const visible=catalog.filter(x=>(!cat||(cat==='Favoriten'?favorites.includes(x[0]):x[2]===cat))&&(!q||x.slice(1).join(' ').toLocaleLowerCase('de').includes(q)));
      if(!visible.some(x=>x[0]===selected)&&visible.length)selected=visible[0][0];
      list.innerHTML=visible.length?visible.map(x=>`<div style="display:flex;align-items:stretch;gap:6px"><button type="button" data-card-choice="${esc(x[0])}" class="${selected===x[0]?'':'secondary'}" style="flex:1;text-align:left;white-space:normal;padding:10px"><strong>${esc(x[1])}</strong><br><small>${esc(x[2])} · ${esc(x[3])}</small></button><button type="button" class="secondary" data-card-fav="${esc(x[0])}" aria-label="${favorites.includes(x[0])?'Favorit entfernen':'Als Favorit markieren'}" title="Favorit" style="min-width:44px">${favorites.includes(x[0])?'★':'☆'}</button></div>`).join(''):'<p class="muted">Keine passenden Kartentypen gefunden.</p>';
      list.querySelectorAll('[data-card-choice]').forEach(btn=>btn.onclick=()=>{selected=btn.dataset.cardChoice;draw();});
      list.querySelectorAll('[data-card-fav]').forEach(btn=>btn.onclick=()=>{const id=btn.dataset.cardFav;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];try{localStorage.setItem(favKey,JSON.stringify(favorites));}catch(_e){}draw();});
      help.textContent=visible.length?(catalog.find(x=>x[0]===selected)?.[3]||''):'';
      overlay.querySelector('#type-add').disabled=!visible.length;
    };
    search.oninput=draw;category.onchange=draw;draw();
    overlay.querySelector('#type-cancel').onclick=()=>overlay.remove();
    overlay.querySelector('#type-add').onclick=()=>{
      const choice=selected;overlay.remove();
      if(choice==='placeholder'){
        const title=prompt('Titel der Platzhalterkarte','Neue Karte');if(title?.trim()){const c={id:this.uid(),type:'placeholder',title:title.trim().slice(0,80)};this.placeNewCard(room,c);room.cards.push(c);this._selectedCards={...(this._selectedCards||{}),[room.id]:c.id};change();}return;
      }
      if(choice==='custom'){
        const c={id:this.uid(),type:'custom',title:'Neue Custom Card',custom:{card_type:'',configuration:''}};
        this.configureCustomCard(c,()=>{this.placeNewCard(room,c);room.cards.push(c);this._selectedCards={...(this._selectedCards||{}),[room.id]:c.id};change();},true);return;
      }
      const domains={light:['light'],switch:['switch','input_boolean'],sensor:['sensor'],window:['binary_sensor'],equinox:['climate'],climate_cluster:['climate'],rotapfel_simple_thermcard:['climate'],rotapfel_climate:['climate']};
      this.pickEntity(null,eid=>{
        if(domains[choice]&&!domains[choice].includes(eid.split('.')[0])){alert('Bitte eine passende Entität auswählen: '+domains[choice].join(', '));return;}
        const c={id:this.uid(),type:'entity',entity_id:eid,title:this._hass.states[eid]?.attributes?.friendly_name||eid};
        if(['equinox','climate_cluster','rotapfel_simple_thermcard','rotapfel_climate'].includes(choice))c.variant=choice;else if(choice!=='nexus')c.variant='nexus-'+choice;
        if(choice==='equinox'&&eid==='climate.wohn_esszimmer_vtherm_wz_ez')c.external_options={power_entity:'sensor.wohn_esszimmer_vtherm_wz_ez_energie',humidity_entity:'sensor.tempsensor_wz_ez_humidity',temperature_entity:'sensor.tempsensor_wz_ez_temperature'};
        this.placeNewCard(room,c);room.cards.push(c);this._selectedCards={...(this._selectedCards||{}),[room.id]:c.id};change();
        if(choice==='rotapfel_simple_thermcard')this.configureThermostat(c,change);
      });
    };
  }
  configureCustomCard(c,change,isNew=false){
    const overlay=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;background:#0009;z-index:9999;display:grid;place-items:center;padding:16px';
    const esc=v=>this.esc(v);
    const stored=c.custom_config&&typeof c.custom_config==='object'?c.custom_config:null;
    const legacy=c.custom||{};
    const initialType=stored?.type||legacy.card_type||'';
    const catalog=this._customCardCatalog||[];
    const knownTypes=[...new Set([...catalog,initialType].filter(Boolean))].sort((a,b)=>a.localeCompare(b,'de'));
    const typeOptions=knownTypes.map(type=>`<option value="${esc(type)}">${esc(type.replace(/^custom:/,'').replace(/-/g,' '))}</option>`).join('');
    const initialText=stored?JSON.stringify(stored,null,2):legacy.configuration||'{}';
    overlay.innerHTML=`<div style="background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);padding:22px;border-radius:14px;width:min(620px,96vw);max-height:90vh;overflow:auto"><h2>Eigene Custom Card</h2><p class="muted">Kartentyp auswählen, um eine YAML-Vorlage einzufügen, oder eine vollständige YAML-/JSON-Konfiguration übernehmen. Beispiel-Entitäten bitte durch vorhandene Entitäten ersetzen.</p><label>Titel<input id="custom-title" value="${esc(c.title)}" maxlength="80"></label><label>Installierte Custom Cards<select id="custom-type-select" style="width:100%"><option value="">Kartentyp auswählen …</option>${typeOptions}<option value="__manual__">Anderen Kartentyp manuell eingeben …</option></select></label><p id="custom-marketplace-status" class="muted" style="font-size:12px;margin:6px 0">Kartenabgleich läuft automatisch im Hintergrund.</p><label>Home-Assistant-Entität <button class="secondary" type="button" id="custom-pick-entity">Entität auswählen …</button> <span id="custom-entity-label" class="muted"></span></label><label>Custom-Card-Typ<input id="custom-type" value="${esc(initialType)}" placeholder="custom:..."></label><div id="custom-quick-fields" style="border:1px solid var(--divider-color,#9995);border-radius:10px;padding:12px;margin:10px 0"><strong>Schnelleinstellungen</strong><p class="muted" style="font-size:12px;margin:6px 0">Nur für unterstützte Kartentypen. YAML bleibt frei bearbeitbar.</p><label>Anzeigename<input id="custom-quick-name" placeholder="Kartenname"></label><label>Icon (mdi:...)<input id="custom-quick-icon" placeholder="mdi:home"></label><label>Iconfarbe<select id="custom-quick-color"><option value="">Nicht festlegen</option><option value="blue">Blau</option><option value="green">Grün</option><option value="red">Rot</option><option value="orange">Orange</option><option value="purple">Violett</option></select></label></div><label>Konfiguration (YAML oder JSON, mit oder ohne type)<textarea id="custom-config" rows="11" style="width:100%;box-sizing:border-box;font-family:monospace">${esc(initialText)}</textarea></label><p id="custom-error" style="color:var(--error-color,#c33)" role="alert"></p><div class="actions"><button id="custom-save">Übernehmen</button><button class="secondary" id="custom-cancel">Abbrechen</button></div></div>`;
    this.shadowRoot.appendChild(overlay);
    const select=overlay.querySelector('#custom-type-select'),typeInput=overlay.querySelector('#custom-type');
    if(knownTypes.includes(initialType))select.value=initialType;
    else if(initialType)select.value='__manual__';
    const configInput=overlay.querySelector('#custom-config');
    const entityLabel=overlay.querySelector('#custom-entity-label');
    const cardTemplate=type=>{
      const templates={
        'custom:mushroom-entity-card':['entity: light.example','name: Meine Karte'],
        'custom:mushroom-template-card':['primary: Meine Karte','secondary: Status','icon: mdi:home'],
        'custom:mushroom-light-card':['entity: light.example','name: Beleuchtung'],
        'custom:mushroom-climate-card':['entity: climate.example','name: Heizung'],
        'custom:mushroom-cover-card':['entity: cover.example','name: Rollladen'],
        'custom:mushroom-person-card':['entity: person.example'],
        'custom:mushroom-title-card':['title: Meine Überschrift'],
        'custom:mushroom-chips-card':['chips:','  - type: entity','    entity: light.example'],
        'custom:mushroom-lock-card':['entity: lock.example'],
        'custom:button-card':['entity: light.example','name: Meine Karte'],
        'custom:mini-graph-card':['entities:','  - sensor.example','name: Verlauf'],
        'custom:apexcharts-card':['header:','  show: true','  title: Verlauf','series:','  - entity: sensor.example'],
        'custom:climate-cluster-card':['entity: climate.example','name: Heizung'],
        'custom:equinox-card':['entity: climate.example']
      };
      return ['type: '+type,...(templates[type]||[])].join('\n');
    };
    let generatedTemplate='';
    let templateManaged=!stored&&!String(legacy.configuration||'').trim();
    const applyTypeTemplate=type=>{
      if(!type||type==='__manual__')return;
      const existing=configInput.value.trim();
      if(!templateManaged&&existing&&existing!=='{}')return;
      const selectedEntity=entityLabel?.textContent?.trim()||'';
      generatedTemplate=cardTemplate(type);
      if(selectedEntity&&/^(?:type:.*\\n)?entity:/m.test(generatedTemplate))
        generatedTemplate=generatedTemplate.replace(/^entity:.*$/m,'entity: '+selectedEntity);
      configInput.value=generatedTemplate;
      templateManaged=true;
    };
    select.onchange=()=>{
      if(select.value&&select.value!=='__manual__'){
        typeInput.value=select.value;
        applyTypeTemplate(select.value);
      }
      typeInput.readOnly=select.value!=='__manual__'&&select.value!=='';
    };
    select.dispatchEvent(new Event('change'));
    const fillTypes=types=>{
      const current=typeInput.value.trim();
      select.innerHTML='<option value="">Kartentyp auswählen …</option>'+[...new Set([...types,current].filter(Boolean))].sort((a,b)=>a.localeCompare(b,'de')).map(type=>`<option value="${esc(type)}">${esc(type.replace(/^custom:/,'').replace(/-/g,' '))}</option>`).join('')+'<option value="__manual__">Anderen Kartentyp manuell eingeben …</option>';
      select.value=current&&[...select.options].some(o=>o.value===current)?current:'__manual__';
      select.dispatchEvent(new Event('change'));
    };
    const detectType=()=>{
      const source=configInput.value;
      // YAML and JSON are both accepted; read the type scalar without changing
      // the user's input or requiring an asynchronous request on every keystroke.
      let detected='';
      try{const obj=JSON.parse(source);if(obj&&typeof obj.type==='string')detected=obj.type.trim();}catch(_e){
        const match=source.match(/^\\s*type\\s*:\\s*['"]?(custom:[a-z0-9_-]+)['"]?\\s*(?:#.*)?$/im);
        if(match)detected=match[1];
      }
      if(!detected)return;
      typeInput.value=detected;
      const option=[...select.options].find(o=>o.value===detected);
      if(option)select.value=detected;
      else{select.value='__manual__';typeInput.readOnly=false;}
    };
    configInput.addEventListener('input',()=>{generatedTemplate='';templateManaged=false;detectType();});
    const getConfiguredEntity=()=>{
      try{const obj=JSON.parse(configInput.value);if(typeof obj?.entity==='string')return obj.entity;}catch(_e){}
      return configInput.value.match(/^entity:\s*['"]?([a-z_]+\.[a-z0-9_]+)['"]?\s*$/m)?.[1]||'';
    };
    entityLabel.textContent=getConfiguredEntity();
    overlay.querySelector('#custom-pick-entity').onclick=()=>{
      this.pickEntity(getConfiguredEntity(),entity=>{
        const type=typeInput.value.trim();
        if(!type){overlay.querySelector('#custom-error').textContent='Bitte zuerst einen Kartentyp auswählen.';return;}
        const current=configInput.value.trim();
        const entityName=this._hass?.states?.[entity]?.attributes?.friendly_name||entity;
        let updated=false;
        try{
          const obj=JSON.parse(current);
          if(obj&&typeof obj==='object'&&!Array.isArray(obj)){
            if('entity' in obj||!('entities' in obj)){
              obj.entity=entity;
              if(templateManaged&&obj.name)obj.name=entityName;
              configInput.value=JSON.stringify(obj,null,2);
              updated=true;
            }
          }
        }catch(_e){}
        if(!updated){
          const lines=current.split(/\r?\n/);
          const entityLine=lines.findIndex(line=>/^entity:\s*/.test(line));
          if(entityLine>=0){
            lines[entityLine]='entity: '+entity;
            if(templateManaged){
              const nameLine=lines.findIndex(line=>/^name:\s*/.test(line));
              if(nameLine>=0)lines[nameLine]='name: '+JSON.stringify(entityName);
            }
            configInput.value=lines.join('\n');
            updated=true;
          }else if(/^entities:\s*$/m.test(current)){
            const listIndex=lines.findIndex(line=>/^entities:\s*$/.test(line));
            if(listIndex>=0&&/^\s*-\s+/.test(lines[listIndex+1]||'')){
              lines[listIndex+1]='  - '+entity;
              configInput.value=lines.join('\n');
              updated=true;
            }
          }
        }
        if(!updated){
          configInput.value=(current||'type: '+type)+'\nentity: '+entity;
          if(templateManaged)configInput.value+='\nname: '+JSON.stringify(entityName);
        }
        generatedTemplate=configInput.value;
        entityLabel.textContent=entity;
        detectType();
      });
    };

    const quickFields=overlay.querySelector('#custom-quick-fields');
    const quickName=overlay.querySelector('#custom-quick-name');
    const quickIcon=overlay.querySelector('#custom-quick-icon');
    const quickColor=overlay.querySelector('#custom-quick-color');
    const supportedQuickFields={
      'custom:mushroom-entity-card':{name:'name',icon:'icon',color:'icon_color'},
      'custom:mushroom-light-card':{name:'name',icon:'icon',color:'icon_color'},
      'custom:mushroom-climate-card':{name:'name',icon:'icon',color:'icon_color'},
      'custom:mushroom-cover-card':{name:'name',icon:'icon',color:'icon_color'},
      'custom:mushroom-template-card':{name:'primary',icon:'icon',color:'icon_color'},
      'custom:button-card':{name:'name',icon:'icon',color:'color'}
    };
    const yamlScalar=(key)=>{
      try{const value=JSON.parse(configInput.value)?.[key];return typeof value==='string'?value:'';}
      catch(_err){
        const match=configInput.value.match(new RegExp('^'+key+':\\s*(.*)
    this.refreshCustomCardCatalog().then(types=>{
      if(overlay.isConnected){
        fillTypes(types);
        const report=this._marketplaceCardReport;
        overlay.querySelector('#custom-marketplace-status').textContent=report
          ?'Marketplace: '+report.installed+' installierte Dashboard-Erweiterungen, '+report.matched+' anhand der Ressourcen zugeordnet. Eine Erweiterung kann mehrere Kartentypen enthalten.'
          :'Kartentypen automatisch aus Lovelace-Ressourcen und Browserregistrierung erkannt; Marketplace-Abgleich nicht verfügbar.';
      }
    });
    detectType();
    overlay.querySelector('#custom-cancel').onclick=()=>overlay.remove();
    overlay.querySelector('#custom-save').onclick=async()=>{
      const title=overlay.querySelector('#custom-title').value.trim(),selectedType=overlay.querySelector('#custom-type').value.trim(),configuration=overlay.querySelector('#custom-config').value.trim();
      const error=overlay.querySelector('#custom-error');
      if(!title){error.textContent='Bitte einen Kartentitel eingeben.';return;}
      const button=overlay.querySelector('#custom-save');button.disabled=true;error.textContent='';
      try{
        let options={};
        if(configuration){
          try{options=JSON.parse(configuration);}
          catch(_jsonError){
            const result=await this.api('parse_card_yaml',{yaml:configuration});
            options=result.config;
          }
        }
        if(!options||typeof options!=='object'||Array.isArray(options))throw Error('Die Konfiguration muss ein YAML-/JSON-Objekt sein.');
        const card_type=typeof options.type==='string'&&options.type.trim()?options.type.trim():selectedType;
        if(!/^custom:[a-z0-9_-]+$/i.test(card_type))throw Error('Kein gültiger Kartentyp gefunden. Bitte type: custom:... im YAML angeben oder einen Kartentyp auswählen.');
        c.title=title.slice(0,80);
        c.custom_config={...options,type:card_type};
        delete c.custom;
        overlay.remove();change();
      }catch(e){
        error.textContent='Konfiguration konnte nicht übernommen werden: '+((typeof e?.body?.message==='string'?e.body.message:typeof e?.message==='string'?e.message:JSON.stringify(e?.body||e)));
      }finally{button.disabled=false;}
    };
  }
  customDesignProfile(c){
    // Profiles describe only parameters known to be supported by a card.
    // Unknown custom cards must never be assigned guessed properties.
    const profiles={
      equinox:{label:'Equinox',fields:[
        {key:'card_background_color',label:'Hintergrundfarbe',kind:'color',fallback:'light-blue',presets:['light-blue','indigo','blue','cyan','teal','green','amber','orange','red','purple','white','black']},
        {key:'card_background_opacity',label:'Hintergrund-Deckkraft',kind:'number',min:0,max:100,step:1,fallback:8}
      ]},
      climate_cluster:{label:'Climate Cluster',fields:[
        {key:'appearance',label:'Darstellung',kind:'enum',values:['theme','glass-dark'],fallback:'glass-dark'},
        {key:'glass_opacity',label:'Glas-Deckkraft',kind:'number',min:0,max:1,step:0.05,fallback:0.5}
      ]},
      rotapfel_simple_thermcard:{label:'Rotapfel Simple ThermCard',fields:[
        {key:'theme',label:'Kartenthema',kind:'enum',values:['home-assistant','auto','light','dark'],fallback:'light'},
        {key:'viewing',label:'Betrachtungsabstand',kind:'enum',values:['near','far'],fallback:'near'}
      ]}
    };
    return profiles[c.variant]||null;
  }
  editDesign(c,change){
    const original=JSON.parse(JSON.stringify(c.design||{}));
    const originalDisplay=JSON.parse(JSON.stringify(c.display||{}));
    const x=this.design(c),profile=this.customDesignProfile(c),external=!!(profile||c.type==='custom'||this.externalVariant(c));
    const externalMode=c.design?.external_mode||'original';
    const cardConfig=profile?this.externalConfig(c):null;
    const thermColors=c.variant==='rotapfel_simple_thermcard'?'<fieldset style="border:1px solid #8885;border-radius:10px;padding:12px;margin:12px 0"><legend>Individuelle Kartenfarben</legend>'+[['therm_background','Kartenhintergrund','#faf9f5'],['therm_text','Schriftfarbe','#1c1a17']].map(([key,label,fallback])=>'<label style="display:flex;align-items:center;gap:10px;margin:10px 0">'+label+' <input type="color" data-design-color="'+key+'" value="'+(/^#[0-9a-fA-F]{6}$/.test(c.external_options?.[key]||'')?c.external_options[key]:fallback)+'" style="width:56px;height:34px"><input type="checkbox" data-design-color-on="'+key+'" '+(c.external_options?.[key]?'checked':'')+'> Eigene Farbe</label>').join('')+'</fieldset>':'';
    const thermAccent=c.variant==='rotapfel_simple_thermcard'?'<label>Akzentfarbe<select id="d-therm-accent"><option value="">Standard der Karte</option>'+['yellow','sage','coral','sky','lilac'].map(v=>'<option value="'+v+'" '+(c.external_options?.accent===v?'selected':'')+'>'+({yellow:'Gelb',sage:'Salbeigrün',coral:'Koralle',sky:'Himmelblau',lilac:'Flieder'})[v]+'</option>').join('')+'</select></label>':'';
    const profileFields=profile?.fields||[];
    const profileFieldMarkup=profileFields.map(f=>{
      const value=c.external_options?.[f.key]??cardConfig?.[f.key]??f.fallback;
      const id='d-profile-'+f.key;
      if(f.kind==='color'){
        const raw=String(value),hex=/^#[0-9a-f]{6}$/i.test(raw);
        const presets=[...new Set([raw,...(f.presets||[])])];
        return `<div class="profile-color-field"><label>${this.esc(f.label)}<select id="${id}-preset"><option value="__hex__" ${hex?'selected':''}>Eigene Farbe (HEX)</option>${presets.filter(v=>!/^#[0-9a-f]{6}$/i.test(v)).map(v=>`<option value="${this.esc(v)}" ${!hex&&raw===v?'selected':''}>${this.esc(v)}</option>`).join('')}</select></label><div style="display:flex;gap:10px;align-items:center;margin:8px 0"><input type="color" id="${id}-picker" value="${hex?this.esc(raw):'#008000'}" style="width:62px;min-width:62px;height:40px;padding:2px;${hex?'':'display:none;'}"><input type="text" id="${id}" value="${this.esc(raw)}" aria-label="HEX-Farbwert oder Farbname" style="flex:1;min-width:0"></div><small class="muted">Voreingestellte Farbnamen sind Beispiele, keine abschließende Liste. Für frei wählbare Farben HEX verwenden.</small></div>`;
      }
      if(f.kind==='enum')return `<label>${this.esc(f.label)}<select id="${id}">${[...new Set([String(value),...f.values])].map(v=>`<option value="${this.esc(v)}" ${String(value)===v?'selected':''}>${this.esc(v)}</option>`).join('')}</select></label>`;
      if(f.kind==='number')return `<label>${this.esc(f.label)}<input id="${id}" type="number" min="${f.min}" max="${f.max}" step="${f.step}" value="${this.esc(value)}"></label>`;
      return `<label>${this.esc(f.label)}<input id="${id}" type="text" maxlength="64" value="${this.esc(value)}"></label>`;
    }).join('');
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;background:#000a;z-index:9999;display:grid;place-items:center;padding:16px';
    const num=(v,lo,hi,def)=>Math.min(hi,Math.max(lo,Number.isFinite(Number(v))?Number(v):def));
    const color=(v,def)=>/^#[0-9a-f]{6}$/i.test(v||'')?v:def;
    const selected=(v,expected)=>v===expected?'selected':'';
    overlay.innerHTML=`<div style="background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);padding:22px;border-radius:16px;width:min(800px,96vw);max-height:92vh;overflow:auto;box-sizing:border-box">
      <h2 style="margin:0 0 8px">Design bearbeiten · ${this.esc(c.title)}</h2>
      <p class="muted">${external?'Externe Custom Card: Rahmen- und Vorschau-Effekte; die interne Darstellung wird weiterhin von der Custom Card gesteuert.':'Rotapfel-Karte: Farben, Text und Kartenrahmen können angepasst werden.'}</p>
      ${external?`<div style="border:1px solid var(--divider-color,#9995);border-radius:10px;padding:12px;margin:12px 0"><strong>${profile?this.esc(profile.label)+' · karteneigene Designparameter':'Externe Custom Card · Design'}</strong>
        ${profile?`<div id="d-profile-fields">${profileFieldMarkup}</div><p class="muted">Diese Felder ändern ausschließlich bekannte Parameter der Custom Card. Farbwerte werden nicht ungeprüft in andere Formate umgerechnet.</p>`:'<p class="muted">Für diesen Kartentyp ist kein verifiziertes Designprofil hinterlegt. Interne Farbparameter werden nicht geraten. Du kannst optional den äußeren Container gestalten.</p>'}
        <label>Äußerer Kartencontainer<select id="d-external-mode"><option value="original" ${selected(externalMode,'original')}>Originalkarte ohne zusätzliche Rotapfel-Farben</option><option value="wrapper" ${selected(externalMode,'wrapper')}>Rotapfel-Rahmen separat gestalten</option></select></label>
      </div>`:''}
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">
      <div>
      <div id="d-wrapper-options" style="display:${external&&externalMode!=='wrapper'?'none':'block'}"><details open><summary><strong>${external?'Äußerer Rahmen & Farben':'Hintergrund & Farben'}</strong></summary>
        ${[['bg','Hintergrund',x.bg],['fg','Schrift',x.fg],['accent','Akzent',x.accent],['border_color','Rahmen',color(original.border_color,'#64748b')]].map(([key,label,val])=>`<label class="color-row"><span>${label}</span><input type="color" id="d-${key}" value="${val}"><span id="v-${key}">${val}</span></label>`).join('')}
        <label>Transparenz des Hintergrunds <input type="range" id="d-opacity" min="0" max="100" value="${num(original.opacity,0,100,100)}"><span id="v-opacity"></span></label>
      </details>
      <details open><summary><strong>Rahmen & Effekte</strong></summary>
        <label>Rahmenstärke (px)<input type="number" id="d-border_width" min="0" max="12" value="${num(original.border_width,0,12,0)}"></label>
        <label>Eckenrundung (px)<input type="number" id="d-radius" min="0" max="48" value="${num(original.radius,0,48,12)}"></label>
        <label>Schatten<select id="d-shadow"><option value="none" ${selected(original.shadow||'none','none')}>Kein Schatten</option><option value="soft" ${selected(original.shadow,'soft')}>Dezent</option><option value="strong" ${selected(original.shadow,'strong')}>Stark</option></select></label>
      </details>
      </div><details style="display:${external?'none':''}"><summary><strong>Text & Anzeige</strong></summary>
        <label>Schriftgröße (px)<input type="number" id="d-font_size" min="10" max="32" value="${num(original.font_size,10,32,14)}"></label>
        <label>Textausrichtung<select id="d-text_align"><option value="left" ${selected(original.text_align||'left','left')}>Links</option><option value="center" ${selected(original.text_align,'center')}>Zentriert</option><option value="right" ${selected(original.text_align,'right')}>Rechts</option></select></label>
        <label><input id="d-show-name" type="checkbox" style="width:auto" ${c.display?.show_name!==false?'checked':''}> Kartenname anzeigen</label>
        <label><input id="d-show-id" type="checkbox" style="width:auto" ${c.display?.show_entity_id===true?'checked':''}> Entitäts-ID anzeigen</label>
      </details>
      <details open><summary><strong>Größe</strong></summary>
        <label>Breite (1–4 Spalten)<select id="d-width">${[1,2,3,4].map(n=>`<option value="${n}" ${n===x.width?'selected':''}>${n} von 4</option>`).join('')}</select></label>
        ${external?`<label><input id="d-auto-height" type="checkbox" style="width:auto" ${this.autoCardHeight(c)?'checked':''}> Automatische Kartenhöhe</label>`:''}
        <label>Höhe (px)<input id="d-height" type="number" min="76" max="${external?1200:320}" value="${num(original.height,76,external?1200:320,x.height)}"></label>
      </details>
      </div>
      <div style="min-width:0">
        ${thermColors}${thermAccent}<strong>Live-Vorschau</strong>
        <div id="d-preview" style="margin-top:12px;padding:18px;border:1px dashed var(--divider-color,#888);border-radius:12px;min-height:140px;overflow:hidden"></div>
        <p class="muted">Die Vorschau verändert noch keine gespeicherten Einstellungen. Bei der Rotapfel Simple ThermCard wird die echte Karte ohne Bedienfunktion angezeigt. Andere externe Karten nutzen weiterhin eine stilisierte Vorschau.</p>
        <button class="secondary" id="d-reset" type="button">Auf Standard zurücksetzen</button>
        <div style="${external?'display:none;':''}margin-top:16px;border-top:1px solid #8885;padding-top:12px"><strong>Designvorlagen</strong>
          <label>Vorlage<select id="d-template"><option value="">Vorlage auswählen …</option></select></label>
          <div class="actions" style="flex-wrap:wrap"><button class="secondary" id="d-template-load" type="button">Vorlage laden</button><button class="secondary" id="d-template-save" type="button">Als Vorlage speichern</button><button class="secondary" id="d-template-delete" type="button">Vorlage löschen</button></div>
          <p class="muted">Vorlagen enthalten nur Design und Anzeigeoptionen. Kartengröße, Entität und Position bleiben unverändert.</p><p id="d-template-status" class="muted" role="status"></p>
        </div>
      </div></div>
      <div class="actions" style="margin-top:18px"><button id="d-save">Übernehmen</button><button class="secondary" id="d-cancel">Abbrechen</button></div></div>`;
    this.shadowRoot.appendChild(overlay);
    const el=id=>overlay.querySelector('#d-'+id);
    for(const f of profileFields.filter(f=>f.kind==='color')){
      const input=el('profile-'+f.key),select=el('profile-'+f.key+'-preset'),picker=el('profile-'+f.key+'-picker');
      if(!input||!select||!picker)continue;
      const swatch=document.createElement('span');
      swatch.setAttribute('aria-label','Farbanzeige');
      swatch.title='CSS-Farbnamen sind eine Annäherung; HEX zeigt den exakten Wert.';
      swatch.style.cssText='width:30px;height:30px;flex:none;border:1px solid #888;border-radius:5px;display:inline-block';
      picker.insertAdjacentElement('afterend',swatch);
      const syncColor=()=>{
        const raw=input.value.trim(),hex=/^#[0-9a-f]{6}$/i.test(raw);
        picker.style.display=hex?'':'none';
        if(hex){picker.value=raw;select.value='__hex__';swatch.style.backgroundColor=raw;}
        else{
          if([...select.options].some(o=>o.value===raw))select.value=raw;
          swatch.style.backgroundColor=CSS.supports('color',raw)?raw:'transparent';
        }
      };
      select.onchange=()=>{
        if(select.value==='__hex__')input.value=/^#[0-9a-f]{6}$/i.test(input.value.trim())?input.value:picker.value;
        else input.value=select.value;
        syncColor();
      };
      picker.oninput=()=>{input.value=picker.value;syncColor();};
      input.oninput=syncColor;
      syncColor();
    }

    const keys=['bg','fg','accent','border_color','opacity','border_width','radius','shadow','font_size','text_align','width','height'];
    const read=()=>({
      ...original,
      width:Number(el('width').value),height:num(el('height').value,76,external?1200:320,110),
      ...(external?{auto_height:el('auto-height').checked,external_mode:el('external-mode').value}:{}),
      bg:el('bg').value,fg:el('fg').value,accent:el('accent').value,
      border_color:el('border_color').value,opacity:num(el('opacity').value,0,100,100),
      border_width:num(el('border_width').value,0,12,0),radius:num(el('radius').value,0,48,12),
      shadow:el('shadow').value,font_size:num(el('font_size').value,10,32,14),text_align:el('text_align').value
    });
    const preview=()=>{
      const d=read(),rgb=[1,3,5].map(i=>parseInt(d.bg.slice(i,i+2),16));
      const shadow=d.shadow==='strong'?'0 12px 26px #0006':d.shadow==='soft'?'0 4px 12px #0003':'none';
      const box=overlay.querySelector('#d-preview');
      const style=`background:rgba(${rgb.join(',')},${d.opacity/100});color:${d.fg};border:${d.border_width}px solid ${d.border_color};border-radius:${d.radius}px;box-shadow:${shadow};font-size:${d.font_size}px;text-align:${d.text_align};padding:16px;min-height:90px;box-sizing:border-box;`;
      const name=el('show-name').checked?`<strong>${this.esc(c.title)}</strong>`:'';
      const id=el('show-id').checked?`<small style="display:block">${this.esc(c.entity_id||'Keine Entität')}</small>`:'';
      box.innerHTML=external&&el('external-mode').value!=='wrapper'?`<div style="padding:16px;border:1px dashed #888;border-radius:8px">${this.esc(profile?.label||'Custom Card')} – Originaldarstellung wird von der Karte selbst erzeugt.<div class="muted">Farbvorschau oben ist eine Browser-Näherung. Die echte Karte wird nach Übernehmen neu geladen.</div></div>`:`<div style="${style}">${name}${id}<div style="margin-top:12px;color:${d.fg}">${external?'Äußerer Kartencontainer – Vorschau':this.esc(this.stateLabel(c))}</div><span style="display:inline-block;margin-top:10px;background:${d.accent};color:white;padding:5px 12px;border-radius:8px">Akzent</span></div>`;
      if(c.variant==='rotapfel_simple_thermcard'){
        // Preview is read-only: never attach the live Home Assistant service client.
        const config=this.externalConfig(c);
        if(c.variant==='rotapfel_simple_thermcard'){const accent=overlay.querySelector('#d-therm-accent')?.value;if(accent)config.accent=accent;else delete config.accent;}
        for(const field of profileFields){
          const input=el('profile-'+field.key);
          if(input&&input.value)config[field.key]=input.value;
        }
        const renderLive=()=>{
          if(!overlay.isConnected||!box.isConnected)return;
          const tag=config.type.replace(/^custom:/,'');
          if(!customElements.get(tag))return;
          try{
            const card=document.createElement(tag);
            card.setConfig(config);
            const readonlyHass=this._hass?new Proxy(this._hass,{get(target,key){
              if(key==='callService'||key==='callApi'||key==='callWS')return ()=>Promise.reject(new Error('Designvorschau: Steuerung deaktiviert'));
              const value=Reflect.get(target,key,target);
              return typeof value==='function'?value.bind(target):value;
            }}):null;
            if(readonlyHass)card.hass=readonlyHass;
            const liveColorOpts={...c.external_options};
            for(const input of overlay.querySelectorAll('[data-design-color]')){
              const key=input.dataset.designColor;
              if(overlay.querySelector('[data-design-color-on="'+key+'"]')?.checked)liveColorOpts[key]=input.value;
              else delete liveColorOpts[key];
            }
            this.applyThermColors(card,liveColorOpts);
            this.mountThermPreview(box,card);
          }catch(err){box.textContent='Live-Vorschau nicht verfügbar: '+String(err);}
        };
        renderLive();
        if(!customElements.get(config.type.replace(/^custom:/,'')))
          this.ensureExternalResource(c).then(renderLive).catch(()=>{});
      }
      for(const key of ['bg','fg','accent','border_color'])overlay.querySelector('#v-'+key).textContent=el(key).value;
      overlay.querySelector('#v-opacity').textContent=d.opacity+' %';
      if(el('auto-height'))el('height').disabled=el('auto-height').checked;
    };
    if(external)el('external-mode').addEventListener('change',()=>{el('wrapper-options').style.display=el('external-mode').value==='wrapper'?'block':'none';});
    overlay.querySelectorAll('input,select').forEach(input=>{input.addEventListener('input',preview);input.addEventListener('change',preview);});
    overlay.querySelector('#d-therm-accent')?.addEventListener('change',preview);
    overlay.querySelectorAll('[data-design-color],[data-design-color-on]').forEach(input=>{input.addEventListener('input',preview);input.addEventListener('change',preview);});
    el('cancel').onclick=()=>overlay.remove();
    el('reset').onclick=()=>{
      const defaults={bg:this.theme==='dark'?'#293241':'#e5e7eb',fg:this.theme==='dark'?'#f4f5f7':'#202124',accent:'#009ac4',border_color:'#64748b',opacity:100,border_width:0,radius:12,shadow:'none',font_size:14,text_align:'left'};
      for(const [key,val] of Object.entries(defaults))if(el(key))el(key).value=val;
      // Custom cards own their internal colors. Restore their declared
      // original defaults in the same form fields that the Save action reads.
      for(const field of profileFields){
        const input=el('profile-'+field.key);
        if(!input)continue;
        input.value=String(field.fallback??'');
        input.dispatchEvent(new Event('input',{bubbles:true}));
        input.dispatchEvent(new Event('change',{bubbles:true}));
      }
      if(external&&el('external-mode')){
        el('external-mode').value='original';
        el('external-mode').dispatchEvent(new Event('change',{bubbles:true}));
      }
      preview();
    };
    // Design templates are stored centrally in Home Assistant, not only in this browser.
    // Apply appearance fields only: never overwrite dimensions, placement or identity.
    const visualKeys=['bg','fg','accent','border_color','opacity','border_width','radius','shadow','font_size','text_align'];
    const templateSelect=el('template'),templateStatus=el('template-status');
    let templates=[];
    const setStatus=msg=>{templateStatus.textContent=msg;};
    const populate=()=>{const current=templateSelect.value;templateSelect.replaceChildren(new Option('Vorlage auswählen …',''),...templates.map((t,i)=>new Option(t.name,String(i))));if(templates[Number(current)]&&current!=='')templateSelect.value=current;};
    // Use the authenticated Home Assistant API client already used for dashboards.
    // This avoids accessing undocumented auth internals and prevents silent failures.
    const storeTemplates=async(next)=>{
      const data=await this.api('save_design_templates',{templates:next});
      if(!data||!Array.isArray(data.templates))throw Error('Ungültige Serverantwort beim Speichern');
      templates=data.templates;
      populate();
    };
    const loadTemplates=async()=>{
      try{
        const data=await this.api('design_templates');
        if(!data||!Array.isArray(data.templates))throw Error('Ungültige Serverantwort');
        templates=data.templates;populate();
        if(templates.length)setStatus(templates.length+' Designvorlage(n) verfügbar.');
      }catch(err){setStatus('Vorlagen konnten nicht geladen werden: '+(err.message||err));}
    };
    loadTemplates();
    el('template-save').onclick=async()=>{
      const name=prompt('Name der neuen Designvorlage:');if(name===null)return;
      const clean=name.trim().slice(0,60);if(!clean){setStatus('Bitte einen Namen angeben.');return;}
      const existing=templates.findIndex(t=>t.name.toLocaleLowerCase()===clean.toLocaleLowerCase());
      if(existing>=0&&!confirm('Vorlage „'+clean+'“ überschreiben?'))return;
      const current=read(),design=Object.fromEntries(visualKeys.map(k=>[k,current[k]]));
      const display={show_name:el('show-name').checked,show_entity_id:el('show-id').checked};
      const next=[...templates],item={name:clean,design,display};if(existing>=0)next[existing]=item;else next.push(item);
      try{await storeTemplates(next);templateSelect.value=String(existing>=0?existing:templates.length-1);setStatus('Vorlage „'+clean+'“ gespeichert und in der Liste verfügbar.');}catch(err){setStatus('Fehler: '+(err.message||err));}
    };
    el('template-load').onclick=()=>{
      const t=templates[Number(templateSelect.value)];if(templateSelect.value===''||!t){setStatus('Bitte eine Vorlage auswählen.');return;}
      for(const key of visualKeys){if(t.design[key]!==undefined&&el(key))el(key).value=t.design[key];}
      el('show-name').checked=t.display?.show_name!==false;
      el('show-id').checked=t.display?.show_entity_id===true;
      preview();setStatus('Vorlage geladen. Mit „Übernehmen“ auf diese Karte anwenden.');
    };
    el('template-delete').onclick=async()=>{
      const idx=Number(templateSelect.value),t=templates[idx];if(templateSelect.value===''||!t)return;
      if(!confirm('Designvorlage „'+t.name+'“ dauerhaft löschen?'))return;
      try{await storeTemplates(templates.filter((_,i)=>i!==idx));templateSelect.value='';setStatus('Vorlage gelöscht.');}catch(err){setStatus('Fehler: '+(err.message||err));}
    };
    el('save').onclick=()=>{
      c.design=read();
      if(profile){
        const updates={};
        for(const field of profileFields){
          const input=el('profile-'+field.key);
          if(!input)continue;
          const raw=input.value.trim();
          if(field.kind==='number'){
            const n=Number(raw);
            if(!raw||!Number.isFinite(n)||n<field.min||n>field.max){alert('Ungültiger Wert für '+field.label);return;}
            updates[field.key]=n;
          }else if(field.kind==='color'){
            if(!(/^#[0-9a-f]{6}$/i.test(raw)||/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(raw))){alert('Bitte einen gültigen HEX-Wert (#RRGGBB) oder Farbnamen eingeben.');return;}
            updates[field.key]=raw;
          }else if(field.kind==='enum'){
            if(!field.values.includes(raw)&&raw!==String(c.external_options?.[field.key]??cardConfig?.[field.key]??'')){alert('Nicht unterstützter Wert für '+field.label);return;}
            updates[field.key]=raw;
          }else{
            if(!/^[a-zA-Z0-9_-]{1,64}$/.test(raw)){alert('Bitte einen gültigen Farbnamen für '+field.label+' eingeben.');return;}
            updates[field.key]=raw;
          }
        }
        c.external_options={...(c.external_options||{}),...updates};
        if(c.variant==='rotapfel_simple_thermcard'){const accent=overlay.querySelector('#d-therm-accent')?.value;if(accent)c.external_options.accent=accent;else delete c.external_options.accent;}
        for(const input of overlay.querySelectorAll('[data-design-color]')){
          const key=input.dataset.designColor;
          if(overlay.querySelector('[data-design-color-on="'+key+'"]')?.checked)c.external_options[key]=input.value;
          else delete c.external_options[key];
        }
      }
      if(!external)c.display={...originalDisplay,show_name:el('show-name').checked,show_entity_id:el('show-id').checked};
      overlay.remove();change();
    };
    preview();
  }
  pickEntity(current,callback){
    const allowed=['light','switch','sensor','binary_sensor','climate','cover','input_boolean'];
    const states=this._hass?.states||{};
    const entries=Object.keys(states).filter(id=>allowed.includes(id.split('.')[0])).sort();
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;background:#0009;z-index:9999;display:grid;place-items:center;padding:16px';
    overlay.innerHTML=`<div style="background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);padding:22px;border-radius:14px;width:min(560px,95vw);max-height:85vh;overflow:auto"><h2>Home Assistant Entität auswählen</h2><label>Suche<input id="entity-search" placeholder="Name oder entity_id" autocomplete="off"></label><label>Entitätstyp<select id="entity-domain"><option value="">Alle Typen</option>${allowed.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Entität<select id="entity-select" size="12" style="height:250px"></select></label><div class="actions"><button id="entity-accept">Übernehmen</button><button class="secondary" id="entity-cancel">Abbrechen</button></div><p class="muted">Es werden nur Entitäten angezeigt, die Home Assistant aktuell an das Frontend liefert.</p></div>`;
    this.shadowRoot.appendChild(overlay);
    const search=overlay.querySelector('#entity-search'),domain=overlay.querySelector('#entity-domain'),select=overlay.querySelector('#entity-select');
    const refresh=()=>{const q=search.value.toLocaleLowerCase(),d=domain.value;const filtered=entries.filter(id=>(!d||id.startsWith(d+'.'))&&(id.toLowerCase().includes(q)||String(states[id]?.attributes?.friendly_name||'').toLowerCase().includes(q))).slice(0,500);select.replaceChildren(...filtered.map(id=>{const o=document.createElement('option');o.value=id;o.textContent=`${states[id]?.attributes?.friendly_name||id} · ${id}`;if(id===current)o.selected=true;return o;}));};
    search.oninput=refresh;domain.onchange=refresh;refresh();
    overlay.querySelector('#entity-cancel').onclick=()=>overlay.remove();
    overlay.querySelector('#entity-accept').onclick=()=>{if(select.value){callback(select.value);overlay.remove();}};
    overlay.addEventListener('click',ev=>{if(ev.target===overlay)overlay.remove();});search.focus();
  }

}
customElements.define('rotapfel-dashboard-manager',RotapfelDashboardManager);
,'m'));
        if(!match)return '';
        const raw=match[1].trim();
        if(raw.startsWith('"')&&raw.endsWith('"')){try{return JSON.parse(raw);}catch(_e){}}
        return raw.replace(/^'|'$/g,'');
      }
    };
    const refreshQuick=()=>{
      const profile=supportedQuickFields[typeInput.value.trim()];
      quickFields.hidden=!profile;
      if(!profile)return;
      quickName.value=yamlScalar(profile.name);
      quickIcon.value=yamlScalar(profile.icon);
      quickColor.value=yamlScalar(profile.color);
    };
    const setYamlField=(key,value)=>{
      let obj;
      try{obj=JSON.parse(configInput.value);}catch(_err){}
      if(obj&&typeof obj==='object'&&!Array.isArray(obj)){
        if(value)obj[key]=value;else delete obj[key];
        configInput.value=JSON.stringify(obj,null,2);
      }else{
        const lines=configInput.value.split(/\r?\n/);
        const index=lines.findIndex(line=>line.startsWith(key+':'));
        if(index>=0){if(value)lines[index]=key+': '+JSON.stringify(value);else lines.splice(index,1);}
        else if(value)lines.push(key+': '+JSON.stringify(value));
        configInput.value=lines.join('\n');
      }
      templateManaged=false;
      generatedTemplate='';
    };
    for(const [element,field] of [[quickName,'name'],[quickIcon,'icon'],[quickColor,'color']]){
      element.addEventListener('change',()=>{
        const profile=supportedQuickFields[typeInput.value.trim()];
        if(profile?.[field])setYamlField(profile[field],element.value.trim());
      });
    }
    select.addEventListener('change',()=>queueMicrotask(refreshQuick));
    configInput.addEventListener('input',refreshQuick);
    refreshQuick();
    // Refresh automatically; the dropdown updates without blocking editing.
    this.refreshCustomCardCatalog().then(types=>{
      if(overlay.isConnected){
        fillTypes(types);
        const report=this._marketplaceCardReport;
        overlay.querySelector('#custom-marketplace-status').textContent=report
          ?'Marketplace: '+report.installed+' installierte Dashboard-Erweiterungen, '+report.matched+' anhand der Ressourcen zugeordnet. Eine Erweiterung kann mehrere Kartentypen enthalten.'
          :'Kartentypen automatisch aus Lovelace-Ressourcen und Browserregistrierung erkannt; Marketplace-Abgleich nicht verfügbar.';
      }
    });
    detectType();
    overlay.querySelector('#custom-cancel').onclick=()=>overlay.remove();
    overlay.querySelector('#custom-save').onclick=async()=>{
      const title=overlay.querySelector('#custom-title').value.trim(),selectedType=overlay.querySelector('#custom-type').value.trim(),configuration=overlay.querySelector('#custom-config').value.trim();
      const error=overlay.querySelector('#custom-error');
      if(!title){error.textContent='Bitte einen Kartentitel eingeben.';return;}
      const button=overlay.querySelector('#custom-save');button.disabled=true;error.textContent='';
      try{
        let options={};
        if(configuration){
          try{options=JSON.parse(configuration);}
          catch(_jsonError){
            const result=await this.api('parse_card_yaml',{yaml:configuration});
            options=result.config;
          }
        }
        if(!options||typeof options!=='object'||Array.isArray(options))throw Error('Die Konfiguration muss ein YAML-/JSON-Objekt sein.');
        const card_type=typeof options.type==='string'&&options.type.trim()?options.type.trim():selectedType;
        if(!/^custom:[a-z0-9_-]+$/i.test(card_type))throw Error('Kein gültiger Kartentyp gefunden. Bitte type: custom:... im YAML angeben oder einen Kartentyp auswählen.');
        c.title=title.slice(0,80);
        c.custom_config={...options,type:card_type};
        delete c.custom;
        overlay.remove();change();
      }catch(e){
        error.textContent='Konfiguration konnte nicht übernommen werden: '+((typeof e?.body?.message==='string'?e.body.message:typeof e?.message==='string'?e.message:JSON.stringify(e?.body||e)));
      }finally{button.disabled=false;}
    };
  }
  customDesignProfile(c){
    // Profiles describe only parameters known to be supported by a card.
    // Unknown custom cards must never be assigned guessed properties.
    const profiles={
      equinox:{label:'Equinox',fields:[
        {key:'card_background_color',label:'Hintergrundfarbe',kind:'color',fallback:'light-blue',presets:['light-blue','indigo','blue','cyan','teal','green','amber','orange','red','purple','white','black']},
        {key:'card_background_opacity',label:'Hintergrund-Deckkraft',kind:'number',min:0,max:100,step:1,fallback:8}
      ]},
      climate_cluster:{label:'Climate Cluster',fields:[
        {key:'appearance',label:'Darstellung',kind:'enum',values:['theme','glass-dark'],fallback:'glass-dark'},
        {key:'glass_opacity',label:'Glas-Deckkraft',kind:'number',min:0,max:1,step:0.05,fallback:0.5}
      ]},
      rotapfel_simple_thermcard:{label:'Rotapfel Simple ThermCard',fields:[
        {key:'theme',label:'Kartenthema',kind:'enum',values:['home-assistant','auto','light','dark'],fallback:'light'},
        {key:'viewing',label:'Betrachtungsabstand',kind:'enum',values:['near','far'],fallback:'near'}
      ]}
    };
    return profiles[c.variant]||null;
  }
  editDesign(c,change){
    const original=JSON.parse(JSON.stringify(c.design||{}));
    const originalDisplay=JSON.parse(JSON.stringify(c.display||{}));
    const x=this.design(c),profile=this.customDesignProfile(c),external=!!(profile||c.type==='custom'||this.externalVariant(c));
    const externalMode=c.design?.external_mode||'original';
    const cardConfig=profile?this.externalConfig(c):null;
    const thermColors=c.variant==='rotapfel_simple_thermcard'?'<fieldset style="border:1px solid #8885;border-radius:10px;padding:12px;margin:12px 0"><legend>Individuelle Kartenfarben</legend>'+[['therm_background','Kartenhintergrund','#faf9f5'],['therm_text','Schriftfarbe','#1c1a17']].map(([key,label,fallback])=>'<label style="display:flex;align-items:center;gap:10px;margin:10px 0">'+label+' <input type="color" data-design-color="'+key+'" value="'+(/^#[0-9a-fA-F]{6}$/.test(c.external_options?.[key]||'')?c.external_options[key]:fallback)+'" style="width:56px;height:34px"><input type="checkbox" data-design-color-on="'+key+'" '+(c.external_options?.[key]?'checked':'')+'> Eigene Farbe</label>').join('')+'</fieldset>':'';
    const thermAccent=c.variant==='rotapfel_simple_thermcard'?'<label>Akzentfarbe<select id="d-therm-accent"><option value="">Standard der Karte</option>'+['yellow','sage','coral','sky','lilac'].map(v=>'<option value="'+v+'" '+(c.external_options?.accent===v?'selected':'')+'>'+({yellow:'Gelb',sage:'Salbeigrün',coral:'Koralle',sky:'Himmelblau',lilac:'Flieder'})[v]+'</option>').join('')+'</select></label>':'';
    const profileFields=profile?.fields||[];
    const profileFieldMarkup=profileFields.map(f=>{
      const value=c.external_options?.[f.key]??cardConfig?.[f.key]??f.fallback;
      const id='d-profile-'+f.key;
      if(f.kind==='color'){
        const raw=String(value),hex=/^#[0-9a-f]{6}$/i.test(raw);
        const presets=[...new Set([raw,...(f.presets||[])])];
        return `<div class="profile-color-field"><label>${this.esc(f.label)}<select id="${id}-preset"><option value="__hex__" ${hex?'selected':''}>Eigene Farbe (HEX)</option>${presets.filter(v=>!/^#[0-9a-f]{6}$/i.test(v)).map(v=>`<option value="${this.esc(v)}" ${!hex&&raw===v?'selected':''}>${this.esc(v)}</option>`).join('')}</select></label><div style="display:flex;gap:10px;align-items:center;margin:8px 0"><input type="color" id="${id}-picker" value="${hex?this.esc(raw):'#008000'}" style="width:62px;min-width:62px;height:40px;padding:2px;${hex?'':'display:none;'}"><input type="text" id="${id}" value="${this.esc(raw)}" aria-label="HEX-Farbwert oder Farbname" style="flex:1;min-width:0"></div><small class="muted">Voreingestellte Farbnamen sind Beispiele, keine abschließende Liste. Für frei wählbare Farben HEX verwenden.</small></div>`;
      }
      if(f.kind==='enum')return `<label>${this.esc(f.label)}<select id="${id}">${[...new Set([String(value),...f.values])].map(v=>`<option value="${this.esc(v)}" ${String(value)===v?'selected':''}>${this.esc(v)}</option>`).join('')}</select></label>`;
      if(f.kind==='number')return `<label>${this.esc(f.label)}<input id="${id}" type="number" min="${f.min}" max="${f.max}" step="${f.step}" value="${this.esc(value)}"></label>`;
      return `<label>${this.esc(f.label)}<input id="${id}" type="text" maxlength="64" value="${this.esc(value)}"></label>`;
    }).join('');
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;background:#000a;z-index:9999;display:grid;place-items:center;padding:16px';
    const num=(v,lo,hi,def)=>Math.min(hi,Math.max(lo,Number.isFinite(Number(v))?Number(v):def));
    const color=(v,def)=>/^#[0-9a-f]{6}$/i.test(v||'')?v:def;
    const selected=(v,expected)=>v===expected?'selected':'';
    overlay.innerHTML=`<div style="background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);padding:22px;border-radius:16px;width:min(800px,96vw);max-height:92vh;overflow:auto;box-sizing:border-box">
      <h2 style="margin:0 0 8px">Design bearbeiten · ${this.esc(c.title)}</h2>
      <p class="muted">${external?'Externe Custom Card: Rahmen- und Vorschau-Effekte; die interne Darstellung wird weiterhin von der Custom Card gesteuert.':'Rotapfel-Karte: Farben, Text und Kartenrahmen können angepasst werden.'}</p>
      ${external?`<div style="border:1px solid var(--divider-color,#9995);border-radius:10px;padding:12px;margin:12px 0"><strong>${profile?this.esc(profile.label)+' · karteneigene Designparameter':'Externe Custom Card · Design'}</strong>
        ${profile?`<div id="d-profile-fields">${profileFieldMarkup}</div><p class="muted">Diese Felder ändern ausschließlich bekannte Parameter der Custom Card. Farbwerte werden nicht ungeprüft in andere Formate umgerechnet.</p>`:'<p class="muted">Für diesen Kartentyp ist kein verifiziertes Designprofil hinterlegt. Interne Farbparameter werden nicht geraten. Du kannst optional den äußeren Container gestalten.</p>'}
        <label>Äußerer Kartencontainer<select id="d-external-mode"><option value="original" ${selected(externalMode,'original')}>Originalkarte ohne zusätzliche Rotapfel-Farben</option><option value="wrapper" ${selected(externalMode,'wrapper')}>Rotapfel-Rahmen separat gestalten</option></select></label>
      </div>`:''}
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">
      <div>
      <div id="d-wrapper-options" style="display:${external&&externalMode!=='wrapper'?'none':'block'}"><details open><summary><strong>${external?'Äußerer Rahmen & Farben':'Hintergrund & Farben'}</strong></summary>
        ${[['bg','Hintergrund',x.bg],['fg','Schrift',x.fg],['accent','Akzent',x.accent],['border_color','Rahmen',color(original.border_color,'#64748b')]].map(([key,label,val])=>`<label class="color-row"><span>${label}</span><input type="color" id="d-${key}" value="${val}"><span id="v-${key}">${val}</span></label>`).join('')}
        <label>Transparenz des Hintergrunds <input type="range" id="d-opacity" min="0" max="100" value="${num(original.opacity,0,100,100)}"><span id="v-opacity"></span></label>
      </details>
      <details open><summary><strong>Rahmen & Effekte</strong></summary>
        <label>Rahmenstärke (px)<input type="number" id="d-border_width" min="0" max="12" value="${num(original.border_width,0,12,0)}"></label>
        <label>Eckenrundung (px)<input type="number" id="d-radius" min="0" max="48" value="${num(original.radius,0,48,12)}"></label>
        <label>Schatten<select id="d-shadow"><option value="none" ${selected(original.shadow||'none','none')}>Kein Schatten</option><option value="soft" ${selected(original.shadow,'soft')}>Dezent</option><option value="strong" ${selected(original.shadow,'strong')}>Stark</option></select></label>
      </details>
      </div><details style="display:${external?'none':''}"><summary><strong>Text & Anzeige</strong></summary>
        <label>Schriftgröße (px)<input type="number" id="d-font_size" min="10" max="32" value="${num(original.font_size,10,32,14)}"></label>
        <label>Textausrichtung<select id="d-text_align"><option value="left" ${selected(original.text_align||'left','left')}>Links</option><option value="center" ${selected(original.text_align,'center')}>Zentriert</option><option value="right" ${selected(original.text_align,'right')}>Rechts</option></select></label>
        <label><input id="d-show-name" type="checkbox" style="width:auto" ${c.display?.show_name!==false?'checked':''}> Kartenname anzeigen</label>
        <label><input id="d-show-id" type="checkbox" style="width:auto" ${c.display?.show_entity_id===true?'checked':''}> Entitäts-ID anzeigen</label>
      </details>
      <details open><summary><strong>Größe</strong></summary>
        <label>Breite (1–4 Spalten)<select id="d-width">${[1,2,3,4].map(n=>`<option value="${n}" ${n===x.width?'selected':''}>${n} von 4</option>`).join('')}</select></label>
        ${external?`<label><input id="d-auto-height" type="checkbox" style="width:auto" ${this.autoCardHeight(c)?'checked':''}> Automatische Kartenhöhe</label>`:''}
        <label>Höhe (px)<input id="d-height" type="number" min="76" max="${external?1200:320}" value="${num(original.height,76,external?1200:320,x.height)}"></label>
      </details>
      </div>
      <div style="min-width:0">
        ${thermColors}${thermAccent}<strong>Live-Vorschau</strong>
        <div id="d-preview" style="margin-top:12px;padding:18px;border:1px dashed var(--divider-color,#888);border-radius:12px;min-height:140px;overflow:hidden"></div>
        <p class="muted">Die Vorschau verändert noch keine gespeicherten Einstellungen. Bei der Rotapfel Simple ThermCard wird die echte Karte ohne Bedienfunktion angezeigt. Andere externe Karten nutzen weiterhin eine stilisierte Vorschau.</p>
        <button class="secondary" id="d-reset" type="button">Auf Standard zurücksetzen</button>
        <div style="${external?'display:none;':''}margin-top:16px;border-top:1px solid #8885;padding-top:12px"><strong>Designvorlagen</strong>
          <label>Vorlage<select id="d-template"><option value="">Vorlage auswählen …</option></select></label>
          <div class="actions" style="flex-wrap:wrap"><button class="secondary" id="d-template-load" type="button">Vorlage laden</button><button class="secondary" id="d-template-save" type="button">Als Vorlage speichern</button><button class="secondary" id="d-template-delete" type="button">Vorlage löschen</button></div>
          <p class="muted">Vorlagen enthalten nur Design und Anzeigeoptionen. Kartengröße, Entität und Position bleiben unverändert.</p><p id="d-template-status" class="muted" role="status"></p>
        </div>
      </div></div>
      <div class="actions" style="margin-top:18px"><button id="d-save">Übernehmen</button><button class="secondary" id="d-cancel">Abbrechen</button></div></div>`;
    this.shadowRoot.appendChild(overlay);
    const el=id=>overlay.querySelector('#d-'+id);
    for(const f of profileFields.filter(f=>f.kind==='color')){
      const input=el('profile-'+f.key),select=el('profile-'+f.key+'-preset'),picker=el('profile-'+f.key+'-picker');
      if(!input||!select||!picker)continue;
      const swatch=document.createElement('span');
      swatch.setAttribute('aria-label','Farbanzeige');
      swatch.title='CSS-Farbnamen sind eine Annäherung; HEX zeigt den exakten Wert.';
      swatch.style.cssText='width:30px;height:30px;flex:none;border:1px solid #888;border-radius:5px;display:inline-block';
      picker.insertAdjacentElement('afterend',swatch);
      const syncColor=()=>{
        const raw=input.value.trim(),hex=/^#[0-9a-f]{6}$/i.test(raw);
        picker.style.display=hex?'':'none';
        if(hex){picker.value=raw;select.value='__hex__';swatch.style.backgroundColor=raw;}
        else{
          if([...select.options].some(o=>o.value===raw))select.value=raw;
          swatch.style.backgroundColor=CSS.supports('color',raw)?raw:'transparent';
        }
      };
      select.onchange=()=>{
        if(select.value==='__hex__')input.value=/^#[0-9a-f]{6}$/i.test(input.value.trim())?input.value:picker.value;
        else input.value=select.value;
        syncColor();
      };
      picker.oninput=()=>{input.value=picker.value;syncColor();};
      input.oninput=syncColor;
      syncColor();
    }

    const keys=['bg','fg','accent','border_color','opacity','border_width','radius','shadow','font_size','text_align','width','height'];
    const read=()=>({
      ...original,
      width:Number(el('width').value),height:num(el('height').value,76,external?1200:320,110),
      ...(external?{auto_height:el('auto-height').checked,external_mode:el('external-mode').value}:{}),
      bg:el('bg').value,fg:el('fg').value,accent:el('accent').value,
      border_color:el('border_color').value,opacity:num(el('opacity').value,0,100,100),
      border_width:num(el('border_width').value,0,12,0),radius:num(el('radius').value,0,48,12),
      shadow:el('shadow').value,font_size:num(el('font_size').value,10,32,14),text_align:el('text_align').value
    });
    const preview=()=>{
      const d=read(),rgb=[1,3,5].map(i=>parseInt(d.bg.slice(i,i+2),16));
      const shadow=d.shadow==='strong'?'0 12px 26px #0006':d.shadow==='soft'?'0 4px 12px #0003':'none';
      const box=overlay.querySelector('#d-preview');
      const style=`background:rgba(${rgb.join(',')},${d.opacity/100});color:${d.fg};border:${d.border_width}px solid ${d.border_color};border-radius:${d.radius}px;box-shadow:${shadow};font-size:${d.font_size}px;text-align:${d.text_align};padding:16px;min-height:90px;box-sizing:border-box;`;
      const name=el('show-name').checked?`<strong>${this.esc(c.title)}</strong>`:'';
      const id=el('show-id').checked?`<small style="display:block">${this.esc(c.entity_id||'Keine Entität')}</small>`:'';
      box.innerHTML=external&&el('external-mode').value!=='wrapper'?`<div style="padding:16px;border:1px dashed #888;border-radius:8px">${this.esc(profile?.label||'Custom Card')} – Originaldarstellung wird von der Karte selbst erzeugt.<div class="muted">Farbvorschau oben ist eine Browser-Näherung. Die echte Karte wird nach Übernehmen neu geladen.</div></div>`:`<div style="${style}">${name}${id}<div style="margin-top:12px;color:${d.fg}">${external?'Äußerer Kartencontainer – Vorschau':this.esc(this.stateLabel(c))}</div><span style="display:inline-block;margin-top:10px;background:${d.accent};color:white;padding:5px 12px;border-radius:8px">Akzent</span></div>`;
      if(c.variant==='rotapfel_simple_thermcard'){
        // Preview is read-only: never attach the live Home Assistant service client.
        const config=this.externalConfig(c);
        if(c.variant==='rotapfel_simple_thermcard'){const accent=overlay.querySelector('#d-therm-accent')?.value;if(accent)config.accent=accent;else delete config.accent;}
        for(const field of profileFields){
          const input=el('profile-'+field.key);
          if(input&&input.value)config[field.key]=input.value;
        }
        const renderLive=()=>{
          if(!overlay.isConnected||!box.isConnected)return;
          const tag=config.type.replace(/^custom:/,'');
          if(!customElements.get(tag))return;
          try{
            const card=document.createElement(tag);
            card.setConfig(config);
            const readonlyHass=this._hass?new Proxy(this._hass,{get(target,key){
              if(key==='callService'||key==='callApi'||key==='callWS')return ()=>Promise.reject(new Error('Designvorschau: Steuerung deaktiviert'));
              const value=Reflect.get(target,key,target);
              return typeof value==='function'?value.bind(target):value;
            }}):null;
            if(readonlyHass)card.hass=readonlyHass;
            const liveColorOpts={...c.external_options};
            for(const input of overlay.querySelectorAll('[data-design-color]')){
              const key=input.dataset.designColor;
              if(overlay.querySelector('[data-design-color-on="'+key+'"]')?.checked)liveColorOpts[key]=input.value;
              else delete liveColorOpts[key];
            }
            this.applyThermColors(card,liveColorOpts);
            this.mountThermPreview(box,card);
          }catch(err){box.textContent='Live-Vorschau nicht verfügbar: '+String(err);}
        };
        renderLive();
        if(!customElements.get(config.type.replace(/^custom:/,'')))
          this.ensureExternalResource(c).then(renderLive).catch(()=>{});
      }
      for(const key of ['bg','fg','accent','border_color'])overlay.querySelector('#v-'+key).textContent=el(key).value;
      overlay.querySelector('#v-opacity').textContent=d.opacity+' %';
      if(el('auto-height'))el('height').disabled=el('auto-height').checked;
    };
    if(external)el('external-mode').addEventListener('change',()=>{el('wrapper-options').style.display=el('external-mode').value==='wrapper'?'block':'none';});
    overlay.querySelectorAll('input,select').forEach(input=>{input.addEventListener('input',preview);input.addEventListener('change',preview);});
    overlay.querySelector('#d-therm-accent')?.addEventListener('change',preview);
    overlay.querySelectorAll('[data-design-color],[data-design-color-on]').forEach(input=>{input.addEventListener('input',preview);input.addEventListener('change',preview);});
    el('cancel').onclick=()=>overlay.remove();
    el('reset').onclick=()=>{
      const defaults={bg:this.theme==='dark'?'#293241':'#e5e7eb',fg:this.theme==='dark'?'#f4f5f7':'#202124',accent:'#009ac4',border_color:'#64748b',opacity:100,border_width:0,radius:12,shadow:'none',font_size:14,text_align:'left'};
      for(const [key,val] of Object.entries(defaults))if(el(key))el(key).value=val;
      // Custom cards own their internal colors. Restore their declared
      // original defaults in the same form fields that the Save action reads.
      for(const field of profileFields){
        const input=el('profile-'+field.key);
        if(!input)continue;
        input.value=String(field.fallback??'');
        input.dispatchEvent(new Event('input',{bubbles:true}));
        input.dispatchEvent(new Event('change',{bubbles:true}));
      }
      if(external&&el('external-mode')){
        el('external-mode').value='original';
        el('external-mode').dispatchEvent(new Event('change',{bubbles:true}));
      }
      preview();
    };
    // Design templates are stored centrally in Home Assistant, not only in this browser.
    // Apply appearance fields only: never overwrite dimensions, placement or identity.
    const visualKeys=['bg','fg','accent','border_color','opacity','border_width','radius','shadow','font_size','text_align'];
    const templateSelect=el('template'),templateStatus=el('template-status');
    let templates=[];
    const setStatus=msg=>{templateStatus.textContent=msg;};
    const populate=()=>{const current=templateSelect.value;templateSelect.replaceChildren(new Option('Vorlage auswählen …',''),...templates.map((t,i)=>new Option(t.name,String(i))));if(templates[Number(current)]&&current!=='')templateSelect.value=current;};
    // Use the authenticated Home Assistant API client already used for dashboards.
    // This avoids accessing undocumented auth internals and prevents silent failures.
    const storeTemplates=async(next)=>{
      const data=await this.api('save_design_templates',{templates:next});
      if(!data||!Array.isArray(data.templates))throw Error('Ungültige Serverantwort beim Speichern');
      templates=data.templates;
      populate();
    };
    const loadTemplates=async()=>{
      try{
        const data=await this.api('design_templates');
        if(!data||!Array.isArray(data.templates))throw Error('Ungültige Serverantwort');
        templates=data.templates;populate();
        if(templates.length)setStatus(templates.length+' Designvorlage(n) verfügbar.');
      }catch(err){setStatus('Vorlagen konnten nicht geladen werden: '+(err.message||err));}
    };
    loadTemplates();
    el('template-save').onclick=async()=>{
      const name=prompt('Name der neuen Designvorlage:');if(name===null)return;
      const clean=name.trim().slice(0,60);if(!clean){setStatus('Bitte einen Namen angeben.');return;}
      const existing=templates.findIndex(t=>t.name.toLocaleLowerCase()===clean.toLocaleLowerCase());
      if(existing>=0&&!confirm('Vorlage „'+clean+'“ überschreiben?'))return;
      const current=read(),design=Object.fromEntries(visualKeys.map(k=>[k,current[k]]));
      const display={show_name:el('show-name').checked,show_entity_id:el('show-id').checked};
      const next=[...templates],item={name:clean,design,display};if(existing>=0)next[existing]=item;else next.push(item);
      try{await storeTemplates(next);templateSelect.value=String(existing>=0?existing:templates.length-1);setStatus('Vorlage „'+clean+'“ gespeichert und in der Liste verfügbar.');}catch(err){setStatus('Fehler: '+(err.message||err));}
    };
    el('template-load').onclick=()=>{
      const t=templates[Number(templateSelect.value)];if(templateSelect.value===''||!t){setStatus('Bitte eine Vorlage auswählen.');return;}
      for(const key of visualKeys){if(t.design[key]!==undefined&&el(key))el(key).value=t.design[key];}
      el('show-name').checked=t.display?.show_name!==false;
      el('show-id').checked=t.display?.show_entity_id===true;
      preview();setStatus('Vorlage geladen. Mit „Übernehmen“ auf diese Karte anwenden.');
    };
    el('template-delete').onclick=async()=>{
      const idx=Number(templateSelect.value),t=templates[idx];if(templateSelect.value===''||!t)return;
      if(!confirm('Designvorlage „'+t.name+'“ dauerhaft löschen?'))return;
      try{await storeTemplates(templates.filter((_,i)=>i!==idx));templateSelect.value='';setStatus('Vorlage gelöscht.');}catch(err){setStatus('Fehler: '+(err.message||err));}
    };
    el('save').onclick=()=>{
      c.design=read();
      if(profile){
        const updates={};
        for(const field of profileFields){
          const input=el('profile-'+field.key);
          if(!input)continue;
          const raw=input.value.trim();
          if(field.kind==='number'){
            const n=Number(raw);
            if(!raw||!Number.isFinite(n)||n<field.min||n>field.max){alert('Ungültiger Wert für '+field.label);return;}
            updates[field.key]=n;
          }else if(field.kind==='color'){
            if(!(/^#[0-9a-f]{6}$/i.test(raw)||/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(raw))){alert('Bitte einen gültigen HEX-Wert (#RRGGBB) oder Farbnamen eingeben.');return;}
            updates[field.key]=raw;
          }else if(field.kind==='enum'){
            if(!field.values.includes(raw)&&raw!==String(c.external_options?.[field.key]??cardConfig?.[field.key]??'')){alert('Nicht unterstützter Wert für '+field.label);return;}
            updates[field.key]=raw;
          }else{
            if(!/^[a-zA-Z0-9_-]{1,64}$/.test(raw)){alert('Bitte einen gültigen Farbnamen für '+field.label+' eingeben.');return;}
            updates[field.key]=raw;
          }
        }
        c.external_options={...(c.external_options||{}),...updates};
        if(c.variant==='rotapfel_simple_thermcard'){const accent=overlay.querySelector('#d-therm-accent')?.value;if(accent)c.external_options.accent=accent;else delete c.external_options.accent;}
        for(const input of overlay.querySelectorAll('[data-design-color]')){
          const key=input.dataset.designColor;
          if(overlay.querySelector('[data-design-color-on="'+key+'"]')?.checked)c.external_options[key]=input.value;
          else delete c.external_options[key];
        }
      }
      if(!external)c.display={...originalDisplay,show_name:el('show-name').checked,show_entity_id:el('show-id').checked};
      overlay.remove();change();
    };
    preview();
  }
  pickEntity(current,callback){
    const allowed=['light','switch','sensor','binary_sensor','climate','cover','input_boolean'];
    const states=this._hass?.states||{};
    const entries=Object.keys(states).filter(id=>allowed.includes(id.split('.')[0])).sort();
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;background:#0009;z-index:9999;display:grid;place-items:center;padding:16px';
    overlay.innerHTML=`<div style="background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);padding:22px;border-radius:14px;width:min(560px,95vw);max-height:85vh;overflow:auto"><h2>Home Assistant Entität auswählen</h2><label>Suche<input id="entity-search" placeholder="Name oder entity_id" autocomplete="off"></label><label>Entitätstyp<select id="entity-domain"><option value="">Alle Typen</option>${allowed.map(x=>`<option>${x}</option>`).join('')}</select></label><label>Entität<select id="entity-select" size="12" style="height:250px"></select></label><div class="actions"><button id="entity-accept">Übernehmen</button><button class="secondary" id="entity-cancel">Abbrechen</button></div><p class="muted">Es werden nur Entitäten angezeigt, die Home Assistant aktuell an das Frontend liefert.</p></div>`;
    this.shadowRoot.appendChild(overlay);
    const search=overlay.querySelector('#entity-search'),domain=overlay.querySelector('#entity-domain'),select=overlay.querySelector('#entity-select');
    const refresh=()=>{const q=search.value.toLocaleLowerCase(),d=domain.value;const filtered=entries.filter(id=>(!d||id.startsWith(d+'.'))&&(id.toLowerCase().includes(q)||String(states[id]?.attributes?.friendly_name||'').toLowerCase().includes(q))).slice(0,500);select.replaceChildren(...filtered.map(id=>{const o=document.createElement('option');o.value=id;o.textContent=`${states[id]?.attributes?.friendly_name||id} · ${id}`;if(id===current)o.selected=true;return o;}));};
    search.oninput=refresh;domain.onchange=refresh;refresh();
    overlay.querySelector('#entity-cancel').onclick=()=>overlay.remove();
    overlay.querySelector('#entity-accept').onclick=()=>{if(select.value){callback(select.value);overlay.remove();}};
    overlay.addEventListener('click',ev=>{if(ev.target===overlay)overlay.remove();});search.focus();
  }

}
customElements.define('rotapfel-dashboard-manager',RotapfelDashboardManager);
