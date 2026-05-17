import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  blurb?: string;
  image?: string;
  author?: string;
  date?: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);

  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.http.get<BlogPost[]>('/api/posts').subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossibile caricare gli articoli.');
        this.loading.set(false);
      }
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('it-IT', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
