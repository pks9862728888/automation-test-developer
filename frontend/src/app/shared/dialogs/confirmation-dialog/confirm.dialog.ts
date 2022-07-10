import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConfirmDialogDAO } from "./confirm.dialog.dao";

@Component({
    templateUrl: "./confirm.dialog.html"
})
export class ConfirmDialog {

    constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogDAO,
                private dialogRef: MatDialogRef<ConfirmDialog>) {
    }

    yesButtonClicked(): void {
        this.dialogRef.close(true);
    }

}