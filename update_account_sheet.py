import os
import re

# Configuration
target_files = [
    'index.html', 'about.html', 'blog.html', 'services.html', 'contact.html',
    'login.html', 'signup.html', 'terms.html', 'policy.html', 'maintenance.html', 'coming-soon.html',
    'service-corporate.html', 'service-details.html', 'service-digital.html', 'service-vip.html', 'blog-details.html',
    'forgot-password.html', 'components.html', 'design-system.html',
    'home-niche/index.html', 'home-niche/secops-terminal.html', 'home-niche/immersive-social.html',
    'home-niche/hybrid-bridge.html', 'home-niche/latency-hubs.html', 'home-niche/global-delivery.html', 'home-niche/adaptive-analytics.html',
    'additional-pages/auth/login/index.html', 'additional-pages/auth/register/index.html',
    'additional-pages/niche-home/niche-home/index.html', 'additional-pages/pricing/index.html',
    'admin/index.html', 'admin/dashboard/index.html'
]

def get_relative_path(target_path, current_file_path):
    # Calculates the relative path from current_file to target_path (which is relative to root)
    # e.g. current_file = 'home-niche/index.html', target = 'css/style.css'
    # returns '../css/style.css'
    
    if os.path.isabs(target_path):
        return target_path # innovative ignore absolute paths? Or assume relative to root?
        
    depth = current_file_path.count('/') + current_file_path.count('\\')
    if depth == 0:
        return target_path
    
    return ('../' * depth) + target_path

def generate_html(file_path):
    depth = file_path.count('/') + file_path.count('\\')
    prefix = '../' * depth
    
    # Adjust links in HTML
    login_link = f"{prefix}login.html"
    signup_link = f"{prefix}signup.html"
    admin_link = f"{prefix}admin/index.html"
    
    html = f"""    <!-- Mobile Account Bottom Sheet -->
    <div id="mobile-account-sheet" class="fixed inset-0 z-[70] pointer-events-none lg:hidden">
        <!-- Backdrop -->
        <div id="mobile-account-backdrop"
            class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm opacity-0 transition-opacity duration-300"></div>

        <!-- Bottom Sheet -->
        <div id="mobile-account-content"
            class="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-[2rem] border-t border-white/10 shadow-2xl translate-y-full transition-transform duration-300 ease-out">

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
            <div class="px-6 py-6 space-y-3">
                <!-- Status Card -->
                <div class="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
                    <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Status</p>
                    <p class="text-xs font-black uppercase tracking-tight text-white">Unauthorized</p>
                </div>

                <!-- Log In -->
                <a href="{login_link}"
                    class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-primary/30 transition-all group">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-white">Authorize Access</p>
                            <p class="text-xs text-slate-400">Log in to your account</p>
                        </div>
                    </div>
                    <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </a>

                <!-- Sign Up -->
                <a href="{signup_link}"
                    class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-primary/30 transition-all group">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-white">Initialize Registry</p>
                            <p class="text-xs text-slate-400">Create new account</p>
                        </div>
                    </div>
                    <svg class="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </a>

                <!-- Admin Dashboard (Hidden by default, show when logged in as admin) -->
                <a href="{admin_link}"
                    class="hidden flex items-center justify-between p-4 bg-primary/10 hover:bg-primary/20 rounded-xl border border-primary/20 hover:border-primary/40 transition-all group"
                    id="mobile-admin-link">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-white">Admin Dashboard</p>
                            <p class="text-xs text-primary">System controls</p>
                        </div>
                    </div>
                    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>

            <!-- Safe Area Bottom Padding -->
            <div class="h-8"></div>
        </div>
    </div>"""
    return html

count = 0
for filename in target_files:
    # Normalize slashes
    filename = filename.replace('/', os.sep).replace('\\', os.sep)
    
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated_content = content
        depth = filename.count(os.sep)
        prefix = '../' * depth
        
        # 1. Update CSS
        css_ref = 'css/account-interaction-fix.css'
        full_css_ref = prefix + css_ref
        css_tag = f'    <link rel="stylesheet" href="{full_css_ref}">'
        
        if 'account-interaction-fix.css' not in updated_content:
            # Insert before </head>
            updated_content = updated_content.replace('</head>', css_tag + '\n</head>')
            print(f"Added CSS to {filename}")
        
        # 2. Update Mobile Account Sheet
        mobile_sheet_html = generate_html(filename)
        
        # Use regex to find existing sheet to replace it
        # Try to find the block from title to end of sheet
        # We look for <div id="mobile-account-sheet" ... </div> ... </div>
        # Or look for marker comments
        
        start_marker = '<!-- Mobile Account Bottom Sheet -->'
        end_marker = '<!-- Scripts -->'
        
        if start_marker in updated_content and end_marker in updated_content:
            pattern = re.escape(start_marker) + r'.*?' + re.escape(end_marker)
            # Find exact match with re.DOTALL
            match = re.search(pattern, updated_content, re.DOTALL)
            if match:
                 # Check if we assume it's outdated or just blindly replace? User wants consistency.
                 # Let's replace.
                 new_block = mobile_sheet_html + '\n\n    ' + end_marker
                 
                 # Only replace if content is different (ignoring whitespace might be hard, so just replace)
                 # But we must be careful not to create duplicates or syntax errors
                 updated_content = updated_content[:match.start()] + new_block + updated_content[match.end() - len(end_marker) + len(end_marker):] 
                 # Wait, pattern included end_marker. 
                 # match.end() is after end_marker.
                 # I constructed new_block to end with end_marker.
                 # So simple replace is fine.
                 updated_content = updated_content.replace(match.group(0), new_block)
                 print(f"Replaced sheet in {filename}")
        elif start_marker in updated_content:
             # Found start but not Scripts. 
             # Maybe regex for div matching?
             # Fallback: Don't touch if start exists but Scripts doesn't (safer than breaking html)
             print(f"Warning: Found sheet but no Scripts marker in {filename}, skipping sheet update.")
        else:
            # Not found. Insert before Scripts or body.
            if end_marker in updated_content:
                updated_content = updated_content.replace(end_marker, mobile_sheet_html + '\n\n    ' + end_marker)
            elif '<script' in updated_content:
                last_script_idx = updated_content.rfind('<script')
                # Try to find indentation
                updated_content = updated_content[:last_script_idx] + mobile_sheet_html + '\n\n    ' + updated_content[last_script_idx:]
            else:
                updated_content = updated_content.replace('</body>', mobile_sheet_html + '\n</body>')
            print(f"Inserted new sheet in {filename}")

        # 3. Update JS
        js_ref = 'js/account-interaction.js'
        full_js_ref = prefix + js_ref
        js_tag = f'<script src="{full_js_ref}"></script>'
        init_script = """
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.AccountInteraction) {
                window.AccountInteraction.init();
            }
        });
    </script>
"""
        if 'account-interaction.js' not in updated_content:
             # Insert before </body>
             updated_content = updated_content.replace('</body>', '    ' + js_tag + init_script + '</body>')
             print(f"Added JS to {filename}")

        if content != updated_content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"SUCCESS: Saved {filename}")
            count += 1
        else:
            print(f"No changes for {filename}")

print(f"Total files updated: {count}")
