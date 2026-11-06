/**
 * مِرآة // MIRROR ARCHIVE - CORE JAVASCRIPT SYSTEM
 * Sci-Fi HUD Art Gallery Engine
 */

(function () {
  'use strict';

  // State Management
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

  // Audio Context (Web Audio API)
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

  // Sound Effects Synthesis
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
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'modal-open') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.18);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'modal-close') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      console.warn('Audio FX failed:', e);
    }
  }

  // Voice Signature Harmonic Synthesizer
  function playVoiceSignature(art, onEndCallback) {
    initAudioContext();
    if (!audioCtx) return;

    stopVoiceSignature();

    const rootFreq = art.freq || 432;
    const waveform = art.waveform || 'sine';
    const now = audioCtx.currentTime;
    const duration = 4.5; // 4.5 seconds harmonic chord

    // Analyser for real-time visualizer
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Multi-voice chord (Root, Fifth, Octave)
    const freqs = [rootFreq, rootFreq * 1.5, rootFreq * 2];
    const oscNodes = [];

    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      osc.type = waveform;
      osc.frequency.setValueAtTime(f, now);
      // subtle detune for warmth
      osc.detune.setValueAtTime((idx - 1) * 7, now);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + duration);

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

  // Audio Visualizer Canvas Loop
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
        // Gradient from cyan to purple
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
      // Draw idle line
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }
  }

  // Ambient Drone
  function toggleAmbientDrone() {
    initAudioContext();
    if (!audioCtx) return;

    const badge = document.getElementById('ambientBadge');
    if (state.ambientDroneActive) {
      if (ambientGain) {
        ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
        setTimeout(() => {
          if (ambientOsc1) ambientOsc1.stop();
          if (ambientOsc2) ambientOsc2.stop();
          ambientOsc1 = null;
          ambientOsc2 = null;
        }, 1000);
      }
      state.ambientDroneActive = false;
      if (badge) badge.classList.remove('active');
    } else {
      const now = audioCtx.currentTime;
      ambientOsc1 = audioCtx.createOscillator();
      ambientOsc2 = audioCtx.createOscillator();
      ambientGain = audioCtx.createGain();

      ambientOsc1.type = 'sine';
      ambientOsc1.frequency.setValueAtTime(55, now); // A1 note
      ambientOsc2.type = 'triangle';
      ambientOsc2.frequency.setValueAtTime(110, now); // A2 note
      ambientOsc2.detune.setValueAtTime(5, now);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);

      ambientGain.gain.setValueAtTime(0.001, now);
      ambientGain.gain.exponentialRampToValueAtTime(0.04, now + 1.5);

      ambientOsc1.connect(filter);
      ambientOsc2.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);

      ambientOsc1.start(now);
      ambientOsc2.start(now);

      state.ambientDroneActive = true;
      if (badge) badge.classList.add('active');
    }
  }

  // Web Speech API Voice Narrator
  function toggleSpeechNarration(art, btnElement) {
    if (!('speechSynthesis' in window)) {
      if (btnElement) {
        btnElement.innerHTML = '<span class="icon">⚠️</span> الصوت غير مدعوم';
        setTimeout(() => {
          btnElement.innerHTML = '<span class="icon">🎙️</span> قراءة التحليل الصوتي';
        }, 3000);
      }
      return;
    }

    if (state.isSpeaking) {
      window.speechSynthesis.cancel();
      state.isSpeaking = false;
      if (btnElement) {
        btnElement.classList.remove('playing');
        btnElement.innerHTML = '<span class="icon">🎙️</span> قراءة التحليل الصوتي';
      }
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = `${art.title}، للفنان ${art.artist}، أنجزت عام ${art.year}. تنتمي إلى ${art.era}. ${art.desc} تحليل العمل: ${art.analysis}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;
    utterance.pitch = 0.9;

    // Pick best Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => {
      state.isSpeaking = true;
      if (btnElement) {
        btnElement.classList.add('playing');
        btnElement.innerHTML = '<span class="icon">⏹️</span> إيقاف السرد الصوتي';
      }
    };

    utterance.onend = () => {
      state.isSpeaking = false;
      if (btnElement) {
        btnElement.classList.remove('playing');
        btnElement.innerHTML = '<span class="icon">🎙️</span> قراءة التحليل الصوتي';
      }
    };

    utterance.onerror = () => {
      state.isSpeaking = false;
      if (btnElement) {
        btnElement.classList.remove('playing');
        btnElement.innerHTML = '<span class="icon">🎙️</span> قراءة التحليل الصوتي';
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  // Image Resiliency & Procedural Hologram Fallback
  function renderProceduralHologram(canvas, title, artist, year, category) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Dark Cyber Gradient
    const bgGradient = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.5);
    bgGradient.addColorStop(0, '#0d182e');
    bgGradient.addColorStop(0.7, '#070c17');
    bgGradient.addColorStop(1, '#03050a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Concentric HUD Circles
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 15, 60, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(157, 78, 221, 0.4)';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 15, 80, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 90, h / 2 - 15);
    ctx.lineTo(w / 2 + 90, h / 2 - 15);
    ctx.moveTo(w / 2, h / 2 - 105);
    ctx.lineTo(w / 2, h / 2 + 75);
    ctx.stroke();

    // Central Icon
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('❖', w / 2, h / 2 - 15);

    // Text Overlay
    ctx.font = 'bold 15px Cairo, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText(title, w / 2, h - 50);

    ctx.font = '12px Cairo, sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 0;
    ctx.fillText(`${artist} • ${year}`, w / 2, h - 28);

    ctx.font = '10px Orbitron, monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('HOLOGRAPHIC ARCHIVE RECONSTRUCTION', w / 2, 22);
  }

  window.handleImageError = function (imgEl, backupUrl, title, artist, year, category) {
    if (!imgEl.dataset.triedBackup && backupUrl) {
      imgEl.dataset.triedBackup = 'true';
      imgEl.src = backupUrl;
      return;
    }
    // If backup fails or already tried, replace with procedural Canvas
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

  // Filter & Search Engine
  function applyFilters() {
    let result = [...state.artworks];

    // Category filter
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

    // Artist filter
    if (state.activeArtist !== 'all') {
      result = result.filter(a => a.artist === state.activeArtist);
    }

    // Search query filter
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

    // Sorting
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

  // Render Gallery Cards
  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    if (state.filteredArtworks.length === 0) {
      grid.innerHTML = `
        <div class="empty-gallery">
          <h3>// لم يتم العثور على نتائج</h3>
          <p>جرّب البحث بكلمة أخرى أو إعادة ضبط الفلاتر لاستعادة اللوحات المشفرة في الأرشيف.</p>
        </div>
      `;
      return;
    }

    const html = state.filteredArtworks.map((art, index) => {
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
                 onerror="handleImageError(this, '${art.backupImage}', '${art.title.replace(/'/g, "\'")}', '${art.artist.replace(/'/g, "\'")}', '${art.year}', '${art.category}')" />
            <div class="card-scan-sweep"></div>
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
                <span>⟶</span>
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

    // Attach listeners
    grid.querySelectorAll('.art-card').forEach(card => {
      card.addEventListener('mouseenter', () => playSoundFX('hover'));
      card.addEventListener('click', (e) => {
        // Check if audio button was clicked
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
        const artId = card.dataset.id;
        openModalById(artId);
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

  // Populate Artist Dropdown
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

  // Modal Functions
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

    // Reset error handling for modal image
    imgEl.style.display = 'block';
    imgEl.dataset.triedBackup = '';
    const oldCanvas = imgContainer.querySelector('.procedural-art-canvas');
    if (oldCanvas) oldCanvas.remove();

    imgEl.src = art.image;
    imgEl.alt = art.title;
    imgEl.onerror = function () {
      window.handleImageError(this, art.backupImage, art.title, art.artist, art.year, art.category);
    };

    // Reset speech button state
    const speechBtn = document.getElementById('speechNarratorBtn');
    if (speechBtn) {
      speechBtn.classList.remove('playing');
      speechBtn.innerHTML = '<span class="icon">🎙️</span> قراءة التحليل الصوتي';
    }

    // Reset visualizer
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
    if (modal) {
      modal.classList.remove('open');
    }
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

  // Setup Event Handlers
  function setupEvents() {
    // Search Input
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

    // Category Buttons
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

    // Artist Select
    const artistSelect = document.getElementById('artistSelect');
    if (artistSelect) {
      artistSelect.addEventListener('change', (e) => {
        playSoundFX('click');
        state.activeArtist = e.target.value;
        applyFilters();
      });
    }

    // Sort Select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        playSoundFX('click');
        state.sortBy = e.target.value;
        applyFilters();
      });
    }

    // Sound FX Toggle
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        state.audioFXEnabled = !state.audioFXEnabled;
        soundToggle.classList.toggle('active', state.audioFXEnabled);
        soundToggle.textContent = state.audioFXEnabled ? 'مؤثرات: مفعّلة' : 'مؤثرات: صامت';
        if (state.audioFXEnabled) playSoundFX('click');
      });
    }

    // Ambient Drone Toggle
    const ambientBadge = document.getElementById('ambientBadge');
    if (ambientBadge) {
      ambientBadge.addEventListener('click', () => {
        toggleAmbientDrone();
      });
    }

    // Modal Close Button & Backdrop
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    const modalBackdrop = document.getElementById('hudModal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          closeModal();
        }
      });
    }

    // Modal Nav Buttons
    const modalPrev = document.getElementById('modalPrevBtn');
    const modalNext = document.getElementById('modalNextBtn');
    if (modalPrev) modalPrev.addEventListener('click', () => navigateModal(-1));
    if (modalNext) modalNext.addEventListener('click', () => navigateModal(1));

    // Modal Zoom
    const zoomBtn = document.getElementById('zoomToggleBtn');
    const modalImgContainer = document.getElementById('modalImgContainer');
    if (zoomBtn && modalImgContainer) {
      zoomBtn.addEventListener('click', () => {
        modalImgContainer.classList.toggle('zoomed');
        zoomBtn.textContent = modalImgContainer.classList.contains('zoomed') ? 'تصغير الحجم' : 'تكبير التفاصيل';
      });
    }

    // Modal Voice Signature Play Button
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

    // Modal Speech Narrator Button
    const speechBtn = document.getElementById('speechNarratorBtn');
    if (speechBtn) {
      speechBtn.addEventListener('click', () => {
        const art = state.filteredArtworks[state.currentModalIndex];
        if (art) {
          toggleSpeechNarration(art, speechBtn);
        }
      });
    }

    // Back to Top Button
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

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('hudModal');
      if (modal && modal.classList.contains('open')) {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowLeft') {
          navigateModal(1); // RTL previous/next orientation
        } else if (e.key === 'ArrowRight') {
          navigateModal(-1);
        }
      }
    });
  }

  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    populateArtistDropdown();
    applyFilters();
    setupEvents();
  });
})();
