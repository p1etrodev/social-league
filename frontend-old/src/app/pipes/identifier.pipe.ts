import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'identifier',
})
export class IdentifierPipe implements PipeTransform {
  transform(value: string): string {
    const accentsRegex = /[áéíóúÁÉÍÓÚüÜñÑçÇ]/g;

    // Map to convert accented letters to their unaccented counterparts
    const accentMap: { [key: string]: string } = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      Á: 'A',
      É: 'E',
      Í: 'I',
      Ó: 'O',
      Ú: 'U',
      ü: 'u',
      Ü: 'U',
      ñ: 'n',
      Ñ: 'N',
      ç: 'c',
      Ç: 'C',
    };
    return (
      '@' +
      value
        .toLowerCase()
        .replace(/\s/g, '_')
        .replace(accentsRegex, (match) => accentMap[match])
    );
  }
}
