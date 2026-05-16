import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Content, fetchOneEntry, isPreviewing, BuilderContent } from '@builder.io/sdk-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-blog-post',
  imports: [Content, RouterLink],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss'
})
export class BlogPostComponent implements OnInit {
  content = signal<BuilderContent | null>(null);
  loading = signal(true);
  notFound = signal(false);
  apiKey = environment.builderApiKey;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const urlPath = `/blog/${slug}`;

    try {
      const entry = await fetchOneEntry({
        model: 'blog-article',
        apiKey: this.apiKey,
        userAttributes: { urlPath }
      });

      if (entry || isPreviewing()) {
        this.content.set(entry);
      } else {
        this.notFound.set(true);
      }
    } catch (e) {
      this.notFound.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('it-IT', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
