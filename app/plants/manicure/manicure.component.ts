import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { alert } from "ui/dialogs";;
import { EventData } from "data/observable";
import { DataFormEventData } from "nativescript-ui-dataform";

import { Plant, Harvest } from "../shared/plant.model";
import { MetrcService } from "../../shared/metrc.service";

import _ = require('lodash');

/* ***********************************************************
* This is the noun verb component.
* This component gets the selected data noun, provides options to verb the noun and saves the changes.
*************************************************************/
@Component({
    moduleId: module.id,
    selector: "Manicure",
    templateUrl: "./manicure.component.html"
})
export class ManicureComponent implements OnInit {
    private _manicure: Harvest = new Harvest({});
    private _rooms: any;
    private plant: Plant;
    private _unitsOfWeight: any;
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

        this._metrcService.getUnitsOfMeasure()
            .subscribe((units: Array<any>) => {
                this._unitsOfWeight = units
            });

        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => {
              this._metrcService.getPlantById(params.id)
                .subscribe((plant: Plant) => {
                  this.plant = plant;
                  this._manicure = new Harvest(plant)
                  this.onTap()
                });
            });

    }

    get manicure(): Harvest {
        return this._manicure;
    }

    get rooms(): any {
        return this._rooms;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get unitsOfWeight(): any {
        return _.map(_.filter(this._unitsOfWeight, {QuantityType: 'WeightBased'}), 'Name');
    }

    onTap(): void {
      this.http.get<any[]>(`https://api.datamuse.com/words?ml=${this.plant.StrainName}`)
          .subscribe((words: Array<any>) => {
              var adjective = _.capitalize(_.sample(words).word)
              this.http.get<any[]>("https://api.datamuse.com/words?ml=harvest")
                .subscribe((words: Array<any>) => {
                    var noun = _.capitalize(_.sample(words).word)
                    this._manicure = new Harvest(_.extend(this._manicure, {HarvestName: `${adjective} ${noun}`}))
                });
          });
    }


    /* ***********************************************************
    * The verb done button uses the data service to save the updated values of the data noun details.
    * Check out the data service as nounes/shared/noun.service.ts
    *************************************************************/
    onDoneButtonTap(): void {
        this._isLoading = true
        this._metrcService.manicurePlants(this._manicure)
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
