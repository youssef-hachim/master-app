window.views = window.views || {};

/* -------- VISA CHECKLIST -------- */
window.views.visa = () => {
    const wrap = document.createElement('div');
    const render = () => {
        const steps = DB.visa.get();
        const done  = steps.filter(s => s.done).length;
        const pct   = Math.round((done / steps.length) * 100);
        wrap.innerHTML = `
            <div class="page-header">
                <div><h2>Visa Checklist 🇮🇹</h2><p class="page-desc">Step-by-step visa process tailored for Moroccan students.</p></div>
            </div>
            <div class="card" style="margin-bottom:24px;background:linear-gradient(135deg,#0d47a1,#00838f);color:white">
                <div class="flex justify-between items-center" style="flex-wrap:wrap;gap:12px">
                    <div>
                        <h3 style="color:white;margin-bottom:4px">Overall Visa Progress</h3>
                        <p style="opacity:0.8;font-size:13px">${done} of ${steps.length} steps completed</p>
                    </div>
                    <div style="font-size:2rem;font-weight:800">${pct}%</div>
                </div>
                <div class="progress-container" style="margin-top:12px;height:10px;background:rgba(255,255,255,0.2)">
                    <div class="progress-bar" style="width:${pct}%;background:white"></div>
                </div>
            </div>
            <div class="card">
                <h3 style="margin-bottom:16px">Steps</h3>
                <div id="visa-steps">
                    ${steps.map(s => `
                    <div class="checkbox-row ${s.done?'done':''}" data-step="${s.id}">
                        <input type="checkbox" class="visa-check" data-id="${s.id}" ${s.done?'checked':''}>
                        <div style="flex:1">
                            <div class="font-medium">${s.step}</div>
                            <div style="margin-top:4px">
                                <input type="text" class="form-control visa-note" data-id="${s.id}" 
                                    placeholder="Add note..." value="${s.notes||''}"
                                    style="font-size:12px;padding:4px 8px;margin-top:4px">
                            </div>
                        </div>
                        <span class="badge ${s.done?'badge-success':'badge-secondary'}">${s.done?'Done':'Pending'}</span>
                    </div>`).join('')}
                </div>
            </div>
            <div class="card" style="margin-top:20px;border-left:4px solid var(--accent-color)">
                <h3 style="margin-bottom:12px;display:flex;align-items:center;gap:8px">
                    <i data-lucide="lightbulb" style="width:18px;color:var(--accent-color)"></i> Tips for Moroccan Students
                </h3>
                <ul style="display:flex;flex-direction:column;gap:8px;font-size:13px;color:var(--text-secondary)">
                    <li>📌 Pre-enrollment on <a href="https://www.universitaly.it" target="_blank">Universitaly</a> opens in January for the academic year starting in September.</li>
                    <li>📌 CIMEA is faster (~3-4 weeks, costs ~150€) than the DoV, which is free but takes longer through the Consulate.</li>
                    <li>📌 You can request your bank to issue a statement specifically mentioning you have ≥6,000€ for study purposes.</li>
                    <li>📌 VFS Global appointments in Casablanca/Rabat book up fast — book as early as possible.</li>
                    <li>📌 ISMEA scholarship (for Moroccan students) often covers the full first year at some Italian universities.</li>
                </ul>
            </div>
        `;
        lucide.createIcons({ nodes: [wrap] });

        wrap.querySelectorAll('.visa-check').forEach(cb => {
            cb.onchange = () => { DB.visa.toggleDone(+cb.dataset.id); render(); };
        });
        wrap.querySelectorAll('.visa-note').forEach(inp => {
            inp.onblur = () => DB.visa.saveNotes(+inp.dataset.id, inp.value);
        });
    };
    render();
    return wrap;
};

