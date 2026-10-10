// 1. Inisialisasi data produk default (Paksa muat 20 produk)
function getProductsData() {
    let products = JSON.parse(localStorage.getItem('wms_products'));
    
    // Jika data kosong ATAU jumlah produk kurang dari 20 (berarti masih data lama yang 2 SKU)
    if (!products || products.length < 20) {
        products = [
            { sku: "BRG-BRM-001", name: "Beras Ramos 5 kg", category: "Beras", batch: "BRM260801", expired: "08/2027", uom: "Sak", qty: 500, rack: "WH-A | A01-R01-S01" },
            { sku: "BRG-BRM-002", name: "Beras Premium 5 kg", category: "Beras", batch: "BRM260802", expired: "08/2027", uom: "Sak", qty: 350, rack: "WH-A | A01-R01-S02" },
            { sku: "BRG-BRM-003", name: "Beras Pulen 10 kg", category: "Beras", batch: "BRM260803", expired: "09/2027", uom: "Sak", qty: 200, rack: "WH-A | A01-R02-S01" },
            { sku: "BRG-GUL-001", name: "Gula Pasir 1 kg", category: "Gula", batch: "GUL260901", expired: "09/2028", uom: "Pcs", qty: 1500, rack: "WH-A | A02-R01-S01" },
            { sku: "BRG-GUL-002", name: "Gula Pasir 5 kg", category: "Gula", batch: "GUL260902", expired: "09/2028", uom: "Pcs", qty: 600, rack: "WH-A | A02-R01-S02" },
            { sku: "BRG-TGP-001", name: "Tepung Terigu 1 kg", category: "Tepung", batch: "TGP260701", expired: "07/2027", uom: "Pcs", qty: 800, rack: "WH-A | A02-R02-S01" },
            { sku: "BRG-TGP-002", name: "Tepung Terigu 25 kg", category: "Tepung", batch: "TGP260702", expired: "07/2027", uom: "Sak", qty: 120, rack: "WH-A | A02-R02-S02" },
            { sku: "BRG-MNY-001", name: "Minyak Goreng 1 L", category: "Minyak", batch: "MNY260901", expired: "09/2028", uom: "Botol", qty: 1200, rack: "WH-A | A01-R03-S02" },
            { sku: "BRG-MNY-002", name: "Minyak Goreng 2 L", category: "Minyak", batch: "MNY260902", expired: "09/2028", uom: "Pouch", qty: 900, rack: "WH-A | A01-R03-S03" },
            { sku: "BRG-MNY-003", name: "Minyak Goreng 5 L", category: "Minyak", batch: "MNY260903", expired: "09/2028", uom: "Jerigen", qty: 300, rack: "WH-A | A01-R04-S01" },
            { sku: "BRG-MIE-001", name: "Mi Instan Goreng", category: "Mi Instan", batch: "MIE261001", expired: "10/2027", uom: "Dus", qty: 450, rack: "WH-A | B01-R01-S01" },
            { sku: "BRG-MIE-002", name: "Mi Instan Kari Ayam", category: "Mi Instan", batch: "MIE261002", expired: "10/2027", uom: "Dus", qty: 400, rack: "WH-A | B01-R01-S02" },
            { sku: "BRG-SAU-001", name: "Kecap Manis 600 ml", category: "Saus", batch: "SAU260801", expired: "08/2028", uom: "Botol", qty: 750, rack: "WH-A | B02-R01-S01" },
            { sku: "BRG-SAU-002", name: "Saus Sambal 340 ml", category: "Saus", batch: "SAU260802", expired: "08/2028", uom: "Botol", qty: 650, rack: "WH-A | B02-R01-S02" },
            { sku: "BRG-BMB-001", name: "Bumbu Nasi Goreng 20 g", category: "Bumbu", batch: "BMB260501", expired: "05/2027", uom: "Sachet", qty: 2500, rack: "WH-A | B03-R01-S01" },
            { sku: "BRG-BMB-002", name: "Bumbu Rendang 50 g", category: "Bumbu", batch: "BMB260502", expired: "05/2027", uom: "Sachet", qty: 1800, rack: "WH-A | B03-R01-S02" },
            { sku: "BRG-BMB-003", name: "Bumbu Ayam Goreng 50 g", category: "Bumbu", batch: "BMB260503", expired: "05/2027", uom: "Sachet", qty: 2000, rack: "WH-A | B03-R01-S03" },
            { sku: "BRG-KOP-001", name: "Kopi Bubuk 100 g", category: "Minuman", batch: "KOP260901", expired: "09/2028", uom: "Pcs", qty: 1100, rack: "WH-A | C01-R01-S01" },
            { sku: "BRG-TEH-001", name: "Teh Celup 25 Sachet", category: "Minuman", batch: "TEH260901", expired: "09/2028", uom: "Box", qty: 850, rack: "WH-A | C01-R01-S02" },
            { sku: "BRG-SRD-001", name: "Sarden Kaleng 155 g", category: "Makanan Kaleng", batch: "SRD260601", expired: "06/2029", uom: "Kaleng", qty: 1400, rack: "WH-A | C02-R01-S01" }
        ];
        localStorage.setItem('wms_products', JSON.stringify(products));
    }
    return products;
}

