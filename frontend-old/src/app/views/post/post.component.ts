import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/models/post.model';
import { PostCardComponent } from '../../shared/post-card/post-card.component';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-post',
  imports: [PostCardComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  private supaService = inject(SupaService);
  private route = inject(ActivatedRoute);

  post!: Post;

  async ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id') as string;
    await this.supaService
      .fetchSinglePost(postId)
      .then((post) => (this.post = post));
  }
}
