import {NgModule} from '@angular/core';
import {TruckTypeComponent} from './truck-type.component';
import {TruckTypeRoutingModule} from './truck-type-routing.module';
import {CommonModule} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {TableComponent} from '../../shared/table/table.component';

@NgModule({
  declarations: [
    TruckTypeComponent,
  ],
  imports: [
    TruckTypeRoutingModule,
    CommonModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatPrefix,
    ReactiveFormsModule,
    TableComponent,
  ],
})
export class TruckTypeModule {
}
