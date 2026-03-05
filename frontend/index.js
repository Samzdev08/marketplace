import ProductServices from '../shared/Product.js';
import UserServices from '../shared/User.js';
const app = document.getElementById('app');
const routes = {
    '/home': 'home',
    '/sell': 'sell',
    '/login': 'login',
    '/register': 'register',
    '/profil': 'profil'
};
function updateNav() {
    const loginLink = document.querySelector('a[href="/login"]')?.parentElement;
    const registerLink = document.querySelector('a[href="/register"]')?.parentElement;
    const nav = document.querySelector('nav');
    const idUser = localStorage.getItem('id');
    document.querySelector('a[href="/profil"]')?.parentElement?.remove();
    if (idUser) {
        if (loginLink)
            loginLink.style.display = 'none';
        if (registerLink)
            registerLink.style.display = 'none';
        const profilLink = document.createElement('li');
        profilLink.innerHTML = `<a href="/profil" data-link="/profil">Mon profil</a>`;
        nav?.appendChild(profilLink);
    }
    else {
        if (loginLink)
            loginLink.style.display = 'block';
        if (registerLink)
            registerLink.style.display = 'block';
    }
}
async function render(path) {
    const message = document.querySelector('.message-app');
    const templateId = routes[path] || 'home';
    const tpl = document.getElementById(templateId);
    if (!tpl)
        return;
    app.innerHTML = '';
    const clone = tpl.content.cloneNode(true);
    app.appendChild(clone);
    updateNav();
    const list = document.querySelectorAll('nav a');
    let hasActive = false;
    list.forEach(a => {
        const isActive = a.getAttribute('href') === path;
        a.classList.toggle('active-nav', isActive);
        if (isActive)
            hasActive = true;
    });
    if (!hasActive && list[0])
        list[0].classList.add('active-nav');
    app.querySelectorAll('.filter-tags li').forEach(tag => {
        tag.addEventListener('click', () => {
            app.querySelectorAll('.filter-tags li').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });
    if (templateId === 'home') {
        const productService = new ProductServices();
        const products = await productService.getAll();
        const cardDisplay = app.querySelector('.card-display');
        products?.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'card-product';
            div.dataset.id = item.id;
            div.innerHTML = `
                <img src="${item.image_url}" alt="logo">
                <span class="categorie">${item.category}</span>
                <div class="infos-text">
                    <p class="title">${item.title}</p>
                    <p class="desc">${item.description}</p>
                </div>
                <div class="numb-text">
                    <p class="price">${item.price} CHF</p>
                    <p class="seller">Par ${item.seller_name}</p>
                </div>
            `;
            cardDisplay?.appendChild(div);
        });
    }
    if (templateId === 'profil') {
        const btnEdit = app.querySelector('.btn-edit');
        const editPanel = app.querySelector('#editPanel');
        btnEdit?.addEventListener('click', () => {
            if (!editPanel)
                return;
            const isOpen = editPanel.style.display === 'block';
            editPanel.style.display = isOpen ? 'none' : 'block';
        });
        const listingsTab = app.querySelector('#listingsTab');
        const purchasesTab = app.querySelector('#purchasesTab');
        app.querySelectorAll('.tab').forEach(btn => {
            btn.addEventListener('click', () => {
                app.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                const isListings = btn.textContent?.includes('annonces');
                if (listingsTab)
                    listingsTab.style.display = isListings ? 'block' : 'none';
                if (purchasesTab)
                    purchasesTab.style.display = isListings ? 'none' : 'block';
            });
        });
    }
    if (templateId === 'sell') {
        const idUser = localStorage.getItem('id');
        if (!idUser) {
            history.pushState({}, '', '/login');
            render('/login');
            return;
        }
    }
    if (templateId === 'register') {
        const form = document.getElementById('register-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = document.getElementById('register-fullname').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const data = {
                fullname: fullname,
                email: email,
                password: password,
                password_verify: confirmPassword
            };
            const userService = new UserServices();
            const result = await userService.create(data);
            console.log(result);
            if (result.type === 'error') {
                showNotif(result.type, result.message);
            }
            else {
                showNotif(result.type, result.message);
                setTimeout(() => {
                    history.pushState({}, '', '/login');
                    render('/login');
                    return;
                }, 1500);
            }
        });
    }
    if (templateId === 'login') {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const data = {
                email: email,
                password: password,
            };
            const userService = new UserServices();
            const result = await userService.auth(data);
            console.log(result);
            if (result.type === 'error') {
                showNotif(result.type, result.message);
            }
            else {
                showNotif(result.type, result.message);
                const idUser = result.id;
                localStorage.setItem('id', idUser);
                setTimeout(() => {
                    history.pushState({}, '', '/');
                    render('/');
                    return;
                }, 1500);
            }
        });
    }
}
document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-link]');
    if (!el)
        return;
    e.preventDefault();
    const path = el.getAttribute('data-link') || el.getAttribute('href') || '/home';
    history.pushState({}, '', path);
    render(path);
});
window.addEventListener('popstate', () => render(location.pathname));
render(location.pathname === '/' ? '/home' : location.pathname);
function showNotif(type, text) {
    const message = document.querySelector('.message-app');
    message.classList.remove('active-error', 'active-success', 'fade-out');
    message.textContent = text;
    message.classList.add(type === 'error' ? 'active-error' : 'active-success');
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => {
            message.classList.remove('active-error', 'active-success', 'fade-out');
        }, 500);
    }, 3000);
}
//# sourceMappingURL=index.js.map