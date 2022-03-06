import {Component, Input, OnInit} from '@angular/core';
import { GlueResponse } from 'src/app/api/models';

@Component({
  selector: 'app-glue-dictionary',
  templateUrl: './glue-dictionary.component.html',
  styleUrls: ['./glue-dictionary.component.css']
})
export class GlueDictionary implements OnInit {

  @Input() glues: Array<GlueResponse> | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  getClazz(glues: Array<GlueResponse>): string[] {
    return [...new Set(glues.map(glue => glue.clazz!))];
  }

  getGlues(clazz: string): Array<GlueResponse> {
    return this.glues!.filter(glue => glue.clazz == clazz);
  }
}
