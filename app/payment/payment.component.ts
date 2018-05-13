import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import firebase = require("nativescript-plugin-firebase");
import { alert } from "ui/dialogs";
import { Data } from "../shared/data.service";

@Component({
    selector: "Payment",
    moduleId: module.id,
    templateUrl: "./payment.component.html"
})
export class PaymentComponent implements OnInit {

    public activeSubscription: boolean = false;

    constructor(
        private _routerExtensions: RouterExtensions,
        private data: Data
    ) { }

    ngOnInit(): void {
      // I couldnt think of a better way to update this after the user buy a subscription
      this.data.isSubscribed.subscribe(subscription => this.activeSubscription = subscription)
    }

    betaTester(): void {
      alert({title: 'Early Access', message: 'Enjoy our 100% guarantee that we\'ll never raise your prices for METRC compliance services in KipoTrac.', okButtonText: "Dope"})
    }

    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }
}
