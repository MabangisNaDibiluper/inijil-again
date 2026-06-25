// ====================================================================
//  PHOTO SLOTS — put your own pictures here!
// ====================================================================
const photos = [
  { src: 'photos/p1.jpg', caption: 'cottiieee gooffyy babyy NYAHAHAH' },
  { src: 'photos/p2.jpg', caption: 'SOSOSOS prettyy eyes mo babyyy' },
  { src: 'photos/p3.jpg', caption: 'Ayunn antaray naka pink HAHAH' },
  { src: 'photos/p4.jpg', caption: 'Eto oh Uthred NYAHA cutie' },
  { src: 'photos/p5.jpg', caption: 'Yan ka nanaman sa sakit mo' },
  { src: 'photos/p6.jpg', caption: 'NYAHAH cute ng smile kainis' },
  { src: 'photos/p7.jpg', caption: 'kiss moko?' },
  { src: 'photos/p8.jpg', caption: 'ayun tolo ang babyy NYAHAHA' },
];

// ====================================================================
//  SONGS — real playback opens on Spotify/YouTube (licensed platforms)
// ====================================================================
const tracks = [
  {
    title: 'Sparks',
    artist: 'Coldplay',
    youtube: 'https://www.youtube.com/results?search_query=Sparks+Coldplay',
    spotify: 'https://open.spotify.com/search/Sparks%20Coldplay',
  },
  {
    title: 'About You',
    artist: 'The 1975',
    youtube: 'https://www.youtube.com/results?search_query=About+You+The+1975',
    spotify: 'https://open.spotify.com/search/About%20You%20The%201975',
  },
];

// ====================================================================
//  Everything below this line makes the page work — no need to edit it.
// ====================================================================

// ---------- AUDIO & WELCOME OVERLAY CONTROL ----------
const loopAudio = document.getElementById('bgLoopAudio');
const welcomeOverlay = document.getElementById('welcomeOverlay');
const enterBtn = document.getElementById('enterBtn');
const soundToggleBtn = document.getElementById('soundToggle');

if (enterBtn && welcomeOverlay) {
  enterBtn.addEventListener('click', () => {
    welcomeOverlay.style.opacity = '0';
    welcomeOverlay.style.transform = 'scale(0.95) translateY(-30px)';
    
    setTimeout(() => {
      welcomeOverlay.style.display = 'none';
    }, 500);
    
    if (loopAudio) {
      loopAudio.play()
        .then(() => {
          soundToggleBtn.textContent = '⏸';
          soundToggleBtn.title = "Pause music loop";
        })
        .catch(err => {
          console.log("Audio playback failed: ", err);
        });
    }
  });
}

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!loopAudio) return;

    if (loopAudio.paused) {
      loopAudio.play().catch(err => console.log("Playback error: ", err));
      soundToggleBtn.textContent = '⏸';
      soundToggleBtn.title = "Pause music loop";
    } else {
      loopAudio.pause();
      soundToggleBtn.textContent = '🎵';
      soundToggleBtn.title = "Play music loop";
    }
  });
}

// ---------- PHOTO STACK (Mobile Friendly Tap Cycle) ----------
const stack = document.getElementById('collageGrid');
const ROT = [-4, 3, -2, 5, -3, 2, -5, 4];
let order = photos.map((_, i) => i);

function buildStack(){
  if (!stack) return;
  stack.innerHTML = '';
  order.forEach((photoIdx, pos) => {
    const card = document.createElement('div');
    card.className = 'polaroid';
    card.dataset.photoIdx = photoIdx;
    card.style.setProperty('--rot', ROT[pos % ROT.length] + 'deg');
    card.style.zIndex = photos.length - pos;
    card.style.transform = `translate(${pos * -2}px, ${pos * 3}px) rotate(${ROT[pos % ROT.length]}deg) scale(${1 - pos * 0.025})`;
    
    const p = photos[photoIdx];
    const fileName = p.src.split('/').pop();
    card.innerHTML = `<img src="${p.src}" alt="${p.caption}" draggable="false" onerror="this.closest('.polaroid').classList.add('img-missing')"><div class="missing-note">📷<br>add<br><strong>photos/${fileName}</strong></div><div class="cap">${p.caption}</div>`;
    
    if(pos === 0){
      card.classList.add('top-card');
      card.innerHTML += `<div class="tap-badge">TAP →</div>`;
      card.addEventListener('click', cycleStack);
    }
    stack.appendChild(card);
  });
  const counter = document.getElementById('stackCounter');
  if(counter) counter.textContent = `${order[0] + 1} / ${photos.length}`;
}

