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

/* ===== screens-archive.jsx ===== */
/* ---------- National Players Archive (history & Hall of Fame, 1972–) ---------- */
/* ---- Archive store: add/edit heritage records ---- */
const ArchiveStore = (() => {
  const subs = new Set();
  const pa = (s) => s.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const hueOf = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const num = (v, d) => { const n = parseFloat(v); return isNaN(n) ? d : n; };
  const recount = () => { window.DATA4.archiveStats.hofMembers = window.DATA4.legends.filter(x => x.hof).length; };
  return {
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    bump() { subs.forEach(fn => fn()); },
    add(data) {
      const l = Object.assign({}, data, {
        initials: pa(data.name || 'New Player'), hue: hueOf(data.name || 'x'),
        no: num(data.no, 0), caps: num(data.caps, 0), goals: num(data.goals, 0), hof: !!data.hof,
        note: data.note || 'Added to the national heritage archive.',
      });
      window.DATA4.legends.unshift(l);
      recount(); this.bump();
      return l;
    },
    update(p, patch) {
      Object.keys(patch).forEach(k => {
        if (['no','caps','goals'].includes(k)) p[k] = num(patch[k], p[k]);
        else if (k === 'hof') p.hof = !!patch[k];
        else if (patch[k] !== '' && patch[k] != null) p[k] = patch[k];
      });
      if (patch.name) { p.initials = pa(patch.name); p.hue = hueOf(patch.name); }
      recount(); this.bump();
      return p;
    },
  };
})();
function useArchive() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => ArchiveStore.subscribe(force), []);
  return ArchiveStore;
}

/* ---- Add / Edit archive player form ---- */
function LegendForm({ initial, onSubmit, onClose, mode = 'add' }) {
  const D = window.DATA4;
  const [f, setF] = React.useState(Object.assign({
    name: '', pos: 'FW', no: '', years: '', era: D.eras[D.eras.length - 1].id,
    caps: '', goals: '', hof: false, note: '',
  }, initial || {}));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = async () => {
    if (!f.name.trim()) { toast('Player name is required', 'muted'); return; }
    if (!f.years.trim()) { toast('Years active is required, e.g. 1990–1999', 'muted'); return; }
    const ok = await confirmAction({
      title: mode === 'add' ? 'Add to archive?' : 'Save changes?',
      message: mode === 'add'
        ? <>Add <b>{f.name}</b> to the National Players Archive?</>
        : <>Save changes to <b>{f.name}</b>’s archive record?</>,
      detail: `${f.pos} · ${f.years}${f.hof ? ' · Hall of Fame' : ''}`,
      confirmLabel: mode === 'add' ? 'Add to archive' : 'Save changes',
      icon: mode === 'add' ? 'plus' : 'edit',
    });
    if (ok) onSubmit(f);
  };
  return (
    <Modal title={mode === 'add' ? 'Add archive player' : 'Edit archive player'}
      subtitle={mode === 'add' ? 'Record a player in the national heritage archive' : f.name}
      onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" onClick={submit}><Icon name="check" size={15} />{mode === 'add' ? 'Add to archive' : 'Save changes'}</button>
      </>}>
      <div className="form-grid">
        <Field label="Full name" span><TextInput value={f.name} onChange={set('name')} placeholder="e.g. Monem Munna" autoFocus /></Field>
        <Field label="Position"><SelectInput value={f.pos} onChange={set('pos')} options={['GK','DF','MF','FW']} /></Field>
        <Field label="Shirt no."><TextInput value={f.no} onChange={set('no')} inputMode="numeric" placeholder="10" /></Field>
        <Field label="Years active"><TextInput value={f.years} onChange={set('years')} placeholder="1990–1999" /></Field>
        <Field label="Era"><SelectInput value={f.era} onChange={set('era')} options={D.eras.map(e => ({ value: e.id, label: e.label }))} /></Field>
        <Field label="Caps"><TextInput value={f.caps} onChange={set('caps')} inputMode="numeric" placeholder="0" /></Field>
        <Field label="Intl. goals"><TextInput value={f.goals} onChange={set('goals')} inputMode="numeric" placeholder="0" /></Field>
        <Field label="Career note" span>
          <textarea className="field-input" rows={3} value={f.note} onChange={set('note')} placeholder="Short legacy description…" style={{ resize:'vertical', minHeight:70, fontFamily:'inherit' }}></textarea>
        </Field>
        <Field label="Hall of Fame" span>
          <label className="row" style={{ gap: 8, fontSize: 13.5, cursor: 'pointer' }}>
            <input type="checkbox" checked={f.hof} onChange={set('hof')} style={{ accentColor: 'var(--primary)' }} /> Inducted into the Hall of Fame
          </label>
        </Field>
      </div>
    </Modal>
  );
}

