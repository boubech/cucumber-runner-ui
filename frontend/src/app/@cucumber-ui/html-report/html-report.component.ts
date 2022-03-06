import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {FeatureRunnerResponse} from "../../api/models/feature-runner-response";
import {Test, TestRunnerService} from "../../services/test-runner-service";

@Component({
  selector: 'app-html-report',
  templateUrl: './html-report.component.html',
  styleUrls: ['./html-report.component.css']
})
export class HtmlReportComponent{

  @Input() htmlReportUrl: string | undefined;

  constructor(private _testRunnerService: TestRunnerService) {
  }


}
