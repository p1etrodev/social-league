import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate',
})
export class RelativeDatePipe implements PipeTransform {
  transform(date: string): unknown {
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return 'Fecha no válida';
    }

    const now = new Date().getTime();
    const difference = now - targetDate.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return `${seconds}s`;
    } else if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      if (hours > 1) return `${hours}hs`;
      return `${hours}h`;
    } else if (days < 7) {
      return `${days}d`;
    } else if (months < 12) {
      return `${months}mes`;
    } else {
      return `${years}a`;
    }
  }
}
