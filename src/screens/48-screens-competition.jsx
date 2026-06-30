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
  Bracket,
} = window;

/* ===== screens-competition.jsx ===== */
/* Rich Competition Management — per-competition standings, fixtures & results,
   team squads, and player performance/analysis. Overrides the basic screen. */

/* ---- deterministic helpers ---- */
const _hash = (s) => { let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return h>>>0; };
const _rng = (seed) => { let a=typeof seed==='string'?_hash(seed):seed; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; };
const _ri = (rng,min,max) => Math.floor(rng()*(max-min+1))+min;
const _pick = (rng,arr) => arr[Math.floor(rng()*arr.length)];

const COMP_TEAMS = {
  bpl: ['Bashundhara Kings','Abahani Limited Dhaka','Mohammedan SC','Bangladesh Police FC','Fortis FC','Sheikh Russel KC','Rahmatganj MFS','Brothers Union','Chittagong Abahani','Sheikh Jamal DC'],
  fedcup: ['Bashundhara Kings','Abahani Limited Dhaka','Mohammedan SC','Bangladesh Police FC','Fortis FC','Sheikh Russel KC','Rahmatganj MFS','Brothers Union','Chittagong Abahani','Sheikh Jamal DC'],
  indcup: ['Bashundhara Kings','Abahani Limited Dhaka','Mohammedan SC','Bangladesh Police FC','Fortis FC','Sheikh Russel KC','Rahmatganj MFS','Brothers Union','Chittagong Abahani','Sheikh Jamal DC','Dhaka Wanderers','Wari Club'],
  wfl: ['Bashundhara Kings W','Nasrin SC','ARB College','Sirajganj SS','Uttar Bongo SS','FC Brahmanbaria','Jamalpur KS','Cumilla United W','Sonali Otit'],
  bcl: ['Wari Club','Dhaka Wanderers','Agrani Bank SC','Fakirerpool YMC','BFF Elite Academy','PWD SC','Uttara FC','NoFeL SC','Little Friends','Azampur FC','Kawran Bazar PS','Swadhinata KS'],
  school: ['BKSP','St. Joseph High School','Dhaka Residential Model College','Govt. Laboratory High School','Monipur High School','Willes Little Flower School','Ideal School & College','Motijheel Model School','Rajuk Uttara Model','Faujdarhat Cadet College','Mirzapur Cadet College','Cumilla Zilla School','Rajshahi Collegiate','Sylhet Govt. Pilot','Khulna Zilla School','Barishal Zilla School'],
};
const teamsOf = (id) => COMP_TEAMS[id] || COMP_TEAMS.bpl;

const NAMES_M = { first:['Rahim','Karim','Jamal','Sohel','Rakib','Faisal','Nasir','Tariq','Imran','Mehedi','Shakib','Arif','Nahid','Sabbir','Hasan','Riad','Tanvir','Jahid','Naim','Rafiq','Sumon','Anwar','Russel','Mamun','Saiful','Foysal','Mizan','Robiul','Tofael','Emon','Biplu','Sohag'], last:['Ahmed','Hossain','Islam','Rahman','Uddin','Khan','Mia','Sheikh','Sarkar','Chowdhury','Haque','Ali','Molla','Biswas','Das','Roy','Mahmud','Sani','Bhuiyan','Talukder'] };
const NAMES_W = { first:['Sabina','Krishna','Maria','Monika','Sanjida','Ritu','Masura','Shamsunnahar','Swapna','Rupna','Mitu','Tohura','Anuching','Ritu','Akhi','Sirat','Nilufa','Shapla','Tania','Marjia'], last:['Khatun','Akter','Begum','Chakma','Rani','Sarkar','Parvin','Manda','Sultana','Tripura','Marma','Das'] };
const namePool = (id) => id==='wfl' ? NAMES_W : NAMES_M;

