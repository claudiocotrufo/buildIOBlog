import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./pages/blog-post/blog-post.component').then(m => m.BlogPostComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
