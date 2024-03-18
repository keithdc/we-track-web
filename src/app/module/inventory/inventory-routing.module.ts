import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {InventoryComponent} from './inventory.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {
}
