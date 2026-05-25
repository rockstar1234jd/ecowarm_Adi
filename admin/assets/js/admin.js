/* EcoWarm Admin — Core JS · Aditya Kumar Sah */
(function(){
    'use strict';
    const $ = s => document.querySelector(s);
    const $$ = s => Array.from(document.querySelectorAll(s));

    // ===== Auth check =====
    const session = JSON.parse(localStorage.getItem('ecowarm-admin') || 'null');
    if (!session || (Date.now() - session.ts > 24 * 60 * 60 * 1000)) {
        // redirect if no session or > 24h
        window.location.href = 'login.html';
        return;
    }

    // ===== Theme =====
    const themeToggle = $('#themeToggle');
    const html = document.documentElement;
    const saved = localStorage.getItem('ecowarm-theme') || 'light';
    html.setAttribute('data-theme', saved);
    themeToggle?.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('ecowarm-theme', next);
    });

    // ===== Sidebar Toggle =====
    const sidebar = $('#sidebar');
    $('#sbToggle')?.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    $('#mobileMenuBtn')?.addEventListener('click', () => sidebar.classList.toggle('open'));

    // Close sidebar on link click (mobile)
    $$('.sb-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            $$('.sb-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            $$('.pg').forEach(p => p.classList.remove('active'));
            $('#pg-' + page)?.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.innerWidth <= 768) sidebar.classList.remove('open');
        });
    });

    // ===== Logout =====
    $('#logoutBtn')?.addEventListener('click', () => {
        if (confirm('Sign out of admin panel?')) {
            localStorage.removeItem('ecowarm-admin');
            window.location.href = 'login.html';
        }
    });

    // ===== Theme cards in settings =====
    $$('.th-card').forEach(c => {
        c.addEventListener('click', () => {
            const theme = c.dataset.themeSet;
            html.setAttribute('data-theme', theme);
            localStorage.setItem('ecowarm-theme', theme);
            showToast('Theme updated!', 'fa-check-circle');
        });
    });

    // ===== Toast =====
    window.showToast = function(msg, icon = 'fa-check-circle', error = false) {
        const c = $('#toastContainer');
        if (!c) return;
        const t = document.createElement('div');
        t.className = 'toast' + (error ? ' error' : '');
        t.innerHTML = `<i class="fas ${icon}"></i><span>${msg}</span>`;
        c.appendChild(t);
        setTimeout(() => {
            t.classList.add('removing');
            setTimeout(() => t.remove(), 400);
        }, 3000);
    };

    // ===== Counter Animation =====
    const counters = $$('[data-count]');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting && !en.target.dataset.counted) {
                en.target.dataset.counted = 'true';
                const target = parseInt(en.target.dataset.count);
                const prefix = en.target.dataset.prefix || '';
                const dur = 2000;
                const start = performance.now();
                function step(t) {
                    const p = Math.min((t - start) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 4);
                    const v = Math.floor(eased * target);
                    en.target.textContent = prefix + v.toLocaleString();
                    if (p < 1) requestAnimationFrame(step);
                    else en.target.textContent = prefix + target.toLocaleString();
                }
                requestAnimationFrame(step);
            }
        });
    }, { threshold: 0.3 });
    counters.forEach(c => counterObs.observe(c));

    console.log('%c🌿 EcoWarm Admin — Aditya Kumar Sah', 'color:#2d5016;font-size:14px;font-weight:bold');
})();