const _squadCache = {};
function buildSquad(compId, team) {
  const key = compId+'|'+team;
  if (_squadCache[key]) return _squadCache[key];
  const rng = _rng(key);
  const pool = namePool(compId);
  const plan = [['GK',2],['DF',6],['MF',6],['FW',4]];
  const usedNo = new Set(); const players = []; let idx=0;
  const baseApps = compId==='school' ? _ri(rng,4,8) : _ri(rng,14,22);
  plan.forEach(([pos,n])=>{
    for(let i=0;i<n;i++){
      let no; do { no=_ri(rng,1,40); } while(usedNo.has(no)); usedNo.add(no);
      const apps=Math.max(0, baseApps-_ri(rng,0,baseApps));
      const goals = pos==='FW'?_ri(rng,0,Math.max(1,Math.round(apps*0.6))):pos==='MF'?_ri(rng,0,Math.round(apps*0.3)):pos==='DF'?_ri(rng,0,3):0;
      const assists = pos==='GK'?0:_ri(rng,0,Math.round(apps*0.25));
      const rating = +(6.2+rng()*2.4).toFixed(1);
      const yc=_ri(rng,0,5), rc=rng()<0.12?1:0;
      const cleanSheets = pos==='GK'?_ri(rng,0,Math.round(apps*0.5)):0;
      players.push({ id:key+'#'+idx, no, name:_pick(rng,pool.first)+' '+_pick(rng,pool.last), pos, apps, goals, assists, rating, yc, rc, cleanSheets, age:_ri(rng, compId==='school'?15:18, compId==='school'?18:34), team });
      idx++;
    }
  });
  _squadCache[key]=players; return players;
}

const _standCache = {};
function buildStanding(compId) {
  if (_standCache[compId]) return _standCache[compId];
  const teams = teamsOf(compId);
  const rng = _rng('stand|'+compId);
  const pl = compId==='school'?6:compId==='bcl'?22:18;
  let rows = teams.map(t=>{
    const tr=_rng('row|'+compId+'|'+t);
    const w=_ri(tr,0,pl), rem=pl-w, d=_ri(tr,0,rem), l=rem-d;
    const gf=_ri(tr, w, w*2+6), ga=_ri(tr, l, l*2+6);
    return { p:t, pl, w, d, l, gf, ga, pts:w*3+d };
  });
  rows.sort((a,b)=> b.pts-a.pts || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf);
  _standCache[compId]=rows; return rows;
}

const _fixCache = {};
function buildFixtures(compId) {
  if (_fixCache[compId]) return _fixCache[compId];
  const teams=teamsOf(compId).slice(); const rng=_rng('fix|'+compId);
  const venues=['Bashundhara Kings Arena','Bangabandhu National Stadium','BFF Artificial Turf','Sylhet District Stadium','Sheikh Kamal Stadium','M. A. Aziz Stadium'];
  const mk=(done, day)=>{ const a=_pick(rng,teams); let b; do{ b=_pick(rng,teams);}while(b===a); return { a, b, as: done?_ri(rng,0,4):null, bs: done?_ri(rng,0,4):null, done, venue:_pick(rng,venues), when:day }; };
  const results=[]; for(let i=0;i<6;i++) results.push(mk(true, 'Jun '+(2+i)));
  const upcoming=[]; for(let i=0;i<5;i++) upcoming.push(mk(false, 'Jun '+(14+i*2)));
  const out={ results, upcoming }; _fixCache[compId]=out; return out;
}

function topPerformers(compId) {
  const teams=teamsOf(compId);
  let all=[]; teams.forEach(t=> all=all.concat(buildSquad(compId,t)));
  const scorers=[...all].sort((a,b)=> b.goals-a.goals || b.assists-a.assists).slice(0,8);
  const assisters=[...all].sort((a,b)=> b.assists-a.assists).slice(0,8);
  const rated=[...all].sort((a,b)=> b.rating-a.rating).slice(0,8);
  const totGoals=all.reduce((s,p)=>s+p.goals,0);
  const totYC=all.reduce((s,p)=>s+p.yc,0), totRC=all.reduce((s,p)=>s+p.rc,0);
  const cs=all.filter(p=>p.pos==='GK').reduce((s,p)=>s+p.cleanSheets,0);
  return { scorers, assisters, rated, totGoals, totYC, totRC, cs, squadCount:all.length };
}

