// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const appMain = initializeApp(window.CONFIG.firebaseMain, "mainApp");
const dbMain = getFirestore(appMain);
const authMain = getAuth(appMain);
const storageMain = getStorage(appMain);

const appClients = initializeApp(window.CONFIG.firebaseClients, "clientApp");
const dbClients = getFirestore(appClients);
const storageClients = getStorage(appClients);

const state = {
    currentView: 'dashboard',
    tfpRequests: [],
    serviceRequests: [],
    galleries: [],
    activeProject: null,
    pendingEmailData: null,
    pendingCreateFiles: [],
    tgToken: localStorage.getItem('dp_admin_tg_token') || '',
    tgChatId: localStorage.getItem('dp_admin_tg_chat_id') || ''
};

// --- AUTHENTICATION ---
onAuthStateChanged(authMain, (user) => {
    const preloader = document.getElementById('preloader');
    if (preloader) { preloader.style.opacity = '0'; setTimeout(() => preloader.style.display = 'none', 500); }

    if (user && user.email.toLowerCase() === window.CONFIG.ADMIN_EMAIL.toLowerCase()) {
        document.getElementById('auth-overlay').style.display = 'none';
        document.getElementById('app-layout').classList.add('active');
        document.getElementById('display-admin-email').innerText = user.email;
        initDataListeners();
    } else {
        if (user) { signOut(authMain); showToast("Prieiga uždrausta.", "error"); }
        document.getElementById('auth-overlay').style.display = 'flex';
        document.getElementById('app-layout').classList.remove('active');
    }
});

document.getElementById('btn-login-auth').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    if (email.toLowerCase() !== window.CONFIG.ADMIN_EMAIL.toLowerCase()) { showToast("Prieiga uždrausta.", "error"); return; }
    try { await signInWithEmailAndPassword(authMain, email, pass); showToast("Sėkmingai prisijungta!", "success"); } 
    catch (err) { showToast("Autorizacijos klaida.", "error"); }
});

document.getElementById('btn-logout').addEventListener('click', () => { signOut(authMain).then(() => showToast("Atsijungta", "info")); });

// --- UTILS ---
window.showToast = function(msg, type = 'info') {
    const wrap = document.getElementById('toast-wrap');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check' : 'fa-triangle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}" style="margin-right: 8px;"></i> ${escapeHtml(msg)}`;
    wrap.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideToast 0.3s var(--cb) reverse forwards'; setTimeout(() => toast.remove(), 300); }, 4000);
};

function escapeHtml(str) { return str ? String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : ''; }

window.openModal = function(id) { document.getElementById(id).classList.add('active'); };
window.closeModal = function(id) { document.getElementById(id).classList.remove('active'); };

// --- NAVIGATION ---
window.switchView = function(viewName) {
    state.currentView = viewName;
    document.querySelectorAll('.menu-item').forEach(item => item.classList.toggle('active', item.getAttribute('data-view') === viewName));
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.toggle('active', sec.id === `view-${viewName}`));
    const titles = { dashboard: 'Apžvalga ir Rodikliai', requests: 'Užklausos & TFP', galleries: 'Klientų Galerijos', settings: 'Nustatymai & Telegram Bot', workspace: 'Projekto Erdvė' };
    document.getElementById('page-header-title').innerText = titles[viewName] || 'Valdymo Pultas';
    document.getElementById('sidebar').classList.remove('open');
};

document.querySelectorAll('.menu-item').forEach(item => item.addEventListener('click', () => switchView(item.getAttribute('data-view'))));
document.getElementById('btn-toggle-sidebar').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.parentElement;
        parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if(btn.dataset.reqtab) {
            document.getElementById('tfp-tab').classList.remove('active');
            document.getElementById('srv-tab').classList.remove('active');
            document.getElementById(btn.dataset.reqtab).classList.add('active');
        } else if (btn.dataset.wstab) {
            document.getElementById('wsPhotosTab').classList.remove('active');
            document.getElementById('wsStoryTab').classList.remove('active');
            document.getElementById('wsSettingsTab').classList.remove('active');
            document.getElementById(btn.dataset.wstab).classList.add('active');
        }
    });
});

