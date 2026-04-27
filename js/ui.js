/**
 * UI — shared helpers: modal, toast, loading, confirm
 */

window.UI = {
    /* ---- Toast ---- */
    toast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info';
        t.innerHTML = `<i data-lucide="${icon}" style="width:16px;height:16px;flex-shrink:0"></i> ${msg}`;
        container.appendChild(t);
        lucide.createIcons({ nodes: [t] });
        setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
    },

    /* ---- Modal ---- */
    modal(title, bodyHTML, onSave, saveLabel = 'Save') {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="icon-btn" id="modal-close"><i data-lucide="x"></i></button>
                </div>
                <div class="modal-body">${bodyHTML}</div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="modal-cancel">Cancel</button>
                    <button class="btn btn-primary" id="modal-save">${saveLabel}</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('open'));
        lucide.createIcons({ nodes: [overlay] });

        const close = () => {
            overlay.classList.remove('open');
            setTimeout(() => overlay.remove(), 250);
        };
        overlay.querySelector('#modal-close').onclick  = close;
        overlay.querySelector('#modal-cancel').onclick = close;
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        overlay.querySelector('#modal-save').onclick = () => { if (onSave(overlay) !== false) close(); };
        return overlay;
    },

    /* ---- Confirm dialog ---- */
    confirm(msg, onYes) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal" style="max-width:400px">
                <div class="modal-header"><h3>Confirm</h3></div>
                <p class="text-secondary">${msg}</p>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="conf-no">Cancel</button>
                    <button class="btn btn-primary" id="conf-yes" style="background:var(--danger-color)">Delete</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('open'));
        const close = () => { overlay.classList.remove('open'); setTimeout(() => overlay.remove(), 250); };
        overlay.querySelector('#conf-no').onclick  = close;
        overlay.querySelector('#conf-yes').onclick = () => { onYes(); close(); };
    },

    /* ---- Empty State ---- */
    emptyState(icon, title, desc, btnLabel, onBtn) {
        const el = document.createElement('div');
        el.className = 'empty-state';
        el.innerHTML = `
            <i data-lucide="${icon}" style="width:52px;height:52px;color:var(--text-muted)"></i>
            <h3>${title}</h3>
            <p>${desc}</p>
            ${btnLabel ? `<button class="btn btn-primary" id="es-btn"><i data-lucide="plus"></i>${btnLabel}</button>` : ''}
        `;
        if (btnLabel) el.querySelector('#es-btn').onclick = onBtn;
        return el;
    },

    /* ---- Re-render current view ---- */
    refresh() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        if (window.views && window.views[hash]) {
            const mc = document.getElementById('main-content');
            mc.innerHTML = '';
            mc.appendChild(window.views[hash]());
            lucide.createIcons();
        }
    }
};
