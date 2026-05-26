/* ==========================================
   EcoWarm | Premium Pet Store - Main JS
   Created by: Aditya Kumar Sah
   ========================================== */

(function() {
    'use strict';

    // ============ DOM ============
    const $ = (s, c=document) => c.querySelector(s);
    const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

    // ============ Preloader ============
    window.addEventListener('load', () => {
        setTimeout(() => {
            $('#preloader')?.classList.add('hide');
            $('.hero-title')?.classList.add('animate');
        }, 1800);
    });

    // ============ Theme Toggle ============
    const themeToggle = $('#themeToggle');
    const html = document.documentElement;

    const applyTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('ecowarm-theme', theme);
    };

    const savedTheme = localStorage.getItem('ecowarm-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggle?.addEventListener('click', () => {
        html.classList.add('theme-transitioning');
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        setTimeout(() => html.classList.remove('theme-transitioning'), 800);
    });


    // ============ Cursor Effect ============
    const cursorGlow = $('#cursorGlow');
    const cursorDot = $('#cursorDot');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        }
    });

    // Smooth glow follow
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        if (cursorGlow) {
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
        }
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Cursor expand on interactive
    $$('a, button, .product-card, .guide-card, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => cursorDot?.classList.add('expand'));
        el.addEventListener('mouseleave', () => cursorDot?.classList.remove('expand'));
    });

    // ============ Navbar Scroll ============
    const navbar = $('#navbar');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const y = window.pageYOffset;
        if (y > 30) navbar?.classList.add('scrolled');
        else navbar?.classList.remove('scrolled');

        // Scroll progress
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = (y / max) * 100;
        const sp = $('#scrollProgress');
        if (sp) sp.style.width = pct + '%';

        lastScroll = y;
    }, { passive: true });

    // Active nav link
    const sections = $$('section[id]');
    const navLinksAll = $$('.nav-link');

    function updateActiveNav() {
        const pos = window.scrollY + 200;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const h = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (pos >= top && pos < top + h) {
                navLinksAll.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // Smooth scroll
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href.length > 1) {
                const target = $(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ============ Mobile Menu ============
    const mobileMenuBtn = $('#mobileMenuBtn');
    const navLinks = $('#navLinks');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    navLinksAll.forEach(l => {
        l.addEventListener('click', () => {
            mobileMenuBtn?.classList.remove('active');
            navLinks?.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });


    // ============ Word Cycle Hero ============
    const wordCycle = $('#wordCycle');
    const words = ['Wild', 'Wonder', 'Exotic', 'Rare', 'Untamed'];
    let wordIdx = 0;
    if (wordCycle) {
        setInterval(() => {
            wordCycle.classList.add('swap');
            setTimeout(() => {
                wordIdx = (wordIdx + 1) % words.length;
                wordCycle.textContent = words[wordIdx];
                wordCycle.classList.remove('swap');
            }, 600);
        }, 3000);
    }

    // ============ Cart ============
    const cartBtn = $('#cartBtn');
    const cartOverlay = $('#cartOverlay');
    const cartDrawer = $('#cartDrawer');
    const cartClose = $('#cartClose');
    const cartList = $('#cartList');
    const cartFoot = $('#cartFoot');
    const cartTotalEl = $('#cartTotal');
    const cartCountEl = $('.cart-count');

    let cart = JSON.parse(localStorage.getItem('ecowarm-cart') || '[]');

    function saveCart() {
        localStorage.setItem('ecowarm-cart', JSON.stringify(cart));
    }

    function openCart() {
        cartOverlay?.classList.add('active');
        cartDrawer?.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeCart() {
        cartOverlay?.classList.remove('active');
        cartDrawer?.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    cartBtn?.addEventListener('click', openCart);
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);

    function addToCart(product, price, name, emoji) {
        const existing = cart.find(i => i.product === product);
        if (existing) existing.qty += 1;
        else cart.push({ product, name, price: parseFloat(price), qty: 1, emoji });
        saveCart();
        renderCart();
        bumpCart();
        showToast(`Added ${name} to cart!`, 'fa-check-circle');
    }

    function removeFromCart(idx) {
        cart.splice(idx, 1);
        saveCart();
        renderCart();
    }

    function bumpCart() {
        cartCountEl?.classList.add('bump');
        setTimeout(() => cartCountEl?.classList.remove('bump'), 400);
    }

    function renderCart() {
        const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
        const count = cart.reduce((s, i) => s + i.qty, 0);
        if (cartCountEl) cartCountEl.textContent = count;

        if (cart.length === 0) {
            cartList.innerHTML = `
                <div class="cart-empty">
                    <div class="ce-icon">🛒</div>
                    <h4>Your cart is empty</h4>
                    <p>Discover our exotic companions</p>
                </div>`;
            cartFoot.style.display = 'none';
            return;
        }

        cartList.innerHTML = cart.map((it, i) => `
            <div class="cart-item">
                <div class="cart-item-img" style="background:linear-gradient(135deg,#5a8d3e,#d4a574)">
                    ${it.emoji || '🌿'}
                </div>
                <div class="cart-item-info">
                    <h4>${it.name}</h4>
                    <span>$${it.price.toFixed(2)} × ${it.qty}</span>
                </div>
                <button class="cart-item-rm" data-idx="${i}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        $$('.cart-item-rm', cartList).forEach(b => {
            b.addEventListener('click', () => removeFromCart(parseInt(b.dataset.idx)));
        });

        cartFoot.style.display = 'block';
        cartTotalEl.textContent = '$' + total.toFixed(2);
    }

    renderCart();

    // Add to cart buttons
    $$('.pc-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = btn.closest('.product-card');
            const name = card.querySelector('.pc-name').textContent;
            const emoji = card.querySelector('.pc-emoji').textContent;
            addToCart(btn.dataset.product, btn.dataset.price, name, emoji);

            // Ripple
            const r = document.createElement('span');
            r.className = 'ripple';
            const rect = btn.getBoundingClientRect();
            r.style.cssText = `width:60px;height:60px;left:${e.clientX-rect.left-30}px;top:${e.clientY-rect.top-30}px`;
            btn.appendChild(r);
            setTimeout(() => r.remove(), 700);
        });
    });


    // ============ Filter Pills ============
    const pills = $$('.pill');
    const productCards = $$('.product-card');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const f = pill.dataset.filter;
            productCards.forEach(c => {
                const match = f === 'all' || c.dataset.cat === f;
                c.classList.toggle('hide-cat', !match);
            });
        });
    });

    // ============ Forms ============
    $('#newsletterForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thanks for subscribing! 🌿', 'fa-paper-plane');
        e.target.reset();
    });

    $('#contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Message sent! We\'ll reply within 24h.', 'fa-envelope-circle-check');
        e.target.reset();
    });

    // ============ Toast ============
    function showToast(msg, icon = 'fa-check-circle') {
        const container = $('#toastContainer');
        if (!container) return;
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = `<i class="fas ${icon}"></i><span>${msg}</span>`;
        container.appendChild(t);
        setTimeout(() => {
            t.classList.add('removing');
            setTimeout(() => t.remove(), 400);
        }, 3000);
    }

    window.ecoToast = showToast;

    // Console signature
    console.log(
        '%c🌿 EcoWarm — Premium Exotic Pet Store',
        'color:#2d5016;font-size:18px;font-weight:bold;font-family:Playfair Display,serif'
    );
    console.log(
        '%cCrafted with 💚 by Aditya Kumar Sah',
        'color:#5a8d3e;font-size:13px;font-style:italic'
    );

})();
