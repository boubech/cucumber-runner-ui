import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {FileResponse} from "../../api/models/file-response";
import {WorkspaceService} from "../../services/workspace-service";
import {FileToDeleteRequest} from "../../api/models/file-to-delete-request";

export interface FileExplorerItem {
  parent?: FileExplorerItem;
  isDirectory: boolean;
  name: string;
  path: string;
  selected: boolean;
  files?: FileExplorerItem[];
}

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent {

  @Input() files: FileResponse[] | undefined;
  fileExplorerItems: FileExplorerItem[] = [];

  @Output() fileUploaded = new EventEmitter<File>();
  @Output() filesDeleted = new EventEmitter<FileToDeleteRequest[]>();
  fileToUpload: File | undefined;

  hasItemSelected: boolean = false;

  constructor(private _workspaceService: WorkspaceService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['files'] && changes['files']!.currentValue) {
      this.updateAllItems();
    }
  }

  updateAllItems() {
    let itemsToUpdate = this.convert(this.files!, undefined);
    this.updateExisting(this.fileExplorerItems, itemsToUpdate);
    this.removeNoExisting(this.fileExplorerItems, itemsToUpdate);
  }

  private updateExisting(existingItems: FileExplorerItem[], updatedItems: FileExplorerItem[]) {
    updatedItems.forEach(itemToUpdate => {
      let match = existingItems.find(i => i.path == itemToUpdate.path);
      if (match && match.isDirectory) {
        this.updateExisting(match.files!, itemToUpdate.files!);
        this.removeNoExisting(match.files!, itemToUpdate.files!);
      } else if (!match) {
        existingItems.push(itemToUpdate);
      }
    });
  }

  private removeNoExisting(existingItems: FileExplorerItem[], updatedItems: FileExplorerItem[]) {
    let toRemove: FileExplorerItem[] = [];
    existingItems.forEach((existing, index) => {
      if (!updatedItems.find(i => i.path == existing.path)) {
        toRemove.push(existing);
      }
    });
    toRemove.forEach(i => existingItems.splice(existingItems.indexOf(i), 1))
  }

  onFileSelected(event: any): void {
    this.fileToUpload = event.target.files[0];
    this.uploadFile();
  }

  uploadFile(): void {
    this._workspaceService.uploadFile(this.fileToUpload!).subscribe(() => {
      this.fileUploaded.emit(this.fileToUpload);
    });
  }

  deleteFiles(): void {
    let filesToDeletes = this.getFileSelected(this.fileExplorerItems).map(file => {
      return {path: file.path};
    });
    this._workspaceService.deleteFiles(filesToDeletes).subscribe(() => {
      this._workspaceService.getFiles().subscribe(files => {
        this.files?.splice(0, this.files.length);
        files[0].files!.forEach(file => this.files!.push(file))
        this.updateAllItems();
        this.filesDeleted.emit(filesToDeletes)
      });
    });
  }

  deleteFile(file: FileExplorerItem): void {
    this._workspaceService.deleteFiles([file].map(file => {
      return {path: file.path};
    })).subscribe(() => {
      this._workspaceService.getFiles().subscribe(files => {
        this.files?.splice(0, this.files.length);
        files[0].files!.forEach(file => this.files!.push(file))
        this.updateAllItems();
        this.filesDeleted.emit([file])
      });
    });
  }

  getFileSelected(files: FileExplorerItem[]): FileExplorerItem[] {
    let filesSelected = files.filter(file => file.selected);

    files.filter(file => !file.selected && file.isDirectory)
      .map(directory => this.getFileSelected(directory.files!))
      .forEach(subfiles => subfiles.forEach(file => filesSelected.push(file)));

    return filesSelected;

  }

  convert(files: FileResponse[], parent: FileExplorerItem | undefined): FileExplorerItem[] {
    return files ? files.map(file => {

      let item: FileExplorerItem = {
        parent: parent,
        name: file.name,
        path: file.path,
        isDirectory: file.isDirectory,
        selected: false
      };
      if (item.isDirectory) {
        item.files = this.convert(file.files!, item);
      }
      return item;
    }) : [];
  }


  onSelectItem(fileExplorerItemSelected: FileExplorerItem): void {
    this.fileExplorerItems?.filter(file => file.path != fileExplorerItemSelected.path).forEach(file => file.selected = false);
    this.hasItemSelected = true;
  }

  onUnselectItem(fileExplorerItemSelected: FileExplorerItem): void {
    this.hasItemSelected = false;
  }
}
