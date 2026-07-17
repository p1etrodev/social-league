import { Champion, PartialChampion } from 'src/models/champion.model';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';

import { ChampionsService } from 'src/app/services/champions.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'champion-select',
  imports: [NgForOf, NgClass, FormsModule],
  templateUrl: './champion-select.component.html',
  styleUrls: ['./champion-select.component.scss'],
})
export class ChampionSelectComponent {
  private renderer = inject(Renderer2);

  champsService = inject(ChampionsService);
  open = false;

  @ViewChild('overlap') overlap!: ElementRef;

  selectChampion(champion: PartialChampion) {
    this.champsService.setSelectedChampion(champion);
    this.toggle();
  }

  toggle(open?: boolean) {
    this.open = open !== undefined ? open : !this.open;
    if (this.open) {
      this.renderer.addClass(this.overlap.nativeElement, 'open');
    } else {
      this.renderer.removeClass(this.overlap.nativeElement, 'open');
    }
  }

  get currentChampion() {
    return this.champsService.selectedChampion as Champion;
  }
}
