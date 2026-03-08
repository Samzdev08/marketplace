import ProductServices from '../shared/Product.js';
import UserServices from '../shared/User.js';
import type { Listing, Purchase } from '../shared/User.js';

const app = document.getElementById('app') as HTMLElement;

const routes: Record<string, string> = {
    '/home': 'home',
    '/sell': 'sell',
    '/login': 'login',
    '/register': 'register',
    '/profil': 'profil',
};

function navigate(path: string): void {
    history.pushState({}, '', path);
    render(path);
}

function getCleanPath(): string {
    const path = location.pathname || '/home';
    return path === '/' ? '/home' : path;
}

function updateNav(): void {
    const loginLink = document.querySelector<HTMLElement>('a[href="/login"]')?.parentElement;
    const registerLink = document.querySelector<HTMLElement>('a[href="/register"]')?.parentElement;
    const nav = document.querySelector('nav');
    const idUser = localStorage.getItem('id');

    document.querySelector('a[href="/profil"]')?.parentElement?.remove();
    document.querySelector('a[href="/logout"]')?.parentElement?.remove();

    if (idUser) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';

        const profilLink = document.createElement('li');
        const logoutLink = document.createElement('li');
        profilLink.innerHTML = `<a href="/profil" data-link="/profil">Mon profil</a>`;
        logoutLink.innerHTML = `<a href="/logout" data-link="/logout">Déconnexion</a>`;
        nav?.appendChild(profilLink);
        nav?.appendChild(logoutLink);
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
    }
}

