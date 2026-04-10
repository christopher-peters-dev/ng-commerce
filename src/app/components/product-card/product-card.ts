import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Product } from '../../models/product';
import { AppStore } from '../../store';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
  template: ` <div
    class="relative h-full overflow-hidden rounded bg-white shadow-xl transition-all duration-200 ease-out motion-reduce:transition-none"
    [class.translate-y-1]="isRemoving()"
    [class.opacity-0]="isRemoving()"
  >
    <div class="relative">
      <img
        [src]="product().imageUrl"
        alt="{{ product().title }}"
        class="mb-4 h-48 w-full rounded-t object-cover"
      />
      @if (product().isStock) {
        <button
          type="button"
          class="absolute top-3 right-3 flex h-10 min-w-10 items-center justify-center rounded border px-2 shadow-sm outline-none backdrop-blur-sm transition-colors"
          [attr.aria-label]="actionLabel()"
          [attr.aria-pressed]="view() === 'default' ? liked() : null"
          [class.border-slate-200]="view() === 'wishlist'"
          [class.bg-white/90]="view() === 'wishlist'"
          [class.text-slate-600]="view() === 'wishlist'"
          [class.border-transparent]="view() !== 'wishlist' && liked()"
          [class.bg-rose-50]="view() !== 'wishlist' && liked()"
          [class.text-rose-500]="view() !== 'wishlist' && liked()"
          [class.border-slate-200/80]="view() !== 'wishlist' && !liked()"
          [class.bg-white/85]="view() !== 'wishlist' && !liked()"
          [class.text-slate-500]="view() !== 'wishlist' && !liked()"
          (click)="toggleLiked()"
        >
          <mat-icon>{{ actionIcon() }}</mat-icon>
        </button>
      }
    </div>
    <div class="flex h-full flex-col px-4 py-2 pb-18">
      <h2 class="text-lg font-semibold">{{ product().title }}</h2>
      <div class="mt-2 flex items-center gap-2">
        <div
          class="flex items-center gap-0.5"
          [attr.aria-label]="product().rating + ' out of 5 stars'"
          [class.text-amber-600]="ratingTone() === 'good'"
          [class.text-emerald-600]="ratingTone() === 'excellent'"
          [class.text-rose-600]="ratingTone() === 'low'"
          [class.text-sky-600]="ratingTone() === 'fair'"
        >
          @for (star of starPositions; track star) {
            <mat-icon class="text-base">{{
              star <= filledStars() ? 'star' : 'star_border'
            }}</mat-icon>
          }
        </div>
        <span
          class="text-sm font-semibold"
          [class.text-amber-700]="ratingTone() === 'good'"
          [class.text-emerald-700]="ratingTone() === 'excellent'"
          [class.text-rose-700]="ratingTone() === 'low'"
          [class.text-sky-700]="ratingTone() === 'fair'"
        >
          {{ product().rating }}
        </span>
        <span class="text-xs text-slate-500">{{ product().reviewCount }} reviews</span>
      </div>
      <p class="text-gray-600">{{ product().description }}</p>
    </div>
    <div class="absolute right-0 bottom-0 left-0 flex items-center justify-between px-4 pb-4">
      @if (!product().isStock) {
        <span class="text-sm font-medium text-red-600">Out of Stock</span>
      } @else {
        <span class="text-xl font-bold text-green-600">\${{ product().price }}</span>
      }

      @if (view() === 'cart') {
        <button matButton type="button" class="flex items-center gap-2" (click)="toggleCart()">
          <mat-icon>delete</mat-icon>
          Remove from Cart
        </button>
      } @else if (inCart()) {
        <button
          matButton
          type="button"
          class="flex items-center gap-2 text-slate-700"
          (click)="toggleCart()"
        >
          <mat-icon>remove_shopping_cart</mat-icon>
          Remove from Cart
        </button>
      } @else {
        <button
          matButton="filled"
          type="button"
          class="flex items-center gap-2"
          color="primary"
          [disabled]="!product().isStock"
          (click)="toggleCart()"
        >
          <mat-icon>shopping_cart</mat-icon>
          Add to Cart
        </button>
      }
    </div>
  </div>`,
  styles: `
    :host {
      display: block;
      height: 100%;
      animation: product-card-fade-in 180ms ease-out;
    }

    @keyframes product-card-fade-in {
      from {
        opacity: 0;
        transform: translateY(6px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
})
export class ProductCard {
  protected readonly starPositions = [1, 2, 3, 4, 5];
  private readonly destroyRef = inject(DestroyRef);
  protected readonly store = inject(AppStore);

  product = input.required<Product>();
  view = input<'default' | 'wishlist' | 'cart'>('default');

  protected readonly isRemoving = signal(false);

  protected readonly filledStars = computed(() => Math.round(this.product().rating));
  protected readonly inCart = computed(() =>
    this.store.cart().some((item) => item.id === this.product().id),
  );
  protected readonly liked = computed(() =>
    this.store.wishlist().some((item) => item.id === this.product().id),
  );
  protected readonly actionIcon = computed(() => {
    if (this.view() === 'wishlist') {
      return 'delete';
    }

    if (this.view() === 'cart') {
      return this.liked() ? 'favorite' : 'favorite_border';
    }

    return this.liked() ? 'favorite' : 'favorite_border';
  });
  protected readonly actionLabel = computed(() =>
    this.view() === 'wishlist'
      ? 'Remove from wishlist'
      : this.view() === 'cart'
        ? 'Move to wishlist'
        : this.liked()
          ? 'Remove from wishlist'
          : 'Add to wishlist',
  );
  protected readonly ratingTone = computed(() => {
    const rating = this.product().rating;

    if (rating >= 4.5) {
      return 'excellent';
    }

    if (rating >= 4) {
      return 'good';
    }

    if (rating >= 3) {
      return 'fair';
    }

    return 'low';
  });

  protected toggleLiked(): void {
    if (this.view() === 'wishlist') {
      this.removeFromWishlistWithTransition();
      return;
    }

    if (this.view() === 'cart') {
      this.moveToWishlistWithTransition();
      return;
    }

    if (this.liked()) {
      this.store.removeWishlist(this.product().id);
    } else {
      this.store.addWishlist(this.product());
    }
  }

  protected toggleCart(): void {
    if (this.view() === 'cart') {
      this.removeFromCartWithTransition();
      return;
    }

    if (this.inCart()) {
      this.store.removeCart(this.product().id);
    } else {
      this.store.addCart(this.product());
    }
  }

  private removeFromWishlistWithTransition(): void {
    if (this.isRemoving()) {
      return;
    }

    this.isRemoving.set(true);

    const timeoutId = window.setTimeout(() => {
      this.store.removeWishlist(this.product().id);
    }, 180);

    this.destroyRef.onDestroy(() => window.clearTimeout(timeoutId));
  }

  private removeFromCartWithTransition(): void {
    if (this.isRemoving()) {
      return;
    }

    this.isRemoving.set(true);

    const timeoutId = window.setTimeout(() => {
      this.store.removeCart(this.product().id);
    }, 180);

    this.destroyRef.onDestroy(() => window.clearTimeout(timeoutId));
  }

  private moveToWishlistWithTransition(): void {
    if (this.isRemoving()) {
      return;
    }

    this.isRemoving.set(true);

    const timeoutId = window.setTimeout(() => {
      this.store.moveCartToWishlist(this.product().id);
    }, 180);

    this.destroyRef.onDestroy(() => window.clearTimeout(timeoutId));
  }
}
