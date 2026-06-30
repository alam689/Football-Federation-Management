/* ===== components.jsx ===== */
/* Shared icons + UI primitives → window */
import React from 'react';

const I = {
  grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  search:'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
  users:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13A4 4 0 0116 11',
  user:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  trend:'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  cal:'M3 4h18v18H3zM3 10h18M8 2v4M16 2v4',
  whistle:'M12 8a6 6 0 100 12 6 6 0 000-12zM18 8l4-2M12 8V4h6',
  trophy:'M6 4h12v4a6 6 0 01-12 0zM6 6H3v2a3 3 0 003 3M18 6h3v2a3 3 0 01-3 3M9 20h6M12 14v6',
  star:'M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.6 3.2L6.7 14l-5-4.8 7-.9z',
  flow:'M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 4.5L19 9l-4.5 1.5L13 15l-1.5-4.5L7 9l4.5-1.5z',
  health:'M22 12h-4l-3 9L9 3l-3 9H2',
  check:'M20 6L9 17l-5-5',
  chev:'M9 18l6-6-6-6',
  chevd:'M6 9l6 6 6-6',
  bell:'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  filter:'M22 3H2l8 9.5V19l4 2v-8.5z',
  plus:'M12 5v14M5 12h14',
  pin:'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z',
  dl:'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  ball:'M12 2a10 10 0 100 20 10 10 0 000-20zM12 7l4.7 3.4-1.8 5.6H9.1L7.3 10.4z',
  arrowr:'M5 12h14M13 6l6 6-6 6',
  clock:'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
  shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  edit:'M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z',
  more:'M12 13a1 1 0 100-2 1 1 0 000 2zM19 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z',
  heart:'M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 000-7.9z',
  cards:'M2 7h20v14H2zM6 3h12v4H6z',
  globe:'M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z',
  building:'M3 21h18M5 21V6l7-3 7 3v15M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01',
  table:'M3 4h18v16H3zM3 9.5h18M9 9.5V20',
  ticket:'M4 9V7a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4zM13 5v14',
  server:'M4 4h16v6H4zM4 14h16v6H4zM7.5 7h.01M7.5 17h.01',
  history:'M3 3v6h6M3.5 9a9 9 0 102.4-3.6L3 9M12 7v5l4 2',
  doc:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M9 13h6M9 17h4',
  scale:'M12 3v18M7 21h10M5 7h14M5 7l-3 6.5a3.2 3.2 0 006 0zM19 7l3 6.5a3.2 3.2 0 01-6 0zM12 3a2 2 0 100-.01M5 7l7-2 7 2',
  mail:'M4 4h16v16H4zM4 6l8 6 8-6',
  mic:'M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM5 11a7 7 0 0014 0M12 18v3',
  cap:'M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5M22 10v6',
  award:'M12 15a7 7 0 100-14 7 7 0 000 14zM8.2 13.5L7 22l5-3 5 3-1.2-8.5',
  tag:'M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8zM7 7h.01',
};

function Icon({ name, size = 18, sw = 2, fill, color, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || 'none'} stroke={fill ? 'none' : (color || 'currentColor')}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={I[name] || I.grid} />
    </svg>
  );
}

function Avatar({ p, size = 40, square }) {
  const bg = `linear-gradient(150deg, hsl(${p.hue} 52% 42%), hsl(${(p.hue + 40) % 360} 55% 30%))`;
  return (
    <div className={'pavatar' + (square ? ' sq' : '')} style={{ width: size, height: size, fontSize: size * 0.36, background: bg }}>
      {p.initials}
      {p.marquee && <span style={{ position:'absolute', bottom:-2, right:-2, width:size*0.4, height:size*0.4, borderRadius:'50%', background:'var(--bff-gold)', border:'2px solid var(--surface)', display:'grid', placeItems:'center' }}>
        <Icon name="star" size={size*0.2} fill="#fff" />
      </span>}
    </div>
  );
}

const PosTag = ({ pos }) => <span className={'pos-pill pos-' + pos}>{pos}</span>;

