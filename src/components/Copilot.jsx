/* BFF Copilot — a persistent floating football assistant rendered in the app
   shell (so it's available on every authenticated screen). It answers from the
   live hydrated federation data (window.DATA*) and can navigate the app. */
import React from 'react';

const { useState, useEffect, useRef } = React;

const VIEW_LABELS = {
  dashboard: 'Dashboard', search: 'Player Search', management: 'Player Registration', hunt: 'Player Hunt',
  teams: 'National Teams', archive: 'Players Archive', clubs: 'Clubs & Licensing', referees: 'Referees',
  governance: 'Transfers & Discipline', competitions: 'Competitions', fixtures: 'Fixtures', matchcenter: 'Match Center',
  ticketing: 'E-Ticketing', records: 'Records & Stats', development: 'Development', coaching: 'Coaching Management',
  sportsci: 'Sports Science', analytics: 'Analytics', sponsorship: 'Sponsorship', committees: 'BFF Committees',
  regulations: 'Regulations & Legal', roadmap: 'Digital Strategy', infrastructure: 'Infrastructure',
};
const labelFor = (v) => VIEW_LABELS[v] || v;

const SUGGESTIONS = ['Top scorer', 'Next fixture', 'Sponsorship value', 'How many players?', 'Go to Analytics'];

const NAVMAP = [
  ['sponsor', 'sponsorship'], ['committee', 'committees'], ['regulation', 'regulations'], ['archive', 'archive'],
  ['player search', 'search'], ['registration', 'management'], ['player hunt', 'hunt'], ['hunt', 'hunt'],
  ['national team', 'teams'], ['team', 'teams'], ['club', 'clubs'], ['referee', 'referees'],
  ['transfer', 'governance'], ['discipline', 'governance'], ['competition', 'competitions'],
  ['match center', 'matchcenter'], ['fixture', 'fixtures'], ['ticket', 'ticketing'], ['record', 'records'],
  ['coaching', 'coaching'], ['sports science', 'sportsci'], ['analytic', 'analytics'],
  ['digital strategy', 'roadmap'], ['roadmap', 'roadmap'], ['infrastructure', 'infrastructure'],
  ['development', 'development'], ['dashboard', 'dashboard'], ['search', 'search'],
];

