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

  files: FileResponse[] = [];
  glues: GlueResponse[] = [];
  editorEnabled: boolean = true;

  test: Test = {
    feature: 'Feature: Test \n' +
      '  Scenario: Test nominal \n' +
      '    Given un parametre 1 \n' +
      '    When un ajout de 1 \n' +
      '    Then un resultat 2 \n' +
      '    Then un resultat 3',
    settings: [
      {key: "JAVA_OPT", value: '-Xmx512M', type: "environment"},
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
    this.refreshWorkspace();
    this.refreshGlues();
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

  onContentEditorChanged(editorContent: string) {
    this.test.feature = editorContent;
  }

}
