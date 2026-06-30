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

/* ===== screens-coaching.jsx ===== */
/* Coaching Course Management — AFC/BFF licensing pathway, course scheduling,
   enrolment, instructors and the coach licence register. */

const COACH_LEVELS = [
  { code:'GRA', name:'AFC/BFF Grassroots', tone:'neutral', hue:200, prereq:'Open to all — minimum age 16', hours:24, validity:3 },
  { code:'D',   name:'AFC \u201cD\u201d Certificate', tone:'neutral', hue:190, prereq:'Grassroots certificate', hours:60, validity:3 },
  { code:'C',   name:'AFC \u201cC\u201d Certificate', tone:'info', hue:210, prereq:'AFC D licence', hours:90, validity:3 },
  { code:'B',   name:'AFC \u201cB\u201d Certificate', tone:'info', hue:155, prereq:'AFC C licence + 12 months', hours:120, validity:3 },
  { code:'A',   name:'AFC \u201cA\u201d Certificate', tone:'pos', hue:140, prereq:'AFC B licence + 12 months', hours:160, validity:3 },
  { code:'PRO', name:'AFC Pro Diploma', tone:'warn', hue:38, prereq:'AFC A licence + 24 months', hours:240, validity:3 },
  { code:'GK',  name:'Goalkeeping (Level 1\u20133)', tone:'neutral', hue:280, prereq:'Coaching licence (any)', hours:80, validity:3 },
  { code:'FIT', name:'Fitness / S&C', tone:'neutral', hue:330, prereq:'Coaching or sports-science background', hours:60, validity:3 },
];
const LEVEL_BY = Object.fromEntries(COACH_LEVELS.map(l => [l.code, l]));

const _seedCourses = () => ([
  { id:'cc1', title:'AFC \u201cC\u201d Coaching Certificate \u2014 Dhaka', level:'C', start:'2026-07-06', end:'2026-07-18', venue:'BFF Technical & Football HQ, Dhaka', instructor:'Saiful Bari Titu', capacity:24, fee:18000, status:'Open', enrolled:['co3','co5'] },
  { id:'cc2', title:'AFC \u201cB\u201d Coaching Certificate', level:'B', start:'2026-08-03', end:'2026-08-22', venue:'BFF Technical & Football HQ, Dhaka', instructor:'Maruful Haque', capacity:20, fee:32000, status:'Open', enrolled:['co6'] },
  { id:'cc3', title:'AFC Pro Diploma \u2014 Module 1', level:'PRO', start:'2026-09-14', end:'2026-09-28', venue:'AFC Academy / BFF HQ', instructor:'Javier Cabrera', capacity:16, fee:65000, status:'Upcoming', enrolled:[] },
  { id:'cc4', title:'AFC/BFF Grassroots Leaders \u2014 Chattogram', level:'GRA', start:'2026-06-20', end:'2026-06-23', venue:'M. A. Aziz Stadium, Chattogram', instructor:'Golam Zilani', capacity:40, fee:3500, status:'Ongoing', enrolled:['co7'] },
  { id:'cc5', title:'Goalkeeping Coaching \u2014 Level 2', level:'GK', start:'2026-05-04', end:'2026-05-12', venue:'BFF Artificial Turf, Dhaka', instructor:'Mohammad Imtiaz', capacity:18, fee:14000, status:'Completed', enrolled:['co5','co7'] },
  { id:'cc6', title:'AFC \u201cD\u201d Certificate \u2014 Sylhet', level:'D', start:'2026-04-10', end:'2026-04-18', venue:'Sylhet District Stadium', instructor:'Mahbubur Rahman', capacity:30, fee:8000, status:'Completed', enrolled:['co6','co7'] },
]);

const COURSE_STATUS_TONE = { Open:'pos', Upcoming:'info', Ongoing:'warn', Completed:'neutral', Cancelled:'neg' };

