import type { Routes } from '@angular/router';

/** Every page loads on demand. Pages set their own document title (see pageTitleEffect). */
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home-page') },
  { path: 'course/:chapterId', loadComponent: () => import('./features/chapter/chapter-page') },
  { path: 'laws', loadComponent: () => import('./features/laws/law-index-page') },
  { path: 'laws/:actId', loadComponent: () => import('./features/laws/act-page') },
  { path: 'laws/:actId/:article', loadComponent: () => import('./features/laws/act-page') },
  { path: '**', loadComponent: () => import('./features/not-found/not-found-page') },
];
