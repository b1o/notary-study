import type { Routes } from '@angular/router';

/** Every page loads on demand. Pages set their own document title (see pageTitleEffect). */
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home-page') },
  { path: 'course/:chapterId', loadComponent: () => import('./features/chapter/chapter-page') },
  { path: 'laws', loadComponent: () => import('./features/laws/law-index-page') },
  { path: 'laws/:actId', loadComponent: () => import('./features/laws/act-page') },
  { path: 'laws/:actId/:article', loadComponent: () => import('./features/laws/act-page') },
  { path: 'glossary', loadComponent: () => import('./features/glossary/glossary-page') },
  {
    path: 'templates',
    loadComponent: () => import('./features/templates/template-list-page'),
  },
  {
    path: 'templates/:templateId',
    loadComponent: () => import('./features/templates/template-page'),
  },
  {
    path: 'checklists',
    loadComponent: () => import('./features/checklists/checklist-list-page'),
  },
  {
    path: 'checklists/:checklistId',
    loadComponent: () => import('./features/checklists/checklist-page'),
  },
  { path: '**', loadComponent: () => import('./features/not-found/not-found-page') },
];
