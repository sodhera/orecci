// Speaking Coach free tools. Everything runs in the browser; nothing is sent to Speaking Coach.
(function () {
  'use strict';
  const NO_SPACE_LANGS = new Set(['ja', 'zh']);
  const el = (tag, attrs, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v);
    }
    for (const c of kids) if (c != null) n.append(c);
    return n;
  };
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function countWords(text, lang) {
    const t = text.trim();
    if (!t) return 0;
    if (NO_SPACE_LANGS.has(lang)) return Math.round(t.replace(/\s|[、。，．！？!?,.]/g, '').length / (lang === 'ja' ? 2.5 : 1.6));
    return t.split(/\s+/).filter(Boolean).length;
  }

  function findFillers(text, fillers, lang) {
    const counts = [];
    let marked = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    for (const f of [...fillers].sort((a, b) => b.length - a.length)) {
      const re = NO_SPACE_LANGS.has(lang)
        ? new RegExp(escRe(f), 'g')
        : new RegExp(`(^|[^\\p{L}\\p{N}])(${escRe(f)})(?=$|[^\\p{L}\\p{N}])`, 'giu');
      const n = (text.match(re) || []).length;
      if (n) {
        counts.push([f, n]);
        marked = marked.replace(re, NO_SPACE_LANGS.has(lang) ? '<mark>$&</mark>' : '$1<mark>$2</mark>');
      }
    }
    counts.sort((a, b) => b[1] - a[1]);
    return { counts, total: counts.reduce((s, [, n]) => s + n, 0), marked };
  }

  function stat(value, label) { return el('div', { class: 'stat' }, el('b', { text: String(value) }), el('span', { text: label })); }

  function paceNote(wpm, S) {
    if (!wpm) return '';
    if (wpm < 110) return S.pace_slow;
    if (wpm > 170) return S.pace_fast;
    return S.pace_good;
  }

  // Speech capture via the browser's recognition service.
  function makeRecorder(cfg, onUpdate, onDone) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    let rec, running = false, finals = [], interim = '', startedAt = 0, firstSpeech = 0, lastResult = 0, pauses = 0;
    const PAUSE_MS = 2000;
    function setup() {
      rec = new SR();
      rec.lang = cfg.speechLang || 'en-US';
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e) => {
        const now = performance.now();
        if (!firstSpeech) firstSpeech = now;
        if (lastResult && now - lastResult > PAUSE_MS) pauses++;
        lastResult = now;
        interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) finals.push(r[0].transcript.trim()); else interim += r[0].transcript;
        }
        onUpdate(text());
      };
      rec.onerror = (e) => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { running = false; onDone(null, e.error); } };
      rec.onend = () => { if (running) { try { rec.start(); } catch (_) { /* restarting */ } } };
    }
    const text = () => (finals.join(' ') + ' ' + interim).trim();
    return {
      start() { finals = []; interim = ''; pauses = 0; firstSpeech = 0; lastResult = 0; startedAt = performance.now(); running = true; setup(); rec.start(); },
      stop() {
        running = false;
        try { rec.stop(); } catch (_) { /* already stopped */ }
        const end = lastResult || performance.now();
        const speakingMs = Math.max(1000, end - (firstSpeech || startedAt));
        setTimeout(() => onDone({ text: text(), seconds: Math.round((performance.now() - startedAt) / 1000), speakingSeconds: speakingMs / 1000, pauses }), 400);
      },
    };
  }

  function results(box, cfg, data) {
    const S = cfg.strings;
    const words = countWords(data.text, cfg.lang);
    const minutes = data.speakingSeconds / 60;
    const wpm = minutes > 0 && words ? Math.round(words / minutes) : 0;
    const f = findFillers(data.text, cfg.fillers || [], cfg.lang);
    box.replaceChildren();
    const stats = el('div', { class: 'stats' });
    if (wpm) stats.append(stat(wpm, S.wpm));
    stats.append(stat(f.total, S.fillers));
    if (data.pauses != null) stats.append(stat(data.pauses, S.pauses));
    stats.append(stat(words, S.words));
    if (data.seconds) stats.append(stat(`${Math.floor(data.seconds / 60)}:${String(data.seconds % 60).padStart(2, '0')}`, S.duration));
    box.append(stats);
    if (wpm) box.append(el('p', { class: 'note', text: `${S.pace}: ${paceNote(wpm, S)}` }));
    if (f.counts.length) box.append(el('ul', { class: 'chips' }, ...f.counts.map(([w, n]) => el('li', { text: `${w} × ${n}` }))));
    else box.append(el('p', { class: 'note', text: S.no_fillers }));
    if (data.text) {
      const tr = el('div', { class: 'transcript' });
      tr.innerHTML = `<strong>${S.transcript}:</strong> ${f.marked}`;
      box.append(tr);
    }
    box.append(el('p', { class: 'note', text: S.next_step }));
  }

  function speechTool(root, cfg, opts) {
    const S = cfg.strings;
    const out = el('div', { 'aria-live': 'polite' });
    const status = el('p', { class: 'status' });
    let promptBox = null;
    if (cfg.prompts && cfg.prompts.length) {
      let i = 0;
      promptBox = el('div', { class: 'prompt-box', text: cfg.prompts[0] });
      root.append(el('label', { text: S.prompt_label }), promptBox,
        el('div', { class: 'row' }, el('button', { class: 'button secondary', type: 'button', text: S.next_prompt, onclick: () => { i = (i + 1) % cfg.prompts.length; promptBox.textContent = cfg.prompts[i]; } })));
    }
    const recorder = makeRecorder(cfg, (live) => { status.textContent = live ? `“${live.slice(-160)}”` : S.listening; }, (data, error) => {
      btn.textContent = S.start; btn.dataset.state = 'idle';
      if (!data) { status.textContent = error ? S.unsupported : ''; return; }
      status.textContent = '';
      results(out, cfg, data);
    });
    const btn = el('button', { class: 'button', type: 'button', text: S.start });
    btn.dataset.state = 'idle';
    btn.addEventListener('click', () => {
      if (btn.dataset.state === 'idle') { recorder.start(); btn.dataset.state = 'rec'; btn.replaceChildren(el('span', { class: 'rec-dot' }), S.stop); status.textContent = S.listening; out.replaceChildren(); }
      else recorder.stop();
    });
    if (recorder) root.append(el('div', { class: 'row' }, btn), status);
    else root.append(el('p', { class: 'status', text: S.unsupported }));
    // Paste fallback (always available).
    const ta = el('textarea', { 'aria-label': S.paste_label });
    const mins = el('input', { type: 'number', min: '0.1', step: '0.1', inputmode: 'decimal' });
    const paste = el('details', {}, el('summary', { text: S.paste_label }), el('label', { text: S.paste_label }), ta);
    if (opts.wantsTime) paste.append(el('label', { text: S.minutes_label }), mins);
    paste.append(el('div', { class: 'row' }, el('button', { class: 'button secondary', type: 'button', text: S.paste_button, onclick: () => {
      const m = parseFloat(mins.value);
      results(out, cfg, { text: ta.value, speakingSeconds: m > 0 ? m * 60 : 0, seconds: m > 0 ? Math.round(m * 60) : 0, pauses: null });
    } })));
    if (!recorder) paste.open = true;
    root.append(paste, out, el('p', { class: 'privacy', text: S.privacy }));
  }

  function paceTool(root, cfg) {
    speechTool(root, cfg, { wantsTime: true });
    const S = cfg.strings;
    const w = el('input', { type: 'number', min: '1', inputmode: 'numeric' });
    const m = el('input', { type: 'number', min: '0.1', step: '0.1', inputmode: 'decimal' });
    const res = el('p', { class: 'note', 'aria-live': 'polite' });
    const calc = () => { const wpm = Math.round(parseFloat(w.value) / parseFloat(m.value)); res.textContent = wpm > 0 && isFinite(wpm) ? `${wpm} ${S.wpm}. ${paceNote(wpm, S)}` : ''; };
    w.addEventListener('input', calc); m.addEventListener('input', calc);
    root.append(el('label', { text: S.words_label }), w, el('label', { text: S.minutes_label }), m, res);
  }

  function lengthTool(root, cfg) {
    const S = cfg.strings;
    const PACES = [[S.slow, 110], [S.average, 140], [S.fast, 170]];
    const words = el('input', { type: 'number', min: '1', inputmode: 'numeric', value: '500' });
    const minutes = el('input', { type: 'number', min: '0.5', step: '0.5', inputmode: 'decimal', value: '5' });
    const a = el('div', { class: 'stats', 'aria-live': 'polite' });
    const b = el('div', { class: 'stats', 'aria-live': 'polite' });
    const fmt = (min) => { const s = Math.round(min * 60); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
    const update = () => {
      const w = parseFloat(words.value), mi = parseFloat(minutes.value);
      a.replaceChildren(...(w > 0 ? PACES.map(([n, p]) => stat(fmt(w / p), `${n} (${p} ${S.wpm}) · ${S.length_result_minutes}`)) : []));
      b.replaceChildren(...(mi > 0 ? PACES.map(([n, p]) => stat(Math.round(mi * p), `${n} (${p} ${S.wpm}) · ${S.length_result_words}`)) : []));
    };
    words.addEventListener('input', update); minutes.addEventListener('input', update);
    root.append(el('label', { text: S.length_words }), words, a, el('label', { text: S.length_minutes }), minutes, b);
    update();
  }

  async function roleTool(root, cfg) {
    const S = cfg.strings;
    const input = el('input', { type: 'search', placeholder: S.role_placeholder, list: 'sc-roles', autocomplete: 'off' });
    const list = el('datalist', { id: 'sc-roles' });
    const out = el('div', { 'aria-live': 'polite' });
    root.append(el('label', { text: S.role_label }), input, list, out);
    let roles = [];
    try { roles = await (await fetch(cfg.rolesUrl)).json(); } catch (_) { out.textContent = S.role_none; return; }
    list.replaceChildren(...roles.map((r) => el('option', { value: r.role })));
    const show = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { out.replaceChildren(); return; }
      const r = roles.find((x) => x.role.toLowerCase() === q) || roles.find((x) => x.role.toLowerCase().includes(q));
      if (!r) { out.replaceChildren(el('p', { class: 'note', text: S.role_none })); return; }
      out.replaceChildren(el('h2', { text: r.role }), el('ol', { class: 'q-list' }, ...r.questions.map((x) => el('li', { text: x }))), el('a', { class: 'button secondary', href: r.url, text: S.role_open }));
    };
    input.addEventListener('input', show);
    input.addEventListener('change', show);
  }

  for (const root of document.querySelectorAll('section.tool')) {
    const cfg = JSON.parse(root.querySelector('.tool-config').textContent);
    const body = el('div', { class: 'tool-body' });
    root.append(body);
    if (cfg.tool === 'speech-checker' || cfg.tool === 'filler-counter') speechTool(body, cfg, { wantsTime: cfg.tool === 'speech-checker' });
    else if (cfg.tool === 'pace-checker') paceTool(body, cfg);
    else if (cfg.tool === 'speech-length') lengthTool(body, cfg);
    else if (cfg.tool === 'role-questions') roleTool(body, cfg);
  }
})();
