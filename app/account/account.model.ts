export class Account {
    name: string;
    email: string;
    apiKey: string;

    constructor(options: any) {
        this.name = options.name;
        this.email = options.email;
        this.apiKey = options.apiKey || "FusVbe4Yv6W1DGNuxKNhByXU6RO6jSUPcbRCoRDD98VNXc4D";
    }
}
