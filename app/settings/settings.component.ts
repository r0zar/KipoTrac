import { Component, OnInit, ViewChild } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RouterExtensions } from "nativescript-angular/router";
import firebase = require("nativescript-plugin-firebase");
import * as dialogs from "ui/dialogs";
import * as utils from "utils/utils";
import { Switch } from "ui/switch";
import { FingerprintAuth } from "nativescript-fingerprint-auth";
import * as ApplicationSettings from "application-settings";
import { ThemeService } from "../theme.service";

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

    private fingerprintAuth: FingerprintAuth;

    rememberEmailEnabled: boolean;
    fingerprintLoginEnabled: boolean;
    darkThemeEnabled: boolean;

    private _sideDrawerTransition: DrawerTransitionBase;
    
    constructor(
        private _routerExtensions: RouterExtensions,
        public themeService: ThemeService
    ) { }

    /* ***********************************************************
    * Use the sideDrawerTransition property to change the open/close animation of the drawer.
    *************************************************************/
    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
        this.fingerprintAuth = new FingerprintAuth();
        this.rememberEmailEnabled = ApplicationSettings.getBoolean("rememberEmailEnabled", false);
        this.fingerprintLoginEnabled = ApplicationSettings.getBoolean("fingerprintLoginEnabled", false);
        this.darkThemeEnabled = ApplicationSettings.getBoolean("darkThemeEnabled", false);
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

    toggleFingerPrintAuth(args): void {
        let fingerprintAuthEnabledSwitch = <Switch>args.object;
        this.fingerprintLoginEnabled = fingerprintAuthEnabledSwitch.checked;

        if (this.fingerprintLoginEnabled && !ApplicationSettings.getBoolean("fingerprintLoginEnabled", false)) {
            this.fingerprintAuth.available().then(available => {
                this.fingerprintAuth.verifyFingerprintWithCustomFallback({
                    fallbackMessage: "Enter Your Device Password",
                    message: "Authenticate via a Fingerprint"
                }).then(() => {
                    ApplicationSettings.setBoolean("fingerprintLoginEnabled", true);
                }, () => {
                    dialogs.alert("The fingerprint was not valid");
                    this.fingerprintLoginEnabled = false;
                    ApplicationSettings.setBoolean("fingerprintLoginEnabled", false);
                });
            }).catch((error) => {
                dialogs.alert("Error trying to enable fingerprint login");
                ApplicationSettings.setBoolean("fingerprintLoginEnabled", false);
                this.fingerprintLoginEnabled = false;
            })
        } else {
            ApplicationSettings.setBoolean("fingerprintLoginEnabled", this.fingerprintLoginEnabled);
        }
    }

    onRememberMeToggle(args): void {
        let rememberMeSwitch = <Switch>args.object;
        this.rememberEmailEnabled = rememberMeSwitch.checked;
        ApplicationSettings.setBoolean("rememberEmailEnabled", this.rememberEmailEnabled);
    }

    toggleDarkTheme(args): void {
        let toggleDarkThemeSwitch = <Switch>args.object;
        this.darkThemeEnabled = toggleDarkThemeSwitch.checked;
        if (this.darkThemeEnabled !== ApplicationSettings.getBoolean("darkThemeEnabled")) {
            console.log(`setting dark theme to ${this.darkThemeEnabled}`);
            ApplicationSettings.setBoolean("darkThemeEnabled", this.darkThemeEnabled);
            console.log(`emitting dark theme event to theme service: ${this.darkThemeEnabled}`);
            this.themeService.onThemeChanged.emit(this.darkThemeEnabled);
            // dialogs.alert("The changes will take effect next time you load the app");
        } else {
            console.log(`dark theme is already set to ${this.darkThemeEnabled}. skipping`);
        }
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
