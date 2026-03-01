export default class UserServices {

    urlbase: string;

    constructor() {

        this.urlbase = 'http://localhost:3000/api/users';
    }

    async create(): Promise<any[] | null> {

        try {

            const response = await fetch(this.urlbase + '/create/')
            const data = await response.json();
            if (!response.ok) throw new Error(data.message)
            return data;
        }
        catch(err: any){

            console.error('Erreur getAll', err.message);
            return null
        }
    }

}