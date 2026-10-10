// 1. Inisialisasi data inbound default (Memaksa memuat 10 data jika kurang dari 10)
function getInboundData() {
    let inbound = JSON.parse(localStorage.getItem('wms_inbound'));
    
    // Jika data kosong ATAU jumlahnya kurang dari 10 (artinya masih data lama)
    if (!inbound || inbound.length < 10) {
        inbound = [
            { ref: "PO-IN-2026-001", date: "2026-03-01", supplier: "PT Beras Nusantara", sku: "BRG-BRM-001", name: "Beras Ramos 5 kg", qty: 100, receiver: "Budi (Admin A)" },
            { ref: "PO-IN-2026-002", date: "2026-03-02", supplier: "CV Manis Sejahtera", sku: "BRG-GUL-001", name: "Gula Pasir 1 kg", qty: 500, receiver: "Siti (Admin A)" },
            { ref: "PO-IN-2026-003", date: "2026-03-03", supplier: "PT Indofood Makmur", sku: "BRG-MIE-001", name: "Mi Instan Goreng", qty: 250, receiver: "Joko (Admin B)" },
            { ref: "PO-IN-2026-004", date: "2026-03-04", supplier: "CV Tepung Mandiri", sku: "BRG-TGP-001", name: "Tepung Terigu 1 kg", qty: 300, receiver: "Budi (Admin A)" },
            { ref: "PO-IN-2026-005", date: "2026-03-05", supplier: "PT Wilmar Nabati", sku: "BRG-MNY-001", name: "Minyak Goreng 1 L", qty: 400, receiver: "Siti (Admin A)" },
            { ref: "PO-IN-2026-006", date: "2026-03-06", supplier: "PT Sari Kopi Indonesia", sku: "BRG-KOP-001", name: "Kopi Bubuk 100 g", qty: 150, receiver: "Joko (Admin B)" },
            { ref: "PO-IN-2026-007", date: "2026-03-07", supplier: "CV Teh Harum Melati", sku: "BRG-TEH-001", name: "Teh Celup 25 Sachet", qty: 200, receiver: "Budi (Admin A)" },
            { ref: "PO-IN-2026-008", date: "2026-03-08", supplier: "PT Sarden Nasional", sku: "BRG-SRD-001", name: "Sarden Kaleng 155 g", qty: 350, receiver: "Siti (Admin A)" },
            { ref: "PO-IN-2026-009", date: "2026-03-09", supplier: "CV Bumbu Nusantara", sku: "BRG-BMB-001", name: "Bumbu Nasi Goreng 20 g", qty: 600, receiver: "Joko (Admin B)" },
            { ref: "PO-IN-2026-010", date: "2026-03-10", supplier: "PT Kecap ABC Sejahtera", sku: "BRG-SAU-001", name: "Kecap Manis 600 ml", qty: 180, receiver: "Budi (Admin A)" }
        ];
        localStorage.setItem('wms_inbound', JSON.stringify(inbound));
    }
    return inbound;
}

// 2. Render data inbound ke tabel
function renderInboundTable() {
    const inboundList = getInboundData();
    const tbody = document.getElementById('inboundTableBody');
    const badgeCount = document.getElementById('inboundBadgeCount');

    if (!tbody) return;

    tbody.innerHTML = '';
    if (badgeCount) badgeCount.textContent = `${inboundList.length} Transaksi`;

    if (inboundList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 20px;">Belum ada riwayat transaksi inbound.</td></tr>`;
        return;
    }

    inboundList.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><code>${item.ref}</code></td>
            <td>${item.date}</td>
            <td>${item.supplier}</td>
            <td><strong>${item.sku}</strong><br><small style="color:#64748b;">${item.name}</small></td>
            <td><span style="color: #10b981; font-weight: bold;">+${item.qty}</span></td>
            <td>${item.receiver}</td>
            <td>
                <button class="btn-icon-delete" onclick="deleteInbound(${index})" title="Hapus Catatan"><i class="fa-solid fa-trash-can" style="color: #ef4444; cursor: pointer;"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. Kontrol Modal Inbound
function toggleInboundModal(show) {
    const modal = document.getElementById('addInboundModal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        if (show) {
            const form = document.getElementById('addInboundForm');
            if (form) form.reset();
            
            // Set tanggal default hari ini
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById('inboundDate');
            if (dateInput) dateInput.value = today;

            // Muat opsi produk dari localStorage Master Products
            populateProductDropdown();
        }
    }
}

