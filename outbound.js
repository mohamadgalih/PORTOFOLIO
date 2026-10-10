// 1. Inisialisasi data outbound default (Memaksa memuat 10 data jika kurang dari 10)
function getOutboundData() {
    let outbound = JSON.parse(localStorage.getItem('wms_outbound'));
    
    if (!outbound || outbound.length < 10) {
        outbound = [
            { ref: "DO-OUT-2026-001", date: "2026-03-01", destination: "Toko Sembako Maju Jaya", sku: "BRG-BRM-001", name: "Beras Ramos 5 kg", qty: 50, dispatcher: "Budi (Admin A)" },
            { ref: "DO-OUT-2026-002", date: "2026-03-02", destination: "Minimarket Berkah", sku: "BRG-GUL-001", name: "Gula Pasir 1 kg", qty: 100, dispatcher: "Siti (Admin A)" },
            { ref: "DO-OUT-2026-003", date: "2026-03-03", destination: "Warung Nasi Sedap", sku: "BRG-MIE-001", name: "Mi Instan Goreng", qty: 75, dispatcher: "Joko (Admin B)" },
            { ref: "DO-OUT-2026-004", date: "2026-03-04", destination: "Toko Kue Ibu Ani", sku: "BRG-TGP-001", name: "Tepung Terigu 1 kg", qty: 60, dispatcher: "Budi (Admin A)" },
            { ref: "DO-OUT-2026-005", date: "2026-03-05", destination: "Supermarket Sejahtera", sku: "BRG-MNY-001", name: "Minyak Goreng 1 L", qty: 120, dispatcher: "Siti (Admin A)" },
            { ref: "DO-OUT-2026-006", date: "2026-03-06", destination: "Cafe Senja", sku: "BRG-KOP-001", name: "Kopi Bubuk 100 g", qty: 40, dispatcher: "Joko (Admin B)" },
            { ref: "DO-OUT-2026-007", date: "2026-03-07", destination: "Kantin Kantor Sehat", sku: "BRG-TEH-001", name: "Teh Celup 25 Sachet", qty: 50, dispatcher: "Budi (Admin A)" },
            { ref: "DO-OUT-2026-008", date: "2026-03-08", destination: "Toko Kelontong Barokah", sku: "BRG-SRD-001", name: "Sarden Kaleng 155 g", qty: 90, dispatcher: "Siti (Admin A)" },
            { ref: "DO-OUT-2026-009", date: "2026-03-09", destination: "Warung Makan Padang", sku: "BRG-BMB-001", name: "Bumbu Nasi Goreng 20 g", qty: 150, dispatcher: "Joko (Admin B)" },
            { ref: "DO-OUT-2026-010", date: "2026-03-10", destination: "Depot Air & Sembako", sku: "BRG-SAU-001", name: "Kecap Manis 600 ml", qty: 80, dispatcher: "Budi (Admin A)" }
        ];
        localStorage.setItem('wms_outbound', JSON.stringify(outbound));
    }
    return outbound;
}

// 2. Render data outbound ke tabel
function renderOutboundTable(dataToRender = null) {
    const outboundList = dataToRender || getOutboundData();
    const tbody = document.getElementById('outboundTableBody');
    const badgeCount = document.getElementById('outboundBadgeCount');

    if (!tbody) return;

    tbody.innerHTML = '';
    if (badgeCount) badgeCount.textContent = `${outboundList.length} Transaksi`;

    if (outboundList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 20px;">Belum ada riwayat transaksi outbound.</td></tr>`;
        return;
    }

    outboundList.forEach((item, index) => {
        const originalIndex = getOutboundData().findIndex(i => i.ref === item.ref);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><code>${item.ref}</code></td>
            <td>${item.date}</td>
            <td>${item.destination}</td>
            <td><strong>${item.sku}</strong><br><small style="color:#64748b;">${item.name}</small></td>
            <td><span style="color: #ef4444; font-weight: bold;">-${item.qty}</span></td>
            <td>${item.dispatcher}</td>
            <td>
                <button class="btn-icon-delete" onclick="deleteOutbound(${originalIndex})" title="Hapus Catatan"><i class="fa-solid fa-trash-can" style="color: #ef4444; cursor: pointer;"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. Kontrol Modal Outbound
function toggleOutboundModal(show) {
    const modal = document.getElementById('addOutboundModal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        if (show) {
            const form = document.getElementById('addOutboundForm');
            if (form) form.reset();
            
            // Set tanggal default hari ini
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById('outboundDate');
            if (dateInput) dateInput.value = today;

            // Muat opsi produk dari localStorage Master Products
            populateOutboundProductDropdown();
        }
    }
}

// 4. Isi dropdown produk berdasarkan data Master Products
function populateOutboundProductDropdown() {
    const select = document.getElementById('outboundProductSku');
    if (!select) return;

    const products = JSON.parse(localStorage.getItem('wms_products')) || [];
    select.innerHTML = '<option value="" disabled selected>-- Pilih Produk SKU --</option>';

    products.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.sku;
        opt.setAttribute('data-name', p.name);
        opt.setAttribute('data-qty', p.qty);
        opt.textContent = `${p.sku} - ${p.name} (Stok Tersedia: ${p.qty})`;
        select.appendChild(opt);
    });
}

