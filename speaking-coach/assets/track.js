// Page views and download-button taps on the Speaking Coach pages, sent to PostHog.
// No cookies and nothing stored on the device: each page view gets a fresh random id, so visits
// can't be followed from page to page or tied to a person. PostHog adds the approximate location
// from the request's IP address. Only runs on orecci.com, so local previews send nothing.
(function () {
  var me = document.currentScript;
  if (!me || !/(^|\.)orecci\.com$/.test(location.hostname)) return;
  var key = me.getAttribute('data-key');
  if (!key) return;
  var page = {
    section: me.getAttribute('data-section') || '',
    slug: me.getAttribute('data-slug') || '',
    page_lang: me.getAttribute('data-lang') || '',
  };
  var id = 'web-' + (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now());
  var referrer = document.referrer || '';
  var referringDomain = '';
  try { referringDomain = referrer ? new URL(referrer).hostname : ''; } catch (e) {}

  function send(event, extra) {
    var props = {
      distinct_id: id,
      $process_person_profile: false,
      $lib: 'orecci-web',
      $current_url: location.href,
      $host: location.host,
      $pathname: location.pathname,
      $referrer: referrer || '$direct',
      $referring_domain: referringDomain || '$direct',
      $screen_width: window.screen ? screen.width : null,
      $viewport_width: window.innerWidth,
      $browser_language: navigator.language,
    };
    var k;
    for (k in page) props[k] = page[k];
    for (k in extra || {}) props[k] = extra[k];
    var body = JSON.stringify({ api_key: key, event: event, properties: props, timestamp: new Date().toISOString() });
    try {
      fetch('https://us.i.posthog.com/i/v0/e/', { method: 'POST', body: body, keepalive: true, mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=UTF-8' } });
    } catch (e) {}
  }

  send('$pageview');
  // The free voice review reports its steps (site_review_record / _done / _error) through this.
  window.scTrack = send;

  // Taps on the App Store, Google Play and ChatGPT buttons, with where on the page they were.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-store]') : null;
    if (!a) return;
    var box = a.closest('[data-cta]');
    send('site_store_click', { store: a.getAttribute('data-store'), place: box ? box.getAttribute('data-cta') : '', link_url: a.href });
  }, true);
})();
