let highlightsData = [
  {
    title: "Me",
    stories: [ 
      { type: "img", src: "profile.jpg", time: "25 ming" },
      { type: "img", src: "Kuliah.jpg", time: "24 ming" }
    ]
  },
  {
    title: "Hangout",
    stories: [ 
      { type: "img", src: "hangout.jpeg", time: "3 minggu" },
      { type: "video", src: "video1.mp4", time: "3 hari" },
      { type: "img", src: "food.jpeg", time: "1 minggu" }
    ]
  },
  {
    title: "Daily",
    stories: [ 
      { type: "img", src: "sunset.jpeg", time: "2 minggu" },
      { type: "img", src: "liburan.jpg", time: "12 Jun" }
    ]
  }
];

let allAvailableStories = [
  { type: "img", src: "profile.jpg", time: "25 ming" },
  { type: "img", src: "Kuliah.jpg", time: "24 ming" },
  { type: "img", src: "Kuliah2.jpg", time: "20 ming" },
  { type: "img", src: "liburan.jpg", time: "12 Jun" },
  { type: "img", src: "liburan2.jpg", time: "8 Apr" },
  { type: "img", src: "sunset.jpeg", time: "2 minggu" },
  { type: "img", src: "food.jpeg", time: "1 minggu" },
  { type: "img", src: "hangout.jpeg", time: "3 minggu" },
  { type: "img", src: "story-1.jpg", time: "19 Mar" },
  { type: "img", src: "story-2.jpg", time: "14 Feb" },
  { type: "img", src: "story-3.jpg", time: "10 Jan" },
  { type: "img", src: "story-4.jpg", time: "28 Des" },
  { type: "img", src: "story-5.jpg", time: "15 Nov" },
  { type: "img", src: "story-6.jpg", time: "2 Okt" },
  { type: "video", src: "video1.mp4", time: "3 hari" },
  { type: "video", src: "video2.mp4", time: "4 hari" },
  { type: "video", src: "video3.mp4", time: "5 hari" }
];

let currentHighlightIndex = 0;
let currentStoryIndex = 0;
let targetHighlightIndexToDelete = null;
let isEditingMode = false;
let selectedStoriesForEdit = [];
let selectedCoverStory = null;
let currentActiveTab = 'dipilih';

let timer = null;
let progressInterval = null;
let progressWidth = 0;
let isPaused = false;
let isMuted = false;
let currentVolume = 1.0;
let remainingTime = 4000;
let startTime = 0;
const STORY_DURATION = 4000;

function openStep1Modal() {
  isEditingMode = false;
  document.getElementById('step1Title').innerText = "Sorotan Baru";
  document.getElementById('newHighlightName').value = '';
  selectedStoriesForEdit = [];
  
  document.getElementById('step2Modal').classList.add('hidden');
  document.getElementById('step3Modal').classList.add('hidden');
  document.getElementById('storyModal').classList.add('hidden');
  document.getElementById('step1Modal').classList.remove('hidden');
}

function openEditHighlightModal() {
  closeStoryOptionsMenu();
  closeHighlightMenu();
  closeStoryViewer();

  isEditingMode = true;
  document.getElementById('step1Title').innerText = "Edit Sorotan";
  document.getElementById('newHighlightName').value = highlightsData[currentHighlightIndex].title;
  selectedStoriesForEdit = [...highlightsData[currentHighlightIndex].stories];

  document.getElementById('step1Modal').classList.remove('hidden');
}

function goToStep2() {
  const name = document.getElementById('newHighlightName').value.trim();
  if (!name) {
    alert('Mohon masukkan nama sorotan!');
    return;
  }
  document.getElementById('step1Modal').classList.add('hidden');
  document.getElementById('step3Modal').classList.add('hidden');
  document.getElementById('step2Modal').classList.remove('hidden');

  if (isEditingMode) {
    document.getElementById('tabContainer').classList.remove('hidden');
    currentActiveTab = 'dipilih';
    switchStoryTab('dipilih');
  } else {
    document.getElementById('tabContainer').classList.add('hidden');
    renderStorySelectionGridForNew();
  }
}

