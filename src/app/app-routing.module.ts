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
