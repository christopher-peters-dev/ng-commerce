import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import PRODUCTS from '../../data/products';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard, MatSidenavContainer, MatSidenav, MatSidenavContent, RouterLink],
  template: `
    <mat-sidenav-container class="h-screen">
      <mat-sidenav mode="side" opened class="w-64 bg-white p-6">
        <h2 class="text-xl font-semibold mb-4">Categories</h2>
        <nav class="flex flex-col gap-2">
          @for (category of categories(); track category) {
            <a
              [routerLink]="['/products', slugify(category)]"
              class="px-3 py-2 rounded hover:bg-gray-200 transition-colors cursor-pointer"
              [class.bg-gray-300]="slugify(category) === normalizedCategory()"
            >
              {{ category }}
            </a>
          }
        </nav>
      </mat-sidenav>
      <mat-sidenav-content mode="side" class="bg-gray-100 p-6">
        <h1 class="text-2xl font-bold mt-2 col-span-full mb-6">{{ selectedCategoryLabel() }}</h1>
        <div class="responsive-grid">
          @for (product of filteredProducts(); track product.id) {
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

  category = input('all');
  products = signal<Product[]>(PRODUCTS);
  normalizedCategory = computed(() => this.slugify(this.category()));
  categories = computed(() => [
    'All',
    ...new Set(this.products().map((product) => product.category)),
  ]);
  validCategorySlugs = computed(
    () => new Set(this.categories().map((category) => this.slugify(category))),
  );

  constructor() {
    effect(() => {
      const category = this.category();

      if (!this.validCategorySlugs().has(this.slugify(category))) {
        void this.router.navigateByUrl('/products/all', { replaceUrl: true });
      }
    });
  }

  filteredProducts = computed(() => {
    const category = this.normalizedCategory();
    return category === 'all'
      ? this.products()
      : this.products().filter((product) => this.slugify(product.category) === category);
  });

  protected slugify(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '-');
  }

  protected selectedCategoryLabel = computed(() => {
    const category = this.categories().find(
      (item) => this.slugify(item) === this.normalizedCategory(),
    );

    return category ?? 'All';
  });
}
