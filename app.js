// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const appMain = initializeApp(window.CONFIG.firebaseMain, "mainApp");
const dbMain = getFirestore(appMain);
const authMain = getAuth(appMain);

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

// --- RENDER REQUESTS ---
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
                    <p><b>Data ir laikas:</b><br><input type="text" id="dt-${data.id}" value="${escapeHtml(data.date_time)}" class="form-input"></p>
                    <p><b>Vieta:</b><br><input type="text" id="loc-${data.id}" value="${escapeHtml(data.location)}" class="form-input"></p>
                    <p><b>Keisti statusą:</b><br>
                    <select id="status-${data.id}" class="form-select">
                        <option value="New" ${data.status === 'New' ? 'selected' : ''}>New (Nauja)</option>
                        <option value="Confirmed" ${data.status === 'Confirmed' ? 'selected' : ''}>Confirmed (Patvirtinta)</option>
                        <option value="Rescheduled" ${data.status === 'Rescheduled' ? 'selected' : ''}>Rescheduled (Perkelta)</option>
                        <option value="Cancelled" ${data.status === 'Cancelled' ? 'selected' : ''}>Cancelled (Atšaukta)</option>
                        <option value="Completed" ${data.status === 'Completed' ? 'selected' : ''}>Completed (Atlikta)</option>
                    </select></p>
                </div>
            </div>
            <div class="req-actions">
                <button class="cta-button btn-solid" onclick="prepareTFP('${data.id}', '${data.language}', '${data.email}', '${escapeHtml(data.name)}', '${escapeHtml(data.idea).replace(/'/g, "\\'")}')">Peržiūrėti ir Siųsti laišką</button>
                <button class="cta-button" onclick="saveOnly('tfp_requests', '${data.id}', '')">Tik Išsaugoti</button>
                <button class="cta-button btn-danger" onclick="deleteDocRecord('tfp_requests', '${data.id}')">Ištrinti</button>
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
                    <p><b>Apmokėjimas:</b><br>${escapeHtml(data.paymentMethod)}</p>
                </div>
                <div>
                    <p><b>Kaina:</b> ${data.finalPrice} € (Avansas: ${data.depositAmount} €)</p>
                    <p><b>Data:</b><br><input type="text" id="srv-dt-${data.id}" value="${escapeHtml(data.preferredDate)} ${escapeHtml(data.preferredTime)}" class="form-input"></p>
                    <p><b>Vieta:</b><br><input type="text" id="srv-loc-${data.id}" value="${escapeHtml(data.location)}" class="form-input"></p>
                    <p><b>Keisti statusą:</b><br>
                    <select id="srv-status-${data.id}" class="form-select">
                        <option value="Pending" ${data.status === 'Pending' ? 'selected' : ''}>Pending (Laukia)</option>
                        <option value="Confirmed" ${data.status === 'Confirmed' ? 'selected' : ''}>Confirmed (Patvirtinta)</option>
                        <option value="Deposit Paid" ${data.status === 'Deposit Paid' ? 'selected' : ''}>Deposit Paid (Avansas gautas)</option>
                        <option value="Completed" ${data.status === 'Completed' ? 'selected' : ''}>Completed (Atlikta)</option>
                        <option value="Fully Paid" ${data.status === 'Fully Paid' ? 'selected' : ''}>Fully Paid (Pilnai apmokėta)</option>
                        <option value="Cancelled" ${data.status === 'Cancelled' ? 'selected' : ''}>Cancelled (Atšaukta)</option>
                    </select></p>
                </div>
            </div>
            <div class="req-actions">
                <button class="cta-button btn-solid" onclick="prepareService('${data.id}', '${data.language}', '${data.email}', '${escapeHtml(data.clientName)}', '${escapeHtml(data.serviceName)}', ${data.finalPrice}, ${data.depositAmount})">Peržiūrėti ir Siųsti laišką</button>
                <button class="cta-button" onclick="saveOnly('service_requests', '${data.id}', 'srv-')">Tik Išsaugoti</button>
                <button class="cta-button btn-danger" onclick="deleteDocRecord('service_requests', '${data.id}')">Ištrinti</button>
            </div>
        </div>
    `).join('');
}

// --- EMAIL LOGIC ---
window.prepareTFP = function(id, lang, email, name, idea) {
    const newStatus = document.getElementById(`status-${id}`).value;
    const newDate = document.getElementById(`dt-${id}`).value;
    const newLoc = document.getElementById(`loc-${id}`).value;

    let templateKey = 'ServiceStatusUpdate';
    if (newStatus === 'Confirmed') templateKey = 'TFPConfirmed';
    else if (newStatus === 'Rescheduled') templateKey = 'TFPRescheduled';
    else if (newStatus === 'Cancelled') templateKey = 'TFPCancelled';
    else if (newStatus === 'Completed') templateKey = 'TFPCompleted';

    const galleryPin = Math.floor(1000 + Math.random() * 9000).toString();
    const emailData = window.buildEmail(templateKey, lang, { name, date_time: newDate, location: newLoc, idea, status: newStatus, galleryUrl: "https://clients.dominikphotofficial.lt", galleryPin });

    document.getElementById('modal-subject').value = emailData.subject;
    document.getElementById('modal-html').value = emailData.html;
    state.pendingEmailData = { collection: 'tfp_requests', id, email, newStatus, newDate, newLoc, galleryPin };
    openModal('email-modal');
};

window.prepareService = function(id, lang, email, name, serviceName, finalPrice, depositAmount) {
    const newStatus = document.getElementById(`srv-status-${id}`).value;
    const newDate = document.getElementById(`srv-dt-${id}`).value;
    const newLoc = document.getElementById(`srv-loc-${id}`).value;

    let templateKey = 'ServiceStatusUpdate';
    if (newStatus === 'Confirmed') templateKey = 'ServiceConfirmed';
    else if (newStatus === 'Deposit Paid') templateKey = 'ServiceDepositPaid';
    else if (newStatus === 'Fully Paid') templateKey = 'ServiceFullyPaid';
    else if (newStatus === 'Completed') templateKey = 'ServiceCompleted';
    else if (newStatus === 'Cancelled') templateKey = 'ServiceCancelled';

    const galleryPin = Math.floor(1000 + Math.random() * 9000).toString();
    const emailData = window.buildEmail(templateKey, lang, { name, serviceName, status: newStatus, date_time: newDate, location: newLoc, finalPrice, depositAmount, galleryUrl: "https://clients.dominikphotofficial.lt", galleryPin });

    document.getElementById('modal-subject').value = emailData.subject;
    document.getElementById('modal-html').value = emailData.html;
    state.pendingEmailData = { collection: 'service_requests', id, email, newStatus, newDate, newLoc, galleryPin };
    openModal('email-modal');
};

window.saveOnly = async function(collectionName, id, prefix) {
    const newStatus = document.getElementById(`${prefix}status-${id}`).value;
    const newDate = document.getElementById(`${prefix}dt-${id}`).value;
    const newLoc = document.getElementById(`${prefix}loc-${id}`).value;
    try {
        if(collectionName === 'tfp_requests') await updateDoc(doc(dbMain, collectionName, id), { status: newStatus, date_time: newDate, location: newLoc });
        else await updateDoc(doc(dbMain, collectionName, id), { status: newStatus, preferredDate: newDate, location: newLoc });
        showToast("Išsaugota sėkmingai!", "success");
    } catch(e) { showToast("Klaida išsaugant.", "error"); }
};

document.getElementById('modal-send-btn').addEventListener('click', async () => {
    if(!state.pendingEmailData) return;
    const btn = document.getElementById('modal-send-btn');
    btn.disabled = true; btn.innerText = 'Siunčiama...';

    try {
        const subject = document.getElementById('modal-subject').value;
        const html = document.getElementById('modal-html').value;
        const p = state.pendingEmailData;

        let updatePayload = p.collection === 'tfp_requests' ? { status: p.newStatus, date_time: p.newDate, location: p.newLoc } : { status: p.newStatus, preferredDate: p.newDate, location: p.newLoc };
        if (p.newStatus === 'Completed') updatePayload.galleryPin = p.galleryPin;

        await updateDoc(doc(dbMain, p.collection, p.id), updatePayload);
        await addDoc(collection(dbMain, "mail"), { to: p.email, message: { subject: subject, html: html } });

        showToast("Išsaugota ir laiškas išsiųstas!", "success");
        closeModal('email-modal');
    } catch(e) { showToast("Klaida siunčiant.", "error"); } 
    finally { btn.disabled = false; btn.innerText = 'Patvirtinti ir Siųsti'; }
});

window.deleteDocRecord = async function(collectionName, id) {
    if (confirm("Ar tikrai norite ištrinti?")) {
        try { await deleteDoc(doc(dbMain, collectionName, id)); showToast("Ištrinta", "success"); } 
        catch(e) { showToast("Klaida trinant.", "error"); }
    }
};

// --- GALLERIES ---
function renderGalleries() {
    const container = document.getElementById('galleriesContainer');
    const search = document.getElementById('gallerySearchInput').value.toLowerCase();
    
    const filtered = state.galleries.filter(p => (p.title || '').toLowerCase().includes(search) || (p.pin || '').includes(search));
    
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
                <div><span class="pin-tag">PIN: ${escapeHtml(p.pin)}</span></div>
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
    document.getElementById('cgTitle').value = ''; document.getElementById('cgSubtitle').value = '';
    document.getElementById('cgPin').value = Math.floor(100000 + Math.random() * 900000).toString();
    state.pendingCreateFiles = [];
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
    state.pendingCreateFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    document.getElementById('cgDropLabel').innerText = `Pasirinkta nuotraukų: ${state.pendingCreateFiles.length}`;
};
cgFileInput.onchange = (e) => {
    state.pendingCreateFiles = Array.from(e.target.files);
    document.getElementById('cgDropLabel').innerText = `Pasirinkta nuotraukų: ${state.pendingCreateFiles.length}`;
};

document.getElementById('cgSubmitBtn').addEventListener('click', async () => {
    const title = document.getElementById('cgTitle').value.trim();
    const subtitle = document.getElementById('cgSubtitle').value.trim();
    const pin = document.getElementById('cgPin').value.trim();
    const date = document.getElementById('cgDate').value || new Date().toISOString().split('T')[0];

    if (!title || !pin || state.pendingCreateFiles.length === 0) { showToast("Užpildykite pavadinimą, PIN ir pridėkite nuotraukų", "error"); return; }

    const btn = document.getElementById('cgSubmitBtn'); btn.disabled = true;
    document.getElementById('cgProgress').style.display = 'block';

    const uploaded = [];
    try {
        for (let i = 0; i < state.pendingCreateFiles.length; i++) {
            const file = state.pendingCreateFiles[i];
            const storageRef = ref(storageClients, `galleries/${pin}/${Date.now()}_${file.name}`);
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

        await addDoc(collection(dbClients, "galleries"), { title, subtitle, pin, date, description: "", photos: uploaded, createdAt: new Date().toISOString() });
        showToast("Projektas sukurtas!", "success"); closeModal('create-gallery-modal');
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
            const storageRef = ref(storageClients, `galleries/${state.activeProject.pin}/${Date.now()}_${file.name}`);
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
    navigator.clipboard.writeText(`PIN: ${state.activeProject.pin} | clients.dominikphotofficial.lt`);
    showToast(`PIN kodas (${state.activeProject.pin}) nukopijuotas!`, "success");
};

document.getElementById('wsPreviewBtn').onclick = () => {
    window.open(`https://clients.dominikphotofficial.lt/#/gallery/${state.activeProject.token || state.activeProject.pin}`, '_blank');
};

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
