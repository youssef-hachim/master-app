window.views = window.views || {};

/* -------- ERASMUS MUNDUS (informational + save programs) -------- */
window.views.erasmus = () => {
    const wrap = document.createElement('div');
    const erasmusPrograms = [
        { id:'cyberus', name:'CYBERUS', field:'Cybersecurity', funding:'€1,400/mo + travel', deadline:'2026-01-15', partners:'UBS (France), ULB (Belgium), TalTech (Estonia)', link:'https://www.cyberus-master.eu', desc:'Joint Master in Security of Information Systems. Full mobility across 3 countries.' },
        { id:'secclo',  name:'SECCLO',  field:'Security & Cloud', funding:'€1,400/mo + travel', deadline:'2026-01-05', partners:'Aalto (Finland) + KTH / NTNU / UTartu', link:'https://secclo.eu', desc:'Master\'s in Security and Cloud Computing. Highly competitive and prestigious.' },
        { id:'emjmd-cs', name:'EMJMD in CS + Security', field:'Computer Science', funding:'€1,000–1,400/mo', deadline:'2026-02-01', partners:'Multiple EU universities', link:'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en', desc:'Various Erasmus Mundus programs in computer science with security focus.' },
        { id:'smartsec', name:'MSCA SmartSec', field:'IoT Security', funding:'€1,200/mo', deadline:'2026-03-15', partners:'TU Delft, Trento, KTH', link:'https://www.eacea.ec.europa.eu', desc:'Security for IoT and smart systems, includes Italian partner universities.' },
    ];

    wrap.innerHTML = `
        <div class="page-header">
            <div><h2>Erasmus Mundus Programs</h2><p class="page-desc">Prestigious, fully-funded European joint master's degrees. One of the best funding opportunities available.</p></div>
        </div>
        <div class="card" style="background:linear-gradient(135deg,#0d47a1,#00838f);color:white;margin-bottom:24px">
            <div class="flex gap-4" style="align-items:center;flex-wrap:wrap">
                <i data-lucide="globe" style="width:48px;height:48px;opacity:0.8;flex-shrink:0"></i>
                <div>
                    <h3 style="color:white;margin-bottom:8px">What is Erasmus Mundus?</h3>
                    <ul style="opacity:0.9;font-size:13px;display:flex;flex-direction:column;gap:4px">
                        <li>✅ Fully funded scholarship — covers tuition + living allowance (~€1,400/mo)</li>
                        <li>✅ Study in at least 2 different EU countries</li>
                        <li>✅ Joint or multiple degree awarded upon graduation</li>
                        <li>✅ Open to non-EU students (Moroccan students eligible!)</li>
                        <li>✅ Highly valued by international employers</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2">
            ${erasmusPrograms.map(p=>{
                const saved = DB.bookmarks.all().some(b=>b.ref===p.id);
                const daysLeft = Math.ceil((new Date(p.deadline)-new Date())/86400000);
                return `
                <div class="card">
                    <div class="flex justify-between items-start" style="margin-bottom:10px">
                        <span class="badge badge-warning">${p.field}</span>
                        <button class="icon-btn bookmark-em" data-ref="${p.id}" data-name="${p.name}" title="${saved?'Remove':'Save'}">
                            <i data-lucide="${saved?'bookmark-check':'bookmark'}" style="color:${saved?'var(--primary-color)':'var(--text-muted)'}"></i>
                        </button>
                    </div>
                    <h3 style="margin-bottom:6px">${p.name}</h3>
                    <p class="text-secondary text-sm" style="margin-bottom:12px">${p.desc}</p>
                    <div style="background:var(--bg-hover);border-radius:var(--radius-md);padding:10px;margin-bottom:12px;font-size:12px">
                        <div style="margin-bottom:4px"><strong>Partners:</strong> ${p.partners}</div>
                        <div style="color:var(--success-color);font-weight:600">💰 ${p.funding}</div>
                    </div>
                    <div class="flex justify-between items-center text-sm" style="padding-top:10px;border-top:1px solid var(--border-color)">
                        <span class="badge ${daysLeft<=0?'badge-danger':daysLeft<=30?'badge-warning':'badge-secondary'}">
                            Deadline: ${p.deadline} (${daysLeft<=0?'Passed':daysLeft+'d left'})
                        </span>
                        <a href="${p.link}" target="_blank" class="btn btn-outline text-sm">Visit</a>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;
    lucide.createIcons({ nodes: [wrap] });

    wrap.querySelectorAll('.bookmark-em').forEach(btn => {
        btn.onclick = () => {
            const existing = DB.bookmarks.all().find(b => b.ref === btn.dataset.ref);
            if (existing) { DB.bookmarks.remove(existing.id); UI.toast('Removed from saved','info'); }
            else          { DB.bookmarks.add({ ref: btn.dataset.ref, name: btn.dataset.name, type:'erasmus' }); UI.toast('Saved!','success'); }
            UI.refresh();
        };
    });
    return wrap;
};

