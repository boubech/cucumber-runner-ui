import {Injectable} from "@angular/core";
import {ApiConfiguration} from "../api/api-configuration";
import {map, Observable} from "rxjs";
import {ApiService} from "../api/services/api.service";
import {Configuration, TestResponse} from "../api/models";
import {TestResult} from "../@cucumber-ui/feature-editor/feature-editor.component";

export interface Test {
  feature: string;
  id?: string;
  reportHtmlId?: string;
  reportPretty?: Array<string>;
  settings?: Array<Setting>;
  state?: 'running' | 'success' | 'failure' | 'error'
  cucumberReport?: any;
  testResult?: TestResult
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

  getDefaultSettings(): Observable<Configuration[]> {
    return this._apiService.getConfiguration();
  }

  run(test: Test): Observable<Test> {
    let options: Configuration[] = test.settings!.map(setting => {
      return {key: setting.key, value: setting.value, type: setting.type}
    });
    return this._apiService.runTest({
      body: {
        feature: test.feature.split("\n"),
        options: options
      }
    }).pipe(map(response => {
      return this.mapTestReponseToTest(response, test);
    }));
  }

  get(test: Test): Observable<Test> {
    return this._apiService.getTest({testId: test.id!}).pipe(map(response => {
      return this.mapTestReponseToTest(response, test);
    }));
  }

  private mapTestReponseToTest(response: TestResponse, test: Test): Test {
    test.id = response.id;
    test.reportHtmlId = response.reportHtmlId;
    test.reportPretty = response.reportPretty;
    if (response.reportJson && response.reportJson.length > 0) {
      test.cucumberReport = JSON.parse(response.reportJson.join(""));
    } else {
      test.cucumberReport = undefined;
    }
    switch (response.status) {
      case "error":
        test.state = 'error';
        break;
      case "failed":
        test.state = 'failure';
        break;
      case "success":
        test.state = 'success';
        break;
      default:
        break;
    }
    return test;
  }

}
