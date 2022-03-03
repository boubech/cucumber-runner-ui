import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {FeatureRunnerResponse} from "../../api/models/feature-runner-response";
import {TestRunnerService} from "../../services/test-runner-service";

@Component({
  selector: 'app-html-report',
  templateUrl: './html-report.component.html',
  styleUrls: ['./html-report.component.css']
})
export class HtmlReportComponent implements OnInit {

  @Input() featureRunnerResponse: FeatureRunnerResponse | undefined;

  htmlReportUrl: string | undefined;

  constructor(private _testRunnerService: TestRunnerService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['featureRunnerResponse']!.currentValue.id != 0) {
      this.htmlReportUrl = this._testRunnerService.getHtmlReportUrl(changes['featureRunnerResponse']!.currentValue);
    }
  }

}
