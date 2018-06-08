import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { ListViewEventData } from "nativescript-ui-listview";
import { Product } from "nativescript-purchase/product";
import *  as purchase from "nativescript-purchase";
import { Data } from "../shared/data.service";
import { screen } from 'platform';

@Component({
    selector: "Add",
    moduleId: module.id,
    templateUrl: "./add.component.html"
})
export class AddPaymentComponent implements OnInit {

    private _subscriptions: Array<Product>;
    private _isLoading: boolean;
    private screenHeight: number = screen.mainScreen.heightDIPs - 100;

    constructor(
        private _routerExtensions: RouterExtensions,
        private data: Data
    ) { }

    ngOnInit(): void {
      this._isLoading = true
      purchase.getProducts()
        .then((products: Array<Product>) => {
          console.log(products)
          products = products.map((p) => {
            if (p.localizedTitle == null) {
              p.localizedTitle = p.productIdentifier
            }
            return p
          })
          this._subscriptions = products;
          this._isLoading = false
        })
    }

    onSubscriptionItemTap(args: ListViewEventData) : void {
        const tappedSubscription = args.view.bindingContext;

        if (purchase.canMakePayments()) {
            purchase.buyProduct(tappedSubscription);
        }
        else {
            alert("Sorry, your account is not eligible to make payments!");
        }

    }

    enableSubscription(): void {
      this.data.forceSubscription(true)
    }

    get subscriptions(): Array<Product> {
        return this._subscriptions;
    }

    get firstItem(): any {
      return this._subscriptions[0].localizedTitle
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }
}
