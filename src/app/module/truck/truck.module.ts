import {NgModule} from '@angular/core';
import {TruckComponent} from './truck.component';
import {TruckRoutingModule} from './truck-routing.module';
import {CommonModule, NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {TableComponent} from '../../shared/table/table.component';

@NgModule({
  declarations: [
    TruckComponent,
  ],
  imports: [
    TruckRoutingModule,
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
export class TruckModule {
}
