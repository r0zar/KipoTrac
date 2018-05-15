import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { BatchListComponent } from "./batch-list.component";
import { BatchDetailComponent } from "./batch-detail/batch-detail.component";
import { BatchDetailCreateComponent } from "./batch-detail-create/batch-detail-create-component";
import { BatchDetailPackageComponent } from "./batch-detail-package/batch-detail-package.component";
import { BatchDetailGrowthPhaseComponent } from "./batch-detail-growthphase/batch-detail-growthphase.component";
import { DestroyComponent } from "./destroy/destroy.component";

const routes: Routes = [
    { path: "", component: BatchListComponent },
    { path: "batch-detail/:id", component: BatchDetailComponent },
    { path: "batch-detail-create", component: BatchDetailCreateComponent },
    { path: "batch-detail-package/:id", component: BatchDetailPackageComponent },
    { path: "batch-detail-growthphase/:id", component: BatchDetailGrowthPhaseComponent },
    { path: "destroy/:id", component: DestroyComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class BatchesRoutingModule { }
