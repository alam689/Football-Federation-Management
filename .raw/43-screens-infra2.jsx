/* ===== screens-infra2.jsx ===== */
/* ---------- Sports Science: GPS/load · video pipeline · AI scouting ---------- */
function SportsScience() {
  const D = window.DATA3;
  const [tab, setTab] = React.useState('load');
  const riskColor = { 'Optimal':'var(--pos)', 'Monitor':'var(--warn)', 'High risk':'var(--neg)' };

  return (
    <div className="content-inner fade-in">
      <PageHead title="Sports Science & Performance" desc="GPS load monitoring · video analysis pipeline · AI scouting & talent ID">
        <div className="row" style={{ gap:6 }}>{['Catapult GPS','Hudl','AI/ML'].map(t=><span key={t} className="chip">{t}</span>)}</div>
      </PageHead>

      <div className="row" style={{ gap:8, marginBottom:'var(--gap)' }}>
        {[['load','GPS & load monitoring'],['video','Video analysis pipeline'],['scout','AI scouting & talent ID']].map(([k,l])=>
          <button key={k} className={'chip tab'+(tab===k?' on':'')} onClick={()=>setTab(k)}>{l}</button>)}
      </div>

      {tab==='load' && (
        <div>
          <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
            <Stat k="Avg distance / match" v="11.0 km" d="senior squad" dColor="var(--ink-3)" glyph="trend" />
            <Stat k="Squad in optimal zone" v={D.gpsLoad.filter(p=>p.status==='Optimal').length+' / '+D.gpsLoad.length} d="ACWR 0.8–1.3" glyph="health" />
            <Stat k="High-risk flags" v={D.gpsLoad.filter(p=>p.status==='High risk').length} d="load management" dColor="var(--neg)" glyph="bell" accent="var(--bff-red)" />
            <Stat k="GPS sessions logged" v="1,240" d="this season" dColor="var(--ink-3)" glyph="globe" />
          </div>
          <div className="card" style={{ overflow:'hidden' }}>
            <div className="card-pad" style={{ paddingBottom:12 }}><h3 style={{ fontSize:16 }}>Player load — last training block</h3></div>
            <table className="tbl">
              <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Player</th><th className="c">Distance</th><th className="c">Sprints</th><th className="c">High-speed (m)</th><th>Load</th><th className="c">ACWR</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Status</th></tr></thead>
              <tbody>
                {D.gpsLoad.map(p=>(
                  <tr key={p.name}>
                    <td style={{ paddingLeft:'var(--pad)' }}><div className="row" style={{ gap:10 }}><PosTag pos={p.pos} /><b style={{ whiteSpace:'nowrap' }}>{p.name}</b></div></td>
                    <td className="c num">{p.dist} km</td>
                    <td className="c num">{p.sprint}</td>
                    <td className="c num">{p.hsr}</td>
                    <td style={{ minWidth:120 }}><Bar v={p.load} color={riskColor[p.status]} /></td>
                    <td className="c num" style={{ fontWeight:800, color:riskColor[p.status] }}>{p.acwr.toFixed(2)}</td>
                    <td className="r" style={{ paddingRight:'var(--pad)' }}><Badge kind={p.status==='Optimal'?'pos':p.status==='Monitor'?'warn':'neg'} dot>{p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="card-pad" style={{ fontSize:11.5, color:'var(--ink-faint)', borderTop:'1px solid var(--line)' }}>ACWR = acute:chronic workload ratio. Sweet spot 0.8–1.3; above 1.5 indicates elevated injury risk.</div>
          </div>
        </div>
      )}

      {tab==='video' && (
        <div>
          <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
            <Stat k="Footage library" v="9,840 hrs" d="indexed & searchable" dColor="var(--ink-3)" glyph="globe" />
            <Stat k="Auto-tagged events" v="412k" d="AI computer vision" glyph="trend" />
            <Stat k="Clips published" v="1,260" d="to coaches & scouts" dColor="var(--ink-3)" glyph="check" />
            <Stat k="Turnaround" v="< 6 hrs" d="match → analysis" glyph="clock" accent="var(--bff-red)" />
          </div>
          <h3 style={{ fontSize:16, marginBottom:14 }}>Analysis pipeline</h3>
          <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
            {D.videoPipeline.map(col=>(
              <div key={col.stage} className="card" style={{ overflow:'hidden' }}>
                <div className="card-pad" style={{ paddingBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--line)' }}>
                  <div className="row" style={{ gap:8 }}><span style={{ width:9, height:9, borderRadius:'50%', background:col.color }}></span><b style={{ fontSize:13 }}>{col.stage}</b></div>
                  <span className="num" style={{ fontSize:12, color:'var(--ink-3)' }}>{col.items.length}</span>
                </div>
                <div style={{ padding:12, display:'flex', flexDirection:'column', gap:8, minHeight:120 }}>
                  {col.items.map((it,i)=>(
                    <div key={i} style={{ padding:'10px', background:'var(--surface-2)', borderRadius:9, borderLeft:`3px solid ${col.color}` }}>
                      <div style={{ fontWeight:700, fontSize:12.5, lineHeight:1.3 }}>{it.t}</div>
                      <div className="row" style={{ justifyContent:'space-between', marginTop:7 }}><span style={{ fontSize:11, color:'var(--ink-3)' }}>{it.meta}</span><span className="badge neutral" style={{ fontSize:10 }}>{it.tag}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='scout' && (
        <div>
          <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
            <Stat k="Profiles scanned" v={D.aiScoutStats.scanned} d="AI talent model" glyph="globe" />
            <Stat k="Flagged talents" v={D.aiScoutStats.flagged} d="meet thresholds" dColor="var(--ink-3)" glyph="star" accent="var(--bff-gold)" />
            <Stat k="Diaspora identified" v={D.aiScoutStats.diaspora} d="UK · ITA · USA · DEN" dColor="var(--ink-3)" glyph="trend" accent="var(--bff-red)" />
            <Stat k="On watchlist" v={D.aiScoutStats.watchlist} d="active tracking" glyph="search" />
          </div>
          <div className="card" style={{ overflow:'hidden' }}>
            <div className="card-pad" style={{ paddingBottom:12, display:'flex', justifyContent:'space-between' }}><h3 style={{ fontSize:16 }}>AI-ranked talent board</h3><Badge kind="info">Fit score = model match to national-team profile</Badge></div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              {D.aiScout.map((p,i)=>(
                <div key={p.name} className="row" style={{ gap:14, padding:'12px var(--pad)', borderTop:'1px solid var(--line)' }}>
                  <span className="num" style={{ width:22, fontWeight:800, fontSize:16, color:i===0?'var(--bff-gold)':'var(--ink-faint)' }}>{i+1}</span>
                  <Ring pct={p.fit} size={48} stroke={5} color={p.fit>=88?'var(--pos)':'var(--primary)'} />
                  <div style={{ flex:1 }}>
                    <div className="row" style={{ gap:8 }}><b style={{ fontSize:14.5 }}>{p.name}</b><PosTag pos={p.pos} /><span style={{ fontSize:18 }}>{p.flag}</span></div>
                    <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>{p.age}y · {p.region}</div>
                  </div>
                  <div className="row" style={{ gap:6, flexWrap:'wrap', maxWidth:280, justifyContent:'flex-end' }}>
                    {p.traits.map(t=><span key={t} className="chip" style={{ height:24, fontSize:11 }}>{t}</span>)}
                  </div>
                  <button className="btn ghost sm" onClick={async ()=>{ const ok=await confirmAction({ title:'Add to watchlist?', message:<>Add <b>{p.name}</b> to the scouting watchlist?</>, confirmLabel:'Add to watchlist', icon:'plus' }); if(ok) toast(`<b>${p.name}</b> added to watchlist`); }}><Icon name="plus" size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
window.SportsScience = SportsScience;

/* ---------- Infrastructure & Ecosystem ---------- */
function Infrastructure() {
  const D = window.DATA3;
  const stColor = (s) => s==='Smart-ready'?'pos':s==='Upgrading'?'warn':'neutral';
  const intColor = (s) => s==='Connected'?'pos':'warn';

  return (
    <div className="content-inner fade-in">
      <PageHead title="Infrastructure & Ecosystem" desc="Smart stadiums · national data center · integrations · exportable football tech">
        <button className="btn ghost sm" onClick={()=>toast('System architecture diagram opened')}><Icon name="dl" size={15} />Architecture</button>
      </PageHead>

      {/* data center hero */}
      <div className="card" style={{ overflow:'hidden', marginBottom:'var(--gap)' }}>
        <div style={{ background:'linear-gradient(120deg,#06303f,#0e6b8c)', color:'#fff', padding:'22px var(--pad)' }}>
          <div className="row" style={{ justifyContent:'space-between', flexWrap:'wrap', gap:16, alignItems:'center' }}>
            <div className="row" style={{ gap:14 }}>
              <div style={{ width:52, height:52, borderRadius:13, background:'#ffffff1f', display:'grid', placeItems:'center' }}><Icon name="globe" size={26} /></div>
              <div><div className="eyebrow" style={{ color:'#ffffffaa' }}>National Football Data Center</div><h2 style={{ fontSize:24, color:'#fff', marginTop:3 }}>Single source of football truth</h2></div>
            </div>
            <div className="row" style={{ gap:26 }}>
              {[['Uptime',D.dataCenter.uptime],['Records',D.dataCenter.records],['Daily events',D.dataCenter.dailyEvents],['Storage',D.dataCenter.storage]].map(([k,v])=>(
                <div key={k} style={{ textAlign:'center' }}><div className="num" style={{ fontSize:24, fontWeight:800 }}>{v}</div><div style={{ fontSize:10.5, opacity:.8, textTransform:'uppercase', letterSpacing:'.05em' }}>{k}</div></div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {D.dataCenter.nodes.map((n,i)=>(
            <div key={n.k} style={{ padding:'14px var(--pad)', borderRight:i<3?'1px solid var(--line)':'none' }}>
              <div className="num" style={{ fontWeight:800, fontSize:18 }}>{n.v}</div>
              <div style={{ fontSize:12, color:'var(--ink-3)' }}>{n.k}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns:'1.4fr 1fr', marginBottom:'var(--gap)' }}>
        {/* smart stadiums */}
        <SmartStadiums D={D} stColor={stColor} />

        {/* ecosystem map + maturity */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
          <div className="card card-pad">
            <h3 style={{ fontSize:16, marginBottom:14 }}>Integrated ecosystem</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>
              {D.ecosystem.map(e=>(
                <div key={e.node} style={{ padding:'11px', background:'var(--surface-2)', borderRadius:9, borderTop:`3px solid ${e.status==='live'?'var(--pos)':'var(--warn)'}` }}>
                  <div className="row" style={{ justifyContent:'space-between' }}><b style={{ fontSize:12.5 }}>{e.node}</b><span style={{ width:8, height:8, borderRadius:'50%', background:e.status==='live'?'var(--pos)':'var(--warn)' }}></span></div>
                  <div style={{ fontSize:11, color:'var(--ink-3)', marginTop:4, lineHeight:1.3 }}>{e.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-pad">
            <h3 style={{ fontSize:16, marginBottom:14 }}>Data-driven maturity</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
              {D.maturity.map(m=>(
                <div key={m.k}>
                  <div className="row" style={{ justifyContent:'space-between', marginBottom:4 }}><span style={{ fontSize:12.5, fontWeight:600 }}>{m.k}</span><span className="num" style={{ fontWeight:700, fontSize:12 }}>{m.pct}%</span></div>
                  <Bar v={m.pct} color={m.pct>=75?'var(--pos)':m.pct>=50?'var(--primary)':'var(--warn)'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns:'1fr 1fr' }}>
        {/* FIFA/AFC integrations */}
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}><h3 style={{ fontSize:16 }}>International integration</h3><Badge kind="info">FIFA · AFC</Badge></div>
          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
            {D.integrations.map(it=>(
              <div key={it.org} className="row" style={{ gap:12, padding:'10px 12px', border:'1px solid var(--line)', borderRadius:10 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:'var(--surface-3)', display:'grid', placeItems:'center', color:'var(--primary)', flex:'none' }}><Icon name={it.icon} size={16} /></div>
                <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{it.org}</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>{it.what}</div></div>
                <Badge kind={intColor(it.status)} dot>{it.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* exportable tech */}
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}><h3 style={{ fontSize:16 }}>Exportable football tech</h3><Badge kind="neutral">Revenue stream</Badge></div>
          <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {D.exportable.map(e=>(
              <div key={e.name} style={{ padding:'13px', background:'var(--surface-2)', borderRadius:11 }}>
                <div className="row" style={{ justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:'var(--primary)', color:'#fff', display:'grid', placeItems:'center' }}><Icon name="globe" size={15} /></div>
                  <span className="badge" style={{ background: e.stage==='Ready'?'color-mix(in srgb,var(--pos) 14%,transparent)':e.stage==='Pilot'?'color-mix(in srgb,var(--info) 12%,transparent)':'var(--surface-3)', color: e.stage==='Ready'?'var(--pos)':e.stage==='Pilot'?'var(--info)':'var(--ink-2)' }}>{e.stage}</span>
                </div>
                <div style={{ fontWeight:800, fontSize:13.5 }}>{e.name}</div>
                <div style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:4, lineHeight:1.35 }}>{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
window.Infrastructure = Infrastructure;

/* ---------- Smart stadiums: List/Map toggle + expandable systems checklist ---------- */
/* store: holds per-stadium edits (systems, status, smart) with persistence + subscribers */
const StadiumStore = (() => {
  const subs = new Set();
  const overrides = {};
  return {
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    bump() { subs.forEach(fn => fn()); },
    get(s) { return Object.assign({}, s, overrides[s.name] || {}); },
    save(name, patch) { overrides[name] = Object.assign({}, overrides[name], patch); this.bump(); },
  };
})();
function useStadiums() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => StadiumStore.subscribe(force), []);
  return StadiumStore;
}
window.StadiumStore = StadiumStore;

function SmartStadiums({ D, stColor }) {
  const store = useStadiums();
  const [view, setView] = React.useState('list');
  const [open, setOpen] = React.useState(null); // expanded stadium name
  const [pin, setPin] = React.useState(null);   // map-selected stadium

  const sysIcon = { live: { name:'check', color:'var(--pos)' }, progress: { name:'clock', color:'var(--warn)' }, planned: { name:'arrowr', color:'var(--ink-faint)' } };
  const smartColor = (v) => v > 80 ? 'var(--pos)' : v > 55 ? 'var(--primary)' : 'var(--warn)';
  const stadiums = D.stadiums.map(s => store.get(s));

  return (
    <div className="card card-pad">
      <div className="row" style={{ justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:8 }}>
        <h3 style={{ fontSize:16, whiteSpace:'nowrap' }}>Smart stadiums</h3>
        <div className="row" style={{ gap:8 }}>
          <span className="num badge neutral">{D.stadiumSummary.target}</span>
          <div className="row" style={{ gap:4, background:'var(--surface-3)', borderRadius:8, padding:3 }}>
            {[['list','List','cards'],['map','Map','pin']].map(([k,label,ic])=>(
              <button key={k} onClick={()=>setView(k)} className="row" style={{ gap:6, height:28, padding:'0 11px', borderRadius:6, border:'none', fontFamily:'inherit', fontSize:12.5, fontWeight:600, cursor:'pointer', background: view===k?'var(--surface)':'transparent', color: view===k?'var(--ink)':'var(--ink-3)', boxShadow: view===k?'var(--shadow-sm)':'none' }}>
                <Icon name={ic} size={14} />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* summary strip */}
      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
        {[['Venues',D.stadiumSummary.venues],['Smart-ready',D.stadiumSummary.smartReady],['Avg readiness',D.stadiumSummary.avgSmart+'%'],['Total seats',D.stadiumSummary.capacity]].map(([k,v])=>(
          <div key={k} style={{ padding:'10px 12px', background:'var(--surface-2)', borderRadius:10 }}>
            <div className="num" style={{ fontWeight:800, fontSize:18 }}>{v}</div>
            <div style={{ fontSize:11, color:'var(--ink-3)' }}>{k}</div>
          </div>
        ))}
      </div>

      {view === 'map' ? (
        <VenueMap D={D} stadiums={stadiums} pin={pin} setPin={setPin} smartColor={smartColor} stColor={stColor} sysIcon={sysIcon} />
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {stadiums.map(s=>{
            const isOpen = open === s.name;
            return (
              <div key={s.name} style={{ border:'1px solid var(--line)', borderRadius:11, overflow:'hidden', borderColor: isOpen?'var(--line-strong)':'var(--line)' }}>
                <div style={{ padding:'14px', cursor:'pointer' }} onClick={()=>setOpen(isOpen?null:s.name)}>
                  <div className="row" style={{ justifyContent:'space-between', marginBottom:9, gap:10 }}>
                    <div style={{ minWidth:0 }}>
                      <b style={{ fontSize:14, whiteSpace:'nowrap' }}>{s.name}</b>
                      <div style={{ fontSize:12, color:'var(--ink-3)' }}><Icon name="pin" size={12} style={{ verticalAlign:-2 }} /> {s.city} · {s.cap.toLocaleString()} seats</div>
                    </div>
                    <div className="row" style={{ gap:10 }}>
                      <Badge kind={stColor(s.status)} dot>{s.status}</Badge>
                      <Icon name="chevd" size={16} style={{ color:'var(--ink-3)', transform: isOpen?'rotate(180deg)':'none', transition:'transform .18s' }} />
                    </div>
                  </div>
                  <div className="row" style={{ gap:14, flexWrap:'wrap', marginBottom:10, fontSize:11.5, color:'var(--ink-3)' }}>
                    <span><b style={{ color:'var(--ink-2)' }}>Upgraded</b> {s.year}</span>
                    <span><b style={{ color:'var(--ink-2)' }}>Floodlight</b> {s.floodlux}</span>
                    <span><b style={{ color:'var(--ink-2)' }}>Pitch</b> {s.pitch}</span>
                    <span><b style={{ color:'var(--ink-2)' }}>Hosts</b> {s.host}</span>
                  </div>
                  <div className="row" style={{ gap:10 }}>
                    <div style={{ flex:1 }}><Bar v={s.smart} color={smartColor(s.smart)} /></div>
                    <span className="num" style={{ fontSize:12, fontWeight:800, width:64, textAlign:'right' }}>{s.smart}% smart</span>
                  </div>
                </div>
                {isOpen && <StadiumChecklist s={s} sysIcon={sysIcon} stColor={stColor} smartColor={smartColor} store={store} />}
              </div>
            );
          })}
        </div>
      )}

      {/* smart-systems rollout */}
      <hr className="divider" style={{ margin:'16px 0' }} />
      <div className="eyebrow" style={{ marginBottom:12 }}>Smart-systems rollout (network-wide)</div>
      <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
        {D.smartSystems.map(m=>(
          <div key={m.k}>
            <div className="row" style={{ justifyContent:'space-between', marginBottom:4 }}><span style={{ fontSize:12.5, fontWeight:600, whiteSpace:'nowrap' }}>{m.k}</span><span className="num" style={{ fontWeight:700, fontSize:12 }}>{m.pct}%</span></div>
            <Bar v={m.pct} color={m.pct>=70?'var(--pos)':m.pct>=50?'var(--primary)':'var(--warn)'} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Stylised Bangladesh venue map with interactive pins */
function VenueMap({ D, stadiums, pin, setPin, smartColor, stColor, sysIcon }) {
  const sel = stadiums.find(s => s.name === pin);
  return (
    <div>
      <div style={{ position:'relative', borderRadius:14, overflow:'hidden', background:'linear-gradient(160deg,#eaf3ee,#dcebe1)', border:'1px solid var(--line)', aspectRatio:'4/5' }}>
        {/* stylised country silhouette */}
        <svg viewBox="0 0 100 125" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} preserveAspectRatio="xMidYMid meet">
          <path d="M44 6 L58 8 L60 18 L70 20 L68 30 L78 26 L86 32 L80 42 L84 52 L74 58 L80 70 L72 80 L78 92 L70 104 L60 100 L58 112 L48 118 L44 108 L38 112 L34 100 L26 96 L32 84 L24 76 L30 64 L22 56 L30 46 L26 36 L36 34 L34 22 L42 20 Z"
            fill="color-mix(in srgb, var(--primary) 14%, transparent)" stroke="var(--primary)" strokeWidth="0.8" strokeLinejoin="round" />
          {/* rivers hint */}
          <path d="M50 20 Q52 45 44 70 Q40 90 48 110" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.5" />
          <path d="M64 34 Q58 56 62 80" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
        </svg>
        {/* pins */}
        {stadiums.map(s=>{
          const active = pin === s.name;
          return (
            <button key={s.name} onClick={()=>setPin(active?null:s.name)} title={s.name}
              style={{ position:'absolute', left:s.map.x+'%', top:s.map.y+'%', transform:'translate(-50%,-100%)', background:'none', border:'none', cursor:'pointer', zIndex: active?5:2, padding:0 }}>
              <div style={{ width: active?20:15, height: active?20:15, borderRadius:'50% 50% 50% 0', transform:'rotate(-45deg)', background:smartColor(s.smart), boxShadow:'0 2px 6px rgba(0,0,0,.35)', border:'2px solid #fff', transition:'all .15s' }}></div>
              {active && <div style={{ position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)', marginTop:6, whiteSpace:'nowrap', background:'var(--ink)', color:'#fff', fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:6 }}>{s.smart}% smart</div>}
            </button>
          );
        })}
        {/* legend */}
        <div style={{ position:'absolute', left:12, bottom:12, background:'var(--surface)', borderRadius:9, padding:'8px 11px', boxShadow:'var(--shadow-sm)', display:'flex', flexDirection:'column', gap:5 }}>
          {[['Smart-ready','var(--pos)'],['Upgrading','var(--primary)'],['Planned','var(--warn)']].map(([l,c])=>(
            <span key={l} className="row" style={{ gap:6, fontSize:10.5, color:'var(--ink-2)' }}><span style={{ width:9, height:9, borderRadius:'50% 50% 50% 0', transform:'rotate(-45deg)', background:c }}></span>{l}</span>
          ))}
        </div>
      </div>
      {/* selected venue detail / hint */}
      {sel ? (
        <div className="card fade-in" style={{ marginTop:12, padding:'14px', boxShadow:'none', border:'1px solid var(--line-strong)' }}>
          <div className="row" style={{ justifyContent:'space-between', marginBottom:8, gap:10 }}>
            <div style={{ minWidth:0 }}><b style={{ fontSize:14.5, whiteSpace:'nowrap' }}>{sel.name}</b><div style={{ fontSize:12, color:'var(--ink-3)' }}><Icon name="pin" size={12} style={{ verticalAlign:-2 }} /> {sel.city} · {sel.region} · {sel.cap.toLocaleString()} seats</div></div>
            <Badge kind={stColor(sel.status)} dot>{sel.status}</Badge>
          </div>
          <div className="row" style={{ gap:10, marginBottom:10 }}>
            <div style={{ flex:1 }}><Bar v={sel.smart} color={smartColor(sel.smart)} /></div>
            <span className="num" style={{ fontSize:12, fontWeight:800, width:64, textAlign:'right' }}>{sel.smart}% smart</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', gap:7 }}>
            {sel.systems.map(sys=>{ const m=sysIcon[sys.s]; return (
              <div key={sys.k} className="row" style={{ gap:8, fontSize:12 }}>
                <Icon name={m.name} size={13} color={m.color} style={{ flex:'none' }} />
                <span style={{ color: sys.s==='live'?'var(--ink-2)':'var(--ink)' }}>{sys.k}</span>
              </div>
            ); })}
          </div>
        </div>
      ) : (
        <div style={{ marginTop:12, textAlign:'center', fontSize:12.5, color:'var(--ink-3)' }}>Tap a pin to see venue systems & readiness.</div>
      )}
    </div>
  );
}
window.SmartStadiums = SmartStadiums;

/* Editable systems checklist for one stadium (view + edit modes) */
const STATUS_CYCLE = ['live', 'progress', 'planned'];
const STATUS_LABEL = { live:'Live', progress:'In progress', planned:'Planned' };
const STADIUM_STATUSES = ['Smart-ready', 'Upgrading', 'Planned'];
const GALLERY_TIERS = ['VIP Box', 'Premium Stand', 'Grandstand', 'General'];
const GALLERY_STATUS = ['Open', 'Limited', 'Closed'];
const GAL_ST_COLOR = { Open:'var(--pos)', Limited:'var(--warn)', Closed:'var(--neg)' };
function defaultGalleries(s) {
  const c = s.cap;
  return [
    { name:'VIP / Corporate Box', tier:'VIP Box', cap: Math.round(c*0.03), covered:true, status:'Open' },
    { name:'North Premium Stand', tier:'Premium Stand', cap: Math.round(c*0.16), covered:true, status:'Open' },
    { name:'East Grandstand', tier:'Grandstand', cap: Math.round(c*0.20), covered:true, status:'Open' },
    { name:'West Grandstand', tier:'Grandstand', cap: Math.round(c*0.16), covered:false, status:'Open' },
    { name:'South General Gallery', tier:'General', cap: c - Math.round(c*0.03) - Math.round(c*0.16) - Math.round(c*0.20) - Math.round(c*0.16), covered:false, status:'Open' },
  ];
}

function StadiumChecklist({ s, sysIcon, stColor, smartColor, store }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(null);
  const [newItem, setNewItem] = React.useState('');

  const begin = () => { setDraft({ systems: s.systems.map(x => ({ ...x })), status: s.status, smart: s.smart, galleries: (s.galleries || defaultGalleries(s)).map(g => ({ ...g })) }); setEditing(true); };
  const cancel = () => { setEditing(false); setDraft(null); setNewItem(''); };

  const cycle = (i) => { const d = { ...draft, systems: draft.systems.map((x, j) => j === i ? { ...x, s: STATUS_CYCLE[(STATUS_CYCLE.indexOf(x.s) + 1) % 3] } : x) }; setDraft(d); };
  const rename = (i, val) => setDraft({ ...draft, systems: draft.systems.map((x, j) => j === i ? { ...x, k: val } : x) });
  const remove = (i) => setDraft({ ...draft, systems: draft.systems.filter((_, j) => j !== i) });
  const add = () => { if (!newItem.trim()) { toast('Enter a system name', 'muted'); return; } setDraft({ ...draft, systems: [...draft.systems, { k: newItem.trim(), s: 'planned' }] }); setNewItem(''); };

  // gallery editing
  const gEdit = (i, patch) => setDraft({ ...draft, galleries: draft.galleries.map((g, j) => j === i ? { ...g, ...patch } : g) });
  const gCycleStatus = (i) => { const g = draft.galleries[i]; gEdit(i, { status: GALLERY_STATUS[(GALLERY_STATUS.indexOf(g.status) + 1) % 3] }); };
  const gCycleTier = (i) => { const g = draft.galleries[i]; gEdit(i, { tier: GALLERY_TIERS[(GALLERY_TIERS.indexOf(g.tier) + 1) % GALLERY_TIERS.length] }); };
  const gRemove = (i) => setDraft({ ...draft, galleries: draft.galleries.filter((_, j) => j !== i) });
  const gAdd = () => setDraft({ ...draft, galleries: [...draft.galleries, { name: 'New stand', tier: 'General', cap: 0, covered: false, status: 'Open' }] });

  const save = async () => {
    const live = draft.systems.filter(x => x.s === 'live').length;
    const totalCap = draft.galleries.reduce((s2, g) => s2 + (+g.cap || 0), 0);
    const ok = await confirmAction({
      title: 'Save stadium update?',
      message: <>Update <b>{s.name}</b>’s status, readiness, systems & seating galleries?</>,
      detail: `Status: ${draft.status} · ${draft.smart}% smart · ${live}/${draft.systems.length} systems · ${totalCap.toLocaleString()} seats across ${draft.galleries.length} galleries`,
      confirmLabel: 'Save changes', icon: 'check',
    });
    if (!ok) return;
    store.save(s.name, { systems: draft.systems, status: draft.status, smart: +draft.smart, galleries: draft.galleries.map(g => ({ ...g, cap: +g.cap || 0 })), cap: totalCap });
    setEditing(false); setDraft(null);
    toast(`<b>${s.name}</b> updated · ${totalCap.toLocaleString()} seats synced to E-ticketing`);
  };

  const view = editing ? draft : s;
  const galleries = editing ? draft.galleries : (s.galleries || defaultGalleries(s));
  const galleryCap = galleries.reduce((a, g) => a + (+g.cap || 0), 0);
  const tierColor = (tier) => { const t = (window.DATA3.ticketTiers || []).find(x => x.name === tier); return t ? t.color : 'var(--ink-3)'; };
  const done = view.systems.filter(x => x.s === 'live').length;
  const inp = { height:34, borderRadius:8, border:'1px solid var(--line-strong)', padding:'0 10px', fontFamily:'inherit', fontSize:12.5, color:'var(--ink)', background:'var(--surface)', outline:'none', width:'100%' };

  return (
    <div className="fade-in" style={{ padding:'4px 14px 16px', borderTop:'1px solid var(--line)' }} onClick={e=>e.stopPropagation()}>
      <div className="row" style={{ justifyContent:'space-between', margin:'12px 0 10px', gap:10 }}>
        <div className="eyebrow">Systems checklist</div>
        <div className="row" style={{ gap:10 }}>
          <span className="num" style={{ fontSize:11.5, color:'var(--ink-3)' }}>{done}/{view.systems.length} operational</span>
          {!editing && <button className="btn ghost sm" onClick={begin}><Icon name="edit" size={13} /> Update</button>}
        </div>
      </div>

      {/* edit-only: stadium status + readiness */}
      {editing && (
        <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14, padding:'12px', background:'var(--surface-2)', borderRadius:10 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom:7 }}>Stadium status</div>
            <div className="row" style={{ gap:6, flexWrap:'wrap' }}>
              {STADIUM_STATUSES.map(st=>(
                <button key={st} className={'chip tab'+(draft.status===st?' on':'')} onClick={()=>setDraft({ ...draft, status:st })}>{st}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom:7 }}>Readiness · {draft.smart}%</div>
            <input type="range" min="0" max="100" value={draft.smart} onChange={e=>setDraft({ ...draft, smart:+e.target.value })} style={{ width:'100%', accentColor: smartColor(draft.smart) }} />
          </div>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: editing?'1fr':'1fr 1fr', gap:8 }}>
        {view.systems.map((sys,i)=>{
          const m = sysIcon[sys.s];
          if (editing) return (
            <div key={i} className="row" style={{ gap:8, padding:'7px 9px', background:'var(--surface-2)', borderRadius:9 }}>
              <button title="Cycle status" onClick={()=>cycle(i)} className="row" style={{ gap:6, flex:'none', height:28, padding:'0 9px', borderRadius:7, border:'none', cursor:'pointer', background:'color-mix(in srgb,'+m.color+' 15%,transparent)', color:m.color, fontFamily:'inherit', fontSize:11, fontWeight:700, minWidth:104, justifyContent:'flex-start' }}>
                <Icon name={m.name} size={12} />{STATUS_LABEL[sys.s]}
              </button>
              <input style={inp} value={sys.k} onChange={e=>rename(i, e.target.value)} />
              <button className="icon-btn" title="Remove" style={{ width:28, height:28, flex:'none', borderColor:'transparent' }} onClick={()=>remove(i)}><span style={{ fontSize:16, color:'var(--ink-3)', lineHeight:1 }}>×</span></button>
            </div>
          );
          return (
            <div key={i} className="row" style={{ gap:9, padding:'9px 11px', background:'var(--surface-2)', borderRadius:9 }}>
              <div style={{ width:20, height:20, flex:'none', borderRadius:6, background:'color-mix(in srgb,'+m.color+' 15%,transparent)', color:m.color, display:'grid', placeItems:'center' }}><Icon name={m.name} size={12} /></div>
              <span style={{ flex:1, fontSize:12.5, fontWeight: sys.s==='live'?500:600, color: sys.s==='live'?'var(--ink-2)':'var(--ink)' }}>{sys.k}</span>
              <span style={{ fontSize:10.5, fontWeight:700, color:m.color }}>{STATUS_LABEL[sys.s]}</span>
            </div>
          );
        })}
      </div>

      {/* Galleries / seating (E-ticketing integration) */}
      <div className="row" style={{ justifyContent:'space-between', margin:'18px 0 10px', gap:10 }}>
        <div className="eyebrow">Galleries &amp; seat capacity</div>
        <span className="num" style={{ fontSize:11.5, color:'var(--ink-3)' }}>{galleryCap.toLocaleString()} seats · {galleries.length} stands</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {galleries.map((g,i)=>{
          if (editing) return (
            <div key={i} className="row" style={{ gap:7, padding:'7px 9px', background:'var(--surface-2)', borderRadius:9, flexWrap:'wrap' }}>
              <input style={{ ...inp, flex:'2 1 150px', width:'auto' }} value={g.name} onChange={e=>gEdit(i,{ name:e.target.value })} placeholder="Stand name" />
              <button title="Ticket tier" onClick={()=>gCycleTier(i)} className="row" style={{ gap:6, flex:'none', height:34, padding:'0 9px', borderRadius:7, border:'1px solid '+tierColor(g.tier), cursor:'pointer', background:'color-mix(in srgb,'+tierColor(g.tier)+' 12%,transparent)', color:'var(--ink)', fontFamily:'inherit', fontSize:11, fontWeight:700 }}>
                <span style={{ width:9, height:9, borderRadius:3, background:tierColor(g.tier) }}></span>{g.tier}
              </button>
              <input style={{ ...inp, width:78, flex:'none', textAlign:'right' }} inputMode="numeric" value={g.cap} onChange={e=>gEdit(i,{ cap:e.target.value.replace(/[^0-9]/g,'') })} placeholder="seats" />
              <button title="Covered?" onClick={()=>gEdit(i,{ covered:!g.covered })} className="chip" style={{ height:34, cursor:'pointer', whiteSpace:'nowrap' }}>{g.covered?'Covered':'Open-air'}</button>
              <button title="Status" onClick={()=>gCycleStatus(i)} className="row" style={{ gap:5, flex:'none', height:34, padding:'0 9px', borderRadius:7, border:'none', cursor:'pointer', background:'color-mix(in srgb,'+GAL_ST_COLOR[g.status]+' 14%,transparent)', color:GAL_ST_COLOR[g.status], fontFamily:'inherit', fontSize:11, fontWeight:700 }}>{g.status}</button>
              <button className="icon-btn" title="Remove" style={{ width:28, height:28, flex:'none', borderColor:'transparent' }} onClick={()=>gRemove(i)}><span style={{ fontSize:16, color:'var(--ink-3)', lineHeight:1 }}>×</span></button>
            </div>
          );
          return (
            <div key={i} className="row" style={{ gap:11, padding:'9px 11px', background:'var(--surface-2)', borderRadius:9 }}>
              <span style={{ width:11, height:11, borderRadius:3, background:tierColor(g.tier), flex:'none' }}></span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:13, whiteSpace:'nowrap' }}>{g.name}</div>
                <div style={{ fontSize:11, color:'var(--ink-3)' }}>{g.tier} · {g.covered?'Covered':'Open-air'}</div>
              </div>
              <span className="badge" style={{ background:'color-mix(in srgb,'+GAL_ST_COLOR[g.status]+' 13%,transparent)', color:GAL_ST_COLOR[g.status] }}>{g.status}</span>
              <span className="num" style={{ fontWeight:800, fontSize:13.5, width:70, textAlign:'right' }}>{(+g.cap).toLocaleString()}</span>
            </div>
          );
        })}
      </div>
      {editing && <button className="btn ghost sm" style={{ marginTop:8 }} onClick={gAdd}><Icon name="plus" size={14} />Add gallery</button>}
      {!editing && <div className="row" style={{ gap:7, marginTop:9, fontSize:11.5, color:'var(--ink-faint)' }}><Icon name="ticket" size={13} /> Gallery capacities &amp; tiers sync to the E-ticketing seat map.</div>}

      {editing && (
        <>
          <div className="row" style={{ gap:8, marginTop:14 }}>
            <input style={{ ...inp, height:36 }} placeholder="Add a system (e.g. Solar power array)" value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} />
            <button className="btn ghost sm" onClick={add}><Icon name="plus" size={14} />Add system</button>
          </div>
          <div className="row" style={{ gap:8, justifyContent:'flex-end', marginTop:14 }}>
            <button className="btn ghost sm" onClick={cancel}>Cancel</button>
            <button className="btn sm" onClick={save}><Icon name="check" size={14} />Save changes</button>
          </div>
        </>
      )}
    </div>
  );
}
window.StadiumChecklist = StadiumChecklist;

