/* EcoWarm Admin — Dashboard JS · Aditya Kumar Sah */
(function(){
    'use strict';
    const $ = s => document.querySelector(s);
    const $$ = s => Array.from(document.querySelectorAll(s));

    // ===== Sample Data =====
    let products = [
        { id: 1, name: 'Mexican Redknee Tarantula', latin: 'Brachypelma smithi', cat: 'tarantulas', price: 249, stock: 12, status: 'active', emoji: '🕷️', color: 'linear-gradient(135deg,#8B4513,#D2691E)' },
        { id: 2, name: 'Greenbottle Blue Tarantula', latin: 'Chromatopelma cyaneopubescens', cat: 'tarantulas', price: 320, stock: 8, status: 'active', emoji: '🕸️', color: 'linear-gradient(135deg,#1e3a8a,#15803d)' },
        { id: 3, name: 'Deathstalker Scorpion', latin: 'Leiurus quinquestriatus', cat: 'scorpions', price: 480, stock: 5, status: 'active', emoji: '🦂', color: 'linear-gradient(135deg,#facc15,#a16207)' },
        { id: 4, name: 'Amazonian Giant Centipede', latin: 'Scolopendra gigantea', cat: 'centipedes', price: 650, stock: 2, status: 'low', emoji: '🐛', color: 'linear-gradient(135deg,#7c2d12,#dc2626)' },
        { id: 5, name: 'Crested Gecko', latin: 'Correlophus ciliatus', cat: 'reptiles', price: 180, stock: 24, status: 'active', emoji: '🦎', color: 'linear-gradient(135deg,#16a34a,#15803d)' },
        { id: 6, name: 'Russian Tortoise', latin: 'Testudo horsfieldii', cat: 'reptiles', price: 295, stock: 18, status: 'active', emoji: '🐢', color: 'linear-gradient(135deg,#0f766e,#064e3b)' },
        { id: 7, name: 'Cobalt Blue Tarantula', latin: 'Cyriopagopus lividus', cat: 'tarantulas', price: 420, stock: 0, status: 'out', emoji: '🕷️', color: 'linear-gradient(135deg,#581c87,#a855f7)' },
        { id: 8, name: 'Emperor Scorpion', latin: 'Pandinus imperator', cat: 'scorpions', price: 220, stock: 32, status: 'active', emoji: '🦂', color: 'linear-gradient(135deg,#0c4a6e,#0e7490)' }
    ];

    const orders = [
        { id: '#ORD-1284', customer: 'Sarah Mitchell', date: '2025-05-25', items: 2, total: 498, status: 'completed' },
        { id: '#ORD-1283', customer: 'James Rodriguez', date: '2025-05-25', items: 1, total: 480, status: 'pending' },
        { id: '#ORD-1282', customer: 'Emma Chen', date: '2025-05-24', items: 3, total: 695, status: 'processing' },
        { id: '#ORD-1281', customer: 'Michael Brown', date: '2025-05-24', items: 1, total: 420, status: 'completed' },
        { id: '#ORD-1280', customer: 'Olivia Garcia', date: '2025-05-23', items: 2, total: 650, status: 'completed' },
        { id: '#ORD-1279', customer: 'Liam Johnson', date: '2025-05-23', items: 1, total: 180, status: 'cancelled' },
        { id: '#ORD-1278', customer: 'Ava Williams', date: '2025-05-22', items: 4, total: 920, status: 'completed' }
    ];

    const customers = [
        { name: 'Sarah Mitchell', email: 'sarah@example.com', orders: 12, spent: 3240, joined: '2024-01-15' },
        { name: 'James Rodriguez', email: 'james@example.com', orders: 8, spent: 2480, joined: '2024-03-22' },
        { name: 'Emma Chen', email: 'emma@example.com', orders: 15, spent: 4180, joined: '2023-11-08' },
        { name: 'Michael Brown', email: 'michael@example.com', orders: 6, spent: 1850, joined: '2024-05-01' },
        { name: 'Olivia Garcia', email: 'olivia@example.com', orders: 22, spent: 7320, joined: '2023-08-14' }
    ];

    const messages = [
        { name: 'Sarah Mitchell', email: 'sarah@example.com', subject: 'Care advice for new Redknee', body: "Hi! I just received my Mexican Redknee yesterday and she seems a bit lethargic. Is this normal during acclimation?", time: '2 mins ago' },
        { name: 'James Rodriguez', email: 'james@example.com', subject: 'Shipping question', body: 'Do you ship to Canada? I\'ve been looking for a Deathstalker for months.', time: '1 hour ago' },
        { name: 'Emma Chen', email: 'emma@example.com', subject: 'Bulk order inquiry', body: 'I run a small zoo and would like to discuss bulk pricing for educational specimens.', time: '3 hours ago' },
        { name: 'Michael Brown', email: 'michael@example.com', subject: 'Lost feeding schedule', body: 'I lost my care guide. Could you resend the feeding schedule for the Cobalt Blue?', time: '1 day ago' },
        { name: 'Olivia Garcia', email: 'olivia@example.com', subject: 'New species request', body: 'Any plans to stock Goliath Birdeaters? I\'ve been an EcoWarm customer for 2 years.', time: '2 days ago' }
    ];

    const subscribers = [
        { email: 'sarah@example.com', status: 'active', date: '2024-01-15' },
        { email: 'james@example.com', status: 'active', date: '2024-03-22' },
        { email: 'emma@example.com', status: 'active', date: '2023-11-08' },
        { email: 'michael@example.com', status: 'active', date: '2024-05-01' },
        { email: 'olivia@example.com', status: 'active', date: '2023-08-14' },
        { email: 'liam@example.com', status: 'unsub', date: '2024-02-10' }
    ];


    // ===== Render Products =====
    function renderProducts() {
        const tb = $('#prodTbody');
        if (!tb) return;
        const search = $('#prodSearch')?.value.toLowerCase() || '';
        const cat = $('#prodCatFilter')?.value || 'all';

        const filtered = products.filter(p =>
            (cat === 'all' || p.cat === cat) &&
            (p.name.toLowerCase().includes(search) || p.latin.toLowerCase().includes(search))
        );

        tb.innerHTML = filtered.map(p => `
            <tr>
                <td><input type="checkbox"></td>
                <td>
                    <div class="t-prod">
                        <div class="t-prod-icn" style="background:${p.color}">${p.emoji}</div>
                        <div class="t-prod-info">
                            <h4>${p.name}</h4>
                            <span>${p.latin}</span>
                        </div>
                    </div>
                </td>
                <td><span class="t-cat">${p.cat}</span></td>
                <td><strong>$${p.price.toFixed(2)}</strong></td>
                <td>${p.stock} units</td>
                <td><span class="badge ${p.status === 'active' ? 'ok' : p.status === 'low' ? 'warn' : 'danger'}">
                    ${p.status === 'active' ? 'Active' : p.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                </span></td>
                <td>
                    <div class="t-actions">
                        <button class="t-act" data-edit="${p.id}" title="Edit"><i class="fas fa-pen"></i></button>
                        <button class="t-act" title="View"><i class="fas fa-eye"></i></button>
                        <button class="t-act danger" data-del="${p.id}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');

        $$('[data-edit]').forEach(b => b.addEventListener('click', () => editProduct(parseInt(b.dataset.edit))));
        $$('[data-del]').forEach(b => b.addEventListener('click', () => deleteProduct(parseInt(b.dataset.del))));
    }

    $('#prodSearch')?.addEventListener('input', renderProducts);
    $('#prodCatFilter')?.addEventListener('change', renderProducts);

    // ===== Render Orders =====
    function renderOrders() {
        const tb = $('#ordTbody');
        if (!tb) return;
        tb.innerHTML = orders.map(o => `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.customer}</td>
                <td>${o.date}</td>
                <td>${o.items} items</td>
                <td><strong style="color:var(--brand-primary)">$${o.total}</strong></td>
                <td><span class="badge ${o.status === 'completed' ? 'ok' : o.status === 'pending' ? 'warn' : o.status === 'processing' ? 'info' : 'danger'}">${o.status}</span></td>
                <td>
                    <div class="t-actions">
                        <button class="t-act" title="View"><i class="fas fa-eye"></i></button>
                        <button class="t-act" title="Edit"><i class="fas fa-pen"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ===== Render Customers =====
    function renderCustomers() {
        const tb = $('#custTbody');
        if (!tb) return;
        tb.innerHTML = customers.map(c => `
            <tr>
                <td>
                    <div class="t-prod">
                        <div class="t-prod-icn" style="background:linear-gradient(135deg,#5a8d3e,#d4a574);color:white;font-size:.95rem;font-weight:800">${c.name.charAt(0)}</div>
                        <div class="t-prod-info">
                            <h4>${c.name}</h4>
                        </div>
                    </div>
                </td>
                <td>${c.email}</td>
                <td>${c.orders}</td>
                <td><strong>$${c.spent.toLocaleString()}</strong></td>
                <td>${c.joined}</td>
                <td>
                    <div class="t-actions">
                        <button class="t-act" title="View"><i class="fas fa-eye"></i></button>
                        <button class="t-act" title="Email"><i class="fas fa-envelope"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ===== Render Messages =====
    function renderMessages() {
        const grid = $('#msgGrid');
        if (!grid) return;
        grid.innerHTML = messages.map((m, i) => `
            <div class="msg-card" style="animation-delay:${i*0.08}s">
                <div class="msg-head">
                    <div class="msg-avatar">${m.name.charAt(0)}</div>
                    <div class="msg-info">
                        <h4>${m.name}</h4>
                        <span>${m.email}</span>
                    </div>
                    <span class="msg-time">${m.time}</span>
                </div>
                <p class="msg-subj">${m.subject}</p>
                <p class="msg-body">${m.body}</p>
                <div class="msg-actions">
                    <button class="btn btn-primary" style="padding:8px 14px;font-size:.78rem"><i class="fas fa-reply"></i><span>Reply</span></button>
                    <button class="btn btn-outline" style="padding:8px 14px;font-size:.78rem"><i class="fas fa-archive"></i><span>Archive</span></button>
                </div>
            </div>
        `).join('');
    }

    // ===== Render Newsletter =====
    function renderNewsletter() {
        const tb = $('#newsTbody');
        if (!tb) return;
        tb.innerHTML = subscribers.map(s => `
            <tr>
                <td>${s.email}</td>
                <td><span class="badge ${s.status === 'active' ? 'ok' : 'danger'}">${s.status === 'active' ? 'Active' : 'Unsubscribed'}</span></td>
                <td>${s.date}</td>
                <td>
                    <div class="t-actions">
                        <button class="t-act" title="View"><i class="fas fa-eye"></i></button>
                        <button class="t-act danger" title="Remove"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }


    // ===== Modal =====
    const modal = $('#modalOverlay');
    let editId = null;

    function openModal(title = 'Add Product') {
        $('#modalTitle').textContent = title;
        modal.classList.add('active');
    }
    function closeModal() {
        modal.classList.remove('active');
        $('#prodForm').reset();
        editId = null;
    }

    $('#addProductBtn')?.addEventListener('click', () => {
        editId = null;
        $('#prodForm').reset();
        $('#pEmoji').value = '🕷️';
        openModal('Add New Product');
    });
    $('#modalClose')?.addEventListener('click', closeModal);
    $('#modalCancel')?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    function editProduct(id) {
        const p = products.find(x => x.id === id);
        if (!p) return;
        editId = id;
        $('#pName').value = p.name;
        $('#pLatin').value = p.latin;
        $('#pCat').value = p.cat;
        $('#pEmoji').value = p.emoji;
        $('#pDesc').value = p.desc || '';
        $('#pPrice').value = p.price;
        $('#pStock').value = p.stock;
        openModal('Edit Product');
    }

    function deleteProduct(id) {
        if (!confirm('Delete this product?')) return;
        products = products.filter(p => p.id !== id);
        renderProducts();
        showToast('Product deleted', 'fa-trash');
    }

    $('#prodForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            name: $('#pName').value,
            latin: $('#pLatin').value,
            cat: $('#pCat').value,
            emoji: $('#pEmoji').value,
            desc: $('#pDesc').value,
            price: parseFloat($('#pPrice').value),
            stock: parseInt($('#pStock').value),
            status: parseInt($('#pStock').value) > 5 ? 'active' : parseInt($('#pStock').value) > 0 ? 'low' : 'out',
            color: 'linear-gradient(135deg,#5a8d3e,#d4a574)'
        };
        if (editId) {
            const idx = products.findIndex(p => p.id === editId);
            products[idx] = { ...products[idx], ...data };
            showToast('Product updated!', 'fa-check-circle');
        } else {
            data.id = Date.now();
            products.unshift(data);
            showToast('Product added!', 'fa-circle-check');
        }
        renderProducts();
        closeModal();
    });

    // ===== Charts =====
    if (typeof Chart !== 'undefined') {
        const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
        const txt = () => isDark() ? '#b8c8a8' : '#4a5d3a';
        const grid = () => isDark() ? 'rgba(124,179,66,.08)' : 'rgba(45,80,22,.08)';

        // Revenue Chart
        const revCtx = $('#revChart');
        if (revCtx) {
            const grad = revCtx.getContext('2d').createLinearGradient(0, 0, 0, 240);
            grad.addColorStop(0, 'rgba(90,141,62,.4)');
            grad.addColorStop(1, 'rgba(90,141,62,0)');
            new Chart(revCtx, {
                type: 'line',
                data: {
                    labels: ['Nov','Dec','Jan','Feb','Mar','Apr','May'],
                    datasets: [{
                        label: 'Revenue',
                        data: [28000, 32000, 35000, 38000, 41000, 44000, 48592],
                        borderColor: '#5a8d3e',
                        backgroundColor: grad,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#5a8d3e',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { ticks: { color: txt() }, grid: { color: grid() } },
                        x: { ticks: { color: txt() }, grid: { display: false } }
                    }
                }
            });
        }

        // Category Chart
        const catCtx = $('#catChart');
        if (catCtx) {
            new Chart(catCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Tarantulas', 'Scorpions', 'Reptiles', 'Centipedes'],
                    datasets: [{
                        data: [42, 28, 22, 8],
                        backgroundColor: ['#2d5016', '#5a8d3e', '#d4a574', '#a16207'],
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: { legend: { position: 'bottom', labels: { color: txt(), padding: 12, font: { size: 11 } } } }
                }
            });
        }

        // Sales Chart (analytics page)
        const salesCtx = $('#salesChart');
        if (salesCtx) {
            new Chart(salesCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    datasets: [{
                        label: 'Sales',
                        data: [45, 62, 58, 72, 88, 95, 102, 89, 110, 125, 138, 142],
                        backgroundColor: '#5a8d3e',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { ticks: { color: txt() }, grid: { color: grid() } },
                        x: { ticks: { color: txt() }, grid: { display: false } }
                    }
                }
            });
        }

        // Customer Chart
        const custCtx = $('#custChart');
        if (custCtx) {
            new Chart(custCtx, {
                type: 'line',
                data: {
                    labels: ['Jan','Feb','Mar','Apr','May'],
                    datasets: [{
                        data: [120, 165, 210, 280, 340],
                        borderColor: '#d4a574',
                        backgroundColor: 'rgba(212,165,116,.2)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { ticks: { color: txt() }, grid: { color: grid() } },
                        x: { ticks: { color: txt() }, grid: { display: false } }
                    }
                }
            });
        }
    }

    // ===== Init =====
    renderProducts();
    renderOrders();
    renderCustomers();
    renderMessages();
    renderNewsletter();

})();