const CoachStore = (() => {
  const LS = 'bff_coaching_v1';
  const seedCourses = _seedCourses();
  let courses = [], extraCoaches = [], coachPatch = {};
  try {
    const s = JSON.parse(localStorage.getItem(LS) || '{}');
    courses = s.courses || seedCourses;
    extraCoaches = s.extraCoaches || [];
    coachPatch = s.coachPatch || {};
  } catch { courses = seedCourses; }
  const subs = new Set();
  const save = () => { try { localStorage.setItem(LS, JSON.stringify({ courses, extraCoaches, coachPatch })); } catch {} subs.forEach(fn=>fn()); };
  const baseCoaches = () => (window.DATA2 && window.DATA2.coaches) || (window.DATA && window.DATA.coaches) || [];
  return {
    subscribe(fn){ subs.add(fn); return ()=>subs.delete(fn); },
    courses(){ return courses; },
    coaches(){ return [...extraCoaches, ...baseCoaches()].map(c => coachPatch[c.id] ? { ...c, ...coachPatch[c.id] } : c); },
    coach(id){ return this.coaches().find(c => c.id === id); },
    addCourse(rec){ const id='cc'+Date.now().toString().slice(-7); courses=[Object.assign({ id, enrolled:[] }, rec), ...courses]; save(); return id; },
    updateCourse(id, patch){ courses=courses.map(c=>c.id===id?{...c,...patch}:c); save(); },
    removeCourse(id){ courses=courses.filter(c=>c.id!==id); save(); },
    enroll(courseId, coachId){ courses=courses.map(c=>{ if(c.id!==courseId) return c; if(c.enrolled.includes(coachId)) return c; return {...c, enrolled:[...c.enrolled, coachId]}; }); save(); },
    unenroll(courseId, coachId){ courses=courses.map(c=>c.id===courseId?{...c, enrolled:c.enrolled.filter(x=>x!==coachId)}:c); save(); },
    addCoach(rec){ const id='cox'+Date.now().toString().slice(-7); extraCoaches=[Object.assign({ id, courses:0 }, rec), ...extraCoaches]; save(); return id; },
    updateCoach(id, patch){ if(extraCoaches.some(c=>c.id===id)) extraCoaches=extraCoaches.map(c=>c.id===id?{...c,...patch}:c); else coachPatch[id]=Object.assign({}, coachPatch[id], patch); save(); },
  };
})();
function useCoaching(){ const [,f]=React.useReducer(x=>x+1,0); React.useEffect(()=>CoachStore.subscribe(f),[]); return CoachStore; }

const _cInit = (s='') => s.replace(/\(.*?\)/g,'').trim().split(/\s+/).filter(w=>!/^md\.?$/i.test(w)).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const _cHue = (s='') => { let h=0; for(const c of s) h=(h*31+c.charCodeAt(0))%360; return h; };
function CoachFace({ name, size=40, ring }) {
  const hue=_cHue(name);
  return <div className="pavatar" style={{ width:size, height:size, fontSize:size*0.36, flex:'none', background:`linear-gradient(150deg, hsl(${hue} 46% 42%), hsl(${(hue+38)%360} 50% 30%))`, border: ring?`2.5px solid ${ring}`:'none' }}>{_cInit(name)}</div>;
}

const fmtBDT = (n) => '\u09f3' + Number(n||0).toLocaleString('en-IN');
const fmtDay = (d) => { const t=new Date(d); return isNaN(t)?'\u2014':t.toLocaleDateString('en-GB',{day:'numeric',month:'short'}); };
const fmtRange = (a,b) => { const ta=new Date(a), tb=new Date(b); if(isNaN(ta)) return '\u2014'; const y=tb.getFullYear(); return `${fmtDay(a)} \u2013 ${fmtDay(b)} ${y}`; };

