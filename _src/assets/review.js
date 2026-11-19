// The free AI voice review on Speaking Coach pages (English only).
// The reader records one answer; it goes to Speaking Coach's review server once, for transcription
// and feedback, and is not kept. Same allowance as the ChatGPT app: two reviews per network per day.
(function () {
  'use strict';
  const API = 'https://speaking-coach-plugin.vercel.app/api/site/review';
  const track = (event, props) => { try { if (window.scTrack) window.scTrack(event, props); } catch (e) {} };
  const el = (tag, attrs, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v);
    }
    for (const c of kids) if (c != null) n.append(c);
    return n;
  };
  const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Mono 16-bit PCM at 12 kHz keeps a 3-minute recording under the server's 4.4 MB limit.
  async function toWav(blob, cap) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx || !window.OfflineAudioContext) throw new Error('This browser can’t prepare the recording. Try Chrome, Edge or Safari.');
    const decoder = new Ctx();
    let source;
    try { source = await decoder.decodeAudioData(await blob.arrayBuffer()); }
    catch (e) { throw new Error('The recording couldn’t be read. Try again.'); }
    finally { try { await decoder.close(); } catch (e) {} }
    if (source.duration < 1.5) throw new Error('That was too short. Answer for at least a few seconds.');
    const rate = 12000;
    const frames = Math.min(Math.round(source.duration * rate), cap * rate);
    const offline = new OfflineAudioContext(1, frames, rate);
    const node = offline.createBufferSource(); node.buffer = source; node.connect(offline.destination); node.start();
    const samples = (await offline.startRendering()).getChannelData(0);
    let first = 0, last = samples.length;
    while (first < last && Math.abs(samples[first]) < 0.001) first++;
    while (last > first && Math.abs(samples[last - 1]) < 0.001) last--;
    first = Math.max(0, first - 1200); last = Math.min(samples.length, last + 1200);
    if (last - first < rate) throw new Error('No speech was picked up. Check your microphone and try again.');
    const pcm = samples.subarray(first, last), data = new ArrayBuffer(44 + pcm.length * 2), v = new DataView(data);
    const ascii = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    ascii(0, 'RIFF'); v.setUint32(4, data.byteLength - 8, true); ascii(8, 'WAVE'); ascii(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true);
    v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    ascii(36, 'data'); v.setUint32(40, pcm.length * 2, true);
    for (let i = 0; i < pcm.length; i++) { const c = Math.max(-1, Math.min(1, pcm[i])); v.setInt16(44 + i * 2, c * (c < 0 ? 32768 : 32767), true); }
    return new Blob([data], { type: 'audio/wav' });
  }

  function mount(box) {
    const cfg = JSON.parse(box.querySelector('.review-config').textContent);
    const cap = cfg.mode === 'speech' ? 180 : cfg.mode === 'smalltalk' ? 60 : 120;
    let stream, recorder, chunks = [], started = 0, timer, attempt = 0;

    const status = el('p', { class: 'status', role: 'status', 'aria-live': 'polite' });
    const consent = el('input', { type: 'checkbox', id: `consent-${cfg.slug}` });
    const recordBtn = el('button', { class: 'button', type: 'button', text: 'Start answering' });
    const stopBtn = el('button', { class: 'button', type: 'button', text: 'Stop and get feedback', hidden: '' });
    const timerEl = el('span', { class: 'review-timer', hidden: '' }, el('span', { class: 'rec-dot' }), el('span', { text: '0:00' }));
    const result = el('div', { class: 'review-result', hidden: '' });
    const upsell = box.querySelector('.review-upsell');

    const setup = el('div', { class: 'review-setup' },
      el('div', { class: 'prompt-box', text: cfg.question }),
      el('p', { class: 'review-how', text: `Answer out loud, up to ${cap / 60} minute${cap > 60 ? 's' : ''}. You get your pace, filler words and pauses, plus feedback that quotes what you said.` }),
      el('label', { class: 'review-consent', for: `consent-${cfg.slug}` }, consent,
        el('span', { text: 'This is my own voice. Send this one recording to Speaking Coach for feedback; it isn’t kept.' })),
      el('div', { class: 'row' }, recordBtn, stopBtn, timerEl),
      status);
    box.querySelector('.review-body').append(setup, result);

    const update = () => { recordBtn.disabled = !consent.checked; };
    consent.addEventListener('change', update); update();

    function stopTracks() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; }
    function finish() {
      clearInterval(timer);
      if (recorder && recorder.state === 'recording') recorder.stop();
      stopTracks(); stopBtn.hidden = true; timerEl.hidden = true;
    }

    recordBtn.addEventListener('click', async () => {
      if (!consent.checked) return;
      status.textContent = '';
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('This browser can’t record audio. Try Chrome, Edge or Safari.');
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const type = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus'].find((t) => MediaRecorder.isTypeSupported(t));
        recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
        chunks = [];
        recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
        recorder.onstop = () => send(new Blob(chunks, { type: recorder.mimeType }));
        recorder.start(250); started = performance.now();
        recordBtn.hidden = true; stopBtn.hidden = false; timerEl.hidden = false; result.hidden = true;
        track('site_review_record', { mode: cfg.mode, attempt: attempt + 1 });
        timer = setInterval(() => {
          const s = Math.floor((performance.now() - started) / 1000);
          timerEl.lastChild.textContent = `${clock(s)} / ${clock(cap)}`;
          if (s >= cap) finish();
        }, 250);
      } catch (e) {
        stopTracks();
        status.textContent = e && e.name === 'NotAllowedError' ? 'Allow the microphone for this page to record your answer.' : (e.message || 'Recording didn’t start. Try again.');
      }
    });
    stopBtn.addEventListener('click', finish);

    async function send(blob) {
      status.textContent = 'Listening to your answer… this takes about 15 seconds.';
      recordBtn.hidden = true;
      const t0 = performance.now();
      try {
        const wav = await toWav(blob, cap);
        const open = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: cfg.mode, question: cfg.question }) });
        const ticket = await open.json();
        if (!open.ok) throw Object.assign(new Error(ticket.error || 'The review isn’t available right now.'), { code: ticket.code });
        const res = await fetch(ticket.upload.url, { method: 'POST', body: wav,
          headers: { Authorization: `Bearer ${ticket.upload.token}`, 'Content-Type': 'audio/wav', 'X-Voice-Consent': 'own-voice' } });
        const data = await res.json();
        if (!res.ok) throw Object.assign(new Error(data.error || 'Your answer couldn’t be reviewed. Try again.'), { code: data.code });
        attempt++;
        status.textContent = '';
        show(data.review);
        track('site_review_done', { mode: cfg.mode, attempt, wpm: data.review.metrics.wordsPerMinute, fillers: data.review.metrics.fillerCount, pauses: data.review.metrics.pauseCount, structure: data.review.feedback.structure.level, ms: Math.round(performance.now() - t0) });
      } catch (e) {
        const limit = /LIMIT$/.test(e.code || '');
        status.textContent = limit ? (e.code === 'PERSON_LIMIT' ? 'You’ve used today’s two free reviews. Keep practising in the Speaking Coach app, where the AI partner also asks the follow-up.' : e.message) : (e.message || 'Your answer couldn’t be reviewed. Try again.');
        track('site_review_error', { mode: cfg.mode, code: e.code || 'CLIENT' });
        if (limit && upsell) upsell.hidden = false;
      } finally {
        recordBtn.hidden = false; recordBtn.textContent = attempt ? 'Try it again' : 'Start answering';
      }
    }

    function quote(label, text, note, extra) {
      return el('div', { class: 'review-note' }, el('p', { class: 'review-label', text: label }),
        text ? el('blockquote', { text: `“${text}”` }) : null, el('p', { text: note }), extra || null);
    }
    function show(r) {
      const m = r.metrics, f = r.feedback;
      result.replaceChildren(
        el('div', { class: 'stats' },
          el('div', { class: 'stat' }, el('b', { text: String(m.wordsPerMinute) }), el('span', { text: 'words per minute' })),
          el('div', { class: 'stat' }, el('b', { text: String(m.fillerCount) }), el('span', { text: m.fillerCount === 1 ? 'filler word (um, uh)' : 'filler words (um, uh)' })),
          el('div', { class: 'stat' }, el('b', { text: String(m.pauseCount) }), el('span', { text: m.pauseCount === 1 ? 'pause over 2 s' : 'pauses over 2 s' }))),
        quote('Keep this', f.keep.quote, f.keep.note),
        quote('Change this', f.change.quote, f.change.note, el('p', { class: 'review-try' }, el('strong', { text: 'Try: ' }), document.createTextNode(f.change.tryThis))),
        quote('Said more clearly', f.rewrite.original, `→ ${f.rewrite.clearer}`),
        quote(`Structure: ${f.structure.level}`, f.structure.quote, f.structure.note),
        el('p', { class: 'privacy', text: 'Pace and filler counts come from an automatic transcript, so they can be slightly off. Accent and personality are never rated.' }));
      result.hidden = false;
      if (upsell) upsell.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  document.querySelectorAll('section.review[data-review]').forEach(mount);
})();
