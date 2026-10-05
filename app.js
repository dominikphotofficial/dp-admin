import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
    getFirestore, collection, query, orderBy, onSnapshot, 
    doc, updateDoc, deleteDoc, addDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { 
    getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
    GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { 
    getStorage, ref, uploadBytesResumable, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const appMain = initializeApp(window.CONFIG.firebaseMain, "mainApp");
const dbMain = getFirestore(appMain);
const authMain = getAuth(appMain);
const storageMain = getStorage(appMain);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
googleProvider.setCustomParameters({ prompt: 'select_account' });

const state = {
    currentView: 'dashboard',
    currentUser: null,
    cachedGoogleToken: null,
    tfpRequests: [],
    serviceRequests: [],
    teamMembers: [],
    selectedLead: null,
    pendingEmailData: null,
    tgToken: localStorage.getItem('dp_admin_tg_token') || '',
    tgChatId: localStorage.getItem('dp_admin_tg_chat_id') || '',
    sheetId: localStorage.getItem('dp_admin_sheet_id') || ''
};

function getAuthorizedEmails() {
    const list = Array.isArray(window.CONFIG.ADMIN_EMAILS) 
        ? [...window.CONFIG.ADMIN_EMAILS] 
        : [window.CONFIG.ADMIN_EMAIL];
    state.teamMembers.forEach(m => {
        if (m.email) list.push(m.email.toLowerCase().trim());
    });
    return list.map(e => e.toLowerCase().trim());
}

async function verifyUserAuthorization(user) {
    if (!user || !user.email) return false;
    const userEmail = user.email.toLowerCase().trim();

    const staticList = (window.CONFIG.ADMIN_EMAILS || [window.CONFIG.ADMIN_EMAIL]).map(e => e.toLowerCase().trim());
    if (staticList.includes(userEmail)) {
        return true;
    }

    try {
        const snap = await getDocs(collection(dbMain, "authorized_admins"));
        let found = false;
        snap.forEach(d => {
            const data = d.data();
            if (data.email && data.email.toLowerCase().trim() === userEmail) {
                found = true;
            }
        });
        return found;
    } catch (err) {
        console.warn("Could not check Firestore authorized_admins:", err);
        return false;
    }
}

// Auth State Listener
onAuthStateChanged(authMain, async (user) => {
    const preloader = document.getElementById('preloader');
    if (preloader) { 
        preloader.style.opacity = '0'; 
        setTimeout(() => preloader.style.display = 'none', 300); 
    }

    if (user) {
        const isAuthorized = await verifyUserAuthorization(user);
        if (isAuthorized) {
            state.currentUser = user;
            localStorage.setItem('dp_admin_session_email', user.email);
            document.getElementById('auth-overlay').style.display = 'none';
            document.getElementById('app-layout').classList.add('active');
            document.getElementById('display-admin-email').innerText = user.email;
            document.getElementById('settings-current-user').innerText = user.email;
            initDataListeners();
        } else {
            await signOut(authMain);
            localStorage.removeItem('dp_admin_session_email');
            showToast(`Prieiga nesuteikta (${user.email}). Kreipkitės į administratorių.`, "error");
            document.getElementById('auth-overlay').style.display = 'flex';
            document.getElementById('app-layout').classList.remove('active');
        }
    } else {
        const savedSession = localStorage.getItem('dp_admin_session_email');
        if (savedSession && (window.CONFIG.ADMIN_EMAILS || []).includes(savedSession)) {
            state.currentUser = {
                email: savedSession,
                displayName: "Dominik Admin",
                uid: "admin_saved"
            };
            document.getElementById('auth-overlay').style.display = 'none';
            document.getElementById('app-layout').classList.add('active');
            document.getElementById('display-admin-email').innerText = savedSession;
            document.getElementById('settings-current-user').innerText = savedSession;
            initDataListeners();
        } else {
            state.currentUser = null;
            state.cachedGoogleToken = null;
            document.getElementById('auth-overlay').style.display = 'flex';
            document.getElementById('app-layout').classList.remove('active');
        }
    }
});

// Quick Admin Access
const quickBtn = document.getElementById('btn-quick-admin-login');
if (quickBtn) {
    quickBtn.addEventListener('click', () => {
        const adminEmail = "stock.dominikphotofficial.lt@gmail.com";
        state.currentUser = {
            email: adminEmail,
            displayName: "Dominik Admin",
            uid: "admin_quick_stock"
        };
        localStorage.setItem('dp_admin_session_email', adminEmail);
        document.getElementById('auth-overlay').style.display = 'none';
        document.getElementById('app-layout').classList.add('active');
        document.getElementById('display-admin-email').innerText = adminEmail;
        document.getElementById('settings-current-user').innerText = adminEmail;
        initDataListeners();
        showToast("Prisijungta kaip Dominik Admin!", "success");
    });
}

// Google Sign-In
document.getElementById('btn-login-google').addEventListener('click', async () => {
    const btn = document.getElementById('btn-login-google');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Jungiamasi...</span>`;

    try {
        const result = await signInWithPopup(authMain, googleProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential && credential.accessToken) {
            state.cachedGoogleToken = credential.accessToken;
        }
        if (result.user && result.user.email) {
            localStorage.setItem('dp_admin_session_email', result.user.email);
        }
        showToast("Sėkmingai prisijungta su Google!", "success");
    } catch (err) {
        console.error("Google login error:", err);
        if (err.code === 'auth/popup-closed-by-user') {
            showToast("Prisijungimo langas buvo uždarytas.", "info");
        } else if (err.code === 'auth/unauthorized-domain') {
            showToast("Google autorizacijos domenas: Naudokite el. paštą arba greitąjį administratoriaus įėjimą.", "error");
        } else {
            showToast("Google klaida: " + (err.message || err.code), "error");
        }
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});

// Email/Password Login
document.getElementById('btn-login-auth').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;

    if (!email) {
        showToast("Įveskite el. paštą.", "error");
        return;
    }

    const btn = document.getElementById('btn-login-auth');
    btn.disabled = true;
    btn.innerText = "Jungiamasi...";

    try { 
        const res = await signInWithEmailAndPassword(authMain, email, pass);
        if (res.user && res.user.email) {
            localStorage.setItem('dp_admin_session_email', res.user.email);
        }
        showToast("Sėkmingai prisijungta!", "success"); 
    } catch (err) { 
        console.error("Login error:", err);
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
            showToast("Neteisingas slaptažodis arba el. paštas. Spauskite 'Pamiršote slaptažodį?' atkūrimui.", "error");
        } else {
            showToast("Prisijungimo klaida: " + (err.message || err.code), "error");
        }
    } finally {
        btn.disabled = false;
        btn.innerText = "Prisijungti";
    }
});

// Password visibility toggle
document.getElementById('btn-toggle-password').addEventListener('click', () => {
    const passInput = document.getElementById('login-password');
    const icon = document.getElementById('toggle-password-icon');
    if (passInput.type === 'password') {
        passInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Password reset view toggling
document.getElementById('btn-show-forgot').addEventListener('click', () => {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('reset-password-box').style.display = 'block';
    const email = document.getElementById('login-email').value.trim();
    if (email) document.getElementById('reset-email').value = email;
});

document.getElementById('btn-back-to-login').addEventListener('click', () => {
    document.getElementById('reset-password-box').style.display = 'none';
    document.getElementById('login-box').style.display = 'block';
});

// Send password reset email
document.getElementById('btn-send-reset').addEventListener('click', async () => {
    const email = document.getElementById('reset-email').value.trim();
    if (!email) {
        showToast("Nurodykite savo el. pašto adresą.", "error");
        return;
    }

    const btn = document.getElementById('btn-send-reset');
    btn.disabled = true;
    btn.innerText = "Siunčiama...";

    try {
        await sendPasswordResetEmail(authMain, email);
        showToast("Slaptažodžio atkūrimo nuoroda išsiųsta į el. paštą!", "success");
        setTimeout(() => {
            document.getElementById('reset-password-box').style.display = 'none';
            document.getElementById('login-box').style.display = 'block';
        }, 1500);
    } catch (err) {
        console.error("Reset error:", err);
        showToast("Nepavyko išsiųsti: " + (err.message || err.code), "error");
    } finally {
        btn.disabled = false;
        btn.innerText = "Siųsti Atkūrimo Nuorodą";
    }
});

// Logout
document.getElementById('btn-logout').addEventListener('click', async () => { 
    localStorage.removeItem('dp_admin_session_email');
    state.currentUser = null;
    state.cachedGoogleToken = null;
    try { await signOut(authMain); } catch (e) {}
    document.getElementById('app-layout').classList.remove('active');
    document.getElementById('auth-overlay').style.display = 'flex';
    showToast("Sėkmingai atsijungta", "info"); 
});

// Toast system
window.showToast = function(msg, type = 'info') {
    const wrap = document.getElementById('toast-wrap');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-info');
    toast.innerHTML = `<i class="fa-solid ${icon}" style="margin-right: 8px;"></i> ${escapeHtml(msg)}`;
    wrap.appendChild(toast);
    setTimeout(() => { 
        toast.style.animation = 'slideToast 0.3s var(--cb) reverse forwards'; 
        setTimeout(() => toast.remove(), 300); 
    }, 4500);
};

function escapeHtml(str) { 
    return str ? String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : ''; 
}

window.openModal = function(id) { document.getElementById(id).classList.add('active'); };
window.closeModal = function(id) { document.getElementById(id).classList.remove('active'); };

window.switchView = function(viewName) {
    state.currentView = viewName;
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.toggle('active', sec.id === `view-${viewName}`);
    });

    const titles = { 
        dashboard: 'Apžvalga ir Rodikliai', 
        requests: 'Fotosesijų Užklausos', 
        sheets: 'Google Sheets & Eksportas',
        team: 'Komanda & Prieigos',
        settings: 'Nustatymai' 
    };
    document.getElementById('page-header-title').innerText = titles[viewName] || 'Valdymo Pultas';
    document.getElementById('sidebar').classList.remove('open');
};

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => switchView(item.getAttribute('data-view')));
});

document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// Tab switching inside Requests view
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.parentElement;
        parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (btn.dataset.reqtab) {
            document.getElementById('tfp-tab').classList.remove('active');
            document.getElementById('srv-tab').classList.remove('active');
            document.getElementById(btn.dataset.reqtab).classList.add('active');
        }
    });
});

// Real-time data listeners
function initDataListeners() {
    onSnapshot(query(collection(dbMain, "tfp_requests"), orderBy("createdAt", "desc")), (snap) => {
        state.tfpRequests = []; 
        snap.forEach(doc => state.tfpRequests.push({ id: doc.id, ...doc.data() })); 
        renderTFP(); 
        updateStats();
        renderDashboardRecent();
        renderSheetsPreview();
    });

    onSnapshot(query(collection(dbMain, "service_requests"), orderBy("createdAt", "desc")), (snap) => {
        state.serviceRequests = []; 
        snap.forEach(doc => state.serviceRequests.push({ id: doc.id, ...doc.data() })); 
        renderServices(); 
        updateStats();
        renderDashboardRecent();
        renderSheetsPreview();
    });

    onSnapshot(collection(dbMain, "authorized_admins"), (snap) => {
        state.teamMembers = [];
        snap.forEach(doc => state.teamMembers.push({ id: doc.id, ...doc.data() }));
        renderTeam();
        updateStats();
    });
}

function updateStats() {
    const tfpNew = state.tfpRequests.filter(r => (r.status || 'New').toLowerCase() === 'new').length;
    const srvNew = state.serviceRequests.filter(r => (r.status || 'Pending').toLowerCase() === 'pending' || (r.status || '').toLowerCase() === 'new').length;
    const totalReq = state.tfpRequests.length + state.serviceRequests.length;
    const totalTeam = 2 + state.teamMembers.length;

    document.getElementById('stat-tfp-new').innerText = tfpNew;
    document.getElementById('stat-srv-new').innerText = srvNew;
    document.getElementById('stat-req-total').innerText = totalReq;
    document.getElementById('stat-team-count').innerText = totalTeam;

    document.getElementById('badge-req-count').innerText = tfpNew + srvNew;
    document.getElementById('badge-team-count').innerText = totalTeam;

    document.getElementById('count-tfp-tab').innerText = state.tfpRequests.length;
    document.getElementById('count-srv-tab').innerText = state.serviceRequests.length;
}

function getStatusBadge(status) {
    const s = (status || 'New').toLowerCase().replace(/\s+/g, '_');
    return `<span class="badge-status ${s}">${escapeHtml(status || 'New')}</span>`;
}

// Filter requests
function getFilteredRequests(list, isTfp = false) {
    const search = document.getElementById('requestSearchInput').value.toLowerCase().trim();
    const statusFilter = document.getElementById('requestStatusFilter').value;

    return list.filter(item => {
        const name = (item.name || item.clientName || '').toLowerCase();
        const email = (item.email || '').toLowerCase();
        const phone = (item.phone || item.instagram || '').toLowerCase();
        const loc = (item.location || '').toLowerCase();
        const itemStatus = (item.status || (isTfp ? 'New' : 'Pending')).toLowerCase();

        const matchesSearch = !search || name.includes(search) || email.includes(search) || phone.includes(search) || loc.includes(search);
        const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });
}

document.getElementById('requestSearchInput').addEventListener('input', () => {
    renderTFP();
    renderServices();
});

document.getElementById('requestStatusFilter').addEventListener('change', () => {
    renderTFP();
    renderServices();
});

function renderTFP() {
    const list = document.getElementById('tfp-list');
    const filtered = getFilteredRequests(state.tfpRequests, true);
    if (!filtered.length) { 
        list.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-muted); background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius);">TFP užklausų nerasta.</div>'; 
        return; 
    }
    
    list.innerHTML = filtered.map(data => `
        <div class="request-card">
            <div class="req-header">
                <div>
                    <strong>${escapeHtml(data.name || 'Be vardo')}</strong>
                    <span style="color: var(--accent-light); font-size: 0.8rem; margin-left: 8px;">(${(data.language || 'LT').toUpperCase()})</span>
                </div>
                <div>${getStatusBadge(data.status)}</div>
            </div>
            <div class="req-body">
                <div>
                    <p><b>El. paštas:</b><br><a href="mailto:${escapeHtml(data.email)}" style="color: var(--accent-light);">${escapeHtml(data.email || '-')}</a></p>
                    <p><b>Instagram:</b><br>${escapeHtml(data.instagram || '-')}</p>
                    <p><b>Idėja:</b><br>${escapeHtml(data.idea || '-')}</p>
                </div>
                <div>
                    <p><b>Data ir laikas:</b><br>${escapeHtml(data.date_time || data.preferredDate || '-')}</p>
                    <p><b>Vieta:</b><br>${escapeHtml(data.location || '-')}</p>
                    <p><b>Gauta:</b><br>${data.createdAt ? new Date(data.createdAt).toLocaleDateString('lt-LT') : '-'}</p>
                </div>
            </div>
            <div class="req-actions">
                <button class="cta-button btn-solid" onclick="openLeadModal('${data.id}', 'tfp_requests')"><i class="fa-solid fa-pen-to-square"></i> Atidaryti TŽ ir Valdymą</button>
                <button class="cta-button btn-danger" onclick="deleteDocRecord('tfp_requests', '${data.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function renderServices() {
    const list = document.getElementById('srv-list');
    const filtered = getFilteredRequests(state.serviceRequests, false);
    if (!filtered.length) { 
        list.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-muted); background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius);">Mokamų paslaugų užsakymų nerasta.</div>'; 
        return; 
    }
    
    list.innerHTML = filtered.map(data => `
        <div class="request-card">
            <div class="req-header">
                <div>
                    <strong>${escapeHtml(data.clientName || 'Be vardo')}</strong>
                    <span style="color: var(--accent-light); font-size: 0.8rem; margin-left: 8px;">(${(data.language || 'LT').toUpperCase()})</span>
                </div>
                <div>${getStatusBadge(data.status || 'Pending')}</div>
            </div>
            <div class="req-body">
                <div>
                    <p><b>Paslauga:</b><br><strong>${escapeHtml(data.serviceName || 'Fotosesija')}</strong></p>
                    <p><b>El. paštas:</b><br><a href="mailto:${escapeHtml(data.email)}" style="color: var(--accent-light);">${escapeHtml(data.email || '-')}</a></p>
                    <p><b>Telefonas:</b><br>${escapeHtml(data.phone || '-')}</p>
                </div>
                <div>
                    <p><b>Kaina:</b> ${data.finalPrice || 0} € (Avansas: ${data.depositAmount || 0} €)</p>
                    <p><b>Data:</b><br>${escapeHtml(data.preferredDate || '-')} ${escapeHtml(data.preferredTime || '')}</p>
                    <p><b>Vieta:</b><br>${escapeHtml(data.location || '-')}</p>
                </div>
            </div>
            <div class="req-actions">
                <button class="cta-button btn-solid" onclick="openLeadModal('${data.id}', 'service_requests')"><i class="fa-solid fa-pen-to-square"></i> Atidaryti TŽ ir Valdymą</button>
                <button class="cta-button btn-danger" onclick="deleteDocRecord('service_requests', '${data.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function renderDashboardRecent() {
    const list = document.getElementById('dashboard-recent-list');
    const combined = [
        ...state.tfpRequests.map(r => ({ ...r, type: 'TFP', reqCollection: 'tfp_requests' })),
        ...state.serviceRequests.map(r => ({ ...r, type: 'Paslauga', reqCollection: 'service_requests' }))
    ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 6);

    if (!combined.length) {
        list.innerHTML = '<div style="color:var(--text-muted); padding:20px 0;">Naujų užklausų kol kas nėra.</div>';
        return;
    }

    list.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Tipas</th>
                    <th>Vardas</th>
                    <th>El. Paštas</th>
                    <th>Statusas</th>
                    <th style="text-align:right;">Veiksmas</th>
                </tr>
            </thead>
            <tbody>
                ${combined.map(item => `
                    <tr>
                        <td><span class="badge-status ${item.type === 'TFP' ? 'new' : 'confirmed'}">${item.type}</span></td>
                        <td><strong>${escapeHtml(item.name || item.clientName || 'Be vardo')}</strong></td>
                        <td>${escapeHtml(item.email || '-')}</td>
                        <td>${getStatusBadge(item.status)}</td>
                        <td style="text-align:right;">
                            <button class="cta-button" style="padding:6px 14px; font-size:0.75rem;" onclick="openLeadModal('${item.id}', '${item.reqCollection}')">
                                <i class="fa-solid fa-eye"></i> Peržiūra
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Lead Details Modal
window.openLeadModal = function(id, collectionName) {
    const lead = collectionName === 'tfp_requests' 
        ? state.tfpRequests.find(l => l.id === id) 
        : state.serviceRequests.find(l => l.id === id);
    if (!lead) return;
    
    state.selectedLead = { ...lead, collectionName };

    document.getElementById('lead-modal-title').innerText = `Užklausa #${lead.id.substring(0, 6)}`;
    document.getElementById('lead-modal-name').innerText = lead.name || lead.clientName || 'Be vardo';
    document.getElementById('lead-modal-lang-badge').innerHTML = `<span class="badge-status new">${(lead.language || 'LT').toUpperCase()}</span>`;
    document.getElementById('lead-modal-email').innerText = lead.email || '-';
    document.getElementById('lead-modal-phone').innerText = lead.phone || lead.instagram || '-';
    document.getElementById('lead-modal-message').innerText = lead.idea || lead.additionalInformation || 'Pranešimo tekstas tuščias';
    document.getElementById('lead-modal-status-select').value = lead.status || (collectionName === 'tfp_requests' ? 'New' : 'Pending');
    
    document.getElementById('lead-modal-tz').value = lead.tz || '';
    document.getElementById('lead-modal-links').value = lead.links || '';

    renderLeadReferences(lead.references || []);
    openModal('modal-lead');
};

function renderLeadReferences(refs) {
    const grid = document.getElementById('lead-modal-refs-grid');
    grid.innerHTML = (refs || []).map(url => `<a href="${url}" target="_blank"><img src="${url}" class="ref-thumb"></a>`).join('');
}

document.getElementById('lead-modal-refs-input').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !state.selectedLead) return;

    const lead = state.selectedLead;
    let currentRefs = lead.references || [];

    for (let file of files) {
        const storageRef = ref(storageMain, `references/${lead.id}/${Date.now()}_${file.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, file);
        const url = await getDownloadURL(uploadTask.ref);
        currentRefs.push(url);
    }

    await updateDoc(doc(dbMain, lead.collectionName, lead.id), { references: currentRefs });
    state.selectedLead.references = currentRefs;
    renderLeadReferences(currentRefs);
    showToast("Referencijos įkeltos", "success");
});

document.getElementById('btn-lead-save-status').addEventListener('click', async () => {
    if (!state.selectedLead) return;
    const lead = state.selectedLead;
    const newStatus = document.getElementById('lead-modal-status-select').value;
    const tz = document.getElementById('lead-modal-tz').value;
    const links = document.getElementById('lead-modal-links').value;

    try {
        await updateDoc(doc(dbMain, lead.collectionName, lead.id), { status: newStatus, tz, links });
        showToast("TŽ ir Būsena išsaugota", "success");
        closeModal('modal-lead');
    } catch (e) { 
        showToast("Klaida išsaugant", "error"); 
    }
});

// Trigger email modal from lead
document.getElementById('btn-lead-open-email').addEventListener('click', () => {
    if (!state.selectedLead) return;
    const lead = state.selectedLead;
    closeModal('modal-lead');

    const clientName = lead.name || lead.clientName || 'Kliente';
    const lang = (lead.language || 'lt').toLowerCase();
    const tplType = lead.collectionName === 'tfp_requests' ? 'TFPConfirmed' : 'ServiceConfirmed';

    const emailData = window.buildEmail(tplType, lang, {
        name: clientName,
        date_time: lead.date_time || lead.preferredDate || 'Derinama',
        location: lead.location || 'Vilnius',
        serviceName: lead.serviceName || 'Fotosesija',
        finalPrice: lead.finalPrice || '0',
        depositAmount: lead.depositAmount || '0'
    });

    document.getElementById('modal-email-to').value = lead.email || '';
    document.getElementById('modal-subject').value = emailData.subject;
    document.getElementById('modal-html').value = emailData.html;
    state.pendingEmailData = { email: lead.email };

    openModal('email-modal');
});

// Send Telegram lead summary
document.getElementById('btn-lead-send-tg').addEventListener('click', async () => {
    if (!state.selectedLead) return;
    if (!state.tgToken || !state.tgChatId) {
        showToast("Nustatykite Telegram Bot Token ir Chat ID skiltyje 'Nustatymai'.", "error");
        return;
    }

    const lead = state.selectedLead;
    const isTfp = lead.collectionName === 'tfp_requests';
    const text = `📸 *Užklausa iš dominikphotofficial.lt:*\n` +
        `• Tipas: ${isTfp ? 'TFP Fotosesija' : 'Mokama Paslauga (' + (lead.serviceName || '') + ')'}\n` +
        `• Vardas: ${lead.name || lead.clientName || '-'}\n` +
        `• El. paštas: ${lead.email || '-'}\n` +
        `• Tel/IG: ${lead.phone || lead.instagram || '-'}\n` +
        `• Vieta: ${lead.location || '-'}\n` +
        `• Data: ${lead.date_time || lead.preferredDate || '-'}\n` +
        `• Idėja: ${lead.idea || lead.additionalInformation || '-'}`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${state.tgToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: state.tgChatId, text: text, parse_mode: 'Markdown' })
        });
        const d = await res.json();
        if (d.ok) showToast("Išsiųsta į Telegram!", "success");
        else showToast("Telegram klaida: " + d.description, "error");
    } catch (e) {
        showToast("Tinklo klaida siunčiant į Telegram", "error");
    }
});

// Send custom email
document.getElementById('modal-send-btn').addEventListener('click', async () => {
    const toEmail = document.getElementById('modal-email-to').value.trim();
    const subject = document.getElementById('modal-subject').value;
    const html = document.getElementById('modal-html').value;

    if (!toEmail) {
        showToast("Nurodykite gavėjo el. pašto adresą.", "error");
        return;
    }

    const btn = document.getElementById('modal-send-btn');
    btn.disabled = true;
    btn.innerText = 'Siunčiama...';

    try {
        await addDoc(collection(dbMain, "mail"), { 
            to: toEmail, 
            message: { subject: subject, html: html },
            createdAt: new Date().toISOString()
        });
        showToast("Laiškas išsiųstas į eilę!", "success");
        closeModal('email-modal');
    } catch(e) { 
        console.error("Mail send error:", e);
        showToast("Klaida siunčiant laišką.", "error"); 
    } finally { 
        btn.disabled = false; 
        btn.innerText = 'Patvirtinti ir Siųsti'; 
    }
});

// Delete request
window.deleteDocRecord = async function(collectionName, id) {
    if (confirm("Ar tikrai norite ištrinti šią užklausą?")) {
        try { 
            await deleteDoc(doc(dbMain, collectionName, id)); 
            showToast("Užklausa ištrinta", "success"); 
        } catch(e) { 
            showToast("Klaida trinant užklausą.", "error"); 
        }
    }
};

// Google Sheets Table Preview & CSV Export
function getAllRequestsUnified() {
    const tfps = state.tfpRequests.map(r => ({
        type: 'TFP',
        name: r.name || 'Be vardo',
        email: r.email || '',
        contact: r.instagram || '',
        date: r.date_time || r.preferredDate || '',
        location: r.location || '',
        price: 'TFP (Nemokama)',
        status: r.status || 'New',
        message: r.idea || '',
        createdAt: r.createdAt || ''
    }));

    const srvs = state.serviceRequests.map(r => ({
        type: 'Mokama Paslauga',
        name: r.clientName || 'Be vardo',
        email: r.email || '',
        contact: r.phone || '',
        date: `${r.preferredDate || ''} ${r.preferredTime || ''}`.trim(),
        location: r.location || '',
        price: `${r.finalPrice || 0} € (Avansas: ${r.depositAmount || 0} €)`,
        status: r.status || 'Pending',
        message: r.additionalInformation || '',
        createdAt: r.createdAt || ''
    }));

    return [...tfps, ...srvs].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

function renderSheetsPreview() {
    const list = getAllRequestsUnified();
    const countEl = document.getElementById('sheets-table-count');
    const tbody = document.getElementById('sheets-preview-tbody');

    if (countEl) countEl.innerText = `${list.length} įrašų`;
    if (!tbody) return;

    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:30px;">Užklausų nėra</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(item => `
        <tr>
            <td><span class="badge-status ${item.type === 'TFP' ? 'new' : 'confirmed'}">${item.type}</span></td>
            <td><strong>${escapeHtml(item.name)}</strong></td>
            <td>${escapeHtml(item.email)}</td>
            <td>${escapeHtml(item.contact)}</td>
            <td>${escapeHtml(item.date)}</td>
            <td>${escapeHtml(item.location)}</td>
            <td>${escapeHtml(item.price)}</td>
            <td>${getStatusBadge(item.status)}</td>
        </tr>
    `).join('');
}

function exportRequestsToCSV() {
    const items = getAllRequestsUnified();
    if (!items.length) {
        showToast("Nėra jokių užklausų eksportavimui.", "info");
        return;
    }

    const headers = ["Tipas", "Vardas", "El. Paštas", "Kontaktai", "Data / Laikas", "Vieta", "Kaina / Avansas", "Statusas", "Pranešimas / Idėja", "Sukurta"];
    const rows = items.map(i => [
        i.type,
        i.name,
        i.email,
        i.contact,
        i.date,
        i.location,
        i.price,
        i.status,
        i.message.replace(/"/g, '""'),
        i.createdAt
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows]
        .map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DP_Uzklausos_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV failas sėkmingai atsisiųstas!", "success");
}

export const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets'
];

document.getElementById('btn-export-csv').addEventListener('click', exportRequestsToCSV);
document.getElementById('btn-sheets-download-csv').addEventListener('click', exportRequestsToCSV);

async function getOrRequestGoogleToken() {
    if (state.cachedGoogleToken) return state.cachedGoogleToken;

    try {
        const result = await signInWithPopup(authMain, googleProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential && credential.accessToken) {
            state.cachedGoogleToken = credential.accessToken;
            return credential.accessToken;
        }
    } catch (err) {
        console.error("Token error:", err);
        throw new Error("Nepavyko gauti Google prieigos rakto: " + (err.message || err.code));
    }
    return null;
}

document.getElementById('btn-sync-sheets').addEventListener('click', async () => {
    const btn = document.getElementById('btn-sync-sheets');
    const originalHtml = btn.innerHTML;

    try {
        const items = getAllRequestsUnified();
        if (!items.length) {
            showToast("Nėra užklausų sinchronizavimui.", "info");
            return;
        }

        const confirmed = window.confirm(
            `Ar tikrai norite sinchronizuoti ${items.length} užklausas su Google Sheets? Tai atnaujins lentelės įrašus.`
        );
        if (!confirmed) return;

        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sinchronizuojama...`;

        const token = await getOrRequestGoogleToken();
        if (!token) {
            showToast("Reikalingas prisijungimas su Google paskyra.", "error");
            return;
        }

        const headers = ["Tipas", "Vardas", "El. Paštas", "Kontaktai", "Data / Laikas", "Vieta", "Kaina / Avansas", "Statusas", "Pranešimas / Idėja", "Sukurta"];
        const rows = items.map(i => [
            i.type,
            i.name,
            i.email,
            i.contact,
            i.date,
            i.location,
            i.price,
            i.status,
            i.message,
            i.createdAt
        ]);
        const values = [headers, ...rows];

        let targetSheetId = (document.getElementById('setting-sheet-id').value.trim() || state.sheetId);
        if (targetSheetId.includes('/d/')) {
            targetSheetId = targetSheetId.split('/d/')[1].split('/')[0];
        }

        if (!targetSheetId) {
            // Create a new spreadsheet
            const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    properties: {
                        title: `DP.PORTFOLIO - Užklausos (${new Date().toLocaleDateString('lt-LT')})`
                    },
                    sheets: [
                        {
                            properties: {
                                title: 'Užklausos',
                                gridProperties: { frozenRowCount: 1 }
                            }
                        }
                    ]
                })
            });

            if (!createRes.ok) {
                const errData = await createRes.json();
                throw new Error(errData.error?.message || 'Klaida kuriant Google Sheet');
            }

            const sheetData = await createRes.json();
            targetSheetId = sheetData.spreadsheetId;
            state.sheetId = targetSheetId;
            localStorage.setItem('dp_admin_sheet_id', targetSheetId);
            document.getElementById('setting-sheet-id').value = targetSheetId;

            // Write data to the newly created sheet
            await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${targetSheetId}/values/Užklausos!A1:J${values.length}?valueInputOption=USER_ENTERED`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    range: `Užklausos!A1:J${values.length}`,
                    majorDimension: 'ROWS',
                    values: values
                })
            });

            showToast("Naujas Google Sheet sukurtas ir sinchronizuotas!", "success");
            window.open(sheetData.spreadsheetUrl, '_blank');
        } else {
            // Update existing spreadsheet
            const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${targetSheetId}/values/A1:J${values.length}?valueInputOption=USER_ENTERED`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    range: `A1:J${values.length}`,
                    majorDimension: 'ROWS',
                    values: values
                })
            });

            if (!updateRes.ok) {
                const errData = await updateRes.json();
                throw new Error(errData.error?.message || 'Klaida atnaujinant Google Sheet');
            }

            showToast("Google Sheet lentelė sėkmingai atnaujinta!", "success");
            window.open(`https://docs.google.com/spreadsheets/d/${targetSheetId}`, '_blank');
        }

    } catch (err) {
        console.error("Sheets sync error:", err);
        showToast(err.message || "Nepavyko sinchronizuoti su Google Sheets", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }
});

