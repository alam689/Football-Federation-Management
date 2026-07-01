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

/* ===== screens-fms.jsx ===== */
/* Bundled FMS screens: clubs, referees, governance, analytics, matchcenter, roadmap */

/* ===== screen-clubs.jsx ===== */
/* Clubs & Licensing — Club Management + Coach Licensing (FMS modules) */
function ClubCrest({ c, size = 40 }) {
  const init = c.name.replace('Limited','').split(' ').filter(w=>w[0]&&w[0]===w[0].toUpperCase()).map(w=>w[0]).slice(0,2).join('');
  return <div style={{ width:size, height:size, flex:'none', borderRadius:'9px 9px 11px 11px', background:`linear-gradient(150deg, hsl(${c.hue} 55% 42%), hsl(${(c.hue+30)%360} 58% 28%))`, display:'grid', placeItems:'center', color:'#fff', fontFamily:'var(--ff-display)', fontWeight:800, fontSize:size*0.34, boxShadow:'inset 0 0 0 2px rgba(255,255,255,.15)' }}>{init}</div>;
}

/* ---- Register / edit club form ---- */
function ClubForm({ initial, mode = 'add', onSubmit, onClose }) {
  const [f, setF] = React.useState(Object.assign({
    name:'', city:'', div:'BPL', founded:'', license:'A', status:'Licensed', players:'', coach:'', titles:'',
  }, initial || {}));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    const required = [['name','Club name'],['city','City'],['founded','Year founded'],['coach','Head coach']];
    const missing = required.find(([k]) => !String(f[k] || '').trim());
    if (missing) { toast(missing[1] + ' is required', 'muted'); return; }
    const ok = await confirmAction({
      title: mode === 'add' ? 'Register club?' : 'Save changes?',
      message: mode === 'add' ? <>Register <b>{f.name}</b> to the club register?</> : <>Save changes to <b>{f.name}</b>?</>,
      detail: `${f.div} · ${f.city} · Licence ${f.license}`,
      confirmLabel: mode === 'add' ? 'Register club' : 'Save changes', icon: mode === 'add' ? 'plus' : 'edit',
    });
    if (ok) onSubmit({
      id: f.id || ('c' + Date.now()), name:f.name, city:f.city, div:f.div,
      founded: Number(f.founded) || new Date().getFullYear(), license:f.license, status:f.status,
      players: Number(f.players) || 0, coach:f.coach, titles: Number(f.titles) || 0,
      hue: f.hue != null ? f.hue : (f.name.length * 37) % 360,
    });
  };
  return (
    <Modal title={mode === 'add' ? 'Register new club' : 'Edit club'} subtitle={mode === 'add' ? 'Add a club to the national register' : f.name} onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" onClick={submit}><Icon name="check" size={15} />{mode === 'add' ? 'Register club' : 'Save changes'}</button>
      </>}>
      <div className="form-grid">
        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)' }}>Club identity</div>
        <Field label="Club name *" span><TextInput value={f.name} onChange={set('name')} placeholder="e.g. Bashundhara Kings" autoFocus /></Field>
        <Field label="City *"><TextInput value={f.city} onChange={set('city')} placeholder="Dhaka" /></Field>
        <Field label="Year founded *"><TextInput value={f.founded} onChange={set('founded')} inputMode="numeric" placeholder="2016" /></Field>
        <Field label="Division"><SelectInput value={f.div} onChange={set('div')} options={['BPL', 'Championship', "Women's League", 'Other']} /></Field>
        <Field label="Head coach *"><TextInput value={f.coach} onChange={set('coach')} placeholder="Coach name" /></Field>

        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)', marginTop:6 }}>Licensing &amp; squad</div>
        <Field label="Licence"><SelectInput value={f.license} onChange={set('license')} options={['A', 'B', 'C']} /></Field>
        <Field label="Status"><SelectInput value={f.status} onChange={set('status')} options={['Licensed', 'Pending', 'Suspended']} /></Field>
        <Field label="Squad size"><TextInput value={f.players} onChange={set('players')} inputMode="numeric" placeholder="28" /></Field>
        <Field label="Titles won"><TextInput value={f.titles} onChange={set('titles')} inputMode="numeric" placeholder="0" /></Field>
      </div>
    </Modal>
  );
}
window.ClubForm = ClubForm;

