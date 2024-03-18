import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {NgModule} from '@angular/core';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryComponent} from './inventory.component';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableComponent} from '../../shared/table/table.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [
    InventoryComponent,
  ],
  imports: [
    InventoryRoutingModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    ReactiveFormsModule,
    TableComponent,
    MatIconModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class InventoryModule {
}
