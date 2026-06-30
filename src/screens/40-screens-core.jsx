/* Auto-ported screen module. Registry import publishes shared UI primitives
   onto window before this module body destructures them. */
import '../lib/registry.js';
import React from 'react';
const {
  Icon, Avatar, PosTag, Flag, Stat, Badge, Bar, Spark, PageHead, RatingPill, ratingColor, QR, Ring,
  downloadTicketPNG, downloadTicketPDF, RosterStore, useRoster, toast, DataStore, useData, Modal, Field,
  TextInput, SelectInput, PlayerForm, PlayerPicker, confirmAction, ConfirmRoot, HIGHLIGHT_VIDEOS, highlightFor,
  HighlightsCard, PlayerPhoto, useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider, TweakToggle,
  TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton, ROLES, AuthStore, useAuth, LoginScreen,
} = window;

/* ===== screens-core.jsx ===== */
/* Bundled core screens: dashboard, search, profile, teams, fixtures, records, management */

/* ===== screens-home.jsx ===== */
/* Dashboard / overview */
function Dashboard({ go }) {
  const D = window.DATA;
  const upcoming = D.fixtures.filter(f => f.status === 'Upcoming').slice(0, 4);
  const results = D.fixtures.filter(f => f.status === 'Result').slice(0, 3);

  const actIcon = { check:'check', users:'users', health:'health', star:'star', cal:'cal' };

  return (
    <div className="content-inner fade-in">
      <PageHead title="Federation Overview" desc="Bangladesh Football Federation · Season 2025–26 control center">
        <button className="btn ghost sm" onClick={()=>toast('Dashboard summary exported to PDF')}><Icon name="dl" size={15} />Export</button>
        <button className="btn sm" onClick={() => go('search')}><Icon name="search" size={15} />Find a player</button>
      </PageHead>

      {/* hero strip */}
      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', marginBottom: 'var(--gap)' }}>
        <div className="card" style={{ background:'linear-gradient(120deg, var(--primary-deep), var(--primary))', color:'#fff', position:'relative', overflow:'hidden', borderColor:'transparent', cursor:'pointer' }} onClick={()=>go('matchcenter')}>
          <div style={{ position:'absolute', right:-40, top:-40, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,.07)' }}></div>
          <div style={{ position:'absolute', right:40, bottom:-60, width:160, height:160, borderRadius:'50%', background:'rgba(238,41,57,.25)' }}></div>
          <div className="card-pad" style={{ position:'relative' }}>
            <div className="eyebrow" style={{ color:'#ffffffaa' }}>Next major fixture</div>
            <div className="row" style={{ justifyContent:'space-between', marginTop:18, alignItems:'center' }}>
              <div style={{ textAlign:'center', flex:1 }}>
                <Flag e="🇧🇩" size={46} />
                <div className="num" style={{ fontWeight:800, fontSize:18, marginTop:8 }}>Bangladesh</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div className="num" style={{ fontWeight:800, fontSize:14, opacity:.8 }}>SAFF FINAL</div>
                <div className="num" style={{ fontWeight:800, fontSize:34, letterSpacing:'.05em' }}>VS</div>
                <div className="num" style={{ fontSize:12, opacity:.8 }}>Jun 9 · 19:30</div>
              </div>
              <div style={{ textAlign:'center', flex:1 }}>
                <Flag e="🇳🇵" size={46} />
                <div className="num" style={{ fontWeight:800, fontSize:18, marginTop:8 }}>Nepal</div>
              </div>
            </div>
            <div className="row" style={{ justifyContent:'space-between', marginTop:18, fontSize:13, opacity:.9 }}>
              <span><Icon name="pin" size={14} style={{ verticalAlign:-2, marginRight:4 }} />Dasharath Stadium, Kathmandu</span>
              <span className="chip solid" style={{ background:'var(--bff-red)' }}>Women's Senior</span>
            </div>
          </div>
        </div>

        <div className="card card-pad" style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', cursor:'pointer' }} onClick={()=>go('records')}>
          <div className="row" style={{ justifyContent:'space-between' }}>
            <div className="eyebrow">FIFA World Ranking</div>
            <Badge kind="info" dot>Updated Jun '26</Badge>
          </div>
          <div className="row" style={{ gap:22, marginTop:10 }}>
            <div>
              <div className="num" style={{ fontSize:13, color:'var(--ink-3)', fontWeight:700 }}>MEN</div>
              <div className="num" style={{ fontSize:44, fontWeight:800, lineHeight:1 }}>184<span style={{ fontSize:18, color:'var(--ink-3)' }}>th</span></div>
              <div className="badge pos" style={{ marginTop:6 }}><Icon name="trend" size={12} />+1</div>
            </div>
            <div style={{ width:1, alignSelf:'stretch', background:'var(--line)' }}></div>
            <div>
              <div className="num" style={{ fontSize:13, color:'var(--bff-red)', fontWeight:700 }}>WOMEN</div>
              <div className="num" style={{ fontSize:44, fontWeight:800, lineHeight:1 }}>128<span style={{ fontSize:18, color:'var(--ink-3)' }}>th</span></div>
              <div className="badge pos" style={{ marginTop:6 }}><Icon name="trend" size={12} />+4</div>
            </div>
          </div>
          <Spark data={[150,148,145,140,135,132,130,128]} />
        </div>
      </div>

      {/* stat row */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Registered players" v="18,420" d="+312 this month" glyph="users" onClick={()=>go('management')} />
        <Stat k="National team pool" v="172" d="across 7 squads" dColor="var(--ink-3)" glyph="shield" accent="var(--bff-red)" onClick={()=>go('teams')} />
        <Stat k="Active fixtures" v="11" d="5 upcoming · 6 played" dColor="var(--ink-3)" glyph="cal" onClick={()=>go('fixtures')} />
        <Stat k="Registered clubs" v="64" d="Premier + Championship" dColor="var(--ink-3)" glyph="trophy" accent="var(--bff-gold)" onClick={()=>go('clubs')} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.7fr 1fr' }}>
        {/* upcoming */}
        <div className="card">
          <div className="card-pad row" style={{ justifyContent:'space-between', paddingBottom:12 }}>
            <h3 style={{ fontSize:17 }}>Upcoming fixtures</h3>
            <button className="chip tab" onClick={() => go('fixtures')}>View all <Icon name="chev" size={13} /></button>
          </div>
          <hr className="divider" />
          {upcoming.map(f => (
            <div key={f.id} className="row" style={{ padding:'12px var(--pad)', borderBottom:'1px solid var(--line)', gap:14, cursor:'pointer' }} onClick={() => go('fixtures')}>
              <div style={{ textAlign:'center', width:54 }}>
                <div className="num" style={{ fontWeight:800, fontSize:15 }}>{new Date(f.date).toLocaleDateString('en',{day:'2-digit'})}</div>
                <div className="num" style={{ fontSize:11, color:'var(--ink-3)', textTransform:'uppercase' }}>{new Date(f.date).toLocaleDateString('en',{month:'short'})}</div>
              </div>
              <div style={{ width:1, alignSelf:'stretch', background:'var(--line)' }}></div>
              <div style={{ flex:1 }}>
                <div className="row" style={{ gap:8, fontWeight:700, fontSize:14.5 }}>
                  <Flag e={f.hf} size={20} />{f.home} <span style={{ color:'var(--ink-faint)', fontWeight:500 }}>vs</span> {f.away}<Flag e={f.af} size={20} />
                </div>
                <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>{f.comp} · {f.stage}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div className="num" style={{ fontWeight:700, fontSize:14 }}>{f.time}</div>
                {f.tickets && <div className="badge pos" style={{ marginTop:4 }}>Tickets</div>}
              </div>
            </div>
          ))}
        </div>

        {/* activity */}
        <div className="card">
          <div className="card-pad" style={{ paddingBottom:12 }}><h3 style={{ fontSize:17 }}>Recent activity</h3></div>
          <hr className="divider" />
          <div className="card-pad" style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {D.activity.map((a, i) => (
              <div key={i} className="row" style={{ alignItems:'flex-start', gap:12 }}>
                <div style={{ width:34, height:34, flex:'none', borderRadius:9, background:'var(--surface-3)', display:'grid', placeItems:'center', color:'var(--primary)' }}>
                  <Icon name={actIcon[a.icon]} size={16} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13.5, lineHeight:1.4 }}><b>{a.who}</b> {a.act}</div>
                  <div className="row" style={{ gap:8, marginTop:4 }}>
                    <span className="badge neutral">{a.tag}</span>
                    <span style={{ fontSize:11.5, color:'var(--ink-faint)' }}>{a.t}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* recent results + dev mini */}
      <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', marginTop:'var(--gap)' }}>
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}><h3 style={{ fontSize:17 }}>Latest results</h3><button className="chip tab" onClick={()=>go('records')}>Records</button></div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {results.map(f => {
              const win = f.hs > f.as && f.home==='Bangladesh' || f.as > f.hs && f.away==='Bangladesh';
              const draw = f.hs === f.as;
              return (
                <div key={f.id} className="row" style={{ gap:12, padding:'8px 0' }}>
                  <Badge kind={draw?'warn':win?'pos':'neg'}>{draw?'D':win?'W':'L'}</Badge>
                  <div style={{ flex:1, fontSize:13.5, fontWeight:600 }} className="row"><Flag e={f.hf} size={18} /> {f.home} <span className="num" style={{ margin:'0 6px' }}>{f.hs}–{f.as}</span> {f.away} <Flag e={f.af} size={18} /></div>
                  <span style={{ fontSize:12, color:'var(--ink-3)' }}>{f.stage}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}><h3 style={{ fontSize:17 }}>Development pipeline</h3><button className="chip tab" onClick={()=>go('development')}>Open</button></div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120 }}>
            {D.pathway.map((s,i) => (
              <div key={i} style={{ flex:1, textAlign:'center' }}>
                <div style={{ height: 30 + (s.players/14200)*70, background:s.color, borderRadius:'6px 6px 0 0', opacity:.9 }}></div>
                <div className="num" style={{ fontSize:11, fontWeight:700, marginTop:6 }}>{s.players>999?(s.players/1000).toFixed(1)+'k':s.players}</div>
                <div style={{ fontSize:9.5, color:'var(--ink-3)' }}>{s.age.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player Hunt CTA */}
      <div className="card" style={{ marginTop:'var(--gap)', overflow:'hidden', background:'linear-gradient(120deg, var(--primary-deep), var(--primary))', color:'#fff', borderColor:'transparent', cursor:'pointer' }} onClick={()=>go('hunt')}>
        <div className="card-pad row" style={{ justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div className="row" style={{ gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:13, background:'#ffffff1f', display:'grid', placeItems:'center', flex:'none' }}><Icon name="star" size={24} /></div>
            <div>
              <div className="eyebrow" style={{ color:'#ffffffcc' }}>Player Hunt · open trials</div>
              <div style={{ fontWeight:800, fontSize:18, marginTop:2 }}>Scouting boys & girls for U-13 to U-23</div>
              <div style={{ fontSize:13, opacity:.88, marginTop:3 }}>Review skill-video submissions and finalize age-group squads.</div>
            </div>
          </div>
          <div className="row" style={{ gap:22 }}>
            <div style={{ textAlign:'center' }}><div className="num" style={{ fontSize:26, fontWeight:800 }}>16</div><div style={{ fontSize:10.5, opacity:.8 }}>REGISTRATIONS</div></div>
            <div style={{ textAlign:'center' }}><div className="num" style={{ fontSize:26, fontWeight:800 }}>10</div><div style={{ fontSize:10.5, opacity:.8 }}>TO REVIEW</div></div>
            <button className="btn ghost sm" style={{ background:'#fff', color:'var(--primary-deep)', borderColor:'transparent' }}>Open board <Icon name="arrowr" size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Dashboard = Dashboard;


/* ===== screens-players.jsx ===== */
/* Player Search / scouting board */
function PlayerSearch({ go }) {
  const D = window.DATA;
  const roster = useRoster();
  const [q, setQ] = React.useState('');
  const [pos, setPos] = React.useState('All');
  const [gender, setGender] = React.useState('All');
  const [sort, setSort] = React.useState('rating');
  const [view, setView] = React.useState('grid');
  const [showShort, setShowShort] = React.useState(false);
  const [adv, setAdv] = React.useState(false);
  const [minRating, setMinRating] = React.useState(0);
  const [maxAge, setMaxAge] = React.useState(40);
  const [foot, setFoot] = React.useState('All');
  const [prospectsOnly, setProspectsOnly] = React.useState(false);

  const positions = ['All', 'GK', 'DF', 'MF', 'FW'];
  let list = D.allPlayers.filter(p => {
    if (pos !== 'All' && p.pos !== pos) return false;
    if (gender !== 'All') {
      const isW = D.womenSenior.includes(p);
      if (gender === 'Women' && !isW) return false;
      if (gender === 'Men' && isW) return false;
    }
    if (showShort && !roster.has('shortlist', p.id)) return false;
    if (minRating && p.rating < minRating) return false;
    if (maxAge < 40 && p.age > maxAge) return false;
    if (foot !== 'All' && p.foot !== foot) return false;
    if (prospectsOnly && !p.prospect) return false;
    if (q && !(p.name.toLowerCase().includes(q.toLowerCase()) || p.club.toLowerCase().includes(q.toLowerCase()) || p.district.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });
  list = [...list].sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'age' ? a.age - b.age : sort === 'caps' ? b.caps - a.caps : a.name.localeCompare(b.name));

  return (
    <div className="content-inner fade-in">
      <PageHead title="Player Search & Scouting" desc={`${D.allPlayers.length} players in the national pool · scout, shortlist & compare`}>
        <button className="btn ghost sm" onClick={()=>setShowShort(s=>!s)} style={showShort?{ borderColor:'var(--bff-red)', color:'var(--bff-red)' }:{}}><Icon name="heart" size={15} fill={showShort?'var(--bff-red)':undefined} />Shortlist ({roster.count('shortlist')})</button>
        <button className="btn sm" onClick={()=>setAdv(a=>!a)} style={adv?{ filter:'brightness(0.92)' }:{}}><Icon name="filter" size={15} />Advanced</button>
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns: '244px 1fr', alignItems:'start' }}>
        {/* filter rail */}
        <div className="card card-pad" style={{ position:'sticky', top:0, display:'flex', flexDirection:'column', gap:18 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom:8 }}>Gender</div>
            <div className="row" style={{ gap:6 }}>
              {['All','Men','Women'].map(g => <button key={g} className={'chip tab' + (gender===g?' on':'')} onClick={()=>setGender(g)}>{g}</button>)}
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom:8 }}>Position</div>
            <div className="row" style={{ gap:6, flexWrap:'wrap' }}>
              {positions.map(p => <button key={p} className={'chip tab' + (pos===p?' on':'')} onClick={()=>setPos(p)}>{p}</button>)}
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom:8 }}>Sort by</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {[['rating','Rating'],['caps','Caps'],['age','Age (young)'],['name','Name A–Z']].map(([k,l]) =>
                <label key={k} className="row" style={{ gap:8, cursor:'pointer', fontSize:13.5 }}>
                  <input type="radio" name="sort" checked={sort===k} onChange={()=>setSort(k)} style={{ accentColor:'var(--primary)' }} />{l}
                </label>)}
            </div>
          </div>
          <hr className="divider" />
          <div style={{ fontSize:12.5, color:'var(--ink-3)' }}>
            <div className="row" style={{ justifyContent:'space-between' }}><span>Showing</span><b className="num" style={{ color:'var(--ink)' }}>{list.length}</b></div>
            <div className="row" style={{ justifyContent:'space-between', marginTop:6 }}><span>Avg rating</span><b className="num" style={{ color:'var(--ink)' }}>{(list.reduce((s,p)=>s+p.rating,0)/(list.length||1)).toFixed(2)}</b></div>
          </div>
        </div>

        {/* results */}
        <div>
          <div className="card card-pad row" style={{ justifyContent:'space-between', marginBottom:'var(--gap)' }}>
            <div className="search-global" style={{ maxWidth:'none', flex:1 }}>
              <Icon name="search" size={17} />
              <input placeholder="Search by name, club or district…" value={q} onChange={e=>setQ(e.target.value)} />
            </div>
            <div className="row" style={{ gap:6, marginLeft:12 }}>
              <button className={'icon-btn' + (view==='grid'?'':'')} style={{ borderColor: view==='grid'?'var(--primary)':'var(--line)', color: view==='grid'?'var(--primary)':'var(--ink-3)' }} onClick={()=>setView('grid')}><Icon name="grid" size={16} /></button>
              <button className="icon-btn" style={{ borderColor: view==='list'?'var(--primary)':'var(--line)', color: view==='list'?'var(--primary)':'var(--ink-3)' }} onClick={()=>setView('list')}><Icon name="cards" size={16} /></button>
            </div>
          </div>

          {adv && (
            <div className="card card-pad fade-in" style={{ marginBottom:'var(--gap)' }}>
              <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}>
                <h3 style={{ fontSize:15 }}>Advanced filters</h3>
                <button className="chip tab" onClick={()=>{ setMinRating(0); setMaxAge(40); setFoot('All'); setProspectsOnly(false); }}>Reset</button>
              </div>
              <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom:8 }}>Min rating · {minRating?minRating.toFixed(1):'any'}</div>
                  <input type="range" min="0" max="8.5" step="0.1" value={minRating} onChange={e=>setMinRating(+e.target.value)} style={{ width:'100%', accentColor:'var(--primary)' }} />
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom:8 }}>Max age · {maxAge>=40?'any':maxAge}</div>
                  <input type="range" min="16" max="40" step="1" value={maxAge} onChange={e=>setMaxAge(+e.target.value)} style={{ width:'100%', accentColor:'var(--primary)' }} />
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom:8 }}>Preferred foot</div>
                  <div className="row" style={{ gap:6 }}>{['All','Right','Left'].map(f=><button key={f} className={'chip tab'+(foot===f?' on':'')} onClick={()=>setFoot(f)}>{f}</button>)}</div>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom:8 }}>Status</div>
                  <button className={'chip tab'+(prospectsOnly?' on':'')} onClick={()=>setProspectsOnly(v=>!v)}>Prospects only</button>
                </div>
              </div>
            </div>
          )}

          {list.length === 0 ? (
            <div className="card card-pad" style={{ textAlign:'center', color:'var(--ink-3)', padding:'44px 20px' }}>
              <Icon name="search" size={28} color="var(--ink-faint)" />
              <div style={{ marginTop:10, fontWeight:700, color:'var(--ink)' }}>{showShort ? 'Your shortlist is empty' : 'No players match these filters'}</div>
              <div style={{ fontSize:13, marginTop:4 }}>{showShort ? 'Tap “Shortlist” on a player to add them here.' : 'Try widening your filters or resetting Advanced.'}</div>
            </div>
          ) : view === 'grid' ? (
            <div className="grid" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(232px,1fr))' }}>
              {list.map(p => <PlayerCard key={p.id} p={p} go={go} />)}
            </div>
          ) : (
            <div className="card" style={{ overflow:'hidden' }}>
              <table className="tbl">
                <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Player</th><th>Pos</th><th>Club</th><th className="c">Age</th><th className="c">Caps</th><th className="c">Goals</th><th className="c">Rating</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Actions</th></tr></thead>
                <tbody>
                  {list.map(p => (
                    <tr key={p.id} onClick={()=>go('profile', p.id)}>
                      <td style={{ paddingLeft:'var(--pad)' }}><div className="row" style={{ gap:11 }}><Avatar p={p} size={34} /><div><div style={{ fontWeight:700, whiteSpace:'nowrap' }}>{p.name}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{p.district}</div></div></div></td>
                      <td><PosTag pos={p.pos} /></td>
                      <td style={{ color:'var(--ink-2)' }}>{p.club}</td>
                      <td className="c num">{p.age}</td>
                      <td className="c num">{p.caps}</td>
                      <td className="c num">{p.goals}</td>
                      <td className="c"><RatingPill r={p.rating} /></td>
                      <td className="r" style={{ paddingRight:'var(--pad)' }} onClick={e=>e.stopPropagation()}>
                        {AuthStore.canEdit() && <div className="row" style={{ gap:6, justifyContent:'flex-end' }}>
                          <button className="icon-btn" style={{ width:30, height:30, ...(roster.has('shortlist',p.id)?{ borderColor:'var(--bff-red)', color:'var(--bff-red)' }:{}) }} title="Shortlist" onClick={()=>{ const on=roster.toggle('shortlist',p.id); toast(on?`<b>${p.name}</b> added to shortlist`:`<b>${p.name}</b> removed from shortlist`, on?'ok':'muted'); }}><Icon name="heart" size={14} fill={roster.has('shortlist',p.id)?'var(--bff-red)':undefined} /></button>
                          <button className="icon-btn" style={{ width:30, height:30, ...(roster.has('squad',p.id)?{ borderColor:'var(--primary)', color:'var(--primary)' }:{}) }} title="Advance to squad" onClick={()=>{ if(roster.has('squad',p.id)){ roster.toggle('squad',p.id); toast(`<b>${p.name}</b> removed from squad`,'muted'); } else { confirmAction({ title:'Advance to squad?', message:<>Call <b>{p.name}</b> up to the national squad?</>, confirmLabel:'Advance', icon:'check' }).then(ok=>{ if(ok){ roster.toggle('squad',p.id); toast(`<b>${p.name}</b> advanced to squad`); } }); } }}><Icon name={roster.has('squad',p.id)?'check':'plus'} size={14} /></button>
                        </div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ p, go }) {
  const roster = useRoster();
  const short = roster.has('shortlist', p.id);
  const squad = roster.has('squad', p.id);
  const act = (e, set) => {
    e.stopPropagation();
    if (set === 'squad' && !roster.has('squad', p.id)) {
      confirmAction({ title: 'Advance to squad?', message: <>Call <b>{p.name}</b> up to the national squad?</>, confirmLabel: 'Advance', icon: 'check' })
        .then(ok => { if (ok) { roster.toggle('squad', p.id); toast(`<b>${p.name}</b> advanced to squad`); } });
      return;
    }
    const on = roster.toggle(set, p.id);
    const where = set === 'shortlist' ? 'shortlist' : 'squad';
    toast(on ? `<b>${p.name}</b> ${set === 'shortlist' ? 'added to shortlist' : 'advanced to squad'}` : `<b>${p.name}</b> removed from ${where}`, on ? 'ok' : 'muted');
  };
  return (
    <div className="card" style={{ overflow:'hidden', cursor:'pointer', transition:'transform .12s, box-shadow .12s', display:'flex', flexDirection:'column' }}
      onClick={()=>go('profile', p.id)}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-md)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
      <div style={{ height:74, background:`linear-gradient(120deg, hsl(${p.hue} 45% 32%), hsl(${(p.hue+40)%360} 48% 22%))`, position:'relative' }}>
        <div className="num" style={{ position:'absolute', right:14, top:8, fontSize:46, fontWeight:800, color:'#ffffff22', lineHeight:1 }}>{p.no}</div>
        <div style={{ position:'absolute', left:16, bottom:-22 }}><Avatar p={p} size={56} /></div>
        <div style={{ position:'absolute', right:12, bottom:10 }}><RatingPill r={p.rating} /></div>
        {short && <span className="badge" style={{ position:'absolute', left:12, top:12, background:'var(--bff-red)', color:'#fff' }}><Icon name="heart" size={10} fill="#fff" /> Shortlisted</span>}
      </div>
      <div style={{ padding:'28px 16px 12px', flex:1 }}>
        <div style={{ fontWeight:800, fontSize:15.5, lineHeight:1.1 }}>{p.name}</div>
        <div className="row" style={{ gap:8, marginTop:7 }}><PosTag pos={p.pos} /><span style={{ fontSize:12.5, color:'var(--ink-3)' }}>{p.club}</span></div>
        <div className="row" style={{ justifyContent:'space-between', marginTop:14, paddingTop:12, borderTop:'1px solid var(--line)', fontSize:12 }}>
          <div style={{ textAlign:'center' }}><div className="num" style={{ fontWeight:800, fontSize:16 }}>{p.age}</div><div style={{ color:'var(--ink-faint)' }}>Age</div></div>
          <div style={{ textAlign:'center' }}><div className="num" style={{ fontWeight:800, fontSize:16 }}>{p.caps}</div><div style={{ color:'var(--ink-faint)' }}>Caps</div></div>
          <div style={{ textAlign:'center' }}><div className="num" style={{ fontWeight:800, fontSize:16 }}>{p.goals}</div><div style={{ color:'var(--ink-faint)' }}>Goals</div></div>
          {p.prospect && <Badge kind="info">Prospect</Badge>}
        </div>
      </div>
      <div className="row" style={{ gap:8, padding:'0 14px 14px' }}>
        <button className="btn ghost sm" style={{ flex:1, justifyContent:'center', ...(short?{ borderColor:'var(--bff-red)', color:'var(--bff-red)' }:{}) }} onClick={e=>act(e,'shortlist')}>
          <Icon name="heart" size={14} fill={short?'var(--bff-red)':undefined} />{short?'Shortlisted':'Shortlist'}
        </button>
        <button className="btn sm" style={{ flex:1, justifyContent:'center', ...(squad?{ background:'var(--pos)' }:{}) }} onClick={e=>act(e,'squad')}>
          <Icon name={squad?'check':'plus'} size={14} />{squad?'In squad':'Advance'}
        </button>
      </div>
    </div>
  );
}

window.PlayerSearch = PlayerSearch;


/* ===== screens-profile.jsx ===== */
/* Player Profile — flagship detail page */
function PlayerProfile({ id, go }) {
  const D = window.DATA;
  useData();
  const p = D.allPlayers.find(x => x.id === id) || D.allPlayers[0];
  const isW = D.womenSenior.includes(p);
  const [tab, setTab] = React.useState('overview');
  const [editing, setEditing] = React.useState(false);
  const roster = useRoster();
  const shortlisted = roster.has('shortlist', p.id);
  const inSquad = roster.has('squad', p.id);

  // deterministic attribute synthesis from rating + position
  const seed = p.hue;
  const r = (base, spread) => Math.max(48, Math.min(96, Math.round(base + ((seed % spread) - spread / 2))));
  const baseR = p.rating * 10;
  const attrs = p.pos === 'GK'
    ? [['Reflexes', r(baseR+6,14)], ['Handling', r(baseR+2,12)], ['Aerial', r(baseR,16)], ['Distribution', r(baseR-4,18)], ['Positioning', r(baseR+3,12)], ['Composure', r(baseR,14)]]
    : p.pos === 'DF'
    ? [['Tackling', r(baseR+5,14)], ['Marking', r(baseR+3,12)], ['Heading', r(baseR+2,16)], ['Strength', r(baseR+4,14)], ['Passing', r(baseR-6,18)], ['Pace', r(baseR-3,20)]]
    : p.pos === 'MF'
    ? [['Passing', r(baseR+6,12)], ['Vision', r(baseR+4,14)], ['Dribbling', r(baseR+1,16)], ['Stamina', r(baseR+5,12)], ['Tackling', r(baseR-2,18)], ['Shooting', r(baseR-4,16)]]
    : [['Finishing', r(baseR+7,12)], ['Pace', r(baseR+5,14)], ['Dribbling', r(baseR+3,14)], ['Off-the-ball', r(baseR+2,16)], ['Heading', r(baseR-3,18)], ['Strength', r(baseR-2,16)]];

  const tabs = [['overview','Overview'],['performance','Performance'],['career','Career'],['medical','Medical & Contract'],['id','Digital ID']];

  return (
    <div className="content-inner fade-in">
      <button className="chip tab" style={{ marginBottom:16 }} onClick={()=>go('search')}><Icon name="chev" size={13} style={{ transform:'rotate(180deg)' }} /> Back to search</button>

      {/* HERO */}
      <div className="card" style={{ overflow:'hidden', marginBottom:'var(--gap)' }}>
        <div style={{ background:`linear-gradient(115deg, hsl(${p.hue} 48% 26%), hsl(${(p.hue+40)%360} 50% 16%))`, padding:'26px var(--pad)', position:'relative', color:'#fff' }}>
          <div className="num" style={{ position:'absolute', right:-10, top:-30, fontSize:200, fontWeight:800, color:'#ffffff10', lineHeight:1 }}>{p.no}</div>
          <div className="row" style={{ gap:22, position:'relative', alignItems:'flex-start' }}>
            <PlayerPhoto slotId={'player-photo-'+p.id} size={96} />
            <div style={{ flex:1 }}>
              <div className="row" style={{ gap:10, marginBottom:6 }}>
                <PosTag pos={p.pos} />
                {p.captain && <span className="badge" style={{ background:'var(--bff-gold)', color:'#3a2a00' }}>Captain</span>}
                {p.marquee && <span className="badge" style={{ background:'#ffffff22', color:'#fff' }}><Icon name="star" size={11} fill="#fff" /> Marquee</span>}
                {p.badge && <span className="badge" style={{ background:'#ffffff22', color:'#fff' }}>{p.badge}</span>}
              </div>
              <h1 style={{ fontSize:34, color:'#fff', lineHeight:1 }}>{p.name}</h1>
              <div className="row" style={{ gap:18, marginTop:12, fontSize:13.5, opacity:.92, flexWrap:'wrap' }}>
                <span><Icon name="shield" size={14} style={{ verticalAlign:-2 }} /> {p.club}</span>
                <span><Icon name="pin" size={14} style={{ verticalAlign:-2 }} /> {p.district}</span>
                <span>{isW ? "Women's" : "Men's"} National Team · #{p.no}</span>
              </div>
            </div>
            {AuthStore.canEdit() && <div className="row" style={{ gap:8 }}>
              <button className="btn ghost sm" title="Edit player" style={{ background:'#ffffff18', color:'#fff', borderColor:'#ffffff33' }} onClick={()=>setEditing(true)}>
                <Icon name="edit" size={15} /> Edit
              </button>
              <button className="btn ghost sm" title={shortlisted?'Remove from shortlist':'Add to shortlist'} style={{ background: shortlisted?'var(--bff-red)':'#ffffff18', color:'#fff', borderColor: shortlisted?'transparent':'#ffffff33' }}
                onClick={()=>{ const on=roster.toggle('shortlist',p.id); toast(on?`<b>${p.name}</b> added to shortlist`:`<b>${p.name}</b> removed from shortlist`, on?'ok':'muted'); }}>
                <Icon name="heart" size={15} fill={shortlisted?'#fff':undefined} /> {shortlisted?'Shortlisted':'Shortlist'}
              </button>
              <button className="btn sm" style={{ background: inSquad?'var(--primary)':'#fff', color: inSquad?'#fff':'var(--primary-deep)' }}
                onClick={()=>{ if(inSquad){ roster.toggle('squad',p.id); toast(`<b>${p.name}</b> removed from squad`,'muted'); } else { confirmAction({ title:'Add to squad?', message:<>Call <b>{p.name}</b> up to the national squad?</>, confirmLabel:'Add to squad', icon:'check' }).then(ok=>{ if(ok){ roster.toggle('squad',p.id); toast(`<b>${p.name}</b> added to squad`); } }); } }}>
                <Icon name={inSquad?'check':'plus'} size={15} /> {inSquad?'In squad':'Add to squad'}
              </button>
            </div>}
          </div>
        </div>
        {/* quick facts */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
          {[['Age',p.age],['Height',p.ht+'cm'],['Foot',p.foot],['Caps',p.caps],['Goals',p.goals],['Rating',p.rating.toFixed(1)],['Value',p.value]].map(([k,v],i)=>(
            <div key={k} style={{ padding:'14px var(--pad)', borderRight: i<6?'1px solid var(--line)':'none', textAlign:'center' }}>
              <div className="num" style={{ fontSize:22, fontWeight:800 }}>{v}</div>
              <div style={{ fontSize:11, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.06em', marginTop:2 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="row" style={{ gap:8, marginBottom:'var(--gap)', borderBottom:'1px solid var(--line)' }}>
        {tabs.map(([k,l]) => (
          <button key={k} onClick={()=>setTab(k)} style={{ background:'none', border:'none', padding:'10px 4px', marginRight:14, fontWeight:700, fontSize:14, color: tab===k?'var(--primary)':'var(--ink-3)', borderBottom: tab===k?'3px solid var(--primary)':'3px solid transparent', marginBottom:-1 }}>{l}</button>
        ))}
      </div>

      {tab==='overview' && <Overview p={p} attrs={attrs} isW={isW} />}
      {tab==='performance' && <Performance p={p} />}
      {tab==='career' && <Career p={p} isW={isW} />}
      {tab==='medical' && <Medical p={p} />}
      {tab==='id' && <DigitalID p={p} isW={isW} />}

      {editing && (
        <PlayerForm mode="edit" initial={{ name:p.name, pos:p.pos, no:p.no, age:p.age, club:p.club, district:p.district, foot:p.foot, ht:p.ht, caps:p.caps, goals:p.goals, rating:p.rating, value:p.value, prospect:!!p.prospect, gender: isW?'women':'men' }}
          onClose={()=>setEditing(false)}
          onSubmit={(f)=>{ DataStore.updatePlayer(p.id, f); setEditing(false); toast(`<b>${f.name}</b> updated`); }} />
      )}
    </div>
  );
}

function Overview({ p, attrs, isW }) {
  const sub = isW ? 'she' : 'they';
  const has = isW ? 'has' : 'have';
  return (
    <div className="grid fade-in" style={{ gridTemplateColumns:'1.3fr 1fr' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
        <div className="card card-pad">
          <h3 style={{ fontSize:16, marginBottom:16 }}>Attribute profile</h3>
          <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', columnGap:26, rowGap:14 }}>
            {attrs.map(([k,v]) => (
              <div key={k}>
                <div className="row" style={{ justifyContent:'space-between', marginBottom:5 }}><span style={{ fontSize:13, fontWeight:600 }}>{k}</span><span className="num" style={{ fontWeight:800, color: v>=82?'var(--pos)':v>=70?'var(--ink)':'var(--ink-3)' }}>{v}</span></div>
                <Bar v={v} color={v>=82?'var(--pos)':v>=70?'var(--primary)':'var(--warn)'} />
              </div>
            ))}
          </div>
        </div>
        <div className="card card-pad">
          <h3 style={{ fontSize:16, marginBottom:6 }}>Scouting summary</h3>
          <p style={{ fontSize:14, color:'var(--ink-2)', lineHeight:1.6, margin:0 }}>
            {p.name.split(' ')[0]} is a {p.age}-year-old {p.foot.toLowerCase()}-footed {posName(p.pos).toLowerCase()} currently at {p.club}.
            {p.prospect ? ' Rated as one of the federation\u2019s brightest prospects, with clear development upside in the youth-to-senior pathway.' : ' An established member of the national pool with consistent international output.'}
            {' '}From {p.district}, {sub} {has} {p.caps>40?'amassed significant international experience':'continued to build international experience'} with {p.caps} caps and {p.goals} goals.
          </p>
          <div className="row" style={{ gap:8, marginTop:14, flexWrap:'wrap' }}>
            {['Press resistance','Two-footed range','Set-piece threat','High work-rate'].slice(0, p.pos==='FW'?4:3).map(t=><span key={t} className="chip">{t}</span>)}
          </div>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:12 }}><h3 style={{ fontSize:16 }}>Recent form</h3><Badge kind={p.form.slice(-1)[0]>=8?'pos':'warn'}>Last 5</Badge></div>
          <div className="row" style={{ gap:8, justifyContent:'space-between' }}>
            {p.form.map((f,i)=>(
              <div key={i} style={{ flex:1, textAlign:'center' }}>
                <div className="num" style={{ width:'100%', height:42, borderRadius:9, display:'grid', placeItems:'center', color:'#fff', fontWeight:800, fontSize:16, background: ratingColor(f) }}>{f + '.' + ((p.hue + i) % 9)}</div>
                <div style={{ fontSize:10, color:'var(--ink-faint)', marginTop:5 }}>M{i+1}</div>
              </div>
            ))}
          </div>
        </div>
        <HighlightsCard p={p} title="Match highlights" badge="Latest reel" />
        <div className="card card-pad">
          <h3 style={{ fontSize:16, marginBottom:14 }}>Season 2025–26</h3>
          <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[['Appearances',Math.round(p.caps*0.4)],['Minutes',(Math.round(p.caps*0.4)*78)],['Goals',p.goals],['Assists',Math.round(p.goals*0.6)],['Pass %',(78+p.hue%14)+'%'],['Rating',p.rating.toFixed(2)]].map(([k,v])=>(
              <div key={k} style={{ padding:'12px 14px', background:'var(--surface-2)', borderRadius:10 }}>
                <div className="num" style={{ fontSize:22, fontWeight:800 }}>{v}</div>
                <div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{k}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-pad" style={{ background:'var(--surface-2)' }}>
          <div className="row" style={{ gap:10 }}><Icon name="health" size={18} color="var(--pos)" /><div><div style={{ fontWeight:700, fontSize:14 }}>Fitness: {p.status==='Knock'?'Minor knock':'Match fit'}</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>{p.status==='Knock'?'Expected return in 3–5 days':'Cleared for selection'}</div></div></div>
        </div>
      </div>
    </div>
  );
}

function Performance({ p }) {
  const comps = [
    ['AFC Asian Cup Qual.', Math.round(p.caps*0.25), Math.round(p.goals*0.4), p.rating],
    ['SAFF Championship', Math.round(p.caps*0.35), Math.round(p.goals*0.4), p.rating+0.1],
    ['Intl. Friendlies', Math.round(p.caps*0.4), Math.round(p.goals*0.2), p.rating-0.2],
  ];
  return (
    <div className="fade-in">
      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Total caps" v={p.caps} glyph="shield" />
        <Stat k="Intl. goals" v={p.goals} glyph="ball" accent="var(--bff-red)" />
        <Stat k="Minutes played" v={(p.caps*81).toLocaleString()} dColor="var(--ink-3)" glyph="clock" />
        <Stat k="Avg match rating" v={p.rating.toFixed(2)} d="career" dColor="var(--ink-3)" glyph="star" accent="var(--bff-gold)" />
      </div>
      <div className="card" style={{ overflow:'hidden' }}>
        <div className="card-pad" style={{ paddingBottom:12 }}><h3 style={{ fontSize:16 }}>By competition</h3></div>
        <table className="tbl">
          <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Competition</th><th className="c">Apps</th><th className="c">Goals</th><th className="c">G/Game</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Avg rating</th></tr></thead>
          <tbody>
            {comps.map(([c,ap,g,rt])=>(
              <tr key={c}><td style={{ paddingLeft:'var(--pad)', fontWeight:600 }}>{c}</td><td className="c num">{ap}</td><td className="c num">{g}</td><td className="c num">{ap?(g/ap).toFixed(2):'0.00'}</td><td className="r" style={{ paddingRight:'var(--pad)' }}><RatingPill r={Math.min(9.5,rt)} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Career({ p, isW }) {
  const yr = p.joined;
  const steps = [
    { y:`${yr-3}`, t:'Youth / academy', d:`District football, ${p.district}` },
    { y:`${yr}`, t:`Signed by ${p.club.replace(' W','')}`, d:'Professional debut' },
    { y:`${yr+1}`, t:'National team call-up', d:`First cap for ${isW?"Women's":"Men's"} Senior` },
    { y:'2026', t:'Current season', d:`${p.caps} caps · ${p.goals} goals to date` },
  ];
  return (
    <div className="grid fade-in" style={{ gridTemplateColumns:'1.4fr 1fr' }}>
      <div className="card card-pad">
        <h3 style={{ fontSize:16, marginBottom:18 }}>Career timeline</h3>
        <div style={{ position:'relative', paddingLeft:26 }}>
          <div style={{ position:'absolute', left:7, top:6, bottom:6, width:2, background:'var(--line)' }}></div>
          {steps.map((s,i)=>(
            <div key={i} style={{ position:'relative', paddingBottom: i<steps.length-1?22:0 }}>
              <div style={{ position:'absolute', left:-26, top:2, width:16, height:16, borderRadius:'50%', background: i===steps.length-1?'var(--primary)':'var(--surface)', border:'3px solid var(--primary)' }}></div>
              <div className="num" style={{ fontSize:12, fontWeight:800, color:'var(--primary)' }}>{s.y}</div>
              <div style={{ fontWeight:700, fontSize:14.5, marginTop:2 }}>{s.t}</div>
              <div style={{ fontSize:13, color:'var(--ink-3)' }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card card-pad">
        <h3 style={{ fontSize:16, marginBottom:14 }}>Caps progression</h3>
        <Spark data={[2,Math.round(p.caps*0.2),Math.round(p.caps*0.4),Math.round(p.caps*0.6),Math.round(p.caps*0.8),p.caps]} />
        <div className="num" style={{ fontSize:11, color:'var(--ink-3)', marginTop:6, textAlign:'right' }}>{p.joined} → 2026</div>
        <hr className="divider" style={{ margin:'16px 0' }} />
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[['International debut',`${p.joined+1}`],['Preferred foot',p.foot],['Squad number','#'+p.no],['Pool status',p.prospect?'Development':'Established']].map(([k,v])=>(
            <div key={k} className="row" style={{ justifyContent:'space-between', fontSize:13.5 }}><span style={{ color:'var(--ink-3)' }}>{k}</span><b>{v}</b></div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FIT = {
  'Fully fit':   { bg:'color-mix(in srgb,var(--pos) 18%,transparent)',  fg:'var(--pos)',  note:'Cleared for selection' },
  'Minor knock': { bg:'color-mix(in srgb,var(--warn) 20%,transparent)', fg:'#9a6e0a',     note:'Monitor — light training' },
  'Doubtful':    { bg:'color-mix(in srgb,var(--warn) 22%,transparent)', fg:'#9a6e0a',     note:'Late fitness test required' },
  'Injured':     { bg:'color-mix(in srgb,var(--neg) 14%,transparent)',  fg:'var(--neg)',  note:'Ruled out — in rehab' },
};
const medKey = (p) => 'bff_med_' + p.id;
function loadMed(p) {
  try { const s = JSON.parse(localStorage.getItem(medKey(p))); if (s) return s; } catch {}
  return {
    status: p.status === 'Knock' ? 'Minor knock' : 'Fully fit',
    assessed: 'Jun 3, 2026',
    injuries: (p.hue % 2 ? [{ t:'Hamstring strain', y:'2025', d:18 }] : [{ t:'Ankle sprain', y:'2024', d:11 }, { t:'Knock (calf)', y:'2025', d:4 }]),
  };
}
const medInput = { height:36, borderRadius:8, border:'1px solid var(--line)', padding:'0 10px', background:'var(--surface)', color:'var(--ink)', fontFamily:'inherit', fontSize:13.5, width:'100%' };

function Medical({ p }) {
  const [med, setMed] = React.useState(() => loadMed(p));
  const [editFit, setEditFit] = React.useState(false);
  const [addInj, setAddInj] = React.useState(false);
  const [draft, setDraft] = React.useState({ t:'', y:'2026', d:'' });
  const persist = (next) => { setMed(next); localStorage.setItem(medKey(p), JSON.stringify(next)); };
  const fit = FIT[med.status] || FIT['Fully fit'];
  const today = new Date().toLocaleDateString('en', { day:'2-digit', month:'short', year:'numeric' });

  const saveFit = async (status) => {
    const ok = await confirmAction({ title: 'Update fitness status?', message: <>Set <b>{p.name}</b>’s fitness status to <b>{status}</b>?</>, confirmLabel: 'Update', icon: 'health' });
    if (!ok) return;
    persist({ ...med, status, assessed: today }); setEditFit(false); toast(`Fitness updated: <b>${status}</b>`);
  };
  const addInjury = async () => {
    if (!draft.t.trim()) { toast('Enter an injury type', 'muted'); return; }
    const ok = await confirmAction({ title: 'Add injury record?', message: <>Add <b>{draft.t.trim()}</b> ({draft.y}) to {p.name}’s injury history?</>, confirmLabel: 'Add record', icon: 'plus' });
    if (!ok) return;
    persist({ ...med, injuries: [{ t: draft.t.trim(), y: draft.y, d: Number(draft.d) || 0 }, ...med.injuries] });
    setDraft({ t:'', y:'2026', d:'' }); setAddInj(false); toast('Injury record added');
  };
  const removeInjury = (i) => { persist({ ...med, injuries: med.injuries.filter((_, j) => j !== i) }); toast('Record removed', 'muted'); };

  return (
    <div className="grid fade-in" style={{ gridTemplateColumns:'1fr 1fr' }}>
      <ContractCard p={p} />
      <div className="card card-pad">
        <div className="row" style={{ justifyContent:'space-between', marginBottom:16 }}>
          <h3 style={{ fontSize:16 }}>Medical & fitness</h3>
          {AuthStore.canEdit() && <button className="btn ghost sm" onClick={()=>setEditFit(v=>!v)}><Icon name="edit" size={14} /> Update</button>}
        </div>

        <div style={{ padding:'14px', background:'var(--surface-2)', borderRadius:12, marginBottom:16 }}>
          <div className="row" style={{ gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:'50%', display:'grid', placeItems:'center', background: fit.bg, color: fit.fg, flex:'none' }}><Icon name="health" size={22} /></div>
            <div style={{ flex:1 }}><div style={{ fontWeight:800, fontSize:16 }}>{med.status}</div><div style={{ fontSize:12.5, color:'var(--ink-3)' }}>{fit.note} · assessed {med.assessed}</div></div>
          </div>
          {editFit && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:'1px dashed var(--line-strong)' }}>
              <div className="eyebrow" style={{ marginBottom:8 }}>Set fitness status</div>
              <div className="row" style={{ gap:6, flexWrap:'wrap' }}>
                {Object.keys(FIT).map(s => (
                  <button key={s} className={'chip tab' + (med.status===s?' on':'')} onClick={()=>saveFit(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="row" style={{ justifyContent:'space-between', marginBottom:10 }}>
          <div className="eyebrow">Injury history</div>
          {AuthStore.canEdit() && <button className="chip tab" onClick={()=>setAddInj(v=>!v)}><Icon name={addInj?'chevd':'plus'} size={13} /> {addInj?'Cancel':'Add record'}</button>}
        </div>

        {addInj && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 78px 84px', gap:8, padding:'12px', background:'var(--surface-2)', borderRadius:10, marginBottom:12 }}>
            <input style={medInput} placeholder="Injury (e.g. Hamstring strain)" value={draft.t} autoFocus
              onChange={e=>setDraft({...draft, t:e.target.value})} onKeyDown={e=>e.key==='Enter'&&addInjury()} />
            <input style={medInput} placeholder="Year" value={draft.y} onChange={e=>setDraft({...draft, y:e.target.value})} />
            <div className="row" style={{ gap:6 }}>
              <input style={{...medInput, width:42}} placeholder="0" value={draft.d} inputMode="numeric" onChange={e=>setDraft({...draft, d:e.target.value.replace(/\D/g,'')})} onKeyDown={e=>e.key==='Enter'&&addInjury()} />
              <button className="btn sm" style={{ padding:'0 11px' }} onClick={addInjury}><Icon name="check" size={15} /></button>
            </div>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {med.injuries.length === 0 && <div style={{ fontSize:13, color:'var(--ink-faint)', padding:'8px 2px' }}>No injury records on file.</div>}
          {med.injuries.map((inj,i)=>(
            <div key={i} className="row" style={{ justifyContent:'space-between', fontSize:13.5, padding:'9px 12px', border:'1px solid var(--line)', borderRadius:9 }}>
              <span><b>{inj.t}</b> <span style={{ color:'var(--ink-faint)' }}>· {inj.y}</span></span>
              <div className="row" style={{ gap:8 }}>
                <span className="badge neutral">{inj.d} days out</span>
                {AuthStore.canEdit() && <button className="icon-btn" title="Remove" style={{ width:26, height:26, borderColor:'transparent' }} onClick={()=>removeInjury(i)}><Icon name="more" size={14} style={{ display:'none' }} /><span style={{ fontSize:16, color:'var(--ink-3)', lineHeight:1 }}>×</span></button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function posName(p){return {GK:'Goalkeeper',DF:'Defender',MF:'Midfielder',FW:'Forward'}[p];}

function DigitalID({ p, isW }) {
  const fid = 'BD-' + (isW ? 'W' : 'M') + '-' + String(2400 + p.hue).padStart(5, '0');
  const dob = `${2026 - p.age}`;
  return (
    <div className="grid fade-in" style={{ gridTemplateColumns:'360px 1fr' }}>
      {/* ID card */}
      <div className="card" style={{ overflow:'hidden', alignSelf:'start' }}>
        <div style={{ background:'linear-gradient(120deg, var(--primary-deep), var(--primary))', color:'#fff', padding:'16px 18px' }}>
          <div className="row" style={{ justifyContent:'space-between' }}>
            <div className="row" style={{ gap:9 }}>
              <Flag e="🇧🇩" size={22} />
              <div><div className="eyebrow" style={{ color:'#fff' }}>BFF Digital ID</div><div style={{ fontSize:10.5, opacity:.8 }}>Bangladesh Football Federation</div></div>
            </div>
            <Badge kind="pos" dot>Verified</Badge>
          </div>
          <div className="row" style={{ gap:14, marginTop:16, alignItems:'center' }}>
            <Avatar p={p} size={62} square />
            <div>
              <div style={{ fontWeight:800, fontSize:18, lineHeight:1.1 }}>{p.name}</div>
              <div className="row" style={{ gap:8, marginTop:6 }}><PosTag pos={p.pos} /><span style={{ fontSize:12, opacity:.85 }}>#{p.no} · {p.club}</span></div>
            </div>
          </div>
        </div>
        <div className="card-pad" style={{ display:'flex', gap:16 }}>
          <div style={{ flex:'none', textAlign:'center' }}>
            <QR seed={fid} size={108} />
            <div className="num" style={{ fontSize:10, color:'var(--ink-3)', marginTop:6 }}>Scan to verify</div>
          </div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:0 }}>
            {[['Football ID', fid],['Born', dob],['Nationality', 'Bangladesh'],['Eligibility', 'FIFA cleared'],['Issued', 'Jan 2026']].map(([k,v],i)=>(
              <div key={k} className="row" style={{ justifyContent:'space-between', padding:'6px 0', borderBottom:i<4?'1px solid var(--line)':'none', fontSize:12.5 }}>
                <span style={{ color:'var(--ink-3)' }}>{k}</span><b className={k==='Football ID'?'num':''}>{v}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="card-pad row" style={{ gap:8, borderTop:'1px solid var(--line)' }}>
          <button className="btn ghost sm" style={{ flex:1 }} onClick={()=>toast('Digital ID downloaded')}><Icon name="dl" size={14} /> Download</button>
          <button className="btn sm" style={{ flex:1 }} onClick={()=>toast('Verification link copied')}><Icon name="check" size={14} /> Share</button>
        </div>
      </div>

      {/* what the ID unlocks */}
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
        <div className="card card-pad">
          <h3 style={{ fontSize:16, marginBottom:6 }}>Linked digital record</h3>
          <p style={{ fontSize:13.5, color:'var(--ink-3)', margin:'0 0 14px', lineHeight:1.5 }}>One unique Football ID links every system — preventing age fraud, enabling transparent transfers and national talent tracking.</p>
          <div className="grid" style={{ gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[['user','Career history',`${p.joined}–26`],['trend','Match statistics',`${p.caps} caps`],['health','Injury history','On file'],['shield','Eligibility','Verified'],['flow','Talent pathway',p.prospect?'Active':'Senior'],['cards','Transfer record','Clean']].map(([ic,k,v])=>(
              <div key={k} style={{ padding:'12px', background:'var(--surface-2)', borderRadius:10 }}>
                <Icon name={ic} size={16} color="var(--primary)" />
                <div style={{ fontWeight:700, fontSize:13, marginTop:8 }}>{k}</div>
                <div className="num" style={{ fontSize:12, color:'var(--ink-3)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}><h3 style={{ fontSize:16 }}>Performance analytics</h3><Badge kind="info">AI-assisted</Badge></div>
          <div className="row" style={{ gap:20, flexWrap:'wrap' }}>
            <Ring pct={Math.round(p.rating*10)} label={p.rating.toFixed(1)} sub="Index" color="var(--pos)" size={76} />
            <Ring pct={Math.min(99, 60 + p.hue%35)} sub="Avail." color="var(--primary)" size={76} />
            <Ring pct={Math.min(99, 55 + p.goals*2)} sub="Threat" color="var(--bff-red)" size={76} />
            <div style={{ flex:1, minWidth:160 }}>
              <div className="eyebrow" style={{ marginBottom:8 }}>Last 10 ratings</div>
              <Spark data={p.form.concat(p.form.slice().reverse())} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.PlayerProfile = PlayerProfile;


/* ===== screens-teams.jsx ===== */
/* National Teams (men & women, all age levels) */
function NationalTeams({ go }) {
  const D = window.DATA;
  const order = ['men_senior','men_u23','men_u20','men_u17','women_senior','women_u20','women_u17'];
  const [sel, setSel] = React.useState('men_senior');
  const t = D.teams[sel];
  const byPos = (pp) => t.squad.filter(p => p.pos === pp);

  return (
    <div className="content-inner fade-in">
      <PageHead title="National Teams" desc="Men's & women's squads across every age level">
        <button className="btn ghost sm" onClick={()=>toast(`Team sheet for <b>${t.label}</b> exported`)}><Icon name="dl" size={15} />Team sheet</button>
        {AuthStore.canEdit() && <button className="btn sm" onClick={()=>go('search')}><Icon name="plus" size={15} />Call up player</button>}
      </PageHead>

      {/* team selector */}
      <div className="card card-pad" style={{ marginBottom:'var(--gap)', display:'flex', gap:24, flexWrap:'wrap' }}>
        {['men','women'].map(g => (
          <div key={g} style={{ flex:1, minWidth:280 }}>
            <div className="eyebrow" style={{ marginBottom:10, color: g==='women'?'var(--bff-red)':'var(--primary)' }}>{g==="men"?"Men's":"Women's"} teams</div>
            <div className="row" style={{ gap:8, flexWrap:'wrap' }}>
              {order.filter(k=>D.teams[k].gender===g).map(k => {
                const tm = D.teams[k];
                return <button key={k} className={'chip tab' + (sel===k?' on':'')} onClick={()=>setSel(k)} style={ sel===k?{ background: g==='women'?'var(--bff-red)':'var(--primary)', borderColor:'transparent', color:'#fff' }:{}}>{tm.level}</button>;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* team header */}
      <div className="card" style={{ overflow:'hidden', marginBottom:'var(--gap)' }}>
        <div style={{ background: t.gender==='women'?'linear-gradient(115deg,#7a0f18,var(--bff-red))':'linear-gradient(115deg,var(--primary-deep),var(--primary))', color:'#fff', padding:'22px var(--pad)' }}>
          <div className="row" style={{ justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div>
              <div className="eyebrow" style={{ color:'#ffffffaa' }}>Bangladesh · {t.gender==='men'?'Men':'Women'}</div>
              <h2 style={{ fontSize:30, color:'#fff', marginTop:4 }}>{t.label}</h2>
              <div className="row" style={{ gap:16, marginTop:10, fontSize:13.5, opacity:.92, flexWrap:'wrap' }}>
                <span><Icon name="whistle" size={14} style={{ verticalAlign:-2 }} /> {t.coach} <span style={{ opacity:.7 }}>({t.coachNat})</span></span>
                <span><Icon name="grid" size={14} style={{ verticalAlign:-2 }} /> {t.formation}</span>
                <span><Icon name="users" size={14} style={{ verticalAlign:-2 }} /> {t.squad.length} called up</span>
                {t.trophy && <span className="badge" style={{ background:'var(--bff-gold)', color:'#3a2a00' }}><Icon name="trophy" size={11} /> {t.trophy}</span>}
              </div>
            </div>
            <div className="row" style={{ gap:20 }}>
              {t.fifa && <div style={{ textAlign:'center' }}><div className="num" style={{ fontSize:34, fontWeight:800 }}>{t.fifa}<span style={{ fontSize:14, opacity:.7 }}>th</span></div><div style={{ fontSize:11, opacity:.8 }}>FIFA RANK</div></div>}
              <div style={{ textAlign:'center' }}><div className="num" style={{ fontSize:34, fontWeight:800 }}>{Math.round(t.squad.reduce((s,p)=>s+p.age,0)/t.squad.length)}</div><div style={{ fontSize:11, opacity:.8 }}>AVG AGE</div></div>
            </div>
          </div>
        </div>
        <div className="row" style={{ justifyContent:'space-between', padding:'12px var(--pad)', background:'var(--surface-2)', fontSize:13 }}>
          <span style={{ color:'var(--ink-3)' }}>Next: <b style={{ color:'var(--ink)' }}>vs {t.nextOpp}</b> · {t.comp}</span>
          <button className="chip tab" onClick={()=>go('fixtures')}>Fixtures <Icon name="chev" size={12} /></button>
        </div>
      </div>

      {/* squad by line */}
      <div className="grid" style={{ gridTemplateColumns:'1.5fr 1fr' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
          {[['GK','Goalkeepers'],['DF','Defenders'],['MF','Midfielders'],['FW','Forwards']].map(([pp,label]) => {
            const list = byPos(pp);
            if(!list.length) return null;
            return (
              <div key={pp} className="card">
                <div className="card-pad row" style={{ justifyContent:'space-between', paddingBottom:10 }}>
                  <div className="row" style={{ gap:10 }}><PosTag pos={pp} /><h3 style={{ fontSize:15 }}>{label}</h3></div>
                  <span className="num" style={{ color:'var(--ink-3)', fontSize:13 }}>{list.length}</span>
                </div>
                <hr className="divider" />
                {list.map(p => (
                  <div key={p.id} className="row" style={{ gap:12, padding:'10px var(--pad)', borderBottom:'1px solid var(--line)', cursor:'pointer' }} onClick={()=>go('profile',p.id)}>
                    <span className="num" style={{ width:24, textAlign:'center', fontWeight:800, color:'var(--ink-3)' }}>{p.no}</span>
                    <Avatar p={p} size={36} />
                    <div style={{ flex:1 }}>
                      <div className="row" style={{ gap:8 }}><span style={{ fontWeight:700 }}>{p.name}</span>{p.captain && <span className="badge" style={{ background:'var(--bff-gold)', color:'#3a2a00' }}>C</span>}{p.prospect && <Badge kind="info">Prospect</Badge>}</div>
                      <div style={{ fontSize:12, color:'var(--ink-3)' }}>{p.club} · {p.age}y</div>
                    </div>
                    <div className="row" style={{ gap:14, fontSize:12.5, color:'var(--ink-3)' }}>
                      <span className="num"><b style={{ color:'var(--ink)' }}>{p.caps}</b> caps</span>
                      <RatingPill r={p.rating} />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* formation pitch */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)', position:'sticky', top:0, alignSelf:'start' }}>
          <div className="card card-pad">
            <h3 style={{ fontSize:15, marginBottom:12 }}>Starting XI · {t.formation}</h3>
            <Pitch team={t} go={go} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pitch({ team, go }) {
  // build rows from formation
  const fm = team.formation.split('-').map(Number); // e.g. [4,2,3,1]
  const gk = team.squad.filter(p=>p.pos==='GK')[0];
  const df = team.squad.filter(p=>p.pos==='DF');
  const mf = team.squad.filter(p=>p.pos==='MF');
  const fw = team.squad.filter(p=>p.pos==='FW');
  const pool = [...mf, ...fw];
  // distribute outfield by formation rows after defense
  const rows = [];
  rows.push(df.slice(0, fm[0]));
  let idx = 0;
  for (let i=1;i<fm.length;i++){ rows.push(pool.slice(idx, idx+fm[i])); idx+=fm[i]; }
  const Dot = ({p}) => p ? (
    <div onClick={()=>go('profile',p.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer', width:54 }}>
      <div className="num" style={{ width:32, height:32, borderRadius:'50%', background:'#fff', color:'var(--primary-deep)', display:'grid', placeItems:'center', fontWeight:800, fontSize:13, boxShadow:'0 2px 6px rgba(0,0,0,.3)' }}>{p.no}</div>
      <div style={{ fontSize:9.5, color:'#fff', fontWeight:600, marginTop:3, textAlign:'center', lineHeight:1.1, textShadow:'0 1px 2px rgba(0,0,0,.5)' }}>{p.name.split(' ').slice(-1)[0]}</div>
    </div>
  ) : <div style={{ width:54 }}></div>;
  return (
    <div style={{ background:'linear-gradient(180deg,#0a7d5b,#055a40)', borderRadius:12, padding:'16px 8px', position:'relative', aspectRatio:'3/4', display:'flex', flexDirection:'column', justifyContent:'space-between', backgroundImage:'repeating-linear-gradient(180deg,#0a7d5b 0 32px,#0c8865 32px 64px)' }}>
      <div style={{ position:'absolute', inset:8, border:'2px solid #ffffff44', borderRadius:8, pointerEvents:'none' }}></div>
      <div style={{ position:'absolute', left:'50%', top:'50%', width:60, height:60, border:'2px solid #ffffff33', borderRadius:'50%', transform:'translate(-50%,-50%)' }}></div>
      {[...rows].reverse().map((r,i)=>(
        <div key={i} className="row" style={{ justifyContent:'space-evenly', position:'relative', zIndex:1 }}>{r.map((p,j)=><Dot key={j} p={p} />)}</div>
      ))}
      <div className="row" style={{ justifyContent:'center', position:'relative', zIndex:1 }}><Dot p={gk} /></div>
    </div>
  );
}

window.NationalTeams = NationalTeams;

/* Development pathway */
function Development({ go }) {
  const D = window.DATA;
  return (
    <div className="content-inner fade-in">
      <PageHead title="Player Development Pathway" desc="Grassroots to senior elite — the national talent pipeline">
        <button className="btn ghost sm" onClick={()=>toast('Development report exported to PDF')}><Icon name="dl" size={15} />Report</button>
        <button className="btn sm" onClick={()=>go('search')}><Icon name="plus" size={15} />Add to talent pool</button>
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Players in pathway" v="18,420" d="all stages" dColor="var(--ink-3)" glyph="users" />
        <Stat k="Active centres" v="97" d="64 districts" dColor="var(--ink-3)" glyph="pin" />
        <Stat k="Promoted '25–26" v="146" d="+22% YoY" glyph="trend" />
        <Stat k="Diaspora scouted" v="38" d="UK · ITA · DEN · USA" dColor="var(--ink-3)" glyph="globe" accent="var(--bff-red)" />
      </div>

      {/* funnel */}
      <div className="card card-pad" style={{ marginBottom:'var(--gap)' }}>
        <h3 style={{ fontSize:17, marginBottom:18 }}>The pipeline</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {D.pathway.map((s,i) => {
            const w = 100 - i*15;
            return (
              <div key={i} className="row" style={{ gap:16 }}>
                <div style={{ width:140, flex:'none' }}>
                  <div style={{ fontWeight:800, fontSize:15 }}>{s.stage}</div>
                  <div className="num" style={{ fontSize:12, color:'var(--ink-3)' }}>{s.age}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ width:w+'%', background:`linear-gradient(90deg, ${s.color}, ${s.color}bb)`, color:'#fff', padding:'12px 16px', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center', minWidth:200 }}>
                    <span style={{ fontSize:13, fontWeight:600, maxWidth:'70%' }}>{s.desc}</span>
                    <span className="num" style={{ fontWeight:800, fontSize:18 }}>{s.players.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ width:60, textAlign:'center', flex:'none' }}><div className="num" style={{ fontWeight:800, fontSize:18 }}>{s.centres}</div><div style={{ fontSize:10, color:'var(--ink-faint)' }}>CENTRES</div></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns:'1fr 1fr' }}>
        <div className="card card-pad">
          <h3 style={{ fontSize:16, marginBottom:14 }}>Promotion-ready prospects</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {D.allPlayers.filter(p=>p.prospect).slice(0,6).map(p=>(
              <div key={p.id} className="row" style={{ gap:12, padding:'9px 0', borderBottom:'1px solid var(--line)', cursor:'pointer' }} onClick={()=>go('profile',p.id)}>
                <Avatar p={p} size={36} />
                <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>{p.age}y · {p.club}</div></div>
                <PosTag pos={p.pos} />
                <div style={{ width:90 }}><Bar v={p.rating*10} /><div className="num" style={{ fontSize:10, color:'var(--ink-3)', marginTop:3, textAlign:'right' }}>{(p.rating*10).toFixed(0)} readiness</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-pad">
          <h3 style={{ fontSize:16, marginBottom:14 }}>Regional talent map</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[['Dhaka Division',4200,88],['Mymensingh (Kalsindur)',1850,72],['Chattogram',3100,64],['Rangamati (Hill Tracts)',980,58],['Rajshahi',2400,51],['Sylhet',1700,47]].map(([r,n,pct])=>(
              <div key={r}>
                <div className="row" style={{ justifyContent:'space-between', marginBottom:5, fontSize:13 }}><span style={{ fontWeight:600 }}>{r}</span><span className="num" style={{ color:'var(--ink-3)' }}>{n.toLocaleString()} players</span></div>
                <Bar v={pct} color={pct>70?'var(--pos)':'var(--primary)'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
window.Development = Development;


/* ===== screens-matches.jsx ===== */
/* Fixtures & Match Center */
/* ---- New fixture form ---- */
function FixtureForm({ onSubmit, onClose }) {
  const teams = [
    { value:'men_senior', label:"Men's senior" }, { value:'men_u23', label:"Men's U-23" },
    { value:'men_u20', label:"Men's U-20" }, { value:'women_senior', label:"Women's senior" },
    { value:'women_u20', label:"Women's U-20" },
  ];
  const [f, setF] = React.useState({
    comp:'', stage:'', team:'men_senior', date:'', time:'', venue:'', home:'Bangladesh', away:'', tickets:false,
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = async () => {
    const required = [['comp','Competition'],['date','Match date'],['venue','Venue'],['home','Home team'],['away','Away team']];
    const missing = required.find(([k]) => !String(f[k] || '').trim());
    if (missing) { toast(missing[1] + ' is required', 'muted'); return; }
    const ok = await confirmAction({
      title: 'Create fixture?', message: <>Schedule <b>{f.home} v {f.away}</b>?</>,
      detail: `${f.comp} · ${f.date}${f.time ? ' · ' + f.time : ''}`, confirmLabel:'Create fixture', icon:'plus',
    });
    if (ok) onSubmit({
      id:'f'+Date.now(), team:f.team, comp:f.comp, stage:f.stage || 'Fixture', date:f.date, time:f.time,
      venue:f.venue, home:f.home, away:f.away,
      hf:f.home==='Bangladesh'?'🇧🇩':'🏳️', af:f.away==='Bangladesh'?'🇧🇩':'🏳️',
      status:'Upcoming', tickets:f.tickets,
    });
  };
  return (
    <Modal title="New fixture" subtitle="Schedule a match across any national squad" onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" onClick={submit}><Icon name="check" size={15} />Create fixture</button>
      </>}>
      <div className="form-grid">
        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)' }}>Match details</div>
        <Field label="Competition *"><TextInput value={f.comp} onChange={set('comp')} placeholder="e.g. AFC Asian Cup Qual." autoFocus /></Field>
        <Field label="Stage / round"><TextInput value={f.stage} onChange={set('stage')} placeholder="e.g. Group C · MD5" /></Field>
        <Field label="Squad"><SelectInput value={f.team} onChange={set('team')} options={teams} /></Field>
        <Field label="Venue *"><TextInput value={f.venue} onChange={set('venue')} placeholder="Stadium, city" /></Field>
        <Field label="Match date *"><input type="date" className="field-input" value={f.date} onChange={set('date')} style={{ fontFamily:'inherit' }} /></Field>
        <Field label="Kick-off time"><input type="time" className="field-input" value={f.time} onChange={set('time')} style={{ fontFamily:'inherit' }} /></Field>

        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)', marginTop:6 }}>Teams</div>
        <Field label="Home team *"><TextInput value={f.home} onChange={set('home')} placeholder="Bangladesh" /></Field>
        <Field label="Away team *"><TextInput value={f.away} onChange={set('away')} placeholder="Opponent" /></Field>
        <Field label="Ticketing" span>
          <label className="row" style={{ gap:8, fontSize:13.5, cursor:'pointer' }}>
            <input type="checkbox" checked={f.tickets} onChange={set('tickets')} style={{ accentColor:'var(--primary)' }} /> Put tickets on sale for this fixture
          </label>
        </Field>
      </div>
    </Modal>
  );
}
window.FixtureForm = FixtureForm;

function Fixtures({ go }) {
  const D = window.DATA;
  const [mode, setMode] = React.useState('upcoming');
  const [extra, setExtra] = React.useState([]);
  const [adding, setAdding] = React.useState(false);
  const allFix = [...extra, ...D.fixtures];
  const list = allFix.filter(f => mode === 'upcoming' ? f.status === 'Upcoming' : f.status === 'Result');

  return (
    <div className="content-inner fade-in">
      <PageHead title="Fixtures & Match Center" desc="Schedule, results & live match management across all squads">
        <button className="btn ghost sm" onClick={()=>toast('Opening season calendar view')}><Icon name="cal" size={15} />Calendar</button>
        {AuthStore.canEdit() && <button className="btn sm" onClick={()=>setAdding(true)}><Icon name="plus" size={15} />New fixture</button>}
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'1fr 320px', alignItems:'start' }}>
        <div>
          <div className="row" style={{ gap:8, marginBottom:'var(--gap)' }}>
            <button className={'chip tab'+(mode==='upcoming'?' on':'')} onClick={()=>setMode('upcoming')}>Upcoming ({allFix.filter(f=>f.status==='Upcoming').length})</button>
            <button className={'chip tab'+(mode==='results'?' on':'')} onClick={()=>setMode('results')}>Results ({allFix.filter(f=>f.status==='Result').length})</button>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {list.map(f => <FixtureCard key={f.id} f={f} go={go} />)}
          </div>
        </div>

        {/* group standings */}
        <div className="card" style={{ overflow:'hidden', position:'sticky', top:0 }}>
          <div className="card-pad" style={{ paddingBottom:8 }}>
            <div className="eyebrow">AFC Asian Cup Qual.</div>
            <h3 style={{ fontSize:16, marginTop:4 }}>Group C standings</h3>
          </div>
          <table className="tbl" style={{ fontSize:13 }}>
            <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Team</th><th className="c">P</th><th className="c">GD</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Pts</th></tr></thead>
            <tbody>
              {D.standings.map((s,i)=>(
                <tr key={s.p} style={ s.us?{ background:'color-mix(in srgb,var(--primary) 8%,transparent)' }:{}}>
                  <td style={{ paddingLeft:'var(--pad)' }}><div className="row" style={{ gap:8 }}><span className="num" style={{ color:'var(--ink-3)', width:14 }}>{i+1}</span><Flag e={s.f} size={18} /><span style={{ fontWeight: s.us?800:600 }}>{s.p}</span></div></td>
                  <td className="c num">{s.pl}</td>
                  <td className="c num" style={{ color: s.gf-s.ga>0?'var(--pos)':s.gf-s.ga<0?'var(--neg)':'var(--ink-3)' }}>{s.gf-s.ga>0?'+':''}{s.gf-s.ga}</td>
                  <td className="r num" style={{ paddingRight:'var(--pad)', fontWeight:800 }}>{s.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="card-pad" style={{ fontSize:11.5, color:'var(--ink-faint)', borderTop:'1px solid var(--line)' }}>Top 2 qualify for AFC Asian Cup 2027.</div>
        </div>
      </div>
      {adding && <FixtureForm onClose={()=>setAdding(false)} onSubmit={(fx)=>{ setExtra([fx, ...extra]); setMode('upcoming'); setAdding(false); toast(<><b>{fx.home} v {fx.away}</b> added to the schedule</>); }} />}
    </div>
  );
}

function FixtureCard({ f, go }) {
  const result = f.status === 'Result';
  const bdHome = f.home === 'Bangladesh';
  const bdScore = bdHome ? f.hs : f.as, oppScore = bdHome ? f.as : f.hs;
  const outcome = result ? (bdScore>oppScore?'W':bdScore<oppScore?'L':'D') : null;
  return (
    <div className="card card-pad" style={{ cursor:'pointer' }} onClick={()=>go(result?'matchcenter':'teams')}>
      <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}>
        <div className="row" style={{ gap:8 }}>
          <span className="badge neutral">{f.comp}</span>
          <span style={{ fontSize:12, color:'var(--ink-3)' }}>{f.stage}</span>
        </div>
        {result ? <Badge kind={outcome==='W'?'pos':outcome==='L'?'neg':'warn'}>{outcome==='W'?'Win':outcome==='L'?'Loss':'Draw'}</Badge>
          : <span className="num" style={{ fontSize:12, color:'var(--ink-3)' }}><Icon name="clock" size={12} style={{ verticalAlign:-2 }} /> {f.time}</span>}
      </div>
      <div className="row" style={{ gap:12 }}>
        <div className="row" style={{ gap:10, flex:1, justifyContent:'flex-end', textAlign:'right' }}>
          <span style={{ fontWeight:700, fontSize:16 }}>{f.home}</span><Flag e={f.hf} size={28} />
        </div>
        <div style={{ minWidth:84, textAlign:'center' }}>
          {result ? <div className="num" style={{ fontWeight:800, fontSize:28 }}>{f.hs}<span style={{ color:'var(--ink-faint)', margin:'0 6px' }}>–</span>{f.as}</div>
            : <div className="num" style={{ fontWeight:800, fontSize:15, color:'var(--ink-3)' }}>{new Date(f.date).toLocaleDateString('en',{day:'2-digit',month:'short'})}</div>}
        </div>
        <div className="row" style={{ gap:10, flex:1 }}>
          <Flag e={f.af} size={28} /><span style={{ fontWeight:700, fontSize:16 }}>{f.away}</span>
        </div>
      </div>
      <div className="row" style={{ justifyContent:'space-between', marginTop:14, paddingTop:12, borderTop:'1px solid var(--line)', fontSize:12.5, color:'var(--ink-3)' }}>
        <span><Icon name="pin" size={13} style={{ verticalAlign:-2 }} /> {f.venue}</span>
        {result ? (f.scorers && <span style={{ maxWidth:'55%', textAlign:'right' }}><Icon name="ball" size={12} style={{ verticalAlign:-2 }} /> {f.scorers}</span>)
          : (f.tickets ? <span className="badge pos">Tickets on sale</span> : <span>{new Date(f.date).toLocaleDateString('en',{weekday:'short'})}</span>)}
      </div>
    </div>
  );
}
window.Fixtures = Fixtures;

/* Records & statistics */
function Records({ go }) {
  const D = window.DATA;
  const [g, setG] = React.useState('men');
  const scorers = g==='men'?D.records.topScorersMen:D.records.topScorersWomen;
  const caps = g==='men'?D.records.mostCapsMen:D.records.mostCapsWomen;
  const maxG = Math.max(...scorers.map(s=>s.g));

  return (
    <div className="content-inner fade-in">
      <PageHead title="Records & Statistics" desc="All-time leaders, honours & national team archives">
        <button className="btn ghost sm" onClick={()=>toast('Records exported to CSV')}><Icon name="dl" size={15} />Export CSV</button>
      </PageHead>

      <div className="row" style={{ gap:8, marginBottom:'var(--gap)' }}>
        <button className={'chip tab'+(g==='men'?' on':'')} onClick={()=>setG('men')} style={g==='men'?{}:{}}>Men's records</button>
        <button className={'chip tab'+(g==='women'?' on':'')} onClick={()=>setG('women')} style={g==='women'&&true?{ background:'var(--bff-red)', borderColor:'transparent', color:'#fff' }:{}}>Women's records</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns:'1.3fr 1fr' }}>
        <div className="card card-pad">
          <h3 style={{ fontSize:16, marginBottom:18 }}>All-time top scorers</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {scorers.map((s,i)=>(
              <div key={s.name} className="row" style={{ gap:14 }}>
                <span className="num" style={{ width:24, fontWeight:800, fontSize:18, color: i===0?'var(--bff-gold)':'var(--ink-faint)' }}>{i+1}</span>
                <div style={{ flex:1 }}>
                  <div className="row" style={{ justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontWeight:700 }}>{s.name} {i===0 && <Icon name="trophy" size={13} color="var(--bff-gold)" style={{ verticalAlign:-2 }} />}</span>
                    <span className="num" style={{ fontWeight:800 }}>{s.g}<span style={{ color:'var(--ink-faint)', fontWeight:500, fontSize:12 }}> gls</span></span>
                  </div>
                  <Bar v={s.g} max={maxG} color={i===0?'var(--bff-gold)':g==='women'?'var(--bff-red)':'var(--primary)'} />
                  <div className="num" style={{ fontSize:11, color:'var(--ink-faint)', marginTop:4 }}>{s.span}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
          <div className="card card-pad">
            <h3 style={{ fontSize:16, marginBottom:14 }}>Most caps</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {caps.map((c,i)=>(
                <div key={c.name} className="row" style={{ justifyContent:'space-between', padding:'10px 0', borderBottom:i<caps.length-1?'1px solid var(--line)':'none' }}>
                  <div className="row" style={{ gap:10 }}><span className="num" style={{ color:'var(--ink-faint)', width:16 }}>{i+1}</span><span style={{ fontWeight:600, fontSize:14 }}>{c.name}</span></div>
                  <span className="num" style={{ fontWeight:800 }}>{c.g}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-pad">
            <h3 style={{ fontSize:16, marginBottom:14 }}>Honours roll</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {D.records.honours.map((h,i)=>(
                <div key={i} className="row" style={{ gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:'color-mix(in srgb,var(--bff-gold) 18%,transparent)', display:'grid', placeItems:'center', color:'var(--bff-gold)', flex:'none' }}><Icon name="trophy" size={18} /></div>
                  <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{h.t}</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>{h.who}</div></div>
                  <span className="num badge neutral">{h.y}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Records = Records;


/* ===== screens-contracts.jsx ===== */
/* Player contract management — tiered (Gold/Silver/Bronze = Category A/B/C),
   season-term based, editable & persisted. Shared via window. */

const CONTRACT_TIERS = {
  Gold:   { cat:'A', color:'#c8962a', tint:'rgba(200,150,42,.14)', label:'Gold', desc:'Marquee / elite contract — top wage band & longest terms.' },
  Silver: { cat:'B', color:'#6b7a88', tint:'rgba(107,122,136,.16)', label:'Silver', desc:'Established first-team contract.' },
  Bronze: { cat:'C', color:'#a9682e', tint:'rgba(169,104,46,.15)', label:'Bronze', desc:'Squad / development contract.' },
};
const TIER_ORDER = ['Gold','Silver','Bronze'];
const seasonLabel = (y) => y + '\u2013' + String(y + 1).slice(2);   // 2024 -> "2024–25"
const fmtWk = (k) => '\u09f3' + (k >= 1000 ? (k/1000).toFixed(1).replace(/\.0$/,'') + 'M' : k + 'K');
const fmtYr = (k) => { const lakh = k * 52 / 100; return lakh >= 100 ? '\u09f3' + (lakh/100).toFixed(2) + 'Cr' : '\u09f3' + lakh.toFixed(1) + 'L'; };

function defaultContract(p) {
  const h = p.hue || (p.name ? p.name.length * 17 : 7);
  const tier = p.rating >= 7.8 ? 'Gold' : p.rating >= 7.0 ? 'Silver' : 'Bronze';
  const startY = 2024 + (h % 2);
  const seasons = 1 + (h % 3);
  const endY = startY + seasons - 1;
  const band = tier === 'Gold' ? [120, 360] : tier === 'Silver' ? [55, 150] : [22, 70];
  const weeklyK = band[0] + (h % (band[1] - band[0]));
  const bonusK = Math.round(weeklyK * (0.2 + (h % 5) / 10));
  const relCr = +( (weeklyK * 52 / 100 / 100) * (tier === 'Gold' ? 3 : tier === 'Silver' ? 2 : 1.4) ).toFixed(2);
  const status = h % 7 === 0 ? 'Pending renewal' : endY <= 2025 ? 'Expiring' : 'Active';
  return { tier, startY, endY, weeklyK, bonusK, release: '\u09f3' + relCr + 'Cr', status, signed: `${['Jan','Jun','Jul','Aug'][h%4]} ${startY}`, club: p.club };
}

const ContractStore = (() => {
  const LS = 'bff_contracts_v1';
  let patch = {};
  try { patch = JSON.parse(localStorage.getItem(LS) || '{}'); } catch {}
  const subs = new Set();
  const save = () => { try { localStorage.setItem(LS, JSON.stringify(patch)); } catch {} subs.forEach(f => f()); };
  return {
    subscribe(fn){ subs.add(fn); return () => subs.delete(fn); },
    get(p){ return Object.assign(defaultContract(p), patch[p.id] || {}); },
    tierOf(p){ return (patch[p.id] && patch[p.id].tier) || defaultContract(p).tier; },
    set(id, c){ patch[id] = Object.assign({}, patch[id], c); save(); },
  };
})();
function useContracts(){ const [,f] = React.useReducer(x=>x+1,0); React.useEffect(()=>ContractStore.subscribe(f),[]); return ContractStore; }

function TierBadge({ tier, sub, size = 'md' }) {
  const t = CONTRACT_TIERS[tier] || CONTRACT_TIERS.Bronze;
  const sm = size === 'sm';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding: sm?'2px 8px':'4px 11px', borderRadius:999, background:t.tint, color:t.color, fontWeight:800, fontSize: sm?11:12.5, fontFamily:'var(--ff-display)', letterSpacing:'.01em', whiteSpace:'nowrap' }}>
      <span style={{ width: sm?7:8, height: sm?7:8, borderRadius:'50%', background:t.color, flex:'none' }}></span>
      {t.label}{sub !== false && <span style={{ opacity:.7, fontWeight:700 }}>· {t.cat}</span>}
    </span>
  );
}

function ContractModal({ p, onClose }) {
  const cur = ContractStore.get(p);
  const [f, setF] = React.useState({ ...cur, startY: String(cur.startY), endY: String(cur.endY), weeklyK: String(cur.weeklyK), bonusK: String(cur.bonusK) });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const yrs = [2023,2024,2025,2026,2027,2028,2029,2030];
  const submit = async () => {
    const sY = Number(f.startY), eY = Number(f.endY);
    if (eY < sY) { toast('Contract end season must be on or after the start season', 'muted'); return; }
    const ok = await confirmAction({ title:'Save contract?', message:<>Update <b>{p.name}</b>’s contract to <b>{CONTRACT_TIERS[f.tier].label} (Cat {CONTRACT_TIERS[f.tier].cat})</b>?</>, detail:`${seasonLabel(sY)} → ${seasonLabel(eY)} · ${fmtWk(Number(f.weeklyK)||0)}/wk`, confirmLabel:'Save contract', icon:'check' });
    if (!ok) return;
    ContractStore.set(p.id, { tier:f.tier, startY:sY, endY:eY, weeklyK:Number(f.weeklyK)||0, bonusK:Number(f.bonusK)||0, release:f.release, status:f.status, signed:f.signed, club:p.club });
    toast(<><b>{p.name}</b>’s contract updated</>); onClose();
  };
  return (
    <Modal title="Manage contract" subtitle={`${p.name} · ${p.club}`} width={560} onClose={onClose}
      footer={<><button className="btn ghost sm" onClick={onClose}>Cancel</button><button className="btn sm" onClick={submit}><Icon name="check" size={15} />Save contract</button></>}>
      <div className="form-grid">
        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)' }}>Contract tier</div>
        <Field label="Tier / category" span>
          <div className="row" style={{ gap:8 }}>
            {TIER_ORDER.map(t => {
              const on = f.tier === t; const T = CONTRACT_TIERS[t];
              return (
                <button key={t} type="button" onClick={()=>setF({ ...f, tier:t })} style={{ flex:1, padding:'11px 8px', borderRadius:11, cursor:'pointer', fontFamily:'inherit', textAlign:'center', background: on?T.tint:'var(--surface-2)', border:'2px solid '+(on?T.color:'var(--line)') }}>
                  <div style={{ fontWeight:800, fontSize:14, color:on?T.color:'var(--ink)' }}>{T.label}</div>
                  <div style={{ fontSize:11, color:'var(--ink-3)', marginTop:2 }}>Category {T.cat}</div>
                </button>
              );
            })}
          </div>
        </Field>
        <div style={{ gridColumn:'1 / -1', fontSize:12, color:'var(--ink-3)', marginTop:-4 }}>{CONTRACT_TIERS[f.tier].desc}</div>

        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)', marginTop:6 }}>Term &amp; terms</div>
        <Field label="Start season"><select className="field-input" value={f.startY} onChange={set('startY')}>{yrs.map(y=><option key={y} value={y}>{seasonLabel(y)}</option>)}</select></Field>
        <Field label="End season"><select className="field-input" value={f.endY} onChange={set('endY')}>{yrs.map(y=><option key={y} value={y}>{seasonLabel(y)}</option>)}</select></Field>
        <Field label="Weekly wage (৳ thousands)"><TextInput value={f.weeklyK} onChange={set('weeklyK')} inputMode="numeric" placeholder="120" /></Field>
        <Field label="Appearance bonus (৳ thousands)"><TextInput value={f.bonusK} onChange={set('bonusK')} inputMode="numeric" placeholder="30" /></Field>
        <Field label="Release clause"><TextInput value={f.release} onChange={set('release')} placeholder="৳2.4Cr" /></Field>
        <Field label="Status"><select className="field-input" value={f.status} onChange={set('status')}>{['Active','Expiring','Pending renewal','Released'].map(s=><option key={s} value={s}>{s}</option>)}</select></Field>
      </div>
    </Modal>
  );
}
window.ContractModal = ContractModal;
window.TierBadge = TierBadge;
Object.assign(window, { CONTRACT_TIERS, TIER_ORDER, seasonLabel, fmtWk, fmtYr, ContractStore, useContracts, defaultContract });

function ContractCard({ p }) {
  useContracts();
  const c = ContractStore.get(p);
  const [edit, setEdit] = React.useState(false);
  const T = CONTRACT_TIERS[c.tier] || CONTRACT_TIERS.Bronze;
  const seasons = c.endY - c.startY + 1;
  const statusTone = c.status === 'Active' ? 'pos' : c.status === 'Released' ? 'neg' : 'warn';
  const rows = [
    ['BFF Player ID', 'BD-' + p.id.toUpperCase() + '-' + (2400 + (p.hue||0))],
    ['Club', c.club || p.club],
    ['Term', `${seasonLabel(c.startY)} → ${seasonLabel(c.endY)}`],
    ['Length', seasons + ' season' + (seasons>1?'s':'')],
    ['Signed', c.signed],
    ['Weekly wage', fmtWk(c.weeklyK) + '/wk'],
    ['Annual value', fmtYr(c.weeklyK) + '/yr'],
    ['Appearance bonus', fmtWk(c.bonusK)],
    ['Release clause', c.release],
  ];
  return (
    <div className="card card-pad">
      <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}>
        <h3 style={{ fontSize:16 }}>Contract</h3>
        {AuthStore.canEdit() && <button className="btn ghost sm" onClick={()=>setEdit(true)}><Icon name="edit" size={14} /> Manage</button>}
      </div>
      <div style={{ padding:'14px 16px', borderRadius:12, background:T.tint, border:'1px solid '+T.color+'44', marginBottom:14 }}>
        <div className="row" style={{ justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div className="row" style={{ gap:11 }}>
            <div style={{ width:42, height:42, borderRadius:11, background:T.color, color:'#fff', display:'grid', placeItems:'center', flex:'none', fontFamily:'var(--ff-display)', fontWeight:800, fontSize:18 }}>{T.cat}</div>
            <div><div style={{ fontWeight:800, fontSize:16, color:T.color }}>{T.label} contract</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>Category {T.cat} · {seasonLabel(c.startY)} → {seasonLabel(c.endY)}</div></div>
          </div>
          <Badge kind={statusTone} dot>{c.status}</Badge>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {rows.map(([k,v],i)=>(
          <div key={k} className="row" style={{ justifyContent:'space-between', padding:'10px 0', borderBottom:i<rows.length-1?'1px solid var(--line)':'none', fontSize:14 }}>
            <span style={{ color:'var(--ink-3)' }}>{k}</span>
            <b className={/ID|wage|value|bonus|clause/.test(k)?'num':''}>{v}</b>
          </div>
        ))}
      </div>
      {edit && <ContractModal p={p} onClose={()=>setEdit(false)} />}
    </div>
  );
}
window.ContractCard = ContractCard;


/* ===== screens-manage.jsx ===== */
/* Player Management — registration registry */
function PlayerManagement({ go }) {
  const D = window.DATA;
  useData();
  useContracts();
  const [q, setQ] = React.useState('');
  const [club, setClub] = React.useState('All');
  const [tierF, setTierF] = React.useState('All');
  const [sel, setSel] = React.useState(new Set());
  const [modal, setModal] = React.useState(null); // {mode:'add'|'edit', player}
  const fileRef = React.useRef(null);

  const rows = D.allPlayers.map(p => ({
    ...p,
    pid: 'BD-' + p.id.toUpperCase() + '-' + (2400 + p.hue),
    reg: p.hue % 7 === 0 ? 'Pending' : p.hue % 11 === 0 ? 'Expiring' : 'Active',
    tier: ContractStore.tierOf(p),
    contract: `Jun ${2026 + (p.hue % 3) + 1}`,
  })).filter(p => {
    if (club !== 'All' && p.club !== club) return false;
    if (tierF !== 'All' && p.tier !== tierF) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !p.pid.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const tierCount = (t) => D.allPlayers.filter(p => ContractStore.tierOf(p) === t).length;

  const clubs = ['All', ...Array.from(new Set(D.allPlayers.map(p => p.club)))];
  const toggle = (id) => { const n = new Set(sel); n.has(id) ? n.delete(id) : n.add(id); setSel(n); };
  const allSel = rows.length && rows.every(r => sel.has(r.id));
  const toggleAll = () => { allSel ? setSel(new Set()) : setSel(new Set(rows.map(r => r.id))); };

  const regBadge = (r) => r === 'Active' ? <Badge kind="pos" dot>Active</Badge> : r === 'Pending' ? <Badge kind="warn" dot>Pending</Badge> : <Badge kind="neg" dot>Expiring</Badge>;

  return (
    <div className="content-inner fade-in">
      <PageHead title="Player Management" desc="Registration, eligibility & contracts for the national pool">
        {AuthStore.canEdit() && <button className="btn ghost sm" onClick={()=>fileRef.current && fileRef.current.click()}><Icon name="dl" size={15} />Import CSV</button>}
        {AuthStore.canEdit() && <button className="btn sm" onClick={()=>setModal({ mode:'add' })}><Icon name="plus" size={15} />Register player</button>}
        <input ref={fileRef} type="file" accept=".csv" style={{ display:'none' }} onChange={e=>{ const n=e.target.files&&e.target.files[0]; if(n) toast(`Importing <b>${n.name}</b>… 24 records queued`); e.target.value=''; }} />
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Total registered" v={D.allPlayers.length} d="national pool" dColor="var(--ink-3)" glyph="users" onClick={()=>{ setClub('All'); setQ(''); setTierF('All'); }} />
        <Stat k="Gold · Cat A" v={tierCount('Gold')} d="marquee contracts" dColor="var(--ink-3)" glyph="star" accent="#c8962a" onClick={()=>setTierF('Gold')} />
        <Stat k="Silver · Cat B" v={tierCount('Silver')} d="first-team" dColor="var(--ink-3)" glyph="shield" onClick={()=>setTierF('Silver')} />
        <Stat k="Bronze · Cat C" v={tierCount('Bronze')} d="squad / dev" dColor="var(--ink-3)" glyph="users" accent="#a9682e" onClick={()=>setTierF('Bronze')} />
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        {/* toolbar */}
        <div className="card-pad row" style={{ justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
          <div className="search-global" style={{ maxWidth:340 }}>
            <Icon name="search" size={16} />
            <input placeholder="Search name or player ID…" value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <div className="row" style={{ gap:8 }}>
            {sel.size > 0 && (
              <div className="row" style={{ gap:8, marginRight:6 }}>
                <span style={{ fontSize:13, color:'var(--ink-3)' }} className="num">{sel.size} selected</span>
                <button className="btn ghost sm" onClick={async ()=>{ const ok=await confirmAction({ title:'Approve selected players?', message:<>Approve registration for <b>{sel.size}</b> selected player(s)? They will be cleared to play.</>, confirmLabel:'Approve', icon:'check' }); if(ok){ toast(`<b>${sel.size}</b> player(s) approved`); setSel(new Set()); } }}><Icon name="check" size={14} />Approve</button>
                <button className="btn ghost sm" onClick={()=>{ toast(`Exporting <b>${sel.size}</b> record(s) to CSV`); }}><Icon name="dl" size={14} />Export</button>
              </div>
            )}
            <select value={tierF} onChange={e=>setTierF(e.target.value)} style={{ height:38, borderRadius:10, border:'1px solid var(--line)', padding:'0 12px', background:'var(--surface)', color:'var(--ink)', fontFamily:'inherit', fontSize:13.5 }}>
              <option value="All">All tiers</option>
              {TIER_ORDER.map(t=><option key={t} value={t}>{CONTRACT_TIERS[t].label} · Cat {CONTRACT_TIERS[t].cat}</option>)}
            </select>
            <select value={club} onChange={e=>setClub(e.target.value)} style={{ height:38, borderRadius:10, border:'1px solid var(--line)', padding:'0 12px', background:'var(--surface)', color:'var(--ink)', fontFamily:'inherit', fontSize:13.5, maxWidth:200 }}>
              {clubs.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width:40, paddingLeft:'var(--pad)' }}><input type="checkbox" checked={allSel} onChange={toggleAll} style={{ accentColor:'var(--primary)' }} /></th>
              <th>Player</th>
              <th>Player ID</th>
              <th>Position</th>
              <th>Club</th>
              <th>Contract tier</th>
              <th>Registration</th>
              <th>Contract until</th>
              <th className="r" style={{ paddingRight:'var(--pad)' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} style={ sel.has(r.id)?{ background:'color-mix(in srgb,var(--primary) 6%,transparent)' }:{}}>
                <td style={{ paddingLeft:'var(--pad)' }} onClick={e=>{e.stopPropagation();toggle(r.id);}}><input type="checkbox" checked={sel.has(r.id)} onChange={()=>{}} style={{ accentColor:'var(--primary)' }} /></td>
                <td onClick={()=>go('profile',r.id)}><div className="row" style={{ gap:11 }}><Avatar p={r} size={34} /><div><div style={{ fontWeight:700, whiteSpace:'nowrap' }}>{r.name}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{r.age}y · {r.district}</div></div></div></td>
                <td className="num" style={{ color:'var(--ink-2)', fontSize:13 }} onClick={()=>go('profile',r.id)}>{r.pid}</td>
                <td onClick={()=>go('profile',r.id)}><PosTag pos={r.pos} /></td>
                <td style={{ color:'var(--ink-2)' }} onClick={()=>go('profile',r.id)}>{r.club}</td>
                <td onClick={()=>go('profile',r.id)}><TierBadge tier={r.tier} size="sm" /></td>
                <td onClick={()=>go('profile',r.id)}>{regBadge(r.reg)}</td>
                <td className="num" style={{ color:'var(--ink-2)' }} onClick={()=>go('profile',r.id)}>{r.contract}</td>
                <td className="r" style={{ paddingRight:'var(--pad)' }} onClick={e=>e.stopPropagation()}>
                  <div className="row" style={{ gap:6, justifyContent:'flex-end' }}>
                    <button className="icon-btn" style={{ width:32, height:32 }} title="Edit player" onClick={()=>setModal({ mode:'edit', player:r })}><Icon name="edit" size={15} /></button>
                    <button className="icon-btn" style={{ width:32, height:32 }} title="View profile" onClick={()=>go('profile',r.id)}><Icon name="arrowr" size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card-pad row" style={{ justifyContent:'space-between', borderTop:'1px solid var(--line)', fontSize:13, color:'var(--ink-3)' }}>
          <span className="num">Showing {rows.length} of {D.allPlayers.length} players</span>
          <div className="row" style={{ gap:6 }}>
            <button className="icon-btn" style={{ width:32, height:32 }}><Icon name="chev" size={15} style={{ transform:'rotate(180deg)' }} /></button>
            <span className="chip solid">1</span><span className="chip tab">2</span>
            <button className="icon-btn" style={{ width:32, height:32 }}><Icon name="chev" size={15} /></button>
          </div>
        </div>
      </div>

      {modal && modal.mode==='add' && (
        <PlayerForm mode="add" onClose={()=>setModal(null)} onSubmit={(f)=>{ const p=DataStore.addPlayer(f); setModal(null); toast(`<b>${p.name}</b> registered to the national pool`); }} />
      )}
      {modal && modal.mode==='edit' && (
        <PlayerForm mode="edit" initial={modal.player} onClose={()=>setModal(null)} onSubmit={(f)=>{ DataStore.updatePlayer(modal.player.id, f); setModal(null); toast(`<b>${f.name}</b> updated`); }} />
      )}
    </div>
  );
}
window.PlayerManagement = PlayerManagement;


