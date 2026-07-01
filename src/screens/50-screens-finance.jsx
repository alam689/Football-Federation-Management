/* Finance & Revenue module — consolidated income across all federation revenue
   streams, contract/receivable management, and grant/funding tracking.
   Modelled on "Football Federation Potential Revenue Sources" (14 streams +
   suggested ERP finance structure). Frontend-only: contracts live in
   window.DATA.financeContracts and create/edit/delete mutate that in-memory
   list, mirroring the SponsorStore pattern. Amounts are BDT crore (৳Cr). */
import '../lib/registry.js';
import React from 'react';

const { useState } = React;
const { Icon, PageHead, Stat, Badge, Bar, Spark, Ring, Modal, Field, TextInput, SelectInput, toast, confirmAction, AuthStore } = window;

/* ---- shared helpers ---- */
// Store values in crore; show Cr at ≥1, else lakh (1Cr = 100L).
const fmtCr = (cr) => {
  const n = Number(cr) || 0;
  return n >= 1 ? '৳' + n.toFixed(1) + 'Cr' : '৳' + Math.round(n * 100) + 'L';
};
const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);
const selStyle = { height: 38, borderRadius: 10, border: '1px solid var(--line)', padding: '0 12px', background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13.5 };

const GROUPS = {
  'Commercial': '#2c5f92',
  'Matchday': '#0f766e',
  'Grants & Funding': '#7c3aed',
  'Regulatory': '#c98a1f',
  'Development': '#2563eb',
  'Other': '#64748b',
};
const groupColor = (g) => GROUPS[g] || 'var(--ink-3)';

/* The 14 potential revenue streams (FY 2025–26, YTD figures in ৳Cr). */
const SEED_STREAMS = [
  { id: 'sponsor',    name: 'Sponsorship & Commercial',        icon: 'tag',      group: 'Commercial',        ytd: 33.2, budget: 34.0, ly: 28.6, outstanding: 5.4 },
  { id: 'fifa',       name: 'FIFA, AFC & International Grants', icon: 'globe',    group: 'Grants & Funding',  ytd: 22.0, budget: 22.0, ly: 19.5, outstanding: 4.0 },
  { id: 'broadcast',  name: 'Broadcasting & Media Rights',     icon: 'ball',     group: 'Commercial',        ytd: 18.5, budget: 20.0, ly: 15.2, outstanding: 3.2 },
  { id: 'govt',       name: 'Government Grants & Public Funding', icon: 'bank',   group: 'Grants & Funding',  ytd: 14.5, budget: 16.0, ly: 12.0, outstanding: 2.5 },
  { id: 'matchday',   name: 'Tournament, Matchday & Event',    icon: 'ticket',   group: 'Matchday',          ytd: 9.8,  budget: 11.0, ly: 8.1,  outstanding: 0.6 },
  { id: 'merch',      name: 'Merchandising & Licensing',       icon: 'award',    group: 'Commercial',        ytd: 4.4,  budget: 5.0,  ly: 3.6,  outstanding: 0.5 },
  { id: 'investment', name: 'Investment & Other Income',       icon: 'coin',     group: 'Other',             ytd: 3.7,  budget: 3.5,  ly: 3.3,  outstanding: 0.0 },
  { id: 'membership', name: 'Membership & Affiliation Fees',   icon: 'users',    group: 'Regulatory',        ytd: 3.2,  budget: 3.5,  ly: 2.9,  outstanding: 0.4 },
  { id: 'licensing',  name: 'Player Registration & Transfers', icon: 'user',     group: 'Regulatory',        ytd: 2.6,  budget: 2.8,  ly: 2.2,  outstanding: 0.3 },
  { id: 'digital',    name: 'Digital & New Media',             icon: 'pie',      group: 'Development',       ytd: 2.3,  budget: 2.5,  ly: 1.4,  outstanding: 0.1 },
  { id: 'rental',     name: 'Stadium & Facility Rental',       icon: 'building', group: 'Matchday',          ytd: 2.1,  budget: 2.4,  ly: 1.8,  outstanding: 0.3 },
  { id: 'education',  name: 'Coaching, Referee & Education',   icon: 'cap',      group: 'Development',       ytd: 1.9,  budget: 2.2,  ly: 1.5,  outstanding: 0.2 },
  { id: 'donation',   name: 'Donations, Fundraising & CSR',    icon: 'gift',     group: 'Grants & Funding',  ytd: 1.5,  budget: 1.5,  ly: 1.1,  outstanding: 0.0 },
  { id: 'fines',      name: 'Fines, Penalties & Disciplinary', icon: 'scale',    group: 'Regulatory',        ytd: 0.8,  budget: 0.6,  ly: 0.7,  outstanding: 0.2 },
];

// Monthly collected revenue Jul→Jun (৳Cr) — used for the trend chart.
const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const MONTHLY = [7.2, 8.1, 9.4, 8.8, 10.2, 11.6, 9.9, 10.8, 12.4, 11.2, 9.1, 6.4];

