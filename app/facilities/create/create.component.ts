import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { EventData } from "data/observable";
import { DataFormEventData } from "nativescript-pro-ui/dataform";
import firebase = require("nativescript-plugin-firebase");
import { MetrcService } from "../../shared/metrc.service";
import { alert } from "ui/dialogs";
import { AuthService } from "../../shared/auth.service";

import _ = require('lodash');

export class Facility {
  apiKey: string;
  constructor(options: any) {
    this.apiKey = options.apiKey || '';
  }
}

@Component({
    moduleId: module.id,
    selector: "Create",
    templateUrl: "./create.component.html"
})
export class CreateComponent implements OnInit {
    private _facility: Facility;
    private _isLoading: boolean = false;

    constructor(
        private _metrcService: MetrcService,
        private _routerExtensions: RouterExtensions
    ) { }

    /* ***********************************************************
    * Use the "ngOnInit" handler to get the data noun id parameter passed through navigation.
    * Get the data noun details from the data service using this id and assign it to the
    * private property that holds it inside the component.
    *************************************************************/
    ngOnInit(): void {
        this._facility = new Facility({apiKey: "FusVbe4Yv6W1DGNuxKNhByXU6RO6jSUPcbRCoRDD98VNXc4D"})
    }

    get facility(): Facility {
        return this._facility;
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
        AuthService.apiKey = this._facility.apiKey
        firebase.setValue("/users/" + AuthService.token + '/key', this._facility.apiKey)
        .then(() => {
          // save the event to the activity log
          firebase.push("/users/" + AuthService.token + '/activity', {object: 'API key', status: 'added', createdAt: Date.now()});

          this._isLoading = false
          this._routerExtensions.navigate(['/facilities'], {animated: true, transition: {name: "slideBottom", duration: 200, curve: "ease"}})
        })
    }

    /* ***********************************************************
    * The back button is essential for a master-detail feature.
    *************************************************************/
    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

}