/* ---- Create / edit course form ---- */
function CourseForm({ initial, mode='add', onClose }) {
  const store = CoachStore;
  const instructors = store.coaches().filter(c=>['AFC A','AFC Pro','UEFA Pro','UEFA A'].includes(c.license)).map(c=>c.name);
  const [f, setF] = React.useState(Object.assign({
    title:'', level:'C', start:'', end:'', venue:'BFF Technical & Football HQ, Dhaka',
    instructor: instructors[0]||'', capacity:'24', fee:'', status:'Open',
  }, initial||{}));
  const set = (k)=>(e)=>setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    const required=[['title','Course name'],['level','Licence level'],['start','Start date'],['end','End date'],['venue','Venue'],['instructor','Lead instructor']];
    const miss=required.find(([k])=>!String(f[k]||'').trim());
    if(miss){ toast(miss[1]+' is required','muted'); return; }
    if(new Date(f.end) < new Date(f.start)){ toast('End date must be after the start date','muted'); return; }
    const ok=await confirmAction({
      title: mode==='add'?'Schedule course?':'Save changes?',
      message: mode==='add'?<>Schedule <b>{f.title}</b>?</>:<>Save changes to <b>{f.title}</b>?</>,
      detail:`${LEVEL_BY[f.level].name} \u00b7 ${fmtRange(f.start,f.end)}`, confirmLabel: mode==='add'?'Schedule course':'Save changes', icon: mode==='add'?'plus':'edit',
    });
    if(!ok) return;
    const rec={ title:f.title.trim(), level:f.level, start:f.start, end:f.end, venue:f.venue.trim(), instructor:f.instructor.trim(), capacity:Number(f.capacity)||0, fee:Number(f.fee)||0, status:f.status };
    if(mode==='add') store.addCourse(rec); else store.updateCourse(f.id, rec);
    toast(<><b>{f.title}</b> {mode==='add'?'scheduled':'updated'}</>); onClose();
  };
  return (
    <Modal title={mode==='add'?'Schedule coaching course':'Edit course'} subtitle={mode==='add'?'Open a new licensing or development course':f.title} width={620} onClose={onClose}
      footer={<><button className="btn ghost sm" onClick={onClose}>Cancel</button><button className="btn sm" onClick={submit}><Icon name="check" size={15} />{mode==='add'?'Schedule course':'Save changes'}</button></>}>
      <div className="form-grid">
        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)' }}>Course</div>
        <Field label="Course name *" span><TextInput value={f.title} onChange={set('title')} placeholder="e.g. AFC \u201cC\u201d Coaching Certificate \u2014 Dhaka" autoFocus /></Field>
        <Field label="Licence level *"><select className="field-input" value={f.level} onChange={set('level')}>{COACH_LEVELS.map(l=><option key={l.code} value={l.code}>{l.name}</option>)}</select></Field>
        <Field label="Status"><select className="field-input" value={f.status} onChange={set('status')}>{['Open','Upcoming','Ongoing','Completed','Cancelled'].map(s=><option key={s} value={s}>{s}</option>)}</select></Field>
        <Field label="Start date *"><input type="date" className="field-input" value={f.start} onChange={set('start')} style={{ fontFamily:'inherit' }} /></Field>
        <Field label="End date *"><input type="date" className="field-input" value={f.end} onChange={set('end')} style={{ fontFamily:'inherit' }} /></Field>

        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)', marginTop:6 }}>Logistics</div>
        <Field label="Venue *" span><TextInput value={f.venue} onChange={set('venue')} placeholder="Host venue / academy" /></Field>
        <Field label="Lead instructor *">{instructors.length ? <select className="field-input" value={f.instructor} onChange={set('instructor')}>{[f.instructor, ...instructors.filter(i=>i!==f.instructor)].filter(Boolean).map(i=><option key={i} value={i}>{i}</option>)}</select> : <TextInput value={f.instructor} onChange={set('instructor')} placeholder="Instructor name" />}</Field>
        <Field label="Capacity"><TextInput value={f.capacity} onChange={set('capacity')} inputMode="numeric" placeholder="24" /></Field>
        <Field label="Course fee (BDT)"><TextInput value={f.fee} onChange={set('fee')} inputMode="numeric" placeholder="18000" /></Field>
      </div>
    </Modal>
  );
}

