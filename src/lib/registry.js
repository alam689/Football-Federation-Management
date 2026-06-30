/* Shared global registry.
   Imports run in order: data populates window.DATA*, then components publish
   UI primitives onto window, then tweaks, then auth (which reads window.Icon/Flag).
   Every screen module imports this first so the window bridge is ready. */
import '../data/index.js';
import './components.jsx';
import './tweaks.jsx';
import './auth.jsx';