// Collection methods and a recent collection ledger (receipts) per source.
const PAY_METHODS = ['Bank transfer', 'RTGS', 'Cheque', 'Cash', 'Online', 'Mobile banking'];
const SEED_COLLECTIONS = [
  { sourceId: 'sponsor',    date: '2026-06-10', payer: 'Daraz Bangladesh',           method: 'RTGS',          ref: 'DRZ-2026-01', amount: 12.5 },
  { sourceId: 'sponsor',    date: '2026-05-28', payer: 'Grameenphone',               method: 'Bank transfer', ref: 'GP-Q2-26',    amount: 2.0 },
  { sourceId: 'fifa',       date: '2026-05-20', payer: 'FIFA — Forward Programme',   method: 'Bank transfer', ref: 'FIFA-FWD-3',  amount: 9.0 },
  { sourceId: 'govt',       date: '2026-06-01', payer: 'Ministry of Youth & Sports', method: 'Cheque',        ref: 'MOYS-2026',   amount: 6.0 },
  { sourceId: 'broadcast',  date: '2026-06-15', payer: 'T Sports Network',           method: 'Bank transfer', ref: 'TS-Q4-2026',  amount: 4.6 },
  { sourceId: 'matchday',   date: '2026-06-12', payer: 'SAFF Final — gate receipts', method: 'Cash',          ref: 'GATE-0612',   amount: 1.2 },
  { sourceId: 'membership', date: '2026-04-30', payer: 'Club affiliations (batch)',  method: 'Online',        ref: 'AFF-2026',    amount: 1.4 },
  { sourceId: 'merch',      date: '2026-06-08', payer: 'Official online store',      method: 'Online',        ref: 'SHOP-0608',   amount: 0.6 },
];

/* In-memory revenue store: the 14 sources + a collection ledger. Recording a
   collection is the core "process revenue collection" operation — it appends a
   receipt, increases the source's collected (YTD) figure and reduces its
   outstanding receivable. Mirrors the SponsorStore/FinanceStore pattern. */
const RevenueStore = (() => {
  const subs = new Set();
  if (!window.DATA) window.DATA = {};
  if (!window.DATA.revenueStreams) window.DATA.revenueStreams = SEED_STREAMS.map((s) => ({ ...s }));
  if (!window.DATA.revenueCollections) window.DATA.revenueCollections = SEED_COLLECTIONS.map((c, i) => ({ ...c, id: 'rc' + (i + 1) }));
  let seq = window.DATA.revenueCollections.length;
  return {
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    bump() { subs.forEach((f) => f()); },
    streams() { return window.DATA.revenueStreams || []; },
    source(id) { return this.streams().find((s) => s.id === id); },
    collections(sourceId) {
      const all = window.DATA.revenueCollections || [];
      return sourceId ? all.filter((c) => c.sourceId === sourceId) : all;
    },
    async record(sourceId, data) {
      const amt = Number(data.amount) || 0;
      window.DATA.revenueCollections = [{ id: 'rc' + (++seq), sourceId, ...data, amount: amt }, ...(window.DATA.revenueCollections || [])];
      window.DATA.revenueStreams = this.streams().map((s) => s.id === sourceId
        ? { ...s, ytd: +(s.ytd + amt).toFixed(2), outstanding: Math.max(0, +(s.outstanding - amt).toFixed(2)) }
        : s);
      this.bump();
    },
  };
})();
function useRevenue() {
  const [, f] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => RevenueStore.subscribe(f), []);
  return RevenueStore;
}

/* ======================================================================
   1) Revenue Overview — consolidated dashboard across all 14 streams
   ====================================================================== */
// Today's date (yyyy-mm-dd) for the collection date default.
const todayISO = () => { try { return new Date().toISOString().slice(0, 10); } catch { return ''; } };

/* Record a revenue collection (receipt) against a source. This is the operative
   step of revenue collection: it books the money, updating YTD + outstanding. */
function RecordCollectionModal({ store, preset, onClose }) {
  const streams = store.streams();
  const [f, setF] = useState(() => ({
    sourceId: preset ? preset.id : streams[0].id,
    amount: '', payer: '', method: PAY_METHODS[0], ref: '', date: todayISO(),
  }));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const [busy, setBusy] = useState(false);
  const src = store.source(f.sourceId);

  const submit = async () => {
    const amt = parseFloat(f.amount) || 0;
    if (amt <= 0) { toast('Enter a collection amount', 'muted'); return; }
    if (!f.payer.trim()) { toast('Payer name is required', 'muted'); return; }
    const ok = await confirmAction({
      title: 'Record collection?',
      message: <>Book <b>{fmtCr(amt)}</b> collected against <b>{src.name}</b>?</>,
      detail: `${f.method}${f.ref ? ' · ' + f.ref : ''} · ${f.date}`,
      confirmLabel: 'Record collection', icon: 'check',
    });
    if (!ok) return;
    setBusy(true);
    try {
      await store.record(f.sourceId, { amount: amt, payer: f.payer.trim(), method: f.method, ref: f.ref.trim(), date: f.date });
      toast('<b>' + fmtCr(amt) + '</b> collected · ' + src.name);
      onClose();
    } catch (e) { toast(e.message || 'Failed to record', 'muted'); setBusy(false); }
  };

  return (
    <Modal title="Record collection" subtitle={preset ? preset.name : 'New receipt'} width={560} onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" disabled={busy} onClick={submit}><Icon name="coin" size={15} />{busy ? 'Recording…' : 'Record collection'}</button>
      </>}>
      {src && (
        <div className="row" style={{ justifyContent: 'space-between', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 10, marginBottom: 14, fontSize: 12.5 }}>
          <span style={{ color: 'var(--ink-3)' }}>Outstanding before</span>
          <b className="num">{fmtCr(src.outstanding)}</b>
        </div>
      )}
      <div className="form-grid">
        {!preset && <Field label="Revenue source" span><SelectInput value={f.sourceId} onChange={set('sourceId')} options={streams.map((s) => ({ value: s.id, label: s.name }))} /></Field>}
        <Field label="Amount collected (৳ crore) *"><TextInput value={f.amount} onChange={set('amount')} inputMode="decimal" placeholder="2.5" autoFocus /></Field>
        <Field label="Date"><TextInput value={f.date} onChange={set('date')} type="date" /></Field>
        <Field label="Payer / source *" span><TextInput value={f.payer} onChange={set('payer')} placeholder="e.g. T Sports Network" /></Field>
        <Field label="Method"><SelectInput value={f.method} onChange={set('method')} options={PAY_METHODS} /></Field>
        <Field label="Reference / receipt no."><TextInput value={f.ref} onChange={set('ref')} placeholder="e.g. TS-Q4-2026" /></Field>
      </div>
    </Modal>
  );
}

