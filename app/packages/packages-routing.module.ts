import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { PackageListComponent } from "./package-list.component";
import { PackageDetailComponent } from "./package-detail/package-detail.component";
import { AdjustComponent } from "./adjust/adjust.component";
import { ChangeItemComponent } from "./changeitem/changeitem.component";
import { CreateComponent } from "./create/create.component";
import { CreatePlantingsComponent } from "./createplantings/createplantings.component";
import { CreateTestingComponent } from "./createtesting/createtesting.component";
import { RemediateComponent } from "./remediate/remediate.component";

const routes: Routes = [
    { path: "", component: PackageListComponent },
    { path: "package-detail/:id", component: PackageDetailComponent },
    { path: "adjust/:id", component: AdjustComponent },
    { path: "changeitem/:id", component: ChangeItemComponent },
    { path: "create", component: CreateComponent },
    { path: "createplantings/:id", component: CreatePlantingsComponent },
    { path: "createtesting", component: CreateTestingComponent },
    { path: "remediate/:id", component: RemediateComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class PackagesRoutingModule { }