/* -------- CALENDAR / DEADLINES -------- */
window.views.calendar = () => {
    const wrap = document.createElement('div');
    let currentDate = new Date();

    function ddlForm(d = {}) {
        return `
            <div class="form-group"><label class="form-label">Title *</label><input id="ddl-title" class="form-control" value="${d.title||''}" placeholder="Application deadline, visa, scholarship..."></div>
            <div class="grid grid-cols-2" style="gap:12px">
                <div class="form-group"><label class="form-label">Date *</label><input id="ddl-date" class="form-control" type="date" value="${d.date||''}"></div>
                <div class="form-group"><label class="form-label">Type</label>
                    <select id="ddl-type" class="form-control">
                        ${['application','scholarship','document','visa','other'].map(t=>`<option ${d.type===t?'selected':''}>${t}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-group"><label class="form-label">Notes</label><textarea id="ddl-notes" class="form-control">${d.notes||''}</textarea></div>
        `;
    }

    function openDdlModal(existing) {
        UI.modal(existing?'Edit Deadline':'Add Deadline', ddlForm(existing||{}), (overlay) => {
            const title = overlay.querySelector('#ddl-title').value.trim();
            const date  = overlay.querySelector('#ddl-date').value;
            if (!title || !date) { UI.toast('Title and date required','error'); return false; }
            const payload = { title, date, type: overlay.querySelector('#ddl-type').value, notes: overlay.querySelector('#ddl-notes').value.trim() };
            if (existing) { DB.deadlines.update(existing.id, payload); UI.toast('Updated','success'); }
            else           { DB.deadlines.add(payload);                  UI.toast('Deadline added','success'); }
            renderCal();
        });
    }

    function renderCal() {
        const ddls = DB.deadlines.all();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const typeColor = { application:'#0d47a1',scholarship:'#f57c00',document:'#2e7d32',visa:'#c62828',other:'#64748b' };

        // Build deadline map by date
        const ddlMap = {};
        ddls.forEach(d => { if (!ddlMap[d.date]) ddlMap[d.date] = []; ddlMap[d.date].push(d); });

        wrap.innerHTML = `
            <div class="page-header">
                <div><h2>Deadline Calendar</h2><p class="page-desc">All your important dates in one place.</p></div>
                <button class="btn btn-primary" id="add-ddl-btn"><i data-lucide="plus"></i> Add Deadline</button>
            </div>

            <div class="grid grid-cols-2" style="gap:20px;align-items:start">
                <!-- Calendar -->
                <div class="card" style="grid-column: 1 / -1">
                    <div class="flex justify-between items-center" style="margin-bottom:16px">
                        <button class="btn btn-outline" id="cal-prev"><i data-lucide="chevron-left"></i></button>
                        <h3>${monthNames[month]} ${year}</h3>
                        <button class="btn btn-outline" id="cal-next"><i data-lucide="chevron-right"></i></button>
                    </div>
                    <div class="calendar-grid">
                        ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="cal-day-header">${d}</div>`).join('')}
                        ${Array(firstDay === 0 ? 6 : firstDay - 1).fill('<div></div>').join('')}
                        ${Array.from({length: daysInMonth}, (_,i) => {
                            const dayNum = i + 1;
                            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
                            const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===dayNum;
                            const events  = ddlMap[dateStr] || [];
                            return `<div class="cal-day ${isToday?'today':''}">
                                <div class="cal-day-num">${dayNum}</div>
                                ${events.map(e=>`<div class="cal-event-dot" style="background:${typeColor[e.type]||'#64748b'}" title="${e.title}"></div>`).join('')}
                            </div>`;
                        }).join('')}
                    </div>
                    <div class="flex gap-3" style="margin-top:12px;flex-wrap:wrap">
                        ${Object.entries(typeColor).map(([t,c])=>`<span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--text-secondary)"><span style="width:10px;height:10px;border-radius:50%;background:${c};display:inline-block"></span>${t}</span>`).join('')}
                    </div>
                </div>

                <!-- Upcoming list -->
                <div class="card" style="grid-column: 1 / -1">
                    <h3 style="margin-bottom:16px">All Deadlines</h3>
                    ${ddls.length === 0 ? '<p class="text-secondary text-sm">No deadlines added yet.</p>' :
                    `<table class="data-table">
                        <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Days Left</th><th style="text-align:right">Actions</th></tr></thead>
                        <tbody>
                            ${ddls.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(d=>{
                                const daysLeft = Math.ceil((new Date(d.date)-today)/86400000);
                                return `<tr>
                                    <td><span class="font-medium">${d.title}</span>${d.notes?`<div class="text-xs text-muted">${d.notes}</div>`:''}</td>
                                    <td><span class="badge badge-secondary">${d.type}</span></td>
                                    <td class="text-secondary text-sm">${d.date}</td>
                                    <td><span class="badge ${daysLeft<=7?'badge-danger':daysLeft<=30?'badge-warning':'badge-secondary'}">${daysLeft<=0?'Passed':daysLeft+'d'}</span></td>
                                    <td style="text-align:right">
                                        <button class="icon-btn edit-ddl" data-id="${d.id}"><i data-lucide="edit-2" style="width:14px"></i></button>
                                        <button class="icon-btn del-ddl" data-id="${d.id}" style="color:var(--danger-color)"><i data-lucide="trash-2" style="width:14px"></i></button>
                                    </td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>`}
                </div>
            </div>
        `;

        lucide.createIcons({ nodes: [wrap] });
        wrap.querySelector('#add-ddl-btn').onclick = () => openDdlModal();
        wrap.querySelector('#cal-prev').onclick = () => { currentDate = new Date(year, month - 1, 1); renderCal(); };
        wrap.querySelector('#cal-next').onclick = () => { currentDate = new Date(year, month + 1, 1); renderCal(); };
        wrap.querySelectorAll('.edit-ddl').forEach(btn => btn.onclick = () => openDdlModal(DB.deadlines.find(+btn.dataset.id)));
        wrap.querySelectorAll('.del-ddl').forEach(btn => btn.onclick = () => UI.confirm('Delete deadline?', () => { DB.deadlines.remove(+btn.dataset.id); renderCal(); }));
    }

    renderCal();
    return wrap;
};

