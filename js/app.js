/**
 * LUMINA - MASTER APPLICATION SCRIPT (PHASE 6: DEPLOYMENT SAFETY)
 * STABILIZED VERSION: Defensive DOM, Error Boundaries, Functional Fallbacks.
 */

const LuminaApp = {
    state: {
        initialized: false,
        isMobile: window.innerWidth < 768
    },

    // 1. Defensive Shield
    safe: function (fn, context) {
        try {
            fn.call(this);
        } catch (e) {
            console.error(`LuminaApp: [${context}] fault avoided.`, e.message);
        }
    },

    init: function () {
        if (this.state.initialized) return;

        document.addEventListener("DOMContentLoaded", () => {
            this.safe(this.initNavigation, 'Navigation System');
            this.safe(this.initMobileMenu, 'Mobile Menu');
            this.safe(this.initMobileAccountSheet, 'Mobile Account Sheet');
            this.safe(this.initModal, 'Modal System');
            this.safe(this.initFormHandlers, 'Form Controllers');

            window.dispatchEvent(new CustomEvent('components:loaded'));
        });

        window.addEventListener('components:loaded', () => {
            this.state.initialized = true;
            if (document.body) document.body.classList.add('app-ready');
            if (LUMINA_CONFIG.DEBUG) console.log("LuminaApp: All systems operational.");
        });
    },

    // 2. DEFENSIVE DOM HANDLERS
    initNavigation: function () {
        const links = document.querySelectorAll('a[href]');
        if (!links.length) return;

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;

            link.addEventListener('click', (e) => {
                if (e.metaKey || e.ctrlKey) return;
                e.preventDefault();
                if (window.LuminaAnimations?.triggerPageTransition) {
                    window.LuminaAnimations.triggerPageTransition(href);
                } else {
                    window.location.href = href;
                }
            });
        });

        // 3. Profile Dropdown Logic
        const profileDropdowns = document.querySelectorAll('.profile-dropdown');

        profileDropdowns.forEach(container => {
            const trigger = container.querySelector('.profile-trigger');
            const dropdown = container.querySelector('.dropdown-menu');

            if (trigger && dropdown) {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Close others
                    document.querySelectorAll('.dropdown-menu.active').forEach(d => {
                        if (d !== dropdown) d.classList.remove('active');
                    });
                    dropdown.classList.toggle('active');
                });

                // Keyboard Accessibility
                trigger.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        trigger.click();
                    }
                });
            }
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu.active').forEach(d => d.classList.remove('active'));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.dropdown-menu.active').forEach(d => d.classList.remove('active'));
            }
        });
    },

    initMobileMenu: function () {
        const menu = document.getElementById('mobile-menu');
        const toggles = document.querySelectorAll('#mobile-menu-toggle, .mobile-menu-toggle');
        const closeBtns = document.querySelectorAll('#mobile-menu-close, .mobile-menu-close');

        if (!menu || !toggles.length) return;

        // Create Dynamic Backdrop if it doesn't exist
        let backdrop = document.getElementById('mobile-menu-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'mobile-menu-backdrop';
            // DISPLAY-BASED: hidden by default so it never sits in the touch tree when closed
            backdrop.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[55] opacity-0 transition-opacity duration-300';
            backdrop.style.display = 'none';
            document.body.appendChild(backdrop);
        }

        const openMenu = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            // Close account sheet if open
            if (this.closeMobileAccountSheet) this.closeMobileAccountSheet();

            // Show backdrop before animating (display:none → block)
            backdrop.style.display = 'block';

            if (window.gsap) {
                gsap.set(menu, { display: 'flex' });
                gsap.set(backdrop, { opacity: 0 });
                gsap.to(backdrop, { opacity: 1, duration: 0.4 });
                gsap.fromTo(menu,
                    { y: '-100%', opacity: 0 },
                    { y: '0%', opacity: 1, duration: 0.6, ease: "power4.out" }
                );

                const links = menu.querySelectorAll('li, .mt-auto > *');
                gsap.fromTo(links,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, delay: 0.2, ease: "power2.out" }
                );
            } else {
                backdrop.style.opacity = '1';
                menu.style.transform = 'translateY(0)';
                menu.style.display = 'flex';
                menu.style.opacity = '1';
            }

            // Close menu when a link is clicked
            const menuLinks = menu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Small delay for UX before closing
                    setTimeout(() => closeMenu(), 100);
                });
            });

            // Close on Backdrop Click
            backdrop.onclick = (e) => {
                e.preventDefault();
                closeMenu();
            };
        };

        const closeMenu = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (window.gsap) {
                gsap.to(backdrop, { opacity: 0, duration: 0.3 });
                gsap.to(menu, {
                    y: '-100%',
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        // DISPLAY-BASED: hide both elements completely from the DOM touch tree
                        menu.style.display = 'none';
                        backdrop.style.display = 'none';
                        document.body.classList.remove('no-scroll');
                    }
                });
            } else {
                backdrop.style.opacity = '0';
                menu.style.transform = 'translateY(-100%)';
                menu.style.opacity = '0';
                setTimeout(() => {
                    menu.style.display = 'none';
                    backdrop.style.display = 'none';
                    document.body.classList.remove('no-scroll');
                }, 400);
            }
            menu.setAttribute('aria-hidden', 'true');
        };

        // Improved Toggling
        const toggleMenu = (e) => {
            // DISPLAY-BASED: check if menu is currently hidden (display:none = closed)
            if (menu.style.display === 'none' || menu.style.display === '') {
                openMenu(e);
            } else {
                closeMenu(e);
            }
        };

        toggles.forEach(toggle => {
            toggle.addEventListener('click', toggleMenu);
            // touchstart removed: double-fires alongside click on mobile
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', closeMenu);
            // touchstart removed: same reason
        });

        // Tap on backdrop to close
        backdrop.addEventListener('click', closeMenu);

        // Tap on the menu container itself (if it's full screen)
        menu.addEventListener('click', (e) => {
            if (e.target === menu) closeMenu(e);
        });

        // Close on link click
        menu.querySelectorAll('a').forEach(l => {
            l.addEventListener('click', () => {
                setTimeout(() => closeMenu(), 300);
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.style.display !== 'none' && menu.style.display !== '') {
                closeMenu();
            }
        });

        // Global Resize Listener - only on wider screens
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && menu.style.display !== 'none' && menu.style.display !== '') {
                closeMenu();
            }
        });

        this.closeMobileMenu = closeMenu;
    },

    initMobileAccountSheet: function () {
        const sheet = document.getElementById('mobile-account-sheet');
        const toggles = document.querySelectorAll('#mobile-account-toggle');
        const closeBtns = document.querySelectorAll('#mobile-account-close');
        const backdrop = document.getElementById('mobile-account-backdrop');
        const content = document.getElementById('mobile-account-content');

        if (!sheet || !content || !toggles.length) return;

        let isOpen = false;

        const openSheet = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (isOpen) return;

            // Close mobile menu if open
            if (this.closeMobileMenu) this.closeMobileMenu();

            // DISPLAY-BASED: make sheet visible before animating
            sheet.style.display = 'block';
            isOpen = true;

            if (window.gsap) {
                // Always start from resting position to avoid stale GSAP state
                gsap.set(content, { y: '100%' });
                if (backdrop) gsap.set(backdrop, { opacity: 0 });
                if (backdrop) gsap.to(backdrop, { opacity: 1, duration: 0.4 });
                gsap.to(content, { y: 0, duration: 0.7, ease: "power4.out" });
            } else {
                if (backdrop) backdrop.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }

            document.body.classList.add('no-scroll');
            sheet.setAttribute('aria-hidden', 'false');
        };

        const closeSheet = (e) => {
            if (e) {
                if (typeof e.preventDefault === 'function') e.preventDefault();
                if (typeof e.stopPropagation === 'function') e.stopPropagation();
            }
            if (!isOpen) return;
            isOpen = false;

            if (window.gsap) {
                if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.3 });
                gsap.to(content, {
                    y: '100%', duration: 0.5, ease: "power2.in",
                    onComplete: () => {
                        // DISPLAY-BASED: remove from touch tree completely
                        sheet.style.display = 'none';
                        document.body.classList.remove('no-scroll');
                    }
                });
            } else {
                if (backdrop) backdrop.style.opacity = '0';
                content.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    sheet.style.display = 'none';
                    document.body.classList.remove('no-scroll');
                }, 300);
            }
            sheet.setAttribute('aria-hidden', 'true');
        };

        toggles.forEach(toggle => {
            toggle.addEventListener('click', openSheet);
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', closeSheet);
        });

        if (backdrop) backdrop.addEventListener('click', closeSheet);

        // Close on link click
        content.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => closeSheet(), 150);
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) closeSheet();
        });

        // Resize Listener — close on desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && isOpen) closeSheet();
        });

        // Handle swipe down to close
        let startY = 0;
        let currentY = 0;

        content.addEventListener('touchstart', (e) => {
            if (content.scrollTop > 0) return;
            startY = e.touches[0].clientY;
        }, { passive: true });

        content.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            if (diff > 0) {
                content.style.transform = `translateY(${diff}px)`;
                if (backdrop) backdrop.style.opacity = String(1 - (diff / 500));
            }
        }, { passive: true });

        content.addEventListener('touchend', () => {
            const diff = currentY - startY;
            if (diff > 120) {
                closeSheet();
            } else {
                if (window.gsap) {
                    gsap.to(content, { y: 0, duration: 0.4, ease: "back.out(1.2)" });
                    if (backdrop) gsap.to(backdrop, { opacity: 1, duration: 0.4 });
                } else {
                    content.style.transform = 'translateY(0)';
                    if (backdrop) backdrop.style.opacity = '1';
                }
            }
            startY = 0;
            currentY = 0;
        });

        this.closeMobileAccountSheet = closeSheet;
    },

    // 3. REAL DATA MANAGEMENT
    Data: {
        get: (key) => JSON.parse(localStorage.getItem(`lumina_${key}`)) || [],
        save: (key, item) => {
            const items = LuminaApp.Data.get(key);
            items.push({ ...item, id: Date.now(), timestamp: new Date().toISOString() });
            localStorage.setItem(`lumina_${key}`, JSON.stringify(items));
        }
    },

    initFormHandlers: function () {
        // ROUTE GUARD: PROTECT ADMIN CONTROL PANEL
        const isControlPanel = window.location.pathname.includes('/admin/');
        const userRole = localStorage.getItem('lumina_role');

        if (isControlPanel && userRole !== 'admin') {
            window.location.href = '../../login.html'; // Redirect to Login
            return;
        }

        // AUTH STATE SYNC
        const authKey = localStorage.getItem('lumina_auth');
        const statusTexts = document.querySelectorAll('.dropdown-menu .text-accent');
        const statusLabels = document.querySelectorAll('.dropdown-menu .text-slate-400');

        if (authKey) {
            statusTexts.forEach(t => {
                t.textContent = "Authorized Access";
                t.classList.add('text-primary');
            });
            statusLabels.forEach(l => l.textContent = "Registry Identity: " + authKey.split('@')[0]);

            // Transform Auth links to Profile/Logout
            // Transform Auth links to Profile/Logout
            const role = localStorage.getItem('lumina_role');

            // Desktop Dropdown Links
            document.querySelectorAll('.dropdown-item').forEach(link => {
                const href = link.getAttribute('href') || "";
                if (href.endsWith('login.html')) {
                    link.textContent = "Dashboard";
                    const prefix = href.replace('login.html', '');
                    link.href = (role === 'admin') ? prefix + 'admin/index.html' : prefix + 'user/index.html';
                } else if (href.endsWith('signup.html')) {
                    link.textContent = "Log Out";
                    link.href = "#";
                    link.classList.add('logout-trigger');
                }
            });

            // Mobile Navigation Transform
            const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
            const mobileAccountLinks = document.querySelectorAll('#mobile-account-content a');

            const transformLinks = (links) => {
                links.forEach(link => {
                    const href = link.getAttribute('href') || "";
                    if (href.endsWith('login.html')) {
                        const title = link.querySelector('p.text-sm');
                        if (title) title.textContent = "Access Dashboard";
                        else link.textContent = "Dashboard";

                        const prefix = href.replace('login.html', '');
                        link.href = (role === 'admin') ? prefix + 'admin/index.html' : prefix + 'user/index.html';
                    } else if (href.endsWith('signup.html')) {
                        const title = link.querySelector('p.text-sm');
                        if (title) title.textContent = "Terminate Session";
                        else link.textContent = "Log Out";

                        link.href = "#";
                        link.classList.add('logout-trigger');
                    }
                });
            };

            transformLinks(mobileMenuLinks);
            transformLinks(mobileAccountLinks);

            // Show Admin Dashboard button in mobile account sheet if admin
            if (role === 'admin') {
                const adminLink = document.getElementById('mobile-admin-link');
                if (adminLink) {
                    // Set the correct path relative to current page depth
                    const depth = window.location.pathname.split('/').filter(Boolean).length;
                    const prefix = depth <= 1 ? '' : '../'.repeat(depth - 1);
                    adminLink.href = prefix + 'admin/index.html';
                    adminLink.style.display = 'flex';
                }
            }
        }

        // Global Logout Handler
        document.addEventListener('click', (e) => {
            const logoutBtn = e.target.closest('.logout-trigger');
            if (logoutBtn) {
                e.preventDefault();
                if (confirm('Terminate operational session and clear registry access?')) {
                    localStorage.removeItem('lumina_auth');
                    localStorage.removeItem('lumina_role');
                    window.location.reload();
                }
            }
        });

        // CONTACT / INQUIRY
        const contactForm = document.getElementById('contact-form') || document.getElementById('inquiry-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());

                const btn = contactForm.querySelector('button');
                const originalText = btn?.textContent;

                if (btn) {
                    btn.disabled = true;
                    btn.textContent = "Processing...";
                }

                LuminaApp.Data.save('inquiries', data);

                setTimeout(() => {
                    LuminaApp.toast("Message received. Our team will contact you shortly.");
                    contactForm.reset();
                    if (btn) {
                        btn.disabled = false;
                        btn.textContent = originalText;
                    }
                }, 1500);
            });
        }

        // SUBSCRIPTION FORM
        const subForm = document.querySelector('form:has(input[type="email"])');
        if (subForm && !subForm.id) { // Targeting the subscription form in footer/blog
            subForm.addEventListener('submit', (e) => {
                const emailInput = subForm.querySelector('input[type="email"]');
                if (emailInput) {
                    e.preventDefault();
                    LuminaApp.Data.save('subscriptions', { email: emailInput.value });
                    LuminaApp.toast("Strategic encryption synchronized. Welcome to the feed.");
                    subForm.reset();
                }
            });
        }

        // AUTH FORMS
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = loginForm.querySelector('input[name="email"]');
                const email = emailInput ? emailInput.value.trim() : 'guest@lumina.studio';
                
                // Directly authorize and redirect to User Dashboard
                localStorage.setItem('lumina_auth', email);
                localStorage.setItem('lumina_role', 'user');
                
                LuminaApp.toast("Access Authorized. Redirecting to Portal...");
                
                setTimeout(() => {
                    let prefix = "";
                    const path = window.location.pathname;
                    if (path.includes('additional-pages')) {
                        prefix = "../../../";
                    } else if (path.includes('home-niche')) {
                        prefix = "../";
                    }
                    window.location.href = prefix + 'user/index.html';
                }, 800);
            });
        }

        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(signupForm);
                const data = Object.fromEntries(formData.entries());

                LuminaApp.Data.save('users', data);
                localStorage.setItem('lumina_auth', data.email);
                localStorage.setItem('lumina_role', 'user');

                LuminaApp.toast("Registry Entry Initialized. Welcome to Lumina.");
                setTimeout(() => {
                    let prefix = "";
                    const path = window.location.pathname;
                    if (path.includes('additional-pages')) {
                        prefix = "../../../";
                    } else if (path.includes('home-niche')) {
                        prefix = "../";
                    }
                    window.location.href = prefix + 'user/index.html';
                }, 1000);
            });
        }

        // POPULATE DASHBOARDS
        if (window.location.pathname.includes('/user/')) this.populateUserDashboard();
        if (window.location.pathname.includes('/admin/')) this.populateAdminDashboard();
    },

    populateUserDashboard: function () {
        const welcomeName = document.querySelector('.stagger-reveal h1 span:last-child');
        const accountOrg = document.querySelector('.stagger-reveal .bg-white\\/5 div p:last-child');
        const userInitial = document.querySelector('.stagger-reveal .bg-white\\/5 .bg-primary');
        const projectList = document.getElementById('active-briefings');
        const emptyState = document.getElementById('briefings-empty');
        const loader = document.getElementById('briefings-loader');

        const authEmail = localStorage.getItem('lumina_auth');
        if (!authEmail) return;

        const users = LuminaApp.Data.get('users');
        const currentUser = users.find(u => u.email === authEmail) || { email: authEmail, organization: "Global Operations" };

        if (welcomeName && accountOrg) {
            const name = currentUser.name || authEmail.split('@')[0];
            welcomeName.textContent = name.split(' ')[0] + '.';
            accountOrg.textContent = currentUser.organization;
            if (userInitial) userInitial.textContent = name.charAt(0).toUpperCase() + (name.split(' ')[1]?.charAt(0).toUpperCase() || '');
        }

        if (projectList && emptyState) {
            const inquiries = LuminaApp.Data.get('inquiries').filter(inv => inv.email === authEmail);

            if (loader) loader.classList.remove('hidden');
            emptyState.classList.add('hidden');

            setTimeout(() => {
                if (loader) loader.classList.add('hidden');

                if (inquiries.length > 0) {
                    emptyState.classList.add('hidden');
                    const cards = inquiries.reverse().map(inv => `
                        <div class="bg-slate-900/50 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-12 group hover:border-primary/20 transition-all fade-in-up">
                            <div class="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div class="space-y-2">
                                    <h5 class="text-4xl font-black font-heading text-white uppercase tracking-tight">${(inv.requirements || 'Briefing').substring(0, 30)}...</h5>
                                    <div class="flex items-center gap-4">
                                        <span class="text-[10px] text-primary font-black uppercase tracking-widest px-4 py-1.5 bg-primary/10 inline-block rounded-full">Status: In Review</span>
                                        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">— ID: ${inv.id.toString().slice(-6)}</span>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Timestamp</p>
                                    <p class="text-xs font-black text-white uppercase tracking-widest">${new Date(inv.timestamp).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div class="space-y-6">
                                <div class="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                    <span>Verification Phase</span>
                                    <span class="text-primary italic">Awaiting Audit</span>
                                </div>
                                <div class="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                                    <div class="bg-gradient-to-r from-primary/20 to-primary/40 h-full w-[15%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    `).join('');

                    const header = `
                        <div class="flex items-center gap-4 mb-8">
                            <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Active Operational Briefings</h4>
                            <div class="h-px flex-1 bg-white/5"></div>
                        </div>
                    `;
                    projectList.innerHTML = header + cards;
                } else {
                    emptyState.classList.remove('hidden');
                }
            }, 800);
        }
    },

    populateAdminDashboard: function () {
        const tableBody = document.getElementById('inquiries-body');
        const emptyTable = document.getElementById('inquiries-empty');
        const userManifest = document.getElementById('user-manifest');
        const statBriefings = document.getElementById('stat-briefings');
        const statFlow = document.getElementById('stat-flow');

        // Stats Check
        const inquiries = LuminaApp.Data.get('inquiries');
        const users = LuminaApp.Data.get('users');

        if (statBriefings) statBriefings.textContent = inquiries.length;
        if (statFlow) statFlow.textContent = users.length;

        // Inquiries Table
        if (tableBody) {
            if (inquiries.length > 0) {
                if (emptyTable) emptyTable.classList.add('hidden');
                tableBody.innerHTML = inquiries.reverse().map(inv => `
                    <tr class="hover:bg-white/5 transition-colors group">
                        <td class="p-10 text-sm font-black text-white uppercase tracking-widest">${inv.organization || 'Independent'}</td>
                        <td class="p-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">${(inv.requirements || 'Digital').substring(0, 20)}...</td>
                        <td class="p-10 text-right">
                            <span class="px-5 py-2 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase italic tracking-widest border border-primary/20">Pending Audit</span>
                        </td>
                    </tr>
                `).join('');
            } else {
                if (emptyTable) emptyTable.classList.remove('hidden');
                tableBody.innerHTML = '';
            }
        }

        // User Manifest
        if (userManifest) {
            if (users.length > 0) {
                userManifest.innerHTML = users.reverse().map(user => `
                    <div class="flex items-center gap-6 p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-xl group hover:border-primary/40 transition-all cursor-pointer fade-in-up">
                        <div class="w-14 h-14 bg-primary rounded-full flex items-center justify-center font-black text-white text-xl">
                            ${(user.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p class="text-sm font-black uppercase tracking-widest text-white">${user.name || 'Anonymous'}</p>
                            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">${user.organization || 'Observer'}</p>
                        </div>
                    </div>
                `).join('');
            } else {
                userManifest.innerHTML = `
                    <div class="py-12 border border-dashed border-white/5 rounded-[2.5rem] text-center">
                        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Awaiting Auth Flow</p>
                    </div>
                `;
            }
        }
    },



    initModal: function () {
        if (!document.body) return;
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest?.('.portfolio-item button');
            if (btn) {
                const modal = document.querySelector('.modal-overlay');
                if (modal) {
                    const img = btn.closest('.portfolio-item')?.querySelector('img');
                    const modalImg = modal.querySelector('.modal-img');
                    if (img && modalImg) {
                        modalImg.src = img.src;
                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }
            }

            // Close modal on overlay click
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    },

    // 3. PREMIUM UI HELPERS
    toast: function (message, type = 'info') {
        let container = document.querySelector('.lumina-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'lumina-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'lumina-toast';
        toast.innerHTML = `
            <div class="lumina-toast-icon"></div>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('active'), 10);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 600);
        }, 4000);
    }
};


LuminaApp.init();
window.LuminaApp = LuminaApp;
