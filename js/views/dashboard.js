window.views = window.views || {};

window.views.dashboard = () => {
    const profile = DB.profile.get();
    const apps    = DB.applications.all();
    const docs    = DB.documents.all();
    const ddls    = DB.deadlines.all().sort((a,b)=>new Date(a.date)-new Date(b.date));
    const alerts  = DB.alerts.generate();
    const today   = new Date();
    const hasName = profile.name.trim() !== '';

    const wrap = document.createElement('div');

    // ---- New user onboarding ----
    if (!hasName && apps.length === 0 && docs.length === 0) {
        wrap.innerHTML = `
        <div class="page-header"><div><h2>Welcome! Set up your profile to get started 👋</h2><p class="page-desc">Your all-in-one platform for studying a Master's in Italy. 🇮🇹</p></div></div>
        <div class="card" style="background:linear-gradient(135deg,#1e40af,#0891b2);color:white;margin-bottom:24px">
            <div class="flex items-center gap-4" style="flex-wrap:wrap">
                <i data-lucide="rocket" style="width:48px;height:48px;opacity:0.8;flex-shrink:0"></i>
                <div>
                    <h2 style="color:white;margin-bottom:8px">Let's start your journey</h2>
                    <p style="opacity:0.9;margin-bottom:16px">Begin by filling in your profile, then browse programs and track your applications.</p>
                    <div class="flex gap-3 flex-wrap">
                        <button class="btn" style="background:white;color:var(--primary-color)" onclick="location.hash='#profile'"><i data-lucide="user"></i> Set Up Profile</button>
                        <button class="btn" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.4)" onclick="location.hash='#masters'"><i data-lucide="search"></i> Browse Programs</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-3" style="gap:16px">
            ${[
                {icon:'briefcase',color:'var(--primary-color)',t:'Applications',d:'Track university applications',h:'#applications'},
                {icon:'file-check',color:'var(--success-color)',t:'Documents',d:'Manage required documents',h:'#documents'},
                {icon:'award',color:'var(--accent-color)',t:'Scholarships',d:'Find & save scholarships',h:'#scholarships'},
                {icon:'shield',color:'var(--secondary-color)',t:'Visa Checklist',d:'Step-by-step visa guide',h:'#visa'},
                {icon:'bar-chart-3',color:'#7c3aed',t:'Analytics',d:'Track your progress',h:'#analytics'},
                {icon:'plane',color:'#dc2626',t:'After Arrival',d:'First week in Italy guide',h:'#afterarrival'},
            ].map(c=>`
            <div class="card card-interactive cursor-pointer" onclick="location.hash='${c.h}'" style="display:flex;align-items:center;gap:12px">
                <i data-lucide="${c.icon}" style="width:28px;height:28px;color:${c.color};flex-shrink:0"></i>
                <div><h4>${c.t}</h4><p class="text-secondary text-xs">${c.d}</p></div>
            </div>`).join('')}
        </div>`;
        return wrap;
    }

    // ---- Active Dashboard ----
    const activeApps  = apps.filter(a=>!['accepted','rejected'].includes(a.status)).length;
    const accepted    = apps.filter(a=>a.status==='accepted').length;
    const missingDocs = docs.filter(d=>d.status==='missing').length;
    const totalDocs   = docs.length;
    const readyDocs   = docs.filter(d=>d.status==='ready'||d.status==='uploaded').length;
    const docPct      = totalDocs ? Math.round((readyDocs/totalDocs)*100) : 0;
    const upcoming    = ddls.filter(d=>new Date(d.date)>=today).length;
    const appSuccessRate = apps.length ? Math.round((accepted/apps.length)*100) : 0;

    wrap.innerHTML = `
    <div class="page-header">
        <div><h2>Welcome back, ${profile.name || 'Student'}! 👋</h2><p class="page-desc">Your study journey overview.</p></div>
        <button class="btn btn-primary" onclick="location.hash='#applications'"><i data-lucide="plus"></i> New Application</button>
    </div>

    <!-- Smart Alerts -->
    ${alerts.length > 0 ? `
    <div class="card" style="margin-bottom:24px;border-left:4px solid ${alerts[0].type==='danger'?'var(--danger-color)':'var(--warning-color)'}">
        <h3 style="margin-bottom:12px;display:flex;align-items:center;gap:8px">
            <i data-lucide="bell-ring" style="width:18px;color:var(--warning-color)"></i> Smart Alerts
            <span class="badge badge-warning">${alerts.length}</span>
        </h3>
        <div style="display:flex;flex-direction:column;gap:8px;max-height:200px;overflow-y:auto">
            ${alerts.slice(0,6).map(a=>`
            <div class="flex items-center gap-3" style="padding:8px 12px;background:${a.type==='danger'?'#fee2e2':a.type==='warning'?'#fef3c7':'#dbeafe'};border-radius:var(--radius-md);font-size:13px">
                <i data-lucide="${a.icon}" style="width:16px;flex-shrink:0;color:${a.type==='danger'?'var(--danger-color)':a.type==='warning'?'var(--warning-color)':'var(--primary-color)'}"></i>
                <span style="flex:1">${a.msg}</span>
                <span class="badge badge-${a.type==='danger'?'danger':a.type==='warning'?'warning':'info'}" style="font-size:10px">${a.type}</span>
            </div>`).join('')}
        </div>
    </div>` : ''}

    <!-- Stats row -->
    <div class="grid grid-cols-4" style="margin-bottom:24px">
        <div class="card"><div class="flex justify-between items-center" style="margin-bottom:8px"><span class="text-secondary text-xs font-bold" style="text-transform:uppercase;letter-spacing:0.05em">Active Apps</span><i data-lucide="briefcase" style="width:16px;color:var(--primary-color)"></i></div><div style="font-size:1.8rem;font-weight:800">${activeApps}</div></div>
        <div class="card"><div class="flex justify-between items-center" style="margin-bottom:8px"><span class="text-secondary text-xs font-bold" style="text-transform:uppercase;letter-spacing:0.05em">Documents</span><i data-lucide="file-text" style="width:16px;color:var(--secondary-color)"></i></div><div style="font-size:1.8rem;font-weight:800">${docPct}%</div><div class="progress-container" style="height:4px;margin-top:4px"><div class="progress-bar" style="width:${docPct}%"></div></div></div>
        <div class="card"><div class="flex justify-between items-center" style="margin-bottom:8px"><span class="text-secondary text-xs font-bold" style="text-transform:uppercase;letter-spacing:0.05em">Missing Docs</span><i data-lucide="file-x" style="width:16px;color:var(--danger-color)"></i></div><div style="font-size:1.8rem;font-weight:800;color:${missingDocs?'var(--danger-color)':'var(--success-color)'}">${missingDocs}</div></div>
        <div class="card"><div class="flex justify-between items-center" style="margin-bottom:8px"><span class="text-secondary text-xs font-bold" style="text-transform:uppercase;letter-spacing:0.05em">Success Rate</span><i data-lucide="trending-up" style="width:16px;color:var(--success-color)"></i></div><div style="font-size:1.8rem;font-weight:800;color:var(--success-color)">${appSuccessRate}%</div></div>
    </div>

    <div class="grid grid-cols-2" style="gap:20px;margin-bottom:24px">
        <!-- Applications -->
        <div class="card">
            <h3 style="margin-bottom:14px;display:flex;align-items:center;gap:8px"><i data-lucide="activity" style="width:16px;color:var(--primary-color)"></i> Applications</h3>
            ${apps.length===0 ? '<p class="text-muted text-sm">No applications yet. <a href="#applications">Add one →</a></p>' :
            apps.slice(0,4).map(app=>{
                const match = DB.matchEngine.calculate(app);
                return `
                <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border-light)">
                    <div class="flex justify-between items-start" style="margin-bottom:4px">
                        <div style="flex:1;padding-right:8px"><div class="font-medium text-sm">${app.program}</div><div class="text-muted text-xs">${app.university}</div></div>
                        <div class="flex items-center gap-2"><span class="badge status-${app.status}" style="font-size:10px">${app.status.replace('-',' ')}</span><span title="Match: ${match.score}%">${match.emoji}</span></div>
                    </div>
                    <div class="progress-container" style="height:4px"><div class="progress-bar" style="width:${app.progress||0}%;background:${app.status==='accepted'?'var(--success-color)':app.status==='rejected'?'var(--danger-color)':'var(--primary-color)'}"></div></div>
                </div>`;
            }).join('')}
        </div>

        <!-- Deadlines -->
        <div class="card">
            <h3 style="margin-bottom:14px;display:flex;align-items:center;gap:8px"><i data-lucide="calendar" style="width:16px;color:var(--warning-color)"></i> Upcoming Deadlines</h3>
            ${ddls.length===0 ? '<p class="text-muted text-sm">No deadlines. <a href="#calendar">Add one →</a></p>' :
            ddls.filter(d=>new Date(d.date)>=today).slice(0,5).map(d=>{
                const dl = Math.ceil((new Date(d.date)-today)/86400000);
                return `
                <div class="flex justify-between items-center" style="padding:8px 0;border-bottom:1px solid var(--border-light)">
                    <div><div class="font-medium text-sm">${d.title}</div><div class="text-xs text-muted">${d.type}</div></div>
                    <span class="badge ${dl<=3?'badge-danger':dl<=7?'badge-warning':'badge-secondary'}">${dl<=0?'Today':dl+'d left'}</span>
                </div>`;
            }).join('')}
        </div>
    </div>

    <!-- Quick links -->
    <div class="grid grid-cols-4" style="gap:12px">
        ${[
            {h:'#analytics',icon:'bar-chart-3',label:'Analytics',color:'#7c3aed'},
            {h:'#portals',icon:'key',label:'My Portals',color:'var(--secondary-color)'},
            {h:'#afterarrival',icon:'plane',label:'After Arrival',color:'#dc2626'},
            {h:'#budget',icon:'pie-chart',label:'Budget',color:'var(--accent-color)'},
        ].map(l=>`
        <div class="card card-interactive cursor-pointer" onclick="location.hash='${l.h}'" style="text-align:center;padding:16px">
            <i data-lucide="${l.icon}" style="width:22px;height:22px;color:${l.color};margin:0 auto 6px;display:block"></i>
            <span class="text-sm font-medium">${l.label}</span>
        </div>`).join('')}
    </div>
    `;
    return wrap;
};
