import { MatSnackBar } from "@angular/material/snack-bar";

export class SnackBarUtils {

  static openSnackBar(message: string, duration: number, snackbar: MatSnackBar) : void {
    snackbar.open(message, 'Close', {
      duration: duration,         // Duration is in ms
      verticalPosition: "bottom", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "end"   // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

}
