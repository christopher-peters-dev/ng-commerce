import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MyCart } from './my-cart';

describe('MyCart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideNoopAnimations()],
    });
  });

  it('renders the empty cart state', () => {
    const fixture = TestBed.createComponent(MyCart);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Continue Shopping');
    expect(fixture.nativeElement.textContent).toContain('0 items');
    expect(fixture.nativeElement.textContent).toContain('Your cart is empty.');
  });
});
