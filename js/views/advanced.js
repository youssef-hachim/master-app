window.views = window.views || {};

/* ================================================================
   ANALYTICS DASHBOARD
   ================================================================ */
window.views.analytics = () => {
    const wrap = document.createElement('div');
    const apps = DB.applications.all();
    const docs = DB.documents.all();
    const ddls = DB.deadlines.all();
    const visa = DB.visa.get();

    const totalApps   = apps.length;
    const accepted    = apps.filter(a=>a.status==='accepted').length;
    const rejected    = apps.filter(a=>a.status==='rejected').length;
    const pending     = apps.filter(a=>['submitted','waiting'].includes(a.status)).length;
    const preparing   = apps.filter(a=>['not-started','in-progress'].includes(a.status)).length;
    const successRate = totalApps ? Math.round((accepted/totalApps)*100) : 0;

    const totalDocs   = docs.length;
    const readyDocs   = docs.filter(d=>d.status==='ready'||d.status==='uploaded').length;
    const missingDocs = docs.filter(d=>d.status==='missing');
    const docPct      = totalDocs ? Math.round((readyDocs/totalDocs)*100) : 0;

    const visaDone    = visa.filter(s=>s.done).length;
    const visaPct     = Math.round((visaDone/visa.length)*100);

    const today = new Date();
    const upcomingDdls = ddls.filter(d=>new Date(d.date)>=today).sort((a,b)=>new Date(a.date)-new Date(b.date));

    // Application status breakdown for bar chart
    const statusCounts = {
        'Not Started': apps.filter(a=>a.status==='not-started').length,
        'In Progress': apps.filter(a=>a.status==='in-progress').length,
        'Submitted':   apps.filter(a=>a.status==='submitted').length,
        'Waiting':     apps.filter(a=>a.status==='waiting').length,
        'Accepted':    accepted,
        'Rejected':    rejected
    };
    const maxStatus = Math.max(...Object.values(statusCounts), 1);
    const statusColors = { 'Not Started':'#94a3b8', 'In Progress':'#d97706', 'Submitted':'#1e40af', 'Waiting':'#6d28d9', 'Accepted':'#059669', 'Rejected':'#dc2626' };

    wrap.innerHTML = `
    <div class="page-header">
        <div><h2>Progress Analytics</h2><p class="page-desc">Visual overview of your entire study journey.</p></div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-4" style="margin-bottom:24px">
        <div class="card" style="text-align:center">
            <div style="width:72px;height:72px;border-radius:50%;background:conic-gradient(var(--success-color) ${successRate}%, var(--bg-main) 0);margin:0 auto 10px;display:flex;align-items:center;justify-content:center">
                <div style="width:56px;height:56px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1rem">${successRate}%</div>
            </div>
            <div class="font-medium text-sm">Success Rate</div>
            <div class="text-xs text-muted">${accepted} of ${totalApps} accepted</div>
        </div>
        <div class="card" style="text-align:center">
            <div style="width:72px;height:72px;border-radius:50%;background:conic-gradient(var(--primary-color) ${docPct}%, var(--bg-main) 0);margin:0 auto 10px;display:flex;align-items:center;justify-content:center">
                <div style="width:56px;height:56px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1rem">${docPct}%</div>
            </div>
            <div class="font-medium text-sm">Documents Ready</div>
            <div class="text-xs text-muted">${readyDocs} of ${totalDocs}</div>
        </div>
        <div class="card" style="text-align:center">
            <div style="width:72px;height:72px;border-radius:50%;background:conic-gradient(var(--secondary-color) ${visaPct}%, var(--bg-main) 0);margin:0 auto 10px;display:flex;align-items:center;justify-content:center">
                <div style="width:56px;height:56px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1rem">${visaPct}%</div>
            </div>
            <div class="font-medium text-sm">Visa Progress</div>
            <div class="text-xs text-muted">${visaDone} of ${visa.length} steps</div>
        </div>
        <div class="card" style="text-align:center">
            <div style="font-size:2.4rem;font-weight:800;color:${upcomingDdls.length?'var(--warning-color)':'var(--text-muted)'};margin-bottom:6px">${upcomingDdls.length}</div>
            <div class="font-medium text-sm">Upcoming Deadlines</div>
            ${upcomingDdls[0]?`<div class="text-xs text-muted">Next: ${upcomingDdls[0].title}</div>`:'<div class="text-xs text-muted">None</div>'}
        </div>
    </div>

    <div class="grid grid-cols-2" style="gap:20px;margin-bottom:24px">
        <!-- Application status breakdown -->
        <div class="card">
            <h3 style="margin-bottom:16px">Application Status Breakdown</h3>
            ${Object.entries(statusCounts).map(([label, count]) => `
            <div class="budget-bar-row">
                <div class="budget-bar-label" style="width:100px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${statusColors[label]};margin-right:6px"></span>${label}</div>
                <div class="budget-bar-track"><div class="budget-bar-fill" style="width:${(count/maxStatus)*100}%;background:${statusColors[label]}"></div></div>
                <span class="text-sm font-bold" style="width:30px;text-align:right">${count}</span>
            </div>`).join('')}
        </div>

        <!-- Missing documents -->
        <div class="card">
            <h3 style="margin-bottom:16px;display:flex;align-items:center;gap:8px">
                <i data-lucide="alert-triangle" style="width:16px;color:var(--danger-color)"></i>
                Missing Documents (${missingDocs.length})
            </h3>
            ${missingDocs.length === 0 ?
                '<div class="flex items-center gap-2" style="padding:16px 0;color:var(--success-color)"><i data-lucide="check-circle" style="width:18px"></i><span class="font-medium">All documents are in order! 🎉</span></div>' :
                missingDocs.map(d=>`
                <div class="flex items-center justify-between" style="padding:8px 0;border-bottom:1px solid var(--border-light)">
                    <div class="flex items-center gap-2">
                        <i data-lucide="file-x" style="width:14px;color:var(--danger-color)"></i>
                        <span class="text-sm">${d.name}</span>
                    </div>
                    <span class="badge doc-missing">Missing</span>
                </div>`).join('')
            }
        </div>
    </div>

    <!-- Timeline -->
    <div class="card">
        <h3 style="margin-bottom:16px">Journey Timeline</h3>
        <div style="display:flex;flex-direction:column;gap:4px">
            ${[
                {label:'Profile Setup', done: !!DB.profile.get().name, icon:'user'},
                {label:'Programs Researched', done: DB.programs.all().length > 0, icon:'search'},
                {label:'Applications Started', done: apps.length > 0, icon:'briefcase'},
                {label:'Documents Prepared', done: docPct >= 50, icon:'file-text'},
                {label:'Applications Submitted', done: pending > 0 || accepted > 0, icon:'send'},
                {label:'Acceptance Received', done: accepted > 0, icon:'check-circle'},
                {label:'Visa Process Started', done: visaDone >= 1, icon:'shield'},
                {label:'Visa Completed', done: visaPct === 100, icon:'plane'},
            ].map((step,i)=>`
            <div class="flex items-center gap-3" style="padding:10px 0">
                <div style="width:32px;height:32px;border-radius:50%;background:${step.done?'var(--success-color)':'var(--bg-main)'};color:${step.done?'white':'var(--text-muted)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;font-size:12px;border:2px solid ${step.done?'var(--success-color)':'var(--border-color)'}">
                    ${step.done?'✓':(i+1)}
                </div>
                <span class="${step.done?'font-medium':'text-muted'} text-sm" style="${step.done?'':'opacity:0.6'}">${step.label}</span>
                ${step.done?'<span class="badge badge-success" style="font-size:10px">Done</span>':''}
            </div>`).join('')}
        </div>
    </div>
    `;
    lucide.createIcons({nodes:[wrap]});
    return wrap;
};

