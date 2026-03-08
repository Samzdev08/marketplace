export default class UserServices {
    urlbase;
    constructor() {
        this.urlbase = 'http://localhost:3001/api/users';
    }
    async create(array) {
        try {
            const response = await fetch(this.urlbase + '/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(array)
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message);
            return data;
        }
        catch (err) {
            console.error('Erreur', err.message);
            return { success: false, message: err.message, type: 'error' };
        }
    }
    async auth(array) {
        try {
            const response = await fetch(this.urlbase + '/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(array)
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message);
            return data;
        }
        catch (err) {
            console.error(err.message);
            return { success: false, message: err.message, type: 'error' };
        }
    }
    async getInfos(id) {
        try {
            const response = await fetch(this.urlbase + `/get/${id}`);
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message);
            return data;
        }
        catch (err) {
            console.error(err.message);
            return err;
        }
    }
    async getListingsUser(id) {
        try {
            const response = await fetch(this.urlbase + `/getListing/${id}`);
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message);
            return data;
        }
        catch (err) {
            console.error(err.message);
            return [];
        }
    }
    async getPurchaseUser(id) {
        try {
            const response = await fetch(this.urlbase + `/getPurchase/${id}`);
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message);
            return data;
        }
        catch (err) {
            console.error(err.message);
            return [];
        }
    }
    async update(array) {
        try {
            const formData = new FormData();
            formData.append('fullname', array.fullname);
            formData.append('bio', array.bio);
            formData.append('email', array.email);
            formData.append('id', String(array.id));
            if (array.avatar_url)
                formData.append('avatar_url', array.avatar_url);
            const response = await fetch(this.urlbase + '/updateUser', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message);
            return data;
        }
        catch (err) {
            console.error('Erreur', err.message);
            return { success: false, message: err.message, type: 'error' };
        }
    }
}
//# sourceMappingURL=User.js.map