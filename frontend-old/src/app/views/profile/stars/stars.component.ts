import { Component, Input } from '@angular/core';

import { NgClass } from '@angular/common';

@Component({
  selector: 'stars',
  imports: [NgClass],
  templateUrl: './stars.component.html',
  styleUrl: './stars.component.scss',
})
export class StarsComponent {
  @Input() statName!: string;
  @Input() amount!: string;

  get stars() {
    // Inicializamos un array vacío para almacenar las estrellas.
    const stars = new Array<{ isRight: boolean; isPlaceholder: boolean }>();

    // Convertimos 'this.amount' en un número y sumamos 1.
    const amount = Number(this.amount);

    // Primer bucle: Creamos estrellas 'llenas' (isPlaceholder: true).
    for (let i = 1; i <= amount; i++) {
      stars.push({
        // isRight es true si el índice es par.
        isRight: i % 2 === 0,
        // La estrella está llena.
        isPlaceholder: false,
      });
    }

    // Segundo bucle: Creamos estrellas 'vacías' (isPlaceholder: false).
    // Aquí hay un error en los límites del bucle.
    for (let i = amount + 1; i <= 10; i++) {
      stars.push({
        // isRight es true si el índice es par.
        isRight: i % 2 === 0,
        // La estrella está vacía.
        isPlaceholder: true,
      });
    }

    // Retornamos el array de estrellas.
    return stars;
  }
}
