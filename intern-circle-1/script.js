/**
 * Alex Morgan Developer Portfolio - JavaScript Logic & Interactive Engine
 * Handles theme toggling, animated typing, filtering, modals, form validation & toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Project Data Store (Case Studies for Quick View Modal)
     -------------------------------------------------------------------------- */
  const projectDatabase = {
    1: {
      title: "Aurora AI Analytics SaaS",
      category: "Full-Stack AI & Data Visualization",
      image: "assets/images/project-1.jpg",
      tags: ["React 18", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Chart.js"],
      summary: "A production-ready business analytics SaaS dashboard delivering sub-second real-time AI accuracy telemetry, predictive time-series forecasting charts, and customizable widget layouts.",
      highlights: [
        "Architected scalable WebSocket streaming pipeline delivering 60fps graph updates.",
        "Integrated Redis caching layer reducing API query times from 450ms to 45ms.",
        "Implemented role-based access control (RBAC) with JWT auth and encrypted audit logging.",
        "Engineered multi-tenant database partitioning in PostgreSQL for high data isolation."
      ],
      demoUrl: "https://example.com/aurora-demo",
      githubUrl: "https://github.com"
    },
    2: {
      title: "QuantumTrade Asset Exchange",
      category: "FinTech & Web3 Asset Trading",
      image: "assets/images/project-2.jpg",
      tags: ["Next.js", "Tailwind CSS", "WebSockets", "GraphQL", "Ethers.js"],
      summary: "A next-generation financial portfolio and trading dashboard enabling real-time candlestick rendering, instantaneous limit/market order book matching, and automated PnL calculation.",
      highlights: [
        "Rendered high-density financial candlestick charts with zero frame drops using Canvas API.",
        "Constructed optimistic UI updates ensuring instantaneous user feedback on trade submissions.",
        "Implemented client-side cryptographic signature verification for secure transactions.",
        "Designed dark-mode native interface with high contrast accessibility standards."
      ],
      demoUrl: "https://example.com/quantum-demo",
      githubUrl: "https://github.com"
    },
    3: {
      title: "Nimbus Dev Studio & API Workspace",
      category: "Developer Tooling & Cloud Workspace",
      image: "assets/images/project-3.jpg",
      tags: ["Electron", "TypeScript", "Monaco Editor", "Docker", "Node.js"],
      summary: "An integrated developer workspace for crafting, debugging, and team-sharing API collections with embedded mock servers and real-time collaboration.",
      highlights: [
        "Integrated Monaco Editor for syntax highlighting, schema auto-completion, and JSON formatting.",
        "Implemented real-time peer-to-peer workspace synchronization across distributed team members.",
        "Built offline-first local cache engine with SQLite ensuring zero data loss during network dropouts.",
        "Packaged cross-platform desktop installers with automated updater pipelines."
      ],
      demoUrl: "https://example.com/nimbus-demo",
      githubUrl: "https://github.com"
    }
  };

  /* --------------------------------------------------------------------------
     2. Theme Management (Dark / Light Mode Toggle)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlRoot = document.documentElement;

  // Check saved theme or OS preference
  const savedTheme = localStorage.getItem('alex_dev_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  htmlRoot.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('alex_dev_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode 🌓`);
    });
  }

  /* --------------------------------------------------------------------------
     3. Scroll Progress Bar & Header Blur on Scroll
     -------------------------------------------------------------------------- */
  const scrollProgressBar = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  const updateScrollEffects = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Update Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Header Background Elevation
    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back-to-Top Button Visibility
    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', updateScrollEffects, { passive: true });
  updateScrollEffects();

  // Back to Top Click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Dynamic Typewriter Effect for Hero Headline
     -------------------------------------------------------------------------- */
  const roleTextElem = document.getElementById('role-text');
  const phrases = [
    "exceptional web apps",
    "scalable cloud APIs",
    "high-performance UIs",
    "modern full-stack systems",
    "delightful user experiences"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  const typeWriterLoop = () => {
    if (!roleTextElem) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      roleTextElem.textContent = currentPhrase.substring(0, charIndex);
      typingSpeed = 40;
    } else {
      charIndex++;
      roleTextElem.textContent = currentPhrase.substring(0, charIndex);
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeWriterLoop, typingSpeed);
  };

  typeWriterLoop();

  /* --------------------------------------------------------------------------
     5. Mobile Hamburger Navigation Menu
     -------------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    
    if (shouldOpen) {
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('open');
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileMenu());
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => toggleMobileMenu(false));
  }

  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  /* --------------------------------------------------------------------------
     6. Active Navigation Link on Scroll (Intersection Observer)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

  /* --------------------------------------------------------------------------
     7. Skills Category Filter Tabs
     -------------------------------------------------------------------------- */
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetCategory = btn.getAttribute('data-category');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.classList.remove('hidden');
          card.style.animation = 'grow-bar 0.4s ease-out';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     8. Featured Projects Filter Controls
     -------------------------------------------------------------------------- */
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardType = card.getAttribute('data-type') || '';
        if (filterValue === 'all' || cardType.includes(filterValue)) {
          card.classList.remove('hidden');
          card.style.opacity = '1';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     9. Experience & Education Timeline Switcher
     -------------------------------------------------------------------------- */
  const tabWork = document.getElementById('tab-work');
  const tabEdu = document.getElementById('tab-edu');
  const workTimeline = document.getElementById('work-timeline');
  const eduTimeline = document.getElementById('edu-timeline');

  if (tabWork && tabEdu) {
    tabWork.addEventListener('click', () => {
      tabWork.classList.add('active');
      tabEdu.classList.remove('active');
      workTimeline.classList.remove('hidden');
      eduTimeline.classList.add('hidden');
    });

    tabEdu.addEventListener('click', () => {
      tabEdu.classList.add('active');
      tabWork.classList.remove('active');
      eduTimeline.classList.remove('hidden');
      workTimeline.classList.add('hidden');
    });
  }

  /* --------------------------------------------------------------------------
     10. Project Quick View Modal Logic
     -------------------------------------------------------------------------- */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalProjectBody = document.getElementById('modal-project-body');
  const quickViewBtns = document.querySelectorAll('.btn-quick-view');

  const openProjectModal = (projectId) => {
    const data = projectDatabase[projectId];
    if (!data || !modalProjectBody) return;

    modalProjectBody.innerHTML = `
      <div class="project-modal-details">
        <div class="modal-img-wrap" style="aspect-ratio:16/9; overflow:hidden; border-radius:12px; margin-bottom:1.25rem;">
          <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <span class="section-subtitle" style="margin-bottom:0.5rem;">${data.category}</span>
        <h2 style="font-size:1.6rem; margin-bottom:0.75rem;">${data.title}</h2>
        <p style="color:var(--text-secondary); line-height:1.65; margin-bottom:1.25rem;">${data.summary}</p>
        
        <h3 style="font-size:1.1rem; color:var(--accent-purple); margin-bottom:0.6rem;">Key Technical Achievements:</h3>
        <ul style="list-style:disc; padding-left:1.25rem; color:var(--text-secondary); line-height:1.6; margin-bottom:1.5rem;">
          ${data.highlights.map(h => `<li style="margin-bottom:0.35rem;">${h}</li>`).join('')}
        </ul>

        <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.75rem;">
          ${data.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
        </div>

        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <a href="${data.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <span>Launch Live Preview</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
          <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            <span>Inspect GitHub Repo</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-project-id');
      openProjectModal(id);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Live Demo button listener
  document.querySelectorAll('.live-demo-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-project-title') || 'Project';
      showToast(`Launching interactive preview for ${title}... 🚀`);
    });
  });

  /* --------------------------------------------------------------------------
     11. Digital Resume Modal & Print CV Actions
     -------------------------------------------------------------------------- */
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const previewResumeStripBtn = document.getElementById('preview-resume-strip-btn');
  const resumeCloseBtn = document.getElementById('resume-close-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');
  const downloadCvBtn = document.getElementById('download-cv-btn');

  const openResumeModalFunc = () => {
    if (!resumeModal) return;
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeResumeModalFunc = () => {
    if (!resumeModal) return;
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResumeModalFunc);
  if (previewResumeStripBtn) previewResumeStripBtn.addEventListener('click', openResumeModalFunc);
  if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeResumeModalFunc);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModalFunc();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
      showToast("Preparing ATS-optimized PDF resume... 📄");
      setTimeout(() => {
        window.print();
      }, 500);
    });
  }

  // Keyboard Escape Key Handler for all Modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModalFunc();
      toggleMobileMenu(false);
    }
  });

  /* --------------------------------------------------------------------------
     12. One-Click Clipboard Actions (Email & Bio Code)
     -------------------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyCodeBtn = document.getElementById('copy-code-btn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'alex.morgan.dev@example.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard! 📋');
      }).catch(() => {
        showToast('alex.morgan.dev@example.com');
      });
    });
  }

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const codeSnippet = `const developer = {
  name: "Alex Morgan",
  role: "Full Stack Web Engineer",
  location: "San Francisco, CA (Open to Remote)",
  interests: ["Design Systems", "Distributed Systems", "Open Source", "Cloud Native Architecture"],
  currentlyBuilding: "Next-Gen AI Developer Tools",
  coffeeToCodeRatio: Infinity
};`;
      navigator.clipboard.writeText(codeSnippet).then(() => {
        showToast('Developer profile code copied! 💻');
      }).catch(() => {
        showToast('Code copied!');
      });
    });
  }

  /* --------------------------------------------------------------------------
     13. Interactive Contact Form with Validation & Feedback
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formName = document.getElementById('form-name');
  const formEmail = document.getElementById('form-email');
  const formMessage = document.getElementById('form-message');
  const charCounter = document.getElementById('char-counter');
  const submitBtn = document.getElementById('submit-form-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;

  // Real-time character count for textarea
  if (formMessage && charCounter) {
    formMessage.addEventListener('input', () => {
      const count = formMessage.value.length;
      charCounter.textContent = `${count} / 500`;
      if (count > 500) {
        charCounter.style.color = 'var(--accent-rose)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      const nameVal = formName ? formName.value.trim() : '';
      const nameGroup = formName ? formName.closest('.form-group') : null;
      if (!nameVal) {
        if (nameGroup) nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        if (nameGroup) nameGroup.classList.remove('has-error');
      }

      // Validate Email
      const emailVal = formEmail ? formEmail.value.trim() : '';
      const emailGroup = formEmail ? formEmail.closest('.form-group') : null;
      if (!emailVal || !validateEmail(emailVal)) {
        if (emailGroup) emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        if (emailGroup) emailGroup.classList.remove('has-error');
      }

      // Validate Message
      const messageVal = formMessage ? formMessage.value.trim() : '';
      const messageGroup = formMessage ? formMessage.closest('.form-group') : null;
      if (!messageVal || messageVal.length < 10) {
        if (messageGroup) messageGroup.classList.add('has-error');
        isValid = false;
      } else {
        if (messageGroup) messageGroup.classList.remove('has-error');
      }

      if (!isValid) {
        showToast('Please correct the highlighted form errors ⚠️');
        return;
      }

      // Simulate AJAX dispatch with Loading state
      if (submitBtn && btnText && btnSpinner) {
        submitBtn.disabled = true;
        btnText.textContent = "Sending...";
        btnSpinner.classList.remove('hidden');

        setTimeout(() => {
          submitBtn.disabled = false;
          btnText.textContent = "Send Message";
          btnSpinner.classList.add('hidden');
          contactForm.reset();
          if (charCounter) charCounter.textContent = "0 / 500";
          showToast(`Thank you, ${nameVal}! Your message has been sent successfully. ✨`);
        }, 1200);
      }
    });

    // Remove error highlights on input
    [formName, formEmail, formMessage].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          const group = input.closest('.form-group');
          if (group) group.classList.remove('has-error');
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     14. Toast Notification Feedback Generator
     -------------------------------------------------------------------------- */
  function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  /* --------------------------------------------------------------------------
     15. Dynamic Current Year in Footer
     -------------------------------------------------------------------------- */
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
});
