/**
 * Tej Desai - Developer Portfolio Client Script
 * Implements interactive navigation, terminal tabs, project filter tabs,
 * deep-dive modal system, live MERN Job Tracker demo, and contact handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTerminalTabs();
    initProjectFilters();
    initProjectModal();
    initJobTrackerDemo();
    initContactHandlers();
    initCopyEmail();
    initCurrentYear();
});

/* ==========================================================================
   1. Navigation & Scroll Tracking
   ========================================================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Sticky navbar backdrop
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            });
        });
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-menu .nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    if (href === currentId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });

    sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   2. Terminal Tabs Switching
   ========================================================================== */
function initTerminalTabs() {
    const tabs = document.querySelectorAll('.terminal-tab');
    const bodies = {
        arch: document.getElementById('tab-arch'),
        profile: document.getElementById('tab-profile')
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabKey = tab.dataset.tab;
            Object.keys(bodies).forEach(key => {
                if (bodies[key]) {
                    if (key === tabKey) {
                        bodies[key].classList.remove('hidden');
                    } else {
                        bodies[key].classList.add('hidden');
                    }
                }
            });
        });
    });
}

/* ==========================================================================
   3. Project Category Filter
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filterValue = btn.dataset.filter;

            projectCards.forEach(card => {
                const categories = card.dataset.category.split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   4. Project Details Modal Data & Controller
   ========================================================================== */