/* ---- Add / edit coach (licence register) ---- */
function CoachForm({ initial, mode='add', onClose }) {
  const [f, setF] = React.useState(Object.assign({ name:'', role:'', license:'AFC C', nat:'Bangladesh', status:'Valid', expiry:'2028' }, initial||{}));
  const set = (k)=>(e)=>setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    if(!f.name.trim()){ toast('Coach name is required','muted'); return; }
    const ok=await confirmAction({ title: mode==='add'?'Add coach?':'Save changes?', message: mode==='add'?<>Add <b>{f.name}</b> to the licence register?</>:<>Save changes to <b>{f.name}</b>?</>, detail:`${f.license} \u00b7 ${f.nat}`, confirmLabel: mode==='add'?'Add coach':'Save changes', icon: mode==='add'?'plus':'edit' });
    if(!ok) return;
    const rec={ name:f.name.trim(), role:f.role.trim()||'Coach', license:f.license, nat:f.nat.trim(), status:f.status, expiry:String(f.expiry) };
    if(mode==='add') CoachStore.addCoach(rec); else CoachStore.updateCoach(f.id, rec);
    toast(<><b>{f.name}</b> {mode==='add'?'added':'updated'}</>); onClose();
  };
  return (
    <Modal title={mode==='add'?'Add coach to register':'Edit coach'} subtitle={mode==='add'?'Licence holder record':f.name} width={520} onClose={onClose}
      footer={<><button className="btn ghost sm" onClick={onClose}>Cancel</button><button className="btn sm" onClick={submit}><Icon name="check" size={15} />{mode==='add'?'Add coach':'Save changes'}</button></>}>
      <div className="form-grid">
        <Field label="Full name *" span><TextInput value={f.name} onChange={set('name')} placeholder="Coach name" autoFocus /></Field>
        <Field label="Role / assignment" span><TextInput value={f.role} onChange={set('role')} placeholder="e.g. Head Coach \u00b7 Men\u2019s U-20" /></Field>
        <Field label="Highest licence"><select className="field-input" value={f.license} onChange={set('license')}>{['AFC Grassroots','AFC D','AFC C','AFC B','AFC A','AFC Pro','UEFA A','UEFA Pro','Goalkeeping L1','Goalkeeping L2','Goalkeeping L3'].map(l=><option key={l} value={l}>{l}</option>)}</select></Field>
        <Field label="Nationality"><TextInput value={f.nat} onChange={set('nat')} placeholder="Bangladesh" /></Field>
        <Field label="Licence status"><select className="field-input" value={f.status} onChange={set('status')}>{['Valid','Renewal due','Expired'].map(s=><option key={s} value={s}>{s}</option>)}</select></Field>
        <Field label="Valid until"><TextInput value={f.expiry} onChange={set('expiry')} inputMode="numeric" placeholder="2028" /></Field>
      </div>
    </Modal>
  );
}

