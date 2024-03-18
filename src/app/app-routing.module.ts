import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

export const routes: Routes = [
  {
    path: 'inventory',
    loadChildren: () => import('./module/inventory/inventory.module').then(m => m.InventoryModule),
  },
  {
    path: 'product',
    loadChildren: () => import('./module/product/product.module').then(m => m.ProductModule),
  },
  {
    path: 'sales',
    loadChildren: () => import('./module/sales/sales.module').then(m => m.SalesModule),
  },
  {
    path: 'log',
    loadChildren: () => import('./module/log/log.module').then(m => m.LogModule),
  },
  {
    path: 'rate',
    loadChildren: () => import('./module/rate/rate.module').then(m => m.RateModule),
  },
  {
    path: 'truck',
    loadChildren: () => import('./module/truck/truck.module').then(m => m.TruckModule),
  },
  {
    path: 'company',
    loadChildren: () => import('./module/company/company.module').then(m => m.CompanyModule),
  },
  {
    path: 'truck-type',
    loadChildren: () => import('./module/truck-type/truck-type.module').then(m => m.TruckTypeModule),
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
