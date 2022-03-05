import {Component, Input, OnInit} from '@angular/core';
import {FileResponse} from "../../../api/models/file-response";

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.css']
})
export class FileItemComponent implements OnInit {

  @Input() file: FileResponse | undefined;

  hideDirectoryContent: boolean = true;
  isFocused: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  showOrHideDirectoryContent() {
    this.hideDirectoryContent = !this.hideDirectoryContent;
  }

  focusChange(isFocused: boolean) {
    this.isFocused = isFocused;
    console.log(this.isFocused)
  }
}
