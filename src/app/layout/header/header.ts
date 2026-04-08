import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderActions } from '../header-actions/header-actions';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, HeaderActions],
  template: `<mat-toolbar
    class="elevated sticky top-0 z-50 min-h-18 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur"
  >
    <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
      <div class="flex flex-col">
        <span class="text-lg font-semibold tracking-tight text-slate-950 uppercase tracking-wider"
          >Modern Store</span
        >
        <span class="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
          Refined daily essentials
        </span>
      </div>
      <app-header-actions></app-header-actions>
    </div>
  </mat-toolbar>`,
  styles: ``,
})
export class Header {}
