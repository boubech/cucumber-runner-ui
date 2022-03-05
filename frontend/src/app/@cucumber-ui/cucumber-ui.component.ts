import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FeatureRunnerResponse} from "../api/models/feature-runner-response";
import {WorkspaceService} from "../services/workspace-service";
import {FileResponse} from "../api/models/file-response";

@Component({
  selector: 'app-cucumber-ui',
  templateUrl: './cucumber-ui.component.html',
  styleUrls: ['./cucumber-ui.component.css']
})
export class CucumberUiComponent implements OnInit {

  files: FileResponse[] = [];
  glues: String[] = [];

  featureRunnerResponse: FeatureRunnerResponse | undefined;


  constructor(private _workspaceService: WorkspaceService) {
  }

  ngOnInit(): void {
    this.refreshWorkspace();
    this.refreshGlues();
  }

  refresh() {
    this.refreshWorkspace();
    this.refreshGlues();
  }

  refreshWorkspace(): void {
    this._workspaceService.getFiles().subscribe(result => this.files = result);
  }

  refreshGlues(): void {
    this._workspaceService.getGlues().subscribe(result => this.glues = result);
  }


  onFeatureEditorChange(featureRunnerResponse: FeatureRunnerResponse) {
    this.featureRunnerResponse = featureRunnerResponse;
  }
}
