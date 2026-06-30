/* Sponsorship Management — commercial partners, rights, deal pipeline & renewals.
   Net-new feature (not from the design export). Frontend-only: sponsors live in
   window.DATA.sponsors and create/edit/delete mutate that in-memory list. */
import '../lib/registry.js';
import React from 'react';

const { useState } = React;
const { Icon, PageHead, Stat, Badge, Bar, Modal, Field, TextInput, SelectInput, toast, confirmAction, AuthStore } = window;

const STIERS = {
  'Title': { color: '#c8962a', tint: 'rgba(200,150,42,.14)' },
  'Official Partner': { color: 'var(--primary)', tint: 'color-mix(in srgb,var(--primary) 12%,transparent)' },
  'Official Supplier': { color: '#2f72e3', tint: 'rgba(47,114,227,.14)' },
  'Regional Partner': { color: '#6b7d74', tint: 'rgba(107,125,116,.16)' },
};
const STIER_ORDER = ['Title', 'Official Partner', 'Official Supplier', 'Regional Partner'];
const SCATS = ['Conglomerate', 'Telecom', 'Broadcast', 'Electronics', 'Logistics', 'E-commerce', 'Beverage', 'Banking', 'Airline', 'FMCG'];
const SSTATUS = ['Active', 'Expiring', 'Negotiating', 'Pending', 'Expired'];
const statusTone = (s) => s === 'Active' ? 'pos' : (s === 'Expiring' || s === 'Pending') ? 'warn' : s === 'Expired' ? 'neg' : 'info';
const selStyle = { height: 38, borderRadius: 10, border: '1px solid var(--line)', padding: '0 12px', background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13.5 };

/* Seed sponsors for the frontend-only demo (deterministic hue per name). */
const seedHue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const seedInitials = (s) => s.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const SEED_SPONSORS = [
  { name: 'Daraz', category: 'E-commerce', tier: 'Title', property: 'Bangladesh Premier League', valueCr: 12.5, contractStart: 2024, contractEnd: 2027, since: 2021, status: 'Active', contact: 'Commercial Office', rights: ['Front-of-shirt branding', 'League naming rights'] },
  { name: 'Grameenphone', category: 'Telecom', tier: 'Official Partner', property: 'National Teams', valueCr: 8.0, contractStart: 2023, contractEnd: 2026, since: 2018, status: 'Active', contact: 'Sponsorship Desk', rights: ['Perimeter LED boards', 'Digital activations'] },
  { name: 'Walton', category: 'Electronics', tier: 'Official Partner', property: 'National Teams', valueCr: 6.5, contractStart: 2024, contractEnd: 2026, since: 2019, status: 'Active', contact: 'Brand Team', rights: ['Back-of-shirt branding'] },
  { name: 'T Sports', category: 'Broadcast', tier: 'Official Supplier', property: 'Broadcast Rights', valueCr: 4.2, contractStart: 2023, contractEnd: 2026, since: 2020, status: 'Expiring', contact: 'Rights Office', rights: ['Live broadcast', 'Highlights package'] },
  { name: 'Pran', category: 'FMCG', tier: 'Regional Partner', property: 'Youth Development', valueCr: 2.0, contractStart: 2025, contractEnd: 2027, since: 2025, status: 'Negotiating', contact: 'Marketing', rights: ['Grassroots programme'] },
];

const seedSponsors = () => SEED_SPONSORS.map((s, i) => ({ ...s, id: 'sp' + (i + 1), hue: seedHue(s.name), initials: seedInitials(s.name) }));

/* In-memory store. Sponsors live in window.DATA.sponsors; create/edit/delete
   mutate that list and notify subscribers so every screen reflects the change. */
const SponsorStore = (() => {
  const subs = new Set();
  let seq = SEED_SPONSORS.length;
  if (!window.DATA) window.DATA = {};
  if (!window.DATA.sponsors) window.DATA.sponsors = seedSponsors();
  return {
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    bump() { subs.forEach((f) => f()); },
    all() { return (window.DATA && window.DATA.sponsors) || []; },
    async add(data) {
      const row = { ...data, id: 'sp' + (++seq), hue: seedHue(data.name), initials: seedInitials(data.name) };
      window.DATA.sponsors = [row, ...this.all()];
      this.bump();
    },
    async update(id, patch) {
      window.DATA.sponsors = this.all().map((s) => s.id === id ? { ...s, ...patch, initials: seedInitials(patch.name || s.name) } : s);
      this.bump();
    },
    async remove(id) {
      window.DATA.sponsors = this.all().filter((s) => s.id !== id);
      this.bump();
    },
  };
})();
function useSponsors() {
  const [, f] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => SponsorStore.subscribe(f), []);
  return SponsorStore;
}