// Mini flags (emoji unreliable). bg = CSS for the flag face.
const NATIONS = {
  '🇧🇩': { code:'BD', bg:'radial-gradient(circle at 42% 50%, #f42a41 0 26%, transparent 26%), #006a4e' },
  '🇳🇵': { code:'NP', bg:'linear-gradient(135deg, #003893 50%, #dc143c 50%)' },
  '🇧🇹': { code:'BT', bg:'linear-gradient(135deg, #ffcc33 50%, #ff4e12 50%)' },
  '🇮🇳': { code:'IN', bg:'linear-gradient(#ff9933 33%, #fff 33% 66%, #138808 66%)' },
  '🇲🇲': { code:'MM', bg:'linear-gradient(#fecb00 33%, #34b233 33% 66%, #ea2839 66%)' },
  '🇵🇰': { code:'PK', bg:'linear-gradient(90deg, #fff 0 25%, #01411c 25%)' },
  '🇭🇰': { code:'HK', bg:'#de2910' },
};
function Flag({ e, size = 22 }) {
  const n = NATIONS[e] || { code: '', bg: 'var(--surface-3)' };
  return <span title={n.code} style={{ display:'inline-block', width:size, height:size*0.7, borderRadius:3, background:n.bg, boxShadow:'inset 0 0 0 1px rgba(0,0,0,.12)', verticalAlign:'middle', flex:'none' }}></span>;
}

function Stat({ k, v, d, dColor, glyph, accent, onClick }) {
  return (
    <div className={'card stat' + (onClick ? ' stat-link' : '')} onClick={onClick} role={onClick ? 'button' : undefined}>
      {glyph && <span className="glyph"><Icon name={glyph} size={22} /></span>}
      <div className="k"><span style={{ width:8, height:8, borderRadius:2, background: accent || 'var(--primary)' }}></span>{k}</div>
      <div className="v num">{v}</div>
      {d && <div className="d" style={{ color: dColor || 'var(--pos)' }}>{d}</div>}
      {onClick && <span className="stat-arrow"><Icon name="arrowr" size={15} /></span>}
    </div>
  );
}

function Badge({ kind = 'neutral', children, dot }) {
  return <span className={'badge ' + kind}>{dot && <span className="dot"></span>}{children}</span>;
}

function Bar({ v, max = 100, color }) {
  return <div className="bar"><span style={{ width: Math.min(100, (v / max) * 100) + '%', background: color || 'var(--primary)' }}></span></div>;
}

function Spark({ data, color }) {
  const mx = Math.max(...data);
  return <div className="spark">{data.map((d, i) => <i key={i} style={{ height: (d / mx * 100) + '%', background: color || 'var(--primary)' }}></i>)}</div>;
}

function PageHead({ title, desc, children }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        {desc && <div className="page-desc">{desc}</div>}
      </div>
      {children && <div className="row" style={{ gap: 10 }}>{children}</div>}
    </div>
  );
}

// rating color
const ratingColor = (r) => r >= 7.8 ? 'var(--pos)' : r >= 7.2 ? '#159255' : r >= 6.8 ? 'var(--warn)' : 'var(--ink-3)';

function RatingPill({ r }) {
  return <span className="num" style={{ display:'inline-grid', placeItems:'center', minWidth:42, height:28, borderRadius:8, fontWeight:800, fontSize:14, color:'#fff', background: ratingColor(r) }}>{r.toFixed(1)}</span>;
}

/* Faux-QR (deterministic module grid w/ finder patterns) — represents QR-based digital ID */
function QR({ seed = 'BFF', size = 110, fg = '#0e1a15', bg = '#fff' }) {
  const N = 21;
  // hash seed → pseudo-random bits
  let h = 2166136261;
  for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  const rng = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; };
  const isFinder = (r, c) => {
    const inBox = (br, bc) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
  };
  const cells = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (isFinder(r, c)) continue;
    if (rng() > 0.52) cells.push([r, c]);
  }
  const u = size / N;
  const Finder = ({ x, y }) => (
    <g>
      <rect x={x*u} y={y*u} width={7*u} height={7*u} fill={fg} rx={u*0.6} />
      <rect x={(x+1)*u} y={(y+1)*u} width={5*u} height={5*u} fill={bg} rx={u*0.4} />
      <rect x={(x+2)*u} y={(y+2)*u} width={3*u} height={3*u} fill={fg} rx={u*0.3} />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius:8, background:bg, display:'block' }}>
      {cells.map(([r, c], i) => <rect key={i} x={c*u} y={r*u} width={u} height={u} fill={fg} />)}
      <Finder x={0} y={0} /><Finder x={N-7} y={0} /><Finder x={0} y={N-7} />
    </svg>
  );
}

