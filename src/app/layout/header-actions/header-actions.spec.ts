import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, RouterLink } from '@angular/router';
import { HeaderActions } from './header-actions';

describe('HeaderActions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideNoopAnimations()],
    });
  });

  it('renders account actions and links wishlist navigation', () => {
    const fixture = TestBed.createComponent(HeaderActions);
    fixture.detectChanges();

    const routerLinks = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .map((debugElement) => debugElement.injector.get(RouterLink));

    expect(fixture.nativeElement.textContent).toContain('Sign In');
    expect(fixture.nativeElement.textContent).toContain('Sign Up');
    expect(routerLinks).toHaveLength(1);
  });
});