// --- DATA LISTENERS ---
function initDataListeners() {
    onSnapshot(query(collection(dbMain, "tfp_requests"), orderBy("createdAt", "desc")), (snap) => {
        state.tfpRequests = []; snap.forEach(doc => state.tfpRequests.push({ id: doc.id, ...doc.data() })); renderTFP(); updateStats();
    });
    onSnapshot(query(collection(dbMain, "service_requests"), orderBy("createdAt", "desc")), (snap) => {
        state.serviceRequests = []; snap.forEach(doc => state.serviceRequests.push({ id: doc.id, ...doc.data() })); renderServices(); updateStats();
    });
    onSnapshot(query(collection(dbClients, "galleries"), orderBy("date", "desc")), (snap) => {
        state.galleries = []; snap.forEach(doc => state.galleries.push({ id: doc.id, ...doc.data() })); renderGalleries(); updateStats();
    });
}

function updateStats() {
    const tfpNew = state.tfpRequests.filter(r => r.status === 'New').length;
    const srvNew = state.serviceRequests.filter(r => r.status === 'Pending').length;
    
    document.getElementById('stat-tfp-new').innerText = tfpNew;
    document.getElementById('stat-srv-new').innerText = srvNew;
    document.getElementById('stat-gal-active').innerText = state.galleries.length;
    
    document.getElementById('badge-req-count').innerText = tfpNew + srvNew;
    document.getElementById('badge-gal-count').innerText = state.galleries.length;
}

// --- MODULE 1: REQUESTS ---
function renderTFP() {
    const list = document.getElementById('tfp-list');
    if (!state.tfpRequests.length) { list.innerHTML = '<div class="empty-placeholder">TFP užklausų nėra.</div>'; return; }
    
    list.innerHTML = state.tfpRequests.map(data => `
        <div class="request-card">
            <div class="req-header">
                <strong>${escapeHtml(data.name)} <span style="color: var(--accent-light); font-size: 0.8rem;">(${data.language.toUpperCase()})</span></strong>
                <span>Statusas: <strong style="color: var(--accent-light);">${data.status}</strong></span>
            </div>
            <div class="req-body">
                <div>
                    <p><b>El. paštas:</b><br>${escapeHtml(data.email)}</p>
                    <p><b>Instagram:</b><br>${escapeHtml(data.instagram)}</p>
                    <p><b>Idėja:</b><br>${escapeHtml(data.idea)}</p>
                </div>
                <div>
                    <p><b>Data ir laikas:</b><br>${escapeHtml(data.date_time || '-')}</p>
                    <p><b>Vieta:</b><br>${escapeHtml(data.location || '-')}</p>
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
    if (!state.serviceRequests.length) { list.innerHTML = '<div class="empty-placeholder">Paslaugų užsakymų nėra.</div>'; return; }
    
    list.innerHTML = state.serviceRequests.map(data => `
        <div class="request-card">
            <div class="req-header">
                <strong>${escapeHtml(data.clientName)} <span style="color: var(--accent-light); font-size: 0.8rem;">(${data.language.toUpperCase()})</span></strong>
                <span>Statusas: <strong style="color: var(--accent-light);">${data.status}</strong></span>
            </div>
            <div class="req-body">
                <div>
                    <p><b>Paslauga:</b><br>${escapeHtml(data.serviceName)}</p>
                    <p><b>El. paštas:</b><br>${escapeHtml(data.email)}</p>
                    <p><b>Telefonas:</b><br>${escapeHtml(data.phone)}</p>
                </div>
                <div>
                    <p><b>Kaina:</b> ${data.finalPrice} € (Avansas: ${data.depositAmount} €)</p>
                    <p><b>Data:</b><br>${escapeHtml(data.preferredDate)} ${escapeHtml(data.preferredTime)}</p>
                    <p><b>Vieta:</b><br>${escapeHtml(data.location)}</p>
                </div>
            </div>
            <div class="req-actions">
                <button class="cta-button btn-solid" onclick="openLeadModal('${data.id}', 'service_requests')"><i class="fa-solid fa-pen-to-square"></i> Atidaryti TŽ ir Valdymą</button>
                <button class="cta-button btn-danger" onclick="deleteDocRecord('service_requests', '${data.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

window.openLeadModal = function(id, collectionName) {
    const lead = collectionName === 'tfp_requests' ? state.tfpRequests.find(l => l.id === id) : state.serviceRequests.find(l => l.id === id);
    if (!lead) return;
    
    state.selectedLead = { ...lead, collectionName };

    document.getElementById('lead-modal-title').innerText = `Užklausa #${lead.id.substring(0, 6)}`;
    document.getElementById('lead-modal-name').innerText = lead.name || lead.clientName || 'Be vardo';
    document.getElementById('lead-modal-lang-badge').innerHTML = `<span class="badge badge-lt">${(lead.language || 'LT').toUpperCase()}</span>`;
    document.getElementById('lead-modal-email').innerText = lead.email || '-';
    document.getElementById('lead-modal-phone').innerText = lead.phone || lead.instagram || '-';
    document.getElementById('lead-modal-message').innerText = lead.idea || lead.additionalInformation || 'Pranešimo tekstas tuščias';
    document.getElementById('lead-modal-status-select').value = lead.status || 'New';
    
    document.getElementById('lead-modal-tz').value = lead.tz || '';
    document.getElementById('lead-modal-links').value = lead.links || '';

    renderLeadReferences(lead.references || []);
    openModal('modal-lead');
};

function renderLeadReferences(refs) {
    const grid = document.getElementById('lead-modal-refs-grid');
    grid.innerHTML = refs.map(url => `<a href="${url}" target="_blank"><img src="${url}" class="ref-thumb"></a>`).join('');
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
    } catch (e) { showToast("Klaida išsaugant", "error"); }
});

