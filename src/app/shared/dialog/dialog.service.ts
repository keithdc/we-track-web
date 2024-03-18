import {Injectable} from '@angular/core';
import {from, Observable, of} from 'rxjs';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {mergeAll, switchMap} from 'rxjs/operators';
import {DialogInterface} from './dialog.interface';
import {CloseDialogInterface} from './close-dialog.interface';
import {LazyLoadService} from './lazy-load.service';
import {DialogModule} from './dialog.module';
import {DialogComponent} from './dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private lazyLoadService: LazyLoadService,
    private matDialog: MatDialog,
  ) {
  }

  openDialog<T>(
    dialogConfig: DialogInterface
  ): Observable<CloseDialogInterface<T>> {
    return from(import(`./dialog.module`).then(m => {
      return this.lazyLoadService.compileModule(m.DialogModule).then(() => {
        const component = m.DialogModule.getDialogComponent();
        const matDialogConfig: MatDialogConfig = {
          minHeight: '25%',
          minWidth: '25%',
          data: dialogConfig,
        }
        const dialogRef: MatDialogRef<DialogComponent> = this.matDialog.open(component, matDialogConfig);
        dialogRef.afterOpened()
          .pipe()
          .subscribe(() => {
          });
        return dialogRef.afterClosed()
          .pipe(switchMap((data: CloseDialogInterface<T>) => {
            return of(data);
          }));
      });
    })).pipe(
      mergeAll(),
    );
  }
}