/* Drill-down for one revenue source: KPIs, collection ledger, and the record
   action. Reads the source live from the store so figures update in place. */
function SourceDetailModal({ source, store, canEdit, onRecord, onClose }) {
  const s = store.source(source.id) || source;
  const ledger = store.collections(s.id);
  const collected = ledger.reduce((a, c) => a + c.amount, 0);
  const color = groupColor(s.group);
  return (
    <Modal title={s.name} subtitle={s.group + ' revenue · FY 2025–26'} width={680} onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Close</button>
        {canEdit && <button className="btn sm" onClick={() => onRecord(s)}><Icon name="coin" size={15} />Record collection</button>}
      </>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { k: 'Collected (YTD)', v: fmtCr(s.ytd), c: color },
          { k: 'Annual budget', v: fmtCr(s.budget), c: 'var(--ink)' },
          { k: 'Outstanding', v: fmtCr(s.outstanding), c: s.outstanding > 0 ? 'var(--warn)' : 'var(--ink-3)' },
          { k: 'Budget met', v: pct(s.ytd, s.budget) + '%', c: 'var(--info)' },
        ].map((x) => (
          <div key={x.k} style={{ padding: '11px 12px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 10 }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>{x.k}</div>
            <div className="num" style={{ fontWeight: 800, fontSize: 18, color: x.c, marginTop: 4 }}>{x.v}</div>
          </div>
        ))}
      </div>

      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <h4 style={{ fontSize: 14 }}>Collection ledger</h4>
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{ledger.length} receipt{ledger.length === 1 ? '' : 's'} · {fmtCr(collected)}</span>
      </div>
      {ledger.length ? (
        <div className="scroll-x" style={{ border: '1px solid var(--line)', borderRadius: 10 }}>
          <table className="tbl" style={{ minWidth: 520 }}>
            <thead><tr><th style={{ padding: '10px 12px' }}>Date</th><th>Payer</th><th>Method</th><th>Reference</th><th className="r">Amount</th></tr></thead>
            <tbody>
              {ledger.map((c) => (
                <tr key={c.id} style={{ cursor: 'default' }}>
                  <td className="num" style={{ fontSize: 12.5 }}>{c.date}</td>
                  <td style={{ fontWeight: 600 }}>{c.payer}</td>
                  <td style={{ color: 'var(--ink-2)', fontSize: 13 }}>{c.method}</td>
                  <td className="num" style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{c.ref || '—'}</td>
                  <td className="r num" style={{ fontWeight: 700, color: 'var(--pos)' }}>{fmtCr(c.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: 22, textAlign: 'center', color: 'var(--ink-3)', border: '1px dashed var(--line-strong)', borderRadius: 10, fontSize: 13 }}>
          No collections recorded yet.{canEdit ? ' Use “Record collection” to book the first receipt.' : ''}
        </div>
      )}
      <p style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginTop: 12, marginBottom: 0 }}>
        Recording a collection books the receipt, adds to <b>Collected (YTD)</b> and reduces <b>Outstanding</b>.
      </p>
    </Modal>
  );
}

function RevenueOverview({ go }) {
  const store = useRevenue();
  const STREAMS = store.streams();
  const canEdit = AuthStore.canEdit();
  const [detail, setDetail] = useState(null);
  const [record, setRecord] = useState(null);
  const totalYtd = STREAMS.reduce((a, s) => a + s.ytd, 0);
  const totalBudget = STREAMS.reduce((a, s) => a + s.budget, 0);
  const totalLy = STREAMS.reduce((a, s) => a + s.ly, 0);
  const totalOut = STREAMS.reduce((a, s) => a + s.outstanding, 0);
  const yoy = pct(totalYtd - totalLy, totalLy);
  const maxYtd = Math.max(...STREAMS.map((s) => s.ytd));

  // Revenue mix by category group.
  const byGroup = Object.keys(GROUPS).map((g) => ({
    g, v: STREAMS.filter((s) => s.group === g).reduce((a, s) => a + s.ytd, 0),
  })).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);

  // Receivables aging buckets (share of total outstanding).
  const aging = [
    { k: 'Current', v: totalOut * 0.52, tone: 'var(--pos)' },
    { k: '31–60 days', v: totalOut * 0.24, tone: 'var(--info)' },
    { k: '61–90 days', v: totalOut * 0.14, tone: 'var(--warn)' },
    { k: '90+ days', v: totalOut * 0.10, tone: 'var(--neg)' },
  ];

  return (
    <div className="content-inner fade-in">
      <PageHead title="Revenue & Finance" desc="Consolidated income across all federation revenue streams · FY 2025–26">
        <button className="btn ghost sm" onClick={() => toast('Financial report (PDF) downloaded')}><Icon name="dl" size={15} />Export report</button>
        {canEdit && <button className="btn sm" onClick={() => setRecord({})}><Icon name="plus" size={15} />Record collection</button>}
      </PageHead>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 'var(--gap)', marginBottom: 'var(--gap)' }}>
        <Stat k="Total revenue (YTD)" v={fmtCr(totalYtd)} d={'of ' + fmtCr(totalBudget) + ' budget'} dColor="var(--ink-3)" glyph="coin" />
        <Stat k="Budget achieved" v={pct(totalYtd, totalBudget) + '%'} d={fmtCr(totalBudget - totalYtd) + ' remaining'} dColor="var(--ink-3)" glyph="bars" accent="var(--info)" />
        <Stat k="Receivables outstanding" v={fmtCr(totalOut)} d="across all streams" dColor="var(--warn)" glyph="receipt" accent="var(--warn)" onClick={() => go('contracts')} />
        <Stat k="Year-on-year growth" v={'+' + yoy + '%'} d={'vs ' + fmtCr(totalLy) + ' last FY'} dColor="var(--pos)" glyph="trend" accent="var(--pos)" />
      </div>

      {/* Monthly collection trend */}
      <div className="card card-pad" style={{ marginBottom: 'var(--gap)' }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ fontSize: 16 }}>Monthly revenue collection</h3>
          <span className="badge neutral">FY 2025–26 · {fmtCr(MONTHLY.reduce((a, b) => a + b, 0))} collected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 150 }}>
          {MONTHLY.map((v, i) => {
            const h = (v / Math.max(...MONTHLY)) * 100;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div className="num" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{v.toFixed(1)}</div>
                <div title={MONTHS[i] + ': ' + fmtCr(v)} style={{ width: '100%', height: h + '%', minHeight: 4, borderRadius: '5px 5px 0 0', background: 'linear-gradient(180deg, var(--primary-soft), var(--primary))' }}></div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{MONTHS[i]}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 'var(--gap)', alignItems: 'start' }} className="rev-grid">
        {/* Stream breakdown */}
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 4 }}>Revenue by source</h3>
          <p style={{ fontSize: 12.5, color: 'var(--ink-3)', margin: '0 0 14px' }}>All 14 potential revenue streams · select a source to view its collection ledger &amp; record receipts</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {STREAMS.map((s) => {
              const grew = s.ytd >= s.ly;
              return (
                <div key={s.id} className="rev-row" role="button" tabIndex={0} onClick={() => setDetail(s)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 8px', margin: '0 -8px', borderTop: '1px solid var(--line)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, flex: 'none', display: 'grid', placeItems: 'center', background: 'color-mix(in srgb,' + groupColor(s.group) + ' 12%, transparent)', color: groupColor(s.group) }}>
                    <Icon name={s.icon} size={17} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ justifyContent: 'space-between', gap: 10 }}>
                      <span style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                      <b className="num" style={{ fontSize: 13.5 }}>{fmtCr(s.ytd)}</b>
                    </div>
                    <div style={{ marginTop: 5 }}><Bar v={s.ytd} max={maxYtd} color={groupColor(s.group)} /></div>
                  </div>
                  <div style={{ width: 74, textAlign: 'right', flex: 'none' }}>
                    <div className="num" style={{ fontSize: 12.5, fontWeight: 700 }}>{pct(s.ytd, totalYtd)}%</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: grew ? 'var(--pos)' : 'var(--neg)' }}>{grew ? '▲' : '▼'} {Math.abs(pct(s.ytd - s.ly, s.ly))}%</div>
                  </div>
                  <Icon name="chev" size={16} style={{ color: 'var(--ink-faint)', flex: 'none' }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right rail: mix + aging */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>Revenue mix by category</h3>
            <div style={{ display: 'flex', height: 12, borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
              {byGroup.map((x) => <div key={x.g} title={x.g + ': ' + fmtCr(x.v)} style={{ width: pct(x.v, totalYtd) + '%', background: groupColor(x.g) }}></div>)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {byGroup.map((x) => (
                <div key={x.g} className="row" style={{ justifyContent: 'space-between', fontSize: 13 }}>
                  <span className="row" style={{ gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: groupColor(x.g) }}></span>{x.g}</span>
                  <span><b className="num">{fmtCr(x.v)}</b> <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>· {pct(x.v, totalYtd)}%</span></span>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15 }}>Receivables aging</h3>
              <span className="num" style={{ fontWeight: 800 }}>{fmtCr(totalOut)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {aging.map((a) => (
                <div key={a.k}>
                  <div className="row" style={{ justifyContent: 'space-between', marginBottom: 5, fontSize: 12.5 }}>
                    <span className="row" style={{ gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: a.tone }}></span>{a.k}</span>
                    <b className="num">{fmtCr(a.v)}</b>
                  </div>
                  <Bar v={a.v} max={totalOut} color={a.tone} />
                </div>
              ))}
            </div>
            <button className="btn ghost sm" style={{ width: '100%', marginTop: 14, justifyContent: 'center' }} onClick={() => go('contracts')}><Icon name="receipt" size={14} />Manage receivables</button>
          </div>
        </div>
      </div>
      {detail && <SourceDetailModal source={detail} store={store} canEdit={canEdit} onRecord={(s) => setRecord(s)} onClose={() => setDetail(null)} />}
      {record && <RecordCollectionModal store={store} preset={record.id ? record : null} onClose={() => setRecord(null)} />}

      <style>{'.rev-row{cursor:pointer;transition:background .12s}.rev-row:hover{background:var(--surface-2)}@media (max-width: 900px){ .rev-grid{ grid-template-columns:1fr !important; } }'}</style>
    </div>
  );
}

/* ======================================================================
   2) Contracts & Receivables — contract + billing + receivable management
   ====================================================================== */
const CTYPES = ['Broadcasting', 'Sponsorship', 'Kit Supplier', 'Licensing', 'Facility Rental', 'Digital Media'];
const CSTATUS = ['Active', 'Pending', 'Overdue', 'Completed'];
const cStatusTone = (s) => s === 'Active' ? 'pos' : s === 'Pending' ? 'info' : s === 'Overdue' ? 'neg' : 'neutral';
const cTypeIcon = { 'Broadcasting': 'ball', 'Sponsorship': 'tag', 'Kit Supplier': 'award', 'Licensing': 'doc', 'Facility Rental': 'building', 'Digital Media': 'pie' };

const SEED_CONTRACTS = [
  { party: 'T Sports Network',   type: 'Broadcasting',    value: 18.5, received: 15.3, start: 2023, end: 2026, schedule: 'Quarterly', next: '2026-09-15', status: 'Active' },
  { party: 'Daraz Bangladesh',   type: 'Sponsorship',     value: 12.5, received: 12.5, start: 2024, end: 2027, schedule: 'Annual',    next: '2026-07-01', status: 'Active' },
  { party: 'Grameenphone',       type: 'Sponsorship',     value: 8.0,  received: 6.0,  start: 2023, end: 2026, schedule: 'Quarterly', next: '2026-08-10', status: 'Active' },
  { party: 'Daffodil (Kit)',     type: 'Kit Supplier',    value: 6.5,  received: 3.2,  start: 2024, end: 2026, schedule: 'Bi-annual', next: '2026-07-20', status: 'Overdue' },
  { party: 'Walton',             type: 'Sponsorship',     value: 6.5,  received: 5.4,  start: 2024, end: 2026, schedule: 'Quarterly', next: '2026-09-01', status: 'Active' },
  { party: 'Meril (Licensing)',  type: 'Licensing',       value: 2.4,  received: 1.8,  start: 2025, end: 2027, schedule: 'Annual',    next: '2026-10-05', status: 'Active' },
  { party: 'Bashundhara Arena',  type: 'Facility Rental', value: 2.1,  received: 1.9,  start: 2025, end: 2026, schedule: 'Monthly',   next: '2026-07-05', status: 'Active' },
  { party: 'FanCode (Digital)',  type: 'Digital Media',   value: 2.3,  received: 0.0,  start: 2026, end: 2028, schedule: 'Annual',    next: '2026-07-30', status: 'Pending' },
];

const seedContracts = () => SEED_CONTRACTS.map((c, i) => ({ ...c, id: 'ct' + (i + 1) }));

const FinanceStore = (() => {
  const subs = new Set();
  let seq = SEED_CONTRACTS.length;
  if (!window.DATA) window.DATA = {};
  if (!window.DATA.financeContracts) window.DATA.financeContracts = seedContracts();
  return {
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    bump() { subs.forEach((f) => f()); },
    all() { return (window.DATA && window.DATA.financeContracts) || []; },
    async add(data) { window.DATA.financeContracts = [{ ...data, id: 'ct' + (++seq) }, ...this.all()]; this.bump(); },
    async update(id, patch) { window.DATA.financeContracts = this.all().map((c) => c.id === id ? { ...c, ...patch } : c); this.bump(); },
    async remove(id) { window.DATA.financeContracts = this.all().filter((c) => c.id !== id); this.bump(); },
  };
})();
function useContracts() {
  const [, f] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => FinanceStore.subscribe(f), []);
  return FinanceStore;
}

function ContractModal({ contract, store, onClose }) {
  const mode = contract ? 'edit' : 'add';
  const [f, setF] = useState(() => Object.assign(
    { party: '', type: CTYPES[0], value: '', received: '', start: '2025', end: '2027', schedule: 'Quarterly', next: '', status: 'Active' },
    contract ? { ...contract, value: String(contract.value ?? ''), received: String(contract.received ?? ''), start: String(contract.start ?? ''), end: String(contract.end ?? '') } : {},
  ));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!f.party.trim()) { toast('Counterparty name is required', 'muted'); return; }
    const payload = {
      party: f.party.trim(), type: f.type, value: parseFloat(f.value) || 0, received: parseFloat(f.received) || 0,
      start: parseInt(f.start, 10) || null, end: parseInt(f.end, 10) || null, schedule: f.schedule, next: f.next.trim(), status: f.status,
    };
    const ok = await confirmAction({
      title: mode === 'add' ? 'Add contract?' : 'Save contract?',
      message: mode === 'add' ? <>Add <b>{f.party}</b> to the contract register?</> : <>Save changes to <b>{f.party}</b>?</>,
      detail: `${f.type} · ${fmtCr(payload.value)} total · ${fmtCr(payload.value - payload.received)} outstanding`,
      confirmLabel: mode === 'add' ? 'Add contract' : 'Save changes', icon: mode === 'add' ? 'plus' : 'check',
    });
    if (!ok) return;
    setBusy(true);
    try {
      if (mode === 'add') await store.add(payload); else await store.update(contract.id, payload);
      toast('<b>' + f.party + '</b> ' + (mode === 'add' ? 'added' : 'updated'));
      onClose();
    } catch (e) { toast(e.message || 'Save failed', 'muted'); setBusy(false); }
  };
  return (
    <Modal title={mode === 'add' ? 'Add contract' : 'Manage contract'} subtitle={mode === 'add' ? 'New revenue contract' : f.party} width={580} onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" disabled={busy} onClick={submit}><Icon name="check" size={15} />{busy ? 'Saving…' : (mode === 'add' ? 'Add contract' : 'Save changes')}</button>
      </>}>
      <div className="form-grid">
        <Field label="Counterparty *" span><TextInput value={f.party} onChange={set('party')} placeholder="e.g. T Sports Network" autoFocus /></Field>
        <Field label="Contract type"><SelectInput value={f.type} onChange={set('type')} options={CTYPES} /></Field>
        <Field label="Status"><SelectInput value={f.status} onChange={set('status')} options={CSTATUS} /></Field>
        <Field label="Contract value (৳ crore)"><TextInput value={f.value} onChange={set('value')} inputMode="decimal" placeholder="18.5" /></Field>
        <Field label="Received to date (৳ crore)"><TextInput value={f.received} onChange={set('received')} inputMode="decimal" placeholder="15.3" /></Field>
        <Field label="Start year"><TextInput value={f.start} onChange={set('start')} inputMode="numeric" placeholder="2024" /></Field>
        <Field label="End year"><TextInput value={f.end} onChange={set('end')} inputMode="numeric" placeholder="2027" /></Field>
        <Field label="Payment schedule"><SelectInput value={f.schedule} onChange={set('schedule')} options={['Monthly', 'Quarterly', 'Bi-annual', 'Annual']} /></Field>
        <Field label="Next payment (date)"><TextInput value={f.next} onChange={set('next')} type="date" /></Field>
      </div>
    </Modal>
  );
}

