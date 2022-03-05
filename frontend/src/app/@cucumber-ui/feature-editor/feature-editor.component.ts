import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, Renderer2, Inject} from '@angular/core';
import {FeatureRunnerRequest} from "../../api/models/feature-runner-request";
import {FeatureRunnerResponse} from "../../api/models/feature-runner-response";
import {TestRunnerService} from "../../services/test-runner-service";
import {DOCUMENT} from '@angular/common';

import * as ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';



@Component({
  selector: 'app-feature-editor',
  templateUrl: './feature-editor.component.html',
  styleUrls: ['./feature-editor.component.css']
})
export class FeatureEditorComponent implements OnInit {

  running: boolean = false;
  featureText: String = '';
  codeEditor: any;
  featureRunnerRequest: FeatureRunnerRequest | undefined;
  featureRunnerResponse: FeatureRunnerResponse | undefined;

  @Output() onChange = new EventEmitter<FeatureRunnerResponse>();
  @Output() onContentEditorChanged = new EventEmitter<String>();

  @ViewChild('editorDiv') editor: ElementRef | undefined;
  window: (Window & typeof globalThis) | null;

  constructor(private _testRunnerService: TestRunnerService,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {


    const element = this.editor!.nativeElement;

    const options = {
      value: "Feature: Test\n" +
        "  Scenario: Test nominal\n" +
        "    Given un parametre 1\n" +
        "    When un ajout de 1\n" +
        "    Then un résultat 2",
      minLines: 14,
      maxLines: Infinity,
      highlightSelectedWord: true,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      theme: 'ace/theme/github',
      enableLiveAutocompletion: true
    };

    this.codeEditor = ace.edit(element, options);
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.14/src-noconflict');

    this.codeEditor.getSession().setMode('ace/mode/gherkin');
    this.codeEditor.setShowFoldWidgets(true);
    let self=this;
    this.codeEditor.session.on('tokenizerUpdate', function() {
      self.featureText = self.codeEditor!.getSession().getValue();
      self.onContentEditorChanged.emit(self.featureText);
    });

  }

  executeFeature(): void {
    this.featureRunnerRequest = {feature: this.featureText.split('\n')};
    this.running = true;
    this._testRunnerService.executeFeature(this.featureRunnerRequest).subscribe(featureRunnerResponse => {
      this.featureRunnerResponse = featureRunnerResponse;
      this.running = false;
      this.onChange.emit(this.featureRunnerResponse);
    });
  }
}
