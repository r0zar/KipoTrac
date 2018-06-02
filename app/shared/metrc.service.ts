import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import { catchError, map, tap, retry } from 'rxjs/operators';
import firebase = require("nativescript-plugin-firebase");
import { TNSFancyAlert, TNSFancyAlertButton } from 'nativescript-fancyalert';
import { AuthService } from "../shared/auth.service";
import { FacilityService } from "../facilities/shared/facility.service";
import { Facility } from "../facilities/shared/facility.model"
import { Room } from "../rooms/shared/room.model"
import { Item } from "../items/shared/item.model"
import { Strain } from "../strains/shared/strain.model"
import { Batch } from "../batches/shared/batch.model"
import { Plant } from "../plants/shared/plant.model"
import { Package } from "../packages/shared/package.model"
import { Transfer } from "../transfers/shared/transfer.model"
import { Harvest } from "../harvests/shared/harvest.model"
import { Data } from "./data.service";
import * as ApplicationSettings from "application-settings";
import _ = require('lodash');
require('./base64');
const metrc = require('./shared.env.json')

@Injectable()
export class MetrcService {

  private header: HttpHeaders;
  private rootUrl = "https://sandbox-api-ca.metrc.com"
  //private licenseNumber = "?licenseNumber=CML17-0000001"

