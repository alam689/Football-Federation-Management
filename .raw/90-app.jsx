/* ===== app.jsx ===== */
/* App shell — sidebar, topbar, routing, tweaks */
const { useState, useEffect } = React;

const NAV = [
  { group: 'Overview', items: [['dashboard', 'Dashboard', 'grid']] },
  { group: 'Football Management', items: [['search', 'Player Search', 'search'], ['management', 'Player Registration', 'user'], ['hunt', 'Player Hunt', 'star'], ['teams', 'National Teams', 'shield'], ['archive', 'Players Archive', 'history'], ['clubs', 'Clubs & Licensing', 'building'], ['referees', 'Referees', 'whistle'], ['governance', 'Transfers & Discipline', 'cards']] },
  { group: 'Competition', items: [['competitions', 'Competitions', 'table'], ['fixtures', 'Fixtures', 'cal'], ['matchcenter', 'Match Center', 'ball'], ['ticketing', 'E-Ticketing', 'ticket'], ['records', 'Records & Stats', 'trophy']] },
  { group: 'Development & Analytics', items: [['development', 'Development', 'flow'], ['sportsci', 'Sports Science', 'health'], ['analytics', 'Analytics', 'trend']] },
  { group: 'Federation', items: [['committees', 'BFF Committees', 'users'], ['regulations', 'Regulations & Legal', 'doc']] },
  { group: 'Digital Ecosystem', items: [['roadmap', 'Digital Strategy', 'globe'], ['infrastructure', 'Infrastructure', 'server']] },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "themeHex": "#00684a",
  "mode": "light",
  "density": "regular",
  "font": "Archivo"
}/*EDITMODE-END*/;

const THEME_BY_HEX = { '#00684a': 'green', '#ee2939': 'red', '#0e6b8c': 'ink' };

function BrandMark() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3.2l3.6 2.6-1.4 4.3H9.8L8.4 7.8 12 5.2z"/></svg>;
}

