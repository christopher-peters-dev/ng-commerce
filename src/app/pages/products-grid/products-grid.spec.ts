import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AppStore } from '../../store';
import { ProductsGrid } from './products-grid';

describe('ProductsGrid', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideNoopAnimations()],
    });

    TestBed.inject(AppStore).setCategory('all');
  });

  it('renders the selected category heading and filtered products from the store', async () => {
    const fixture = TestBed.createComponent(ProductsGrid);
    fixture.componentRef.setInput('category', 'electronics');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const store = TestBed.inject(AppStore);
    const heading = fixture.nativeElement.querySelector('h1');
    const productCards = fixture.nativeElement.querySelectorAll('app-product-card');

    expect(store.selectedCategoryLabel()).toBe('Electronics');
    expect(heading?.textContent?.trim()).toBe('Electronics');
    expect(productCards.length).toBe(store.filteredProducts().length);
    expect(productCards.length).toBeGreaterThan(0);
  });

  it('redirects invalid category slugs back to products/all', async () => {
    const router = TestBed.inject(Router);
    const navigateByUrlSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(ProductsGrid);

    fixture.componentRef.setInput('category', 'not-a-real-category');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/products/all', { replaceUrl: true });
  });
});
