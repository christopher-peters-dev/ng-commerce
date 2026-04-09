import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import PRODUCTS from './data/products';
import { Product } from './models/product';
import { slugify } from './utils/slugify';

export type AppState = {
  products: Product[];
  category: string;
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<AppState>({ products: PRODUCTS, category: 'all' }),
  withComputed(({ category, products }) => {
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
      categories,
      validCategorySlugs,
      selectedCategoryLabel: computed(() => {
        const selectedCategory = categories().find(
          (categoryName) => slugify(categoryName) === normalizedCategory(),
        );

        return selectedCategory ?? 'All';
      }),
      filteredProducts: computed(() => {
        const selectedCategory = normalizedCategory();

        return selectedCategory === 'all'
          ? products()
          : products().filter((product) => slugify(product.category) === selectedCategory);
      }),
    };
  }),
  withMethods((store) => ({
    setCategory(category: string): void {
      patchState(store, { category });
    },
  })),
);
