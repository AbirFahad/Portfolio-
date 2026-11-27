/* =====================================================
   FAHAD PORTFOLIO — SHARED SCRIPT
   Each block below is one small feature. If a page
   doesn't have the element, that block just skips.
   ===================================================== */

/* 0) PICTURE PLACEHOLDERS
   Every picture marked data-ph (post pictures, factory tiles) that can't be
   found is swapped for a soft gradient box with a camera (see .ph-missing in
   css/style.css). Works for pictures added later too, like carousel copies. */
(function () {
  function missing(img) {
    var box = img.closest('.ph');
    if (box) box.classList.add('ph-missing');
    img.remove();
  }
  // pictures that already failed before this script ran
  document.querySelectorAll('img[data-ph]').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) missing(img);
  });
  // pictures that fail from now on (errors don't bubble, so listen while capturing)
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.hasAttribute('data-ph')) missing(t);
  }, true);
})();

/* 1) THEME TOGGLE (remembers your choice) */
(function () {
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  var btn = document.querySelector('.theme-btn');
  function icon() { if (btn) btn.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '🌙' : '☀️'; }
  icon();
  if (btn) btn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    icon();
  });
})();

/* 2) PHONE MENU (up to 860px): the menu icon (three lines) opens a panel
   that drops down from the notch with the pages as big rows; the icon turns
   into an X. It closes when you pick a page, tap outside it, or press Esc.
   The "Let's Talk" button always stays in the bar. Computers keep the
   normal row of links. */
(function () {
  var nav = document.querySelector('.nav');
  var btn = nav && nav.querySelector('.menu-btn');
  var panel = nav && nav.querySelector('.links');
  if (!btn || !panel) return;
  var links = Array.prototype.slice.call(panel.querySelectorAll('a'));
  links.forEach(function (a, i) { a.style.setProperty('--k', i); });   // for the one-by-one slide in
  function setOpen(open, byKeyboard) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open && byKeyboard) { var first = panel.querySelector('a:not(.cta)'); if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60); }
  }
  // e.detail is 0 when the button was pressed with the keyboard: only then jump to the first link
  btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!nav.classList.contains('open'), e.detail === 0); });
  links.forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); btn.focus(); } });
  addEventListener('resize', function () { if (innerWidth > 860 && nav.classList.contains('open')) setOpen(false); });
})();

/* 3) SCROLL PROGRESS BAR (thin bar down the left edge) + TIMELINE FILL */
(function () {
  var bar = document.querySelector('.progress');
  var tl = document.querySelector('.timeline');
  var fill = tl && tl.querySelector('.fill');
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.height = (scrollY / h * 100) + '%';   // the bar on the left grows downward
    if (fill) {
      var r = tl.getBoundingClientRect();
      var p = (innerHeight * 0.6 - r.top) / r.height;      // how far through the timeline we are
      fill.style.height = Math.max(0, Math.min(1, p)) * 100 + '%';
    }
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();

/* 4) REVEAL ON SCROLL (adds .in when an element enters the screen) */
(function () {
  var els = document.querySelectorAll('.reveal, .t-item');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  els.forEach(function (e) { io.observe(e); });
})();

/* 5) TYPING EFFECT in the hero (edit the words in the list!) */
(function () {
  var el = document.getElementById('typed');
  if (!el) return;
  var words = ['Supply Chain Executive', 'S&OP + Demand Planner', 'Import & LC Nerd', 'Excel + Power BI Builder'];
  var w = 0, c = 0, del = false;
  (function tick() {
    var word = words[w];
    el.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 70);
  })();
})();

/* 6) FLOATING CHIPS drift slightly toward the mouse */
(function () {
  var stage = document.querySelector('.avatar-stage');
  if (!stage) return;
  var chips = stage.querySelectorAll('.chip');
  stage.addEventListener('mousemove', function (e) {
    var r = stage.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    chips.forEach(function (c, i) {
      var d = (i + 1) * 9;
      c.style.transform = 'translate(' + x * d + 'px,' + y * d + 'px)';
    });
  });
})();

/* 7) (removed) The supply chain route used to live here. The owner removed
   the route from Home in November 2026; the number is kept so the other
   parts keep their numbers. */

/* 8) TILE GLOW follows the cursor + animated meters */
(function () {
  document.querySelectorAll('.tile').forEach(function (t) {
    t.addEventListener('mousemove', function (e) {
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
  // meter: data-level="3" lights up 3 of the 4 bars
  document.querySelectorAll('.meter').forEach(function (m) {
    var lvl = +m.dataset.level || 0;
    for (var i = 0; i < 4; i++) m.insertAdjacentHTML('afterbegin', '<i></i>');
    var bars = m.querySelectorAll('i');
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) {
        bars.forEach(function (b, i) { setTimeout(function () { if (i < lvl) b.classList.add('on'); }, i * 150); });
        io.disconnect();
      }
    });
    io.observe(m);
  });
})();

/* 9) SKILL FILTERS (skills page) */
(function () {
  var btns = document.querySelectorAll('.filters button[data-f]');   // Skills page filter buttons only
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      var f = b.dataset.f;
      document.querySelectorAll('.tile').forEach(function (t) {
        t.classList.toggle('hide', f !== 'all' && t.dataset.cat !== f);
      });
    });
  });
})();

/* 10) LINKEDIN CAROUSEL: flat strip that loops forever, with arrows
   The cards slide slowly right to left on their own. The ← → buttons glide
   the strip one card at a time (the slow sliding carries on afterwards).
   Hover, touch or keyboard focus pauses the slow sliding.
   The cards are copied once (copies are hidden from screen readers and the
   Tab key) so the loop never shows a gap.
   With "reduce motion" on, nothing moves by itself: the arrows simply
   scroll the row, and it can be scrolled by hand. */
