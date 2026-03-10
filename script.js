/* =============================================
   MOBILE NAV TOGGLE
   ============================================= */
const navHeader = document.querySelector('.nav-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

/* =============================================
   NAV VISIBILITY (hidden until past hero)
   ============================================= */
const heroSection = document.querySelector('#hero');

function updateNavVisibility() {
  navHeader.classList.toggle(
    'nav-visible',
    heroSection.getBoundingClientRect().bottom <= 0
  );
}

window.addEventListener('scroll', updateNavVisibility, { passive: true });
updateNavVisibility();

navToggle?.addEventListener('click', () => {
  const isOpen = navHeader.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close nav when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navHeader.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (navHeader.classList.contains('nav-open') &&
      !navHeader.contains(e.target)) {
    navHeader.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

/* =============================================
   Q&A ACCORDION
   ============================================= */
document.querySelectorAll('.qa-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;

    // Collapse all others
    document.querySelectorAll('.qa-question').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        const otherAnswer = other.nextElementSibling;
        collapsePanel(otherAnswer);
      }
    });

    // Toggle this one
    if (isExpanded) {
      btn.setAttribute('aria-expanded', 'false');
      collapsePanel(answer);
    } else {
      btn.setAttribute('aria-expanded', 'true');
      expandPanel(answer);
    }
  });
});

function expandPanel(el) {
  el.hidden = false;
  el.style.maxHeight = '0';
  el.style.overflow = 'hidden';
  el.style.transition = 'max-height 0.32s ease';
  requestAnimationFrame(() => {
    el.style.maxHeight = el.scrollHeight + 'px';
  });
  el.addEventListener('transitionend', () => {
    el.style.maxHeight = 'none';
    el.style.overflow = '';
  }, { once: true });
}

function collapsePanel(el) {
  if (el.hidden) return;
  el.style.maxHeight = el.scrollHeight + 'px';
  el.style.overflow = 'hidden';
  el.style.transition = 'max-height 0.28s ease';
  requestAnimationFrame(() => {
    el.style.maxHeight = '0';
  });
  el.addEventListener('transitionend', () => {
    el.hidden = true;
    el.style.maxHeight = '';
    el.style.overflow = '';
    el.style.transition = '';
  }, { once: true });
}

/* =============================================
   SCROLL FADE-IN ANIMATIONS
   ============================================= */
const animatableSelectors = [
  '.hero-avatar-placeholder', '.hero-eyebrow', '.hero-headline', '.hero-sub',
  '.about-bio',
  '.qa-item',
  '.skill-item',
  '.timeline-item',
  '.edu-item',
  '.work-item',
  '.contact-form', '.contact-links',
];

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -12% 0px' });

  animatableSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${i * 0.04}s`;
      observer.observe(el);
    });
  });
}

/* =============================================
   SKILL BAR ANIMATION
   ============================================= */
const skillsSection = document.querySelector('.skills-section');

if (skillsSection) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger each skill item together (fill + thumb animate as a pair)
        entry.target.querySelectorAll('.skill-item').forEach((item, i) => {
          setTimeout(() => {
            item.querySelectorAll('.skill-fill, .skill-thumb').forEach(el => el.classList.add('animated'));
          }, i * 140);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  barObserver.observe(skillsSection);
}

/* =============================================
   WORK ACCORDION
   ============================================= */
document.querySelectorAll('.work-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;
    if (isExpanded) {
      btn.setAttribute('aria-expanded', 'false');
      collapsePanel(answer);
    } else {
      btn.setAttribute('aria-expanded', 'true');
      expandPanel(answer);
    }
  });
});

/* =============================================
   CONTACT FORM (client-side only)
   ============================================= */
const form = document.querySelector('.contact-form');
const note = document.querySelector('.form-note');

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const fields = ['name', 'email', 'subject', 'message'];
  let valid = true;

  fields.forEach(name => {
    const el = form.elements[name];
    if (!el.value.trim()) {
      el.style.borderColor = '#c62828';
      valid = false;
    } else {
      el.style.borderColor = '';
    }
  });

  const emailEl = form.elements['email'];
  if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.style.borderColor = '#c62828';
    valid = false;
  }

  if (!valid) {
    note.textContent = 'Please fill in all fields correctly.';
    note.className = 'form-note error';
    return;
  }

  // Placeholder — replace with your preferred form service (Formspree, EmailJS, etc.)
  note.textContent = 'Message sent! I\'ll be in touch soon.';
  note.className = 'form-note success';
  form.reset();
});

// Clear field error styling on input
form?.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => { el.style.borderColor = ''; });
});

/* =============================================
   ACTIVE NAV LINK (scroll spy)
   ============================================= */
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));
