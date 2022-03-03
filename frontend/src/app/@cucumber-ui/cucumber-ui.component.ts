import {Component, OnInit} from '@angular/core';
import {FeatureRunnerResponse} from "../api/models/feature-runner-response";
import {FeatureRunnerRequest} from "../api/models/feature-runner-request";
import {TestRunnerService} from "../services/test-runner-service";
import {WorkspaceService} from "../services/workspace-service";
import {FileResponse} from "../api/models/file-response";

@Component({
  selector: 'app-cucumber-ui',
  templateUrl: './cucumber-ui.component.html',
  styleUrls: ['./cucumber-ui.component.css']
})
export class CucumberUiComponent implements OnInit {

  filename: string = '';
  blob: any = null;

  files: FileResponse[] = [];
  glues: String[] = [];
  featureText: String = 'Feature: Test\n' +
    '  Scenario: Test nominal\n' +
    '    Given un parametre 1\n' +
    '    When un ajout de 1\n' +
    '    Then un résultat 2';
  featureRunnerRequest: FeatureRunnerRequest = {feature: [], options: []};
  featureRunnerResponse: FeatureRunnerResponse = {
    id: 0, reportHtmlId: 0, reportJson: [], reportPretty: [
      "",
      "Scenario: Test nominal \u001b[90m# ///var/folders/t8/1cbtfr2j139f2jbwcq6mg0gh0000gp/T/cucumber10371156600564081996.feature:2\u001b[0m",
      "  \u001b[32mGiven \u001b[0m\u001b[32mun parametre \u001b[0m\u001b[32m\u001b[1m1\u001b[0m \u001b[90m# com.boubech.cucumber.ui.example.MyStepdefs.set(int)\u001b[0m",
      "  \u001b[32mWhen \u001b[0m\u001b[32mun ajout de \u001b[0m\u001b[32m\u001b[1m1\u001b[0m   \u001b[90m# com.boubech.cucumber.ui.example.MyStepdefs.add(int)\u001b[0m",
      "  \u001b[31mThen \u001b[0m\u001b[31mun résultat \u001b[0m\u001b[31m\u001b[1m5\u001b[0m   \u001b[90m# com.boubech.cucumber.ui.example.MyStepdefs.verify(int)\u001b[0m",
      "      \u001b[31morg.opentest4j.AssertionFailedError: ",
      "expected: 5",
      " but was: 2",
      "\tat java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)",
      "\tat java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)",
      "\tat java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)",
      "\tat com.boubech.cucumber.ui.example.MyStepdefs.verify(MyStepdefs.java:26)",
      "\tat ✽.un résultat 5(file:///var/folders/t8/1cbtfr2j139f2jbwcq6mg0gh0000gp/T/cucumber10371156600564081996.feature:5)",
      "\u001b[0m"
    ]
  };

  htmlReportUrl: string = "";

  fileToUpload: any;

  constructor(private _testRunnerService: TestRunnerService,
              private _workspaceService: WorkspaceService) {
  }

  ngOnInit(): void {
    this.refreshWorkspace();
    this.refreshGlues();
  }

  onFileSelected(event: any): void {
    this.fileToUpload = event.target.files[0];
  }

  uploadFile(): void {
    this._workspaceService.uploadFile(this.fileToUpload).subscribe(result => {
      this.refreshWorkspace();
      this.refreshGlues();
    });
  }

  refreshWorkspace(): void {
    this._workspaceService.getFiles().subscribe(result => this.files = result);
  }

  refreshGlues(): void {
    this._workspaceService.getGlues().subscribe(result => this.glues = result);
  }

  executeFeature(): void {
    this.featureRunnerRequest.feature = this.featureText.split('\n');
    this._testRunnerService.executeFeature(this.featureRunnerRequest).subscribe(featureRunnerResponse => {
      this.featureRunnerResponse = featureRunnerResponse;
      this.htmlReportUrl = this._testRunnerService.getHtmlReportUrl(featureRunnerResponse);
    });
  }
}
