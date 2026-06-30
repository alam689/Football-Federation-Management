/* App shell — sidebar, topbar, react-router v7 routing, tweaks.
   Screen modules are imported for their window side-effects (each publishes its
   screen components onto window via the shared registry), then read back below. */
import './lib/registry.js';
import './screens/40-screens-core.jsx';
import './screens/41-screens-fms.jsx';
import './screens/42-screens-infra1.jsx';
import './screens/43-screens-infra2.jsx';
import './screens/44-screens-archive.jsx';
import './screens/45-screens-hunt.jsx';
import './screens/46-screens-federation.jsx';
import './screens/47-screens-coaching.jsx';
import './screens/48-screens-competition.jsx';
import './screens/49-screens-sponsorship.jsx';

import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams, matchPath } from 'react-router-dom';
import Copilot from './components/Copilot.jsx';

const { useState, useEffect, useRef } = React;
const {
  Icon, Flag, useAuth, useTweaks, AuthStore, ROLES, LoginScreen, confirmAction,
  TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakSelect, ConfirmRoot,
} = window;
const {
  Dashboard, PlayerSearch, PlayerProfile, PlayerManagement, Development, NationalTeams,
  Fixtures, MatchCenter, Records, Clubs, Referees, Governance, Analytics, Roadmap,
  CompetitionMgmt, ETicketing, SportsScience, Infrastructure, Archive, PlayerHunt,
  BFFCommittees, Regulations, CoachingCourses, Sponsorship,
} = window;

/* view key → { path, component }. Order mirrors the sidebar. */
const VIEWS = {
  dashboard:      { path: '/',               Comp: Dashboard },
  search:         { path: '/search',         Comp: PlayerSearch },
  profile:        { path: '/player/:id',     Comp: PlayerProfile },
  management:     { path: '/management',      Comp: PlayerManagement },
  hunt:           { path: '/hunt',            Comp: PlayerHunt },
  teams:          { path: '/teams',           Comp: NationalTeams },
  archive:        { path: '/archive',         Comp: Archive },
  clubs:          { path: '/clubs',           Comp: Clubs },
  referees:       { path: '/referees',        Comp: Referees },
  governance:     { path: '/governance',      Comp: Governance },
  competitions:   { path: '/competitions',    Comp: CompetitionMgmt },
  fixtures:       { path: '/fixtures',         Comp: Fixtures },
  matchcenter:    { path: '/matchcenter',      Comp: MatchCenter },
  ticketing:      { path: '/ticketing',        Comp: ETicketing },
  records:        { path: '/records',          Comp: Records },
  development:    { path: '/development',       Comp: Development },
  coaching:       { path: '/coaching',          Comp: CoachingCourses },
  sportsci:       { path: '/sportsci',          Comp: SportsScience },
  analytics:      { path: '/analytics',         Comp: Analytics },
  sponsorship:    { path: '/sponsorship',       Comp: Sponsorship },
  committees:     { path: '/committees',        Comp: BFFCommittees },
  regulations:    { path: '/regulations',       Comp: Regulations },
  roadmap:        { path: '/roadmap',            Comp: Roadmap },
  infrastructure: { path: '/infrastructure',     Comp: Infrastructure },
};

const NAV = [
  { group: 'Overview', items: [['dashboard', 'Dashboard', 'grid']] },
  { group: 'Football Management', items: [['search', 'Player Search', 'search'], ['management', 'Player Registration', 'user'], ['hunt', 'Player Hunt', 'star'], ['teams', 'National Teams', 'shield'], ['archive', 'Players Archive', 'history'], ['clubs', 'Clubs & Licensing', 'building'], ['referees', 'Referees', 'whistle'], ['governance', 'Transfers & Discipline', 'cards']] },
  { group: 'Competition', items: [['competitions', 'Competitions', 'table'], ['fixtures', 'Fixtures', 'cal'], ['matchcenter', 'Match Center', 'ball'], ['ticketing', 'E-Ticketing', 'ticket'], ['records', 'Records & Stats', 'trophy']] },
  { group: 'Development & Analytics', items: [['development', 'Development', 'flow'], ['coaching', 'Coaching Management', 'cap'], ['sportsci', 'Sports Science', 'health'], ['analytics', 'Analytics', 'trend']] },
  { group: 'Federation', items: [['sponsorship', 'Sponsorship', 'tag'], ['committees', 'BFF Committees', 'users'], ['regulations', 'Regulations & Legal', 'doc']] },
  { group: 'Digital Ecosystem', items: [['roadmap', 'Digital Strategy', 'globe'], ['infrastructure', 'Infrastructure', 'server']] },
];

