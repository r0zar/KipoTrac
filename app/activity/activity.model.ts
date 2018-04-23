export class Activity {
    object: string;
    status: string;
    createdAt: string;
    message: string;
    objectIcon: string;
    statusIcon: string;

    constructor(options: any) {
        this.object = options.object;
        this.status = options.status;
        this.createdAt = options.createdAt;
        this.message = `${options.object} ${options.status} ${options.createdAt}`;

        if (options.object == 'facility') {
          this.objectIcon = String.fromCharCode(0xf015)
        } else if (options.object == 'room') {
          this.objectIcon = String.fromCharCode(0xf248)
        }

        if (options.status == 'created') {
          this.statusIcon = String.fromCharCode(0xf067)
        }
    }
}
