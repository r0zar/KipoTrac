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
      alert({title: 'Early Access', message: 'We can\'t express how much it means to us that you are using our product, KipoTrac. We work hard to make sure it\'s the best track and trace program on the market and we really hope you love it and it actually makes your life more enjoyable. We have a few rewards and surprises planned for you coming up as our way of saying thanks.', okButtonText: "Dope"})
    }

    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }
}
