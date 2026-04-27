window.views = window.views || {};

/* ================================================================
   ADVANCED DOCUMENT TRACKING
   ================================================================ */

const DOC_TEMPLATES = {
    'University Applications': [
        { name:'Passport Copy', subtasks:['Scan','Certified copy'], category:'Identity' },
        { name:'Bachelor\'s Diploma', subtasks:['Translation','Apostille / Legalization','Certified copy'], category:'Academic' },
        { name:'Transcripts', subtasks:['Translation','Apostille / Legalization','Certified copy'], category:'Academic' },
        { name:'CV / Resume', subtasks:['Updated','PDF ready'], category:'Academic' },
        { name:'Motivation Letter', subtasks:['Draft','Review','Final version'], category:'Academic' },
        { name:'Recommendation Letter 1', subtasks:['Requested','Received','Uploaded'], category:'Academic' },
        { name:'Recommendation Letter 2', subtasks:['Requested','Received','Uploaded'], category:'Academic' },
        { name:'Language Certificate (IELTS/TOEFL)', subtasks:['Test taken','Score received','Upload'], category:'Language' },
    ],
    'Scholarship Applications': [
        { name:'Financial Statement / Bank Letter', subtasks:['Bank visit','Stamp/Sign','Scan'], category:'Financial' },
        { name:'Income Declaration (Family)', subtasks:['Notarized','Translated'], category:'Financial' },
        { name:'Scholarship Application Form', subtasks:['Fill form','Attach docs','Submit'], category:'Administrative' },
        { name:'Study Plan / Research Proposal', subtasks:['Draft','Review','Final'], category:'Academic' },
    ],
    'Visa Process': [
        { name:'Declaration of Value (DoV) / CIMEA', subtasks:['Request sent','Documents legalized','Received'], category:'Administrative' },
        { name:'Universitaly Pre-enrollment Summary', subtasks:['Account created','Admission uploaded','Summary downloaded'], category:'Administrative' },
        { name:'Financial Proof (≥6,000€)', subtasks:['Bank statement','Scholarship proof','Embassy format'], category:'Financial' },
        { name:'Accommodation Proof', subtasks:['Contract/Reservation','Address confirmed'], category:'Visa' },
        { name:'Health Insurance', subtasks:['Policy purchased','Certificate ready'], category:'Visa' },
        { name:'Passport-size Photos (4x)', subtasks:['Photos taken'], category:'Identity' },
        { name:'Flight Reservation', subtasks:['Booking confirmed'], category:'Visa' },
        { name:'VFS Appointment Confirmation', subtasks:['Appointment booked'], category:'Visa' },
    ]
};

