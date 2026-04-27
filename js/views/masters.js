window.views = window.views || {};

/* ================================================================
   REAL CATALOG — pre-populated programs from Italian universities
   ================================================================ */
const CATALOG = [
    {
        name: "MSc in Cyber Risk Strategy and Governance",
        university: "Politecnico di Milano",
        city: "Milan",
        field: "Cybersecurity",
        language: "English",
        tuition: "3,898",
        type: "Public",
        deadline: "Multiple calls (Feb, Apr, Jul)",
        requirements: "Bachelor in CS, Engineering, or related (180 ECTS). IELTS 6.0 / TOEFL 78. Strong analytical background.",
        link: "https://www.polimi.it/en/programmes/laurea-magistrale-equivalent-to-master-of-science-programmes/programme-detail/cyber-risk-strategy-and-governance",
        scholarship: "yes",
        scholarshipNote: "Merit-based tuition waivers + DSU regional scholarship up to €7,000/yr. Invest Your Talent scholarship available.",
        logo: "PM",
        highlight: true
    },
    {
        name: "MSc in Computer Science and Engineering",
        university: "Politecnico di Milano",
        city: "Milan",
        field: "IT",
        language: "English",
        tuition: "3,898",
        type: "Public",
        deadline: "1st call: Feb 28 – 2nd call: Apr 22",
        requirements: "Bachelor in CS/IT/Engineering (180 ECTS). IELTS 6.0+ or TOEFL 78+. Strong math and CS foundation.",
        link: "https://www.polimi.it/en/programmes/laurea-magistrale-equivalent-to-master-of-science-programmes/programme-detail/computer-science-and-engineering",
        scholarship: "yes",
        scholarshipNote: "PoliMi Merit Awards (€10,000/yr), DSU scholarships, Invest Your Talent (Italian MFA).",
        logo: "PM"
    },
    {
        name: "MSc in High Performance Computing Engineering – Cloud & Networking Track",
        university: "Politecnico di Milano",
        city: "Milan",
        field: "Cloud Computing",
        language: "English",
        tuition: "3,898",
        type: "Public",
        deadline: "Feb – Jul (multiple calls)",
        requirements: "Bachelor in CS, Electronics, Telecom Eng. or equivalent. IELTS 6.0+. Strong background in programming and systems.",
        link: "https://www.polimi.it/en/programmes/laurea-magistrale-equivalent-to-master-of-science-programmes/programme-detail/high-performance-computing-engineering",
        scholarship: "yes",
        scholarshipNote: "Merit-based waivers. DSU regional scholarship.",
        logo: "PM"
    },
    {
        name: "MSc in Cybersecurity",
        university: "Università degli Studi di Padova",
        city: "Padova",
        field: "Cybersecurity",
        language: "English",
        tuition: "2,600",
        type: "Public",
        deadline: "1st window: Feb – 2nd: May – 3rd: Jul",
        requirements: "Bachelor in CS, IT Engineering, Mathematics, or Statistics (180 ECTS). B2 English. Min 30 ECTS in CS + 12 in Math.",
        link: "https://www.unipd.it/en/educational-offer/second-cycle-degree/science?tipo=LM&scuola=SC&ordinamento=2022&key=SC2542",
        scholarship: "yes",
        scholarshipNote: "ESU Padova scholarship (up to €6,500/yr + housing + meals). MAECI Italian Government scholarships.",
        logo: "PD",
        highlight: true
    },
    {
        name: "MSc in Computer Science – Internet, Mobile & Security",
        university: "Università degli Studi di Padova",
        city: "Padova",
        field: "Networking",
        language: "English",
        tuition: "2,600",
        type: "Public",
        deadline: "Multiple windows (Feb – Jul)",
        requirements: "Bachelor in CS or related. B2 English. 48 ECTS in CS topics.",
        link: "https://www.unipd.it/en/educational-offer/second-cycle-degree/science?tipo=LM&scuola=SC&ordinamento=2022&key=SC2598",
        scholarship: "yes",
        scholarshipNote: "ESU Padova scholarship based on ISEE/ISEEU.",
        logo: "PD"
    },
    {
        name: "MSc in Cybersecurity",
        university: "Sapienza Università di Roma",
        city: "Rome",
        field: "Cybersecurity",
        language: "English",
        tuition: "2,924",
        type: "Public",
        deadline: "Non-EU (visa): Apr 29 – EU/Residents: Jul 29",
        requirements: "Bachelor in CS, CE, Math, Physics, Telecom (180 ECTS). B2 English (certified or interview). Min 60 ECTS in STEM.",
        link: "https://corsidilaurea.uniroma1.it/en/corso/2024/29389/home",
        scholarship: "yes",
        scholarshipNote: "LazioDISCo scholarship (meals + housing + cash). DiSCo bursary up to €5,200/yr.",
        logo: "SA",
        highlight: true
    },
    {
        name: "MSc in Computer Science",
        university: "Sapienza Università di Roma",
        city: "Rome",
        field: "IT",
        language: "English",
        tuition: "2,924",
        type: "Public",
        deadline: "Non-EU: Apr 29 – Others: Jul 29",
        requirements: "Bachelor in CS or related. B2 English. 90 ECTS in informatics + 21 in math.",
        link: "https://corsidilaurea.uniroma1.it/en/corso/2024/29932/home",
        scholarship: "yes",
        scholarshipNote: "Sapienza merit awards. LazioDISCo full bursary available.",
        logo: "SA"
    },
    {
        name: "MSc in Computer Engineering – Computing & Network Infrastructures",
        university: "Politecnico di Torino",
        city: "Torino",
        field: "Networking",
        language: "English",
        tuition: "2,800",
        type: "Public",
        deadline: "Multiple windows (Nov – Jul)",
        requirements: "Bachelor in CE, CS, EE, or Telecom. B2 English (IELTS 5.5+). Competitive admission with ranking.",
        link: "https://didattica.polito.it/pls/portal30/gap.pkg_guide.viewGap?p_cod_fac=004&p_a_acc=2025",
        scholarship: "yes",
        scholarshipNote: "EDISU Piemonte scholarship (housing + meals + €5,200/yr). PoliTO merit-based tuition waiver.",
        logo: "PT"
    },
    {
        name: "MSc in ICT for Smart Societies",
        university: "Politecnico di Torino",
        city: "Torino",
        field: "IT",
        language: "English",
        tuition: "2,800",
        type: "Public",
        deadline: "Applications open Nov – close Jul",
        requirements: "Bachelor in ICT, CE, EE, or related. B2 English. Competitive ranking.",
        link: "https://didattica.polito.it/pls/portal30/gap.pkg_guide.viewGap?p_cod_fac=004&p_a_acc=2025",
        scholarship: "yes",
        scholarshipNote: "EDISU Piemonte full financial aid package.",
        logo: "PT"
    },
    {
        name: "MSc in Computer Engineering",
        university: "Università di Bologna",
        city: "Bologna",
        field: "IT",
        language: "English",
        tuition: "900–4,500",
        type: "Public",
        deadline: "Non-EU: Apr – EU: Jun (varies by intake)",
        requirements: "Bachelor in CS, CE, or related. IELTS 6.0+ / TOEFL 80+. Programming knowledge required.",
        link: "https://corsi.unibo.it/2cycle/ComputerEngineering",
        scholarship: "yes",
        scholarshipNote: "ER.GO regional scholarship (meals + housing + up to €6,300/yr). UniBo merit waiver.",
        logo: "BO"
    },
    {
        name: "MSc in Computer Science and Engineering – Information Security",
        university: "Università di Trento",
        city: "Trento",
        field: "Cybersecurity",
        language: "English",
        tuition: "1,700–2,800",
        type: "Public",
        deadline: "Non-EU: Mar 6 – EU: Jul",
        requirements: "Bachelor in CS or related. IELTS 5.5+ / TOEFL 65+. Admission based on ranking score.",
        link: "https://offertaformativa.unitn.it/en/lm/computer-science",
        scholarship: "yes",
        scholarshipNote: "Opera Universitaria di Trento (full package: housing + meals + cash). Very generous for non-EU students.",
        logo: "TN",
        highlight: true
    },
    {
        name: "MSc in Artificial Intelligence and Cybersecurity",
        university: "Università di Pisa",
        city: "Pisa",
        field: "Cybersecurity",
        language: "English",
        tuition: "2,400",
        type: "Public",
        deadline: "Non-EU: Mar – EU: Jul",
        requirements: "Bachelor in CS, IT, Math. B2 English. Min 60 ECTS in CS/Math.",
        link: "https://www.unipi.it/index.php/lauree-magistrali/item/15437",
        scholarship: "yes",
        scholarshipNote: "DSU Toscana scholarship. Scuola Superiore Sant'Anna cooperation programs.",
        logo: "PI"
    }
];

