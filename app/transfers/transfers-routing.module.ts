import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { TransferListComponent } from "./transfer-list.component";
import { TransferDetailComponent } from "./transfer-detail/transfer-detail.component";

const routes: Routes = [
    { path: "", component: TransferListComponent },
    { path: "transfer-detail/:id", component: TransferDetailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class TransfersRoutingModule { }