let cycling = false;
function cycleStack(){
  if(cycling || !stack) return;
  cycling = true;
  const topCard = stack.querySelector('.top-card');
  if (!topCard) { cycling = false; return; }
  
  topCard.classList.remove('top-card');
  topCard.removeEventListener('click', cycleStack);

  topCard.style.transition = 'transform .45s cubic-bezier(.4,.0,.2,1), opacity .4s ease';
  topCard.style.transform += ' translateY(-70px) rotate(15deg)';
  topCard.style.opacity = '0.1';

  setTimeout(() => {
    order.push(order.shift());
    buildStack();
    cycling = false;
  }, 400);
}

buildStack();

document.addEventListener('keydown', (e) => {
  const collageEl = document.getElementById('collage');
  if (!collageEl) return;
  const rect = collageEl.getBoundingClientRect();
  const collageVisible = rect.top < window.innerHeight && rect.bottom > 0;
  if(collageVisible && (e.key === 'ArrowRight' || e.key === ' ')){
    e.preventDefault();
    cycleStack();
  }
});

// ---------- SONG PLAYLIST SYSTEM ----------
const trackList = document.getElementById('trackList');
const npTitle = document.getElementById('npTitle');
const npArtist = document.getElementById('npArtist');
const npStatus = document.getElementById('npStatus');
const nowPlaying = document.getElementById('nowPlaying');

function pixelNoteIcon(){
  return `<svg class="track-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" fill="none"/>
    <g fill="#f4c94a">
      <rect x="9" y="1" width="2" height="9"/>
      <rect x="9" y="1" width="5" height="2"/>
      <rect x="3" y="9" width="5" height="2"/>
      <rect x="3" y="9" width="2" height="4"/>
      <rect x="2" y="13" width="4" height="2"/>
      <rect x="9" y="8" width="5" height="2"/>
      <rect x="9" y="8" width="2" height="4"/>
      <rect x="8" y="12" width="4" height="2"/>
    </g>
  </svg>`;
}

if (trackList) {
  tracks.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'track';
    row.dataset.index = i;
    row.innerHTML = `
      <div class="track-num">${String(i+1).padStart(2,'0')}</div>
      ${pixelNoteIcon()}
      <div class="track-info">
        <div class="t-name">${t.title}</div>
        <div class="t-artist">${t.artist}</div>
      </div>
      <button class="track-play" data-platform="youtube">▶ YT</button>
      <button class="track-play" data-platform="spotify" style="background:#5fae6e;">♫ SP</button>
    `;
    trackList.appendChild(row);

    row.querySelectorAll('.track-play').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const platform = btn.dataset.platform;
        setNowPlaying(t);
        window.open(t[platform], '_blank', 'noopener');
      });
    });

    row.addEventListener('click', () => setNowPlaying(t));
  });
}

function setNowPlaying(t){
  if(!nowPlaying || !npTitle || !npArtist || !npStatus) return;
  document.querySelectorAll('.track').forEach(el => el.classList.remove('playing'));
  const idx = tracks.indexOf(t);
  const selectedTrack = document.querySelector(`.track[data-index="${idx}"]`);
  if (selectedTrack) selectedTrack.classList.add('playing');
  
  npTitle.textContent = t.title;
  npArtist.textContent = t.artist;
  npStatus.textContent = 'OPENING…';
  nowPlaying.classList.remove('paused');
  setTimeout(() => { npStatus.textContent = 'TAP ▶ OR ♫'; }, 1200);
}

// ---------- ACTIVE SCROLL HIGHLIGHTING ----------
const sections = document.querySelectorAll('section, header.hero');
const navLinks = document.querySelectorAll('.nav-link');

function onScroll(){
  if (sections.length === 0) return;
  let current = sections[0].id;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if(rect.top <= 140) current = sec.id;
  });
  navLinks.forEach(link => {
    let targetId = link.getAttribute('href').substring(1);
    // Custom mapping for shortened responsive tabs
    if(targetId === 'songs' && current === 'songs') link.classList.add('active');
    else if(targetId === 'collage' && current === 'collage') link.classList.add('active');
    else link.classList.toggle('active', targetId === current);
  });
}
window.addEventListener('scroll', onScroll);
onScroll();