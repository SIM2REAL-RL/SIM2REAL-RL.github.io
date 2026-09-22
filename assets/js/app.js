/* Sim2Real-RL project page. No analytics, cookies, storage, CDNs, or external requests. */
(() => {
  'use strict';
  const C = window.SITE_CONTENT;
  const M = window.SITE_MEDIA || { videos: {}, posters: {}, figures: {} };
  if (!C || !Array.isArray(C.tasks) || !C.tasks.length) {
    document.body.insertAdjacentHTML('afterbegin', '<p class="noscript-note">The page content could not be loaded. Check assets/js/content.js.</p>');
    return;
  }
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const paths = {
    play: '<path d="m8 5 11 7-11 7z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    paper: '<path d="M14 3H5v18h14V8zM14 3v6h5M8 13h8M8 17h6"/>',
    code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',
    columns: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>',
    layers: '<path d="m12 3 10 5-10 5L2 8zm-9 10 9 5 9-5M3 18l9 5 9-5"/>',
    restart: '<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',
    check: '<path d="m5 12 4 4 10-10"/><circle cx="12" cy="12" r="10"/>',
    cube: '<path d="m12 3 9 5v9l-9 5-9-5V8zm0 10v9M3 8l9 5 9-5M7 5.8l9 5"/>',
    push: '<path d="M5 4h14v5h-5v12h-4V9H5zM1 16h5m-2-2 2 2-2 2"/>',
    stack: '<path d="m12 2 6 3v6l-6 3-6-3V5zm0 6v6M6 5l6 3 6-3M6 11l-4 2v6l6 3 4-2 4 2 6-3v-6l-4-2M2 13l6 3 4-2 4 2 6-3M8 16v6m8-6v6m-4-8v6"/>',
    drawer: '<path d="M4 3h16v7H4zM4 10l-2 5v6h20v-6l-2-5M2 15h20M9 18h6M4 6h16"/>',
    hanger: '<path d="M10 6a2.5 2.5 0 1 1 4 2c-1.5 1-2 1.5-2 3m0 0L2 18c-.8.6-.4 2 .6 2h18.8c1 0 1.4-1.4.6-2z"/>',
    'door-open': '<path d="M5 22V2h14v20M5 2l10 4v16l-10-4m7-5h.1M17 12h6m-3-3 3 3-3 3"/>',
    'door-close': '<path d="M5 2h14v20H5zM15 12h.1M1 12h8m-3-3 3 3-3 3"/>'
  };
  function icon(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.cube}</svg>`;
  }
  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function localAsset(value) {
    // Recordings are same-site assets by design. No remote media or tracking embeds.
    if (typeof value !== 'string' || !value.trim()) return '';
    const s = value.trim();
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(s) || s.split('/').includes('..')) return '';
    return s;
  }
  function videoSource(task, method, domain) {
    return localAsset(task.media?.[method]?.[domain] || M.videos?.[task.id]?.[method]?.[domain]);
  }
  function posterSource(task) { return localAsset(M.posters?.[task.id]); }
  function getTask(id) { return C.tasks.find(t => t.id === id) || C.tasks[0]; }
  function getMethod(id) { return C.methods.find(m => m.id === id); }
  function rate(result) {
    if (!result || !Number.isInteger(result.successes) || !Number.isInteger(result.trials) ||
        result.trials <= 0 || result.successes < 0 || result.successes > result.trials) return null;
    return 100 * result.successes / result.trials;
  }
  function pauseWithin(root) { $$('video', root).forEach(v => v.pause()); }
  let toastTimer;
  function toast(message) {
    const n = $('#toast'); n.textContent = message; n.classList.add('is-visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => n.classList.remove('is-visible'), 3300);
  }
  function videoFrame({ task, method = 'ours', domain = 'real', source, poster = '', controls = true, label = true }) {
    const src = localAsset(source === undefined ? videoSource(task, method, domain) : source);
    const frame = el('div', 'video-frame');
    if (label) {
      const badge = el('div', 'media-domain-label' + (domain === 'real' ? ' is-real' : ''), domain === 'sim' ? 'SIMULATION' : domain === 'overview' ? 'OVERVIEW' : 'REAL WORLD');
      frame.append(badge);
    }
    const placeholder = el('div', 'media-placeholder');
    const visual = el('span', 'placeholder-icon'); visual.innerHTML = icon(src ? 'play' : task.icon);
    placeholder.append(visual, el('span', 'placeholder-title', task.name), el('span', 'placeholder-note', src ? 'Play recorded rollout' : 'Video not added yet'));
    if (poster && !src) {
      const image = el('img', 'video-poster'); image.src = poster; image.alt = `${task.name} preview`;
      image.addEventListener('error', () => { image.remove(); frame.classList.remove('has-poster'); }, { once: true });
      frame.append(image); frame.classList.add('has-poster');
    }
    frame.append(placeholder);
    if (!src) return frame;
    const video = el('video');
    video.src = src; video.preload = 'none'; video.muted = true; video.defaultMuted = true;
    video.playsInline = true; video.controls = controls; video.loop = !controls;
    video.setAttribute('playsinline', ''); video.setAttribute('muted', '');
    video.setAttribute('aria-label', `${getMethod(method)?.name || C.title} — ${task.name} — ${domain === 'sim' ? 'simulation' : 'real-world'} recording`);
    if (poster) video.poster = poster;
    video.addEventListener('loadeddata', () => frame.classList.add('has-video'));
    video.addEventListener('playing', () => frame.classList.add('is-playing', 'has-video'));
    video.addEventListener('error', () => {
      frame.classList.remove('has-video', 'is-playing'); frame.dataset.unavailable = 'true';
      $('.placeholder-note', placeholder).textContent = 'Recording unavailable';
      visual.innerHTML = icon(task.icon);
      const cover = $('.poster-play', frame); if (cover) cover.remove();
    });
    frame.prepend(video);
    if (controls) {
      const cover = el('button', 'poster-play'); cover.type = 'button';
      cover.setAttribute('aria-label', `Play ${task.name} ${domain} recording`);
      cover.addEventListener('click', async () => {
        try { await video.play(); cover.remove(); } catch (_) { toast('The video could not start. Check the file path and browser-supported encoding.'); }
      });
      video.addEventListener('playing', () => cover.remove(), { once: true });
      frame.append(cover);
    }
    return frame;
  }

  // Project identity and optional links. Missing links are explicit, never dead destinations.
  $('#venue-text').textContent = C.venue;
  $('#authors').textContent = C.authors;
  document.title = `${C.title} | Anonymous project page`;
  if (C.title !== 'Sim2Real-RL') $('#paper-title').textContent = C.title;
  $('#paper-subtitle').textContent = C.subtitle;
  function configureLink(selector, value, label) {
    const a = $(selector);
    if (value) {
      a.href = value; a.removeAttribute('aria-disabled'); a.title = label;
      a.target = '_blank'; a.rel = 'noopener noreferrer'; $('.link-status', a)?.remove();
    } else {
      a.addEventListener('click', e => { e.preventDefault(); toast(`${label} has not been linked on this page.`); });
    }
  }
  configureLink('#paper-link', localAsset(M.paper), 'Anonymous manuscript');
  configureLink('#code-link', /^https:\/\//i.test(C.codeUrl || '') ? C.codeUrl : '', 'Anonymous code');
  $$('[data-icon]').forEach(n => { n.innerHTML = icon(n.dataset.icon); });

  // Featured rollout; the overview is optional, not a fabricated montage.
  const featured = getTask(C.featuredTask);
  $('#featured-label').textContent = `${featured.name} · task-specific policy`;
  if (localAsset(M.overview)) {
    $('#hero-media').classList.add('is-overview');
    $('#hero-media').append(videoFrame({ task: { ...featured, name: 'Project overview' }, domain: 'overview', source: M.overview }));
    $('#featured-label').textContent = 'Project overview';
  } else {
    ['sim', 'real'].forEach(domain => $('#hero-media').append(videoFrame({ task: featured, domain })));
  }

  let galleryDomain = 'real';
  function renderGallery() {
    const grid = $('#task-grid'); pauseWithin(grid); grid.replaceChildren();
    C.tasks.forEach(task => {
      const article = el('article', 'task-card');
      const button = el('button', 'task-card-button'); button.type = 'button';
      button.setAttribute('aria-label', `Inspect ${task.name}: simulation and real-world recordings`);
      const frame = videoFrame({ task, domain: galleryDomain, poster: posterSource(task), controls: false });
      const copy = el('div', 'task-card-copy'), header = el('div', 'task-card-header');
      header.append(el('h3', '', task.name), el('span', 'task-card-arrow', '↗'));
      const category = el('p', 'task-card-category'); category.append(el('span', '', task.number), el('span', '', task.category));
      copy.append(header, category); button.append(frame, copy); article.append(button); grid.append(article);
      button.addEventListener('click', () => openTask(task));
      if (window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
        button.addEventListener('mouseenter', () => { const v = $('video', frame); if (v) v.play().catch(() => {}); });
        button.addEventListener('mouseleave', () => pauseWithin(frame));
      }
    });
    const cta = el('a', 'task-card gallery-cta'); cta.href = '#comparison';
    cta.append(el('span', 'cta-top', 'BEYOND THE DEMO'), el('strong', '', 'Compare the methods.'));
    const end = el('span', '', 'Four baseline approaches'); end.append(el('b', '', '↗')); cta.append(end); grid.append(cta);
  }
  $$('#gallery-domain button').forEach(button => button.addEventListener('click', () => {
    galleryDomain = button.dataset.domain;
    $$('#gallery-domain button').forEach(b => { const on = b === button; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    renderGallery();
  }));
  renderGallery();

  let activeTask = C.tasks[0].id;
  C.tasks.forEach(task => {
    const b = el('button'); b.type = 'button'; b.dataset.taskId = task.id;
    b.append(el('span', '', task.number), el('span', '', task.name));
    b.addEventListener('click', () => { activeTask = task.id; renderComparison(); });
    $('#comparison-tasks').append(b);
  });
  function comparisonCard(task, method, domain) {
    const card = el('article', 'method-video-card' + (method.id === 'ours' ? ' is-ours' : ''));
    const head = el('div', 'method-video-head'); head.append(el('span', '', method.name));
    if (method.id === 'ours') head.append(el('span', 'ours-label', 'OURS'));
    const foot = el('div', 'method-video-meta');
    foot.append(el('span', '', domain === 'real' ? 'Real-world success rate' : 'Simulation recording'));
    const r = domain === 'real' ? rate(task.results?.[method.id]) : null;
    foot.append(el('strong', '', r === null ? '—' : `${r.toFixed(1)}%`));
    card.append(head, videoFrame({ task, method: method.id, domain }), foot);
    return card;
  }
  function availableComparisonVideos() {
    return $$('#comparison-videos .video-frame:not([data-unavailable]) video');
  }
  function updatePlayLabel() {
    const playing = availableComparisonVideos().some(v => !v.paused && !v.ended);
    $('#play-all-label').textContent = playing ? 'Pause all' : 'Play together';
    $('#play-all .small-icon').innerHTML = icon(playing ? 'pause' : 'play');
  }
  function renderComparison() {
    const task = getTask(activeTask), domain = $('#comparison-domain').value, baseline = $('#baseline-select').value;
    $('#comparison-category').textContent = task.category;
    $('#comparison-task-name').textContent = task.name;
    $('#comparison-task-count').textContent = `${task.number} / ${String(C.tasks.length).padStart(2, '0')}`;
    $$('#comparison-tasks button').forEach(b => { const on = b.dataset.taskId === task.id; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    const grid = $('#comparison-videos'); pauseWithin(grid); grid.replaceChildren(); grid.classList.toggle('all-methods', baseline === 'all');
    C.methods.filter(method => method.id === 'ours' || baseline === 'all' || method.id === baseline).forEach(method => grid.append(comparisonCard(task, method, domain)));
    const videos = availableComparisonVideos();
    $('#play-all').disabled = !videos.length; $('#restart-all').disabled = !videos.length;
    videos.forEach(v => {
      v.playbackRate = Number($('#playback-speed').value);
      ['play', 'pause', 'ended'].forEach(event => v.addEventListener(event, updatePlayLabel));
      v.addEventListener('error', () => { setTimeout(() => { const any = availableComparisonVideos().length; $('#play-all').disabled = !any; $('#restart-all').disabled = !any; updatePlayLabel(); }, 0); });
    });
    $('#playback-note').textContent = videos.length ? 'Playback controls align clip starts for viewing; they do not establish matched initial conditions.' : 'No recordings have been added for this selection. Playback controls become available when videos are linked.';
    updatePlayLabel();
  }
  ['#baseline-select', '#comparison-domain'].forEach(selector => $(selector).addEventListener('change', renderComparison));
  $('#playback-speed').addEventListener('change', () => availableComparisonVideos().forEach(v => { v.playbackRate = Number($('#playback-speed').value); }));
  async function startTogether() {
    const videos = availableComparisonVideos(); if (!videos.length) return;
    videos.forEach(v => { try { v.currentTime = 0; } catch (_) {} v.playbackRate = Number($('#playback-speed').value); });
    const outcomes = await Promise.allSettled(videos.map(v => v.play()));
    const started = outcomes.filter(x => x.status === 'fulfilled').length;
    $('#playback-note').textContent = `${started} of ${videos.length} available clips started. Shared playback controls do not establish matched trial conditions.`;
    updatePlayLabel();
  }
  $('#play-all').addEventListener('click', () => {
    if (availableComparisonVideos().some(v => !v.paused && !v.ended)) { availableComparisonVideos().forEach(v => v.pause()); updatePlayLabel(); }
    else startTogether();
  });
  $('#restart-all').addEventListener('click', startTogether);
  renderComparison();

  function fillResult(cell, result) {
    const value = rate(result);
    if (value === null) { const mark = el('span', 'missing-value', '—'); mark.setAttribute('aria-label', 'Not reported'); cell.append(mark); return; }
    cell.append(el('span', 'result-rate', `${value.toFixed(1)}%`), el('span', 'result-count', `${result.successes} / ${result.trials}`));
    cell.setAttribute('aria-label', `${value.toFixed(1)} percent; ${result.successes} successes in ${result.trials} trials`);
  }
  const table = $('#results-table'), tr = el('tr');
  const taskHead = el('th', '', 'Manipulation task'); taskHead.scope = 'col'; tr.append(taskHead);
  C.methods.forEach(method => { const th = el('th', method.id === 'ours' ? 'ours-cell' : '', method.name); th.scope = 'col'; tr.append(th); });
  $('thead', table).append(tr);
  C.tasks.forEach(task => {
    const row = el('tr'), label = el('th'); label.scope = 'row'; label.append(el('span', 'result-cell-label', task.number), document.createTextNode(task.name)); row.append(label);
    C.methods.forEach(method => { const td = el('td', method.id === 'ours' ? 'ours-cell' : ''); fillResult(td, task.results?.[method.id]); row.append(td); });
    $('tbody', table).append(row);
  });
  const meanRow = el('tr'), meanLabel = el('th', '', `Mean (${C.tasks.length} tasks)`); meanLabel.scope = 'row'; meanRow.append(meanLabel);
  C.methods.forEach(method => {
    const values = C.tasks.map(t => rate(t.results?.[method.id]));
    const td = el('td', method.id === 'ours' ? 'ours-cell' : '');
    if (values.every(v => v !== null)) td.textContent = `${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}%`;
    else td.append(el('span', 'missing-value', '—'));
    meanRow.append(td);
  });
  $('tfoot', table).append(meanRow);
  if (C.evaluationNote) { $('#evaluation-note').hidden = false; $('#evaluation-note').textContent = C.evaluationNote; }
  const curves = [['interactions', 'Success versus total environment interactions'], ['time', 'Success versus total training time']];
  curves.forEach(([key, caption]) => {
    const source = localAsset(M.figures?.[key]); if (!source) return;
    const figure = el('figure'), image = el('img'); image.src = source; image.alt = caption; image.loading = 'lazy';
    figure.append(image, el('figcaption', '', caption)); $('#curve-grid').append(figure); $('#learning-curves').hidden = false;
  });

  const taskDialog = $('#task-dialog'); let dialogTaskId = C.tasks[0].id;
  function openTask(task) {
    dialogTaskId = task.id; pauseWithin($('#task-grid'));
    $('#dialog-title').textContent = task.name; $('#dialog-category').textContent = `${task.number} / ${task.category}`;
    $('#dialog-description').textContent = task.description;
    const panel = $('#dialog-videos'); pauseWithin(panel); panel.replaceChildren();
    ['sim', 'real'].forEach(domain => panel.append(videoFrame({ task, domain })));
    taskDialog.showModal();
  }
  $('#dialog-compare').addEventListener('click', () => {
    activeTask = dialogTaskId; renderComparison(); taskDialog.close();
    $('#comparison').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    $('#comparison-task-name').setAttribute('tabindex', '-1'); $('#comparison-task-name').focus({ preventScroll: true });
  });
  $$('[data-figure]').forEach(button => button.addEventListener('click', () => {
    $('#figure-title').textContent = button.dataset.caption;
    $('#figure-dialog-image').src = button.dataset.figure;
    $('#figure-dialog-image').alt = button.dataset.caption;
    $('#figure-dialog').showModal();
  }));
  $$('dialog').forEach(dialog => {
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => pauseWithin(dialog));
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
  });
  const menu = $('.menu-toggle');
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(expanded)); menu.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    $('#site-nav').classList.toggle('is-open', expanded);
  });
  $$('#site-nav a').forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); $('#site-nav').classList.remove('is-open'); }));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) $$('#site-nav a').forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-12% 0px -70% 0px' });
    $$('#overview, #tasks, #comparison, #method, #results').forEach(section => observer.observe(section));
    const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) pauseWithin(entry.target); }), { rootMargin: '100px' });
    ['#hero-media', '#task-grid', '#comparison-videos'].forEach(selector => videoObserver.observe($(selector)));
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) $$('video').forEach(v => v.pause()); });
})();