function Clubs() {
  const D = window.DATA2;
  const [tab, setTab] = React.useState('clubs');
  const [openClub, setOpenClub] = React.useState(null);
  const [extra, setExtra] = React.useState([]);
  const [overrides, setOverrides] = React.useState({});
  const [form, setForm] = React.useState(null); // {mode:'add'} | {mode:'edit', club}
  const allClubs = [...extra, ...D.clubs].map(c => overrides[c.id] ? { ...c, ...overrides[c.id] } : c);
  const licColor = { A:'var(--pos)', B:'var(--info)', C:'var(--warn)' };
  const stColor = (s)=> s==='Licensed'?'pos':s==='Pending'?'warn':'neg';

  return (
    <div className="content-inner fade-in">
      <PageHead title="Clubs & Licensing" desc="Club registration, club licensing & coach certification">
        <button className="btn ghost sm" onClick={()=>toast('Licensing report exported')}><Icon name="dl" size={15} />Licensing report</button>
        <button className="btn sm" onClick={()=>setForm({ mode:'add' })}><Icon name="plus" size={15} />Register club</button>
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Registered clubs" v={allClubs.length} d="BPL + Championship + W" dColor="var(--ink-3)" glyph="shield" />
        <Stat k="A-licensed" v={allClubs.filter(c=>c.license==='A').length} d="top tier" glyph="check" />
        <Stat k="Under review" v={allClubs.filter(c=>c.status!=='Licensed').length} d="action needed" dColor="var(--warn)" glyph="clock" accent="var(--warn)" />
        <Stat k="Licensed coaches" v={D.coaches.length} d="AFC/UEFA certified" dColor="var(--ink-3)" glyph="whistle" accent="var(--bff-red)" />
      </div>

      <div className="row" style={{ gap:8, marginBottom:'var(--gap)' }}>
        <button className={'chip tab'+(tab==='clubs'?' on':'')} onClick={()=>setTab('clubs')}>Club management</button>
        <button className={'chip tab'+(tab==='coaches'?' on':'')} onClick={()=>setTab('coaches')}>Coach licensing</button>
      </div>

      {tab==='clubs' ? (
        <div className="grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))' }}>
          {allClubs.map(c => (
            <div key={c.id} className="card card-pad" style={{ cursor:'pointer', transition:'transform .12s, box-shadow .12s' }} onClick={()=>setOpenClub(c)}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-md)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
              <div className="row" style={{ gap:13, marginBottom:14 }}>
                <ClubCrest c={c} size={48} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:15.5, lineHeight:1.1 }}>{c.name}</div>
                  <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:3 }}><Icon name="pin" size={12} style={{ verticalAlign:-2 }} /> {c.city} · est. {c.founded}</div>
                </div>
                <div className="row" style={{ gap:6, flex:'none' }} onClick={e=>e.stopPropagation()}>
                  <button className="icon-btn" style={{ width:30, height:30 }} title="Edit club" onClick={()=>setForm({ mode:'edit', club:c })}><Icon name="edit" size={14} /></button>
                  <span className="badge" style={{ background:'color-mix(in srgb,'+(licColor[c.license])+' 16%,transparent)', color:licColor[c.license] }}>Lic. {c.license}</span>
                </div>
              </div>
              <div className="row" style={{ justifyContent:'space-between', padding:'12px 0', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)' }}>
                {[['Division',c.div],['Squad',c.players],['Titles',c.titles]].map(([k,v])=>(
                  <div key={k} style={{ textAlign:'center', flex:1 }}><div className="num" style={{ fontWeight:800, fontSize:15 }}>{v}</div><div style={{ fontSize:10.5, color:'var(--ink-faint)' }}>{k}</div></div>
                ))}
              </div>
              <div className="row" style={{ justifyContent:'space-between', marginTop:12 }}>
                <span style={{ fontSize:12.5, color:'var(--ink-3)' }}><Icon name="whistle" size={12} style={{ verticalAlign:-2 }} /> {c.coach}</span>
                <Badge kind={stColor(c.status)} dot>{c.status}</Badge>
              </div>
              <div className="row" style={{ justifyContent:'flex-end', marginTop:10, fontSize:12, color:'var(--primary)', fontWeight:700 }}>View squad <Icon name="arrowr" size={13} /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ overflow:'hidden' }}>
          <table className="tbl">
            <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Coach</th><th>Role</th><th>License</th><th className="c">Courses</th><th className="c">Expiry</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Status</th></tr></thead>
            <tbody>
              {D.coaches.map(co => (
                <tr key={co.id}>
                  <td style={{ paddingLeft:'var(--pad)' }}><div className="row" style={{ gap:11 }}><div className="pavatar" style={{ width:34, height:34, fontSize:12, background:'var(--primary)' }}>{co.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div><div><div style={{ fontWeight:700 }}>{co.name}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{co.nat}</div></div></div></td>
                  <td style={{ color:'var(--ink-2)' }}>{co.role}</td>
                  <td><span className="badge info">{co.license}</span></td>
                  <td className="c num">{co.courses}</td>
                  <td className="c num">{co.expiry}</td>
                  <td className="r" style={{ paddingRight:'var(--pad)' }}><Badge kind={co.status==='Valid'?'pos':'warn'} dot>{co.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {openClub && <ClubDetail club={openClub} onClose={()=>setOpenClub(null)} onEdit={()=>{ const c = openClub; setOpenClub(null); setForm({ mode:'edit', club:c }); }} />}
      {form && form.mode === 'add' && (
        <ClubForm mode="add" onClose={()=>setForm(null)} onSubmit={(c)=>{ setExtra([c, ...extra]); setForm(null); toast(<><b>{c.name}</b> registered</>); }} />
      )}
      {form && form.mode === 'edit' && (
        <ClubForm mode="edit" initial={form.club} onClose={()=>setForm(null)} onSubmit={(c)=>{ setOverrides({ ...overrides, [c.id]: c }); setExtra(extra.map(x=>x.id===c.id?c:x)); setForm(null); toast(<><b>{c.name}</b> updated</>); }} />
      )}
    </div>
  );
}
window.Clubs = Clubs;

/* Season-wise club roster (deterministic from club + season) */
const CLUB_SEASONS = ['2025–26', '2024–25', '2023–24'];
const FIRST_NAMES = ['Rakib','Sohel','Tariq','Imran','Jewel','Mahbub','Nasir','Faisal','Robiul','Shahin','Anik','Parvez','Sabbir','Jamil','Russel','Hemanta','Biplob','Arif','Mithun','Nayeem','Topu','Sujon','Rana','Emon','Foysal','Limon','Saad','Bishal','Rohit','Tanvir'];
const LAST_NAMES = ['Hossain','Islam','Rahman','Ahmed','Uddin','Mia','Khan','Sarker','Chowdhury','Sheikh','Das','Roy','Barua','Haque','Akand','Mahmud','Bhuiyan','Talukder','Sikder','Molla'];
const SQUAD_POS = ['GK','GK','DF','DF','DF','DF','DF','MF','MF','MF','MF','MF','FW','FW','FW','FW'];

function clubSquad(club, season) {
  const sIdx = CLUB_SEASONS.indexOf(season);
  let seed = club.hue * 97 + sIdx * 5077 + 13;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const size = 16 + Math.floor(rnd() * 4);
  const players = [];
  const usedNo = new Set();
  for (let i = 0; i < size; i++) {
    const pos = SQUAD_POS[i] || ['DF','MF','FW'][Math.floor(rnd()*3)];
    const fn = FIRST_NAMES[Math.floor(rnd()*FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(rnd()*LAST_NAMES.length)];
    let no; do { no = 1 + Math.floor(rnd()*40); } while (usedNo.has(no)); usedNo.add(no);
    const apps = 4 + Math.floor(rnd()*26);
    const goals = pos==='FW' ? Math.floor(rnd()*14) : pos==='MF' ? Math.floor(rnd()*7) : pos==='GK' ? 0 : Math.floor(rnd()*3);
    const name = fn + ' ' + ln;
    let h=0; for (const ch of name) h=(h*31+ch.charCodeAt(0))%360;
    players.push({ name, pos, no, age: 18 + Math.floor(rnd()*16), apps, goals, nat: rnd()>0.85?'Foreign':'BD', initials:(fn[0]+ln[0]).toUpperCase(), hue:h });
  }
  const order = { GK:0, DF:1, MF:2, FW:3 };
  return players.sort((a,b)=> order[a.pos]-order[b.pos] || b.apps-a.apps);
}

function ClubDetail({ club, onClose, onEdit }) {
  const [season, setSeason] = React.useState(CLUB_SEASONS[0]);
  const squad = React.useMemo(() => clubSquad(club, season), [club, season]);
  const byPos = (p) => squad.filter(x => x.pos === p);
  const totalGoals = squad.reduce((s,p)=>s+p.goals,0);
  const foreign = squad.filter(p=>p.nat==='Foreign').length;
  const avgAge = Math.round(squad.reduce((s,p)=>s+p.age,0)/squad.length);
  const posName = { GK:'Goalkeepers', DF:'Defenders', MF:'Midfielders', FW:'Forwards' };

  return (
    <Modal title={club.name} subtitle={`${club.city} · ${club.div} · est. ${club.founded}`} width={760} onClose={onClose}
      footer={<>
        {onEdit && <button className="btn ghost sm" onClick={onEdit}><Icon name="edit" size={14} />Edit club</button>}
        <button className="btn ghost sm" onClick={()=>toast(`${club.name} ${season} squad list exported`)}><Icon name="dl" size={14} />Export squad</button>
        <button className="btn sm" onClick={onClose}><Icon name="check" size={15} />Close</button>
      </>}>
      {/* season selector */}
      <div className="row" style={{ justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:10 }}>
        <div className="row" style={{ gap:7 }}>
          <span className="eyebrow" style={{ alignSelf:'center' }}>Season</span>
          {CLUB_SEASONS.map(s=>(
            <button key={s} className={'chip tab'+(season===s?' on':'')} onClick={()=>setSeason(s)}>{s}</button>
          ))}
        </div>
        <span className="num" style={{ fontSize:12.5, color:'var(--ink-3)', alignSelf:'center' }}>{squad.length} players</span>
      </div>

      {/* season summary */}
      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
        {[['Squad size',squad.length],['Avg age',avgAge],['Goals',totalGoals],['Foreign',foreign]].map(([k,v])=>(
          <div key={k} style={{ padding:'10px 12px', background:'var(--surface-2)', borderRadius:10 }}>
            <div className="num" style={{ fontWeight:800, fontSize:18 }}>{v}</div>
            <div style={{ fontSize:11, color:'var(--ink-3)' }}>{k}</div>
          </div>
        ))}
      </div>

      {/* roster by position */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {['GK','DF','MF','FW'].map(pos=>{
          const list = byPos(pos);
          if (!list.length) return null;
          return (
            <div key={pos}>
              <div className="row" style={{ gap:9, marginBottom:8 }}><PosTag pos={pos} /><span style={{ fontWeight:700, fontSize:13.5 }}>{posName[pos]}</span><span className="num" style={{ fontSize:12, color:'var(--ink-faint)' }}>{list.length}</span></div>
              <div style={{ border:'1px solid var(--line)', borderRadius:10, overflow:'hidden' }}>
                {list.map((p,i)=>(
                  <div key={p.no} className="row" style={{ gap:12, padding:'9px 12px', borderTop: i>0?'1px solid var(--line)':'none' }}>
                    <span className="num" style={{ width:24, textAlign:'center', fontWeight:800, color:'var(--ink-3)' }}>{p.no}</span>
                    <div className="pavatar" style={{ width:30, height:30, fontSize:11, background:`linear-gradient(150deg, hsl(${p.hue} 52% 44%), hsl(${(p.hue+40)%360} 55% 32%))` }}>{p.initials}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="row" style={{ gap:7 }}><span style={{ fontWeight:600, fontSize:13.5, whiteSpace:'nowrap' }}>{p.name}</span>{p.nat==='Foreign' && <span className="badge neutral" style={{ fontSize:9.5 }}>Foreign</span>}</div>
                    </div>
                    <span className="num" style={{ fontSize:12, color:'var(--ink-3)', width:46 }}>{p.age}y</span>
                    <span className="num" style={{ fontSize:12.5, width:64, textAlign:'right' }}><b>{p.apps}</b> <span style={{ color:'var(--ink-faint)' }}>apps</span></span>
                    <span className="num" style={{ fontSize:12.5, width:64, textAlign:'right' }}><b>{p.goals}</b> <span style={{ color:'var(--ink-faint)' }}>gls</span></span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
window.ClubDetail = ClubDetail;


/* ===== screen-referees.jsx ===== */
/* Referee Management — assignments & rankings (FMS module) */
/* ---- Add match official form ---- */
function OfficialForm({ onSubmit, onClose }) {
  const [f, setF] = React.useState({
    name: '', cat: 'National', role: 'Referee', district: '', dob: '', nid: '',
    contact: '', email: '', licensed: '', fitness: 'Pending', status: 'Active', matches: '', rating: '',
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    const required = [
      ['name', 'Official name'], ['contact', 'Contact number'], ['dob', 'Date of birth'],
      ['nid', 'National ID / Birth Registration ID'], ['district', 'District'],
    ];
    const missing = required.find(([k]) => !String(f[k] || '').trim());
    if (missing) { toast(missing[1] + ' is required', 'muted'); return; }
    const ok = await confirmAction({
      title: 'Add official?',
      message: <>Register <b>{f.name}</b> to the match-official register?</>,
      detail: `${f.role} · ${f.cat} · ${f.district}`,
      confirmLabel: 'Add official', icon: 'plus',
    });
    if (ok) onSubmit({
      id: 'r' + Date.now(), name: f.name, cat: f.cat, role: f.role, district: f.district,
      matches: Number(f.matches) || 0, rating: Number(f.rating) || 0,
      fitness: f.fitness === 'Passed' ? 'Passed' : 'Pending', status: f.status,
    });
  };
  return (
    <Modal title="Add match official" subtitle="Register a referee, assistant or VAR to the official roster" onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" onClick={submit}><Icon name="check" size={15} />Add official</button>
      </>}>
      <div className="form-grid">
        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)' }}>Identity &amp; contact</div>
        <Field label="Full name *" span><TextInput value={f.name} onChange={set('name')} placeholder="e.g. Jalaluddin" autoFocus /></Field>
        <Field label="Date of birth *"><input type="date" className="field-input" value={f.dob} onChange={set('dob')} style={{ fontFamily:'inherit' }} /></Field>
        <Field label="National ID / Birth Reg. ID *"><TextInput value={f.nid} onChange={set('nid')} inputMode="numeric" placeholder="e.g. 19852694512345678" /></Field>
        <Field label="Contact number *"><TextInput value={f.contact} onChange={set('contact')} inputMode="tel" placeholder="+880 1XXX-XXXXXX" /></Field>
        <Field label="Email"><TextInput value={f.email} onChange={set('email')} inputMode="email" placeholder="name@example.com" /></Field>
        <Field label="District *"><TextInput value={f.district} onChange={set('district')} placeholder="Dhaka" /></Field>

        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)', marginTop:6 }}>Officiating profile</div>
        <Field label="Role"><SelectInput value={f.role} onChange={set('role')} options={['Referee', 'Assistant', 'Fourth official', 'VAR']} /></Field>
        <Field label="Category"><SelectInput value={f.cat} onChange={set('cat')} options={['FIFA', 'National']} /></Field>
        <Field label="Licensed since"><TextInput value={f.licensed} onChange={set('licensed')} inputMode="numeric" placeholder="2015" /></Field>
        <Field label="Fitness test"><SelectInput value={f.fitness} onChange={set('fitness')} options={['Pending', 'Passed']} /></Field>
        <Field label="Matches officiated"><TextInput value={f.matches} onChange={set('matches')} inputMode="numeric" placeholder="0" /></Field>
        <Field label="Rating"><TextInput value={f.rating} onChange={set('rating')} inputMode="decimal" placeholder="7.0" /></Field>
        <Field label="Status"><SelectInput value={f.status} onChange={set('status')} options={['Active', 'Inactive', 'Suspended']} /></Field>
      </div>
    </Modal>
  );
}
window.OfficialForm = OfficialForm;

/* ---- Match-official assignments ---- */
function AssignmentsModal({ onClose }) {
  const fixtures = [
    { match:'Bangladesh vs Bhutan', comp:'AFC Asian Cup Qual.', date:'Jun 14', time:'17:00', ref:'Jalaluddin', ar:'Md. Bitu Mia · Tahmina Akter', vr:'Nayeem Hasan', status:'Confirmed' },
    { match:'Nepal vs Bangladesh', comp:'AFC U-23 Qual.', date:'Jun 18', time:'16:00', ref:'Sujit Banerjee', ar:'Abu Sayeed', vr:'—', status:'Confirmed' },
    { match:'BD W vs India', comp:'SAFF U-20 W.', date:'Jun 22', time:'15:30', ref:'Sayma Akter', ar:'Tahmina Akter', vr:'Nayeem Hasan', status:'Pending' },
    { match:'Myanmar vs Bangladesh', comp:'AFC Asian Cup Qual.', date:'Jun 19', time:'20:00', ref:'—', ar:'—', vr:'—', status:'Unassigned' },
  ];
  const sKind = (s) => s==='Confirmed' ? 'pos' : s==='Pending' ? 'warn' : 'neutral';
  return (
    <Modal title="Match-official assignments" subtitle="Referee, assistant & VAR appointments · upcoming window" width={780} onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={()=>toast('Assignment sheet exported')}><Icon name="dl" size={14} />Export sheet</button>
        <button className="btn sm" onClick={onClose}><Icon name="check" size={15} />Close</button>
      </>}>
      <div className="card" style={{ overflow:'hidden', boxShadow:'none', border:'1px solid var(--line)' }}>
        <table className="tbl">
          <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Fixture</th><th>Referee</th><th>Assistants</th><th>VAR</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Status</th></tr></thead>
          <tbody>
            {fixtures.map((f,i)=>(
              <tr key={i} style={{ cursor:'default' }}>
                <td style={{ paddingLeft:'var(--pad)' }}><div style={{ fontWeight:700, whiteSpace:'nowrap' }}>{f.match}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{f.comp} · {f.date} · {f.time}</div></td>
                <td style={{ color:'var(--ink-2)', whiteSpace:'nowrap' }}>{f.ref}</td>
                <td style={{ color:'var(--ink-2)', fontSize:12.5 }}>{f.ar}</td>
                <td style={{ color:'var(--ink-2)', whiteSpace:'nowrap' }}>{f.vr}</td>
                <td className="r" style={{ paddingRight:'var(--pad)' }}><Badge kind={sKind(f.status)} dot>{f.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
window.AssignmentsModal = AssignmentsModal;

function Referees() {
  const D = window.DATA2;
  const [cat, setCat] = React.useState('All');
  const [extra, setExtra] = React.useState([]);
  const [adding, setAdding] = React.useState(false);
  const [showAssign, setShowAssign] = React.useState(false);
  const all = [...extra, ...D.referees];
  const list = all.filter(r => cat === 'All' || r.cat === cat);
  const stColor = (s) => s === 'Active' ? 'pos' : 'neg';

  return (
    <div className="content-inner fade-in">
      <PageHead title="Referee Management" desc="Officials, assignments, fitness tests & rankings">
        <button className="btn ghost sm" onClick={()=>setShowAssign(true)}><Icon name="cal" size={15} />Assignments</button>
        <button className="btn sm" onClick={()=>setAdding(true)}><Icon name="plus" size={15} />Add official</button>
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Registered officials" v={all.length} d="referees + ARs + VAR" dColor="var(--ink-3)" glyph="whistle" />
        <Stat k="FIFA badge" v={all.filter(r=>r.cat==='FIFA').length} d="international" glyph="globe" />
        <Stat k="Fitness pending" v={all.filter(r=>r.fitness==='Pending').length} d="test due" dColor="var(--warn)" glyph="health" accent="var(--warn)" />
        <Stat k="Avg rating" v={(all.reduce((s,r)=>s+r.rating,0)/all.length).toFixed(1)} d="season" dColor="var(--ink-3)" glyph="star" accent="var(--bff-gold)" />
      </div>

      <div className="row" style={{ gap:8, marginBottom:'var(--gap)' }}>
        {['All','FIFA','National'].map(c => <button key={c} className={'chip tab'+(cat===c?' on':'')} onClick={()=>setCat(c)}>{c}</button>)}
      </div>

      <div className="grid" style={{ gridTemplateColumns:'1.9fr 1fr', alignItems:'start' }}>
        <div className="card" style={{ overflow:'hidden' }}>
          <table className="tbl">
            <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Official</th><th>Role</th><th className="c">Matches</th><th className="c">Fitness</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Rating</th></tr></thead>
            <tbody>
              {list.map(r => (
                <tr key={r.id}>
                  <td style={{ paddingLeft:'var(--pad)' }}><div className="row" style={{ gap:11 }}><div className="pavatar" style={{ width:34, height:34, fontSize:12, flex:'none', background:`hsl(${(r.matches*7)%360} 45% 38%)` }}>{r.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div><div style={{ minWidth:0 }}><div className="row" style={{ gap:7 }}><span style={{ fontWeight:700, whiteSpace:'nowrap' }}>{r.name}</span>{r.cat==='FIFA' && <span className="badge info" style={{ flex:'none' }}>FIFA</span>}</div><div style={{ fontSize:11.5, color:'var(--ink-3)', whiteSpace:'nowrap' }}>{r.district}</div></div></div></td>
                  <td style={{ color:'var(--ink-2)' }}>{r.role}</td>
                  <td className="c num">{r.matches}</td>
                  <td className="c"><Badge kind={r.fitness==='Passed'?'pos':'warn'}>{r.fitness}</Badge></td>
                  <td className="r" style={{ paddingRight:'var(--pad)' }}><RatingPill r={r.rating} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontSize:16, marginBottom:14 }}>Upcoming assignments</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[['Bangladesh vs Bhutan','Jun 14','Jalaluddin'],['Nepal vs Bangladesh','Jun 18','Sujit Banerjee'],['BD W vs India','Jun 22','Sayma Akter']].map(([m,d,ref],i)=>(
              <div key={i} className="row" style={{ gap:12, padding:'10px 12px', border:'1px solid var(--line)', borderRadius:10 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:'var(--surface-3)', display:'grid', placeItems:'center', color:'var(--primary)', flex:'none' }}><Icon name="whistle" size={17} /></div>
                <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{m}</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>Referee: {ref}</div></div>
                <span className="num badge neutral">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {adding && <OfficialForm onClose={()=>setAdding(false)} onSubmit={(o)=>{ setExtra([o, ...extra]); setAdding(false); toast(<><b>{o.name}</b> added to the official register</>); }} />}
      {showAssign && <AssignmentsModal onClose={()=>setShowAssign(false)} />}
    </div>
  );
}
window.Referees = Referees;

/* Transfers & Discipline — Transfer System + Disciplinary System (FMS modules) */
/* ---- New transfer form ---- */
function TransferForm({ initial, mode = 'add', onSubmit, onClose }) {
  const clubs = (window.DATA2 && window.DATA2.clubs ? window.DATA2.clubs.map(c => c.name) : []);
  const parseFee = (fee) => {
    if (!fee || fee === 'Free' || fee === 'Undisclosed') return { feeAmt: '', feeUnit: 'L' };
    const m = String(fee).match(/([\d.]+)\s*(Cr|L)?/i);
    return { feeAmt: m ? m[1] : '', feeUnit: m && m[2] ? (m[2].toLowerCase() === 'cr' ? 'Cr' : 'L') : 'L' };
  };
  const [f, setF] = React.useState(Object.assign({
    player:'', from: clubs[0] || '', to: clubs[1] || '', feeAmt:'', feeUnit:'L', type:'Permanent', status:'Pending', date:'',
  }, initial ? { player: initial.player, from: initial.from, to: initial.to, type: initial.type, status: initial.status, date: initial.date, ...parseFee(initial.fee) } : {}));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    const required = [['player','Player name'],['from','Selling club'],['to','Buying club'],['date','Transfer date']];
    const missing = required.find(([k]) => !String(f[k] || '').trim());
    if (missing) { toast(missing[1] + ' is required', 'muted'); return; }
    if (f.from && f.to && f.from === f.to) { toast('Selling and buying club must differ', 'muted'); return; }
    const fee = f.type === 'Free transfer' ? 'Free' : (f.feeAmt ? '৳' + f.feeAmt + f.feeUnit : 'Undisclosed');
    const ok = await confirmAction({
      title: mode === 'add' ? 'Create transfer?' : 'Save changes?',
      message: mode === 'add' ? <>Register the transfer of <b>{f.player}</b>?</> : <>Save changes to <b>{f.player}</b>’s transfer?</>,
      detail: `${f.from} → ${f.to} · ${f.type} · ${fee}`, confirmLabel: mode === 'add' ? 'Create transfer' : 'Save changes', icon: mode === 'add' ? 'plus' : 'edit',
    });
    if (ok) onSubmit({ id: initial ? initial.id : ('t'+Date.now()), player:f.player, from:f.from, to:f.to, fee, type:f.type, status:f.status, date:f.date });
  };
  return (
    <Modal title={mode === 'add' ? 'New transfer' : 'Edit transfer'} subtitle={mode === 'add' ? 'Register a player movement between clubs' : f.player} onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" onClick={submit}><Icon name="check" size={15} />{mode === 'add' ? 'Create transfer' : 'Save changes'}</button>
      </>}>
      <div className="form-grid">
        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)' }}>Movement</div>
        <Field label="Player *" span><PlayerPicker value={f.player} onChange={set('player')} onPick={(p)=>setF(prev=>({ ...prev, player:p.name, from: clubs.includes(p.club) ? p.club : prev.from }))} placeholder="Search player database…" autoFocus /></Field>
        <Field label="From (selling club) *">{clubs.length ? <SelectInput value={f.from} onChange={set('from')} options={clubs} /> : <TextInput value={f.from} onChange={set('from')} placeholder="Selling club" />}</Field>
        <Field label="To (buying club) *">{clubs.length ? <SelectInput value={f.to} onChange={set('to')} options={clubs} /> : <TextInput value={f.to} onChange={set('to')} placeholder="Buying club" />}</Field>
        <Field label="Transfer date *"><input type="date" className="field-input" value={f.date} onChange={set('date')} style={{ fontFamily:'inherit' }} /></Field>
        <Field label="Type"><SelectInput value={f.type} onChange={set('type')} options={['Permanent', 'Loan', 'Free transfer']} /></Field>

        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)', marginTop:6 }}>Fee &amp; approval</div>
        <Field label="Fee">
          <div className="row" style={{ gap:8 }}>
            <TextInput value={f.feeAmt} onChange={set('feeAmt')} inputMode="numeric" placeholder="85" disabled={f.type==='Free transfer'} />
            <SelectInput value={f.feeUnit} onChange={set('feeUnit')} options={[{ value:'L', label:'Lakh' }, { value:'Cr', label:'Crore' }]} />
          </div>
        </Field>
        <Field label="Status"><SelectInput value={f.status} onChange={set('status')} options={['Pending', 'Approved', 'Rejected']} /></Field>
      </div>
    </Modal>
  );
}
window.TransferForm = TransferForm;

/* ---- Log disciplinary case form ---- */
function DisciplineForm({ onSubmit, onClose }) {
  const clubs = (window.DATA2 && window.DATA2.clubs ? window.DATA2.clubs.map(c => c.name) : []);
  const [f, setF] = React.useState({
    player:'', club: clubs[0] || '', offense:'', sanction:'', fineAmt:'', status:'Pending', date:'',
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    const required = [['player','Player / official name'],['offense','Offense'],['sanction','Sanction'],['date','Case date']];
    const missing = required.find(([k]) => !String(f[k] || '').trim());
    if (missing) { toast(missing[1] + ' is required', 'muted'); return; }
    const ok = await confirmAction({
      title: 'Log disciplinary case?', message: <>Open a disciplinary case for <b>{f.player}</b>?</>,
      detail: `${f.offense} · ${f.sanction}`, confirmLabel:'Log case', icon:'plus',
    });
    if (ok) onSubmit({ id:'d'+Date.now(), player:f.player, club:f.club, offense:f.offense, sanction:f.sanction, fine: f.fineAmt ? '৳'+f.fineAmt+'K' : '—', status:f.status, date:f.date });
  };
  return (
    <Modal title="Log disciplinary case" subtitle="Record an offense, sanction and fine" onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" onClick={submit}><Icon name="check" size={15} />Log case</button>
      </>}>
      <div className="form-grid">
        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)' }}>Case details</div>
        <Field label="Player / official *"><PlayerPicker value={f.player} onChange={set('player')} onPick={(p)=>setF(prev=>({ ...prev, player:p.name, club: clubs.includes(p.club) ? p.club : prev.club }))} placeholder="Search player database…" autoFocus /></Field>
        <Field label="Club">{clubs.length ? <SelectInput value={f.club} onChange={set('club')} options={clubs} /> : <TextInput value={f.club} onChange={set('club')} placeholder="Club" />}</Field>
        <Field label="Offense *" span><TextInput value={f.offense} onChange={set('offense')} placeholder="e.g. Serious foul play" /></Field>
        <Field label="Sanction *"><TextInput value={f.sanction} onChange={set('sanction')} placeholder="e.g. 3 match ban" /></Field>
        <Field label="Fine (৳, thousands)"><TextInput value={f.fineAmt} onChange={set('fineAmt')} inputMode="numeric" placeholder="60" /></Field>
        <Field label="Case date *"><input type="date" className="field-input" value={f.date} onChange={set('date')} style={{ fontFamily:'inherit' }} /></Field>
        <Field label="Status"><SelectInput value={f.status} onChange={set('status')} options={['Pending', 'Active', 'Served']} /></Field>
      </div>
    </Modal>
  );
}
window.DisciplineForm = DisciplineForm;

function Governance() {
  const D = window.DATA2;
  const [tab, setTab] = React.useState('transfers');
  const [xtra, setXtra] = React.useState([]);
  const [dxtra, setDxtra] = React.useState([]);
  const [form, setForm] = React.useState(null); // 'transfer' | 'discipline'
  const [editT, setEditT] = React.useState(null);
  const [tOver, setTOver] = React.useState({});
  const allTransfers = [...xtra, ...D.transfers].map(t => tOver[t.id] ? { ...t, ...tOver[t.id] } : t);
  const allDiscipline = [...dxtra, ...D.discipline];
  const tColor = (s) => s==='Approved'?'pos':s==='Pending'?'warn':'info';

  return (
    <div className="content-inner fade-in">
      <PageHead title="Transfers & Discipline" desc="Transfer workflow & disciplinary management">
        <button className="btn ghost sm" onClick={()=>toast('Export started')}><Icon name="dl" size={15} />Export</button>
        <button className="btn sm" onClick={()=>setForm(tab==='transfers'?'transfer':'discipline')}><Icon name="plus" size={15} />{tab==='transfers'?'New transfer':'Log case'}</button>
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Open transfers" v={allTransfers.filter(t=>t.status!=='Approved').length} d="window: summer" dColor="var(--ink-3)" glyph="arrowr" />
        <Stat k="Approved (window)" v={allTransfers.filter(t=>t.status==='Approved').length} d="completed" glyph="check" />
        <Stat k="Active sanctions" v={allDiscipline.filter(d=>d.status==='Active').length} d="bans in force" dColor="var(--neg)" glyph="cards" accent="var(--bff-red)" />
        <Stat k="Pending cases" v={allDiscipline.filter(d=>d.status==='Pending').length} d="committee review" dColor="var(--warn)" glyph="clock" accent="var(--warn)" />
      </div>

      <div className="row" style={{ gap:8, marginBottom:'var(--gap)' }}>
        <button className={'chip tab'+(tab==='transfers'?' on':'')} onClick={()=>setTab('transfers')}>Transfer system</button>
        <button className={'chip tab'+(tab==='discipline'?' on':'')} onClick={()=>setTab('discipline')}>Disciplinary</button>
      </div>

      {tab==='transfers' ? (
        <div className="card" style={{ overflow:'hidden' }}>
          <table className="tbl">
            <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Player</th><th>Movement</th><th>Type</th><th className="c">Fee</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Status</th></tr></thead>
            <tbody>
              {allTransfers.map(t => (
                <tr key={t.id} className="row-click" style={{ cursor:'pointer' }} title="Edit this transfer" onClick={()=>setEditT(t)}>
                  <td style={{ paddingLeft:'var(--pad)', fontWeight:700 }}>{t.player}</td>
                  <td><div className="row" style={{ gap:8, color:'var(--ink-2)', fontSize:13 }}><span>{t.from}</span><Icon name="arrowr" size={14} color="var(--ink-faint)" /><b style={{ color:'var(--ink)' }}>{t.to}</b></div></td>
                  <td><span className="badge neutral">{t.type}</span></td>
                  <td className="c num" style={{ fontWeight:700 }}>{t.fee}</td>
                  <td className="r" style={{ paddingRight:'var(--pad)' }}><div className="row" style={{ gap:8, justifyContent:'flex-end' }}><Badge kind={tColor(t.status)} dot>{t.status}</Badge><Icon name="edit" size={14} color="var(--ink-faint)" /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ overflow:'hidden' }}>
          <table className="tbl">
            <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Player / Official</th><th>Offense</th><th>Sanction</th><th className="c">Fine</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Status</th></tr></thead>
            <tbody>
              {allDiscipline.map(d => (
                <tr key={d.id}>
                  <td style={{ paddingLeft:'var(--pad)' }}><div style={{ fontWeight:700 }}>{d.player}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{d.club}</div></td>
                  <td style={{ color:'var(--ink-2)' }}>{d.offense}</td>
                  <td><span className="badge neg">{d.sanction}</span></td>
                  <td className="c num">{d.fine}</td>
                  <td className="r" style={{ paddingRight:'var(--pad)' }}><Badge kind={d.status==='Active'?'neg':d.status==='Pending'?'warn':'neutral'} dot>{d.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {form==='transfer' && <TransferForm onClose={()=>setForm(null)} onSubmit={(t)=>{ setXtra([t, ...xtra]); setTab('transfers'); setForm(null); toast(<><b>{t.player}</b> transfer registered</>); }} />}
      {editT && <TransferForm mode="edit" initial={editT} onClose={()=>setEditT(null)} onSubmit={(t)=>{ setTOver(o=>({ ...o, [t.id]: t })); setXtra(xs=>xs.map(x=>x.id===t.id?t:x)); setEditT(null); toast(<><b>{t.player}</b>’s transfer updated</>); }} />}
      {form==='discipline' && <DisciplineForm onClose={()=>setForm(null)} onSubmit={(d)=>{ setDxtra([d, ...dxtra]); setTab('discipline'); setForm(null); toast(<>Case logged for <b>{d.player}</b></>); }} />}
    </div>
  );
}
window.Governance = Governance;


/* ===== screen-analytics.jsx ===== */
/* Football Analytics Department (guideline §6) */
function Analytics() {
  const A = window.DATA2.analytics;
  const riskColor = { High:'var(--neg)', Medium:'var(--warn)', Low:'var(--pos)' };
  const mx = Math.max(...A.teamForm);
  const [chip, setChip] = React.useState(null);
  const CHIP_INFO = {
    'AI/ML': { icon:'trend', body:'Machine-learning models power injury-risk prediction, performance forecasting and recruitment fit-scoring across the national pool.', uses:['Injury risk model','Recruitment fit score','Form forecasting'] },
    'Computer Vision': { icon:'search', body:'Automated event detection and player tracking from match footage — auto-tagging goals, passes, pressing actions and positional data.', uses:['Auto event tagging','Player tracking','Heat maps'] },
    'GPS': { icon:'health', body:'Wearable GPS / IMU load monitoring (Catapult) streams training-load, distance and fatigue metrics into the analytics engine.', uses:['Training load','Fatigue alerts','Sprint distance'] },
    'Video': { icon:'ball', body:'Centralised video pipeline ingests, indexes, clips and publishes match & training footage to coaches and scouts within hours.', uses:['Footage library','Clip publishing','Opponent reels'] },
  };

  return (
    <div className="content-inner fade-in">
      <PageHead title="Football Analytics" desc="Performance intelligence · opponent analysis · injury prediction · recruitment">
        <div className="row" style={{ gap:6 }}>
          {['AI/ML','Computer Vision','GPS','Video'].map(t=><button key={t} className="chip" style={{ cursor:'pointer', fontFamily:'inherit' }} onClick={()=>setChip(t)} title={`What ${t} powers`}>{t}</button>)}
        </div>
      </PageHead>

      {chip && (() => { const c = CHIP_INFO[chip]; return (
        <Modal title={chip} subtitle="Analytics capability" width={460} onClose={()=>setChip(null)}
          footer={<button className="btn sm" onClick={()=>setChip(null)}><Icon name="check" size={15} />Got it</button>}>
          <div className="row" style={{ gap:13, alignItems:'flex-start', marginBottom:14 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:'var(--surface-3)', color:'var(--primary)', display:'grid', placeItems:'center', flex:'none' }}><Icon name={c.icon} size={22} /></div>
            <p style={{ fontSize:13.5, lineHeight:1.55, color:'var(--ink-2)', margin:0 }}>{c.body}</p>
          </div>
          <div className="eyebrow" style={{ marginBottom:8 }}>Powers</div>
          <div className="row" style={{ gap:7, flexWrap:'wrap' }}>
            {c.uses.map(u => <span key={u} className="badge neutral">{u}</span>)}
          </div>
        </Modal>
      ); })()}

      <div className="grid" style={{ gridTemplateColumns:'1.4fr 1fr', marginBottom:'var(--gap)' }}>
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:16 }}>
            <h3 style={{ fontSize:16 }}>Team performance index</h3>
            <Badge kind="pos" dot>Trending up</Badge>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:150 }}>
            {A.teamForm.map((v,i)=>(
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-end', alignItems:'center', gap:6 }}>
                <span className="num" style={{ fontSize:10, color:'var(--ink-3)' }}>{v}</span>
                <div style={{ width:'100%', height:(v/mx*120), background: i===A.teamForm.length-1?'var(--pos)':'linear-gradient(180deg,var(--primary-soft),var(--primary))', borderRadius:'6px 6px 0 0' }}></div>
                <span style={{ fontSize:9.5, color:'var(--ink-faint)' }}>M{i+1}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-pad">
          <h3 style={{ fontSize:16, marginBottom:14 }}>Style vs SAFF average</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
            {A.metrics.map(m=>(
              <div key={m.k}>
                <div className="row" style={{ justifyContent:'space-between', marginBottom:6, fontSize:12.5, gap:10, flexWrap:'nowrap' }}>
                  <span style={{ fontWeight:600, whiteSpace:'nowrap' }}>{m.k}</span>
                  <span className="num" style={{ whiteSpace:'nowrap' }}><b>{m.raw?m.v:m.v+'%'}</b> <span style={{ color:'var(--ink-faint)' }}>vs {m.raw?m.comp:m.comp+'%'}</span></span>
                </div>
                <div style={{ position:'relative' }}>
                  <Bar v={m.raw?m.v/2*100:m.v} color="var(--primary)" />
                  <span style={{ position:'absolute', top:-2, bottom:-2, left:(m.raw?m.comp/2*100:m.comp)+'%', width:2, background:'var(--ink)', borderRadius:2 }} title="SAFF avg"></span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11, color:'var(--ink-faint)', marginTop:10 }}>│ marker = SAFF average</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns:'1fr 1fr' }}>
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}><h3 style={{ fontSize:16, whiteSpace:'nowrap' }}>Injury risk prediction</h3><Badge kind="info">ML model</Badge></div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {A.injuryRisk.map(r=>(
              <div key={r.name} className="row" style={{ gap:12 }}>
                <div style={{ flex:1 }}>
                  <div className="row" style={{ justifyContent:'space-between', marginBottom:4 }}><span style={{ fontWeight:700, fontSize:13.5, whiteSpace:'nowrap' }}>{r.name}</span><span className="badge" style={{ background:'color-mix(in srgb,'+riskColor[r.risk]+' 14%,transparent)', color:riskColor[r.risk] }}>{r.risk}</span></div>
                  <Bar v={r.load} color={riskColor[r.risk]} />
                  <div style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:4 }}>{r.note} · load {r.load}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}><h3 style={{ fontSize:16 }}>Recruitment intelligence</h3><Badge kind="neutral">Fit score</Badge></div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {A.recruitment.map(r=>(
              <div key={r.name} className="row" style={{ gap:12, padding:'9px 0', borderBottom:'1px solid var(--line)' }}>
                <Ring pct={r.fit} size={46} stroke={5} color="var(--primary)" />
                <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{r.name}</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>{r.tag}</div></div>
                <PosTag pos={r.pos} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
window.Analytics = Analytics;


/* ===== screen-matchcenter.jsx ===== */
/* Match Center — live stats, ratings, heat map, highlights (guideline §4) */
function MatchCenter({ go }) {
  const m = {
    comp:'SAFF Women\u2019s Championship', stage:'Semi-final', venue:'Dasharath Stadium, Kathmandu', date:'5 Jun 2026',
    home:'Bangladesh', away:'Bhutan', hf:'🇧🇩', af:'🇧🇹', hs:3, as:0, status:'FULL-TIME',
    events:[
      { min:12, type:'goal', team:'h', who:'Ritu Porna Chakma', note:'assist: Monika' },
      { min:31, type:'yellow', team:'a', who:'Deki Lhazom' },
      { min:44, type:'goal', team:'h', who:'Sabina Khatun', note:'penalty' },
      { min:60, type:'sub', team:'h', who:'Shamsunnahar Jr.', note:'on for Krishna' },
      { min:78, type:'goal', team:'h', who:'Krishna Rani Sarkar', note:'assist: Sanjida' },
    ],
    stats:[ ['Possession',58,42,'%'], ['Shots',16,5], ['On target',8,1], ['Corners',7,2], ['Fouls',9,14], ['Pass accuracy',84,71,'%'] ],
    ratings:[
      { name:'Ritu Porna Chakma', pos:'FW', r:8.9 },{ name:'Sabina Khatun', pos:'FW', r:8.6 },
      { name:'Monika Chakma', pos:'MF', r:8.2 },{ name:'Rupna Chanda', pos:'GK', r:7.9 },
      { name:'Maria Manda', pos:'MF', r:7.7 },
    ],
  };
  const evIcon = { goal:'ball', yellow:'cards', sub:'arrowr' };
  const evColor = { goal:'var(--pos)', yellow:'var(--warn)', sub:'var(--info)' };

  return (
    <div className="content-inner fade-in">
      <button className="chip tab" style={{ marginBottom:16 }} onClick={()=>go('fixtures')}><Icon name="chev" size={13} style={{ transform:'rotate(180deg)' }} /> Back to fixtures</button>

      {/* scoreboard */}
      <div className="card" style={{ overflow:'hidden', marginBottom:'var(--gap)' }}>
        <div style={{ background:'linear-gradient(115deg,var(--primary-deep),var(--primary))', color:'#fff', padding:'22px var(--pad)' }}>
          <div className="row" style={{ justifyContent:'center', gap:10, marginBottom:8, fontSize:12.5, opacity:.9 }}>
            <span>{m.comp} · {m.stage}</span>
          </div>
          <div className="row" style={{ justifyContent:'center', gap:30, alignItems:'center' }}>
            <div className="row" style={{ gap:12, flex:1, justifyContent:'flex-end' }}><span style={{ fontWeight:800, fontSize:22 }}>{m.home}</span><Flag e={m.hf} size={40} /></div>
            <div style={{ textAlign:'center' }}>
              <div className="num" style={{ fontWeight:800, fontSize:44, lineHeight:1 }}>{m.hs} <span style={{ opacity:.5 }}>–</span> {m.as}</div>
              <div className="badge" style={{ background:'var(--bff-red)', color:'#fff', marginTop:8 }}>{m.status}</div>
            </div>
            <div className="row" style={{ gap:12, flex:1 }}><Flag e={m.af} size={40} /><span style={{ fontWeight:800, fontSize:22 }}>{m.away}</span></div>
          </div>
          <div className="row" style={{ justifyContent:'center', gap:16, marginTop:14, fontSize:12.5, opacity:.85 }}>
            <span><Icon name="pin" size={13} style={{ verticalAlign:-2 }} /> {m.venue}</span><span>·</span><span>{m.date}</span>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', alignItems:'start' }}>
        {/* timeline */}
        <div className="card card-pad">
          <h3 style={{ fontSize:16, marginBottom:16 }}>Match timeline</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {m.events.map((e,i)=>(
              <div key={i} className={'row'+(e.team==='a'?' away':'')} style={{ gap:12, padding:'10px 0', borderBottom:i<m.events.length-1?'1px solid var(--line)':'none', flexDirection: e.team==='a'?'row-reverse':'row', textAlign: e.team==='a'?'right':'left' }}>
                <span className="num" style={{ fontWeight:800, width:34, color:'var(--ink-3)' }}>{e.min}'</span>
                <div style={{ width:30, height:30, flex:'none', borderRadius:8, background:'color-mix(in srgb,'+evColor[e.type]+' 14%,transparent)', color:evColor[e.type], display:'grid', placeItems:'center' }}><Icon name={evIcon[e.type]} size={15} /></div>
                <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{e.who}</div>{e.note && <div style={{ fontSize:12, color:'var(--ink-3)' }}>{e.note}</div>}</div>
              </div>
            ))}
          </div>
        </div>

        {/* stats */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
          <div className="card card-pad">
            <h3 style={{ fontSize:16, marginBottom:16 }}>Match stats</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
              {m.stats.map(([k,h,a,u])=>{
                const tot=h+a; const hp=tot?h/tot*100:50;
                return (
                  <div key={k}>
                    <div className="row" style={{ justifyContent:'space-between', fontSize:13, marginBottom:5 }}><b className="num">{h}{u||''}</b><span style={{ color:'var(--ink-3)', fontSize:12, whiteSpace:'nowrap' }}>{k}</span><b className="num">{a}{u||''}</b></div>
                    <div style={{ display:'flex', height:7, borderRadius:99, overflow:'hidden', background:'var(--surface-3)' }}>
                      <span style={{ width:hp+'%', background:'var(--primary)' }}></span>
                      <span style={{ width:(100-hp)+'%', background:'var(--bff-red)', opacity:.55 }}></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card card-pad">
            <div className="row" style={{ justifyContent:'space-between', marginBottom:12 }}><h3 style={{ fontSize:16 }}>Top ratings</h3><Badge kind="info">Opta-style</Badge></div>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {m.ratings.map((p,i)=>(
                <div key={p.name} className="row" style={{ gap:11 }}>
                  <span className="num" style={{ width:16, color:'var(--ink-faint)', fontWeight:800 }}>{i+1}</span>
                  <PosTag pos={p.pos} />
                  <span style={{ flex:1, fontWeight:700, fontSize:13.5 }}>{p.name}</span>
                  <RatingPill r={p.r} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* heat map + highlights */}
      <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', marginTop:'var(--gap)' }}>
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:12 }}><h3 style={{ fontSize:16 }}>Heat map — Ritu Porna</h3><Badge kind="neutral">GPS</Badge></div>
          <Heatmap seed={42} />
        </div>
        <div className="card card-pad" style={{ display:'flex', flexDirection:'column' }}>
          <div className="row" style={{ justifyContent:'space-between', marginBottom:12 }}><h3 style={{ fontSize:16 }}>Highlights</h3><Badge kind="info">Auto-generated</Badge></div>
          <div style={{ flex:1, borderRadius:12, background:'linear-gradient(135deg,#0c1f17,#06120d)', position:'relative', display:'grid', placeItems:'center', minHeight:200, overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(115deg,#ffffff08 0 2px,transparent 2px 22px)' }}></div>
            <button className="icon-btn" style={{ width:56, height:56, borderRadius:'50%', background:'var(--bff-red)', borderColor:'transparent', color:'#fff', zIndex:1 }} onClick={()=>toast('Highlight reel — coming soon')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <div style={{ position:'absolute', bottom:12, left:14, color:'#fff', zIndex:1 }}><div style={{ fontWeight:700, fontSize:14 }}>FT Highlights · 3–0</div><div style={{ fontSize:12, opacity:.7 }}>4 min · auto-cut from match feed</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Heatmap({ seed = 1 }) {
  let h = seed * 2654435761 % 2147483647;
  const rng = () => { h = (h * 48271) % 2147483647; return h / 2147483647; };
  const cols = 12, rows = 8;
  // bias toward attacking third (right)
  const cells = [];
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
    const bias = (c/cols) * 0.7 + (1-Math.abs(r-rows/2)/(rows/2))*0.4;
    cells.push(Math.min(1, Math.max(0, bias*rng()*1.8)));
  }
  const heat = (v) => v<0.15?'transparent':`rgba(${238-Math.round(v*60)},${Math.round(180-v*150)},${Math.round(60-v*40)},${0.25+v*0.6})`;
  return (
    <div style={{ background:'linear-gradient(90deg,#2c5f92,#34719f)', borderRadius:10, padding:8, position:'relative', aspectRatio:'3/2', backgroundImage:'repeating-linear-gradient(90deg,#2c5f92 0 calc(100%/6),#34719f calc(100%/6) calc(100%/3))' }}>
      <div style={{ position:'absolute', inset:8, border:'2px solid #ffffff44', borderRadius:6 }}></div>
      <div style={{ position:'absolute', left:'50%', top:8, bottom:8, width:2, background:'#ffffff33' }}></div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gridTemplateRows:`repeat(${rows},1fr)`, height:'100%', position:'relative' }}>
        {cells.map((v,i)=><div key={i} style={{ background:heat(v), borderRadius:'50%' }}></div>)}
      </div>
    </div>
  );
}
window.MatchCenter = MatchCenter;


/* ===== screen-roadmap.jsx ===== */
/* Digital Strategy — 5-month roadmap, KPIs, app ecosystem (guideline §7,§15,§16) */
function Roadmap({ go }) {
  const D = window.DATA2;
  const LINKS = {
    'Player registration system':'management', 'Digital player ID rollout':'management',
    'Competition management':'competitions', 'VAR & goal-line tech':'competitions',
    'E-ticketing':'ticketing', 'Blockchain ticketing & transfers':'ticketing',
    'Analytics department':'analytics',
    'Video analysis pipeline':'sportsci', 'AI scouting & talent ID':'sportsci', 'GPS / load monitoring':'sportsci',
    'Referee digitalization':'referees',
    'Smart stadiums':'infrastructure', 'Integrated ecosystem':'infrastructure', 'National football data center':'infrastructure',
    'Cloud infrastructure setup':'infrastructure', 'International integration (FIFA/AFC)':'infrastructure',
    'Exportable football tech services':'infrastructure', 'Fully data-driven federation':'infrastructure',
  };
  const stateMeta = {
    done:   { label:'Complete', color:'var(--pos)', dot:'var(--pos)' },
    active: { label:'In progress', color:'var(--primary)', dot:'var(--primary)' },
    next:   { label:'Next up', color:'var(--warn)', dot:'var(--warn)' },
    planned:{ label:'Planned', color:'var(--ink-faint)', dot:'var(--line-strong)' },
  };
  const itemMeta = {
    done:   { icon:'check',  color:'var(--pos)' },
    active: { icon:'clock',  color:'var(--primary)' },
    planned:{ icon:'arrowr', color:'var(--ink-faint)' },
  };

  const allItems = D.roadmap.flatMap(y => y.items);
  const delivered = allItems.filter(i => i.s === 'done').length;
  const overall = Math.round(D.roadmap.reduce((s, y) => s + y.progress, 0) / D.roadmap.length);
  const phasesDone = D.roadmap.filter(y => y.state === 'done').length;
  const current = D.roadmap.find(y => y.state === 'active') || D.roadmap.find(y => y.state === 'next');

  return (
    <div className="content-inner fade-in">
      <PageHead title="Digital Strategy & Roadmap" desc="The federation as a technology-driven football ecosystem">
        <button className="btn ghost sm" onClick={()=>toast('Strategy brief (PDF) downloaded')}><Icon name="dl" size={15} />Strategy brief</button>
      </PageHead>

      {/* ── Programme summary ── */}
      <div className="card" style={{ overflow:'hidden', marginBottom:'var(--gap)' }}>
        <div style={{ background:'linear-gradient(120deg, var(--primary-deep), var(--primary))', color:'#fff', padding:'22px var(--pad)', display:'flex', gap:26, alignItems:'center', flexWrap:'wrap' }}>
          <Ring pct={overall} size={104} stroke={10} color="#fff" sub="overall" />
          <div style={{ flex:1, minWidth:220 }}>
            <div className="eyebrow" style={{ color:'#ffffffaa' }}>Digital Transformation Programme</div>
            <h2 style={{ fontSize:26, color:'#fff', marginTop:4 }}>Apr – Aug 2026</h2>
            <div style={{ fontSize:13.5, opacity:.9, marginTop:6 }}>Currently in <b>{current.y} · {current.theme}</b> — {current.milestone}.</div>
          </div>
          <div className="row" style={{ gap:28 }}>
            {[['Phases done',`${phasesDone}/5`],['Initiatives',`${delivered}/${allItems.length}`],['Target','Aug ’26']].map(([k,v])=>(
              <div key={k} style={{ textAlign:'center' }}><div className="num" style={{ fontSize:30, fontWeight:800 }}>{v}</div><div style={{ fontSize:11, opacity:.8, textTransform:'uppercase', letterSpacing:'.06em' }}>{k}</div></div>
            ))}
          </div>
        </div>
        {/* phase tracker */}
        <div style={{ padding:'20px var(--pad) 8px', position:'relative' }}>
          <div style={{ position:'absolute', top:30, left:'10%', right:'10%', height:3, background:'var(--line)', borderRadius:2 }}></div>
          <div style={{ position:'absolute', top:30, left:'10%', width:`${(overall/100)*80}%`, height:3, background:'var(--primary)', borderRadius:2 }}></div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)' }}>
            {D.roadmap.map((y,i)=>{
              const sm = stateMeta[y.state];
              return (
                <div key={i} style={{ textAlign:'center', position:'relative' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background: y.progress>0?sm.dot:'var(--surface)', margin:'0 auto', border:'3px solid var(--surface)', boxShadow:'0 0 0 2px '+sm.dot, position:'relative', zIndex:1 }}></div>
                  <div className="num" style={{ fontWeight:800, fontSize:13.5, marginTop:10 }}>{y.y}</div>
                  <div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{y.cy} · {y.theme}</div>
                  <div className="num" style={{ fontSize:11, fontWeight:700, color:sm.color, marginTop:3 }}>{y.progress}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Detailed phase breakdown ── */}
      <h3 style={{ fontSize:17, marginBottom:14 }}>Programme phases</h3>
      <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', marginBottom:'var(--gap)' }}>
        {D.roadmap.map((y,i)=>{
          const sm = stateMeta[y.state];
          return (
            <div key={i} className="card card-pad" style={{ borderTop:`3px solid ${sm.dot}` }}>
              <div className="row" style={{ justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div className="row" style={{ gap:9 }}>
                    <span className="num" style={{ fontWeight:800, fontSize:17 }}>{y.y}</span>
                    <span className="num badge neutral">{y.cy}</span>
                  </div>
                  <div style={{ fontWeight:800, fontSize:15, marginTop:5 }}>{y.theme}</div>
                </div>
                <span className="badge" style={{ background:'color-mix(in srgb,'+sm.color+' 14%,transparent)', color:sm.color }}>{sm.label}</span>
              </div>

              <div className="row" style={{ gap:10, margin:'14px 0 4px' }}>
                <div style={{ flex:1 }}><Bar v={y.progress} color={sm.color} /></div>
                <span className="num" style={{ fontWeight:800, fontSize:13, color:sm.color, width:38, textAlign:'right' }}>{y.progress}%</span>
              </div>
              <div className="row" style={{ gap:7, fontSize:12, color:'var(--ink-3)', marginBottom:14, whiteSpace:'nowrap' }}>
                <Icon name="user" size={13} /> Owner: <b style={{ color:'var(--ink-2)' }}>{y.owner}</b>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                {y.items.map((it,j)=>{
                  const im = itemMeta[it.s];
                  const link = LINKS[it.t];
                  return (
                    <div key={j} className="row" onClick={link?()=>go(link):undefined} style={{ gap:10, padding:'9px 11px', background:'var(--surface-2)', borderRadius:9, cursor: link?'pointer':'default' }} title={link?'Open module':undefined}>
                      <div style={{ width:22, height:22, flex:'none', borderRadius:6, background:'color-mix(in srgb,'+im.color+' 15%,transparent)', color:im.color, display:'grid', placeItems:'center' }}><Icon name={im.icon} size={13} /></div>
                      <span style={{ flex:1, fontSize:13, fontWeight: it.s==='done'?500:600, color: it.s==='done'?'var(--ink-2)':'var(--ink)' }}>{it.t}</span>
                      {link && <Icon name="arrowr" size={13} color="var(--ink-faint)" />}
                      <span className="num chip" style={{ height:22, fontSize:11 }}>{it.q}</span>
                    </div>
                  );
                })}
              </div>

              <div className="row" style={{ gap:9, marginTop:14, padding:'10px 12px', border:'1px dashed var(--line-strong)', borderRadius:9, fontSize:12.5 }}>
                <Icon name="trophy" size={15} color="var(--bff-gold)" style={{ flex:'none' }} />
                <span><b>Milestone:</b> {y.milestone}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KPIs */}
      <div className="card card-pad" style={{ marginBottom:'var(--gap)' }}>
        <div className="row" style={{ justifyContent:'space-between', marginBottom:18 }}><h3 style={{ fontSize:17 }}>Digitalization KPIs</h3><Badge kind="pos" dot>On track</Badge></div>
        <div className="grid" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
          {D.kpis.map(k=>(
            <div key={k.k} className="row" style={{ gap:14, padding:'12px 14px', background:'var(--surface-2)', borderRadius:12 }}>
              <Ring pct={k.pct} size={64} color={k.pct>=70?'var(--pos)':k.pct>=50?'var(--primary)':'var(--warn)'} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5, color:'var(--ink-3)', fontWeight:600 }}>{k.k}</div>
                <div className="num" style={{ fontWeight:800, fontSize:20, lineHeight:1.1 }}>{k.val}</div>
                <div className="row" style={{ gap:6, marginTop:3 }}><span className="badge pos">{k.delta}</span><span className="num" style={{ fontSize:11, color:'var(--ink-faint)' }}>target {k.target}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* app ecosystem */}
      <h3 style={{ fontSize:17, marginBottom:14 }}>Mobile app ecosystem</h3>
      <div className="grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))' }}>
        {D.apps.map(a=>(
          <div key={a.name} className="card card-pad">
            <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ width:46, height:46, borderRadius:12, background:'color-mix(in srgb,'+a.color+' 15%,transparent)', color:a.color, display:'grid', placeItems:'center' }}><Icon name={a.icon} size={22} /></div>
              <Badge kind={a.status==='Live'?'pos':a.status==='Beta'?'info':'warn'} dot>{a.status}</Badge>
            </div>
            <div style={{ fontWeight:800, fontSize:15 }}>{a.name}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:12 }}>
              {a.feats.map(f=><div key={f} className="row" style={{ gap:8, fontSize:12.5, color:'var(--ink-2)' }}><Icon name="check" size={13} color={a.color} />{f}</div>)}
            </div>
          </div>
        ))}
      </div>

      {/* governance footer */}
      <div className="card card-pad" style={{ marginTop:'var(--gap)', background:'var(--surface-2)' }}>
        <div className="row" style={{ gap:16, flexWrap:'wrap', justifyContent:'space-between' }}>
          <div className="row" style={{ gap:12 }}><div style={{ width:42, height:42, borderRadius:11, background:'var(--primary)', color:'#fff', display:'grid', placeItems:'center' }}><Icon name="shield" size={20} /></div><div><div style={{ fontWeight:800, fontSize:15 }}>Cybersecurity & governance</div><div style={{ fontSize:12.5, color:'var(--ink-3)' }}>Role-based access · MFA · encrypted backups · annual audit</div></div></div>
          <div className="row" style={{ gap:8 }}>{['Data protection','MFA','RBAC','Cloud backup'].map(t=><span key={t} className="chip">{t}</span>)}</div>
        </div>
      </div>
    </div>
  );
}
window.Roadmap = Roadmap;


