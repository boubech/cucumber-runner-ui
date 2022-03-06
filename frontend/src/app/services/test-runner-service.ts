import {Injectable} from "@angular/core";
import {ApiConfiguration} from "../api/api-configuration";
import {map, observable, Observable, of} from "rxjs";
import {ApiService} from "../api/services/api.service";
import {FeatureRunnerOptionRequest} from "../api/models/feature-runner-option-request";

export interface Test {
  feature: string;
  id?: string;
  reportHtmlId?: string;
  reportJson?: Array<string>;
  reportPretty?: Array<string>;
  settings: Array<Setting>;
}

export interface Setting {
  key: string;
  value: string;
  type: 'property' | 'environment';
}

@Injectable({providedIn: 'root'})
export class TestRunnerService {

  constructor(private _apiService: ApiService, private _apiConfiguration: ApiConfiguration) {
  }

  getHtmlReportUrlFromTest(test: Test): string {
    return this._apiConfiguration.rootUrl + "/html-reports/" + test.id;
  }

  run(test: Test): Observable<Test> {

    let options: FeatureRunnerOptionRequest[] = test.settings.map(setting => {
      return {key: setting.key, value: setting.value, type: setting.type}
    });
    return this._apiService.runFeature({body: {feature: test.feature.split("\n"), options: options}}).pipe(map(response => {
      test.id = response.id;
      test.reportHtmlId = response.reportHtmlId;
      test.reportJson = response.reportJson;
      test.reportPretty = response.reportPretty;
      return test;
    }));
  }
}
