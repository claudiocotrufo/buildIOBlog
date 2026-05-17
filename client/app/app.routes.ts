import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    data: { title: 'Il Codex', subtitle: "Frammenti dall'abisso — articoli, idee, riflessioni" }
  },
  {
    path: 'warhammer',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    data: { category: 'warhammer', title: 'Warhammer Age of Sigmar', subtitle: 'Cronache dei Mortal Realms — Ghur, Shyish e oltre' }
  },
  {
    path: 'warhammer/colette',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    data: { tag: 'colette-castell', title: 'Colette Castell', subtitle: 'Soldatessa di IV Compagnia — Guarnigione di Varanheim' }
  },
  {
    path: 'sessioni',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    data: { category: 'sessioni', title: 'Sessioni & Lore', subtitle: 'Log delle partite, note di lore, world-building' }
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog-post/blog-post.component').then(m => m.BlogPostComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
