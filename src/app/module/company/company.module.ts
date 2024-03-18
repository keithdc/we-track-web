import {NgModule} from '@angular/core';
import {CompanyComponent} from './company.component';
import {CompanyRoutingModule} from './company-routing.module';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {TableComponent} from '../../shared/table/table.component';

@NgModule({
  declarations: [
    CompanyComponent,
  ],
  imports: [
    CompanyRoutingModule,
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
    NgIf
  ],
})
export class CompanyModule {
}
