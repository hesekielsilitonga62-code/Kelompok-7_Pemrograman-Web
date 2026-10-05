function filterTag(selectedBtn) {
  // Ambil semua tombol tab
  const buttons = document.querySelectorAll('.tab-btn');

  // Kembalikan tampilan seluruh tombol ke style tidak aktif
  buttons.forEach(btn => {
    btn.className = "tab-btn text-xs font-medium px-3.5 py-1.5 rounded-full border border-gray-300 bg-gray-100 text-gray-600 transition-colors";
  });

  // Berikan style aktif (hitam) pada tombol yang diklik
  selectedBtn.className = "tab-btn active text-xs font-medium px-3.5 py-1.5 rounded-full border border-black bg-black text-white transition-colors";
}