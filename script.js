/* ==========================================================================
   PORTFOLIO SCRIPT.JS
   Vanilla JS only. Organized by feature. Each block is self-contained.
   ========================================================================== */

/* -------------------- 0. UTILITIES -------------------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* -------------------- 1. LOADING SCREEN -------------------- */
window.addEventListener('load', () => {
  const loader = $('#loader');
  // Small delay so the loader animation is actually seen, then fade out
  setTimeout(() => loader.classList.add('hidden'), 600);
});

/* -------------------- 2. SCROLL PROGRESS BAR -------------------- */
const scrollProgress = $('#scrollProgress');
function updateScrollProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}

/* -------------------- 3. CUSTOM CURSOR -------------------- */
const cursorDot  = $('#cursorDot');
const cursorRing = $('#cursorRing');
let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
});

// Ring follows with easing (lag) for a smooth trailing effect
function animateCursorRing(){
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

// Grow cursor ring over interactive elements
$$('a, button, .skill-card, .project-card, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('grow'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('grow'));
});

/* -------------------- 4. NAVBAR: scroll style + active link + hamburger -------------------- */
const navbar    = $('#navbar');
const navLinks  = $('#navLinks');
const hamburger = $('#hamburger');
const linkEls   = $$('.nav-link');
const sections  = $$('main .section, .hero');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu after clicking a link
linkEls.forEach(link => link.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));

function updateActiveNav(){
  const scrollPos = window.scrollY + window.innerHeight * 0.35;
  let current = sections[0]?.id;
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop) current = sec.id;
  });
  linkEls.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

function handleNavbarScroll(){
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

/* -------------------- 5. THEME TOGGLE (dark / light) -------------------- */
const themeToggle = $('#themeToggle');
const themeIcon   = themeToggle.querySelector('i');
const savedTheme  = localStorage.getItem('portfolio-theme');

function applyTheme(theme){
  if (theme === 'dark'){
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }
}

// Respect saved preference, else respect system preference
if (savedTheme){
  applyTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches){
  applyTheme('dark');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('portfolio-theme', next);
});

/* -------------------- 6. BACK TO TOP -------------------- */
const backToTop = $('#backToTop');
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* -------------------- MASTER SCROLL LISTENER -------------------- */
window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateActiveNav();
  handleNavbarScroll();
  backToTop.classList.toggle('show', window.scrollY > 500);
});

/* -------------------- 7. TYPING ANIMATION (hero roles) -------------------- */
const roles = ['clean web apps', 'ML-powered products', 'full stack projects', 'DSA-solid software'];
const typingEl = $('#typingText');
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeLoop(){
  const currentRole = roles[roleIndex];

  if (isDeleting){
    charIndex--;
    typingEl.textContent = currentRole.substring(0, charIndex);
  } else {
    charIndex++;
    typingEl.textContent = currentRole.substring(0, charIndex);
  }

  let speed = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === currentRole.length){
    speed = 1600; // pause at full word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0){
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 300;
  }

  setTimeout(typeLoop, speed);
}
typeLoop();

