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

/* ===== screens-hunt.jsx ===== */
/* ====================================================================
   Player Hunt — open-trial talent registration + scouting pipeline
   ==================================================================== */

/* shared store so registrations + stage changes persist across the session */
const HuntStore = (() => {
  const subs = new Set();
  let extra = [];
  let overrides = {}; // id -> {stage, rating, skills, scout, note}
  return {
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    bump() { subs.forEach(fn => fn()); },
    all() { return [...extra, ...window.DATA5.applicants].map(a => Object.assign({}, a, overrides[a.id] || {})); },
    add(rec) {
      const pa = (s) => s.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
      const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
      const id = 'apx' + Date.now().toString().slice(-6);
      const r = Object.assign({ id, initials: pa(rec.name || 'NA'), hue: hue(rec.name || id), stage: 'New', applied: new Date().toISOString().slice(0, 10), skills: null, rating: null, scout: null, note: '', video: true, length: rec.length || '2:00' }, rec);
      extra.unshift(r);
      this.bump();
      return r;
    },
    setStage(id, stage) { overrides[id] = Object.assign({}, overrides[id], { stage }); this.bump(); },
    review(id, patch) { overrides[id] = Object.assign({}, overrides[id], patch); this.bump(); },
  };
})();
function useHunt() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => HuntStore.subscribe(force), []);
  return HuntStore;
}
window.HuntStore = HuntStore;
window.useHunt = useHunt;

const STAGE_META = {
  New:       { color:'var(--info)',  kind:'info'    },
  Reviewing: { color:'var(--warn)',  kind:'warn'    },
  Trial:     { color:'#8a5cf6',      kind:'neutral' },
  Selected:  { color:'var(--pos)',   kind:'pos'     },
  Rejected:  { color:'var(--neg)',   kind:'neg'     },
};

function HuntAvatar({ a, size = 40 }) {
  const bg = `linear-gradient(150deg, hsl(${a.hue} 55% 45%), hsl(${(a.hue + 40) % 360} 58% 32%))`;
  return <div className="pavatar" style={{ width: size, height: size, fontSize: size * 0.36, background: bg }}>{a.initials}</div>;
}

