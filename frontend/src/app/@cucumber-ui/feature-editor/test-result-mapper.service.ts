import {Injectable, Renderer2} from "@angular/core";
import {TestResult} from "./feature-editor.component";

@Injectable({providedIn: 'root'})
export class TestResultMapperService {


  mapTestResult(cucumberReport: any, aceEditor: any, renderer: Renderer2): TestResult | undefined {
    if (cucumberReport) {
      let guttersDisplayed = aceEditor?.nativeElement.querySelectorAll('.ace_gutter-cell');
      let linesDisplayed = aceEditor?.nativeElement.querySelectorAll('.ace_line');
      this.resetLineStyles(linesDisplayed, renderer);
      let testResult: TestResult = {stepFailures: 0, stepRun: 0, stepSkippeds: 0, scenarioFailures: 0, scenarioRun: 0}
      cucumberReport.forEach((feature: any) => this.mapTestResultFeature(feature,
        testResult,
        guttersDisplayed,
        linesDisplayed,
        renderer));
      return testResult;
    } else {
      return undefined;
    }
  }

  private mapTestResultFeature(feature: any, testResult: TestResult, guttersDisplayed: any, linesDisplayed: any, renderer: Renderer2) : void {
    let backgrounds = feature.elements.filter((i: { type: string; }) => i.type == 'background');
    backgrounds.forEach((background: any) => background .steps
      .forEach((step: any) =>
        this.mapTestResultStep(testResult, step, guttersDisplayed, linesDisplayed, renderer)));

    let scenarios = feature.elements.filter((i: { type: string; }) => i.type == 'scenario');
    scenarios.forEach((scenario: any) =>
      this.mapTestResultScenarios(testResult, scenario, guttersDisplayed, linesDisplayed, renderer));
  }

  private mapTestResultScenarios(testResult: TestResult, scenario: any, guttersDisplayed: any, linesDisplayed: any, renderer: Renderer2) {
    testResult.scenarioRun = testResult.scenarioRun + 1;
    let errorOcccured = false;
    for (let step of scenario.steps) {
      this.mapTestResultStep(testResult, step, guttersDisplayed, linesDisplayed, renderer);
      if (!this.stepIsSuccessfully(step)) {
        errorOcccured = true;
      }
    }
    if (errorOcccured) {
      testResult.scenarioFailures = testResult.scenarioFailures + 1;
    }
  }

  private mapTestResultStep(testResult: TestResult, step: any, guttersDisplayed: any, linesDisplayed: any, renderer: Renderer2) {
    this.setLineStyles(step, guttersDisplayed, linesDisplayed, renderer);
    switch (step.result.status) {
      case 'passed':
        testResult.stepRun = testResult.stepRun + 1;
        break;
      case 'failed':
        testResult.stepSkippeds = testResult.stepSkippeds + 1;
        break;
      case 'undefined':
      case 'skipped':
        testResult.stepFailures = testResult.stepFailures + 1;
        break;
    }
  }

  private stepIsSuccessfully(step: any): boolean {
    switch (step.result.status) {
      case 'passed':
        return true;
      case 'failed':
      case 'undefined':
      case 'skipped':
      default:
        return false;
    }
  }

  private setLineStyles(step: any, guttersDisplayed: any, linesDisplayed: any, renderer: Renderer2): void {
    if (guttersDisplayed && guttersDisplayed.length != 0) {
      let lineNumber = step.line;
      let minLineDisplayed = guttersDisplayed[0].innerText.trim();
      let maxLineDisplayed = guttersDisplayed[guttersDisplayed.length-1].innerText.trim();
      if (minLineDisplayed <= lineNumber && lineNumber <= maxLineDisplayed) {
        let index = lineNumber - minLineDisplayed;
        if (index >= 0 && index < linesDisplayed.length - 1) {
          renderer.addClass(linesDisplayed[index], step.result.status);
        }
      }
    }
  }

  private resetLineStyles(lines: any, renderer: Renderer2) {
    lines.forEach((line: any) => {
      renderer.removeClass(line, 'passed');
      renderer.removeClass(line, 'failed');
      renderer.removeClass(line, 'undefined');
      renderer.removeClass(line, 'skipped');
    })
  }


}
