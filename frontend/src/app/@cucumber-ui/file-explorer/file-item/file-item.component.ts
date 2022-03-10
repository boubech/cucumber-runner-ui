import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileExplorerItem} from "../file-explorer.component";

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.css']
})
export class FileItemComponent implements OnInit {

  @Input() file: FileExplorerItem | undefined;
  @Output() onSelected = new EventEmitter<FileExplorerItem>();
  @Output() onUnselected = new EventEmitter<FileExplorerItem>();
  @Output() onDelete = new EventEmitter<FileExplorerItem>();

  hideDirectoryContent: boolean = true;
  isFocused: boolean = false;
  isSelected: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  showOrHideDirectoryContent() {
    this.hideDirectoryContent = !this.hideDirectoryContent;
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

  onSelectItem(fileExplorerItemSelected: FileExplorerItem) : void {
    this.file!.selected = false;
    this.file?.files?.filter(file => file.path != fileExplorerItemSelected.path)
                     .forEach(file => file.selected = false);
    this.onSelected.emit(fileExplorerItemSelected);
  }



  onUnselectItem(fileExplorerItemSelected: FileExplorerItem) : void {
    this.onUnselected.emit(fileExplorerItemSelected);
  }

  recursiveSelect(file: FileExplorerItem, selected: boolean): void {
    file.selected = selected;
    let self = this;
    if (file.isDirectory) {
      file.files?.forEach(subfile => self.recursiveSelect(subfile, selected));
    }
  }

  delete(file: FileExplorerItem) {
    this.onDelete.emit(file)
  }
}