/* -------- NOTES -------- */
window.views.notes = () => {
    const wrap = document.createElement('div');
    function noteForm(n = {}) {
        return `
            <div class="form-group"><label class="form-label">Title *</label><input id="nf-title" class="form-control" value="${n.title||''}" placeholder="Motivation letter ideas, interview tips..."></div>
            <div class="form-group"><label class="form-label">Category</label>
                <select id="nf-cat" class="form-control">
                    ${['General','Motivation Letter','Interview Prep','Application Strategy','Research'].map(c=>`<option ${n.category===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label class="form-label">Content *</label><textarea id="nf-content" class="form-control" style="min-height:150px">${n.content||''}</textarea></div>
        `;
    }

    const render = () => {
        const list = DB.notes.all();
        wrap.innerHTML = `
            <div class="page-header">
                <div><h2>Notes</h2><p class="page-desc">Personal notes for motivation letters, interview prep, and strategies.</p></div>
                <button class="btn btn-primary" id="add-note-btn"><i data-lucide="plus"></i> New Note</button>
            </div>
        `;
        if (list.length === 0) {
            wrap.appendChild(UI.emptyState('notebook','No notes yet','Write notes for motivation letters, interview prep, and application strategies.','Create Note', () => openNoteModal()));
        } else {
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2';
            list.forEach(n => {
                const c = document.createElement('div');
                c.className = 'card';
                const colors = { General:'#0d47a1','Motivation Letter':'#00838f','Interview Prep':'#f57c00','Application Strategy':'#c62828',Research:'#2e7d32' };
                c.innerHTML = `
                    <div class="flex justify-between items-start" style="margin-bottom:8px">
                        <span class="badge" style="background:${colors[n.category]||'#64748b'}20;color:${colors[n.category]||'#64748b'}">${n.category||'General'}</span>
                        <div class="flex gap-1">
                            <button class="icon-btn edit-note" data-id="${n.id}"><i data-lucide="edit-2" style="width:14px"></i></button>
                            <button class="icon-btn del-note"  data-id="${n.id}" style="color:var(--danger-color)"><i data-lucide="trash-2" style="width:14px"></i></button>
                        </div>
                    </div>
                    <h3 style="font-size:1rem;margin-bottom:8px">${n.title}</h3>
                    <p class="text-secondary text-sm" style="white-space:pre-wrap;max-height:100px;overflow:hidden">${n.content}</p>
                    <p class="text-xs text-muted" style="margin-top:8px">${new Date(n.createdAt).toLocaleDateString()}</p>
                `;
                grid.appendChild(c);
            });
            wrap.appendChild(grid);
        }
        lucide.createIcons({ nodes: [wrap] });
        wrap.querySelector('#add-note-btn').onclick = () => openNoteModal();
        wrap.querySelectorAll('.edit-note').forEach(btn => btn.onclick = () => openNoteModal(DB.notes.find(+btn.dataset.id)));
        wrap.querySelectorAll('.del-note').forEach(btn => btn.onclick = () => UI.confirm('Delete note?', () => { DB.notes.remove(+btn.dataset.id); render(); }));
    };

    function openNoteModal(existing) {
        UI.modal(existing?'Edit Note':'New Note', noteForm(existing||{}), (overlay) => {
            const title   = overlay.querySelector('#nf-title').value.trim();
            const content = overlay.querySelector('#nf-content').value.trim();
            if (!title || !content) { UI.toast('Title and content required','error'); return false; }
            const payload = { title, content, category: overlay.querySelector('#nf-cat').value };
            if (existing) { DB.notes.update(existing.id, payload); UI.toast('Updated','success'); }
            else           { DB.notes.add(payload);                  UI.toast('Note saved','success'); }
            render();
        });
    }
    render();
    return wrap;
};
