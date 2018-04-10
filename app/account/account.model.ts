export class Account {
    name: string;
    email: string;

    constructor(options: any) {
        this.name = options.name;
        this.email = options.email;
    }
}
