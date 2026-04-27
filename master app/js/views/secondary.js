window.views = window.views || {};

/* -------- Scholarships -------- */
function scholForm(s = {}) {
    return `
        <div class="form-group">
            <label class="form-label">Scholarship Name *</label>
            <input id="sf-name" class="form-control" value="${s.name||''}" placeholder="e.g. Invest Your Talent">
        </div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group">
                <label class="form-label">Provider</label>
                <input id="sf-provider" class="form-control" value="${s.provider||''}" placeholder="Italian Ministry / Erasmus">
            </div>
            <div class="form-group">
                <label class="form-label">Amount</label>
                <input id="sf-amount" class="form-control" value="${s.amount||''}" placeholder="8,000€/year or Fully Funded">
            </div>
        </div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group">
                <label class="form-label">Deadline</label>
                <input id="sf-deadline" class="form-control" type="date" value="${s.deadline||''}">
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select id="sf-status" class="form-control">
                    ${['not-applied','applied','waiting','awarded','rejected'].map(v=>`<option value="${v}" ${s.status===v?'selected':''}>${v.replace('-',' ')}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Eligibility / Requirements</label>
            <textarea id="sf-elig" class="form-control">${s.eligibility||''}</textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Official Link</label>
            <input id="sf-link" class="form-control" value="${s.link||''}" placeholder="https://...">
        </div>
        <div class="form-group">
            <label class="form-label">Notes</label>
            <textarea id="sf-notes" class="form-control">${s.notes||''}</textarea>
        </div>
    `;
}

window.views.scholarships = () => {
    const wrap = document.createElement('div');
    const render = () => {
        const list = DB.scholarships.all();
        wrap.innerHTML = `
            <div class="page-header">
                <div><h2>Scholarship Finder</h2><p class="page-desc">Save and track scholarships you want to apply for.</p></div>
                <button class="btn btn-primary" id="add-schol-btn"><i data-lucide="plus"></i> Add Scholarship</button>
            </div>
        `;
        if (list.length === 0) {
            wrap.appendChild(UI.emptyState('award','No scholarships saved','Add scholarships you are researching or planning to apply to.','Add Scholarship', () => openScholModal()));
        } else {
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2';
            list.forEach(s => {
                const daysLeft = s.deadline ? Math.ceil((new Date(s.deadline) - new Date()) / 86400000) : null;
                const c = document.createElement('div');
                c.className = 'card';
                c.innerHTML = `
                    <div class="flex justify-between items-start" style="margin-bottom:10px">
                        <span class="badge status-${s.status||'not-applied'}">${(s.status||'not-applied').replace('-',' ')}</span>
                        ${daysLeft!==null ? `<span class="badge ${daysLeft<=14?'badge-danger':daysLeft<=60?'badge-warning':'badge-secondary'}">${daysLeft<=0?'Passed':daysLeft+'d left'}</span>` : ''}
                    </div>
                    <h3 style="margin-bottom:4px">${s.name}</h3>
                    <p class="text-secondary text-sm" style="margin-bottom:4px">${s.provider||''}</p>
                    <p class="text-sm" style="margin-bottom:12px;color:var(--success-color);font-weight:600">${s.amount||'Amount TBD'}</p>
                    ${s.eligibility ? `<div class="text-xs text-secondary" style="background:var(--bg-hover);padding:8px;border-radius:var(--radius-sm);margin-bottom:12px;max-height:60px;overflow:hidden">${s.eligibility}</div>` : ''}
                    <div class="flex gap-2" style="padding-top:10px;border-top:1px solid var(--border-color)">
                        ${s.link ? `<a href="${s.link}" target="_blank" class="btn btn-primary flex-1 text-sm">Visit Page</a>` : '<div class="flex-1"></div>'}
                        <button class="btn btn-outline edit-schol" data-id="${s.id}"><i data-lucide="edit-2"></i></button>
                        <button class="btn btn-outline del-schol"  data-id="${s.id}" style="color:var(--danger-color)"><i data-lucide="trash-2"></i></button>
                    </div>
                `;
                grid.appendChild(c);
            });
            wrap.appendChild(grid);
        }
        lucide.createIcons({ nodes: [wrap] });
        wrap.querySelector('#add-schol-btn').onclick = () => openScholModal();
        wrap.querySelectorAll('.edit-schol').forEach(btn => btn.onclick = () => openScholModal(DB.scholarships.find(+btn.dataset.id)));
        wrap.querySelectorAll('.del-schol').forEach(btn => btn.onclick = () => UI.confirm('Delete scholarship?', () => { DB.scholarships.remove(+btn.dataset.id); render(); }));
    };

    function openScholModal(existing) {
        UI.modal(existing ? 'Edit Scholarship' : 'Add Scholarship', scholForm(existing||{}), (overlay) => {
            const name = overlay.querySelector('#sf-name').value.trim();
            if (!name) { UI.toast('Name is required','error'); return false; }
            const payload = { name,
                provider:    overlay.querySelector('#sf-provider').value.trim(),
                amount:      overlay.querySelector('#sf-amount').value.trim(),
                deadline:    overlay.querySelector('#sf-deadline').value,
                status:      overlay.querySelector('#sf-status').value,
                eligibility: overlay.querySelector('#sf-elig').value.trim(),
                link:        overlay.querySelector('#sf-link').value.trim(),
                notes:       overlay.querySelector('#sf-notes').value.trim(),
            };
            if (existing) { DB.scholarships.update(existing.id, payload); UI.toast('Updated','success'); }
            else           { DB.scholarships.add(payload);                  UI.toast('Scholarship added','success'); }
            render();
        });
    }
    render();
    return wrap;
};

/* -------- Accommodation -------- */
function accomForm(a = {}) {
    return `
        <div class="form-group"><label class="form-label">Name / Title *</label><input id="acf-name" class="form-control" value="${a.name||''}" placeholder="Shared apartment near Politecnico"></div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group"><label class="form-label">City</label><input id="acf-city" class="form-control" value="${a.city||''}" placeholder="Milan"></div>
            <div class="form-group"><label class="form-label">Monthly Rent (€)</label><input id="acf-rent" class="form-control" type="number" value="${a.rent||''}"></div>
        </div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group"><label class="form-label">Type</label>
                <select id="acf-type" class="form-control">
                    ${['Shared Apartment','Student Residence','Studio','University Dorm','Private Room'].map(t=>`<option ${a.type===t?'selected':''}>${t}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label class="form-label">Distance to University</label><input id="acf-dist" class="form-control" value="${a.distance||''}" placeholder="10 min walk"></div>
        </div>
        <div class="form-group"><label class="form-label">Link</label><input id="acf-link" class="form-control" value="${a.link||''}" placeholder="https://..."></div>
        <div class="form-group"><label class="form-label">Notes</label><textarea id="acf-notes" class="form-control">${a.notes||''}</textarea></div>
        <div class="form-group"><label class="form-label">Status</label>
            <select id="acf-status" class="form-control">
                ${['searching','contacted','visited','reserved','rejected'].map(s=>`<option value="${s}" ${a.status===s?'selected':''}>${s}</option>`).join('')}
            </select>
        </div>
    `;
}

window.views.accommodation = () => {
    const wrap = document.createElement('div');
    const render = () => {
        const list = DB.accommodation.all();
        wrap.innerHTML = `
            <div class="page-header">
                <div><h2>Accommodation</h2><p class="page-desc">Compare and track housing options in Italy.</p></div>
                <button class="btn btn-primary" id="add-accom-btn"><i data-lucide="plus"></i> Add Option</button>
            </div>
        `;
        if (list.length === 0) {
            wrap.appendChild(UI.emptyState('home','No housing options yet','Add apartments, dorms, or shared rooms you\'re considering.','Add Housing Option', () => openAccomModal()));
        } else {
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-3';
            list.forEach(a => {
                const c = document.createElement('div');
                c.className = 'card';
                c.innerHTML = `
                    <div class="flex justify-between items-start" style="margin-bottom:8px">
                        <span class="badge badge-secondary">${a.type||'Housing'}</span>
                        <span class="badge status-${a.status||'searching'}">${a.status||'searching'}</span>
                    </div>
                    <h3 style="margin-bottom:4px;font-size:1rem">${a.name}</h3>
                    <p class="text-secondary text-sm" style="margin-bottom:4px"><i data-lucide="map-pin" style="width:13px"></i> ${a.city||'—'}</p>
                    <p style="font-size:1.3rem;font-weight:700;color:var(--primary-color);margin:8px 0">${a.rent ? a.rent+'€/mo' : '—'}</p>
                    ${a.distance ? `<p class="text-xs text-secondary" style="margin-bottom:8px"><i data-lucide="navigation" style="width:12px"></i> ${a.distance}</p>` : ''}
                    ${a.notes ? `<p class="text-xs text-secondary" style="margin-bottom:12px">${a.notes}</p>` : ''}
                    <div class="flex gap-2" style="padding-top:10px;border-top:1px solid var(--border-color)">
                        ${a.link ? `<a href="${a.link}" target="_blank" class="btn btn-outline flex-1 text-sm">View</a>` : '<div class="flex-1"></div>'}
                        <button class="btn btn-outline edit-accom" data-id="${a.id}"><i data-lucide="edit-2"></i></button>
                        <button class="btn btn-outline del-accom"  data-id="${a.id}" style="color:var(--danger-color)"><i data-lucide="trash-2"></i></button>
                    </div>
                `;
                grid.appendChild(c);
            });
            wrap.appendChild(grid);
        }
        lucide.createIcons({ nodes: [wrap] });
        wrap.querySelector('#add-accom-btn').onclick = () => openAccomModal();
        wrap.querySelectorAll('.edit-accom').forEach(btn => btn.onclick = () => openAccomModal(DB.accommodation.find(+btn.dataset.id)));
        wrap.querySelectorAll('.del-accom').forEach(btn => btn.onclick = () => UI.confirm('Delete this option?', () => { DB.accommodation.remove(+btn.dataset.id); render(); }));
    };

    function openAccomModal(existing) {
        UI.modal(existing ? 'Edit Housing' : 'Add Housing Option', accomForm(existing||{}), (overlay) => {
            const name = overlay.querySelector('#acf-name').value.trim();
            if (!name) { UI.toast('Name required','error'); return false; }
            const payload = { name,
                city:     overlay.querySelector('#acf-city').value.trim(),
                rent:     overlay.querySelector('#acf-rent').value,
                type:     overlay.querySelector('#acf-type').value,
                distance: overlay.querySelector('#acf-dist').value.trim(),
                link:     overlay.querySelector('#acf-link').value.trim(),
                notes:    overlay.querySelector('#acf-notes').value.trim(),
                status:   overlay.querySelector('#acf-status').value,
            };
            if (existing) { DB.accommodation.update(existing.id, payload); UI.toast('Updated','success'); }
            else           { DB.accommodation.add(payload);                  UI.toast('Added','success'); }
            render();
        });
    }
    render();
    return wrap;
};

/* -------- Internships -------- */
function internForm(i = {}) {
    return `
        <div class="form-group"><label class="form-label">Role / Title *</label><input id="if-title" class="form-control" value="${i.title||''}" placeholder="Cybersecurity Analyst Intern"></div>
        <div class="form-group"><label class="form-label">Company</label><input id="if-company" class="form-control" value="${i.company||''}" placeholder="Leonardo S.p.A."></div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group"><label class="form-label">Location</label><input id="if-loc" class="form-control" value="${i.location||''}" placeholder="Milan / Remote"></div>
            <div class="form-group"><label class="form-label">Type</label>
                <select id="if-type" class="form-control">
                    ${['On-site','Remote','Hybrid'].map(t=>`<option ${i.type===t?'selected':''}>${t}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group"><label class="form-label">Paid?</label>
                <select id="if-paid" class="form-control">
                    <option value="yes" ${i.paid==='yes'?'selected':''}>Paid</option>
                    <option value="no"  ${i.paid==='no'?'selected':''}>Unpaid</option>
                </select>
            </div>
            <div class="form-group"><label class="form-label">Status</label>
                <select id="if-status" class="form-control">
                    ${['interested','applied','interviewing','offered','rejected'].map(s=>`<option ${i.status===s?'selected':''}>${s}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="form-group"><label class="form-label">Link</label><input id="if-link" class="form-control" value="${i.link||''}" placeholder="https://..."></div>
        <div class="form-group"><label class="form-label">Notes</label><textarea id="if-notes" class="form-control">${i.notes||''}</textarea></div>
    `;
}

window.views.internships = () => {
    const wrap = document.createElement('div');
    const render = () => {
        const list = DB.internships.all();
        wrap.innerHTML = `
            <div class="page-header">
                <div><h2>Internship Tracker</h2><p class="page-desc">Find and track IT & Cybersecurity internships in Italy.</p></div>
                <button class="btn btn-primary" id="add-intern-btn"><i data-lucide="plus"></i> Add Internship</button>
            </div>
        `;
        if (list.length === 0) {
            wrap.appendChild(UI.emptyState('building','No internships tracked','Add internship opportunities you\'re interested in.','Add Internship', () => openInternModal()));
        } else {
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2';
            list.forEach(i => {
                const c = document.createElement('div');
                c.className = 'card';
                c.innerHTML = `
                    <div class="flex justify-between items-start" style="margin-bottom:8px">
                        <div class="flex gap-2">
                            <span class="badge badge-secondary">${i.type||'On-site'}</span>
                            <span class="badge ${i.paid==='yes'?'badge-success':'badge-secondary'}">${i.paid==='yes'?'Paid':'Unpaid'}</span>
                        </div>
                        <span class="badge status-${i.status||'interested'}">${i.status||'interested'}</span>
                    </div>
                    <h3 style="margin-bottom:4px;font-size:1rem">${i.title}</h3>
                    <p class="text-secondary text-sm" style="margin-bottom:2px">${i.company||'—'}</p>
                    <p class="text-xs text-muted" style="margin-bottom:12px"><i data-lucide="map-pin" style="width:12px"></i> ${i.location||'—'}</p>
                    ${i.notes ? `<p class="text-xs text-secondary" style="margin-bottom:12px">${i.notes}</p>` : ''}
                    <div class="flex gap-2" style="padding-top:10px;border-top:1px solid var(--border-color)">
                        ${i.link ? `<a href="${i.link}" target="_blank" class="btn btn-primary flex-1 text-sm">View</a>` : '<div class="flex-1"></div>'}
                        <button class="btn btn-outline edit-intern" data-id="${i.id}"><i data-lucide="edit-2"></i></button>
                        <button class="btn btn-outline del-intern"  data-id="${i.id}" style="color:var(--danger-color)"><i data-lucide="trash-2"></i></button>
                    </div>
                `;
                grid.appendChild(c);
            });
            wrap.appendChild(grid);
        }
        lucide.createIcons({ nodes: [wrap] });
        wrap.querySelector('#add-intern-btn').onclick = () => openInternModal();
        wrap.querySelectorAll('.edit-intern').forEach(btn => btn.onclick = () => openInternModal(DB.internships.find(+btn.dataset.id)));
        wrap.querySelectorAll('.del-intern').forEach(btn => btn.onclick = () => UI.confirm('Delete internship?', () => { DB.internships.remove(+btn.dataset.id); render(); }));
    };

    function openInternModal(existing) {
        UI.modal(existing ? 'Edit Internship' : 'Add Internship', internForm(existing||{}), (overlay) => {
            const title = overlay.querySelector('#if-title').value.trim();
            if (!title) { UI.toast('Title required','error'); return false; }
            const payload = { title,
                company:  overlay.querySelector('#if-company').value.trim(),
                location: overlay.querySelector('#if-loc').value.trim(),
                type:     overlay.querySelector('#if-type').value,
                paid:     overlay.querySelector('#if-paid').value,
                status:   overlay.querySelector('#if-status').value,
                link:     overlay.querySelector('#if-link').value.trim(),
                notes:    overlay.querySelector('#if-notes').value.trim(),
            };
            if (existing) { DB.internships.update(existing.id, payload); UI.toast('Updated','success'); }
            else           { DB.internships.add(payload);                  UI.toast('Added','success'); }
            render();
        });
    }
    render();
    return wrap;
};