/* -------------------- 8. PROJECTS DATA + RENDER -------------------- */
// Each project's `github` field holds the repository URL.
// Leave it as `null` until a real repo exists — the card will then
// automatically render a disabled "Coming Soon" button instead of a broken link.
const projects = [
  {
    title: 'Luxury Perfume Website',
    desc: 'An elegant landing page for a fragrance brand with refined typography, smooth scroll reveals, and an accessible contact form.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    img: 'https://images.unsplash.com/photo-1543422655-ac1c6ca993ed?auto=format&fit=crop&w=800&h=500&q=80',
    alt: 'Elegant glass perfume bottle representing a luxury fragrance brand',
    demo: 'https://product-pefume.vercel.app/',
    github: 'https://github.com/nithishakumar979/Product_Pefume'
  },
  {
    title: 'Instagram Clone',
    desc: 'A pixel-close recreation of Instagram\'s core feed, stories bar, and post interactions built with vanilla JS state management.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    img: 'https://images.unsplash.com/photo-1690883793939-f8cca2f28ee0?auto=format&fit=crop&w=800&h=500&q=80',
    alt: 'Smartphone screen displaying social media app icons, similar to the Instagram Clone UI',
    demo: 'https://instagram-clone-rust-nu.vercel.app/',
    github: 'https://github.com/nithishakumar979/Instagram_clone'
  },
  {
    title: 'LinkedIn Clone',
    desc: 'A professional network UI clone featuring a feed, profile card, and responsive three-column layout.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    img: 'https://images.unsplash.com/photo-1762330464824-21e95b769038?auto=format&fit=crop&w=800&h=500&q=80',
    alt: 'LinkedIn interface displayed on a laptop screen, representing the professional networking clone',
    demo: 'https://linked-in-clone-three-lyart.vercel.app/',
    github: 'https://github.com/nithishakumar979/Linked_in_clone'
  },
  {
    title: 'Spotify Clone',
    desc: 'A music player interface with playlist browsing, a custom audio player bar, and dark-themed glassmorphic panels.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    img: 'https://images.unsplash.com/photo-1567535343163-9bba0f61bd09?auto=format&fit=crop&w=800&h=500&q=80',
    alt: 'Close-up of the Spotify logo on a device, representing the music streaming interface clone',
    demo: 'https://spotify-clone-webpage-henna.vercel.app/',
    github: 'https://github.com/nithishakumar979/Spotify-Clone-webpage'
  },
  {
    title: 'SwiftMart E-Commerce Website',
    desc: 'A full front-end e-commerce store with product catalog, cart persistence via localStorage, and a login flow.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    img: 'https://images.unsplash.com/photo-1688561807440-8a57dfa77ee3?auto=format&fit=crop&w=800&h=500&q=80',
    alt: 'Person managing an online store on a laptop, representing the SwiftMart e-commerce website',
    demo: 'https://e-commerce-website-psi-eight-14.vercel.app/shop.html',
    github: 'https://github.com/nithishakumar979/E-Commerce-Website-'
  },
  {
    title: 'Food Delivery Website',
    desc: 'A restaurant ordering experience with menu filtering, a live cart summary, and animated add-to-cart feedback.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    img: 'https://images.unsplash.com/photo-1648091855444-76f97897dcd4?auto=format&fit=crop&w=800&h=500&q=80',
    alt: 'Close-up of a phone showing a food delivery app, representing the food ordering website',
    demo: 'https://food-delivery-app-one-ashy.vercel.app/app.html',
    github: 'https://github.com/nithishakumar979/Food-Delivery-App-'
  },
  {
    title: 'College Event Website',
    desc: 'An event showcase site for a college fest with a countdown timer, schedule grid, and registration form.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    img: 'https://images.unsplash.com/photo-1768053921689-1bc09db904c9?auto=format&fit=crop&w=800&h=500&q=80',
    alt: 'Silhouetted crowd at a lively college fest under bright stage lights',
    demo: 'https://college-event-eta.vercel.app/',
    github: 'https://github.com/nithishakumar979/College_Event'
  },
  {
    title: 'TAP Academy Clone',
    desc: 'A training institute landing page clone with course cards, testimonials carousel, and a sticky enrollment CTA.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    img: 'https://images.unsplash.com/photo-1758270705290-62b6294dd044?auto=format&fit=crop&w=800&h=500&q=80',
    alt: 'Group of students collaborating around a laptop in a training classroom',
    demo: 'https://tap-academy-clone-rosy.vercel.app/',
    github: 'https://github.com/nithishakumar979/Tap-Academy-Clone'
  },
  {
    title: 'Personal Portfolio',
    desc: 'This very portfolio — an Apple-inspired, glassmorphic personal site with dark mode and scroll-driven animation.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    img: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=800&h=500&q=80',
    alt: 'MacBook Pro screen showing lines of code, representing this developer portfolio project',
    demo: '#',
    github: 'https://github.com/nithishakumar979/Portfolio-Website'
  }
];

const projectsGrid = $('#projectsGrid');

