import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { MyCart } from './pages/my-cart/my-cart';
import { MyWishlist } from './pages/my-wishlist/my-wishlist';
import { ProductsGrid } from './pages/products-grid/products-grid';

describe('app routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding()), provideNoopAnimations()],
    });
  });

  it('redirects the empty path to products/all', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', ProductsGrid);

    expect(TestBed.inject(Router).url).toBe('/products/all');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent?.trim()).toBe('All');
  });

  it('loads the wishlist page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/wishlist', MyWishlist);

    expect(TestBed.inject(Router).url).toBe('/wishlist');
    expect(harness.routeNativeElement?.textContent).toContain('Continue Shopping');
    expect(harness.routeNativeElement?.textContent).toContain('Your wishlist is empty.');
  });

  it('loads the cart page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/cart', MyCart);

    expect(TestBed.inject(Router).url).toBe('/cart');
    expect(harness.routeNativeElement?.textContent).toContain('Continue Shopping');
    expect(harness.routeNativeElement?.textContent).toContain('Your cart is empty.');
  });

  it('redirects unknown routes to products/all', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/does-not-exist', ProductsGrid);

    expect(TestBed.inject(Router).url).toBe('/products/all');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent?.trim()).toBe('All');
  });
});