/* ================================================================
   AFTER ARRIVAL GUIDE
   ================================================================ */
window.views.afterarrival = () => {
    const wrap = document.createElement('div');
    const steps = [
        {
            title: 'Codice Fiscale (Tax Code)',
            icon: 'hash', color: '#1e40af',
            where: 'Agenzia delle Entrate (local tax office)',
            when: 'Within first 2-3 days of arrival',
            docs: ['Passport (original + copy)', 'Visa copy', 'Address in Italy (even temporary)'],
            steps: ['Find nearest Agenzia delle Entrate office', 'Go in person (no appointment needed in most cities)', 'Fill the AA4/8 form (available at the office)', 'Receive your Codice Fiscale card on the spot'],
            tips: ['Free and usually takes 15-30 minutes', 'You need this for EVERYTHING: bank, phone, rent, university enrollment', 'Some offices are less crowded early morning (8:30 AM)'],
            warnings: ['Without this, you cannot open a bank account or sign a rental contract']
        },
        {
            title: 'Open a Bank Account',
            icon: 'landmark', color: '#059669',
            where: 'Italian bank (UniCredit, Intesa Sanpaolo, etc.)',
            when: 'After getting Codice Fiscale',
            docs: ['Passport', 'Codice Fiscale', 'University enrollment letter', 'Permesso di soggiorno receipt (kit postale)', 'Proof of address'],
            steps: ['Compare banks (some are free for students under 30)', 'Book appointment online or walk in', 'Bring all documents', 'Wait for card activation (5-10 business days)'],
            tips: ['UniCredit and Intesa Sanpaolo are most foreigner-friendly', 'Ask for "conto corrente per studenti" (student account)', 'Some banks let you open a basic account with just passport + codice fiscale', 'Online banks like Revolut/Wise work as backup while waiting'],
            warnings: ['Some branches may refuse non-EU clients — try a different branch', 'IBAN needed for scholarship payments']
        },
        {
            title: 'Permesso di Soggiorno (Residence Permit)',
            icon: 'id-card', color: '#dc2626',
            where: 'Post Office (Poste Italiane) → Questura',
            when: 'Within 8 days of arrival (legally required)',
            docs: ['Kit Postale (yellow envelope from Post Office, ~€110)', 'Passport + visa copies', '4 passport photos', 'Codice Fiscale', '€16 Marca da Bollo (revenue stamp)', 'Insurance proof', 'University enrollment proof', 'Financial proof'],
            steps: ['Buy "Kit Postale per Permesso di Soggiorno" at any post office', 'Fill all forms inside the kit (Modulo 1 + others)', 'Attach all required documents and copies', 'Submit at the post office counter', 'Receive appointment date (convocazione) for fingerprints at Questura', 'Go to Questura on your appointment date', 'Wait for Permesso card (can take 1-6 months)'],
            tips: ['The post office receipt (ricevuta) is your temporary proof of legal stay', 'Keep all receipts — you may need them for travel or scholarship claims', 'Some universities have a dedicated international office that helps with this', 'Download the "Poste Italiane" app to track your permesso status'],
            warnings: ['Missing the 8-day deadline can cause legal issues', 'Do NOT lose the appointment slip (convocazione)', 'This is the most important document process after arrival']
        },
        {
            title: 'SIM Card & Phone Plan',
            icon: 'smartphone', color: '#7c3aed',
            where: 'Any phone shop (TIM, Vodafone, Iliad, WindTre)',
            when: 'Day 1-2',
            docs: ['Passport', 'Codice Fiscale (some shops accept just passport)'],
            steps: ['Compare plans: Iliad (€7-10/mo, best value), TIM, Vodafone', 'Visit a store with documents', 'Choose a plan with data (8-12GB minimum)'],
            tips: ['Iliad offers some of the best rates in Europe', 'Many university areas have free WiFi too', 'WhatsApp is essential for student groups'],
            warnings: ['Some operators require Codice Fiscale — get that first']
        },
        {
            title: 'University Enrollment & Student Card',
            icon: 'graduation-cap', color: '#0891b2',
            where: 'University Segreteria Studenti',
            when: 'First week',
            docs: ['Acceptance letter', 'Passport + visa', 'Codice Fiscale', 'Permesso receipt', 'ISEE/ISEEU for fee reduction (if applicable)'],
            steps: ['Complete online enrollment (usually started before arrival)', 'Upload remaining documents', 'Pay first installment of tuition', 'Collect student badge/card', 'Activate university email and WiFi access'],
            tips: ['Student card gives discounts on transport, museums, food', 'Check if your DSU (regional scholarship) covers meals at university canteen', 'Join student Telegram/WhatsApp groups immediately'],
            warnings: ['Deadlines for enrollment are strict — check your university calendar']
        },
        {
            title: 'Transport Card',
            icon: 'train', color: '#f59e0b',
            where: 'Local transport authority or Tabaccheria',
            when: 'First week',
            docs: ['Student card or passport', 'Photo'],
            steps: ['Get a monthly/annual transport pass', 'Most cities: €30-50/month for students', 'Milan: ATM pass. Torino: GTT. Padova: Busitalia. Rome: ATAC'],
            tips: ['Annual pass is much cheaper than monthly', 'Some DSU scholarships include free transport', 'Google Maps works well for Italian public transport'],
            warnings: ['Fines for riding without a valid ticket are €50-100+']
        }
    ];

    wrap.innerHTML = `
    <div class="page-header">
        <div><h2>After Arrival Guide 🇮🇹</h2><p class="page-desc">Your step-by-step guide for the first week in Italy.</p></div>
    </div>
    <div class="card" style="margin-bottom:24px;background:linear-gradient(135deg,#1e40af,#0891b2);color:white">
        <div class="flex items-center gap-4" style="flex-wrap:wrap">
            <i data-lucide="plane-landing" style="width:48px;height:48px;opacity:0.8;flex-shrink:0"></i>
            <div>
                <h3 style="color:white;margin-bottom:6px">Welcome to Italy! 🎉</h3>
                <p style="opacity:0.9;font-size:13px">Here's everything you need to do in your first days. Follow these steps in order for the smoothest experience.</p>
            </div>
        </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px">
    ${steps.map((s,i)=>`
    <div class="card">
        <div class="flex items-start gap-4">
            <div style="width:40px;height:40px;border-radius:50%;background:${s.color}15;color:${s.color};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:800;font-size:15px">${i+1}</div>
            <div style="flex:1">
                <h3 style="margin-bottom:4px;display:flex;align-items:center;gap:8px"><i data-lucide="${s.icon}" style="width:18px;color:${s.color}"></i>${s.title}</h3>
                <div class="flex gap-3 flex-wrap" style="margin-bottom:12px;font-size:12px;color:var(--text-secondary)">
                    <span>📍 ${s.where}</span><span>📅 ${s.when}</span>
                </div>
                <details ${i===0?'open':''}>
                    <summary style="cursor:pointer;font-size:13px;font-weight:600;color:var(--primary-color);margin-bottom:8px">Show details</summary>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:12px" class="arrival-detail-grid">
                        <div>
                            <div class="font-bold" style="margin-bottom:6px;color:var(--text-primary)">📄 Required Documents</div>
                            <ul style="color:var(--text-secondary);display:flex;flex-direction:column;gap:3px">${s.docs.map(d=>`<li>• ${d}</li>`).join('')}</ul>
                        </div>
                        <div>
                            <div class="font-bold" style="margin-bottom:6px;color:var(--text-primary)">📋 Steps</div>
                            <ol style="color:var(--text-secondary);display:flex;flex-direction:column;gap:3px;padding-left:16px;list-style:decimal">${s.steps.map(st=>`<li>${st}</li>`).join('')}</ol>
                        </div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px;font-size:12px" class="arrival-detail-grid">
                        <div style="background:#f0fdf4;padding:10px;border-radius:var(--radius-md)">
                            <div class="font-bold" style="margin-bottom:4px;color:#065f46">💡 Tips</div>
                            <ul style="color:#047857;display:flex;flex-direction:column;gap:3px">${s.tips.map(t=>`<li>• ${t}</li>`).join('')}</ul>
                        </div>
                        <div style="background:#fef2f2;padding:10px;border-radius:var(--radius-md)">
                            <div class="font-bold" style="margin-bottom:4px;color:#991b1b">⚠️ Warnings</div>
                            <ul style="color:#dc2626;display:flex;flex-direction:column;gap:3px">${s.warnings.map(w=>`<li>• ${w}</li>`).join('')}</ul>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    </div>`).join('')}
    </div>
    `;
    lucide.createIcons({nodes:[wrap]});
    return wrap;
};

