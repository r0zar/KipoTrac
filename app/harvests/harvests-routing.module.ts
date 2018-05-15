import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HarvestListComponent } from "./harvest-list.component";
import { HarvestDetailComponent } from "./harvest-detail/harvest-detail.component";
import { CreatePackageComponent } from "./createpackage/createpackage.component";
import { RemoveWasteComponent } from "./removewaste/removewaste.component";

const routes: Routes = [
    { path: "", component: HarvestListComponent },
    { path: "harvest-detail/:id", component: HarvestDetailComponent },
    { path: "createpackage/:id", component: CreatePackageComponent },
    { path: "removewaste/:id", component: RemoveWasteComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class HarvestsRoutingModule { }
