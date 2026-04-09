import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideNoopAnimations()],
    });
  });

  it('renders the store branding and header actions', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Modern Store');
    expect(fixture.nativeElement.textContent).toContain('Refined daily essentials');
    expect(fixture.nativeElement.querySelector('app-header-actions')).not.toBeNull();
  });
});
