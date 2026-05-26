/* ==========================================
   EcoWarm | Premium Animations Engine
   Created by: Aditya Kumar Sah
   ========================================== */

(function() {
    'use strict';

    const $ = (s, c=document) => c.querySelector(s);
    const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

    // ============ Reveal on Scroll ============
    const revealItems = $$('.reveal, .reveal-fade, .reveal-line');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('visible');

                // Trigger counter
                if (en.target.matches('.about-stats, .about-stat-card, .about-content')) {
                    en.target.querySelectorAll('[data-count]').forEach(animateCount);
                }
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(el => revealObs.observe(el));

    // ============ Number Counter ============
    function animateCount(el) {
        if (el.dataset.counted) return;
        el.dataset.counted = 'true';
        const target = parseInt(el.dataset.count);
        const dur = 2400;
        const start = performance.now();
        el.classList.add('counting');

        function ease(t) { return 1 - Math.pow(1 - t, 4); }

        function step(t) {
            const p = Math.min((t - start) / dur, 1);
            const v = Math.floor(ease(p) * target);
            el.textContent = v.toLocaleString();
            if (p < 1) requestAnimationFrame(step);
            else {
                el.textContent = target.toLocaleString();
                el.classList.add('pulse');
                setTimeout(() => el.classList.remove('pulse'), 400);
            }
        }
        requestAnimationFrame(step);
    }

    // Also observe stat cards directly
    const statObs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.querySelectorAll('[data-count]').forEach(animateCount);
            }
        });
    }, { threshold: 0.4 });

    $$('.about-stats, .about-visual, .ab-stat').forEach(s => statObs.observe(s));


    // ============ Particle System ============
    function createParticles() {
        const c = $('#heroParticles');
        if (!c) return;
        const symbols = ['🌿', '🍃', '🌱', '✨', '🪴'];
        const count = window.innerWidth < 768 ? 12 : 24;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'particle leaf';
            p.textContent = symbols[Math.floor(Math.random() * symbols.length)];

            p.style.setProperty('--p-x', Math.random() * 100 + '%');
            p.style.setProperty('--p-y', (Math.random() * 50 + 50) + '%');
            p.style.setProperty('--p-tx', (Math.random() - 0.5) * 200 + 'px');
            p.style.setProperty('--p-tx2', (Math.random() - 0.5) * 200 + 'px');
            p.style.setProperty('--p-dur', (10 + Math.random() * 12) + 's');
            p.style.setProperty('--p-delay', (Math.random() * 12) + 's');
            p.style.setProperty('--p-size', (0.7 + Math.random() * 0.8) + 'rem');
            p.style.setProperty('--p-op', (0.3 + Math.random() * 0.4));

            c.appendChild(p);
        }
    }
    createParticles();

    // ============ Parallax Hero ============
    let ticking = false;
    function parallax() {
        const y = window.pageYOffset;
        const heroVis = $('.hero-visual');
        const heroContent = $('.hero-content');
        if (heroVis && y < 800) {
            heroVis.style.transform = `translateY(${y * 0.15}px)`;
        }
        if (heroContent && y < 800) {
            heroContent.style.transform = `translateY(${y * 0.08}px)`;
            heroContent.style.opacity = Math.max(0, 1 - y / 600);
        }
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(parallax);
            ticking = true;
        }
    }, { passive: true });

    // ============ 3D Card Tilt ============
    const tiltCards = $$('.product-card, .guide-card');
    tiltCards.forEach(card => {
        let rect = null;
        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
        });
        card.addEventListener('mousemove', (e) => {
            if (!rect) rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rx = (y - 0.5) * 10;
            const ry = (x - 0.5) * -10;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            rect = null;
        });
    });

    // ============ Hero Visual Mouse Tilt ============
    const heroStack = $('.hero-card-stack');
    if (heroStack) {
        heroStack.addEventListener('mousemove', (e) => {
            const rect = heroStack.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rx = (y - 0.5) * -8;
            const ry = (x - 0.5) * 8;
            heroStack.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        heroStack.addEventListener('mouseleave', () => {
            heroStack.style.transform = '';
        });
    }


    // ============ Magnetic Buttons ============
    $$('.btn-primary, .pc-cart-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ============ Glow Orbs follow cursor in hero ============
    const orbs = $$('.orb');
    if (orbs.length && window.innerWidth > 768) {
        let mx = 0, my = 0;
        document.addEventListener('mousemove', (e) => {
            mx = (e.clientX / window.innerWidth - 0.5) * 60;
            my = (e.clientY / window.innerHeight - 0.5) * 60;
            orbs.forEach((o, i) => {
                const factor = (i + 1) * 0.5;
                o.style.transform += ` translate(${mx * factor}px, ${my * factor}px)`;
            });
        });
    }

    // ============ Wishlist Heart Toggle ============
    $$('.pc-act').forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon && icon.classList.contains('fa-heart')) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const liked = icon.classList.toggle('fas');
                icon.classList.toggle('far', !liked);
                if (liked) {
                    icon.style.color = '#dc2626';
                    // Pop hearts
                    for (let i = 0; i < 6; i++) {
                        const h = document.createElement('span');
                        h.textContent = '❤️';
                        h.style.cssText = `
                            position:absolute;
                            font-size:.9rem;
                            pointer-events:none;
                            left:${50 + (Math.random()-0.5)*40}%;
                            top:50%;
                            opacity:1;
                            transition:all 1s ease-out;
                            z-index:10;
                        `;
                        btn.style.position = 'relative';
                        btn.appendChild(h);
                        requestAnimationFrame(() => {
                            h.style.transform = `translate(${(Math.random()-0.5)*60}px, -60px) scale(.3)`;
                            h.style.opacity = '0';
                        });
                        setTimeout(() => h.remove(), 1000);
                    }
                    if (window.ecoToast) window.ecoToast('Added to wishlist ❤️', 'fa-heart');
                } else {
                    icon.style.color = '';
                }
            });
        } else {
            // Quick view
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.ecoToast) window.ecoToast('Quick view coming soon!', 'fa-eye');
            });
        }
    });

    // ============ Smooth Stagger on First Load ============
    window.addEventListener('load', () => {
        setTimeout(() => {
            $$('.hero-content > *').forEach((el, i) => {
                el.classList.add('reveal-line', 'visible');
            });
        }, 100);
    });

})();