(function () {
  var strip = document.querySelector('.post-marquee');
  if (!strip) return;
  var track = strip.querySelector('.post-track');
  var arrows = document.querySelectorAll('.post-arrow');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // distance of one card step (card width + the gap after it)
  function step() {
    var card = track.querySelector('.post');
    return card ? card.offsetWidth + parseFloat(getComputedStyle(card).marginRight) : 300;
  }

  if (calm) {
    arrows.forEach(function (btn) {
      btn.addEventListener('click', function () {
        strip.scrollBy({ left: +btn.getAttribute('data-dir') * step(), behavior: 'auto' });
      });
    });
    return;
  }

  // copy the cards once for a seamless loop
  var originals = Array.prototype.slice.call(track.children);
  originals.forEach(function (card) {
    var copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.setAttribute('tabindex', '-1');
    track.appendChild(copy);
  });
  strip.classList.add('is-looping');

  var SPEED = 38;                 // slow sliding, in pixels per second
  var offset = 0;                 // how far the strip has slid
  var glide = null;               // an arrow movement in progress
  var paused = false, last = null;

  function loopWidth() {          // width of one full set of cards
    var firstCopy = track.children[originals.length];
    return firstCopy ? firstCopy.offsetLeft - originals[0].offsetLeft : 0;
  }

  function frame(now) {
    var dt = last === null ? 0 : Math.min(0.05, (now - last) / 1000);
    last = now;
    if (glide) {
      var t = Math.min(1, (now - glide.start) / 450);
      var eased = 1 - Math.pow(1 - t, 3);        // fast start, gentle stop
      offset = glide.from + (glide.to - glide.from) * eased;
      if (t >= 1) glide = null;
    } else if (!paused) {
      offset += SPEED * dt;
    }
    var w = loopWidth();
    var shown = w ? ((offset % w) + w) % w : 0;  // wrap round so it never runs out
    track.style.transform = 'translateX(' + (-shown) + 'px)';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // arrows: → moves the cards left (shows the next ones), ← moves them right
  arrows.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dir = +btn.getAttribute('data-dir');
      var from = offset;
      var base = glide ? glide.to : offset;
      glide = { from: from, to: base + dir * step(), start: performance.now() };
    });
  });

  // pause the slow sliding on hover, touch and keyboard focus
  strip.addEventListener('mouseenter', function () { paused = true; });
  strip.addEventListener('mouseleave', function () { paused = false; });
  strip.addEventListener('touchstart', function () { paused = true; }, { passive: true });
  ['touchend', 'touchcancel'].forEach(function (type) {
    strip.addEventListener(type, function () { paused = false; });
  });
  strip.addEventListener('focusin', function () { paused = true; });
  strip.addEventListener('focusout', function () { paused = false; });
})();

/* 11) LIVE DHAKA CLOCK + DAY ROUTE (contact page): the big time, a line
   about the time of day, the date, and the 24-hour route bar (the truck
   moves to the current time; the part of the day still to come is dimmed).
   Everything follows the time in Dhaka and updates every 10 seconds. */
(function () {
  var el = document.getElementById('dhakaTime');
  if (!el) return;
  var card = document.getElementById('dhakaDay');
  var badge = document.getElementById('dayBadge'), line = document.getElementById('dayLine'), date = document.getElementById('dayDate');
  function tick() {
    var now = new Date();
    var time = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', minute: '2-digit' });
    el.textContent = time;
    if (!card) return;
    var parts = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: false }).split(':');
    var h = (+parts[0]) % 24, m = +parts[1];
    var phase = (h >= 5 && h < 12) ? 'morning' : (h >= 12 && h < 17) ? 'afternoon' : (h >= 17 && h < 20) ? 'evening' : 'night';
    card.dataset.phase = phase;
    card.style.setProperty('--p', ((h * 60 + m) / 1440 * 100).toFixed(2) + '%');
    var names = { morning: '🌅 Morning in Dhaka', afternoon: '☀️ Afternoon in Dhaka', evening: '🌇 Evening in Dhaka', night: '🌙 Night in Dhaka' };
    badge.textContent = names[phase];
    line.textContent = "It's " + time + ' here, ' + phase + ' in Dhaka.';
    date.textContent = 'Dhaka, Bangladesh · ' + now.toLocaleDateString('en-GB', { timeZone: 'Asia/Dhaka', weekday: 'long', day: 'numeric', month: 'short' });
  }
  tick(); setInterval(tick, 10000);
})();

/* 12) CONTACT FORM: opens the visitor's email app (no server needed).
   Also: the Copy button, the topic chips, the "ready" meter and the
   character count. */
(function () {
  // Copy buttons (email card)
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.dataset.copy;
      function done() { b.textContent = 'Copied ✓'; b.classList.add('done'); setTimeout(function () { b.textContent = 'Copy'; b.classList.remove('done'); }, 1800); }
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
    });
  });

  var f = document.getElementById('contactForm');
  if (!f) return;
  var bar = document.getElementById('ctBar'), pct = document.getElementById('ctPct');
  var count = document.getElementById('ctCount'), err = document.getElementById('ctError');
  function update() {
    var d = new FormData(f), parts = [d.get('topic'), d.get('name'), d.get('email'), d.get('subject'), d.get('message')];   // 5 parts, 20% each
    var filled = parts.filter(function (v) { return v && String(v).trim(); }).length;
    var p = Math.round(filled / parts.length * 100);
    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = p + '% ready';
    if (count) count.textContent = (d.get('message') || '').length + ' / 1500';
  }
  f.addEventListener('input', update);
  f.addEventListener('change', update);
  update();

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(f);
    if (!String(d.get('name') || '').trim() || !String(d.get('email') || '').trim() || !String(d.get('message') || '').trim()) {
      if (err) err.textContent = 'Add your name, email and a message, then try again.';
      return;
    }
    if (f.email && !f.email.checkValidity()) { if (err) err.textContent = 'That email address looks incomplete. Check it and try again.'; return; }
    if (err) err.textContent = '';
    var topic = d.get('topic');
    var subject = d.get('subject') || (topic ? topic : 'Hello from your portfolio');
    if (topic && d.get('subject')) subject = '[' + topic + '] ' + subject;
    var body = encodeURIComponent(d.get('message') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')');
    // Your email (from content.md)
    location.href = 'mailto:abirfahad2003@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + body;
  });
})();

/* 13) PHOTO LIGHTBOX (factory visits on Home, and the Gallery page)
   Clicking a photo tile opens it big on a dark overlay with its caption,
   the date of the visit and the place (from data-date and data-place).
   Close: the × button, the Esc key, or clicking the dark area.
   Move: the ← → buttons, the arrow keys, or swiping left/right on a phone.
   A tile without a photo yet opens as the same camera placeholder.
   On the Gallery page, photos hidden by a filter are skipped. */