function FinanceContracts() {
  const store = useContracts();
  const rows = store.all();
  const [q, setQ] = useState('');
  const [typeF, setTypeF] = useState('All');
  const [statusF, setStatusF] = useState('All');
  const [modal, setModal] = useState(null);
  const canEdit = AuthStore.canEdit();

  const totalValue = rows.reduce((a, c) => a + c.value, 0);
  const totalRecv = rows.reduce((a, c) => a + c.received, 0);
  const totalOut = totalValue - totalRecv;
  const overdue = rows.filter((c) => c.status === 'Overdue').length;

  const ql = q.trim().toLowerCase();
  const list = rows.filter((c) => {
    if (typeF !== 'All' && c.type !== typeF) return false;
    if (statusF !== 'All' && c.status !== statusF) return false;
    if (ql && !c.party.toLowerCase().includes(ql)) return false;
    return true;
  });

  const removeC = async (c) => {
    const ok = await confirmAction({ title: 'Remove contract?', message: <>Remove <b>{c.party}</b> from the contract register?</>, confirmLabel: 'Remove', tone: 'danger', icon: 'more' });
    if (!ok) return;
    try { await store.remove(c.id); toast('Contract removed'); } catch (e) { toast(e.message || 'Failed to remove', 'muted'); }
  };

  return (
    <div className="content-inner fade-in">
      <PageHead title="Contracts & Receivables" desc="Broadcasting, sponsorship, licensing & rental contracts · billing and outstanding collections">
        <button className="btn ghost sm" onClick={() => toast('Aging report (PDF) downloaded')}><Icon name="dl" size={15} />Aging report</button>
        {canEdit && <button className="btn sm" onClick={() => setModal({})}><Icon name="plus" size={15} />Add contract</button>}
      </PageHead>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--gap)', marginBottom: 'var(--gap)' }}>
        <Stat k="Contract value" v={fmtCr(totalValue)} d={rows.length + ' active contracts'} dColor="var(--ink-3)" glyph="wallet" />
        <Stat k="Received to date" v={fmtCr(totalRecv)} d={pct(totalRecv, totalValue) + '% collected'} dColor="var(--pos)" glyph="coin" accent="var(--pos)" />
        <Stat k="Outstanding" v={fmtCr(totalOut)} d="to be collected" dColor="var(--warn)" glyph="receipt" accent="var(--warn)" />
        <Stat k="Overdue" v={overdue} d="need follow-up" dColor={overdue ? 'var(--neg)' : 'var(--ink-3)'} glyph="clock" accent="var(--neg)" />
      </div>

      <div className="card card-pad" style={{ marginBottom: 'var(--gap)' }}>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <Icon name="search" size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)', pointerEvents: 'none' }} />
            <input placeholder="Search counterparty…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '100%', height: 38, borderRadius: 10, border: '1px solid var(--line)', padding: '0 12px 0 32px', background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13.5 }} />
          </div>
          <select value={typeF} onChange={(e) => setTypeF(e.target.value)} style={selStyle}><option value="All">All types</option>{CTYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)} style={selStyle}><option value="All">All statuses</option>{CSTATUS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="scroll-x">
          <table className="tbl" style={{ minWidth: 820 }}>
            <thead>
              <tr>
                <th>Counterparty</th><th>Type</th><th className="r">Value</th><th className="r">Received</th><th className="r">Outstanding</th>
                <th style={{ minWidth: 130 }}>Collected</th><th>Schedule</th><th>Next</th><th>Status</th>{canEdit && <th></th>}
              </tr>
            </thead>
            <tbody>
              {list.map((c) => {
                const out = c.value - c.received;
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.party}<div style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 400 }}>{c.start}–{String(c.end).slice(2)}</div></td>
                    <td><span className="row" style={{ gap: 7 }}><Icon name={cTypeIcon[c.type] || 'doc'} size={14} color="var(--ink-3)" />{c.type}</span></td>
                    <td className="r num">{fmtCr(c.value)}</td>
                    <td className="r num" style={{ color: 'var(--pos)' }}>{fmtCr(c.received)}</td>
                    <td className="r num" style={{ color: out > 0 ? 'var(--warn)' : 'var(--ink-3)' }}>{fmtCr(out)}</td>
                    <td><div className="row" style={{ gap: 8 }}><div style={{ flex: 1 }}><Bar v={c.received} max={c.value} color={c.status === 'Overdue' ? 'var(--neg)' : 'var(--pos)'} /></div><span className="num" style={{ fontSize: 11.5, color: 'var(--ink-3)', width: 30 }}>{pct(c.received, c.value)}%</span></div></td>
                    <td style={{ color: 'var(--ink-2)', fontSize: 13 }}>{c.schedule}</td>
                    <td className="num" style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{c.next || '—'}</td>
                    <td><Badge kind={cStatusTone(c.status)} dot>{c.status}</Badge></td>
                    {canEdit && <td className="r"><div className="row" style={{ gap: 4, justifyContent: 'flex-end' }}><button className="icon-btn" title="Manage" onClick={() => setModal(c)}><Icon name="edit" size={14} /></button><button className="icon-btn" title="Remove" onClick={() => removeC(c)}><Icon name="more" size={14} /></button></div></td>}
                  </tr>
                );
              })}
              {list.length === 0 && <tr><td colSpan={canEdit ? 10 : 9} style={{ textAlign: 'center', color: 'var(--ink-3)', padding: 26 }}>No contracts match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <ContractModal contract={modal.id ? modal : null} store={store} onClose={() => setModal(null)} />}
    </div>
  );
}

