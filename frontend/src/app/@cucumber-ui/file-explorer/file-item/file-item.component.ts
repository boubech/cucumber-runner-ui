import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FileExplorerItem} from "../file-explorer.component";
import {WorkspaceService} from "../../../services/workspace-service";
import {DialogCreateDirectoryComponent} from "./dialog-create-directory/dialog-create-directory.component";
import {MatDialog} from "@angular/material/dialog";
import { DialogRenameComponent } from './dialog-rename/dialog-rename.component';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.css']
})
export class FileItemComponent {

  @Input() file: FileExplorerItem | undefined;
  @Output() onSelected = new EventEmitter<FileExplorerItem>();
  @Output() onUnselected = new EventEmitter<FileExplorerItem>();
  @Output() onUpdate = new EventEmitter<FileExplorerItem>();
  @Output() onDelete = new EventEmitter<FileExplorerItem>();
  @Output() onUpload = new EventEmitter<FileExplorerItem>();

  isFocused: boolean = false;
  fileToUpload: File | undefined;

  constructor(private _workspaceService: WorkspaceService, public dialog: MatDialog) {
  }

  showOrHideDirectoryContent() {
    this.file!.showContent = !this.file!.showContent;
  }

  focusChange(isFocused: boolean) {
    this.isFocused = isFocused;
  }

  select() {
    if (this.file?.parent && this.file.parent.selected) {
      this.recursiveSelect(this.file.parent, false);
      this.file!.selected = true;
    } else {
      this.file!.selected = !this.file!.selected;
    }
    this.recursiveSelect(this.file!, this.file!.selected);
    if (this.file!.selected) {
      this.onSelected.emit(this.file!);
    } else {
      this.onUnselected.emit(this.file!);
    }
  }

  recursiveSelect(file: FileExplorerItem, selected: boolean): void {
    file.selected = selected;
    let self = this;
    if (file.isDirectory) {
      file.files?.forEach(subfile => self.recursiveSelect(subfile, selected));
    }
  }

  delete(file: FileExplorerItem) {
    this._workspaceService.deleteFiles(file.path).subscribe(() => {
      this.onDeleteEvent(file)
    });
  }

  onDeleteEvent(file: FileExplorerItem) {
    this.onDelete.emit(file)
  }

  onFileSelected(event: any) {
    this.fileToUpload = event!.target!.files[0]!;
    this._workspaceService.uploadFile(this.fileToUpload!, this.file?.path!).subscribe(() => {
      this.onUploadEvent(this.file!);
    });
  }

  onUploadEvent(file: FileExplorerItem): void {
    this.onUpload.emit(file);
  }

  makeDirectory() {
    const dialogRef = this.dialog.open(DialogCreateDirectoryComponent, {
      width: '250px',
      data: {directory: 'sub-directory'},
    });
    dialogRef.afterClosed().subscribe((directoryName: string) => {
      if (directoryName == undefined)
        return;
      this._workspaceService.makeDirectory(this.file?.path + '/' + directoryName).subscribe(result => {
        this.onUpdate.emit(this.file)
      });
    });
  }

  rename() {
    const dialogRef = this.dialog.open(DialogRenameComponent, {
      width: '250px',
      data: {newName: this.file?.name},
    });
    dialogRef.afterClosed().subscribe((newName: string) => {
      if (newName == undefined)
        return;
      let newPath = this.file?.path.replace(/\/[^\/]*$/i, '/') + newName;
      this._workspaceService.moveFile(this.file!.path, newPath).subscribe({
        next: () => {
          this.file!.name = newName;
          this.file!.path = newPath;
          this.onUpdateEvent(this.file!)
        },
        error: (error) => {
          console.log(error)
        }
      });
    });
  }

  onUpdateEvent(fileExplorerItem: FileExplorerItem) {
    this.onUpdate.emit(fileExplorerItem);
  }

  open() {
    this._workspaceService.openFile(this.file?.path!);
  }
}

