"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = document.getElementById('app');
const routes = {
    '/home': 'home',
    '/sell': 'sell',
    '/login': 'login',
    '/register': 'register',
    '/profil': 'profil'
};
function render(path) {
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