/* ================================================================
   MY PORTALS — centralized login/portal manager
   ================================================================ */
window.views.portals = () => {
    const wrap = document.createElement('div');

    function portalForm(p={}) {
        return `
            <div class="form-group"><label class="form-label">Portal Name *</label><input id="ptl-name" class="form-control" value="${p.name||''}" placeholder="e.g. Politecnico di Milano Apply"></div>
            <div class="form-group"><label class="form-label">Portal URL *</label><input id="ptl-url" class="form-control" value="${p.url||''}" placeholder="https://apply.polimi.it"></div>
            <div class="form-group"><label class="form-label">Login URL</label><input id="ptl-login" class="form-control" value="${p.loginUrl||''}" placeholder="https://login.polimi.it"></div>
            <div class="form-group"><label class="form-label">Category</label>
                <select id="ptl-cat" class="form-control">
                    ${['University Application','Scholarship','Pre-enrollment','Visa/Consulate','Housing','Other'].map(c=>`<option ${p.category===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label class="form-label">Username / Email Hint</label><input id="ptl-user" class="form-control" value="${p.username||''}" placeholder="yourname@email.com"></div>
            <div class="form-group"><label class="form-label">Notes</label><textarea id="ptl-notes" class="form-control">${p.notes||''}</textarea></div>
        `;
    }

    const render = () => {
        const list = DB.portals.all();
        // Also gather portals from applications
        const appPortals = DB.applications.all().filter(a=>a.portalUrl).map(a=>({
            name: a.program + ' — ' + a.university,
            url: a.portalUrl, loginUrl: a.loginUrl||'',
            username: a.portalNotes||'', category:'University Application',
            fromApp: true, appId: a.id
        }));
        const allPortals = [...list, ...appPortals];
        const cats = [...new Set(allPortals.map(p=>p.category||'Other'))];

        wrap.innerHTML = `
        <div class="page-header">
            <div><h2>My Portals</h2><p class="page-desc">Quick access to all application portals and login pages.</p></div>
            <button class="btn btn-primary" id="add-portal-btn"><i data-lucide="plus"></i> Add Portal</button>
        </div>
        `;

        if (allPortals.length === 0) {
            wrap.appendChild(UI.emptyState('key','No portals saved','Add links to university application portals, scholarship sites, and more.','Add Portal',()=>openPortalModal()));
            lucide.createIcons({nodes:[wrap]});
            wrap.querySelector('#add-portal-btn').onclick=()=>openPortalModal();
            return;
        }

        cats.forEach(cat => {
            const catPortals = allPortals.filter(p=>(p.category||'Other')===cat);
            if (catPortals.length === 0) return;
            const sec = document.createElement('div');
            sec.style.marginBottom = '20px';
            sec.innerHTML = `
                <h3 style="margin-bottom:12px;display:flex;align-items:center;gap:8px">
                    <i data-lucide="${cat.includes('University')?'graduation-cap':cat.includes('Scholarship')?'award':cat.includes('Visa')?'shield':'link'}" style="width:16px;color:var(--primary-color)"></i>
                    ${cat} <span class="badge badge-secondary">${catPortals.length}</span>
                </h3>
                <div class="grid grid-cols-2" style="gap:12px">
                    ${catPortals.map(p=>`
                    <div class="card flex items-center gap-3" style="padding:16px">
                        <div style="width:40px;height:40px;border-radius:var(--radius-md);background:var(--primary-light);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                            <i data-lucide="external-link" style="width:18px;color:var(--primary-color)"></i>
                        </div>
                        <div style="flex:1;min-width:0">
                            <div class="font-medium text-sm" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
                            ${p.username?`<div class="text-xs text-muted">👤 ${p.username}</div>`:''}
                        </div>
                        <div class="flex gap-1">
                            <a href="${p.url}" target="_blank" class="btn btn-primary" style="font-size:11px;padding:5px 10px">Open</a>
                            ${p.loginUrl?`<a href="${p.loginUrl}" target="_blank" class="btn btn-outline" style="font-size:11px;padding:5px 10px">Login</a>`:''}
                            ${!p.fromApp?`<button class="icon-btn del-portal" data-id="${p.id}" style="width:28px;height:28px;color:var(--danger-color)"><i data-lucide="trash-2" style="width:12px"></i></button>`:''}
                        </div>
                    </div>`).join('')}
                </div>
            `;
            wrap.appendChild(sec);
        });

        lucide.createIcons({nodes:[wrap]});
        wrap.querySelector('#add-portal-btn').onclick=()=>openPortalModal();
        wrap.querySelectorAll('.del-portal').forEach(b=>b.onclick=()=>UI.confirm('Delete portal?',()=>{DB.portals.remove(+b.dataset.id);render();}));
    };

    function openPortalModal(existing) {
        UI.modal(existing?'Edit Portal':'Add Portal', portalForm(existing||{}), (overlay) => {
            const name = overlay.querySelector('#ptl-name').value.trim();
            const url  = overlay.querySelector('#ptl-url').value.trim();
            if (!name||!url) { UI.toast('Name and URL required','error'); return false; }
            const payload = { name, url,
                loginUrl: overlay.querySelector('#ptl-login').value.trim(),
                category: overlay.querySelector('#ptl-cat').value,
                username: overlay.querySelector('#ptl-user').value.trim(),
                notes:    overlay.querySelector('#ptl-notes').value.trim(),
            };
            if (existing) { DB.portals.update(existing.id, payload); UI.toast('Updated','success'); }
            else           { DB.portals.add(payload); UI.toast('Portal added','success'); }
            render();
        });
    }
    render();
    return wrap;
};
