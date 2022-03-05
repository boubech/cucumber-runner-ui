import {AfterViewChecked, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FeatureRunnerResponse} from "../../api/models/feature-runner-response";

@Component({
  selector: 'app-console',
  templateUrl: './console-ui.component.html',
  styleUrls: ['./console-ui.component.css']
})
export class ConsoleUiComponent implements AfterViewChecked {

  @Input() featureRunnerResponse: FeatureRunnerResponse | undefined;

  lines: string[] = [];

  autoScroll: boolean = true;

  @ViewChild('myDiv') myDiv: ElementRef | undefined;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['featureRunnerResponse'] &&
      changes['featureRunnerResponse']!.currentValue &&
      changes['featureRunnerResponse']!.currentValue.id != 0) {
      this.lines = this.lines.concat(changes['featureRunnerResponse']!.currentValue.reportPretty);
      console.log(this.autoScroll)
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if (this.autoScroll) {
      this.myDiv!.nativeElement.scrollTop = this.myDiv!.nativeElement.scrollHeight;
    }
  }

  enableAutoScroll() {
    console.log("autoscroll",this.autoScroll)
    this.autoScroll = this.myDiv!.nativeElement.scrollTop == this.myDiv!.nativeElement.scrollHeight;
  }
}
