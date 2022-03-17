import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-html-report',
  templateUrl: './html-report.component.html',
  styleUrls: ['./html-report.component.css']
})
export class HtmlReportComponent{

  @Input() htmlReportUrl: string | undefined;

  constructor() {
  }
}
