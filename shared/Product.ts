export default class ProductServices {

    urlbase: string;

    constructor() {

        this.urlbase = 'http://localhost:3000/api/products';
    }

    async getAll(): Promise<any[] | null> {

        try {

            const response = await fetch(this.urlbase + '/all')
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