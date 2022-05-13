import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { GlueResponse } from 'src/app/api/models';

@Component({
  selector: 'app-glue-dictionary',
  templateUrl: './glue-dictionary.component.html',
  styleUrls: ['./glue-dictionary.component.css']
})
export class GlueDictionary implements OnInit {

  @Input() glues: Array<GlueResponse> | undefined;
  gluesFiltered: Array<GlueResponse> | undefined;
  filter: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.search();
  }

  getGlues(clazz: string): Array<GlueResponse> {
    return this.glues!.filter(glue => glue.clazz == clazz);
  }

  search() {
    this.gluesFiltered = this.glues?.filter(glue =>
      this.filter.trim().length == 0 ||
      glue.clazz!.match(this.filter) ||
      glue.method!.match(this.filter) ||
      glue.value!.match(this.filter) ||
      glue.comment!.match(this.filter))
  }
}
