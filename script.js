const projectData = {
  cyber: {
    index: '01 / 07',
    kicker: 'SECURITY / PLATFORM',
    title: 'Cyber Raksha v1 / v2',
    summary: 'A security awareness platform for everyday users, developed as a focused product flow and then expanded into a full app.',
    contribution: 'Security-minded logic, awareness flows, and product thinking across the v1 build and v2 expansion.',
    outcome: 'v1 won the Diamond Award and 1st place at GHRSTU INNOVEX-26 Tech Manthan. v2 expanded into a full app with a Smart Leads Dashboard.',
    tags: ['SECURITY AWARENESS', 'PRODUCT FLOWS', 'FULL APP', 'v1 → v2'],
    tech: 'SECURITY / PRODUCT LOGIC',
  },
  leads: {
    index: '02 / 07',
    kicker: 'BACKEND / DASHBOARD',
    title: 'Smart Leads Dashboard',
    summary: 'A business-lead management dashboard shaped around clear states, useful CRUD operations, filters, and a backend that keeps the flow coherent.',
    contribution: 'MERN backend contribution, architecture thinking, CRUD operations, lead states, filters, and dashboard flows.',
    outcome: 'A structured dashboard flow inside the Cyber Raksha v2 expansion.',
    tags: ['MERN', 'CRUD', 'LEAD STATES', 'FILTERS'],
    tech: 'NODE / EXPRESS / MONGODB',
  },
  pashu: {
    index: '03 / 07',
    kicker: 'MOBILE / AI WORKFLOW',
    title: 'Pashu Raksha / PashuMitra',
    summary: 'An offline chatbot utilizing a local AI model for cattle disease detection, built in a high-pressure 24-hour hackathon sprint.',
    contribution: 'Integrated the offline chatbot flow and local model workflow for the detection experience.',
    outcome: 'Built entirely during an intense 24-hour hackathon sprint under pressure.',
    tags: ['OFFLINE CHATBOT', 'LOCAL AI MODEL', 'CATTLE HEALTH', '24-HOUR SPRINT'],
    tech: 'MOBILE / OFFLINE FLOW',
  },
  genie: {
    index: '04 / 07',
    kicker: 'EXPERIENCE / ARCHITECTURE',
    title: 'MVP Genie',
    summary: 'A landing experience that combines technical architecture with parallax presentation and AI context memory positioning.',
    contribution: 'Contributed to the technical architecture, parallax landing experience, and AI context memory positioning.',
    outcome: 'A sharper way to frame the MVP-building workflow through an experience-led interface.',
    tags: ['PARALLAX', 'AI CONTEXT MEMORY', 'ARCHITECTURE'],
    tech: 'EXPERIENCE / TECHNICAL DIRECTION',
  },
  jgu: {
    index: '05 / 07',
    kicker: 'WEB / RESPONSIVE UI',
    title: 'JGU University Site',
    summary: 'A modern, tech-driven university UI clone with a responsive structure and a clear architecture behind the surface.',
    contribution: 'Contributed the technical architecture and responsive structure for the UI clone.',
    outcome: 'A complete, tech-driven university-style interface direction.',
    tags: ['RESPONSIVE STRUCTURE', 'TECH-DRIVEN UI', 'WEB'],
    tech: 'FRONTEND / RESPONSIVE SYSTEM',
  },
  food: {
    index: '06 / 07',
    kicker: 'PRODUCT ECOSYSTEM / OPERATIONS',
    title: 'Sanghx / Eatlo / Tabey',
    summary: 'A related set of startup-style food-ordering products shaped through launch workflows, operations thinking, and technical iteration.',
    contribution: 'Supported launch workflows, operations thinking, and technical iteration across the local delivery platforms.',
    outcome: 'The food-ordering product ecosystem served 1000+ real users.',
    tags: ['FOOD ORDERING', 'LAUNCH WORKFLOWS', 'OPERATIONS', '1000+ USERS'],
    tech: 'PRODUCT ECOSYSTEM / DELIVERY',
  },
  sankalp: {
    index: '07 / 07',
    kicker: 'HACKATHON / EXECUTION',
    title: 'Sankalp Bharat 2026',
    summary: 'A national hackathon project where Team PANDA made it to the Top 16 among 800+ teams.',
    contribution: 'Contributed logic, technical execution, and pressure-time issue solving in a team setting.',
    outcome: 'Top 16 nationally among 800+ teams.',
    tags: ['TOP 16', '800+ TEAMS', 'TEAM PANDA', 'ISSUE SOLVING'],
    tech: 'LOGIC / EXECUTION / PRESSURE',
  },
};

const dialog = document.querySelector('#case-file');
const closeButton = document.querySelector('.case-file__close');
const fields = {
  index: document.querySelector('#case-file-index'),
  kicker: document.querySelector('#case-file-kicker'),
  title: document.querySelector('#case-file-title'),
  summary: document.querySelector('#case-file-summary'),
  contribution: document.querySelector('#case-file-contribution'),
  outcome: document.querySelector('#case-file-outcome'),
  tags: document.querySelector('#case-file-tags'),
  tech: document.querySelector('#case-file-tech'),
};

function openProject(key) {
  const item = projectData[key];
  if (!item || !dialog) return;
  fields.index.textContent = item.index;
  fields.kicker.innerHTML = `<span>CASE FILE</span><i></i> ${item.kicker}`;
  fields.title.textContent = item.title;
  fields.summary.textContent = item.summary;
  fields.contribution.textContent = item.contribution;
  fields.outcome.textContent = item.outcome;
  fields.tags.innerHTML = item.tags.map((tag) => `<span>${tag}</span>`).join('');
  fields.tech.textContent = item.tech;
  dialog.showModal();
}

document.querySelectorAll('[data-project]').forEach((card) => {
  card.addEventListener('click', () => openProject(card.dataset.project));
});

closeButton?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
  { threshold: 0.12 },
);
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const wall = document.querySelector('.site-wall');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (wall && !reduceMotion.matches) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    wall.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileNav?.classList.toggle('is-open', !isOpen);
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
  });
});

// ─── Contact Form → MongoDB ───────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const formSubmitBtn = document.getElementById('form-submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      setFormStatus('error', 'All fields are required.');
      return;
    }

    // Loading state
    formSubmitBtn.disabled = true;
    formSubmitBtn.textContent = 'Sending…';
    setFormStatus('', '');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus('success', '✓ Message received. Signal delivered.');
        contactForm.reset();
      } else {
        setFormStatus('error', data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setFormStatus('error', 'Could not reach the server. Check your connection.');
      console.error('Form submission error:', err);
    } finally {
      formSubmitBtn.disabled = false;
      formSubmitBtn.innerHTML = 'Send signal <span>↗</span>';
    }
  });
}

function setFormStatus(type, message) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = 'form-status';
  if (type) formStatus.classList.add(`form-status--${type}`);
}