function SponsorCard({ s, canEdit, onEdit, onRemove }) {
  const T = STIERS[s.tier] || STIERS['Regional Partner'];
  const bg = `linear-gradient(150deg, hsl(${s.hue} 55% 45%), hsl(${(s.hue + 40) % 360} 58% 32%))`;
  return (
    <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontFamily: 'var(--ff-display)', fontSize: 16, flex: 'none' }}>{s.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15.5, lineHeight: 1.2 }}>{s.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>{s.category} · since {s.since}</div>
        </div>
        <Badge kind={statusTone(s.status)} dot>{s.status}</Badge>
      </div>
      <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: T.tint, color: T.color, fontWeight: 800, fontSize: 12, fontFamily: 'var(--ff-display)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.color }}></span>{s.tier}
        </span>
        <span className="badge neutral">{s.property}</span>
      </div>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--line)', paddingTop: 11 }}>
        <div>
          <div className="eyebrow">Annual value</div>
          <div className="num" style={{ fontWeight: 800, fontSize: 20 }}>৳{(s.valueCr || 0).toFixed(1)}Cr</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="eyebrow">Contract</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{s.contractStart}–{String(s.contractEnd).slice(2)}</div>
        </div>
      </div>
      {canEdit && (
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost sm" style={{ flex: 1 }} onClick={onEdit}><Icon name="edit" size={14} />Manage</button>
          <button className="icon-btn" title="Remove sponsor" onClick={onRemove}><Icon name="more" size={15} /></button>
        </div>
      )}
    </div>
  );
}

function SponsorModal({ sponsor, store, onClose }) {
  const mode = sponsor ? 'edit' : 'add';
  const [f, setF] = useState(() => Object.assign(
    { name: '', category: SCATS[0], tier: 'Official Partner', property: '', valueCr: '', contractStart: '2025', contractEnd: '2027', since: '2025', status: 'Active', contact: '', rights: '' },
    sponsor ? { ...sponsor, valueCr: String(sponsor.valueCr ?? ''), contractStart: String(sponsor.contractStart ?? ''), contractEnd: String(sponsor.contractEnd ?? ''), since: String(sponsor.since ?? ''), rights: (sponsor.rights || []).join('\n') } : {},
  ));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!f.name.trim()) { toast('Sponsor name is required', 'muted'); return; }
    const payload = {
      name: f.name.trim(), category: f.category, tier: f.tier, property: f.property.trim(),
      valueCr: parseFloat(f.valueCr) || 0, contractStart: parseInt(f.contractStart, 10) || null, contractEnd: parseInt(f.contractEnd, 10) || null,
      since: parseInt(f.since, 10) || null, status: f.status, contact: f.contact.trim(),
      rights: f.rights.split('\n').map((x) => x.trim()).filter(Boolean),
    };
    const ok = await confirmAction({
      title: mode === 'add' ? 'Add sponsor?' : 'Save sponsor?',
      message: mode === 'add' ? <>Add <b>{f.name}</b> to the sponsorship register?</> : <>Save changes to <b>{f.name}</b>?</>,
      detail: `${f.tier} · ${f.category} · ৳${payload.valueCr}Cr/yr`,
      confirmLabel: mode === 'add' ? 'Add sponsor' : 'Save changes', icon: mode === 'add' ? 'plus' : 'check',
    });
    if (!ok) return;
    setBusy(true);
    try {
      if (mode === 'add') await store.add(payload); else await store.update(sponsor.id, payload);
      toast(<><b>{f.name}</b> {mode === 'add' ? 'added' : 'updated'}</>);
      onClose();
    } catch (e) { toast(e.message || 'Save failed', 'muted'); setBusy(false); }
  };
  return (
    <Modal title={mode === 'add' ? 'Add sponsor' : 'Manage sponsor'} subtitle={mode === 'add' ? 'New commercial partner' : f.name} width={580} onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" disabled={busy} onClick={submit}><Icon name="check" size={15} />{busy ? 'Saving…' : (mode === 'add' ? 'Add sponsor' : 'Save changes')}</button>
      </>}>
      <div className="form-grid">
        <Field label="Sponsor name *" span><TextInput value={f.name} onChange={set('name')} placeholder="e.g. Grameenphone" autoFocus /></Field>
        <Field label="Category"><SelectInput value={f.category} onChange={set('category')} options={SCATS} /></Field>
        <Field label="Tier"><SelectInput value={f.tier} onChange={set('tier')} options={STIER_ORDER} /></Field>
        <Field label="Sponsored property" span><TextInput value={f.property} onChange={set('property')} placeholder="e.g. National Teams" /></Field>
        <Field label="Annual value (৳ crore)"><TextInput value={f.valueCr} onChange={set('valueCr')} inputMode="decimal" placeholder="7.5" /></Field>
        <Field label="Status"><SelectInput value={f.status} onChange={set('status')} options={SSTATUS} /></Field>
        <Field label="Contract start"><TextInput value={f.contractStart} onChange={set('contractStart')} inputMode="numeric" placeholder="2025" /></Field>
        <Field label="Contract end"><TextInput value={f.contractEnd} onChange={set('contractEnd')} inputMode="numeric" placeholder="2027" /></Field>
        <Field label="Partner since"><TextInput value={f.since} onChange={set('since')} inputMode="numeric" placeholder="2020" /></Field>
        <Field label="Contact"><TextInput value={f.contact} onChange={set('contact')} placeholder="Account manager / office" /></Field>
        <Field label="Rights & activations (one per line)" span>
          <textarea className="field-input" rows={3} value={f.rights} onChange={set('rights')} placeholder={'Front-of-shirt branding\nPerimeter LED boards'} style={{ resize: 'vertical', minHeight: 64, fontFamily: 'inherit' }} />
        </Field>
      </div>
    </Modal>
  );
}

