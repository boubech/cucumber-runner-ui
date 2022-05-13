import {Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {LogService} from "../../services/log-service";

@Component({
  selector: 'app-console',
  templateUrl: './console-ui.component.html',
  styleUrls: ['./console-ui.component.css']
})
export class ConsoleUiComponent implements OnInit {

  lines: string[] = [];
  @ViewChild('console') console: any;
  wrapLine: boolean = false;

  constructor(private _logService: LogService) {
  }

  ngOnInit(): void {
    this._logService.getObservable()?.subscribe(response => {
      console.log(response.message)
      this.lines.push('#' + response.message.testExecutionContextIdentifier + ' ' + response.message.message);
      this.scrollToBottom();
    })
  }

  scrollToBottom() {
    if (this.console) {
      this.console.elementRef.nativeElement.scrollTop = this.console.elementRef.nativeElement.scrollTopMax;
    }
  }

  clearConsole() {
    this.lines = []
  }

  enableWrapLine() {
    this.wrapLine = !this.wrapLine;
  }
}
