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
}
//# sourceMappingURL=User.d.ts.map