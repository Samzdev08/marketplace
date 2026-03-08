export default class ProductServices {
    urlbase: string;
    constructor();
    search(filters: {
        title?: string;
        category?: string;
        sort?: string;
    }): Promise<{
        success: boolean;
        data: never[];
        error: any;
    } | {
        success: boolean;
        data: any;
        error?: never;
    }>;
}
//# sourceMappingURL=Product.d.ts.map