document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Navigation
    setupNavigation();
    
    // Auth modals
    setupAuthModals();
    
    // Mobile menu
    setupMobileMenu();
    
    // Animations
    setupAnimations();
    
    // Initial route
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            window.location.hash = href;
        });
    });
}

function setupAuthModals() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const heroGetStarted = document.getElementById('heroGetStarted');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeSignupModal = document.getElementById('closeSignupModal');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');

    loginBtn?.addEventListener('click', () => showModal(loginModal));
    signupBtn?.addEventListener('click', () => showModal(signupModal));
    heroGetStarted?.addEventListener('click', () => {
        if (auth.isAuthenticated()) {
            window.location.hash = '#dashboard';
        } else {
            showModal(signupModal);
        }
    });

    closeLoginModal?.addEventListener('click', () => hideModal(loginModal));
    closeSignupModal?.addEventListener('click', () => hideModal(signupModal));

    loginModal?.addEventListener('click', (e) => {
        if (e.target === loginModal) hideModal(loginModal);
    });
    signupModal?.addEventListener('click', (e) => {
        if (e.target === signupModal) hideModal(signupModal);
    });

    loginForm?.addEventListener('submit', handleLogin);
    signupForm?.addEventListener('submit', handleSignup);
    logoutBtn?.addEventListener('click', () => auth.logout());
}

function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    mobileToggle?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
    });
}

function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Counter animation
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });

        observer.observe(counter);
    });
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    showLoading();

    const result = await auth.login(email, password);

    hideLoading();

    if (result.success) {
        hideModal(document.getElementById('loginModal'));
        window.location.hash = '#dashboard';
    } else {
        errorDiv.textContent = result.error;
        errorDiv.classList.remove('hidden');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const displayName = document.getElementById('signupDisplayName').value;
    const role = document.getElementById('signupRole').value;
    const errorDiv = document.getElementById('signupError');

    showLoading();

    const result = await auth.signup(email, password, displayName, role);

    hideLoading();

    if (result.success) {
        hideModal(document.getElementById('signupModal'));
        window.location.hash = '#dashboard';
    } else {
        errorDiv.textContent = result.error;
        errorDiv.classList.remove('hidden');
    }
}

function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${hash}`) {
            link.classList.add('active');
        }
    });

    // Show/hide sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(hash);
    if (targetSection) {
        targetSection.classList.remove('hidden');

        // Load dashboard content if needed
        if (hash === 'dashboard') {
            if (!auth.isAuthenticated()) {
                window.location.hash = '#home';
                return;
            }
            dashboard.loadDashboard();
        }

        // Load courses when visiting courses page
        if (hash === 'courses') {
            loadCourses();
        }
    }
}

async function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;

    try {
        showLoading();
        const response = await api.getAllGroups();
        hideLoading();

        if (response.success && response.data) {
            const activeGroups = response.data.filter(g => !g.isDeleted);
            
            if (activeGroups.length === 0) {
                coursesGrid.innerHTML = `
                    <div class="course-card">
                        <p style="text-align: center; color: var(--gray);">No active courses available at the moment.</p>
                    </div>
                `;
                return;
            }

            coursesGrid.innerHTML = activeGroups.map((group, index) => {
                const icons = ['🤖', '⚙️', '💻', '🔧', '🎯', '🚀', '⚡', '🔬'];
                const icon = icons[index % icons.length];
                const isFeatured = index === 0 ? 'featured' : '';
                
                return `
                    <div class="course-card ${isFeatured}">
                        ${isFeatured ? '<div class="course-badge featured-badge">Featured</div>' : ''}
                        <div class="course-icon">${icon}</div>
                        <h3>${escapeHtml(group.name)}</h3>
                        <p>${escapeHtml(group.description)}</p>
                        <div class="course-meta">
                            <span>📅 ${group.startAsHour} - ${group.endAsHour}</span>
                        </div>
                        ${group.user ? `<small style="color: var(--gray);">Instructor: ${escapeHtml(group.user.displayName || group.user.email)}</small>` : ''}
                        ${auth.isAuthenticated() ? 
                            `<button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="alert('Enrollment feature coming soon!')">Enroll Now</button>` : 
                            `<button class="btn btn-primary" style="margin-top: 1rem; width: 100%;" onclick="document.getElementById('signupBtn').click()">Sign Up to Enroll</button>`
                        }
                    </div>
                `;
            }).join('');
        } else {
            coursesGrid.innerHTML = `
                <div class="course-card">
                    <div class="course-icon">🤖</div>
                    <h3>Intro to Robotics</h3>
                    <p>Start your journey with basic robot building and programming</p>
                </div>
                <div class="course-card featured">
                    <div class="course-icon">⚙️</div>
                    <h3>Advanced Mechanics</h3>
                    <p>Dive deep into mechanical engineering and complex designs</p>
                </div>
                <div class="course-card">
                    <div class="course-icon">💻</div>
                    <h3>AI & Robotics</h3>
                    <p>Integrate AI with robotics for smart automation</p>
                </div>
            `;
        }
    } catch (error) {
        hideLoading();
        console.error('Error loading courses:', error);
        coursesGrid.innerHTML = `
            <div class="course-card">
                <p style="color: var(--danger);">Error loading courses. Please try again later.</p>
            </div>
        `;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showModal(modal) {
    modal?.classList.add('active');
}

function hideModal(modal) {
    modal?.classList.remove('active');
}

function showLoading() {
    document.getElementById('loadingOverlay')?.classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay')?.classList.add('hidden');
}