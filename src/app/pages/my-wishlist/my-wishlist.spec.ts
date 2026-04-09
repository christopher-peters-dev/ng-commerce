import { TestBed } from '@angular/core/testing';
import { MyWishlist } from './my-wishlist';

describe('MyWishlist', () => {
  it('renders the current placeholder view', () => {
    const fixture = TestBed.createComponent(MyWishlist);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('my-wishlist works!');
  });
});
