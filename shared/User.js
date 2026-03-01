export default class UserServices {
    urlbase;
    constructor() {
        this.urlbase = 'http://localhost:3000/api/users';
    }
    async create() {
        try {
            const response = await fetch(this.urlbase + '/create/');
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message);
            return data;
        }
        catch (err) {
            console.error('Erreur getAll', err.message);
            return null;
        }
    }
}
//# sourceMappingURL=User.js.map