import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FeatureRunnerResponse} from "../api/models/feature-runner-response";
import {WorkspaceService} from "../services/workspace-service";
import {FileResponse} from "../api/models/file-response";
import {GlueResponse} from '../api/models';
import {Test, TestRunnerService} from '../services/test-runner-service';

@Component({
  selector: 'app-cucumber-ui',
  templateUrl: './cucumber-ui.component.html',
  styleUrls: ['./cucumber-ui.component.css']
})
export class CucumberUiComponent implements OnInit {

  files: FileResponse[] | undefined;
  glues: GlueResponse[] | undefined;
  editorEnabled: boolean = true;

  test: Test = {
    feature: 'Feature: Addition \n' +
      '  Scenario: Nominal test \n' +
      '    Given an integer 1 \n' +
      '    When add -1 \n' +
      '    Then the result is 0 \n' +
      '    Then the result is 1',
    settings: [
      {key: "JAVA_OPTS", value: '-Xmx128M', type: "environment"},
      {key: "cucumber.publish.quiet", value: 'true', type: "property"}
    ]
  };
  featureRunnerResponse: FeatureRunnerResponse | undefined;
  htmlReportUrl: string | undefined;

  constructor(private _workspaceService: WorkspaceService,
              private _changeDetector: ChangeDetectorRef,
  private _testRunnerService: TestRunnerService) {
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    console.log("refresh")
    this.refreshGlues();
    this.refreshWorkspace();
  }

  refreshWorkspace(): void {
    this._workspaceService.getFiles().subscribe(result => this.files = result);
  }

  refreshGlues(): void {
    this._workspaceService.getGlues().subscribe(result => {
      this.glues = result;
      this.editorEnabled = false;
      this._changeDetector.detectChanges();
      this.editorEnabled = true;
    });
  }


  onFeatureEditorChange(featureRunnerResponse: FeatureRunnerResponse) {
    this.featureRunnerResponse = featureRunnerResponse;
  }

  onTestChange(test: Test) {
    this.test = test;
    this.refreshWorkspace();
    if (test.reportHtmlId) {
      this.htmlReportUrl = this._testRunnerService.getHtmlReportUrlFromTest(test);
    }
  }

}
