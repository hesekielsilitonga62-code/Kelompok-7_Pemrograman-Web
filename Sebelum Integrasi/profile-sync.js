(function () {
  var STORAGE_KEY = 'ig_profile';

  var targets = { 'Edit profil': 'edit-profile.html', 'Lihat arsip': 'archive.html' };
  document.querySelectorAll('button').forEach(function (btn) {
    var url = targets[btn.textContent.trim()];
    if (url) btn.addEventListener('click', function () { window.location.href = url; });
  });

  var profile;
  try { profile = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { profile = null; }
  if (!profile) return;

  var photo = document.querySelector('header img[alt="Foto Profil"]');
  var username = document.querySelector('header h1');
  var name = document.querySelector('header section > p');

  if (photo && profile.photo) photo.src = profile.photo;
  if (username && profile.username) username.textContent = profile.username;
  if (name && profile.name) name.textContent = profile.name;

  if (name && profile.bio) {
    var bio = document.createElement('p');
    bio.className = 'text-sm text-neutral-700';
    bio.textContent = profile.bio;
    name.after(bio);
  }
})();