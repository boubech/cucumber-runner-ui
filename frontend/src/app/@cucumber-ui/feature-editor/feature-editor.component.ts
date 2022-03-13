import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  Inject,
  Input,
  Renderer2,
  ChangeDetectorRef
} from '@angular/core';
import {Test, TestRunnerService} from "../../services/test-runner-service";
import {DOCUMENT} from '@angular/common';

import * as ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import {AutoCompletionService} from './auto-completion-service';
import {GherkinHighlightRulesService} from './gherkin-hightlight-rules.service';
import {GlueResponse} from 'src/app/api/models';


export interface TestResult {
  stepRun: number;
  stepFailures: number;
  stepSkippeds: number;
  scenarioRun: number;
  scenarioFailures: number;
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
  codeEditor: any;
  testResult: TestResult | undefined;
  languages: Array<string> | undefined;
  languageSelected: string = 'en';


  @ViewChild('editorDiv') editor: ElementRef | undefined;

  constructor(private _testRunnerService: TestRunnerService,
              private _autoCompletionService: AutoCompletionService,
              private _gherkinHighlightRulesService: GherkinHighlightRulesService,
              private _rendered: Renderer2,
              private _cdr: ChangeDetectorRef,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngAfterViewInit(): void {
    this.initCodeEditor({enableBasicAutocompletion: this._autoCompletionService.get(this.glues)});
  }

  initCodeEditor(config: any): void {
    this._gherkinHighlightRulesService.init();
    this.languages = this._gherkinHighlightRulesService.getLanguagesAvailables();
    const options = {
      value: this.test?.feature,
      minLines: 20,
      highlightSelectedWord: true,
      autoScrollEditorIntoView: true,
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
      self.test!.feature = self.codeEditor.session.getValue();
      self.onContentEditorChanged.emit(self.test!.feature);
    })
  }

  onLanguageChange(event: any) {
    console.log(event)
    this._gherkinHighlightRulesService.setLanguages(event);
  }

  run(): void {
    this.running = true;
    const self = this;
    let getTestResult = () => {
      self._testRunnerService.get(self.test!).subscribe({
        next: (test: Test) => {
          self.parseTestResult(test);
          if (this.shouldReloadTest(test)) {
            setTimeout(getTestResult, 2000);
          }
        },
        error: (error: { error: Test; }) => {
          let test = error.error;
          self.parseTestResult(test);
          if (this.shouldReloadTest(test)) {
            setTimeout(getTestResult, 2000);
          }
        }
      });
    };

    this._testRunnerService.run2(this.test!).subscribe(() => getTestResult())
  }

  stop() {
    this.test!.id = undefined
    this.test!.state = undefined
  }

  private shouldReloadTest(test: Test) : boolean {
    return  test.state == undefined || 
            test.state == 'running' || 
            test.reportJson == undefined || 
            test.reportPretty == undefined
  }

  parseTestResult(test: Test): void {
    this.test!.id = test.id;
    this.test!.reportPretty = test.reportPretty;
    this.test!.reportHtmlId = test.reportHtmlId;
    this.test!.reportJson = test.reportJson;
    this.test!.state = test.state;
    switch(this.test?.state) {
      case 'running':
        break;
      case 'failure':
      case 'success':
      case 'error':
        this.running = false;
        this.onTestChange.emit(this.test);
        this.parseJsonResult();
        break;
    }
  }

  parseJsonResult(): void {
    if (this.test?.reportJson && this.test?.reportJson.length > 0) {
      let jsonResult = JSON.parse(this.test.reportJson.join(""));
      let lines = this.editor?.nativeElement.querySelectorAll('.ace_line');
      this.resetLineStyles(lines);
      let testResult: TestResult = {stepFailures: 0, stepRun: 0, stepSkippeds:0, scenarioFailures:0, scenarioRun: 0}
      this.testResult = undefined;
      if (jsonResult[0]) {
        jsonResult[0].elements.forEach((scenario: any) => this.parseJsonResultScenario(testResult, scenario, lines))
      }
      this.testResult = testResult;
    }
  }

  private parseJsonResultScenario(testResult: TestResult, scenario: any, lines: any) {
    testResult.scenarioRun = testResult.scenarioRun + 1;
    let errorOcccured = false;
    for (let step of scenario.steps) {
      if (!step.line || step.line > lines.length){
        continue;
      }
      this._rendered.addClass(lines[step.line - 1], step.result.status);
      switch (step.result.status) {
        case 'passed':
          testResult.stepRun = testResult.stepRun + 1;
          break;
        case 'failed':
          testResult.stepSkippeds = testResult.stepSkippeds + 1;
          errorOcccured = true;
          break;
        case 'undefined':
        case 'skipped':
          testResult.stepFailures = testResult.stepFailures + 1;
          errorOcccured = true;
          break;
      }
    }
    if (errorOcccured) {
      testResult.scenarioFailures = testResult.scenarioFailures + 1;
    }
  }

  private resetLineStyles(lines: any) {
    lines.forEach((line: any) => {
      this._rendered.removeClass(line, 'passed');
      this._rendered.removeClass(line, 'failed');
      this._rendered.removeClass(line, 'undefined');
      this._rendered.removeClass(line, 'skipped');
    })
  }

}
