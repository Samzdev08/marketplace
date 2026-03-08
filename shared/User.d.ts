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
    constructor();
    create(array: {
        fullname: string;
        email: string;
        password: string;
        password_verify: string;
    }): Promise<any>;
    auth(array: {
        email: string;
        password: string;
    }): Promise<any>;
    getInfos(id: number | null): Promise<User>;
    getListingsUser(id: number | null): Promise<Listing[]>;
    getPurchaseUser(id: number | null): Promise<Purchase[]>;
    update(array: {
        fullname: string;
        email: string;
        bio: string;
        avatar_url?: File;
        id: number;
    }): Promise<any>;
}
export {};
//# sourceMappingURL=User.d.ts.map