import {MatDialogConfig} from '@angular/material/dialog';
import {EmbeddedViewRef, TemplateRef} from '@angular/core';

export interface DialogInterface extends MatDialogConfig {
  title: string;
  saveTitle: string;
  content: TemplateRef<DialogInterface>;
}

