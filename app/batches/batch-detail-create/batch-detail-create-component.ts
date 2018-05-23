import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { EventData } from "data/observable";
import { DataFormEventData } from "nativescript-ui-dataform";
import firebase = require("nativescript-plugin-firebase");
import { AuthService } from "../../shared/auth.service";
import { Batch } from "../shared/batch.model";
import { MetrcService } from "../../shared/metrc.service";

import _ = require('lodash');

/* ***********************************************************
* This is the batch detail create component.
* This component gets the selected data batch, provides options to create the batch and saves the changes.
*************************************************************/
@Component({
    moduleId: module.id,
    selector: "BatchDetailCreate",
    templateUrl: "./batch-detail-create.component.html"
})
export class BatchDetailCreateComponent implements OnInit {
    private _batch: Batch = new Batch({});
    private _strains: any;
    private _unitsOfMeasure: any;
    private _batchTypes: any;
    private _isCreating: boolean = false;

    constructor(
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

        this._metrcService.getStrains()
            .subscribe((strains: Array<any>) => {
                this._strains = _.map(strains, 'Name')
                this._batch.Strain = this._strains[0]
            });

        this._metrcService.getBatchTypes()
            .subscribe((batchTypes: Array<any>) => {
                this._batchTypes = batchTypes
            });

        this.http.get<any[]>("https://api.datamuse.com/words?rel_jjb=marijuana")
            .subscribe((words: Array<any>) => {
                var adjective = _.capitalize(_.sample(words).word)
                this.http.get<any[]>("https://api.datamuse.com/words?rel_jja=grass")
                  .subscribe((words: Array<any>) => {
                      var noun = _.capitalize(_.sample(words).word)
                      this._batch = new Batch(_.extend(this._batch, {Name: `${adjective} ${noun}`}))
                  });
            });

    }

    get batch(): Batch {
        return this._batch;
    }

    get strains(): any {
        return this._strains;
    }

    get batchTypes(): any {
        return this._batchTypes;
    }

    get unitsOfMeasure(): any {
        return this._unitsOfMeasure;
    }

    get isCreating(): boolean {
        return this._isCreating;
    }

    /* ***********************************************************
    * The create done button uses the data service to save the updated values of the data batch details.
    * Check out the data service as batches/shared/batch.service.ts
    *************************************************************/
    onDoneButtonTap(): void {
        this._isCreating = true
        this._metrcService.createPlantings(this._batch)
            .finally(() => this._isCreating = false)
            .subscribe((batch: Batch) => {
              // save the event to the activity log
              firebase.push("/users/" + AuthService.token + '/activity', {object: 'batch', status: 'created', createdAt: Date.now()});
              this._routerExtensions.navigate(['/batches'], {
                  animated: true,
                  transition: {
                      name: "slideBottom",
                      duration: 200,
                      curve: "ease"
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
