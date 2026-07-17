import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { NgForOf } from '@angular/common';
import { Post } from 'src/models/post.model';
import { PostCardComponent } from 'src/app/shared/post-card/post-card.component';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-quotes',
  imports: [NgForOf, PostCardComponent],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.scss',
})
export class QuotesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supaService = inject(SupaService);
  quotes!: Post[];

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id') as string;
    this.supaService.fetchQuotes(postId, 'post').then((response) => {
      this.quotes = response.quotes;
      console.log(response);
    });
  }
}
