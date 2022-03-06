import {Component, ElementRef, EventEmitter, Output, ViewChild, Inject, Input, Renderer2} from '@angular/core';
import {Test, TestRunnerService} from "../../services/test-runner-service";
import {DOCUMENT} from '@angular/common';

import * as ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import {AutoCompletionService} from './auto-completion-service';
import {GherkinHighlightRulesService} from './gherkin-hightlight-rules.service';
import {GlueResponse} from 'src/app/api/models';


class TestResult {
  stepRun: number = 0;
  stepFailures: number = 0;
  stepSkippeds: number = 0;
  scenarioRun: number = 0;
  scenarioFailures: number = 0;
}

@Component({
  selector: 'app-feature-editor',
  templateUrl: './feature-editor.component.html',
  styleUrls: ['./feature-editor.component.css']
})
export class FeatureEditorComponent {


  @Input() test: Test | undefined;
  @Input() glues: Array<GlueResponse> = [];
  @Output() onTestChange = new EventEmitter<Test>();
  @Output() onContentEditorChanged = new EventEmitter<string>();

  running: boolean = false;
  state: 'failure' | 'success' | undefined;
  featureText: string = '';
  codeEditor: any;
  testResult: TestResult = new TestResult();

  @ViewChild('editorDiv') editor: ElementRef | undefined;

  constructor(private _testRunnerService: TestRunnerService,
              private _autoCompletionService: AutoCompletionService,
              private _gherkinHighlightRulesService: GherkinHighlightRulesService,
              private _rendered: Renderer2,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngAfterViewInit(): void {
    this.initCodeEditor({enableBasicAutocompletion: this._autoCompletionService.get(this.glues)});
  }

  initCodeEditor(config: any): void {
    this._gherkinHighlightRulesService.init();

    const options = {
      value: this.test?.feature,
      minLines: 14,
      maxLines: Infinity,
      highlightSelectedWord: true,
      enableBasicAutocompletion: config.enableBasicAutocompletion,
      enableSnippets: true,
      theme: 'ace/theme/github',
      enableLiveAutocompletion: true
    };
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.14/src-noconflict');

    const element = this.editor!.nativeElement;
    this.codeEditor = ace.edit(element, options);
    this.codeEditor.session.setMode('ace/mode/gherkin');
    this.codeEditor.setShowFoldWidgets(true);
    this.codeEditor.setFontSize('1rem');
    this.codeEditor.setTheme('ace/theme/chrome');
    let self = this;
    this.codeEditor.session.on('tokenizerUpdate', function () {
      self.featureText = self.codeEditor.session.getValue();
      self.onContentEditorChanged.emit(self.featureText);
    })
  }

  executeFeature(): void {
    this.running = true;
    this.test!.feature = this.featureText;
    this._testRunnerService.run(this.test!).subscribe({
      next: test => {
        this.state = 'success';
        this.getTestResult(test);
      },
      error: error => {
        this.state = 'failure';
        this.getTestResult(error.error);
      }
    });
  }

  getTestResult(test: Test): void {
    this.test!.id = test.id;
    this.test!.reportPretty = test.reportPretty;
    this.test!.reportHtmlId = test.reportHtmlId;
    this.test!.reportJson = test.reportJson;
    this.running = false;
    this.onTestChange.emit(this.test);
    this.parseJsonResult();
  }

  parseJsonResult(): void {
    if (this.test?.reportJson && this.test?.reportJson.length > 0) {
      let jsonResult = JSON.parse(this.test.reportJson.join(""));
      let lines = this.editor?.nativeElement.querySelectorAll('.ace_line');
      lines.forEach((line: any) => {
        this._rendered.removeClass(line, 'passed');
        this._rendered.removeClass(line, 'failed');
        this._rendered.removeClass(line, 'undefined');
        this._rendered.removeClass(line, 'skipped');
      })
      this.testResult.stepRun = 0;
      this.testResult.stepSkippeds = 0;
      this.testResult.stepFailures = 0;
      this.testResult.scenarioRun = 0;
      this.testResult.scenarioFailures = 0;

      if (jsonResult[0]) {
        for (let scenario of jsonResult[0].elements) {
          this.testResult.scenarioRun = this.testResult.scenarioRun + 1;
          let errorOcccured = false;
          for (let step of scenario.steps) {
            this._rendered.addClass(lines[step.line - 1], step.result.status);
            switch (step.result.status) {
              case 'passed':
                this.testResult.stepRun = this.testResult.stepRun + 1;
                break;
              case 'failed':
                this.testResult.stepSkippeds = this.testResult.stepSkippeds + 1;
                errorOcccured = true;
                break;
              case 'undefined':
              case 'skipped':
                this.testResult.stepFailures = this.testResult.stepFailures + 1;
                errorOcccured = true;
                break;
            }
            if (errorOcccured) {
              this.testResult.scenarioFailures = this.testResult.scenarioFailures + 1;
            }
          }
        }
      }
    }
  }
}
