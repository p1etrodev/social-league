import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  inject,
} from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';

import { Champion } from 'src/models/champion.model';
import { ChampionsService } from 'src/app/services/champions.service';

@Component({
  selector: 'skins',
  imports: [NgForOf, NgClass],
  templateUrl: './skins.component.html',
  styleUrl: './skins.component.scss',
})
export class SkinsComponent {
  champsService = inject(ChampionsService);

  @Input() champion!: Champion;

  currentSkin = 1;

  previousSlide(): void {
    const currentIndex: number = this.champion.skins.indexOf(this.currentSkin);
    const previousIndex: number =
      (currentIndex - 1 + this.champion.skins.length) %
      this.champion.skins.length;
    this.currentSkin = this.champion.skins[previousIndex];
    this.navigateToSlide(this.currentSkin);
  }

  nextSlide(): void {
    const currentIndex: number = this.champion.skins.indexOf(this.currentSkin);
    const nextIndex: number = (currentIndex + 1) % this.champion.skins.length;
    this.currentSkin = this.champion.skins[nextIndex];
    this.navigateToSlide(this.currentSkin);
  }

  navigateToSlide(skin: number): void {
    const elements = document.getElementsByClassName('slide-' + skin);
    if (elements) {
      this.currentSkin = skin;
      for (const el of elements)
        el.scrollIntoView({
          behavior: 'smooth',
          inline: 'nearest',
          block: 'nearest',
        });
    }
  }
}
