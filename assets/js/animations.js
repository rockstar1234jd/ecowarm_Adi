/* ============================================
   EcoWarm - Animation Engine
   Premium Smooth Stream-Flow Motion
   Created by: Aditya Kumar Sah
   ============================================ */

// ============ INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger counter animation when hero stats come into view
            if (entry.target.closest('.hero-stats')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
});

// ============ HERO PARTICLES ============
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 20;
    const symbols = ['🌿', '🍃', '🌱', '✨', '💚'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.classList.add('leaf-particle');
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const endX = (Math.random() - 0.5) * 200;
        const endY = (Math.random() - 0.5) * 200;
        const rotation = Math.random() * 720 - 360;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 10;
        const size = 0.6 + Math.random() * 0.8;

        particle.style.cssText = `
            left: ${startX}%;
            top: ${startY}%;
            --leaf-x: ${endX}px;
            --leaf-y: ${endY}px;
            --leaf-rot: ${rotation}deg;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            font-size: ${size}rem;
        `;

        container.appendChild(particle);
    }
}

createParticles();


// ============ PARALLAX EFFECT ON SCROLL ============
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');

    if (heroContent) {
        const speed = 0.3;
        heroContent.style.transform = `translateY(${scrolled * speed}px)`;
        heroContent.style.opacity = 1 - (scrolled / 800);
    }

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ============ MAGNETIC BUTTON EFFECT ============
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ============ TILT EFFECT ON PRODUCT CARDS ============
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const tiltX = (y - 0.5) * 8;
        const tiltY = (x - 0.5) * -8;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-12px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ============ FEATURE CARDS GLOW ON HOVER ============
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(45, 138, 78, 0.05) 0%, var(--bg-card) 50%)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});

// ============ SMOOTH NUMBER COUNTING ============
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';

        const target = parseInt(counter.dataset.count);
        const duration = 2500;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(easedProgress * target);

            counter.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    });
}


// ============ SMOOTH SCROLL REVEAL WITH STAGGER ============
function revealOnScroll() {
    const reveals = document.querySelectorAll('.animate-on-scroll:not(.visible)');

    reveals.forEach((el, index) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 80);
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// ============ NAV LINK HOVER ANIMATION ============
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ============ WISHLIST HEART ANIMATION ============
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('liked');

        if (this.classList.contains('liked')) {
            this.innerHTML = '<i class="fas fa-heart" style="color: #e74c3c;"></i>';
            this.style.background = 'rgba(231, 76, 60, 0.1)';

            // Create floating hearts
            for (let i = 0; i < 5; i++) {
                const heart = document.createElement('span');
                heart.textContent = '❤️';
                heart.style.cssText = `
                    position: absolute;
                    font-size: 0.8rem;
                    pointer-events: none;
                    animation: heartFloat 1s ease-out forwards;
                    left: ${50 + (Math.random() - 0.5) * 40}%;
                    top: 50%;
                `;
                this.parentElement.appendChild(heart);
                setTimeout(() => heart.remove(), 1000);
            }
        } else {
            this.innerHTML = '<i class="fas fa-heart"></i>';
            this.style.background = '';
        }
    });
});

// Heart float keyframes
const heartStyle = document.createElement('style');
heartStyle.textContent = `
    @keyframes heartFloat {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-30px) scale(0.5); opacity: 0; }
    }
`;
document.head.appendChild(heartStyle);

// ============ SMOOTH ENTRANCE ANIMATION ============
window.addEventListener('DOMContentLoaded', () => {
    // Trigger hero animations after preloader
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 200);
        });
    }, 1600);
});

// ============ SCROLL PROGRESS INDICATOR ============
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: var(--accent-gradient);
    z-index: 10000;
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
});

// ============ IMAGE LAZY LOADING WITH FADE ============
const lazyImages = document.querySelectorAll('.product-img-placeholder');
lazyImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(img);
});

console.log('%c🌿 EcoWarm - Created by Aditya Kumar Sah', 'color: #2d8a4e; font-size: 14px; font-weight: bold;');
