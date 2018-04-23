import _ = require('lodash');
import { Component, OnInit, ViewChild, Input, NgZone } from "@angular/core";
import { ObservableArray } from "data/observable-array";
import { Observable } from "rxjs/Observable";
import { RouterExtensions } from "nativescript-angular/router";
import { ListViewEventData } from "nativescript-pro-ui/listview";
import firebase = require("nativescript-plugin-firebase");

import { Activity } from "./activity.model";
import { ActivityService } from "./activity.service";


@Component({
    selector: "Activities",
    moduleId: module.id,
    templateUrl: "./activity-log.component.html"
})
export class ActivityLogComponent implements OnInit {
    private _isLoading: boolean = false;
    private _activities: ObservableArray<Activity> = new ObservableArray<Activity>([]);
    private _activity: Activity;

    constructor (
        private _routerExtensions: RouterExtensions,
        private _ngZone: NgZone,
        private Activities: ActivityService
    ){}


    /* ***********************************************************
    * Use the sideDrawerTransition property to change the open/close animation of the drawer.
    *************************************************************/
    ngOnInit(): void {

        /* ***********************************************************
        * The data is retrieved remotely from FireBase.
        * The actual data retrieval code is wrapped in a data service.
        * Check out the service in activity/activity.service.ts
        *************************************************************/
        this.Activities.load()
          .subscribe((activities: Array<Activity>) => {
            this._activities = new ObservableArray(activities);
          });
        // this._activities = new ObservableArray([new Activity({object: 'facility', status: 'created', createdAt: new Date()})])

    }

    get activities(): ObservableArray<Activity> {
      return this._activities;
    }

    onActivityItemTap(args: ListViewEventData): void {
        const tappedActivityItem = args.view.bindingContext;

        this._routerExtensions.navigate(["/facilities/facility-detail", 123],
        {
            animated: true,
            transition: {
                name: "slide",
                duration: 200,
                curve: "ease"
            }
        });
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

}