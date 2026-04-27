/**
 * DB — localStorage-backed database engine with advanced features
 */
const DB_KEYS = {
    profile:       'sip_profile',
    programs:      'sip_programs',
    applications:  'sip_applications',
    documents:     'sip_documents',
    deadlines:     'sip_deadlines',
    scholarships:  'sip_scholarships',
    accommodation: 'sip_accommodation',
    internships:   'sip_internships',
    notes:         'sip_notes',
    bookmarks:     'sip_bookmarks',
    budget:        'sip_budget',
    visa:          'sip_visa',
    portals:       'sip_portals',
    alerts:        'sip_alerts',
};

const DB = {
    _read(key)  { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; } },
    _write(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
    _nextId(arr) { return arr.length ? Math.max(...arr.map(i => i.id || 0)) + 1 : 1; },

    // --- Profile ---
    profile: {
        get() {
            return DB._read(DB_KEYS.profile) || {
                name:'', nationality:'Moroccan', email:'',
                field:'', budget:'', englishLevel:'', englishScore:'',
                degree:'', university:'', gpa:'', gradYear:'',
                city:'', targetCities:'', budgetAmount:'',
                italianLevel:'', skills:'', languages:'', goals:''
            };
        },
        save(data) { DB._write(DB_KEYS.profile, data); }
    },

    // --- Generic collection ---
    _collection(key) {
        return {
            all()     { return DB._read(key) || []; },
            find(id)  { return (DB._read(key) || []).find(i => i.id === id) || null; },
            add(item) {
                const list = DB._read(key) || [];
                item.id = DB._nextId(list);
                item.createdAt = new Date().toISOString();
                item.tags = item.tags || [];
                list.push(item);
                DB._write(key, list);
                return item;
            },
            update(id, patch) {
                const list = DB._read(key) || [];
                const idx  = list.findIndex(i => i.id === id);
                if (idx === -1) return null;
                list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
                DB._write(key, list);
                return list[idx];
            },
            remove(id) {
                DB._write(key, (DB._read(key) || []).filter(i => i.id !== id));
            }
        };
    },

    get programs()      { return DB._collection(DB_KEYS.programs); },
    get applications()  { return DB._collection(DB_KEYS.applications); },
    get documents()     { return DB._collection(DB_KEYS.documents); },
    get deadlines()     { return DB._collection(DB_KEYS.deadlines); },
    get scholarships()  { return DB._collection(DB_KEYS.scholarships); },
    get accommodation() { return DB._collection(DB_KEYS.accommodation); },
    get internships()   { return DB._collection(DB_KEYS.internships); },
    get notes()         { return DB._collection(DB_KEYS.notes); },
    get bookmarks()     { return DB._collection(DB_KEYS.bookmarks); },
    get portals()       { return DB._collection(DB_KEYS.portals); },

    budget: {
        get() { 
            const data = DB._read(DB_KEYS.budget);
            if (data && data.items) return data;
            // Migrate old structure or create new
            const items = [];
            let totalBudget = 0;
            if (data && typeof data === 'object') {
                Object.keys(data).forEach((k, i) => {
                    if (data[k] > 0) items.push({ id: i+1, type: 'expense', name: k, amount: parseFloat(data[k]) || 0, paid: false });
                });
            }
            return { totalBudget, items };
        },
        save(data) { DB._write(DB_KEYS.budget, data); }
    },

    visa: {
        defaults: [
            { id:1,  step:'Get University Acceptance Letter',       done:false, notes:'' },
            { id:2,  step:'Pre-enroll on Universitaly Portal',      done:false, notes:'' },
            { id:3,  step:'Obtain CIMEA or Declaration of Value',   done:false, notes:'' },
            { id:4,  step:'Legalise / Notarise Academic Documents', done:false, notes:'' },
            { id:5,  step:'Prepare Financial Proof (≥6,000€/yr)',   done:false, notes:'' },
            { id:6,  step:'Find & confirm Accommodation',           done:false, notes:'' },
            { id:7,  step:'Get Travel Health Insurance',            done:false, notes:'' },
            { id:8,  step:'Book VFS Global Appointment',            done:false, notes:'' },
            { id:9,  step:'Submit Visa Dossier at Consulate',       done:false, notes:'' },
            { id:10, step:'Collect Visa & Book Flight',             done:false, notes:'' },
        ],
        get()           { return DB._read(DB_KEYS.visa) || DB.visa.defaults; },
        toggleDone(id)  { const l=DB.visa.get(); const i=l.find(x=>x.id===id); if(i){i.done=!i.done; DB._write(DB_KEYS.visa,l);} },
        saveNotes(id,n) { const l=DB.visa.get(); const i=l.find(x=>x.id===id); if(i){i.notes=n; DB._write(DB_KEYS.visa,l);} }
    },

    // --- Alerts engine ---
    alerts: {
        generate() {
            const alerts = [];
            const today = new Date();
            const daysTo = (d) => Math.ceil((new Date(d) - today) / 86400000);

            // Deadline alerts
            DB.deadlines.all().forEach(d => {
                const dl = daysTo(d.date);
                if (dl >= 0 && dl <= 3)  alerts.push({ type:'danger',  icon:'alarm-clock', msg:`Deadline in ${dl}d: "${d.title}"`, entity:'deadline', id:d.id });
                else if (dl > 3 && dl <= 7) alerts.push({ type:'warning', icon:'clock', msg:`Deadline in ${dl}d: "${d.title}"`, entity:'deadline', id:d.id });
            });

            // Document alerts
            DB.documents.all().forEach(d => {
                if (d.status === 'missing') alerts.push({ type:'danger', icon:'file-x', msg:`Missing document: "${d.name}"`, entity:'document', id:d.id });
                if (d.expiry) {
                    const exp = daysTo(d.expiry);
                    if (exp >= 0 && exp <= 90) alerts.push({ type:'warning', icon:'calendar-x', msg:`"${d.name}" expires in ${exp} days`, entity:'document', id:d.id });
                    if (exp < 0) alerts.push({ type:'danger', icon:'alert-triangle', msg:`"${d.name}" has EXPIRED`, entity:'document', id:d.id });
                }
            });

            // Application missing doc alerts
            DB.applications.all().forEach(app => {
                if (['not-started','in-progress'].includes(app.status) && app.deadline) {
                    const dl = daysTo(app.deadline);
                    if (dl >= 0 && dl <= 7) {
                        const docs = DB.documents.all().filter(d => d.status === 'missing' || d.status === 'in-progress');
                        if (docs.length > 0) {
                            alerts.push({ type:'warning', icon:'file-warning', msg:`${docs.length} doc(s) incomplete for "${app.program}" (due in ${dl}d)`, entity:'application', id:app.id });
                        }
                    }
                }
            });

            // Visa step reminders
            const visaSteps = DB.visa.get();
            const nextPending = visaSteps.find(s => !s.done);
            if (nextPending) {
                alerts.push({ type:'info', icon:'shield', msg:`Next visa step: "${nextPending.step}"`, entity:'visa', id:nextPending.id });
            }

            return alerts.sort((a,b) => { const o={danger:0,warning:1,info:2}; return (o[a.type]||3)-(o[b.type]||3); });
        }
    },

    // --- Acceptance probability engine ---
    matchEngine: {
        calculate(program) {
            const p = DB.profile.get();
            let score = 50; // base
            const reasons = [];
            const suggestions = [];

            // GPA factor
            const gpa = parseFloat(p.gpa);
            if (gpa) {
                if (gpa >= 3.5 || gpa >= 16) { score += 15; reasons.push('Strong GPA'); }
                else if (gpa >= 3.0 || gpa >= 14) { score += 8; reasons.push('Good GPA'); }
                else if (gpa >= 2.5 || gpa >= 12) { score += 2; reasons.push('Average GPA'); suggestions.push('Improve GPA or highlight relevant experience'); }
                else { score -= 5; reasons.push('Below-average GPA'); suggestions.push('Strengthen your application with projects/certifications'); }
            } else {
                suggestions.push('Add your GPA to get a better estimate');
            }

            // English level
            const eng = p.englishLevel;
            if (eng) {
                if (['C1','C2'].includes(eng)) { score += 15; reasons.push('Excellent English level'); }
                else if (eng === 'B2') { score += 10; reasons.push('B2 English meets most requirements'); }
                else if (eng === 'B1') { score += 3; reasons.push('B1 may be insufficient'); suggestions.push('Aim for B2 or higher (IELTS 6.0+)'); }
                else { suggestions.push('Improve English to at least B2 for most programs'); }
            } else {
                suggestions.push('Set your English level in Profile');
            }

            // Field match
            if (p.field && program.field) {
                if (p.field.toLowerCase().includes(program.field.toLowerCase()) ||
                    program.field.toLowerCase().includes(p.field.toLowerCase())) {
                    score += 10; reasons.push('Field matches your background');
                } else {
                    score += 2; suggestions.push('This program may not perfectly match your field');
                }
            }

            // Degree match
            if (p.degree) {
                const deg = p.degree.toLowerCase();
                if (deg.includes('computer') || deg.includes('informati') || deg.includes('engineer') || deg.includes('cyber') || deg.includes('network')) {
                    score += 10; reasons.push('Relevant bachelor degree');
                } else {
                    score += 3; suggestions.push('Highlight any CS/IT coursework in your application');
                }
            } else {
                suggestions.push('Add your degree to Profile for better matching');
            }

            // Competition factor (by university reputation)
            const competitive = ['Politecnico di Milano','Sapienza','Bologna'];
            if (competitive.some(u => (program.university||'').includes(u))) {
                score -= 5; reasons.push('Highly competitive program');
            }

            // Scholarship factor (positive)
            if (program.scholarship === 'yes') {
                score += 3; reasons.push('Scholarship available');
            }

            score = Math.max(10, Math.min(98, score));

            let level, color, emoji;
            if (score >= 75) { level='Safe'; color='var(--success-color)'; emoji='🟢'; }
            else if (score >= 50) { level='Medium'; color='var(--warning-color)'; emoji='🟡'; }
            else { level='Risky'; color='var(--danger-color)'; emoji='🔴'; }

            return { score, level, color, emoji, reasons, suggestions };
        }
    },

    // --- Deadline predictor ---
    deadlinePredictor: {
        predict(program) {
            const predictions = [];
            const uni = (program.university || '').toLowerCase();
            const type = (program.type || '').toLowerCase();

            // Historical patterns for Italian universities
            if (uni.includes('polimi') || uni.includes('politecnico di milano')) {
                predictions.push({ event:'1st Call Opens', date:'Early November', confidence:'High', note:'Usually Nov 7-15' });
                predictions.push({ event:'1st Call Deadline', date:'Mid February', confidence:'High', note:'Usually Feb 20-28' });
                predictions.push({ event:'2nd Call Deadline', date:'Late April', confidence:'High', note:'Usually Apr 15-25' });
                predictions.push({ event:'3rd Call Deadline', date:'Mid July', confidence:'Medium', note:'If available, Jul 10-20' });
            } else if (uni.includes('padova')) {
                predictions.push({ event:'Applications Open', date:'December – January', confidence:'Medium', note:'Varies by program' });
                predictions.push({ event:'1st Deadline', date:'February', confidence:'Medium', note:'Usually Feb 15-28' });
                predictions.push({ event:'2nd Deadline', date:'May', confidence:'Medium', note:'Usually May 15-31' });
            } else if (uni.includes('sapienza') || uni.includes('roma')) {
                predictions.push({ event:'Non-EU Deadline', date:'Late April', confidence:'High', note:'Usually Apr 25-29' });
                predictions.push({ event:'EU/Resident Deadline', date:'Late July', confidence:'High', note:'Usually Jul 25-31' });
            } else if (uni.includes('torino') || uni.includes('polito')) {
                predictions.push({ event:'Applications Open', date:'November', confidence:'Medium', note:'Rolling admissions start Nov' });
                predictions.push({ event:'Final Deadline', date:'July', confidence:'Medium', note:'Multiple windows Dec-Jul' });
            } else if (uni.includes('bologna') || uni.includes('unibo')) {
                predictions.push({ event:'Non-EU Deadline', date:'March - April', confidence:'Medium', note:'Check specific program' });
                predictions.push({ event:'EU Deadline', date:'June - July', confidence:'Medium', note:'Varies by faculty' });
            } else if (uni.includes('trento')) {
                predictions.push({ event:'Non-EU Deadline', date:'Early March', confidence:'High', note:'Usually Mar 1-10' });
                predictions.push({ event:'EU Deadline', date:'June - July', confidence:'Medium' });
            } else if (uni.includes('pisa')) {
                predictions.push({ event:'Non-EU Deadline', date:'March', confidence:'Medium' });
                predictions.push({ event:'EU Deadline', date:'July', confidence:'Medium' });
            } else if (type.includes('erasmus')) {
                predictions.push({ event:'Applications Open', date:'October', confidence:'Medium', note:'Most EM programs open Oct-Nov' });
                predictions.push({ event:'Deadline', date:'January - February', confidence:'High', note:'Highly competitive, apply early' });
            } else {
                predictions.push({ event:'Estimated Open', date:'Late 2025 / Early 2026', confidence:'Low', note:'Check university website' });
                predictions.push({ event:'Estimated Deadline', date:'Spring 2026', confidence:'Low', note:'Public unis usually Mar-Jul' });
            }
            return predictions;
        }
    }
};

window.DB = DB;

/* ---- Tag constants ---- */
window.TAGS = {
    list: ['Urgent','Important','Waiting','Completed','Review','Optional'],
    colors: { Urgent:'#dc2626', Important:'#d97706', Waiting:'#6d28d9', Completed:'#059669', Review:'#0891b2', Optional:'#64748b' }
};
