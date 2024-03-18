import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {TruckTypeComponent} from './truck-type.component';

const routes: Routes = [
  {
    path: '',
    component: TruckTypeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TruckTypeRoutingModule {
}