(function () {
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.b-tile'));
  if (!tiles.length) return;

  // build the lightbox once
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo');
  box.innerHTML =
    '<button class="lb-btn lb-close" type="button" aria-label="Close">✕</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo">←</button>' +
    '<figure class="lb-figure"><div class="lb-frame ph"></div>' +
    '<figcaption class="lb-cap"></figcaption></figure>' +
    '<button class="lb-btn lb-next" type="button" aria-label="Next photo">→</button>';
  document.body.appendChild(box);
  var frame = box.querySelector('.lb-frame');
  var cap = box.querySelector('.lb-cap');
  var current = 0, lastFocus = null;
  // the photos you can move between right now (not hidden by a filter)
  function visible() { return tiles.filter(function (t) { return !t.hidden; }); }
  function step(d) {
    var v = visible(), k = v.indexOf(tiles[current]);
    show(tiles.indexOf(v[(k + d + v.length) % v.length]));
  }

  function show(i) {
    current = (i + tiles.length) % tiles.length;
    var tile = tiles[current];
    var img = tile.querySelector('img');
    frame.innerHTML = '';
    frame.classList.remove('ph-missing');
    if (img) {
      var big = document.createElement('img');
      big.src = img.getAttribute('src');
      big.alt = img.alt;
      big.setAttribute('data-ph', '');   // part 0 swaps it for a placeholder if it's missing
      frame.appendChild(big);
    } else {
      frame.classList.add('ph-missing'); // the tile's photo was already missing
    }
    cap.innerHTML = '';
    cap.appendChild(document.createTextNode(tile.getAttribute('data-caption') || ''));
    // date and place of the visit (dashed outline while they're placeholders)
    var meta = document.createElement('span');
    meta.className = 'lb-meta';
    [['📅 ', tile.getAttribute('data-date')], ['📍 ', tile.getAttribute('data-place')]].forEach(function (pair) {
      if (!pair[1]) return;
      var bit = document.createElement('span');
      bit.textContent = pair[0] + pair[1];
      var shown = tile.querySelectorAll('.b-meta span');
      // keep the dashed outline in the lightbox if the tile still marks it as a placeholder
      if (Array.prototype.some.call(shown, function (s) { return s.classList.contains('ph-date') && s.textContent.indexOf(pair[1]) > -1; })) bit.className = 'ph-date';
      meta.appendChild(bit);
    });
    cap.appendChild(meta);
    var count = document.createElement('span');
    count.className = 'lb-count';
    var v = visible();
    count.textContent = (v.indexOf(tile) + 1) + ' / ' + v.length;
    cap.appendChild(count);
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  tiles.forEach(function (t, i) { t.addEventListener('click', function () { open(i); }); });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
  box.querySelector('.lb-next').addEventListener('click', function () { step(1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') {          // keep keyboard focus inside the lightbox
      var btns = box.querySelectorAll('button'), first = btns[0], last = btns[btns.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // swipe on phones
  var startX = null;
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    startX = null;
  });
})();

/* 14) EXPERIENCE PAGE SIDE MENU: lights up the part of the page you're
   reading (Summary / Work / Education / Key highlights) and slides it into
   view on phones. The Print button prints the page as a clean résumé
   (print look at the end of css/style.css). */
(function () {
  var nav = document.querySelector('.cv-nav');
  var pr = document.getElementById('cvPrint');
  if (pr) pr.addEventListener('click', function () { window.print(); });
  if (!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var parts = links.map(function (l) { return document.querySelector(l.getAttribute('href')); });
  var current = null;
  function onScroll() {
    var line = innerHeight * 0.35, pick = 0;
    parts.forEach(function (p, i) { if (p && p.getBoundingClientRect().top <= line) pick = i; });
    if ((innerHeight + scrollY) >= document.documentElement.scrollHeight - 4) pick = parts.length - 1;   // bottom of the page
    if (pick === current) return;
    current = pick;
    links.forEach(function (l, i) {
      l.classList.toggle('on', i === pick);
      if (i === pick) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
    // phones: the menu is a sideways row, keep the lit link in view
    var a = links[pick];
    if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();

/* 15) GRID SPOTLIGHT that follows the mouse
   Adds one see-through layer behind the page (.spotlight in css/style.css)
   and moves its centre to the mouse. The position is updated at most once
   per screen refresh (requestAnimationFrame), so it stays smooth.
   It fades out when the mouse leaves the window. Phones and tablets
   (no mouse) just keep the faint grid. */
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var spot = document.createElement('div');
  spot.className = 'spotlight';
  spot.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(spot, document.body.firstChild);

  var x = 0, y = 0, waiting = false;
  function paint() {
    spot.style.setProperty('--mouse-x', x + 'px');
    spot.style.setProperty('--mouse-y', y + 'px');
    waiting = false;
  }
  document.addEventListener('mousemove', function (e) {
    x = e.clientX; y = e.clientY;
    spot.classList.add('on');
    if (!waiting) { waiting = true; requestAnimationFrame(paint); }
  }, { passive: true });
  // mouse left the window: fade the light out
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget) spot.classList.remove('on');
  });
  window.addEventListener('blur', function () { spot.classList.remove('on'); });
})();

/* 16) CORE TOOLS STRIP (hero): slows down on hover instead of stopping
   The sliding itself is a CSS animation (.tools-track). Here we only change
   its speed: about a quarter speed while the mouse is over it, back to
   normal when it leaves. Changing the speed this way never makes it jump. */
(function () {
  var strip = document.querySelector('.tools-strip');
  var track = strip && strip.querySelector('.tools-track');
  if (!track || !track.getAnimations) return;
  function speed(rate) {
    track.getAnimations().forEach(function (a) {
      a.playbackRate = rate;   // keeps its current spot, only the speed changes
    });
  }
  strip.addEventListener('mouseenter', function () { speed(0.25); });
  strip.addEventListener('mouseleave', function () { speed(1); });
})();

/* 17) FACTORY VISITS: photos slide in from both sides, following your scroll
   Each photo starts pushed out to the side (taking turns: left, right,
   left...), turned, smaller and faded. As you scroll down, it glides into
   place, tied to the scroll: it only starts once the photo is in the lower
   part of the screen (not too early) and is fully in place by the time it
   reaches the middle. Scrolling back up plays it backwards.
   START / END = where on the screen the move begins and ends (share of the
   screen height from the top). With "reduce motion" on, the photos just show. */
(function () {
  var grid = document.querySelector('.bento');
  if (!grid) return;
  var tiles = Array.prototype.slice.call(grid.querySelectorAll('.b-tile'));
  tiles.forEach(function (t) { t.classList.remove('reveal'); });   // this replaces the normal fade-up
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var START = 0.95, END = 0.5;
  var waiting = false;
  function paint() {
    waiting = false;
    var vh = window.innerHeight;
    var gTop = grid.getBoundingClientRect().top;      // the grid itself never moves
    tiles.forEach(function (t, i) {
      var side = i % 2 ? 1 : -1;
      // where the tile sits on screen when in place (its own move not counted)
      var top = gTop + (t.offsetTop - grid.offsetTop);
      var p = (vh * START - top) / (vh * (START - END));
      p = Math.max(0, Math.min(1, p));
      var k = 1 - (1 - Math.pow(1 - p, 3));            // 1 = fully out, 0 = in place (eased)
      var dy = 60 * k;
      t.style.opacity = (1 - k).toFixed(3);
      t.style.transform = k < 0.001 ? '' :
        'translate(' + (side * 140 * k).toFixed(1) + 'px,' + dy.toFixed(1) + 'px) rotate(' +
        (side * 8 * k).toFixed(2) + 'deg) scale(' + (1 - 0.2 * k).toFixed(3) + ')';
    });
  }
  function ask() { if (!waiting) { waiting = true; requestAnimationFrame(paint); } }
  paint();
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', ask);
})();

/* 18) HOW I PLAN: S&OP cycle ring (Home)
   A dot travels round the ring (one full lap = 15 seconds, 3 per step).
   The step it last reached lights up on the ring and in the list.
   Hover, tap or keyboard-focus a step (on the ring or in the list) to stop
   on it; move away and the dot carries on from there.
   With "reduce motion" on, nothing moves: tap a step to light it. */
(function () {
  var ring = document.querySelector('.cyc-ring');
  if (!ring) return;
  var box = ring.closest('.cycle');
  var orbit = ring.querySelector('.cyc-orbit');
  var nodes = Array.prototype.slice.call(ring.querySelectorAll('.cyc-node'));
  var steps = Array.prototype.slice.call(box.querySelectorAll('.cyc-step'));
  var N = nodes.length, LAP = 15000, STEP = 360 / N;
  var angle = 0, pinned = false, last = -1, visible = true, prev = 0;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function light(i) {
    if (i === last) return;
    last = i;
    nodes.forEach(function (n, k) { n.classList.toggle('on', k === i); });
    steps.forEach(function (s, k) { s.classList.toggle('on', k === i); });
  }
  function draw() {
    orbit.style.transform = 'rotate(' + angle.toFixed(2) + 'deg)';
    light(Math.floor((angle + 4) / STEP) % N);   // +4: light a step just as the dot arrives
  }
  function goTo(i) { pinned = true; angle = i * STEP; draw(); }

  nodes.concat(steps).forEach(function (el) {
    var i = +el.getAttribute('data-step');
    el.addEventListener('mouseenter', function () { goTo(i); });
    el.addEventListener('focus', function () { goTo(i); });
    el.addEventListener('click', function () { goTo(i); });
  });
  box.addEventListener('mouseleave', function () { pinned = false; });
  box.addEventListener('focusout', function () { pinned = false; });

  draw();
  if (still) return;
  // only animate while the ring is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(ring);
  }
  function tick(t) {
    var dt = prev ? Math.min(t - prev, 100) : 0;
    prev = t;
    if (visible && !pinned) { angle = (angle + dt * 360 / LAP) % 360; draw(); }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* 19) IMPORT JOURNEY MAP (Home)
   One trip takes 12 seconds, then starts again:
     LC opened (wait at sea) → at sea (ship sails to Chattogram port) →
     port (short stop) → on the road (truck to warehouse and factory) →
     into production (short stop).
   The marker's icon changes with the step, the route it has covered glows,
   pins light up as they are reached, and the matching step in the list is lit.
   Hover a step in the list to jump to it; move away and the trip goes on.
   With "reduce motion" on, the whole route is shown as finished. */
(function () {
  var map = document.querySelector('.imp-map svg');
  if (!map) return;
  var box = map.closest('.imp');
  var sea = map.querySelector('#imp-sea-leg'), road = map.querySelector('#imp-road-leg');
  var doneSea = map.querySelector('.imp-done.sea'), doneRoad = map.querySelector('.imp-done.road');
  var cargo = map.querySelector('.imp-cargo'), icon = cargo.querySelector('text');
  var pins = Array.prototype.slice.call(map.querySelectorAll('.imp-pin'));
  var legs = Array.prototype.slice.call(box.querySelectorAll('.leg'));
  var Ls = sea.getTotalLength(), Lr = road.getTotalLength();
  doneSea.style.strokeDasharray = Ls; doneRoad.style.strokeDasharray = Lr;
  var TRIP = 12000;
  // where each step starts and ends, as a share of the trip (0 to 1)
  var PH = [[0, .12], [.12, .45], [.45, .58], [.58, .86], [.86, 1]];
  var ICONS = ['🏦', '🚢', '⚓', '🚚', '🏭'];
  var t = 0, pinned = false, visible = true, prev = 0, last = -1;

  function ease(x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  function draw() {
    var p = t / TRIP, leg = 0;
    while (leg < 4 && p >= PH[leg][1]) leg++;
    var seaP = p < PH[1][0] ? 0 : p >= PH[1][1] ? 1 : ease((p - PH[1][0]) / (PH[1][1] - PH[1][0]));
    var roadP = p < PH[3][0] ? 0 : p >= PH[3][1] ? 1 : ease((p - PH[3][0]) / (PH[3][1] - PH[3][0]));
    var pt = roadP > 0 ? road.getPointAtLength(Lr * roadP) : sea.getPointAtLength(Ls * seaP);
    cargo.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
    doneSea.style.strokeDashoffset = Ls * (1 - seaP);
    doneRoad.style.strokeDashoffset = Lr * (1 - roadP);
    if (leg !== last) {
      last = leg;
      icon.textContent = ICONS[leg];
      legs.forEach(function (l, k) { l.classList.toggle('on', k === leg); });
      pins.forEach(function (pin) { pin.classList.toggle('on', +pin.getAttribute('data-pin') <= leg); });
    }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    t = TRIP - 1; draw();     // shows the finished route, caption on the last step
    return;
  }
  legs.forEach(function (l, k) {
    l.addEventListener('mouseenter', function () { pinned = true; t = PH[k][1] * TRIP - 1; draw(); });
  });
  box.addEventListener('mouseleave', function () { pinned = false; });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(map);
  }
  draw();
  function tick(now) {
    var dt = prev ? Math.min(now - prev, 100) : 0;
    prev = now;
    if (visible && !pinned) { t = (t + dt) % TRIP; draw(); }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* 20) HOW I WORK TABS (phones and tablets only)
   On big screens the two cards sit side by side. Below 960px wide, two tab
   buttons ("S&OP cycle" / "Import journey") show one card at a time: the
   CSS shows the card named in the grid's data-show. Arrow keys work too. */
(function () {
  var grid = document.querySelector('.ws-grid');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.ws-tab'));
  if (!grid || !tabs.length) return;
  function open(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.classList.toggle('on', on);
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
    });
    grid.setAttribute('data-show', t.getAttribute('data-show'));
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { open(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      open(n); n.focus();
    });
  });
})();

/* 21) WINS & ACHIEVEMENTS cards (Home): hover effects
   When the mouse enters a card, we note where it came in (--mx / --my), so
   the colour fill (CSS .award::before) grows in a circle from that spot.
   While the mouse moves over the card, it tilts a little toward the mouse
   (up to about 6 degrees). It settles back when the mouse leaves.
   Only on computers with a mouse, and not with "reduce motion" on. */
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.award'));
  if (!cards.length) return;
  var mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  cards.forEach(function (card) {
    function spot(e) {
      var r = card.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    }
    card.addEventListener('mouseenter', function (e) {
      var p = spot(e);
      card.style.setProperty('--mx', (p.x * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (p.y * 100).toFixed(1) + '%');
    });
    if (!mouse || still) return;
    card.addEventListener('mousemove', function (e) {
      var p = spot(e);
      card.style.transition = 'transform .15s ease-out, border-color .4s, box-shadow .4s';
      card.style.transform = 'perspective(900px) translateY(-6px) rotateX(' + ((.5 - p.y) * 10).toFixed(2) +
        'deg) rotateY(' + ((p.x - .5) * 12).toFixed(2) + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = '';
      card.style.transform = '';
    });
  });
})();

/* 22) HERO STATUS PILL: the line inside changes every 3.5 seconds
   The lines come from the pill's data-lines (separated by |). The old
   words slide up and fade out, the new ones rise in, and the pill's width
   glides to fit the new words. */
(function () {
  var pill = document.querySelector('.hello[data-lines]');
  var text = pill && pill.querySelector('.hello-text');
  if (!text) return;
  var lines = pill.getAttribute('data-lines').split('|');
  if (lines.length < 2) return;
  var i = 0;
  setInterval(function () {
    if (document.hidden) return;                 // tab in the background: wait
    text.classList.add('out');
    setTimeout(function () {
      i = (i + 1) % lines.length;
      var from = pill.offsetWidth;
      text.textContent = lines[i];
      pill.style.width = 'auto';
      var to = pill.offsetWidth;                 // width the new words need
      pill.style.width = from + 'px';
      void pill.offsetWidth;                     // let the browser note the start width
      pill.style.width = to + 'px';              // ...then glide to the new width
      text.classList.remove('out');
      text.classList.add('enter');
      void text.offsetWidth;
      text.classList.remove('enter');            // new words rise into place
    }, 300);
  }, 3500);
})();

/* 23) FLOATING SCM PARTICLES in the empty space left and right of the page
   Small line drawings from the food supply chain (carton, biscuit packet,
   biscuit, wheat, oil drum, sugar sack, pallet, truck, container, label)
   float gently in the side margins, behind everything (pointer-events none,
   so nothing is blocked). Scrolling moves them at different speeds (near
   ones faster, like depth), and a fast scroll makes them spin and tilt a
   bit, then settle. On big screens they stay in the side margins; on
   phones and small screens (no side margins) a few smaller, fainter ones
   are scattered across the whole screen instead, so text stays readable.
   They stand still with "reduce motion" on.
   Colours and look: .scm-float / .scm-p in css/style.css. */
(function () {
  var ICONS = {
    carton:    '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9M7.5 5.2l9 4.5"/>',
    packet:    '<path d="M5 6h14v12H5z"/><path d="M5 6 3.5 7.5 5 9l-1.5 1.5L5 12l-1.5 1.5L5 15l-1.5 1.5L5 18M19 6l1.5 1.5L19 9l1.5 1.5L19 12l1.5 1.5L19 15l1.5 1.5L19 18"/><circle cx="12" cy="12" r="3"/>',
    biscuit:   '<circle cx="12" cy="12" r="8"/><circle cx="9" cy="9.5" r=".6"/><circle cx="14.5" cy="9" r=".6"/><circle cx="12" cy="13" r=".6"/><circle cx="8.5" cy="14.5" r=".6"/><circle cx="15" cy="15" r=".6"/>',
    wheat:     '<path d="M12 21V6"/><path d="M12 8c-2-.5-3-2-3-3.5 2 .3 3 1.6 3 3.5zm0 0c2-.5 3-2 3-3.5-2 .3-3 1.6-3 3.5zM12 12c-2-.5-3-2-3-3.5 2 .3 3 1.6 3 3.5zm0 0c2-.5 3-2 3-3.5-2 .3-3 1.6-3 3.5zM12 16c-2-.5-3-2-3-3.5 2 .3 3 1.6 3 3.5zm0 0c2-.5 3-2 3-3.5-2 .3-3 1.6-3 3.5z"/>',
    drum:      '<ellipse cx="12" cy="5" rx="6" ry="2"/><path d="M6 5v14c0 1.1 2.7 2 6 2s6-.9 6-2V5"/><path d="M6 10c0 1.1 2.7 2 6 2s6-.9 6-2M6 15c0 1.1 2.7 2 6 2s6-.9 6-2"/>',
    sack:      '<path d="M8 4h8l-1.5 3c3 1.5 4.5 4.5 4.5 8a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5c0-3.5 1.5-6.5 4.5-8z"/><path d="M9.5 7h5M9 13h6M10 16h4"/>',
    pallet:    '<path d="M3 9h18M3 13h18M3 9v4M21 9v4"/><path d="M3 13v4h4v-4M10 13v4h4v-4M17 13v4h4v-4"/><path d="M6 5h5v4H6zM13 5h5v4h-5z"/>',
    truck:     '<path d="M2 6h11v10H2zM13 9h4l3 3.5V16h-7z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
    container: '<path d="M2 7h20v11H2z"/><path d="M6 7v11M10 7v11M14 7v11M18 7v11M2 7l2-2h16l2 2"/>',
    label:     '<path d="M3 4h9l9 9-8 8-9-9V4z"/><circle cx="7.5" cy="8.5" r="1.4"/><path d="M11 12l3 3M13 10l3 3"/>'
  };
  var names = Object.keys(ICONS);
  var COLORS = ['var(--accent)', 'var(--accent-2)', 'var(--accent-3)', 'var(--muted)'];

  var layer = document.createElement('div');
  layer.className = 'scm-float';
  layer.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(layer, document.body.firstChild);

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var parts = [], H = 0, gutter = 0, vel = 0, lastY = window.scrollY;

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function build() {
    layer.innerHTML = '';
    parts = [];
    var w = Math.min(1120, window.innerWidth * .92);              // page width, same as .wrap in the CSS
    gutter = (window.innerWidth - w) / 2;
    var scatter = gutter < 90;                                     // phone / small screen: no side margins
    H = window.innerHeight + 160;                                  // loop height (a bit taller than the screen)
    var perSide = scatter ? Math.max(7, Math.min(10, Math.round(window.innerHeight / 90)))
                          : Math.max(5, Math.min(8, Math.round(window.innerHeight / 120)));
    (scatter ? ['all'] : ['left', 'right']).forEach(function (side) {
      for (var i = 0; i < perSide; i++) {
        var size = Math.round(scatter ? rnd(16, 26) : rnd(18, Math.min(38, gutter - 40)));
        var el = document.createElement('span');
        el.className = 'scm-p';
        el.style.width = el.style.height = size + 'px';
        el.style.setProperty('--c', COLORS[Math.floor(Math.random() * COLORS.length)]);
        el.style.setProperty('--o', (scatter ? rnd(.08, .18) : rnd(.16, .34)).toFixed(2));   // fainter over text
        el.innerHTML = '<svg viewBox="0 0 24 24">' + ICONS[names[Math.floor(Math.random() * names.length)]] + '</svg>';
        layer.appendChild(el);
        var x = scatter ? rnd(4, window.innerWidth - size - 4) : rnd(14, gutter - size - 18);
        parts.push({
          el: el,
          x: side === 'right' ? window.innerWidth - x - size : x,
          y: (i + rnd(.1, .9)) * (H / perSide),                    // spread out from top to bottom
          speed: rnd(.12, .55),                                    // how much scrolling moves it (depth)
          spin: rnd(.3, 1) * (Math.random() < .5 ? -1 : 1),
          rot: rnd(-20, 20),
          phase: rnd(0, 6.28)
        });
      }
    });
    draw(performance.now());
  }

  function draw(t) {
    var sy = window.scrollY;
    parts.forEach(function (p) {
      var y = ((p.y - sy * p.speed) % H + H) % H - 80;           // wraps round, so they keep coming
      var bobY = still ? 0 : Math.sin(t / 1700 + p.phase) * 8;
      var bobX = still ? 0 : Math.sin(t / 2300 + p.phase) * 5;
      var r = p.rot + (still ? 0 : Math.sin(t / 3100 + p.phase) * 10 + vel * p.spin * 2.2);
      p.el.style.transform = 'translate(' + (p.x + bobX).toFixed(1) + 'px,' + (y + bobY).toFixed(1) + 'px) rotate(' + r.toFixed(1) + 'deg)';
    });
  }

  function loop(t) {
    var sy = window.scrollY;
    vel = vel * .9 + Math.max(-40, Math.min(40, sy - lastY)) * .1;   // smoothed scroll speed
    lastY = sy;
    if (parts.length) draw(t);
    requestAnimationFrame(loop);
  }

  build();
  var timer, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return;    // phones resize the height while scrolling: ignore that
    lastW = window.innerWidth;
    clearTimeout(timer); timer = setTimeout(build, 200);
  });
  if (still) {
    window.addEventListener('scroll', function () { draw(0); }, { passive: true });   // just follow the scroll
  } else {
    requestAnimationFrame(loop);
  }
})();

/* 24) GALLERY FILTER (gallery.html): All / Work / Factory / Events / Life
   Each photo has data-g (its kind). Clicking a filter fades out the photos
   that don't match, then takes them out of the wall so the rest close up;
   matching photos fade back in. */
(function () {
  var btns = Array.prototype.slice.call(document.querySelectorAll('[data-gf]'));
  var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  if (!btns.length || !items.length) return;
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-gf');
      btns.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
      items.forEach(function (it) {
        var show = f === 'all' || it.getAttribute('data-g') === f;
        clearTimeout(it._gt);                                        // a quick second click wins
        if (show && (it.hidden || it.classList.contains('g-out'))) {
          it.hidden = false; it.classList.add('g-out');
          void it.offsetWidth; it.classList.remove('g-out');        // fade back in
        } else if (!show && !it.hidden) {
          it.classList.add('g-out');
          it._gt = setTimeout(function () { it.hidden = true; it.classList.remove('g-out'); }, 250);
        }
      });
    });
  });
})();