document.getElementById('btn-create-portal-from-lead').addEventListener('click', () => {
    if (!state.selectedLead) return;
    const lead = state.selectedLead;
    closeModal('modal-lead');
    
    document.getElementById('cgTitle').value = lead.name || lead.clientName || '';
    document.getElementById('cgEmail').value = lead.email || '';
    document.getElementById('cgSubtitle').value = lead.serviceName || lead.type || 'Fotosesija';
    
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    document.getElementById('cgClientId').value = `DP-${new Date().getFullYear()}-${rand}`;
    document.getElementById('cgPin').value = Math.floor(100000 + Math.random() * 900000).toString();
    
    state.pendingCreateFiles = [];
    document.getElementById('cgPreviewGrid').innerHTML = '';
    document.getElementById('cgDropLabel').innerText = "Tempkite nuotraukas čia arba spustelėkite";
    document.getElementById('cgProgress').style.display = 'none';
    
    openModal('create-gallery-modal');
});

window.deleteDocRecord = async function(collectionName, id) {
    if (confirm("Ar tikrai norite ištrinti?")) {
        try { await deleteDoc(doc(dbMain, collectionName, id)); showToast("Ištrinta", "success"); } 
        catch(e) { showToast("Klaida trinant.", "error"); }
    }
};

// --- MODULE 2: GALLERIES ---
function renderGalleries() {
    const container = document.getElementById('galleriesContainer');
    const search = document.getElementById('gallerySearchInput').value.toLowerCase();
    
    const filtered = state.galleries.filter(p => (p.title || '').toLowerCase().includes(search) || (p.clientId || '').toLowerCase().includes(search));
    
    if (!filtered.length) { container.innerHTML = '<div class="empty-placeholder">Projektų nerasta.</div>'; return; }

    container.innerHTML = filtered.map(p => {
        const cover = (p.photos && p.photos.length > 0) ? p.photos[0].thumb : '';
        const count = p.photos ? p.photos.length : 0;
        return `
            <div class="project-row" onclick="openWorkspace('${p.id}')">
                <img src="${cover}" class="project-thumb" alt="Cover">
                <div class="project-meta-main">
                    <h3>${escapeHtml(p.title || 'Be pavadinimo')}</h3>
                    <p>${escapeHtml(p.subtitle || '')}</p>
                </div>
                <div><span class="pin-tag">ID: ${escapeHtml(p.clientId || p.pin)}</span></div>
                <div class="row-text row-date">${count} kadrų</div>
                <div class="row-actions">
                    <button class="icon-btn delete-btn" onclick="event.stopPropagation(); deleteGallery('${p.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

document.getElementById('gallerySearchInput').addEventListener('input', renderGalleries);

document.getElementById('btn-open-create-gallery').addEventListener('click', () => {
    document.getElementById('cgTitle').value = ''; document.getElementById('cgSubtitle').value = ''; document.getElementById('cgEmail').value = '';
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    document.getElementById('cgClientId').value = `DP-${new Date().getFullYear()}-${rand}`;
    document.getElementById('cgPin').value = Math.floor(100000 + Math.random() * 900000).toString();
    
    state.pendingCreateFiles = [];
    document.getElementById('cgPreviewGrid').innerHTML = '';
    document.getElementById('cgDropLabel').innerText = "Tempkite nuotraukas čia arba spustelėkite";
    document.getElementById('cgProgress').style.display = 'none';
    openModal('create-gallery-modal');
});

const cgDropBox = document.getElementById('cgDropBox');
const cgFileInput = document.getElementById('cgFileInput');

cgDropBox.onclick = () => cgFileInput.click();
cgDropBox.ondragover = (e) => { e.preventDefault(); cgDropBox.classList.add('dragover'); };
cgDropBox.ondragleave = () => cgDropBox.classList.remove('dragover');
cgDropBox.ondrop = (e) => {
    e.preventDefault(); cgDropBox.classList.remove('dragover');
    handleGalleryFiles(e.dataTransfer.files);
};
cgFileInput.onchange = (e) => handleGalleryFiles(e.target.files);

function handleGalleryFiles(files) {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    state.pendingCreateFiles = validFiles;
    document.getElementById('cgDropLabel').innerText = `Pasirinkta nuotraukų: ${validFiles.length}`;
    
    const grid = document.getElementById('cgPreviewGrid');
    grid.innerHTML = '';
    validFiles.slice(0, 10).forEach(file => {
        const url = URL.createObjectURL(file);
        grid.innerHTML += `<img src="${url}" class="ref-thumb">`;
    });
    if(validFiles.length > 10) grid.innerHTML += `<span style="font-size:0.8rem; color:var(--text-muted); align-self:center;">+${validFiles.length - 10} daugiau</span>`;
}

document.getElementById('cgSubmitBtn').addEventListener('click', async () => {
    const title = document.getElementById('cgTitle').value.trim();
    const subtitle = document.getElementById('cgSubtitle').value.trim();
    const clientId = document.getElementById('cgClientId').value.trim();
    const pin = document.getElementById('cgPin').value.trim();
    const email = document.getElementById('cgEmail').value.trim();
    const date = document.getElementById('cgDate').value || new Date().toISOString().split('T')[0];

    if (!title || !pin || state.pendingCreateFiles.length === 0) { showToast("Užpildykite pavadinimą, PIN ir pridėkite nuotraukų", "error"); return; }

    const btn = document.getElementById('cgSubmitBtn'); btn.disabled = true;
    document.getElementById('cgProgress').style.display = 'block';

    const uploaded = [];
    try {
        for (let i = 0; i < state.pendingCreateFiles.length; i++) {
            const file = state.pendingCreateFiles[i];
            const storageRef = ref(storageClients, `galleries/${clientId}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snap) => {
                        const percent = ((i + (snap.bytesTransferred / snap.totalBytes)) / state.pendingCreateFiles.length) * 100;
                        document.getElementById('cgProgressThumb').style.width = `${percent}%`;
                        document.getElementById('cgProgressCaption').innerText = `Keliama: ${i + 1} iš ${state.pendingCreateFiles.length}`;
                    },
                    (err) => reject(err),
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        uploaded.push({ thumb: url, full: url, name: file.name });
                        resolve();
                    }
                );
            });
        }

        await addDoc(collection(dbClients, "galleries"), { title, subtitle, clientId, pin, client_email: email, date, description: "", photos: uploaded, createdAt: new Date().toISOString() });
        showToast("Kliento portalas sukurtas!", "success"); closeModal('create-gallery-modal');
    } catch (error) { showToast("Klaida įkeliant.", "error"); } 
    finally { btn.disabled = false; document.getElementById('cgProgress').style.display = 'none'; }
});

