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
});