/* Progress ring */
function Ring({ pct, size = 64, stroke = 7, color = 'var(--primary)', label, sub }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-pct/100)} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center', textAlign:'center' }}>
        <div><div className="num" style={{ fontWeight:800, fontSize:size*0.26, lineHeight:1 }}>{label ?? pct + '%'}</div>{sub && <div style={{ fontSize:9, color:'var(--ink-3)' }}>{sub}</div>}</div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Avatar, PosTag, Flag, Stat, Badge, Bar, Spark, PageHead, RatingPill, ratingColor, QR, Ring });

/* ---- Ticket PNG download (canvas, reads on-screen QR) ---- */
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function drawQRFromDOM(ctx, sel, x, y, size) {
  const svg = document.querySelector(sel + ' svg');
  if (!svg) return;
  const vb = svg.viewBox.baseVal.width || 110;
  const scale = size / vb;
  ctx.fillStyle = '#fff'; ctx.fillRect(x, y, size, size);
  svg.querySelectorAll('rect').forEach(r => {
    ctx.fillStyle = r.getAttribute('fill') || '#0e1a15';
    ctx.fillRect(x + (+r.getAttribute('x')) * scale, y + (+r.getAttribute('y')) * scale, (+r.getAttribute('width')) * scale, (+r.getAttribute('height')) * scale);
  });
}
function downloadTicketPNG(ticket, qrSel = '.ticket-qr') {
  buildTicketCanvas(ticket, qrSel).toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = (ticket.id || 'bff-ticket') + '.png';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
}
function buildTicketCanvas(ticket, qrSel = '.ticket-qr') {
  const W = 760, H = 1060, P = 40, cardL = P, cardW = W - 2 * P, cardTop = P;
  const cx = W / 2;
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#eef2ef'; ctx.fillRect(0, 0, W, H);
  ctx.save(); roundRectPath(ctx, cardL, cardTop, cardW, H - 2 * P, 26); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  const hH = 188;
  ctx.save(); roundRectPath(ctx, cardL, cardTop, cardW, hH, 26); ctx.clip();
  const g = ctx.createLinearGradient(cardL, cardTop, cardL + cardW, cardTop + hH);
  g.addColorStop(0, '#023d2e'); g.addColorStop(1, '#00684a');
  ctx.fillStyle = g; ctx.fillRect(cardL, cardTop, cardW, hH); ctx.restore();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,.78)'; ctx.font = "700 17px Archivo, sans-serif";
  ctx.fillText('BFF E-TICKET · BANGLADESH FOOTBALL FEDERATION', cx, cardTop + 44);
  ctx.fillStyle = '#fff'; ctx.font = "800 30px Archivo, sans-serif";
  ctx.fillText(ticket.match, cx, cardTop + 100);
  ctx.font = "600 18px 'Hanken Grotesk', sans-serif"; ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.fillText(ticket.date + ' · ' + ticket.time, cx, cardTop + 140);
  const qpx = 300, qx = cx - qpx / 2, qy = cardTop + hH + 46;
  drawQRFromDOM(ctx, qrSel, qx, qy, qpx);
  ctx.fillStyle = '#6b7d74'; ctx.font = "600 15px 'Hanken Grotesk', sans-serif";
  ctx.fillText('Scan this QR at the gate', cx, qy + qpx + 30);
  const rows = [['Holder', ticket.buyer], ['Stand', ticket.tier], ['Tickets', String(ticket.qty)], ['Date', ticket.date + ' · ' + ticket.time], ['Order', ticket.id], ['Venue', ticket.venue]];
  let ry = qy + qpx + 72; const colL = cardL + 44;
  ctx.textAlign = 'left';
  rows.forEach(([k, v]) => {
    ctx.fillStyle = '#9aa9a1'; ctx.font = "700 12px Archivo, sans-serif";
    ctx.fillText(k.toUpperCase(), colL, ry);
    ctx.fillStyle = '#0e1a15'; ctx.font = "700 17px 'Hanken Grotesk', sans-serif";
    ctx.fillText(String(v), colL, ry + 23);
    ry += 52;
  });
  return canvas;
}
/* Minimal single-image PDF (embeds the ticket canvas as JPEG) */
function buildImagePDF(jpeg, iw, ih) {
  const pw = 420, ph = Math.round(pw * ih / iw);
  const enc = (s) => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 0xff; return b; };
  const parts = []; let len = 0; const offsets = [];
  const pushStr = (s) => { const u = enc(s); parts.push(u); len += u.length; };
  const pushBytes = (u) => { parts.push(u); len += u.length; };
  pushStr('%PDF-1.4\n');
  const objStr = (n, body) => { offsets[n] = len; pushStr(`${n} 0 obj\n${body}\nendobj\n`); };
  objStr(1, '<< /Type /Catalog /Pages 2 0 R >>');
  objStr(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  objStr(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`);
  const content = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`;
  objStr(4, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  offsets[5] = len;
  pushStr(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${iw} /Height ${ih} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  pushBytes(jpeg);
  pushStr('\nendstream\nendobj\n');
  const xref = len;
  pushStr('xref\n0 6\n0000000000 65535 f \n');
  for (let i = 1; i <= 5; i++) pushStr(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
  pushStr(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  const out = new Uint8Array(len); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}
function downloadTicketPDF(ticket, qrSel = '.ticket-qr') {
  const canvas = buildTicketCanvas(ticket, qrSel);
  canvas.toBlob(async (blob) => {
    const jpeg = new Uint8Array(await blob.arrayBuffer());
    const pdf = buildImagePDF(jpeg, canvas.width, canvas.height);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
    a.download = (ticket.id || 'bff-ticket') + '.pdf';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, 'image/jpeg', 0.92);
}
window.downloadTicketPNG = downloadTicketPNG;
window.downloadTicketPDF = downloadTicketPDF;

/* ---- Roster store (shortlist + squad) with localStorage + toast ---- */
const RosterStore = (() => {
  const load = (k) => { try { return new Set(JSON.parse(localStorage.getItem(k) || '[]')); } catch { return new Set(); } };
  const state = { shortlist: load('bff_shortlist'), squad: load('bff_squad') };
  const subs = new Set();
  const save = () => {
    localStorage.setItem('bff_shortlist', JSON.stringify([...state.shortlist]));
    localStorage.setItem('bff_squad', JSON.stringify([...state.squad]));
    subs.forEach(fn => fn());
  };
  return {
    state,
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    toggle(set, id) { const s = state[set]; s.has(id) ? s.delete(id) : s.add(id); save(); return s.has(id); },
    has(set, id) { return state[set].has(id); },
    count(set) { return state[set].size; },
  };
})();

function useRoster() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => RosterStore.subscribe(force), []);
  return RosterStore;
}

function toast(msg, kind = 'ok') {
  let host = document.getElementById('toast-host');
  if (!host) { host = document.createElement('div'); host.id = 'toast-host'; document.body.appendChild(host); }
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = msg;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 300); }, 2400);
}

/* ---- Data store: lets screens reflect added/edited players ---- */
const DataStore = (() => {
  const subs = new Set();
  const initials = (s) => s.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const hueOf = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  return {
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    bump() { subs.forEach(fn => fn()); },
    addPlayer(data) {
      const D = window.DATA;
      const id = 'np' + (D.allPlayers.length + 1) + Date.now().toString().slice(-4);
      const num = (v, d) => { const n = parseFloat(v); return isNaN(n) ? d : n; };
      const p = Object.assign({}, data, {
        id, initials: initials(data.name || 'New Player'), hue: hueOf(data.name || id),
        no: num(data.no, 0), age: num(data.age, 18), caps: num(data.caps, 0), goals: num(data.goals, 0),
        rating: num(data.rating, 6.5), ht: num(data.ht, 175), foot: data.foot || 'Right',
        value: data.value || '—', form: [6,6,7,6,7], status: 'Available', joined: 2026,
        prospect: !!data.prospect, club: data.club || 'Unattached', district: data.district || '—',
      });
      D.allPlayers.unshift(p);
      if (data.gender === 'women') D.womenSenior.unshift(p); else D.menSenior.unshift(p);
      this.bump();
      return p;
    },
    updatePlayer(id, patch) {
      const D = window.DATA;
      const p = D.allPlayers.find(x => x.id === id);
      if (!p) return null;
      const num = (v, d) => { const n = parseFloat(v); return isNaN(n) ? d : n; };
      Object.keys(patch).forEach(k => {
        if (['age','no','caps','goals','rating','ht'].includes(k)) p[k] = num(patch[k], p[k]);
        else if (patch[k] !== '' && patch[k] != null) p[k] = patch[k];
      });
      if (patch.name) p.initials = initials(patch.name);
      this.bump();
      return p;
    },
  };
})();
function useData() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => DataStore.subscribe(force), []);
  return DataStore;
}

