import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import PRODUCTS from './data/products';
import { Product } from './models/product';
import { ToastService } from './services/toast.service';
import { slugify } from './utils/slugify';

export type AppState = {
  products: Product[];
  wishlist: Product[];
  cart: Product[];
  category: string;
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<AppState>({ products: PRODUCTS, wishlist: [], cart: [], category: 'all' }),
  withComputed(({ category, products, wishlist, cart }) => {
    const normalizedCategory = computed(() => slugify(category()));
    const categories = computed(() => [
      'All',
      ...new Set(products().map((product) => product.category)),
    ]);
    const validCategorySlugs = computed(
      () => new Set(categories().map((categoryName) => slugify(categoryName))),
    );

    return {
      normalizedCategory,
      cartCount: computed(() => cart().length),
      categories,
      validCategorySlugs,
      selectedCategoryLabel: computed(() => {
        const selectedCategory = categories().find(
          (categoryName) => slugify(categoryName) === normalizedCategory(),
        );

        return selectedCategory ?? 'All';
      }),
      wishlistCount: computed(() => wishlist().length),
      filteredProducts: computed(() => {
        const selectedCategory = normalizedCategory();

        return selectedCategory === 'all'
          ? products()
          : products().filter((product) => slugify(product.category) === selectedCategory);
      }),
    };
  }),
  withMethods((store, toast = inject(ToastService)) => ({
    setCategory(category: string): void {
      patchState(store, { category });
    },
    addWishlist(product: Product): void {
      patchState(store, { wishlist: [...store.wishlist(), product] });
      toast.wishlistAdded(product.title);
    },
    addCart(product: Product): void {
      if (store.cart().some((item) => item.id === product.id)) {
        return;
      }

      patchState(store, { cart: [...store.cart(), product] });
      toast.cartAdded(product.title);
    },
    clearWishlist(): void {
      const itemCount = store.wishlist().length;

      if (itemCount === 0) {
        return;
      }

      patchState(store, { wishlist: [] });
      toast.wishlistCleared(itemCount);
    },
    clearCart(): void {
      const itemCount = store.cart().length;

      if (itemCount === 0) {
        return;
      }

      patchState(store, { cart: [] });
      toast.cartCleared(itemCount);
    },
    moveCartToWishlist(productId: string): void {
      const product = store.cart().find((item) => item.id === productId);

      if (!product) {
        return;
      }

      patchState(store, {
        cart: store.cart().filter((item) => item.id !== productId),
        wishlist: store.wishlist().some((item) => item.id === productId)
          ? store.wishlist()
          : [...store.wishlist(), product],
      });

      toast.cartMovedToWishlist(product.title);
    },
    removeWishlist(productId: string): void {
      const removedProduct = store.wishlist().find((product) => product.id === productId);

      patchState(store, {
        wishlist: store.wishlist().filter((product) => product.id !== productId),
      });

      if (removedProduct) {
        toast.wishlistRemoved(removedProduct.title);
      }
    },
    removeCart(productId: string): void {
      const removedProduct = store.cart().find((product) => product.id === productId);

      patchState(store, {
        cart: store.cart().filter((product) => product.id !== productId),
      });

      if (removedProduct) {
        toast.cartRemoved(removedProduct.title);
      }
    },
  })),
);
