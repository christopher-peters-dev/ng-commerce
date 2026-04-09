import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { AppStore } from '../../store';
import { slugify } from '../../utils/slugify';

@Component({
  selector: 'app-products-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard, MatSidenavContainer, MatSidenav, MatSidenavContent, RouterLink],
  template: `
    <mat-sidenav-container class="h-screen">
      <mat-sidenav mode="side" opened class="w-64 bg-white p-6">
        <h2 class="text-xl font-semibold mb-4">Categories</h2>
        <nav class="flex flex-col gap-2">
          @for (category of store.categories(); track category) {
            <a
              [routerLink]="['/products', slugify(category)]"
              class="px-3 py-2 rounded hover:bg-gray-200 transition-colors cursor-pointer"
              [class.bg-gray-300]="slugify(category) === store.normalizedCategory()"
            >
              {{ category }}
            </a>
          }
        </nav>
      </mat-sidenav>
      <mat-sidenav-content mode="side" class="bg-slate-100 p-6">
        <h1 class="text-2xl font-bold mt-2 col-span-full mb-6">{{ store.selectedCategoryLabel() }}</h1>
        <div class="responsive-grid">
          @for (product of store.filteredProducts(); track product.id) {
            <app-product-card [product]="product"></app-product-card>
          }
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: ``,
})
export class ProductsGrid {
  private readonly router = inject(Router);
  protected readonly store = inject(AppStore);
  protected readonly slugify = slugify;

  category = input('all');

  constructor() {
    effect(() => {
      const category = this.category();
      this.store.setCategory(category);

      if (!this.store.validCategorySlugs().has(this.store.normalizedCategory())) {
        void this.router.navigateByUrl('/products/all', { replaceUrl: true });
      }
    });
  }
}