/* ---- Form for user-added programs ---- */
function programForm(p = {}) {
    const fields = ['Cybersecurity','IT','Cloud Computing','Networking','AI / Machine Learning','Data Science','Computer Science','Software Engineering'];
    return `
        <div class="form-group">
            <label class="form-label">Program Name *</label>
            <input id="pf-name" class="form-control" placeholder="MSc in Cybersecurity" value="${p.name||''}">
        </div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group">
                <label class="form-label">University *</label>
                <input id="pf-uni" class="form-control" placeholder="Politecnico di Milano" value="${p.university||''}">
            </div>
            <div class="form-group">
                <label class="form-label">City</label>
                <input id="pf-city" class="form-control" placeholder="Milan" value="${p.city||''}">
            </div>
        </div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group">
                <label class="form-label">Field</label>
                <select id="pf-field" class="form-control">
                    <option value="">Select field...</option>
                    ${fields.map(f => `<option ${p.field===f?'selected':''}>${f}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Language</label>
                <select id="pf-lang" class="form-control">
                    <option ${p.language==='English'?'selected':''}>English</option>
                    <option ${p.language==='Italian'?'selected':''}>Italian</option>
                    <option ${p.language==='Both'?'selected':''}>Both</option>
                </select>
            </div>
        </div>
        <div class="grid grid-cols-2" style="gap:12px">
            <div class="form-group">
                <label class="form-label">Tuition (€/year)</label>
                <input id="pf-tuition" class="form-control" type="number" min="0" placeholder="2500" value="${p.tuition||''}">
            </div>
            <div class="form-group">
                <label class="form-label">Type</label>
                <select id="pf-type" class="form-control">
                    <option ${p.type==='Public'?'selected':''}>Public</option>
                    <option ${p.type==='Private'?'selected':''}>Private</option>
                    <option ${p.type==='Erasmus Mundus'?'selected':''}>Erasmus Mundus</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Application Deadline</label>
            <input id="pf-deadline" class="form-control" type="date" value="${p.deadline||''}">
        </div>
        <div class="form-group">
            <label class="form-label">Requirements / Notes</label>
            <textarea id="pf-notes" class="form-control">${p.notes||''}</textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Official Link</label>
            <input id="pf-link" class="form-control" placeholder="https://..." value="${p.link||''}">
        </div>
    `;
}

function openProgramModal(existing) {
    const isEdit = !!existing;
    UI.modal(
        isEdit ? 'Edit Program' : 'Add Program',
        programForm(existing || {}),
        (overlay) => {
            const name = overlay.querySelector('#pf-name').value.trim();
            const uni  = overlay.querySelector('#pf-uni').value.trim();
            if (!name || !uni) { UI.toast('Program name and university are required.','error'); return false; }
            const payload = {
                name, university: uni,
                city:       overlay.querySelector('#pf-city').value.trim(),
                field:      overlay.querySelector('#pf-field').value,
                language:   overlay.querySelector('#pf-lang').value,
                tuition:    overlay.querySelector('#pf-tuition').value,
                type:       overlay.querySelector('#pf-type').value,
                deadline:   overlay.querySelector('#pf-deadline').value,
                notes:      overlay.querySelector('#pf-notes').value.trim(),
                link:       overlay.querySelector('#pf-link').value.trim(),
                saved:      existing ? existing.saved : false
            };
            if (isEdit) { DB.programs.update(existing.id, payload); UI.toast('Program updated','success'); }
            else        { DB.programs.add(payload);                  UI.toast('Program saved','success'); }
            UI.refresh();
        }
    );
}

/* ================================================================
   VIEW
   ================================================================ */
window.views.masters = () => {
    const wrap = document.createElement('div');
    let catalogFilter = '';
    let catalogCity   = '';
    let catalogSearch = '';

    const render = (filterField, filterCity, filterType, query) => {
        let myList = DB.programs.all();
        if (query)       myList = myList.filter(p => (p.name+p.university+p.city).toLowerCase().includes(query.toLowerCase()));
        if (filterField) myList = myList.filter(p => p.field === filterField);
        if (filterCity)  myList = myList.filter(p => p.city === filterCity);
        if (filterType)  myList = myList.filter(p => p.type === filterType);

        /* Filter catalog */
        let catList = CATALOG;
        if (catalogFilter) catList = catList.filter(p => p.field === catalogFilter);
        if (catalogCity)   catList = catList.filter(p => p.city  === catalogCity);
        if (catalogSearch) catList = catList.filter(p => (p.name+p.university+p.city).toLowerCase().includes(catalogSearch.toLowerCase()));

        const allCities  = [...new Set(DB.programs.all().map(p => p.city).filter(Boolean))];
        const allFields  = [...new Set(DB.programs.all().map(p => p.field).filter(Boolean))];
        const catCities  = [...new Set(CATALOG.map(p => p.city))];
        const catFields  = [...new Set(CATALOG.map(p => p.field))];

        const logoColors = { PM:'#29235C', PD:'#9E1B32', SA:'#822433', PT:'#003366', BO:'#A6192E', TN:'#003153', PI:'#003399' };

        wrap.innerHTML = `
            <div class="page-header">
                <div>
                    <h2>Master's Programs Directory</h2>
                    <p class="page-desc">Browse real Italian programs and add your own.</p>
                </div>
                <button class="btn btn-primary" id="add-prog-btn">
                    <i data-lucide="plus"></i> Add Custom Program
                </button>
            </div>

            <!-- ==================== CATALOG ==================== -->
            <div style="margin-bottom:32px">
                <div class="flex justify-between items-center" style="margin-bottom:16px;flex-wrap:wrap;gap:8px">
                    <h3 style="display:flex;align-items:center;gap:8px">
                        <i data-lucide="library" style="width:20px;color:var(--primary-color)"></i>
                        Program Catalog
                        <span class="badge badge-info">${catList.length} programs</span>
                    </h3>
                </div>

                <div class="card flex gap-3" style="margin-bottom:16px;flex-wrap:wrap;padding:14px 16px">
                    <input id="cat-search" class="form-control" placeholder="Search catalog..." style="flex:1;min-width:160px" value="${catalogSearch}">
                    <select id="cat-field" class="form-control" style="width:170px">
                        <option value="">All Fields</option>
                        ${catFields.map(f => `<option ${f===catalogFilter?'selected':''}>${f}</option>`).join('')}
                    </select>
                    <select id="cat-city" class="form-control" style="width:150px">
                        <option value="">All Cities</option>
                        ${catCities.map(c => `<option ${c===catalogCity?'selected':''}>${c}</option>`).join('')}
                    </select>
                </div>

                <div class="grid grid-cols-2" id="catalog-grid">
                    ${catList.map(prog => `
                    <div class="catalog-card ${prog.highlight?'card-interactive':''}">
                        <div>
                            <div class="flex justify-between items-start" style="margin-bottom:12px">
                                <div class="flex items-center gap-3">
                                    <div class="uni-logo" style="background:${logoColors[prog.logo]||'var(--bg-main)'}15;color:${logoColors[prog.logo]||'var(--primary-color)'}">${prog.logo}</div>
                                    <div>
                                        <div class="text-xs text-muted" style="margin-bottom:1px">${prog.university}</div>
                                        <div class="text-xs text-secondary flex items-center gap-1"><i data-lucide="map-pin" style="width:11px"></i> ${prog.city}</div>
                                    </div>
                                </div>
                                ${prog.highlight ? '<span class="badge badge-warning" style="font-size:10px">⭐ Recommended</span>' : ''}
                            </div>
                            <h4 style="margin-bottom:10px;font-size:0.95rem;line-height:1.4">${prog.name}</h4>
                            <div class="tags-wrap" style="margin-bottom:10px">
                                <span class="badge badge-primary">${prog.field}</span>
                                <span class="badge badge-secondary">${prog.language}</span>
                                <span class="badge badge-secondary">${prog.type}</span>
                                ${prog.scholarship==='yes' ? '<span class="badge badge-success">💰 Scholarship</span>' : ''}
                            </div>
                        </div>

                        <div>
                            <div class="catalog-divider"></div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;margin-bottom:12px">
                                <div>
                                    <div class="text-muted" style="margin-bottom:2px">Tuition (non-EU)</div>
                                    <div class="font-bold" style="color:var(--primary-color)">€${prog.tuition}/yr</div>
                                </div>
                                <div>
                                    <div class="text-muted" style="margin-bottom:2px">Deadlines</div>
                                    <div class="font-medium">${prog.deadline}</div>
                                </div>
                            </div>
                            <details style="margin-bottom:12px">
                                <summary style="cursor:pointer;font-size:12px;font-weight:600;color:var(--primary-color)">Requirements & Scholarship Info</summary>
                                <div style="padding:10px 0;font-size:12px;color:var(--text-secondary);line-height:1.6">
                                    <p style="margin-bottom:6px"><strong>Requirements:</strong> ${prog.requirements}</p>
                                    ${prog.scholarshipNote ? `<p><strong>Scholarships:</strong> ${prog.scholarshipNote}</p>` : ''}
                                </div>
                            </details>
                            <div class="flex gap-2">
                                <a href="${prog.link}" target="_blank" class="btn btn-primary flex-1" style="font-size:12px">
                                    <i data-lucide="external-link"></i> University Page
                                </a>
                                <button class="btn btn-outline save-catalog" data-name="${prog.name}" data-uni="${prog.university}" data-city="${prog.city}" data-field="${prog.field}" data-lang="${prog.language}" data-tuition="${prog.tuition}" data-type="${prog.type}" data-link="${prog.link}" data-req="${prog.requirements}" title="Save to My Programs">
                                    <i data-lucide="plus-circle"></i> Save
                                </button>
                            </div>
                        </div>
                    </div>`).join('')}
                </div>
                ${catList.length === 0 ? '<div class="text-secondary text-sm" style="text-align:center;padding:24px">No catalog programs match your filter.</div>' : ''}
            </div>

            <!-- ==================== MY PROGRAMS ==================== -->
            <div>
                <h3 style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
                    <i data-lucide="folder-open" style="width:20px;color:var(--secondary-color)"></i>
                    My Saved Programs
                    <span class="badge badge-secondary">${myList.length}</span>
                </h3>
                ${myList.length === 0 ? `
                    <div class="card" style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                        <i data-lucide="bookmark" style="width:36px;height:36px;margin:0 auto 12px;display:block;opacity:0.4"></i>
                        <p>No saved programs yet. Use <strong>"Save"</strong> on catalog programs or <strong>"Add Custom Program"</strong> to start building your list.</p>
                    </div>
                ` : `
                    <div class="grid grid-cols-2">
                        ${myList.map(prog => `
                        <div class="card card-interactive">
                            <div class="flex justify-between items-start" style="margin-bottom:8px">
                                <span class="badge badge-${prog.type==='Public'?'primary':prog.type==='Erasmus Mundus'?'warning':'secondary'}">${prog.type||'Public'}</span>
                                <div class="flex gap-1">
                                    <button class="icon-btn edit-prog" data-id="${prog.id}" title="Edit"><i data-lucide="edit-2" style="width:14px"></i></button>
                                    <button class="icon-btn del-prog" data-id="${prog.id}" style="color:var(--danger-color)" title="Delete"><i data-lucide="trash-2" style="width:14px"></i></button>
                                </div>
                            </div>
                            <h4 style="margin-bottom:4px">${prog.name}</h4>
                            <p class="text-secondary text-sm" style="margin-bottom:2px">${prog.university}</p>
                            ${prog.city ? `<p class="text-xs text-muted" style="margin-bottom:10px"><i data-lucide="map-pin" style="width:11px;display:inline"></i> ${prog.city}</p>` : ''}
                            <div class="tags-wrap" style="margin-bottom:10px">
                                ${prog.field   ? `<span class="badge badge-primary">${prog.field}</span>` : ''}
                                ${prog.language? `<span class="badge badge-secondary">${prog.language}</span>` : ''}
                            </div>
                            <div class="flex justify-between items-center text-sm" style="padding-top:10px;border-top:1px solid var(--border-color)">
                                <span class="text-muted">Tuition: <strong>${prog.tuition ? '€'+prog.tuition+'/yr' : '—'}</strong></span>
                                ${prog.link ? `<a href="${prog.link}" target="_blank" class="btn btn-outline" style="font-size:11px;padding:4px 10px">Visit</a>` : ''}
                            </div>
                        </div>`).join('')}
                    </div>
                `}
            </div>
        `;

        lucide.createIcons({ nodes: [wrap] });

        // Events
        wrap.querySelector('#add-prog-btn').onclick = () => openProgramModal();

        // Catalog filters
        const reFilterCat = () => {
            catalogFilter = wrap.querySelector('#cat-field').value;
            catalogCity   = wrap.querySelector('#cat-city').value;
            catalogSearch = wrap.querySelector('#cat-search').value;
            render(filterField, filterCity, filterType, query);
        };
        wrap.querySelector('#cat-search').oninput = reFilterCat;
        wrap.querySelector('#cat-field').onchange = reFilterCat;
        wrap.querySelector('#cat-city').onchange  = reFilterCat;

        // Save catalog program to DB
        wrap.querySelectorAll('.save-catalog').forEach(btn => {
            btn.onclick = () => {
                const exists = DB.programs.all().some(p => p.name === btn.dataset.name && p.university === btn.dataset.uni);
                if (exists) { UI.toast('Already saved!','info'); return; }
                DB.programs.add({
                    name:       btn.dataset.name,
                    university: btn.dataset.uni,
                    city:       btn.dataset.city,
                    field:      btn.dataset.field,
                    language:   btn.dataset.lang,
                    tuition:    btn.dataset.tuition,
                    type:       btn.dataset.type,
                    link:       btn.dataset.link,
                    notes:      btn.dataset.req,
                    saved:      true
                });
                UI.toast('Program saved to your list!','success');
                render(filterField, filterCity, filterType, query);
            };
        });

        // My programs CRUD
        wrap.querySelectorAll('.edit-prog').forEach(btn => {
            btn.onclick = () => openProgramModal(DB.programs.find(+btn.dataset.id));
        });
        wrap.querySelectorAll('.del-prog').forEach(btn => {
            btn.onclick = () => UI.confirm('Remove this program?', () => {
                DB.programs.remove(+btn.dataset.id);
                UI.toast('Removed','info');
                render(filterField, filterCity, filterType, query);
            });
        });
    };

    render('','','','');
    return wrap;
};
