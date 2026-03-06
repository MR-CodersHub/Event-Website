// ==============================
// LUMINA DASHBOARD SHARED JS
// ==============================

// --- Auth Guard (Disabled as per "Direct Access" requirement) ---
function requireAdmin() {
    // Access authorized without credentials for demo
    document.body.classList.add('authorized');
}
function requireUser() {
    // Access authorized without credentials for demo
    document.body.classList.add('authorized');
}

// --- Premium Dropdown Toggle ---
document.addEventListener('DOMContentLoaded', function () {
    const trigger = document.getElementById('user-menu-trigger');
    const wrap = document.getElementById('user-dropdown-wrap');

    if (trigger && wrap) {
        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            wrap.classList.toggle('open');
        });

        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) {
                wrap.classList.remove('open');
            }
        });
    }
});


// --- Logout ---
function doLogout() {
    localStorage.removeItem('lumina_auth');
    localStorage.removeItem('lumina_role');
    window.location.replace('../login.html');
}

// --- Sidebar Toggle (Admin) ---
function openSidebar() {
    var sb = document.getElementById('admin-sb');
    var bd = document.getElementById('sb-backdrop');
    if (sb) sb.classList.add('open');
    if (bd) bd.style.display = 'block';
}
function closeSidebar() {
    var sb = document.getElementById('admin-sb');
    var bd = document.getElementById('sb-backdrop');
    if (sb) sb.classList.remove('open');
    if (bd) bd.style.display = 'none';
}

// --- User Mobile Menu ---
function toggleUserMenu() {
    var m = document.getElementById('user-mobile-menu');
    if (m) m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}

// --- FAQ Toggle ---
function toggleFaq(el) {
    var ans = el.nextElementSibling;
    var icon = el.querySelector('.faq-icon');
    if (!ans) return;
    var isOpen = ans.classList.contains('open');
    document.querySelectorAll('.faq-answer').forEach(function (a) { a.classList.remove('open'); });
    document.querySelectorAll('.faq-icon').forEach(function (i) { if (i) i.textContent = '+'; });
    if (!isOpen) {
        ans.classList.add('open');
        if (icon) icon.textContent = '−';
    }
}

// --- Confirmation helper ---
function confirmAction(msg, fn) {
    if (window.confirm(msg)) fn();
}
