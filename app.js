let appMain, appClients, dbMain, dbClients, storageMain, storageClients, authMain;

try {
    appMain = firebase.initializeApp(window.CONFIG.firebaseMain, "mainApp");
    dbMain = appMain.firestore();
    storageMain = appMain.storage();
    authMain = appMain.auth();
    document.getElementById('status-main').classList.add('active');
} catch (e) {}

try {
    appClients = firebase.initializeApp(window.CONFIG.firebaseClients, "clientApp");
    dbClients = appClients.firestore();
    storageClients = appClients.storage();
    document.getElementById('status-clients').classList.add('active');
} catch (e) {}

const state = {
    currentView: 'dashboard',
    leads: [],
    galleries: [],
    portfolio: [],
    selectedLead: null,
    currentLang: 'lt',
    tgToken: localStorage.getItem('dp_admin_tg_token') || '',
    tgChatId: localStorage.getItem('dp_admin_tg_chat_id') || ''
};

authMain.onAuthStateChanged((user) => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    }

    if (user && user.email.toLowerCase() === window.CONFIG.ADMIN_EMAIL.toLowerCase()) {
        document.getElementById('auth-overlay').style.display = 'none';
        document.getElementById('app-layout').classList.add('active');
        document.getElementById('display-admin-email').innerText = user.email;
        initDataListeners();
    } else {
        if (user) {
            authMain.signOut();
            showToast("Prieiga uždrausta.", "error");
        }
        document.getElementById('auth-overlay').style.display = 'flex';
        document.getElementById('app-layout').classList.remove('active');
    }
});

document.getElementById('btn-login-auth').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    
    if (email.toLowerCase() !== window.CONFIG.ADMIN_EMAIL.toLowerCase()) {
        showToast("Prieiga uždrausta.", "error");
        return;
    }
    
    try {
        await authMain.signInWithEmailAndPassword(email, pass);
        showToast("Sėkmingai prisijungta!", "success");
    } catch (err) {
        showToast("Autorizacijos klaida.", "error");
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    authMain.signOut().then(() => showToast("Atsijungta", "info"));
});

function showToast(msg, type = 'info') {
    const wrap = document.getElementById('toast-wrap');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check' : 'fa-triangle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}" style="margin-right: 8px;"></i> ${escapeHtml(msg)}`;
    wrap.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideToast 0.3s var(--cb) reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(ts) {
    if (!ts) return '-';
    try {
        const date = ts.toDate ? ts.toDate() : new Date(ts);
        return date.toLocaleDateString('lt-LT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return '-'; }
}

function getLangBadge(lang) {
    const l = (lang || 'LT').toUpperCase();
    if (l === 'LT') return `<span class="badge badge-lt">LT</span>`;
    if (l === 'RU') return `<span class="badge badge-ru">RU</span>`;
    return `<span class="badge badge-en">EN</span>`;
}

function getStatusBadge(status) {
    switch (status) {
        case 'new': return `<span class="badge badge-new">Naujas</span>`;
        case 'in_progress': return `<span class="badge badge-progress">Vykdoma</span>`;
        case 'answered': return `<span class="badge badge-answered">Atsakyta</span>`;
        case 'archived': return `<span class="badge badge-archived">Archyvas</span>`;
        default: return `<span class="badge badge-new">${escapeHtml(status)}</span>`;
    }
}

function switchView(viewName) {
    state.currentView = viewName;
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.toggle('active', sec.id === `view-${viewName}`);
    });
    const titles = {
        dashboard: 'Apžvalga ir Rodikliai',
        leads: 'Užklausos & TFP Paraiškos',
        galleries: 'Klientų Portalas & Galerijos (API 2)',
        portfolio: 'Portfolio TVS (API 1)',
        settings: 'Nustatymai & Telegram Bot'
    };
    document.getElementById('page-header-title').innerText = titles[viewName] || 'Valdymo Pultas';
    document.getElementById('sidebar').classList.remove('open');
}

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => switchView(item.getAttribute('data-view')));
});

document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

