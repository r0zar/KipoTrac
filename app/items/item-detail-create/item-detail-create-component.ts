import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { alert } from "ui/dialogs";
import { EventData } from "data/observable";
import { DataFormEventData } from "nativescript-ui-dataform";
import { DatePicker } from "ui/date-picker";
import { ItemDetail } from "../shared/item.model";
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
    private _item: ItemDetail;
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
    private uid: string;
    private itemCategory: any;
    private toggle: boolean = false;
    private screenHeight: number = screen.mainScreen.heightDIPs;
    private _isUpdating: boolean = false;

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

        this._item = new ItemDetail({})

        this._metrcService.getStrains()
          .subscribe((strains: Array<any>) => {
              this._strains = _.map(strains, 'Name')
              this._item.Strain = this._strains[0]

              this._metrcService.getItemCategories()
                .subscribe((categories: Array<any>) => {
                    // HACK results until we find out why METRCs API is broken for Kief
                    categories = _.reject(categories, category => category.Name == 'Kief ')
                    this.categories = categories
                    this._itemCategories = _.map(categories, 'Name')
                    this._item.ItemCategory = this._itemCategories[0]
                    this._metrcService.getUnitsOfMeasure()
                      .subscribe((units: Array<any>) => {
                          this.units = units
                          this.findValidUnits()
                          this._item = new ItemDetail(_.extend(this._item, {Name: `${this._item.Strain} ${this._item.ItemCategory}`}))
                          this._chemicalUnits = _.map(_.filter(units, {QuantityType: 'WeightBased'}), 'Name')
                          this._volumeUnits = _.map(_.filter(units, {QuantityType: 'VolumeBased'}), 'Name')
                          this.toggle = true
                      })
                })
          });


    }

    updateValidUnits(args) {
      if (this.toggle && (args.propertyName == 'ItemCategory' || args.propertyName == 'Strain')) {
        this.findValidUnits()
        // show the valid units fields
        this.thcRequired = this.itemCategory.RequiresUnitThcContent
        this.weightRequired = this.itemCategory.RequiresUnitWeight
        this.volumeRequired = this.itemCategory.RequiresUnitVolume
        // update name based on choices
        this._item = new ItemDetail(_.extend(this._item, {Name: `${this._item.Strain} ${this._item.ItemCategory}`}))
      }
    }

    findValidUnits() {
      // find what quantity type the choice is...
      this.itemCategory = _.find(this.categories, {Name: this._item.ItemCategory as any})
      // adjust units of measure list to only show valid options
      this._validUnitsOfMeasure = _.map(_.filter(this.units, {QuantityType: this.itemCategory.QuantityType}), 'Name')
      // default to first in the list
      this._item.UnitOfMeasure = this._validUnitsOfMeasure[0]
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

    onTap(): void {
      let item = _.words(this._item.ItemCategory)[0]
      var adjective = '';
      var noun = '';
      this.http.get<any[]>(`https://api.datamuse.com/words?rel_jjb=${item}`)
        .subscribe((words: Array<any>) => {
            adjective = _.capitalize(_.sample(words).word)
            this._item = new ItemDetail(_.extend(this._item, {Name: `${adjective} ${noun}`}))
        });
      this.http.get<any[]>(`https://api.datamuse.com/words?ml=${this._item.Strain}`)
        .subscribe((words: Array<any>) => {
            noun = _.capitalize(_.sample(words).word)
            this._item = new ItemDetail(_.extend(this._item, {Name: `${adjective} ${noun}`}))
        });
    }

    /* ***********************************************************
    * The create done button uses the data service to save the updated values of the data item details.
    * Check out the data service as items/shared/item.service.ts
    *************************************************************/
    onDoneButtonTap(): void {
      this._isUpdating = true
      this._metrcService.createItem(this._item)
        .subscribe((item: ItemDetail) => {
          // save the event to the activity log
          firebase.push("/users/" + AuthService.token + '/activity', {object: 'item', status: 'created', createdAt: Date.now()});
          this._isUpdating = false
          this._routerExtensions.navigate(['/items'], {
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
