import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { AppStore } from '../../store';

@Component({
  selector: 'app-my-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard, MatButton, MatIcon, RouterLink],
  template: `
    <section class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          matButton
          routerLink="/"
          class="inline-flex w-fit items-center gap-2 rounded px-0 text-slate-700"
          aria-label="Continue shopping"
        >
          <mat-icon>arrow_back</mat-icon>
          Continue Shopping
        </a>

        <div class="text-sm font-semibold text-slate-500 sm:text-right">
          {{ cartCount() }} items
        </div>
      </header>

      <div class="responsive-grid">
        @for (product of store.cart(); track product.id) {
          <app-product-card [product]="product" view="cart"></app-product-card>
        }
      </div>

      @if (cartCount() === 0) {
        <div
          class="rounded border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-slate-600"
        >
          Your cart is empty.
        </div>
      } @else {
        <div class="flex justify-end pt-2">
          <button
            matButton
            type="button"
            class="inline-flex items-center gap-2 px-0 text-slate-700"
            aria-label="Clear cart"
            (click)="clearCart()"
          >
            <mat-icon>delete_sweep</mat-icon>
            Clear Cart
          </button>
        </div>
      }
    </section>
  `,
  styles: ``,
})
export class MyCart {
  protected readonly store = inject(AppStore);
  protected readonly cartCount = computed(() => this.store.cart().length);

  protected clearCart(): void {
    this.store.clearCart();
  }
}
