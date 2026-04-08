import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Product } from '../../models/product';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-card',
  imports: [MatButton, MatIcon],
  template: ` <div class="relative h-full rounded bg-white shadow-xl">
    <img
      [src]="product().imageUrl"
      alt="{{ product().title }}"
      class="w-full h-48 object-cover mb-4 rounded-t"
    />
    <div class="flex h-full flex-col px-4 py-2 pb-18">
      <h2 class="text-lg font-semibold">{{ product().title }}</h2>
      <p class="text-gray-600">{{ product().description }}</p>
    </div>
    <div class="absolute right-0 bottom-0 left-0 flex items-center justify-between px-4 pb-4">
      @if (!product().isStock) {
        <span class="text-sm font-medium text-red-600">Out of Stock</span>
      } @else {
        <span class="text-xl font-bold text-green-600">\${{ product().price }}</span>
      }

      <button
        matButton="filled"
        class="flex gap-2 items-center"
        color="primary"
        [disabled]="!product().isStock"
      >
        <mat-icon>shopping_cart</mat-icon>
        Add to Cart
      </button>
    </div>
  </div>`,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
  `,
})
export class ProductCard {
  product = input.required<Product>();
}