// Intent engine over the live federation data. Returns a bot message object.
function buildAnswer(raw) {
  const q = raw.toLowerCase().trim();
  const D = window.DATA || {}, D2 = window.DATA2 || {}, D3 = window.DATA3 || {};
  const players = D.allPlayers || [];
  const nav = (label, view, param) => ({ label, view, param });
  const has = (...words) => words.some((w) => q.includes(w));

  if (has('go to', 'open', 'take me', 'navigate', 'show me')) {
    for (const [kw, view] of NAVMAP) if (q.includes(kw)) return { text: `Here's ${labelFor(view)}.`, nav: [nav('Open ' + labelFor(view), view)] };
  }
  if (has('top scorer', 'leading scorer', 'most goals', 'golden boot')) {
    const top = [...players].sort((a, b) => b.goals - a.goals).slice(0, 5);
    return { text: 'Top scorers in the national pool:', items: top.map((p) => `${p.name} — ${p.goals} goals · ${p.club}`), nav: [nav('Open ' + top[0].name, 'profile', top[0].id)] };
  }
  if (has('top rated', 'best player', 'highest rating', 'best rated', 'star player')) {
    const top = [...players].sort((a, b) => b.rating - a.rating).slice(0, 5);
    return { text: 'Highest-rated players right now:', items: top.map((p) => `${p.name} — ${p.rating.toFixed(1)} · ${p.pos}`), nav: [nav('Open ' + top[0].name, 'profile', top[0].id)] };
  }
  if (has('next fixture', 'next match', 'next game', 'upcoming match', 'upcoming fixture', 'who do we play', 'who are we playing')) {
    const up = (D.fixtures || []).filter((f) => f.status === 'Upcoming').sort((a, b) => String(a.date).localeCompare(String(b.date)));
    if (up.length) { const f = up[0]; return { text: `Next up: ${f.home} vs ${f.away}`, items: [`${f.comp} · ${f.stage}`, `${f.date} · ${f.time}`, f.venue], nav: [nav('All fixtures', 'fixtures')] }; }
    return { text: 'No upcoming fixtures on record.', nav: [nav('Fixtures', 'fixtures')] };
  }
  if (has('fixture', 'schedule', 'matches', 'games')) {
    const up = (D.fixtures || []).filter((f) => f.status === 'Upcoming').slice(0, 5);
    return { text: 'Upcoming fixtures:', items: up.map((f) => `${f.date} · ${f.home} v ${f.away} (${f.comp})`), nav: [nav('Open Fixtures', 'fixtures')] };
  }
  if (has('sponsor', 'sponsorship', 'partner', 'commercial')) {
    const s = D.sponsors || [], total = s.reduce((a, x) => a + (x.valueCr || 0), 0), active = s.filter((x) => x.status === 'Active').length;
    const top = [...s].sort((a, b) => (b.valueCr || 0) - (a.valueCr || 0)).slice(0, 3);
    return { text: `${s.length} commercial partners · ৳${total.toFixed(1)}Cr/yr committed (${active} active).`, items: top.map((x) => `${x.name} — ৳${x.valueCr}Cr · ${x.tier}`), nav: [nav('Open Sponsorship', 'sponsorship')] };
  }
  if (has('how many player', 'registered player', 'squad size', 'player pool', 'number of player', 'how many registered')) {
    return { text: `${players.length} players are in the senior national pool (men + women).`, nav: [nav('Player Search', 'search'), nav('Registration', 'management')] };
  }
  if (has('club', 'licensing', 'league table')) {
    const c = D2.clubs || [];
    return { text: `${c.length} licensed clubs are registered.`, items: c.slice(0, 5).map((x) => `${x.name} — ${x.div} · License ${x.license}`), nav: [nav('Open Clubs', 'clubs')] };
  }
  if (has('coach', 'coaching', 'licence', 'license course')) {
    const c = D2.coaches || [];
    return { text: `${c.length} licensed coaches on record.`, items: c.slice(0, 4).map((x) => `${x.name} — ${x.license} · ${x.role}`), nav: [nav('Coaching Management', 'coaching')] };
  }
  if (has('ticket', 'revenue', 'sales', 'attendance', 'gate')) {
    const t = D3.ticketStats || {};
    return { text: `Ticketing — ${t.revenue || '—'} revenue · ${t.sold ? t.sold.toLocaleString() : '—'} sold · ${t.digital || '—'}% digital.`, nav: [nav('Open E-Ticketing', 'ticketing')] };
  }
  // player lookup by name
  const cleaned = q.replace(/find|player|profile|show|info|about|who is|tell me|search|for/g, '').trim();
  if (cleaned.length >= 3) {
    const matches = players.filter((p) => p.name.toLowerCase().includes(cleaned)).slice(0, 5);
    if (matches.length === 1) { const p = matches[0]; return { text: `${p.name} — ${p.pos}, #${p.no} · ${p.club}`, items: [`${p.caps} caps · ${p.goals} goals · rating ${p.rating.toFixed(1)}`, `${p.age} yrs · ${p.district}`], nav: [nav('Open profile', 'profile', p.id)] }; }
    if (matches.length > 1) return { text: 'I found these players:', items: matches.map((p) => `${p.name} (${p.pos}, ${p.club})`), nav: matches.slice(0, 3).map((p) => nav(p.name.split(' ')[0], 'profile', p.id)) };
  }
  if (has('help', 'what can you', 'hello', 'hi ', 'hey')) {
    return { text: 'I can answer from live federation data — players, fixtures, sponsors, clubs, coaches, ticketing — and take you anywhere in the console. Try:', suggest: true };
  }
  return { text: "I didn't catch that. I work best with questions about players, fixtures, sponsors, clubs or navigation. Try:", suggest: true };
}

function FootballMark({ size = 30, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.3" />
      <path d="M12 6.7l4.7 3.4-1.8 5.6H9.1l-1.8-5.6z" fill={color} stroke="none" />
      <path d="M12 2.7v4M16.7 10.1l3.8-1.2M15.1 15.7l2.3 3.1M8.9 15.7l-2.3 3.1M7.3 10.1L3.5 8.9" />
    </svg>
  );
}

