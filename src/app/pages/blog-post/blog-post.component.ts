import { Component, OnInit, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);

  content = signal<BuilderContent | null>(null);
  loading = signal(true);
  notFound = signal(false);
  apiKey = environment.builderApiKey;

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const urlPath = `/blog/${slug}`;

    try {
      const entry = await fetchOneEntry({
        model: 'blog-article',
        apiKey: this.apiKey,
        userAttributes: { urlPath }
      });

      const previewing = isPlatformBrowser(this.platformId) && isPreviewing();
      if (entry || previewing) {
        this.content.set(entry);
      } else {
        this.notFound.set(true);
      }
    } catch {
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
