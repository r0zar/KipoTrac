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
    purchase.init(['monthly', 'metrc.monthly', 'test', 'testsub'])
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
            firebase.push("/users/" + AuthService.token + '/transactions', transaction)
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
          // TODO all remote initialization should be set from here
          // it will trigger on login and reactivly set the users state and ui
          // the best way i've found to do this is with the data service observables
          // they will get picked up by subscribers in other components and then will
          // dynamically change the relevant options. this works much better than services
          // which will only be set when the sidebar menu is intialized.

          // initializate users API key
          AuthService.token = data.user.uid;
          this.dataService.user = data.user;
          firebase.getValue("/users/" + AuthService.token + "/account/apiKey")
            .then(key => {
              // HACK hardcode the API key
              this.dataService.setApiKey('FusVbe4Yv6W1DGNuxKNhByXU6RO6jSUPcbRCoRDD98VNXc4D')
              // this.dataService.setApiKey(key.value)
            })
            .catch(error => console.dir(error))

          // initializate users selected facility
          firebase.getValue("/users/" + data.user.uid + "/license")
            .then(license => {
              FacilityService.facility = license.value.number
            })
            .then(() => {
              this.dataService.setFacilitySelected(true)
            })
            .catch(error => console.dir(error))

          // get users active subscription and validate it against android/itunes APIs
          // TODO add support for itunes to this and the cloud function
          firebase.getValue("/users/" + AuthService.token + "/subscription")
            .then(subscription => {
              this.http.get<any>(`https://us-central1-kiposoft-6ae15.cloudfunctions.net/subscription?subscriptionId=${subscription.value.productIdentifier}&token=${subscription.value.transactionReceipt}`)
                .subscribe(resp => this.dataService.setSubscription(resp), error => console.dir(error))
            })
            .catch(error => console.dir(error))

        }
        else {
          // unset state when user logs out
          AuthService.token = ''
          this.dataService.setApiKey('')
          this.dataService.setFacilitySelected(false)
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