function initDataListeners() {
    if (dbMain) {
        dbMain.collection('requests').orderBy('createdAt', 'desc').onSnapshot((snap) => {
            state.leads = [];
            snap.forEach(doc => state.leads.push({ id: doc.id, ...doc.data() }));
            renderLeads();
            updateCounters();
        }, () => {
            dbMain.collection('tfp_requests').onSnapshot((snap) => {
                state.leads = [];
                snap.forEach(doc => state.leads.push({ id: doc.id, ...doc.data() }));
                renderLeads();
                updateCounters();
            });
        });

        dbMain.collection('portfolio').orderBy('createdAt', 'desc').onSnapshot((snap) => {
            state.portfolio = [];
            snap.forEach(doc => state.portfolio.push({ id: doc.id, ...doc.data() }));
            renderPortfolio();
            updateCounters();
        });
    }

    if (dbClients) {
        dbClients.collection('galleries').orderBy('createdAt', 'desc').onSnapshot((snap) => {
            state.galleries = [];
            snap.forEach(doc => state.galleries.push({ id: doc.id, ...doc.data() }));
            renderGalleries();
            updateCounters();
        });
    }
}

function updateCounters() {
    const newLeads = state.leads.filter(l => !l.status || l.status === 'new').length;
    document.getElementById('badge-leads-count').innerText = state.leads.length;
    document.getElementById('badge-new-leads').innerText = newLeads;
    document.getElementById('stat-leads-new').innerText = newLeads;
    document.getElementById('badge-galleries-count').innerText = state.galleries.length;
    document.getElementById('stat-galleries-count').innerText = state.galleries.length;
    document.getElementById('stat-portfolio-count').innerText = state.portfolio.length;

    const recentBody = document.getElementById('table-recent-leads');
    if (!state.leads.length) {
        recentBody.innerHTML = `<tr><td colspan="6"><div class="empty-placeholder">Naujų užklausų kol kas nėra</div></td></tr>`;
        return;
    }
    
    recentBody.innerHTML = state.leads.slice(0, 5).map(lead => `
        <tr>
            <td>${getLangBadge(lead.language || lead.lang || 'LT')}</td>
            <td><strong>${escapeHtml(lead.name || 'Be vardo')}</strong><br><small style="color:rgba(26,43,43,0.6)">${escapeHtml(lead.email || lead.instagram || '-')}</small></td>
            <td>${escapeHtml(lead.type || lead.shootType || 'TFP / Fotosesija')}</td>
            <td>${formatDate(lead.createdAt)}</td>
            <td>${getStatusBadge(lead.status || 'new')}</td>
            <td><button class="action-icon-btn" onclick="openLeadModal('${lead.id}')" title="Peržiūrėti"><i class="fa-solid fa-eye"></i></button></td>
        </tr>
    `).join('');
}

