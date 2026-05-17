import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);

  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  pageTitle = signal('Il Codex');
  pageSubtitle = signal("Frammenti dall'abisso — articoli, idee, riflessioni");

  ngOnInit() {
    const data = this.route.snapshot.data;

    if (data['title'])    this.pageTitle.set(data['title']);
    if (data['subtitle']) this.pageSubtitle.set(data['subtitle']);

    const params = new URLSearchParams();
    if (data['category']) params.set('category', data['category']);
    if (data['tag'])      params.set('tag', data['tag']);

    const url = params.toString() ? `/api/posts?${params}` : '/api/posts';

    this.http.get<BlogPost[]>(url).subscribe({
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
