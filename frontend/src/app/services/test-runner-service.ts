import {Injectable} from "@angular/core";
import {ApiConfiguration} from "../api/api-configuration";
import {Observable} from "rxjs";
import {FeatureRunnerResponse} from "../api/models/feature-runner-response";
import {FeatureRunnerRequest} from "../api/models/feature-runner-request";
import {ApiService} from "../api/services/api.service";

@Injectable({providedIn: 'root'})
export class TestRunnerService {

  constructor(private _apiService: ApiService, private _apiConfiguration: ApiConfiguration) {
  }

  getHtmlReportUrl(featureRunnerResponse: FeatureRunnerResponse) {
    return this._apiConfiguration.rootUrl + "/html-reports/" + featureRunnerResponse.id;
  }

  executeFeature(request: FeatureRunnerRequest): Observable<FeatureRunnerResponse> {
    return this._apiService.runFeature({body: request});
  }
}
