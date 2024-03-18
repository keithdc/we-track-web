import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, SimpleSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {
  }

  openSnackBar(message: string, action: string | undefined,
               {
                 duration = 5000,
                 panelClass,
                 horizontalPosition = 'center',
                 verticalPosition = 'bottom'
               }:
                 {
                   duration?: number;
                   panelClass?: string;
                   horizontalPosition?: MatSnackBarHorizontalPosition;
                   verticalPosition?: MatSnackBarVerticalPosition;
                 } = {}): MatSnackBarRef<SimpleSnackBar> {
    const config: MatSnackBarConfig = {duration, horizontalPosition, verticalPosition};
    if (panelClass) {
      config.panelClass = panelClass;
    }
    return this.snackBar.open(message, action, config);
  }
}
