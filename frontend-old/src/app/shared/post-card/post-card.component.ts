import { Component, Input, OnInit, inject } from '@angular/core';

import { Champion } from 'src/models/champion.model';
import { ChampionsService } from 'src/app/services/champions.service';
import { IdentifierPipe } from '../../pipes/identifier.pipe';
import { NewQuoteComponent } from './new-quote/new-quote.component';
import { NewResponseComponent } from './new-response/new-response.component';
import { NgForOf } from '@angular/common';
import { Post } from 'src/models/post.model';
import { RelativeDatePipe } from 'src/app/pipes/relative-date.pipe';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'post-card',
  imports: [
    RelativeDatePipe,
    NgForOf,
    NewResponseComponent,
    IdentifierPipe,
    NewQuoteComponent,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent implements OnInit {
  supaService = inject(SupaService);
  champsService = inject(ChampionsService);

  // Display settings
  @Input() isQuote = false;
  @Input() showComments = false;
  @Input() showRespondsTo = true;
  @Input() showQuotedPost = true;

  // Quote settings
  showQuoteActions = false;
  showNewQuoteForm = false;

  @Input() poster!: string;
  @Input() post!: Post;
  champion!: Champion;
  respondsTo!: Post;
  quotedPost!: Post;
  responses = new Array<Post>();

  ngOnInit() {
    this.champsService
      .fetchFullChampion(this.post.champion_id)
      .then((result) => (this.champion = result));

    if (this.post.response_of && this.showRespondsTo) {
      this.supaService
        .fetchSinglePost(this.post.response_of)
        .then((resultPost) => (this.respondsTo = resultPost));
    }

    if (this.post.quote_of && this.showQuotedPost) {
      this.supaService
        .fetchSinglePost(this.post.quote_of)
        .then((resultPost) => (this.quotedPost = resultPost));
    }

    if (this.showComments) {
      this.supaService
        .fetchResponses(this.post.id, 'post')
        .then((res) => (this.responses = res.responses));
    }
  }

  onResponseAdded(response: Post) {
    this.responses.push(response);
  }

  toggleShowQuoteActions() {
    this.showQuoteActions = !this.showQuoteActions;
    setTimeout(() => (this.showQuoteActions = false), 2000);
  }
}
