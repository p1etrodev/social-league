import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewPost, Post } from 'src/models/post.model';

import { ChampionSelectComponent } from 'src/app/shared/champion-select/champion-select.component';
import { ChampionsService } from 'src/app/services/champions.service';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'new-post',
  imports: [FormsModule, ReactiveFormsModule, ChampionSelectComponent],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent {
  private supaService = inject(SupaService);
  champsService = inject(ChampionsService);

  @Output() onPostAdded = new EventEmitter<Post>();

  newPostContent = new FormControl('', Validators.required);

  placeholder: string = '¿Qué estás pensando?';

  onSubmit() {
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(now);

    if (this.newPostContent.valid) {
      const newPost: NewPost = {
        created_at: formattedDate,
        champion_id: this.champsService.selectedChampion?.id as string,
        content: this.newPostContent.value as string,
      };
      this.supaService
        .addPost(newPost)
        .then((post) => this.onPostAdded.emit(post));
      this.newPostContent.reset();
    }
  }
}