function App() {
  const auth = useAuth();
  const role = auth.role();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const parseHash = () => {
    const h = (location.hash || '').replace('#', '').split('/');
    return { view: h[0] || 'dashboard', param: h[1] || null };
  };
  const init = parseHash();
  const [view, setView] = useState(init.view);
  const [param, setParam] = useState(init.param);
  const [collapsed, setCollapsed] = useState(false);
  const contentRef = React.useRef(null);

  const go = (v, p = null) => {
    setView(v); setParam(p);
    location.hash = v + (p ? '/' + p : '');
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  useEffect(() => {
    const onHash = () => { const h = parseHash(); setView(h.view); setParam(h.param); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEME_BY_HEX[(t.themeHex || '').toLowerCase()] || 'green');
    document.documentElement.setAttribute('data-mode', t.mode);
    document.documentElement.setAttribute('data-density', t.density);
    document.documentElement.style.setProperty('--ff-display', `'${t.font}', system-ui, sans-serif`);
  }, [t]);

  // gate: not logged in → login screen
  if (!role) {
    return <LoginScreen onLogin={(id)=>{ AuthStore.login(id); const home=ROLES[id].home; setView(home); location.hash=home; }} />;
  }

  // role-restricted nav + route guard
  const navForRole = NAV.map(sec => ({ group: sec.group, items: sec.items.filter(([k]) => auth.can(role, k)) })).filter(sec => sec.items.length);
  const allowedView = auth.can(role, view) ? view : role.home;

  const titleFor = {
    dashboard: 'Dashboard', search: 'Player Search', profile: 'Player Profile',
    management: 'Player Management', development: 'Development', teams: 'National Teams',
    fixtures: 'Fixtures', records: 'Records',
  };

  return (
    <div className={'app' + (collapsed ? ' collapsed' : '')}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo"><BrandMark /></div>
          <div>
            <div className="brand-name">Bangladesh Football</div>
            <div className="brand-sub">Federation · BFF</div>
          </div>
        </div>
        <nav className="nav-scroll">
          {navForRole.map(sec => (
            <div key={sec.group}>
              <div className="nav-group-label">{sec.group}</div>
              {sec.items.map(([k, label, icon]) => (
                <button key={k} className={'nav-item' + (allowedView === k || (allowedView === 'profile' && k === 'search') ? ' active' : '')} onClick={() => go(k)} title={label}>
                  <Icon name={icon} size={18} />
                  <span className="nav-label">{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="side-foot">
          <div className="row" style={{ gap: 8 }}><Flag e="🇧🇩" size={22} /><div><b>Season 2025–26</b><div style={{ fontSize: 11 }}>FIFA & AFC affiliated</div></div></div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setCollapsed(c => !c)}><Icon name="grid" size={16} /></button>
          <div className="search-global">
            <Icon name="search" size={17} />
            <input placeholder="Search players, teams, fixtures…" onFocus={() => go('search')} />
            <span className="kbd">⌘K</span>
          </div>
          <div className="topbar-spacer"></div>
          <button className="icon-btn" title="Notifications" style={{ position: 'relative' }}>
            <Icon name="bell" size={17} />
            <span style={{ position: 'absolute', top: 7, right: 8, width: 7, height: 7, borderRadius: '50%', background: 'var(--bff-red)', border: '2px solid var(--surface)' }}></span>
          </button>
          <div className="row" style={{ gap: 10 }}>
            <div className="avatar" style={{ background: role.color }}>{role.user.initials}</div>
            <div style={{ lineHeight: 1.2 }} className="topbar-user">
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{role.user.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{role.label}</div>
            </div>
            <button className="icon-btn" title="Sign out" onClick={async ()=>{ const ok=await confirmAction({ title:'Sign out?', message:<>Sign out of the <b>{role.label}</b> session?</>, confirmLabel:'Sign out', tone:'danger', icon:'arrowr' }); if(ok){ AuthStore.logout(); } }}><Icon name="arrowr" size={16} /></button>
          </div>
        </header>

        <main className="content" ref={contentRef}>
          {allowedView === 'dashboard' && <Dashboard go={go} />}
          {allowedView === 'search' && <PlayerSearch go={go} />}
          {allowedView === 'profile' && <PlayerProfile id={param} go={go} />}
          {allowedView === 'management' && <PlayerManagement go={go} />}
          {allowedView === 'development' && <Development go={go} />}
          {allowedView === 'teams' && <NationalTeams go={go} />}
          {allowedView === 'fixtures' && <Fixtures go={go} />}
          {allowedView === 'matchcenter' && <MatchCenter go={go} />}
          {allowedView === 'records' && <Records go={go} />}
          {allowedView === 'clubs' && <Clubs go={go} />}
          {allowedView === 'referees' && <Referees go={go} />}
          {allowedView === 'governance' && <Governance go={go} />}
          {allowedView === 'analytics' && <Analytics go={go} />}
          {allowedView === 'roadmap' && <Roadmap go={go} />}
          {allowedView === 'competitions' && <CompetitionMgmt go={go} />}
          {allowedView === 'ticketing' && <ETicketing go={go} />}
          {allowedView === 'sportsci' && <SportsScience go={go} />}
          {allowedView === 'infrastructure' && <Infrastructure go={go} />}
          {allowedView === 'archive' && <Archive go={go} />}
          {allowedView === 'hunt' && <PlayerHunt go={go} />}
          {allowedView === 'committees' && <BFFCommittees go={go} />}
          {allowedView === 'regulations' && <Regulations go={go} />}
        </main>
      </div>

      {/* TWEAKS */}
      <TweaksPanel>
        <TweakSection label="Brand theme" />
        <TweakColor label="Accent" value={t.themeHex}
          options={['#00684a', '#ee2939', '#0e6b8c']}
          onChange={(v) => setTweak('themeHex', v)} />
        <TweakRadio label="Mode" value={t.mode} options={['light', 'dark']} onChange={(v) => setTweak('mode', v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density} options={['compact', 'regular', 'comfy']} onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Typography" />
        <TweakSelect label="Display font" value={t.font} options={['Archivo', 'Oswald', 'Saira Condensed', 'Anton']} onChange={(v) => setTweak('font', v)} />
      </TweaksPanel>
      <ConfirmRoot />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