function goToStep3() {
  if (selectedStoriesForEdit.length === 0) {
    alert('Mohon pilih minimal satu cerita!');
    return;
  }

  selectedCoverStory = selectedStoriesForEdit[0];
  renderCoverPreview();

  const coverThumbnailContainer = document.getElementById('coverThumbnailContainer');
  coverThumbnailContainer.innerHTML = '';
  
  selectedStoriesForEdit.forEach((story) => {
    const thumb = document.createElement('div');
    thumb.className = `w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 flex-shrink-0 transition relative ${story.src === selectedCoverStory.src ? 'border-blue-500' : 'border-transparent'}`;
    
    let mediaHtml = story.type === 'video'
      ? `<video src="${story.src}" class="w-full h-full object-cover"></video><div class="absolute inset-0 bg-black/40 flex items-center justify-center"><span class="text-[9px] text-white bg-black/60 px-1 rounded">▶ Video</span></div>`
      : `<img src="${story.src}" class="w-full h-full object-cover" />`;

    thumb.innerHTML = mediaHtml;

    thumb.onclick = () => {
      selectedCoverStory = story;
      renderCoverPreview();
      document.querySelectorAll('#coverThumbnailContainer > div').forEach(el => el.classList.remove('border-blue-500'));
      thumb.classList.add('border-blue-500');
    };

    coverThumbnailContainer.appendChild(thumb);
  });

  document.getElementById('step2Modal').classList.add('hidden');
  document.getElementById('step3Modal').classList.remove('hidden');
}

function renderCoverPreview() {
  if (!selectedCoverStory) return;
  const coverPreviewContainer = document.getElementById('coverPreviewContainer');
  if (selectedCoverStory.type === 'video') {
    coverPreviewContainer.innerHTML = `<video src="${selectedCoverStory.src}" class="w-full h-full object-cover" autoplay muted loop></video>`;
  } else {
    coverPreviewContainer.innerHTML = `<img src="${selectedCoverStory.src}" class="w-full h-full object-cover" />`;
  }
}

function backToStep1() {
  document.getElementById('step2Modal').classList.add('hidden');
  document.getElementById('step1Modal').classList.remove('hidden');
}

function closeAllModals() {
  document.getElementById('step1Modal').classList.add('hidden');
  document.getElementById('step2Modal').classList.add('hidden');
  document.getElementById('step3Modal').classList.add('hidden');
  document.getElementById('storyModal').classList.add('hidden');
  document.getElementById('storyOptionsMenu').classList.add('hidden');
}

function switchStoryTab(tabName) {
  currentActiveTab = tabName;
  const tabDipilih = document.getElementById('tabDipilih');
  const tabCerita = document.getElementById('tabCerita');

  if (tabName === 'dipilih') {
    tabDipilih.className = "py-3 border-b-2 border-white text-white";
    tabCerita.className = "py-3 border-b-2 border-transparent text-neutral-400 hover:text-white";
  } else {
    tabCerita.className = "py-3 border-b-2 border-white text-white";
    tabDipilih.className = "py-3 border-b-2 border-transparent text-neutral-400 hover:text-white";
  }
  renderStorySelectionGrid();
}

function renderStorySelectionGridForNew() {
  const container = document.getElementById('storySelectionContainer');
  container.innerHTML = '';

  allAvailableStories.forEach((story) => {
    const isSelected = selectedStoriesForEdit.some(s => s.src === story.src);
    const itemDiv = document.createElement('div');
    itemDiv.className = `relative aspect-[3/4] bg-neutral-800 rounded-xl overflow-hidden cursor-pointer group border-2 transition ${isSelected ? 'border-blue-500' : 'border-transparent'}`;
    
    let mediaPreviewHTML = story.type === 'video' 
      ? `<video src="${story.src}" class="w-full h-full object-cover"></video><div class="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"><span class="text-white text-xs bg-black/60 px-2 py-0.5 rounded">▶ Video</span></div>`
      : `<img src="${story.src}" class="w-full h-full object-cover" />`;

    itemDiv.innerHTML = `
      ${mediaPreviewHTML}
      <div class="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-md text-[10px] font-medium text-white backdrop-blur-sm pointer-events-none">${story.time}</div>
      <div class="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${isSelected ? 'bg-blue-500' : 'bg-black/30'} flex items-center justify-center text-white text-xs pointer-events-none">${isSelected ? '✓' : ''}</div>
    `;

    itemDiv.onclick = () => {
      const idx = selectedStoriesForEdit.findIndex(s => s.src === story.src);
      if (idx > -1) {
        selectedStoriesForEdit.splice(idx, 1);
      } else {
        selectedStoriesForEdit.push(story);
      }
      renderStorySelectionGridForNew();
    };

    container.appendChild(itemDiv);
  });
}

