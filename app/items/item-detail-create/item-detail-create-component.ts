import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { alert } from "ui/dialogs";
import { EventData } from "data/observable";
import { DataFormEventData } from "nativescript-ui-dataform";
import { DatePicker } from "ui/date-picker";
import { Item } from "../shared/item.model";
import { MetrcService } from "../../shared/metrc.service";
import { screen } from 'platform';
import firebase = require("nativescript-plugin-firebase");
import { AuthService } from "../../shared/auth.service";
import _ = require('lodash');

/* ***********************************************************
* This is the item detail create component.
* This component gets the selected data item, provides options to create the item and saves the changes.
*************************************************************/
@Component({
    moduleId: module.id,
    selector: "ItemDetailCreate",
    templateUrl: "../shared/configure-item-detail.component.html"
})
export class ItemDetailCreateComponent implements OnInit {
    private _item: Item;
    private _strains: any;
    private _unitsOfMeasure: any;
    private _validUnitsOfMeasure: any;
    private _itemCategories: any;
    private _chemicalUnits: any;
    private _volumeUnits: any;
    private thcRequired: boolean = false;
    private weightRequired: boolean = false;
    private volumeRequired: boolean = false;
    private categories: any;
    private units: any;
    private uid: string;
    private screenHeight: number = screen.mainScreen.heightDIPs;

    constructor(
        private http: HttpClient,
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

        this._item = new Item({UnitOfMeasure: 'Each'})

        this._metrcService.getStrains()
            .subscribe((strains: Array<any>) => {
                this._strains = _.map(strains, 'Name')
            });

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

    onTap(): void {
      let item = _.words(this._item.ItemCategory)[0]
      var adjective = '';
      var noun = '';
      this.http.get<any[]>(`https://api.datamuse.com/words?rel_jjb=${item}`)
        .subscribe((words: Array<any>) => {
            adjective = _.capitalize(_.sample(words).word)
            this._item = new Item(_.extend(this._item, {Name: `${adjective} ${noun}`}))
        });
      this.http.get<any[]>(`https://api.datamuse.com/words?ml=${this._item.Strain}`)
        .subscribe((words: Array<any>) => {
            noun = _.capitalize(_.sample(words).word)
            this._item = new Item(_.extend(this._item, {Name: `${adjective} ${noun}`}))
        });
    }

    /* ***********************************************************
    * The create done button uses the data service to save the updated values of the data item details.
    * Check out the data service as items/shared/item.service.ts
    *************************************************************/
    onDoneButtonTap(): void {
        this._metrcService.createItem(this._item)
            .subscribe((item: Item) => {
              // save the event to the activity log
              firebase.push("/users/" + AuthService.token + '/activity', {object: 'item', status: 'created', createdAt: Date.now()});
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