const projectDetails = {
    'voice-agent': {
        title: 'AI Voice Calling Platform with Modular Telephony Layer',
        category: 'Full Stack • AI Systems • Real-Time Telephony',
        problem: 'Enterprise sales and customer support operations require low-latency voice AI agents capable of placing phone calls, holding context-aware conversations, and routing human escalations without costly telephony consumption during local testing.',
        architecture: 'FastAPI (Python) ASGI backend structured with a decoupled TelephonyAdapter abstraction pattern. Operates two interchangeable providers: MockTelephonyAdapter for local testing and ExotelTelephonyAdapter for carrier-grade telephony. Real-time media streams execute over WebSockets via the Exotel AgentStream protocol. Audio frames undergo Voice Activity Detection (VAD) via RMS calculation with 750ms silence detection and immediate barge-in interruption buffer purging. Audio streams convert to 16kHz WAV, transcribe through Faster-Whisper, feed into local Ollama Gemma 3 LLM, synthesize via Piper / Edge-TTS, and stream back as 20ms Linear PCM audio chunks.',
        features: [
            'Decoupled Telephony Provider Abstraction (Mock & Exotel Connect Voice AI)',
            'Bidirectional WebSocket audio streaming via Exotel AgentStream protocol',
            'Sub-second Voice Activity Detection (VAD) & Barge-In speech interruption handling',
            'Integrated multi-lingual IVR language greeting & routing (English, Hindi, Marathi)',
            'JWT session authentication, concurrency throttle limits (HTTP 429), and duration guards',
            'Comprehensive 6-suite automated test suite covering telephony, state machines, and regression'
        ],
        techStack: 'Python 3.11, FastAPI, Faster-Whisper, Ollama (Gemma 3), Piper TTS, Edge-TTS, Exotel AgentStream, WebSockets, SQLite, MySQL, JWT, Pytest',
        github: 'https://github.com/tejdesai1256/AI-Voice_Agent',
        liveDemo: null
    },
    'shield-scope': {
        title: 'ShieldScope — Automated Web Security & Vulnerability Scanner',
        category: 'Full Stack • Cybersecurity • Python FastAPI & MongoDB',
        problem: 'Modern web platforms often deploy with unvetted HTTP security headers, outdated server tokens, vulnerable endpoints susceptible to SQL Injection and XSS, and unvalidated URL input prone to internal SSRF attacks.',
        architecture: 'Backend built with Python FastAPI and MongoDB (PyMongo). Implements a DNS resolution security guard (dnspython) that validates target hostnames resolve strictly to public IP addresses before scanning, preventing Server-Side Request Forgery (SSRF) against internal VPC endpoints. Employs BeautifulSoup4 and HTTP header analyzers to audit CSP, X-Frame-Options, HSTS, and X-Content-Type-Options. Vulnerability detection routines test parameterized payloads for reflective XSS and SQL injection. The system compiles audit metrics into dynamic PDF and Excel reports using ReportLab and OpenPyXL.',
        features: [
            'Target host DNS validation resolving only to public IPs to eliminate SSRF attacks',
            'Automated vulnerability heuristics for SQL Injection, XSS, and missing security headers',
            'Dynamic Threat Radar calculation (0-100 security score)',
            'MongoDB scan history persistence with JWT user authentication',
            'Executive security report generator exporting to PDF (ReportLab) and Excel (OpenPyXL)'
        ],
        techStack: 'Python 3.10+, FastAPI, MongoDB (PyMongo), BeautifulSoup4, dnspython, ReportLab, PyJWT, Bcrypt, OpenPyXL',
        github: 'https://github.com/tejdesai1256/shield-scope',
        liveDemo: null
    },
    'job-tracker': {
        title: 'CareerPulse — MERN Stack Job Application Tracker',
        category: 'Full Stack MERN • CRUD Workflow • Interactive Dashboard',
        problem: 'Early career developers and software engineers apply across dozens of platforms without a centralized, intuitive dashboard to track interview stages, salary expectations, notes, and metrics.',
        architecture: 'Architected as a modern Full Stack MERN system. The Node.js and Express backend exposes RESTful CRUD endpoints (`/api/applications`) protected by JWT tokens. Mongoose models manage schema validation, indexing by user ID, and stage timestamps. The frontend features an interactive Kanban pipeline and dynamic summary metrics (Total, Interviewing, Offered, Rejected). Includes client-side LocalStorage offline synchronization so recruiters can test full interactive workflows without external database configuration.',
        features: [
            'Full CRUD lifecycle management for job applications across 5 stages',
            'Real-time calculation of dashboard summary metrics and conversion pipeline',
            'Live search filtering across company names, roles, and status tags',
            'Offline-first LocalStorage synchronization with preloaded demo data',
            'Modular Express backend routes with JWT authentication and input sanitation'
        ],
        techStack: 'React / Modern JS, Node.js, Express, MongoDB, Mongoose, REST APIs, LocalStorage',
        github: 'https://github.com/tejdesai1256/job-tracker-mern',
        liveDemo: '#tracker-demo'
    },
    'job-jockey': {
        title: 'Job Jockey — Internship & Early-Career Discovery Platform',
        category: 'Full Stack • Node.js & Express • MongoDB',
        problem: 'University students and recent graduates often struggle to find entry-level internships filtered by tech stack with clear application status transparency.',
        architecture: 'Engineered during full-stack internship work. Built with an Express.js backend and MongoDB database. Features modular controllers and route handlers for authentication (`/api/auth`) utilizing HTTP-only cookie JWTs. The responsive frontend provides a candidate dashboard displaying application stages, profile completeness meters, and tech-role filters (Full Stack, Python, Frontend).',
        features: [
            'Cookie-based JWT session authentication with secure password hashing',
            'Role-filtered job discovery feed for student candidates',
            'Application lifecycle pipeline tracking (Applied, Review, Interview, Offer)',
            'Responsive candidate dashboard with profile completion gauge',
            'Structured RESTful API endpoints following modular MVC architecture'
        ],
        techStack: 'Node.js, Express.js, MongoDB, JWT & Cookies, JavaScript, HTML5, CSS3',
        github: 'https://github.com/tejdesai1256/job-jockey-intern-platform',
        liveDemo: null
    },
    'kiwi': {
        title: 'Kiwi — Personal AI Voice Assistant',
        category: 'Frontend • Voice AI • Web Speech API & PHP/MySQL',
        problem: 'Demonstrating how browser-native speech recognition and synthesis can be orchestrated into a responsive personal assistant that executes real user commands.',
        architecture: 'Browser client leverages the HTML5 Web Speech Recognition and SpeechSynthesis APIs to listen for microphone voice inputs, parse keywords, and trigger commands (opening developer tools, searching resources, answering queries). Connected to a PHP backend with MySQL database integration for account registration and session management. Deployed live on Netlify.',
        features: [
            'Hands-free speech recognition and audio synthesis in the browser',
            'Voice command recognition triggering web actions, search queries, and responses',
            'User sign-in and registration flow with PHP/MySQL integration',
            'Fully deployed and accessible online via Netlify'
        ],
        techStack: 'HTML5, CSS3, JavaScript, Web Speech API, PHP, MySQL, Netlify',
        github: 'https://github.com/tejdesai1256/Personal-AI-Assistant',
        liveDemo: 'https://tejdesai-personalaiassistant.netlify.app/'
    },
    'spotify': {
        title: 'Spotify Web Player Interface Clone',
        category: 'Frontend UI/UX • Modern JavaScript & Web Audio',
        problem: 'Building a complex, high-performance media player web application matching industry-standard design specifications without relying on heavy frameworks.',
        architecture: 'Constructed with semantic HTML5, modular CSS3 flexbox/grid tokens, and native JavaScript DOM event delegation. Uses HTML5 Audio API for real-time track seeking, play/pause synchronization, volume adjustment, and playlist navigation with responsive desktop and mobile views.',
        features: [
            'Pixel-accurate Spotify dark mode aesthetic and responsive sidebar layout',
            'Interactive playback controls with dynamic seek bar and time counter',
            'Volume slider with mute toggle and playlist directory browsing',
            'Fast page load with pure vanilla CSS and JavaScript'
        ],
        techStack: 'HTML5, CSS3, Modern JavaScript (ES6+), Web Audio API, Responsive Design',
        github: 'https://github.com/tejdesai1256/spotify_clone',
        liveDemo: null
    }
};

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const dynamicContent = document.getElementById('modalDynamicContent');
    const modalTriggers = document.querySelectorAll('.btn-modal-trigger');

    if (!modal || !dynamicContent) return;

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.dataset.project;
            const data = projectDetails[projectKey];
            if (!data) return;

            dynamicContent.innerHTML = `
                <h3 class="modal-title" id="modalTitle">${data.title}</h3>
                <span class="modal-category">${data.category}</span>

                <div class="modal-section">
                    <h4 class="modal-h4">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        Problem Statement &amp; Objective
                    </h4>
                    <p class="modal-p">${data.problem}</p>
                </div>

                <div class="modal-section">
                    <h4 class="modal-h4">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                        </svg>
                        System Architecture &amp; Implementation Details
                    </h4>
                    <p class="modal-p">${data.architecture}</p>
                </div>

                <div class="modal-section">
                    <h4 class="modal-h4">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Key Capabilities &amp; Verification
                    </h4>
                    <ul class="modal-list">
                        ${data.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>

                <div class="modal-section">
                    <h4 class="modal-h4">Technology Stack</h4>
                    <p class="modal-p"><code>${data.techStack}</code></p>
                </div>

                <div class="modal-actions">
                    ${data.github ? `
                        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            View Source Code on GitHub
                        </a>
                    ` : ''}

                    ${data.liveDemo && data.liveDemo.startsWith('http') ? `
                        <a href="${data.liveDemo}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                            Launch Live Application
                        </a>
                    ` : ''}
                </div>
            `;

            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   5. CareerPulse MERN Job Tracker Interactive Demo
   ========================================================================== */