async function render(path: string): Promise<void> {

    if (path === '/logout') {
        showNotif('success', 'Déconnexion en cours...', 2800)
        localStorage.removeItem('id');
        setTimeout(() => {
            navigate('/')
        }, 2500)
        return;
    }

    const templateId = routes[path] || 'home';
    const productService = new ProductServices();
    const userService = new UserServices();
    const tpl = document.getElementById(templateId) as HTMLTemplateElement | null;
    if (!tpl) return;

    app.innerHTML = '';
    app.appendChild(tpl.content.cloneNode(true));
    updateNav();

    const list = document.querySelectorAll<HTMLAnchorElement>('nav a');


    let hasActive = false;
    list.forEach(a => {
        const isActive = a.getAttribute('href') === path;
        a.classList.toggle('active-nav', isActive);
        if (isActive) hasActive = true;
    });
    if (!hasActive && list[0]) list[0].classList.add('active-nav');

    if (templateId === 'home') {
        const cardDisplay = app.querySelector('.card-display');

        let currentTitle = '';
        let currentCategory = 'Tous';
        let currentSort = 'recent';
        let numbProduct = app.querySelector<HTMLSpanElement>('.numb');

        async function loadProducts(): Promise<void> {


            const result = await productService.search({
                title: currentTitle,
                category: currentCategory,
                sort: currentSort,
            });

            cardDisplay!.innerHTML = '';

            if (numbProduct) numbProduct.textContent = String(result.data.length);

            if (!result?.data?.length) {
                cardDisplay!.innerHTML = emptyMessage("Aucun article trouvé.");
                return;
            }

            console.log(result.data.length)

            numbProduct!.textContent = result.data.length >= 1 ? result.data.length : '0';

            result.data.forEach((item: any) => {
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

        const searchInput = app.querySelector<HTMLInputElement>('#home-search');
        const sortSelect = app.querySelector<HTMLSelectElement>('#home-sort');

        searchInput?.addEventListener('input', (e) => {
            currentTitle = (e.target as HTMLInputElement).value;
            loadProducts();
        });

        sortSelect?.addEventListener('change', (e) => {
            currentSort = (e.target as HTMLSelectElement).value;
            loadProducts();
        });

        app.querySelectorAll<HTMLLIElement>('.filter-tags li').forEach(tag => {
            tag.addEventListener('click', () => {
                app.querySelectorAll<HTMLLIElement>('.filter-tags li').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                currentCategory = tag.textContent ?? 'Tous';
                loadProducts();
            });
        });

        loadProducts();
    }

    if (templateId === 'profil') {
        const idUser = localStorage.getItem('id');
        if (!idUser) {
            navigate('/login');
            return;
        }

        const num = Number(idUser);
        const user = await userService.getInfos(num);
        const userListings = await userService.getListingsUser(num);
        const userPurchase = await userService.getPurchaseUser(num);

        const listings = Array.isArray(userListings) ? userListings : [];
        const purchases = Array.isArray(userPurchase) ? userPurchase : [];

        const avatarImg = app.querySelector<HTMLImageElement>('.avatar img');
        const profileName = app.querySelector<HTMLElement>('.profile-name');
        const profileEmail = app.querySelector<HTMLElement>('.profile-email');
        const profileBio = app.querySelector<HTMLElement>('.profile-bio');
        const stats = app.querySelectorAll<HTMLElement>('.stat strong');
        const editName = app.querySelector<HTMLInputElement>('#profile-name');
        const editBio = app.querySelector<HTMLTextAreaElement>('#profile-bio');
        const editEmail = app.querySelector<HTMLInputElement>('#profile-email');
        const listingsTab = app.querySelector<HTMLElement>('#listingsTab');
        const purchasesTab = app.querySelector<HTMLElement>('#purchasesTab');
        const tabCounts = app.querySelectorAll<HTMLElement>('.tab-count');
        const btnEdit = app.querySelector<HTMLButtonElement>('.btn-edit');
        const editPanel = app.querySelector<HTMLElement>('#editPanel');
        const button = app.querySelector<HTMLButtonElement>('.btn-gold');

        if (avatarImg) avatarImg.src = user.avatar_url
            ? `http://localhost:3001${user.avatar_url}`
            : `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.id}`;

        if (profileName) profileName.textContent = user.full_name;
        if (profileEmail) profileEmail.textContent = user.email;
        if (profileBio) profileBio.textContent = user.bio ?? `Pas de biographie pour l'instant`;
        if (stats[0]) stats[0].textContent = String(user.listings_count);
        if (stats[1]) stats[1].textContent = String(user.purchases_count);

        if (editName) editName.value = user.full_name;
        if (editBio) editBio.value = user.bio ?? `Pas de biographie pour l'instant`;
        if (editEmail) editEmail.value = user.email;

        if (listingsTab) {
            listingsTab.innerHTML = listings.length === 0
                ? emptyMessage("Vous n'avez pas encore d'annonces.")
                : listings.map((l: Listing) => `
                    <div class="listing-row">
                        <img class="listing-thumb" src="${l.image_url}" alt="" />
                        <div class="listing-info">
                            <p class="listing-title">${l.title}</p>
                            <p class="listing-cat">${l.category}</p>
                        </div>
                        <div style="text-align:right">
                            <p class="listing-price">CHF ${Number(l.price).toFixed(2)}</p>
                        </div>
                    </div>
                `).join('');
        }

        if (purchasesTab) {
            purchasesTab.innerHTML = purchases.length === 0
                ? emptyMessage("Vous n'avez pas encore effectué d'achats.")
                : purchases.map((p: Purchase) => `
                    <div class="listing-row">
                        <img class="listing-thumb" src="${p.image_url}" alt="" />
                        <div class="listing-info">
                            <p class="listing-title">${p.title}</p>
                            <p class="listing-cat">Vendu par ${p.seller_name}</p>
                        </div>
                        <div style="text-align:right">
                            <p class="listing-price">CHF ${Number(p.amount).toFixed(2)}</p>
                            <p class="listing-date">${new Date(p.created_at).toLocaleDateString('fr-CH')}</p>
                        </div>
                    </div>
                `).join('');
        }

        if (tabCounts[0]) tabCounts[0].textContent = `(${listings.length})`;
        if (tabCounts[1]) tabCounts[1].textContent = `(${purchases.length})`;

        btnEdit?.addEventListener('click', () => {
            if (!editPanel) return;
            editPanel.style.display = editPanel.style.display === 'block' ? 'none' : 'block';
        });

        app.querySelectorAll<HTMLButtonElement>('.tab').forEach(btn => {
            btn.addEventListener('click', () => {
                app.querySelectorAll<HTMLButtonElement>('.tab').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                const isListings = btn.textContent?.includes('annonces');
                if (listingsTab) listingsTab.style.display = isListings ? 'block' : 'none';
                if (purchasesTab) purchasesTab.style.display = isListings ? 'none' : 'block';
            });
        });

        button?.addEventListener('click', async () => {
            const nameInput = app.querySelector<HTMLInputElement>('#profile-name');
            const bioInput = app.querySelector<HTMLTextAreaElement>('#profile-bio');
            const emailInput = app.querySelector<HTMLInputElement>('#profile-email');
            const avatarInput = app.querySelector<HTMLInputElement>('#profile-avatar-url');

            const data: { fullname: string; bio: string; email: string; id: number; avatar_url?: File } = {
                fullname: nameInput?.value ?? '',
                bio: bioInput?.value ?? '',
                email: emailInput?.value ?? '',
                id: parseInt(localStorage.getItem('id') ?? '0'),
            };

            const avatar = avatarInput?.files?.[0];
            if (avatar) data.avatar_url = avatar;

            const result = await userService.update(data);
            if (!result.success) {
                showNotif('error', result.message);
            } else {
                showNotif('success', "Informations modifiées avec succès");
                navigate('/profil');
            }
        });
    }

    if (templateId === 'sell') {
        const idUser = localStorage.getItem('id');
        if (!idUser) {
            navigate('/login');
            return;
        }
    }

    if (templateId === 'register') {
        const form = document.getElementById('register-form') as HTMLFormElement;

        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();

            const data = {
                fullname: (document.getElementById('register-fullname') as HTMLInputElement).value,
                email: (document.getElementById('register-email') as HTMLInputElement).value,
                password: (document.getElementById('register-password') as HTMLInputElement).value,
                password_verify: (document.getElementById('register-confirm-password') as HTMLInputElement).value,
            };

            const result = await userService.create(data);
            showNotif(result.type, result.message);

            if (result.type !== 'error') {
                setTimeout(() => navigate('/login'), 1500);
            }
        });
    }

    if (templateId === 'login') {
        const form = document.getElementById('login-form') as HTMLFormElement;

        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();

            const data = {
                email: (document.getElementById('login-email') as HTMLInputElement).value,
                password: (document.getElementById('login-password') as HTMLInputElement).value,
            };

            const result = await userService.auth(data);
            showNotif(result.type, result.message);

            if (result.type !== 'error') {
                localStorage.setItem('id', result.id);
                setTimeout(() => navigate('/home'), 1500);
            }
        });
    }
}

document.addEventListener('click', (e: MouseEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-link]');
    if (!el) return;
    e.preventDefault();
    const path = el.getAttribute('data-link') || el.getAttribute('href') || '/home';
    navigate(path);
});

window.addEventListener('popstate', () => render(getCleanPath()));
render(getCleanPath());

function showNotif(type: 'error' | 'success', text: string, duration: number = 500) {
    const message = document.querySelector('.message-app') as HTMLElement;
    message.classList.remove('active-error', 'active-success', 'fade-out');
    message.textContent = text;
    message.classList.add(type === 'error' ? 'active-error' : 'active-success');
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => {
            message.classList.remove('active-error', 'active-success', 'fade-out');
        }, duration);
    }, 3000);
}

const emptyMessage = (text: string) => `
    <div class="empty-message">
        <p>${text}</p>
    </div>
`;