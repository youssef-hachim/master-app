window.views = window.views || {};

/* -------- BUDGET PLANNER -------- */
window.views.budget = () => {
    const wrap = document.createElement('div');
    
    function itemForm(item = {}) {
        return `
            <div class="form-group">
                <label class="form-label">Type</label>
                <select id="bi-type" class="form-control">
                    <option value="expense" ${item.type==='expense'?'selected':''}>Expense (Cost)</option>
                    <option value="income" ${item.type==='income'?'selected':''}>Income (Scholarship / Refund)</option>
                </select>
            </div>
            <div class="form-group"><label class="form-label">Description *</label><input id="bi-name" class="form-control" value="${item.name||''}" placeholder="e.g. 1st Tuition Installment"></div>
            <div class="form-group"><label class="form-label">Amount (€) *</label><input id="bi-amount" type="number" class="form-control" value="${item.amount||''}" placeholder="500"></div>
            <div class="form-group">
                <label class="form-label">Category</label>
                <select id="bi-cat" class="form-control">
                    ${['Tuition & Fees', 'Housing', 'Food', 'Transport', 'Documents & Visa', 'Scholarship', 'Personal/Other'].map(c=>`<option ${item.category===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="checkbox-row" style="cursor:pointer;padding:0;border:none">
                    <input type="checkbox" id="bi-paid" ${item.paid?'checked':''}>
                    <span>${item.type==='income'?'Already received':'Already paid'}</span>
                </label>
            </div>
        `;
    }

    const render = () => {
        const b = DB.budget.get();
        const items = b.items || [];
        
        const expenses = items.filter(i => i.type === 'expense');
        const incomes  = items.filter(i => i.type === 'income');
        
        const totalExpenses = expenses.reduce((s, i) => s + i.amount, 0);
        const totalIncomes  = incomes.reduce((s, i) => s + i.amount, 0);
        
        const paidExpenses = expenses.filter(i => i.paid).reduce((s, i) => s + i.amount, 0);
        const receivedIncomes = incomes.filter(i => i.paid).reduce((s, i) => s + i.amount, 0);

        const baseBudget = parseFloat(b.totalBudget) || 0;
        const totalAvailable = baseBudget + totalIncomes;
        const remaining = totalAvailable - totalExpenses;
        const consumedPct = totalAvailable > 0 ? Math.min(100, Math.round((totalExpenses / totalAvailable) * 100)) : 0;

        wrap.innerHTML = `
            <div class="page-header">
                <div><h2>Budget Planner</h2><p class="page-desc">Track your total budget, scholarships, expenses, and remaining funds.</p></div>
                <button class="btn btn-primary" id="add-item-btn"><i data-lucide="plus"></i> Add Item</button>
            </div>
            
            <div class="grid grid-cols-3" style="gap:20px;margin-bottom:24px">
                <div class="card" style="background:linear-gradient(135deg,#0d47a1,#00838f);color:white;position:relative">
                    <div class="flex justify-between items-center" style="margin-bottom:8px">
                        <span class="text-xs font-bold" style="text-transform:uppercase;letter-spacing:0.05em;opacity:0.8">Available Funds</span>
                        <button class="icon-btn" id="edit-budget-btn" style="color:white;opacity:0.8"><i data-lucide="edit-2" style="width:14px"></i></button>
                    </div>
                    <div style="font-size:2rem;font-weight:800;margin-bottom:4px">€${totalAvailable.toLocaleString()}</div>
                    <div style="font-size:12px;opacity:0.8">Base Budget: €${baseBudget.toLocaleString()} + Income: €${totalIncomes.toLocaleString()}</div>
                </div>
                
                <div class="card">
                    <div class="flex justify-between items-center" style="margin-bottom:8px">
                        <span class="text-xs font-bold text-secondary" style="text-transform:uppercase;letter-spacing:0.05em">Total Consumed</span>
                        <i data-lucide="shopping-cart" style="width:16px;color:var(--danger-color)"></i>
                    </div>
                    <div style="font-size:2rem;font-weight:800;margin-bottom:8px;color:var(--danger-color)">€${totalExpenses.toLocaleString()}</div>
                    <div class="progress-container" style="height:6px;margin:0"><div class="progress-bar" style="width:${consumedPct}%;background:var(--danger-color)"></div></div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${consumedPct}% of available funds</div>
                </div>
                
                <div class="card">
                    <div class="flex justify-between items-center" style="margin-bottom:8px">
                        <span class="text-xs font-bold text-secondary" style="text-transform:uppercase;letter-spacing:0.05em">Remaining Budget</span>
                        <i data-lucide="wallet" style="width:16px;color:var(--success-color)"></i>
                    </div>
                    <div style="font-size:2rem;font-weight:800;color:${remaining < 0 ? 'var(--danger-color)' : 'var(--success-color)'}">€${remaining.toLocaleString()}</div>
                    <div style="font-size:12px;color:var(--text-muted);margin-top:4px">Paid so far: €${paidExpenses.toLocaleString()}</div>
                </div>
            </div>

            <div class="grid grid-cols-2" style="gap:20px;align-items:start">
                <!-- Expenses List -->
                <div class="card">
                    <h3 style="margin-bottom:16px;display:flex;align-items:center;gap:8px">
                        <i data-lucide="trending-down" style="width:18px;color:var(--danger-color)"></i> Expenses
                    </h3>
                    ${expenses.length === 0 ? '<p class="text-muted text-sm">No expenses added yet.</p>' : 
                    '<div style="display:flex;flex-direction:column;gap:8px">' + expenses.map(i=>`
                        <div style="border:1px solid var(--border-light);border-radius:var(--radius-md);padding:12px;background:${i.paid?'var(--bg-main)':'var(--bg-surface)'}">
                            <div class="flex justify-between items-start" style="margin-bottom:4px">
                                <div>
                                    <div class="font-medium text-sm" style="${i.paid?'text-decoration:line-through;color:var(--text-muted)':''}">${i.name}</div>
                                    <div class="text-xs text-secondary">${i.category}</div>
                                </div>
                                <div class="font-bold" style="color:var(--danger-color)">€${i.amount.toLocaleString()}</div>
                            </div>
                            <div class="flex justify-between items-center" style="margin-top:8px">
                                <label class="badge cursor-pointer" style="background:${i.paid?'#d1fae5':'var(--bg-main)'};color:${i.paid?'#065f46':'var(--text-secondary)'};border:1px solid ${i.paid?'transparent':'var(--border-color)'}">
                                    <input type="checkbox" class="toggle-paid" data-id="${i.id}" ${i.paid?'checked':''} style="display:none">
                                    ${i.paid?'✓ Paid':'Pending'}
                                </label>
                                <div class="flex gap-2">
                                    <button class="icon-btn edit-item" data-id="${i.id}" style="width:24px;height:24px"><i data-lucide="edit-2" style="width:12px"></i></button>
                                    <button class="icon-btn del-item" data-id="${i.id}" style="width:24px;height:24px;color:var(--danger-color)"><i data-lucide="trash-2" style="width:12px"></i></button>
                                </div>
                            </div>
                        </div>
                    `).join('') + '</div>'}
                </div>

                <!-- Income / Scholarships List -->
                <div class="card">
                    <h3 style="margin-bottom:16px;display:flex;align-items:center;gap:8px">
                        <i data-lucide="trending-up" style="width:18px;color:var(--success-color)"></i> Income & Scholarships
                    </h3>
                    ${incomes.length === 0 ? '<p class="text-muted text-sm">No income or scholarships added yet.</p>' : 
                    '<div style="display:flex;flex-direction:column;gap:8px">' + incomes.map(i=>`
                        <div style="border:1px solid var(--border-light);border-radius:var(--radius-md);padding:12px;background:${i.paid?'var(--bg-main)':'var(--bg-surface)'}">
                            <div class="flex justify-between items-start" style="margin-bottom:4px">
                                <div>
                                    <div class="font-medium text-sm" style="${i.paid?'color:var(--success-color)':''}">${i.name}</div>
                                    <div class="text-xs text-secondary">${i.category}</div>
                                </div>
                                <div class="font-bold" style="color:var(--success-color)">+€${i.amount.toLocaleString()}</div>
                            </div>
                            <div class="flex justify-between items-center" style="margin-top:8px">
                                <label class="badge cursor-pointer" style="background:${i.paid?'#d1fae5':'var(--bg-main)'};color:${i.paid?'#065f46':'var(--text-secondary)'};border:1px solid ${i.paid?'transparent':'var(--border-color)'}">
                                    <input type="checkbox" class="toggle-paid" data-id="${i.id}" ${i.paid?'checked':''} style="display:none">
                                    ${i.paid?'✓ Received':'Pending'}
                                </label>
                                <div class="flex gap-2">
                                    <button class="icon-btn edit-item" data-id="${i.id}" style="width:24px;height:24px"><i data-lucide="edit-2" style="width:12px"></i></button>
                                    <button class="icon-btn del-item" data-id="${i.id}" style="width:24px;height:24px;color:var(--danger-color)"><i data-lucide="trash-2" style="width:12px"></i></button>
                                </div>
                            </div>
                        </div>
                    `).join('') + '</div>'}
                </div>
            </div>
        `;
        
        lucide.createIcons({ nodes: [wrap] });

        // Add Item
        wrap.querySelector('#add-item-btn').onclick = () => {
            UI.modal('Add Budget Item', itemForm({}), (overlay) => {
                const name = overlay.querySelector('#bi-name').value.trim();
                const amount = parseFloat(overlay.querySelector('#bi-amount').value);
                if (!name || isNaN(amount)) { UI.toast('Name and valid amount required', 'error'); return false; }
                
                const newItem = {
                    id: Date.now(),
                    type: overlay.querySelector('#bi-type').value,
                    name, amount,
                    category: overlay.querySelector('#bi-cat').value,
                    paid: overlay.querySelector('#bi-paid').checked
                };
                b.items.push(newItem);
                DB.budget.save(b);
                render();
            });
        };

        // Edit Budget Total
        wrap.querySelector('#edit-budget-btn').onclick = () => {
            UI.modal('Set Base Budget', `
                <div class="form-group">
                    <label class="form-label">Your Initial Budget (€)</label>
                    <input id="base-budget-inp" type="number" class="form-control" value="${baseBudget}" placeholder="e.g. 5000">
                    <p class="text-xs text-muted" style="margin-top:8px">This is the money you currently have saved. Scholarships and refunds will add to this amount.</p>
                </div>
            `, (overlay) => {
                const val = parseFloat(overlay.querySelector('#base-budget-inp').value) || 0;
                b.totalBudget = val;
                DB.budget.save(b);
                render();
            });
        };

        // Toggle paid status
        wrap.querySelectorAll('.toggle-paid').forEach(cb => {
            cb.onchange = () => {
                const id = parseInt(cb.dataset.id);
                const item = b.items.find(i => i.id === id);
                if (item) {
                    item.paid = cb.checked;
                    DB.budget.save(b);
                    render();
                }
            };
        });

        // Edit/Delete
        wrap.querySelectorAll('.edit-item').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.dataset.id);
                const item = b.items.find(i => i.id === id);
                if (item) {
                    UI.modal('Edit Item', itemForm(item), (overlay) => {
                        const name = overlay.querySelector('#bi-name').value.trim();
                        const amount = parseFloat(overlay.querySelector('#bi-amount').value);
                        if (!name || isNaN(amount)) { UI.toast('Name and valid amount required', 'error'); return false; }
                        item.type = overlay.querySelector('#bi-type').value;
                        item.name = name;
                        item.amount = amount;
                        item.category = overlay.querySelector('#bi-cat').value;
                        item.paid = overlay.querySelector('#bi-paid').checked;
                        DB.budget.save(b);
                        render();
                    });
                }
            };
        });

        wrap.querySelectorAll('.del-item').forEach(btn => {
            btn.onclick = () => {
                UI.confirm('Delete this item?', () => {
                    b.items = b.items.filter(i => i.id !== parseInt(btn.dataset.id));
                    DB.budget.save(b);
                    render();
                });
            };
        });
    };
    render();
    return wrap;
};

/* -------- CITY COMPARISON -------- */
const cityData = [
    { id:'milan',   name:'Milan',   rent:'550–900€', food:'280€', transport:'39€/mo', jobs:'★★★★★', student:'★★★★☆', uni:'Politecnico, Statale, Bocconi', pop:'3.2M' },
    { id:'padova',  name:'Padova',  rent:'350–550€', food:'220€', transport:'48€/mo', jobs:'★★★☆☆', student:'★★★★★', uni:'University of Padova (1222)', pop:'214K' },
    { id:'torino',  name:'Torino',  rent:'300–500€', food:'230€', transport:'42€/mo', jobs:'★★★★☆', student:'★★★★☆', uni:'Politecnico Torino, UniTO', pop:'870K' },
    { id:'bologna', name:'Bologna', rent:'350–600€', food:'240€', transport:'36€/mo', jobs:'★★★☆☆', student:'★★★★★', uni:'UniBO (oldest in Europe)', pop:'390K' },
    { id:'pisa',    name:'Pisa',    rent:'300–480€', food:'200€', transport:'30€/mo', jobs:'★★☆☆☆', student:'★★★★☆', uni:'Scuola Normale, UniPI', pop:'91K'  },
    { id:'rome',    name:'Rome',    rent:'500–850€', food:'270€', transport:'35€/mo', jobs:'★★★★☆', student:'★★★☆☆', uni:'Sapienza, Tor Vergata', pop:'4.3M'  },
];

window.views.cities = () => {
    const wrap = document.createElement('div');
    let selected = new Set(['milan','padova']);
    const render = () => {
        wrap.innerHTML = `
            <div class="page-header">
                <div><h2>City Comparison</h2><p class="page-desc">Compare Italian student cities side by side.</p></div>
            </div>
            <div class="city-cards" style="margin-bottom:24px">
                ${cityData.map(c=>`
                <div class="city-card ${selected.has(c.id)?'selected':''}" data-city="${c.id}">
                    <h3 style="margin-bottom:4px">${c.name}</h3>
                    <p class="text-muted text-xs">Pop. ${c.pop}</p>
                </div>`).join('')}
            </div>
            <div class="card">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            ${cityData.filter(c=>selected.has(c.id)).map(c=>`<th>${c.name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td class="font-medium">Monthly Rent</td>${cityData.filter(c=>selected.has(c.id)).map(c=>`<td>${c.rent}</td>`).join('')}</tr>
                        <tr><td class="font-medium">Food/mo</td>${cityData.filter(c=>selected.has(c.id)).map(c=>`<td>${c.food}</td>`).join('')}</tr>
                        <tr><td class="font-medium">Transport</td>${cityData.filter(c=>selected.has(c.id)).map(c=>`<td>${c.transport}</td>`).join('')}</tr>
                        <tr><td class="font-medium">Job Market</td>${cityData.filter(c=>selected.has(c.id)).map(c=>`<td>${c.jobs}</td>`).join('')}</tr>
                        <tr><td class="font-medium">Student Life</td>${cityData.filter(c=>selected.has(c.id)).map(c=>`<td>${c.student}</td>`).join('')}</tr>
                        <tr><td class="font-medium">Key Universities</td>${cityData.filter(c=>selected.has(c.id)).map(c=>`<td class="text-sm text-secondary">${c.uni}</td>`).join('')}</tr>
                    </tbody>
                </table>
            </div>
        `;
        lucide.createIcons({ nodes: [wrap] });
        wrap.querySelectorAll('.city-card').forEach(card => {
            card.onclick = () => {
                const id = card.dataset.city;
                if (selected.has(id)) { if (selected.size > 1) selected.delete(id); }
                else selected.add(id);
                render();
            };
        });
    };
    render();
    return wrap;
};

/* -------- RESOURCES -------- */
window.views.resources = () => {
    const wrap = document.createElement('div');
    const sections = [
        { title:'University Portals', icon:'building', links:[
            { name:'Politecnico di Milano', url:'https://www.polimi.it', desc:'Top Engineering & Cybersecurity programs' },
            { name:'University of Padova', url:'https://www.unipd.it', desc:'Cybersecurity MSc, one of Italy\'s best' },
            { name:'Sapienza University', url:'https://www.uniroma1.it', desc:'Largest in Europe, Rome' },
            { name:'Politecnico di Torino', url:'https://www.polito.it', desc:'Engineering & tech focus, Turin' },
            { name:'University of Bologna', url:'https://www.unibo.it', desc:'Oldest in Europe, broad programs' },
        ]},
        { title:'Scholarship & Funding', icon:'award', links:[
            { name:'MAECI Scholarships (Italy Gov)', url:'https://www.esteri.it/en/opportunities/scholarships/', desc:'Official Italian government scholarships for foreigners' },
            { name:'Erasmus Mundus Catalog', url:'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en', desc:'All funded joint master\'s programs' },
            { name:'Invest Your Talent in Italy', url:'https://www.esteri.it/en/opportunities/scholarships/', desc:'Scholarship for non-EU students in STEM' },
            { name:'EDISU Piemonte (DSU)', url:'https://www.edisu.piemonte.it', desc:'Regional scholarship, Torino' },
            { name:'UniStudium (EU Aid)', url:'https://www.dsu.unifi.it', desc:'Financial aid for non-EU students in Italy' },
        ]},
        { title:'Visa & Official Procedures', icon:'shield', links:[
            { name:'Universitaly (Pre-enrollment)', url:'https://www.universitaly.it', desc:'Mandatory pre-enrollment for study visa' },
            { name:'CIMEA (Document Recognition)', url:'https://www.cimea.it', desc:'Request Statement of Comparability for your degree' },
            { name:'VFS Global Italy Visa', url:'https://www.vfsglobal.com/Italy/Morocco', desc:'Book your visa appointment in Morocco' },
            { name:'Italian Embassy Rabat', url:'https://ambrabat.esteri.it', desc:'Official visa info for Morocco residents' },
            { name:'Portale Immigrazione', url:'https://www.portaleimmigrazione.it', desc:'Request Permesso di Soggiorno after arrival' },
        ]},
        { title:'Housing Platforms', icon:'home', links:[
            { name:'Uniplaces', url:'https://www.uniplaces.com', desc:'Student housing across Italian cities' },
            { name:'Erasmusu', url:'https://erasmusu.com', desc:'Erasmus student accommodation' },
            { name:'Idealista', url:'https://www.idealista.it', desc:'Main Italian real estate platform' },
            { name:'Immobiliare.it', url:'https://www.immobiliare.it', desc:'Large property search site' },
        ]},
    ];

    wrap.innerHTML = `
        <div class="page-header">
            <div><h2>Official Resources</h2><p class="page-desc">Verified links to universities, scholarships, visa portals, and housing.</p></div>
        </div>
        <div class="grid grid-cols-2" style="gap:20px">
            ${sections.map(sec=>`
            <div class="card">
                <h3 style="margin-bottom:16px;display:flex;align-items:center;gap:8px">
                    <i data-lucide="${sec.icon}" style="width:18px;color:var(--primary-color)"></i> ${sec.title}
                </h3>
                <div style="display:flex;flex-direction:column;gap:10px">
                    ${sec.links.map(l=>`
                    <a href="${l.url}" target="_blank" class="flex items-center justify-between p-3 rounded" 
                        style="background:var(--bg-hover);border-radius:var(--radius-md);text-decoration:none;transition:background 0.2s"
                        onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background='var(--bg-hover)'">
                        <div>
                            <div class="font-medium text-sm" style="color:var(--text-primary)">${l.name}</div>
                            <div class="text-xs text-muted">${l.desc}</div>
                        </div>
                        <i data-lucide="external-link" style="width:14px;color:var(--text-muted);flex-shrink:0"></i>
                    </a>`).join('')}
                </div>
            </div>`).join('')}
        </div>
    `;
    lucide.createIcons({ nodes: [wrap] });
    return wrap;
};
