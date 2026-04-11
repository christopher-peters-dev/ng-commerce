import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../store';

@Component({
  selector: 'app-my-cart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, MatButton, MatIcon, MatIconButton, RouterLink],
  template: `
    <section class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
      <header
        class="mt-4 flex flex-col gap-4 rounded-[6px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5"
      >
        <div class="flex items-center gap-2 text-lg font-semibold text-slate-950">
          <span>Wishlist</span>
          <mat-icon class="small text-rose-500">favorite</mat-icon>
          <span class="text-sm font-medium text-slate-500">({{ wishlistCount() }})</span>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <a
            matButton
            routerLink="/wishlist"
            class="inline-flex items-center gap-2 text-slate-700"
            aria-label="View all wishlist items"
          >
            View All
          </a>
          <a
            matButton="filled"
            routerLink="/products/all"
            class="inline-flex items-center gap-2"
            aria-label="Add more items to cart"
          >
            <mat-icon>shopping_cart</mat-icon>
            Add to Cart
          </a>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section class="space-y-4 rounded-[6px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div class="flex items-center justify-between gap-3">
            <h1 class="text-xl font-semibold text-slate-950">Cart Items</h1>
            <span class="text-sm font-medium text-slate-500">{{ cartCount() }} items</span>
          </div>

          @if (cartCount() === 0) {
            <div
              class="rounded-[6px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-slate-600"
            >
              Your cart is empty.
            </div>
          } @else {
            <div class="space-y-4">
              @for (item of store.cart(); track item.id) {
                <article
                  class="flex flex-col gap-4 rounded-[6px] border border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                  [attr.data-cart-item]="item.id"
                >
                  <div class="flex min-w-0 items-center gap-4">
                    <img
                      [src]="item.imageUrl"
                      [alt]="item.title"
                      class="h-24 w-24 rounded-[6px] object-cover"
                    />

                    <div class="min-w-0">
                      <h2 class="truncate text-base font-semibold text-slate-950">{{ item.title }}</h2>
                      <p class="mt-1 text-sm font-medium text-slate-500">
                        {{ item.price | currency }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
                    <div class="flex items-center rounded-[6px] border border-slate-200 bg-white">
                      <button
                        matIconButton
                        type="button"
                        class="small text-slate-600"
                        [disabled]="item.quantity === 1"
                        [attr.aria-label]="'Decrease quantity for ' + item.title"
                        (click)="decrementQuantity(item.id)"
                      >
                        <mat-icon>remove</mat-icon>
                      </button>
                      <span
                        class="min-w-10 text-center text-sm font-semibold text-slate-900"
                        [attr.aria-label]="'Quantity for ' + item.title + ': ' + item.quantity"
                      >
                        {{ item.quantity }}
                      </span>
                      <button
                        matIconButton
                        type="button"
                        class="small text-slate-600"
                        [attr.aria-label]="'Increase quantity for ' + item.title"
                        (click)="incrementQuantity(item.id)"
                      >
                        <mat-icon>add</mat-icon>
                      </button>
                    </div>

                    <div class="min-w-28 text-right">
                      <div class="text-lg font-semibold text-slate-950">
                        {{ item.price * item.quantity | currency }}
                      </div>
                      <div class="mt-2 flex justify-end gap-1">
                        <button
                          matIconButton
                          type="button"
                          class="small text-slate-600"
                          [attr.aria-label]="'Move ' + item.title + ' to wishlist'"
                          (click)="moveToWishlist(item.id)"
                        >
                          <mat-icon>{{ wishlistIcon(item.id) }}</mat-icon>
                        </button>
                        <button
                          matIconButton
                          type="button"
                          class="small danger"
                          [attr.aria-label]="'Remove ' + item.title + ' from cart'"
                          (click)="removeFromCart(item.id)"
                        >
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              }
            </div>

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

        <aside class="rounded-[6px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 class="text-xl font-semibold text-slate-950">Order Summary</h2>

          <table class="mt-4 w-full text-sm text-slate-600">
            <tbody>
              <tr>
                <td class="py-2">Subtotal</td>
                <td class="py-2 text-right font-medium text-slate-900">
                  {{ cartSubtotal() | currency }}
                </td>
              </tr>
              <tr>
                <td class="py-2">Tax (7.5%)</td>
                <td class="py-2 text-right font-medium text-slate-900">
                  {{ taxAmount() | currency }}
                </td>
              </tr>
              <tr class="border-t border-slate-200">
                <td class="py-3 text-base font-semibold text-slate-950">Total</td>
                <td class="py-3 text-right text-base font-semibold text-slate-950">
                  {{ orderTotal() | currency }}
                </td>
              </tr>
            </tbody>
          </table>

          <button
            matButton="filled"
            type="button"
            class="mt-6 inline-flex w-full items-center justify-center gap-2"
            [disabled]="cartCount() === 0"
          >
            Proceed to checkout
          </button>
        </aside>
      </div>
    </section>
  `,
  styles: ``,
})
export class MyCart {
  protected readonly store = inject(AppStore);
  protected readonly wishlistCount = this.store.wishlistCount;
  protected readonly cartCount = this.store.cartCount;
  protected readonly cartSubtotal = this.store.cartSubtotal;
  protected readonly taxAmount = computed(() => this.cartSubtotal() * 0.075);
  protected readonly orderTotal = computed(() => this.cartSubtotal() + this.taxAmount());

  protected decrementQuantity(productId: string): void {
    this.store.decrementCartQuantity(productId);
  }

  protected incrementQuantity(productId: string): void {
    this.store.incrementCartQuantity(productId);
  }

  protected clearCart(): void {
    this.store.clearCart();
  }

  protected moveToWishlist(productId: string): void {
    this.store.moveCartToWishlist(productId);
  }

  protected removeFromCart(productId: string): void {
    this.store.removeCart(productId);
  }

  protected wishlistIcon(productId: string): string {
    return this.store.wishlist().some((item) => item.id === productId) ? 'favorite' : 'favorite_border';
  }
}