window.deleteGallery = async function(id) {
    if (confirm("Ištrinti projektą?")) {
        try { await deleteDoc(doc(dbClients, "galleries", id)); showToast("Ištrinta", "success"); } 
        catch(e) { showToast("Klaida trinant", "error"); }
    }
};

// --- WORKSPACE ---
window.openWorkspace = function(id) {
    const p = state.galleries.find(g => g.id === id);
    if(!p) return;
    state.activeProject = p;
    
    document.getElementById('wsGalleryTitle').innerText = p.title || 'Galerija';
    document.getElementById('wsGallerySubtitle').innerText = p.subtitle || '';
    document.getElementById('wsStoryInput').value = p.description || '';
    document.getElementById('wsSetTitle').value = p.title || '';
    document.getElementById('wsSetSubtitle').value = p.subtitle || '';
    document.getElementById('wsSetClientId').value = p.clientId || p.pin;
    document.getElementById('wsSetPin').value = p.pin || '';
    document.getElementById('wsSetDate').value = p.date || '';
    document.getElementById('wsSetEmail').value = p.client_email || '';
    document.getElementById('wsSetZip').value = p.zip_url || '';

    renderWorkspacePhotos();
    switchView('workspace');
};

document.getElementById('wsBackBtn').addEventListener('click', () => switchView('galleries'));

