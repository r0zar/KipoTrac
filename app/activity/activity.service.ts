import { Injectable, NgZone } from "@angular/core";
import { Http } from "@angular/http";
import firebase = require("nativescript-plugin-firebase");
import { Observable } from "rxjs/Observable";
import { Activity } from "./activity.model";
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
export class ActivityService {

    private _activities: Array<Activity> = [];

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
            firebase.addValueEventListener(onValueEvent, "/users/" + user.uid + "/activity")
          })
        }).catch(this.handleErrors);
    }

    private handleSnapshot(data: any): Array<Activity> {
        this._activities = [];
        if (data) {
            for (const id in data) {
                if (data[id] && data.hasOwnProperty(id)) {
                    this._activities.push(new Activity(data[id]));
                }
            }
        }
        return this._activities;
    }

    private handleErrors(error: Response): Observable<any> {
        return Observable.throw(error);
    }
}
