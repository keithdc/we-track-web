import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {DialogInterface} from './dialog.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit, OnDestroy {
  #unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogConfig: DialogInterface,
    private matDialogRef: MatDialogRef<DialogComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll.next();
    this.#unsubscribeAll.complete();
  }

  handleSubmit(): void {
    this.matDialogRef.close({submit: true});
  }

  handleClose(): void {
    this.matDialogRef.close({submit: false});
  }
}
