import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'ansiToHtml'})
export class AnsiToHtml implements PipeTransform {
  transform(ansiString: string) {
    var Convert = require('ansi-to-html');
    var convert = new Convert();
    return convert.toHtml(ansiString);
  }
}
