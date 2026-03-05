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
}
//# sourceMappingURL=User.js.map