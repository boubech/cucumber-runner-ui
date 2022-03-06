import {Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Test} from 'src/app/services/test-runner-service';
import {LogService} from "../../services/log-service";

@Component({
  selector: 'app-console',
  templateUrl: './console-ui.component.html',
  styleUrls: ['./console-ui.component.css']
})
export class ConsoleUiComponent implements OnInit {

  //@Input() test: Test | undefined;

  lines: string[] = [];

  autoScroll: boolean = true;

  @ViewChild('console') console: ElementRef | undefined;

  constructor(private _logService: LogService) {
  }

  ngOnInit(): void {
    this._logService.getObservable()?.subscribe(response => {
      this.lines.push(response.message.message);
      console.log(response.message)
      this.scrollToBottom();
    })
  }
  /*
  ngOnChanges(changes: SimpleChanges) {
    if (changes['test'] &&
      changes['test']!.currentValue &&
      changes['test']!.currentValue.id != 0) {
      //this.lines = this.lines.concat(changes['test']!.currentValue.reportPretty);
      //this.scrollToBottom();
    }
  }
  */
  scrollToBottom() {
    if (this.console) {
      this.console.nativeElement.scrollTop = this.console.nativeElement.scrollTopMax;
    }
  }

  enableAutoScroll() {
    //this.autoScroll = this.console!.nativeElement.scrollTop == this.console!.nativeElement.scrollTopMax;
  }
}
