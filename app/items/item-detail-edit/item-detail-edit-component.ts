import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { alert } from "ui/dialogs";
import { DatePicker } from "ui/date-picker";
import { EventData } from "data/observable";
import { Item } from "../shared/item.model";
import { MetrcService } from "../../shared/metrc.service";
import { screen } from 'platform';
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
    private _item: Item;
    private _isUpdating: boolean = false;
    private _strains: any;
    private _unitsOfMeasure: any;
    private _validUnitsOfMeasure: any;
    private _itemCategories: any;
    private _chemicalUnits: any;
    private _volumeUnits: any;
    private thcRequired: boolean = false;
    private weightRequired: boolean = false;
    private volumeRequired: boolean = false;
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
                    this._item = new Item(item)

                    this._metrcService.getStrains()
                    .subscribe((strains: Array<any>) => {
                        this._strains = strains
                    })

                    this._metrcService.getItemCategories()
                    .subscribe((categories: Array<any>) => {
                        this._itemCategories = categories
                        this.dfPropertyCommitted({})
                    })

                    this._metrcService.getUnitsOfMeasure()
                    .subscribe((units: Array<any>) => {
                        this._unitsOfMeasure = units
                        this._chemicalUnits = _.filter(units, {QuantityType: 'WeightBased'})
                        this._volumeUnits = _.filter(units, {QuantityType: 'VolumeBased'})
                        this.dfPropertyCommitted({})
                    })
                  })
            })
    }

    dfPropertyCommitted(args) {
        // find what quantity type the choice is...
        let itemCategory = _.find(this._itemCategories, {Name: this._item.ItemCategory})
        let QuantityType = itemCategory.QuantityType
        // adjust units of measure list to only show valid options
        this._validUnitsOfMeasure = _.filter(this._unitsOfMeasure, {QuantityType})
        // show the valid units fields
        this.thcRequired = itemCategory.RequiresUnitThcContent
        this.weightRequired = itemCategory.RequiresUnitWeight
        this.volumeRequired = itemCategory.RequiresUnitVolume
    }

    get isUpdating(): boolean {
        return this._isUpdating;
    }

    get item(): Item {
        return this._item;
    }

    get strains(): any {
        return _.map(this._strains, 'Name');
    }

    get itemCategories(): any {
        return _.map(this._itemCategories, 'Name')
    }

    get unitsOfMeasure(): any {
        return _.map(this._validUnitsOfMeasure, 'Name');
    }

    get chemicalUnitsOfMeasure(): any {
        return _.map(this._chemicalUnits, 'Name');
    }

    get volumeUnitsOfMeasure(): any {
        return _.map(this._volumeUnits, 'Name');
    }

    /* ***********************************************************
    * The edit done button uses the data service to save the updated values of the data item details.
    * Check out the data service as items/shared/item.service.ts
    *************************************************************/
    onDoneButtonTap(): void {
        this._metrcService.updateItem(this._item)
            .subscribe((item: Item) => this._routerExtensions.backToPreviousPage());
    }

    /* ***********************************************************
    * The back button is essential for a master-detail feature.
    *************************************************************/
    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

}