// 5. Simpan Outbound Baru & Otomatis Kurangi Stok Master Products (Masuk di urutan bawah)
function saveNewOutbound(event) {
    event.preventDefault();

    const customNum = document.getElementById('outboundRefNum').value.trim();
    const ref = `DO-OUT-2026-${customNum}`;
    const date = document.getElementById('outboundDate').value;
    const destination = document.getElementById('outboundDestination').value;
    const select = document.getElementById('outboundProductSku');
    const sku = select.value;
    const productName = select.options[select.selectedIndex].getAttribute('data-name');
    const qty = parseInt(document.getElementById('outboundQty').value) || 0;
    const dispatcher = document.getElementById('outboundDispatcher').value;

    let outboundList = getOutboundData();

    // Validasi duplikat nomor DO
    const isExist = outboundList.some(item => item.ref === ref);
    if (isExist) {
        alert(`Nomor referensi ${ref} sudah ada! Harap gunakan nomor lain.`);
        return;
    }

    // Cek ketersediaan stok di Master Products
    let products = JSON.parse(localStorage.getItem('wms_products')) || [];
    const productIndex = products.findIndex(p => p.sku === sku);

    if (productIndex === -1) {
        alert("Produk tidak ditemukan di master data!");
        return;
    }

    if (products[productIndex].qty < qty) {
        alert(`Gagal! Stok tidak mencukupi. Stok saat ini untuk ${sku} hanya tersisa ${products[productIndex].qty}.`);
        return;
    }

    // Kurangi stok produk
    products[productIndex].qty = Number(products[productIndex].qty) - qty;
    localStorage.setItem('wms_products', JSON.stringify(products));

    // Simpan ke riwayat outbound di urutan TERAKHIR (paling bawah tabel)
    const newTransaction = { ref, date, destination, sku, name: productName, qty, dispatcher };
    outboundList.push(newTransaction);
    localStorage.setItem('wms_outbound', JSON.stringify(outboundList));

    toggleOutboundModal(false);
    renderOutboundTable();
    alert(`Outbound ${ref} berhasil dicatat dan ditambahkan di urutan bawah!`);
}

// 6. Hapus Outbound
function deleteOutbound(index) {
    if (confirm("Apakah kamu yakin ingin menghapus catatan outbound ini?")) {
        let outboundList = getOutboundData();
        outboundList.splice(index, 1);
        localStorage.setItem('wms_outbound', JSON.stringify(outboundList));
        renderOutboundTable();
    }
}

// 7. Fitur Pencarian Real-time di Tabel Outbound
function filterOutbound() {
    const keyword = document.getElementById('searchOutboundInput')?.value.toLowerCase() || "";
    const outboundList = getOutboundData();

    const filtered = outboundList.filter(item => 
        item.ref.toLowerCase().includes(keyword) ||
        item.destination.toLowerCase().includes(keyword) ||
        item.sku.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.dispatcher.toLowerCase().includes(keyword)
    );

    renderOutboundTable(filtered);
}

// Jalankan render tabel otomatis saat skrip dimuat
renderOutboundTable();