const _initA = (s='') => s.trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const _initHue = (s='') => { let h=0; for(const c of s) h=(h*31+c.charCodeAt(0))%360; return h; };
function PFace({ name, size=34 }) {
  const hue=_initHue(name);
  return <div className="pavatar" style={{ width:size, height:size, fontSize:size*0.38, flex:'none', background:`linear-gradient(150deg, hsl(${hue} 46% 44%), hsl(${(hue+40)%360} 50% 32%))` }}>{_initA(name)}</div>;
}
const POS_TONE = { GK:'#e3a72f', DF:'#2f72e3', MF:'#00684a', FW:'#ee2939' };
function PosChip({ pos }) { return <span style={{ fontWeight:800, fontSize:10.5, color:POS_TONE[pos]||'var(--ink-3)', background:'color-mix(in srgb,'+(POS_TONE[pos]||'#888')+' 14%, transparent)', padding:'2px 6px', borderRadius:5 }}>{pos}</span>; }

/* ---- player performance modal ---- */
function PlayerPerf({ p, comp, onClose }) {
  const rng=_rng('form|'+p.id);
  const form=Array.from({length:6},()=>+(5.8+rng()*3).toFixed(1));
  const max=Math.max(...form, 9);
  const stat=(k,v,c)=>(<div style={{ background:'var(--surface-2)', borderRadius:10, padding:'11px 13px' }}><div style={{ fontSize:10, letterSpacing:'.07em', textTransform:'uppercase', color:'var(--ink-faint)', fontWeight:700 }}>{k}</div><div className="num" style={{ fontWeight:800, fontSize:21, marginTop:3, color:c||'var(--ink)' }}>{v}</div></div>);
  return (
    <Modal title={p.name} subtitle={`#${p.no} · ${p.pos} · ${p.team}`} width={560} onClose={onClose}
      footer={<button className="btn sm" onClick={onClose}><Icon name="check" size={15} />Close</button>}>
      <div className="row" style={{ gap:14, marginBottom:16 }}>
        <PFace name={p.name} size={56} />
        <div style={{ flex:1 }}><div className="row" style={{ gap:8 }}><PosChip pos={p.pos} /><span style={{ fontSize:12.5, color:'var(--ink-3)' }}>{p.age} yrs · {comp}</span></div><div style={{ marginTop:7 }}><RatingPill r={p.rating} /></div></div>
      </div>
      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:18 }}>
        {stat('Apps', p.apps)}
        {stat('Goals', p.goals, 'var(--pos)')}
        {stat('Assists', p.assists, 'var(--primary)')}
        {stat(p.pos==='GK'?'Clean sheets':'Avg rating', p.pos==='GK'?p.cleanSheets:p.rating.toFixed(1))}
      </div>
      <div className="eyebrow" style={{ marginBottom:10 }}>Form — last 6 matches</div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:96, marginBottom:18 }}>
        {form.map((v,i)=>(
          <div key={i} style={{ flex:1, textAlign:'center' }}>
            <div style={{ height:(v/max*72)+'px', background:ratingColor(v), borderRadius:6, marginBottom:5, display:'flex', alignItems:'flex-start', justifyContent:'center' }}><span className="num" style={{ fontSize:10, color:'#fff', fontWeight:700, marginTop:3 }}>{v.toFixed(1)}</span></div>
            <div style={{ fontSize:9.5, color:'var(--ink-faint)' }}>M{i+1}</div>
          </div>
        ))}
      </div>
      <div className="row" style={{ gap:8 }}>
        <span className="chip" style={{ height:24, fontSize:11.5 }}><Icon name="cards" size={12} color="#e3a72f" /> {p.yc} yellow</span>
        <span className="chip" style={{ height:24, fontSize:11.5 }}><Icon name="cards" size={12} color="#ee2939" /> {p.rc} red</span>
        <span className="chip" style={{ height:24, fontSize:11.5 }}>{p.apps?((p.goals+p.assists)/p.apps).toFixed(2):'0.00'} G+A / app</span>
      </div>
    </Modal>
  );
}