function renderProjects(){
  const html = projects.map((p, i) => {
    const hasGithub = Boolean(p.github);

    // Overlay "GitHub" control: a real link when available, a disabled
    // "Coming Soon" button otherwise. stopPropagation keeps the card's
    // own click handler from double-firing when these are clicked directly.
    const overlayGithub = hasGithub
      ? `<a href="${p.github}" class="overlay-btn" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="fa-brands fa-github"></i> GitHub</a>`
      : `<button type="button" class="overlay-btn disabled" disabled onclick="event.stopPropagation()"><i class="fa-brands fa-github"></i> Coming Soon</button>`;

    const footerGithub = hasGithub
      ? `<a href="${p.github}" class="code" target="_blank" rel="noopener" onclick="event.stopPropagation()">GitHub</a>`
      : `<button type="button" class="code disabled" disabled onclick="event.stopPropagation()">Coming Soon</button>`;

    return `
    <div class="project-card${hasGithub ? ' has-github' : ''}" data-aos="fade-up" style="transition-delay:${(i % 3) * 0.08}s" data-github="${hasGithub ? p.github : ''}" tabindex="0" role="link" aria-label="Open ${p.title}${hasGithub ? ' on GitHub' : ''}">
      <div class="project-img">
        <img src="${p.img}" alt="${p.alt}" loading="lazy">
        <div class="project-overlay">
          <a href="${p.demo}" class="overlay-btn" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="fa-solid fa-eye"></i> View Project</a>
          ${overlayGithub}
        </div>
      </div>
      <div class="project-body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="tech-tags">
          ${p.tech.map(t => `<span>${t}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${p.demo}" class="live" target="_blank" rel="noopener" onclick="event.stopPropagation()">Live Demo</a>
          ${footerGithub}
        </div>
      </div>
    </div>
  `;
  }).join('');
  projectsGrid.innerHTML = html;
}
renderProjects();

/* -------------------- 8b. WHOLE-CARD CLICK -> OPEN GITHUB REPO -------------------- */
// Clicking anywhere on a card (except its own links/buttons, which handle
// themselves) opens that project's GitHub repo in a new tab, when available.
projectsGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.project-card');
  if (!card) return;
  if (e.target.closest('a, button')) return; // inner controls already handled their own click
  const github = card.dataset.github;
  if (github) window.open(github, '_blank', 'noopener');
});

// Keyboard accessibility: Enter / Space on a focused card behaves the same way.
projectsGrid.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.project-card');
  if (!card || e.target !== card) return;
  const github = card.dataset.github;
  if (github){
    e.preventDefault();
    window.open(github, '_blank', 'noopener');
  }
});

/* -------------------- 9. SCROLL REVEAL (IntersectionObserver, like AOS) -------------------- */
// Runs after project cards are injected so those elements are observed too.
function initScrollReveal(){
  const revealEls = $$('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('aos-visible');
        observer.unobserve(entry.target); // reveal once, keep it visible
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}
initScrollReveal();

/* -------------------- 10. COUNTER ANIMATION (About stats) -------------------- */
function animateCounter(el){
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600; // ms
  const startTime = performance.now();

  function tick(now){
    const progress = Math.min((now - startTime) / duration, 1);
    // Ease-out for a natural deceleration near the end
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1){
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(tick);
}

const counters = $$('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* -------------------- 11. RIPPLE EFFECT ON BUTTONS -------------------- */
$$('.ripple').forEach(btn => {
  btn.addEventListener('click', function(e){
    const rect = this.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
    circle.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
    circle.classList.add('ripple-circle');
    this.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  });
});

/* -------------------- 12. PARALLAX HERO BLOBS -------------------- */
const heroEl = $('.hero');
const blobs = $$('.blob');
heroEl.addEventListener('mousemove', (e) => {
  const { innerWidth: w, innerHeight: h } = window;
  const xRatio = (e.clientX / w - 0.5);
  const yRatio = (e.clientY / h - 0.5);
  blobs.forEach((blob, i) => {
    const strength = (i + 1) * 14;
    blob.style.transform = `translate(${xRatio * strength}px, ${yRatio * strength}px)`;
  });
});

/* -------------------- 13. CONTACT FORM VALIDATION -------------------- */
const form        = $('#contactForm');
const nameInput   = $('#name');
const emailInput  = $('#email');
const subjectInput= $('#subject');
const messageInput= $('#message');
const formSuccess = $('#formSuccess');

const validators = {
  name: (val) => {
    if (!val.trim()) return 'Please enter your name.';
    if (val.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  email: (val) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val.trim()) return 'Please enter your email.';
    if (!pattern.test(val.trim())) return 'Please enter a valid email address.';
    return '';
  },
  subject: (val) => {
    if (!val.trim()) return 'Please enter a subject.';
    if (val.trim().length < 3) return 'Subject is too short.';
    return '';
  },
  message: (val) => {
    if (!val.trim()) return 'Please enter a message.';
    if (val.trim().length < 10) return 'Message should be at least 10 characters.';
    return '';
  }
};

function showFieldError(input, errorId, message){
  $(errorId).textContent = message;
  input.classList.toggle('invalid', Boolean(message));
}

function validateField(input, key, errorId){
  const message = validators[key](input.value);
  showFieldError(input, errorId, message);
  return !message;
}

// Live validation as the user types (after first interaction)
[
  [nameInput, 'name', '#nameError'],
  [emailInput, 'email', '#emailError'],
  [subjectInput, 'subject', '#subjectError'],
  [messageInput, 'message', '#messageError']
].forEach(([input, key, errorId]) => {
  input.addEventListener('blur', () => validateField(input, key, errorId));
  input.addEventListener('input', () => {
    if (input.classList.contains('invalid')) validateField(input, key, errorId);
  });
});

form.addEventListener('submit', function(e){
  e.preventDefault(); // no page refresh

  const isNameValid    = validateField(nameInput, 'name', '#nameError');
  const isEmailValid   = validateField(emailInput, 'email', '#emailError');
  const isSubjectValid = validateField(subjectInput, 'subject', '#subjectError');
  const isMessageValid = validateField(messageInput, 'message', '#messageError');

  const allValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;
  if (!allValid) return;

  // Simulate a successful send (no backend wired up)
  formSuccess.classList.add('show');
  form.reset();
  [nameInput, emailInput, subjectInput, messageInput].forEach(el => el.classList.remove('invalid'));

  setTimeout(() => formSuccess.classList.remove('show'), 5000);
});

/* -------------------- 14. FOOTER YEAR -------------------- */
$('#year').textContent = new Date().getFullYear();