function renderStorySelectionGrid() {
  const container = document.getElementById('storySelectionContainer');
  container.innerHTML = '';

  let listToDisplay = currentActiveTab === 'dipilih' ? selectedStoriesForEdit : allAvailableStories;

  if (listToDisplay.length === 0) {
    container.innerHTML = `<p class="col-span-3 text-center text-neutral-500 text-sm py-10">Belum ada cerita</p>`;
    return;
  }

  listToDisplay.forEach((story) => {
    const isSelected = selectedStoriesForEdit.some(s => s.src === story.src);
    const itemDiv = document.createElement('div');
    itemDiv.className = `relative aspect-[3/4] bg-neutral-800 rounded-xl overflow-hidden cursor-pointer group border-2 transition ${isSelected ? 'border-blue-500' : 'border-transparent'}`;
    
    let mediaPreviewHTML = story.type === 'video' 
      ? `<video src="${story.src}" class="w-full h-full object-cover"></video><div class="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"><span class="text-white text-xs bg-black/60 px-2 py-0.5 rounded">▶ Video</span></div>`
      : `<img src="${story.src}" class="w-full h-full object-cover" />`;

    itemDiv.innerHTML = `
      ${mediaPreviewHTML}
      <div class="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-md text-[10px] font-medium text-white backdrop-blur-sm pointer-events-none">${story.time}</div>
      <div class="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${isSelected ? 'bg-blue-500' : 'bg-black/30'} flex items-center justify-center text-white text-xs pointer-events-none">${isSelected ? '✓' : ''}</div>
    `;

    itemDiv.onclick = () => {
      const idx = selectedStoriesForEdit.findIndex(s => s.src === story.src);
      if (idx > -1) {
        selectedStoriesForEdit.splice(idx, 1);
      } else {
        selectedStoriesForEdit.push(story);
      }
      renderStorySelectionGrid();
    };

    container.appendChild(itemDiv);
  });
}

function saveNewOrEditedHighlight() {
  const name = document.getElementById('newHighlightName').value.trim();
  let finalStories = [...selectedStoriesForEdit];

  if (selectedCoverStory) {
    const coverIdx = finalStories.findIndex(s => s.src === selectedCoverStory.src);
    if (coverIdx > -1) {
      const [movedCover] = finalStories.splice(coverIdx, 1);
      finalStories.unshift(movedCover);
    } else {
      finalStories.unshift(selectedCoverStory);
    }
  }

  if (isEditingMode) {
    highlightsData[currentHighlightIndex].title = name;
    highlightsData[currentHighlightIndex].stories = finalStories;
  } else {
    highlightsData.push({
      title: name,
      stories: finalStories
    });
  }

  closeAllModals();
  renderHighlightsDOM();
}

function openStoryViewer(highlightIndex) {
  currentHighlightIndex = highlightIndex;
  currentStoryIndex = 0;
  isPaused = false;
  remainingTime = STORY_DURATION;
  document.getElementById('storyModal').classList.remove('hidden');
  renderSliderTrack();
  loadStory();
}

function closeStoryViewer() {
  document.getElementById('storyModal').classList.add('hidden');
  clearTimeout(timer);
  clearInterval(progressInterval);
}

function openHighlightMenu(event, index) {
  event.preventDefault();
  targetHighlightIndexToDelete = index;
  document.getElementById('highlightContextMenu').classList.remove('hidden');
}

function closeHighlightMenu() {
  document.getElementById('highlightContextMenu').classList.add('hidden');
  targetHighlightIndexToDelete = null;
}

