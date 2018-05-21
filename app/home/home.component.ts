import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { MetrcService } from "../shared/metrc.service";
import firebase = require("nativescript-plugin-firebase");
import { SelectedIndexChangedEventData, TabView, TabViewItem } from "tns-core-modules/ui/tab-view";
import { alert } from "ui/dialogs";
import { isAndroid } from "platform";
import { Data } from "../shared/data.service";
import { BarcodeScanner } from 'nativescript-barcodescanner';
// import { TNSCoachMarks, TNSCoachMark } from 'nativescript-coachmarks';
import { Page } from "ui/page";


@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    /* ***********************************************************
    * Use the @ViewChild decorator to get a reference to the drawer component.
    * It is used in the "onDrawerButtonTap" function below to manipulate the drawer.
    *************************************************************/
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    private _sideDrawerTransition: DrawerTransitionBase;
    private _title: string;

    constructor(
      private _metrcService: MetrcService,
      private barcodeScanner: BarcodeScanner,
      private _routerExtensions: RouterExtensions,
      private data: Data
    ){}

    /* ***********************************************************
    * Use the sideDrawerTransition property to change the open/close animation of the drawer.
    *************************************************************/
    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();

        firebase.getCurrentUser()
          .then(user => {
            firebase.getValue("/users/" + user.uid)
              .then(user => {
                if (!user.value) {
                  alert({title: 'Welcome to KipoTrac', message: 'I hope to make your work a lot easier.\n\nLet\'s go to the facilities page to choose where we\'ll be working.\n\nTo get there, click the menu and then select \'Facilities\'', okButtonText: "OK"})
                }
              })
          })
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
        }
    }

    /* ***********************************************************
    * The "getIconSource" function returns the correct tab icon source
    * depending on whether the app is ran on Android or iOS.
    * You can find all resources in /App_Resources/os
    *************************************************************/
    getIconSource(icon: string): string {
        return isAndroid ? "" : "res://tabIcons/" + icon;
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        const tabView = <TabView>args.object;
        const selectedTabViewItem = tabView.items[args.newIndex];

        this.title = selectedTabViewItem.title;
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

    barcode(scanner: BarcodeScanner): void {
      scanner.scan({
        message: "Scan a plant or package RFID tag.",
        orientation: 'landscape',
        formats: "CODE_128",
        torchOn: true,
        showTorchButton: true,
        openSettingsIfPermissionWasPreviouslyDenied: true,
        resultDisplayDuration: 500,
        closeCallback: () => { console.log("Scanner closed"); }, // invoked when the scanner was closed
        reportDuplicates: true // which is the default
      })
      .then(result => {
        let labeledTarget = 'plant'
        this._routerExtensions.navigate([`/${labeledTarget}s/${labeledTarget}-detail`, result.text], {animated: true, transition: {name: "fade", duration: 200}});
      })
      .catch(error => console.log("No scan: " + error))
    }
}
