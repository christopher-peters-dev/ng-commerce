import { TestBed } from '@angular/core/testing';
import { AppStore } from './store';

describe('AppStore', () => {
  let store: InstanceType<typeof AppStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(AppStore);
    store.setCategory('all');
  });

  it('exposes all products by default', () => {
    expect(store.normalizedCategory()).toBe('all');
    expect(store.filteredProducts().length).toBe(store.products().length);
    expect(store.selectedCategoryLabel()).toBe('All');
  });

  it('derives available category names from products', () => {
    expect(store.categories()).toContain('All');
    expect(store.categories()).toContain('Electronics');
    expect(store.validCategorySlugs().has('electronics')).toBe(true);
  });

  it('filters products after category changes', () => {
    store.setCategory('electronics');

    expect(store.normalizedCategory()).toBe('electronics');
    expect(store.selectedCategoryLabel()).toBe('Electronics');
    expect(store.filteredProducts().every((product) => product.category === 'Electronics')).toBe(
      true,
    );
  });

  it('adds cart items with a default quantity and merges duplicate adds', () => {
    const product = store.products()[1];

    store.addCart(product);
    store.addCart(product, 2);

    expect(store.cart()).toEqual([{ ...product, quantity: 3 }]);
    expect(store.cartCount()).toBe(3);
    expect(store.cartSubtotal()).toBeCloseTo(product.price * 3, 2);
  });

  it('increments and decrements cart quantity without going below one', () => {
    const product = store.products()[2];

    store.addCart(product, 2);
    store.incrementCartQuantity(product.id);
    store.decrementCartQuantity(product.id);
    store.decrementCartQuantity(product.id);
    store.decrementCartQuantity(product.id);

    expect(store.cart()[0].quantity).toBe(1);
    expect(store.cartCount()).toBe(1);
  });

  it('moves cart items to wishlist without leaking quantity into wishlist state', () => {
    const product = store.products()[3];

    store.addCart(product, 2);
    store.moveCartToWishlist(product.id);

    expect(store.cart()).toEqual([]);
    expect(store.wishlist()).toEqual([product]);
  });
});
