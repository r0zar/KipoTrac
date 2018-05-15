import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { StrainListComponent } from "./strain-list.component";
import { StrainDetailComponent } from "./strain-detail/strain-detail.component";
import { EditComponent } from "./edit/edit.component";
import { CreateComponent } from "./create/create.component";

const routes: Routes = [
    { path: "", component: StrainListComponent },
    { path: "strain-detail/:id", component: StrainDetailComponent },
    { path: "edit/:id", component: EditComponent },
    { path: "create", component: CreateComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class StrainsRoutingModule { }