function Archive({ go }) {
  const D = window.DATA4;
  useArchive();
  const [era, setEra] = React.useState('all');
  const [sel, setSel] = React.useState(null);
  const [adding, setAdding] = React.useState(false);
  const list = era === 'all' ? D.legends : D.legends.filter(l => l.era === era);
  const eraById = Object.fromEntries(D.eras.map(e => [e.id, e]));
  const kindColor = { Title:'var(--bff-gold)', First:'var(--primary)', Foundation:'var(--bff-red)' };

  if (sel) return <LegendProfile p={sel} e={eraById[sel.era]} D={D} onBack={()=>setSel(null)} />;

  return (
    <div className="content-inner fade-in">
      <PageHead title="National Players Archive" desc="Bangladesh national team heritage & Hall of Fame · since 1972">
        <button className="btn ghost sm" onClick={()=>toast('Heritage book (PDF) downloaded')}><Icon name="dl" size={15} />Heritage book</button>
        {AuthStore.canEdit() && <button className="btn sm" onClick={()=>setAdding(true)}><Icon name="plus" size={15} />Add player</button>}
      </PageHead>

      {adding && (
        <LegendForm mode="add" onClose={()=>setAdding(false)}
          onSubmit={(f)=>{ ArchiveStore.add(f); setAdding(false); toast(`<b>${f.name}</b> added to the archive`); }} />
      )}

      {/* heritage banner */}
      <div className="card" style={{ overflow:'hidden', marginBottom:'var(--gap)' }}>
        <div style={{ background:'linear-gradient(120deg, var(--primary-deep), var(--primary))', color:'#fff', padding:'24px var(--pad)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-30, top:-40, fontSize:200, opacity:0.06, fontFamily:'var(--ff-display)', fontWeight:900 }}>’72</div>
          <div className="row" style={{ gap:14, position:'relative' }}><Flag e="🇧🇩" size={34} /><div><div className="eyebrow" style={{ color:'#ffffffaa' }}>National Team Heritage</div><h2 style={{ fontSize:26, color:'#fff', marginTop:3 }}>Five decades of Bangladesh football</h2></div></div>
          <div className="row" style={{ gap:30, marginTop:18, position:'relative', flexWrap:'wrap' }}>
            {[['Since',D.archiveStats.sinceYear],['Players capped',D.archiveStats.totalCapped],['Hall of Fame',D.archiveStats.hofMembers],['Major titles',D.archiveStats.titles]].map(([k,v])=>(
              <div key={k}><div className="num" style={{ fontSize:28, fontWeight:800 }}>{v}</div><div style={{ fontSize:11, opacity:.8, textTransform:'uppercase', letterSpacing:'.05em' }}>{k}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns:'1fr 320px', alignItems:'start' }}>
        <div>
          {/* era filter */}
          <div className="row" style={{ gap:8, marginBottom:'var(--gap)', flexWrap:'wrap' }}>
            <button className={'chip tab'+(era==='all'?' on':'')} onClick={()=>setEra('all')}>All eras</button>
            {D.eras.map(e=><button key={e.id} className={'chip tab'+(era===e.id?' on':'')} onClick={()=>setEra(e.id)} style={era===e.id?{ background:e.color, borderColor:'transparent', color:'#fff' }:{}}>{e.label}</button>)}
          </div>

          {/* legend cards */}
          <div className="grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))' }}>
            {list.map(p=>{
              const e = eraById[p.era];
              return (
                <div key={p.name} className="card" style={{ overflow:'hidden', cursor:'pointer' }} onClick={()=>setSel(p)} title="View legend profile">
                  <div style={{ height:64, background:`linear-gradient(120deg, ${e.color}, ${e.color}99)`, position:'relative' }}>
                    <div className="num" style={{ position:'absolute', right:12, top:8, fontSize:38, fontWeight:800, color:'#ffffff26' }}>{p.no}</div>
                    {p.hof && <span className="badge" style={{ position:'absolute', left:12, top:12, background:'var(--bff-gold)', color:'#3a2a00' }}><Icon name="trophy" size={10} /> Hall of Fame</span>}
                    <div style={{ position:'absolute', left:14, bottom:-20 }}><Avatar p={p} size={52} /></div>
                  </div>
                  <div style={{ padding:'26px 14px 14px' }}>
                    <div style={{ fontWeight:800, fontSize:15, lineHeight:1.1 }}>{p.name}</div>
                    <div className="row" style={{ gap:8, marginTop:6 }}><PosTag pos={p.pos} /><span className="num" style={{ fontSize:12, color:'var(--ink-3)' }}>{p.years}</span></div>
                    <p style={{ fontSize:12, color:'var(--ink-2)', lineHeight:1.45, margin:'10px 0 12px' }}>{p.note}</p>
                    <div className="row" style={{ justifyContent:'space-between', paddingTop:10, borderTop:'1px solid var(--line)' }}>
                      <div style={{ textAlign:'center', flex:1 }}><div className="num" style={{ fontWeight:800, fontSize:15 }}>{p.caps}</div><div style={{ fontSize:10, color:'var(--ink-faint)' }}>CAPS</div></div>
                      <div style={{ textAlign:'center', flex:1 }}><div className="num" style={{ fontWeight:800, fontSize:15 }}>{p.goals}</div><div style={{ fontSize:10, color:'var(--ink-faint)' }}>GOALS</div></div>
                      <div style={{ textAlign:'center', flex:1 }}><span className="badge neutral" style={{ fontSize:9.5 }}>{e.span.split('–')[0]}s</span></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* milestones timeline */}
        <div className="card card-pad" style={{ position:'sticky', top:0 }}>
          <h3 style={{ fontSize:16, marginBottom:16 }}>Historic milestones</h3>
          <div style={{ position:'relative', paddingLeft:24 }}>
            <div style={{ position:'absolute', left:6, top:6, bottom:6, width:2, background:'var(--line)' }}></div>
            {D.milestones.map((m,i)=>(
              <div key={i} style={{ position:'relative', paddingBottom:i<D.milestones.length-1?18:0 }}>
                <div style={{ position:'absolute', left:-24, top:2, width:14, height:14, borderRadius:'50%', background:kindColor[m.kind]||'var(--primary)', border:'3px solid var(--surface)', boxShadow:'0 0 0 2px '+(kindColor[m.kind]||'var(--primary)') }}></div>
                <div className="row" style={{ gap:8 }}><span className="num" style={{ fontWeight:800, fontSize:13, color:kindColor[m.kind]||'var(--primary)' }}>{m.y}</span><span className="badge neutral" style={{ fontSize:9.5 }}>{m.kind}</span></div>
                <div style={{ fontWeight:700, fontSize:13, marginTop:3 }}>{m.t}</div>
                <div style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:2, lineHeight:1.35 }}>{m.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
/* ---------- Legend detail (mirrors the live PlayerProfile layout) ---------- */
function LegendProfile({ p, e, D, onBack }) {
  const [editing, setEditing] = React.useState(false);
  const yrs = p.years.split('–');
  const from = parseInt(yrs[0], 10);
  const to = yrs[1] ? parseInt(yrs[1], 10) : new Date().getFullYear();
  const active = !yrs[1];
  const span = to - from;

  // deterministic archival attribute synthesis (same approach as live profiles)
  const seed = p.hue;
  const baseR = 74 + (p.hof ? 8 : 0) + Math.min(8, Math.round(p.caps / 12));
  const r = (base, spread) => Math.max(55, Math.min(97, Math.round(base + ((seed % spread) - spread / 2))));
  const attrs = p.pos === 'GK'
    ? [['Reflexes', r(baseR+6,14)], ['Handling', r(baseR+3,12)], ['Aerial', r(baseR,16)], ['Distribution', r(baseR-5,18)], ['Positioning', r(baseR+4,12)], ['Leadership', r(baseR+5,14)]]
    : p.pos === 'DF'
    ? [['Tackling', r(baseR+6,14)], ['Marking', r(baseR+4,12)], ['Heading', r(baseR+2,16)], ['Strength', r(baseR+3,14)], ['Passing', r(baseR-5,18)], ['Leadership', r(baseR+4,14)]]
    : p.pos === 'MF'
    ? [['Passing', r(baseR+6,12)], ['Vision', r(baseR+4,14)], ['Dribbling', r(baseR+1,16)], ['Stamina', r(baseR+4,12)], ['Tackling', r(baseR-3,18)], ['Leadership', r(baseR+3,14)]]
    : [['Finishing', r(baseR+7,12)], ['Pace', r(baseR+3,14)], ['Dribbling', r(baseR+4,14)], ['Off-the-ball', r(baseR+2,16)], ['Heading', r(baseR-2,18)], ['Leadership', r(baseR+2,14)]];

  const careerMilestones = D.milestones.filter(m => { const y = parseInt(m.y, 10); return y >= from && y <= to; });
  const kindColor = { Title:'var(--bff-gold)', First:'var(--primary)', Foundation:'var(--bff-red)' };
  const gpm = p.caps ? (p.goals / p.caps).toFixed(2) : '0.00';

  return (
    <div className="content-inner fade-in">
      <button className="chip tab" style={{ marginBottom:16 }} onClick={onBack}><Icon name="chev" size={13} style={{ transform:'rotate(180deg)' }} /> Back to archive</button>

      {/* HERO */}
      <div className="card" style={{ overflow:'hidden', marginBottom:'var(--gap)' }}>
        <div style={{ background:`linear-gradient(115deg, ${e.color}, color-mix(in srgb, ${e.color} 55%, #0c1210))`, padding:'26px var(--pad)', position:'relative', color:'#fff' }}>
          <div className="num" style={{ position:'absolute', right:-10, top:-30, fontSize:200, fontWeight:800, color:'#ffffff12', lineHeight:1 }}>{p.no}</div>
          <div className="row" style={{ gap:22, position:'relative', alignItems:'flex-start' }}>
            <PlayerPhoto slotId={'legend-photo-'+p.name.replace(/\s+/g,'-').toLowerCase()} size={96} />
            <div style={{ flex:1 }}>
              <div className="row" style={{ gap:10, marginBottom:6, flexWrap:'wrap' }}>
                <PosTag pos={p.pos} />
                {p.hof && <span className="badge" style={{ background:'var(--bff-gold)', color:'#3a2a00' }}><Icon name="trophy" size={11} /> Hall of Fame</span>}
                <span className="badge" style={{ background:'#ffffff22', color:'#fff' }}>{e.label}</span>
                {active && <span className="badge" style={{ background:'#ffffff22', color:'#fff' }}>Still active</span>}
              </div>
              <h1 style={{ fontSize:34, color:'#fff', lineHeight:1 }}>{p.name}</h1>
              <div className="row" style={{ gap:18, marginTop:12, fontSize:13.5, opacity:.92, flexWrap:'wrap' }}>
                <span><Icon name="shield" size={14} style={{ verticalAlign:-2 }} /> Bangladesh National Team · #{p.no}</span>
                <span><Icon name="clock" size={14} style={{ verticalAlign:-2 }} /> {p.years}{active ? ' (ongoing)' : ''}</span>
              </div>
            </div>
            {AuthStore.canEdit() && <button className="btn ghost sm" title="Edit archive record" style={{ background:'#ffffff18', color:'#fff', borderColor:'#ffffff33' }} onClick={()=>setEditing(true)}>
              <Icon name="edit" size={15} /> Edit
            </button>}
          </div>
        </div>
        {/* quick facts */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)' }}>
          {[['Caps',p.caps],['Goals',p.goals],['Goals / cap',gpm],['Debut',from],['Career',span+' yrs'],['Era',e.span]].map(([k,v],i)=>(
            <div key={k} style={{ padding:'14px var(--pad)', borderRight: i<5?'1px solid var(--line)':'none', textAlign:'center' }}>
              <div className="num" style={{ fontSize:22, fontWeight:800 }}>{v}</div>
              <div style={{ fontSize:11, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.06em', marginTop:2 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns:'1.3fr 1fr', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
          {/* attribute profile */}
          <div className="card card-pad">
            <div className="row" style={{ justifyContent:'space-between', marginBottom:16 }}><h3 style={{ fontSize:16 }}>Attribute profile</h3><span className="badge neutral">Archival estimate</span></div>
            <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', columnGap:26, rowGap:14 }}>
              {attrs.map(([k,v]) => (
                <div key={k}>
                  <div className="row" style={{ justifyContent:'space-between', marginBottom:5 }}><span style={{ fontSize:13, fontWeight:600 }}>{k}</span><span className="num" style={{ fontWeight:800, color: v>=82?'var(--pos)':v>=70?'var(--ink)':'var(--ink-3)' }}>{v}</span></div>
                  <Bar v={v} color={v>=82?'var(--pos)':v>=70?'var(--primary)':'var(--warn)'} />
                </div>
              ))}
            </div>
          </div>
          {/* legacy */}
          <div className="card card-pad">
            <h3 style={{ fontSize:16, marginBottom:12 }}>Legacy</h3>
            <p style={{ fontSize:13.5, color:'var(--ink-2)', lineHeight:1.55 }}>{p.note}</p>
            <div className="row" style={{ gap:9, marginTop:14, padding:'10px 12px', border:'1px dashed var(--line-strong)', borderRadius:9, fontSize:12.5 }}>
              <Icon name="star" size={15} color={e.color} style={{ flex:'none' }} />
              <span><b>{e.label}</b> ({e.span}) — {e.desc}</span>
            </div>
          </div>
        </div>

        {/* career highlights + milestones during career */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
          <HighlightsCard p={p} title="Career highlights" badge="Archive reel" />
          <div className="card card-pad">
            <h3 style={{ fontSize:16, marginBottom:16 }}>Milestones during career</h3>
          {careerMilestones.length === 0 && <p style={{ fontSize:13, color:'var(--ink-3)' }}>No recorded federation milestones in this period.</p>}
          <div style={{ position:'relative', paddingLeft:24 }}>
            {careerMilestones.length > 0 && <div style={{ position:'absolute', left:6, top:6, bottom:6, width:2, background:'var(--line)' }}></div>}
            {careerMilestones.map((m,i)=>(
              <div key={i} style={{ position:'relative', paddingBottom:i<careerMilestones.length-1?18:0 }}>
                <div style={{ position:'absolute', left:-24, top:2, width:14, height:14, borderRadius:'50%', background:kindColor[m.kind]||'var(--primary)', border:'3px solid var(--surface)', boxShadow:'0 0 0 2px '+(kindColor[m.kind]||'var(--primary)') }}></div>
                <div className="row" style={{ gap:8 }}><span className="num" style={{ fontWeight:800, fontSize:13, color:kindColor[m.kind]||'var(--primary)' }}>{m.y}</span><span className="badge neutral" style={{ fontSize:9.5 }}>{m.kind}</span></div>
                <div style={{ fontWeight:700, fontSize:13, marginTop:3 }}>{m.t}</div>
                <div style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:2, lineHeight:1.35 }}>{m.d}</div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {editing && (
        <LegendForm mode="edit"
          initial={{ name:p.name, pos:p.pos, no:p.no, years:p.years, era:p.era, caps:p.caps, goals:p.goals, hof:!!p.hof, note:p.note }}
          onClose={()=>setEditing(false)}
          onSubmit={(f)=>{ ArchiveStore.update(p, f); setEditing(false); toast(`<b>${f.name}</b> updated`); }} />
      )}
    </div>
  );
}

window.Archive = Archive;

