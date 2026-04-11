import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { AppStore } from '../../store';
import { MyCart } from './my-cart';

describe('MyCart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideNoopAnimations()],
    });
  });

  it('renders the empty cart state', async () => {
    const fixture = TestBed.createComponent(MyCart);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Wishlist');
    expect(fixture.nativeElement.textContent).toContain('Order Summary');
    expect(fixture.nativeElement.textContent).toContain('Your cart is empty.');
  });

  it('updates quantity and summary totals from the cart page controls', async () => {
    const store = TestBed.inject(AppStore);
    const product = store.products()[1];

    store.addCart(product);

    const fixture = TestBed.createComponent(MyCart);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance['incrementQuantity'](product.id);
    fixture.detectChanges();
    await fixture.whenStable();

    const cartRow = fixture.nativeElement.querySelector(
      `[data-cart-item="${product.id}"]`,
    ) as HTMLElement;

    expect(cartRow.textContent).toContain(product.title);
    expect(cartRow.textContent).toContain('$24.50');
    expect(cartRow.textContent).toContain('$49.00');
    expect(fixture.nativeElement.textContent).toContain('2 items');
    expect(fixture.nativeElement.textContent).toContain('$49.00');
    expect(fixture.nativeElement.textContent).toContain('$3.68');
    expect(fixture.nativeElement.textContent).toContain('$52.68');
    expect(fixture.nativeElement.textContent).toContain('Clear Cart');
  });
});
