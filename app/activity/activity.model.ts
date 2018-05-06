import moment = require('moment');

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
        this.message = `${options.object} ${options.status} ${moment(options.createdAt).calendar()}`;

        if (options.object == 'facility') {
          this.objectIcon = String.fromCharCode(0xf275)
        } else if (options.object == 'account') {
          this.objectIcon = String.fromCharCode(0xf4fe)
        } else if (options.object == 'room') {
          this.objectIcon = String.fromCharCode(0xf0c8)
        } else if (options.object == 'item') {
          this.objectIcon = String.fromCharCode(0xf02c)
        } else if (options.object == 'batch') {
          this.objectIcon = String.fromCharCode(0xf4d8)
        } else if (options.object == 'package') {
          this.objectIcon = String.fromCharCode(0xf466)
        }

        if (options.status == 'created') {
          this.statusIcon = String.fromCharCode(0xf067)
        } else if (options.status == 'updated' || options.status == 'edited') {
          this.statusIcon = String.fromCharCode(0xf303)
        } else if (options.status == 'deleted' || options.status == 'destroyed') {
          this.statusIcon = String.fromCharCode(0xf1f8)
        } else if (options.status == 'vegetating') {
          this.statusIcon = String.fromCharCode(0xf3bf)
        }
    }
}
