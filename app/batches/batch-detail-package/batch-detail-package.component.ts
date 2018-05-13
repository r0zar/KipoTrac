import _ = require('lodash');
import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { alert } from "ui/dialogs";;
import { EventData } from "data/observable";
import { DataFormEventData } from "nativescript-ui-dataform";
import { Batch, BatchPackage } from "../shared/batch.model";
import { MetrcService } from "../../shared/metrc.service";
import { BarcodeScanner } from 'nativescript-barcodescanner';
import firebase = require("nativescript-plugin-firebase");
import { AuthService } from "../../shared/auth.service";
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from "ui/page";

/* ***********************************************************
* This is the batch detail create component.
* This component gets the selected data batch, provides options to create the batch and saves the changes.
*************************************************************/
@Component({
    moduleId: module.id,
    selector: "BatchDetailPackage",
    templateUrl: "./batch-detail-package.component.html"
})
export class BatchDetailPackageComponent implements OnInit {
    private _batchPackage: BatchPackage;
    private _rooms: any;
    private _items: any;
    private _itemCategories: any;
    private _isCreating: boolean = false;
    private _fabMenuOpen: boolean = false;
    @ViewChild("fabView") fabView: ElementRef;
    @ViewChild("actionItem1") actionItem1: ElementRef;
    @ViewChild("actionItem2") actionItem2: ElementRef;

    constructor(
        private barcodeScanner: BarcodeScanner,
        private http: HttpClient,
        private _metrcService: MetrcService,
        private _pageRoute: PageRoute,
        private _routerExtensions: RouterExtensions
    ) { }

    /* ***********************************************************
    * Use the "ngOnInit" handler to get the data batch id parameter passed through navigation.
    * Get the data batch details from the data service using this id and assign it to the
    * private property that holds it inside the component.
    *************************************************************/
    ngOnInit(): void {

        this._metrcService.getRooms()
            .subscribe((rooms: Array<any>) => {
                this._rooms = _.map(rooms, 'Name')
            });

        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => {
              this._metrcService.getBatch(params.id)
                .subscribe((batch: any) => {
                  this._metrcService.getItems()
                      .subscribe((items: Array<any>) => {
                          this._items = _.map(_.filter(items, {StrainName: batch.StrainName, ProductCategoryName: 'Immature Plant'}), 'Name')
                          // HACK could probably just ask them if they want to make the item on the spot from a confirmation
                          if (this._items.length == 0) {
                            alert({title: 'Item Required', message: `Please first create an Item with category of Immature Plant and strain ${batch.StrainName} to create a package of this batch.`, okButtonText: "Got it"})
                              .then(() => this.onBackButtonTap())
                          }
                          this._batchPackage.Item = this._items[0]
                      });
                })
              this._batchPackage = new BatchPackage({Id: params.id})
            });

    }

    fabTap(actionItem2: View): void {
      this._fabMenuOpen = !this._fabMenuOpen
      if (this._fabMenuOpen) {
        actionItem2.animate({ translate: { x: -50, y: -60 } }).then(() => { }, () => { });
      } else {
        actionItem2.animate({ translate: { x: 0, y: 0 } }).then(() => { }, () => { });
      }
    }

    actionItem2Tap(): void {
      this.onScanTap()
    }

    get batchPackage(): BatchPackage {
        return this._batchPackage;
    }

    get rooms(): any {
        return this._rooms;
    }

    get isCreating(): boolean {
        return this._isCreating;
    }

    get items(): any {
        return this._items;
    }

    onScanTap(): void {
      var scanner = this.barcodeScanner;
      scanner.available().then(() => {
        scanner.hasCameraPermission().then(granted => {
          if (granted) this.barcode(scanner)
          else {
            scanner.requestCameraPermission().then(granted => {
              if (granted) this.barcode(scanner)
            })
          }
        })

      })
    }

    barcode(scanner: BarcodeScanner): void {
      scanner.scan({
        message: "Scan the new package RFID tag.",
        orientation: 'landscape',
        formats: "CODE_128",
        torchOn: true,
        showTorchButton: true,
        openSettingsIfPermissionWasPreviouslyDenied: true,
        resultDisplayDuration: 500,
        closeCallback: () => { console.log("Scanner closed"); }, // invoked when the scanner was closed
        reportDuplicates: true // which is the default
      })
      .then(result => this._batchPackage.Tag = result.text)
      .catch(error => console.log("No scan: " + error))
    }

    /* ***********************************************************
    * The create done button uses the data service to save the updated values of the data batch details.
    * Check out the data service as batches/shared/batch.service.ts
    *************************************************************/
    onDoneButtonTap(): void {
        this._isCreating = true
        this._metrcService.createBatchPackage(this._batchPackage)
            .finally(() => this._isCreating = false)
            .subscribe((batch: Batch) => {
              // save the event to the activity log
              firebase.push("/users/" + AuthService.token + '/activity', {object: 'package', status: 'created', createdAt: Date.now()});
              this._routerExtensions.navigate(['/batches'], {
                  animated: true,
                  transition: {
                      name: "flipRight",
                      duration: 500,
                      curve: "linear"
                  }
              })
            });
    }

    /* ***********************************************************
    * The back button is essential for a master-detail feature.
    *************************************************************/
    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

}
