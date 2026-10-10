// 1. Inisialisasi data stock opname default (Memaksa memuat 20 data awal)
function getSOData() {
    let soList = JSON.parse(localStorage.getItem('wms_so'));
    
    if (!soList || soList.length < 20) {
        soList = [
            { ref: "SO-2026-001", date: "2026-03-01", sku: "BRG-BRM-001", name: "Beras Ramos 5 kg", systemQty: 150, physicalQty: 150, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-002", date: "2026-03-02", sku: "BRG-GUL-001", name: "Gula Pasir 1 kg", systemQty: 500, physicalQty: 495, variance: -5, notes: "Selisih kemasan bocor" },
            { ref: "SO-2026-003", date: "2026-03-03", sku: "BRG-MIE-001", name: "Mi Instan Goreng", systemQty: 250, physicalQty: 250, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-004", date: "2026-03-04", sku: "BRG-TGP-001", name: "Tepung Terigu 1 kg", systemQty: 300, physicalQty: 302, variance: 2, notes: "Kelebihan catat penerimaan" },
            { ref: "SO-2026-005", date: "2026-03-05", sku: "BRG-MNY-001", name: "Minyak Goreng 1 L", systemQty: 400, physicalQty: 400, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-006", date: "2026-03-06", sku: "BRG-KOP-001", name: "Kopi Bubuk 100 g", systemQty: 180, physicalQty: 178, variance: -2, notes: "Hilang saat handling" },
            { ref: "SO-2026-007", date: "2026-03-07", sku: "BRG-TEH-001", name: "Teh Celup 25 Sachet", systemQty: 220, physicalQty: 220, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-008", date: "2026-03-08", sku: "BRG-SRD-001", name: "Sarden Kaleng 155 g", systemQty: 310, physicalQty: 312, variance: 2, notes: "Koreksi opname bulanan" },
            { ref: "SO-2026-009", date: "2026-03-09", sku: "BRG-BMB-001", name: "Bumbu Nasi Goreng 20 g", systemQty: 450, physicalQty: 450, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-010", date: "2026-03-10", sku: "BRG-SAU-001", name: "Kecap Manis 600 ml", systemQty: 190, physicalQty: 185, variance: -5, notes: "Pecah di rak penyimpanan" },
            { ref: "SO-2026-011", date: "2026-03-11", sku: "BRG-SST-001", name: "Susu Kental Manis", systemQty: 275, physicalQty: 275, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-012", date: "2026-03-12", sku: "BRG-GTM-001", name: "Garem Dapur 500 g", systemQty: 340, physicalQty: 340, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-013", date: "2026-03-13", sku: "BRG-MKN-001", name: "Margarin Serbaguna", systemQty: 160, physicalQty: 158, variance: -2, notes: "Susut kemasan" },
            { ref: "SO-2026-014", date: "2026-03-14", sku: "BRG-MIA-001", name: "Mi Kuah Ayam Bawang", systemQty: 420, physicalQty: 420, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-015", date: "2026-03-15", sku: "BRG-SPS-001", name: "Saus Tomat Botol", systemQty: 210, physicalQty: 212, variance: 2, notes: "Sisa retur masuk kembali" },
            { ref: "SO-2026-016", date: "2026-03-16", sku: "BRG-MTP-001", name: "Mentega Kotak", systemQty: 130, physicalQty: 130, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-017", date: "2026-03-17", sku: "BRG-TBP-001", name: "Tepung Beras 500 g", systemQty: 290, physicalQty: 288, variance: -2, notes: "Robek tikus" },
            { ref: "SO-2026-018", date: "2026-03-18", sku: "BRG-TPT-001", name: "Tepung Tapioka 500 g", systemQty: 240, physicalQty: 240, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-019", date: "2026-03-19", sku: "BRG-KCJ-001", name: "Kacang Hijau 500 g", systemQty: 175, physicalQty: 175, variance: 0, notes: "Sesuai fisik gudang" },
            { ref: "SO-2026-020", date: "2026-03-20", sku: "BRG-KCD-001", name: "Kacang Tanah 500 g", systemQty: 195, physicalQty: 198, variance: 3, notes: "Koreksi timbangan awal" }
        ];
        localStorage.setItem('wms_so', JSON.stringify(soList));
    }
    return soList;
}

// 2. Render data stock opname ke tabel
function renderSOTable(dataToRender = null) {
    const soList = dataToRender || getSOData();
    const tbody = document.getElementById('soTableBody');
    const badgeCount = document.getElementById('soBadgeCount');

    if (!tbody) return;

    tbody.innerHTML = '';
    if (badgeCount) badgeCount.textContent = `${soList.length} Sesi`;

    if (soList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b; padding: 20px;">Belum ada riwayat stock opname.</td></tr>`;
        return;
    }

    soList.forEach((item, index) => {
        const originalIndex = getSOData().findIndex(i => i.ref === item.ref);
        
        let varianceBadge = `<span style="color: #10b981; font-weight: bold;">0 (Sesuai)</span>`;
        if (item.variance > 0) {
            varianceBadge = `<span style="color: #3b82f6; font-weight: bold;">+${item.variance} (Surplus)</span>`;
        } else if (item.variance < 0) {
            varianceBadge = `<span style="color: #ef4444; font-weight: bold;">${item.variance} (Selisih Min)</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><code>${item.ref}</code></td>
            <td>${item.date}</td>
            <td><strong>${item.sku}</strong><br><small style="color:#64748b;">${item.name}</small></td>
            <td>${item.systemQty}</td>
            <td><strong>${item.physicalQty}</strong></td>
            <td>${varianceBadge}</td>
            <td><small style="color:#475569;">${item.notes || '-'}</small></td>
            <td>
                <button class="btn-icon-delete" onclick="deleteSO(${originalIndex})" title="Hapus Sesi"><i class="fa-solid fa-trash-can" style="color: #ef4444; cursor: pointer;"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. Kontrol Modal Stock Opname
function toggleSOModal(show) {
    const modal = document.getElementById('addSOModal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        if (show) {
            const form = document.getElementById('addSOForm');
            if (form) form.reset();
            
            // Set tanggal default hari ini
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById('soDate');
            if (dateInput) dateInput.value = today;

            // Muat produk dari Master Products
            populateSOProductDropdown();
        }
    }
}

// 4. Isi dropdown produk berdasarkan data Master Products
function populateSOProductDropdown() {
    const select = document.getElementById('soProductSku');
    if (!select) return;

    const products = JSON.parse(localStorage.getItem('wms_products')) || [];
    select.innerHTML = '<option value="" disabled selected>-- Pilih Produk SKU --</option>';

    products.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.sku;
        opt.setAttribute('data-name', p.name);
        opt.setAttribute('data-qty', p.qty);
        opt.textContent = `${p.sku} - ${p.name} (Stok Sistem: ${p.qty})`;
        select.appendChild(opt);
    });
}

// 5. Update Preview Stok Sistem saat produk dipilih
function updateSystemStockPreview() {
    const select = document.getElementById('soProductSku');
    const systemQtyInput = document.getElementById('soSystemQty');
    if (!select || !systemQtyInput) return;

    const selectedOpt = select.options[select.selectedIndex];
    const qty = selectedOpt.getAttribute('data-qty') || 0;
    systemQtyInput.value = qty;
}

// 6. Simpan Sesi SO Baru & Sesuaikan Stok Master Products otomatis (masuk di urutan bawah)
function saveNewSO(event) {
    event.preventDefault();

    const customNum = document.getElementById('soRefNum').value.trim();
    const ref = `SO-2026-${customNum}`;
    const date = document.getElementById('soDate').value;
    const select = document.getElementById('soProductSku');
    const sku = select.value;
    const productName = select.options[select.selectedIndex].getAttribute('data-name');
    const systemQty = parseInt(document.getElementById('soSystemQty').value) || 0;
    const physicalQty = parseInt(document.getElementById('soPhysicalQty').value) || 0;
    const notes = document.getElementById('soNotes').value;

    const variance = physicalQty - systemQty;

    let soList = getSOData();

    // Validasi duplikat nomor SO
    const isExist = soList.some(item => item.ref === ref);
    if (isExist) {
        alert(`Nomor referensi ${ref} sudah ada! Harap gunakan nomor lain.`);
        return;
    }

    // Simpan ke riwayat stock opname di urutan bawah (.push)
    const newSO = { ref, date, sku, name: productName, systemQty, physicalQty, variance, notes };
    soList.push(newSO);
    localStorage.setItem('wms_so', JSON.stringify(soList));

    // Update otomatis stok master produk sesuai hasil opname fisik
    let products = JSON.parse(localStorage.getItem('wms_products')) || [];
    const productIndex = products.findIndex(p => p.sku === sku);
    if (productIndex !== -1) {
        products[productIndex].qty = physicalQty;
        localStorage.setItem('wms_products', JSON.stringify(products));
    }

    toggleSOModal(false);
    renderSOTable();
    alert(`Sesi Stock Opname ${ref} berhasil dicatat dan stok produk ${sku} telah disesuaikan dengan fisik!`);
}

// 7. Hapus Sesi SO
function deleteSO(index) {
    if (confirm("Apakah kamu yakin ingin menghapus sesi stock opname ini?")) {
        let soList = getSOData();
        soList.splice(index, 1);
        localStorage.setItem('wms_so', JSON.stringify(soList));
        renderSOTable();
    }
}

// 8. Fitur Pencarian Real-time di Tabel SO
function filterSO() {
    const keyword = document.getElementById('searchSOInput')?.value.toLowerCase() || "";
    const soList = getSOData();

    const filtered = soList.filter(item => 
        item.ref.toLowerCase().includes(keyword) ||
        item.sku.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.notes.toLowerCase().includes(keyword)
    );

    renderSOTable(filtered);
}

// Jalankan render tabel otomatis saat skrip dimuat
renderSOTable();