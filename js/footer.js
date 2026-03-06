/**
 * LUMINA - GLOBAL FOOTER COMPONENT
 * Unifies the footer across the entire site.
 */

const LuminaFooter = {
    init: function () {
        const footerPlaceholder = document.getElementById('global-footer');
        if (!footerPlaceholder) return;

        // Determine base path based on depth
        const depth = footerPlaceholder.getAttribute('data-depth') || '0';
        let basePath = '';
        for (let i = 0; i < parseInt(depth); i++) {
            basePath += '../';
        }

        const footerHTML = `
            <div class="footer-divider"></div>
            <footer class="site-footer pt-16 pb-10">
                <div class="container mx-auto px-6 md:px-12">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 mb-16">
                        <!-- Brand Column -->
                        <div class="md:col-span-5 space-y-10 text-center md:text-left">
                            <a href="${basePath}index.html"
                                class="text-2xl font-black text-white tracking-tight uppercase font-heading flex items-center justify-center md:justify-start gap-2">
                                <span class="bg-primary text-white px-2 py-0.5 rounded-sm">L</span>
                                LUMINA
                            </a>
                            <p class="text-slate-400 text-lg leading-relaxed max-w-sm mx-auto md:mx-0 font-medium">
                                The world’s most disciplined orchestration studio. Transforming logistical complexity into
                                invisible excellence since 1998.
                            </p>
                            <div class="flex gap-4 justify-center md:justify-start">
                                <a href="#" class="social-icon-btn" aria-label="LinkedIn">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                                <a href="#" class="social-icon-btn" aria-label="Twitter">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                                <a href="#" class="social-icon-btn" aria-label="Instagram">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <!-- Operations Column -->
                        <div class="md:col-span-2 space-y-8 text-center md:text-left">
                            <h4>Operations</h4>
                            <ul class="space-y-4 text-[11px] font-black uppercase tracking-[0.2em]">
                                <li><a href="${basePath}services.html" class="footer-link">Services</a></li>
                                <li><a href="${basePath}home-niche/index.html" class="footer-link">Home2</a></li>
                                <li><a href="${basePath}about.html" class="footer-link">Our Legacy</a></li>
                                <li><a href="${basePath}blog.html" class="footer-link">Journal</a></li>
                            </ul>
                        </div>

                        <!-- Hubs Column -->
                        <div class="md:col-span-2 space-y-8 text-center md:text-left">
                            <h4>Global Hubs</h4>
                            <div
                                class="space-y-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 leading-relaxed">
                                <p class="hover:text-white transition-colors cursor-default">Geneva <span
                                        class="text-primary italic ml-1">HQ</span></p>
                                <p class="hover:text-white transition-colors cursor-default">New York <span
                                        class="text-primary italic ml-1">Command</span></p>
                                <p class="hover:text-white transition-colors cursor-default">Singapore <span
                                        class="text-primary italic ml-1">Hub</span></p>
                            </div>
                        </div>

                        <!-- Registry Column -->
                        <div class="md:col-span-3 text-center md:text-left">
                            <div class="registry-contact-card">
                                <h4>Registry Support</h4>
                                <a href="mailto:ops@lumina.studio"
                                    class="text-[11px] font-black uppercase tracking-[0.2em] text-white hover:text-primary transition-colors underline decoration-primary/30 underline-offset-8 block mt-6">
                                    ops@lumina.studio
                                </a>
                                <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-8 italic">
                                    Protocol response: 4h
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Sub-footer -->
                    <div
                        class="sub-footer flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        <p>© 2026 Lumina Events Management. <span class="text-primary/40 ml-2">Built for scale.</span></p>
                        <div class="flex gap-12">
                            <a href="${basePath}policy.html" class="hover:text-white transition-all">Privacy Policy</a>
                            <a href="${basePath}terms.html" class="hover:text-white transition-all">Terms of Entry</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;

        footerPlaceholder.outerHTML = footerHTML;
    }
};

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LuminaFooter.init());
} else {
    LuminaFooter.init();
}