function docForm(d = {}) {
    return `
        <div class="form-group"><label class="form-label">Document Name *</label>
            <input id="df-name" class="form-control" value="${d.name||''}" placeholder="e.g. Passport Copy">
        </div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group"><label class="form-label">Status</label>
                <select id="df-status" class="form-control">
                    ${['missing','in-progress','ready','uploaded'].map(s=>`<option value="${s}" ${d.status===s?'selected':''}>${s.replace('-',' ')}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label class="form-label">Section</label>
                <select id="df-section" class="form-control">
                    ${Object.keys(DOC_TEMPLATES).map(s=>`<option ${d.section===s?'selected':''}>${s}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group"><label class="form-label">Category</label>
                <select id="df-cat" class="form-control">
                    ${['Academic','Identity','Language','Financial','Administrative','Visa'].map(c=>`<option ${d.category===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label class="form-label">Expiry Date</label>
                <input id="df-expiry" class="form-control" type="date" value="${d.expiry||''}">
            </div>
        </div>
        <div class="form-group"><label class="form-label">Tags</label>
            <div class="flex gap-2 flex-wrap" id="df-tags">
                ${TAGS.list.map(t => {
                    const checked = (d.tags||[]).includes(t);
                    return `<label class="badge" style="cursor:pointer;background:${checked ? TAGS.colors[t]+'20' : 'var(--bg-main)'};color:${TAGS.colors[t]};border:1px solid ${TAGS.colors[t]}30">
                        <input type="checkbox" class="tag-cb" value="${t}" ${checked?'checked':''} style="display:none"> ${t}
                    </label>`;
                }).join('')}
            </div>
        </div>
        <div class="form-group"><label class="form-label">Subtasks (comma-separated)</label>
            <input id="df-subtasks" class="form-control" value="${(d.subtasks||[]).map(s=>s.label||s).join(', ')}" placeholder="Translation, Apostille, Upload">
        </div>
        <div class="form-group"><label class="form-label">Notes</label>
            <textarea id="df-notes" class="form-control">${d.notes||''}</textarea>
        </div>
    `;
}

function sectionProgress(docs, section) {
    const secDocs = docs.filter(d => d.section === section);
    if (secDocs.length === 0) return { total:0, done:0, pct:0 };
    const done = secDocs.filter(d => d.status === 'ready' || d.status === 'uploaded').length;
    return { total:secDocs.length, done, pct: Math.round((done / secDocs.length) * 100) };
}

window.views.documents = () => {
    const wrap = document.createElement('div');
    let filterTag = '';

    const render = () => {
        let docs = DB.documents.all();
        if (filterTag) docs = docs.filter(d => (d.tags||[]).includes(filterTag));
        const allDocs = DB.documents.all();
        const totalReady = allDocs.filter(d=>d.status==='ready'||d.status==='uploaded').length;
        const totalPct = allDocs.length ? Math.round((totalReady/allDocs.length)*100) : 0;

        wrap.innerHTML = `
        <div class="page-header">
            <div><h2>Advanced Document Tracker</h2><p class="page-desc">Track every document across university, scholarship, and visa applications.</p></div>
            <div class="flex gap-2">
                <button class="btn btn-outline" id="auto-populate-btn"><i data-lucide="wand-2"></i> Auto-populate</button>
                <button class="btn btn-primary" id="add-doc-btn"><i data-lucide="plus"></i> Add Document</button>
            </div>
        </div>

        <!-- Overall progress -->
        <div class="card" style="margin-bottom:24px;background:linear-gradient(135deg,#1e40af,#0891b2);color:white">
            <div class="flex justify-between items-center" style="flex-wrap:wrap;gap:12px">
                <div><h3 style="color:white">Overall Document Readiness</h3><p style="opacity:0.8;font-size:13px">${totalReady} of ${allDocs.length} documents ready</p></div>
                <div style="font-size:2.2rem;font-weight:800">${totalPct}%</div>
            </div>
            <div class="progress-container" style="margin-top:12px;height:8px;background:rgba(255,255,255,0.2)">
                <div class="progress-bar" style="width:${totalPct}%;background:white"></div>
            </div>
        </div>

        <!-- Tag filter -->
        <div class="flex gap-2 flex-wrap" style="margin-bottom:20px">
            <button class="btn ${!filterTag?'btn-primary':'btn-outline'} tag-filter-btn" data-tag="" style="font-size:12px;padding:5px 12px">All</button>
            ${TAGS.list.map(t=>`<button class="btn ${filterTag===t?'btn-primary':'btn-outline'} tag-filter-btn" data-tag="${t}" style="font-size:12px;padding:5px 12px;${filterTag===t?`background:${TAGS.colors[t]};border-color:${TAGS.colors[t]}`:''}">${t}</button>`).join('')}
        </div>

        <!-- Section cards -->
        ${Object.keys(DOC_TEMPLATES).map(section => {
            const sp = sectionProgress(allDocs, section);
            const secDocs = docs.filter(d => d.section === section);
            const sectionIcon = section.includes('University') ? 'graduation-cap' : section.includes('Scholarship') ? 'award' : 'shield';
            return `
            <div class="card" style="margin-bottom:20px">
                <div class="flex justify-between items-center" style="margin-bottom:16px">
                    <h3 style="display:flex;align-items:center;gap:8px">
                        <i data-lucide="${sectionIcon}" style="width:18px;color:var(--primary-color)"></i> ${section}
                        <span class="badge badge-secondary">${sp.done}/${sp.total}</span>
                    </h3>
                    <div class="flex items-center gap-3" style="min-width:180px">
                        <div class="progress-container" style="flex:1;height:6px;margin:0">
                            <div class="progress-bar" style="width:${sp.pct}%;background:${sp.pct===100?'var(--success-color)':'var(--primary-color)'}"></div>
                        </div>
                        <span class="text-sm font-bold" style="color:${sp.pct===100?'var(--success-color)':'var(--text-secondary)'};">${sp.pct}%</span>
                    </div>
                </div>
                ${secDocs.length === 0 ?
                    `<p class="text-muted text-sm" style="padding:8px 0">No documents in this section yet. Click <strong>Auto-populate</strong> to add recommended documents.</p>` :
                    `<div style="display:flex;flex-direction:column;gap:8px">
                    ${secDocs.map(doc => {
                        const subtasks = doc.subtasks || [];
                        const doneSub = subtasks.filter(s => s.done).length;
                        const subPct = subtasks.length ? Math.round((doneSub/subtasks.length)*100) : 0;
                        const expDays = doc.expiry ? Math.ceil((new Date(doc.expiry)-new Date())/86400000) : null;
                        return `
                        <div style="border:1px solid var(--border-color);border-radius:var(--radius-md);padding:14px;transition:all 0.15s" class="doc-row">
                            <div class="flex justify-between items-start" style="margin-bottom:8px">
                                <div class="flex items-center gap-3">
                                    <div style="width:36px;height:36px;border-radius:var(--radius-md);background:${doc.status==='ready'||doc.status==='uploaded'?'#d1fae520':doc.status==='in-progress'?'#fef3c720':'#fee2e220'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                                        <i data-lucide="${doc.status==='ready'||doc.status==='uploaded'?'file-check':'file-text'}" style="width:16px;color:${doc.status==='ready'?'var(--success-color)':doc.status==='uploaded'?'var(--primary-color)':doc.status==='in-progress'?'var(--warning-color)':'var(--danger-color)'}"></i>
                                    </div>
                                    <div>
                                        <div class="font-medium">${doc.name}</div>
                                        <div class="flex gap-2 flex-wrap" style="margin-top:3px">
                                            <span class="badge badge-secondary text-xs">${doc.category||'General'}</span>
                                            ${(doc.tags||[]).map(t=>`<span class="badge text-xs" style="background:${TAGS.colors[t]||'#64748b'}15;color:${TAGS.colors[t]||'#64748b'}">${t}</span>`).join('')}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <select class="form-control doc-status-sel" data-id="${doc.id}" style="width:120px;padding:4px 8px;font-size:11px">
                                        ${['missing','in-progress','ready','uploaded'].map(s=>`<option value="${s}" ${doc.status===s?'selected':''}>${s.replace('-',' ')}</option>`).join('')}
                                    </select>
                                    <button class="icon-btn edit-doc" data-id="${doc.id}"><i data-lucide="edit-2" style="width:14px"></i></button>
                                    <button class="icon-btn del-doc" data-id="${doc.id}" style="color:var(--danger-color)"><i data-lucide="trash-2" style="width:14px"></i></button>
                                </div>
                            </div>
                            ${subtasks.length > 0 ? `
                            <div style="margin-left:48px;margin-top:8px">
                                <div class="flex items-center gap-2" style="margin-bottom:6px">
                                    <div class="progress-container" style="flex:1;height:4px;margin:0"><div class="progress-bar" style="width:${subPct}%;background:var(--success-color)"></div></div>
                                    <span class="text-xs text-muted">${doneSub}/${subtasks.length}</span>
                                </div>
                                <div style="display:flex;flex-wrap:wrap;gap:6px">
                                    ${subtasks.map((s,i) => `
                                    <label class="badge cursor-pointer subtask-toggle" data-doc="${doc.id}" data-idx="${i}" style="background:${s.done?'#d1fae5':'var(--bg-main)'};color:${s.done?'#065f46':'var(--text-secondary)'};cursor:pointer">
                                        <input type="checkbox" ${s.done?'checked':''} style="display:none">
                                        ${s.done?'✓':''} ${s.label||s}
                                    </label>`).join('')}
                                </div>
                            </div>` : ''}
                            ${expDays !== null ? `<div style="margin-left:48px;margin-top:6px"><span class="text-xs ${expDays<=90?'text-danger':'text-muted'}">⏰ ${expDays<=0?'EXPIRED':'Expires in '+expDays+'d'} (${doc.expiry})</span></div>` : ''}
                            ${doc.notes ? `<div style="margin-left:48px;margin-top:4px" class="text-xs text-secondary">${doc.notes}</div>` : ''}
                        </div>`;
                    }).join('')}
                    </div>`
                }
            </div>`;
        }).join('')}
        `;

        lucide.createIcons({ nodes:[wrap] });

        // Events
        wrap.querySelector('#add-doc-btn').onclick = () => openDocModal();
        wrap.querySelector('#auto-populate-btn').onclick = () => {
            let added = 0;
            const existing = DB.documents.all().map(d => d.name);
            Object.entries(DOC_TEMPLATES).forEach(([section, templates]) => {
                templates.forEach(tmpl => {
                    if (!existing.includes(tmpl.name)) {
                        DB.documents.add({
                            name: tmpl.name, status:'missing', section,
                            category: tmpl.category,
                            subtasks: tmpl.subtasks.map(s => ({ label:s, done:false })),
                            tags:[], notes:'', expiry:''
                        });
                        added++;
                    }
                });
            });
            UI.toast(`Added ${added} documents from templates!`,'success');
            render();
        };

        wrap.querySelectorAll('.tag-filter-btn').forEach(btn => {
            btn.onclick = () => { filterTag = btn.dataset.tag; render(); };
        });
        wrap.querySelectorAll('.doc-status-sel').forEach(sel => {
            sel.onchange = () => { DB.documents.update(+sel.dataset.id, {status:sel.value}); UI.toast('Status updated','success'); render(); };
        });
        wrap.querySelectorAll('.subtask-toggle').forEach(lbl => {
            lbl.onclick = () => {
                const doc = DB.documents.find(+lbl.dataset.doc);
                if (doc && doc.subtasks) {
                    doc.subtasks[+lbl.dataset.idx].done = !doc.subtasks[+lbl.dataset.idx].done;
                    DB.documents.update(doc.id, { subtasks:doc.subtasks });
                    render();
                }
            };
        });
        wrap.querySelectorAll('.edit-doc').forEach(btn => btn.onclick = () => openDocModal(DB.documents.find(+btn.dataset.id)));
        wrap.querySelectorAll('.del-doc').forEach(btn => btn.onclick = () => UI.confirm('Delete this document?', () => { DB.documents.remove(+btn.dataset.id); render(); }));
    };

    function openDocModal(existing) {
        const isEdit = !!existing;
        UI.modal(isEdit?'Edit Document':'Add Document', docForm(existing||{}), (overlay) => {
            const name = overlay.querySelector('#df-name').value.trim();
            if (!name) { UI.toast('Name required','error'); return false; }
            const tags = [...overlay.querySelectorAll('.tag-cb:checked')].map(cb => cb.value);
            const rawSub = overlay.querySelector('#df-subtasks').value.trim();
            const subtasks = rawSub ? rawSub.split(',').map(s => ({ label:s.trim(), done:false })) : [];
            const payload = {
                name, status: overlay.querySelector('#df-status').value,
                section:  overlay.querySelector('#df-section').value,
                category: overlay.querySelector('#df-cat').value,
                expiry:   overlay.querySelector('#df-expiry').value,
                tags, subtasks,
                notes: overlay.querySelector('#df-notes').value.trim(),
            };
            if (isEdit) { DB.documents.update(existing.id, payload); UI.toast('Updated','success'); }
            else         { DB.documents.add(payload);                  UI.toast('Document added','success'); }
            render();
        });
    }
    render();
    return wrap;
};
