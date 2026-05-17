import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  blurb?: string;
  image?: string;
  author?: string;
  date?: string;
  content?: string;
}

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss'
})
export class BlogPostComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  post = signal<BlogPost | null>(null);
  loading = signal(true);
  notFound = signal(false);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    this.http.get<BlogPost>(`/api/posts/${slug}`).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
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