function renderLeads() {
    const tbody = document.getElementById('table-all-leads');
    const search = (document.getElementById('search-leads').value || '').toLowerCase();
    const filterLang = document.getElementById('filter-lead-lang').value;
    const filterStatus = document.getElementById('filter-lead-status').value;

    const filtered = state.leads.filter(lead => {
        const name = (lead.name || '').toLowerCase();
        const email = (lead.email || '').toLowerCase();
        const lang = (lead.language || lead.lang || 'LT').toUpperCase();
        const status = lead.status || 'new';
        return (name.includes(search) || email.includes(search)) && 
               (filterLang === 'all' || lang === filterLang) && 
               (filterStatus === 'all' || status === filterStatus);
    });

    if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="7"><div class="empty-placeholder">Užklausų nerasta</div></td></tr>`;
        return;
    }
    
    tbody.innerHTML = filtered.map(lead => `
        <tr>
            <td>${getLangBadge(lead.language || lead.lang || 'LT')}</td>
            <td><strong>${escapeHtml(lead.name || 'Svečias')}</strong></td>
            <td><div>${escapeHtml(lead.email || '-')}</div><small style="color:rgba(26,43,43,0.6);">${escapeHtml(lead.phone || lead.instagram || '')}</small></td>
            <td>${escapeHtml(lead.type || lead.shootType || 'TFP / Užklausa')}</td>
            <td>${formatDate(lead.createdAt)}</td>
            <td>${getStatusBadge(lead.status || 'new')}</td>
            <td style="display:flex; gap:8px;">
                <button class="action-icon-btn" onclick="openLeadModal('${lead.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="action-icon-btn danger" onclick="deleteLead('${lead.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderGalleries() {
    const grid = document.getElementById('grid-galleries');
    const search = (document.getElementById('search-galleries').value || '').toLowerCase();
    
    const filtered = state.galleries.filter(g => 
        (g.clientName || '').toLowerCase().includes(search) || 
        (g.token || '').toLowerCase().includes(search)
    );
    
    if (!filtered.length) {
        grid.innerHTML = `<div style="grid-column: 1/-1;"><div class="empty-placeholder">Klientų galerijų nėra</div></div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(g => `
        <div class="album-card-admin">
            <div class="album-card-cover" style="background-image: url('${g.coverUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}');">
                <div class="album-card-badges">
                    <span class="badge ${g.status === 'paid' ? 'badge-paid' : (g.status === 'locked' ? 'badge-locked' : 'badge-ready')}">${g.status === 'paid' ? 'Apmokėta' : (g.status === 'locked' ? 'Užrakinta' : 'Paruošta')}</span>
                    <span class="album-token">${escapeHtml(g.token)}</span>
                </div>
            </div>
            <div class="album-card-body">
                <div style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600;">${escapeHtml(g.clientName)}</div>
                <div style="font-size: 0.8rem; color: rgba(26,43,43,0.7);"><i class="fa-solid fa-camera" style="margin-right:6px;"></i>${escapeHtml(g.type || 'Fotosesija')}</div>
                <div style="font-size: 0.8rem; color: rgba(26,43,43,0.7);"><i class="fa-solid fa-calendar-day" style="margin-right:6px;"></i>${g.shootDate || 'Data nenurodyta'}</div>
                <div style="font-size: 0.8rem; color: rgba(26,43,43,0.7);"><i class="fa-solid fa-key" style="margin-right:6px;"></i>PIN: ${escapeHtml(g.pin || 'Be PIN')}</div>
            </div>
            <div class="album-card-footer">
                <button class="cta-button" style="padding: 6px 12px; font-size: 0.7rem;" onclick="copyGalleryLink('${g.token}')"><i class="fa-solid fa-link"></i> Nuoroda</button>
                <button class="action-icon-btn danger" onclick="deleteGallery('${g.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function renderPortfolio() {
    const grid = document.getElementById('grid-portfolio');
    const search = (document.getElementById('search-portfolio').value || '').toLowerCase();
    
    const filtered = state.portfolio.filter(p => 
        (p.title || '').toLowerCase().includes(search) || 
        (p.category || '').toLowerCase().includes(search)
    );
    
    if (!filtered.length) {
        grid.innerHTML = `<div style="grid-column: 1/-1;"><div class="empty-placeholder">Portfolio tuščias</div></div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(p => `
        <div class="album-card-admin">
            <div class="album-card-cover" style="background-image: url('${p.coverUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'}');">
                <div class="album-card-badges"><span class="badge badge-ready">${escapeHtml(p.category || 'Editorial')}</span></div>
            </div>
            <div class="album-card-body">
                <div style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 600;">${escapeHtml(p.title)}</div>
                <p style="font-size: 0.8rem; color: rgba(26,43,43,0.7); line-height: 1.4;">${escapeHtml(p.description || 'Be aprašymo')}</p>
            </div>
            <div class="album-card-footer">
                <span style="font-size: 0.75rem; color: rgba(26,43,43,0.5);">${formatDate(p.createdAt)}</span>
                <button class="action-icon-btn danger" onclick="deletePortfolioItem('${p.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function openLeadModal(id) {
    const lead = state.leads.find(l => l.id === id);
    if (!lead) return;
    
    state.selectedLead = lead;
    state.currentLang = (lead.language || lead.lang || 'lt').toLowerCase();

    document.getElementById('lead-modal-title').innerText = `Užklausa #${lead.id.substring(0, 6)}`;
    document.getElementById('lead-modal-name').innerText = lead.name || 'Be vardo';
    document.getElementById('lead-modal-lang-badge').innerHTML = getLangBadge(state.currentLang);
    document.getElementById('lead-modal-email').innerText = lead.email || '-';
    document.getElementById('lead-modal-phone').innerText = lead.phone || lead.instagram || '-';
    document.getElementById('lead-modal-message').innerText = lead.message || lead.notes || 'Pranešimo tekstas tuščias';
    document.getElementById('lead-modal-status-select').value = lead.status || 'new';

    document.getElementById('tpl-var-datetime').value = '';
    document.getElementById('tpl-var-location').value = '';
    document.getElementById('tpl-var-service').value = lead.type || lead.shootType || 'Fotosesija';
    document.getElementById('tpl-var-price').value = '';
    document.getElementById('tpl-var-deposit').value = '';

    updateTemplatePreview();
    openModal('modal-lead');
}

function setTemplateLang(lang) {
    state.currentLang = lang;
    updateTemplatePreview();
}

function updateTemplatePreview() {
    if (!state.selectedLead) return;
    
    const type = document.getElementById('lead-modal-template-select').value;
    const statusSelect = document.getElementById('lead-modal-status-select');
    
    const data = {
        name: state.selectedLead.name || 'Klientas',
        idea: state.selectedLead.message || state.selectedLead.notes || 'Jūsų idėja',
        date_time: document.getElementById('tpl-var-datetime').value || '[Data ir Laikas]',
        location: document.getElementById('tpl-var-location').value || '[Vieta]',
        serviceName: document.getElementById('tpl-var-service').value || '[Paslauga]',
        finalPrice: document.getElementById('tpl-var-price').value || '[Kaina]',
        depositAmount: document.getElementById('tpl-var-deposit').value || '[Avansas]',
        remainingAmount: (Number(document.getElementById('tpl-var-price').value) - Number(document.getElementById('tpl-var-deposit').value)) || '[Likutis]',
        paymentMethod: 'Bankinis pavedimas / PayPal',
        status: statusSelect.options[statusSelect.selectedIndex].text
    };

    const result = window.buildEmail(type, state.currentLang, data);
    document.getElementById('tpl-preview-subject').innerText = result.subject;
    document.getElementById('lead-modal-html-output').innerHTML = result.html;
}

document.getElementById('lead-modal-template-select').addEventListener('change', updateTemplatePreview);
document.querySelectorAll('.tpl-trigger').forEach(input => input.addEventListener('input', updateTemplatePreview));

document.getElementById('btn-lead-save-status').addEventListener('click', async () => {
    if (!state.selectedLead || !dbMain) return;
    const newStatus = document.getElementById('lead-modal-status-select').value;
    
    try {
        await dbMain.collection('requests').doc(state.selectedLead.id).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast("Būsena atnaujinta", "success");
        closeModal('modal-lead');
    } catch (e) {
        try {
            await dbMain.collection('tfp_requests').doc(state.selectedLead.id).update({
                status: newStatus,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showToast("Būsena atnaujinta", "success");
            closeModal('modal-lead');
        } catch (err) {
            showToast("Klaida išsaugant būseną", "error");
        }
    }
});

document.getElementById('btn-lead-copy-html').addEventListener('click', () => {
    const html = document.getElementById('lead-modal-html-output').innerHTML;
    navigator.clipboard.writeText(html).then(() => {
        showToast("HTML kodas nukopijuotas.", "success");
    });
});

document.getElementById('btn-lead-send-tg').addEventListener('click', async () => {
    if (!state.selectedLead) return;
    const l = state.selectedLead;
    const msg = `📷 *DP Lead*\n\n👤 *Vardas:* ${l.name || '-'}\n🌐 *Kalba:* [${l.language || 'LT'}]\n✉️ *El. paštas:* ${l.email || '-'}\n📱 *Kontaktai:* ${l.phone || l.instagram || '-'}\n🎯 *Tipas:* ${l.type || 'Fotosesija'}\n📝 *Pranešimas:* ${l.message || '-'}`;
    await sendTelegramMessage(msg);
});

async function deleteLead(id) {
    if (!confirm("Ar tikrai norite ištrinti šią užklausą?")) return;
    try {
        await dbMain.collection('requests').doc(id).delete();
        showToast("Užklausa ištrinta", "info");
    } catch (e) {
        try {
            await dbMain.collection('tfp_requests').doc(id).delete();
            showToast("Užklausa ištrinta", "info");
        } catch (err) {
            showToast("Klaida trinant", "error");
        }
    }
}

function generateGalleryToken() {
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    document.getElementById('gal-shoot-token').value = `DP-${new Date().getFullYear()}-${rand}`;
}

document.getElementById('btn-open-new-gallery-modal').addEventListener('click', () => {
    generateGalleryToken();
    openModal('modal-gallery');
});

document.getElementById('btn-save-gallery').addEventListener('click', async () => {
    const clientName = document.getElementById('gal-client-name').value.trim();
    const type = document.getElementById('gal-shoot-type').value;
    const shootDate = document.getElementById('gal-shoot-date').value;
    const status = document.getElementById('gal-shoot-status').value;
    const pin = document.getElementById('gal-shoot-pin').value.trim();
    const token = document.getElementById('gal-shoot-token').value.trim();
    const fileInput = document.getElementById('gal-file-input');

    if (!clientName || !token) {
        showToast("Užpildykite kliento vardą ir žetoną", "error");
        return;
    }
    
    if (!dbClients) {
        showToast("API 2 neinicijuotas", "error");
        return;
    }

    const saveBtn = document.getElementById('btn-save-gallery');
    saveBtn.disabled = true;
    
    try {
        let coverUrl = '';
        
        if (fileInput.files.length > 0 && storageClients) {
            const file = fileInput.files[0];
            if (file.size > 5 * 1024 * 1024) {
                showToast("Failas per didelis (Maks. 5MB)", "error");
                saveBtn.disabled = false;
                return;
            }
            
            const storageRef = storageClients.ref(`galleries/${token}/cover_${Date.now()}_${file.name}`);
            const uploadTask = storageRef.put(file);
            const pBox = document.getElementById('gal-progress-box');
            const pBar = document.getElementById('gal-progress-bar');
            
            pBox.style.display = 'block';

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', 
                    (snap) => {
                        pBar.style.width = `${(snap.bytesTransferred / snap.totalBytes) * 100}%`;
                    }, 
                    (err) => reject(err), 
                    async () => {
                        coverUrl = await uploadTask.snapshot.ref.getDownloadURL();
                        resolve();
                    }
                );
            });
        }

        await dbClients.collection('galleries').add({
            clientName,
            type,
            shootDate,
            status,
            pin,
            token,
            coverUrl: coverUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast(`Galerija klientui ${clientName} sukurta!`, "success");
        closeModal('modal-gallery');
        document.getElementById('gal-client-name').value = '';
        document.getElementById('gal-file-input').value = '';
        
    } catch (err) {
        showToast("Klaida: " + err.message, "error");
    } finally {
        saveBtn.disabled = false;
        document.getElementById('gal-progress-box').style.display = 'none';
    }
});

function copyGalleryLink(token) {
    navigator.clipboard.writeText(`https://clients.dominikphotofficial.lt/#/gallery/${token}`).then(() => {
        showToast("Nuoroda nukopijuota!", "success");
    });
}

async function deleteGallery(id) {
    if (!confirm("Ištrinti galeriją?")) return;
    try {
        await dbClients.collection('galleries').doc(id).delete();
        showToast("Galerija ištrinta", "info");
    } catch (e) {
        showToast("Klaida trinant", "error");
    }
}

document.getElementById('btn-open-new-portfolio-modal').addEventListener('click', () => {
    openModal('modal-portfolio');
});

document.getElementById('btn-save-portfolio').addEventListener('click', async () => {
    const title = document.getElementById('port-title').value.trim();
    const category = document.getElementById('port-category').value;
    const description = document.getElementById('port-desc').value.trim();
    const fileInput = document.getElementById('port-file-input');

    if (!title) {
        showToast("Nurodykite pavadinimą", "error");
        return;
    }
    
    if (!dbMain) {
        showToast("API 1 neinicijuotas", "error");
        return;
    }

    const saveBtn = document.getElementById('btn-save-portfolio');
    saveBtn.disabled = true;
    
    try {
        let coverUrl = '';
        
        if (fileInput.files.length > 0 && storageMain) {
            const file = fileInput.files[0];
            if (file.size > 5 * 1024 * 1024) {
                showToast("Failas per didelis (Maks. 5MB)", "error");
                saveBtn.disabled = false;
                return;
            }
            
            const storageRef = storageMain.ref(`portfolio/cover_${Date.now()}_${file.name}`);
            const uploadTask = storageRef.put(file);
            const pBox = document.getElementById('port-progress-box');
            const pBar = document.getElementById('port-progress-bar');
            
            pBox.style.display = 'block';

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', 
                    (snap) => {
                        pBar.style.width = `${(snap.bytesTransferred / snap.totalBytes) * 100}%`;
                    }, 
                    (err) => reject(err), 
                    async () => {
                        coverUrl = await uploadTask.snapshot.ref.getDownloadURL();
                        resolve();
                    }
                );
            });
        }

        await dbMain.collection('portfolio').add({
            title,
            category,
            description,
            coverUrl: coverUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast("Projektas publikuotas", "success");
        closeModal('modal-portfolio');
        document.getElementById('port-title').value = '';
        document.getElementById('port-desc').value = '';
        document.getElementById('port-file-input').value = '';
        
    } catch (e) {
        showToast("Klaida: " + e.message, "error");
    } finally {
        saveBtn.disabled = false;
        document.getElementById('port-progress-box').style.display = 'none';
    }
});

async function deletePortfolioItem(id) {
    if (!confirm("Ištrinti projektą?")) return;
    try {
        await dbMain.collection('portfolio').doc(id).delete();
        showToast("Projektas ištrintas", "info");
    } catch (e) {
        showToast("Klaida trinant", "error");
    }
}

async function sendTelegramMessage(text) {
    const token = state.tgToken;
    const chatId = state.tgChatId;
    
    if (!token || !chatId) {
        showToast("Nurodykite Bot Token ir Chat ID nustatymuose", "error");
        return false;
    }
    
    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });
        
        const data = await res.json();
        if (data.ok) {
            showToast("Išsiųsta į Telegram!", "success");
            return true;
        } else {
            showToast(`TG Klaida: ${data.description}`, "error");
            return false;
        }
    } catch (e) {
        showToast("Tinklo klaida", "error");
        return false;
    }
}

document.getElementById('setting-tg-token').value = state.tgToken;
document.getElementById('setting-tg-chat-id').value = state.tgChatId;

document.getElementById('btn-save-settings').addEventListener('click', () => {
    const t = document.getElementById('setting-tg-token').value.trim();
    const c = document.getElementById('setting-tg-chat-id').value.trim();
    
    state.tgToken = t;
    state.tgChatId = c;
    
    localStorage.setItem('dp_admin_tg_token', t);
    localStorage.setItem('dp_admin_tg_chat_id', c);
    
    showToast("Nustatymai išsaugoti", "success");
});

document.getElementById('btn-test-telegram').addEventListener('click', () => {
    sendTelegramMessage("⚡️ *DP ADMIN:* Testinis pranešimas sėkmingai gautas!");
});

['search-leads', 'filter-lead-lang', 'filter-lead-status'].forEach(id => {
    document.getElementById(id).addEventListener('input', renderLeads);
});

document.getElementById('search-galleries').addEventListener('input', renderGalleries);
document.getElementById('search-portfolio').addEventListener('input', renderPortfolio);
