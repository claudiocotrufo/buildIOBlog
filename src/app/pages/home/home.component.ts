import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { fetchEntries, BuilderContent } from '@builder.io/sdk-angular';
import { environment } from '../../../environments/environment';

interface BlogPost {
  id: string;
  name: string;
  data: {
    title?: string;
    blurb?: string;
    image?: string;
    author?: string;
    date?: string;
    handle?: string;
  };
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    try {
      const entries = await fetchEntries({
        model: 'blog-article',
        apiKey: environment.builderApiKey,
        options: { limit: 20 }
      });
      this.posts.set((entries ?? []) as BlogPost[]);
    } catch (e) {
      this.error.set('Impossibile caricare gli articoli. Verifica la configurazione di Builder.io.');
    } finally {
      this.loading.set(false);
    }
  }

  getSlug(post: BlogPost): string {
    return post.data?.handle ?? post.id;
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('it-IT', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
