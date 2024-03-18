import {NgModule} from '@angular/core';
import {SalesComponent} from './sales.component';
import {SalesRoutingModule} from './sales-routing.module';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [
    SalesComponent,
  ],
  imports: [
    SalesRoutingModule,
    CommonModule,
  ],
})
export class SalesModule {
}
