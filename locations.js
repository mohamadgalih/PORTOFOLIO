// Inisialisasi data rak default
function getLocationsData() {
    let racks = JSON.parse(localStorage.getItem('wms_racks'));
    if (!racks || racks.length === 0) {
        racks = [
            { code: "WH-A | A01", warehouse: "WH-A", zone: "A01", category: "Beras & Sembako Berat", capacity: 120, status: "Aktif" },
            { code: "WH-A | A02", warehouse: "WH-A", zone: "A02", category: "Tepung & Gula", capacity: 100, status: "Aktif" },
            { code: "WH-A | B01", warehouse: "WH-A", zone: "B01", category: "Mi Instan (Karton)", capacity: 150, status: "Aktif" },
            { code: "WH-A | B02", warehouse: "WH-A", zone: "B02", category: "Minyak & Saus (Botol)", capacity: 90, status: "Aktif" },
            { code: "WH-A | B03", warehouse: "WH-A", zone: "B03", category: "Bumbu Sachet", capacity: 200, status: "Aktif" },
            { code: "WH-A | C01", warehouse: "WH-A", zone: "C01", category: "Minuman (Kopi & Teh)", capacity: 110, status: "Aktif" },
            { code: "WH-A | C02", warehouse: "WH-A", zone: "C02", category: "Makanan Kaleng", capacity: 130, status: "Aktif" }
        ];
        localStorage.setItem('wms_racks', JSON.stringify(racks));
    }
    return racks;
}

// Render data lokasi ke tabel
function renderLocationTable() {
    const racks = getLocationsData();
    const tbody = document.getElementById('locationTableBody');
    const badgeCount = document.getElementById('rackBadgeCount');
    const totalRackCount = document.getElementById('totalRackCount');
    const totalMaxCapacity = document.getElementById('totalMaxCapacity');

    if (!tbody) return;

    tbody.innerHTML = '';
    if (badgeCount) badgeCount.textContent = `${racks.length} Lokasi`;
    if (totalRackCount) totalRackCount.innerHTML = `${racks.length} <small>Rak</small>`;

    let totalCap = racks.reduce((acc, curr) => acc + Number(curr.capacity || 0), 0);
    if (totalMaxCapacity) totalMaxCapacity.innerHTML = `${totalCap} <small>Slot</small>`;

    if (racks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 20px;">Belum ada data lokasi rak.</td></tr>`;
        return;
    }

    racks.forEach((r, index) => {
        const statusBadgeClass = r.status === 'Aktif' ? 'positive' : 'negative';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><code>${r.code}</code></td>
            <td><strong>${r.warehouse}</strong></td>
            <td>${r.zone}</td>
            <td>${r.category}</td>
            <td>${r.capacity} Slot</td>
            <td><span class="card-status ${statusBadgeClass}" style="display:inline-block; padding:2px 8px; font-size:11px;">${r.status}</span></td>
            <td>
                <button class="btn-icon-delete" onclick="deleteLocation(${index})" title="Hapus Lokasi"><i class="fa-solid fa-trash-can" style="color: #ef4444; cursor: pointer;"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Kontrol Modal Tambah Lokasi
function toggleLocationModal(show) {
    const modal = document.getElementById('addLocationModal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        if (show) {
            const form = document.getElementById('addLocationForm');
            if (form) form.reset();
        }
    }
}

// Simpan Lokasi Baru
function saveNewLocation(event) {
    event.preventDefault();

    const warehouse = document.getElementById('locWarehouse').value;
    const zone = document.getElementById('locZone').value.toUpperCase();
    const category = document.getElementById('locCategory').value;
    const capacity = parseInt(document.getElementById('locCapacity').value) || 0;
    const status = document.getElementById('locStatus').value;

    const newRack = {
        code: `${warehouse} | ${zone}`,
        warehouse,
        zone,
        category,
        capacity,
        status
    };

    let racks = getLocationsData();
    racks.push(newRack);
    localStorage.setItem('wms_racks', JSON.stringify(racks));

    toggleLocationModal(false);
    renderLocationTable();
    alert("Lokasi rak baru berhasil disimpan!");
}

// Hapus Lokasi
function deleteLocation(index) {
    if (confirm("Apakah kamu yakin ingin menghapus lokasi rak ini?")) {
        let racks = getLocationsData();
        racks.splice(index, 1);
        localStorage.setItem('wms_racks', JSON.stringify(racks));
        renderLocationTable();
    }
}

// Jalankan render otomatis saat skrip dimuat
renderLocationTable();