/* ======================================================================
   3) Grants & Funding — FIFA/AFC/government grants + donations
   ====================================================================== */
const GRANTS = [
  { id: 'g1', source: 'FIFA Forward Programme', kind: 'FIFA', project: 'Infrastructure & Administration', budget: 12.0, disbursed: 9.0, utilized: 7.4, deadline: '2026-12-31', status: 'On track' },
  { id: 'g2', source: 'AFC Development Fund',    kind: 'AFC',  project: 'Coach education & grassroots',     budget: 6.5,  disbursed: 6.5, utilized: 5.9, deadline: '2026-09-30', status: 'Reporting due' },
  { id: 'g3', source: 'FIFA Solidarity Payment', kind: 'FIFA', project: 'Youth & women’s football',         budget: 3.5,  disbursed: 3.5, utilized: 2.1, deadline: '2027-03-31', status: 'On track' },
  { id: 'g4', source: 'Govt — Youth & Sports',   kind: 'Government', project: 'National team preparation',   budget: 9.0,  disbursed: 6.0, utilized: 5.2, deadline: '2026-11-15', status: 'On track' },
  { id: 'g5', source: 'Govt — Stadium Renovation', kind: 'Government', project: 'National stadium upgrade',  budget: 6.5,  disbursed: 4.0, utilized: 2.6, deadline: '2027-06-30', status: 'Delayed' },
  { id: 'g6', source: 'Corporate CSR Fund',      kind: 'Donation', project: 'School football programme',     budget: 1.5,  disbursed: 1.5, utilized: 1.5, deadline: '2026-06-30', status: 'Closed' },
];
const GKIND = { 'FIFA': '#2c5f92', 'AFC': '#0f766e', 'Government': '#7c3aed', 'Donation': '#c98a1f' };
const gStatusTone = (s) => s === 'On track' ? 'pos' : s === 'Reporting due' ? 'warn' : s === 'Delayed' ? 'neg' : 'neutral';

