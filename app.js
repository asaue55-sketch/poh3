(function () {
  var app = document.getElementById('app');
  var titleEl = document.getElementById('title');
  var backBtn = document.getElementById('back');
  var C = {}; COURSES.forEach(function (c) { C[c.id] = c; });
  var cache = {};
  var DAYN = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function d(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dm(dt) { return ('0' + dt.getDate()).slice(-2) + '.' + ('0' + (dt.getMonth() + 1)).slice(-2); }
  function range(w) { return dm(d(WEEKS[w][0])) + '–' + dm(d(WEEKS[w][1])); }
  function isChem(c) { return C[c].subj === 'Химия'; }
  function tag(c) { return '<span class="tag' + (isChem(c) ? ' chem' : '') + '">' + esc(C[c].name) + '</span>'; }

  // Номер текущей учебной недели (с 0) и пометка, если сейчас каникулы.
  function nowWeek() {
    var t = new Date(); t.setHours(0, 0, 0, 0);
    for (var i = 0; i < WEEKS.length; i++) {
      var a = d(WEEKS[i][0]), b = d(WEEKS[i][1]);
      a.setDate(a.getDate() - ((a.getDay() + 6) % 7)); // от понедельника
      b.setDate(b.getDate() + 1); // воскресенье
      if (t < a) return { w: i, before: true };
      if (t <= b) return { w: i };
    }
    return { w: WEEKS.length - 1, after: true };
  }
  function weekOf(c, n) { return Math.ceil(n / C[c].perWeek) - 1; }
  function lessonsOfWeek(c, w) {
    var pw = C[c].perWeek, r = [];
    for (var n = w * pw + 1; n <= (w + 1) * pw && n <= C[c].count; n++) r.push(n);
    return r;
  }
  function dayLabel(c, n) {
    var w = weekOf(c, n), days = (window.DAYS || {})[c] || [];
    var k = (n - 1) % C[c].perWeek;
    if (w < 0 || w >= WEEKS.length) return '';
    if (days[k]) {
      var a = d(WEEKS[w][0]); a.setDate(a.getDate() - ((a.getDay() + 6) % 7) + days[k] - 1);
      return DAYN[a.getDay()] + ', ' + dm(a);
    }
    return 'неделя ' + (w + 1) + ' · ' + range(w);
  }
  function titleOf(c, n) {
    for (var i = 0; i < INDEX.length; i++) if (INDEX[i][0] === c && INDEX[i][1] === n) return INDEX[i][2];
    return '';
  }
  function load(c) {
    if (cache[c]) return Promise.resolve(cache[c]);
    return fetch('data/' + c + '.json').then(function (r) { return r.json(); }).then(function (j) { cache[c] = j; return j; });
  }
  function setTop(t, canBack) {
    titleEl.textContent = t; document.title = t === 'Уроки' ? 'Уроки' : t + ' · Уроки';
    backBtn.classList.toggle('hide', !canBack);
    window.scrollTo(0, 0);
  }

  function lessonRow(c, n, showTag, cur) {
    return '<a class="row' + (cur ? ' cur' : '') + '" href="#/l/' + c + '/' + n + '">' +
      (showTag ? tag(c) : '<span class="num">' + n + '</span>') +
      '<span class="txt">' + (showTag ? 'Урок ' + n + '. ' : '') + esc(titleOf(c, n)) +
      '<small>' + esc(dayLabel(c, n)) + '</small></span><span class="chev">›</span></a>';
  }

  var viewWeek = null;
  function home() {
    var now = nowWeek();
    if (viewWeek === null) viewWeek = now.w;
    var w = viewWeek;
    setTop('Уроки', false);
    var h = '<div class="weeknav"><button id="wp" aria-label="Прошлая неделя">‹</button>' +
      '<div class="mid"><b>Неделя ' + (w + 1) + '</b><span>' + range(w) + '</span></div>' +
      '<button id="wn" aria-label="Следующая неделя">›</button></div>';
    if (w === now.w && now.before && w > 0) h += '<p class="note">Сейчас каникулы. Показана следующая учебная неделя.</p>';
    if (w === now.w && now.before && w === 0) h += '<p class="note">Учебный год ещё не начался.</p>';
    if (w !== now.w) h += '<button class="today" id="today">Вернуться к текущей неделе</button>';
    h += '<h2>' + (w === now.w ? 'Уроки этой недели' : 'Уроки недели') + '</h2><div class="list">';
    COURSES.forEach(function (c) { lessonsOfWeek(c.id, w).forEach(function (n) { h += lessonRow(c.id, n, true); }); });
    h += '</div><h2>Все уроки по классам</h2><div class="grid">';
    COURSES.forEach(function (c) {
      h += '<a class="cls ' + (c.subj === 'Химия' ? 'chem' : 'phys') + '" href="#/c/' + c.id + '"><b>' + c.grade + ' кл.</b><span>' + c.subj + '</span></a>';
    });
    h += '</div>';
    var standalone = window.navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
    if (!standalone) h += '<p class="hint">Совет: в Safari нажмите «Поделиться» (квадрат со стрелкой), затем «На экран «Домой»». Появится значок «Уроки», и сайт будет открываться как приложение, даже без интернета.</p>';
    app.innerHTML = h;
    document.getElementById('wp').onclick = function () { if (viewWeek > 0) { viewWeek--; home(); } };
    document.getElementById('wn').onclick = function () { if (viewWeek < WEEKS.length - 1) { viewWeek++; home(); } };
    var t = document.getElementById('today'); if (t) t.onclick = function () { viewWeek = now.w; home(); };
  }

  function course(c) {
    setTop(C[c].name + ' класс', true);
    app.innerHTML = '<p class="empty">Загрузка…</p>';
    var cw = nowWeek().w;
    load(c).then(function (j) {
      var h = '';
      j.sections.forEach(function (s) {
        h += '<div class="sec">' + esc(s.title) + '</div><div class="list">';
        s.lessons.forEach(function (l) { h += lessonRow(c, l.n, false, weekOf(c, l.n) === cw); });
        h += '</div>';
      });
      app.innerHTML = h;
      var cur = app.querySelector('.row.cur');
      if (cur) cur.scrollIntoView({ block: 'center' });
    }).catch(fail);
  }

  function lesson(c, n) {
    setTop(C[c].name + ' · Урок ' + n, true);
    app.innerHTML = '<p class="empty">Загрузка…</p>';
    load(c).then(function (j) {
      var L, sec;
      j.sections.forEach(function (s) { s.lessons.forEach(function (l) { if (l.n === n) { L = l; sec = s; } }); });
      if (!L) { app.innerHTML = '<p class="empty">Урок не найден</p>'; return; }
      var h = '<div class="tools"><button id="fm" aria-label="Мельче">A−</button><button id="fp" aria-label="Крупнее">A+</button></div>' +
        '<article class="lesson"><p class="meta">' + esc(C[c].name) + ' класс · ' + esc(sec.title) + '<br>' + esc(dayLabel(c, n)) + '</p>' +
        '<h3>Урок ' + n + '. ' + esc(L.t) + '</h3>' + L.h + '</article><div class="pager">' +
        '<button id="pv"' + (n > 1 ? '' : ' disabled') + '><small>‹ Назад</small>' + (n > 1 ? 'Урок ' + (n - 1) : '') + '</button>' +
        '<button class="n" id="nx"' + (n < C[c].count ? '' : ' disabled') + '><small>Вперёд ›</small>' + (n < C[c].count ? 'Урок ' + (n + 1) : '') + '</button></div>';
      app.innerHTML = h;
      document.getElementById('pv').onclick = function () { location.replace('#/l/' + c + '/' + (n - 1)); };
      document.getElementById('nx').onclick = function () { location.replace('#/l/' + c + '/' + (n + 1)); };
      document.getElementById('fm').onclick = function () { font(-1); };
      document.getElementById('fp').onclick = function () { font(1); };
    }).catch(fail);
  }

  function font(delta) {
    var v = parseInt(store('fs'), 10) || 18;
    v = Math.max(15, Math.min(28, v + delta * 2));
    store('fs', String(v));
    document.documentElement.style.setProperty('--fs', v + 'px');
  }

  function norm(s) { return s.toLowerCase().replace(/ё/g, 'е'); }
  function search(q) {
    setTop('Поиск', true);
    app.innerHTML = '<input class="search" id="q" type="search" placeholder="Тема урока, например «давление»" autocomplete="off" value="' + esc(q) + '"><div id="res"></div>';
    var inp = document.getElementById('q'), res = document.getElementById('res');
    function run() {
      var v = norm(inp.value.trim());
      history.replaceState(null, '', '#/s/' + encodeURIComponent(inp.value));
      if (v.length < 2) { res.innerHTML = '<p class="empty">Введите хотя бы 2 буквы</p>'; return; }
      var words = v.split(/\s+/), h = '', k = 0;
      INDEX.forEach(function (e) {
        var hay = norm(e[2] + ' ' + e[3] + ' ' + C[e[0]].name);
        if (words.every(function (w) { return hay.indexOf(w) >= 0; })) { h += lessonRow(e[0], e[1], true); k++; }
      });
      res.innerHTML = k ? '<h2>Найдено: ' + k + '</h2><div class="list">' + h + '</div>' : '<p class="empty">Ничего не найдено</p>';
    }
    inp.oninput = run; run();
    if (!q) inp.focus();
  }

  function fail() { app.innerHTML = '<p class="empty">Не удалось загрузить. Проверьте интернет и обновите страницу.</p>'; }

  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/');
    if (p[0] === 'c' && C[p[1]]) return course(p[1]);
    if (p[0] === 'l' && C[p[1]]) return lesson(p[1], parseInt(p[2], 10) || 1);
    if (p[0] === 's') return search(decodeURIComponent(p.slice(1).join('/') || ''));
    home();
  }

  backBtn.onclick = function () {
    var p = location.hash.replace(/^#\/?/, '').split('/');
    if (p[0] === 'l') location.hash = '#/c/' + p[1];
    else location.hash = '#/';
  };
  document.getElementById('searchbtn').onclick = function () { location.hash = '#/s/'; };
  window.addEventListener('hashchange', route);
  var fs = parseInt(store('fs'), 10); if (fs) document.documentElement.style.setProperty('--fs', fs + 'px');
  route();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