document.getElementById('btn-save-sheet-id').addEventListener('click', () => {
    let val = document.getElementById('setting-sheet-id').value.trim();
    if (val.includes('/d/')) {
        const parts = val.split('/d/')[1].split('/');
        val = parts[0];
    }
    state.sheetId = val;
    localStorage.setItem('dp_admin_sheet_id', val);
    showToast("Google Sheet ID išsaugotas!", "success");
});

if (state.sheetId) {
    document.getElementById('setting-sheet-id').value = state.sheetId;
}

// Team Management
function renderTeam() {
    const tbody = document.getElementById('team-table-tbody');
    if (!tbody) return;

    const staticMembers = [
        { email: "dominikphotofficial.lt@gmail.com", name: "Dominik Šuškevič", role: "Savininkas (Owner)", date: "Pagrindinis", isStatic: true },
        { email: "stock.dominikphotofficial.lt@gmail.com", name: "Dominik Admin", role: "Pagrindinis Admin", date: "Pagrindinis", isStatic: true }
    ];

    const all = [...staticMembers, ...state.teamMembers];

    tbody.innerHTML = all.map(m => `
        <tr>
            <td><strong>${escapeHtml(m.email)}</strong></td>
            <td>${escapeHtml(m.name || '-')}</td>
            <td><span class="badge-status confirmed">${escapeHtml(m.role || 'Administratorius')}</span></td>
            <td>${m.createdAt ? new Date(m.createdAt).toLocaleDateString('lt-LT') : (m.date || '-')}</td>
            <td style="text-align: right;">
                ${m.isStatic ? '<span style="color:var(--text-muted); font-size:0.8rem;">Sistemos Admin</span>' : 
                `<button class="cta-button btn-danger" style="padding:6px 12px; font-size:0.75rem;" onclick="removeTeamMember('${m.id}')"><i class="fa-solid fa-user-minus"></i> Pašalinti</button>`}
            </td>
        </tr>
    `).join('');
}

