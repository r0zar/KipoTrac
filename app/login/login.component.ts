import { Component, OnInit } from "@angular/core";
import { Page } from "ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { DataFormEventData } from "nativescript-ui-dataform";
import { Switch } from "ui/switch";
import * as dialogs from "ui/dialogs";
import firebase = require("nativescript-plugin-firebase");

import { FingerprintAuth } from "nativescript-fingerprint-auth";
import * as ApplicationSettings from "application-settings";

import { LoadingIndicator } from "nativescript-loading-indicator";

// this is to fix the soft keyboard on login thing
// import { isAndroid } from "platform";
// import * as app from 'application';
// declare var android: any; //bypass the TS warnings
// if (android) {
//      // prevent the soft keyboard from showing initially when textfields are present
//      app.android.startActivity.getWindow().setSoftInputMode(
//      android.view.WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
//  }

/* ***********************************************************
* Before you can navigate to this page from your app, you need to reference this page's module in the
* global app router module. Add the following object to the global array of routes:
* { path: "login", loadChildren: "./login/login.module#LoginModule" }
* Note that this simply points the path to the page module file. If you move the page, you need to update the route too.
*************************************************************/

@Component({
    selector: "Login",
    moduleId: module.id,
    templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    rememberEmailEnabled: boolean;
    loading: boolean;
    loginFailed: boolean;
    dark: boolean;
    private fingerprintAuth: FingerprintAuth;
    loader: LoadingIndicator;


    constructor(page: Page, private routerExtensions: RouterExtensions) {
        page.actionBarHidden = true;
        this.fingerprintAuth = new FingerprintAuth();
        this.loader = new LoadingIndicator();
    }

    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for this component.
        *************************************************************/
        this.email = ''
        this.password = ''
        this.loading = false
        this.loginFailed = false

        this.rememberEmailEnabled = ApplicationSettings.getBoolean("rememberEmailEnabled", false);

        let storeEmail = ApplicationSettings.getString("email", null);
        let storePassword = ApplicationSettings.getString("password", null);

        if (this.rememberEmailEnabled && storeEmail !== null) {
            this.email = storeEmail;
        }

        let isFingerprintEnabled = ApplicationSettings.getBoolean("fingerprintLoginEnabled", false);
        if(isFingerprintEnabled) {
            this.fingerprintAuth.available().then(available => {
                if (storeEmail !== null && storePassword !== null) {
                    this.fingerprintAuth.verifyFingerprintWithCustomFallback({
                        fallbackMessage: "Enter Your Device Password",
                        message: "Authenticate via a Fingerprint"
                    }).then(() => {
                        this.email = storeEmail;
                        this.password = storePassword;
                        this.onSigninButtonTap();
                        console.log("Fingerprint was OK");
                    }, () => {
                        dialogs.alert("The fingerprint was not valid");
                    });
                }
            });
        }

    }

    onRememberMeToggle(args): void {
        let rememberMeSwitch = <Switch>args.object;
        this.rememberEmailEnabled = rememberMeSwitch.checked;
        ApplicationSettings.setBoolean("rememberEmailEnabled", this.rememberEmailEnabled);
    }

    onSigninButtonTap(): void {

        if (this.email === '' || this.password === '') {
            dialogs.alert({
                title: "Missing Required Fields",
                message: "Please enter both your email address and password to login",
                okButtonText: "OK"
            });
            return;
        }

        this.loader.show();
        this.loginFailed = false;
        this.loading = true;
        firebase.login(
            {
                type: firebase.LoginType.PASSWORD,
                passwordOptions: {
                email: this.email,
                password: this.password
            }
        })
        .then(result => {
            ApplicationSettings.setString("email", this.email);
            ApplicationSettings.setString("password", this.password);
            firebase.analytics.logEvent({key: "log_in", parameters: [{key: "email", value: this.email}]}).then(() => console.log("Firebase Analytics event logged"));
            this.routerExtensions.navigate(["/home"], { clearHistory: true });
            this.loader.hide();
        })
        .catch(error => {
            this.loading = false;
            this.loginFailed = true;
            this.loader.hide();
            console.log(error);
            dialogs.alert({
                title: "Login Failed",
                message: "The email address or password you entered was incorrect, please try again",
                okButtonText: "OK"
            });
        });

        /* ***********************************************************
        * Call your custom sign in logic using the email and password data.
        *************************************************************/
    }

    onForgotPasswordTap(): void {
      dialogs.confirm({
          title: "Password Reset",
          message: `Would you like to reset your password for ${this.email}?`,
          okButtonText: "Yes",
          cancelButtonText: "No thanks"
      }).then(result => {
          // result argument is boolean
          console.log("Dialog result: " + result);
          if (result) {
            firebase.resetPassword({
              email: this.email
            }).then(
                function () {
                  dialogs.alert({
                      title: "Success!",
                      message: "Check your email for a reset link.",
                      okButtonText: "Confirm"
                  }).then(() => {
                      console.log("Dialog closed!");
                  });
                },
                function (errorMessage) {
                  console.log(errorMessage);
                }
            );
          }
      });
    }
}