function GrantCard({ g }) {
  const remaining = g.budget - g.utilized;
  const util = pct(g.utilized, g.disbursed);
  const color = GKIND[g.kind] || 'var(--primary)';
  return (
    <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, flex: 'none', display: 'grid', placeItems: 'center', background: 'color-mix(in srgb,' + color + ' 14%, transparent)', color }}>
          <Icon name={g.kind === 'Government' ? 'bank' : g.kind === 'Donation' ? 'gift' : 'globe'} size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>{g.source}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>{g.project}</div>
        </div>
        <Badge kind={gStatusTone(g.status)} dot>{g.status}</Badge>
      </div>
      <div className="row" style={{ gap: 16, alignItems: 'center' }}>
        <Ring pct={util} size={68} stroke={7} color={color} label={util + '%'} sub="utilized" />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
          <div><div className="eyebrow">Budget</div><div className="num" style={{ fontWeight: 800, fontSize: 15 }}>{fmtCr(g.budget)}</div></div>
          <div><div className="eyebrow">Disbursed</div><div className="num" style={{ fontWeight: 800, fontSize: 15 }}>{fmtCr(g.disbursed)}</div></div>
          <div><div className="eyebrow">Utilized</div><div className="num" style={{ fontWeight: 800, fontSize: 15, color: 'var(--pos)' }}>{fmtCr(g.utilized)}</div></div>
          <div><div className="eyebrow">Remaining</div><div className="num" style={{ fontWeight: 800, fontSize: 15, color: remaining > 0 ? 'var(--warn)' : 'var(--ink-3)' }}>{fmtCr(remaining)}</div></div>
        </div>
      </div>
      <div className="row" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 11, fontSize: 12.5 }}>
        <span className="row" style={{ gap: 6, color: 'var(--ink-3)' }}><Icon name="clock" size={13} />Reporting deadline</span>
        <b className="num">{g.deadline}</b>
      </div>
    </div>
  );
}

