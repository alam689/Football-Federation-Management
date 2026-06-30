/* ===== screen-auth.jsx ===== */
/* ====================================================================
   Role-based authentication — login screen + role/session model
   ==================================================================== */
import React from 'react';
const { Icon, Flag } = window;

// Frontend-only auth. No backend: credentials are validated against the
// static demo accounts below and the session is persisted to localStorage.
const DEMO_PASSWORD = 'bff12345';
const SESSION_KEY = 'bff_session';

const ROLES = {
  admin: {
    id:'admin', label:'Federation Admin', sub:'Full system access · BFF secretariat',
    icon:'shield', color:'#00684a', home:'dashboard',
    allow:'*',
    user:{ name:'A. Karim', dept:'Technical Department', initials:'AK' },
  },
  scout: {
    id:'scout', label:'Coach / Scout', sub:'Talent, squads, development & analytics',
    icon:'search', color:'#0e6b8c', home:'hunt',
    allow:['dashboard','search','profile','management','hunt','teams','archive','development','coaching','sportsci','analytics','records','committees','regulations'],
    user:{ name:'P. Butler', dept:'National Team Staff', initials:'PB' },
  },
  referee: {
    id:'referee', label:'Match Official', sub:'Assignments, fixtures & match center',
    icon:'whistle', color:'#8a5cf6', home:'referees',
    allow:['dashboard','referees','competitions','fixtures','matchcenter','records','committees','regulations'],
    user:{ name:'Jalaluddin', dept:'FIFA Referee', initials:'JL' },
  },
  club: {
    id:'club', label:'Club Manager', sub:'Squad, transfers, tickets & competitions',
    icon:'building', color:'#e3a72f', home:'clubs',
    allow:['dashboard','clubs','search','profile','management','governance','competitions','fixtures','ticketing','records','coaching','sponsorship','committees','regulations'],
    user:{ name:'M. Lemos', dept:'Abahani Limited Dhaka', initials:'ML' },
  },
  fan: {
    id:'fan', label:'Public / Fan', sub:'Browse teams, fixtures, records & buy tickets',
    icon:'user', color:'#ee2939', home:'dashboard',
    allow:['dashboard','search','profile','teams','archive','hunt','fixtures','matchcenter','records','ticketing','coaching','sponsorship','committees','regulations'],
    user:{ name:'Guest Supporter', dept:'Public Portal', initials:'GS' },
  },
};

// Frontend-only store. `session` is the signed-in user record
// ({ id, username, role, name, dept, initials }) derived from the static
// ROLES map, which also supplies nav permissions, colours and icons.
const buildSession = (roleId) => {
  const base = ROLES[roleId];
  return { id: roleId, username: roleId, role: roleId, name: base.user.name, dept: base.user.dept, initials: base.user.initials };
};

const AuthStore = (() => {
  const subs = new Set();
  let session = null;
  return {
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    bump() { subs.forEach(fn => fn()); },
    current() { return session; },
    role() {
      if (!session) return null;
      const base = ROLES[session.role];
      if (!base) return null;
      return { ...base, user: { name: session.name, dept: session.dept, initials: session.initials } };
    },
    // Mock sign-in: any demo account (username = role id) with the shared
    // demo password. Throws a 401-like error on bad credentials.
    async login(username, password) {
      const roleId = String(username || '').trim().toLowerCase();
      if (!ROLES[roleId] || password !== DEMO_PASSWORD) {
        const err = new Error('Invalid username or password.');
        err.status = 401;
        throw err;
      }
      session = buildSession(roleId);
      try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
      this.bump();
      return session;
    },
    // Restore a persisted session on startup. Returns the user or null.
    async restore() {
      try {
        const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        if (saved && ROLES[saved.role]) {
          session = saved;
          this.bump();
          return session;
        }
      } catch {}
      session = null;
      return null;
    },
    logout() { try { localStorage.removeItem(SESSION_KEY); } catch {} session = null; this.bump(); },
    can(roleObj, view) { return roleObj && (roleObj.allow === '*' || roleObj.allow.includes(view)); },
    canEdit() { return !!session && session.role !== 'fan'; },
  };
})();
function useAuth() {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => AuthStore.subscribe(force), []);
  return AuthStore;
}

