import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import PRODUCTS from './data/products';
import { CartItem } from './models/cart-item';
import { Product } from './models/product';
import { ToastService } from './services/toast.service';
import { slugify } from './utils/slugify';

function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.trunc(quantity));
}

function getCartCount(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartSubtotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function toProduct(cartItem: CartItem): Product {
  const { quantity: _quantity, ...product } = cartItem;

  return product;
}

export type AppState = {
  products: Product[];
  wishlist: Product[];
  cart: CartItem[];
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
      cartCount: computed(() => getCartCount(cart())),
      cartLineCount: computed(() => cart().length),
      cartSubtotal: computed(() => getCartSubtotal(cart())),
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
    addCart(product: Product, quantity = 1): void {
      const nextQuantity = normalizeQuantity(quantity);
      const existingItem = store.cart().find((item) => item.id === product.id);

      patchState(store, {
        cart: existingItem
          ? store.cart().map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + nextQuantity }
                : item,
            )
          : [...store.cart(), { ...product, quantity: nextQuantity }],
      });

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
      const itemCount = getCartCount(store.cart());

      if (itemCount === 0) {
        return;
      }

      patchState(store, { cart: [] });
      toast.cartCleared(itemCount);
    },
    moveCartToWishlist(productId: string): void {
      const cartItem = store.cart().find((item) => item.id === productId);

      if (!cartItem) {
        return;
      }

      patchState(store, {
        cart: store.cart().filter((item) => item.id !== productId),
        wishlist: store.wishlist().some((item) => item.id === productId)
          ? store.wishlist()
          : [...store.wishlist(), toProduct(cartItem)],
      });

      toast.cartMovedToWishlist(cartItem.title);
    },
    incrementCartQuantity(productId: string): void {
      patchState(store, {
        cart: store.cart().map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      });
    },
    decrementCartQuantity(productId: string): void {
      patchState(store, {
        cart: store.cart().map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item,
        ),
      });
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
      const removedProduct = store.cart().find((item) => item.id === productId);

      patchState(store, {
        cart: store.cart().filter((item) => item.id !== productId),
      });

      if (removedProduct) {
        toast.cartRemoved(removedProduct.title);
      }
    },
  })),
);
