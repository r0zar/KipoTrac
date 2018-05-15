import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { PlantsComponent } from "./plants.component";
import { PlantDetailComponent } from "./plant-detail/plant-detail.component";
import { ChangeGrowthPhasesComponent } from "./changegrowthphases/changegrowthphases.component";
import { CreatePlantingsComponent } from "./createplantings/createplantings.component"
import { DestroyComponent } from "./destroy/destroy.component"
import { HarvestComponent } from "./harvest/harvest.component"
import { ManicureComponent } from "./manicure/manicure.component"
import { MoveComponent } from "./move/move.component"

const routes: Routes = [
    { path: "", component: PlantsComponent },
    { path: "plant-detail/:id", component: PlantDetailComponent },
    { path: "changegrowthphases/:id", component: ChangeGrowthPhasesComponent },
    { path: "createplantings/:id", component: CreatePlantingsComponent },
    { path: "destroy/:id", component: DestroyComponent },
    { path: "harvest/:id", component: HarvestComponent },
    { path: "manicure/:id", component: ManicureComponent },
    { path: "move/:id", component: MoveComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class PlantsRoutingModule { }
