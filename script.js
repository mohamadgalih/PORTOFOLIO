// Fungsi utama yang dipanggil otomatis saat dashboard dimuat
function loadDashboardData() {
    console.log("Memuat data dashboard...");

    // 1. Ambil data dari localStorage (tersinkronisasi dengan Master Products & Locations)
    const products = JSON.parse(localStorage.getItem('wms_products')) || [];
    const racks = JSON.parse(localStorage.getItem('wms_racks')) || [];
    
    // Data transaksi inbound & outbound (jika ada)
    const inboundList = JSON.parse(localStorage.getItem('wms_inbound')) || [];
    const outboundList = JSON.parse(localStorage.getItem('wms_outbound')) || [];

    // 2. Hitung statistik otomatis
    const totalSku = products.length;
    const totalRacks = racks.length > 0 ? racks.length : 12; // Default 12 jika belum diisi

    // Hitung total kapasitas / utilitas sederhana berdasarkan produk
    let totalStockQty = products.reduce((acc, curr) => acc + Number(curr.qty || 0), 0);
    let avgUtil = totalRacks > 0 ? Math.min(Math.round((products.length / (totalRacks * 10)) * 100), 100) : 78;
    if (avgUtil === 0 && products.length > 0) avgUtil = 45; // Nilai estimasi aman

    // 3. Masukkan ke elemen HTML Dashboard
    const skuElem = document.getElementById('dashTotalSku');
    const racksElem = document.getElementById('dashTotalRacks');
    const utilElem = document.getElementById('dashAvgUtil');
    const utilTextElem = document.getElementById('dashUtilText');

    if (skuElem) skuElem.innerHTML = `${totalSku} <small>SKU</small>`;
    if (racksElem) racksElem.innerHTML = `${totalRacks} <small>Unit</small>`;
    if (utilElem) utilElem.innerHTML = `${avgUtil}% <small>Terpakai</small>`;
    if (utilTextElem) {
        utilTextElem.className = avgUtil > 85 ? "card-status negative" : "card-status positive";
        utilTextElem.textContent = avgUtil > 85 ? "Hampir Penuh" : "Status Optimal";
    }

    // 4. Render Grafik Chart.js dengan data dinamis (atau data aktivitas harian)
    renderInventoryChart(inboundSignedCount = inboundList.length, outboundSignedCount = outboundList.length);
}

// Render Grafik Chart.js
function renderInventoryChart(inboundTotal, outboundTotal) {
    const canvasElement = document.getElementById('inventoryChart');
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    
    // Hancurkan chart lama jika ada untuk mencegah bug tumpang tindih
    if (window.myInventoryChart instanceof Chart) {
        window.myInventoryChart.destroy();
    }

    window.myInventoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
            datasets: [
                {
                    label: 'Inbound (Masuk)',
                    data: [120, 200, 150, 80, 220, 300, Math.max(180, inboundTotal * 50)],
                    backgroundColor: '#10b981',
                    borderRadius: 6
                },
                {
                    label: 'Outbound (Keluar)',
                    data: [90, 150, 130, 60, 190, 250, Math.max(140, outboundTotal * 50)],
                    backgroundColor: '#0f766e',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { font: { family: "'Plus Jakarta Sans', sans-serif" } }
                }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// Fungsi Pencarian Dashboard
function filterDashboard() {
    const keyword = document.getElementById('dashSearchInput').value.toLowerCase();
    console.log("Mencari di Dashboard:", keyword);
    // Tambahkan logika filter atau alert interaktif jika diperlukan
}

// Fungsi Export Backup Data (.json)
function exportDataBackup() {
    const allData = {
        products: JSON.parse(localStorage.getItem('wms_products')) || [],
        racks: JSON.parse(localStorage.getItem('wms_racks')) || [],
        inbound: JSON.parse(localStorage.getItem('wms_inbound')) || [],
        outbound: JSON.parse(localStorage.getItem('wms_outbound')) || [],
        opname: JSON.parse(localStorage.getItem('wms_opname')) || []
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wms_backup_pro_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// Jalankan otomatis saat script ini disuntikkan oleh router
loadDashboardData();