function LoginScreen({ onLogin }) {
  const [sel, setSel] = React.useState('admin');
  const [username, setUsername] = React.useState('admin');
  const [pw, setPw] = React.useState('bff12345');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const role = ROLES[sel];

  // Picking a role card fills in that demo account's username.
  const pickRole = (id) => { setSel(id); setUsername(id); setError(''); };

  const submit = async () => {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const user = await AuthStore.login(username.trim(), pw);
      onLogin(user.role);
    } catch (e) {
      setError(e.status === 401 ? 'Invalid username or password.' : (e.message || 'Sign in failed.'));
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight:'100%', display:'grid', gridTemplateColumns:'1.1fr 1fr', background:'var(--bg)' }}>
      {/* brand panel */}
      <div style={{ background:'linear-gradient(150deg, var(--primary-deep), var(--primary))', color:'#fff', padding:'56px 60px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-80, top:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,.06)' }}></div>
        <div style={{ position:'absolute', right:30, bottom:-90, width:240, height:240, borderRadius:'50%', background:'rgba(238,41,57,.22)' }}></div>
        <div className="row" style={{ gap:14, position:'relative' }}>
          <div className="brand-logo" style={{ width:48, height:48 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3.2l3.6 2.6-1.4 4.3H9.8L8.4 7.8 12 5.2z"/></svg></div>
          <div><div style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:18 }}>Bangladesh Football</div><div style={{ fontSize:12, opacity:.8, letterSpacing:'.14em', textTransform:'uppercase' }}>Federation · BFF</div></div>
        </div>
        <div style={{ position:'relative' }}>
          <div className="row" style={{ gap:10, marginBottom:16 }}><Flag e="🇧🇩" size={30} /><span style={{ fontSize:13, opacity:.85 }}>Central Football Management System</span></div>
          <h1 style={{ fontSize:40, lineHeight:1.05, color:'#fff', maxWidth:440 }}>One federation, every role, one secure platform.</h1>
          <p style={{ fontSize:15, opacity:.9, marginTop:16, maxWidth:420, lineHeight:1.55 }}>Sign in to access players, squads, competitions, ticketing and analytics — tailored to your role.</p>
        </div>
        <div className="row" style={{ gap:18, position:'relative', fontSize:12.5, opacity:.85 }}>
          <span>FIFA Connect</span><span>·</span><span>AFC affiliated</span><span>·</span><span>Season 2025–26</span>
        </div>
      </div>

      {/* form panel */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px' }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          <h2 style={{ fontSize:26, fontWeight:800 }}>Sign in</h2>
          <p style={{ color:'var(--ink-3)', fontSize:14, marginTop:6, marginBottom:24 }}>Pick a demo account or enter your credentials.</p>

          <div className="eyebrow" style={{ marginBottom:10 }}>Demo accounts</div>
          <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:22 }}>
            {Object.values(ROLES).map(r=>{
              const on = sel===r.id;
              return (
                <button key={r.id} onClick={()=>pickRole(r.id)} style={{ display:'flex', alignItems:'center', gap:13, padding:'13px 14px', borderRadius:12, cursor:'pointer', textAlign:'left', background: on?'color-mix(in srgb,'+r.color+' 8%,transparent)':'var(--surface)', border:'2px solid '+(on?r.color:'var(--line)'), fontFamily:'inherit', transition:'border-color .12s' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:r.color, color:'#fff', display:'grid', placeItems:'center', flex:'none' }}><Icon name={r.icon} size={19} /></div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14.5 }}>{r.label}</div>
                    <div style={{ fontSize:12, color:'var(--ink-3)' }}>{r.sub}</div>
                  </div>
                  <div style={{ width:20, height:20, borderRadius:'50%', border:'2px solid '+(on?r.color:'var(--line-strong)'), display:'grid', placeItems:'center', flex:'none' }}>{on && <div style={{ width:10, height:10, borderRadius:'50%', background:r.color }}></div>}</div>
                </button>
              );
            })}
          </div>

          <div className="eyebrow" style={{ marginBottom:8 }}>Username</div>
          <input value={username} onChange={e=>{ setUsername(e.target.value); setError(''); }} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Username" autoComplete="username"
            style={{ width:'100%', height:44, borderRadius:11, border:'1px solid var(--line-strong)', padding:'0 14px', fontFamily:'inherit', fontSize:14, color:'var(--ink)', background:'var(--surface)', outline:'none', marginBottom:12 }} />
          <div className="eyebrow" style={{ marginBottom:8 }}>Password</div>
          <input type="password" value={pw} onChange={e=>{ setPw(e.target.value); setError(''); }} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Password" autoComplete="current-password"
            style={{ width:'100%', height:44, borderRadius:11, border:'1px solid var(--line-strong)', padding:'0 14px', fontFamily:'inherit', fontSize:14, color:'var(--ink)', background:'var(--surface)', outline:'none', marginBottom:14 }} />
          {error && <div style={{ background:'color-mix(in srgb,var(--neg) 12%,transparent)', color:'var(--neg)', border:'1px solid color-mix(in srgb,var(--neg) 32%,transparent)', borderRadius:10, padding:'9px 12px', fontSize:13, marginBottom:14 }}>{error}</div>}
          <button className="btn" disabled={busy} style={{ width:'100%', height:46, justifyContent:'center', background:role.color, opacity: busy?0.7:1, cursor: busy?'default':'pointer' }} onClick={submit}>
            <Icon name="shield" size={17} /> {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <div style={{ fontSize:11.5, color:'var(--ink-faint)', textAlign:'center', marginTop:14 }}>Demo password for all accounts · <b>bff12345</b></div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ROLES, AuthStore, useAuth, LoginScreen });