function renderWorkspacePhotos() {
    const grid = document.getElementById('wsPhotosGrid');
    const photos = state.activeProject.photos || [];
    document.getElementById('wsPhotosCount').innerText = photos.length;
    document.getElementById('wsPhotosBadge').innerText = photos.length;

    grid.innerHTML = photos.map((photo, idx) => `
        <div class="photo-cell">
            <img src="${photo.thumb}" loading="lazy">
            <button class="photo-cell-delete" onclick="deleteWorkspacePhoto(${idx})"><i class="fa-solid fa-xmark"></i></button>
        </div>
    `).join('');
}

window.deleteWorkspacePhoto = async function(idx) {
    if (confirm("Ištrinti nuotrauką?")) {
        state.activeProject.photos.splice(idx, 1);
        await updateDoc(doc(dbClients, "galleries", state.activeProject.id), { photos: state.activeProject.photos });
        renderWorkspacePhotos();
    }
};

document.getElementById('wsUploadMoreBtn').onclick = () => document.getElementById('wsFileInput').click();
document.getElementById('wsFileInput').onchange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    document.getElementById('wsUploadProgress').style.display = 'block';
    document.getElementById('wsUploadMoreBtn').disabled = true;

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const storageRef = ref(storageClients, `galleries/${state.activeProject.clientId || state.activeProject.pin}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snap) => {
                        const percent = ((i + (snap.bytesTransferred / snap.totalBytes)) / files.length) * 100;
                        document.getElementById('wsProgressFill').style.width = `${percent}%`;
                        document.getElementById('wsProgressText').innerText = `Keliama: ${i + 1} iš ${files.length}`;
                    },
                    (err) => reject(err),
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        if (!state.activeProject.photos) state.activeProject.photos = [];
                        state.activeProject.photos.push({ thumb: url, full: url, name: file.name });
                        resolve();
                    }
                );
            });
        }
        await updateDoc(doc(dbClients, "galleries", state.activeProject.id), { photos: state.activeProject.photos });
        document.getElementById('wsFileInput').value = '';
        renderWorkspacePhotos();
    } catch (err) { showToast("Klaida įkeliant", "error"); } 
    finally { document.getElementById('wsUploadProgress').style.display = 'none'; document.getElementById('wsUploadMoreBtn').disabled = false; }
};

document.getElementById('wsSaveStoryBtn').onclick = async () => {
    const text = document.getElementById('wsStoryInput').value;
    await updateDoc(doc(dbClients, "galleries", state.activeProject.id), { description: text });
    state.activeProject.description = text;
    showToast("Aprašymas išsaugotas!", "success");
};

document.getElementById('wsSaveSettingsBtn').onclick = async () => {
    const title = document.getElementById('wsSetTitle').value.trim();
    const subtitle = document.getElementById('wsSetSubtitle').value.trim();
    const pin = document.getElementById('wsSetPin').value.trim();
    const date = document.getElementById('wsSetDate').value;
    const client_email = document.getElementById('wsSetEmail').value.trim();
    const zip_url = document.getElementById('wsSetZip').value.trim();

    if (!title || pin.length !== 6) { showToast("Užpildykite pavadinimą ir 6 skaitmenų PIN", "error"); return; }

    await updateDoc(doc(dbClients, "galleries", state.activeProject.id), { title, subtitle, pin, date, client_email: client_email || null, zip_url: zip_url || null });
    state.activeProject.title = title; state.activeProject.subtitle = subtitle; state.activeProject.pin = pin;
    document.getElementById('wsGalleryTitle').innerText = title; document.getElementById('wsGallerySubtitle').innerText = subtitle;
    showToast("Nustatymai atnaujinti!", "success");
};

document.getElementById('wsDeleteGalleryBtn').onclick = async () => {
    if (confirm(`Ar tikrai norite ištrinti visą projektą "${state.activeProject.title}"?`)) {
        await deleteDoc(doc(dbClients, "galleries", state.activeProject.id));
        switchView('galleries');
    }
};

document.getElementById('wsShareBtn').onclick = () => {
    navigator.clipboard.writeText(`Prisijungimas: ${state.activeProject.clientId || state.activeProject.pin} | PIN: ${state.activeProject.pin} | client.dominikphotofficial.lt`);
    showToast(`Prisijungimo duomenys nukopijuoti!`, "success");
};

document.getElementById('wsPreviewBtn').onclick = () => {
    window.open(`https://client.dominikphotofficial.lt/#/gallery/${state.activeProject.clientId || state.activeProject.pin}`, '_blank');
};