/* ---- Course detail + enrolment ---- */
function CourseDetail({ course, onClose, onEdit }) {
  const store = useCoaching();
  const c = store.courses().find(x=>x.id===course.id) || course;
  const isStaff = AuthStore.canEdit();
  const lvl = LEVEL_BY[c.level];
  const enrolledCoaches = c.enrolled.map(id=>store.coach(id)).filter(Boolean);
  const [picking, setPicking] = React.useState(false);
  const available = store.coaches().filter(x=>!c.enrolled.includes(x.id));
  const seatsLeft = Math.max(0, c.capacity - c.enrolled.length);
  return (
    <Modal title={c.title} subtitle={`${lvl.name} \u00b7 ${fmtRange(c.start,c.end)}`} width={680} onClose={onClose}
      footer={<>
        {isStaff && onEdit && <button className="btn ghost sm" onClick={onEdit}><Icon name="edit" size={14} />Edit course</button>}
        <button className="btn sm" onClick={onClose}><Icon name="check" size={15} />Close</button>
      </>}>
      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
        {[['Status', c.status],['Seats left', seatsLeft+' / '+c.capacity],['Fee', fmtBDT(c.fee)],['Instructor', c.instructor]].map(([k,v])=>(
          <div key={k} style={{ background:'var(--surface-2)', borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontSize:10, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-faint)', fontWeight:700 }}>{k}</div>
            <div style={{ fontWeight:700, fontSize:13.5, marginTop:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="row" style={{ gap:8, marginBottom:14, flexWrap:'wrap' }}>
        <span className="chip"><Icon name="pin" size={12} /> {c.venue}</span>
        <span className="chip"><Icon name="clock" size={12} /> {lvl.hours}h contact</span>
        <span className="chip"><Icon name="award" size={12} /> Valid {lvl.validity} yrs</span>
      </div>

      <div className="row" style={{ justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div className="eyebrow">Enrolled coaches ({enrolledCoaches.length})</div>
        {isStaff && c.status!=='Completed' && c.status!=='Cancelled' && <button className="chip tab" style={{ height:28 }} onClick={()=>setPicking(!picking)} disabled={seatsLeft===0}><Icon name="plus" size={12} /> {seatsLeft===0?'Course full':'Enrol coach'}</button>}
      </div>

      {picking && (
        <div className="card" style={{ marginBottom:12, maxHeight:200, overflow:'auto' }}>
          {available.length===0 && <div className="card-pad" style={{ fontSize:13, color:'var(--ink-3)' }}>All registered coaches are already enrolled.</div>}
          {available.map(x=>(
            <div key={x.id} className="row" style={{ gap:11, padding:'9px var(--pad)', borderBottom:'1px solid var(--line)', cursor:'pointer' }} onClick={()=>{ store.enroll(c.id, x.id); if(seatsLeft<=1) setPicking(false); }}>
              <CoachFace name={x.name} size={30} />
              <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, fontSize:13 }}>{x.name}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{x.license}</div></div>
              <Icon name="plus" size={16} color="var(--primary)" />
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ overflow:'hidden' }}>
        {enrolledCoaches.length===0 && <div className="card-pad" style={{ fontSize:13, color:'var(--ink-3)', textAlign:'center' }}>No coaches enrolled yet.</div>}
        {enrolledCoaches.map((x,i)=>(
          <div key={x.id} className="row" style={{ gap:12, padding:'10px var(--pad)', borderTop: i>0?'1px solid var(--line)':'none' }}>
            <CoachFace name={x.name} size={34} />
            <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{x.name}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{x.role||'Coach'} \u00b7 holds {x.license}</div></div>
            {c.status==='Completed' ? <span className="badge pos"><Icon name="award" size={12} /> Certified</span> : <span className="badge info">Enrolled</span>}
            {isStaff && c.status!=='Completed' && <button className="icon-btn" title="Remove from course" onClick={()=>store.unenroll(c.id, x.id)}><Icon name="more" size={15} /></button>}
          </div>
        ))}
      </div>
    </Modal>
  );
}

function CoachingCourses({ go }) {
  const store = useCoaching();
  const isStaff = AuthStore.canEdit();
  const [tab, setTab] = React.useState('courses');
  const [filter, setFilter] = React.useState('All');
  const [open, setOpen] = React.useState(null);
  const [form, setForm] = React.useState(null); // {type:'course'|'coach', mode, data}
  const courses = store.courses();
  const coaches = store.coaches();
  const certs = courses.filter(c=>c.status==='Completed').reduce((s,c)=>s+c.enrolled.length,0);
  const activeEnrol = courses.filter(c=>['Open','Upcoming','Ongoing'].includes(c.status)).reduce((s,c)=>s+c.enrolled.length,0);
  const fcourses = courses.filter(c=> filter==='All' || (filter==='Active' ? ['Open','Upcoming','Ongoing'].includes(c.status) : c.status==='Completed'));
  const licColor = { 'AFC Pro':'var(--bff-gold)','UEFA Pro':'var(--bff-gold)','AFC A':'var(--pos)','UEFA A':'var(--pos)','AFC B':'var(--primary)','AFC C':'var(--info)' };

  return (
    <div className="content-inner fade-in">
      <PageHead title="Coaching Course Management" desc="AFC/BFF licensing pathway, course scheduling, enrolment & coach register">
        <button className="btn ghost sm" onClick={()=>toast('Coaching report exported to PDF')}><Icon name="dl" size={15} />Report</button>
        {isStaff && tab==='register'
          ? <button className="btn sm" onClick={()=>setForm({ type:'coach', mode:'add' })}><Icon name="plus" size={15} />Add coach</button>
          : isStaff && <button className="btn sm" onClick={()=>setForm({ type:'course', mode:'add' })}><Icon name="plus" size={15} />Schedule course</button>}
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Courses scheduled" v={courses.length} d="this season" dColor="var(--ink-3)" glyph="cap" />
        <Stat k="Active enrolments" v={activeEnrol} d="open & ongoing" glyph="users" />
        <Stat k="Coaches certified" v={certs} d="completed courses" dColor="var(--ink-3)" glyph="award" accent="var(--pos)" />
        <Stat k="Licensed coaches" v={coaches.length} d="national register" dColor="var(--ink-3)" glyph="shield" />
      </div>

      <div className="row" style={{ gap:8, marginBottom:'var(--gap)', flexWrap:'wrap' }}>
        {[['courses','Courses'],['pathway','Licence Pathway'],['register','Coach Register']].map(([k,l])=>(
          <button key={k} className={'chip tab'+(tab===k?' on':'')} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {tab==='courses' && (
        <div>
          <div className="row" style={{ gap:7, marginBottom:14 }}>
            {['All','Active','Completed'].map(s=>(
              <button key={s} className={'chip tab'+(filter===s?' on':'')} onClick={()=>setFilter(s)}>{s}</button>
            ))}
          </div>
          <div className="grid" style={{ gridTemplateColumns:'repeat(2, 1fr)' }}>
            {fcourses.map(c=>{
              const lvl=LEVEL_BY[c.level]; const seats=Math.max(0,c.capacity-c.enrolled.length); const pct=c.capacity?Math.round(c.enrolled.length/c.capacity*100):0;
              return (
                <div key={c.id} className="card card-pad" style={{ cursor:'pointer', transition:'transform .12s, box-shadow .12s' }} onClick={()=>setOpen(c)}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-md)';}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
                  <div className="row" style={{ gap:12, alignItems:'flex-start', marginBottom:12 }}>
                    <div style={{ width:46, height:46, borderRadius:12, background:`hsl(${lvl.hue} 50% 45% / .14)`, color:`hsl(${lvl.hue} 55% 38%)`, display:'grid', placeItems:'center', flex:'none', fontWeight:800, fontSize:14 }}>{c.level}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:800, fontSize:15, lineHeight:1.2 }}>{c.title}</div>
                      <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:4 }}>{lvl.name}</div>
                    </div>
                    <Badge kind={COURSE_STATUS_TONE[c.status]||'neutral'} dot>{c.status}</Badge>
                  </div>
                  <div className="row" style={{ gap:7, marginBottom:12, flexWrap:'wrap' }}>
                    <span className="chip" style={{ height:24, fontSize:11.5 }}><Icon name="cal" size={12} /> {fmtRange(c.start,c.end)}</span>
                    <span className="chip" style={{ height:24, fontSize:11.5 }}><Icon name="pin" size={12} /> {c.venue.split(',')[0]}</span>
                  </div>
                  <div className="row" style={{ gap:9, borderTop:'1px solid var(--line)', paddingTop:11, alignItems:'center' }}>
                    <CoachFace name={c.instructor} size={28} />
                    <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:9.5, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-faint)', fontWeight:700 }}>Instructor</div><div style={{ fontWeight:700, fontSize:12.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.instructor}</div></div>
                    <div style={{ width:96, flex:'none' }}>
                      <div className="row" style={{ justifyContent:'space-between', fontSize:10.5, color:'var(--ink-3)', marginBottom:3 }}><span className="num">{c.enrolled.length}/{c.capacity}</span><span>{c.status==='Completed'?'done':seats+' left'}</span></div>
                      <Bar v={pct} color={pct>=100?'var(--bff-red)':'var(--primary)'} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab==='pathway' && (
        <div>
          <div className="card card-pad" style={{ marginBottom:'var(--gap)' }}>
            <h3 style={{ fontSize:16, marginBottom:6 }}>BFF / AFC coaching licence pathway</h3>
            <p style={{ fontSize:13, color:'var(--ink-3)', lineHeight:1.55, marginBottom:18, maxWidth:760 }}>Coaches progress through the AFC convention licences. Each level requires the one below it, a minimum service period, assessed contact hours, and renewal every three years through continued professional development.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {COACH_LEVELS.filter(l=>!['GK','FIT'].includes(l.code)).map((l,i,arr)=>{
                const held=coaches.filter(c=>c.license && c.license.includes(l.code==='GRA'?'Grassroots':l.code) && !( l.code==='C' && c.license.includes('Pro'))).length;
                const w=55+i*9;
                return (
                  <div key={l.code} className="row" style={{ gap:14 }}>
                    <div style={{ width:120, flex:'none' }}><div style={{ fontWeight:800, fontSize:14 }}>{l.name}</div><div style={{ fontSize:11, color:'var(--ink-faint)' }}>{l.hours}h \u00b7 valid {l.validity}y</div></div>
                    <div style={{ flex:1 }}>
                      <div style={{ width:w+'%', minWidth:220, background:`linear-gradient(90deg, hsl(${l.hue} 52% 42%), hsl(${l.hue} 52% 42% / .75))`, color:'#fff', padding:'11px 15px', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontSize:12, fontWeight:600 }}>{l.prereq}</span>
                        {i<arr.length-1 && <Icon name="chev" size={15} color="#fff" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid" style={{ gridTemplateColumns:'repeat(2, 1fr)' }}>
            {COACH_LEVELS.map(l=>(
              <div key={l.code} className="card card-pad row" style={{ gap:13, alignItems:'flex-start' }}>
                <div style={{ width:42, height:42, borderRadius:11, background:`hsl(${l.hue} 50% 45% / .14)`, color:`hsl(${l.hue} 55% 38%)`, display:'grid', placeItems:'center', flex:'none', fontWeight:800, fontSize:13 }}>{l.code}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:14.5 }}>{l.name}</div>
                  <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:3, lineHeight:1.45 }}>Prerequisite: {l.prereq}</div>
                  <div className="row" style={{ gap:7, marginTop:9 }}><span className="chip" style={{ height:22, fontSize:11 }}>{l.hours}h</span><span className="chip" style={{ height:22, fontSize:11 }}>Valid {l.validity} yrs</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='register' && (
        <div className="card" style={{ overflow:'hidden' }}>
          <table className="tbl">
            <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Coach</th><th>Highest licence</th><th>Nationality</th><th className="c">Courses</th><th>Valid until</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Status</th></tr></thead>
            <tbody>
              {coaches.map(c=>(
                <tr key={c.id} style={isStaff?{ cursor:'pointer' }:{}} onClick={isStaff?()=>setForm({ type:'coach', mode:'edit', data:c }):undefined}>
                  <td style={{ paddingLeft:'var(--pad)' }}><div className="row" style={{ gap:11 }}><CoachFace name={c.name} size={34} /><div style={{ minWidth:0 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{c.name}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{c.role||'Coach'}</div></div></div></td>
                  <td><span className="badge" style={{ background:'color-mix(in srgb, '+(licColor[c.license]||'var(--ink-3)')+' 16%, transparent)', color: licColor[c.license]||'var(--ink-2)' }}>{c.license}</span></td>
                  <td style={{ color:'var(--ink-2)', fontSize:13 }}>{c.nat}</td>
                  <td className="c num">{c.courses ?? '\u2014'}</td>
                  <td className="num" style={{ fontSize:13 }}>{c.expiry}</td>
                  <td className="r" style={{ paddingRight:'var(--pad)' }}><Badge kind={c.status==='Valid'?'pos':c.status==='Expired'?'neg':'warn'} dot>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && <CourseDetail course={open} onClose={()=>setOpen(null)} onEdit={()=>{ const c=open; setOpen(null); setForm({ type:'course', mode:'edit', data:c }); }} />}
      {form && form.type==='course' && <CourseForm mode={form.mode} initial={form.data} onClose={()=>setForm(null)} />}
      {form && form.type==='coach' && <CoachForm mode={form.mode} initial={form.data} onClose={()=>setForm(null)} />}
    </div>
  );
}
window.CoachingCourses = CoachingCourses;

