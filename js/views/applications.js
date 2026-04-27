window.views = window.views || {};

/* ================================================================
   APPLICATIONS MANAGER — with tags, portals, and match score
   ================================================================ */
function appForm(a = {}) {
    const statusOpts = ['not-started','in-progress','submitted','waiting','accepted','rejected'];
    return `
        <div class="form-group"><label class="form-label">Program Name *</label><input id="af-prog" class="form-control" value="${a.program||''}" placeholder="MSc in Cybersecurity"></div>
        <div class="form-group"><label class="form-label">University *</label><input id="af-uni" class="form-control" value="${a.university||''}" placeholder="Politecnico di Milano"></div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group"><label class="form-label">Status</label>
                <select id="af-status" class="form-control">${statusOpts.map(s=>`<option value="${s}" ${a.status===s?'selected':''}>${s.replace('-',' ')}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label class="form-label">Progress %</label><input id="af-pct" class="form-control" type="number" min="0" max="100" value="${a.progress||0}"></div>
        </div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group"><label class="form-label">Deadline</label><input id="af-deadline" class="form-control" type="date" value="${a.deadline||''}"></div>
            <div class="form-group"><label class="form-label">Field</label>
                <select id="af-field" class="form-control">
                    <option value="">Select...</option>
                    ${['Cybersecurity','IT','Cloud Computing','Networking','AI / Machine Learning','Computer Science'].map(f=>`<option ${a.field===f?'selected':''}>${f}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-group"><label class="form-label">Next Step</label><input id="af-nextstep" class="form-control" value="${a.nextStep||''}" placeholder="e.g. Upload motivation letter"></div>
        <div class="form-group"><label class="form-label">Tags</label>
            <div class="flex gap-2 flex-wrap">
                ${TAGS.list.map(t=>`<label class="badge cursor-pointer" style="background:${(a.tags||[]).includes(t)?TAGS.colors[t]+'20':'var(--bg-main)'};color:${TAGS.colors[t]};border:1px solid ${TAGS.colors[t]}30">
                    <input type="checkbox" class="app-tag-cb" value="${t}" ${(a.tags||[]).includes(t)?'checked':''} style="display:none"> ${t}
                </label>`).join('')}
            </div>
        </div>
        <div class="form-group"><label class="form-label">Application Portal URL</label><input id="af-portal" class="form-control" value="${a.portalUrl||''}" placeholder="https://apply.polimi.it"></div>
        <div class="form-group"><label class="form-label">Login Page URL</label><input id="af-login" class="form-control" value="${a.loginUrl||''}" placeholder="https://login.polimi.it"></div>
        <div class="form-group"><label class="form-label">Portal Notes (username hints, etc.)</label><input id="af-portalnotes" class="form-control" value="${a.portalNotes||''}" placeholder="Username: email@..."></div>
        <div class="form-group"><label class="form-label">Notes</label><textarea id="af-notes" class="form-control">${a.notes||''}</textarea></div>
        <div class="form-group"><label class="form-label">Application Link</label><input id="af-link" class="form-control" value="${a.link||''}" placeholder="https://..."></div>
    `;
}

function openAppModal(existing) {
    const isEdit = !!existing;
    UI.modal(isEdit?'Edit Application':'New Application', appForm(existing||{}), (overlay) => {
        const program = overlay.querySelector('#af-prog').value.trim();
        const uni     = overlay.querySelector('#af-uni').value.trim();
        if (!program||!uni) { UI.toast('Program and university required','error'); return false; }
        const tags = [...overlay.querySelectorAll('.app-tag-cb:checked')].map(cb=>cb.value);
        const payload = {
            program, university:uni,
            status:   overlay.querySelector('#af-status').value,
            progress: parseInt(overlay.querySelector('#af-pct').value)||0,
            deadline: overlay.querySelector('#af-deadline').value,
            field:    overlay.querySelector('#af-field').value,
            nextStep: overlay.querySelector('#af-nextstep').value.trim(),
            tags,
            portalUrl:   overlay.querySelector('#af-portal').value.trim(),
            loginUrl:    overlay.querySelector('#af-login').value.trim(),
            portalNotes: overlay.querySelector('#af-portalnotes').value.trim(),
            notes:    overlay.querySelector('#af-notes').value.trim(),
            link:     overlay.querySelector('#af-link').value.trim(),
        };
        if (isEdit) { DB.applications.update(existing.id, payload); UI.toast('Updated','success'); }
        else         { DB.applications.add(payload); UI.toast('Application added','success'); }
        UI.refresh();
    });
}

window.views.applications = () => {
    const wrap = document.createElement('div');
    let filterTag = '';

    const render = () => {
        let apps = DB.applications.all();
        if (filterTag) apps = apps.filter(a=>(a.tags||[]).includes(filterTag));

        const cols = {
            preparing: apps.filter(a=>['not-started','in-progress'].includes(a.status)),
            submitted: apps.filter(a=>['submitted','waiting'].includes(a.status)),
            decisions: apps.filter(a=>['accepted','rejected'].includes(a.status)),
        };

        wrap.innerHTML = `
        <div class="page-header">
            <div><h2>Applications Manager</h2><p class="page-desc">Track every application from start to decision with match scores.</p></div>
            <button class="btn btn-primary" id="add-app-btn"><i data-lucide="plus"></i> New Application</button>
        </div>

        <!-- Tag filter -->
        <div class="flex gap-2 flex-wrap" style="margin-bottom:16px">
            <button class="btn ${!filterTag?'btn-primary':'btn-outline'} tag-f" data-tag="" style="font-size:12px;padding:5px 12px">All</button>
            ${TAGS.list.map(t=>`<button class="btn ${filterTag===t?'btn-primary':'btn-outline'} tag-f" data-tag="${t}" style="font-size:12px;padding:5px 12px;${filterTag===t?`background:${TAGS.colors[t]};border-color:${TAGS.colors[t]}`:''}">${t}</button>`).join('')}
        </div>
        `;

        if (apps.length === 0 && !filterTag) {
            wrap.appendChild(UI.emptyState('briefcase','No applications yet','Start by adding the programs you want to apply to.','Add Application',()=>openAppModal()));
            lucide.createIcons({nodes:[wrap]});
            wrap.querySelector('#add-app-btn').onclick = ()=>openAppModal();
            wrap.querySelectorAll('.tag-f').forEach(b=>b.onclick=()=>{filterTag=b.dataset.tag;render();});
            return;
        }

        function cardHTML(app) {
            const match = DB.matchEngine.calculate(app);
            const daysLeft = app.deadline ? Math.ceil((new Date(app.deadline)-new Date())/86400000) : null;
            return `
            <div class="kanban-card" data-id="${app.id}">
                <div class="flex justify-between items-start" style="margin-bottom:6px">
                    <div class="font-medium text-sm" style="flex:1;padding-right:6px">${app.program}</div>
                    <span title="Match: ${match.score}% — ${match.level}" style="cursor:help">${match.emoji}</span>
                </div>
                <p class="text-xs text-secondary" style="margin-bottom:4px">${app.university}</p>
                <div class="flex gap-1 flex-wrap" style="margin-bottom:6px">
                    <span class="badge status-${app.status}" style="font-size:10px">${app.status.replace('-',' ')}</span>
                    ${(app.tags||[]).map(t=>`<span class="badge text-xs" style="background:${TAGS.colors[t]}15;color:${TAGS.colors[t]}">${t}</span>`).join('')}
                </div>
                ${app.progress!==undefined?`<div class="progress-container" style="height:4px;margin-bottom:6px"><div class="progress-bar" style="width:${app.progress}%;background:${app.status==='accepted'?'var(--success-color)':app.status==='rejected'?'var(--danger-color)':'var(--primary-color)'}"></div></div>`:''}
                ${app.nextStep?`<p class="text-xs text-muted" style="margin-bottom:4px">Next: ${app.nextStep}</p>`:''}
                <div class="flex justify-between items-center" style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border-light)">
                    <div class="flex gap-1">
                        ${daysLeft!==null?`<span class="text-xs ${daysLeft<=7?'text-danger':'text-muted'}">${daysLeft<=0?'Passed':daysLeft+'d'}</span>`:''}
                    </div>
                    <div class="flex gap-1">
                        ${app.portalUrl?`<a href="${app.portalUrl}" target="_blank" class="icon-btn" title="Open Portal" style="width:26px;height:26px"><i data-lucide="external-link" style="width:12px"></i></a>`:''}
                        <button class="icon-btn edit-app" data-id="${app.id}" style="width:26px;height:26px"><i data-lucide="edit-2" style="width:12px"></i></button>
                        <button class="icon-btn del-app" data-id="${app.id}" style="width:26px;height:26px;color:var(--danger-color)"><i data-lucide="trash-2" style="width:12px"></i></button>
                    </div>
                </div>
            </div>`;
        }

        const board = document.createElement('div');
        board.className = 'kanban-board';
        board.innerHTML = `
            <div class="kanban-col"><div class="kanban-col-header"><div class="kanban-dot" style="background:var(--warning-color)"></div>Preparing (${cols.preparing.length})</div>${cols.preparing.map(cardHTML).join('')||'<p class="text-muted text-xs" style="padding:8px">None</p>'}</div>
            <div class="kanban-col"><div class="kanban-col-header"><div class="kanban-dot" style="background:var(--primary-color)"></div>Submitted (${cols.submitted.length})</div>${cols.submitted.map(cardHTML).join('')||'<p class="text-muted text-xs" style="padding:8px">None</p>'}</div>
            <div class="kanban-col"><div class="kanban-col-header"><div class="kanban-dot" style="background:var(--success-color)"></div>Decisions (${cols.decisions.length})</div>${cols.decisions.map(cardHTML).join('')||'<p class="text-muted text-xs" style="padding:8px">None</p>'}</div>
        `;
        wrap.appendChild(board);

        // Match Score Detail Card
        if (apps.length > 0) {
            const detailCard = document.createElement('div');
            detailCard.className = 'card';
            detailCard.style.marginTop = '24px';
            const bestApp = apps.reduce((best,app)=>{const s=DB.matchEngine.calculate(app).score; return s>(best.s||0)?{app,s}:best;},{}).app || apps[0];
            const m = DB.matchEngine.calculate(bestApp);
            detailCard.innerHTML = `
                <h3 style="margin-bottom:16px;display:flex;align-items:center;gap:8px"><i data-lucide="target" style="width:18px;color:var(--primary-color)"></i> Acceptance Probability — ${bestApp.program}</h3>
                <div class="flex items-center gap-4" style="margin-bottom:16px;flex-wrap:wrap">
                    <div style="width:80px;height:80px;border-radius:50%;background:conic-gradient(${m.color} ${m.score}%, var(--bg-main) 0);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                        <div style="width:60px;height:60px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem">${m.score}%</div>
                    </div>
                    <div>
                        <div style="font-size:1.2rem;font-weight:700;color:${m.color};margin-bottom:4px">${m.emoji} ${m.level} Probability</div>
                        <div class="text-secondary text-sm">${m.reasons.join(' · ')}</div>
                    </div>
                </div>
                ${m.suggestions.length ? `
                <div style="background:var(--bg-main);border-radius:var(--radius-md);padding:12px;border-left:3px solid var(--accent-color)">
                    <div class="font-medium text-sm" style="margin-bottom:6px">💡 Suggestions to improve</div>
                    <ul style="font-size:12px;color:var(--text-secondary);display:flex;flex-direction:column;gap:4px">
                        ${m.suggestions.map(s=>`<li>• ${s}</li>`).join('')}
                    </ul>
                </div>` : ''}
            `;
            wrap.appendChild(detailCard);
        }

        lucide.createIcons({nodes:[wrap]});
        wrap.querySelector('#add-app-btn').onclick = ()=>openAppModal();
        wrap.querySelectorAll('.tag-f').forEach(b=>b.onclick=()=>{filterTag=b.dataset.tag;render();});
        wrap.querySelectorAll('.edit-app').forEach(b=>b.onclick=e=>{e.stopPropagation();openAppModal(DB.applications.find(+b.dataset.id));});
        wrap.querySelectorAll('.del-app').forEach(b=>b.onclick=e=>{e.stopPropagation();UI.confirm('Delete?',()=>{DB.applications.remove(+b.dataset.id);render();});});
    };
    render();
    return wrap;
};