const defaultDemoJobs = [
    { id: '1', company: 'Google Inc.', role: 'Software Engineer (Full Stack)', status: 'interviewing', salary: '18-24 LPA • Hybrid', date: '2026-10-18' },
    { id: '2', company: 'Microsoft', role: 'Software Development Engineer', status: 'offered', salary: '16-20 LPA • Pune', date: '2026-10-12' },
    { id: '3', company: 'Stripe India', role: 'Backend Engineer (Node/Python)', status: 'applied', salary: '15-18 LPA • Remote', date: '2026-10-22' },
    { id: '4', company: 'Amazon Web Services', role: 'Cloud Support Associate', status: 'applied', salary: '12-14 LPA • Pune', date: '2026-10-25' }
];

function initJobTrackerDemo() {
    const listContainer = document.getElementById('trackerCardsList');
    const searchInput = document.getElementById('trackerSearch');
    const filterTags = document.querySelectorAll('.t-filter');
    const openAddBtn = document.getElementById('openAddJobBtn');
    const cancelAddBtn = document.getElementById('cancelAddJobBtn');
    const addForm = document.getElementById('addJobForm');
    const resetBtn = document.getElementById('resetTrackerDataBtn');

    if (!listContainer) return;

    let jobs = loadJobs();
    let currentFilter = 'all';
    let searchQuery = '';

    function loadJobs() {
        try {
            const saved = localStorage.getItem('careerpulse_jobs_demo');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Storage error', e);
        }
        return [...defaultDemoJobs];
    }

    function saveJobs(data) {
        jobs = data;
        try {
            localStorage.setItem('careerpulse_jobs_demo', JSON.stringify(jobs));
        } catch (e) {
            console.error('Storage save error', e);
        }
        render();
    }

    function updateMetrics() {
        const total = jobs.length;
        const interviewing = jobs.filter(j => j.status === 'interviewing').length;
        const offered = jobs.filter(j => j.status === 'offered').length;
        const applied = jobs.filter(j => j.status === 'applied' || j.status === 'wishlist').length;

        const mTotal = document.getElementById('metric-total');
        const mInterviewing = document.getElementById('metric-interviewing');
        const mOffers = document.getElementById('metric-offers');
        const mApplied = document.getElementById('metric-applied');

        if (mTotal) mTotal.textContent = total;
        if (mInterviewing) mInterviewing.textContent = interviewing;
        if (mOffers) mOffers.textContent = offered;
        if (mApplied) mApplied.textContent = applied;
    }

    function render() {
        updateMetrics();

        const filtered = jobs.filter(job => {
            const matchesFilter = currentFilter === 'all' || job.status === currentFilter;
            const matchesSearch = job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  job.role.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            listContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted); background: rgba(255,255,255,0.02); border-radius: var(--radius-md);">
                    <p style="margin-bottom: 0.5rem; font-size: 1.1rem; color: var(--text-secondary);">No applications found matching criteria.</p>
                    <p style="font-size: 0.88rem;">Try clearing the search query or changing the filter.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = filtered.map(job => `
            <div class="tracker-item-card" data-id="${job.id}">
                <div class="t-item-header">
                    <div>
                        <h4 class="t-company">${escapeHtml(job.company)}</h4>
                        <div class="t-role">${escapeHtml(job.role)}</div>
                    </div>
                    <span class="timeline-badge ${getStatusBadgeClass(job.status)}">${capitalize(job.status)}</span>
                </div>

                <div class="t-meta-row">
                    <span>${job.salary ? escapeHtml(job.salary) : 'Not specified'}</span>
                    <span>Applied: ${job.date}</span>
                </div>

                <div class="t-actions-row">
                    <label style="font-size: 0.75rem; color: var(--text-muted);">Change Stage:
                        <select class="status-select" data-id="${job.id}">
                            <option value="wishlist" ${job.status === 'wishlist' ? 'selected' : ''}>Wishlist</option>
                            <option value="applied" ${job.status === 'applied' ? 'selected' : ''}>Applied</option>
                            <option value="interviewing" ${job.status === 'interviewing' ? 'selected' : ''}>Interviewing</option>
                            <option value="offered" ${job.status === 'offered' ? 'selected' : ''}>Offered</option>
                            <option value="rejected" ${job.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </label>
                    <button class="delete-app-btn" data-id="${job.id}" title="Remove application">✕ Delete</button>
                </div>
            </div>
        `).join('');

        // Attach listeners to dynamic elements
        listContainer.querySelectorAll('.status-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                const newStatus = e.target.value;
                const updated = jobs.map(j => j.id === id ? { ...j, status: newStatus } : j);
                saveJobs(updated);
                showToast(`Stage updated to ${capitalize(newStatus)}`);
            });
        });

        listContainer.querySelectorAll('.delete-app-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const updated = jobs.filter(j => j.id !== id);
                saveJobs(updated);
                showToast('Application deleted');
            });
        });
    }

    // Search and Filters
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            render();
        });
    }

    filterTags.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTags.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.status;
            render();
        });
    });

    // Add Form Toggle
    if (openAddBtn && addForm) {
        openAddBtn.addEventListener('click', () => {
            addForm.classList.toggle('hidden');
            if (!addForm.classList.contains('hidden')) {
                document.getElementById('jobCompany').focus();
            }
        });
    }

    if (cancelAddBtn && addForm) {
        cancelAddBtn.addEventListener('click', () => {
            addForm.classList.add('hidden');
            addForm.reset();
        });
    }

    // Submit new job
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const company = document.getElementById('jobCompany').value.trim();
            const role = document.getElementById('jobRole').value.trim();
            const status = document.getElementById('jobStatus').value;
            const salary = document.getElementById('jobSalary').value.trim();

            if (!company || !role) {
                alert('Please enter company and role.');
                return;
            }

            const today = new Date().toISOString().split('T')[0];
            const newJob = {
                id: Date.now().toString(),
                company,
                role,
                status,
                salary: salary || 'Unspecified',
                date: today
            };

            jobs.unshift(newJob);
            saveJobs(jobs);
            addForm.reset();
            addForm.classList.add('hidden');
            showToast(`Added application for ${company}`);
        });
    }

    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset tracker data to initial sample applications?')) {
                saveJobs([...defaultDemoJobs]);
                showToast('Reset to demo dataset');
            }
        });
    }

    render();
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'interviewing': return 'badge-primary';
        case 'offered': return 'badge-success';
        case 'rejected': return 'badge-secondary';
        case 'applied': return 'badge-secondary';
        default: return 'badge-secondary';
    }
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

