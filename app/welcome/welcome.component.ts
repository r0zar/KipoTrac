import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "ui/dialogs";
import { Page } from "ui/page";
import firebase = require("nativescript-plugin-firebase");

import {registerElement} from "nativescript-angular/element-registry";
registerElement("Carousel", () => require("nativescript-carousel").Carousel);
registerElement("CarouselItem", () => require("nativescript-carousel").CarouselItem);

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "signup", loadChildren: "./signup/signup.module#SignupModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Welcome",
    moduleId: module.id,
    templateUrl: "./welcome.component.html"
})
export class WelcomeComponent implements OnInit {

    constructor(page: Page, private routerExtensions: RouterExtensions) {
        /* ***********************************************************
        * Use the constructor to inject app services that you need in this component.
        *************************************************************/
       page.actionBarHidden = true;
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
    }
}
