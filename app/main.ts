// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { AppModule } from "./app.module";
require("nativescript-plugin-firebase");

import { enableProdMode } from '@angular/core';

enableProdMode();



import firebase = require("nativescript-plugin-firebase");
import { AuthService } from "./shared/auth.service";
const moment = require('moment');

// this is for the purchase plugin
import *  as purchase from "nativescript-purchase";
import { Transaction, TransactionState } from "nativescript-purchase/transaction";

purchase.init(["monthly", "yearly"])

purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
    transaction.transactionDate = moment()
    if (transaction.transactionState === TransactionState.Purchased) {
        console.log(`Congratulations you just bought ${transaction.productIdentifier}!`);
        firebase.push("/users/" + AuthService.token + '/transactions', transaction)
        firebase.setValue("/users/" + AuthService.token + '/subscription', transaction)
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

// add custom elements to UI from 3rd party plugins
import { registerElement } from "nativescript-angular/element-registry";
// floating action button
registerElement("Fab", () => require("nativescript-floatingactionbutton").Fab);
// barcode scanner
registerElement("BarcodeScanner", () => require("nativescript-barcodescanner").BarcodeScannerView);


// A traditional NativeScript application starts by initializing global objects, setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization: modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together, so we provide a wrapper platform object, platformNativeScriptDynamic,
// that sets up a NativeScript application and can bootstrap the Angular framework.
platformNativeScriptDynamic().bootstrapModule(AppModule);
