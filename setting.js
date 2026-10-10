// --- 1. LOGIKA MODAL PROFIL (DIBUKA DARI FOTO PROFIL HEADER) ---

function toggleProfileModal(show) {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        if (show) {
            loadUserProfileData();
        }
    }
}

// Muat data profil akun ke modal header (mengikuti nama login)
function loadUserProfileData() {
    // Ambil nama dari input login yang tersimpan di localStorage
    const currentName = localStorage.getItem("wms_user_name") || "Admin Gudang";
    
    let profile = JSON.parse(localStorage.getItem('wms_user_profile')) || {
        role: "Warehouse Manager",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    };

    // Pastikan nama profil selalu sinkron dengan nama login aktif
    profile.name = currentName;

    if (document.getElementById('profileName')) document.getElementById('profileName').value = profile.name;
    if (document.getElementById('profileRole')) document.getElementById('profileRole').value = profile.role || "Warehouse Manager";
    if (document.getElementById('modalProfilePreview')) document.getElementById('modalProfilePreview').src = profile.avatar;
}

// Preview gambar yang dipilih sebelum disimpan
let tempProfileBase64 = null;
function previewProfileImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            tempProfileBase64 = e.target.result;
            document.getElementById('modalProfilePreview').src = tempProfileBase64;
        };
        reader.readAsDataURL(file);
    }
}

// Simpan profil akun ke LocalStorage
function saveUserProfile(event) {
    event.preventDefault();

    const name = document.getElementById('profileName').value.trim();
    const role = document.getElementById('profileRole').value.trim();
    
    let currentProfile = JSON.parse(localStorage.getItem('wms_user_profile')) || {
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    };

    const profile = {
        name: name,
        role: role,
        avatar: tempProfileBase64 || currentProfile.avatar
    };

    localStorage.setItem('wms_user_profile', JSON.stringify(profile));
    localStorage.setItem('wms_user_name', name); // Perbarui juga data login aktif
    
    toggleProfileModal(false);
    updateGlobalProfileUI();
    alert("Profil akun berhasil diperbarui!");
}

// Perbarui tampilan profil di header dan dashboard secara real-time
function updateGlobalProfileUI() {
    const currentName = localStorage.getItem("wms_user_name") || "Admin Gudang";
    let profile = JSON.parse(localStorage.getItem('wms_user_profile')) || {};

    // 1. Update nama di Header / Profil Modal
    const nameElements = document.querySelectorAll('.user-name-display, #headerUserName');
    nameElements.forEach(el => {
        el.innerText = currentName;
    });

    // 2. Update nama di Teks Sambutan Dashboard
    const dashboardNameEl = document.getElementById('dashboardUserName');
    if (dashboardNameEl) {
        dashboardNameEl.innerText = currentName;
    }

    // 3. Update Foto Avatar
    const headerImg = document.getElementById('headerAvatar');
    if (headerImg && profile.avatar) {
        headerImg.src = profile.avatar;
    }
}


// --- 2. LOGIKA MODAL LOGOUT ---

function toggleLogoutModal(show) {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
}

function confirmLogout() {
    // Hapus sesi login dari localStorage
    localStorage.removeItem('wms_logged_in');
    localStorage.removeItem('wms_is_logged_in');
    localStorage.removeItem('wms_user_name');

    alert("Anda telah berhasil keluar dari sistem.");
    window.location.href = 'login.html';
}


// --- 3. LOGIKA HALAMAN SETTING (DARI SIDEBAR) ---

function loadWarehouseSettings() {
    const defaultSettings = {
        name: "Warehouse Pusat Bekasi",
        code: "WH-BKS-01",
        address: "Jl. Industri Raya No. 88, Cikarang",
        manager: "Budi Santoso, S.T.",
        phone: "0812-3456-7890"
    };

    let settings = JSON.parse(localStorage.getItem('wms_settings'));
    if (!settings) {
        settings = defaultSettings;
        localStorage.setItem('wms_settings', JSON.stringify(settings));
    }

    if (document.getElementById('whName')) document.getElementById('whName').value = settings.name;
    if (document.getElementById('whCode')) document.getElementById('whCode').value = settings.code;
    if (document.getElementById('whAddress')) document.getElementById('whAddress').value = settings.address;
    if (document.getElementById('whManager')) document.getElementById('whManager').value = settings.manager;
    if (document.getElementById('whPhone')) document.getElementById('whPhone').value = settings.phone;
}

function saveWarehouseSettings(event) {
    event.preventDefault();

    const settings = {
        name: document.getElementById('whName').value.trim(),
        code: document.getElementById('whCode').value.trim(),
        address: document.getElementById('whAddress').value.trim(),
        manager: document.getElementById('whManager').value.trim(),
        phone: document.getElementById('whPhone').value.trim()
    };

    localStorage.setItem('wms_settings', JSON.stringify(settings));
    alert("Pengaturan profil gudang berhasil disimpan!");
}

function exportWMSData() {
    const wmsData = {
        profile: JSON.parse(localStorage.getItem('wms_user_profile')),
        settings: JSON.parse(localStorage.getItem('wms_settings')),
        products: JSON.parse(localStorage.getItem('wms_products')),
        locations: JSON.parse(localStorage.getItem('wms_locations')),
        inbound: JSON.parse(localStorage.getItem('wms_inbound')),
        outbound: JSON.parse(localStorage.getItem('wms_outbound')),
        so: JSON.parse(localStorage.getItem('wms_so'))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wmsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wms_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function resetWMSDatabase() {
    if (confirm("PERINGATAN: Apakah kamu yakin ingin mereset seluruh data WMS? Semua data produk, rak, transaksi, dan profil akan dikembalikan ke awal!")) {
        localStorage.clear();
        alert("Database WMS berhasil direset. Halaman akan dimuat ulang.");
        window.location.href = 'login.html';
    }
}

// Inisialisasi awal saat skrip dimuat
document.addEventListener("DOMContentLoaded", () => {
    updateGlobalProfileUI();
});

// Coba panggil juga langsung jika skrip dimuat secara dinamis via router
updateGlobalProfileUI();
loadWarehouseSettings();