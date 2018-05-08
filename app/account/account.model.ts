export class Account {
    name: string;
    email: string;
    apiKey: string;

    constructor(options: any) {
        this.name = options.name;
        this.email = options.email;
        this.apiKey = options.apiKey || '';
    }
}