/* 25) LOADING SCREEN: your icon blinks inside a spinning ring, then the
   screen fades away. It only shows on the FIRST page of a visit (later pages
   open straight away), and it leaves as soon as the page is ready to read:
   it no longer waits for every photo to download. It always shows for at
   least half a second (so it doesn't just flicker). */
(function () {
  var l = document.querySelector('.loader');
  if (!l) return;
  // already seen in this visit: remove it at once
  if (document.documentElement.classList.contains('ld-seen')) { l.parentNode.removeChild(l); return; }
  try { sessionStorage.setItem('ldSeen', '1'); } catch (e) {}
  var start = Date.now(), gone = false;
  function hide() {
    if (gone) return;
    gone = true;
    setTimeout(function () {
      l.classList.add('done');                                   // fade out (CSS)
      setTimeout(function () { if (l.parentNode) l.parentNode.removeChild(l); }, 600);
    }, Math.max(0, 500 - (Date.now() - start)));
  }
  // this script sits at the end of the page, so the page is already built:
  // wait only for the fonts (at most 1.5 seconds), not for the photos
  var fontsDone = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsDone, new Promise(function (r) { setTimeout(r, 1500); })]).then(hide);
  setTimeout(hide, 2500);                                         // safety: never stuck
})();


/* 26) TITLE ANIMATIONS: every page title (and some Home headings) has
   data-anim="..." and plays its own short animation ONCE, the first time it
   comes into view, after the loading screen and the fade-up have finished,
   then plays again every 4 to 5 seconds while it is on screen (see LOOP below).
   The looks are in css/style.css, "TITLE ANIMATIONS". The words shown on
   the stamp, the scan tag and the QC counter are in content.md.
   With "reduce motion" on, nothing moves and the finished title shows. */
