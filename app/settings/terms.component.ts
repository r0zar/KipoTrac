import { Component, OnInit } from "@angular/core";
import { Page } from "ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { DataFormEventData } from "nativescript-ui-dataform";
import { Switch } from "ui/switch";
import * as dialogs from "ui/dialogs";
import firebase = require("nativescript-plugin-firebase");


/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "login", loadChildren: "./login/login.module#LoginModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Terms",
    moduleId: module.id,
    templateUrl: "./terms.component.html"
})
export class TermsComponent implements OnInit {

    constructor(
      private page: Page,
      private _routerExtensions: RouterExtensions
    ) {
        page.actionBarHidden = false;
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
    }
    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }
}
