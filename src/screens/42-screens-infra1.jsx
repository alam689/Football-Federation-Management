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

/* ===== screens-infra1.jsx ===== */
/* ====================================================================
   Roadmap-initiative modules:
   Competition Mgmt · E-Ticketing · Sports Science · Infrastructure
   ==================================================================== */

/* ---------- Competition Management (+ VAR & goal-line tech) ---------- */
/* ---- New competition form ---- */
function CompetitionForm({ onSubmit, onClose }) {
  const colors = ['#006a4e', '#ee2737', '#1f6feb', '#8a5cf6', '#f59e0b', '#0ea5a3'];
  const [f, setF] = React.useState({
    name:'', short:'', type:'League', teams:'', total:'', round:'', leader:'', season:'2025–26', status:'Upcoming', color:'#006a4e',
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async () => {
    const required = [['name','Competition name'],['short','Short name'],['season','Season']];
    const missing = required.find(([k]) => !String(f[k] || '').trim());
    if (missing) { toast(missing[1] + ' is required', 'muted'); return; }
    const ok = await confirmAction({
      title: 'Create competition?', message: <>Set up <b>{f.name}</b>?</>,
      detail: `${f.type} · ${f.teams || '—'} teams · ${f.season}`, confirmLabel:'Create competition', icon:'plus',
    });
    if (ok) onSubmit({
      id:'c'+Date.now(), name:f.name, short:f.short, type:f.type, teams:Number(f.teams)||0,
      played:0, total:Number(f.total)||0, round:f.round || 'Not started', leader:f.leader || '—',
      status:f.status, season:f.season, color:f.color,
    });
  };
  return (
    <Modal title="New competition" subtitle="Set up a league, cup or tournament" onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" onClick={submit}><Icon name="check" size={15} />Create competition</button>
      </>}>
      <div className="form-grid">
        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)' }}>Competition details</div>
        <Field label="Name *" span><TextInput value={f.name} onChange={set('name')} placeholder="e.g. Bangladesh Premier League" autoFocus /></Field>
        <Field label="Short name *"><TextInput value={f.short} onChange={set('short')} placeholder="e.g. BPL" /></Field>
        <Field label="Format"><SelectInput value={f.type} onChange={set('type')} options={['League', 'Knockout', 'Group + Knockout']} /></Field>
        <Field label="Teams"><TextInput value={f.teams} onChange={set('teams')} inputMode="numeric" placeholder="10" /></Field>
        <Field label="Total matches"><TextInput value={f.total} onChange={set('total')} inputMode="numeric" placeholder="90" /></Field>
        <Field label="Season *"><TextInput value={f.season} onChange={set('season')} placeholder="2025–26" /></Field>
        <Field label="Status"><SelectInput value={f.status} onChange={set('status')} options={['Upcoming', 'Live', 'Done']} /></Field>

        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)', marginTop:6 }}>State &amp; branding</div>
        <Field label="Current round"><TextInput value={f.round} onChange={set('round')} placeholder="e.g. Match-week 1" /></Field>
        <Field label="Leader / holder"><TextInput value={f.leader} onChange={set('leader')} placeholder="e.g. Bashundhara Kings" /></Field>
        <Field label="Accent colour" span>
          <div className="row" style={{ gap:8 }}>
            {colors.map(col => (
              <button key={col} type="button" onClick={()=>setF({ ...f, color: col })}
                style={{ width:30, height:30, borderRadius:8, background:col, cursor:'pointer',
                  border: f.color===col ? '2px solid var(--ink)' : '2px solid var(--line)',
                  outline: f.color===col ? '2px solid '+col : 'none', outlineOffset:1 }} />
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  );
}
window.CompetitionForm = CompetitionForm;

function CompetitionMgmt() {
  const D = window.DATA3;
  const [sel, setSel] = React.useState('bpl');
  const [extra, setExtra] = React.useState([]);
  const [adding, setAdding] = React.useState(false);
  const allComp = [...D.competitions, ...extra];
  const c = allComp.find(x => x.id === sel);
  const stColor = (s) => s === 'Live' ? 'pos' : s === 'Done' ? 'neutral' : 'warn';

  return (
    <div className="content-inner fade-in">
      <PageHead title="Competition Management" desc="Leagues, cups, scheduling, standings & match technology">
        <button className="btn ghost sm" onClick={()=>toast('Fixtures grid opened')}><Icon name="cal" size={15} />Fixtures grid</button>
        <button className="btn sm" onClick={()=>setAdding(true)}><Icon name="plus" size={15} />New competition</button>
      </PageHead>

      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Active competitions" v={allComp.filter(x=>x.status==='Live').length} d="this season" glyph="trophy" />
        <Stat k="Matches scheduled" v={allComp.reduce((s,x)=>s+x.total,0)} d="all competitions" dColor="var(--ink-3)" glyph="cal" />
        <Stat k="Matches played" v={allComp.reduce((s,x)=>s+x.played,0)} d="season to date" dColor="var(--ink-3)" glyph="ball" />
        <Stat k="VAR venues" v="3 / 7" d="goal-line at 2" dColor="var(--ink-3)" glyph="globe" accent="var(--bff-red)" />
      </div>

      {/* competition selector */}
      <div className="row" style={{ gap:8, marginBottom:'var(--gap)', flexWrap:'wrap' }}>
        {allComp.map(x => (
          <button key={x.id} className={'chip tab'+(sel===x.id?' on':'')} onClick={()=>setSel(x.id)} style={sel===x.id?{ background:x.color, borderColor:'transparent', color:'#fff' }:{}}>{x.short}</button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns:'1.5fr 1fr', alignItems:'start' }}>
        <div className="card" style={{ overflow:'hidden' }}>
          <div className="card-pad" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--line)' }}>
            <div>
              <div className="row" style={{ gap:9 }}><h3 style={{ fontSize:17 }}>{c.name}</h3><Badge kind={stColor(c.status)} dot>{c.status}</Badge></div>
              <div style={{ fontSize:12.5, color:'var(--ink-3)', marginTop:3 }}>{c.season} · {c.type} · {c.round}</div>
            </div>
            <div style={{ textAlign:'right' }}><div className="num" style={{ fontWeight:800, fontSize:20 }}>{c.played}<span style={{ color:'var(--ink-faint)', fontSize:13 }}>/{c.total}</span></div><div style={{ fontSize:11, color:'var(--ink-faint)' }}>MATCHES</div></div>
          </div>

          {c.type === 'League' ? (
            <table className="tbl">
              <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>#</th><th>Club</th><th className="c">P</th><th className="c">W</th><th className="c">D</th><th className="c">L</th><th className="c">GD</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Pts</th></tr></thead>
              <tbody>
                {(sel==='bpl'?D.bplTable:D.bplTable.slice(0,c.teams)).map((t,i)=>(
                  <tr key={t.p} style={ i===0?{ background:'color-mix(in srgb,var(--bff-gold) 9%,transparent)' }:i<3?{ background:'color-mix(in srgb,var(--primary) 5%,transparent)' }:{}}>
                    <td style={{ paddingLeft:'var(--pad)' }}><span className="num" style={{ fontWeight:800, color: i===0?'var(--bff-gold)':i<3?'var(--primary)':'var(--ink-3)' }}>{i+1}</span></td>
                    <td style={{ fontWeight:700 }}>{t.p}</td>
                    <td className="c num">{t.pl}</td><td className="c num">{t.w}</td><td className="c num">{t.d}</td><td className="c num">{t.l}</td>
                    <td className="c num" style={{ color: t.gf-t.ga>0?'var(--pos)':t.gf-t.ga<0?'var(--neg)':'var(--ink-3)' }}>{t.gf-t.ga>0?'+':''}{t.gf-t.ga}</td>
                    <td className="r num" style={{ paddingRight:'var(--pad)', fontWeight:800 }}>{t.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="card-pad">
              <Bracket bracket={sel==='school' ? D.schoolBracket : D.bracket} />
            </div>
          )}
        </div>

        {/* match technology */}
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--gap)' }}>
          <div className="card card-pad">
            <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}><h3 style={{ fontSize:16 }}>Match technology</h3><Badge kind="info">VAR · GLT</Badge></div>
            <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {D.matchTech.map(m=>(
                <div key={m.k} style={{ padding:'12px', background:'var(--surface-2)', borderRadius:10 }}>
                  <Icon name={m.icon} size={16} color="var(--primary)" />
                  <div className="num" style={{ fontWeight:800, fontSize:20, marginTop:8 }}>{m.v}</div>
                  <div style={{ fontSize:11.5, color:'var(--ink-2)', fontWeight:600 }}>{m.k}</div>
                  <div style={{ fontSize:11, color:'var(--ink-faint)', marginTop:2 }}>{m.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-pad" style={{ background:'var(--surface-2)' }}>
            <div className="row" style={{ gap:10 }}><div style={{ width:38, height:38, borderRadius:10, background:'var(--primary)', color:'#fff', display:'grid', placeItems:'center', flex:'none' }}><Icon name="whistle" size={18} /></div><div><div style={{ fontWeight:700, fontSize:13.5 }}>VAR rollout on schedule</div><div style={{ fontSize:12, color:'var(--ink-3)' }}>Goal-line tech at 2 venues; 2 more by 2027.</div></div></div>
          </div>
        </div>
      </div>
      {adding && <CompetitionForm onClose={()=>setAdding(false)} onSubmit={(comp)=>{ setExtra([...extra, comp]); setSel(comp.id); setAdding(false); toast(<><b>{comp.name}</b> created</>); }} />}
    </div>
  );
}
window.Bracket = Bracket;

function Bracket({ bracket }) {
  const Tie = ({ t }) => (
    <div className="card" style={{ padding:'10px 12px', boxShadow:'none', border:'1px solid var(--line)' }}>
      {[['a','as'],['b','bs']].map(([k,sk])=>(
        <div key={k} className="row" style={{ justifyContent:'space-between', padding:'4px 0' }}>
          <span style={{ fontWeight:600, fontSize:13 }}>{t[k]}</span>
          <span className="num" style={{ fontWeight:800, color: t.done && t[sk]===Math.max(t.as,t.bs)?'var(--pos)':'var(--ink-3)' }}>{t.done?t[sk]:'–'}</span>
        </div>
      ))}
      {!t.done && <div style={{ fontSize:11, color:'var(--ink-faint)', marginTop:4 }}>{t.when}</div>}
    </div>
  );
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom:10 }}>Semi-finals</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
        {bracket.semis.map((t,i)=><Tie key={i} t={t} />)}
      </div>
      <div className="eyebrow" style={{ marginBottom:10 }}>Final · {bracket.final.when}</div>
      <div className="card" style={{ padding:'12px 14px', boxShadow:'none', border:'1px dashed var(--primary)', background:'color-mix(in srgb,var(--primary) 6%,transparent)' }}>
        <div className="row" style={{ justifyContent:'space-between' }}><span style={{ fontWeight:700 }}>{bracket.final.a}</span><span className="num" style={{ color:'var(--ink-faint)' }}>vs</span><span style={{ fontWeight:700 }}>{bracket.final.b}</span></div>
        <div style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:6, textAlign:'center' }}><Icon name="pin" size={12} style={{ verticalAlign:-2 }} /> {bracket.final.venue}</div>
      </div>
    </div>
  );
}
window.CompetitionMgmt = CompetitionMgmt;

/* ---------- E-Ticketing ---------- */
/* ---------- E-Ticketing: Management + Public portal ---------- */
const TicketStore = (() => {
  const subs = new Set();
  let orders = [];
  let passOrders = [];
  let seq = 242;
  let pseq = 58;
  const num = (s) => +String(s).replace(/[^0-9.]/g, '') || 0;
  return {
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    bump() { subs.forEach(fn => fn()); },
    orders() { return [...orders, ...window.DATA3.ticketOrders]; },
    passOrders() { return passOrders; },
    purchase(o) {
      const id = 'BFF-T0' + (seq++);
      const rec = Object.assign({ id, status:'Confirmed', when:'just now', gate:'pending' }, o);
      orders.unshift(rec);
      // reflect sold count on the match + tier
      const m = window.DATA3.ticketMatches.find(x => x.id === o.matchId);
      if (m) m.sold = Math.min(m.cap, m.sold + o.qty);
      const t = window.DATA3.ticketTiers.find(x => x.name === o.tier);
      if (t) t.sold = Math.min(t.total, t.sold + o.qty);
      this.bump();
      return rec;
    },
    setGate(id, gate) { const o = orders.find(x => x.id === id); if (o) { o.gate = gate; this.bump(); } },
    refund(id) { const o = orders.find(x => x.id === id); if (o) { o.status = 'Refunded'; o.gate = '—'; this.bump(); } },
    buyPass(o) {
      const id = 'BFF-SP' + String(pseq++).padStart(3, '0');
      const rec = Object.assign({ id, status:'Active', when:'just now' }, o);
      passOrders.unshift(rec);
      const p = window.DATA3.seasonPasses.find(x => x.id === o.passId);
      if (p) p.sold = Math.min(p.total, p.sold + (o.qty || 1));
      this.bump();
      return rec;
    },
  };
})();
function useTickets() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => TicketStore.subscribe(force), []);
  return TicketStore;
}
window.TicketStore = TicketStore;

function ETicketing() {
  const D = window.DATA3;
  const isFan = window.AuthStore && AuthStore.role() && AuthStore.role().id === 'fan';
  const [mode, setMode] = React.useState(isFan ? 'public' : 'manage');

  if (isFan) {
    return (
      <div className="content-inner fade-in">
        <PageHead title="E-Ticketing" desc="Buy match tickets · secure QR e-tickets to your phone" />
        <PublicPortal D={D} />
      </div>
    );
  }

  return (
    <div className="content-inner fade-in">
      <PageHead title="E-Ticketing" desc="Digital ticket sales, public portal & stadium access control">
        <div className="row" style={{ gap:4, background:'var(--surface-3)', borderRadius:9, padding:3 }}>
          {[['manage','Management','grid'],['public','Public portal','globe']].map(([k,label,ic])=>(
            <button key={k} onClick={()=>setMode(k)} className="row" style={{ gap:7, height:32, padding:'0 14px', borderRadius:7, border:'none', whiteSpace:'nowrap', fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer', background: mode===k?'var(--surface)':'transparent', color: mode===k?'var(--ink)':'var(--ink-3)', boxShadow: mode===k?'var(--shadow-sm)':'none' }}>
              <Icon name={ic} size={15} />{label}
            </button>
          ))}
        </div>
      </PageHead>

      {mode === 'manage' ? <TicketManagement D={D} /> : <PublicPortal D={D} />}
    </div>
  );
}

/* ===== Management view ===== */
function TicketManagement({ D }) {
  const tickets = useTickets();
  const [sel, setSel] = React.useState(D.ticketMatches[0].id);
  const m = D.ticketMatches.find(x => x.id === sel);
  const pct = Math.round(m.sold / m.cap * 100);
  const orders = tickets.orders();

  return (
    <div className="fade-in">
      <div className="grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:'var(--gap)' }}>
        <Stat k="Revenue (window)" v={D.ticketStats.revenue} d="+27% YoY" glyph="trend" />
        <Stat k="Tickets sold" v={D.ticketStats.sold.toLocaleString()} d="next fixture" dColor="var(--ink-3)" glyph="cards" />
        <Stat k="Digital share" v={D.ticketStats.digital+'%'} d="paperless entry" glyph="globe" />
        <Stat k="Gate time" v={D.ticketStats.gateTime} d="QR turnstiles" dColor="var(--ink-3)" glyph="clock" accent="var(--bff-red)" />
      </div>

      <div className="grid" style={{ gridTemplateColumns:'320px 1fr', alignItems:'start', marginBottom:'var(--gap)' }}>
        {/* match list */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div className="eyebrow">On sale now</div>
          {D.ticketMatches.map(x => {
            const p = Math.round(x.sold/x.cap*100);
            return (
              <div key={x.id} className="card card-pad" style={{ cursor:'pointer', borderColor: sel===x.id?'var(--primary)':'var(--line)', boxShadow: sel===x.id?'var(--shadow-md)':'var(--shadow-sm)' }} onClick={()=>setSel(x.id)}>
                <div className="row" style={{ justifyContent:'space-between' }}>
                  <div style={{ fontWeight:700, fontSize:13.5, minWidth:0, flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.5 }}><Flag e={x.hf} size={17} /> {x.home.replace(' Kings','').replace(' Limited','')} <span style={{ color:'var(--ink-faint)', fontWeight:400 }}>v</span> {x.away} <Flag e={x.af} size={17} /></div>
                  <span className="num badge neutral">{x.date}</span>
                </div>
                <div style={{ fontSize:11.5, color:'var(--ink-3)', margin:'6px 0 9px' }}>{x.comp} · {x.venue}</div>
                <Bar v={p} color={p>85?'var(--bff-red)':'var(--primary)'} />
                <div className="row" style={{ justifyContent:'space-between', marginTop:5 }}><span className="num" style={{ fontSize:11, color:'var(--ink-3)' }}>{x.sold.toLocaleString()} / {x.cap.toLocaleString()}</span><span className="num" style={{ fontSize:11, fontWeight:700, color:p>85?'var(--bff-red)':'var(--primary)' }}>{p}% sold</span></div>
              </div>
            );
          })}
        </div>

        {/* seat map + tiers */}
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', rowGap:12 }}>
            <div style={{ minWidth:0 }}><h3 style={{ fontSize:17 }}>{m.home} v {m.away}</h3><div style={{ fontSize:12.5, color:'var(--ink-3)', marginTop:2 }}>{m.venue} · {m.date} · {m.time}</div></div>
            <div className="row" style={{ gap:22, alignItems:'flex-end' }}>
              <div style={{ textAlign:'right' }}><div className="num" style={{ fontWeight:800, fontSize:18 }}>{m.sold.toLocaleString()}</div><div style={{ fontSize:11, color:'var(--ink-faint)' }}>TOTAL SOLD</div></div>
              <div style={{ textAlign:'right' }}><div className="num" style={{ fontWeight:800, fontSize:18, color:'var(--ink-2)' }}>{m.cap.toLocaleString()}</div><div style={{ fontSize:11, color:'var(--ink-faint)' }}>TOTAL CAPACITY</div></div>
              <div style={{ textAlign:'right' }}><div className="num" style={{ fontWeight:800, fontSize:24, color: pct>85?'var(--bff-red)':'var(--primary)' }}>{pct}%</div><div style={{ fontSize:11, color:'var(--ink-faint)' }}>CAPACITY SOLD</div></div>
            </div>
          </div>
          <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <SeatMap tiers={D.ticketTiers} />
            <div>
              <div className="eyebrow" style={{ marginBottom:10 }}>Price tiers</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {D.ticketTiers.map(t=>{
                  const p = Math.round(t.sold/t.total*100);
                  return (
                    <div key={t.name} style={{ padding:'11px 13px', border:'1px solid var(--line)', borderRadius:10 }}>
                      <div className="row" style={{ justifyContent:'space-between', marginBottom:7 }}>
                        <div className="row" style={{ gap:8 }}><span style={{ width:11, height:11, borderRadius:3, background:t.color }}></span><b style={{ fontSize:13.5 }}>{t.name}</b></div>
                        <span className="num" style={{ fontWeight:800 }}>৳{t.price.toLocaleString()}</span>
                      </div>
                      <Bar v={p} color={t.color} />
                      <div className="num" style={{ fontSize:11, color:'var(--ink-3)', marginTop:4 }}>{t.sold.toLocaleString()} / {t.total.toLocaleString()} sold</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* orders + gate scan */}
      <div className="grid" style={{ gridTemplateColumns:'1.6fr 1fr', alignItems:'start' }}>
        <div className="card" style={{ overflow:'hidden' }}>
          <div className="card-pad row" style={{ justifyContent:'space-between', paddingBottom:12 }}>
            <h3 style={{ fontSize:16 }}>Recent orders</h3>
            <span className="num badge neutral">{orders.length} total</span>
          </div>
          <table className="tbl">
            <thead><tr><th style={{ paddingLeft:'var(--pad)' }}>Order</th><th>Buyer</th><th>Tier</th><th className="c">Qty</th><th className="c">Amount</th><th>Pay</th><th className="r" style={{ paddingRight:'var(--pad)' }}>Status</th></tr></thead>
            <tbody>
              {orders.slice(0,8).map(o=>(
                <tr key={o.id}>
                  <td style={{ paddingLeft:'var(--pad)' }}><div className="num" style={{ fontWeight:700, fontSize:12.5 }}>{o.id}</div><div style={{ fontSize:11, color:'var(--ink-faint)' }}>{o.when}</div></td>
                  <td><div style={{ fontWeight:600, whiteSpace:'nowrap' }}>{o.buyer}</div><div style={{ fontSize:11, color:'var(--ink-3)', whiteSpace:'nowrap' }}>{o.match}</div></td>
                  <td style={{ color:'var(--ink-2)', whiteSpace:'nowrap' }}>{o.tier}</td>
                  <td className="c num">{o.qty}</td>
                  <td className="c num" style={{ fontWeight:700 }}>৳{o.amount.toLocaleString()}</td>
                  <td><span className="badge neutral">{o.method}</span></td>
                  <td className="r" style={{ paddingRight:'var(--pad)' }}>
                    <Badge kind={o.status==='Refunded'?'neg':o.gate==='checked-in'?'info':'pos'} dot>{o.status==='Refunded'?'Refunded':o.gate==='checked-in'?'Checked-in':'Confirmed'}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <GateScan tickets={tickets} />
      </div>

      <SeasonPassSection D={D} tickets={tickets} onBuy={null} />

      <SalesStatement D={D} orders={orders} />
    </div>
  );
}

/* Match-wise & ticket-type-wise sales statement */
function SalesStatement({ D, orders }) {
  const [view, setView] = React.useState('match');
  const [matchSel, setMatchSel] = React.useState('all');

  const tierTotalSold = D.ticketTiers.reduce((s, t) => s + t.sold, 0) || 1;
  const tierShare = (t) => t.sold / tierTotalSold;
  const avgPrice = D.ticketTiers.reduce((s, t) => s + t.price * tierShare(t), 0);

  const matchList = matchSel === 'all' ? D.ticketMatches : D.ticketMatches.filter(m => m.id === matchSel);

  // match-day check-in rate (nearest fixtures have started checking in) + live gate orders
  const CHECKIN_RATE = { f1:0.62, f2:0.34, f3:0.18, f4:0 };
  const checkedInOf = (m) => {
    const base = Math.round(m.sold * (CHECKIN_RATE[m.id] != null ? CHECKIN_RATE[m.id] : 0.1));
    const gate = orders.filter(o => o.matchId === m.id && o.gate === 'checked-in').reduce((s, o) => s + o.qty, 0);
    return Math.min(m.sold, base + gate);
  };

  const matchRows = matchList.map(m => {
    const ci = checkedInOf(m);
    return {
      name: `${m.home} v ${m.away}`, sub: `${m.comp} · ${m.date}`,
      qty: m.sold, amount: Math.round(m.sold * avgPrice), checkedIn: ci, remaining: m.sold - ci,
    };
  });
  // tier rows: scoped to the selected match (distribute that match's sold by tier share) or all
  const scopeSold = matchSel === 'all' ? null : (D.ticketMatches.find(m => m.id === matchSel) || {}).sold || 0;
  const tierRows = D.ticketTiers.map(t => {
    const qty = matchSel === 'all' ? t.sold : Math.round(scopeSold * tierShare(t));
    return { name: t.name, sub: `৳${t.price.toLocaleString()} each`, color: t.color, qty, amount: qty * t.price };
  });

  const rows = view === 'match' ? matchRows : tierRows;
  const totalQty = rows.reduce((s, r) => s + r.qty, 0);
  const totalAmt = rows.reduce((s, r) => s + r.amount, 0);
  const totalCheckedIn = matchRows.reduce((s, r) => s + r.checkedIn, 0);
  const totalRemaining = totalQty - totalCheckedIn;

  return (
    <div className="card" style={{ overflow:'hidden', marginTop:'var(--gap)' }}>
      <div className="card-pad row" style={{ justifyContent:'space-between', flexWrap:'wrap', gap:10, paddingBottom:12 }}>
        <div>
          <h3 style={{ fontSize:16 }}>Sales statement</h3>
          <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>Tickets sold & revenue · season 2025–26</div>
        </div>
        <div className="row" style={{ gap:10 }}>
          <select value={matchSel} onChange={e=>setMatchSel(e.target.value)} style={{ height:34, borderRadius:8, border:'1px solid var(--line-strong)', padding:'0 10px', background:'var(--surface)', color:'var(--ink)', fontFamily:'inherit', fontSize:12.5, maxWidth:220, cursor:'pointer' }}>
            <option value="all">All matches</option>
            {D.ticketMatches.map(m=><option key={m.id} value={m.id}>{m.home} v {m.away}</option>)}
          </select>
          <div className="row" style={{ gap:4, background:'var(--surface-3)', borderRadius:8, padding:3 }}>
            {[['match','By match','ball'],['tier','By ticket type','cards']].map(([k,label,ic])=>(
              <button key={k} onClick={()=>setView(k)} className="row" style={{ gap:6, height:30, padding:'0 12px', borderRadius:6, border:'none', whiteSpace:'nowrap', fontFamily:'inherit', fontSize:12.5, fontWeight:600, cursor:'pointer', background: view===k?'var(--surface)':'transparent', color: view===k?'var(--ink)':'var(--ink-3)', boxShadow: view===k?'var(--shadow-sm)':'none' }}>
                <Icon name={ic} size={14} />{label}
              </button>
            ))}
          </div>
          <button className="btn ghost sm" onClick={()=>toast('Sales statement exported to CSV')}><Icon name="dl" size={14} />Export</button>
        </div>
      </div>
      <table className="tbl">
        <thead><tr>
          <th style={{ paddingLeft:'var(--pad)' }}>{view==='match'?'Match':'Ticket type'}</th>
          <th className="r">Tickets sold</th>
          {view==='match' && <th className="r">Checked-in</th>}
          {view==='match' && <th className="r">Remaining</th>}
          {view==='tier' && <th className="r">Avg price</th>}
          <th className="r" style={{ paddingRight:'var(--pad)' }}>Amount (৳)</th>
        </tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td style={{ paddingLeft:'var(--pad)' }}>
                <div className="row" style={{ gap:9 }}>
                  {view==='tier' && <span style={{ width:11, height:11, borderRadius:3, background:r.color, flex:'none' }}></span>}
                  <div><div style={{ fontWeight:700, whiteSpace:'nowrap' }}>{r.name}</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>{r.sub}</div></div>
                </div>
              </td>
              <td className="r num" style={{ fontWeight:700 }}>{r.qty.toLocaleString()}</td>
              {view==='match' && <td className="r num" style={{ color:'var(--pos)', fontWeight:700 }}>{r.checkedIn.toLocaleString()}</td>}
              {view==='match' && <td className="r num" style={{ color: r.remaining>0?'var(--warn)':'var(--ink-3)', fontWeight:700 }}>{r.remaining.toLocaleString()}</td>}
              {view==='tier' && <td className="r num" style={{ color:'var(--ink-3)' }}>৳{r.qty?Math.round(r.amount/r.qty).toLocaleString():0}</td>}
              <td className="r num" style={{ paddingRight:'var(--pad)', fontWeight:800 }}>৳{r.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background:'var(--surface-2)' }}>
            <td style={{ paddingLeft:'var(--pad)', fontWeight:800 }}>Total</td>
            <td className="r num" style={{ fontWeight:800 }}>{totalQty.toLocaleString()}</td>
            {view==='match' && <td className="r num" style={{ fontWeight:800, color:'var(--pos)' }}>{totalCheckedIn.toLocaleString()}</td>}
            {view==='match' && <td className="r num" style={{ fontWeight:800, color:'var(--warn)' }}>{totalRemaining.toLocaleString()}</td>}
            {view==='tier' && <td className="r"></td>}
            <td className="r num" style={{ paddingRight:'var(--pad)', fontWeight:800, color:'var(--primary)' }}>৳{totalAmt.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      {/* match-day check-in summary */}
      <div className="card-pad" style={{ borderTop:'1px solid var(--line)' }}>
        <div className="row" style={{ justifyContent:'space-between', marginBottom:8 }}>
          <div className="eyebrow">Match-day check-in {matchSel==='all'?'· all matches':''}</div>
          <span className="num" style={{ fontSize:12.5, color:'var(--ink-3)' }}>{totalQty?Math.round(totalCheckedIn/totalQty*100):0}% admitted</span>
        </div>
        <div style={{ display:'flex', height:24, borderRadius:7, overflow:'hidden', background:'var(--surface-3)' }}>
          {totalCheckedIn>0 && <div title={'Checked-in: '+totalCheckedIn} style={{ width:(totalCheckedIn/(totalQty||1)*100)+'%', background:'var(--pos)', display:'grid', placeItems:'center', color:'#fff', fontSize:11, fontWeight:700 }}>{totalCheckedIn.toLocaleString()}</div>}
          {totalRemaining>0 && <div title={'Remaining: '+totalRemaining} style={{ width:(totalRemaining/(totalQty||1)*100)+'%', background:'var(--warn)', display:'grid', placeItems:'center', color:'#fff', fontSize:11, fontWeight:700 }}>{totalRemaining.toLocaleString()}</div>}
        </div>
        <div className="row" style={{ gap:18, marginTop:10 }}>
          <span className="row" style={{ gap:6, fontSize:12, color:'var(--ink-2)' }}><span style={{ width:10, height:10, borderRadius:3, background:'var(--pos)' }}></span>Checked-in <b className="num">{totalCheckedIn.toLocaleString()}</b></span>
          <span className="row" style={{ gap:6, fontSize:12, color:'var(--ink-2)' }}><span style={{ width:10, height:10, borderRadius:3, background:'var(--warn)' }}></span>Remaining (yet to arrive) <b className="num">{totalRemaining.toLocaleString()}</b></span>
        </div>
      </div>
    </div>
  );
}

/* Gate check-in / scan widget */
function GateScan({ tickets }) {
  const [code, setCode] = React.useState('');
  const [result, setResult] = React.useState(null);
  const pending = tickets.orders().filter(o => o.gate === 'pending' && o.status === 'Confirmed');

  const scan = (id) => {
    const o = tickets.orders().find(x => x.id.toLowerCase() === id.toLowerCase().trim());
    if (!o) { setResult({ ok:false, msg:'Ticket not found' }); return; }
    if (o.status === 'Refunded') { setResult({ ok:false, msg:'Ticket refunded — entry denied', o }); return; }
    if (o.gate === 'checked-in') { setResult({ ok:false, msg:'Already checked in', o }); return; }
    tickets.setGate(o.id, 'checked-in');
    setResult({ ok:true, msg:'Entry granted', o });
    toast(`<b>${o.id}</b> checked in — entry granted`);
  };

  return (
    <div className="card card-pad">
      <div className="row" style={{ gap:10, marginBottom:14 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:'var(--primary)', color:'#fff', display:'grid', placeItems:'center', flex:'none' }}><Icon name="ticket" size={18} /></div>
        <div><h3 style={{ fontSize:16 }}>Gate access control</h3><div style={{ fontSize:12, color:'var(--ink-3)' }}>Scan or enter ticket ID to verify</div></div>
      </div>
      <div className="row" style={{ gap:8 }}>
        <input value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==='Enter'&&scan(code)} placeholder="e.g. BFF-T0238"
          style={{ flex:1, height:40, borderRadius:9, border:'1px solid var(--line-strong)', padding:'0 12px', fontFamily:'inherit', fontSize:14, color:'var(--ink)', background:'var(--surface)', outline:'none' }} />
        <button className="btn sm" onClick={()=>scan(code)}><Icon name="check" size={15} />Verify</button>
      </div>
      {result && (
        <div className="fade-in" style={{ marginTop:12, padding:'12px 14px', borderRadius:10, background: result.ok?'color-mix(in srgb,var(--pos) 12%,transparent)':'color-mix(in srgb,var(--neg) 10%,transparent)', border:'1px solid '+(result.ok?'color-mix(in srgb,var(--pos) 30%,transparent)':'color-mix(in srgb,var(--neg) 30%,transparent)') }}>
          <div className="row" style={{ gap:10 }}>
            <Icon name={result.ok?'check':'bell'} size={18} color={result.ok?'var(--pos)':'var(--neg)'} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:14, color: result.ok?'var(--pos)':'var(--neg)' }}>{result.msg}</div>
              {result.o && <div style={{ fontSize:12, color:'var(--ink-2)', marginTop:2 }}>{result.o.buyer} · {result.o.tier} · {result.o.qty} ticket(s)</div>}
            </div>
          </div>
        </div>
      )}
      <div className="eyebrow" style={{ margin:'16px 0 8px' }}>Quick check-in · pending</div>
      <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:168, overflowY:'auto' }}>
        {pending.length===0 && <div style={{ fontSize:12.5, color:'var(--ink-faint)' }}>No pending tickets.</div>}
        {pending.slice(0,5).map(o=>(
          <div key={o.id} className="row" style={{ justifyContent:'space-between', gap:8, padding:'8px 10px', border:'1px solid var(--line)', borderRadius:8 }}>
            <div style={{ minWidth:0 }}><span className="num" style={{ fontWeight:700, fontSize:12.5 }}>{o.id}</span><div style={{ fontSize:11, color:'var(--ink-3)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{o.buyer} · {o.tier}</div></div>
            <button className="btn ghost sm" onClick={()=>scan(o.id)}>Check in</button>
          </div>
        ))}
      </div>
    </div>
  );
}
window.ETicketing = ETicketing;

function SeatMap({ tiers }) {
  // concentric stadium bowl: 4 rings = 4 tiers
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom:10 }}>Stadium map</div>
      <div style={{ aspectRatio:'1/1', position:'relative', display:'grid', placeItems:'center' }}>
        {tiers.map((t,i)=>{
          const size = 100 - i*20;
          const p = t.sold/t.total;
          return (
            <div key={t.name} style={{ position:'absolute', width:size+'%', height:size+'%', borderRadius:'50%', border:`3px solid ${t.color}`, background:`conic-gradient(${t.color} ${p*360}deg, color-mix(in srgb,${t.color} 14%, transparent) 0deg)`, opacity:0.92, display:'grid', placeItems:'center' }}></div>
          );
        })}
        <div style={{ position:'absolute', width:'14%', height:'10%', borderRadius:6, background:'#0a7d5b', boxShadow:'0 0 0 2px #fff' }} title="Pitch"></div>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10, justifyContent:'center' }}>
        {tiers.map(t=><span key={t.name} className="row" style={{ gap:5, fontSize:11, color:'var(--ink-3)' }}><span style={{ width:9, height:9, borderRadius:2, background:t.color }}></span>{t.name}</span>)}
      </div>
    </div>
  );
}

/* ===== Public portal (fan-facing storefront) ===== */
function PublicPortal({ D }) {
  const tickets = useTickets();
  const [buy, setBuy] = React.useState(null);   // match being purchased
  const [ticket, setTicket] = React.useState(null); // issued ticket (confirmation)
  const [pass, setPass] = React.useState(null); // season pass being purchased
  const [passRec, setPassRec] = React.useState(null); // issued pass
  const [sel, setSel] = React.useState(D.ticketMatches[0].id);
  const selM = D.ticketMatches.find(x => x.id === sel) || D.ticketMatches[0];
  const selPct = Math.round(selM.sold / selM.cap * 100);

  return (
    <div className="fade-in">
      {/* hero */}
      <div className="card" style={{ overflow:'hidden', marginBottom:'var(--gap)', background:'linear-gradient(120deg, var(--primary-deep), var(--primary))', color:'#fff', borderColor:'transparent' }}>
        <div className="card-pad row" style={{ justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div className="row" style={{ gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:13, background:'#ffffff1f', display:'grid', placeItems:'center', flex:'none' }}><Icon name="ticket" size={24} /></div>
            <div>
              <div className="eyebrow" style={{ color:'#ffffffcc' }}>BFF Official Ticketing</div>
              <div style={{ fontWeight:800, fontSize:20, marginTop:2 }}>Buy match tickets online</div>
              <div style={{ fontSize:13, opacity:.9, marginTop:3 }}>Secure your seat in seconds · pay with bKash, Nagad, Rocket or card · QR e-ticket to your phone.</div>
            </div>
          </div>
          <div className="row" style={{ gap:8 }}>
            {D.paymentMethods.map(pm=>(
              <span key={pm.id} className="badge" style={{ background:'#ffffff22', color:'#fff' }}>{pm.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* match storefront: list + selected detail */}
      <div className="row" style={{ justifyContent:'space-between', marginBottom:14 }}>
        <h3 style={{ fontSize:17 }}>Upcoming matches</h3>
        <span className="num" style={{ fontSize:12.5, color:'var(--ink-3)' }}>{D.ticketMatches.length} on sale</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns:'330px 1fr', alignItems:'start' }}>
        {/* match list */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {D.ticketMatches.map(x=>{
            const p = Math.round(x.sold/x.cap*100);
            const left = x.cap - x.sold;
            const on = sel===x.id;
            return (
              <div key={x.id} className="card card-pad" style={{ cursor:'pointer', borderColor: on?'var(--primary)':'var(--line)', boxShadow: on?'var(--shadow-md)':'var(--shadow-sm)' }} onClick={()=>setSel(x.id)}>
                <div className="row" style={{ justifyContent:'space-between' }}>
                  <div style={{ fontWeight:700, fontSize:13.5, minWidth:0, flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.5 }}><Flag e={x.hf} size={17} /> {x.home.replace(' Kings','').replace(' Limited','')} <span style={{ color:'var(--ink-faint)', fontWeight:400 }}>v</span> {x.away} <Flag e={x.af} size={17} /></div>
                  <span className="num badge neutral">{x.date}</span>
                </div>
                <div style={{ fontSize:11.5, color:'var(--ink-3)', margin:'6px 0 9px' }}>{x.comp} · {x.venue}</div>
                <Bar v={p} color={p>85?'var(--bff-red)':'var(--primary)'} />
                <div className="row" style={{ justifyContent:'space-between', marginTop:5 }}>
                  <span className="num" style={{ fontSize:11, color: left<2000?'var(--bff-red)':'var(--ink-3)' }}>{left<2000?`Only ${left.toLocaleString()} left`:`${left.toLocaleString()} available`}</span>
                  <span className="num" style={{ fontSize:11, fontWeight:700, color:p>85?'var(--bff-red)':'var(--primary)' }}>{p}% sold</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* selected match detail: stadium map + price tiers */}
        <div className="card card-pad">
          <div className="row" style={{ justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
            <div><h3 style={{ fontSize:18 }}>{selM.home} v {selM.away}</h3><div style={{ fontSize:12.5, color:'var(--ink-3)', marginTop:2 }}><Icon name="pin" size={13} style={{ verticalAlign:-2 }} /> {selM.venue} · {selM.date} · {selM.time}</div></div>
            <div style={{ textAlign:'right' }}><div className="num" style={{ fontWeight:800, fontSize:24, color: selPct>85?'var(--bff-red)':'var(--primary)' }}>{selPct}%</div><div style={{ fontSize:11, color:'var(--ink-faint)' }}>CAPACITY SOLD</div></div>
          </div>
          <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <SeatMap tiers={D.ticketTiers} />
            <div style={{ display:'flex', flexDirection:'column' }}>
              <div className="eyebrow" style={{ marginBottom:10 }}>Price tiers</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, flex:1 }}>
                {D.ticketTiers.map(t=>{
                  const p = Math.round(t.sold/t.total*100);
                  return (
                    <div key={t.name} style={{ padding:'11px 13px', border:'1px solid var(--line)', borderRadius:10 }}>
                      <div className="row" style={{ justifyContent:'space-between', marginBottom:7 }}>
                        <div className="row" style={{ gap:8 }}><span style={{ width:11, height:11, borderRadius:3, background:t.color }}></span><b style={{ fontSize:13.5 }}>{t.name}</b></div>
                        <span className="num" style={{ fontWeight:800 }}>৳{t.price.toLocaleString()}</span>
                      </div>
                      <Bar v={p} color={t.color} />
                      <div className="num" style={{ fontSize:11, color:'var(--ink-3)', marginTop:4 }}>{(t.total-t.sold).toLocaleString()} of {t.total.toLocaleString()} available</div>
                    </div>
                  );
                })}
              </div>
              <button className="btn" style={{ width:'100%', marginTop:14 }} disabled={selM.cap-selM.sold<=0} onClick={()=>setBuy(selM)}>
                <Icon name="ticket" size={15} /> {selM.cap-selM.sold<=0?'Sold out':'Buy tickets'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {buy && <PurchaseModal D={D} match={buy} tickets={tickets} onClose={()=>setBuy(null)} onDone={(t)=>{ setBuy(null); setTicket(t); }} />}
      {ticket && <TicketConfirmation ticket={ticket} onClose={()=>setTicket(null)} />}
      <SeasonPassSection D={D} tickets={tickets} onBuy={(p)=>setPass(p)} />
      {pass && <PassPurchaseModal D={D} pass={pass} tickets={tickets} onClose={()=>setPass(null)} onDone={(r)=>{ setPass(null); setPassRec(r); }} />}
      {passRec && <PassConfirmation rec={passRec} onClose={()=>setPassRec(null)} />}
    </div>
  );
}

/* Multi-step purchase flow */
function PurchaseModal({ D, match, tickets, onClose, onDone }) {
  const [step, setStep] = React.useState(1);
  const [tier, setTier] = React.useState(D.ticketTiers[1].name);
  const [qty, setQty] = React.useState(2);
  const [info, setInfo] = React.useState({ name:'', phone:'', email:'' });
  const [pay, setPay] = React.useState('bkash');
  const tierObj = D.ticketTiers.find(t=>t.name===tier);
  const fee = 20;
  const total = tierObj.price * qty + fee;
  const payObj = D.paymentMethods.find(p=>p.id===pay);

  const next = () => {
    if (step===2 && !info.name.trim()) { toast('Enter your name', 'muted'); return; }
    if (step===2 && !/^[0-9+\-\s]{6,}$/.test(info.phone)) { toast('Enter a valid phone number', 'muted'); return; }
    setStep(step+1);
  };
  const payNow = async () => {
    const ok = await confirmAction({
      title:'Confirm payment?',
      message:<>Pay <b>৳{total.toLocaleString()}</b> via <b>{payObj.name}</b> for {qty} × {tier}?</>,
      detail:`${match.home} v ${match.away} · ${match.date}`,
      confirmLabel:`Pay ৳${total.toLocaleString()}`, icon:'check',
    });
    if (!ok) return;
    const rec = tickets.purchase({ matchId:match.id, match:`${match.home} v ${match.away}`, buyer:info.name, phone:info.phone, tier, qty, amount: tierObj.price*qty, method: payObj.name, venue:match.venue, date:match.date, time:match.time, hf:match.hf, af:match.af, total });
    onDone(rec);
  };

  const steps = [[1,'Tickets'],[2,'Details'],[3,'Payment']];
  const inp = { height:40, borderRadius:9, border:'1px solid var(--line-strong)', padding:'0 12px', fontFamily:'inherit', fontSize:14, color:'var(--ink)', background:'var(--surface)', outline:'none', width:'100%' };

  return (
    <Modal title={`${match.home} v ${match.away}`} subtitle={`${match.venue} · ${match.date} · ${match.time}`} width={620} onClose={onClose}
      footer={<>
        <div style={{ flex:1 }}><span style={{ fontSize:12, color:'var(--ink-3)' }}>Total</span> <b className="num" style={{ fontSize:17 }}>৳{total.toLocaleString()}</b></div>
        {step>1 && <button className="btn ghost sm" onClick={()=>setStep(step-1)}>Back</button>}
        {step<3 ? <button className="btn sm" onClick={next}>Continue<Icon name="chev" size={14} /></button>
          : <button className="btn sm" onClick={payNow}><Icon name="ticket" size={15} />Pay ৳{total.toLocaleString()}</button>}
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
        <div>
          <div className="eyebrow" style={{ marginBottom:10 }}>Select your stand</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {D.ticketTiers.map(t=>{
              const left = t.total - t.sold;
              const on = tier===t.name;
              return (
                <button key={t.name} onClick={()=>setTier(t.name)} disabled={left<=0} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 14px', borderRadius:11, cursor:left<=0?'not-allowed':'pointer', textAlign:'left', background: on?'color-mix(in srgb,var(--primary) 8%,transparent)':'var(--surface)', border:'2px solid '+(on?'var(--primary)':'var(--line)'), opacity:left<=0?0.5:1, fontFamily:'inherit' }}>
                  <span style={{ width:14, height:14, borderRadius:4, background:t.color, flex:'none' }}></span>
                  <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14 }}>{t.name}</div><div className="num" style={{ fontSize:11.5, color:'var(--ink-3)' }}>{left.toLocaleString()} seats left</div></div>
                  <span className="num" style={{ fontWeight:800, fontSize:16 }}>৳{t.price.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
          <div className="row" style={{ justifyContent:'space-between', marginTop:18, padding:'12px 14px', background:'var(--surface-2)', borderRadius:11 }}>
            <div><div style={{ fontWeight:700, fontSize:14 }}>Quantity</div><div style={{ fontSize:11.5, color:'var(--ink-3)' }}>Max 6 per order</div></div>
            <div className="row" style={{ gap:12 }}>
              <button className="icon-btn" onClick={()=>setQty(Math.max(1,qty-1))} style={{ width:36, height:36 }}><span style={{ fontSize:20, lineHeight:1 }}>−</span></button>
              <span className="num" style={{ fontWeight:800, fontSize:20, width:24, textAlign:'center' }}>{qty}</span>
              <button className="icon-btn" onClick={()=>setQty(Math.min(6,qty+1))} style={{ width:36, height:36 }}><span style={{ fontSize:18, lineHeight:1 }}>+</span></button>
            </div>
          </div>
        </div>
      )}

      {step===2 && (
        <div className="form-grid">
          <Field label="Full name" span><input style={inp} value={info.name} onChange={e=>setInfo({...info,name:e.target.value})} placeholder="Name on the ticket" autoFocus /></Field>
          <Field label="Mobile number"><input style={inp} value={info.phone} onChange={e=>setInfo({...info,phone:e.target.value})} inputMode="tel" placeholder="+880 1XXX-XXXXXX" /></Field>
          <Field label="Email (optional)"><input style={inp} value={info.email} onChange={e=>setInfo({...info,email:e.target.value})} inputMode="email" placeholder="you@email.com" /></Field>
          <div style={{ gridColumn:'1 / -1', padding:'12px 14px', background:'var(--surface-2)', borderRadius:11, fontSize:12.5, color:'var(--ink-2)' }}>
            <Icon name="ticket" size={14} style={{ verticalAlign:-2 }} /> Your QR e-ticket will be sent to this mobile number.
          </div>
        </div>
      )}

      {step===3 && (
        <div>
          <div className="eyebrow" style={{ marginBottom:10 }}>Choose payment method</div>
          <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {D.paymentMethods.map(pm=>{
              const on = pay===pm.id;
              return (
                <button key={pm.id} onClick={()=>setPay(pm.id)} style={{ display:'flex', alignItems:'center', gap:11, padding:'13px', borderRadius:11, cursor:'pointer', textAlign:'left', background:'var(--surface)', border:'2px solid '+(on?pm.color:'var(--line)'), fontFamily:'inherit' }}>
                  <div style={{ width:38, height:38, borderRadius:9, background:pm.color, color:'#fff', display:'grid', placeItems:'center', fontFamily:'var(--ff-display)', fontWeight:800, fontSize:13, flex:'none' }}>{pm.name[0]}</div>
                  <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{pm.name}</div><div style={{ fontSize:11, color:'var(--ink-3)' }}>{pm.kind}</div></div>
                  {on && <Icon name="check" size={16} color={pm.color} />}
                </button>
              );
            })}
          </div>
          {/* order summary */}
          <div style={{ padding:'14px', background:'var(--surface-2)', borderRadius:12 }}>
            <div className="eyebrow" style={{ marginBottom:10 }}>Order summary</div>
            {[[`${tier} × ${qty}`, '৳'+(tierObj.price*qty).toLocaleString()], ['Service fee', '৳'+fee], ['Payment via', payObj.name]].map(([k,v],i)=>(
              <div key={i} className="row" style={{ justifyContent:'space-between', padding:'5px 0', fontSize:13 }}><span style={{ color:'var(--ink-3)' }}>{k}</span><b className="num">{v}</b></div>
            ))}
            <hr className="divider" style={{ margin:'9px 0' }} />
            <div className="row" style={{ justifyContent:'space-between' }}><b style={{ fontSize:14 }}>Total payable</b><b className="num" style={{ fontSize:18, color:'var(--primary)' }}>৳{total.toLocaleString()}</b></div>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ===== Season Pass ===== */
function PassPurchaseModal({ D, pass, tickets, onClose, onDone }) {
  const [step, setStep] = React.useState(1);
  const [qty, setQty] = React.useState(1);
  const [info, setInfo] = React.useState({ name:'', phone:'', email:'' });
  const [pay, setPay] = React.useState('bkash');
  const fee = 50;
  const total = pass.price * qty + fee;
  const payObj = D.paymentMethods.find(p=>p.id===pay);
  const left = pass.total - pass.sold;
  const inp = { height:40, borderRadius:9, border:'1px solid var(--line-strong)', padding:'0 12px', fontFamily:'inherit', fontSize:14, color:'var(--ink)', background:'var(--surface)', outline:'none', width:'100%' };

  const next = () => {
    if (step===1 && !info.name.trim()) { toast('Enter your name', 'muted'); return; }
    if (step===1 && !/^[0-9+\-\s]{6,}$/.test(info.phone)) { toast('Enter a valid phone number', 'muted'); return; }
    setStep(step+1);
  };
  const payNow = async () => {
    const ok = await confirmAction({
      title:'Confirm season pass?',
      message:<>Pay <b>৳{total.toLocaleString()}</b> via <b>{payObj.name}</b> for {qty} × {pass.name}?</>,
      detail:`${pass.matches} matches · ${pass.tier} · saves ৳${(pass.save*qty).toLocaleString()} vs single tickets`,
      confirmLabel:`Pay ৳${total.toLocaleString()}`, icon:'check',
    });
    if (!ok) return;
    const rec = tickets.buyPass({ passId:pass.id, pass:pass.name, team:pass.team, buyer:info.name, phone:info.phone, qty, tier:pass.tier, matches:pass.matches, amount:pass.price*qty, method:payObj.name, total, color:pass.color, scope:pass.scope });
    onDone(rec);
  };

  return (
    <Modal title={pass.name} subtitle={`${pass.comp} · ${pass.matches} matches`} width={620} onClose={onClose}
      footer={<>
        <div style={{ flex:1 }}><span style={{ fontSize:12, color:'var(--ink-3)' }}>Total</span> <b className="num" style={{ fontSize:17 }}>৳{total.toLocaleString()}</b></div>
        {step>1 && <button className="btn ghost sm" onClick={()=>setStep(step-1)}>Back</button>}
        {step<2 ? <button className="btn sm" onClick={next}>Continue<Icon name="chev" size={14} /></button>
          : <button className="btn sm" onClick={payNow}><Icon name="ticket" size={15} />Pay ৳{total.toLocaleString()}</button>}
      </>}>
      {step===1 && (
        <div>
          <div style={{ padding:'14px 16px', borderRadius:12, background:'color-mix(in srgb,'+pass.color+' 9%,transparent)', border:'1px solid color-mix(in srgb,'+pass.color+' 30%,transparent)', marginBottom:18 }}>
            <div className="row" style={{ justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
              <div className="row" style={{ gap:8 }}><span style={{ width:12, height:12, borderRadius:4, background:pass.color }}></span><b style={{ fontSize:14 }}>{pass.tier} · {pass.matches} matches</b></div>
              <span className="num badge pos">Save ৳{pass.save.toLocaleString()}</span>
            </div>
            <div style={{ fontSize:12.5, color:'var(--ink-2)', marginTop:8 }}>{pass.scope}</div>
            <ul style={{ margin:'12px 0 0', padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:7 }}>
              {pass.perks.map((pk,i)=>(<li key={i} className="row" style={{ gap:9, fontSize:12.5, color:'var(--ink-2)' }}><Icon name="check" size={14} color={pass.color} /> {pk}</li>))}
            </ul>
          </div>
          <div className="form-grid">
            <Field label="Full name" span><input style={inp} value={info.name} onChange={e=>setInfo({...info,name:e.target.value})} placeholder="Name on the pass" autoFocus /></Field>
            <Field label="Mobile number"><input style={inp} value={info.phone} onChange={e=>setInfo({...info,phone:e.target.value})} inputMode="tel" placeholder="+880 1XXX-XXXXXX" /></Field>
            <Field label="Email (optional)"><input style={inp} value={info.email} onChange={e=>setInfo({...info,email:e.target.value})} inputMode="email" placeholder="you@email.com" /></Field>
          </div>
          <div className="row" style={{ justifyContent:'space-between', marginTop:16, padding:'12px 14px', background:'var(--surface-2)', borderRadius:11 }}>
            <div><div style={{ fontWeight:700, fontSize:14 }}>Passes</div><div className="num" style={{ fontSize:11.5, color: left<100?'var(--bff-red)':'var(--ink-3)' }}>{left.toLocaleString()} of {pass.total.toLocaleString()} remaining</div></div>
            <div className="row" style={{ gap:12 }}>
              <button className="icon-btn" onClick={()=>setQty(Math.max(1,qty-1))} style={{ width:36, height:36 }}><span style={{ fontSize:20, lineHeight:1 }}>−</span></button>
              <span className="num" style={{ fontWeight:800, fontSize:20, width:24, textAlign:'center' }}>{qty}</span>
              <button className="icon-btn" onClick={()=>setQty(Math.min(4,qty+1))} style={{ width:36, height:36 }}><span style={{ fontSize:18, lineHeight:1 }}>+</span></button>
            </div>
          </div>
        </div>
      )}
      {step===2 && (
        <div>
          <div className="eyebrow" style={{ marginBottom:10 }}>Choose payment method</div>
          <div className="grid" style={{ gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {D.paymentMethods.map(pm=>{
              const on = pay===pm.id;
              return (
                <button key={pm.id} onClick={()=>setPay(pm.id)} style={{ display:'flex', alignItems:'center', gap:11, padding:'13px', borderRadius:11, cursor:'pointer', textAlign:'left', background:'var(--surface)', border:'2px solid '+(on?pm.color:'var(--line)'), fontFamily:'inherit' }}>
                  <div style={{ width:38, height:38, borderRadius:9, background:pm.color, color:'#fff', display:'grid', placeItems:'center', fontFamily:'var(--ff-display)', fontWeight:800, fontSize:13, flex:'none' }}>{pm.name[0]}</div>
                  <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:700, fontSize:13.5 }}>{pm.name}</div><div style={{ fontSize:11, color:'var(--ink-3)' }}>{pm.kind}</div></div>
                  {on && <Icon name="check" size={16} color={pm.color} />}
                </button>
              );
            })}
          </div>
          <div style={{ padding:'14px', background:'var(--surface-2)', borderRadius:12 }}>
            <div className="eyebrow" style={{ marginBottom:10 }}>Order summary</div>
            {[[`${pass.name} × ${qty}`, '৳'+(pass.price*qty).toLocaleString()], ['Processing fee', '৳'+fee], ['You save', '৳'+(pass.save*qty).toLocaleString()], ['Payment via', payObj.name]].map(([k,v],i)=>(
              <div key={i} className="row" style={{ justifyContent:'space-between', padding:'5px 0', fontSize:13 }}><span style={{ color:'var(--ink-3)' }}>{k}</span><b className="num" style={i===2?{ color:'var(--pos)' }:{}}>{v}</b></div>
            ))}
            <hr className="divider" style={{ margin:'9px 0' }} />
            <div className="row" style={{ justifyContent:'space-between' }}><b style={{ fontSize:14 }}>Total payable</b><b className="num" style={{ fontSize:18, color:'var(--primary)' }}>৳{total.toLocaleString()}</b></div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function PassConfirmation({ rec, onClose }) {
  return (
    <Modal title="Season pass confirmed" subtitle="Your membership is active" width={460} onClose={onClose}
      footer={<><button className="btn ghost sm" onClick={()=>toast('Pass sent to '+(rec.phone||'your phone'))}><Icon name="ticket" size={14} />Send to phone</button><button className="btn sm" onClick={onClose}><Icon name="check" size={15} />Done</button></>}>
      <div className="card" style={{ overflow:'hidden', boxShadow:'var(--shadow-md)' }}>
        <div style={{ background:'linear-gradient(120deg,'+rec.color+', color-mix(in srgb,'+rec.color+' 60%, #000))', color:'#fff', padding:'16px 18px' }}>
          <div className="row" style={{ justifyContent:'space-between' }}>
            <div className="eyebrow" style={{ color:'#ffffffcc' }}>BFF Season Pass</div>
            <span className="badge" style={{ background:'#ffffff22', color:'#fff' }}>{rec.tier}</span>
          </div>
          <div style={{ fontWeight:800, fontSize:17, marginTop:6, lineHeight:1.2 }}>{rec.pass}</div>
          <div style={{ fontSize:12.5, opacity:.9, marginTop:4 }}>{rec.scope}</div>
        </div>
        <div className="row" style={{ gap:16, padding:'16px 18px', alignItems:'center' }}>
          <div className="ticket-qr" style={{ flex:'none' }}><QR value={rec.id} size={86} /></div>
          <div style={{ flex:1, minWidth:0 }}>
            {[['Pass ID', rec.id],['Member', rec.buyer],['Matches', rec.matches+' included'],['Paid', '৳'+rec.total.toLocaleString()+' · '+rec.method]].map(([k,v])=>(
              <div key={k} className="row" style={{ justifyContent:'space-between', padding:'4px 0', fontSize:12.5 }}><span style={{ color:'var(--ink-faint)' }}>{k}</span><b className="num" style={{ maxWidth:160, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{v}</b></div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ fontSize:11.5, color:'var(--ink-faint)', marginTop:12, textAlign:'center' }}>Show this QR at any fast-lane gate for every covered match this season.</div>
    </Modal>
  );
}

function SeasonPassSection({ D, tickets, onBuy }) {
  return (
    <div style={{ marginTop:'calc(var(--gap) * 1.4)' }}>
      <div className="row" style={{ justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:8 }}>
        <div>
          <h3 style={{ fontSize:17 }}>Season passes</h3>
          <div style={{ fontSize:12.5, color:'var(--ink-3)', marginTop:2 }}>One pass, every home match — reserved seat, fast-lane entry and member perks.</div>
        </div>
        <span className="num" style={{ fontSize:12.5, color:'var(--ink-3)' }}>{D.seasonPasses.length} memberships</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns:'repeat(2, 1fr)' }}>
        {D.seasonPasses.map(p=>{
          const left = p.total - p.sold;
          const pct = Math.round(p.sold/p.total*100);
          const single = p.price + p.save;
          return (
            <div key={p.id} className="card" style={{ overflow:'hidden', display:'flex', flexDirection:'column', position:'relative', borderColor: p.popular?p.color:'var(--line)' }}>
              {p.popular && <div style={{ position:'absolute', top:14, right:-30, transform:'rotate(45deg)', background:p.color, color:'#fff', fontSize:10, fontWeight:800, letterSpacing:'.08em', padding:'3px 36px' }}>POPULAR</div>}
              <div style={{ padding:'16px 18px 14px', borderBottom:'1px solid var(--line)' }}>
                <div className="row" style={{ gap:11 }}>
                  <div style={{ width:42, height:42, borderRadius:11, background:'color-mix(in srgb,'+p.color+' 16%,transparent)', color:p.color, display:'grid', placeItems:'center', flex:'none' }}><Icon name="ticket" size={21} /></div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:800, fontSize:15, lineHeight:1.2 }}>{p.name}</div>
                    <div style={{ fontSize:11.5, color:'var(--ink-3)', marginTop:3 }}>{p.comp}</div>
                  </div>
                </div>
                <div className="row" style={{ gap:7, marginTop:12, flexWrap:'wrap' }}>
                  <span className="chip" style={{ height:24, fontSize:11.5 }}><Icon name="cal" size={12} /> {p.matches} matches</span>
                  <span className="chip" style={{ height:24, fontSize:11.5 }}><span style={{ width:9, height:9, borderRadius:3, background:p.color, display:'inline-block', marginRight:5 }}></span>{p.tier}</span>
                  <span className="badge pos">Save ৳{p.save.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ padding:'14px 18px', flex:1, display:'flex', flexDirection:'column' }}>
                <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:7, flex:1 }}>
                  {p.perks.map((pk,i)=>(<li key={i} className="row" style={{ gap:9, fontSize:12.5, color:'var(--ink-2)' }}><Icon name="check" size={14} color={p.color} /> <span>{pk}</span></li>))}
                </ul>
                <div className="row" style={{ justifyContent:'space-between', alignItems:'flex-end', marginTop:14 }}>
                  <div>
                    <div className="row" style={{ gap:8, alignItems:'baseline' }}>
                      <span className="num" style={{ fontWeight:800, fontSize:24 }}>৳{p.price.toLocaleString()}</span>
                      <span className="num" style={{ fontSize:12.5, color:'var(--ink-faint)', textDecoration:'line-through' }}>৳{single.toLocaleString()}</span>
                    </div>
                    <div className="num" style={{ fontSize:11, color: left<100?'var(--bff-red)':'var(--ink-3)', marginTop:3 }}>{left<100?`Only ${left} left`:`${left.toLocaleString()} of ${p.total.toLocaleString()} left`} · {pct}% sold</div>
                  </div>
                  {onBuy && <button className="btn sm" style={{ background:p.color }} disabled={left<=0} onClick={()=>onBuy(p)}><Icon name="ticket" size={15} />{left<=0?'Sold out':'Buy pass'}</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Reusable ticket stub */
function TicketStub({ ticket, qrSize = 96, className }) {
  return (
    <div className={'card' + (className ? ' ' + className : '')} style={{ overflow:'hidden', boxShadow:'var(--shadow-md)' }}>
      <div style={{ background:'linear-gradient(120deg, var(--primary-deep), var(--primary))', color:'#fff', padding:'14px 16px' }}>
        <div className="eyebrow" style={{ color:'#ffffffcc' }}>BFF E-Ticket</div>
        <div className="row" style={{ justifyContent:'center', gap:14, alignItems:'center', margin:'8px 0 4px' }}>
          <div style={{ textAlign:'center' }}><Flag e={ticket.hf} size={28} /></div>
          <div className="num" style={{ fontWeight:800 }}>VS</div>
          <div style={{ textAlign:'center' }}><Flag e={ticket.af} size={28} /></div>
        </div>
        <div style={{ textAlign:'center', fontWeight:700, fontSize:14 }}>{ticket.match}</div>
      </div>
      <div className="row" style={{ gap:14, padding:'16px', alignItems:'center' }}>
        <div className="ticket-qr" style={{ flex:'none' }}><QR seed={ticket.id} size={qrSize} /></div>
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:7 }}>
          {[['Holder',ticket.buyer],['Stand',ticket.tier],['Tickets',ticket.qty],['Date',`${ticket.date} · ${ticket.time}`],['Order',ticket.id]].map(([k,v])=>(
            <div key={k}><div style={{ fontSize:10.5, color:'var(--ink-faint)', textTransform:'uppercase', letterSpacing:'.05em' }}>{k}</div><div style={{ fontWeight:700, fontSize:13 }}>{v}</div></div>
          ))}
        </div>
      </div>
      <div style={{ padding:'10px 16px', borderTop:'1px dashed var(--line-strong)', fontSize:11.5, color:'var(--ink-3)', textAlign:'center' }}>
        <Icon name="pin" size={12} style={{ verticalAlign:-2 }} /> {ticket.venue} · Show this QR at the gate
      </div>
    </div>
  );
}

/* Issued e-ticket with QR */
function TicketConfirmation({ ticket, onClose }) {
  const [preview, setPreview] = React.useState(false);
  return (
    <Modal title="Payment successful" subtitle="Your e-ticket is ready" width={460} onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={()=>setPreview(true)}><Icon name="cards" size={14} />Preview</button>
        <button className="btn ghost sm" onClick={()=>{ downloadTicketPNG(ticket); toast('E-ticket PNG downloaded'); }}><Icon name="dl" size={14} />PNG</button>
        <button className="btn ghost sm" onClick={()=>{ downloadTicketPDF(ticket); toast('E-ticket PDF downloaded'); }}><Icon name="dl" size={14} />PDF</button>
        <button className="btn sm" onClick={onClose}><Icon name="check" size={15} />Done</button>
      </>}>
      <div style={{ textAlign:'center', marginBottom:14 }}>
        <div style={{ width:54, height:54, borderRadius:'50%', background:'color-mix(in srgb,var(--pos) 15%,transparent)', color:'var(--pos)', display:'grid', placeItems:'center', margin:'0 auto 10px' }}><Icon name="check" size={28} /></div>
        <div style={{ fontWeight:800, fontSize:16 }}>৳{ticket.total.toLocaleString()} paid via {ticket.method}</div>
        <div style={{ fontSize:12.5, color:'var(--ink-3)' }}>Order {ticket.id}</div>
      </div>
      <TicketStub ticket={ticket} />
      {preview && <TicketPrintPreview ticket={ticket} onClose={()=>setPreview(false)} />}
    </Modal>
  );
}

/* Print preview overlay with print + download */
function TicketPrintPreview({ ticket, onClose }) {
  React.useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="modal-overlay" onMouseDown={onClose} style={{ zIndex:1100 }}>
      <div onMouseDown={e=>e.stopPropagation()} style={{ width:'100%', maxWidth:420 }}>
        <div className="ticket-print-area" style={{ background:'#fff', borderRadius:'var(--r-xl)', overflow:'hidden', boxShadow:'var(--shadow-lg)' }}>
          <div style={{ padding:'18px 20px 4px', textAlign:'center' }}>
            <div className="eyebrow" style={{ color:'var(--ink-3)' }}>Print preview</div>
          </div>
          <div style={{ padding:'10px 20px 20px' }}>
            <TicketStub ticket={ticket} qrSize={120} />
            <div style={{ fontSize:11, color:'var(--ink-faint)', textAlign:'center', marginTop:12 }}>This e-ticket admits {ticket.qty} · non-transferable · keep your QR private.</div>
          </div>
        </div>
        <div className="no-print row" style={{ gap:10, justifyContent:'center', marginTop:14, flexWrap:'wrap' }}>
          <button className="btn ghost sm" style={{ background:'var(--surface)' }} onClick={onClose}>Close</button>
          <button className="btn ghost sm" style={{ background:'var(--surface)' }} onClick={()=>{ downloadTicketPNG(ticket); toast('E-ticket PNG downloaded'); }}><Icon name="dl" size={14} />PNG</button>
          <button className="btn ghost sm" style={{ background:'var(--surface)' }} onClick={()=>{ downloadTicketPDF(ticket); toast('E-ticket PDF downloaded'); }}><Icon name="dl" size={14} />PDF</button>
          <button className="btn sm" onClick={()=>window.print()}><Icon name="cards" size={15} />Print</button>
        </div>
      </div>
    </div>
  );
}
window.PublicPortal = PublicPortal;
window.ETicketing = ETicketing;

