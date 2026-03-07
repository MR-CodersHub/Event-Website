/**
 * LUMINA - GLOBAL ACCOUNT DROPDOWN COMPONENT
 * Standardizes the user account dropdown menu across all pages.
 */

const AccountDropdown = {
    init: function () {
        // Find all possible account dropdowns
        const desktopDropdowns = document.querySelectorAll('.profile-dropdown .dropdown-menu, .premium-dropdown .premium-dropdown-menu');
        const mobileContent = document.getElementById('mobile-account-content');

        // Find the script tag to determine depth reliably
        const scriptTag = document.querySelector('script[src*="account-dropdown.js"]');
        let prefix = '';

        if (scriptTag) {
            const src = scriptTag.getAttribute('src');
            const depth = (src.match(/\.\.\//g) || []).length;
            for (let i = 0; i < depth; i++) {
                prefix += '../';
            }
        } else {
            // Fallback to simpler detection if script tag not found
            const path = window.location.pathname;
            if (path.includes('/admin/') || path.includes('/user/') || path.includes('/home-niche/')) {
                prefix = '../';
            }
        }

        const loginUrl = `${prefix}login.html`;
        const adminUrl = `${prefix}admin/index.html`;
        const userUrl = `${prefix}user/index.html`;

        // Standard Desktop HTML
        const desktopHTML = `
            <a href="${loginUrl}" class="dropdown-item">Login / Sign Up</a>
            <a href="${adminUrl}" class="dropdown-item">Admin Dashboard</a>
            <a href="${userUrl}" class="dropdown-item">User Dashboard</a>
        `;

        // Standard Mobile HTML
        const mobileHTML = `
            <!-- Handle Bar -->
            <div class="flex justify-center pt-4 pb-2">
                <div class="w-12 h-1 bg-white/20 rounded-full"></div>
            </div>

            <!-- Header -->
            <div class="px-6 py-4 border-b border-white/5">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Registry Protocol</p>
                        <p class="text-sm font-bold text-white mt-1">Account Access</p>
                    </div>
                    <button id="mobile-account-close" class="text-white/60 hover:text-white transition-colors p-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Menu Items -->
            <div class="px-6 py-8 space-y-4">
                <!-- Login / Sign Up -->
                <a href="${loginUrl}" class="flex items-center gap-4 py-3 border-b border-white/5 group">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Authorize Entry</p>
                        <p class="text-sm font-bold text-white whitespace-nowrap">Login / Sign Up</p>
                    </div>
                </a>

                <!-- Admin Dashboard -->
                <a href="${adminUrl}" class="flex items-center gap-4 py-3 border-b border-white/5 group">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Control Panel</p>
                        <p class="text-sm font-bold text-white">Admin Dashboard</p>
                    </div>
                </a>

                <!-- User Dashboard -->
                <a href="${userUrl}" class="flex items-center gap-4 py-3 group">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">User Portal</p>
                        <p class="text-sm font-bold text-white">User Dashboard</p>
                    </div>
                </a>
            </div>
            <div class="h-8"></div>
        `;

        // Inject content
        desktopDropdowns.forEach(dropdown => {
            dropdown.innerHTML = desktopHTML;
        });

        if (mobileContent) {
            mobileContent.innerHTML = mobileHTML;
        }

        if (window.LUMINA_CONFIG?.DEBUG) {
            console.log('✅ Account Dropdowns Standardized (Depth detected from script tag)');
        }
    }
};

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AccountDropdown.init());
} else {
    AccountDropdown.init();
}
