/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. INITIALIZATION & STATE MANAGEMENT
    // ==========================================================================
    const state = {
        theme: localStorage.getItem('theme') || 'dark',
        currentPage: 'home',
        canvas: null,
        ctx: null,
        particles: []
    };

    initApp();

    function initApp() {
        applyTheme(state.theme);
        setupNavigation();
        setupLoader();
        setupParticles();
        setupToolModals();
        setupSearchFilter();
        setupAccordion();
        setupBackToTop();
        setupRippleEffects();
        setupScrollReveal();
        setupContactForm();
    }

    // ==========================================================================
    // 2. LOADER & THEME SWITCHER
    // ==========================================================================
    function setupLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 800);
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        state.theme = theme;

        const themeToggleBtn = document.getElementById('theme-toggle');
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = state.theme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            showToast(`Switched to ${newTheme} theme`, 'info');
        });
    }

    // ==========================================================================
    // 3. NAVIGATION & ROUTING
    // ==========================================================================
    function setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, [data-target]');
        const mobileMenuBtn = document.getElementById('hamburger-btn');
        const mobileNav = document.getElementById('nav-links-container');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('data-target') || link.getAttribute('href')?.replace('#', '');
                
                if (targetId && document.getElementById(targetId)) {
                    e.preventDefault();
                    navigateToPage(targetId);

                    // Close mobile menu if open
                    if (mobileNav && mobileNav.classList.contains('active')) {
                        mobileNav.classList.remove('active');
                    }
                }
            });
        });

        if (mobileMenuBtn && mobileNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
            });
        }
    }

    function navigateToPage(pageId) {
        const sections = document.querySelectorAll('.page-section');
        const navLinks = document.querySelectorAll('.nav-link');

        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(pageId);
        if (targetSection) {
            targetSection.classList.add('active');
            state.currentPage = pageId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        navLinks.forEach(link => {
            const linkTarget = link.getAttribute('data-target') || link.getAttribute('href')?.replace('#', '');
            if (linkTarget === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Trigger scroll reveals for newly visible section
        setTimeout(checkScrollReveal, 100);
    }

    // ==========================================================================
    // 4. ANIMATED PARTICLE BACKGROUND
    // ==========================================================================
    function setupParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        state.canvas = canvas;
        state.ctx = canvas.getContext('2d');

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Generate particles
        const particleCount = Math.floor(window.innerWidth / 15);
        state.particles = [];
        for (let i = 0; i < particleCount; i++) {
            state.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 0.5,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        animateParticles();
    }

    function resizeCanvas() {
        if (state.canvas) {
            state.canvas.width = window.innerWidth;
            state.canvas.height = window.innerHeight;
        }
    }

    function animateParticles() {
        const { canvas, ctx, particles } = state;
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particleColor = state.theme === 'dark' ? '0, 240, 255' : '2, 132, 199';

        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
            ctx.fill();

            // Connect nearby particles
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${particleColor}, ${0.15 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animateParticles);
    }

    // ==========================================================================
    // 5. TOOL MODALS & INTERACTIVE TOOLS LOGIC
    // ==========================================================================
    function setupToolModals() {
        const modalOverlay = document.getElementById('tool-modal-overlay');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const toolCards = document.querySelectorAll('[data-tool]');

        toolCards.forEach(card => {
            card.addEventListener('click', () => {
                const toolType = card.getAttribute('data-tool');
                openToolModal(toolType);
            });
        });

        if (modalCloseBtn && modalOverlay) {
            modalCloseBtn.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) closeModal();
            });
        }

        function closeModal() {
            if (modalOverlay) modalOverlay.classList.remove('active');
        }
    }

    function openToolModal(toolType) {
        const modalOverlay = document.getElementById('tool-modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        if (!modalOverlay || !modalTitle || !modalBody) return;

        // Render tool UI dynamically based on selection
        switch (toolType) {
            case 'hash-generator':
                modalTitle.innerText = 'SHA-256 Hash Generator';
                modalBody.innerHTML = `
                    <div class="tool-ui-group">
                        <label for="hash-input">Input String:</label>
                        <textarea id="hash-input" rows="3" placeholder="Type text here..."></textarea>
                        <button id="calc-hash-btn" class="btn btn-primary width-100">Generate Hash</button>
                        <div id="hash-output" class="tool-output-box">Hash result will appear here...</div>
                    </div>
                `;
                modalOverlay.classList.add('active');
                document.getElementById('calc-hash-btn').addEventListener('click', async () => {
                    const str = document.getElementById('hash-input').value;
                    const hash = await computeSHA256(str);
                    document.getElementById('hash-output').innerText = hash;
                });
                break;

            case 'base64-converter':
                modalTitle.innerText = 'Base64 Encoder / Decoder';
                modalBody.innerHTML = `
                    <div class="tool-ui-group">
                        <label for="base64-input">Input Text:</label>
                        <textarea id="base64-input" rows="3" placeholder="Enter string..."></textarea>
                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <button id="b64-encode" class="btn btn-primary" style="flex: 1;">Encode</button>
                            <button id="b64-decode" class="btn btn-glass" style="flex: 1;">Decode</button>
                        </div>
                        <div id="base64-output" class="tool-output-box">Result will appear here...</div>
                    </div>
                `;
                modalOverlay.classList.add('active');
                document.getElementById('b64-encode').addEventListener('click', () => {
                    const text = document.getElementById('base64-input').value;
                    document.getElementById('base64-output').innerText = btoa(text);
                });
                document.getElementById('b64-decode').addEventListener('click', () => {
                    try {
                        const text = document.getElementById('base64-input').value;
                        document.getElementById('base64-output').innerText = atob(text);
                    } catch {
                        document.getElementById('base64-output').innerText = 'Error: Invalid Base64 string';
                    }
                });
                break;

            case 'password-generator':
                modalTitle.innerText = 'Secure Password Generator';
                modalBody.innerHTML = `
                    <div class="tool-ui-group">
                        <label for="pass-length">Password Length: <span id="length-val">16</span></label>
                        <input type="range" id="pass-length" min="8" max="64" value="16" style="margin-bottom: 1rem;">
                        <button id="gen-pass-btn" class="btn btn-primary width-100">Generate Password</button>
                        <div id="pass-output" class="tool-output-box">Click generate...</div>
                    </div>
                `;
                modalOverlay.classList.add('active');
                const slider = document.getElementById('pass-length');
                const lenVal = document.getElementById('length-val');
                slider.addEventListener('input', () => lenVal.innerText = slider.value);
                
                document.getElementById('gen-pass-btn').addEventListener('click', () => {
                    const pass = generateSecurePassword(parseInt(slider.value));
                    document.getElementById('pass-output').innerText = pass;
                });
                break;

            default:
                modalTitle.innerText = 'Interactive Utility';
                modalBody.innerHTML = `<p style="color: var(--text-secondary);">Tool details and parameters configured for ${toolType}.</p>`;
                modalOverlay.classList.add('active');
                break;
        }
    }

    // SHA-256 Crypto Helper
    async function computeSHA256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Password Generator Helper
    function generateSecurePassword(length) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let ret = '';
        const randomValues = new Uint32Array(length);
        crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
            ret += charset[randomValues[i] % charset.length];
        }
        return ret;
    }

    // ==========================================================================
    // 6. SEARCH & FILTERING
    // ==========================================================================
    function setupSearchFilter() {
        const searchInput = document.getElementById('tools-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.tools-full-grid .tool-card');

            cards.forEach(card => {
                const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
                const desc = card.querySelector('p')?.innerText.toLowerCase() || '';

                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ==========================================================================
    // 7. ACCORDION (FAQ)
    // ==========================================================================
    function setupAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (header) {
                header.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // Close all active items
                    accordionItems.forEach(i => i.classList.remove('active'));

                    // Toggle clicked item
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // ==========================================================================
    // 8. BACK TO TOP & SCROLL REVEAL
    // ==========================================================================
    function setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
            checkScrollReveal();
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function setupScrollReveal() {
        checkScrollReveal();
    }

    function checkScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    // ==========================================================================
    // 9. RIPPLE EFFECT ON BUTTONS
    // ==========================================================================
    function setupRippleEffects() {
        const rippleButtons = document.querySelectorAll('.btn');

        rippleButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const circle = document.createElement('span');
                circle.classList.add('ripple');
                circle.style.left = `${x}px`;
                circle.style.top = `${y}px`;

                const existingRipple = button.querySelector('.ripple');
                if (existingRipple) {
                    existingRipple.remove();
                }

                button.appendChild(circle);

                setTimeout(() => circle.remove(), 600);
            });
        });
    }

    // ==========================================================================
    // 10. CONTACT FORM & TOAST NOTIFICATIONS
    // ==========================================================================
    function setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('form-name')?.value;
            const email = document.getElementById('form-email')?.value;

            if (name && email) {
                showToast('Message sent successfully!', 'success');
                form.reset();
            } else {
                showToast('Please fill in all required fields.', 'error');
            }
        });
    }

    function showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        if (type === 'error') iconClass = 'fa-exclamation-circle';

        toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