/* -------- PROFILE -------- */
window.views.profile = () => {
    const wrap = document.createElement('div');
    const render = () => {
        const p = DB.profile.get();
        wrap.innerHTML = `
            <div class="page-header">
                <div><h2>My Profile</h2><p class="page-desc">Your academic background and preferences used for recommendations.</p></div>
                <button class="btn btn-primary" id="save-profile-btn"><i data-lucide="save"></i> Save Profile</button>
            </div>
            <div class="grid grid-cols-2" style="gap:20px;align-items:start">
                <div class="card">
                    <h3 style="margin-bottom:20px">Personal Information</h3>
                    <div class="form-group"><label class="form-label">Full Name</label>
                        <input id="prf-name" class="form-control" value="${p.name||''}" placeholder="Your name">
                    </div>
                    <div class="form-group"><label class="form-label">Email</label>
                        <input id="prf-email" class="form-control" type="email" value="${p.email||''}" placeholder="you@email.com">
                    </div>
                    <div class="form-group"><label class="form-label">Nationality</label>
                        <input id="prf-nat" class="form-control" value="${p.nationality||'Moroccan'}" placeholder="Moroccan">
                    </div>
                    <div class="form-group"><label class="form-label">Current City / Country</label>
                        <input id="prf-city" class="form-control" value="${p.city||''}" placeholder="Casablanca, Morocco">
                    </div>
                </div>
                <div class="card">
                    <h3 style="margin-bottom:20px">Academic Background</h3>
                    <div class="form-group"><label class="form-label">Bachelor's Degree</label>
                        <input id="prf-degree" class="form-control" value="${p.degree||''}" placeholder="BSc Computer Science">
                    </div>
                    <div class="form-group"><label class="form-label">University (Bachelor's)</label>
                        <input id="prf-uni" class="form-control" value="${p.university||''}" placeholder="ENSA Marrakech">
                    </div>
                    <div class="form-group"><label class="form-label">GPA / Grade</label>
                        <input id="prf-gpa" class="form-control" value="${p.gpa||''}" placeholder="3.5 / 4.0 or 15/20">
                    </div>
                    <div class="form-group"><label class="form-label">Graduation Year</label>
                        <input id="prf-gradyr" class="form-control" type="number" value="${p.gradYear||''}" placeholder="2025">
                    </div>
                </div>
                <div class="card">
                    <h3 style="margin-bottom:20px">Preferences & Goals</h3>
                    <div class="form-group"><label class="form-label">Target Field</label>
                        <select id="prf-field" class="form-control">
                            <option value="">Select...</option>
                            ${['Cybersecurity','IT','Cloud Computing','Networking','AI / Machine Learning','Data Science','Computer Science','Software Engineering'].map(f=>`<option ${p.field===f?'selected':''}>${f}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label class="form-label">Target Cities (comma-separated)</label>
                        <input id="prf-cities" class="form-control" value="${p.targetCities||''}" placeholder="Milan, Padova, Turin">
                    </div>
                    <div class="form-group"><label class="form-label">Monthly Budget (€)</label>
                        <input id="prf-budget" class="form-control" type="number" value="${p.budgetAmount||''}" placeholder="800">
                    </div>
                    <div class="form-group"><label class="form-label">Language Level</label>
                        <select id="prf-lang" class="form-control">
                            <option value="">Select...</option>
                            ${['A1','A2','B1','B2','C1','C2'].map(l=>`<option ${p.englishLevel===l?'selected':''}>${l}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="card">
                    <h3 style="margin-bottom:20px">Skills & Languages</h3>
                    <div class="form-group"><label class="form-label">Technical Skills</label>
                        <textarea id="prf-skills" class="form-control" placeholder="Python, Linux, Networking, CCNA...">${p.skills||''}</textarea>
                    </div>
                    <div class="form-group"><label class="form-label">Languages Spoken</label>
                        <input id="prf-langs" class="form-control" value="${p.languages||''}" placeholder="Arabic, French, English">
                    </div>
                    <div class="form-group"><label class="form-label">Italian Level</label>
                        <select id="prf-italian" class="form-control">
                            <option value="">None / Beginner</option>
                            ${['A1','A2','B1','B2','C1','C2'].map(l=>`<option ${p.italianLevel===l?'selected':''}>${l}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label class="form-label">Extra Notes / Goals</label>
                        <textarea id="prf-goals" class="form-control" placeholder="e.g. Want to work in cybersecurity in Italy after graduation...">${p.goals||''}</textarea>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons({ nodes: [wrap] });
        wrap.querySelector('#save-profile-btn').onclick = () => {
            DB.profile.save({
                name:         wrap.querySelector('#prf-name').value.trim(),
                email:        wrap.querySelector('#prf-email').value.trim(),
                nationality:  wrap.querySelector('#prf-nat').value.trim(),
                city:         wrap.querySelector('#prf-city').value.trim(),
                degree:       wrap.querySelector('#prf-degree').value.trim(),
                university:   wrap.querySelector('#prf-uni').value.trim(),
                gpa:          wrap.querySelector('#prf-gpa').value.trim(),
                gradYear:     wrap.querySelector('#prf-gradyr').value,
                field:        wrap.querySelector('#prf-field').value,
                targetCities: wrap.querySelector('#prf-cities').value.trim(),
                budgetAmount: wrap.querySelector('#prf-budget').value,
                englishLevel: wrap.querySelector('#prf-lang').value,
                italianLevel: wrap.querySelector('#prf-italian').value,
                skills:       wrap.querySelector('#prf-skills').value.trim(),
                languages:    wrap.querySelector('#prf-langs').value.trim(),
                goals:        wrap.querySelector('#prf-goals').value.trim(),
            });
            UI.toast('Profile saved!','success');
            // Update avatar in topbar
            const nameVal = wrap.querySelector('#prf-name').value.trim();
            if (nameVal) {
                const avatarEl = document.querySelector('.user-avatar img');
                if (avatarEl) avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameVal)}&background=0D8ABC&color=fff`;
            }
        };
    };
    render();
    return wrap;
};
