import { Component, inject } from '@angular/core';

import { ChampionCardComponent } from './champion-card/champion-card.component';
import { ChampionsService } from 'src/app/services/champions.service';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-champions',
  imports: [NgForOf, FormsModule, ChampionCardComponent],
  templateUrl: './champions.component.html',
  styleUrl: './champions.component.scss',
})
export class ChampionsComponent {
  champsService = inject(ChampionsService);
}
