interface User {
    id: number;
    full_name: string;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    listings_count: number;
    purchases_count: number;
}

export interface Listing {
    id: number;
    title: string;
    price: number;
    image_url: string;
    status: string;
    category: string;
}

export interface Purchase {
    title: string;
    image_url: string;
    category: string;
    seller_name: string;
    amount: number;
    created_at: string;
}

export default class UserServices {

    urlbase: string;

    constructor() {

        this.urlbase = 'http://localhost:3001/api/users';
    }

    async create(array: { fullname: string; email: string; password: string; password_verify: string }) {

        try {

            const response = await fetch(this.urlbase + '/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(array)
            })

            const data = await response.json();

            if (!response.ok) throw new Error(data.message)

            return data;
        }
        catch (err: any) {
            console.error('Erreur', err.message);
            return { success: false, message: err.message, type: 'error' };
        }
    }

    async auth(array: { email: string; password: string }) {

        try {

            const response = await fetch(this.urlbase + '/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(array)
            })

            const data = await response.json();

            if (!response.ok) throw new Error(data.message)

            return data;
        }
        catch (err: any) {
            console.error(err.message);
            return { success: false, message: err.message, type: 'error' };
        }
    }

    async getInfos(id: number | null): Promise<User> {
        try {
            const response = await fetch(this.urlbase + `/get/${id}`);
            const data: User = await response.json();
            if (!response.ok) throw new Error((data as any).message);
            return data;
        } catch (err: any) {
            console.error(err.message);
            return err;
        }
    }

    async getListingsUser(id: number | null): Promise<Listing[]> {
        try {
            const response = await fetch(this.urlbase + `/getListing/${id}`);
            const data: Listing[] = await response.json();
            if (!response.ok) throw new Error((data as any).message);
            return data;
        } catch (err: any) {
            console.error(err.message);
            return [];
        }
    }

    async getPurchaseUser(id: number | null): Promise<Purchase[]> {
        try {
            const response = await fetch(this.urlbase + `/getPurchase/${id}`);
            const data: Purchase[] = await response.json();
            if (!response.ok) throw new Error((data as any).message);
            return data;
        } catch (err: any) {
            console.error(err.message);
            return [];
        }
    }

    async update(array: { fullname: string; email: string; bio: string; avatar_url?: File; id: number }) {
        try {
            const formData = new FormData();
            formData.append('fullname', array.fullname);
            formData.append('bio', array.bio);
            formData.append('email', array.email);
            formData.append('id', String(array.id));
            if (array.avatar_url) formData.append('avatar_url', array.avatar_url);

            const response = await fetch(this.urlbase + '/updateUser', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        }
        catch (err: any) {
            console.error('Erreur', err.message);
            return { success: false, message: err.message, type: 'error' };
        }
    }
}