/* ---- Modal ---- */
function Modal({ title, subtitle, onClose, children, width = 560, footer }) {
  React.useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, []);
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" style={{ maxWidth: width }} onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3 style={{ fontSize: 18 }}>{title}</h3>
            {subtitle && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><span style={{ fontSize: 20, lineHeight: 1, color: 'var(--ink-3)' }}>×</span></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ---- Form field helpers ---- */
function Field({ label, children, span }) {
  return (
    <label className="field" style={span ? { gridColumn: '1 / -1' } : undefined}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
function TextInput(props) { return <input className="field-input" {...props} />; }
function SelectInput({ value, onChange, options }) {
  return <select className="field-input" value={value} onChange={onChange}>{options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}</select>;
}
/* Searchable player picker — autocompletes from the player database */
function PlayerPicker({ value, onChange, onPick, placeholder, autoFocus }) {
  const players = (window.DATA && window.DATA.allPlayers) || [];
  const [open, setOpen] = React.useState(false);
  const [hi, setHi] = React.useState(0);
  const q = (value || '').trim().toLowerCase();
  const matches = (q ? players.filter(p => p.name.toLowerCase().includes(q) || (p.club || '').toLowerCase().includes(q)) : players).slice(0, 7);
  const pick = (p) => { onChange({ target: { value: p.name } }); if (onPick) onPick(p); setOpen(false); };
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input className="field-input" value={value} placeholder={placeholder} autoFocus={autoFocus} style={{ paddingLeft: 32 }}
          onChange={e => { onChange(e); setOpen(true); setHi(0); }}
          onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 160)}
          onKeyDown={e => {
            if (!open && (e.key === 'ArrowDown')) { setOpen(true); return; }
            if (!open) return;
            if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(h + 1, matches.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
            else if (e.key === 'Enter' && matches[hi]) { e.preventDefault(); pick(matches[hi]); }
            else if (e.key === 'Escape') { setOpen(false); }
          }} />
        <Icon name="search" size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)', pointerEvents: 'none' }} />
      </div>
      {open && matches.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 30, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, boxShadow: 'var(--shadow-md)', overflow: 'hidden', maxHeight: 248, overflowY: 'auto' }}>
          {matches.map((p, i) => (
            <div key={p.id} onMouseDown={e => { e.preventDefault(); pick(p); }} onMouseEnter={() => setHi(i)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 11px', cursor: 'pointer', background: i === hi ? 'var(--surface-3)' : 'transparent' }}>
              <div className="pavatar" style={{ width: 28, height: 28, fontSize: 11, flex: 'none', background: `hsl(${(p.hue || p.name.length * 9) % 360} 45% 40%)` }}>{p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{p.pos} · {p.club}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
window.PlayerPicker = PlayerPicker;

/* ---- Add / Edit player form ---- */
function PlayerForm({ initial, onSubmit, onClose, mode = 'add' }) {
  const D = window.DATA;
  const clubs = Array.from(new Set(D.allPlayers.map(p => p.club)));
  const [f, setF] = React.useState(Object.assign({
    name: '', pos: 'MF', no: '', age: '', club: clubs[0], district: '', gender: 'men',
    foot: 'Right', ht: '', caps: '', goals: '', rating: '', value: '', prospect: false,
    contact: '', dob: '', nid: '', marital: 'Single', parents: '', mailing: '', refName: '', refContact: '',
  }, initial || {}));
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const submit = async () => {
    const required = [
      ['name', 'Player name'], ['contact', 'Contact number'], ['dob', 'Date of birth'],
      ['nid', 'National ID / Birth Registration ID'], ['parents', 'Parents info'],
      ['mailing', 'Mailing address'], ['refName', 'Reference'], ['refContact', 'Reference contact number'],
    ];
    const missing = required.find(([k]) => !String(f[k] || '').trim());
    if (missing) { toast(missing[1] + ' is required', 'muted'); return; }
    const ok = await confirmAction({
      title: mode === 'add' ? 'Register player?' : 'Save changes?',
      message: mode === 'add'
        ? <>Add <b>{f.name}</b> to the national player pool? This creates a new registration record.</>
        : <>Save changes to <b>{f.name}</b>’s record?</>,
      detail: `${f.pos} · ${f.gender === 'women' ? "Women's" : "Men's"} · ${f.club || 'Unattached'}`,
      confirmLabel: mode === 'add' ? 'Register player' : 'Save changes',
      icon: mode === 'add' ? 'plus' : 'edit',
    });
    if (ok) onSubmit(f);
  };
  return (
    <Modal title={mode === 'add' ? 'Register new player' : 'Edit player'} subtitle={mode === 'add' ? 'Add a player to the national pool' : f.name}
      onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn sm" onClick={submit}><Icon name="check" size={15} />{mode === 'add' ? 'Register player' : 'Save changes'}</button>
      </>}>
      <div className="form-grid">
        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)' }}>Identity &amp; contact</div>
        <Field label="Full name *" span><TextInput value={f.name} onChange={set('name')} placeholder="e.g. Rahim Uddin" autoFocus /></Field>
        <Field label="Date of birth *"><input type="date" className="field-input" value={f.dob} onChange={set('dob')} style={{ fontFamily:'inherit' }} /></Field>
        <Field label="National ID / Birth Reg. ID *"><TextInput value={f.nid} onChange={set('nid')} inputMode="numeric" placeholder="e.g. 19982694512345678" /></Field>
        <Field label="Contact number *"><TextInput value={f.contact} onChange={set('contact')} inputMode="tel" placeholder="+880 1XXX-XXXXXX" /></Field>
        <Field label="Marital status *"><SelectInput value={f.marital} onChange={set('marital')} options={['Single', 'Married', 'Divorced', 'Widowed']} /></Field>
        <Field label="Parents info *" span><TextInput value={f.parents} onChange={set('parents')} placeholder="Father / mother name & contact" /></Field>
        <Field label="Mailing address *" span>
          <textarea className="field-input" rows={2} value={f.mailing} onChange={set('mailing')} placeholder="House, road, post office, upazila, district" style={{ resize:'vertical', minHeight:54, fontFamily:'inherit' }}></textarea>
        </Field>
        <Field label="Reference *"><TextInput value={f.refName} onChange={set('refName')} placeholder="Name & relation" /></Field>
        <Field label="Reference contact number *"><TextInput value={f.refContact} onChange={set('refContact')} inputMode="tel" placeholder="+880 1XXX-XXXXXX" /></Field>

        <div className="form-section-label" style={{ gridColumn:'1 / -1', fontSize:11.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--ink-3)', paddingBottom:2, borderBottom:'1px solid var(--line)', marginTop:6 }}>Football profile</div>
        <Field label="Team"><SelectInput value={f.gender} onChange={set('gender')} options={[{ value: 'men', label: "Men's" }, { value: 'women', label: "Women's" }]} /></Field>
        <Field label="Position"><SelectInput value={f.pos} onChange={set('pos')} options={['GK', 'DF', 'MF', 'FW']} /></Field>
        <Field label="Shirt no."><TextInput value={f.no} onChange={set('no')} inputMode="numeric" placeholder="10" /></Field>
        <Field label="Age"><TextInput value={f.age} onChange={set('age')} inputMode="numeric" placeholder="22" /></Field>
        <Field label="Club"><SelectInput value={f.club} onChange={set('club')} options={clubs} /></Field>
        <Field label="District"><TextInput value={f.district} onChange={set('district')} placeholder="Dhaka" /></Field>
        <Field label="Preferred foot"><SelectInput value={f.foot} onChange={set('foot')} options={['Right', 'Left']} /></Field>
        <Field label="Height (cm)"><TextInput value={f.ht} onChange={set('ht')} inputMode="numeric" placeholder="175" /></Field>
        <Field label="Caps"><TextInput value={f.caps} onChange={set('caps')} inputMode="numeric" placeholder="0" /></Field>
        <Field label="Goals"><TextInput value={f.goals} onChange={set('goals')} inputMode="numeric" placeholder="0" /></Field>
        <Field label="Rating"><TextInput value={f.rating} onChange={set('rating')} inputMode="decimal" placeholder="7.0" /></Field>
        <Field label="Market value"><TextInput value={f.value} onChange={set('value')} placeholder="৳50L" /></Field>
        <Field label="Prospect" span>
          <label className="row" style={{ gap: 8, fontSize: 13.5, cursor: 'pointer' }}>
            <input type="checkbox" checked={f.prospect} onChange={set('prospect')} style={{ accentColor: 'var(--primary)' }} /> Flag as development prospect
          </label>
        </Field>
      </div>
    </Modal>
  );
}

/* ---- Player media: highlight reels (sample footage) + photo slots ---- */
const HIGHLIGHT_VIDEOS = ['/assets/skill-1.mp4', '/assets/skill-2.mp4', '/assets/skill-3.mp4'];
const highlightFor = (p) => HIGHLIGHT_VIDEOS[(p.hue || (p.name || '').length) % HIGHLIGHT_VIDEOS.length];
function HighlightsCard({ p, title = 'Match highlights', badge = 'Video' }) {
  const key = 'bff-reel-' + (p.id || p.name || 'x');
  const [src, setSrc] = React.useState(() => {
    try { const s = localStorage.getItem(key); if (s && !s.startsWith('blob:')) return s; } catch (e) {}
    return highlightFor(p);
  });
  const [picking, setPicking] = React.useState(false);
  const fileRef = React.useRef(null);
  const choose = (s) => { setSrc(s); try { localStorage.setItem(key, s); } catch (e) {} setPicking(false); };
  const upload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setSrc(URL.createObjectURL(file));
    setPicking(false);
    toast('Video replaced for this session — prototype uploads aren’t stored permanently', 'muted');
  };
  return (
    <div className="card card-pad">
      <div className="row" style={{ justifyContent:'space-between', marginBottom:12 }}>
        <h3 style={{ fontSize:16, whiteSpace:'nowrap' }}>{title}</h3>
        <div className="row" style={{ gap:6, flex:'none' }}>
          <span className="badge neutral">{badge}</span>
          {(window.AuthStore && window.AuthStore.canEdit()) && <button className="chip tab" style={{ height:26, fontSize:11.5 }} onClick={()=>setPicking(!picking)} title="Swap in a different reel or upload a video"><Icon name="edit" size={12} /> Change</button>}
        </div>
      </div>
      {picking && (
        <div className="row" style={{ gap:6, marginBottom:10, flexWrap:'wrap' }}>
          {HIGHLIGHT_VIDEOS.map((v,i)=>(
            <button key={v} className={'chip tab'+(src===v?' on':'')} onClick={()=>choose(v)}>Reel {i+1}</button>
          ))}
          <button className="chip tab" onClick={()=>fileRef.current && fileRef.current.click()}><Icon name="plus" size={12} /> Upload…</button>
          <input ref={fileRef} type="file" accept="video/*" style={{ display:'none' }} onChange={upload} />
        </div>
      )}
      <video controls preload="metadata" src={src} style={{ width:'100%', aspectRatio:'16/9', borderRadius:10, background:'#000', display:'block', objectFit:'cover' }}></video>
    </div>
  );
}
function PlayerPhoto({ slotId, size = 96 }) {
  const ro = !(window.AuthStore && window.AuthStore.canEdit());
  const [src, setSrc] = React.useState(() => {
    try { return localStorage.getItem('bff-photo-' + slotId) || null; } catch (e) { return null; }
  });
  const fileRef = React.useRef(null);
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setSrc(reader.result); try { localStorage.setItem('bff-photo-' + slotId, reader.result); } catch (er) {} };
    reader.readAsDataURL(file);
  };
  return (
    <div
      onClick={ro ? undefined : () => fileRef.current && fileRef.current.click()}
      style={{ width:size, height:size, flex:'none', borderRadius:14, overflow:'hidden', position:'relative',
        background:'var(--surface-3)', border:'1px solid var(--line)', display:'grid', placeItems:'center',
        cursor: ro ? 'default' : 'pointer' }}>
      {src
        ? <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        : <span style={{ fontSize: size*0.13, fontWeight:600, color:'var(--ink-faint)', textAlign:'center', padding:4 }}>{ro ? 'Photo' : 'Drop photo'}</span>}
      {!ro && <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={onFile} />}
    </div>
  );
}

/* ---- Confirm dialog (promise-based) ---- */
const ConfirmStore = (() => {
  let setState = null, resolver = null;
  return {
    _bind(fn) { setState = fn; },
    open(opts) { return new Promise(res => { resolver = res; setState && setState(opts); }); },
    resolve(v) { if (resolver) { resolver(v); resolver = null; } setState && setState(null); },
  };
})();
function confirmAction(opts) { return ConfirmStore.open(opts); }
function ConfirmRoot() {
  const [opts, setOpts] = React.useState(null);
  React.useEffect(() => { ConfirmStore._bind(setOpts); }, []);
  if (!opts) return null;
  const danger = opts.tone === 'danger';
  return (
    <Modal title={opts.title} width={opts.width || 430} onClose={() => ConfirmStore.resolve(false)}
      footer={<>
        <button className="btn ghost sm" onClick={() => ConfirmStore.resolve(false)}>{opts.cancelLabel || 'Cancel'}</button>
        <button className="btn sm" style={danger ? { background: 'var(--neg)' } : undefined} onClick={() => ConfirmStore.resolve(true)}>
          <Icon name={danger ? 'bell' : 'check'} size={15} />{opts.confirmLabel || 'Confirm'}
        </button>
      </>}>
      <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
        <div style={{ width: 40, height: 40, flex: 'none', borderRadius: 11, display: 'grid', placeItems: 'center', background: danger ? 'color-mix(in srgb,var(--neg) 14%,transparent)' : 'color-mix(in srgb,var(--primary) 12%,transparent)', color: danger ? 'var(--neg)' : 'var(--primary)' }}>
          <Icon name={opts.icon || (danger ? 'bell' : 'check')} size={20} />
        </div>
        <div style={{ flex: 1, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55, paddingTop: 2 }}>{opts.message}</div>
      </div>
      {opts.detail && <div style={{ marginTop: 14, padding: '11px 13px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 13, color: 'var(--ink-2)' }}>{opts.detail}</div>}
    </Modal>
  );
}

Object.assign(window, { RosterStore, useRoster, toast, DataStore, useData, Modal, Field, TextInput, SelectInput, PlayerForm, confirmAction, ConfirmRoot, HIGHLIGHT_VIDEOS, highlightFor, HighlightsCard, PlayerPhoto });