(function () {
  var titles = document.querySelectorAll('[data-anim]');
  if (!titles.length) return;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // wrap each letter in <span class="ch"> (spaces stay as plain text)
  function split(el) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          Array.from(c.textContent).forEach(function (t) {
            if (/\s/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
            var s = document.createElement('span');
            s.className = 'ch'; s.textContent = t;
            s.style.setProperty('--i', n); s.style.setProperty('--r', (n % 2 ? -12 : 10) + 'deg');
            n++;
            frag.appendChild(s);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && !c.hasAttribute('aria-hidden')) { walk(c); }
      });
    })(el);
    return el.querySelectorAll('.ch');
  }
  // put the heading's words in one span, so they can move without moving the heading
  function wrapWords(el) {
    var w = document.createElement('span'); w.className = 't-words';
    while (el.firstChild) w.appendChild(el.firstChild);
    el.appendChild(w);
    return w;
  }

  // parts that also show when nothing moves (the pallet, the route, the stamp)
  titles.forEach(function (el) {
    var a = el.dataset.anim;
    if (a === 'drop') el.insertAdjacentHTML('afterend', '<span class="t-pallet" aria-hidden="true"></span>');
    if (a === 'route') el.insertAdjacentHTML('afterend',
      '<svg class="t-route" viewBox="0 0 400 40" aria-hidden="true">' +
      '<path class="road" d="M8 28 C 80 4, 140 36, 200 20 S 320 4, 392 22"/>' +
      '<path class="trail" pathLength="1" d="M8 28 C 80 4, 140 36, 200 20 S 320 4, 392 22"/>' +
      '<circle class="pin p1" cx="8" cy="28" r="5"/><circle class="pin p2" cx="200" cy="20" r="5"/><circle class="pin p3" cx="392" cy="22" r="5"/>' +
      '<circle class="dot" r="4"><animateMotion dur="1.3s" begin="indefinite" fill="freeze" path="M8 28 C 80 4, 140 36, 200 20 S 320 4, 392 22"/></circle>' +
      '</svg>');
    if (a === 'stamp') { wrapWords(el); el.insertAdjacentHTML('beforeend', '<span class="t-stamp" aria-hidden="true">VERIFIED ✓</span>'); }
    if (a === 'paper') { wrapWords(el); el.insertAdjacentHTML('beforeend', '<span class="t-seal" aria-hidden="true"><i>🎓</i></span>'); }
  });
  if (calm) return;
  // the paperwork title waits unprinted until its animation starts
  document.querySelectorAll('[data-anim="paper"]').forEach(function (el) { el.classList.add('t-print-wait'); });

  var players = {
    // Home name: a rectangle cursor types the letters (as outlines), then a
    // scanner gate checks each letter: it fills in and a ✓ pops above it,
    // and the counter ends on "QC 12/12 passed ✓"
    qc: function (el) {
      var chars = split(el), total = chars.length;
      var block = document.createElement('span'); block.className = 't-block'; block.setAttribute('aria-hidden', 'true');
      var gate = document.createElement('span'); gate.className = 't-gate'; gate.setAttribute('aria-hidden', 'true');
      var count = document.createElement('span'); count.className = 't-count'; count.setAttribute('aria-hidden', 'true');
      el.appendChild(block); el.appendChild(gate); el.appendChild(count);
      el.classList.add('t-qc-run', 't-qc-typing');
      // give each "Fahad." letter its own slice of the name gradient (see CSS)
      var g = el.querySelector('.grad');
      if (g) {
        var gr = g.getBoundingClientRect();
        g.querySelectorAll('.ch').forEach(function (c) {
          var r = c.getBoundingClientRect();
          c.style.setProperty('--gw', gr.width + 'px');
          c.style.setProperty('--gx', (gr.left - r.left) + 'px');
        });
      }
      function box(c) {
        var h = el.getBoundingClientRect(), r = c.getBoundingClientRect();
        return { left: r.left - h.left, right: r.right - h.left, x: r.left - h.left + r.width / 2, top: r.top - h.top, h: r.height };
      }
      function moveBlock(x, b) {
        block.style.height = (b.h * 0.74) + 'px';
        block.style.transform = 'translate(' + x + 'px,' + (b.top + b.h * 0.14) + 'px)';
      }
      // 1) typing: one letter every 75ms, the block sits after the last letter
      var first = box(chars[0]);
      moveBlock(first.left, first);
      block.classList.add('on');
      var k = 0;
      var typing = setInterval(function () {
        var c = chars[k]; c.classList.add('typed');
        var b = box(c); moveBlock(b.right + 3, b);
        k++;
        if (k >= total) { clearInterval(typing); setTimeout(scan, 350); }
      }, 60);
      // 2) scanning: the gate passes each letter, it fills in with a ✓
      function scan() {
        block.classList.remove('on');
        el.classList.remove('t-qc-typing');
        var i = 0;
        gate.style.transform = 'translateX(' + box(chars[0]).x + 'px)';
        gate.classList.add('on'); count.classList.add('on');
        count.textContent = 'QC 0/' + total;
        var timer = setInterval(function () {
          var c = chars[i], p = box(c);
          gate.style.transform = 'translateX(' + p.x + 'px)';
          c.classList.add('ok');
          var tick = document.createElement('span');
          tick.className = 't-tick'; tick.setAttribute('aria-hidden', 'true'); tick.textContent = '✓';
          tick.style.left = p.x + 'px'; tick.style.top = (p.top - 18) + 'px';
          el.appendChild(tick);
          setTimeout(function () { tick.remove(); }, 800);
          i++;
          count.textContent = 'QC ' + i + '/' + total;
          if (i >= total) {
            clearInterval(timer);
            count.textContent = 'QC ' + total + '/' + total + ' passed ✓';
            count.classList.add('pass');
            setTimeout(function () { gate.classList.remove('on'); el.classList.remove('t-qc-run'); }, 400);
            setTimeout(function () { count.classList.remove('on'); }, 1300);
          }
        }, 90);
      }
    },
    // Home "Wins & achievements.": barcode stripes, laser reveals the words
    scan: function (el) {
      var box = document.createElement('span'); box.className = 't-scan';
      var text = document.createElement('span'); text.className = 't-scan-text';
      while (el.firstChild) text.appendChild(el.firstChild);
      box.appendChild(text);
      box.insertAdjacentHTML('beforeend', '<span class="t-bars" aria-hidden="true"></span><span class="t-laser" aria-hidden="true"></span><span class="t-chip" aria-hidden="true">SCANNED ✓</span>');
      el.appendChild(box);
      void box.offsetWidth; box.classList.add('play');
    },
    // Skills: letters drop onto the pallet (first time only; after that see 'pop' below)
    drop: function (el) { split(el); void el.offsetWidth; el.classList.add('t-drop-play'); },
    // Home "Wins & achievements." and Gallery: each word pops up in turn
    // with a small mint glow (also the Skills replay)
    pop: function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w, k) { return '<span class="t-pop-w" style="--i:' + k + '">' + w + '</span>'; }).join(' ');
      void el.offsetWidth; el.classList.add('t-pop-play');
    },
    // Experience: words rise, the route draws, a dot travels along it
    route: function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w, k) { return '<span class="word" style="--i:' + k + '">' + w + '</span>'; }).join(' ');
      el.classList.add('t-route-play');
      var svg = el.nextElementSibling;
      if (svg && svg.classList.contains('t-route')) {
        svg.classList.add('play');
        var m = svg.querySelector('animateMotion');
        if (m && m.beginElement) setTimeout(function () { m.beginElement(); }, 300);
      }
    },
    // Certificates "The paperwork.": a printer head prints the words line
    // by line, then a graduation seal lands beside them (seal stays)
    paper: function (el) {
      el.classList.remove('t-print-wait');
      var w = el.querySelector('.t-words');                   // the printer line is only as wide as the words
      if (w) el.style.setProperty('--pw', (w.getBoundingClientRect().width + 20) + 'px');
      void el.offsetWidth; el.classList.add('t-print-play');
    },
    // Experience "Key highlights.": the VERIFIED stamp thumps down
    stamp: function (el) { el.classList.add('t-stamp-play'); },
    // Gallery: shutter blink + flash over the page heading, the title develops
    shutter: function (el) {
      var head = el.closest('.page-head') || el.parentElement;
      if (getComputedStyle(head).position === 'static') head.style.position = 'relative';
      var sh = document.createElement('span'); sh.className = 't-shutter'; sh.setAttribute('aria-hidden', 'true');
      sh.innerHTML = '<span class="t-lid top"></span><span class="t-lid bot"></span><span class="t-flash"></span>';
      head.appendChild(sh);
      wrapWords(el);
      void sh.offsetWidth; sh.classList.add('play'); el.classList.add('t-develop');
      setTimeout(function () { sh.remove(); }, 1200);
    },
    // Contact: letters flip like a port arrivals board
    board: function (el) {
      var text = el.textContent;
      el.setAttribute('aria-label', text);
      var board = document.createElement('span'); board.className = 't-board'; board.setAttribute('aria-hidden', 'true');
      el.textContent = ''; el.appendChild(board);
      var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      Array.from(text).forEach(function (t, k) {
        var f = document.createElement('span');
        f.className = 't-flap' + (t === ' ' ? ' space' : '');
        f.textContent = t;
        board.appendChild(f);
        if (t === ' ') return;
        f.classList.add('spin');
        var stopAt = Date.now() + 300 + k * 100;
        var id = setInterval(function () {
          if (Date.now() >= stopAt) { clearInterval(id); f.textContent = t; f.classList.remove('spin'); return; }
          f.textContent = abc[Math.floor(Math.random() * abc.length)];
        }, 45);
      });
    },
    // other section headings: one band of light sweeps across
    sheen: function (el) { el.classList.add('t-sheen', 'play'); setTimeout(function () { el.classList.remove('play'); }, 1500); }
  };

  // start only once the loading screen is gone and the fade-up has finished
  function whenReady(el, fn) {
    var tries = 0;
    (function wait() {
      var loading = document.querySelector('.loader');
      var fading = el.classList.contains('reveal') && !el.classList.contains('in');
      if ((loading || fading) && tries++ < 40) return setTimeout(wait, 100);
      setTimeout(fn, el.classList.contains('reveal') ? 350 : 0);
    })();
  }
  // LOOP (owner asked, Nov 2026): after the first play, each title plays
  // again every 4 to 5 seconds, depending on how long it is: 4s plus 60ms per
  // letter, never more than 5s (so "Let's talk." ~4.7s, longer headings 5s).
  // Only while it is on screen and the tab is open.
  // Before each replay the title is put back exactly as it was before its
  // first play (saved in el._orig / el._cls).
  function loopMs(el) { var n = el.textContent.replace(/\s+/g, '').length; return Math.max(4000, Math.min(5000, 4000 + n * 60)); }
  // titles that replay with a lighter animation after the first full one
  var REPLAY = {
    // Skills "The toolkit.": each word pops up one after another
    drop: function (el) { players.pop(el); }
  };
  function reset(el) {
    el.innerHTML = el._orig;
    el.className = el._cls;
    var next = el.nextElementSibling;                       // the route drawing under the Experience name
    if (next && next.classList.contains('t-route')) next.classList.remove('play');
    void el.offsetWidth;                                    // lets the browser restart the animation
  }
  function start(el, play) {
    el._orig = el.innerHTML; el._cls = el.className;
    var ms = loopMs(el);                                    // measure before the animation adds extra words
    play(el);
    setInterval(function () {
      if (!el._visible || document.hidden) return;
      reset(el); (REPLAY[el.dataset.anim] || play)(el);
    }, ms);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var el = en.target;
      el._visible = en.isIntersecting;
      if (!en.isIntersecting || el._started) return;
      el._started = true;
      var play = players[el.dataset.anim];
      if (play) whenReady(el, function () { start(el, play); });
    });
  }, { threshold: 0.5 });
  titles.forEach(function (el) { io.observe(el); });
})();

