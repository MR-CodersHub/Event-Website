/**
 * LUMINA - ENHANCED ACCOUNT INTERACTION HANDLER
 * Ensures reliable, smooth user account icon functionality across all pages and devices
 * Version: 2.0 - Production Ready
 */

(function () {
    'use strict';

    // ========================================
    // 1. INITIALIZATION & STATE MANAGEMENT
    // ========================================

    const AccountInteraction = {
        state: {
            desktopDropdownOpen: false,
            mobileSheetOpen: false,
            mobileMenuOpen: false,
            initialized: false
        },

        elements: {
            // Desktop
            profileDropdowns: null,
            dropdownMenus: null,

            // Mobile
            mobileAccountToggle: null,
            mobileAccountSheet: null,
            mobileAccountBackdrop: null,
            mobileAccountContent: null,
            mobileAccountClose: null,

            // Mobile Menu
            mobileMenuToggle: null,
            mobileMenu: null,
            mobileMenuClose: null
        },

        // ========================================
        // 2. INITIALIZATION
        // ========================================

        init() {
            if (this.state.initialized) return;

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        },

        setup() {
            this.initGlobalListeners();
            this.state.initialized = true;

            if (window.LUMINA_CONFIG?.DEBUG) {
                console.log('✅ Account Interaction System Initialized (Event Delegation)');
            }
        },

        // ========================================
        // 3. GLOBAL EVENT DELEGATION
        // ========================================

        initGlobalListeners() {
            // Main Click Delegate
            document.addEventListener('click', (e) => {
                this.handleGlobalClick(e);
            });

            // Touch Delegate for specific mobile interactions if needed
            // Note: Click usually suffices for toggles, but touchstart can be faster. 
            // We'll stick to click for consistency and to avoid double-firing with touch+click

            // Keydown Delegate
            document.addEventListener('keydown', (e) => {
                this.handleGlobalKeydown(e);
            });

            // Browser Back
            window.addEventListener('popstate', () => {
                this.closeAll();
            });

            // Visibility Change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.closeAll();
                }
            });

            // Swipe handling (specific element listener still needed/useful)
            // We can attach this dynamically when sheet opens or check existence
            this.setupSwipeObserver();
        },

        handleGlobalClick(e) {
            const target = e.target;

            // 1. Mobile Account Toggle
            const accountToggle = target.closest('#mobile-account-toggle');
            if (accountToggle) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileAccountSheet();
                return;
            }

            // 2. Mobile Account Close (Button or Backdrop)
            const accountClose = target.closest('#mobile-account-close');
            const accountBackdrop = target.closest('#mobile-account-backdrop');
            if (accountClose || (accountBackdrop && this.state.mobileSheetOpen)) {
                e.preventDefault();
                e.stopPropagation();
                this.closeMobileAccountSheet();
                return;
            }

            // 3. Mobile Menu Toggle - DELEGATED TO app.js
            /*
            const menuToggle = target.closest('#mobile-menu-toggle, .mobile-menu-toggle');
            if (menuToggle) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
                return;
            }

            // 4. Mobile Menu Close
            const menuClose = target.closest('#mobile-menu-close, .mobile-menu-close');
            const menuBackdrop = target.closest('#mobile-menu-backdrop');
            if (menuClose || (menuBackdrop && this.state.mobileMenuOpen)) {
                e.preventDefault();
                e.stopPropagation();
                this.closeMobileMenu();
                return;
            }
            */

            // 5. Desktop Dropdown Trigger
            const dropdownTrigger = target.closest('.profile-trigger');
            if (dropdownTrigger) {
                e.preventDefault();
                e.stopPropagation();
                const container = dropdownTrigger.closest('.profile-dropdown');
                if (container) {
                    const dropdown = container.querySelector('.dropdown-menu');
                    if (dropdown) this.toggleDesktopDropdown(dropdown);
                }
                return;
            }

            // 6. Click Outside Logic
            if (this.state.desktopDropdownOpen && !target.closest('.profile-dropdown')) {
                this.closeAllDesktopDropdowns();
            }

            // 7. Navigation Links inside Mobile Sheet (Close on click)
            if (this.state.mobileSheetOpen && target.closest('#mobile-account-content a')) {
                // Allow default navigation, but close sheet
                setTimeout(() => this.closeMobileAccountSheet(), 200);
            }

            // 8. Navigation Links inside Mobile Menu (Close on click) - DELEGATED TO app.js
            /*
            if (this.state.mobileMenuOpen && target.closest('#mobile-menu a')) {
                setTimeout(() => this.closeMobileMenu(), 300);
            }
            */
        },

        handleGlobalKeydown(e) {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        },

        closeAll() {
            this.closeAllDesktopDropdowns();
            this.closeMobileAccountSheet();
            // this.closeMobileMenu(); // Degelated
        },

        // ========================================
        // 4. DESKTOP DROPDOWN LOGIC
        // ========================================

        toggleDesktopDropdown(dropdown) {
            const isActive = dropdown.classList.contains('active');
            this.closeAllDesktopDropdowns(); // Close others

            if (!isActive) {
                dropdown.classList.add('active');
                this.state.desktopDropdownOpen = true;
            }
        },

        closeAllDesktopDropdowns() {
            document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                menu.classList.remove('active');
            });
            this.state.desktopDropdownOpen = false;
        },

        // ========================================
        // 5. MOBILE ACCOUNT SHEET LOGIC
        // ========================================

        toggleMobileAccountSheet() {
            if (this.state.mobileSheetOpen) {
                this.closeMobileAccountSheet();
            } else {
                this.openMobileAccountSheet();
            }
        },

        openMobileAccountSheet() {
            if (this.state.isAnimating) return; // Debounce

            const sheet = document.getElementById('mobile-account-sheet');
            const backdrop = document.getElementById('mobile-account-backdrop');
            const content = document.getElementById('mobile-account-content');

            if (!sheet || !content) return;

            this.state.isAnimating = true;

            // Close other menus - Use global app function
            if (window.LuminaApp && window.LuminaApp.closeMobileMenu) {
                window.LuminaApp.closeMobileMenu();
            }

            // Activate
            sheet.classList.add('active');
            sheet.setAttribute('aria-hidden', 'false');
            this.state.mobileSheetOpen = true;
            document.body.classList.add('no-scroll');

            // GSAP Animation
            if (window.gsap) {
                // Ensure content always starts from offscreen — guards against interrupted close animations
                gsap.set(content, { y: '100%' });
                if (backdrop) gsap.set(backdrop, { opacity: 0 });
                if (backdrop) gsap.to(backdrop, { opacity: 1, duration: 0.4, ease: "power2.out" });
                gsap.to(content, {
                    y: 0,
                    duration: 0.6,
                    ease: "power4.out",
                    onComplete: () => { this.state.isAnimating = false; }
                });
            } else {
                setTimeout(() => { this.state.isAnimating = false; }, 300);
            }
        },

        closeMobileAccountSheet() {
            if (this.state.isAnimating && this.state.mobileSheetOpen) return;

            const sheet = document.getElementById('mobile-account-sheet');
            const backdrop = document.getElementById('mobile-account-backdrop');
            const content = document.getElementById('mobile-account-content');

            if (!sheet || !this.state.mobileSheetOpen) return;

            this.state.isAnimating = true;
            this.state.mobileSheetOpen = false;
            sheet.setAttribute('aria-hidden', 'true');

            if (window.gsap) {
                if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: "power2.in" });
                gsap.to(content, {
                    y: '100%',
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        sheet.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                        this.state.isAnimating = false;
                    }
                });
            } else {
                sheet.classList.remove('active');
                document.body.classList.remove('no-scroll');
                this.state.isAnimating = false;
            }
        },

        // ========================================
        // 6. MOBILE MENU LOGIC - DELEGATED TO app.js
        // ========================================
        /*
        toggleMobileMenu() {
            if (this.state.mobileMenuOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        },

        openMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            let backdrop = document.getElementById('mobile-menu-backdrop');

            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'mobile-menu-backdrop';
                backdrop.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[55] opacity-0 pointer-events-none transition-opacity duration-300';
                document.body.appendChild(backdrop);
            }

            if (!menu) return;

            this.closeMobileAccountSheet(); 

            this.state.mobileMenuOpen = true;
            menu.classList.remove('-translate-y-full', 'pointer-events-none');
            menu.classList.add('pointer-events-auto');

            backdrop.classList.remove('pointer-events-none');
            backdrop.classList.add('pointer-events-auto');

            document.body.classList.add('no-scroll');

            if (window.gsap) {
                gsap.to(backdrop, { opacity: 1, duration: 0.4 });
                gsap.fromTo(menu, { y: '-100%' }, { y: '0%', duration: 0.6, ease: "power4.out" });
            }
        },

        closeMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            const backdrop = document.getElementById('mobile-menu-backdrop');

            if (!menu || !this.state.mobileMenuOpen) return;

            this.state.mobileMenuOpen = false;

            if (window.gsap) {
                if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.3 });
                gsap.to(menu, {
                    y: '-100%',
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        menu.classList.add('-translate-y-full', 'pointer-events-none');
                        menu.classList.remove('pointer-events-auto');
                        if (backdrop) {
                            backdrop.classList.add('pointer-events-none');
                            backdrop.classList.remove('pointer-events-auto');
                        }
                        document.body.classList.remove('no-scroll');
                    }
                });
            } else {
                menu.classList.add('-translate-y-full');
                menu.classList.add('pointer-events-none'); 
                document.body.classList.remove('no-scroll');
            }
        },
        */

        // ========================================
        // 7. SWIPE OBSERVER (Dynamic)
        // ========================================

        setupSwipeObserver() {
            // Watch for the content element appearing in DOM
            const observer = new MutationObserver((mutations) => {
                const sheetContent = document.getElementById('mobile-account-content');
                if (sheetContent && !sheetContent.dataset.swipeInitialized) {
                    this.initSwipeToClose(sheetContent);
                    sheetContent.dataset.swipeInitialized = 'true';
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Initial check
            const sheetContent = document.getElementById('mobile-account-content');
            if (sheetContent) {
                this.initSwipeToClose(sheetContent);
                sheetContent.dataset.swipeInitialized = 'true';
            }
        },

        initSwipeToClose(element) {
            let startY = 0;
            let currentY = 0;
            let isDragging = false;

            element.addEventListener('touchstart', (e) => {
                // If content is scrolled, don't trigger swipe close immediately unless at top
                if (element.scrollTop > 0) return;

                startY = e.touches[0].clientY;
                isDragging = true;
            }, { passive: true });

            element.addEventListener('touchmove', (e) => {
                if (!isDragging) return;

                currentY = e.touches[0].clientY;
                const diff = currentY - startY;

                // Only allow downward swipe
                if (diff > 0) {
                    element.style.transform = `translateY(${diff}px)`;
                    // Optional: fade backdrop
                }
            }, { passive: true });

            element.addEventListener('touchend', () => {
                if (!isDragging) return;

                const diff = currentY - startY;
                isDragging = false;

                if (diff > 120) {
                    this.closeMobileAccountSheet();
                } else {
                    // Snap back
                    if (window.gsap) {
                        gsap.to(element, { y: 0, duration: 0.4, ease: "back.out(1.2)" });
                    } else {
                        element.style.transform = 'translateY(0)';
                    }
                }
                startY = 0;
                currentY = 0;
            });
        }
    };

    // ========================================
    // 8. AUTO-INITIALIZE
    // ========================================

    AccountInteraction.init();

    // Expose to global scope for debugging
    if (window.LUMINA_CONFIG?.DEBUG) {
        window.AccountInteraction = AccountInteraction;
    }

})();
