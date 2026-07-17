import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewResponse, Post } from 'src/models/post.model';

import { ChampionSelectComponent } from '../../champion-select/champion-select.component';
import { ChampionsService } from 'src/app/services/champions.service';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'new-response',
  imports: [FormsModule, ReactiveFormsModule, ChampionSelectComponent],
  templateUrl: './new-response.component.html',
  styleUrl: './new-response.component.scss',
})
export class NewResponseComponent {
  private supaService = inject(SupaService);
  champsService = inject(ChampionsService);

  @Input() postId!: string;
  @Output() onResponseAdded = new EventEmitter<Post>();

  newResponseContent = new FormControl('', Validators.required);

  onSubmit() {
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(now);

    if (this.newResponseContent.valid) {
      const newResponse: NewResponse = {
        created_at: formattedDate,
        champion_id: this.champsService.selectedChampion.id,
        content: this.newResponseContent.value as string,
        response_of: this.postId,
      };
      this.supaService
        .addResponse(newResponse)
        .then((res) => this.onResponseAdded.emit(res));
      this.newResponseContent.reset();
    }
  }
}
