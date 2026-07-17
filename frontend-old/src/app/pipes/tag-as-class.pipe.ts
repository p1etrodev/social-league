import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagAsClass',
})
export class TagAsClass implements PipeTransform {
  transform(value: string): string {
    const translations: any = {
      Fighter: 'Peleador',
      Mage: 'Mago',
      Assassin: 'Asesino',
      Marksman: 'Tirador',
      Tank: 'Tanque',
      Support: 'Soporte',
    };
    return translations[value];
  }
}
