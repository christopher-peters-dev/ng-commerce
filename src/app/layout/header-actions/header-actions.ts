import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../store';

@Component({
  selector: 'app-header-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatBadge, MatButton, MatIconButton, MatIcon, RouterLink],
  template: `<div class="flex items-center gap-1 sm:gap-2">
    <button
      matIconButton
      routerLink="/wishlist"
      class="wishlist-badge-button text-slate-600"
      [attr.aria-label]="wishlistCount() + ' items in wishlist'"
      [matBadge]="wishlistCount().toString()"
      [matBadgeHidden]="wishlistCount() === 0"
      [matBadgeOverlap]="false"
      matBadgeSize="medium"
      matBadgeColor="warn"
    >
      <mat-icon>favorite</mat-icon>
    </button>
    <button
      matIconButton
      routerLink="/cart"
      class="text-slate-600"
      [attr.aria-label]="cartCount() + ' items in cart'"
    >
      <mat-icon>shopping_cart</mat-icon>
    </button>
    <button matButton class="hidden text-slate-700 sm:inline-flex">Sign In</button>
    <button matButton="filled">Sign Up</button>
  </div>`,
  styles: `
    :host ::ng-deep .wishlist-badge-button .mat-badge-content {
      transform: translate(-10px, 2px);
      min-width: 18px;
      padding-inline: 4px;
    }
  `,
})
export class HeaderActions {
  private readonly store = inject(AppStore);

  protected readonly wishlistCount = computed(() => this.store.wishlist().length);
  protected readonly cartCount = computed(() => this.store.cart().length);
}
