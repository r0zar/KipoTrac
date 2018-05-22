import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { alert } from "ui/dialogs";;
import { EventData } from "data/observable";
import { DataFormEventData } from "nativescript-ui-dataform";

import { Plant, Plantings } from "../shared/plant.model";
import { MetrcService } from "../../shared/metrc.service";

import _ = require('lodash');

/* ***********************************************************
* This is the noun verb component.
* This component gets the selected data noun, provides options to verb the noun and saves the changes.
*************************************************************/
@Component({
    moduleId: module.id,
    selector: "CreatePlantings",
    templateUrl: "./createplantings.component.html"
})
export class CreatePlantingsComponent implements OnInit {
    private _plantings: Plantings = new Plantings({});
    private _rooms: any;
    private _strains: any;
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

        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => {
              this._metrcService.getPlantById(params.id)
                .subscribe((plant: Plant) => {

                  this.http.get<any[]>("https://api.datamuse.com/words?rel_jjb=marijuana")
                      .subscribe((words: Array<any>) => {
                          var adjective = _.capitalize(_.sample(words).word)
                          this.http.get<any[]>("https://api.datamuse.com/words?rel_jja=grass")
                            .subscribe((words: Array<any>) => {
                                var noun = _.capitalize(_.sample(words).word)
                                this._plantings = new Plantings(_.extend(this._plantings, {Name: `${adjective} ${noun}`}))
                            });
                      });

                  this._metrcService.getStrains()
                      .subscribe((strains: Array<any>) => {
                          this._strains = _.map(strains, 'Name')
                          this._plantings.StrainName = plant.StrainName
                      });
                });
            });

    }

    get createPlantings(): Plantings {
        return this._plantings;
    }

    get strains(): any {
        return this._strains;
    }

    get rooms(): any {
        return this._rooms;
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
        this._metrcService.createClones(this._plantings)
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
