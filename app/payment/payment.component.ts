import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import firebase = require("nativescript-plugin-firebase");
import { alert } from "ui/dialogs";

@Component({
    selector: "Payment",
    moduleId: module.id,
    templateUrl: "./payment.component.html"
})
export class PaymentComponent implements OnInit {

    public activeSubscription: boolean = false;

    constructor(
        private _routerExtensions: RouterExtensions
    ) { }


    ngOnInit(): void {

      firebase.getCurrentUser()
        .then(user => firebase.getValue("/users/" + user.uid + '/subscription'))
        .then(subscription => this.activeSubscription = subscription.value.transactionState == 'purchased')
        .catch(() => this.activeSubscription = false)

    }

    betaTester(): void {
      alert({title: 'Early Access', message: 'Enjoy our 100% guarantee that we\'ll never raise your rates for METRC compliance services in KipoTrac.', okButtonText: "Dope"})
    }

    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }
}
