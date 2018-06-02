import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import firebase = require("nativescript-plugin-firebase");
import { alert } from "ui/dialogs";
import { AuthService } from "../shared/auth.service";
import { Data } from "../shared/data.service";
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { Image } from 'tns-core-modules/ui/image';
import { screen } from 'platform';
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from "ui/page";

@Component({
    selector: "Account",
    moduleId: module.id,
    templateUrl: "./account.component.html"
})
export class AccountComponent implements OnInit {
    private name: any;
    private email: any;
    private apiKey: any;
    private _isLoading: boolean = false;

    constructor(
      private data: Data,
      private _routerExtensions: RouterExtensions
    ) { }


    ngOnInit(): void {

      this.apiKey = this.data.loadAPIKey()
      //HACK the sandbox metrc api key in the form
      this.apiKey = 'FusVbe4Yv6W1DGNuxKNhByXU6RO6jSUPcbRCoRDD98VNXc4D'

      firebase.getCurrentUser()
        .then(user => {
          this.name = user.name
          this.email = user.email
        })

    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    onDoneButtonTap(): void {
        this._isLoading = true
        this.data.setApiKey(this.apiKey)
        firebase.push("/users/" + AuthService.token + '/activity', {object: 'account', status: 'edited', createdAt: Date.now()})
          .then(() => {
            this._isLoading = false
            this._routerExtensions.backToPreviousPage();
          })
    }


    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }
}
