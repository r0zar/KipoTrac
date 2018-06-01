import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import * as dialogs from "ui/dialogs";
import { Page } from "ui/page";
import firebase = require("nativescript-plugin-firebase");
declare var android;

import {registerElement} from "nativescript-angular/element-registry";
registerElement("Carousel", () => require("nativescript-carousel").Carousel);
registerElement("CarouselItem", () => require("nativescript-carousel").CarouselItem);

import { LoginComponent } from "../login/login.component";

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

    page: Page;

    constructor(
        page: Page, 
        private routerExtensions: RouterExtensions, 
        private modalService: ModalDialogService, 
        private vcRef: ViewContainerRef
    ) {
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

    onTap() {
        this.createModelView().then(result => {
            console.log(result)
        }).catch(error => console.log(error));
    }

    private createModelView(): Promise<any> {
        const options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: "context",
            fullscreen: false,
        };

        return this.modalService.showModal(LoginComponent, options);
    }
}
