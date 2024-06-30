import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
      if (value === null || value === undefined) return '';
      const minutes = Math.floor(value / 60);
      const seconds = Math.ceil((value % 60));
      return `${this.padToTwoDigits(minutes)}:${this.padToTwoDigits(seconds)}`;
    }
  
    private padToTwoDigits(num: number): string {
      return num.toString().padStart(2, '0');
    }

}