/* ---- team squad modal ---- */
function TeamSquad({ compId, team, comp, onClose }) {
  const squad=buildSquad(compId, team);
  const [perf, setPerf]=React.useState(null);
  const goals=squad.reduce((s,p)=>s+p.goals,0), assists=squad.reduce((s,p)=>s+p.assists,0);
  const avg=(squad.reduce((s,p)=>s+p.rating,0)/squad.length).toFixed(1);
  const hue=_initHue(team);
  return (
    <Modal title={team} subtitle={`${comp} · squad of ${squad.length}`} width={760} onClose={onClose}
      footer={<button className="btn sm" onClick={onClose}><Icon name="check" size={15} />Close</button>}>
      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
        {[['Squad', squad.length],['Goals', goals],['Assists', assists],['Avg rating', avg]].map(([k,v])=>(
          <div key={k} style={{ background:'var(--surface-2)', borderRadius:10, padding:'10px 12px' }}><div style={{ fontSize:10, letterSpacing:'.07em', textTransform:'uppercase', color:'var(--ink-faint)', fontWeight:700 }}>{k}</div><div className="num" style={{ fontWeight:800, fontSize:19, marginTop:3 }}>{v}</div></div>
        ))}
      </div>
      <div className="card" style={{ overflow:'hidden' }}>
        <table className="tbl">
          <thead><tr><th style={{ paddingLeft:'var(--pad)', width:36 }}>#</th><th>Player</th><th className="c">Pos</th><th className="c">Apps</th><th className="c">G</th><th className="c">A</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Rating</th></tr></thead>
          <tbody>
            {squad.map(p=>(
              <tr key={p.id} style={{ cursor:'pointer' }} onClick={()=>setPerf(p)}>
                <td style={{ paddingLeft:'var(--pad)' }}><span className="num" style={{ color:'var(--ink-3)', fontWeight:700 }}>{p.no}</span></td>
                <td><div className="row" style={{ gap:10 }}><PFace name={p.name} size={30} /><span style={{ fontWeight:700, fontSize:13.5 }}>{p.name}</span></div></td>
                <td className="c"><PosChip pos={p.pos} /></td>
                <td className="c num">{p.apps}</td>
                <td className="c num" style={{ fontWeight:700, color:p.goals?'var(--pos)':'var(--ink-3)' }}>{p.goals}</td>
                <td className="c num">{p.assists}</td>
                <td className="r" style={{ paddingRight:'var(--pad)' }}><RatingPill r={p.rating} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {perf && <PlayerPerf p={perf} comp={comp} onClose={()=>setPerf(null)} />}
    </Modal>
  );
}

function FixtureRow({ f, last }) {
  return (
    <div className="row" style={{ gap:12, padding:'11px var(--pad)', borderTop: last?'none':'1px solid var(--line)' }}>
      <div style={{ width:52, flex:'none', fontSize:11.5, color:'var(--ink-faint)', fontWeight:600 }}>{f.when}</div>
      <div style={{ flex:1, textAlign:'right', fontWeight:700, fontSize:13.5 }}>{f.a}</div>
      <div style={{ flex:'none', minWidth:54, textAlign:'center' }}>
        {f.done
          ? <span className="num" style={{ fontWeight:800, fontSize:15, background:'var(--surface-3)', padding:'2px 9px', borderRadius:7 }}>{f.as}–{f.bs}</span>
          : <span style={{ fontSize:11, color:'var(--ink-faint)', fontWeight:700 }}>vs</span>}
      </div>
      <div style={{ flex:1, fontWeight:700, fontSize:13.5 }}>{f.b}</div>
      <div style={{ width:150, flex:'none', fontSize:11, color:'var(--ink-faint)', textAlign:'right', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{f.venue}</div>
    </div>
  );
}

function CompetitionMgmt() {
  const D = window.DATA3;
  const [sel, setSel] = React.useState('bpl');
  const [tab, setTab] = React.useState('standings');
  const [extra, setExtra] = React.useState([]);
  const [adding, setAdding] = React.useState(false);
  const [team, setTeam] = React.useState(null);
  const isStaff = AuthStore.canEdit();
  const allComp = [...D.competitions, ...extra];
  const c = allComp.find(x => x.id === sel) || allComp[0];
  const stColor = (s) => s === 'Live' ? 'pos' : s === 'Done' ? 'neutral' : 'warn';
  const teams = teamsOf(c.id);
  const standings = buildStanding(c.id);
  const fixtures = buildFixtures(c.id);
  const perf = topPerformers(c.id);
  const hasTable = c.type === 'League' || c.type === 'Group + Knockout';
  const hasBracket = c.type === 'Knockout' || c.type === 'Group + Knockout';
  const bracketData = c.id==='school' ? D.schoolBracket : c.id==='fedcup' ? D.bracket : null;

  React.useEffect(()=>{ setTab('standings'); }, [sel]);

  const TABS = [['standings', hasTable?'Standings':'Bracket'],['fixtures','Fixtures & Results'],['teams','Teams'],['performers','Top Performers']];

  return (
    <div className="content-inner fade-in">
      <PageHead title="Competition Management" desc="Leagues, cups, scheduling, standings, squads & player performance">
        <button className="btn ghost sm" onClick={()=>toast(c.name+' season report exported')}><Icon name="dl" size={15} />Report</button>
        {isStaff && <button className="btn sm" onClick={()=>setAdding(true)}><Icon name="plus" size={15} />New competition</button>}
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Active competitions" v={allComp.filter(x=>x.status==='Live').length} d="this season" glyph="trophy" />
        <Stat k="Matches scheduled" v={allComp.reduce((s,x)=>s+x.total,0)} d="all competitions" dColor="var(--ink-3)" glyph="cal" />
        <Stat k="Matches played" v={allComp.reduce((s,x)=>s+x.played,0)} d="season to date" dColor="var(--ink-3)" glyph="ball" />
        <Stat k="Registered teams" v={Object.values(COMP_TEAMS).reduce((s,a)=>s+a.length,0)} d="across competitions" dColor="var(--ink-3)" glyph="shield" />
      </div>

      <div className="row" style={{ gap:8, marginBottom:'var(--gap)', flexWrap:'wrap' }}>
        {allComp.map(x => (
          <button key={x.id} className={'chip tab'+(sel===x.id?' on':'')} onClick={()=>setSel(x.id)} style={sel===x.id?{ background:x.color, borderColor:'transparent', color:'#fff' }:{}}>{x.short}</button>
        ))}
      </div>

      {/* competition header */}
      <div className="card card-pad" style={{ marginBottom:'var(--gap)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div>
          <div className="row" style={{ gap:9 }}><h3 style={{ fontSize:19 }}>{c.name}</h3><Badge kind={stColor(c.status)} dot>{c.status}</Badge></div>
          <div style={{ fontSize:13, color:'var(--ink-3)', marginTop:4 }}>{c.season} · {c.type} · {c.round} · {teams.length} teams</div>
        </div>
        <div style={{ textAlign:'right' }}><div className="num" style={{ fontWeight:800, fontSize:24 }}>{c.played}<span style={{ color:'var(--ink-faint)', fontSize:15 }}>/{c.total}</span></div><div style={{ fontSize:10.5, color:'var(--ink-faint)', letterSpacing:'.08em' }}>MATCHES</div></div>
      </div>

      {/* tab bar */}
      <div className="row" style={{ gap:8, marginBottom:'var(--gap)', flexWrap:'wrap' }}>
        {TABS.map(([k,l])=>(
          <button key={k} className={'chip tab'+(tab===k?' on':'')} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {tab==='standings' && (
        <div className="grid" style={{ gridTemplateColumns: hasTable&&hasBracket?'1.6fr 1fr':'1fr', alignItems:'start' }}>
          {hasTable && (
            <div className="card" style={{ overflow:'hidden' }}>
              <table className="tbl">
                <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>#</th><th>{c.id==='school'?'School':'Club'}</th><th className="c">P</th><th className="c">W</th><th className="c">D</th><th className="c">L</th><th className="c">GD</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Pts</th></tr></thead>
                <tbody>
                  {standings.map((t,i)=>(
                    <tr key={t.p} style={ i===0?{ background:'color-mix(in srgb,var(--bff-gold) 9%,transparent)' }:i<3?{ background:'color-mix(in srgb,var(--primary) 5%,transparent)' }:{}}>
                      <td style={{ paddingLeft:'var(--pad)' }}><span className="num" style={{ fontWeight:800, color: i===0?'var(--bff-gold)':i<3?'var(--primary)':'var(--ink-3)' }}>{i+1}</span></td>
                      <td style={{ fontWeight:700 }}><span style={{ cursor:'pointer' }} onClick={()=>setTeam(t.p)}>{t.p}</span></td>
                      <td className="c num">{t.pl}</td><td className="c num">{t.w}</td><td className="c num">{t.d}</td><td className="c num">{t.l}</td>
                      <td className="c num" style={{ color: t.gf-t.ga>0?'var(--pos)':t.gf-t.ga<0?'var(--neg)':'var(--ink-3)' }}>{t.gf-t.ga>0?'+':''}{t.gf-t.ga}</td>
                      <td className="r num" style={{ paddingRight:'var(--pad)', fontWeight:800 }}>{t.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {hasBracket && (
            <div className="card card-pad">
              <div className="eyebrow" style={{ marginBottom:12 }}>Knockout stage</div>
              {bracketData ? <Bracket bracket={bracketData} /> : <div style={{ fontSize:13, color:'var(--ink-3)' }}>Knockout rounds are seeded once the group stage concludes.</div>}
            </div>
          )}
        </div>
      )}

      {tab==='fixtures' && (
        <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', alignItems:'start' }}>
          <div className="card" style={{ overflow:'hidden' }}>
            <div className="card-pad" style={{ borderBottom:'1px solid var(--line)' }}><div className="row" style={{ gap:8 }}><h3 style={{ fontSize:15 }}>Results</h3><Badge kind="neutral">{fixtures.results.length}</Badge></div></div>
            {fixtures.results.map((f,i)=><FixtureRow key={i} f={f} last={i===fixtures.results.length-1} />)}
          </div>
          <div className="card" style={{ overflow:'hidden' }}>
            <div className="card-pad" style={{ borderBottom:'1px solid var(--line)' }}><div className="row" style={{ gap:8 }}><h3 style={{ fontSize:15 }}>Upcoming</h3><Badge kind="info">{fixtures.upcoming.length}</Badge></div></div>
            {fixtures.upcoming.map((f,i)=><FixtureRow key={i} f={f} last={i===fixtures.upcoming.length-1} />)}
          </div>
        </div>
      )}

      {tab==='teams' && (
        <div className="grid" style={{ gridTemplateColumns:'repeat(3, 1fr)' }}>
          {teams.map(t=>{
            const sq=buildSquad(c.id,t); const goals=sq.reduce((s,p)=>s+p.goals,0); const hue=_initHue(t);
            return (
              <div key={t} className="card card-pad row" style={{ gap:13, cursor:'pointer', transition:'transform .12s, box-shadow .12s' }} onClick={()=>setTeam(t)}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-md)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
                <div style={{ width:44, height:44, borderRadius:11, flex:'none', background:`linear-gradient(150deg, hsl(${hue} 48% 44%), hsl(${(hue+40)%360} 52% 32%))`, color:'#fff', display:'grid', placeItems:'center', fontWeight:800, fontSize:14 }}>{_initA(t)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:14, lineHeight:1.2 }}>{t}</div>
                  <div style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:3 }}>{sq.length} players · {goals} goals</div>
                </div>
                <Icon name="chev" size={16} color="var(--ink-faint)" />
              </div>
            );
          })}
        </div>
      )}

      {tab==='performers' && (
        <div>
          <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
            <Stat k="Goals scored" v={perf.totGoals} d="all teams" dColor="var(--ink-3)" glyph="ball" accent="var(--pos)" />
            <Stat k="Clean sheets" v={perf.cs} d="goalkeepers" dColor="var(--ink-3)" glyph="shield" />
            <Stat k="Yellow cards" v={perf.totYC} d="discipline" dColor="var(--ink-3)" glyph="cards" accent="#e3a72f" />
            <Stat k="Red cards" v={perf.totRC} d="discipline" dColor="var(--ink-3)" glyph="cards" accent="var(--bff-red)" />
          </div>
          <div className="grid" style={{ gridTemplateColumns:'repeat(3,1fr)', alignItems:'start' }}>
            {[['Top scorers','goals',perf.scorers,'var(--pos)'],['Most assists','assists',perf.assisters,'var(--primary)'],['Highest rated','rating',perf.rated,'var(--bff-gold)']].map(([title,field,list,col])=>(
              <div key={title} className="card" style={{ overflow:'hidden' }}>
                <div className="card-pad" style={{ borderBottom:'1px solid var(--line)' }}><h3 style={{ fontSize:15 }}>{title}</h3></div>
                {list.map((p,i)=>(
                  <div key={p.id} className="row" style={{ gap:11, padding:'9px var(--pad)', borderTop:i>0?'1px solid var(--line)':'none', cursor:'pointer' }} onClick={()=>setTeam(p.team)}>
                    <span className="num" style={{ width:16, color:'var(--ink-faint)', fontWeight:700, fontSize:12, flex:'none' }}>{i+1}</span>
                    <PFace name={p.name} size={30} />
                    <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div><div style={{ fontSize:11, color:'var(--ink-3)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.team}</div></div>
                    <span className="num" style={{ fontWeight:800, fontSize:15, color:col, flex:'none' }}>{field==='rating'?p.rating.toFixed(1):p[field]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="card card-pad" style={{ marginTop:'var(--gap)' }}>
            <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}><h3 style={{ fontSize:16 }}>Season analysis — {c.short}</h3><Badge kind="info">{perf.squadCount} players</Badge></div>
            <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
              {[['Goals / match', (perf.totGoals/Math.max(1,c.played)).toFixed(2)],['Avg squad size', Math.round(perf.squadCount/teams.length)],['Cards / match', ((perf.totYC+perf.totRC)/Math.max(1,c.played)).toFixed(2)],['Clean-sheet rate', Math.round(perf.cs/Math.max(1,c.played)*100)+'%']].map(([k,v])=>(
                <div key={k}><div style={{ fontSize:11.5, color:'var(--ink-3)', marginBottom:4 }}>{k}</div><div className="num" style={{ fontWeight:800, fontSize:22 }}>{v}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {team && <TeamSquad compId={c.id} team={team} comp={c.name} onClose={()=>setTeam(null)} />}
      {adding && <CompetitionForm onClose={()=>setAdding(false)} onSubmit={(comp)=>{ setExtra([...extra, comp]); setSel(comp.id); setAdding(false); toast(<><b>{comp.name}</b> created</>); }} />}
    </div>
  );
}
window.CompetitionMgmt = CompetitionMgmt;

