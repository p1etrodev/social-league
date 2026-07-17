import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';

import { ChampionsService } from './services/champions.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  route = inject(ActivatedRoute);
  champsService = inject(ChampionsService);
}