document.getElementById('wsSendAccessBtn').addEventListener('click', () => {
    const p = state.activeProject;
    const emailData = window.buildEmail('PortalAccess', 'lt', { 
        name: p.title, 
        clientId: p.clientId || p.pin, 
        galleryPin: p.pin 
    });

    document.getElementById('modal-subject').value = emailData.subject;
    document.getElementById('modal-html').value = emailData.html;
    state.pendingEmailData = { collection: 'galleries', id: p.id, email: p.client_email };
    openModal('email-modal');
});

document.getElementById('modal-send-btn').addEventListener('click', async () => {
    if(!state.pendingEmailData) return;
    const btn = document.getElementById('modal-send-btn');
    btn.disabled = true; btn.innerText = 'Siunčiama...';

    try {
        const subject = document.getElementById('modal-subject').value;
        const html = document.getElementById('modal-html').value;
        const p = state.pendingEmailData;

        if(p.email) {
            await addDoc(collection(dbMain, "mail"), { to: p.email, message: { subject: subject, html: html } });
            showToast("Laiškas išsiųstas!", "success");
        } else {
            showToast("Klientas neturi el. pašto adreso.", "error");
        }
        closeModal('email-modal');
    } catch(e) { showToast("Klaida siunčiant.", "error"); } 
    finally { btn.disabled = false; btn.innerText = 'Patvirtinti ir Siųsti'; }
});

// --- TELEGRAM ---
document.getElementById('setting-tg-token').value = state.tgToken;
document.getElementById('setting-tg-chat-id').value = state.tgChatId;

document.getElementById('btn-save-settings').addEventListener('click', () => {
    const t = document.getElementById('setting-tg-token').value.trim();
    const c = document.getElementById('setting-tg-chat-id').value.trim();
    state.tgToken = t; state.tgChatId = c;
    localStorage.setItem('dp_admin_tg_token', t); localStorage.setItem('dp_admin_tg_chat_id', c);
    showToast("Nustatymai išsaugoti", "success");
});

document.getElementById('btn-test-telegram').addEventListener('click', async () => {
    if (!state.tgToken || !state.tgChatId) { showToast("Nurodykite Token ir Chat ID", "error"); return; }
    try {
        const res = await fetch(`https://api.telegram.org/bot${state.tgToken}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: state.tgChatId, text: "⚡️ *Dominikphotofficial.lt:* Testinis pranešimas sėkmingai gautas!", parse_mode: 'Markdown' }) });
        const data = await res.json();
        if (data.ok) showToast("Išsiųsta į Telegram!", "success"); else showToast(`TG Klaida: ${data.description}`, "error");
    } catch (e) { showToast("Tinklo klaida", "error"); }
});
