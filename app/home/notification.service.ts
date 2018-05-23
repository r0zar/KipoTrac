import { Injectable, NgZone } from "@angular/core";
import { Http } from "@angular/http";
import firebase = require("nativescript-plugin-firebase");
import { Observable } from "rxjs/Observable";
import { Notification } from "./notification.model";
import _ = require('lodash');


/* ***********************************************************
* This is the master detail data service. It handles all the data operations
* of retrieving and updating the data. In this case, it is connected to Firebase and
* is using the {N} Firebase plugin. Learn more about it here:
* https://github.com/EddyVerbruggen/nativescript-plugin-firebase
* The {N} Firebase plugin needs some initialization steps before the app starts.
* Check out how it is imported in the main.ts file and the actual script in /shared/firebase.common.ts file.
*************************************************************/
@Injectable()
export class NotificationService {

    private _notifications: Array<Notification> = [];

    constructor(private _ngZone: NgZone) { }

    load(): Observable<any> {
        return new Observable((observer: any) => {
          const onValueEvent = (snapshot: any) => {
            this._ngZone.run(() => {
              const results = this.handleSnapshot(snapshot.value);
              observer.next(results);
            });
          };
          firebase.getCurrentUser().then(user => {
            firebase.addValueEventListener(onValueEvent, "/users/" + user.uid + "/notifications")
          })
        }).catch(this.handleErrors);
    }

    private handleSnapshot(data: any): Array<Notification> {
        this._notifications = [];
        if (data) {
            for (const id in data) {
                if (data[id] && data.hasOwnProperty(id)) {
                    this._notifications.push(new Notification(data[id]));
                }
            }
        }
        return this._notifications;
    }

    private handleErrors(error: Response): Observable<any> {
        return Observable.throw(error);
    }
}
