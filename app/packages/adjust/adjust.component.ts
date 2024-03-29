import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { alert } from "ui/dialogs";;
import { EventData } from "data/observable";
import { DataFormEventData } from "nativescript-ui-dataform";

import { Adjustment } from "../shared/package.model";
import { MetrcService } from "../../shared/metrc.service";

import _ = require('lodash');

/* ***********************************************************
* This is the noun verb component.
* This component gets the selected data noun, provides options to verb the noun and saves the changes.
*************************************************************/
@Component({
    moduleId: module.id,
    selector: "Adjust",
    templateUrl: "./adjust.component.html"
})
export class AdjustComponent implements OnInit {
    private _adjustment: Adjustment;
    private _rooms: any;
    private _unitsOfMeasure: any;
    private _itemCategories: any;
    private _isLoading: boolean = false;

    constructor(
        private http: HttpClient,
        private _metrcService: MetrcService,
        private _pageRoute: PageRoute,
        private _routerExtensions: RouterExtensions
    ) { }

    /* ***********************************************************
    * Use the "ngOnInit" handler to get the data noun id parameter passed through navigation.
    * Get the data noun details from the data service using this id and assign it to the
    * private property that holds it inside the component.
    *************************************************************/
    ngOnInit(): void {

        this._metrcService.getRooms()
            .subscribe((rooms: Array<any>) => {
                this._rooms = _.map(rooms, 'Name')
            });

        this._metrcService.getItemCategories()
            .subscribe((itemCategories: Array<any>) => {
                this._itemCategories = _.map(itemCategories, 'Name')
            });

        this._metrcService.getUnitsOfMeasure()
            .subscribe((units: Array<any>) => {
                this._unitsOfMeasure = _.map(units, 'Name');
                this._adjustment.UnitOfMeasure = this._unitsOfMeasure[0]
                //this._unitsOfWeight = _.map(_.filter(this._unitsOfMeasure, {QuantityType: 'WeightBased'}), 'Name');
            });


        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => this._adjustment = new Adjustment({Label: params.id}));

    }

    get adjustment(): Adjustment {
        return this._adjustment;
    }

    get rooms(): any {
        return this._rooms;
    }

    get itemCategories(): any {
        return this._itemCategories;
    }

    get unitsOfMeasure(): any {
        return this._unitsOfMeasure;
        // TODO return _.map(_.filter(this._unitsOfMeasure, {QuantityType: 'lookuppackageBasedtype'}), 'Name');
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    /* ***********************************************************
    * The verb done button uses the data service to save the updated values of the data noun details.
    * Check out the data service as nounes/shared/noun.service.ts
    *************************************************************/
    onDoneButtonTap(): void {
        this._isLoading = true
        this._adjustment.Quantity = this._adjustment.Quantity * -1
        this._metrcService.adjustPackage(this._adjustment)
            .finally(() => this._isLoading = false)
            .subscribe(() => this._routerExtensions.backToPreviousPage());
    }

    /* ***********************************************************
    * The back button is essential for a master-detail feature.
    *************************************************************/
    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

}
