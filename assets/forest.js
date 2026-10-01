/* 숲속 마법학교 공용 스크립트
   - 도토리/칭찬도장/먼지 요정 그림(SVG symbol) 주입
   - 도토리 지갑: 다각형·입체도형 페이지가 함께 쓰는 보상 (로그인 없이 이 기기에만 저장)
   - 문제 풀이 위젯: 객관식/단답형, 오답 힌트, 정답 시 도토리 */
(function () {
  'use strict';

  const SPRITES = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <radialGradient id="g-nut" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#f0b56a"/><stop offset=".55" stop-color="#c47a35"/><stop offset="1" stop-color="#8a4c1c"/></radialGradient>
  <radialGradient id="g-nut-raw" cx="38%" cy="35%" r="75%"><stop offset="0" stop-color="#f6f0d4"/><stop offset=".6" stop-color="#dcd3a6"/><stop offset="1" stop-color="#bdb384"/></radialGradient>
  <radialGradient id="g-nut-wrong" cx="38%" cy="35%" r="75%"><stop offset="0" stop-color="#f3b39c"/><stop offset=".6" stop-color="#d4735a"/><stop offset="1" stop-color="#a84a35"/></radialGradient>
  <linearGradient id="g-cap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9b7447"/><stop offset="1" stop-color="#5e4024"/></linearGradient>
  <pattern id="p-cap" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="url(#g-cap)"/><path d="M0 0H6M0 0V6" stroke="#4a3019" stroke-width="1.1" opacity=".55"/></pattern>
  <pattern id="p-cap-raw" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="#cbbf98"/><path d="M0 0H5M0 0V5" stroke="#9e9068" stroke-width="1" opacity=".6"/></pattern>
  <radialGradient id="g-stamp" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#e47763"/><stop offset="1" stop-color="#b8412e"/></radialGradient>
  <symbol id="i-acorn" viewBox="0 0 64 64">
    <path d="M14 29 Q13 52 32 59 Q51 52 50 29 Z" fill="url(#g-nut)" stroke="#6e3c15" stroke-width="1.5"/>
    <ellipse cx="22.5" cy="39" rx="3.5" ry="8" fill="#fff" opacity=".45" transform="rotate(12 22.5 39)"/>
    <circle cx="26" cy="43" r="1.9" fill="#3b2410"/><circle cx="38" cy="43" r="1.9" fill="#3b2410"/>
    <path d="M29.5 47 Q32 49.5 34.5 47" stroke="#3b2410" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="22.5" cy="47" rx="3" ry="1.8" fill="#f28c7a" opacity=".6"/><ellipse cx="41.5" cy="47" rx="3" ry="1.8" fill="#f28c7a" opacity=".6"/>
    <path d="M9 31 Q8 15 32 13 Q56 15 55 31 Q32 37 9 31 Z" fill="url(#p-cap)" stroke="#4a3019" stroke-width="1.6"/>
    <path d="M31 14 Q29 7 35 3" stroke="#4a3019" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="i-stamp" viewBox="0 0 64 64">
    <g fill="#f4b8b0" stroke="#d98579" stroke-width="1">
      <ellipse cx="32" cy="9" rx="7" ry="9"/><ellipse cx="32" cy="9" rx="7" ry="9" transform="rotate(45 32 32)"/><ellipse cx="32" cy="9" rx="7" ry="9" transform="rotate(90 32 32)"/><ellipse cx="32" cy="9" rx="7" ry="9" transform="rotate(135 32 32)"/>
      <ellipse cx="32" cy="9" rx="7" ry="9" transform="rotate(180 32 32)"/><ellipse cx="32" cy="9" rx="7" ry="9" transform="rotate(225 32 32)"/><ellipse cx="32" cy="9" rx="7" ry="9" transform="rotate(270 32 32)"/><ellipse cx="32" cy="9" rx="7" ry="9" transform="rotate(315 32 32)"/>
    </g>
    <path d="M12 52 Q4 44 8 36 Q16 42 12 52Z" fill="#6f9a44" stroke="#3c5a2c" stroke-width="1"/><path d="M52 52 Q60 44 56 36 Q48 42 52 52Z" fill="#6f9a44" stroke="#3c5a2c" stroke-width="1"/>
    <circle cx="32" cy="32" r="18" fill="url(#g-stamp)"/><circle cx="32" cy="32" r="15" fill="none" stroke="#fde9d6" stroke-width="1.5" stroke-dasharray="2 2.2"/>
    <path d="M25 29 Q27 26 29 29" stroke="#fff4e4" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M35 29 Q37 26 39 29" stroke="#fff4e4" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M25 35 Q32 42 39 35" stroke="#fff4e4" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  </symbol>
  <symbol id="i-leaf" viewBox="0 0 20 12"><path d="M0 6 Q8 -3 20 6 Q8 15 0 6Z"/><path d="M1 6 H17" stroke="#e4efc4" stroke-width=".8" opacity=".6"/></symbol>
  <symbol id="i-soot" viewBox="0 0 40 40">
    <circle cx="20" cy="22" r="13" fill="#231f1c" stroke="#231f1c" stroke-width="7" stroke-dasharray="1.2 2.1" stroke-linecap="round"/>
    <circle cx="15" cy="20" r="4.4" fill="#fff"/><circle cx="25" cy="20" r="4.4" fill="#fff"/><circle cx="15.6" cy="20.6" r="2" fill="#111"/><circle cx="25.6" cy="20.6" r="2" fill="#111"/>
  </symbol>
</defs></svg>
<svg class="hills" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 100 Q150 50 300 85 T620 70 T900 80 T1200 60 V160 H0Z" fill="#9dbb85" opacity=".35"/>
  <path d="M0 130 Q200 90 380 118 T760 110 T1200 102 V160 H0Z" fill="#6f9a5a" opacity=".32"/>
</svg>`;
  document.body.insertAdjacentHTML('afterbegin', SPRITES);

  const $ = id => document.getElementById(id);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- 도토리 지갑 ---------- */
  const WALLET_KEY = 'forest-wallet';
  const wallet = Object.assign({ acorns: 0, stamps: 0, total: 0 }, store.get(WALLET_KEY, {}));
  let pouchEl = null;

  function mountPouch(el) {
    pouchEl = el;
    el.innerHTML = `
      <span class="pouch-item" data-p="acorn" title="도토리"><svg aria-hidden="true"><use href="#i-acorn"/></svg><span class="tabnum" data-c="acorn">0</span><span class="sr-only">개 도토리</span></span>
      <span class="pouch-item" data-p="stamp" title="칭찬도장"><svg aria-hidden="true"><use href="#i-stamp"/></svg><span class="tabnum" data-c="stamp">0</span><span class="sr-only">개 칭찬도장</span></span>`;
    renderPouch();
  }
  function renderPouch(bumpWhich) {
    if (!pouchEl) return;
    pouchEl.querySelector('[data-c="acorn"]').textContent = wallet.acorns;
    pouchEl.querySelector('[data-c="stamp"]').textContent = wallet.stamps;
    if (bumpWhich) {
      const p = pouchEl.querySelector(`[data-p="${bumpWhich}"]`);
      p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump');
    }
  }

  let exModal = null;
  function ensureExchangeModal() {
    if (exModal) return exModal;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal" id="exchange" hidden role="dialog" aria-modal="true" aria-labelledby="ex-title">
        <div class="tome modal-card">
          <div class="ex-stage" id="ex-stage"><svg class="ex-stamp" aria-hidden="true"><use href="#i-stamp"/></svg></div>
          <h3 id="ex-title" style="margin:0;font-size:1.3rem;color:var(--forest)">도토리 5개가 칭찬도장 1개로 교환되었어!</h3>
          <p class="muted" style="margin:.4rem 0 1rem">먼지 요정들이 도토리를 모아서 도장으로 바꿔 줬어.</p>
          <button class="plank moss" id="ex-close">고마워!</button>
        </div>
      </div>`);
    exModal = $('exchange');
    $('ex-close').addEventListener('click', () => { exModal.hidden = true; });
    return exModal;
  }
  function showExchange() {
    const modal = ensureExchangeModal(), st = $('ex-stage');
    st.classList.remove('merge', 'pop');
    st.querySelectorAll('.ex-acorn, .burst').forEach(n => n.remove());
    modal.hidden = false;
    const w = st.clientWidth || 280;
    for (let i = 0; i < 5; i++) {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('class', 'ex-acorn'); s.innerHTML = '<use href="#i-acorn"/>';
      const left = (w - 250) / 2 + i * 50;
      s.style.left = left + 'px'; s.style.setProperty('--dx', (w / 2 - 23 - left) + 'px');
      st.appendChild(s);
    }
    $('ex-close').focus();
    setTimeout(() => st.classList.add('merge'), 350);
    setTimeout(() => {
      st.classList.add('pop'); renderPouch('stamp');
      if (reduced() || !document.body.animate) return;
      const cols = ['#f2b6b0', '#e8b64a', '#6f9a44', '#c2553f', '#f7e3a1'];
      for (let i = 0; i < 18; i++) {
        const b = document.createElement('span'); b.className = 'burst'; b.style.background = cols[i % 5]; st.appendChild(b);
        const a = i / 18 * Math.PI * 2, d = 70 + Math.random() * 40;
        b.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) rotate(${200 + i * 20}deg) scale(.6)`, opacity: 0 }],
          { duration: 1000, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
      }
    }, 1100);
  }

  function award(fromEl) {
    wallet.acorns++; wallet.total++;
    const done = () => {
      renderPouch('acorn');
      if (wallet.acorns >= 5) { wallet.acorns -= 5; wallet.stamps++; store.set(WALLET_KEY, wallet); setTimeout(showExchange, 250); }
    };
    store.set(WALLET_KEY, wallet);
    const target = pouchEl && pouchEl.querySelector('[data-p="acorn"]');
    if (!target || !fromEl || reduced() || !document.body.animate) { done(); return; }
    const s = fromEl.getBoundingClientRect(), e = target.getBoundingClientRect();
    const fl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    fl.setAttribute('class', 'flyer'); fl.innerHTML = '<use href="#i-acorn"/>';
    document.body.appendChild(fl);
    const sx = s.left + s.width / 2 - 22, sy = s.top;
    fl.animate([
      { transform: `translate(${sx}px,${sy}px) scale(.3)`, opacity: 0 },
      { transform: `translate(${sx}px,${sy - 70}px) scale(1.5) rotate(-20deg)`, opacity: 1, offset: .35 },
      { transform: `translate(${e.left}px,${e.top - 4}px) scale(.8) rotate(340deg)`, opacity: 1 }
    ], { duration: 1000, easing: 'cubic-bezier(.4,0,.3,1)' }).onfinish = () => { fl.remove(); done(); };
  }

  /* ---------- 답 비교 ---------- */
  function normalize(s) {
    let t = String(s).toLowerCase().replace(/\s+/g, '').replace(/,/g, '')
      .replace(/pi|파이|ㅠ/g, 'π')
      .replace(/cm\^?[23³²]|m\^?[23³²]|㎤|㎥|㎠|㎡|cm|㎝|°|도|개|번|배|리터|[()×*]/g, '')
      .replace(/[ml]/g, '');
    t = t.replace(/^1π/, 'π').replace(/\+1π/g, '+π');
    if (t.includes('+')) t = t.split('+').filter(Boolean).sort().join('+');
    return t;
  }

  /* ---------- 문제 풀이 위젯 ---------- */
  const ACORN_BTN = `<svg viewBox="0 0 40 50" aria-hidden="true">
    <path class="leaf" d="M22 6 Q29 -1 37 3 Q31 10 22 6Z" fill="#6f9a44" stroke="#3c5a2c" stroke-width="1"/>
    <path class="nut" d="M7 20 Q6 40 20 48 Q34 40 33 20 Z"/>
    <ellipse class="shine" cx="12.5" cy="31" rx="2.2" ry="5.5" transform="rotate(10 12.5 31)"/>
    <path class="cap" d="M4 21.5 Q3 9 20 8 Q37 9 36 21.5 Q20 26.5 4 21.5 Z"/>
    <path class="stem" d="M19.5 9 Q18.5 4 23 1.5" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`;

  /* questions: [{ type:'mc'|'short', q, options, answer | answers, unit, hint, explain, fig, tag }] */
  function mountQuiz(root, { key, title, questions }) {
    const saved = store.get('quiz-' + key, { answers: {}, cur: 0 });
    let cur = Math.min(saved.cur || 0, questions.length - 1);
    const answers = saved.answers || {};
    const save = () => store.set('quiz-' + key, { answers, cur });
    const uid = 'q' + key.replace(/\W/g, '');

    root.classList.add('quiz');
    root.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-2">
        <h3 class="section-title" style="font-size:1.3rem">${title}</h3>
        <span class="muted tabnum" data-r="progress"></span>
      </div>
      <div class="stones" data-r="stones"></div>
      <article class="tome qcard" aria-live="polite">
        <div class="qmeta"><span class="badge" data-r="tag"></span><span class="qnum tabnum" data-r="num"></span></div>
        <p class="qtext" data-r="text"></p>
        <div data-r="fig"></div>
        <div data-r="answer"></div>
        <div data-r="feedback"></div>
        <div class="flex flex-wrap gap-2 justify-between" style="margin-top:1rem">
          <button class="plank small ghost" data-r="prev">이전 문제</button>
          <button class="plank small" data-r="next">다음 문제</button>
        </div>
      </article>`;
    const R = n => root.querySelector(`[data-r="${n}"]`);

    function renderStones() {
      R('stones').innerHTML = questions.map((q, i) => {
        const a = answers[i];
        const cls = ['stone', a && a.status, i === cur ? 'current' : ''].filter(Boolean).join(' ');
        const lab = `${i + 1}번 ${a && a.status === 'correct' ? '맞힘' : a && a.status === 'wrong' ? '다시 도전' : '아직 안 풂'}`;
        return `<button class="${cls}" data-i="${i}" aria-label="${lab}">${ACORN_BTN}<span class="num" aria-hidden="true">${i + 1}</span></button>`;
      }).join('');
      const solved = Object.values(answers).filter(a => a.status).length;
      const right = Object.values(answers).filter(a => a.status === 'correct').length;
      R('progress').textContent = `푼 문제 ${solved} / ${questions.length} · 맞힌 문제 ${right}`;
    }

    function feedback(good, q, quiet) {
      if (good) {
        R('feedback').innerHTML = `<div class="feedback good"><h4>정답이야! 훌륭해!</h4><p style="margin:.3rem 0 0">${q.explain || ''}</p></div>`;
        return;
      }
      R('feedback').innerHTML = `<div class="feedback bad">
        <h4>${quiet ? '아직 못 맞힌 문제야. 다시 도전해 볼래?' : '음… 조금 아쉬워!'}</h4>
        <div style="margin-top:.5rem"><button class="plank small" data-r="hintbtn" aria-expanded="false">공식을 다시 한 번 떠올려볼까?</button></div>
        <div class="hint-box" data-r="hint" hidden>${q.hint}</div></div>`;
      R('hintbtn').addEventListener('click', e => { R('hint').hidden = false; e.currentTarget.setAttribute('aria-expanded', 'true'); });
    }

    function render() {
      const q = questions[cur], a = answers[cur] || {}, done = a.status === 'correct';
      R('tag').textContent = q.tag || title;
      R('num').textContent = `문제 ${cur + 1} / ${questions.length}`;
      R('text').innerHTML = q.q;
      R('fig').innerHTML = q.fig ? `<div class="qfig">${q.fig}</div>` : '';
      const picks = a.picks || [];
      if (q.type === 'mc') {
        R('answer').innerHTML = `<div class="opts">${q.options.map((o, i) => {
          const cls = done && i === q.answer ? 'is-right' : picks.includes(i) ? 'is-wrong' : '';
          return `<button class="opt ${cls}" data-opt="${i}" ${done || picks.includes(i) ? 'disabled' : ''}><span class="mark">${'①②③④⑤'[i]}</span><span>${o}</span></button>`;
        }).join('')}</div>`;
      } else {
        R('answer').innerHTML = `
          <form class="grid gap-2" data-r="form" novalidate>
            <label for="${uid}-ans" class="sr-only">답 입력</label>
            <div class="short-row">
              <input id="${uid}-ans" class="ans-input" autocomplete="off" placeholder="답을 적어 줘" value="${done ? q.answers[0] : ''}" ${done ? 'disabled' : ''}>
              <span class="unit">${q.unit || ''}</span>
              <button class="plank small moss" type="submit" ${done ? 'disabled' : ''}>답 확인</button>
            </div>
            <div class="keypad" aria-label="기호 입력">${(q.keys || ['π', '+', '/', '.']).map(k => `<button type="button" class="key" data-key="${k}">${k}</button>`).join('')}<button type="button" class="key" data-key="back">지우기</button></div>
          </form>`;
      }
      if (done) feedback(true, q);
      else if (a.status === 'wrong') feedback(false, q, true);
      else R('feedback').innerHTML = '';
      R('prev').disabled = cur === 0;
      R('next').textContent = cur === questions.length - 1 ? '처음 문제로' : '다음 문제';
      renderStones();
    }

    function submit(val) {
      const q = questions[cur];
      const a = answers[cur] || (answers[cur] = { status: null, picks: [] });
      if (a.status === 'correct') return;
      const ok = q.type === 'mc' ? val === q.answer : q.answers.some(x => normalize(x) === normalize(val));
      if (ok) {
        a.status = 'correct'; save(); render();
        award(root.querySelector('.feedback.good'));
      } else {
        a.status = 'wrong';
        if (q.type === 'mc') a.picks.push(val);
        save(); render();
        if (q.type === 'short') { const inp = root.querySelector('.ans-input'); inp.value = val; inp.classList.add('is-wrong'); inp.focus(); inp.select(); }
      }
    }

    root.addEventListener('click', e => {
      const st = e.target.closest('[data-i]'); if (st) { cur = +st.dataset.i; save(); render(); return; }
      const o = e.target.closest('[data-opt]'); if (o && !o.disabled) { submit(+o.dataset.opt); return; }
      const k = e.target.closest('[data-key]');
      if (k) { const inp = root.querySelector('.ans-input'); if (!inp || inp.disabled) return; inp.value = k.dataset.key === 'back' ? inp.value.slice(0, -1) : inp.value + k.dataset.key; inp.focus(); }
    });
    root.addEventListener('submit', e => {
      e.preventDefault(); const inp = root.querySelector('.ans-input'); const v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      submit(v);
    });
    R('prev').addEventListener('click', () => { cur = Math.max(0, cur - 1); save(); render(); });
    R('next').addEventListener('click', () => { cur = (cur + 1) % questions.length; save(); render(); });
    render();
  }

  window.Forest = { mountPouch, award, mountQuiz, normalize, store, reduced };
})();