function deleteCurrentHighlight() {
  if (targetHighlightIndexToDelete !== null) {
    highlightsData.splice(targetHighlightIndexToDelete, 1);
    renderHighlightsDOM();
    closeHighlightMenu();
  }
}

function openStoryOptionsMenu(event) {
  if (event) event.stopPropagation();
  pauseStory();
  document.getElementById('storyOptionsMenu').classList.remove('hidden');
}

function closeStoryOptionsMenu() {
  document.getElementById('storyOptionsMenu').classList.add('hidden');
  resumeStory();
}

function togglePlayPause(event) {
  if (event) event.stopPropagation();
  if (isPaused) {
    resumeStory();
  } else {
    pauseStory();
  }
}

function pauseStory() {
  isPaused = true;
  clearTimeout(timer);
  clearInterval(progressInterval);
  remainingTime -= (Date.now() - startTime);
  updatePlayPauseIcons();
}

function resumeStory() {
  if (!isPaused) return;
  isPaused = false;
  startTime = Date.now();
  updatePlayPauseIcons();

  const activeBar = document.getElementById(`progress-bar-${currentHighlightIndex}-${currentStoryIndex}`);

  progressInterval = setInterval(() => {
    if (!isPaused) {
      const elapsed = Date.now() - startTime;
      const currentElapsed = (STORY_DURATION - remainingTime) + elapsed;
      progressWidth = Math.min((currentElapsed / STORY_DURATION) * 100, 100);
      if (activeBar) activeBar.style.width = progressWidth + '%';
    }
  }, 50);

  timer = setTimeout(() => { nextStory(); }, remainingTime);
}

function updatePlayPauseIcons() {
  highlightsData.forEach((_, idx) => {
    const btn = document.getElementById(`play-pause-btn-${idx}`);
    if (btn) {
      if (isPaused) {
        btn.innerHTML = `<path d="M8 5v14l11-7z"/>`;
      } else {
        btn.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
      }
    }
  });
}

function toggleMute(event) {
  if (event) event.stopPropagation();
  isMuted = !isMuted;
  const activeVideo = document.getElementById(`story-video-${currentHighlightIndex}`);
  if (activeVideo) {
    activeVideo.muted = isMuted;
    if (!isMuted && activeVideo.volume === 0) {
      activeVideo.volume = 0.5;
      currentVolume = 0.5;
    }
  }
  updateVolumeControls();
}

function changeVolume(event, hIdx) {
  if (event) event.stopPropagation();
  const val = parseFloat(event.target.value);
  currentVolume = val;
  isMuted = (val === 0);

  const activeVideo = document.getElementById(`story-video-${hIdx}`);
  if (activeVideo) {
    activeVideo.volume = val;
    activeVideo.muted = isMuted;
  }
  updateVolumeControls();
}

