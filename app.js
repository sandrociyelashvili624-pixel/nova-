/**
 * NEXURA - Modern Interactive Landing Page Logic
 * Features: Dark/Light Mode, Scrollspy, Mouse Glow, Stats Counter, Form Validation, Filter Tabs, FAQ
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollProgress();
  initStickyHeader();
  initMobileMenu();
  initScrollspy();
  initStatsCounter();
  initFeatureTabs();
  initCardGlow();
  initContactForm();
  initFaqAccordion();
  initBackToTop();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light) with LocalStorage
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlElement = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('nexura-theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (!themeToggleBtn) return;

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nexura-theme', newTheme);
  });
}

/* ==========================================================================
   2. Scroll Progress Indicator
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ==========================================================================
   3. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   4. Mobile Menu
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  if (!hamburgerBtn || !navLinks) return;

  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburgerBtn.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  };

  hamburgerBtn.addEventListener('click', toggleMenu);

  // Close when clicking any nav link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburgerBtn.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   5. Active Nav Link on Scroll (Scrollspy)
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ==========================================================================
   6. Animated Stats Counter (Intersection Observer)
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const animateValue = (el, start, end, duration, suffix = '') => {
    const isFloat = end % 1 !== 0;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeProgress;

      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = end + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const suffix = stat.getAttribute('data-suffix') || '';
          animateValue(stat, 0, target, 2000, suffix);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.about-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   7. Feature Tabs Filter
   ========================================================================== */
function initFeatureTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.feature-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hide');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

/* ==========================================================================
   8. Mouse Spotlight / Glow Effect on Cards
   ========================================================================== */
function initCardGlow() {
  const glowCards = document.querySelectorAll('.feature-card, .glass-dashboard-card');

  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   9. Connect Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');
  const consentInput = document.getElementById('privacyConsent');
  const submitBtn = document.getElementById('submitBtn');
  const formToast = document.getElementById('formToast');
  const toastCloseBtn = document.getElementById('toastCloseBtn');

  if (!form) return;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const setFieldError = (input, hasError) => {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      if (hasError) {
        formGroup.classList.add('has-error');
      } else {
        formGroup.classList.remove('has-error');
      }
    }
  };

  // Real-time input validation listeners
  nameInput.addEventListener('input', () => {
    setFieldError(nameInput, nameInput.value.trim().length < 2);
  });

  emailInput.addEventListener('input', () => {
    setFieldError(emailInput, !validateEmail(emailInput.value.trim()));
  });

  messageInput.addEventListener('input', () => {
    setFieldError(messageInput, messageInput.value.trim().length < 10);
  });

  consentInput.addEventListener('change', () => {
    setFieldError(consentInput, !consentInput.checked);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    if (nameInput.value.trim().length < 2) {
      setFieldError(nameInput, true);
      isValid = false;
    } else {
      setFieldError(nameInput, false);
    }

    if (!validateEmail(emailInput.value.trim())) {
      setFieldError(emailInput, true);
      isValid = false;
    } else {
      setFieldError(emailInput, false);
    }

    if (messageInput.value.trim().length < 10) {
      setFieldError(messageInput, true);
      isValid = false;
    } else {
      setFieldError(messageInput, false);
    }

    if (!consentInput.checked) {
      setFieldError(consentInput, true);
      isValid = false;
    } else {
      setFieldError(consentInput, false);
    }

    if (!isValid) return;

    // Simulate sending with loading spinner
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      form.reset();

      // Show toast
      if (formToast) {
        formToast.classList.add('active');
      }
    }, 1200);
  });

  if (toastCloseBtn && formToast) {
    toastCloseBtn.addEventListener('click', () => {
      formToast.classList.remove('active');
    });
  }
}

/* ==========================================================================
   10. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parentItem = trigger.closest('.accordion-item');
      const isAlreadyActive = parentItem.classList.contains('active');

      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isAlreadyActive) {
        parentItem.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   11. Back To Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
