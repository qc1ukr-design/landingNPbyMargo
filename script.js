/* ============================================================
   БРОНЕЖИЛЕТ ДЛЯ ФОП — Landing Page Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. STICKY MOBILE CTA ---------- */
  const stickyCta = document.getElementById('stickyCta');
  const hero = document.getElementById('hero');
  const footer = document.getElementById('footer');

  if (stickyCta && hero) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky CTA when hero scrolls out of view
        if (!entry.isIntersecting) {
          stickyCta.classList.add('sticky-cta--visible');
        } else {
          stickyCta.classList.remove('sticky-cta--visible');
        }
      },
      { threshold: 0 }
    );
    observer.observe(hero);

    // Hide sticky CTA when footer is visible
    if (footer) {
      const footerObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            stickyCta.classList.remove('sticky-cta--visible');
          }
        },
        { threshold: 0 }
      );
      footerObserver.observe(footer);
    }
  }

  /* ---------- 2. SCROLL FADE-IN ANIMATIONS ---------- */
  const animTargets = document.querySelectorAll(
    '.pain__card, .solution__item, .steps__item, .results__stat, ' +
    '.social__card, .offer__bonus, .guarantee__card, .faq__item, ' +
    '.results__main, .social__facts, .offer__main-package, ' +
    '.offer__comparison, .offer__price-block, .final-cta__scenarios, ' +
    '.final-cta__testimonial, .calc__wrapper, .quiz__card, .deadline__inner'
  );

  animTargets.forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  animTargets.forEach(el => fadeObserver.observe(el));

  /* ---------- 3. STAGGERED ANIMATION DELAYS ---------- */
  const staggerGroups = [
    '.pain__card',
    '.solution__item',
    '.steps__item',
    '.results__stat',
    '.social__card',
    '.offer__bonus',
  ];

  staggerGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  /* ---------- 4. HEADER SCROLL EFFECT ---------- */
  const header = document.getElementById('header');
  let lastScrollY = 0;

  if (header) {
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      if (currentY > 100) {
        header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
      lastScrollY = currentY;
    }, { passive: true });
  }

  /* ---------- 5. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ---------- 6. ANIMATED COUNTER FOR RESULTS ---------- */
  const counters = document.querySelectorAll('.results__number');

  const animateCounter = (el) => {
    const text = el.textContent.replace(/\u00A0/g, '').trim();
    const hasPlus = text.includes('+');
    const numericPart = text.replace(/[^0-9]/g, '');
    const target = parseInt(numericPart, 10);

    if (isNaN(target) || target === 0) return;

    const duration = 1500;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      let formatted = current.toLocaleString('uk-UA');
      if (hasPlus) formatted += '+';

      el.textContent = formatted;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => counterObserver.observe(el));

  /* ---------- 8. RISK CALCULATOR ---------- */
  const calcRevenue = document.getElementById('calcRevenue');
  const calcRevenueValue = document.getElementById('calcRevenueValue');
  const calcFopsGroup = document.getElementById('calcFops');
  const calcRroGroup = document.getElementById('calcRro');
  const calcEmployeesGroup = document.getElementById('calcEmployees');

  let calcState = { revenue: 300000, fops: 2, rro: 'no', employees: 'no' };

  function formatNum(n) {
    return n.toLocaleString('uk-UA');
  }

  function updateCalc() {
    const { revenue, fops, rro, employees } = calcState;

    let penaltyTotal = 0;
    let penaltyDetails = [];

    if (rro === 'no') {
      const rroFine = Math.round(revenue * 0.15 * 12);
      penaltyTotal += rroFine;
      penaltyDetails.push('Штраф за відсутність РРО/ПРРО');
    }

    if (revenue > 100000) {
      const finmonFine = Math.round(revenue * 0.05 * 12);
      penaltyTotal += finmonFine;
      penaltyDetails.push('Ризик блокування рахунку');
    }

    const lateFine = fops * 3400 * 4;
    penaltyTotal += lateFine;
    penaltyDetails.push('Штрафи за порушення звітності');

    let overpay = 0;
    if (revenue > 500000) {
      overpay = Math.round(revenue * 0.03 * 12);
    } else if (revenue > 250000 && fops < 3) {
      overpay = Math.round(revenue * 0.02 * 12);
    } else {
      overpay = Math.round(revenue * 0.015 * 12);
    }

    let serviceCost = 4500;
    if (fops >= 3) serviceCost = 6500;
    if (fops >= 5) serviceCost = 8500;
    if (employees === 'yes') serviceCost += 1500;
    const serviceAnnual = serviceCost * 12;

    const totalRisk = penaltyTotal + overpay;
    const multiplier = serviceAnnual > 0 ? Math.round(totalRisk / serviceAnnual) : 0;

    const el = (id) => document.getElementById(id);
    const set = (id, text) => { const e = el(id); if (e) e.textContent = text; };

    set('calcPenalty', formatNum(penaltyTotal) + ' грн/рік');
    set('calcPenaltyDetail', penaltyDetails.join(' + '));
    set('calcOverpay', formatNum(overpay) + ' грн/рік');
    set('calcOverpayDetail', 'через неоптимальну структуру ФОПів');
    set('calcService', formatNum(serviceAnnual) + ' грн/рік');
    set('calcTotal', formatNum(totalRisk) + ' грн/рік');
    set('calcMultiplier', multiplier > 0 ? multiplier : '—');
  }

  if (calcRevenue) {
    calcRevenue.addEventListener('input', () => {
      calcState.revenue = parseInt(calcRevenue.value);
      if (calcRevenueValue) calcRevenueValue.textContent = formatNum(calcState.revenue) + ' грн';
      updateCalc();
    });
  }

  function setupBtnGroup(groupEl, stateKey) {
    if (!groupEl) return;
    groupEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.calc__btn');
      if (!btn) return;
      groupEl.querySelectorAll('.calc__btn').forEach(b => b.classList.remove('calc__btn--active'));
      btn.classList.add('calc__btn--active');
      const val = btn.dataset.value;
      calcState[stateKey] = isNaN(val) ? val : parseInt(val);
      updateCalc();
    });
  }

  setupBtnGroup(calcFopsGroup, 'fops');
  setupBtnGroup(calcRroGroup, 'rro');
  setupBtnGroup(calcEmployeesGroup, 'employees');
  updateCalc();

  /* ---------- 9. QUIZ ---------- */
  const quizQuestions = document.getElementById('quizQuestions');
  const quizResult = document.getElementById('quizResult');
  const quizProgressBar = document.getElementById('quizProgressBar');
  const quizStep = document.getElementById('quizStep');
  const quizRestart = document.getElementById('quizRestart');
  let quizCurrent = 0;
  let quizScore = 0;
  const quizTotal = 5;

  if (quizQuestions) {
    quizQuestions.addEventListener('click', (e) => {
      const option = e.target.closest('.quiz__option');
      if (!option) return;
      quizScore += parseInt(option.dataset.score);
      quizCurrent++;

      if (quizCurrent < quizTotal) {
        document.querySelectorAll('.quiz__q').forEach(q => q.style.display = 'none');
        const nextQ = document.querySelector('.quiz__q[data-q="' + quizCurrent + '"]');
        if (nextQ) nextQ.style.display = 'block';
        if (quizProgressBar) quizProgressBar.style.width = ((quizCurrent + 1) / quizTotal * 100) + '%';
        if (quizStep) quizStep.textContent = 'Питання ' + (quizCurrent + 1) + ' з ' + quizTotal;
      } else {
        if (quizQuestions) quizQuestions.style.display = 'none';
        if (quizStep) quizStep.style.display = 'none';
        if (quizProgressBar) quizProgressBar.style.width = '100%';
        if (quizResult) quizResult.style.display = 'block';

        const iconEl = document.getElementById('quizResultIcon');
        const titleEl = document.getElementById('quizResultTitle');
        const textEl = document.getElementById('quizResultText');

        if (quizScore <= 3) {
          if (iconEl) iconEl.textContent = '\u{1F7E2}';
          if (titleEl) titleEl.textContent = 'Непогано! Базовий захист є.';
          if (textEl) textEl.textContent = 'Ви на правильному шляху, але навіть досвідчені підприємці знаходять проблеми під час аудиту. Безкоштовна перевірка покаже, чи все ідеально.';
        } else if (quizScore <= 6) {
          if (iconEl) iconEl.textContent = '\u{1F7E1}';
          if (titleEl) titleEl.textContent = 'Увага! Є зони ризику.';
          if (textEl) textEl.textContent = 'У вашому обліку є вразливі місця, які можуть призвести до штрафів або блокування рахунку. Рекомендуємо аудит.';
        } else {
          if (iconEl) iconEl.textContent = '\u{1F534}';
          if (titleEl) titleEl.textContent = 'Критичний рівень ризику!';
          if (textEl) textEl.textContent = 'Ваш бізнес під серйозною загрозою штрафів та блокувань. Терміново потрібен професійний аудит.';
        }
      }
    });
  }

  if (quizRestart) {
    quizRestart.addEventListener('click', () => {
      quizCurrent = 0;
      quizScore = 0;
      document.querySelectorAll('.quiz__q').forEach((q, i) => q.style.display = i === 0 ? 'block' : 'none');
      if (quizQuestions) quizQuestions.style.display = 'block';
      if (quizResult) quizResult.style.display = 'none';
      if (quizStep) { quizStep.style.display = 'block'; quizStep.textContent = 'Питання 1 з 5'; }
      if (quizProgressBar) quizProgressBar.style.width = '20%';
    });
  }

  /* ---------- 10. DEADLINE TIMER ---------- */
  function getNextDeadline() {
    const now = new Date();
    const y = now.getFullYear();
    const deadlines = [
      { date: new Date(y, 0, 19), name: 'Сплата ЄСВ за 4 квартал' },
      { date: new Date(y, 1, 9), name: 'Подання декларації за 4 квартал' },
      { date: new Date(y, 1, 19), name: 'Сплата ЄСВ за січень' },
      { date: new Date(y, 2, 19), name: 'Сплата ЄСВ за лютий' },
      { date: new Date(y, 3, 19), name: 'Сплата ЄСВ за березень' },
      { date: new Date(y, 4, 9), name: 'Подання декларації за 1 квартал' },
      { date: new Date(y, 4, 19), name: 'Сплата ЄП та ЄСВ за квітень' },
      { date: new Date(y, 5, 19), name: 'Сплата ЄСВ за травень' },
      { date: new Date(y, 6, 19), name: 'Сплата ЄСВ за червень' },
      { date: new Date(y, 7, 9), name: 'Подання декларації за 2 квартал' },
      { date: new Date(y, 7, 19), name: 'Сплата ЄП та ЄСВ за липень' },
      { date: new Date(y, 8, 19), name: 'Сплата ЄСВ за серпень' },
      { date: new Date(y, 9, 19), name: 'Сплата ЄСВ за вересень' },
      { date: new Date(y, 10, 9), name: 'Подання декларації за 3 квартал' },
      { date: new Date(y, 10, 19), name: 'Сплата ЄП та ЄСВ за жовтень' },
      { date: new Date(y, 11, 19), name: 'Сплата ЄСВ за листопад' },
      { date: new Date(y + 1, 0, 19), name: 'Сплата ЄСВ за грудень' },
    ];
    for (const dl of deadlines) { if (dl.date > now) return dl; }
    return deadlines[deadlines.length - 1];
  }

  function updateDeadlineTimer() {
    const dl = getNextDeadline();
    const diff = dl.date - new Date();
    if (diff <= 0) return;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val).padStart(2, '0'); };
    set('deadlineDays', d);
    set('deadlineHours', h);
    set('deadlineMinutes', m);
    set('deadlineSeconds', s);

    const eventEl = document.getElementById('deadlineEvent');
    if (eventEl) eventEl.textContent = dl.name;
  }

  updateDeadlineTimer();
  setInterval(updateDeadlineTimer, 1000);

  /* ---------- 7. FAQ SMOOTH OPEN/CLOSE ---------- */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const summary = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!summary || !answer) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (item.open) {
        // Animate close
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0';
          answer.style.paddingBottom = '0';
        });
        answer.addEventListener('transitionend', () => {
          item.open = false;
          answer.style.maxHeight = '';
          answer.style.overflow = '';
          answer.style.paddingBottom = '';
        }, { once: true });
      } else {
        // Animate open
        item.open = true;
        const height = answer.scrollHeight;
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.paddingBottom = '0';
        requestAnimationFrame(() => {
          answer.style.transition = 'max-height 0.35s ease, padding-bottom 0.35s ease';
          answer.style.maxHeight = height + 'px';
          answer.style.paddingBottom = '24px';
        });
        answer.addEventListener('transitionend', () => {
          answer.style.maxHeight = '';
          answer.style.overflow = '';
          answer.style.transition = '';
        }, { once: true });
      }
    });
  });

});
