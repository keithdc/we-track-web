import {NgModule} from '@angular/core';
import {RateComponent} from './rate.component';
import {RateRoutingModule} from './rate-routing.module';
import {CommonModule, NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {TableComponent} from '../../shared/table/table.component';

@NgModule({
  declarations: [
    RateComponent,
  ],
  imports: [
    RateRoutingModule,
    CommonModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatPrefix,
    ReactiveFormsModule,
    TableComponent,
    NgForOf,
  ],
})
export class RateModule {
}