export default function Copilot({ go }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([]);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  // Greet on first open.
  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: 'bot', text: 'Hi! I’m your BFF Copilot ⚽ Ask me about players, fixtures, sponsors, or say “go to …”. Try one of these:', suggest: true }]);
    }
    if (open) setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
  }, [open]);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = (text) => {
    const t = (text || '').trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: 'user', text: t }]);
    setInput('');
    const a = buildAnswer(t);
    setTimeout(() => setMsgs((m) => [...m, { role: 'bot', ...a }]), 220);
  };

  const runNav = (n) => { if (n && n.view && go) { go(n.view, n.param); setOpen(false); } };

  return (
    <>
      <style>{`
        @keyframes bff-cop-pop{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes bff-cop-pulse{0%{box-shadow:0 0 0 0 rgba(0,104,74,.45)}70%{box-shadow:0 0 0 14px rgba(0,104,74,0)}100%{box-shadow:0 0 0 0 rgba(0,104,74,0)}}
        .bff-cop-fab{position:fixed;right:24px;bottom:24px;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;z-index:1000;
          background:linear-gradient(150deg,var(--primary-deep),var(--primary));color:#fff;display:grid;place-items:center;
          box-shadow:var(--shadow-lg,0 10px 30px rgba(0,0,0,.22));transition:transform .15s ease;animation:bff-cop-pulse 2.6s infinite}
        .bff-cop-fab:hover{transform:scale(1.07) rotate(8deg)}
        .bff-cop-fab.on{animation:none}
        .bff-cop-badge{position:absolute;top:-2px;right:-2px;background:var(--bff-red);color:#fff;font-size:9px;font-weight:800;
          padding:2px 5px;border-radius:8px;border:2px solid var(--surface);letter-spacing:.04em}
        .bff-cop-panel{position:fixed;right:24px;bottom:96px;width:380px;max-width:calc(100vw - 32px);height:min(560px,72vh);z-index:1000;
          background:var(--surface);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow-lg,0 16px 48px rgba(0,0,0,.26));
          display:flex;flex-direction:column;overflow:hidden;animation:bff-cop-pop .18s ease both}
        .bff-cop-msg{max-width:84%;padding:10px 13px;border-radius:13px;font-size:13.5px;line-height:1.5;white-space:pre-wrap}
        .bff-cop-bot{align-self:flex-start;background:var(--surface-2);color:var(--ink);border-bottom-left-radius:4px}
        .bff-cop-user{align-self:flex-end;background:var(--primary);color:#fff;border-bottom-right-radius:4px}
        .bff-cop-chip{border:1px solid var(--line);background:var(--surface);color:var(--ink-2);border-radius:999px;padding:6px 11px;
          font-size:12px;cursor:pointer;font-family:inherit;white-space:nowrap;transition:border-color .12s,background .12s}
        .bff-cop-chip:hover{border-color:var(--primary);color:var(--primary)}
      `}</style>

      {!open && (
        <button className="bff-cop-fab" onClick={() => setOpen(true)} aria-label="Open BFF Copilot" title="BFF Copilot">
          <FootballMark size={30} />
          <span className="bff-cop-badge">AI</span>
        </button>
      )}

      {open && (
        <div className="bff-cop-panel" role="dialog" aria-label="BFF Copilot assistant">
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 14px', background: 'linear-gradient(120deg,var(--primary-deep),var(--primary))', color: '#fff' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.16)', display: 'grid', placeItems: 'center', flex: 'none' }}><FootballMark size={22} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>BFF Copilot</div>
              <div style={{ fontSize: 11.5, opacity: .85 }}>Ask about players, fixtures, sponsors…</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: 'rgba(255,255,255,.14)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>

          {/* messages */}
          <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.map((m, i) => (
              <React.Fragment key={i}>
                <div className={'bff-cop-msg ' + (m.role === 'user' ? 'bff-cop-user' : 'bff-cop-bot')}>{m.text}</div>
                {m.items && (
                  <div className="bff-cop-msg bff-cop-bot" style={{ paddingTop: 4, paddingBottom: 4 }}>
                    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {m.items.map((it, j) => <li key={j} style={{ fontSize: 13 }}>{it}</li>)}
                    </ul>
                  </div>
                )}
                {m.nav && m.nav.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignSelf: 'flex-start' }}>
                    {m.nav.map((n, j) => (
                      <button key={j} className="bff-cop-chip" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700 }} onClick={() => runNav(n)}>{n.label} →</button>
                    ))}
                  </div>
                )}
                {m.suggest && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignSelf: 'flex-start' }}>
                    {SUGGESTIONS.map((s) => <button key={s} className="bff-cop-chip" onClick={() => send(s)}>{s}</button>)}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* input */}
          <div style={{ padding: 12, borderTop: '1px solid var(--line)', display: 'flex', gap: 8 }}>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Ask the Copilot…" style={{ flex: 1, height: 40, borderRadius: 10, border: '1px solid var(--line-strong)', padding: '0 12px', fontFamily: 'inherit', fontSize: 13.5, color: 'var(--ink)', background: 'var(--surface)', outline: 'none' }} />
            <button onClick={() => send(input)} aria-label="Send" style={{ width: 40, height: 40, flex: 'none', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'var(--primary)', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
