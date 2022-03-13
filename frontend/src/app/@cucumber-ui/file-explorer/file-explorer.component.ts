import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {FileResponse} from "../../api/models/file-response";
import {WorkspaceService} from "../../services/workspace-service";

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
  @Output() filesDeleted = new EventEmitter<FileExplorerItem>();
  @Output() filesUpdated = new EventEmitter<FileExplorerItem>();

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
      let match = this.findFileExplorerItem(itemToUpdate, existingItems);
      if (match && match.isDirectory) {
        this.updateExisting(match.files!, itemToUpdate.files!);
        this.removeNoExisting(match.files!, itemToUpdate.files!);
      } else if (!match) {
        existingItems.push(itemToUpdate);
      }
    });
  }
  
  private findFileExplorerItem(fileToFind: FileExplorerItem, files: FileExplorerItem[]): FileExplorerItem|undefined {
    for(let file of files) {
      if (file.path == fileToFind.path) {
        return file;
      } else if (file.isDirectory && file.path.startsWith(fileToFind.path) && file.files) {
        return this.findFileExplorerItem(fileToFind, file.files);
      }
    }
    return undefined;
  }


  private normalizePathAsUnix(path: String): string {
    return path.replace(/\\/g, "/");
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


  convert(files: FileResponse[], parent: FileExplorerItem | undefined): FileExplorerItem[] {
    return files ? files.map(file => {
      let item: FileExplorerItem = {
        parent: parent,
        name: file.name,
        path: this.normalizePathAsUnix(file.path),
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


  onDeleteEvent(file: FileExplorerItem): void {
    this.filesDeleted.emit(file)
  }

  onUploadEvent(event: FileExplorerItem) {
    this.fileUploaded.emit(event);
  }

  onUpdateEvent(event: FileExplorerItem) {
    this.filesUpdated.emit(event);
  }
}
