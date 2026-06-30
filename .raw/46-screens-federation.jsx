/* ===== screens-federation.jsx ===== */
/* BFF organization: Executive Committee, Standing & Ad-Hoc committees,
   President's Corner, and the Regulations & Legal document library. */

const _bffInit = (s) => s.replace(/\(.*?\)/g, '').trim().split(/\s+/).filter(w => !/^(md\.?|mohammed|mohammad)$/i.test(w)).map(w => w[0]).slice(0, 2).join('').toUpperCase();
const _bffHue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const _bffP = (o) => Object.assign({ initials: _bffInit(o.name), hue: _bffHue(o.name) }, o);

const BFF_EXEC = [
  _bffP({ name:'Tabith Awal', role:'President', tier:0, portfolio:'Chairs the Executive Committee; leads BFF strategy, FIFA/AFC relations and governance.' }),
  _bffP({ name:'Md. Imrul Hassan', role:'Senior Vice President', tier:1, portfolio:'Deputises for the President; oversees professional leagues and competitions.' }),
  _bffP({ name:'Md. Nazzar Shahriar Zahedee', role:'Vice President', tier:2, portfolio:'Vice President — finance & administration portfolio.' }),
  _bffP({ name:'Md. Wahid Uddin Chowdhury (Happy)', role:'Vice President', tier:2, portfolio:'Vice President — competitions & clubs portfolio.' }),
  _bffP({ name:'Sabbir Ahmed Arif', role:'Vice President', tier:2, portfolio:'Vice President — referees & match operations portfolio.' }),
  _bffP({ name:'Fahad Mohammed Karim', role:'Vice President', tier:2, portfolio:'Vice President — marketing, media & commercial portfolio.' }),
  _bffP({ name:'Md. Iqbal Hossain', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Amirul Islam (Babu)', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Md. Golam Gaus', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Md. Mahi Uddin Ahmed (Salam)', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Tipu Sultan', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Md. Monjurul Karim', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Zakir Hossain Chowdhury', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Mahfuza Akhter (Kiron)', role:'Member', tier:3, portfolio:'Executive Committee member — women\u2019s football.' }),
  _bffP({ name:'Kamrul Hasan Hilton', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Satyajit Das Rupu', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Imteaz Hamid (Shobuj)', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Md. Sayeed Hassan Kanan', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Shakhawat Hossain Bhuiya (Shahin)', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Bijon Barua', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
  _bffP({ name:'Md. Sharfur Rahman Moni', role:'Member', tier:3, portfolio:'Executive Committee member.' }),
];
['ec-01','ec-02','ec-03','ec-04','ec-05','ec-06','ec-07','ec-08','ec-09','ec-10','ec-11','ec-12','ec-13','ec-14','ec-15','ec-16','ec-17','ec-18','ec-19','ec-20','ec-21'].forEach((n, i) => { if (BFF_EXEC[i]) BFF_EXEC[i].photo = 'assets/committee/' + n + '.jpg'; });

const BFF_STANDING = [
  { name:'Competitions Committee', chair:'Md. Imrul Hassan', members:11, remit:'Runs BPL, BCL, Federation Cup & national championships; fixtures, formats and regulations.' },
  { name:'Development Committee', chair:'Md. Wahid Uddin Chowdhury (Happy)', members:10, remit:'Grassroots, academies, coach education and the national talent pathway.' },
  { name:'Dhaka Metropolis Football League Committee', chair:'Amirul Islam (Babu)', members:9, remit:'Organises and governs the Dhaka metropolitan football leagues and tiers.' },
  { name:'Finance Committee', chair:'Md. Nazzar Shahriar Zahedee', members:7, remit:'Budgets, audit, FIFA Forward funding and financial governance.' },
  { name:'Futsal Committee', chair:'Satyajit Das Rupu', members:7, remit:'Develops futsal competitions, club licensing and national futsal teams.' },
  { name:'Internal Audit Committee', chair:'Md. Monjurul Karim', members:6, remit:'Independent audit of BFF accounts, compliance and internal controls.' },
  { name:'Marketing Committee', chair:'Fahad Mohammed Karim', members:7, remit:'Commercial rights, sponsorships and broadcast partnerships.' },
  { name:'Media Committee', chair:'Kamrul Hasan Hilton', members:6, remit:'Press, digital channels, accreditation and public relations.' },
  { name:'National Teams Committee', chair:'Md. Iqbal Hossain', members:9, remit:'Oversees men, women and age-group national team programmes and calendars.' },
  { name:'Professional League Management Committee', chair:'Md. Imrul Hassan', members:10, remit:'Operational management of the professional leagues (BPL & BCL).' },
  { name:'Technical Committee', chair:'Sabbir Ahmed Arif', members:9, remit:'Technical direction, coaching standards and football philosophy.' },
];

const BFF_ADHOC = [
  { name:'Beach Soccer Committee', chair:'Bijon Barua', remit:'Establishes beach soccer competitions and a national beach soccer setup.' },
  { name:'Digital Media Management Committee', chair:'Imteaz Hamid (Shobuj)', remit:'BFF digital platforms, social media and online content strategy.' },
  { name:'District Football League Committee', chair:'Md. Golam Gaus', remit:'Coordinates district-level football leagues across all 64 districts.' },
  { name:'Govt. Relations Committee', chair:'Md. Mahi Uddin Ahmed (Salam)', remit:'Liaison with government, NSC and public agencies.' },
  { name:'Grounds Committee', chair:'Md. Sharfur Rahman Moni', remit:'Venue readiness, pitch quality, turf and stadium grounds.' },
  { name:'U15 National Football League Committee', chair:'Md. Sayeed Hassan Kanan', remit:'Runs the U-15 national youth football league and talent identification.' },
  { name:'U17 National Football League Committee', chair:'Shakhawat Hossain Bhuiya (Shahin)', remit:'Runs the U-17 national youth football league and pathway.' },
];

const REG_CATS = ['Club Licensing', 'Competitions', 'Election', 'Disciplinary', 'Agents', 'Calendar & Timeline', 'Youth & Development'];
const _reg = (id, title, cat, season, type, updated, pages) => ({ id, title, cat, season, type, updated, pages });
const BFF_REGS = [
  _reg('rg01', 'BFF Futsal Club Licensing Regulations 2025-26', 'Club Licensing', '2025-26', 'Regulation', '2025-08-14', 96),
  _reg('rg02', 'Core Process Timeline for Futsal 2025-26', 'Calendar & Timeline', '2025-26', 'Timeline', '2025-08-14', 4),
  _reg('rg03', 'Regulations of BCL 2025-26', 'Competitions', '2025-26', 'Regulation', '2025-09-02', 64),
  _reg('rg04', 'BFF Club Licensing Application Manual for WFL 2025-26', 'Club Licensing', '2025-26', 'Manual', '2025-07-28', 120),
  _reg('rg05', 'BFF Club Licensing Regulations for WFL 2025-26', 'Club Licensing', '2025-26', 'Regulation', '2025-07-28', 88),
  _reg('rg06', 'BFF Club Licensing Application Manual for BPL & BCL 2025-26', 'Club Licensing', '2025-26', 'Manual', '2025-07-21', 134),
  _reg('rg07', 'BFF Club Licensing Regulations for BPL & BCL 2025-26', 'Club Licensing', '2025-26', 'Regulation', '2025-07-21', 102),
  _reg('rg08', 'Regulations of BCL 2024-25', 'Competitions', '2024-25', 'Regulation', '2024-09-10', 62),
  _reg('rg09', 'BFF Election Regulations', 'Election', 'General', 'Regulation', '2024-08-30', 28),
  _reg('rg10', 'Regulations of BPL 2024-25', 'Competitions', '2024-25', 'Regulation', '2024-10-05', 78),
  _reg('rg11', 'Regulations of BFF U-18 Football League 2023-24', 'Youth & Development', '2023-24', 'Regulation', '2023-11-12', 40),
  _reg('rg12', 'BFF Club Licensing Regulations for BPL 2024-25', 'Club Licensing', '2024-25', 'Regulation', '2024-08-18', 99),
  _reg('rg13', 'Circular of BCL 2024-25', 'Competitions', '2024-25', 'Circular', '2024-09-01', 3),
  _reg('rg14', 'Core Process Timeline of BCL 2024-25', 'Calendar & Timeline', '2024-25', 'Timeline', '2024-09-01', 4),
  _reg('rg15', 'BFF Club Licensing Regulations for BCL 2024-25', 'Club Licensing', '2024-25', 'Regulation', '2024-08-18', 94),
  _reg('rg16', 'BFF Club Licensing Application Manual 2024-25', 'Club Licensing', '2024-25', 'Manual', '2024-08-12', 128),
  _reg('rg17', 'AFC Club Licensing Regulations (Edition 2023)', 'Club Licensing', '2023-24', 'Regulation', '2023-06-30', 160),
  _reg('rg18', 'BFF BPL 2023-24 Regulations (Full)', 'Competitions', '2023-24', 'Regulation', '2023-12-01', 84),
  _reg('rg19', 'Circular of WFL 2023-24', 'Competitions', '2023-24', 'Circular', '2023-10-20', 3),
  _reg('rg20', 'Core Process Timeline for WFL 2023-24', 'Calendar & Timeline', '2023-24', 'Timeline', '2023-10-20', 4),
  _reg('rg21', "BFF Club Licensing Regulations for Women's Football League 2023-24", 'Club Licensing', '2023-24', 'Regulation', '2023-10-15', 86),
  _reg('rg22', 'Regulations of Independence Cup 2023', 'Competitions', '2023-24', 'Regulation', '2023-10-30', 36),
  _reg('rg23', 'Core Process Timeline for BPL 2023-24', 'Calendar & Timeline', '2023-24', 'Timeline', '2023-11-22', 4),
  _reg('rg24', 'FIFA Football Agent Regulations', 'Agents', 'General', 'Regulation', '2023-01-09', 44),
  _reg('rg25', 'BFF BCL 2022-23 Regulations', 'Competitions', '2022-23', 'Regulation', '2022-12-15', 60),
  _reg('rg26', 'BFF Calendar 2022-23', 'Calendar & Timeline', '2022-23', 'Calendar', '2022-09-05', 6),
  _reg('rg27', 'Regulations of Independence Cup 2022', 'Competitions', '2022-23', 'Regulation', '2022-10-25', 34),
  _reg('rg28', 'Regulations of Bangladesh Premier League 2022-23', 'Competitions', '2022-23', 'Regulation', '2022-12-20', 80),
  _reg('rg29', 'Regulations of BFF U-16 Football Tournament 2021-22', 'Youth & Development', '2021-22', 'Regulation', '2022-02-10', 32),
  _reg('rg30', "Bangladesh Women's Football League 2021-22", 'Competitions', '2021-22', 'Regulation', '2022-01-18', 48),
  _reg('rg31', 'Regulations of Federation Cup 2021', 'Competitions', '2021-22', 'Regulation', '2021-12-05', 34),
  _reg('rg32', 'Regulations of BPL 2019-20', 'Competitions', '2019-20', 'Regulation', '2019-11-10', 72),
  _reg('rg33', 'BFF Disciplinary Code', 'Disciplinary', 'General', 'Code', '2021-03-01', 58),
  _reg('rg34', 'Regulations of BFF National School Football Championship 2019', 'Youth & Development', '2019-20', 'Regulation', '2019-08-15', 28),
  _reg('rg35', 'BFF FD Plan — Vision 2028', 'Youth & Development', 'General', 'Plan', '2020-02-20', 52),
];

const REG_TYPE_TONE = { Regulation:'info', Manual:'neutral', Circular:'warn', Timeline:'neutral', Calendar:'neutral', Code:'neg', Plan:'pos', Amendment:'warn' };

function ECFace({ p, size, ring }) {
  const bg = `linear-gradient(150deg, hsl(${p.hue} 46% 42%), hsl(${(p.hue + 38) % 360} 50% 30%))`;
  return (
    <div className="pavatar" style={{ width:size, height:size, fontSize:size*0.34, flex:'none', background:bg, border: ring ? ('3px solid ' + ring) : 'none' }}>
      {p.photo
        ? <img src={p.photo} alt={p.name} loading="lazy" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        : p.initials}
    </div>
  );
}

function CommitteeMemberCard({ p, big, onClick }) {
  const size = big ? 92 : 60;
  return (
    <div className="card card-pad" onClick={onClick}
      style={{ cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:10, transition:'transform .12s, box-shadow .12s' }}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-md)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
      <ECFace p={p} size={size} ring={p.tier===0 ? 'var(--bff-gold)' : null} />
      <div style={{ minWidth:0, width:'100%' }}>
        <div style={{ fontWeight:800, fontSize: big ? 16.5 : 13.5, lineHeight:1.2, minHeight: big ? 'auto' : 33, display:'flex', alignItems:'flex-end', justifyContent:'center', textWrap:'balance' }}>{p.name}</div>
        <div className="eyebrow" style={{ marginTop:6, fontSize:10, color: p.tier<=1 ? 'var(--primary)' : 'var(--ink-3)' }}>{p.role}</div>
      </div>
    </div>
  );
}

/* ---- Committee store: members + committees, current & historical, persisted ---- */
const _mkMember = (o) => Object.assign({ initials:_bffInit(o.name||'?'), hue:_bffHue(o.name||'x'), tier:3, portfolio:'', photo:null, current:true }, o);
const _seedCommittees = () => {
  const committees = [];
  const members = [];
  committees.push({ id:'exec', name:'Executive Committee', ctype:'exec', term:'2024\u20132028', remit:'The elected governing body of the Bangladesh Football Federation.', current:true });
  BFF_EXEC.forEach((p,i)=> members.push(Object.assign({}, p, { id:'ec'+(i+1), committeeId:'exec', term:'2024\u20132028', current:true })));
  BFF_STANDING.forEach((c,ci)=>{
    const id='std'+(ci+1);
    committees.push({ id, name:c.name, ctype:'standing', term:'2024\u20132028', remit:c.remit, current:true });
    members.push(_mkMember({ id:id+'-c', committeeId:id, name:c.chair, role:'Chairman', tier:1, portfolio:'Chairs the '+c.name+'.' }));
  });
  BFF_ADHOC.forEach((c,ci)=>{
    const id='adh'+(ci+1);
    committees.push({ id, name:c.name, ctype:'adhoc', term:'2024\u20132026', remit:c.remit, current:true });
    members.push(_mkMember({ id:id+'-c', committeeId:id, name:c.chair, role:'Convener', tier:1, portfolio:'Convener of the '+c.name+'.' }));
  });
  committees.push({ id:'exec-2020', name:'Executive Committee', ctype:'exec', term:'2020\u20132024', remit:'Previous elected Executive Committee of the BFF.', current:false });
  [
    { name:'Kazi Md. Salahuddin', role:'President', tier:0, portfolio:'Former BFF President (2008\u20132024); ex-national team captain and South Asian football icon.' },
    { name:'Abdus Salam Murshedy', role:'Senior Vice President', tier:1, portfolio:'Senior Vice President in the previous committee.' },
    { name:'Kazi Nabil Ahmed', role:'Vice President', tier:2, portfolio:'Vice President \u2014 competitions.' },
    { name:'Mohiuddin Ahmed Mohi', role:'Vice President', tier:2, portfolio:'Vice President.' },
    { name:'Ataur Rahman Bhuiyan', role:'Vice President', tier:2, portfolio:'Vice President.' },
    { name:'Mahfuza Akhter Kiron', role:'Member', tier:3, portfolio:'Executive Committee member \u2014 women\u2019s football.' },
    { name:'Tabith Awal', role:'Member', tier:3, portfolio:'Executive Committee member; later elected President (2024).' },
  ].forEach((p,i)=> members.push(_mkMember(Object.assign({ id:'h2020-'+i, committeeId:'exec-2020', term:'2020\u20132024', current:false }, p))));
  return { committees, members };
};

const CommitteeStore = (() => {
  const LS = 'bff_committee_v1';
  const seed = _seedCommittees();
  let extraC = [], extraM = [], patchesM = {}, patchesC = {}, removedM = [], removedC = [], meta = {};
  try {
    const s = JSON.parse(localStorage.getItem(LS) || '{}');
    extraC = s.extraC || []; extraM = s.extraM || []; patchesM = s.patchesM || {};
    patchesC = s.patchesC || {}; removedM = s.removedM || []; removedC = s.removedC || []; meta = s.meta || {};
  } catch {}
  const subs = new Set();
  const save = () => { try { localStorage.setItem(LS, JSON.stringify({ extraC, extraM, patchesM, patchesC, removedM, removedC, meta })); } catch {} subs.forEach(fn=>fn()); };
  const committees = () => [...seed.committees, ...extraC].filter(c=>!removedC.includes(c.id)).map(c => patchesC[c.id] ? { ...c, ...patchesC[c.id] } : c);
  const members = () => [...seed.members, ...extraM].filter(m=>!removedM.includes(m.id)).map(m => {
    const mm = patchesM[m.id] ? { ...m, ...patchesM[m.id] } : m;
    return { ...mm, initials:_bffInit(mm.name||'?'), hue:_bffHue(mm.name||'x') };
  });
  return {
    subscribe(fn){ subs.add(fn); return ()=>subs.delete(fn); },
    committees, members,
    committee(id){ return committees().find(c=>c.id===id); },
    membersOf(id){ return members().filter(m=>m.committeeId===id); },
    addMember(rec){ const id='mx'+Date.now().toString().slice(-7); extraM.unshift(Object.assign({ id, current:true, tier:3 }, rec)); save(); return id; },
    updateMember(id, patch){ if (extraM.some(m=>m.id===id)) extraM = extraM.map(m=>m.id===id?{...m,...patch}:m); else patchesM[id]=Object.assign({}, patchesM[id], patch); save(); },
    removeMember(id){ if (extraM.some(m=>m.id===id)) extraM=extraM.filter(m=>m.id!==id); else if(!removedM.includes(id)) removedM.push(id); delete patchesM[id]; save(); },
    addCommittee(rec){ const id='cx'+Date.now().toString().slice(-7); extraC.push(Object.assign({ id, current:true, ctype:'standing' }, rec)); save(); return id; },
    updateCommittee(id, patch){ if (extraC.some(c=>c.id===id)) extraC=extraC.map(c=>c.id===id?{...c,...patch}:c); else patchesC[id]=Object.assign({}, patchesC[id], patch); save(); },
    meta(){ return meta; },
    setMeta(patch){ meta = Object.assign({}, meta, patch); save(); },
  };
})();
function useCommittees(){ const [,f]=React.useReducer(x=>x+1,0); React.useEffect(()=>CommitteeStore.subscribe(f),[]); return CommitteeStore; }

function fileToAvatar(file, cb){
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    const max = 360; let w = img.width, h = img.height;
    const s = Math.min(1, max / Math.max(w, h)); w = Math.round(w*s); h = Math.round(h*s);
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    cv.getContext('2d').drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    try { cb(cv.toDataURL('image/jpeg', 0.82)); } catch(e){ toast('Could not process that image','muted'); }
  };
  img.onerror = () => { URL.revokeObjectURL(url); toast('Could not read that image','muted'); };
  img.src = url;
}

const TIER_OPTS = [
  { value:0, label:'President' },
  { value:1, label:'Senior VP / Chairman' },
  { value:2, label:'Vice President' },
  { value:3, label:'Member' },
];
const CTYPE_LABEL = { exec:'Executive', standing:'Standing', adhoc:'Ad-hoc' };

function MemberForm({ initial, mode='add', presetCommittee, onClose }) {
  const comms = CommitteeStore.committees();
  const [f, setF] = React.useState(Object.assign({
    name:'', role:'Member', tier:3, committeeId: presetCommittee || (comms[0] && comms[0].id) || '', portfolio:'', term:'', status:'current', photo:null,
  }, initial || {}));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const fileRef = React.useRef(null);
  const pick = (e) => { const file = e.target.files && e.target.files[0]; if(!file) return; fileToAvatar(file, (d)=> setF(s=>({ ...s, photo:d }))); };
  const submit = async () => {
    if(!String(f.name).trim()){ toast('Member name is required','muted'); return; }
    if(!String(f.role).trim()){ toast('Designation is required','muted'); return; }
    if(!f.committeeId){ toast('Select a committee','muted'); return; }
    const c = CommitteeStore.committee(f.committeeId);
    const ok = await confirmAction({
      title: mode==='add'?'Add member?':'Save changes?',
      message: mode==='add' ? <>Add <b>{f.name}</b> to <b>{c?c.name:'the committee'}</b>?</> : <>Save changes to <b>{f.name}</b>?</>,
      detail: `${f.role} \u00b7 ${c?c.name:''}`, confirmLabel: mode==='add'?'Add member':'Save changes', icon: mode==='add'?'plus':'edit',
    });
    if(!ok) return;
    const rec = { name:String(f.name).trim(), role:String(f.role).trim(), tier:Number(f.tier), committeeId:f.committeeId, portfolio:String(f.portfolio||'').trim(), term:String(f.term||'').trim() || (c?c.term:''), current: f.status==='current', photo:f.photo||null };
    if(mode==='add') CommitteeStore.addMember(rec); else CommitteeStore.updateMember(initial.id, rec);
    toast(mode==='add' ? <><b>{rec.name}</b> added</> : <><b>{rec.name}</b> updated</>);
    onClose();
  };
  const preview = { name:f.name||'New member', initials:_bffInit(f.name||'?'), hue:_bffHue(f.name||'x'), tier:Number(f.tier), photo:f.photo };
  const groups = [['exec','Executive'],['standing','Standing'],['adhoc','Ad-hoc']];
  return (
    <Modal title={mode==='add'?'Add committee member':'Edit member'} subtitle={mode==='add'?'Add a person to any BFF committee':f.name} width={600} onClose={onClose}
      footer={<><button className="btn ghost sm" onClick={onClose}>Cancel</button><button className="btn sm" onClick={submit}><Icon name="check" size={15} />{mode==='add'?'Add member':'Save changes'}</button></>}>
      <div className="row" style={{ gap:16, marginBottom:18, alignItems:'center' }}>
        <ECFace p={preview} size={72} ring={preview.tier===0?'var(--bff-gold)':null} />
        <div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={pick} />
          <div className="row" style={{ gap:8 }}>
            <button className="btn ghost sm" onClick={()=>fileRef.current && fileRef.current.click()}><Icon name="plus" size={14} />{f.photo?'Replace photo':'Upload photo'}</button>
            {f.photo && <button className="icon-btn" title="Remove photo" onClick={()=>setF(s=>({...s,photo:null}))}><Icon name="more" size={15} /></button>}
          </div>
          <div style={{ fontSize:11.5, color:'var(--ink-faint)', marginTop:7 }}>Square headshot works best. No photo → initials avatar.</div>
        </div>
      </div>
      <div className="form-grid">
        <Field label="Full name *" span><TextInput value={f.name} onChange={set('name')} placeholder="e.g. Md. Imrul Hassan" autoFocus /></Field>
        <Field label="Committee *"><select className="field-input" value={f.committeeId} onChange={set('committeeId')}>{groups.map(([ct,lbl])=>{ const cs=comms.filter(c=>c.ctype===ct); if(!cs.length) return null; return <optgroup key={ct} label={lbl}>{cs.map(c=><option key={c.id} value={c.id}>{c.name}{c.current?'':' \u00b7 '+c.term}</option>)}</optgroup>; })}</select></Field>
        <Field label="Designation *"><TextInput value={f.role} onChange={set('role')} placeholder="President / VP / Member / Chairman" /></Field>
        <Field label="Rank"><SelectInput value={f.tier} onChange={set('tier')} options={TIER_OPTS} /></Field>
        <Field label="Term"><TextInput value={f.term} onChange={set('term')} placeholder="e.g. 2024–2028" /></Field>
        <Field label="Status"><SelectInput value={f.status} onChange={set('status')} options={[{value:'current',label:'Current'},{value:'historical',label:'Historical'}]} /></Field>
        <Field label="Profile / portfolio" span><textarea className="field-input" rows={3} value={f.portfolio} onChange={set('portfolio')} placeholder="Role, portfolio and background" style={{ resize:'vertical', minHeight:62, fontFamily:'inherit' }}></textarea></Field>
      </div>
    </Modal>
  );
}

function CommitteeForm({ initial, mode='add', onClose }) {
  const [f, setF] = React.useState(Object.assign({ name:'', ctype:'standing', remit:'', term:'2024\u20132028', status:'current' }, initial || {}));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    if(!String(f.name).trim()){ toast('Committee name is required','muted'); return; }
    const ok = await confirmAction({
      title: mode==='add'?'Create committee?':'Save changes?',
      message: mode==='add' ? <>Create <b>{f.name}</b>?</> : <>Save changes to <b>{f.name}</b>?</>,
      detail: `${CTYPE_LABEL[f.ctype]||'Standing'} \u00b7 ${f.term}`, confirmLabel: mode==='add'?'Create committee':'Save changes', icon: mode==='add'?'plus':'edit',
    });
    if(!ok) return;
    const rec = { name:String(f.name).trim(), ctype:f.ctype, remit:String(f.remit||'').trim(), term:String(f.term||'').trim(), current: f.status==='current' };
    if(mode==='add') CommitteeStore.addCommittee(rec); else CommitteeStore.updateCommittee(initial.id, rec);
    toast(mode==='add' ? <><b>{rec.name}</b> created</> : <><b>{rec.name}</b> updated</>);
    onClose();
  };
  return (
    <Modal title={mode==='add'?'New committee':'Edit committee'} subtitle={mode==='add'?'Create a standing, ad-hoc or historical committee':f.name} onClose={onClose}
      footer={<><button className="btn ghost sm" onClick={onClose}>Cancel</button><button className="btn sm" onClick={submit}><Icon name="check" size={15} />{mode==='add'?'Create committee':'Save changes'}</button></>}>
      <div className="form-grid">
        <Field label="Committee name *" span><TextInput value={f.name} onChange={set('name')} placeholder="e.g. Technical & Development Committee" autoFocus /></Field>
        <Field label="Type"><SelectInput value={f.ctype} onChange={set('ctype')} options={[{value:'standing',label:'Standing'},{value:'adhoc',label:'Ad-hoc'},{value:'exec',label:'Executive'}]} /></Field>
        <Field label="Term"><TextInput value={f.term} onChange={set('term')} placeholder="e.g. 2024–2028" /></Field>
        <Field label="Status"><SelectInput value={f.status} onChange={set('status')} options={[{value:'current',label:'Current'},{value:'historical',label:'Historical'}]} /></Field>
        <Field label="Remit / description" span><textarea className="field-input" rows={2} value={f.remit} onChange={set('remit')} placeholder="What this committee is responsible for" style={{ resize:'vertical', minHeight:54, fontFamily:'inherit' }}></textarea></Field>
      </div>
    </Modal>
  );
}

const DEFAULT_PRES_MSG = "Football is the heartbeat of Bangladesh. Our mandate is to build a transparent, professional federation \u2014 strengthening the leagues, widening the talent pathway for boys and girls in all 64 districts, and giving our national teams every chance to compete with the best in Asia.\n\nThis platform brings our committees, clubs, officials and competitions into one accountable system. Together we will deliver a modern game that our supporters can be proud of.";

function PresidentMessageForm({ initial, onClose }) {
  const [msg, setMsg] = React.useState(initial || DEFAULT_PRES_MSG);
  const submit = () => { CommitteeStore.setMeta({ presidentMessage: msg.trim() || DEFAULT_PRES_MSG }); toast('President\u2019s message updated'); onClose(); };
  return (
    <Modal title="Edit President\u2019s message" subtitle="Shown in the President\u2019s Corner" width={560} onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={()=>{ setMsg(DEFAULT_PRES_MSG); }}>Reset to default</button>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" onClick={submit}><Icon name="check" size={15} />Save message</button>
      </>}>
      <Field label="Message" span>
        <textarea className="field-input" rows={8} value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Message from the President" style={{ resize:'vertical', minHeight:160, fontFamily:'inherit', lineHeight:1.6 }}></textarea>
      </Field>
      <div style={{ fontSize:11.5, color:'var(--ink-faint)', marginTop:8 }}>Tip: leave a blank line between paragraphs.</div>
    </Modal>
  );
}

