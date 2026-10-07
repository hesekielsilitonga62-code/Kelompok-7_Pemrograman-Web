let highlightsData = [
  {
    name: "Me",
    cover: "profile.jpg",
    stories: [
      { type: "img", url: "profile.jpg", time: "25 ming" },
      { type: "img", url: "Kuliah.jpg", time: "24 ming" }
    ]
  },
  {
    name: "Hangout",
    cover: "hangout.jpeg",
    stories: [
      { type: "video", url: "video1.mp4", time: "20 ming" }
    ]
  }
];

let availableStoriesPool = [
  { type: "img", url: "profile.jpg" },
  { type: "img", url: "Kuliah.jpg" },
  { type: "video", url: "video1.mp4" }
];

let currentHighlightIndex = 0;
let currentStoryIndex = 0;
let timer = null;
let selectedStoriesForNew = [];
let selectedCoverIndex = 0;

function renderHighlights() {
  const container = document.getElementById('highlightsContainer');
  let html = "";

  highlightsData.forEach((hl, idx) => {
    html += `
      <article class="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer" onclick="openStoryViewer(${idx})" oncontextmenu="openHighlightMenu(event, ${idx})">
        <div class="highlight-ring">
          <img src="${hl.cover}" alt="${hl.name}" class="h-full w-full rounded-full object-cover bg-neutral-100" />
        </div>
        <span class="text-xs text-neutral-600">${hl.name}</span>
      </article>
    `;
  });

  html += `
    <article class="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0" onclick="openStep1Modal()">
      <div class="highlight-ring text-2xl text-neutral-500">+</div>
      <span class="text-xs text-neutral-600">Baru</span>
    </article>
  `;

  container.innerHTML = html;
}

function openStoryViewer(highlightIdx) {
  currentHighlightIndex = highlightIdx;
  currentStoryIndex = 0;
  document.getElementById('storyModal').classList.remove('hidden');
  buildSliderTrack();
  updateSliderPosition();
  startStoryTimer();
}

function closeStoryViewer() {
  document.getElementById('storyModal').classList.add('hidden');
  clearTimeout(timer);
  const activeVid = document.querySelector('video[autoplay]');
  if (activeVid) activeVid.pause();
}

function buildSliderTrack() {
  const track = document.getElementById('storySliderTrack');
  let trackHtml = "";

  highlightsData.forEach((hl, hIdx) => {
    let storiesHtml = "";
    hl.stories.forEach((st, sIdx) => {
      let mediaTag = st.type === 'video' 
        ? `<video src="${st.url}" class="w-full h-full object-cover" autoplay muted></video>` 
        : `<img src="${st.url}" class="w-full h-full object-cover" />`;

      let progressBars = hl.stories.map((_, pIdx) => `
        <div class="flex-1 h-full bg-white/40 rounded-full overflow-hidden">
          <div id="prog-${hIdx}-${sIdx}-${pIdx}" class="h-full bg-white w-0"></div>
        </div>
      `).join('');

      storiesHtml += `
        <div class="story-slide absolute inset-0 flex flex-col justify-between bg-black ${sIdx === 0 ? 'block' : 'hidden'}" data-h="${hIdx}" data-s="${sIdx}">
          <div class="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex flex-col gap-2">
            <div class="flex gap-1 w-full h-0.5">${progressBars}</div>
            <div class="flex items-center justify-between text-white">
              <div class="flex items-center gap-2">
                <img src="${hl.cover}" class="w-7 h-7 rounded-full object-cover border border-white/20" />
                <span class="text-xs font-semibold">Monck_n_key</span>
                <span class="text-[10px] text-neutral-400">${st.time}</span>
              </div>
              <div class="flex items-center gap-3 text-white text-sm">
                <span class="text-lg font-bold tracking-widest cursor-pointer" onclick="openStoryOptionsMenu()">&#8226;&#8226;&#8226;</span>
              </div>
            </div>
          </div>
          <div class="relative w-full h-full flex items-center justify-center">${mediaTag}</div>
        </div>
      `;
    });

    trackHtml += `
      <div class="story-item relative w-[320px] md:w-[380px] h-full flex-shrink-0 bg-black rounded-2xl overflow-hidden shadow-2xl mx-3" data-highlight-index="${hIdx}">
        ${storiesHtml}
      </div>
    `;
  });

  track.innerHTML = trackHtml;
}

function updateSliderPosition() {
  const track = document.getElementById('storySliderTrack');
  const slideWidth = window.innerWidth >= 768 ? 404 : 344;
  const offset = -currentHighlightIndex * slideWidth;
  track.style.transform = `translateX(${offset}px)`;

  const items = track.querySelectorAll('.story-item');
  items.forEach((item, idx) => {
    if (idx === currentHighlightIndex) {
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
    } else {
      item.style.opacity = '0.4';
      item.style.transform = 'scale(0.92)';
    }
  });
}

