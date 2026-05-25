/* ============================================
   EcoWarm - Main JavaScript
   E-Commerce Functionality
   Created by: Aditya Kumar Sah
   ============================================ */

// DOM Elements
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cursorGlow = document.getElementById('cursorGlow');

// State
let cart = [];
let isDarkMode = false;

// ============ PRELOADER ============
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 1500);
});

// ============ THEME TOGGLE ============
function initTheme() {
    const savedTheme = localStorage.getItem('ecowarm-theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        isDarkMode = true;
    }
}

function toggleTheme() {
    document.documentElement.classList.add('theme-transitioning');
    isDarkMode = !isDarkMode;
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ecowarm-theme', theme);

    setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
    }, 600);
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();


// ============ NAVBAR SCROLL ============
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============ MOBILE MENU ============
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinksAll.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============ CURSOR GLOW ============
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ============ CART FUNCTIONALITY ============
function openCart() {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('active');
}

function closeCart() {
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('active');
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function addToCart(product, price) {
    const existingItem = cart.find(item => item.product === product);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product, price: parseFloat(price), quantity: 1 });
    }
    updateCartUI();
    showToast(`Added to cart!`);

    // Bump animation on cart count
    const cartCount = document.querySelector('.cart-count');
    cartCount.classList.add('bump');
    setTimeout(() => cartCount.classList.remove('bump'), 300);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-leaf"></i>
                <p>Your cart is empty</p>
                <span>Start shopping sustainably!</span>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-img" style="background: var(--accent-gradient);">
                    <i class="fas fa-leaf"></i>
                </div>
                <div class="cart-item-info">
                    <h4>${formatProductName(item.product)}</h4>
                    <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        cartFooter.style.display = 'block';
        document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
    }
}

function formatProductName(slug) {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Add to cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const product = btn.dataset.product;
        const price = btn.dataset.price;
        addToCart(product, price);

        // Ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    });
});


// ============ PRODUCT FILTERS ============
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        productCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.classList.add('show');
                card.style.display = '';
            } else {
                card.classList.remove('show');
                card.classList.add('hidden');
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.style.display = 'none';
                    }
                }, 400);
            }
        });
    });
});

// ============ TOAST NOTIFICATION ============
function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast-notification');
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// ============ COUNTER ANIMATION ============
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    });
}

// ============ NEWSLETTER FORM ============
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thanks for subscribing! 🌿');
    e.target.reset();
});

// ============ CONTACT FORM ============
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent successfully! We\'ll get back to you soon.');
    e.target.reset();
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
