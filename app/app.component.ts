import { Component, OnInit, enableProdMode } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { AuthService } from "./shared/auth.service";
import { MetrcService } from "./shared/metrc.service";
import { FacilityService } from "./facilities/shared/facility.service";
import firebase = require("nativescript-plugin-firebase");
import { Data } from "./shared/data.service";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import *  as purchase from "nativescript-purchase";
import * as ApplicationSettings from "application-settings";
import { Transaction, TransactionState } from "nativescript-purchase/transaction";
import { ThemeService } from "./theme.service";
// add custom elements to UI from 3rd party plugins
import { registerElement } from "nativescript-angular/element-registry";
registerElement("Fab", () => require("nativescript-floatingactionbutton").Fab);
registerElement("BarcodeScanner", () => require("nativescript-barcodescanner").BarcodeScannerView);
enableProdMode();

// const Themes = require('nativescript-themes');

@Component({
  selector: "ns-app",
  templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {

  darkThemeEnabled: boolean = false;

  constructor(
    private dataService: Data,
    private http: HttpClient,
    private _metrcService: MetrcService,
    private _routerExtensions: RouterExtensions,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.onThemeChanged.subscribe( (enableDarkTheme : any ) => {
      this.handleOnThemeChanged(enableDarkTheme);
    });

    // this is for the purchase plugin
    purchase.init(['monthly', 'metrc.monthly'])
    purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
        if (transaction.transactionState === TransactionState.Purchased) {
            console.log(`Congratulations you just bought ${transaction.productIdentifier}!`);
            firebase.push("/users/" + AuthService.token + '/transactions', transaction)
            firebase.setValue("/users/" + AuthService.token + '/subscription', transaction)
            // HACK this will need to be modified with conditional logic if we add any in-app purchases other than subscriptions
            this.dataService.forceSubscription(true)
        }
        else if (transaction.transactionState === TransactionState.Restored) {
            console.log(`Purchase of ${transaction.productIdentifier} restored.`);
            firebase.push("/users/" + AuthService.token + '/transactions', transaction)
            firebase.setValue("/users/" + AuthService.token + '/subscription', transaction)
        }
        else if (transaction.transactionState === TransactionState.Failed) {
            console.log(`Purchase of ${transaction.productIdentifier} failed!`);
            // firebase.push("/users/" + AuthService.token + '/transactions', transaction)
        }
    });
    purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
        if (transaction.transactionState === TransactionState.Purchased && transaction.productIdentifier.indexOf(".consume") >= 0) {
            purchase.consumePurchase(transaction.transactionReceipt)
        }
    });

    // intialize firebase connection
    firebase.init({
      persist: false,
      onMessageReceivedCallback: (message: any) => {
        firebase.push("/users/" + AuthService.token + '/notifications', message);
        // I added some logic here so we have have notifications route the app to a page
        if (message.data.route) {
          this._routerExtensions.navigate([`/${message.data.route}`],
            {animated: true, transition: {name: "fade", duration: 200, curve: "ease"}
          })
        }
      },
      onAuthStateChanged: (data: any) => {
        if (data.loggedIn) {
          //store the user id token for usage during session
          AuthService.token = data.user.uid;
          // use the data service functions to load the application settings information.
          // these functions check local storage first, then firebase, then default.
          this.dataService.loadAPIKey()
          this.dataService.loadSelectedFacility()
          this.dataService.loadSubscriptionStatus()
        }
        else {
          // unset state when user logs out
          AuthService.token = ''
        }
      }
    })
    .then(() => console.log("Firebase initialized"))
    .catch(err => console.log("Firebase initialization error: " + err));

  }

  handleOnThemeChanged(enableDarkTheme) {
    console.log(`received theme change event, setting darkThemeEnabled to ${enableDarkTheme}`);
    this.darkThemeEnabled = enableDarkTheme;
  }
}
