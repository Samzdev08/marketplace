import ProductServices from '../shared/Product.js';
const app = document.getElementById('app');
const routes = {
    '/home': 'home',
    '/sell': 'sell',
    '/login': 'login',
    '/register': 'register',
    '/profil': 'profil'
};
async function render(path) {
    const templateId = routes[path] || 'home';
    const tpl = document.getElementById(templateId);
    if (!tpl)
        return;
    app.innerHTML = '';
    const clone = tpl.content.cloneNode(true);
    app.appendChild(clone);
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
//# sourceMappingURL=index.js.map