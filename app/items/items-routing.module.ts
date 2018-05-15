import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ItemListComponent } from "./item-list.component";
import { ItemDetailComponent } from "./item-detail/item-detail.component";
import { ItemDetailEditComponent } from "./item-detail-edit/item-detail-edit-component";
import { ItemDetailCreateComponent } from "./item-detail-create/item-detail-create-component";

const routes: Routes = [
    { path: "", component: ItemListComponent },
    { path: "item-detail/:id", component: ItemDetailComponent },
    { path: "item-detail-edit/:id", component: ItemDetailEditComponent },
    { path: "item-detail-create", component: ItemDetailCreateComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ItemsRoutingModule { }
