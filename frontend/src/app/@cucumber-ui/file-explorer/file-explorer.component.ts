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
  isRoot: boolean;
  showContent: boolean;
}

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent {

  @Input() files: FileResponse[] | undefined;
  @Output() fileUploaded = new EventEmitter<FileExplorerItem>();
  @Output() filesDeleted = new EventEmitter<FileToDeleteRequest[]>();

  fileExplorerItems: FileExplorerItem[] = [];

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
    existingItems.forEach(existing => {
      if (!updatedItems.find(i => i.path == existing.path)) {
        toRemove.push(existing);
      }
    });
    toRemove.forEach(i => existingItems.splice(existingItems.indexOf(i), 1))
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

  convert(files: FileResponse[], parent: FileExplorerItem | undefined): FileExplorerItem[] {
    return files ? files.map(file => {
      let item: FileExplorerItem = {
        parent: parent,
        name: file.name,
        path: file.path,
        isDirectory: file.isDirectory,
        selected: false,
        isRoot: parent == undefined,
        showContent: parent == undefined
      };
      if (item.isDirectory) {
        item.files = this.convert(file.files!, item);
      }
      return item;
    }) : [];
  }

  uploadFile(event: FileExplorerItem) {
    console.log(event)
    this.fileUploaded.emit(event);
  }
}
