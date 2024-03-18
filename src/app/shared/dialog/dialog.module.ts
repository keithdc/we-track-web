import {NgIf, NgTemplateOutlet} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DialogComponent} from './dialog.component';

@NgModule({
  declarations: [
    DialogComponent,
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgTemplateOutlet
  ],
})
export class DialogModule {
  static getDialogComponent(): typeof DialogComponent {
    return DialogComponent;
  }
}
