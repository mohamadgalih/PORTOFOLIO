// Function untuk Show / Hide Password
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("adminPassword");
  const toggleIcon = document.getElementById("togglePasswordBtn");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

// Function Handle Login
function handleLogin(event) {
  event.preventDefault();

  const nameInput = document.getElementById("adminName").value.trim();
  const passwordInput = document.getElementById("adminPassword").value.trim();
  const errorMessage = document.getElementById("errorMessage");

  // VALIDASI PASSWORD
  if (passwordInput === "WarungJepang02") {
    // 1. Set status sesi login
    localStorage.setItem("wms_logged_in", "true");
    localStorage.setItem("wms_is_logged_in", "true");
    localStorage.setItem("wms_user_name", nameInput);

    // 2. Ambil profil lama atau buat baru, lalu pastikan namanya diambil dari input login
    let existingProfile = JSON.parse(localStorage.getItem('wms_user_profile')) || {
      role: "Warehouse Manager",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
    };

    // Sinkronkan nama profil dengan ID/Nama yang diketik saat login
    existingProfile.name = nameInput;
    localStorage.setItem('wms_user_profile', JSON.stringify(existingProfile));

    // Redirect ke Dashboard Utama WMS Pro
    window.location.href = "index.html";
  } else {
    // Tampilkan Error jika password salah
    errorMessage.style.display = "flex";
  }
}