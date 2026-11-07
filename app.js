/**
 * مِرآة // MIRROR ARCHIVE - CORE JAVASCRIPT SYSTEM (V7.3)
 */

(function () {
  'use strict';

  const state = {
    artworks: typeof ARTWORKS_DATABASE !== 'undefined' ? ARTWORKS_DATABASE : [],
    filteredArtworks: [],
    activeCategory: 'all',
    activeArtist: 'all',
    searchQuery: '',
    sortBy: 'default',
    currentModalIndex: -1,
    audioFXEnabled: true,
    ambientDroneActive: false,
    isSpeaking: false,
    audioPlaying: false
  };

  let audioCtx = null;
  let activeSynthNodes = [];
  let ambientOsc1 = null;
  let ambientOsc2 = null;
  let ambientGain = null;
  let visualizerAnimId = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSoundFX(type) {
    if (!state.audioFXEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.03);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.05);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'modal-open') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'modal-close') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      console.warn('Audio FX:', e);
    }
  }

  function playVoiceSignature(art, onEndCallback) {
    initAudioContext();
    if (!audioCtx) return;

    stopVoiceSignature();

    const rootFreq = art.freq || 432;
    const waveform = art.waveform || 'sine';
    const now = audioCtx.currentTime;
    const duration = 4.0;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.16, now + 0.3);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const freqs = [rootFreq, rootFreq * 1.5, rootFreq * 2];
    const oscNodes = [];

    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      osc.type = waveform;
      osc.frequency.setValueAtTime(f, now);
      osc.detune.setValueAtTime((idx - 1) * 6, now);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + duration);

      osc.connect(filter);
      filter.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration);
      oscNodes.push(osc);
    });

    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    state.audioPlaying = true;
    startVisualizerLoop(analyser);
    activeSynthNodes = oscNodes;

    setTimeout(() => {
      state.audioPlaying = false;
      stopVisualizerLoop();
      if (typeof onEndCallback === 'function') onEndCallback();
    }, duration * 1000);
  }

  function stopVoiceSignature() {
    activeSynthNodes.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    activeSynthNodes = [];
    state.audioPlaying = false;
    stopVisualizerLoop();
  }

  function startVisualizerLoop(analyser) {
    const canvas = document.getElementById('audioVisualizer');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      visualizerAnimId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(5, 8, 17, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#00f0ff');
        gradient.addColorStop(1, '#9d4edd');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    }
    draw();
  }

  function stopVisualizerLoop() {
    if (visualizerAnimId) {
      cancelAnimationFrame(visualizerAnimId);
      visualizerAnimId = null;
    }
    const canvas = document.getElementById('audioVisualizer');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }
  }

  function toggleAmbientDrone() {
    initAudioContext();
    if (!audioCtx) return;

    const btn = document.getElementById('ambientToggleBtn');
    if (state.ambientDroneActive) {
      if (ambientGain) {
        ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        setTimeout(() => {
          if (ambientOsc1) ambientOsc1.stop();
          if (ambientOsc2) ambientOsc2.stop();
          ambientOsc1 = null;
          ambientOsc2 = null;
        }, 800);
      }
      state.ambientDroneActive = false;
      if (btn) btn.classList.remove('active');
    } else {
      const now = audioCtx.currentTime;
      ambientOsc1 = audioCtx.createOscillator();
      ambientOsc2 = audioCtx.createOscillator();
      ambientGain = audioCtx.createGain();

      ambientOsc1.type = 'sine';
      ambientOsc1.frequency.setValueAtTime(55, now);
      ambientOsc2.type = 'triangle';
      ambientOsc2.frequency.setValueAtTime(110, now);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);

      ambientGain.gain.setValueAtTime(0.001, now);
      ambientGain.gain.exponentialRampToValueAtTime(0.035, now + 1.2);

      ambientOsc1.connect(filter);
      ambientOsc2.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);

      ambientOsc1.start(now);
      ambientOsc2.start(now);

      state.ambientDroneActive = true;
      if (btn) btn.classList.add('active');
    }
  }

  function toggleSpeechNarration(art, btnElement) {
    if (!('speechSynthesis' in window)) {
      if (btnElement) {
        btnElement.innerHTML = '<span>⚠️</span> الصوت غير مدعوم';
        setTimeout(() => {
          btnElement.innerHTML = '<span>🎙️</span> قراءة التحليل الصوتي';
        }, 3000);
      }
      return;
    }

    if (state.isSpeaking) {
      window.speechSynthesis.cancel();
      state.isSpeaking = false;
      if (btnElement) {
        btnElement.classList.remove('playing');
        btnElement.innerHTML = '<span>🎙️</span> قراءة التحليل الصوتي';
      }
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = `${art.title}، للفنان ${art.artist}، أنجزت عام ${art.year}. تنتمي إلى ${art.era}. ${art.desc} تحليل العمل: ${art.analysis}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onstart = () => {
      state.isSpeaking = true;
      if (btnElement) {
        btnElement.classList.add('playing');
        btnElement.innerHTML = '<span>⏹️</span> إيقاف السرد الصوتي';
      }
    };

    utterance.onend = () => {
      state.isSpeaking = false;
      if (btnElement) {
        btnElement.classList.remove('playing');
        btnElement.innerHTML = '<span>🎙️</span> قراءة التحليل الصوتي';
      }
    };

    utterance.onerror = () => {
      state.isSpeaking = false;
      if (btnElement) {
        btnElement.classList.remove('playing');
        btnElement.innerHTML = '<span>🎙️</span> قراءة التحليل الصوتي';
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  // Multi-tier Resilient Image Fallback
  window.handleImageError = function (imgEl, backupUrl, title, artist, year, category) {
    const stage = parseInt(imgEl.dataset.fallbackStage || '0');

    if (stage === 0 && backupUrl) {
      // Try Stage 1: wsrv.nl CDN
      imgEl.dataset.fallbackStage = '1';
      imgEl.src = backupUrl;
      return;
    }

    if (stage === 1) {
      // Try Stage 2: Direct raw Wikimedia with no-referrer
      imgEl.dataset.fallbackStage = '2';
      const cleanWiki = imgEl.src.split('upload.wikimedia.org')[1];
      if (cleanWiki) {
        imgEl.referrerPolicy = 'no-referrer';
        imgEl.src = 'https://upload.wikimedia.org' + cleanWiki;
        return;
      }
    }

    // Final Stage: Procedural Cyber Canvas
    imgEl.style.display = 'none';
    const parent = imgEl.parentElement;
    let canvas = parent.querySelector('.procedural-art-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'procedural-art-canvas';
      canvas.width = 400;
      canvas.height = 300;
      parent.appendChild(canvas);
    }
    renderProceduralHologram(canvas, title, artist, year, category);
  };

  function renderProceduralHologram(canvas, title, artist, year, category) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const bgGradient = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.4);
    bgGradient.addColorStop(0, '#0d182e');
    bgGradient.addColorStop(0.7, '#070c17');
    bgGradient.addColorStop(1, '#03050a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 15, 55, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(157, 78, 221, 0.4)';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 15, 75, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 80, h / 2 - 15);
    ctx.lineTo(w / 2 + 80, h / 2 - 15);
    ctx.moveTo(w / 2, h / 2 - 95);
    ctx.lineTo(w / 2, h / 2 + 65);
    ctx.stroke();

    ctx.font = 'bold 15px Cairo, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(title, w / 2, h - 45);

    ctx.font = '12px Cairo, sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`${artist} • ${year}`, w / 2, h - 25);

    ctx.font = '9px Orbitron, monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('HOLOGRAPHIC RECONSTRUCTION', w / 2, 22);
  }

  function applyFilters() {
    let result = [...state.artworks];

    if (state.activeCategory !== 'all') {
      if (state.activeCategory === 'renaissance') {
        result = result.filter(a => a.category === 'renaissance');
      } else if (state.activeCategory === 'baroque') {
        result = result.filter(a => a.category === 'baroque');
      } else if (state.activeCategory === 'romanticism') {
        result = result.filter(a => a.category === 'romanticism' || a.category === 'neoclassicism');
      } else if (state.activeCategory === 'impressionism') {
        result = result.filter(a => a.category === 'impressionism');
      } else if (state.activeCategory === 'post-impressionism') {
        result = result.filter(a => a.category === 'post-impressionism');
      } else if (state.activeCategory === 'surrealism') {
        result = result.filter(a => a.category === 'surrealism');
      } else if (state.activeCategory === 'modern') {
        result = result.filter(a => a.category === 'cubism' || a.category === 'abstract' || a.category === 'modern' || a.category === 'expressionism');
      } else if (state.activeCategory === 'controversial') {
        result = result.filter(a => a.category === 'controversial' || a.category === 'dark-art');
      }
    }

    if (state.activeArtist !== 'all') {
      result = result.filter(a => a.artist === state.activeArtist);
    }

    const query = state.searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(a => {
        return (
          a.title.toLowerCase().includes(query) ||
          a.originalTitle.toLowerCase().includes(query) ||
          a.artist.toLowerCase().includes(query) ||
          a.artistEn.toLowerCase().includes(query) ||
          a.year.includes(query) ||
          a.era.toLowerCase().includes(query) ||
          a.desc.toLowerCase().includes(query) ||
          a.location.toLowerCase().includes(query)
        );
      });
    }

    if (state.sortBy === 'year-asc') {
      result.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    } else if (state.sortBy === 'year-desc') {
      result.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (state.sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
    } else if (state.sortBy === 'artist-asc') {
      result.sort((a, b) => a.artist.localeCompare(b.artist, 'ar'));
    }

    state.filteredArtworks = result;
    renderGallery();
    updateCounter();
  }

  function updateCounter() {
    const counterEl = document.getElementById('countDisplay');
    if (counterEl) {
      counterEl.textContent = `${state.filteredArtworks.length} / ${state.artworks.length}`;
    }
  }

  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    if (state.filteredArtworks.length === 0) {
      grid.innerHTML = `
        <div class="empty-gallery">
          <h3 style="color: var(--cyan-neon); margin-bottom: 0.5rem;">// لا توجد نتائج مطابقة</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">جرّب كلمة بحث أخرى أو أعد ضبط الفلاتر لاسترجاع اللوحات.</p>
        </div>
      `;
      return;
    }

    const html = state.filteredArtworks.map((art, index) => {
      const safeTitle = (art.title || '').replace(/'/g, "\'");
      const safeArtist = (art.artist || '').replace(/'/g, "\'");
      return `
        <article class="art-card" data-id="${art.id}" data-index="${index}" tabindex="0" role="button" aria-label="عرض تفاصيل ${art.title}">
          <div class="card-image-box">
            <span class="card-hud-badge">${art.id}</span>
            <span class="card-freq-tag">${art.freq} Hz</span>
            <img class="card-img" 
                 src="${art.image}" 
                 alt="${art.title}" 
                 loading="lazy" 
                 
                 referrerpolicy="no-referrer"
                 onerror="handleImageError(this, '${art.backupImage}', '${safeTitle}', '${safeArtist}', '${art.year}', '${art.category}')" />
          </div>
          <div class="card-info">
            <h2 class="card-title">${art.title}</h2>
            <div class="card-meta-artist">
              <span class="card-artist">${art.artist}</span>
              <span class="card-year">${art.year}</span>
            </div>
            <span class="card-era-badge">${art.era}</span>
            <div class="card-footer">
              <button class="card-action-btn" type="button">
                <span>فحص اللوحة</span>
                <span>&larr;</span>
              </button>
              <button class="card-audio-btn" type="button" title="استمع للتوقيع الصوتي" aria-label="استمع للتوقيع الصوتي لـ ${art.title}">
                <span>▶</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    grid.innerHTML = html;

    grid.querySelectorAll('.art-card').forEach(card => {
      card.addEventListener('mouseenter', () => playSoundFX('hover'));
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-audio-btn')) {
          e.stopPropagation();
          const artId = card.dataset.id;
          const art = state.artworks.find(a => a.id === artId);
          if (art) {
            playSoundFX('click');
            playVoiceSignature(art);
          }
          return;
        }
        playSoundFX('modal-open');
        openModalById(card.dataset.id);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playSoundFX('modal-open');
          openModalById(card.dataset.id);
        }
      });
    });
  }

  function populateArtistDropdown() {
    const select = document.getElementById('artistSelect');
    if (!select) return;

    const artists = Array.from(new Set(state.artworks.map(a => a.artist))).sort((a, b) => a.localeCompare(b, 'ar'));
    let optionsHtml = '<option value="all">كافة الفنانين (الكل)</option>';
    artists.forEach(artist => {
      optionsHtml += `<option value="${artist}">${artist}</option>`;
    });
    select.innerHTML = optionsHtml;
  }

  function openModalById(artId) {
    const index = state.filteredArtworks.findIndex(a => a.id === artId);
    if (index === -1) return;
    openModalByIndex(index);
  }

  function openModalByIndex(index) {
    state.currentModalIndex = index;
    const art = state.filteredArtworks[index];
    if (!art) return;

    const modal = document.getElementById('hudModal');
    if (!modal) return;

    document.getElementById('modalIdBadge').textContent = art.id;
    document.getElementById('modalTitleText').textContent = art.title;
    document.getElementById('modalOriginalTitle').textContent = art.originalTitle;
    document.getElementById('modalArtist').textContent = `${art.artist} (${art.artistEn})`;
    document.getElementById('modalYear').textContent = art.year;
    document.getElementById('modalEra').textContent = art.era;
    document.getElementById('modalLocation').textContent = art.location;
    document.getElementById('modalFreq').textContent = `${art.freq} Hz [${art.mood}]`;
    document.getElementById('modalDesc').textContent = art.desc;
    document.getElementById('modalAnalysis').textContent = art.analysis;

    const imgEl = document.getElementById('modalImg');
    const imgContainer = document.getElementById('modalImgContainer');
    imgContainer.classList.remove('zoomed');

    imgEl.style.display = 'block';
    imgEl.dataset.fallbackStage = '0';
    const oldCanvas = imgContainer.querySelector('.procedural-art-canvas');
    if (oldCanvas) oldCanvas.remove();

    imgEl.src = art.image;
    imgEl.alt = art.title;
    imgEl.onerror = function () {
      window.handleImageError(this, art.backupImage, art.title, art.artist, art.year, art.category);
    };

    const speechBtn = document.getElementById('speechNarratorBtn');
    if (speechBtn) {
      speechBtn.classList.remove('playing');
      speechBtn.innerHTML = '<span>🎙️</span> قراءة التحليل الصوتي';
    }

    stopVisualizerLoop();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    playSoundFX('modal-close');
    stopVoiceSignature();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    state.isSpeaking = false;

    const modal = document.getElementById('hudModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigateModal(direction) {
    playSoundFX('click');
    stopVoiceSignature();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    state.isSpeaking = false;

    let nextIndex = state.currentModalIndex + direction;
    if (nextIndex < 0) nextIndex = state.filteredArtworks.length - 1;
    if (nextIndex >= state.filteredArtworks.length) nextIndex = 0;
    openModalByIndex(nextIndex);
  }

  function setupEvents() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (searchClear) {
          searchClear.style.display = state.searchQuery ? 'block' : 'none';
        }
        applyFilters();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          state.searchQuery = '';
          searchClear.style.display = 'none';
          applyFilters();
          searchInput.focus();
        }
      });
    }

    const eraBtns = document.querySelectorAll('.era-filter-btn');
    eraBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playSoundFX('click');
        eraBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeCategory = btn.dataset.category;
        applyFilters();
      });
    });

    const artistSelect = document.getElementById('artistSelect');
    if (artistSelect) {
      artistSelect.addEventListener('change', (e) => {
        playSoundFX('click');
        state.activeArtist = e.target.value;
        applyFilters();
      });
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        playSoundFX('click');
        state.sortBy = e.target.value;
        applyFilters();
      });
    }

    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        state.audioFXEnabled = !state.audioFXEnabled;
        soundToggle.classList.toggle('active', state.audioFXEnabled);
        soundToggle.textContent = state.audioFXEnabled ? 'مؤثرات: مفعّلة' : 'مؤثرات: صامت';
        if (state.audioFXEnabled) playSoundFX('click');
      });
    }

    const ambientToggleBtn = document.getElementById('ambientToggleBtn');
    if (ambientToggleBtn) {
      ambientToggleBtn.addEventListener('click', () => {
        toggleAmbientDrone();
      });
    }

    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    const modalBackdrop = document.getElementById('hudModal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    const modalPrev = document.getElementById('modalPrevBtn');
    const modalNext = document.getElementById('modalNextBtn');
    if (modalPrev) modalPrev.addEventListener('click', () => navigateModal(-1));
    if (modalNext) modalNext.addEventListener('click', () => navigateModal(1));

    const zoomBtn = document.getElementById('zoomToggleBtn');
    const modalImgContainer = document.getElementById('modalImgContainer');
    if (zoomBtn && modalImgContainer) {
      zoomBtn.addEventListener('click', () => {
        modalImgContainer.classList.toggle('zoomed');
        zoomBtn.textContent = modalImgContainer.classList.contains('zoomed') ? 'تصغير الحجم' : 'تكبير التفاصيل';
      });
    }

    const playSignatureBtn = document.getElementById('playVoiceSignatureBtn');
    if (playSignatureBtn) {
      playSignatureBtn.addEventListener('click', () => {
        const art = state.filteredArtworks[state.currentModalIndex];
        if (art) {
          if (state.audioPlaying) {
            stopVoiceSignature();
            playSignatureBtn.textContent = 'تشغيل التوقيع الصوتي';
          } else {
            playSignatureBtn.textContent = 'إيقاف النغمة';
            playVoiceSignature(art, () => {
              playSignatureBtn.textContent = 'تشغيل التوقيع الصوتي';
            });
          }
        }
      });
    }

    const speechBtn = document.getElementById('speechNarratorBtn');
    if (speechBtn) {
      speechBtn.addEventListener('click', () => {
        const art = state.filteredArtworks[state.currentModalIndex];
        if (art) toggleSpeechNarration(art, speechBtn);
      });
    }

    const backToTop = document.getElementById('backToTopBtn');
    if (backToTop) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      });
      backToTop.addEventListener('click', () => {
        playSoundFX('click');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('hudModal');
      if (modal && modal.classList.contains('open')) {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowLeft') {
          navigateModal(1);
        } else if (e.key === 'ArrowRight') {
          navigateModal(-1);
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    populateArtistDropdown();
    applyFilters();
    setupEvents();
  });
})();
