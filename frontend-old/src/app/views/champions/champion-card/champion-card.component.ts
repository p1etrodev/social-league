import { Component, Input, inject } from '@angular/core';

import { ChampionsService } from 'src/app/services/champions.service';
import { PartialChampion } from 'src/models/champion.model';

@Component({
  selector: 'champion-card',
  imports: [],
  templateUrl: './champion-card.component.html',
  styleUrl: './champion-card.component.scss',
})
export class ChampionCardComponent {
  champsService = inject(ChampionsService);
  @Input() champion!: PartialChampion;
}
