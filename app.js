(function () {
  var app = document.getElementById('app');
  var top = document.getElementById('top');
  var tabs = document.getElementById('tabs');
  var C = {}; COURSES.forEach(function (c) { C[c.id] = c; });
  var cache = {};
  var DAYN = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

  // ---------- рисунки ----------
  var BERRY = '#c23b74', GREEN = '#2d8a55', LINE = '#5a3446';
  function heart(s, c) { return '<svg class="h" width="' + s + '" height="' + s + '" viewBox="0 0 24 24"><path fill="' + (c || '#f06a9f') + '" d="M12 21s-7.5-4.6-9.6-9.2C.8 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6h2c.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.9 3.8 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>'; }
  function bow(s, c) {
    c = c || '#f06a9f';
    return '<svg class="bow" width="' + s + '" height="' + s * 0.7 + '" viewBox="0 0 40 28"><path fill="' + c + '" stroke="' + LINE + '" stroke-width="1.6" stroke-linejoin="round" d="M20 14C14 4 3 1 3 8v12c0 7 11 4 17-6zM20 14c6-10 17-13 17-6v12c0 7-11 4-17-6z"/>' +
      '<path fill="#fff" opacity=".55" d="M7 8c2-2 6 0 8 3-3 1-6 1-8-3zM33 8c-2-2-6 0-8 3 3 1 6 1 8-3z"/>' +
      '<ellipse cx="20" cy="14" rx="5" ry="5.5" fill="' + c + '" stroke="' + LINE + '" stroke-width="1.6"/><ellipse cx="18.6" cy="12.4" rx="1.6" ry="1.2" fill="#fff" opacity=".7"/></svg>';
  }
  // Котёнок: свой рисунок (кремовый, улыбающиеся глазки, бантик на макушке).
  function kitten(s, bowc) {
    bowc = bowc || '#f06a9f';
    return '<svg class="kit" width="' + s + '" height="' + s + '" viewBox="0 0 64 64">' +
      '<path fill="#fffaf3" stroke="' + LINE + '" stroke-width="2.2" stroke-linejoin="round" d="M10 30 8 9c0-2 2-3 4-2l13 9c4-1 10-1 14 0l13-9c2-1 4 0 4 2l-2 21c3 4 4 8 4 11 0 11-11 18-26 18S6 52 6 41c0-3 1-7 4-11z"/>' +
      '<path fill="#ffc6da" d="M13 12l9 6-7 5zM51 12l-9 6 7 5z"/>' +
      '<path fill="none" stroke="' + LINE + '" stroke-width="2.4" stroke-linecap="round" d="M19 38q3.5-4 7 0M38 38q3.5-4 7 0"/>' +
      '<ellipse cx="16" cy="45" rx="4.5" ry="3" fill="#ffb3cf" opacity=".75"/><ellipse cx="48" cy="45" rx="4.5" ry="3" fill="#ffb3cf" opacity=".75"/>' +
      '<path fill="#f27aa6" d="M29.5 42h5l-2.5 3z"/>' +
      '<path fill="none" stroke="' + LINE + '" stroke-width="1.8" stroke-linecap="round" d="M32 45q-1.8 3-4 1.4M32 45q1.8 3 4 1.4"/>' +
      '<path stroke="' + LINE + '" stroke-width="1.5" stroke-linecap="round" d="M3 40l8 1M3 46l8-1M61 40l-8 1M61 46l-8-1"/>' +
      '<g transform="translate(22 9)"><path fill="' + bowc + '" stroke="' + LINE + '" stroke-width="1.6" stroke-linejoin="round" d="M10 7C7 2 1 0 1 4v6c0 4 6 2 9-3zM10 7c3-5 9-7 9-3v6c0 4-6 2-9-3z"/><circle cx="10" cy="7" r="3" fill="' + bowc + '" stroke="' + LINE + '" stroke-width="1.6"/></g>' +
      '</svg>';
  }
  function calendar(s) {
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="22" rx="5" fill="#fff" stroke="' + BERRY + '" stroke-width="2.2"/><path d="M4 13h24" stroke="' + BERRY + '" stroke-width="2.2"/><path d="M11 3v6M21 3v6" stroke="' + BERRY + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<g fill="#f06a9f"><circle cx="11" cy="18" r="1.7"/><circle cx="16" cy="18" r="1.7"/><circle cx="21" cy="18" r="1.7"/><circle cx="11" cy="23" r="1.7"/><circle cx="16" cy="23" r="1.7"/></g></svg>';
  }
  function atom(s) {
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 32 32" fill="none" stroke="' + BERRY + '" stroke-width="1.8"><ellipse cx="16" cy="16" rx="13" ry="5"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(120 16 16)"/><circle cx="16" cy="16" r="2.4" fill="#f06a9f" stroke="none"/></svg>';
  }
  function flask(s) {
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 32 32"><path d="M12 3h8M13 3v9L5 26c-1 2 0 3 2 3h18c2 0 3-1 2-3l-8-14V3" fill="#fff" stroke="' + GREEN + '" stroke-width="2" stroke-linejoin="round"/><path d="M9 20h14l3 6c.5 1 0 1.6-1 1.6H7c-1 0-1.5-.6-1-1.6z" fill="#3fae6c"/><circle cx="14" cy="23" r="1.3" fill="#fff"/><circle cx="19" cy="25" r="1" fill="#fff"/></svg>';
  }
  function chev(c) { return '<svg width="10" height="16" viewBox="0 0 10 16"><path d="M2 2l6 6-6 6" fill="none" stroke="' + (c || 'currentColor') + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function arrow(left) { return '<svg width="14" height="20" viewBox="0 0 10 16"><path d="' + (left ? 'M8 2 2 8l6 6' : 'M2 2l6 6-6 6') + '" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  var NAV = {
    home: '<path d="M4 13 14 4l10 9M7 11v12h5v-7h4v7h5V11" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>',
    book: '<path d="M14 7c-3-2-7-2-10-1v16c3-1 7-1 10 1 3-2 7-2 10-1V6c-3-1-7-1-10 1zM14 7v16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    cal: '<rect x="4" y="6" width="20" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 11h20M10 3v5M18 3v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><g fill="currentColor"><circle cx="10" cy="16" r="1.4"/><circle cx="14" cy="16" r="1.4"/><circle cx="18" cy="16" r="1.4"/><circle cx="10" cy="20" r="1.4"/><circle cx="14" cy="20" r="1.4"/></g>',
    stat: '<path d="M5 23h18M7 23V15h4v8M12 23V10h4v13M17 23V5h4v18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    search: '<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M17.5 17.5 24 24" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'
  };
  function nav(k) { return '<svg width="26" height="26" viewBox="0 0 28 28">' + NAV[k] + '</svg>'; }

  // ---------- утилиты ----------
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function d(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dm(dt) { return ('0' + dt.getDate()).slice(-2) + '.' + ('0' + (dt.getMonth() + 1)).slice(-2); }
  function range(w) { return dm(d(WEEKS[w][0])) + '–' + dm(d(WEEKS[w][1])); }
  function isChem(c) { return C[c].subj === 'Химия'; }

  // Номер текущей учебной недели (с 0); before = сейчас каникулы перед этой неделей.
  function nowWeek() {
    var t = new Date(); t.setHours(0, 0, 0, 0);
    for (var i = 0; i < WEEKS.length; i++) {
      var a = d(WEEKS[i][0]), b = d(WEEKS[i][1]);
      a.setDate(a.getDate() - ((a.getDay() + 6) % 7));
      b.setDate(b.getDate() + 1);
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
    return 'Неделя ' + (w + 1) + ' · ' + range(w);
  }
  function titleOf(c, n) {
    for (var i = 0; i < INDEX.length; i++) if (INDEX[i][0] === c && INDEX[i][1] === n) return INDEX[i][2];
    return '';
  }
  function load(c) {
    if (window.ALLDATA) return Promise.resolve(window.ALLDATA[c]);
    if (cache[c]) return Promise.resolve(cache[c]);
    return fetch('data/' + c + '.json').then(function (r) { return r.json(); }).then(function (j) { cache[c] = j; return j; });
  }

  // ---------- шапка и меню ----------
  function header(title, back) {
    if (!title) {
      top.innerHTML = '<div class="deco-l">' + heart(18, '#f9b3cd') + '<div style="margin:2px 0 0 14px">' + kitten(54) + '</div></div>' +
        '<div class="brand">' + heart(16) + '<h1>Уроки</h1>' + heart(16) + '</div>' +
        '<div class="deco-r"><a href="#/s/" class="round" aria-label="Поиск">' + nav('search') + '</a><div style="margin:8px 0 0 -6px">' + bow(42) + '</div></div>';
    } else {
      top.innerHTML = '<div class="sub"><a class="round" href="' + back + '" aria-label="Назад">' + arrow(true) + '</a><h1>' + esc(title) + '</h1>' +
        '<a href="#/s/" class="round" aria-label="Поиск">' + nav('search') + '</a></div>';
    }
    document.title = title ? title + ' · Уроки' : 'Уроки';
  }
  function setTabs(on) {
    var items = [['home', '#/', 'Главная', 'home'], ['book', '#/classes', 'Уроки', 'lessons'], ['cal', '#/weeks', 'Расписание', 'weeks'], ['stat', '#/stats', 'Статистика', 'stats'], ['me', '#/me', 'Профиль', 'me']];
    tabs.innerHTML = items.map(function (t) {
      var ic = t[0] === 'me' ? kitten(28) : nav(t[0]);
      return '<a href="' + t[1] + '" class="' + (on === t[3] ? 'on' : '') + '">' + ic + '<span>' + t[2] + '</span></a>';
    }).join('');
  }
  function page(title, back, tab) { header(title, back); setTabs(tab); window.scrollTo(0, 0); }

  function lessonRow(c, n, i, showPill, cur) {
    var ch = isChem(c);
    var left = showPill
      ? '<span class="pill">' + (i % 2 ? bow(28, ch ? '#5cc287' : '#f06a9f') : kitten(30, ch ? '#5cc287' : '#f06a9f')) + esc(C[c].name) + '</span>'
      : '<span class="num">' + n + '</span>';
    return '<a class="row' + (ch ? ' chem' : '') + (cur ? ' cur' : '') + '" href="#/l/' + c + '/' + n + '">' + left +
      '<span class="txt">' + (showPill ? 'Урок ' + n + '. ' : '') + esc(titleOf(c, n)) + '<small>' + esc(dayLabel(c, n)) + '</small></span>' +
      '<span class="end">' + heart(14, ch ? '#7fd0a0' : '#f48bb5') + chev() + '</span></a>';
  }
  function classGrid() {
    var h = '<div class="grid">';
    COURSES.forEach(function (c) {
      var ch = c.subj === 'Химия';
      h += '<a class="cls' + (ch ? ' chem' : '') + '" href="#/c/' + c.id + '"><span class="ic">' + (ch ? flask(22) : atom(22)) + '</span>' +
        '<span class="t"><b>' + c.grade + ' кл.</b><span>' + c.subj + '</span></span><span class="chev">' + chev() + '</span></a>';
    });
    return h + '</div>';
  }

  // ---------- страницы ----------
  var viewWeek = null;
  function home() {
    var now = nowWeek();
    if (viewWeek === null) viewWeek = now.w;
    var w = viewWeek;
    page('', '', 'home');
    var h = '<div class="week"><button class="round" id="wp" aria-label="Прошлая неделя">' + arrow(true) + '</button>' +
      '<a class="cal" href="#/weeks" aria-label="Все недели">' + calendar(30) + '</a>' +
      '<div class="mid"><b>Неделя ' + (w + 1) + '</b><span>' + range(w).replace('–', ' – ') + '</span></div>' +
      '<span class="cat">' + kitten(50) + '</span>' +
      '<button class="round" id="wn" aria-label="Следующая неделя">' + arrow(false) + '</button></div>';
    if (w === now.w && now.before && w > 0) h += '<p class="note">Сейчас каникулы ♡ Показана следующая учебная неделя.</p>';
    if (w === now.w && now.before && w === 0) h += '<p class="note">Учебный год ещё не начался.</p>';
    if (w !== now.w) h += '<button class="today" id="today">Вернуться к текущей неделе</button>';
    h += '<section class="card"><div class="ch">' + bow(34) + '<h2>' + (w === now.w ? 'Уроки этой недели' : 'Уроки недели') + '</h2>' + heart(14) +
      '<span class="cheer">Ты можешь! ' + heart(16) + '</span></div><div class="rows">';
    var i = 0;
    COURSES.forEach(function (c) { lessonsOfWeek(c.id, w).forEach(function (n) { h += lessonRow(c.id, n, i++, true); }); });
    h += '</div></section>';
    h += '<section class="card"><div class="ch">' + heart(20) + '<h2>Все уроки по классам</h2></div>' + classGrid() +
      '<div class="cheerline">' + kitten(44) + '<span class="bubble">Всё получится! ' + heart(12) + '</span>' + bow(40) + '</div></section>';
    app.innerHTML = h;
    document.getElementById('wp').onclick = function () { if (viewWeek > 0) { viewWeek--; home(); } };
    document.getElementById('wn').onclick = function () { if (viewWeek < WEEKS.length - 1) { viewWeek++; home(); } };
    var t = document.getElementById('today'); if (t) t.onclick = function () { viewWeek = now.w; home(); };
  }

  function classes() {
    page('Все уроки', '#/', 'lessons');
    app.innerHTML = '<section class="card"><div class="ch">' + bow(34) + '<h2>Выберите класс</h2></div>' + classGrid() + '</section>';
  }

  function course(c) {
    page(C[c].name + ' класс', '#/classes', 'lessons');
    app.innerHTML = '<p class="empty">Загрузка…</p>';
    var cw = nowWeek().w;
    load(c).then(function (j) {
      var h = '';
      j.sections.forEach(function (s) {
        h += '<section class="card secblock"><div class="sec">' + esc(s.title) + '</div><div class="rows">';
        s.lessons.forEach(function (l) { h += lessonRow(c, l.n, 0, false, weekOf(c, l.n) === cw); });
        h += '</div></section>';
      });
      app.innerHTML = h;
      var cur = app.querySelector('.row.cur');
      if (cur) cur.scrollIntoView({ block: 'center' });
    }).catch(fail);
  }

  function lesson(c, n) {
    page(C[c].name + ' · Урок ' + n, '#/c/' + c, 'lessons');
    app.innerHTML = '<p class="empty">Загрузка…</p>';
    load(c).then(function (j) {
      var L, sec;
      j.sections.forEach(function (s) { s.lessons.forEach(function (l) { if (l.n === n) { L = l; sec = s; } }); });
      if (!L) { app.innerHTML = '<p class="empty">Урок не найден</p>'; return; }
      var h = '<div class="' + (isChem(c) ? 'chem' : '') + '"><div class="tools"><button id="fm" aria-label="Мельче">A−</button><button id="fp" aria-label="Крупнее">A+</button></div>' +
        '<article class="lesson"><p class="meta">' + esc(C[c].name) + ' класс · ' + esc(sec.title) + '<br>' + esc(dayLabel(c, n)) + '</p>' +
        '<h3>Урок ' + n + '. ' + esc(L.t) + '</h3>' + L.h + '</article><div class="pager">' +
        '<button id="pv"' + (n > 1 ? '' : ' disabled') + '><small>‹ Назад</small>' + (n > 1 ? 'Урок ' + (n - 1) : '') + '</button>' +
        '<button class="n" id="nx"' + (n < C[c].count ? '' : ' disabled') + '><small>Вперёд ›</small>' + (n < C[c].count ? 'Урок ' + (n + 1) : '') + '</button></div></div>';
      app.innerHTML = h;
      document.getElementById('pv').onclick = function () { location.replace('#/l/' + c + '/' + (n - 1)); };
      document.getElementById('nx').onclick = function () { location.replace('#/l/' + c + '/' + (n + 1)); };
      document.getElementById('fm').onclick = function () { font(-1); };
      document.getElementById('fp').onclick = function () { font(1); };
    }).catch(fail);
  }

  function weeks() {
    page('Расписание', '#/', 'weeks');
    var cw = nowWeek().w, h = '<section class="card"><div class="ch">' + calendar(28) + '<h2>Учебные недели</h2></div><div class="rows">';
    for (var w = 0; w < WEEKS.length; w++) {
      if (w > 0) {
        var prevEnd = d(WEEKS[w - 1][1]), start = d(WEEKS[w][0]);
        if ((start - prevEnd) / 864e5 > 3) h += '<div class="gap">каникулы ♡</div>';
      }
      h += '<a class="weekrow' + (w === cw ? ' cur' : '') + '" href="#/w/' + w + '"><b>Неделя ' + (w + 1) + '</b><span>' + range(w) + '</span>' + chev(BERRY) + '</a>';
    }
    app.innerHTML = h + '</div></section>';
  }

  function stats() {
    page('Статистика', '#/', 'stats');
    var now = nowWeek(), done = now.before ? now.w : now.w + 1;
    var h = '<section class="card"><div class="ch">' + bow(34) + '<h2>Сколько уроков пройдено</h2></div>' +
      '<p class="big">По расписанию на сегодня (считая текущую неделю):</p>';
    var all = 0, allDone = 0;
    COURSES.forEach(function (c) {
      var k = Math.min(c.count, done * c.perWeek); all += c.count; allDone += k;
      h += '<div class="stat' + (c.subj === 'Химия' ? ' chem' : '') + '"><span class="lbl">' + c.name + '</span><span class="bar"><i style="width:' + Math.round(100 * k / c.count) + '%"></i></span><span class="v">' + k + ' из ' + c.count + '</span></div>';
    });
    h += '<p class="big">Всего: <b>' + allDone + ' из ' + all + '</b> уроков. Учебная неделя ' + Math.min(done || 1, WEEKS.length) + ' из ' + WEEKS.length + '.</p>' +
      '<div class="cheerline">' + kitten(44) + '<span class="bubble">Ты молодец! ' + heart(12) + '</span>' + bow(40) + '</div></section>';
    app.innerHTML = h;
  }

  function me() {
    page('Профиль', '#/', 'me');
    var fs = parseInt(store('fs'), 10) || 18;
    app.innerHTML = '<section class="card"><div class="ch">' + kitten(40) + '<h2>Настройки</h2></div>' +
      '<div class="setrow"><span class="grow">Размер текста урока: <span id="fsv">' + fs + '</span></span><button id="fm">A−</button><button id="fp">A+</button></div></section>' +
      '<section class="card"><div class="ch">' + heart(20) + '<h2>Значок на экране «Домой»</h2></div><div class="big"><ol>' +
      '<li>Откройте этот сайт в Safari.</li><li>Нажмите «Поделиться» (квадрат со стрелкой вверх).</li><li>Выберите «На экран «Домой»» и нажмите «Добавить».</li></ol>' +
      'Сайт будет открываться как приложение, даже без интернета.</div></section>' +
      '<section class="card"><div class="ch">' + bow(34) + '<h2>О сайте</h2></div><p class="big">Поурочные планы по КТП КАО 2026/27: физика 7–9 и химия 7–9 классов, ' + INDEX.length + ' уроков с заданиями и ответами.</p></section>';
    document.getElementById('fm').onclick = function () { font(-1); document.getElementById('fsv').textContent = store('fs'); };
    document.getElementById('fp').onclick = function () { font(1); document.getElementById('fsv').textContent = store('fs'); };
  }

  function font(delta) {
    var v = parseInt(store('fs'), 10) || 18;
    v = Math.max(14, Math.min(28, v + delta * 2));
    store('fs', String(v));
    document.documentElement.style.setProperty('--fs', v + 'px');
  }

  function norm(s) { return s.toLowerCase().replace(/ё/g, 'е'); }
  function search(q) {
    page('Поиск', '#/', 'lessons');
    app.innerHTML = '<input class="search" id="q" type="search" placeholder="Тема урока, например «давление»" autocomplete="off" value="' + esc(q) + '"><div id="res"></div>';
    var inp = document.getElementById('q'), res = document.getElementById('res');
    function run() {
      var v = norm(inp.value.trim());
      history.replaceState(null, '', '#/s/' + encodeURIComponent(inp.value));
      if (v.length < 2) { res.innerHTML = '<p class="empty">Введите хотя бы 2 буквы ♡</p>'; return; }
      var words = v.split(/\s+/), h = '', k = 0;
      INDEX.forEach(function (e) {
        var hay = norm(e[2] + ' ' + e[3] + ' ' + C[e[0]].name);
        if (words.every(function (w) { return hay.indexOf(w) >= 0; })) { h += lessonRow(e[0], e[1], k, true); k++; }
      });
      res.innerHTML = k ? '<section class="card"><div class="ch">' + heart(18) + '<h2>Найдено: ' + k + '</h2></div><div class="rows">' + h + '</div></section>' : '<p class="empty">Ничего не найдено</p>';
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
    if (p[0] === 'classes') return classes();
    if (p[0] === 'weeks') return weeks();
    if (p[0] === 'w') { viewWeek = Math.max(0, Math.min(WEEKS.length - 1, parseInt(p[1], 10) || 0)); location.replace('#/'); return; }
    if (p[0] === 'stats') return stats();
    if (p[0] === 'me') return me();
    home();
  }

  window.addEventListener('hashchange', route);
  var fs = parseInt(store('fs'), 10); if (fs) document.documentElement.style.setProperty('--fs', fs + 'px');
  route();
  if (!window.ALLDATA && 'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