function GrantsFunding() {
  const totalBudget = GRANTS.reduce((a, g) => a + g.budget, 0);
  const totalDisb = GRANTS.reduce((a, g) => a + g.disbursed, 0);
  const totalUtil = GRANTS.reduce((a, g) => a + g.utilized, 0);
  const reportingDue = GRANTS.filter((g) => g.status === 'Reporting due' || g.status === 'Delayed').length;
  const byKind = Object.keys(GKIND).map((k) => ({ k, v: GRANTS.filter((g) => g.kind === k).reduce((a, g) => a + g.budget, 0) })).filter((x) => x.v > 0);

  return (
    <div className="content-inner fade-in">
      <PageHead title="Grants & Funding" desc="FIFA, AFC, government grants & donations · budget allocation, utilization and compliance">
        <button className="btn ghost sm" onClick={() => toast('Utilization report (PDF) downloaded')}><Icon name="dl" size={15} />Utilization report</button>
      </PageHead>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--gap)', marginBottom: 'var(--gap)' }}>
        <Stat k="Total grant budget" v={fmtCr(totalBudget)} d={GRANTS.length + ' active grants'} dColor="var(--ink-3)" glyph="bank" />
        <Stat k="Disbursed" v={fmtCr(totalDisb)} d={pct(totalDisb, totalBudget) + '% of budget'} dColor="var(--ink-3)" glyph="coin" accent="var(--info)" />
        <Stat k="Utilized" v={fmtCr(totalUtil)} d={pct(totalUtil, totalDisb) + '% of disbursed'} dColor="var(--pos)" glyph="check" accent="var(--pos)" />
        <Stat k="Reporting due" v={reportingDue} d="deadlines approaching" dColor={reportingDue ? 'var(--warn)' : 'var(--ink-3)'} glyph="clock" accent="var(--warn)" />
      </div>

      <div className="card card-pad" style={{ marginBottom: 'var(--gap)' }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>Funding by source</h3>
        <div style={{ display: 'flex', height: 12, borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
          {byKind.map((x) => <div key={x.k} title={x.k + ': ' + fmtCr(x.v)} style={{ width: pct(x.v, totalBudget) + '%', background: GKIND[x.k] }}></div>)}
        </div>
        <div className="row" style={{ gap: 18, flexWrap: 'wrap' }}>
          {byKind.map((x) => (
            <span key={x.k} className="row" style={{ gap: 8, fontSize: 13 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: GKIND[x.k] }}></span>{x.k} <b className="num">{fmtCr(x.v)}</b></span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 'var(--gap)' }}>
        {GRANTS.map((g) => <GrantCard key={g.id} g={g} />)}
      </div>
    </div>
  );
}

window.RevenueOverview = RevenueOverview;
window.FinanceContracts = FinanceContracts;
window.GrantsFunding = GrantsFunding;