function Sponsorship() {
  const store = useSponsors();
  const sponsors = store.all();
  const [q, setQ] = useState('');
  const [tierF, setTierF] = useState('All');
  const [catF, setCatF] = useState('All');
  const [modal, setModal] = useState(null); // {} = add, sponsor object = edit
  const canEdit = AuthStore.canEdit();

  const ql = q.trim().toLowerCase();
  const list = sponsors.filter((s) => {
    if (tierF !== 'All' && s.tier !== tierF) return false;
    if (catF !== 'All' && s.category !== catF) return false;
    if (ql && !(s.name.toLowerCase().includes(ql) || (s.property || '').toLowerCase().includes(ql))) return false;
    return true;
  });
  const sum = sponsors.reduce((a, s) => a + (s.valueCr || 0), 0);
  const active = sponsors.filter((s) => s.status === 'Active').length;
  const renewals = sponsors.filter((s) => s.status === 'Expiring' || s.contractEnd <= 2026).length;
  const pipeline = sponsors.filter((s) => s.status === 'Negotiating' || s.status === 'Pending').length;
  const valByTier = STIER_ORDER.map((t) => ({ t, v: sponsors.filter((s) => s.tier === t).reduce((a, s) => a + (s.valueCr || 0), 0) }));
  const maxTier = Math.max(1, ...valByTier.map((x) => x.v));

  const removeSp = async (s) => {
    const ok = await confirmAction({ title: 'Remove sponsor?', message: <>Remove <b>{s.name}</b> from the sponsorship register?</>, confirmLabel: 'Remove', tone: 'danger', icon: 'more' });
    if (!ok) return;
    try { await store.remove(s.id); toast('Sponsor removed'); } catch (e) { toast(e.message || 'Failed to remove', 'muted'); }
  };

  return (
    <div className="content-inner fade-in">
      <PageHead title="Sponsorship Management" desc="Commercial partners, rights, deal pipeline & renewals">
        <button className="btn ghost sm" onClick={() => toast('Sponsorship report (PDF) downloaded')}><Icon name="dl" size={15} />Report</button>
        {canEdit && <button className="btn sm" onClick={() => setModal({})}><Icon name="plus" size={15} />Add sponsor</button>}
      </PageHead>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 'var(--gap)', marginBottom: 'var(--gap)' }}>
        <Stat k="Active partners" v={active} d={`of ${sponsors.length} total`} dColor="var(--ink-3)" glyph="award" />
        <Stat k="Annual value" v={'৳' + sum.toFixed(1) + 'Cr'} d="committed / year" glyph="tag" accent="var(--bff-gold)" />
        <Stat k="Renewals due" v={renewals} d="expiring ≤ 2026" dColor="var(--warn)" glyph="clock" accent="var(--warn)" />
        <Stat k="In pipeline" v={pipeline} d="negotiating / pending" dColor="var(--ink-3)" glyph="flow" accent="var(--primary)" />
      </div>

      <div className="card card-pad" style={{ marginBottom: 'var(--gap)' }}>
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Annual value by tier</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {valByTier.map(({ t, v }) => (
            <div key={t}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                <span className="row" style={{ gap: 8 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: STIERS[t].color }}></span>{t}</span>
                <b className="num">৳{v.toFixed(1)}Cr</b>
              </div>
              <Bar v={v} max={maxTier} color={STIERS[t].color} />
            </div>
          ))}
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 'var(--gap)' }}>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <Icon name="search" size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)', pointerEvents: 'none' }} />
            <input placeholder="Search sponsor or property…" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '100%', height: 38, borderRadius: 10, border: '1px solid var(--line)', padding: '0 12px 0 32px', background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13.5 }} />
          </div>
          <select value={tierF} onChange={(e) => setTierF(e.target.value)} style={selStyle}><option value="All">All tiers</option>{STIER_ORDER.map((t) => <option key={t} value={t}>{t}</option>)}</select>
          <select value={catF} onChange={(e) => setCatF(e.target.value)} style={selStyle}><option value="All">All categories</option>{SCATS.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 'var(--gap)' }}>
        {list.map((s) => <SponsorCard key={s.id} s={s} canEdit={canEdit} onEdit={() => setModal(s)} onRemove={() => removeSp(s)} />)}
        {list.length === 0 && <div className="card card-pad" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--ink-3)' }}>No sponsors match your filters.</div>}
      </div>

      {modal && <SponsorModal sponsor={modal.id ? modal : null} store={store} onClose={() => setModal(null)} />}
    </div>
  );
}

window.Sponsorship = Sponsorship;
