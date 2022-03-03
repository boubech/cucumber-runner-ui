import {Component, Input, OnInit} from '@angular/core';
import {FileResponse} from "../../../api/models/file-response";

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.css']
})
export class FileItemComponent implements OnInit {

  @Input() file: FileResponse | undefined;

  hideDirectoryContent: string = "none";

  constructor() { }

  ngOnInit(): void {
  }
  showOrHideDirectoryContent() {
    if (this.hideDirectoryContent == "none") {
      this.hideDirectoryContent = "block"
    } else {
      this.hideDirectoryContent = "none";
    }
  }

}
