import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { DataFormEventData } from "nativescript-ui-dataform";
import firebase = require("nativescript-plugin-firebase");
import { alert } from "ui/dialogs";

import { Account } from "./account.model";
import { AuthService } from "../shared/auth.service";

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
    private _user: any;
    private name: any;
    private email: any;
    private _account: Account;
    private _isLoading: boolean = false;

    constructor(
        private _routerExtensions: RouterExtensions
    ) { }


    ngOnInit(): void {

      firebase.getCurrentUser()
        .then(user => firebase.getValue("/users/" + user.uid))
        .then(user => this._user = user.value)

      firebase.getCurrentUser()
        .then(user => {
          this.name = user.name
          this.email = user.email
          this._account = new Account(this)
        })

    }

    get account(): Account {
        return this._account;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View) {
        // If the header content is still visiible
        if (scrollView.verticalOffset < 200) {
            const offset = scrollView.verticalOffset / 2;
            if (scrollView.ios) {
                // iOS adjust the position with an animation to create a smother scrolling effect.
                topView.animate({ translate: { x: 0, y: offset } }).then(() => { }, () => { });
                // fabView.animate({ translate: { x: 0, y: -1 * offset } }).then(() => { }, () => { });
                // fabView.animate({ translate: { x: 0, y: offset } }).then(() => { }, () => { });
            } else {
                // Android, animations are jerky so instead just adjust the position without animation.
                topView.translateY = Math.floor(offset);
                // fabView.translateY = Math.floor(-1 * offset);
                // fabView.translateX = Math.floor(offset);
            }
        }
    }

    onDoneButtonTap(): void {
        this._isLoading = true
        AuthService.apiKey = this._account.apiKey
        firebase.setValue("/users/" + AuthService.token + '/account', this._account)
        .then(() => {
          // save the event to the activity log
          firebase.push("/users/" + AuthService.token + '/activity', {object: 'account', status: 'edited', createdAt: Date.now()});
          this._isLoading = false
          this._routerExtensions.backToPreviousPage();
        })
    }


    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }
}
