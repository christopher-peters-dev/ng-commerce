import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, RouterLink } from '@angular/router';
import { AppStore } from '../../store';
import { HeaderActions } from './header-actions';

describe('HeaderActions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideNoopAnimations()],
    });
  });

  it('renders account actions, navigation, and badges for wishlist and cart', () => {
    const store = TestBed.inject(AppStore);
    const wishlistProduct = store.products()[1];
    const cartProduct = store.products()[2];

    store.addWishlist(wishlistProduct);
    store.addCart(cartProduct, 2);

    const fixture = TestBed.createComponent(HeaderActions);
    fixture.detectChanges();

    const routerLinks = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .map((debugElement) => debugElement.injector.get(RouterLink));

    expect(fixture.nativeElement.textContent).toContain('Sign In');
    expect(fixture.nativeElement.textContent).toContain('Sign Up');
    expect(routerLinks).toHaveLength(2);
    expect(routerLinks.map((link) => link.urlTree?.toString())).toEqual(['/wishlist', '/cart']);
    expect(fixture.nativeElement.querySelector('[aria-label="1 items in wishlist"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[aria-label="2 items in cart"]')).not.toBeNull();
  });
});
