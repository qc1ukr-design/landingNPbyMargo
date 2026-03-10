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
    '.final-cta__testimonial'
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