const TWEAK_DEFAULTS = { themeHex: '#00684a', mode: 'light', density: 'regular', font: 'Archivo' };
const THEME_BY_HEX = { '#00684a': 'green', '#ee2939': 'red', '#0e6b8c': 'ink' };

const pathForView = (view, param) => {
  const def = VIEWS[view];
  if (!def) return '/';
  return param != null ? def.path.replace(/:\w+/, encodeURIComponent(param)) : def.path;
};
const viewForPath = (pathname) => Object.keys(VIEWS).find(k => matchPath(VIEWS[k].path, pathname)) || 'dashboard';

function BrandMark() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3.2l3.6 2.6-1.4 4.3H9.8L8.4 7.8 12 5.2z" /></svg>;
}

function BootSplash({ label }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="brand-logo" style={{ width: 56, height: 56, margin: '0 auto 18px', borderRadius: 16, background: 'linear-gradient(150deg, var(--primary-deep), var(--primary))', display: 'grid', placeItems: 'center' }}>
          <BrandMark />
        </div>
        <div style={{ width: 26, height: 26, margin: '0 auto 14px', border: '3px solid var(--line-strong)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'bff-spin 0.7s linear infinite' }} />
        <div style={{ fontSize: 13.5, color: 'var(--ink-3)' }}>{label}</div>
      </div>
      <style>{'@keyframes bff-spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

/* Adapts a string-routed screen ({ go, id }) to react-router params. */
function ScreenRoute({ Comp, go }) {
  const params = useParams();
  return <Comp go={go} id={params.id} />;
}

export default function App() {
  const auth = useAuth();
  const role = auth.role();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [booting, setBooting] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const contentRef = useRef(null);

  const go = (v, p = null) => navigate(pathForView(v, p));

  // Restore any persisted session on first load.
  useEffect(() => {
    let alive = true;
    AuthStore.restore().finally(() => { if (alive) setBooting(false); });
    return () => { alive = false; };
  }, []);

  // Frontend-only: the bundled static dataset (window.DATA*) is loaded
  // synchronously via the registry import, so data is ready immediately.
  useEffect(() => {
    setHydrated(!!role);
  }, [role]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEME_BY_HEX[(t.themeHex || '').toLowerCase()] || 'green');
    document.documentElement.setAttribute('data-mode', t.mode);
    document.documentElement.setAttribute('data-density', t.density);
    document.documentElement.style.setProperty('--ff-display', `'${t.font}', system-ui, sans-serif`);
  }, [t]);

  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [location.pathname]);

  if (booting) return <BootSplash label="Starting up…" />;

  if (!role) {
    return <LoginScreen onLogin={(roleId) => navigate(pathForView(ROLES[roleId].home))} />;
  }

  if (!hydrated) return <BootSplash label="Loading federation data…" />;

  const navForRole = NAV.map(sec => ({ group: sec.group, items: sec.items.filter(([k]) => auth.can(role, k)) })).filter(sec => sec.items.length);
  const currentView = viewForPath(location.pathname);
  const homePath = pathForView(role.home);

  return (
    <div className={'app' + (collapsed ? ' collapsed' : '')}>
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
                <button key={k} className={'nav-item' + (currentView === k || (currentView === 'profile' && k === 'search') ? ' active' : '')} onClick={() => go(k)} title={label}>
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
            <button className="icon-btn" title="Sign out" onClick={async () => { const ok = await confirmAction({ title: 'Sign out?', message: <>Sign out of the <b>{role.label}</b> session?</>, confirmLabel: 'Sign out', tone: 'danger', icon: 'arrowr' }); if (ok) { AuthStore.logout(); } }}><Icon name="arrowr" size={16} /></button>
          </div>
        </header>

        <main className="content" ref={contentRef}>
          <Routes>
            {Object.entries(VIEWS).map(([key, def]) =>
              auth.can(role, key) ? (
                <Route key={key} path={def.path} element={<ScreenRoute Comp={def.Comp} go={go} />} />
              ) : null
            )}
            <Route path="*" element={<Navigate to={homePath} replace />} />
          </Routes>
        </main>
      </div>

      <TweaksPanel>
        <TweakSection label="Brand theme" />
        <TweakColor label="Accent" value={t.themeHex} options={['#00684a', '#ee2939', '#0e6b8c']} onChange={(v) => setTweak('themeHex', v)} />
        <TweakRadio label="Mode" value={t.mode} options={['light', 'dark']} onChange={(v) => setTweak('mode', v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density} options={['compact', 'regular', 'comfy']} onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Typography" />
        <TweakSelect label="Display font" value={t.font} options={['Archivo', 'Oswald', 'Saira Condensed', 'Anton']} onChange={(v) => setTweak('font', v)} />
      </TweaksPanel>
      <ConfirmRoot />
      <Copilot go={go} />
    </div>
  );
}
