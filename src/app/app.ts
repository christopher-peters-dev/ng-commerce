import { Component, signal } from '@angular/core';
import { Header } from './layout/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet],
  template: `
    <app-header></app-header>

    <router-outlet> </router-outlet>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('ng-ecommerce');
}
