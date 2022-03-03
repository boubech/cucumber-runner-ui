import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'spaceToHtml'})
export class SpaceToHtml implements PipeTransform {
  transform(value: string) {
    return value.replace(" ", "&nbsp;")
                .replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
  }
}