  constructor(private http: HttpClient, private data: Data) {
    // message to set the new api key
    this.data.isApiKeySet.subscribe(apiKey => {
      if (apiKey) {
        this.header = new HttpHeaders().set("authorization", "Basic " + btoa(metrc.sandbox+apiKey))
        this.getRooms().subscribe(() => this.data.activateRooms(true), () => this.data.activateRooms(false))
        this.getBatches().subscribe(() => this.data.activateBatches(true), () => this.data.activateBatches(false))
        this.getVegetativePlants().subscribe(() => this.data.activatePlants(true), () => this.data.activatePlants(false))
        this.getHarvests('active').subscribe(() => this.data.activateHarvests(true), () => this.data.activateHarvests(false))
      }
    })
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.dir(JSON.stringify(error)); // log to console instead
      // Let the app keep running by returning an empty result.
      TNSFancyAlert.showError(error.statusText, _.map(error.error, 'message').join('\n') || error.error.Message, 'Okay').then( () => {});
      return of(result as T);
    };
  }

  private successAlert(operation = 'operation', response): void {
    TNSFancyAlert.showSuccess(response.Name, operation, 'Okay').then( () => {});
  }

  // facilities

  getFacilities(): Observable<Facility[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getFacilities'}]})
      return this.http.get<Facility[]>("https://sandbox-api-ca.metrc.com/facilities/v1", {headers: this.header})
        .pipe(retry(3), catchError(this.handleError('getFacilities', [])));
  }

  // rooms

  getRooms(): Observable<Room[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getRooms'}]})
      return this.http.get<Room[]>(`${this.rootUrl}/rooms/v1/active?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3))
  }

  getRoom(id: number): Observable<Room> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getRoom'}]})
      return this.http.get<Room>(`${this.rootUrl}/rooms/v1/${id}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError<Room>(`getRoom id=${id}`)));
  }

  createRooms(Rooms): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createRooms'}]})
      return this.http.post(`${this.rootUrl}/rooms/v1/create?licenseNumber=${FacilityService.facility}`, [Rooms], {headers: this.header})
        .pipe(retry(3), tap(rooms => this.successAlert('New room has been created.', Rooms)), catchError(this.handleError('createRooms', [])));
  }

  updateRooms(Rooms): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'updateRooms'}]})
      return this.http.post(`${this.rootUrl}/rooms/v1/update?licenseNumber=${FacilityService.facility}`, [Rooms], {headers: this.header})
        .pipe(retry(3), tap(rooms => this.successAlert('Room has been updated.', Rooms)), catchError(this.handleError('updateRooms', [])));
  }

  deleteRoom(Room): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'deleteRoom'}]})
      return this.http.delete(`${this.rootUrl}/rooms/v1/${Room.Id}?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3), tap(rooms => this.successAlert('Room has been deleted.', Room)), catchError(this.handleError('deleteRoom', [])));
  }

  // strains

  getStrains(): Observable<Strain[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getStrains'}]})
      return this.http.get<Strain[]>(`${this.rootUrl}/strains/v1/active?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3))
  }

  getStrain(id: number): Observable<Strain> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getStrain'}]})
      return this.http.get<Strain>(`${this.rootUrl}/strains/v1/${id}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError<Strain>(`getStrain id=${id}`)));
  }

  createStrains(Strain): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createStrains'}]})
      return this.http.post(`${this.rootUrl}/strains/v1/create?licenseNumber=${FacilityService.facility}`, [Strain], {headers: this.header})
        .pipe(retry(3), tap(strain => this.successAlert('New strain has been created.', Strain)), catchError(this.handleError('createStrains', [])));
  }

  updateStrains(Strain): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'updateStrains'}]})
      return this.http.post(`${this.rootUrl}/strains/v1/update?licenseNumber=${FacilityService.facility}`, [Strain], {headers: this.header})
        .pipe(retry(3), tap(strain => this.successAlert('Strain has been updated.', Strain)), catchError(this.handleError('updateStrains', [])));
  }

  deleteStrain(Strain): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'deleteStrain'}]})
      return this.http.delete(`${this.rootUrl}/strains/v1/${Strain.Id}?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3), tap(strain => this.successAlert('Strain has been deleted.', Strain)), catchError(this.handleError('deleteStrain', [])));
  }

  // plant batches

  getBatches(): Observable<Batch[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getBatches'}]})
      return this.http.get<Batch[]>(`${this.rootUrl}/plantbatches/v1/active?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3))
  }

  getBatch(id: number): Observable<Batch> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getBatch'}]})
      return this.http.get<Batch>(`${this.rootUrl}/plantbatches/v1/${id}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError<Batch>(`getBatch id=${id}`)));
  }

  getBatchTypes(): Observable<any[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getBatchTypes'}]})
      return this.http.get<any[]>(`${this.rootUrl}/plantbatches/v1/types`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError('getBatchTypes', [])));
  }

  createPlantings(Batch): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createPlantings'}]})
      return this.http.post(`${this.rootUrl}/plantbatches/v1/createplantings?licenseNumber=${FacilityService.facility}`, [Batch], {headers: this.header})
        .pipe(retry(3), tap(batch => this.successAlert('New batch of plantings created.', Batch)), catchError(this.handleError('createPlantings', [])));
  }

  createBatchPackage(Batch): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createBatchPackage'}]})
      return this.http.post(`${this.rootUrl}/plantbatches/v1/createPackages?licenseNumber=${FacilityService.facility}`, [Batch], {headers: this.header})
        .pipe(retry(3), tap(batch => this.successAlert('New package of plantings created.', Batch)), catchError(this.handleError('createBatchPackage', [])));
  }

  changeGrowthPhase(Batch): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'changeGrowthPhase'}]})
      return this.http.post(`${this.rootUrl}/plantbatches/v1/changegrowthphase?licenseNumber=${FacilityService.facility}`, [Batch], {headers: this.header})
        .pipe(retry(3), tap(batch => this.successAlert('Growth phase has been updated.', Batch)), catchError(this.handleError('changeGrowthPhase', [])));
  }

  destroyPlantBatches(Batch): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'destroyPlantBatches'}]})
      return this.http.post(`${this.rootUrl}/plantbatches/v1/destroy?licenseNumber=${FacilityService.facility}`, [Batch], {headers: this.header})
        .pipe(retry(3), tap(batch => this.successAlert('Plant batch has been destroyed.', Batch)), catchError(this.handleError('changeGrowthPhase', [])));
  }

  // plants

  getPlantById(id: number): Observable<Plant> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getPlantById'}]})
      return this.http.get<Plant>(`${this.rootUrl}/plants/v1/${id}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError<Plant>(`getPlantById id=${id}`)));
  }

  getVegetativePlants(): Observable<Plant[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getVegetativePlants'}]})
      return this.http.get<Plant[]>(`${this.rootUrl}/plants/v1/vegetative?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3))
  }

  getFloweringPlants(): Observable<Plant[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getFloweringPlants'}]})
      return this.http.get<Plant[]>(`${this.rootUrl}/plants/v1/flowering?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3))
  }

  movePlants(Plant): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'movePlants'}]})
      return this.http.post(`${this.rootUrl}/plants/v1/moveplants?licenseNumber=${FacilityService.facility}`, [Plant], {headers: this.header})
        .pipe(retry(3), tap(plant => this.successAlert('The plant\'s location has been updated.', Plant)), catchError(this.handleError('movePlants', [])));
  }

  changeGrowthPhases(Plant): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'changeGrowthPhases'}]})
      return this.http.post(`${this.rootUrl}/plants/v1/changegrowthphases?licenseNumber=${FacilityService.facility}`, [Plant], {headers: this.header})
        .pipe(retry(3), tap(plant => this.successAlert('Plant growth phase has been updated.', Plant)), catchError(this.handleError('changeGrowthPhases', [])));
  }

  destroyPlants(Plant): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'destroyPlants'}]})
      return this.http.post(`${this.rootUrl}/plants/v1/destroyplants?licenseNumber=${FacilityService.facility}`, [Plant], {headers: this.header})
        .pipe(retry(3), tap(plant => this.successAlert('Plant has been marked as destroyed.', Plant)), catchError(this.handleError('destroyPlants', [])));
  }

  createClones(Plant): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createClones'}]})
      return this.http.post(`${this.rootUrl}/plants/v1/create/plantings?licenseNumber=${FacilityService.facility}`, [Plant], {headers: this.header})
        .pipe(retry(3), tap(plant => this.successAlert('Clones have been succesfully created.', Plant)), catchError(this.handleError('createClones', [])));
  }

  manicurePlants(Plant): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'manicurePlants'}]})
      return this.http.post(`${this.rootUrl}/plants/v1/manicureplants?licenseNumber=${FacilityService.facility}`, [Plant], {headers: this.header})
        .pipe(retry(3), tap(plant => this.successAlert('Plant manicuring has been recorded.', Plant)), catchError(this.handleError('manicurePlants', [])));
  }

  harvestPlants(Plant): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'harvestPlants'}]})
      return this.http.post(`${this.rootUrl}/plants/v1/harvestplants?licenseNumber=${FacilityService.facility}`, [Plant], {headers: this.header})
        .pipe(retry(3), tap(plant => this.successAlert('Plant harvesting has been recorded.', Plant)), catchError(this.handleError('harvestPlants', [])));
  }

  // harvests

  getHarvests(type: string): Observable<Harvest[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getHarvests'}]})
      return this.http.get<Harvest[]>(`${this.rootUrl}/harvests/v1/${type}?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3))
  }

  getHarvest(id: number): Observable<Harvest> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getHarvest'}]})
      return this.http.get<Harvest>(`${this.rootUrl}/harvests/v1/${id}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError<Harvest>(`getHarvest id=${id}`)));
  }

  createPackageFromHarvest(Harvest): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createPackageFromHarvest'}]})
      return this.http.post(`${this.rootUrl}/harvests/v1/createpackages?licenseNumber=${FacilityService.facility}`, [Harvest], {headers: this.header})
        .pipe(retry(3), tap(harvest => this.successAlert('Package has been created from harvest material.', Harvest)), catchError(this.handleError('createPackageFromHarvest', [])));
  }

  removeWaste(Waste): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'removeWaste'}]})
      return this.http.post(`${this.rootUrl}/harvests/v1/removewaste?licenseNumber=${FacilityService.facility}`, [Waste], {headers: this.header})
        .pipe(retry(3), tap(harvest => this.successAlert('Harvest waste has been recorded.', Harvest)), catchError(this.handleError('removeWaste', [])));
  }

  finishHarvest(Harvest): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'finishHarvest'}]})
      return this.http.post(`${this.rootUrl}/harvests/v1/finish?licenseNumber=${FacilityService.facility}`, [Harvest], {headers: this.header})
        .pipe(retry(3), tap(harvest => this.successAlert('Harvest has been marked as finished.', Harvest)), catchError(this.handleError('finishHarvest', [])));
  }

  unfinishHarvest(Harvest): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'unfinishHarvest'}]})
      return this.http.post(`${this.rootUrl}/harvests/v1/unfinish?licenseNumber=${FacilityService.facility}`, [Harvest], {headers: this.header})
        .pipe(retry(3), tap(harvest => this.successAlert('Harvest has been marked as unfinished.', Harvest)), catchError(this.handleError('unfinishHarvest', [])));
  }

  // items

  getItem(id: number): Observable<Item> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getItem'}]})
      return this.http.get<Item>(`${this.rootUrl}/items/v1/${id}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError<Item>(`getItem id=${id}`)));
  }

  getItems(): Observable<Item[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getItems'}]})
      return this.http.get<Item[]>(`${this.rootUrl}/items/v1/active?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3))
  }

  getItemCategories(): Observable<any[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getItemCategories'}]})
      return this.http.get<any[]>(`${this.rootUrl}/items/v1/categories`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError('getItemCategories', [])));
  }

  createItem(Item): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createItem'}]})
      return this.http.post(`${this.rootUrl}/items/v1/create?licenseNumber=${FacilityService.facility}`, [Item], {headers: this.header})
        .pipe(retry(3), tap(item => this.successAlert('New item has been succesfully created.', Item)), catchError(this.handleError('createItem', [])));
  }

  updateItem(Item): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'updateItem'}]})
      return this.http.post(`${this.rootUrl}/items/v1/update?licenseNumber=${FacilityService.facility}`, [Item], {headers: this.header})
        .pipe(retry(3), tap(item => this.successAlert('Item updates have been recorded.', Item)), catchError(this.handleError('updateItem', [])));
  }

  deleteItem(Item): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'deleteItem'}]})
      return this.http.delete(`${this.rootUrl}/items/v1/${Item.Id}?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3), tap(item => this.successAlert('Item has been deleted.', Item)), catchError(this.handleError('deleteItem', [])));
  }

  // packages

  getPackages(type: string): Observable<Package[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getPackages'}]})
      return this.http.get<Package[]>(`${this.rootUrl}/packages/v1/${type}?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3))
  }

  getPackage(id: number): Observable<Package> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getPackage'}]})
      return this.http.get<Package>(`${this.rootUrl}/packages/v1/${id}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError<Package>(`getPackage id=${id}`)));
  }

  createPackageFromPackages(Package): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createPackageFromPackages'}]})
      return this.http.post(`${this.rootUrl}/packages/v1/create?licenseNumber=${FacilityService.facility}`, [Package], {headers: this.header})
        .pipe(retry(3), tap(packages => this.successAlert('A new package has been created from other package\'s content.', Package)), catchError(this.handleError('createPackageFromPackages', [])));
  }

  createLabTestPackage(Package): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createLabTestPackage'}]})
      return this.http.post(`${this.rootUrl}/packages/v1/create/testing?licenseNumber=${FacilityService.facility}`, [Package], {headers: this.header})
        .pipe(retry(3), tap(packages => this.successAlert('Lab testing sample package successfully created.', Package)), catchError(this.handleError('createLabTestPackage', [])));
  }

  createPackageFromPlantings(Package): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createPackageFromPlantings'}]})
      return this.http.post(`${this.rootUrl}/packages/v1/create/plantings?licenseNumber=${FacilityService.facility}`, [Package], {headers: this.header})
        .pipe(retry(3), tap(packages => this.successAlert('A new planting package has been created.', Package)), catchError(this.handleError('createPackageFromPlantings', [])));
  }

  changePackageItem(Package): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'changePackageItem'}]})
      return this.http.post(`${this.rootUrl}/packages/v1/change/item?licenseNumber=${FacilityService.facility}`, [Package], {headers: this.header})
        .pipe(retry(3), tap(packages => this.successAlert('Package item updated.', Package)), catchError(this.handleError('changePackageItem', [])));
  }

  adjustPackage(Package): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'adjustPackage'}]})
      return this.http.post(`${this.rootUrl}/packages/v1/adjust?licenseNumber=${FacilityService.facility}`, [Package], {headers: this.header})
        .pipe(retry(3), tap(packages => this.successAlert('Package adjustment recorded.', Package)), catchError(this.handleError('adjustPackage', [])));
  }

  finishPackage(Package): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'finishPackage'}]})
      return this.http.post(`${this.rootUrl}/packages/v1/finish?licenseNumber=${FacilityService.facility}`, [Package], {headers: this.header})
        .pipe(retry(3), tap(packages => this.successAlert('Package has been marked as finished.', Package)), catchError(this.handleError('finishPackage', [])));
  }

  unfinishPackage(Package): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'unfinishPackage'}]})
      return this.http.post(`${this.rootUrl}/packages/v1/unfinish?licenseNumber=${FacilityService.facility}`, [Package], {headers: this.header})
        .pipe(retry(3), tap(packages => this.successAlert('Package has been marked as unfinished.', Package)), catchError(this.handleError('finishunfinishPackagePackage', [])));
  }

  remediatePackage(Package): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'remediatePackage'}]})
      return this.http.post(`${this.rootUrl}/packages/v1/remediate?licenseNumber=${FacilityService.facility}`, [Package], {headers: this.header})
        .pipe(retry(3), tap(packages => this.successAlert('Package has been remediated.', Package)), catchError(this.handleError('remediatePackage', [])));
  }

  // transfers

  getTransfers(): Observable<Transfer[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getTransfers'}]})
      return this.http.get<Transfer[]>(`${this.rootUrl}/transfers/v1/outgoing?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError('getTransfers', [])));
  }

  // sales receipts

  getSalesReceipts(): Observable<any[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getSalesReceipts'}]})
      return this.http.get<any[]>(`${this.rootUrl}/sales/v1/receipts?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError('getSalesReceipts', [])));
  }

  createSalesReceipt(Sale): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'createSalesReceipt'}]})
      return this.http.post(`${this.rootUrl}/sales/v1/receipts?licenseNumber=${FacilityService.facility}`, [Sale], {headers: this.header})
        .pipe(retry(3), catchError(this.handleError('createSalesReceipt', [])));
  }

  updateSalesReceipt(Sale): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'updateSalesReceipt'}]})
      return this.http.put(`${this.rootUrl}/sales/v1/receipts?licenseNumber=${FacilityService.facility}`, [Sale], {headers: this.header})
        .pipe(retry(3), catchError(this.handleError('updateSalesReceipt', [])));
  }

  voidSalesReceipt(id: number): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'voidSalesReceipt'}]})
      return this.http.delete(`${this.rootUrl}/sales/v1/receipts/${id}?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError('voidSalesReceipt', [])));
  }

  // lab tests

  getLabTestTypes(): Observable<any[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getLabTestTypes'}]})
      return this.http.get<any[]>(`${this.rootUrl}/labtests/v1/types?licenseNumber=${FacilityService.facility}`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError('getLabTestTypes', [])));
  }

  recordLabTest(Test): Observable<any> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'recordLabTest'}]})
      return this.http.post(`${this.rootUrl}/labtests/v1/record?licenseNumber=${FacilityService.facility}`, [Test], {headers: this.header})
        .pipe(retry(3), tap(packages => this.successAlert('Lab test succesfully recorded.', Package)), catchError(this.handleError('recordLabTest', [])));
  }

  // units of Measure

  getUnitsOfMeasure(): Observable<any[]> {
      firebase.analytics.logEvent({key: "metrc_service", parameters: [{key: "method", value: 'getUnitsOfMeasure'}]})
      return this.http.get<any[]>(`${this.rootUrl}/unitsofmeasure/v1/active`, {headers: this.header})
        .pipe(retry(3), catchError(this.handleError('getUnitsOfMeasure', [])));
  }


}