function CommitteeCard({ c, isStaff, onOpen, onEdit }) {
  const store = useCommittees();
  const ms = store.membersOf(c.id);
  const chair = ms.find(m=>m.tier<=1) || ms[0];
  const adhoc = c.ctype==='adhoc';
  return (
    <div className="card card-pad" style={{ cursor:'pointer', transition:'transform .12s, box-shadow .12s' }} onClick={()=>onOpen(c)}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-md)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
      <div className="row" style={{ gap:12, alignItems:'flex-start', marginBottom:12 }}>
        <div style={{ width:42, height:42, borderRadius:11, background: adhoc?'color-mix(in srgb, var(--bff-gold) 22%, transparent)':'color-mix(in srgb, var(--primary) 14%, transparent)', color: adhoc?'#a6791b':'var(--primary)', display:'grid', placeItems:'center', flex:'none' }}><Icon name={adhoc?'flow':'users'} size={20} /></div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="row" style={{ gap:8 }}>
            <div style={{ fontWeight:800, fontSize:16, lineHeight:1.15 }}>{c.name}</div>
            {!c.current && <span className="badge neutral" style={{ flex:'none' }}>{c.term}</span>}
            {adhoc && c.current && <span className="badge warn" style={{ flex:'none' }}>Ad-hoc</span>}
          </div>
          <div style={{ fontSize:12.5, color:'var(--ink-3)', marginTop:4, lineHeight:1.45 }}>{c.remit}</div>
        </div>
        {isStaff && <button className="icon-btn" style={{ width:30, height:30, flex:'none' }} title="Edit committee" onClick={(e)=>{ e.stopPropagation(); onEdit(c); }}><Icon name="edit" size={14} /></button>}
      </div>
      <div className="row" style={{ gap:10, justifyContent:'space-between', borderTop:'1px solid var(--line)', paddingTop:11 }}>
        <div className="row" style={{ gap:9, minWidth:0 }}>
          {chair ? <React.Fragment><ECFace p={chair} size={30} /><div style={{ minWidth:0 }}><div style={{ fontSize:9.5, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--ink-faint)', fontWeight:700 }}>{adhoc?'Convener':'Chair'}</div><div style={{ fontWeight:700, fontSize:12.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{chair.name}</div></div></React.Fragment> : <div style={{ fontSize:12, color:'var(--ink-faint)' }}>No chair yet</div>}
        </div>
        <span className="badge neutral" style={{ flex:'none' }}>{ms.length} {ms.length===1?'member':'members'}</span>
      </div>
    </div>
  );
}

function CommitteeDetail({ committeeId, isStaff, onClose, onAddMember, onSelectMember, onEditCommittee }) {
  const store = useCommittees();
  const c = store.committee(committeeId);
  if(!c) return null;
  const ms = store.membersOf(c.id).slice().sort((a,b)=>(a.tier-b.tier));
  return (
    <Modal title={c.name} subtitle={`${CTYPE_LABEL[c.ctype]||'Standing'} committee \u00b7 ${c.term}${c.current?'':' \u00b7 historical'}`} width={720} onClose={onClose}
      footer={<>
        {isStaff && <button className="btn ghost sm" onClick={()=>onEditCommittee(c)}><Icon name="edit" size={14} />Edit committee</button>}
        {isStaff && <button className="btn ghost sm" onClick={()=>onAddMember(c.id)}><Icon name="plus" size={14} />Add member</button>}
        <button className="btn sm" onClick={onClose}><Icon name="check" size={15} />Close</button>
      </>}>
      {c.remit && <p style={{ fontSize:13, color:'var(--ink-2)', lineHeight:1.55, marginBottom:16 }}>{c.remit}</p>}
      {ms.length===0 ? <div style={{ fontSize:13, color:'var(--ink-3)', padding:'10px 0' }}>No members recorded yet.{isStaff?' Use \u201cAdd member\u201d to add one.':''}</div>
      : <div className="grid" style={{ gridTemplateColumns:'repeat(4, 1fr)' }}>
          {ms.map(p => <CommitteeMemberCard key={p.id||p.name} p={p} onClick={()=>onSelectMember(p)} />)}
        </div>}
    </Modal>
  );
}

function BFFCommittees({ go }) {
  const store = useCommittees();
  const isStaff = AuthStore.canEdit();
  const [tab, setTab] = React.useState('exec');
  const [member, setMember] = React.useState(null);
  const [form, setForm] = React.useState(null);
  const [commForm, setCommForm] = React.useState(null);
  const [commSel, setCommSel] = React.useState(null);
  const [msgForm, setMsgForm] = React.useState(false);
  const execMembers = store.membersOf('exec');
  const president = execMembers.find(p => p.tier === 0) || execMembers[0] || BFF_EXEC[0];
  const canEditPres = isStaff && president && president.id;
  const presMsg = store.meta().presidentMessage || DEFAULT_PRES_MSG;
  const svp = execMembers.find(p => p.tier === 1);
  const vps = execMembers.filter(p => p.tier === 2);
  const members = execMembers.filter(p => p.tier === 3);
  const standing = store.committees().filter(c => c.ctype === 'standing' && c.current);
  const adhoc = store.committees().filter(c => c.ctype === 'adhoc' && c.current);
  const historical = store.committees().filter(c => !c.current);
  const officeBearers = [president, svp, ...vps].filter(Boolean);

  return (
    <div className="content-inner fade-in">
      <PageHead title="BFF Committees" desc="Federation structure · Executive Committee, standing & ad-hoc committees">
        <button className="btn ghost sm" onClick={()=>go('regulations')}><Icon name="doc" size={15} />Regulations</button>
        {isStaff && <button className="btn sm" onClick={()=>setForm({ mode:'add' })}><Icon name="plus" size={15} />Add member</button>}
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Executive Committee" v={execMembers.length} d="elected members" dColor="var(--ink-3)" glyph="users" />
        <Stat k="Vice Presidents" v={(svp?1:0) + vps.length} d="incl. senior VP" dColor="var(--ink-3)" glyph="shield" />
        <Stat k="Standing committees" v={standing.length} d="permanent" glyph="building" />
        <Stat k="Ad-hoc committees" v={adhoc.length} d="task-specific" dColor="var(--ink-3)" glyph="flow" />
      </div>

      <div className="row" style={{ gap:8, marginBottom:'var(--gap)', flexWrap:'wrap' }}>
        {[['exec','Executive Committee'],['standing','Standing Committees'],['adhoc','Ad-Hoc Committees'],['president',"President's Corner"],['history','History']].map(([k,l])=>(
          <button key={k} className={'chip tab'+(tab===k?' on':'')} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {tab==='exec' && (
        <div>
          <div className="card card-pad" style={{ marginBottom:'var(--gap)', background:'linear-gradient(120deg, var(--primary-deep), var(--primary))', borderColor:'transparent', color:'#fff' }}>
            <div className="row" style={{ gap:20, alignItems:'center', flexWrap:'wrap' }}>
              <div className="pavatar" onClick={()=>setMember(president)} style={{ width:96, height:96, flex:'none', background:'#ffffff22', border:'3px solid var(--bff-gold)', overflow:'hidden', fontSize:34, cursor:'pointer' }}>{president.photo ? <img src={president.photo} alt={president.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} /> : president.initials}</div>
              <div style={{ flex:1, minWidth:220 }}>
                <div className="eyebrow" style={{ color:'#ffffffcc' }}>President · Bangladesh Football Federation</div>
                <div style={{ fontWeight:800, fontSize:26, marginTop:4 }}>{president.name}</div>
                <div style={{ fontSize:13.5, opacity:.9, marginTop:6, maxWidth:560, lineHeight:1.5 }}>{president.portfolio}</div>
              </div>
              <div className="row" style={{ gap:8, flex:'none' }}>
                {canEditPres && <button className="btn ghost sm" style={{ background:'#ffffff1f', color:'#fff', borderColor:'#ffffff55' }} onClick={()=>setForm({ mode:'edit', member: president })}><Icon name="edit" size={14} />Edit President</button>}
                <button className="btn sm" style={{ background:'#fff', color:'var(--primary-deep)' }} onClick={()=>setTab('president')}><Icon name="arrowr" size={15} />President&rsquo;s Corner</button>
              </div>
            </div>
          </div>

          <div className="eyebrow" style={{ margin:'0 0 12px 2px' }}>Senior Vice President &amp; Vice Presidents</div>
          <div className="grid" style={{ gridTemplateColumns:'repeat(5, 1fr)', marginBottom:'var(--gap)' }}>
            {svp && <CommitteeMemberCard p={svp} onClick={()=>setMember(svp)} />}
            {vps.map(p => <CommitteeMemberCard key={p.id||p.name} p={p} onClick={()=>setMember(p)} />)}
          </div>

          <div className="eyebrow" style={{ margin:'0 0 12px 2px' }}>Members</div>
          <div className="grid" style={{ gridTemplateColumns:'repeat(5, 1fr)' }}>
            {members.map(p => <CommitteeMemberCard key={p.id||p.name} p={p} onClick={()=>setMember(p)} />)}
          </div>
        </div>
      )}

      {tab==='standing' && (
        <div>
          {isStaff && <div className="row" style={{ justifyContent:'flex-end', marginBottom:12 }}><button className="chip tab" onClick={()=>setCommForm({ mode:'add', ctype:'standing' })}><Icon name="plus" size={13} /> New committee</button></div>}
          <div className="grid" style={{ gridTemplateColumns:'repeat(2, 1fr)' }}>
            {standing.map(c => <CommitteeCard key={c.id} c={c} isStaff={isStaff} onOpen={(cc)=>setCommSel(cc.id)} onEdit={(cc)=>setCommForm({ mode:'edit', committee:cc })} />)}
          </div>
        </div>
      )}

      {tab==='adhoc' && (
        <div>
          {isStaff && <div className="row" style={{ justifyContent:'flex-end', marginBottom:12 }}><button className="chip tab" onClick={()=>setCommForm({ mode:'add', ctype:'adhoc' })}><Icon name="plus" size={13} /> New committee</button></div>}
          <div className="grid" style={{ gridTemplateColumns:'repeat(2, 1fr)' }}>
            {adhoc.map(c => <CommitteeCard key={c.id} c={c} isStaff={isStaff} onOpen={(cc)=>setCommSel(cc.id)} onEdit={(cc)=>setCommForm({ mode:'edit', committee:cc })} />)}
          </div>
        </div>
      )}

      {tab==='history' && (
        <div>
          <div className="row" style={{ justifyContent:'space-between', alignItems:'center', marginBottom:12, flexWrap:'wrap', gap:8 }}>
            <div style={{ fontSize:12.5, color:'var(--ink-3)' }}>Past committees and their members, archived by term.</div>
            {isStaff && <button className="chip tab" onClick={()=>setCommForm({ mode:'add', ctype:'exec', status:'historical' })}><Icon name="plus" size={13} /> Add historical committee</button>}
          </div>
          {historical.length===0 ? <div className="card card-pad" style={{ textAlign:'center', color:'var(--ink-3)', fontSize:13.5 }}>No historical committees recorded yet.</div>
          : <div className="grid" style={{ gridTemplateColumns:'repeat(2, 1fr)' }}>
              {historical.map(c => <CommitteeCard key={c.id} c={c} isStaff={isStaff} onOpen={(cc)=>setCommSel(cc.id)} onEdit={(cc)=>setCommForm({ mode:'edit', committee:cc })} />)}
            </div>}
        </div>
      )}

      {tab==='president' && (
        <div className="grid" style={{ gridTemplateColumns:'1.3fr 1fr' }}>
          <div className="card card-pad">
            <div className="row" style={{ gap:16, marginBottom:16, alignItems:'flex-start' }}>
              <ECFace p={president} size={74} ring="var(--bff-gold)" />
              <div style={{ flex:1, minWidth:0 }}><div className="eyebrow" style={{ color:'var(--primary)' }}>President</div><div style={{ fontWeight:800, fontSize:22, marginTop:3 }}>{president.name}</div><div style={{ fontSize:12.5, color:'var(--ink-3)', marginTop:3 }}>Bangladesh Football Federation</div>{president.portfolio && <div style={{ fontSize:12.5, color:'var(--ink-2)', marginTop:8, lineHeight:1.5 }}>{president.portfolio}</div>}</div>
              {canEditPres && <button className="icon-btn" style={{ flex:'none' }} title="Edit President profile & photo" onClick={()=>setForm({ mode:'edit', member: president })}><Icon name="edit" size={15} /></button>}
            </div>
            <div className="row" style={{ justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div className="eyebrow">Message from the President</div>
              {canEditPres && <button className="chip tab" style={{ height:26, fontSize:11.5 }} onClick={()=>setMsgForm(true)}><Icon name="edit" size={12} /> Edit message</button>}
            </div>
            {presMsg.split(/\n\s*\n/).map((para,i)=>(
              <p key={i} style={{ fontSize:14, color:'var(--ink-2)', lineHeight:1.65, marginTop: i>0?12:0, textWrap:'pretty' }}>{para}</p>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
            <div className="card card-pad">
              <div className="eyebrow" style={{ marginBottom:12 }}>Office bearers</div>
              {officeBearers.map((p,i)=>(
                <div key={p.id||p.name} className="row" style={{ gap:11, padding:'9px 0', borderTop: i>0?'1px solid var(--line)':'none', cursor:'pointer' }} onClick={()=>setMember(p)}>
                  <ECFace p={p} size={34} />
                  <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{p.role}</div></div>
                </div>
              ))}
            </div>
            <div className="card card-pad row" style={{ gap:13, cursor:'pointer' }} onClick={()=>go('regulations')}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-md)';}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='';}}>
              <div style={{ width:42, height:42, borderRadius:11, background:'color-mix(in srgb, var(--primary) 14%, transparent)', color:'var(--primary)', display:'grid', placeItems:'center', flex:'none' }}><Icon name="scale" size={21} /></div>
              <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14 }}>BFF Legal &amp; Regulations</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>Statutes, licensing & competition rules</div></div>
              <Icon name="arrowr" size={18} color="var(--ink-faint)" />
            </div>
          </div>
        </div>
      )}

      {member && (() => {
        const c = member.committeeId ? store.committee(member.committeeId) : null;
        return (
        <Modal title={member.name} subtitle={member.role + (c ? ' \u00b7 ' + c.name : '')} width={480} onClose={()=>setMember(null)}
          footer={<>
            {isStaff && <button className="btn ghost sm" onClick={()=>{ const m=member; setMember(null); setForm({ mode:'edit', member:m }); }}><Icon name="edit" size={14} />Edit</button>}
            {isStaff && <button className="btn ghost sm" style={{ color:'var(--bff-red)' }} onClick={async ()=>{ const ok=await confirmAction({ title:'Remove member?', message:<>Remove <b>{member.name}</b> from <b>{c?c.name:'the committee'}</b>?</>, confirmLabel:'Remove', icon:'more' }); if(ok){ CommitteeStore.removeMember(member.id); setMember(null); toast(<><b>{member.name}</b> removed</>); } }}><Icon name="more" size={14} />Remove</button>}
            <button className="btn sm" onClick={()=>setMember(null)}><Icon name="check" size={15} />Close</button>
          </>}>
          <div className="row" style={{ gap:16, alignItems:'center', marginBottom:16 }}>
            <ECFace p={member} size={66} ring={member.tier===0?'var(--bff-gold)':null} />
            <div style={{ minWidth:0 }}><div style={{ fontWeight:800, fontSize:18 }}>{member.name}</div><div className="eyebrow" style={{ marginTop:4, color:'var(--primary)' }}>{member.role}</div>
              <div className="row" style={{ gap:6, marginTop:8, flexWrap:'wrap' }}>{c && <span className="chip" style={{ height:22, fontSize:11 }}>{c.name}</span>}{member.term && <span className="chip" style={{ height:22, fontSize:11 }}>{member.term}</span>}{member.current===false && <span className="badge neutral">Historical</span>}</div>
            </div>
          </div>
          {member.portfolio && <div style={{ fontSize:13.5, color:'var(--ink-2)', lineHeight:1.6 }}>{member.portfolio}</div>}
        </Modal>
        );
      })()}

      {commSel && <CommitteeDetail committeeId={commSel} isStaff={isStaff} onClose={()=>setCommSel(null)} onAddMember={(cid)=>{ setCommSel(null); setForm({ mode:'add', presetCommittee:cid }); }} onSelectMember={(p)=>{ setCommSel(null); setMember(p); }} onEditCommittee={(cc)=>{ setCommSel(null); setCommForm({ mode:'edit', committee:cc }); }} />}
      {form && <MemberForm mode={form.mode} presetCommittee={form.presetCommittee} initial={form.member ? { id:form.member.id, name:form.member.name, role:form.member.role, tier:form.member.tier, committeeId:form.member.committeeId, portfolio:form.member.portfolio, term:form.member.term, status: form.member.current===false?'historical':'current', photo: form.member.photo||null } : undefined} onClose={()=>setForm(null)} />}
      {commForm && <CommitteeForm mode={commForm.mode} initial={commForm.committee || (commForm.ctype ? { ctype:commForm.ctype, status:commForm.status||'current' } : undefined)} onClose={()=>setCommForm(null)} />}
      {msgForm && <PresidentMessageForm initial={presMsg} onClose={()=>setMsgForm(false)} />}
    </div>
  );
}
window.BFFCommittees = BFFCommittees;

const REG_TYPES = ['Regulation', 'Manual', 'Circular', 'Timeline', 'Calendar', 'Code', 'Plan', 'Amendment'];
const REG_SEASONS = ['2026-27', '2025-26', '2024-25', '2023-24', '2022-23', '2021-22', '2019-20', 'General'];

const RegStore = (() => {
  const LS = 'bff_regs_v1';
  let docs = [];
  try { docs = JSON.parse(localStorage.getItem(LS) || '[]'); } catch {}
  const blobs = {}; // id -> object URL (session fallback)
  const subs = new Set();
  const persist = () => { try { localStorage.setItem(LS, JSON.stringify(docs)); return true; } catch(e){ return false; } };
  const save = () => { persist(); subs.forEach(fn=>fn()); };
  const today = () => new Date().toISOString().slice(0,10);
  return {
    subscribe(fn){ subs.add(fn); return ()=>subs.delete(fn); },
    docs(){ return docs; },
    blobUrl(id){ return blobs[id]; },
    data(id){ const d = docs.find(x=>x.id===id); return (d && d.data) || blobs[id] || null; },
    add(rec, dataUrl){
      const id='ud'+Date.now().toString().slice(-8);
      const doc = Object.assign({ id, uploaded:today(), updated:today() }, rec);
      // Persist the file inline when small enough for localStorage; always keep a session copy.
      if (dataUrl) {
        blobs[id] = dataUrl;
        if (dataUrl.length < 3500000) {
          doc.data = dataUrl;
          docs.unshift(doc);
          if (!persist()) { delete doc.data; persist(); toast('File too large to store permanently — available this session only','muted'); }
          subs.forEach(fn=>fn());
          return id;
        }
        toast('Large file kept for this session only','muted');
      }
      docs.unshift(doc); save(); return id;
    },
    remove(id){ docs = docs.filter(d=>d.id!==id); delete blobs[id]; save(); },
  };
})();
function useRegs(){ const [,f]=React.useReducer(x=>x+1,0); React.useEffect(()=>RegStore.subscribe(f),[]); return RegStore; }

function RegUploadForm({ onClose }) {
  const fileRef = React.useRef(null);
  const [f, setF] = React.useState({ title:'', cat:REG_CATS[0], season:REG_SEASONS[1], customSeason:'', type:'Regulation', fileName:'', pages:'' });
  const [dataUrl, setDataUrl] = React.useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const pick = (e) => {
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const est = Math.max(1, Math.round(file.size / 42000));
    setF(s => ({ ...s, fileName:file.name, pages: s.pages || String(est), title: s.title || file.name.replace(/\.[a-z0-9]+$/i,'') }));
    const reader = new FileReader();
    reader.onload = () => setDataUrl(reader.result);
    reader.onerror = () => toast('Could not read that file','muted');
    reader.readAsDataURL(file);
  };
  const submit = async () => {
    if(!String(f.title).trim()){ toast('Document name is required','muted'); return; }
    const season = f.season === '__custom' ? String(f.customSeason).trim() : f.season;
    if(f.season === '__custom' && !season){ toast('Enter a session / season','muted'); return; }
    if(!f.fileName){ toast('Choose a file to upload','muted'); return; }
    const ok = await confirmAction({
      title:'Publish document?',
      message:<>Publish <b>{f.title}</b> to the public library?</>,
      detail:`${f.type} · ${f.cat} · ${season}`, confirmLabel:'Publish document', icon:'plus',
    });
    if(!ok) return;
    RegStore.add({ title:String(f.title).trim(), cat:f.cat, season, type:f.type, fileName:f.fileName, pages:Number(f.pages)||1 }, dataUrl);
    toast(<><b>{f.title}</b> published</>);
    onClose();
  };
  return (
    <Modal title="Upload document" subtitle="Publish a regulation or legal document to the library" width={600} onClose={onClose}
      footer={<><button className="btn ghost sm" onClick={onClose}>Cancel</button><button className="btn sm" onClick={submit}><Icon name="check" size={15} />Publish document</button></>}>
      <div onClick={()=>fileRef.current && fileRef.current.click()}
        style={{ border:'1.5px dashed var(--line-strong)', borderRadius:12, padding:'18px 16px', display:'flex', gap:14, alignItems:'center', cursor:'pointer', marginBottom:18, background:'var(--surface-2)' }}>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,application/pdf" style={{ display:'none' }} onChange={pick} />
        <div style={{ width:44, height:52, borderRadius:8, background:'color-mix(in srgb, var(--primary) 12%, transparent)', color:'var(--primary)', display:'grid', placeItems:'center', flex:'none' }}><Icon name="doc" size={22} /></div>
        <div style={{ flex:1, minWidth:0 }}>
          {f.fileName
            ? <React.Fragment><div style={{ fontWeight:700, fontSize:13.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{f.fileName}</div><div style={{ fontSize:12, color:'var(--primary)', marginTop:2 }}>Selected · click to replace</div></React.Fragment>
            : <React.Fragment><div style={{ fontWeight:700, fontSize:13.5 }}>Choose a PDF or document</div><div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>Click to browse — PDF, DOC, DOCX</div></React.Fragment>}
        </div>
        <button className="btn ghost sm" onClick={(e)=>{ e.stopPropagation(); fileRef.current && fileRef.current.click(); }}><Icon name="plus" size={14} />Browse</button>
      </div>
      <div className="form-grid">
        <Field label="Document name *" span><TextInput value={f.title} onChange={set('title')} placeholder="e.g. Regulations of BPL 2025-26" autoFocus /></Field>
        <Field label="Category *"><select className="field-input" value={f.cat} onChange={set('cat')}>{REG_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></Field>
        <Field label="Session / season *"><select className="field-input" value={f.season} onChange={set('season')}>{REG_SEASONS.map(s=><option key={s} value={s}>{s==='General'?'General (no season)':s}</option>)}<option value="__custom">Other…</option></select></Field>
        {f.season === '__custom' && <Field label="Custom session *"><TextInput value={f.customSeason} onChange={set('customSeason')} placeholder="e.g. 2027-28" /></Field>}
        <Field label="Document type"><select className="field-input" value={f.type} onChange={set('type')}>{REG_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></Field>
        <Field label="Pages"><TextInput value={f.pages} onChange={set('pages')} inputMode="numeric" placeholder="auto" /></Field>
      </div>
    </Modal>
  );
}

function Regulations({ go }) {
  const store = useRegs();
  const [cat, setCat] = React.useState('All');
  const [season, setSeason] = React.useState('All');
  const [q, setQ] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [viewer, setViewer] = React.useState(null);
  const isStaff = AuthStore.canEdit();
  const uploaded = store.docs();
  const ALL_REGS = [...uploaded, ...BFF_REGS];
  const seasons = ['All', ...Array.from(new Set(ALL_REGS.map(r => r.season)))];
  const ql = q.trim().toLowerCase();
  const list = ALL_REGS.filter(r =>
    (cat === 'All' || r.cat === cat) &&
    (season === 'All' || r.season === season) &&
    (!ql || r.title.toLowerCase().includes(ql))
  );
  const fmtDate = (d) => { const t = new Date(d); return isNaN(t) ? '—' : t.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }); };
  const isUploaded = (r) => uploaded.some(u => u.id === r.id);
  const open = (r, dl) => {
    const data = store.data ? store.data(r.id) : null;
    if (dl) {
      if (data) {
        try { const a = document.createElement('a'); a.href = data; a.download = r.fileName || (r.title + '.pdf'); document.body.appendChild(a); a.click(); a.remove(); return; }
        catch(e){ /* fall through */ }
      }
      if (isUploaded(r)) { toast(<>Original file unavailable — re-upload <b>{r.title}</b></>, 'muted'); return; }
      toast(<>Downloading <b>{r.title}</b></>); return;
    }
    // View in-app (opening a data: URL in a new tab is blocked by the browser)
    if (data) { setViewer({ r, data }); return; }
    if (isUploaded(r)) { toast(<>Original file unavailable — re-upload <b>{r.title}</b> to view</>, 'muted'); return; }
    toast(<><b>{r.title}</b> is a sample library entry — no file attached in this demo</>, 'muted');
  };
  const removeDoc = async (r) => {
    const ok = await confirmAction({ title:'Remove document?', message:<>Remove <b>{r.title}</b> from the library?</>, confirmLabel:'Remove', icon:'more' });
    if(ok){ store.remove(r.id); toast(<><b>{r.title}</b> removed</>); }
  };

  return (
    <div className="content-inner fade-in">
      <PageHead title="Regulations & Legal" desc="BFF statutes, club licensing, competition rules & legal documents">
        <button className="btn ghost sm" onClick={()=>go('committees')}><Icon name="users" size={15} />BFF Committees</button>
        {isStaff && <button className="btn sm" onClick={()=>setUploading(true)}><Icon name="plus" size={15} />Upload document</button>}
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Published documents" v={ALL_REGS.length} d="public library" dColor="var(--ink-3)" glyph="doc" />
        <Stat k="Current season" v={ALL_REGS.filter(r=>r.season==='2025-26').length} d="2025-26" glyph="cal" />
        <Stat k="Categories" v={REG_CATS.length} d="licensing → legal" dColor="var(--ink-3)" glyph="filter" />
        <Stat k="Club licensing" v={ALL_REGS.filter(r=>r.cat==='Club Licensing').length} d="AFC-aligned" glyph="scale" />
      </div>

      <div className="card card-pad" style={{ marginBottom:'var(--gap)' }}>
        <div className="row" style={{ gap:10, flexWrap:'wrap', justifyContent:'space-between' }}>
          <div className="row" style={{ gap:7, flexWrap:'wrap' }}>
            {['All', ...REG_CATS].map(c => (
              <button key={c} className={'chip tab'+(cat===c?' on':'')} onClick={()=>setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="row" style={{ gap:8 }}>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--ink-faint)', pointerEvents:'none' }}><Icon name="search" size={15} /></span>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search documents…"
                style={{ height:36, width:200, borderRadius:9, border:'1px solid var(--line-strong)', padding:'0 12px 0 32px', fontFamily:'inherit', fontSize:13, color:'var(--ink)', background:'var(--surface-2)' }} />
            </div>
            <select value={season} onChange={e=>setSeason(e.target.value)}
              style={{ height:36, borderRadius:9, border:'1px solid var(--line-strong)', padding:'0 10px', fontFamily:'inherit', fontSize:13, color:'var(--ink)', background:'var(--surface-2)' }}>
              {seasons.map(s => <option key={s} value={s}>{s === 'All' ? 'All seasons' : s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        {list.length === 0 && <div className="card-pad" style={{ textAlign:'center', color:'var(--ink-3)', fontSize:13.5 }}>No documents match your filters.</div>}
        {list.map((r,i) => (
          <div key={r.id} className="row" style={{ gap:14, padding:'13px var(--pad)', borderTop: i>0?'1px solid var(--line)':'none', alignItems:'center' }}>
            <div style={{ width:40, height:48, borderRadius:7, background:'color-mix(in srgb, var(--primary) 10%, transparent)', color:'var(--primary)', display:'grid', placeItems:'center', flex:'none' }}><Icon name="doc" size={20} /></div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="row" style={{ gap:8 }}><div style={{ fontWeight:700, fontSize:14, lineHeight:1.3 }}>{r.title}</div>{isUploaded(r) && <span className="badge pos" style={{ flex:'none' }}>New</span>}</div>
              <div className="row" style={{ gap:7, marginTop:6, flexWrap:'wrap' }}>
                <span className={'badge '+(REG_TYPE_TONE[r.type]||'neutral')}>{r.type}</span>
                <span className="chip" style={{ height:22, fontSize:11 }}>{r.cat}</span>
                {r.season !== 'General' && <span className="chip" style={{ height:22, fontSize:11 }}>{r.season}</span>}
                <span style={{ fontSize:11.5, color:'var(--ink-faint)' }}>{(r.fileName ? r.fileName.split('.').pop().toUpperCase() : 'PDF')} · {r.pages} pp · updated {fmtDate(r.updated || r.uploaded)}</span>
              </div>
            </div>
            <div className="row" style={{ gap:7, flex:'none' }}>
              <button className="btn ghost sm" onClick={()=>open(r, false)}><Icon name="search" size={14} />View</button>
              <button className="icon-btn" title="Download" onClick={()=>open(r, true)}><Icon name="dl" size={16} /></button>
              {isStaff && isUploaded(r) && <button className="icon-btn" title="Remove document" style={{ color:'var(--bff-red)' }} onClick={()=>removeDoc(r)}><Icon name="more" size={16} /></button>}
            </div>
          </div>
        ))}
      </div>
      {uploading && <RegUploadForm onClose={()=>setUploading(false)} />}
      {viewer && (() => {
        const r = viewer.r; const isImg = /^data:image\//.test(viewer.data);
        return (
        <Modal title={r.title} subtitle={`${r.type} · ${r.cat}${r.season&&r.season!=='General'?' · '+r.season:''}`} width={920} onClose={()=>setViewer(null)}
          footer={<>
            <button className="btn ghost sm" onClick={()=>open(r, true)}><Icon name="dl" size={14} />Download</button>
            <button className="btn sm" onClick={()=>setViewer(null)}><Icon name="check" size={15} />Close</button>
          </>}>
          <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid var(--line)', background:'var(--surface-2)', height:'70vh' }}>
            {isImg
              ? <div style={{ width:'100%', height:'100%', display:'grid', placeItems:'center', overflow:'auto' }}><img src={viewer.data} alt={r.title} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain' }} /></div>
              : <iframe src={viewer.data} title={r.title} style={{ width:'100%', height:'100%', border:'none' }}></iframe>}
          </div>
        </Modal>
        );
      })()}
    </div>
  );
}
window.Regulations = Regulations;

