import { Routes } from '@angular/router';
import { MyCart } from './pages/my-cart/my-cart';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products/all',
    pathMatch: 'full',
  },
  {
    path: 'products/:category',
    loadComponent: () => import('./pages/products-grid/products-grid').then((m) => m.ProductsGrid),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/my-wishlist/my-wishlist').then((m) => m.MyWishlist),
  },
  {
    path: 'cart',
    component: MyCart,
  },
  {
    path: '**',
    redirectTo: 'products/all',
  },
];
