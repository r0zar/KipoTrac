import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";

import { SharedModule } from "../shared/shared.module";
import { BatchDetailCreateComponent } from "./batch-detail-create/batch-detail-create-component";
import { BatchDetailPackageComponent } from "./batch-detail-package/batch-detail-package.component";
import { BatchDetailGrowthPhaseComponent } from "./batch-detail-growthphase/batch-detail-growthphase.component";
import { DestroyComponent } from "./destroy/destroy.component";
import { BatchDetailComponent } from "./batch-detail/batch-detail.component";
import { BatchListComponent } from "./batch-list.component";
import { BatchesRoutingModule } from "./batches-routing.module";
import { BatchEditService } from "./shared/batch-edit.service";
import { BatchService } from "./shared/batch.service";
import { BarcodeScanner } from 'nativescript-barcodescanner';

@NgModule({
    imports: [
        BatchesRoutingModule,
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptUIDataFormModule,
        SharedModule
    ],
    declarations: [
        BatchListComponent,
        BatchDetailComponent,
        BatchDetailCreateComponent,
        BatchDetailPackageComponent,
        BatchDetailGrowthPhaseComponent,
        DestroyComponent,
    ],
    entryComponents: [
    ],
    providers: [
        BatchService,
        BatchEditService,
        BarcodeScanner
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class BatchesModule { }
