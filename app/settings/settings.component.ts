import { Component, OnInit, ViewChild } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";
import { RouterExtensions } from "nativescript-angular/router";
import firebase = require("nativescript-plugin-firebase");
import * as dialogs from "ui/dialogs";
import * as utils from "utils/utils";

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html"
})
export class SettingsComponent implements OnInit {
    /* ***********************************************************
    * Use the @ViewChild decorator to get a reference to the drawer component.
    * It is used in the "onDrawerButtonTap" function below to manipulate the drawer.
    *************************************************************/
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;

    private _sideDrawerTransition: DrawerTransitionBase;


    constructor(
        private _routerExtensions: RouterExtensions
    ) { }

    /* ***********************************************************
    * Use the sideDrawerTransition property to change the open/close animation of the drawer.
    *************************************************************/
    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    /* ***********************************************************
    * According to guidelines, if you have a drawer on your page, you should always
    * have a button that opens it. Use the showDrawer() function to open the app drawer section.
    *************************************************************/
    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }

    community(): void {
      utils.openUrl("https://kipotrac.slack.com/")
    }

    report(): void {
      dialogs.alert({
          title: "Bug Reporting",
          message: "To report a bug, send an email with details to info@kipotrac.com. Thank you!",
          okButtonText: "Got it"
      })
    }

    about(): void {
      dialogs.alert({
          title: "KipoTrac v1.0.4",
          message: "KipoTrac is a mobile application for iOS and Android. It is developed by KipoTrac, Inc. for sole use of paid subscribers of the application.",
          okButtonText: "OK"
      })
    }

    onSignoutButtonTap(): void {
      firebase.logout()
        .then(result => {
          this._routerExtensions.navigate(["/login"], { clearHistory: true })
        })
        .catch(error => {
          console.log(error)
        });
    }
}
