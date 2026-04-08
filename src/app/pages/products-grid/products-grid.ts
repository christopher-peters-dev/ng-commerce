import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import PRODUCTS from '../../data/products';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard],
  template: `
    <div class="bg-gray-100 p-6 grid-cols-4 gap-6 grid">
      <h1 class="text-2xl font-bold mt-2 col-span-full">{{ category().toUpperCase() }}</h1>
      @for (product of filteredProducts(); track product.id) {
        <app-product-card [product]="product"></app-product-card>
      }
    </div>
  `,
  styles: ``,
})
export class ProductsGrid {
  private readonly router = inject(Router);

  category = input('all');
  products = signal<Product[]>(PRODUCTS);
  validCategories = computed(
    () => new Set(['all', ...this.products().map((product) => product.category)]),
  );

  constructor() {
    effect(() => {
      const category = this.category();

      if (!this.validCategories().has(category)) {
        void this.router.navigateByUrl('/products/all', { replaceUrl: true });
      }
    });
  }

  filteredProducts = computed(() => {
    const category = this.category();
    return category === 'all'
      ? this.products()
      : this.products().filter((p) => p.category === category);
  });
}