/* 27) COUNT-UP NUMBERS: the numbers on the Wins cards (Home) count up from
   zero the first time they come into view, e.g. "15% → 43%". Only the
   digits change; the words stay. Nothing moves with "reduce motion". */
(function () {
  var stats = document.querySelectorAll('.award-stat');
  if (!stats.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function run(el) {
    var original = el.textContent;
    if (!/\d/.test(original)) return;
    var start = null, ms = 1100;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.max(0, Math.min(1, (t - start) / ms)), e = 1 - Math.pow(1 - p, 3);
      el.textContent = original.replace(/\d+/g, function (d) { return Math.round(+d * e); });
      if (p < 1) requestAnimationFrame(frame); else el.textContent = original;
    }
    requestAnimationFrame(frame);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); run(en.target); } });
  }, { threshold: 0.6 });
  stats.forEach(function (s) { io.observe(s); });
})();

/* 28) MAGNETIC BUTTONS: on computers with a mouse, the hero buttons (See my
   journey, Download CV) lean a little toward the mouse. Phones are unchanged. */
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.hero .btns .btn').forEach(function (b) {
    b.classList.add('magnet');
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect();
      var x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
      b.style.transform = 'translate(' + (x * 0.2).toFixed(1) + 'px,' + (y * 0.3 - 3).toFixed(1) + 'px)';
    });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });
})();

