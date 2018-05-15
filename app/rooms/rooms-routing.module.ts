import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { RoomListComponent } from "./room-list.component";
import { RoomDetailComponent } from "./room-detail/room-detail.component";
import { CreateComponent } from "./create/create.component";
import { EditComponent } from "./edit/edit.component";

const routes: Routes = [
    { path: "", component: RoomListComponent },
    { path: "room-detail/:id", component: RoomDetailComponent },
    { path: "create", component: CreateComponent },
    { path: "edit/:id", component: EditComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class RoomsRoutingModule { }