/* ---------------- Season declaration + event timeline ---------------- */
function SeasonDeclaration({ onRegister, canRegister = true, hunt, onReview }) {
  const [open, setOpen] = React.useState(null);
  const countAt = (stage) => hunt ? hunt.all().filter(a => a.stage === stage).length : null;
  const phases = [
    { t:'Registration Open', d:'1 Jun – 31 Jul 2026', icon:'edit', state:'active', maps:'New',
      desc:'Players — or their guardians — submit an online registration with a 2–3 minute skill video. Open to every boy & girl U-13 to U-23 across all 64 districts.',
      acts:['Online form + skill-video upload','Age & eligibility verification','Applicant ID issued automatically'] },
    { t:'Regional Trials', d:'Aug 2026', icon:'whistle', state:'upcoming', maps:'Reviewing',
      desc:'BFF scouts review every submission and rate it. Shortlisted players are invited to one of 8 regional trial centres for live assessment.',
      acts:['Skill-video review & scoring','Regional trial invitations','Live 1v1 & small-sided games'] },
    { t:'Age-Group Camps', d:'Sep 2026', icon:'flow', state:'upcoming', maps:'Trial',
      desc:'Top performers attend residential age-group camps (U-13 … U-23) at the BFF Technical Centre, BKSP and regional venues.',
      acts:['Residential camp by age group','Position-specific coaching','GPS load & fitness testing'] },
    { t:'National Camp', d:'Oct 2026', icon:'shield', state:'upcoming', maps:'Trial',
      desc:'The strongest camp graduates join a national training camp and play selection trial matches in front of the technical panel.',
      acts:['National training camp','Selection trial matches','Technical-panel evaluation'] },
    { t:'Final Selection', d:'15 Nov 2026', icon:'star', state:'upcoming', maps:'Selected',
      desc:'The technical committee announces the final age-group squads. Selected players are inducted into the national player pathway.',
      acts:['Final squad announcement','Induction to the national pathway','Player contracts & digital IDs issued'] },
  ];
  const selected = hunt ? hunt.all().filter(a => a.stage === 'Selected') : [];
  return (
    <div className="card" style={{ overflow:'hidden', marginBottom:'var(--gap)' }}>
      <div style={{ background:'linear-gradient(120deg,var(--primary-deep),var(--primary))', color:'#fff', padding:'22px var(--pad)' }}>
        <div className="row" style={{ justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <div style={{ minWidth:0 }}>
            <div className="eyebrow" style={{ color:'#ffffffcc' }}>Season Declaration</div>
            <div style={{ fontWeight:800, fontSize:22, marginTop:4 }}>National Player Hunt 2026/27</div>
            <div style={{ fontSize:13, opacity:.9, marginTop:4 }}>Open trials for boys &amp; girls · U-13 to U-23 · all 64 districts</div>
          </div>
          <div className="row" style={{ gap:14, flex:'none' }}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, opacity:.85, textTransform:'uppercase', letterSpacing:'.08em' }}>Registration closes</div>
              <div className="num" style={{ fontWeight:800, fontSize:18, marginTop:2 }}>31 Jul 2026</div>
            </div>
            {canRegister && <button className="btn sm" style={{ background:'#fff', color:'var(--primary-deep)' }} onClick={onRegister}><Icon name="plus" size={15} />Register now</button>}
          </div>
        </div>
      </div>
      <div className="card-pad">
        <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}>
          <div className="eyebrow">Event timeline · registration → final selection</div>
          <span style={{ fontSize:11.5, color:'var(--ink-faint)' }}>Tap a step to see how it works</span>
        </div>
        <div className="row" style={{ gap:0, alignItems:'flex-start', overflowX:'auto' }}>
          {phases.map((p,i)=>(
            <button key={p.t} onClick={()=>setOpen(p)} style={{ flex:1, minWidth:124, position:'relative', textAlign:'center', padding:'4px 6px 6px', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', borderRadius:10 }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'} onMouseLeave={e=>e.currentTarget.style.background='none'}>
              {i<phases.length-1 && <div style={{ position:'absolute', top:23, left:'50%', right:'-50%', height:3, background: (p.state==='done'||p.state==='active')?'var(--primary)':'var(--line)', zIndex:0 }}></div>}
              <div style={{ position:'relative', zIndex:1, width:40, height:40, borderRadius:'50%', margin:'0 auto 10px', display:'grid', placeItems:'center', background: p.state==='active'?'var(--primary)':p.state==='done'?'color-mix(in srgb,var(--primary) 18%,transparent)':'var(--surface-3)', color: p.state==='active'?'#fff':p.state==='done'?'var(--primary)':'var(--ink-3)', boxShadow: p.state==='active'?'0 0 0 4px color-mix(in srgb,var(--primary) 22%,transparent)':'none' }}>
                <Icon name={p.icon} size={18} />
              </div>
              <div style={{ fontWeight:700, fontSize:12.5, lineHeight:1.2 }}>{p.t}</div>
              <div className="num" style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:3 }}>{p.d}</div>
              {p.state==='active' ? <span className="badge pos" style={{ marginTop:6 }}>Now open</span>
                : (countAt(p.maps)!=null && <span className="badge neutral" style={{ marginTop:6 }}>{countAt(p.maps)} {p.t==='Final Selection'?'selected':'players'}</span>)}
            </button>
          ))}
        </div>
      </div>

      {open && (
        <Modal title={open.t} subtitle={`Player Hunt 2026/27 · ${open.d}`} width={520} onClose={()=>setOpen(null)}
          footer={<button className="btn sm" onClick={()=>setOpen(null)}><Icon name="check" size={15} />Close</button>}>
          <div className="row" style={{ gap:13, alignItems:'flex-start', marginBottom:16 }}>
            <div style={{ width:46, height:46, borderRadius:12, background:'var(--surface-3)', color:'var(--primary)', display:'grid', placeItems:'center', flex:'none' }}><Icon name={open.icon} size={22} /></div>
            <p style={{ fontSize:13.5, lineHeight:1.55, color:'var(--ink-2)', margin:0 }}>{open.desc}</p>
          </div>
          <div className="eyebrow" style={{ marginBottom:8 }}>What happens</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom: open.t==='Final Selection' ? 18 : 0 }}>
            {open.acts.map((a,i)=>(
              <div key={i} className="row" style={{ gap:10 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:'color-mix(in srgb,var(--primary) 14%,transparent)', color:'var(--primary)', display:'grid', placeItems:'center', flex:'none', fontWeight:800, fontSize:11 }}>{i+1}</div>
                <span style={{ fontSize:13.5 }}>{a}</span>
              </div>
            ))}
          </div>
          {open.t==='Final Selection' && (
            <div>
              <div className="row" style={{ justifyContent:'space-between', marginBottom:8 }}>
                <div className="eyebrow">Selected players</div>
                <span className="num" style={{ fontSize:12, color:'var(--ink-3)' }}>{selected.length} inducted</span>
              </div>
              {selected.length === 0 ? (
                <div style={{ fontSize:13, color:'var(--ink-faint)', padding:'10px 0' }}>Final squads will be published here on 15 Nov 2026.</div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {selected.map(a=>(
                    <div key={a.id} className="row" style={{ gap:11, padding:'9px 11px', border:'1px solid var(--line)', borderRadius:10 }}>
                      <HuntAvatar a={a} size={36} />
                      <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{a.name}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{a.group} · {a.pos} · {a.district}</div></div>
                      <span className="badge pos" dot>Selected</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
window.SeasonDeclaration = SeasonDeclaration;

/* ---------------- Admin: Player Hunt board ---------------- */
function PlayerHunt({ go }) {
  const hunt = useHunt();
  const D = window.DATA5;
  const [group, setGroup] = React.useState('All');
  const [gender, setGender] = React.useState('All');
  const [stage, setStage] = React.useState('All');
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(null); // applicant being reviewed
  const [register, setRegister] = React.useState(false);
  const isStaff = AuthStore.canEdit();

  let list = hunt.all().filter(a => {
    if (group !== 'All' && a.group !== group) return false;
    if (gender !== 'All' && a.gender !== gender) return false;
    if (stage !== 'All' && a.stage !== stage) return false;
    if (q && !(a.name.toLowerCase().includes(q.toLowerCase()) || a.district.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const counts = D.stages.reduce((m, s) => (m[s] = hunt.all().filter(a => a.stage === s).length, m), {});

  return (
    <div className="content-inner fade-in">
      <PageHead title="Player Hunt" desc="Open-trial registrations · review skill videos · build age-group squads">
        {isStaff && <button className="btn ghost sm" onClick={()=>toast('Trial-camp schedule exported')}><Icon name="cal" size={15} />Trial camps</button>}
        <button className="btn sm" onClick={()=>setRegister(true)}><Icon name="plus" size={15} />{isStaff ? 'New registration' : 'Register now'}</button>
      </PageHead>

      <SeasonDeclaration onRegister={()=>setRegister(true)} hunt={hunt} />

      {!isStaff && (
        <div className="card card-pad" style={{ marginBottom:'var(--gap)' }}>
          <h3 style={{ fontSize:16, marginBottom:4 }}>Trial camp schedule</h3>
          <div style={{ fontSize:12.5, color:'var(--ink-3)', marginBottom:14 }}>Age-group selection camps · bring boots, photo ID &amp; guardian consent</div>
          <div className="grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))' }}>
            {D.camps.map((c,i)=>(
              <div key={i} className="row" style={{ gap:12, padding:'12px 14px', border:'1px solid var(--line)', borderRadius:10 }}>
                <div style={{ width:42, height:42, borderRadius:10, background:'var(--surface-3)', color:'var(--primary)', display:'grid', placeItems:'center', flex:'none', fontWeight:800, fontSize:13 }}>{c.group}</div>
                <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{c.date}</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>{c.venue}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isStaff && (<>
      {/* pipeline summary */}
      <div className="grid" style={{ gridTemplateColumns:'repeat(5,1fr)', marginBottom:'var(--gap)' }}>
        {D.stages.map(s=>(
          <div key={s} className={'card stat stat-link'} onClick={()=>setStage(stage===s?'All':s)} style={ stage===s?{ borderColor:STAGE_META[s].color, boxShadow:'var(--shadow-md)' }:{}}>
            <div className="k"><span style={{ width:8, height:8, borderRadius:2, background:STAGE_META[s].color }}></span>{s}</div>
            <div className="v num">{counts[s]}</div>
            <div className="d" style={{ color:'var(--ink-3)' }}>applicants</div>
          </div>
        ))}
      </div>

      {/* funnel bar */}
      <div className="card card-pad" style={{ marginBottom:'var(--gap)' }}>
        <div className="row" style={{ justifyContent:'space-between', marginBottom:12 }}>
          <h3 style={{ fontSize:15, whiteSpace:'nowrap' }}>Talent funnel</h3>
          <span className="num" style={{ fontSize:12.5, color:'var(--ink-3)', whiteSpace:'nowrap' }}>{hunt.all().length} total registrations</span>
        </div>
        <div style={{ display:'flex', height:30, borderRadius:8, overflow:'hidden' }}>
          {D.stages.map(s=>{
            const pct = counts[s] / hunt.all().length * 100;
            return pct>0 ? <div key={s} title={`${s}: ${counts[s]}`} style={{ width:pct+'%', background:STAGE_META[s].color, display:'grid', placeItems:'center', color:'#fff', fontSize:11, fontWeight:700, minWidth:28 }}>{counts[s]}</div> : null;
          })}
        </div>
      </div>

      {/* filters */}
      <div className="card card-pad" style={{ marginBottom:'var(--gap)', display:'flex', gap:16, flexWrap:'wrap', alignItems:'center' }}>
        <div className="search-global" style={{ maxWidth:280 }}>
          <Icon name="search" size={16} />
          <input placeholder="Search name or district…" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        <div className="row" style={{ gap:6 }}>
          <span className="eyebrow" style={{ marginRight:2 }}>Age</span>
          <button className={'chip tab'+(group==='All'?' on':'')} onClick={()=>setGroup('All')}>All</button>
          {D.ageGroups.map(g=><button key={g} className={'chip tab'+(group===g?' on':'')} onClick={()=>setGroup(g)}>{g}</button>)}
        </div>
        <div className="row" style={{ gap:6 }}>
          <span className="eyebrow" style={{ marginRight:2 }}>Gender</span>
          {['All','boy','girl'].map(g=><button key={g} className={'chip tab'+(gender===g?' on':'')} onClick={()=>setGender(g)}>{g==='boy'?'Boys':g==='girl'?'Girls':'All'}</button>)}
        </div>
        <div style={{ flex:1 }}></div>
        <span className="num" style={{ fontSize:13, color:'var(--ink-3)' }}>{list.length} shown</span>
      </div>

      {/* applicant grid */}
      {list.length===0 ? (
        <div className="card card-pad" style={{ textAlign:'center', color:'var(--ink-3)', padding:'44px' }}>
          <Icon name="search" size={28} color="var(--ink-faint)" />
          <div style={{ marginTop:10, fontWeight:700, color:'var(--ink)' }}>No applicants match these filters</div>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))' }}>
          {list.map(a=><ApplicantCard key={a.id} a={a} onOpen={()=>setActive(a)} hunt={hunt} />)}
        </div>
      )}
      </>)}

      {active && <ApplicantModal a={active} hunt={hunt} onClose={()=>setActive(null)} />}
      {register && <RegistrationModal hunt={hunt} onClose={()=>setRegister(false)} />}
    </div>
  );
}

function ApplicantCard({ a, onOpen, hunt }) {
  const sm = STAGE_META[a.stage];
  return (
    <div className="card" style={{ overflow:'hidden', cursor:'pointer', transition:'transform .12s, box-shadow .12s' }}
      onClick={onOpen}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-md)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
      {/* video thumb */}
      <div style={{ height:128, background:`linear-gradient(135deg, hsl(${a.hue} 40% 26%), hsl(${(a.hue+40)%360} 45% 16%))`, position:'relative', display:'grid', placeItems:'center' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(115deg,#ffffff0a 0 2px,transparent 2px 20px)' }}></div>
        <div style={{ width:46, height:46, borderRadius:'50%', background:'#ffffff26', backdropFilter:'blur(2px)', display:'grid', placeItems:'center', border:'2px solid #ffffff55' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <span className="badge" style={{ position:'absolute', left:10, top:10, background:'#00000055', color:'#fff' }}><Icon name="ball" size={11} /> Skill video</span>
        <span className="num" style={{ position:'absolute', right:10, bottom:10, background:'#00000066', color:'#fff', fontSize:11, padding:'2px 7px', borderRadius:5, fontWeight:700 }}>{a.length}</span>
        <span className="badge" style={{ position:'absolute', right:10, top:10, background:sm.color, color:'#fff' }}>{a.stage}</span>
      </div>
      <div className="card-pad" style={{ paddingTop:14 }}>
        <div className="row" style={{ gap:11 }}>
          <HuntAvatar a={a} size={40} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:14.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.name}</div>
            <div style={{ fontSize:12, color:'var(--ink-3)' }}>{a.age}y · {a.district}</div>
          </div>
          {a.rating!=null && <RatingPill r={a.rating} />}
        </div>
        <div className="row" style={{ gap:6, marginTop:12 }}>
          <span className="chip" style={{ height:24, fontSize:11 }}>{a.group}</span>
          <PosTag pos={a.pos} />
          <span className="chip" style={{ height:24, fontSize:11 }}>{a.gender==='girl'?'Girls':'Boys'}</span>
        </div>
      </div>
    </div>
  );
}

window.PlayerHunt = PlayerHunt;

/* ---------------- Applicant review modal ---------------- */
const SKILL_VIDEOS = ['assets/skill-1.mp4','assets/skill-2.mp4','assets/skill-3.mp4'];
const skillVideoFor = (a) => SKILL_VIDEOS[(a.hue || a.name.length) % SKILL_VIDEOS.length];
function ApplicantModal({ a, hunt, onClose }) {
  const sm = STAGE_META[a.stage];
  const [playing, setPlaying] = React.useState(false);
  const videoRef = React.useRef(null);
  const reviewed = a.skills != null;
  const [skills, setSkills] = React.useState(a.skills || { technique:70, pace:70, physical:70, gameIntel:70 });
  const [note, setNote] = React.useState(a.note || '');
  const avg = Math.round((skills.technique + skills.pace + skills.physical + skills.gameIntel) / 4);
  const computedRating = +(avg / 10).toFixed(1);

  const saveReview = async () => {
    const ok = await confirmAction({ title:'Save assessment?', message:<>Save skill assessment for <b>{a.name}</b>? Overall rating {computedRating.toFixed(1)}.</>, confirmLabel:'Save assessment', icon:'check' });
    if (!ok) return;
    hunt.review(a.id, { skills, note, rating: computedRating, scout:'A. Karim', stage: a.stage==='New'?'Reviewing':a.stage });
    toast(`Assessment saved for <b>${a.name}</b>`);
  };
  const moveStage = async (next) => {
    const labels = { Trial:'invite to trial', Selected:'select for squad', Rejected:'reject', Reviewing:'mark as reviewing' };
    const ok = await confirmAction({ title:`Confirm: ${labels[next]||next}?`, message:<>Move <b>{a.name}</b> to <b>{next}</b>?</>, confirmLabel:next, tone: next==='Rejected'?'danger':undefined, icon: next==='Selected'?'check':next==='Trial'?'flow':'arrowr' });
    if (!ok) return;
    hunt.setStage(a.id, next);
    toast(next==='Selected'?`<b>${a.name}</b> selected for the squad! 🎉`:`<b>${a.name}</b> moved to ${next}`, next==='Rejected'?'muted':'ok');
    if (next==='Selected'||next==='Rejected') onClose();
  };

  const SKILLS = [['technique','Technique'],['pace','Pace & agility'],['physical','Physicality'],['gameIntel','Game intelligence']];

  return (
    <Modal title={a.name} subtitle={`${a.group} · ${a.gender==='girl'?'Girls':'Boys'} · ${a.pos} · ${a.district}`} width={860} onClose={onClose}
      footer={<>
        <div className="row" style={{ gap:8, flex:1 }}>
          {a.stage!=='Rejected' && <button className="btn ghost sm" style={{ color:'var(--neg)', borderColor:'color-mix(in srgb,var(--neg) 40%,transparent)' }} onClick={()=>moveStage('Rejected')}>Reject</button>}
        </div>
        {a.stage!=='Trial' && a.stage!=='Selected' && <button className="btn ghost sm" onClick={()=>moveStage('Trial')}><Icon name="flow" size={14} />Invite to trial</button>}
        {a.stage!=='Selected' && <button className="btn sm" onClick={()=>moveStage('Selected')}><Icon name="check" size={14} />Select for squad</button>}
      </>}>
      <div className="grid" style={{ gridTemplateColumns:'1.1fr 1fr', gap:20 }}>
        {/* video */}
        <div>
          <div style={{ aspectRatio:'16/10', borderRadius:12, background:`linear-gradient(135deg, hsl(${a.hue} 40% 24%), hsl(${(a.hue+40)%360} 45% 14%))`, position:'relative', display:'grid', placeItems:'center', overflow:'hidden' }}>
            {playing ? (
              <video ref={videoRef} src={skillVideoFor(a)} controls autoPlay playsInline
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', background:'#000', zIndex:2 }}
                onEnded={()=>setPlaying(false)} />
            ) : (<>
              <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(115deg,#ffffff0a 0 2px,transparent 2px 22px)' }}></div>
              <button className="icon-btn" style={{ width:60, height:60, borderRadius:'50%', background:'var(--bff-red)', borderColor:'transparent', color:'#fff', zIndex:1 }} onClick={()=>setPlaying(true)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <div style={{ position:'absolute', left:12, bottom:12, color:'#fff', zIndex:1 }}><div style={{ fontWeight:700, fontSize:13 }}>Skill showcase</div><div style={{ fontSize:11.5, opacity:.75 }}>Uploaded {a.applied} · {a.length}</div></div>
              <span className="badge" style={{ position:'absolute', right:12, top:12, background:sm.color, color:'#fff' }}>{a.stage}</span>
              <span className="badge" style={{ position:'absolute', left:12, top:12, background:'#00000066', color:'#fff' }}><Icon name="ball" size={11} /> AI skill analysis</span>
            </>)}
          </div>
          {/* bio */}
          <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', gap:10, marginTop:14 }}>
            {[['Age',a.age+' yrs'],['Height',a.height+' cm'],['Foot',a.foot],['Applied',a.applied]].map(([k,v])=>(
              <div key={k} style={{ padding:'9px 12px', background:'var(--surface-2)', borderRadius:9 }}>
                <div style={{ fontSize:11, color:'var(--ink-faint)' }}>{k}</div>
                <div style={{ fontWeight:700, fontSize:13.5 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* assessment */}
        <div>
          <div className="row" style={{ justifyContent:'space-between', marginBottom:12 }}>
            <h3 style={{ fontSize:15 }}>Scout assessment</h3>
            <div className="row" style={{ gap:8 }}><span style={{ fontSize:12, color:'var(--ink-3)' }}>Overall</span><RatingPill r={computedRating} /></div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {SKILLS.map(([k,label])=>(
              <div key={k}>
                <div className="row" style={{ justifyContent:'space-between', marginBottom:5 }}><span style={{ fontSize:12.5, fontWeight:600 }}>{label}</span><span className="num" style={{ fontWeight:800, color: skills[k]>=80?'var(--pos)':skills[k]>=65?'var(--ink)':'var(--warn)' }}>{skills[k]}</span></div>
                <input type="range" min="40" max="99" value={skills[k]} onChange={e=>setSkills({...skills, [k]:+e.target.value})} style={{ width:'100%', accentColor:'var(--primary)' }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop:14 }}>
            <div className="eyebrow" style={{ marginBottom:7 }}>Scout notes</div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Observations, strengths, recommendation…" rows={3}
              style={{ width:'100%', borderRadius:10, border:'1px solid var(--line-strong)', padding:'10px 12px', fontFamily:'inherit', fontSize:13.5, color:'var(--ink)', background:'var(--surface)', resize:'vertical', outline:'none' }} />
          </div>
          <button className="btn sm" style={{ width:'100%', marginTop:12 }} onClick={saveReview}><Icon name="check" size={15} />{reviewed?'Update assessment':'Save assessment'}</button>
          {a.scout && <div style={{ fontSize:11.5, color:'var(--ink-faint)', marginTop:8, textAlign:'center' }}>Last assessed by {a.scout}</div>}
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- Public registration modal (multi-step + video upload) ---------------- */
function RegistrationModal({ hunt, onClose }) {
  const D = window.DATA5;
  const [step, setStep] = React.useState(1);
  const [f, setF] = React.useState({ name:'', gender:'boy', age:'', group:'U-15', pos:'MF', district:D.districts[0], foot:'Right', height:'', guardian:'', phone:'' });
  const [video, setVideo] = React.useState(null); // {name, length}
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const fileRef = React.useRef(null);

  const pickVideo = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setVideo({ name: file.name, size: (file.size/1048576).toFixed(1)+' MB', length: '2:'+String(10+Math.floor(Math.random()*48)).padStart(2,'0') });
    toast('Skill video attached');
  };

  const submit = async () => {
    if (!f.name.trim()) { toast('Player name is required', 'muted'); setStep(1); return; }
    if (!video) { toast('Please upload a skill video', 'muted'); return; }
    const ok = await confirmAction({ title:'Submit registration?', message:<>Register <b>{f.name}</b> for the <b>{f.group}</b> {f.gender==='girl'?'girls':'boys'} talent hunt?</>, detail:`${f.pos} · ${f.district} · skill video: ${video.name}`, confirmLabel:'Submit registration', icon:'plus' });
    if (!ok) return;
    const rec = hunt.add(Object.assign({}, f, { age:+f.age||undefined, height:+f.height||undefined, length: video.length }));
    onClose();
    toast(`<b>${rec.name}</b> registered for ${rec.group} hunt — pending review`);
  };

  const steps = [[1,'Player'],[2,'Details'],[3,'Skill video']];
  const inp = { height:40, borderRadius:9, border:'1px solid var(--line-strong)', padding:'0 12px', fontFamily:'inherit', fontSize:14, color:'var(--ink)', background:'var(--surface)', outline:'none', width:'100%' };

  return (
    <Modal title="Register for Player Hunt" subtitle="Open trials for boys & girls · U-13 to U-23" width={600} onClose={onClose}
      footer={<>
        {step>1 ? <button className="btn ghost sm" onClick={()=>setStep(step-1)}><Icon name="chev" size={14} style={{ transform:'rotate(180deg)' }} />Back</button> : <button className="btn ghost sm" onClick={onClose}>Cancel</button>}
        {step<3 ? <button className="btn sm" onClick={()=>{ if(step===1 && !f.name.trim()){ toast('Enter player name','muted'); return; } setStep(step+1); }}>Next<Icon name="chev" size={14} /></button>
          : <button className="btn sm" onClick={submit}><Icon name="check" size={15} />Submit</button>}
      </>}>
      {/* stepper */}
      <div className="row" style={{ gap:0, marginBottom:20 }}>
        {steps.map(([n,label],i)=>(
          <React.Fragment key={n}>
            <div className="row" style={{ gap:8 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', display:'grid', placeItems:'center', fontWeight:800, fontSize:12, background: step>=n?'var(--primary)':'var(--surface-3)', color: step>=n?'#fff':'var(--ink-3)' }}>{step>n?'✓':n}</div>
              <span style={{ fontSize:13, fontWeight: step===n?700:500, color: step>=n?'var(--ink)':'var(--ink-3)' }}>{label}</span>
            </div>
            {i<steps.length-1 && <div style={{ flex:1, height:2, background: step>n?'var(--primary)':'var(--line)', margin:'0 12px' }}></div>}
          </React.Fragment>
        ))}
      </div>

      {step===1 && (
        <div className="form-grid">
          <Field label="Full name" span><input style={inp} value={f.name} onChange={set('name')} placeholder="Player's full name" autoFocus /></Field>
          <Field label="Gender"><select style={inp} value={f.gender} onChange={set('gender')}><option value="boy">Boy</option><option value="girl">Girl</option></select></Field>
          <Field label="Date of birth (age)"><input style={inp} value={f.age} onChange={set('age')} inputMode="numeric" placeholder="e.g. 14" /></Field>
          <Field label="Age group"><select style={inp} value={f.group} onChange={set('group')}>{D.ageGroups.map(g=><option key={g}>{g}</option>)}</select></Field>
          <Field label="Position"><select style={inp} value={f.pos} onChange={set('pos')}>{['GK','DF','MF','FW'].map(p=><option key={p}>{p}</option>)}</select></Field>
        </div>
      )}
      {step===2 && (
        <div className="form-grid">
          <Field label="District"><select style={inp} value={f.district} onChange={set('district')}>{D.districts.map(d=><option key={d}>{d}</option>)}</select></Field>
          <Field label="Preferred foot"><select style={inp} value={f.foot} onChange={set('foot')}><option>Right</option><option>Left</option><option>Both</option></select></Field>
          <Field label="Height (cm)"><input style={inp} value={f.height} onChange={set('height')} inputMode="numeric" placeholder="e.g. 165" /></Field>
          <Field label="Guardian name"><input style={inp} value={f.guardian} onChange={set('guardian')} placeholder="Parent / guardian" /></Field>
          <Field label="Contact phone" span><input style={inp} value={f.phone} onChange={set('phone')} inputMode="tel" placeholder="+880 1XXX-XXXXXX" /></Field>
        </div>
      )}
      {step===3 && (
        <div>
          <div className="eyebrow" style={{ marginBottom:8 }}>Upload skill video</div>
          <input ref={fileRef} type="file" accept="video/*" style={{ display:'none' }} onChange={pickVideo} />
          {!video ? (
            <button onClick={()=>fileRef.current && fileRef.current.click()} style={{ width:'100%', border:'2px dashed var(--line-strong)', borderRadius:14, background:'var(--surface-2)', padding:'34px 20px', cursor:'pointer', textAlign:'center', color:'var(--ink-2)', fontFamily:'inherit' }}>
              <div style={{ width:54, height:54, borderRadius:'50%', background:'color-mix(in srgb,var(--primary) 14%,transparent)', color:'var(--primary)', display:'grid', placeItems:'center', margin:'0 auto 12px' }}><Icon name="dl" size={24} style={{ transform:'rotate(180deg)' }} /></div>
              <div style={{ fontWeight:700, fontSize:14.5, color:'var(--ink)' }}>Click to upload skill footage</div>
              <div style={{ fontSize:12.5, marginTop:4 }}>MP4 or MOV · up to 100 MB · 1–3 minutes recommended</div>
            </button>
          ) : (
            <div className="card card-pad" style={{ display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ width:64, height:48, borderRadius:9, background:'linear-gradient(135deg,#0c1f17,#06120d)', display:'grid', placeItems:'center', flex:'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:13.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{video.name}</div>
                <div style={{ fontSize:12, color:'var(--ink-3)' }}>{video.size} · {video.length}</div>
              </div>
              <button className="btn ghost sm" onClick={()=>fileRef.current && fileRef.current.click()}>Replace</button>
            </div>
          )}
          <div style={{ marginTop:14, padding:'12px 14px', background:'color-mix(in srgb,var(--primary) 6%,transparent)', borderRadius:10, fontSize:12.5, color:'var(--ink-2)', lineHeight:1.5 }}>
            <b>Tips:</b> film in landscape, show dribbling, passing, shooting and 1v1s. Include your name on a board at the start. Scouts review every submission.
          </div>
        </div>
      )}
    </Modal>
  );
}