function startStoryTimer() {
  clearTimeout(timer);
  const hl = highlightsData[currentHighlightIndex];
  const st = hl.stories[currentStoryIndex];

  document.querySelectorAll('.story-slide').forEach(slide => {
    const h = parseInt(slide.getAttribute('data-h'));
    const s = parseInt(slide.getAttribute('data-s'));
    if (h === currentHighlightIndex && s === currentStoryIndex) {
      slide.classList.remove('hidden');
      const vid = slide.querySelector('video');
      if (vid) {
        vid.currentTime = 0;
        vid.play();
        vid.onended = () => nextStory();
      }
    } else {
      slide.classList.add('hidden');
      const vid = slide.querySelector('video');
      if (vid) vid.pause();
    }
  });

  hl.stories.forEach((_, pIdx) => {
    const bar = document.getElementById(`prog-${currentHighlightIndex}-${currentStoryIndex}-${pIdx}`);
    if (!bar) return;
    if (pIdx < currentStoryIndex) {
      bar.style.transition = 'none';
      bar.style.width = '100%';
    } else if (pIdx === currentStoryIndex) {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.transition = st.type === 'video' ? 'width 10s linear' : 'width 4s linear';
        bar.style.width = '100%';
      }, 50);
    } else {
      bar.style.transition = 'none';
      bar.style.width = '0%';
    }
  });

  const duration = st.type === 'video' ? 10000 : 4000;
  timer = setTimeout(() => {
    nextStory();
  }, duration);
}

function nextStory(e) {
  if (e) e.stopPropagation();
  clearTimeout(timer);
  const hl = highlightsData[currentHighlightIndex];

  if (currentStoryIndex < hl.stories.length - 1) {
    currentStoryIndex++;
    startStoryTimer();
  } else {
    if (currentHighlightIndex < highlightsData.length - 1) {
      currentHighlightIndex++;
      currentStoryIndex = 0;
      updateSliderPosition();
      startStoryTimer();
    } else {
      closeStoryViewer();
    }
  }
}

function prevStory(e) {
  if (e) e.stopPropagation();
  clearTimeout(timer);
  if (currentStoryIndex > 0) {
    currentStoryIndex--;
    startStoryTimer();
  } else {
    if (currentHighlightIndex > 0) {
      currentHighlightIndex--;
      currentStoryIndex = highlightsData[currentHighlightIndex].stories.length - 1;
      updateSliderPosition();
      startStoryTimer();
    }
  }
}

function openStoryOptionsMenu() {
  document.getElementById('storyOptionsMenu').classList.remove('hidden');
}
function closeStoryOptionsMenu() {
  document.getElementById('storyOptionsMenu').classList.add('hidden');
}

// Modal Tambah Story (+)
function openStep1Modal() {
  document.getElementById('newHighlightName').value = "";
  document.getElementById('step1Modal').classList.remove('hidden');
}
function closeAllModals() {
  document.getElementById('step1Modal').classList.add('hidden');
  document.getElementById('step2Modal').classList.add('hidden');
  document.getElementById('step3Modal').classList.add('hidden');
}
function backToStep1() {
  document.getElementById('step2Modal').classList.add('hidden');
  document.getElementById('step1Modal').classList.remove('hidden');
}
function goToStep2() {
  const name = document.getElementById('newHighlightName').value.trim();
  if (!name) { alert('Masukkan nama sorotan!'); return; }
  document.getElementById('step1Modal').classList.add('hidden');
  document.getElementById('step2Modal').classList.remove('hidden');
  
  const container = document.getElementById('storySelectionContainer');
  container.innerHTML = availableStoriesPool.map((st, idx) => {
    let previewEl = st.type === 'video' 
      ? `<video src="${st.url}" class="w-full h-full object-cover"></video>` 
      : `<img src="${st.url}" class="w-full h-full object-cover" />`;

    return `
      <div class="relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${selectedStoriesForNew.includes(idx) ? 'border-blue-500' : 'border-transparent'}" onclick="toggleSelectStory(${idx})">
        ${previewEl}
      </div>
    `;
  }).join('');
}
function toggleSelectStory(idx) {
  const pos = selectedStoriesForNew.indexOf(idx);
  if (pos > -1) selectedStoriesForNew.splice(pos, 1);
  else selectedStoriesForNew.push(idx);
  goToStep2();
}
function goToStep3() {
  if (selectedStoriesForNew.length === 0) { alert('Pilih minimal 1 cerita!'); return; }
  document.getElementById('step2Modal').classList.add('hidden');
  document.getElementById('step3Modal').classList.remove('hidden');

  selectedCoverIndex = selectedStoriesForNew[0];
  updateCoverPreview();
  
  const thumbContainer = document.getElementById('coverThumbnailContainer');
  thumbContainer.innerHTML = selectedStoriesForNew.map((stIdx) => `
    <div class="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer border-2 ${selectedCoverIndex === stIdx ? 'border-blue-500' : 'border-transparent'}" onclick="selectCover(${stIdx})">
      <img src="${availableStoriesPool[stIdx].type === 'video' ? 'profile.jpg' : availableStoriesPool[stIdx].url}" class="w-full h-full object-cover" />
    </div>
  `).join('');
}
function selectCover(stIdx) {
  selectedCoverIndex = stIdx;
  updateCoverPreview();
  goToStep3();
}
function updateCoverPreview() {
  const preview = document.getElementById('coverPreviewContainer');
  const target = availableStoriesPool[selectedCoverIndex];
  const coverUrl = target.type === 'video' ? 'profile.jpg' : target.url;
  preview.innerHTML = `<img src="${coverUrl}" class="w-full h-full object-cover" />`;
}
function saveNewOrEditedHighlight() {
  const name = document.getElementById('newHighlightName').value.trim() || "Sorotan Baru";
  const stories = selectedStoriesForNew.map(idx => availableStoriesPool[idx]);
  const targetCover = availableStoriesPool[selectedCoverIndex];
  const cover = targetCover.type === 'video' ? 'profile.jpg' : targetCover.url;

  highlightsData.push({ name, cover, stories });
  closeAllModals();
  selectedStoriesForNew = [];
  renderHighlights();
}

document.addEventListener("DOMContentLoaded", () => {
  renderHighlights();
});