// 2. Render data produk ke dalam tabel HTML
function renderProductTable(dataToRender = null) {
    const products = dataToRender || getProductsData();
    const tbody = document.getElementById('productTableBody');
    const countBadge = document.getElementById('totalProductCount');

    if (!tbody) return;

    tbody.innerHTML = '';
    if (countBadge) countBadge.textContent = `${products.length} Produk`;

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b; padding: 20px;">Belum ada data produk.</td></tr>`;
        return;
    }

    products.forEach((p, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${p.sku}</strong></td>
            <td>${p.name}</td>
            <td><span class="badge-category">${p.category}</span></td>
            <td>${p.batch} <br><small style="color:#64748b;">Exp: ${p.expired}</small></td>
            <td>${p.uom}</td>
            <td><strong>${p.qty}</strong></td>
            <td><code>${p.rack}</code></td>
            <td>
                <button class="btn-icon-delete" onclick="deleteProduct(${index})" title="Hapus Produk"><i class="fa-solid fa-trash-can" style="color: #ef4444; cursor: pointer;"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. Kontrol Modal Tambah Produk
function toggleAddModal(show) {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        if (show) {
            const form = document.getElementById('addProductForm');
            if (form) form.reset();
            updateGeneratedSKU();
            updateGeneratedLocation();
        }
    }
}

// 4. Generator Kode SKU Otomatis
function updateGeneratedSKU() {
    const catSelect = document.getElementById('addCategorySelect');
    const skuNumInput = document.getElementById('addSkuNumber');
    const previewInput = document.getElementById('addSkuPreview');

    if (!catSelect || !previewInput) return;

    const categoryCode = catSelect.value || "BRM";
    const num = skuNumInput && skuNumInput.value.trim() ? skuNumInput.value.trim() : "004";
    previewInput.value = `BRG-${categoryCode}-${num}`;
}

// 5. Generator Lokasi Rak Otomatis
function updateGeneratedLocation() {
    const wh = document.getElementById('addWarehouseSelect')?.value || "WH-A";
    const zone = document.getElementById('addZoneSelect')?.value || "A01";
    const row = document.getElementById('addRowSelect')?.value || "R01";
    const shelf = document.getElementById('addShelfSelect')?.value || "S01";
    const preview = document.getElementById('addRackPreview');

    if (preview) {
        preview.value = `${wh} | ${zone}-${row}-${shelf}`;
    }
}

// 6. Simpan Produk Baru ke localStorage (Otomatis tersusun di bawah kategori/SKU sejenis)
function saveNewProduct(event) {
    event.preventDefault();

    const catSelect = document.getElementById('addCategorySelect');
    const selectedOption = catSelect.options[catSelect.selectedIndex];
    const categoryName = selectedOption.getAttribute('data-category') || selectedOption.text || "Umum";

    const newProduct = {
        sku: document.getElementById('addSkuPreview').value,
        name: document.getElementById('addName').value,
        category: categoryName,
        batch: document.getElementById('addBatch').value,
        expired: document.getElementById('addExpired').value,
        uom: document.getElementById('addUom').value,
        qty: parseInt(document.getElementById('addQty').value) || 0,
        rack: document.getElementById('addRackPreview').value
    };

    let products = getProductsData();

    // Cari posisi indeks produk terakhir yang memiliki kategori/awalan SKU yang sama
    let insertIndex = -1;
    for (let i = 0; i < products.length; i++) {
        // Cek jika kategori sama atau awalan SKU sama (misal sama-sama GUL)
        if (products[i].category.toLowerCase() === newProduct.category.toLowerCase() || 
            products[i].sku.substring(0, 7) === newProduct.sku.substring(0, 7)) {
            insertIndex = i; // Simpan posisi terakhir yang cocok
        }
    }

    if (insertIndex !== -1) {
        // Sisipkan tepat di bawah produk sejenis terakhir yang ditemukan
        products.splice(insertIndex + 1, 0, newProduct);
    } else {
        // Jika tidak ada kategori sejenis, masukkan di akhir tabel
        products.push(newProduct);
    }

    // Simpan kembali ke localStorage
    localStorage.setItem('wms_products', JSON.stringify(products));

    toggleAddModal(false);
    renderProductTable();
    alert(`Produk baru (${newProduct.sku}) berhasil disimpan dan diurutkan di bawah kategori sejenis!`);
}

// 7. Hapus Produk
function deleteProduct(index) {
    if (confirm("Apakah kamu yakin ingin menghapus produk ini?")) {
        let products = getProductsData();
        products.splice(index, 1);
        localStorage.setItem('wms_products', JSON.stringify(products));
        renderProductTable();
    }
}

// 8. Fitur Pencarian Real-time
function filterProducts() {
    const keyword = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const products = getProductsData();

    const filtered = products.filter(p => 
        p.sku.toLowerCase().includes(keyword) ||
        p.name.toLowerCase().includes(keyword) ||
        p.rack.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword) ||
        p.batch.toLowerCase().includes(keyword)
    );

    renderProductTable(filtered);
}

// Panggil render otomatis saat file ini dimuat
renderProductTable();