function updateVolumeControls() {
  highlightsData.forEach((_, idx) => {
    const muteBtn = document.getElementById(`mute-btn-${idx}`);
    const slider = document.getElementById(`volume-slider-${idx}`);
    if (slider) slider.value = isMuted ? 0 : currentVolume;

    if (muteBtn) {
      if (isMuted || currentVolume === 0) {
        muteBtn.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>`;
      } else {
        muteBtn.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
      }
    }
  });
}

function renderSliderTrack() {
  const storySliderTrack = document.getElementById('storySliderTrack');
  storySliderTrack.innerHTML = '';

  highlightsData.forEach((item, hIdx) => {
    const isCurrent = hIdx === currentHighlightIndex;
    const cardWrapper = document.createElement('div');
    cardWrapper.className = `flex-shrink-0 transition-all duration-300 flex items-center justify-center px-4 ${isCurrent ? 'w-[360px] opacity-100 scale-100 z-20' : 'w-[260px] opacity-40 scale-90 z-10 pointer-events-none'}`;
    
    const storyCard = document.createElement('div');
    storyCard.className = "relative w-full h-[84vh] bg-neutral-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl";
    
    let progressHTML = `<div class="absolute top-3 left-3 right-3 z-30 flex gap-1.5">`;
    item.stories.forEach((_, sIdx) => {
      progressHTML += `<div class="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"><div id="progress-bar-${hIdx}-${sIdx}" class="h-full bg-white w-0 transition-all duration-75"></div></div>`;
    });
    progressHTML += `</div>`;

    const firstStory = item.stories[0];
    let coverHtml = firstStory.type === 'video' ? `<video src="${firstStory.src}" class="w-8 h-8 rounded-full object-cover border border-white/40"></video>` : `<img src="${firstStory.src}" class="w-8 h-8 rounded-full object-cover border border-white/40" />`;

    storyCard.innerHTML = `
      ${progressHTML}
      <div class="absolute top-6 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <div class="flex items-center gap-2.5">
          ${coverHtml}
          <div class="flex items-center gap-1.5">
            <span class="text-white text-xs font-semibold">${item.title}</span>
            <span class="text-neutral-400 text-xs" id="story-time-${hIdx}">25 ming</span>
          </div>
        </div>
        <div class="flex items-center gap-2 text-white">
          <div class="relative flex items-center group py-1">
            <input type="range" id="volume-slider-${hIdx}" min="0" max="1" step="0.05" value="${isMuted ? 0 : currentVolume}" oninput="changeVolume(event, ${hIdx})" class="w-16 accent-white cursor-pointer h-1 bg-white/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-1.5">
            <svg id="mute-btn-${hIdx}" onclick="toggleMute(event)" class="w-5 h-5 cursor-pointer hover:opacity-70" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          </div>
          <svg id="play-pause-btn-${hIdx}" onclick="togglePlayPause(event)" class="w-5 h-5 cursor-pointer hover:opacity-70" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          <svg onclick="openStoryOptionsMenu(event)" class="w-5 h-5 cursor-pointer hover:opacity-70" fill="currentColor" viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </div>
      </div>
      <div id="story-media-container-${hIdx}" class="relative w-full h-full flex-1 bg-black flex items-center justify-center">
        <div class="absolute inset-y-0 left-0 w-1/2 z-10 cursor-pointer" onclick="prevStory(event)"></div>
        <div class="absolute inset-y-0 right-0 w-1/2 z-10 cursor-pointer" onclick="nextStory(event)"></div>
      </div>
    `;

    cardWrapper.appendChild(storyCard);
    storySliderTrack.appendChild(cardWrapper);
  });

  updateSliderPosition();
  updateVolumeControls();
  updatePlayPauseIcons();
}

function updateSliderPosition() {
  const activeCardWidth = 360;
  const sideCardWidth = 260;
  const screenWidth = window.innerWidth;
  const storySliderTrack = document.getElementById('storySliderTrack');
  
  let offset = (screenWidth / 2) - (activeCardWidth / 2);
  for (let i = 0; i < currentHighlightIndex; i++) {
    offset -= sideCardWidth;
  }
  
  storySliderTrack.style.transform = `translateX(${offset}px)`;
}

function loadStory() {
  clearTimeout(timer);
  clearInterval(progressInterval);

  isPaused = false;
  remainingTime = STORY_DURATION;
  renderSliderTrack();

  const currentHighlight = highlightsData[currentHighlightIndex];
  const currentStory = currentHighlight.stories[currentStoryIndex];

  const mediaContainer = document.getElementById(`story-media-container-${currentHighlightIndex}`);
  const timeEl = document.getElementById(`story-time-${currentHighlightIndex}`);
  if (timeEl) timeEl.innerText = currentStory.time;

  if (mediaContainer) {
    const leftClickArea = `<div class="absolute inset-y-0 left-0 w-1/2 z-10 cursor-pointer" onclick="prevStory(event)"></div>`;
    const rightClickArea = `<div class="absolute inset-y-0 right-0 w-1/2 z-10 cursor-pointer" onclick="nextStory(event)"></div>`;

    if (currentStory.type === 'video') {
      mediaContainer.innerHTML = `
        <video id="story-video-${currentHighlightIndex}" src="${currentStory.src}" class="w-full h-full object-cover" autoplay ${isMuted ? 'muted' : ''}></video>
        ${leftClickArea}
        ${rightClickArea}
      `;
      const vid = document.getElementById(`story-video-${currentHighlightIndex}`);
      if (vid) {
        vid.volume = currentVolume;
        vid.muted = isMuted;
      }
    } else {
      mediaContainer.innerHTML = `
        <img src="${currentStory.src}" class="w-full h-full object-cover" />
        ${leftClickArea}
        ${rightClickArea}
      `;
    }
  }

  for (let h = 0; h < highlightsData.length; h++) {
    for (let s = 0; s < highlightsData[h].stories.length; s++) {
      const bar = document.getElementById(`progress-bar-${h}-${s}`);
      if (bar) {
        if (h < currentHighlightIndex || (h === currentHighlightIndex && s < currentStoryIndex)) {
          bar.style.width = '100%';
        } else {
          bar.style.width = '0%';
        }
      }
    }
  }

  progressWidth = 0;
  startTime = Date.now();
  const activeBar = document.getElementById(`progress-bar-${currentHighlightIndex}-${currentStoryIndex}`);

  progressInterval = setInterval(() => {
    if (!isPaused) {
      const elapsed = Date.now() - startTime;
      const currentElapsed = (STORY_DURATION - remainingTime) + elapsed;
      progressWidth = Math.min((currentElapsed / STORY_DURATION) * 100, 100);
      if (activeBar) activeBar.style.width = progressWidth + '%';
    }
  }, 50);

  timer = setTimeout(() => { nextStory(); }, STORY_DURATION);
}

function nextStory(event) {
  if (event) event.stopPropagation();
  const currentHighlight = highlightsData[currentHighlightIndex];

  if (currentStoryIndex < currentHighlight.stories.length - 1) {
    currentStoryIndex++;
    loadStory();
  } else {
    if (currentHighlightIndex < highlightsData.length - 1) {
      currentHighlightIndex++;
      currentStoryIndex = 0;
      loadStory();
    } else {
      closeStoryViewer();
    }
  }
}

function prevStory(event) {
  if (event) event.stopPropagation();

  if (currentStoryIndex > 0) {
    currentStoryIndex--;
    loadStory();
  } else {
    if (currentHighlightIndex > 0) {
      currentHighlightIndex--;
      currentStoryIndex = highlightsData[currentHighlightIndex].stories.length - 1;
      loadStory();
    }
  }
}

document.addEventListener('keydown', (e) => {
  const storyModal = document.getElementById('storyModal');
  const storyOptionsMenu = document.getElementById('storyOptionsMenu');
  if (!storyModal.classList.contains('hidden') && storyOptionsMenu.classList.contains('hidden')) {
    if (e.key === 'ArrowRight') {
      nextStory();
    } else if (e.key === 'ArrowLeft') {
      prevStory();
    } else if (e.key === 'Escape') {
      closeStoryViewer();
    } else if (e.key === ' ') {
      togglePlayPause();
    }
  }
});

function renderHighlightsDOM() {
  const highlightsContainer = document.getElementById('highlightsContainer');
  if (!highlightsContainer) return;
  
  const addButtonHTML = `
    <article class="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0" onclick="openStep1Modal()">
      <div class="highlight-ring text-2xl text-neutral-500">+</div>
      <span class="text-xs text-neutral-600">Baru</span>
    </article>
  `;

  highlightsContainer.innerHTML = '';

  highlightsData.forEach((item, index) => {
    const firstStory = item.stories[0];
    let ringHtml = firstStory.type === 'video' 
      ? `<video src="${firstStory.src}" class="h-full w-full rounded-full object-cover bg-neutral-100"></video>` 
      : `<img src="${firstStory.src}" alt="${item.title}" class="h-full w-full rounded-full object-cover bg-neutral-100" />`;

    const article = document.createElement('article');
    article.className = "flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer";
    article.setAttribute('onclick', `openStoryViewer(${index})`);
    article.setAttribute('oncontextmenu', `openHighlightMenu(event, ${index})`);
    
    article.innerHTML = `
      <div class="highlight-ring">
        ${ringHtml}
      </div>
      <span class="text-xs text-neutral-600">${item.title}</span>
    `;
    highlightsContainer.appendChild(article);
  });

  highlightsContainer.innerHTML += addButtonHTML;
}

window.onload = function() {
  renderHighlightsDOM();
};