/* 29) CORE COMPETENCIES GATHER (Home, Nov 2026, from the owner's scroll
   video): before you scroll, the 14 tags float scattered in a slowly
   turning, tilted 3D ring around the band. As the band rises from the
   bottom of the screen to just past the middle, each tag flies (one after
   another) into its usual place. Scroll back up and they scatter again.
   Uses the separate CSS "translate" and "scale" properties, so the tags'
   own float and hover pop still work. Nothing moves with "reduce motion". */
(function () {
  var sec = document.querySelector('.stack-sec');
  if (!sec || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var tags = Array.prototype.slice.call(sec.querySelectorAll('.stack-tag'));
  if (!tags.length) return;
  var n = tags.length, home = [], t0 = performance.now(), running = false, eased = null;
  sec.classList.add('gather-on');

  // where each tag normally sits, measured from the band's centre
  function measure() {
    tags.forEach(function (t) { t.style.translate = 'none'; t.style.scale = '1'; });
    var b = sec.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    home = tags.map(function (t) { var r = t.getBoundingClientRect(); return { x: r.left + r.width / 2 - cx, y: r.top + r.height / 2 - cy }; });
  }
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }
  function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  function frame(now) {
    var b = sec.getBoundingClientRect(), vh = innerHeight;
    // 0 when the band's middle is just below the screen, 1 when it reaches 20% from the top:
    // a long stretch of scrolling, so the tags travel slowly and in step with you
    var target = clamp01((vh * 1.05 - (b.top + b.height / 2)) / (vh * 0.85));
    // follow the scroll smoothly (no jumps when you flick the wheel)
    eased = eased === null ? target : eased + (target - eased) * 0.09;
    if (Math.abs(target - eased) < 0.0005) eased = target;
    var p = eased;
    var t = (now - t0) / 1000, W = b.width;
    var RX = Math.min(W * 0.42, 540), RY = Math.max(60, b.height * 0.42), allHome = true;   // ring stays close to the band
    tags.forEach(function (tag, i) {
      var g = ease(clamp01((p - i * 0.025) / 0.66));         // each tag leaves the ring a moment after the last
      if (g < 1) allHome = false;
      var a = (i / n) * Math.PI * 2 + t * 0.07, z = Math.sin(a), depth = (z + 1) / 2;
      var rx = Math.cos(a) * RX, ry = z * RY - 0.06 * rx;     // tilted ring around the band's middle
      var dx = (rx - home[i].x) * (1 - g), dy = (ry - home[i].y) * (1 - g) - Math.sin(g * Math.PI) * 16;
      tag.style.translate = dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px';
      tag.style.scale = (0.72 + depth * 0.36 + (1 - (0.72 + depth * 0.36)) * g).toFixed(3);
      var op0 = 0.2 + depth * 0.7;                              // far side of the ring is faint
      tag.style.opacity = (op0 + (1 - op0) * g).toFixed(3);
      tag.parentNode.style.zIndex = g > .5 ? 2 : (depth > .5 ? 3 : 1);
    });
    if (allHome && eased === target) { running = false; return; }   // all in place: stop until the next scroll
    requestAnimationFrame(frame);
  }
  function wake() { if (!running) { running = true; requestAnimationFrame(frame); } }
  measure(); wake();
  addEventListener('scroll', wake, { passive: true });
  var lastW = innerWidth;
  addEventListener('resize', function () { if (innerWidth !== lastW) { lastW = innerWidth; measure(); wake(); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); wake(); });
})();
