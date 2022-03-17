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
import {TestResultMapperService} from "./test-result-mapper.service";


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
  @Input() language: string | undefined;
  @Input() glues: Array<GlueResponse> = [];
  @Output() onTestChange = new EventEmitter<Test>();
  @Output() onContentEditorChanged = new EventEmitter<string>();
  @Output() onLanguageChanged = new EventEmitter<string>();

  running: boolean = false;
  codeEditor: any;

  @ViewChild('editorDiv') editor: ElementRef | undefined;

  constructor(private _testRunnerService: TestRunnerService,
              private _autoCompletionService: AutoCompletionService,
              private _gherkinHighlightRulesService: GherkinHighlightRulesService,
              private _rendered: Renderer2,
              private _cdr: ChangeDetectorRef,
              private _testResultMapperService: TestResultMapperService,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngAfterViewInit(): void {
    this.initCodeEditor({enableBasicAutocompletion: this._autoCompletionService.get(this.glues)});
  }

  initCodeEditor(config: any): void {
    this._gherkinHighlightRulesService.init();
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
    this.codeEditor.session.setMode(this._gherkinHighlightRulesService.getMode());
    this.codeEditor.setShowFoldWidgets(true);
    this.codeEditor.setFontSize('0.9rem');
    this.codeEditor.setTheme('ace/theme/chrome');
    let self = this;
    this.codeEditor.session.on('tokenizerUpdate', function () {
      self.test!.feature = self.codeEditor.session.getValue();
      self.detectLanguageChange();
      self.onContentEditorChanged.emit(self.test!.feature);
    })
    this.codeEditor.session.on("changeScrollTop", function () {
      self.test!.testResult = self.mapTestResult();
    })
    this.codeEditor.session.on("changeScrollLeft", function () {
      self.test!.testResult = self.mapTestResult();
    })
  }

  detectLanguageChange() {
    let langToConfigure = undefined;
    let lineDetected = this.test!.feature.split('\n').find(line => line.trim().startsWith('#language:'));
    if (lineDetected) {
      let langDefined = lineDetected.split(':')[1].trim();
      if (langDefined) {
        this._gherkinHighlightRulesService.getLanguagesAvailables()
                                          .filter(langAvailable => langAvailable == langDefined)
                                          .forEach(lang => langToConfigure = lang);
      }
    }
    if (langToConfigure == undefined) {
      langToConfigure = this._gherkinHighlightRulesService.getDefaultLanguage();
    }
    if (!this.language || langToConfigure != this.language) {
      this.language = langToConfigure;
      this._gherkinHighlightRulesService.setLanguages(this.language!);
      this.onLanguageChanged.emit(this.language)
    }
  }

  run(): void {
    this.running = true;
    this.test!.cucumberReport = undefined;
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

    this._testRunnerService.run(this.test!).subscribe(() => getTestResult())
  }

  stop() {
    this.test!.id = undefined
    this.test!.state = undefined
  }

  shouldReloadTest(test: Test): boolean {
    return test.state == undefined ||
      test.state == 'running' ||
      test.reportPretty == undefined ||
      test.reportHtmlId == undefined ||
      test.cucumberReport == undefined
  }

  parseTestResult(test: Test): void {
    this.test!.id = test.id;
    this.test!.reportPretty = test.reportPretty;
    this.test!.reportHtmlId = test.reportHtmlId;
    this.test!.cucumberReport = test.cucumberReport;
    this.test!.state = test.state;
    switch (this.test?.state) {
      case 'running':
        break;
      case 'failure':
      case 'success':
      case 'error':
        this.running = false;
        this.onTestChange.emit(this.test);
        this.test.testResult = this.mapTestResult();
        break;
    }
  }


  private mapTestResult(): TestResult | undefined {
    if (this.test!.cucumberReport && this.editor) {
      return this._testResultMapperService.mapTestResult(this.test!.cucumberReport, this.editor, this._rendered);
    } else {
      return undefined;
    }
  }


}