// 4. Isi dropdown produk berdasarkan data Master Products
function populateProductDropdown() {
    const select = document.getElementById('inboundProductSku');
    if (!select) return;

    const products = JSON.parse(localStorage.getItem('wms_products')) || [];
    select.innerHTML = '<option value="" disabled selected>-- Pilih Produk SKU --</option>';

    products.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.sku;
        opt.setAttribute('data-name', p.name);
        opt.textContent = `${p.sku} - ${p.name} (Stok: ${p.qty})`;
        select.appendChild(opt);
    });
}

// 5. Simpan Inbound Baru & Otomatis Tambah Stok Master Products (Masuk di urutan bawah)
function saveNewInbound(event) {
    event.preventDefault();

    const customNum = document.getElementById('inboundRefNum').value.trim();
    const ref = `PO-IN-2026-${customNum}`;
    const date = document.getElementById('inboundDate').value;
    const supplier = document.getElementById('inboundSupplier').value;
    const select = document.getElementById('inboundProductSku');
    const sku = select.value;
    const productName = select.options[select.selectedIndex].getAttribute('data-name');
    const qty = parseInt(document.getElementById('inboundQty').value) || 0;
    const receiver = document.getElementById('inboundReceiver').value;

    let inboundList = getInboundData();

    // Validasi duplikat nomor PO
    const isExist = inboundList.some(item => item.ref === ref);
    if (isExist) {
        alert(`Nomor referensi ${ref} sudah ada! Harap gunakan nomor lain.`);
        return;
    }

    // Simpan ke riwayat inbound di urutan TERAKHIR (paling bawah tabel)
    const newTransaction = { ref, date, supplier, sku, name: productName, qty, receiver };
    inboundList.push(newTransaction);
    localStorage.setItem('wms_inbound', JSON.stringify(inboundList));

    // OTOMATIS TAMBAH QTY STOK DI MASTER PRODUCTS
    let products = JSON.parse(localStorage.getItem('wms_products')) || [];
    const productIndex = products.findIndex(p => p.sku === sku);
    if (productIndex !== -1) {
        products[productIndex].qty = Number(products[productIndex].qty) + qty;
        localStorage.setItem('wms_products', JSON.stringify(products));
    }

    toggleInboundModal(false);
    renderInboundTable();
    alert(`Inbound ${ref} berhasil dicatat, stok produk ${sku} bertambah, dan data ditambahkan di urutan bawah!`);
}

// 6. Hapus Inbound
function deleteInbound(index) {
    if (confirm("Apakah kamu yakin ingin menghapus catatan inbound ini?")) {
        let inboundList = getInboundData();
        inboundList.splice(index, 1);
        localStorage.setItem('wms_inbound', JSON.stringify(inboundList));
        renderInboundTable();
    }
}

// Jalankan render tabel otomatis saat skrip dimuat
renderInboundTable();

// Fitur Pencarian Real-time di Tabel Inbound
function filterInbound() {
    const keyword = document.getElementById('searchInboundInput')?.value.toLowerCase() || "";
    const inboundList = getInboundData();

    const filtered = inboundList.filter(item => 
        item.ref.toLowerCase().includes(keyword) ||
        item.supplier.toLowerCase().includes(keyword) ||
        item.sku.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.receiver.toLowerCase().includes(keyword)
    );

    const tbody = document.getElementById('inboundTableBody');
    const badgeCount = document.getElementById('inboundBadgeCount');

    if (!tbody) return;

    tbody.innerHTML = '';
    if (badgeCount) badgeCount.textContent = `${filtered.length} Transaksi`;

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 20px;">Tidak ada data inbound yang cocok.</td></tr>`;
        return;
    }

    filtered.forEach((item, index) => {
        // Cari indeks asli di data utama untuk fungsi hapus
        const originalIndex = inboundList.findIndex(i => i.ref === item.ref);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><code>${item.ref}</code></td>
            <td>${item.date}</td>
            <td>${item.supplier}</td>
            <td><strong>${item.sku}</strong><br><small style="color:#64748b;">${item.name}</small></td>
            <td><span style="color: #10b981; font-weight: bold;">+${item.qty}</span></td>
            <td>${item.receiver}</td>
            <td>
                <button class="btn-icon-delete" onclick="deleteInbound(${originalIndex})" title="Hapus Catatan"><i class="fa-solid fa-trash-can" style="color: #ef4444; cursor: pointer;"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}