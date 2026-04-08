import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
  template: ` <div class="relative h-full overflow-hidden rounded bg-white shadow-xl">
    <div class="relative">
      <img
        [src]="product().imageUrl"
        alt="{{ product().title }}"
        class="mb-4 h-48 w-full rounded-t object-cover"
      />
      <button
        type="button"
        class="absolute top-3 right-3 flex h-10 min-w-10 items-center justify-center rounded border px-2 shadow-sm outline-none backdrop-blur-sm transition-colors"
        [attr.aria-label]="liked() ? 'Remove from wishlist' : 'Add to wishlist'"
        [attr.aria-pressed]="liked()"
        [class.border-transparent]="liked()"
        [class.bg-rose-50]="liked()"
        [class.text-rose-500]="liked()"
        [class.border-slate-200/80]="!liked()"
        [class.bg-white/85]="!liked()"
        [class.text-slate-500]="!liked()"
        (click)="toggleLiked()"
      >
        <mat-icon>{{ liked() ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>
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
  protected readonly starPositions = [1, 2, 3, 4, 5];
  protected readonly liked = signal(false);

  product = input.required<Product>();

  protected readonly filledStars = computed(() => Math.round(this.product().rating));

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
    this.liked.update((value) => !value);
  }
}
