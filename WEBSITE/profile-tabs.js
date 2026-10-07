(function () {
  // Daftar gambar tiap tab. Ganti nama file di sini kalau mau pakai foto lain.
  var konten = {
    kiriman:   ['Kuliah.jpg', 'story-5.jpg', 'story-6.jpg', 'story-4.jpg', 'story-2.jpg', 'story-1.jpg'],
    tersimpan: ['story-3.jpg', 'story-1.jpg', 'story-2.jpg'],
    repost:    ['story-4.jpg', 'story-6.jpg', 'Kuliah.jpg'],
    ditandai:  ['profile.jpg', 'story-5.jpg', 'story-3.jpg']
  };

  var labelGambar = {
    kiriman: 'Kiriman',
    tersimpan: 'Tersimpan',
    repost: 'Repost',
    ditandai: 'Ditandai'
  };

  var grid = document.querySelector('section[aria-label="Grid Posting"]');
  var tabs = document.querySelectorAll('nav[aria-label="Navigasi Konten Profil"] [data-tab]');
  var jumlahKiriman = document.querySelector('header ul li strong');
  var tombolPengaturan = document.querySelector('button[aria-label="Pengaturan"]');

  function tampilkan(nama) {
    var daftar = konten[nama] || [];

    tabs.forEach(function (tab) {
      var aktif = tab.dataset.tab === nama;
      tab.classList.toggle('tab-active', aktif);
      if (aktif) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });

    if (!daftar.length) {
      grid.innerHTML = '<p class="col-span-3 py-16 text-center text-sm text-neutral-500">Belum ada ' + labelGambar[nama].toLowerCase() + '</p>';
      return;
    }

    grid.innerHTML = daftar.map(function (src, i) {
      return '<article class="group relative aspect-square w-full overflow-hidden bg-neutral-100">' +
        '<img src="' + src + '" alt="' + labelGambar[nama] + ' ' + (i + 1) + '" loading="lazy" class="h-full w-full object-cover" />' +
        '<div class="absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"></div>' +
      '</article>';
    }).join('');
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      tampilkan(tab.dataset.tab);
    });
  });

  if (jumlahKiriman) jumlahKiriman.textContent = konten.kiriman.length;

  if (tombolPengaturan) {
    tombolPengaturan.addEventListener('click', function () {
      window.location.href = 'edit-profile.html';
    });
  }

  tampilkan('kiriman');
})();