/* ==========================================================================
   6. Contact Form Handlers
   ========================================================================== */
function initContactHandlers() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    const openGmailBtn = document.getElementById('openGmailBtn');
    const RECIPIENT_EMAIL = 'desaitej1256@gmail.com';

    if (!form) return;

    function getFormData() {
        const firstName = document.getElementById('contactFirstName').value.trim();
        const lastName = document.getElementById('contactLastName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        return { firstName, lastName, email, subject, message };
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Mailto client launcher
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const { firstName, lastName, email, subject, message } = getFormData();

        if (!firstName || !lastName || !email || !subject || !message) {
            showFeedback('Please fill in all required fields.', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showFeedback('Please provide a valid email address.', 'error');
            return;
        }

        const body = `Hello Tej,\n\n${message}\n\nFrom: ${firstName} ${lastName}\nContact Email: ${email}`;
        const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoUrl;

        showFeedback('Opening your default email client to send message...', 'success');
        showToast('Email client triggered!');
    });

    // Direct Gmail Web Composer
    if (openGmailBtn) {
        openGmailBtn.addEventListener('click', () => {
            const { firstName, lastName, email, subject, message } = getFormData();
            const fullName = `${firstName} ${lastName}`.trim() || 'Candidate / Recruiter';
            const mailSubject = subject || 'Discussion on Software Developer Opportunity';
            const mailBody = message ? `${message}\n\nFrom: ${fullName} (${email || 'No email provided'})` : `Hello Tej,\n\nI would like to discuss a software engineering opportunity with you.\n\nBest regards,\n${fullName}`;

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
            window.open(gmailUrl, '_blank', 'noopener,noreferrer');
            showToast('Opening Gmail web tab...');
        });
    }

    function showFeedback(msg, type) {
        if (!feedback) return;
        feedback.textContent = msg;
        feedback.className = `form-feedback ${type}`;
        feedback.classList.remove('hidden');
    }
}

/* ==========================================================================
   7. Copy Email to Clipboard
   ========================================================================== */
function initCopyEmail() {
    const copyBtn = document.getElementById('copyEmailBtn');
    const copyText = document.getElementById('copyEmailText');
    const emailToCopy = 'desaitej1256@gmail.com';

    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(emailToCopy);
            if (copyText) copyText.textContent = 'Copied!';
            showToast('Email address copied to clipboard!');

            setTimeout(() => {
                if (copyText) copyText.textContent = 'Copy';
            }, 2500);
        } catch (err) {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = emailToCopy;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            showToast('Email copied to clipboard!');
        }
    });
}

/* ==========================================================================
   8. Toast Notification Utility
   ========================================================================== */
function showToast(message) {
    const container = document.getElementById('toastNotification');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--cyan);">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

/* ==========================================================================
   9. Footer Year
   ========================================================================== */
function initCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) {
        el.textContent = new Date().getFullYear();
    }
}