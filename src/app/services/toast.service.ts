import { inject, Injectable } from '@angular/core';
import { HotToastService, ToastOptions } from '@ngxpert/hot-toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly hotToast = inject(HotToastService);
  private readonly neutralInfoToastOptions: ToastOptions<unknown> = {
    iconTheme: {
      primary: '#64748b',
      secondary: '#f8fafc',
    },
  };

  success(message: string, options?: ToastOptions<unknown>): void {
    this.hotToast.success(message, options);
  }

  info(message: string, options?: ToastOptions<unknown>): void {
    this.hotToast.info(message, options);
  }

  error(message: string, options?: ToastOptions<unknown>): void {
    this.hotToast.error(message, options);
  }

  wishlistAdded(productTitle: string): void {
    this.success(`${productTitle} added to wishlist.`);
  }

  wishlistRemoved(productTitle: string): void {
    this.info(`${productTitle} removed from wishlist.`, this.neutralInfoToastOptions);
  }

  wishlistCleared(itemCount: number): void {
    const message =
      itemCount === 1
        ? '1 item removed from wishlist.'
        : `${itemCount} items removed from wishlist.`;

    this.success(message);
  }

  cartAdded(productTitle: string): void {
    this.success(`${productTitle} added to cart.`);
  }

  cartRemoved(productTitle: string): void {
    this.info(`${productTitle} removed from cart.`, this.neutralInfoToastOptions);
  }

  cartMovedToWishlist(productTitle: string): void {
    this.success(`${productTitle} moved to wishlist.`);
  }

  cartCleared(itemCount: number): void {
    const message =
      itemCount === 1 ? '1 item removed from cart.' : `${itemCount} items removed from cart.`;

    this.success(message);
  }
}
