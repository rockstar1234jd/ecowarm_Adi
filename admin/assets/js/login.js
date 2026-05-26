/* EcoWarm Admin — Login JS · Aditya Kumar Sah */
(function(){
    'use strict';
    const $ = s => document.querySelector(s);

    // Theme
    const themeToggle = $('#themeToggle');
    const html = document.documentElement;
    const saved = localStorage.getItem('ecowarm-theme') || 'light';
    html.setAttribute('data-theme', saved);
    themeToggle?.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('ecowarm-theme', next);
    });

    // Password toggle
    const pwdToggle = $('#pwdToggle');
    const pwd = $('#password');
    pwdToggle?.addEventListener('click', () => {
        const isPwd = pwd.type === 'password';
        pwd.type = isPwd ? 'text' : 'password';
        pwdToggle.querySelector('i').className = isPwd ? 'fas fa-eye-slash' : 'fas fa-eye';
    });

    // Demo autofill
    $('.demo-card')?.addEventListener('click', () => {
        $('#username').value = 'admin';
        $('#password').value = 'admin123';
        $('#username').focus();
    });

    // Login
    $('#loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = $('#username').value.trim();
        const p = $('#password').value;
        const btn = $('.login-btn');

        btn.classList.add('loading');

        setTimeout(() => {
            if (u === 'admin' && p === 'admin123') {
                showToast('Welcome back, Admin! 🌿', 'fa-check-circle');
                localStorage.setItem('ecowarm-admin', JSON.stringify({ user: u, ts: Date.now() }));
                setTimeout(() => window.location.href = 'index.html', 800);
            } else {
                btn.classList.remove('loading');
                showToast('Invalid credentials. Try admin / admin123', 'fa-exclamation-circle', true);
                shakeCard();
            }
        }, 1000);
    });

    function shakeCard() {
        const card = $('.login-card');
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'shake .4s';
        }, 10);
        if (!document.getElementById('shake-style')) {
            const s = document.createElement('style');
            s.id = 'shake-style';
            s.textContent = '@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-10px)} 75%{transform:translateX(10px)} }';
            document.head.appendChild(s);
        }
    }

    function showToast(msg, icon, error) {
        let c = document.querySelector('.toast-container');
        if (!c) {
            c = document.createElement('div');
            c.className = 'toast-container';
            document.body.appendChild(c);
        }
        const t = document.createElement('div');
        t.className = 'toast' + (error ? ' error' : '');
        t.innerHTML = `<i class="fas ${icon}"></i><span>${msg}</span>`;
        c.appendChild(t);
        setTimeout(() => {
            t.classList.add('removing');
            setTimeout(() => t.remove(), 400);
        }, 3000);
    }
})();
