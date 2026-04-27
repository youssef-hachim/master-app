document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const sidebar      = document.getElementById('sidebar');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navItems     = document.querySelectorAll('.nav-item[data-view]');
    const mainContent  = document.getElementById('main-content');
    const pageTitleEl  = document.getElementById('page-title');
    const notifBadge   = document.getElementById('notif-badge');
    const alertsBtn    = document.getElementById('alerts-btn');

    window.views = window.views || {};

    // --- Notification badge ---
    function updateBadge() {
        const alerts = DB.alerts.generate();
        const count  = alerts.filter(a => a.type === 'danger' || a.type === 'warning').length;
        if (notifBadge) {
            notifBadge.textContent = count;
            notifBadge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // --- Alert bell click → show alerts panel ---
    if (alertsBtn) {
        alertsBtn.onclick = () => {
            const alerts = DB.alerts.generate();
            if (alerts.length === 0) {
                UI.toast('No active alerts! 🎉', 'success');
                return;
            }
            const body = alerts.map(a => `
                <div class="flex items-center gap-3" style="padding:10px;background:${a.type==='danger'?'#fee2e2':a.type==='warning'?'#fef3c7':'#dbeafe'};border-radius:var(--radius-md);margin-bottom:8px;font-size:13px">
                    <i data-lucide="${a.icon}" style="width:16px;flex-shrink:0;color:${a.type==='danger'?'var(--danger-color)':a.type==='warning'?'var(--warning-color)':'var(--primary-color)'}"></i>
                    <span style="flex:1">${a.msg}</span>
                    <span class="badge badge-${a.type==='danger'?'danger':a.type==='warning'?'warning':'info'}" style="font-size:10px">${a.type}</span>
                </div>
            `).join('');
            UI.modal('Smart Alerts (' + alerts.length + ')', body, () => {}, 'Close');
        };
    }

    // --- Render ---
    const renderView = (viewName) => {
        mainContent.innerHTML = '';
        if (window.views[viewName]) {
            mainContent.appendChild(window.views[viewName]());
        } else {
            mainContent.innerHTML = `
                <div class="card empty-state" style="height:400px">
                    <i data-lucide="hammer" style="width:48px;height:48px;margin-bottom:16px"></i>
                    <h3>Coming Soon</h3>
                    <p class="text-secondary">This section is not yet implemented.</p>
                </div>`;
        }
        lucide.createIcons();
        updateBadge();
    };

    // --- Navigate ---
    const navigateTo = (viewName) => {
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
            if (item.dataset.view === viewName) {
                const span = item.querySelector('span');
                pageTitleEl.textContent = span ? span.textContent : item.textContent.trim();
            }
        });
        if (window.innerWidth <= 768) sidebar.classList.remove('show');
        renderView(viewName);
        history.pushState(null, null, `#${viewName}`);
    };

    // --- Nav clicks ---
    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            if (item.dataset.view) navigateTo(item.dataset.view);
        });
    });

    // --- Mobile menu ---
    mobileToggle.addEventListener('click', () => sidebar.classList.toggle('show'));
    document.addEventListener('click', e => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });

    // --- Avatar from profile ---
    const p = DB.profile.get();
    if (p.name) {
        const av = document.querySelector('.user-avatar img');
        if (av) av.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1e40af&color=fff`;
    }

    // --- Initial route ---
    const initialView = window.location.hash.substring(1) || 'dashboard';
    navigateTo(initialView);
    window.addEventListener('popstate', () => navigateTo(window.location.hash.substring(1) || 'dashboard'));

    // --- UI.refresh ---
    window.UI = window.UI || {};
    const origRefresh = window.UI.refresh;
    window.UI.refresh = () => {
        const v = window.location.hash.substring(1) || 'dashboard';
        renderView(v);
    };
});
