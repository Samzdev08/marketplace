export default class ProductServices {
    urlbase;
    constructor() {
        this.urlbase = 'http://localhost:3001/api/products';
    }
    async search(filters) {
        try {
            const params = new URLSearchParams();
            if (filters.title)
                params.append('title', filters.title);
            if (filters.category)
                params.append('category', filters.category);
            if (filters.sort)
                params.append('sort', filters.sort);
            const url = `${this.urlbase}/search?${params}`;
            console.log(url);
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok)
                return { success: false, data: [], error: data.message };
            return { success: true, data };
        }
        catch (err) {
            return { success: false, data: [], error: err };
        }
    }
}
//# sourceMappingURL=Product.js.map