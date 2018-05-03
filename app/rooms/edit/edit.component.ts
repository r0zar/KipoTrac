import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { alert } from "ui/dialogs";
import { EventData } from "data/observable";
import { DataFormEventData } from "nativescript-ui-dataform";
import firebase = require("nativescript-plugin-firebase");

import { Room } from "../shared/room.model";
import { MetrcService } from "../../shared/metrc.service";
import { AuthService } from "../../shared/auth.service";

import _ = require('lodash');

/* ***********************************************************
* This is the noun verb component.
* This component gets the selected data noun, provides options to verb the noun and saves the changes.
*************************************************************/
@Component({
    moduleId: module.id,
    selector: "Edit",
    templateUrl: "./edit.component.html"
})
export class EditComponent implements OnInit {
    private _room: Room;
    private _isLoading: boolean = false;

    constructor(
        private _metrcService: MetrcService,
        private _pageRoute: PageRoute,
        private _routerExtensions: RouterExtensions
    ) { }

    /* ***********************************************************
    * Use the "ngOnInit" handler to get the data noun id parameter passed through navigation.
    * Get the data noun details from the data service using this id and assign it to the
    * private property that holds it inside the component.
    *************************************************************/
    ngOnInit(): void {

        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => {
              this._metrcService.getRoom(params.id)
                .subscribe((room: Room) => this._room = new Room(room));
            });

    }

    get room(): Room {
        return this._room;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    /* ***********************************************************
    * The verb done button uses the data service to save the updated values of the data noun details.
    * Check out the data service as nounes/shared/noun.service.ts
    *************************************************************/
    onDoneButtonTap(): void {
        this._isLoading = true
        this._metrcService.updateRooms(this._room)
            .finally(() => this._isLoading = false)
            .subscribe(() => {
              // save the event to the activity log
              firebase.push("/users/" + AuthService.token + '/activity', {object: 'room', status: 'edited', createdAt: Date.now()});
              this._routerExtensions.backToPreviousPage()
            });
    }

    /* ***********************************************************
    * The back button is essential for a master-detail feature.
    *************************************************************/
    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

}
