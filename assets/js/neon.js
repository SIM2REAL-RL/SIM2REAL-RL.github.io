/* Sim2Real-RL / Sunset / Orange, Pink & Yellow. No dependencies, tracking, remote assets, or storage. */
(() => {
  'use strict';
  const C = window.SITE_CONTENT;
  const M = window.SITE_MEDIA || {};


  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const node = (tag, cls = '', text) => {
    const e = document.createElement(tag); if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text; return e;
  };
  if (!C || !Array.isArray(C.tasks) || !C.tasks.length || !Array.isArray(C.methods)) {
    const error = node('p', 'noscript', 'The task configuration could not load. Check assets/js/content.js.');
    document.querySelector('main').prepend(error); return;
  }
  // Update only untouched wording shipped in earlier versions. No user data is overwritten.
  const replaceOriginal = (entry, field, before, after) => {
    if (entry && entry[field] === before) entry[field] = after;
  };
  replaceOriginal(C?.methods?.find(m => m.id === 'bc'), 'description', 'Behavioral cloning student', 'BC visual student');
  replaceOriginal(C?.methods?.find(m => m.id === 'dagger'), 'description', 'Interactive imitation student', 'DAgger visual student');
  replaceOriginal(C?.tasks?.find(t => t.id === 'drawer-opening'), 'description', 'Open a drawer through robot–object interaction.', 'Pull a drawer open.');
  replaceOriginal(C?.tasks?.find(t => t.id === 'door-opening'), 'description', 'Open a door through articulated interaction.', 'Open a hinged door.');
  replaceOriginal(C?.tasks?.find(t => t.id === 'door-closing'), 'description', 'Move an open door into its closed configuration.', 'Close an open door.');
  const icons = {
    play: '<path d="m8 5 11 7-11 7z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    restart: '<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.play}</svg>`;
  $$('[data-icon]').forEach(e => { e.innerHTML = icon(e.dataset.icon); });
  function safeAsset(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    const v = value.trim();
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(v) || v.split('/').includes('..') || v.includes('\\')) return '';
    return v;
  }
  const taskById = id => C.tasks.find(t => t.id === id) || C.tasks[0];
  const methodById = id => C.methods.find(m => m.id === id);
  const videoSource = (task, method, domain) => safeAsset(task.media?.[method]?.[domain] || M.videos?.[task.id]?.[method]?.[domain]);
  const posterSource = task => safeAsset(M.posters?.[task.id]);
  const getRate = r => r && Number.isInteger(r.successes) && Number.isInteger(r.trials) && r.trials > 0 && r.successes >= 0 && r.successes <= r.trials ? 100 * r.successes / r.trials : null;
  const pauseWithin = root => $$('video', root).forEach(v => v.pause());
  let toastTimer;
  function toast(text) {
    const e = $('#toast'); e.textContent = text; e.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => e.classList.remove('visible'), 4200);
  }
  // The line drawings are task identifiers, not generated experimental evidence.
  function taskDrawing(task) {
    const box = (x, y, s, color = '#ff9859', ghost = false) => `<g ${ghost ? 'stroke-dasharray="4 5" opacity=".30"' : ''} stroke="${color}" stroke-width="1.2"><path d="M${x},${y - s}l${s},${s/2}v${s}l${-s},${s/2}l${-s},${-s/2}v${-s}Z" fill="${ghost ? 'none' : '#25150f'}"/><path d="M${x-s},${y-s/2}l${s},${s/2}l${s},${-s/2}M${x},${y}v${s}"/><path d="M${x-s},${y-s/2}l${s},${-s/2}l${s},${s/2}l${-s},${s/2}Z" fill="${color}" fill-opacity=".06"/></g>`;
    let shape = '';
    switch (task.id) {
      case 'pick-cube':
        shape = box(158,151,24,'#ba8398',true)+box(158,106,31)+ '<path d="M158 24v20m-21 3h42v18m-42-18v18m-7 62v-27m-5 5 5-5 5 5" stroke="#f3e4d4"/><path d="M158 137v35" stroke="#936747" stroke-dasharray="3 5"/>'; break;
      case 'push-t':
        shape = '<g transform="translate(177 85) rotate(-29) skewX(22) scale(.8 .53)" stroke="#d7a5b8"><path d="M-56-48H56V-12H18V62H-18V-12H-56Z" stroke-dasharray="6 7" fill="none" opacity=".6"/></g><g transform="translate(123 126) rotate(-12) skewX(22) scale(.8 .53)" stroke="#ff9859"><path d="M-56-48H56V-12H18V62H-18V-12H-56Z" fill="#2c1912"/><path d="M-56-48H56V-12H18V62H-18V-12H-56Z" transform="translate(0 -5)" fill="#241510"/></g><path d="M99 154Q90 104 134 85m-8 1 8-1-3 8" stroke="#ffdf79" stroke-dasharray="3 4"/>'; break;
      case 'stack-cube':
        shape = box(160,140,31,'#ae7e77')+box(160,84,31)+ '<path d="M160 20v17m-5-5 5 5 5-5M119 119h-16m117 0h-17" stroke="#e6c5a5"/>'; break;
      case 'drawer-opening':
        shape = '<path d="M76 66l66-33 98 47v81l-65 34-99-47Z" fill="#1b1111" stroke="#a97869"/><path d="M76 66l99 48 65-34M175 114v81" stroke="#a97869"/><path d="M106 98l65-31 81 39-65 34Z" fill="#1b1111" stroke="#ff9859"/><path d="M106 98v38l81 40v-36l65-34v36l-65 34" stroke="#ff9859" fill="none"/><path d="m138 134 19 9m-7-32 44 22m-7-7 7 7-10-1" stroke="#ffdf79"/>'; break;
      case 'hanger-placement':
        shape = '<path d="M207 42v135m-42 20 42-20 37 20M131 64l91-38" stroke="#a17a82"/><path d="M149 83c-15-14-4-29 7-27 16 4 10 18 0 25v12l-60 69q-3 5 3 7l108-18q8-2 1-7l-52-51" stroke="#ff9859" fill="#ff985906"/><path d="M155 52l22-12m-10 1 10-1-4 8" stroke="#ffdf79" stroke-dasharray="3 4"/>'; break;
      case 'door-opening':
        shape = '<path d="M104 170V49l75-33v119M102 49l75 17v119l-75-15Z" stroke="#a77c70" fill="#1b1111"/><path d="M104 49l88 51v116l-88-46Z" stroke="#ff9859" fill="#251611"/><path d="m171 142 8 5M121 187q55 15 88-27m-9 0 9 0-2 8" stroke="#ffdf79"/>'; break;
      case 'door-closing':
        shape = '<path d="M109 174V50l77-35v119l-77 40Z" stroke="#ff9859" fill="#201310"/><path d="M110 51l73 40v120l-73-37Z" stroke="#b08193" stroke-dasharray="4 5"/><path d="m168 102 7-3M203 171q-39 25-72 11m6 7-6-7 9-2" stroke="#ffdf79"/>'; break;
      default: shape = box(160,118,38);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 230" fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g stroke="#4e302b" stroke-width=".7"><path d="M19 159 158 90 300 159 161 226ZM54 177l141-70M88 194l141-71M123 211l140-70M54 142l142 70M88 125l143 70M123 108l143 70"/></g><g>${shape}</g></svg>`;
  }
  const videoObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => { if (!e.isIntersecting) e.target.pause(); });
  }, { rootMargin: '140px' }) : null;
  function removeMedia(root) {
    $$('video', root).forEach(v => { v.pause(); videoObserver?.unobserve(v); v.removeAttribute('src'); v.load(); });
    root.replaceChildren();
  }
  function mediaFrame(task, method = 'ours', domain = 'real', override = undefined) {
    const src = override === undefined ? videoSource(task, method, domain) : safeAsset(override);
    const frame = node('div', 'media-frame'); frame.dataset.task = task.id;
    const label = node('span', 'media-corner-label' + (domain === 'real' ? ' real' : ''), domain === 'sim' ? 'SIMULATION' : domain === 'overview' ? 'OVERVIEW VIDEO' : 'REAL ROBOT');
    const empty = node('div', 'media-placeholder');
    const drawing = node('div', 'media-art'); drawing.innerHTML = taskDrawing(task);
    const info = node('div', 'placeholder-info');
    const state = node('span', 'placeholder-state', src ? 'CLICK TO PLAY' : 'NO RECORDING LINKED');
    info.append(node('span', '', src ? 'RECORDED ROLLOUT' : 'TASK ILLUSTRATION'), state);
    empty.append(drawing, node('span', 'placeholder-cross'), node('span', 'placeholder-cross second'), info);
    frame.append(empty, label);
    const poster = method === 'ours' ? posterSource(task) : '';
    if (poster) {
      const p = node('img', 'actual-poster'); p.src = poster; p.alt = `${task.name} preview`;
      p.addEventListener('error', () => { p.remove(); frame.classList.remove('with-poster'); });
      frame.prepend(p); frame.classList.add('with-poster');
      if (!src) info.firstChild.textContent = 'TASK PREVIEW';
    }
    if (!src) return frame;
    const v = node('video'); v.src = src; v.preload = 'metadata'; v.muted = true; v.defaultMuted = true;
    v.controls = true; v.playsInline = true; v.setAttribute('playsinline', '');
    v.setAttribute('aria-label', `${task.name}, ${methodById(method)?.name || C.title}, ${domain === 'real' ? 'real robot' : domain === 'sim' ? 'simulation' : 'overview'} recording`);
    if (poster) v.poster = poster;
    const cover = node('button', 'poster-play'); cover.type = 'button';
    cover.setAttribute('aria-label', `Play ${task.name} ${methodById(method)?.name || ''} ${domain === 'real' ? 'real robot' : domain === 'sim' ? 'simulation' : 'overview'} recording`);
    const play = node('span'); play.innerHTML = icon('play'); cover.append(play);
    cover.addEventListener('click', async () => { try { await v.play(); } catch (_) { toast('The recording could not start. Check its path and encoding.'); } });
    v.addEventListener('loadeddata', () => frame.classList.add('ready'));
    v.addEventListener('playing', () => { cover.remove(); frame.classList.add('ready', 'playing'); $('.actual-poster', frame)?.remove(); });
    v.addEventListener('pause', () => frame.classList.remove('playing'));
    v.addEventListener('error', () => {
      frame.classList.remove('ready', 'playing'); frame.classList.add('unavailable'); cover.remove();
      state.textContent = 'RECORDING UNAVAILABLE'; info.firstChild.textContent = 'CHECK VIDEO FILE';
    });
    frame.prepend(v); frame.append(cover); videoObserver?.observe(v); return frame;
  }
  // The drawn title is deliberately independent from installed fonts.
  $('#venue').textContent = C.venue; $('#footer-venue').textContent = C.venue;
  $('#authors').textContent = C.authors; $('#subtitle').textContent = C.subtitle;
  document.title = `${C.title} — ${C.subtitle || 'Anonymous project page'}`;
  if (C.title !== 'Sim2Real-RL') $('#paper-title').textContent = C.title;
  function configureLink(id, url, what) {
    const a = $(id);
    if (url) { a.href = url; a.removeAttribute('aria-disabled'); a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    else { a.title = `${what} is not linked yet`; a.addEventListener('click', e => { e.preventDefault(); toast(`${what} is not linked yet.`); }); }
  }
  configureLink('#paper-link', safeAsset(M.paper), 'The anonymous manuscript');
  configureLink('#code-link', /^https:\/\//i.test(C.codeUrl || '') ? C.codeUrl : '', 'The anonymous code repository');

  // Task theater. The gallery and comparison keep independent selections.
  let galleryTask = taskById(C.featuredTask).id;
  let galleryDomain = 'real';
  C.tasks.forEach(task => {
    const b = node('button', 'task-choice'); b.type = 'button'; b.dataset.task = task.id;
    b.append(node('span', 'num', task.number), node('span', '', task.name), node('span', 'task-arrow', '↗'));
    b.addEventListener('click', () => { galleryTask = task.id; renderGallery(); }); $('#task-list').append(b);
    const film = node('button', 'film-item'); film.type = 'button'; film.dataset.task = task.id;
    film.setAttribute('aria-label', `Select ${task.name}`);
    const image = node('div', 'film-image'); image.innerHTML = taskDrawing(task);
    const poster = posterSource(task);
    if (poster) { const p = node('img'); p.src = poster; p.alt = ''; p.loading = 'lazy'; p.addEventListener('error', () => p.remove()); image.append(p); }
    image.append(node('span', 'film-index', task.number));
    film.append(image, node('span', 'film-name', task.name));
    film.addEventListener('click', () => { galleryTask = task.id; renderGallery(); }); $('#filmstrip').append(film);
  });
  function renderGallery() {
    const task = taskById(galleryTask);
    $('#gallery-name').textContent = task.name; $('#gallery-category').textContent = task.category;
    $('#gallery-description').textContent = task.description;
    const screen = $('#gallery-screen'); removeMedia(screen); screen.append(mediaFrame(task, 'ours', galleryDomain));
    $$('#task-list button, #filmstrip button').forEach(b => {
      const on = b.dataset.task === galleryTask; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
    });
  }
  $$('#gallery-domain button').forEach(b => b.addEventListener('click', () => {
    galleryDomain = b.dataset.domain;
    $$('#gallery-domain button').forEach(x => { const on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', String(on)); });
    renderGallery();
  }));
  renderGallery();
  if (safeAsset(M.overview)) {
    $('#overview-section').hidden = false;
    $('#overview-player').append(mediaFrame({ ...taskById(galleryTask), name: 'Project overview' }, 'ours', 'overview', M.overview));
  }

  let comparisonTask = galleryTask;
  let baseline = C.methods.find(m => m.id !== 'ours')?.id || 'all';
  C.tasks.forEach(task => {
    const b = node('button', '', task.name); b.type = 'button'; b.dataset.task = task.id;
    b.addEventListener('click', () => { comparisonTask = task.id; renderComparison(); }); $('#comparison-tasks').append(b);
  });
  [...C.methods.filter(m => m.id !== 'ours'), { id: 'all', name: 'All methods' }].forEach(m => {
    const b = node('button', '', m.name); b.type = 'button'; b.dataset.method = m.id;
    b.addEventListener('click', () => { baseline = m.id; renderComparison(); }); $('#baseline-tabs').append(b);
  });
  $('#compare-selected').addEventListener('click', () => {
    comparisonTask = galleryTask; renderComparison(); $('#comparison').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  function availableVideos() { return $$('#comparison-videos .media-frame:not(.unavailable) video'); }
  function updateTransport() {
    const clips = availableVideos(); const playing = clips.some(v => !v.paused && !v.ended);
    $('#play-all').disabled = !clips.length; $('#restart-all').disabled = !clips.length;
    $('#play-label').textContent = playing ? 'Pause together' : 'Play together';
    $('#play-all [data-icon]').innerHTML = icon(playing ? 'pause' : 'play');
  }
  function comparisonCard(task, m, domain) {
    const card = node('article', 'comparison-card' + (m.id === 'ours' ? ' ours' : ''));
    const head = node('div', 'method-player-head');
    head.append(node('span', 'method-name', m.name), node('span', 'method-category', m.id === 'ours' ? 'OUR METHOD' : m.description));
    const foot = node('div', 'method-player-foot');
    foot.append(node('span', '', domain === 'real' ? 'REAL-WORLD SUCCESS RATE' : 'SIMULATION RECORDING'));
    const result = task.results?.[m.id]; const r = domain === 'real' ? getRate(result) : null;
    const val = node('strong', '', r === null ? '—' : `${r.toFixed(1)}%`);
    if (r !== null) val.append(node('span', 'trial-count', `${result.successes}/${result.trials}`));
    foot.append(val); card.append(head, mediaFrame(task, m.id, domain), foot); return card;
  }
  let playGeneration = 0;
  function renderComparison() {
    playGeneration++;
    const task = taskById(comparisonTask); const domain = $('#comparison-domain').value;
    $$('#comparison-tasks button').forEach(b => { const on = b.dataset.task === comparisonTask; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
    $$('#baseline-tabs button').forEach(b => { const on = b.dataset.method === baseline; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
    const grid = $('#comparison-videos'); removeMedia(grid); grid.classList.toggle('all-methods', baseline === 'all');
    C.methods.filter(m => m.id === 'ours' || baseline === 'all' || m.id === baseline).forEach(m => grid.append(comparisonCard(task, m, domain)));
    const clips = availableVideos();
    clips.forEach(v => {
      v.playbackRate = Number($('#playback-speed').value);
      ['play','pause','ended','error'].forEach(name => v.addEventListener(name, () => { updateTransport(); }));
    });
    $('#playback-note').textContent = clips.length ? 'Shared controls start the clips together; trial conditions may differ.' : 'Add recordings to enable shared playback.';
    updateTransport();
  }
  async function playTogether() {
    const clips = availableVideos(); if (!clips.length) return;
    const generation = ++playGeneration;
    clips.forEach(v => { try { v.currentTime = 0; } catch (_) {} v.playbackRate = Number($('#playback-speed').value); });
    const outcomes = await Promise.allSettled(clips.map(v => v.play()));
    if (generation !== playGeneration) return;
    const n = outcomes.filter(o => o.status === 'fulfilled').length;
    $('#playback-note').textContent = `${n}/${clips.length} clips started. Shared playback does not imply matched trial conditions.`;
    updateTransport();
  }
  $('#comparison-domain').addEventListener('change', renderComparison);
  $('#playback-speed').addEventListener('change', () => availableVideos().forEach(v => { v.playbackRate = Number($('#playback-speed').value); }));
  $('#play-all').addEventListener('click', () => {
    if (availableVideos().some(v => !v.paused && !v.ended)) { playGeneration++; availableVideos().forEach(v => v.pause()); updateTransport(); }
    else playTogether();
  });
  $('#restart-all').addEventListener('click', playTogether);
  renderComparison();

  // Method tabs implement the standard arrow-key / Home / End pattern.
  function activateMethod(tab) {
    $$('.method-tabs [role=tab]').forEach(b => {
      const on = b === tab; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      $('#' + b.getAttribute('aria-controls')).hidden = !on;
    });
  }
  const tabs = $$('.method-tabs [role=tab]');
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => activateMethod(b));
    b.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      else return;
      e.preventDefault(); tabs[next].focus(); activateMethod(tabs[next]);
    });
  });
  const dialog = $('#figure-dialog');
  $$('[data-figure]').forEach(b => b.addEventListener('click', () => {
    const embedded = $('img', b)?.getAttribute('src') || '';
    $('#figure-image').src = /^data:image\/(?:png|jpeg|webp);base64,/i.test(embedded) ? embedded : safeAsset(b.dataset.figure); $('#figure-image').alt = b.dataset.caption;
    $('#figure-caption').textContent = b.dataset.caption; dialog.showModal();
  }));
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const b = dialog.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) dialog.close();
  });

  const head = node('tr'); head.append(node('th', '', 'TASK / METHOD'));
  C.methods.forEach(m => head.append(node('th', m.id === 'ours' ? 'ours' : '', m.name))); $('#result-head').append(head);
  C.tasks.forEach(task => {
    const tr = node('tr'); const name = node('th', '', task.name); name.scope = 'row'; tr.append(name);
    C.methods.forEach(m => {
      const cell = node('td', m.id === 'ours' ? 'ours' : ''); const result = task.results?.[m.id]; const r = getRate(result);
      if (r === null) { cell.textContent = '—'; cell.setAttribute('aria-label', 'Not reported'); }
      else { cell.append(node('span', 'result-rate', `${r.toFixed(1)}%`), node('span', 'result-count', `${result.successes} / ${result.trials}`)); }
      tr.append(cell);
    }); $('#result-body').append(tr);
  });
  if (C.evaluationNote) $('#evaluation-note').textContent = C.evaluationNote;
  [['interactions','Success rate vs. total environment interactions'],['time','Success rate vs. total training time']].forEach(([key, label]) => {
    const src = safeAsset(M.figures?.[key]); if (!src) return;
    const f = node('figure'); const img = node('img'); img.src = src; img.alt = label; img.loading = 'lazy';
    f.append(img, node('figcaption', '', label)); $('#learning-curves').append(f); $('#learning-curves').hidden = false;
  });
  const menu = $('.menu');
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); $('#nav').classList.toggle('open', open); });
  $$('#nav a').forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); $('#nav').classList.remove('open'); }));
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) $$('#nav a').forEach(a => a.classList.toggle('current', a.hash === '#' + e.target.id));
    }), { rootMargin: '-15% 0px -65% 0px' });
    $$('.section').forEach(e => obs.observe(e));
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseWithin(document); });

  // Lightweight, original robot illustration. This is not a physics simulator or policy demo.
  // Canvas 2D projects a faceted mesh; no 3D library, external model, or network request.
  function initArm() {
    const canvas = $('#arm-canvas'); const ctx = canvas.getContext('2d'); if (!ctx) return;
    const host = $('.stage-canvas-wrap'); const toggle = $('#motion-toggle');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let automatic = !reduced.matches, visible = true, frameId = 0, w = 0, h = 0, yaw = -.29;
    let targetYaw = yaw, targetTilt = .51, tilt = targetTilt, dragging = false, prevX = 0;
    const pixelRatio = Math.min(devicePixelRatio || 1, 1.75);
    const add = (a,b) => a.map((v,i)=>v+b[i]);
    const sub = (a,b) => a.map((v,i)=>v-b[i]);
    const mul = (a,k) => a.map(v=>v*k);
    const dot = (a,b) => a.reduce((s,v,i)=>s+v*b[i],0);
    const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const unit = a => mul(a,1/(Math.hypot(...a)||1));
    let scale = 100, orbit = yaw;
    const project = a => {
      const x = a[0]*Math.cos(orbit)-a[1]*Math.sin(orbit);
      const depth = a[0]*Math.sin(orbit)+a[1]*Math.cos(orbit);
      return [w*.475 + x*scale, h*.82 + (depth*tilt-a[2]*.94)*scale];
    };
    function line(points, stroke, width=1, dash=[]) {
      ctx.beginPath(); points.forEach((p,i)=>{const q=project(p);if(!i)ctx.moveTo(...q);else ctx.lineTo(...q);});
      ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
    }
    let faces = [];
    function face(points, color, edge='#836253', alpha=1) { faces.push({points,color,edge,alpha}); }
    function prism(a,b,r1,r2,color,edge='#805a4b',sides=6) {
      const axis = unit(sub(b,a)); const right = unit(cross(axis, Math.abs(axis[1])>.9?[1,0,0]:[0,1,0])); const up = unit(cross(axis,right));
      const p=[],q=[];
      for(let i=0;i<sides;i++){const angle=(i/sides)*Math.PI*2+Math.PI/4;const delta=add(mul(right,Math.cos(angle)),mul(up,Math.sin(angle)));p.push(add(a,mul(delta,r1)));q.push(add(b,mul(delta,r2)));}
      face([...p].reverse(),color,edge);face(q,color,edge);
      for(let i=0;i<sides;i++) face([p[i],p[(i+1)%sides],q[(i+1)%sides],q[i]],color,edge);
    }
    function box(center,size,color,edge){
      const p=[];for(let z=-1;z<=1;z+=2)for(let y=-1;y<=1;y+=2)for(let x=-1;x<=1;x+=2)p.push(add(center,[x*size[0]/2,y*size[1]/2,z*size[2]/2]));
      [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]].forEach(ids=>face(ids.map(i=>p[i]),color,edge));
    }
    function joint(p,r=.22){prism(add(p,[0,-.24,0]),add(p,[0,.24,0]),r,r,[51,37,31],'#bb8768',12);prism(add(p,[0,-.265,0]),add(p,[0,-.243,0]),r*.7,r*.7,[216,178,98],'#ffdf79',12);}
    function draw(time=0){
      if(!w||!h)return;
      ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);ctx.clearRect(0,0,w,h);
      yaw+=(targetYaw-yaw)*.08;tilt+=(targetTilt-tilt)*.08;
      orbit=yaw+(automatic?Math.sin(time*.00023)*.025:0);scale=Math.min(w/4.9,h/3.85);
      // Floor grid, no simulated performance traces or fake telemetry.
      for(let t=-2.5;t<=2.51;t+=.5){line([[t,-1.7,0],[t,1.7,0]],'rgba(216,140,95,.14)',.7);line([[-2.5,t*.65,0],[2.5,t*.65,0]],'rgba(216,140,95,.14)',.7);}
      const ring=[];for(let i=0;i<=100;i++){const a=i*Math.PI/50;ring.push([Math.cos(a)*2.15,Math.sin(a)*1.4,-.005]);}line(ring,'rgba(225,150,153,.17)',.8,[3,7]);
      const origin=project([-.82,0,0]);ctx.save();ctx.translate(...origin);ctx.scale(1,.38);ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.ellipse(15,12,scale*.62,scale*.4,0,0,Math.PI*2);ctx.fill();ctx.restore();
      faces=[];
      // Base and serial arm: stylized proportions, not a reconstruction of experimental hardware.
      prism([-.9,0,.02],[-.9,0,.17],.53,.48,[32,23,23],'#90644b',8);
      prism([-.9,0,.17],[-.9,0,.53],.35,.28,[54,38,32],'#90644b',12);
      prism([-.9,0,.25],[-.9,0,.29],.355,.35,[220,149,81],'#ff9859',12);
      const a=[-.9,0,.66], b=[-1.17,0,1.8], c=[.17,0,2.45], d=[.99,0,1.74], e=[1.02,0,1.4];
      prism(a,b,.23,.195,[72,47,37],'#d29c75',4);
      prism(add(a,[0,-.18,.02]),add(b,[0,-.18,-.04]),.053,.048,[160,94,64],'#f9b889',4);
      prism(b,c,.185,.155,[78,48,41],'#dba182',4);
      prism(add(b,[0,-.155,.015]),add(c,[0,-.145,0]),.038,.04,[164,105,119],'#ffb6c9',4);
      prism(c,d,.17,.12,[70,46,36],'#ce9676',6);
      prism(d,e,.13,.12,[130,103,84],'#e3c7b4',8);
      joint(a,.28);joint(b,.25);joint(c,.2);joint(d,.15);
      // Parallel-jaw end effector, silver graphite faces.
      box([1.02,0,1.37],[.49,.22,.16],[174,157,141],'#f3e3d5');
      box([.805,0,1.13],[.07,.16,.35],[162,143,129],'#eddbcd');
      box([1.235,0,1.13],[.07,.16,.35],[162,143,129],'#eddbcd');
      box([.835,0,.98],[.12,.16,.07],[126,105,92],'#debeaa');box([1.205,0,.98],[.12,.16,.07],[126,105,92],'#debeaa');
      box([1.02,0,.285],[.43,.43,.55],[223,106,153],'#ff9bc8');
      const camera=[Math.sin(orbit),Math.cos(orbit),-.55];
      faces.sort((a,b)=>dot(b.points.reduce((s,p)=>add(s,p),[0,0,0]).map(v=>v/b.points.length),camera)-dot(a.points.reduce((s,p)=>add(s,p),[0,0,0]).map(v=>v/a.points.length),camera));
      faces.forEach(f=>{
        const n=unit(cross(sub(f.points[1],f.points[0]),sub(f.points[2],f.points[0])));
        const light=.52+.65*Math.max(0,dot(n,unit([-.6,-.8,1])));
        ctx.beginPath();f.points.forEach((p,i)=>{const q=project(p);if(i)ctx.lineTo(...q);else ctx.moveTo(...q);});ctx.closePath();
        ctx.fillStyle=`rgb(${f.color.map(v=>Math.min(255,Math.round(v*light))).join(',')})`;ctx.fill();ctx.strokeStyle=f.edge;ctx.lineWidth=.72;ctx.stroke();
      });
      // Ghost-edge overlay is part of the cover artwork, not an attention map.
      line([[-.9,.22,.63],[-1.17,.22,1.8],[.17,.2,2.45],[.99,.12,1.74]],'rgba(255,114,178,.80)',1.1);
      line([[1.02,0,.56],[1.02,0,.9]],'rgba(255,223,121,.48)',.8,[3,5]);
      const goal=[];for(let i=0;i<=70;i++){const a=i*Math.PI/35;goal.push([1.02+Math.cos(a)*.49,Math.sin(a)*.49,.008]);}line(goal,'rgba(255,223,121,.65)',.9,[3,5]);
      // A tiny coordinate triad anchors the drawing.
      const axis=[-1.9,.9,.03];[['X',[.35,0,0],'#ff9859'],['Y',[0,.35,0],'#ff72b2'],['Z',[0,0,.35],'#ffdf79']].forEach(([label,vec,color])=>{line([axis,add(axis,vec)],color,.85);const p=project(add(axis,mul(vec,1.18)));ctx.font='8px monospace';ctx.fillStyle=color;ctx.fillText(label,p[0]-3,p[1]+3);});
    }
    function tick(t){frameId=0;draw(t);if(visible&&!document.hidden&&(automatic||dragging||Math.abs(targetYaw-yaw)>.001||Math.abs(targetTilt-tilt)>.001))frameId=requestAnimationFrame(tick);}
    function requestDraw(){if(!frameId&&visible&&!document.hidden)frameId=requestAnimationFrame(tick);}
    function resize(){const r=host.getBoundingClientRect();w=r.width;h=r.height;canvas.width=Math.round(w*pixelRatio);canvas.height=Math.round(h*pixelRatio);requestDraw();}
    function updateMotion(){toggle.setAttribute('aria-pressed',String(automatic));toggle.title=automatic?'Pause decorative motion':'Enable decorative motion';toggle.innerHTML=`Motion <span aria-hidden="true">${automatic?'Ⅱ':'▷'}</span>`;requestDraw();}
    toggle.addEventListener('click',()=>{automatic=!automatic;updateMotion();});
    reduced.addEventListener?.('change',()=>{automatic=!reduced.matches;updateMotion();});
    canvas.addEventListener('pointerdown',e=>{dragging=true;prevX=e.clientX;canvas.setPointerCapture(e.pointerId);requestDraw();});
    canvas.addEventListener('pointermove',e=>{
      if(dragging){targetYaw=Math.max(-1.1,Math.min(1.1,targetYaw+(e.clientX-prevX)*.007));prevX=e.clientX;requestDraw();}
      else if(e.pointerType==='mouse'&&automatic){const r=canvas.getBoundingClientRect();targetTilt=.49+((e.clientY-r.top)/r.height-.5)*.14;requestDraw();}
    });
    const release=()=>{dragging=false;requestDraw();};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
    canvas.addEventListener('pointerleave',()=>{if(!dragging){targetTilt=.51;requestDraw();}});
    if('IntersectionObserver'in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestDraw();else if(frameId){cancelAnimationFrame(frameId);frameId=0;}},{rootMargin:'50px'}).observe(canvas);}
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frameId);frameId=0;}else requestDraw();});
    if('ResizeObserver'in window)new ResizeObserver(resize).observe(host);else window.addEventListener('resize',resize);
    $('.hero').addEventListener('pointermove',e=>{if(!automatic||e.pointerType!=='mouse')return;const r=$('.hero').getBoundingClientRect();$('.hero').style.setProperty('--hx',`${(e.clientX/r.width-.5)*7}px`);$('.hero').style.setProperty('--hy',`${((e.clientY-r.top)/r.height-.5)*5}px`);});
    resize();updateMotion();
  }
  initArm();
})();
