import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { alert } from "ui/dialogs";
import { DatePicker } from "ui/date-picker";
import { EventData } from "data/observable";
import { Item, ItemDetail } from "../shared/item.model";
import { MetrcService } from "../../shared/metrc.service";
import { screen } from 'platform';
import firebase = require("nativescript-plugin-firebase");
import { AuthService } from "../../shared/auth.service";
import _ = require('lodash');


/* ***********************************************************
* This is the item detail edit component.
* This component gets the selected data item, provides options to edit the item and saves the changes.
*************************************************************/
@Component({
    moduleId: module.id,
    selector: "ItemDetailEdit",
    templateUrl: "../shared/configure-item-detail.component.html"
})
export class ItemDetailEditComponent implements OnInit {
    private _item: ItemDetail;
    private _isUpdating: boolean = false;
    private _strains: any = [];
    private _validUnitsOfMeasure: any = [];
    private _itemCategories: any = [];
    private _chemicalUnits: any = [];
    private _volumeUnits: any = [];
    private thcRequired: boolean = false;
    private weightRequired: boolean = false;
    private volumeRequired: boolean = false;
    private categories: any = [];
    private units: any;
    private itemCategory: any;
    private toggle: boolean = false;
    private screenHeight: number = screen.mainScreen.heightDIPs;

    constructor(
        private _metrcService: MetrcService,
        private _pageRoute: PageRoute,
        private _routerExtensions: RouterExtensions
    ) { }

    /* ***********************************************************
    * Use the "ngOnInit" handler to get the data item id parameter passed through navigation.
    * Get the data item details from the data service using this id and assign it to the
    * private property that holds it inside the component.
    *************************************************************/
    ngOnInit(): void {
        /* ***********************************************************
        * Learn more about how to get navigation parameters in this documentation article:
        * http://docs.nativescript.org/angular/core-concepts/angular-navigation.html#passing-parameter
        *************************************************************/
        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => {
              this._metrcService.getItem(params.id)
                  .subscribe((item: Item) => {
                    this._item = new ItemDetail(item)

                    this._metrcService.getStrains()
                      .subscribe((strains: Array<any>) => {
                          this._strains = _.map(strains, 'Name')
                      });

                    this._metrcService.getItemCategories()
                      .subscribe((categories: Array<any>) => {
                          this.categories = categories
                          this._itemCategories = _.map(categories, 'Name')

                          this._metrcService.getUnitsOfMeasure()
                            .subscribe((units: Array<any>) => {
                                this.units = units
                                this._validUnitsOfMeasure = this.findValidUnits()
                                this._chemicalUnits = _.map(_.filter(units, {QuantityType: 'WeightBased'}), 'Name')
                                this._volumeUnits = _.map(_.filter(units, {QuantityType: 'VolumeBased'}), 'Name')
                                this.toggle = true
                            })
                      })
                  })
            })
    }

    updateValidUnits(args) {
      if (this.toggle && args.propertyName == 'ItemCategory') {
        this._validUnitsOfMeasure = this.findValidUnits()
      }
    }

    findValidUnits() {
      // find what quantity type the choice is...
      this.itemCategory = _.find(this.categories, {Name: this._item.ItemCategory})
      // show the valid units fields
      this.thcRequired = this.itemCategory.RequiresUnitThcContent
      this.weightRequired = this.itemCategory.RequiresUnitWeight
      this.volumeRequired = this.itemCategory.RequiresUnitVolume
      // adjust units of measure list to only show valid options
      return _.map(_.filter(this.units, {QuantityType: this.itemCategory.QuantityType}), 'Name')
    }

    get item(): ItemDetail {
        return this._item
    }

    get strains(): any {
        return this._strains
    }

    get itemCategories(): any {
        return this._itemCategories
    }

    get unitsOfMeasure(): any {
        return this._validUnitsOfMeasure
    }

    get chemicalUnitsOfMeasure(): any {
        return this._chemicalUnits
    }

    get volumeUnitsOfMeasure(): any {
        return this._volumeUnits
    }

    /* ***********************************************************
    * The edit done button uses the data service to save the updated values of the data item details.
    * Check out the data service as items/shared/item.service.ts
    *************************************************************/
    onDoneButtonTap(): void {
        this._isUpdating = true
        this._metrcService.updateItem(this._item)
            .subscribe((item: ItemDetail) => {
              // save the event to the activity log
              firebase.push("/users/" + AuthService.token + '/activity', {object: 'item', status: 'updated', createdAt: Date.now()});
              this._isUpdating = false
              this._routerExtensions.backToPreviousPage()
            });
    }

    /* ***********************************************************
    * The back button is essential for a master-detail feature.
    *************************************************************/
    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

}
