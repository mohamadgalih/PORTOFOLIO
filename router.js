// --- ROUTER & PAGE LOADER SPA WMS PRO ---

// Fungsi utama saat menu sidebar diklik
function switchPage(element, event) {
    if (event) event.preventDefault();

    // 1. Atur kelas active pada menu navigasi
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');

    // 2. Gerakkan efek liquid (indikator latar belakang sidebar)
    moveNavIndicator(element);

    // 3. Ambil target file halaman & skrip modulnya dari atribut HTML
    const pageUrl = element.getAttribute('data-page');
    const scriptUrl = element.getAttribute('data-script');

    if (pageUrl) {
        loadPageContent(pageUrl, scriptUrl);
    }
}

// Fungsi untuk menggeser indikator liquid sidebar secara akurat
function moveNavIndicator(activeElement) {
    const indicator = document.getElementById('navIndicator');
    const menuContainer = document.getElementById('navMenu');

    if (indicator && menuContainer) {
        const menuRect = menuContainer.getBoundingClientRect();
        const itemRect = activeElement.getBoundingClientRect();
        
        // Hitung jarak vertikal relatif terhadap menu container
        const offsetTop = itemRect.top - menuRect.top;
        indicator.style.transform = `translateY(${offsetTop}px)`;
    }
}

// Fungsi untuk memuat konten HTML secara asinkron (AJAX / Fetch)
async function loadPageContent(pageUrl, scriptUrl) {
    const wrapper = document.getElementById('dynamic-content-wrapper');
    if (!wrapper) return;

    try {
        wrapper.innerHTML = `<div style="text-align: center; padding: 40px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 24px; color: #0f766e;"></i><p style="margin-top: 10px; font-size: 13px;">Memuat halaman...</p></div>`;

        const response = await fetch(pageUrl);
        if (!response.ok) {
            throw new Error(`Gagal memuat halaman (Status: ${response.status})`);
        }

        const htmlContent = await response.text();
        wrapper.innerHTML = htmlContent;

        // Muat dan eksekusi skrip modul terkait secara dinamis jika ada
        if (scriptUrl) {
            loadPageScript(scriptUrl);
        }

    } catch (error) {
        console.error("Error loading page:", error);
        wrapper.innerHTML = `<div style="padding: 20px; background: #fee2e2; color: #dc2626; border-radius: 8px; font-size: 13px;">Gagal memuat konten halaman. Pastikan file HTML tersedia di folder pages/!</div>`;
    }
}

// Helper untuk menyuntikkan skrip modul halaman secara dinamis agar fungsi di dalamnya aktif
function loadPageScript(scriptUrl) {
    // Hapus skrip modul halaman sebelumnya agar tidak menumpuk
    const oldScript = document.getElementById('dynamic-module-script');
    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.id = 'dynamic-module-script';
    script.onload = () => {
        // Panggil fungsi inisialisasi halaman jika ada di modul tersebut (misal: initPage)
        if (typeof window.initPage === 'function') {
            window.initPage();
        }
        
        // Perbarui UI profil (termasuk sapaan nama di dashboard) setelah halaman termuat
        if (typeof updateGlobalProfileUI === 'function') {
            updateGlobalProfileUI();
        }
    };
    document.body.appendChild(script);
}

// Inisialisasi awal saat index.html pertama kali dimuat
document.addEventListener("DOMContentLoaded", () => {
    // Cari menu yang aktif secara default (biasanya menu pertama / Dashboard)
    const defaultActiveNav = document.querySelector('.nav-item.active');
    if (defaultActiveNav) {
        moveNavIndicator(defaultActiveNav);
        const pageUrl = defaultActiveNav.getAttribute('data-page');
        const scriptUrl = defaultActiveNav.getAttribute('data-script');
        if (pageUrl) {
            loadPageContent(pageUrl, scriptUrl);
        }
    }
});