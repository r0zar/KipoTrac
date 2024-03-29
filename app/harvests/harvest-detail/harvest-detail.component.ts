import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import { DataFormEventData } from "nativescript-ui-dataform";
import { Harvest } from "../shared/harvest.model";
import { MetrcService } from "../../shared/metrc.service";
import * as dialogs from "ui/dialogs";
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';
import { Image } from 'tns-core-modules/ui/image';
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from "ui/page";
import { screen } from 'platform';


/* ***********************************************************
* This is the harvest details component in the master-detail structure.
* This component retrieves the passed parameter from the master list component,
* finds the data harvest by this parameter and displays the detailed data harvest information.
*************************************************************/
@Component({
    selector: "HarvestDetail",
    moduleId: module.id,
    templateUrl: "./harvest-detail.component.html"
})
export class HarvestDetailComponent implements OnInit {
    private _harvest: Harvest;
    private name: string;
    private _fabMenuOpen: boolean = false;
    private _isLoading: boolean = false;
    private isFinished: boolean = false;
    private imageHeight: number = screen.mainScreen.heightDIPs / 2;
    private screenHeight: number = screen.mainScreen.heightDIPs * 1.2 - this.imageHeight;

    constructor(
        private _metrcService: MetrcService,
        private _pageRoute: PageRoute,
        private _routerExtensions: RouterExtensions
    ) { }

    ngOnInit(): void {
        this._pageRoute.activatedRoute
            .switchMap((activatedRoute) => activatedRoute.params)
            .forEach((params) => {
                this._metrcService.getHarvest(params.id)
                    .subscribe((harvest: Harvest) => {
                        this._harvest = new Harvest(harvest);
                        this.name = this._harvest.Name
                        this.isFinished = this._harvest.FinishedDate ? true : false
                    });
            });
    }

    onScroll(event: ScrollEventData, scrollView: ScrollView, topView: View, fabView: View, actionItem1: View, actionItem2: View, actionItem3: View, actionItem4: View) {
        // If the header content is still visiible
        if (scrollView.verticalOffset < this.imageHeight) {
            const offset = scrollView.verticalOffset / 2;
            if (scrollView.ios) {
                // iOS adjust the position with an animation to create a smother scrolling effect.
                topView.animate({ translate: { x: 0, y: offset } }).then(() => { }, () => { });
                fabView.animate({ translate: { x: offset, y: -1 * offset } }).then(() => { }, () => { });
                if (this._fabMenuOpen) {
                  actionItem1.animate({ opacity: 1-offset/50 }).then(() => { }, () => { });
                  actionItem2.animate({ opacity: 1-offset/50 }).then(() => { }, () => { });
                  actionItem3.animate({ opacity: 1-offset/50 }).then(() => { }, () => { });
                  actionItem4.animate({ opacity: 1-offset/50 }).then(() => { }, () => { });
                } else {
                  actionItem1.animate({ translate: { x: offset, y: -1 * offset } }).then(() => { }, () => { });
                  actionItem2.animate({ translate: { x: offset, y: -1 * offset } }).then(() => { }, () => { });
                  actionItem3.animate({ translate: { x: offset, y: -1 * offset } }).then(() => { }, () => { });
                  actionItem4.animate({ translate: { x: offset, y: -1 * offset } }).then(() => { }, () => { });
                }
            } else {
                // Android, animations are jerky so instead just adjust the position without animation.
                topView.translateY = Math.floor(offset);
                fabView.translateY = Math.floor(-1 * offset);
                fabView.translateX = Math.floor(offset);
                if (this._fabMenuOpen) {
                  actionItem1.opacity = 1-offset/50
                  actionItem2.opacity = 1-offset/50
                  actionItem3.opacity = 1-offset/50
                  actionItem4.opacity = 1-offset/50
                } else {
                  actionItem1.translateY = Math.floor(-1 * offset);
                  actionItem1.translateX = Math.floor(offset);
                  actionItem2.translateY = Math.floor(-1 * offset);
                  actionItem2.translateX = Math.floor(offset);
                  actionItem3.translateY = Math.floor(-1 * offset);
                  actionItem3.translateX = Math.floor(offset);
                  actionItem4.translateY = Math.floor(-1 * offset);
                  actionItem4.translateX = Math.floor(offset);
                }
            }
        }
    }

    fabTap(actionItem1: View, actionItem2: View, actionItem3: View, actionItem4: View): void {
      this._fabMenuOpen = !this._fabMenuOpen
      if (this._fabMenuOpen) {
        actionItem1.animate({ translate: { x: -70, y: 0 } }).then(() => { }, () => { });
        actionItem2.animate({ translate: { x: -50, y: -60 } }).then(() => { }, () => { });
        if (this.isFinished) {actionItem4.animate({ translate: { x: -30, y: -120 } }).then(() => { }, () => { })}
        else {actionItem3.animate({ translate: { x: -30, y: -120 } }).then(() => { }, () => { })}
      } else {
        actionItem1.animate({ translate: { x: 0, y: 0 } }).then(() => { }, () => { });
        actionItem2.animate({ translate: { x: 0, y: 0 } }).then(() => { }, () => { });
        if (this.isFinished) {actionItem4.animate({ translate: { x: 0, y: 0 } }).then(() => { }, () => { })}
        else {actionItem3.animate({ translate: { x: 0, y: 0 } }).then(() => { }, () => { })}
      }
    }

    actionItem1Tap(): void {
      console.log('create package from harvest')
      this._routerExtensions.navigate(["/harvests/createpackage", this._harvest.Id],
          {
              animated: true,
              transition: {
                  name: "flipLeft",
                  duration: 500,
                  curve: "linear"
              }
          });
    }

    actionItem2Tap(): void {
      console.log('remove waste from harvest')
      this._routerExtensions.navigate(["/harvests/removewaste", this._harvest.Id],
          {
              animated: true,
              transition: {
                  name: "flipLeft",
                  duration: 500,
                  curve: "linear"
              }
          });
    }

    actionItem3Tap(): void {
      dialogs.confirm({
          title: "Finish Harvest",
          message: "Would you like to mark this harvest as finished?",
          okButtonText: "Yes",
          cancelButtonText: "No",
          neutralButtonText: "Cancel"
      }).then(result => {
        console.log('finish harvest')
        this._isLoading = true;
        this._metrcService.finishHarvest({Id: this._harvest.Id, ActualDate: new Date()})
          .subscribe(() => {
            this._isLoading = false
            this._routerExtensions.backToPreviousPage();
          })
      });
    }

    actionItem4Tap(): void {
      dialogs.confirm({
          title: "Restore Harvest",
          message: "Would you like to restore this harvest?",
          okButtonText: "Yes",
          cancelButtonText: "Cancel"
      }).then(result => {
        console.log('unfinish harvest')
        this._isLoading = true;
        this._metrcService.unfinishHarvest({Id: this._harvest.Id})
          .subscribe(() => {
            this._isLoading = false
            this._routerExtensions.backToPreviousPage();
          })
      });
    }

    get harvest(): Harvest {
        return this._harvest;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    /* ***********************************************************
    * The back button is essential for a master-detail feature.
    *************************************************************/
    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

    /* ***********************************************************
    * The master-detail template comes with an example of an harvest edit page.
    * Check out the edit page in the /harvests/harvest-detail-edit folder.
    *************************************************************/
    onEditButtonTap(): void {
        this._routerExtensions.navigate(["/harvests/harvest-detail-edit", this._harvest.Id],
            {
                animated: true,
                transition: {
                    name: "slideTop",
                    duration: 200,
                    curve: "ease"
                }
            });
    }
}
