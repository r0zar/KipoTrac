export class Notification {
    title: string;
    body: string;

    constructor(options: any) {
        this.title = options.title;
        this.body = options.body;
    }
}
