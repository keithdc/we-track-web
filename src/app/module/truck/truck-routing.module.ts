import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {TruckComponent} from './truck.component';

const routes: Routes = [
  {
    path: '',
    component: TruckComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TruckRoutingModule {
}