document.getElementById('btn-add-admin').addEventListener('click', async () => {
    const email = document.getElementById('team-add-email').value.trim().toLowerCase();
    const name = document.getElementById('team-add-name').value.trim();
    const role = document.getElementById('team-add-role').value;

    if (!email || !email.includes('@')) {
        showToast("Įveskite teisingą el. pašto adresą.", "error");
        return;
    }

    const btn = document.getElementById('btn-add-admin');
    btn.disabled = true;
    btn.innerText = "Pridedama...";

    try {
        await addDoc(collection(dbMain, "authorized_admins"), {
            email: email,
            name: name || "Komandos narys",
            role: role,
            createdAt: new Date().toISOString()
        });
        showToast(`Prieiga suteikta nariui ${email}!`, "success");
        document.getElementById('team-add-email').value = '';
        document.getElementById('team-add-name').value = '';
    } catch (e) {
        console.error("Add team error:", e);
        showToast("Klaida pridedant narį.", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Suteikti Prieigą`;
    }
});

window.removeTeamMember = async function(id) {
    if (confirm("Ar tikrai norite atšaukti šio nario prieigą prie admin panelės?")) {
        try {
            await deleteDoc(doc(dbMain, "authorized_admins", id));
            showToast("Prieiga atšaukta.", "success");
        } catch(e) {
            showToast("Klaida atšaukiant prieigą.", "error");
        }
    }
};

// Telegram Settings
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

document.getElementById('btn-test-telegram').addEventListener('click', async () => {
    if (!state.tgToken || !state.tgChatId) { 
        showToast("Nurodykite Token ir Chat ID", "error"); 
        return; 
    }
    try {
        const res = await fetch(`https://api.telegram.org/bot${state.tgToken}/sendMessage`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
                chat_id: state.tgChatId, 
                text: "⚡️ *DP - ADMIN:* Testinis pranešimas iš užklausų valdymo panelės sėkmingai gautas!", 
                parse_mode: 'Markdown' 
            }) 
        });
        const data = await res.json();
        if (data.ok) showToast("Išsiųsta į Telegram!", "success"); 
        else showToast(`TG Klaida: ${data.description}`, "error");
    } catch (e) { 
        showToast("Tinklo klaida", "error"); 
    }
});
