import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FileResponse} from "../../api/models/file-response";
import {WorkspaceService} from "../../services/workspace-service";

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent {

  @Input() files: FileResponse[] | undefined;
  @Output() fileUploaded = new EventEmitter<File>();
  fileToUpload: File | undefined;

  constructor(private _workspaceService: WorkspaceService) {
  }

  onFileSelected(event: any): void {
    this.fileToUpload = event.target.files[0];
    this.uploadFile();
  }

  uploadFile(): void {
    this._workspaceService.uploadFile(this.fileToUpload!).subscribe(result => {
      this.fileUploaded.emit(this.fileToUpload);
    });
  }
}
