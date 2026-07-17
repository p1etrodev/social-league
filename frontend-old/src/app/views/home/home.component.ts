import { Component, OnInit, inject } from '@angular/core';

import { NewPostComponent } from './new-post/new-post.component';
import { NgForOf } from '@angular/common';
import { Post } from 'src/models/post.model';
import { PostCardComponent } from 'src/app/shared/post-card/post-card.component';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-home',
  imports: [NgForOf, NewPostComponent, PostCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  supaService = inject(SupaService);
  posts!: Post[];

  ngOnInit(): void {
    this.retrievePosts();
  }

  onPostAdded(post: Post) {
    this.posts.push(post);
  }

  retrievePosts() {
    this.supaService.fetchPosts().then((res) => (this.posts = res.posts));
    this.supaService.newPosts = 0;
  }
}
