import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Product } from '../../models/product';
import { ToastService } from '../../services/toast.service';
import { ProductCard } from './product-card';

const inStockProduct: Product = {
  id: 'prod-test-1',
  title: 'Test Product',
  description: 'A product used for UI tests.',
  price: 42,
  imageUrl: 'https://example.com/product.jpg',
  rating: 4.6,
  reviewCount: 12,
  isStock: true,
  category: 'Electronics',
};

describe('ProductCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        {
          provide: ToastService,
          useValue: {
            wishlistAdded: () => {},
            wishlistRemoved: () => {},
            wishlistCleared: () => {},
            cartAdded: () => {},
            cartRemoved: () => {},
            cartMovedToWishlist: () => {},
            cartCleared: () => {},
          },
        },
      ],
    });
  });

  it('renders product details and price for in-stock items', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', inStockProduct);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Test Product');
    expect(fixture.nativeElement.textContent).toContain('A product used for UI tests.');
    expect(fixture.nativeElement.textContent).toContain('$42');
    expect(fixture.nativeElement.textContent).toContain('12 reviews');
  });

  it('shows out-of-stock state and disables add to cart', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', { ...inStockProduct, isStock: false });
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    );
    const addToCartButton = buttons.find((button) => button.textContent?.includes('Add to Cart'));

    expect(fixture.nativeElement.textContent).toContain('Out of Stock');
    expect(addToCartButton?.disabled).toBe(true);
  });

  it('toggles wishlist affordance when the favorite button is clicked', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', inStockProduct);
    fixture.detectChanges();

    const favoriteButton = fixture.nativeElement.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement;
    expect(favoriteButton.getAttribute('aria-pressed')).toBe('false');

    favoriteButton.click();
    fixture.detectChanges();

    expect(favoriteButton.getAttribute('aria-pressed')).toBe('true');
    expect(favoriteButton.getAttribute('aria-label')).toBe('Remove from wishlist');
  });

  it('toggles cart state from the bottom action button', () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', inStockProduct);
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    );
    const addToCartButton = buttons.find((button) => button.textContent?.includes('Add to Cart'));

    addToCartButton?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Remove from Cart');
  });
});
