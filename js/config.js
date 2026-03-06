/* 
   LUMINA - CONFIGURATION ENGINE (STRICT CONSTANTS ONLY)
   Strict Phase 6: Deployment & Environment Safety.
   Strict Phase 2 Boundary Enforcement: Constants, Environment Flags, Feature Toggles.
   ❌ No DOM access, ❌ No backend calls.
*/

const LUMINA_CONFIG = {
    // 1. ENVIRONMENT CONFIG
    ENV: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'development' : 'production',
    DEBUG: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    VERSION: '1.4.0',

    // 2. FEATURE TOGGLES
    FEATURES: {
        CURSOR: false,
        TRANSITIONS: true,
        SMOOTH_SCROLL: true,
        LAZY_LOAD: true,
        ANALYTICS: true
    },

    // 3. UI DEFAULTS
    ANIMATION_DEFAULTS: {
        DURATION: 0.3,
        EASE: "power2.out"
    },

    // 4. ROUTING FALLBACKS
    PATHS: {
        HOME: 'index.html',
        LOGIN: 'login.html',
        DASHBOARD: 'dashboard.html',
        ADMIN: 'admin.html',
        ERROR: '404.html'
    }
};
