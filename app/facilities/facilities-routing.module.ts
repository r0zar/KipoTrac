import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { FacilityListComponent } from "./facility-list.component";
import { FacilityDetailComponent } from "./facility-detail/facility-detail.component";

const routes: Routes = [
    { path: "", component: FacilityListComponent },
    { path: "facility-detail/:id", component: FacilityDetailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class FacilitiesRoutingModule { }
